"""
tracing_engine.py
Main Sinhala Tracing Assessment Engine orchestrating the complete evaluation pipeline:
- Stroke Capture & Preprocessing
- 4-Line Writing Guide Alignment Analysis (L)
- Geometric Path & Corridor Adherence Analysis (P)
- Contour & Bounding Shape Similarity Analysis (S)
- Target Coverage & Weakest-Component Completeness Analysis (C)
- Spatial Centering & Boundary Accuracy Analysis (B)
- Multi-criteria Weighted Deterministic Scoring (T = 0.35P + 0.25S + 0.20C + 0.10L + 0.10B)
"""

from typing import List, Dict, Any, Optional
import numpy as np

from .template import get_template, SINHALA_LETTER_DB, PILLAMA_DB
from .guide_line_detector import GuideLineDetector
from .path_analyzer import PathAnalyzer
from .shape_analyzer import ShapeAnalyzer
from .completeness import CompletenessAnalyzer
from .word_analyzer import WordAnalyzer
from .scoring import TracingScorer, TRACING_PASS_THRESHOLD, MIN_COMPONENT_THRESHOLD

class SinhalaTracingEngine:
    def __init__(
        self,
        pass_threshold: float = TRACING_PASS_THRESHOLD,
        min_comp_threshold: float = MIN_COMPONENT_THRESHOLD
    ):
        self.pass_threshold = pass_threshold
        self.guide_detector = GuideLineDetector()
        self.path_analyzer = PathAnalyzer()
        self.shape_analyzer = ShapeAnalyzer()
        self.completeness_analyzer = CompletenessAnalyzer(min_component_threshold=min_comp_threshold)
        self.word_analyzer = WordAnalyzer()
        self.scorer = TracingScorer(pass_threshold=pass_threshold, min_comp_threshold=min_comp_threshold)

    def evaluate(
        self,
        student_strokes: List[List[Dict[str, Any]]],
        target_text: str,
        template_id: Optional[str] = None,
        canvas_width: int = 400,
        canvas_height: int = 240,
        custom_threshold: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Evaluates student handwriting strokes against the target Sinhala template.
        """
        # 1. Fetch or synthesize template metadata
        template = get_template(target_text, template_id)

        # 2. Extract reference points along target path
        ref_points, component_ranges = self.word_analyzer.generate_reference_points_from_text(
            target_text, canvas_width=canvas_width, canvas_height=canvas_height
        )

        # Handle empty strokes case
        if not student_strokes or len(student_strokes) == 0:
            return {
                "overall_score": 0.0,
                "passed": False,
                "pass_threshold": custom_threshold or self.pass_threshold,
                "target_text": target_text,
                "template_id": template.get("template_id"),
                "path_adherence": 0.0,
                "shape_similarity": 0.0,
                "completeness": 0.0,
                "line_alignment": 0.0,
                "boundary_accuracy": 0.0,
                "components": [],
                "weak_component": "no_strokes",
                "feedback": "අකුර හෝ වචනය ලියා නොමැත (No strokes drawn)."
            }

        # 3. Path Adherence Analysis (P)
        path_res = self.path_analyzer.evaluate_path_adherence(
            student_strokes, ref_points, template_width=float(canvas_width)
        )
        P = path_res["path_adherence_score"]

        # 4. Shape & Boundary Analysis (S, B)
        shape_res = self.shape_analyzer.evaluate_shape_and_boundary(
            student_strokes, ref_points
        )
        S = shape_res["shape_similarity_score"]
        B = shape_res["boundary_accuracy_score"]

        # 5. Completeness & Weakest-Component Analysis (C)
        comp_res = self.completeness_analyzer.evaluate_completeness(
            student_strokes, ref_points, template_width=float(canvas_width), component_ranges=component_ranges
        )
        C = comp_res["completeness_score"]
        weakest_comp_pass = comp_res["weakest_component_pass"]

        # 6. Writing Guide Line Alignment Analysis (L)
        line_res = self.guide_detector.evaluate_line_alignment(
            student_strokes, template
        )
        L = line_res["line_alignment_score"]

        # 7. Composite Scoring
        scorer = self.scorer
        if custom_threshold is not None:
            scorer = TracingScorer(pass_threshold=custom_threshold, min_comp_threshold=self.scorer.min_comp_threshold)

        score_res = scorer.calculate_composite_score(P, S, C, L, B, weakest_component_pass=weakest_comp_pass)

        # 8. Sinhala Diagnostics Feedback
        feedback_lines = []
        if score_res["passed"]:
            feedback_lines.append("✓ Tracing completed correctly! (අකුරු ලිවීම නිවැරදියි ⭐)")
        else:
            feedback_lines.append(f"❌ Tracing Score: {score_res['overall_score']}% (< {score_res['pass_threshold']}%)")
            if not weakest_comp_pass:
                feedback_lines.append("• සමහර අක්ෂර කොටස් අසම්පූර්ණයි (Incomplete component)")
            if P < 85:
                feedback_lines.append("• ඉර මත හරියටම ලිවීම අවශ්‍යයි (Improve path adherence)")
            if L < 80:
                feedback_lines.append("• රූල් අතර නිවැරදිව තැබීම (Guide-line alignment)")
            if S < 80:
                feedback_lines.append("• අක්ෂරයේ හැඩය නිවැරදිව ගැනීම (Shape similarity)")

        return {
            "overall_score": score_res["overall_score"],
            "passed": score_res["passed"],
            "pass_threshold": score_res["pass_threshold"],
            "target_text": target_text,
            "template_id": template.get("template_id"),
            "path_adherence": P,
            "shape_similarity": S,
            "completeness": C,
            "line_alignment": L,
            "boundary_accuracy": B,
            "components": comp_res["component_completeness"],
            "weak_component": score_res["weak_component"],
            "feedback": " ".join(feedback_lines),
            "diagnostics": {
                "corridor_compliance_pct": path_res["corridor_compliance_pct"],
                "avg_deviation_px": path_res["avg_deviation_px"],
                "baseline_alignment": line_res["baseline_alignment"],
                "height_alignment": line_res["height_alignment"],
                "aspect_ratio_match": shape_res["aspect_ratio_match"]
            }
        }

# Singleton instance
sinhala_tracing_engine = SinhalaTracingEngine()
