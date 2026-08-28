"""
completeness.py
Completeness and Weakest-Component Evaluation:
- Target path coverage calculation
- Component-level completeness evaluation
- Weakest-component gating rule (prevent passing if any sub-element is incomplete)
"""

from typing import List, Dict, Any, Tuple
import numpy as np

class CompletenessAnalyzer:
    def __init__(self, coverage_radius_ratio: float = 0.055, min_component_threshold: float = 70.0):
        self.coverage_radius_ratio = coverage_radius_ratio
        self.min_component_threshold = min_component_threshold

    def evaluate_completeness(
        self,
        student_strokes: List[List[Dict[str, Any]]],
        reference_points: np.ndarray,
        template_width: float = 320.0,
        component_ranges: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Calculates Completeness (C):
        Fraction of reference template points that have at least one student point within coverage_radius.
        """
        if not student_strokes or len(reference_points) == 0:
            return {
                "completeness_score": 0.0,
                "covered_points_pct": 0.0,
                "is_complete": False,
                "component_completeness": [],
                "weakest_component_pass": False
            }

        all_points = []
        for stroke in student_strokes:
            for pt in stroke:
                x = pt.get("x", pt.get("X", 0))
                y = pt.get("y", pt.get("Y", 0))
                all_points.append([x, y])

        if not all_points:
            return {
                "completeness_score": 0.0,
                "covered_points_pct": 0.0,
                "is_complete": False,
                "component_completeness": [],
                "weakest_component_pass": False
            }

        student_arr = np.array(all_points, dtype=np.float32)  # (N, 2)
        ref_arr = np.array(reference_points, dtype=np.float32)  # (M, 2)

        coverage_radius = max(10.0, template_width * self.coverage_radius_ratio)

        # For each reference point, check if any student point is within coverage_radius
        # diff: (M, N, 2)
        diff = ref_arr[:, np.newaxis, :] - student_arr[np.newaxis, :, :]
        dist_sq = np.sum(diff ** 2, axis=2)
        min_ref_dists = np.sqrt(np.min(dist_sq, axis=1))  # (M,)

        covered_mask = min_ref_dists <= coverage_radius
        total_covered_pct = (np.sum(covered_mask) / len(min_ref_dists)) * 100.0

        # Component breakdown and Weakest-Component rule
        component_results = []
        weakest_component_pass = True
        min_comp_score = 100.0

        if component_ranges and len(component_ranges) > 0:
            for comp in component_ranges:
                start_idx = comp.get("start_idx", 0)
                end_idx = comp.get("end_idx", len(ref_arr))
                comp_mask = covered_mask[start_idx:end_idx]
                if len(comp_mask) > 0:
                    comp_cov = (np.sum(comp_mask) / len(comp_mask)) * 100.0
                else:
                    comp_cov = 0.0
                
                is_comp_pass = comp_cov >= self.min_component_threshold
                if not is_comp_pass:
                    weakest_component_pass = False
                min_comp_score = min(min_comp_score, comp_cov)

                component_results.append({
                    "text": comp.get("text", ""),
                    "type": comp.get("type", "letter"),
                    "completeness": round(float(comp_cov), 2),
                    "passed": bool(is_comp_pass)
                })
        else:
            weakest_component_pass = total_covered_pct >= self.min_component_threshold
            min_comp_score = total_covered_pct

        C = float(np.clip(total_covered_pct, 0.0, 100.0))

        return {
            "completeness_score": round(C, 2),
            "covered_points_pct": round(float(total_covered_pct), 2),
            "is_complete": bool(total_covered_pct >= 85.0),
            "component_completeness": component_results,
            "min_component_score": round(float(min_comp_score), 2),
            "weakest_component_pass": bool(weakest_component_pass)
        }
