"""
guide_line_detector.py
Detection, Normalization and Line-Alignment Evaluation based on 3-Line Primary Ruled Writing Guides (තුන් රූල්):
- Line 1: Upper Guide Line (Top arch / boundary)
- Line 2: Middle Guide Line (Waistline)
- Line 3: Baseline (Sitting line)
"""

from typing import List, Dict, Any, Tuple
import numpy as np

class GuideLineDetector:
    def __init__(self, canvas_height: float = 240.0, canvas_width: float = 400.0):
        self.canvas_height = canvas_height
        self.canvas_width = canvas_width
        
        # 3-Line Standard Equal-Spacing Proportions (තුන් රූල්):
        # Line 1 (Top Line): 16%
        # Line 2 (Middle Line): 50%
        # Line 3 (Baseline): 84%
        self.y_top = canvas_height * 0.16
        self.y_middle = canvas_height * 0.50
        self.y_baseline = canvas_height * 0.84

    def evaluate_line_alignment(
        self,
        student_strokes: List[List[Dict[str, Any]]],
        template_info: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Evaluates student writing relative to the 3 horizontal guide lines:
        - Baseline alignment (sitting on baseline)
        - Height / vertical distribution
        - Upper boundary compliance (not exceeding top line)
        - Lower boundary compliance (not dropping below baseline)
        """
        if not student_strokes:
            return {"line_alignment_score": 0.0, "baseline_alignment": 0.0, "height_alignment": 0.0, "boundary_compliance": 0.0}

        all_points = [pt for stroke in student_strokes for pt in stroke]
        if not all_points:
            return {"line_alignment_score": 0.0, "baseline_alignment": 0.0, "height_alignment": 0.0, "boundary_compliance": 0.0}

        y_coords = np.array([pt.get("y", pt.get("Y", 0)) for pt in all_points])
        
        min_y = np.min(y_coords)
        max_y = np.max(y_coords)
        
        expected_top = self.y_top
        expected_bottom = self.y_baseline
        
        # 1. Baseline Alignment (Does character sit near baseline?)
        sorted_y = np.sort(y_coords)
        body_bottom_sample = np.mean(sorted_y[-int(max(3, len(sorted_y) * 0.15)):])
        
        bottom_diff = abs(body_bottom_sample - expected_bottom)
        line_spacing = self.y_baseline - self.y_middle
        baseline_score = max(0.0, 100.0 - (bottom_diff / (line_spacing * 0.40)) * 100.0)
        
        # 2. Height Alignment (Spanning between top line and baseline)
        actual_height = max_y - min_y
        expected_height = expected_bottom - expected_top
        height_ratio = actual_height / max(1.0, expected_height)
        if height_ratio > 1.0:
            height_score = max(0.0, 100.0 - (height_ratio - 1.0) * 80.0)
        else:
            height_score = max(0.0, height_ratio * 100.0)
            
        # 3. Boundary Compliance
        top_violation = max(0.0, self.y_top - min_y)
        bottom_violation = max(0.0, max_y - (self.y_baseline + 10))
        total_violation = top_violation + bottom_violation
        boundary_compliance = max(0.0, 100.0 - (total_violation / (line_spacing * 0.30)) * 100.0)
        
        # Composite L (0 - 100)
        L = float(np.clip(0.40 * baseline_score + 0.35 * height_score + 0.25 * boundary_compliance, 0.0, 100.0))
        
        return {
            "line_alignment_score": round(L, 2),
            "baseline_alignment": round(baseline_score, 2),
            "height_alignment": round(height_score, 2),
            "boundary_compliance": round(boundary_compliance, 2)
        }
