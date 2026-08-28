"""
path_analyzer.py
Path Adherence and Corridor Analysis for Sinhala Handwriting Tracing:
- Nearest-neighbor distance mapping (student point -> reference path)
- Dynamic corridor tolerance (relative to template scale)
- Deviation penalty and path adherence scoring (P)
"""

from typing import List, Dict, Any, Tuple
import numpy as np

class PathAnalyzer:
    def __init__(self, base_tolerance_ratio: float = 0.045):
        """
        base_tolerance_ratio: relative corridor radius as fraction of canvas/template width (default ~4.5%)
        """
        self.base_tolerance_ratio = base_tolerance_ratio

    def evaluate_path_adherence(
        self,
        student_strokes: List[List[Dict[str, Any]]],
        reference_points: np.ndarray,
        template_width: float = 320.0
    ) -> Dict[str, Any]:
        """
        Computes Path Adherence (P):
        1. For each student point, find min Euclidean distance to reference points.
        2. Dynamic tolerance = template_width * base_tolerance_ratio.
        3. Points within tolerance = 100% adherence; points beyond suffer graduated distance decay.
        """
        if not student_strokes or len(reference_points) == 0:
            return {"path_adherence_score": 0.0, "corridor_compliance_pct": 0.0, "avg_deviation_px": 999.0}

        all_points = []
        for stroke in student_strokes:
            for pt in stroke:
                x = pt.get("x", pt.get("X", 0))
                y = pt.get("y", pt.get("Y", 0))
                all_points.append([x, y])

        if not all_points:
            return {"path_adherence_score": 0.0, "corridor_compliance_pct": 0.0, "avg_deviation_px": 999.0}

        student_arr = np.array(all_points, dtype=np.float32)  # (N, 2)
        ref_arr = np.array(reference_points, dtype=np.float32)  # (M, 2)

        # Compute pairwise distance matrix (N, M) efficiently
        # dist_sq = (x_s - x_r)^2 + (y_s - y_r)^2
        diff = student_arr[:, np.newaxis, :] - ref_arr[np.newaxis, :, :]  # (N, M, 2)
        dist_sq = np.sum(diff ** 2, axis=2)  # (N, M)
        min_distances = np.sqrt(np.min(dist_sq, axis=1))  # (N,)

        corridor_radius = max(8.0, template_width * self.base_tolerance_ratio)
        
        # Classification
        in_corridor_mask = min_distances <= corridor_radius
        corridor_compliance_pct = (np.sum(in_corridor_mask) / len(min_distances)) * 100.0
        
        # Graduated scoring:
        # Distance <= corridor_radius: 100
        # Distance between corridor_radius and 2.5 * corridor_radius: linear drop from 100 to 20
        # Distance > 2.5 * corridor_radius: drops to 0
        point_scores = np.where(
            min_distances <= corridor_radius,
            100.0,
            np.maximum(0.0, 100.0 - ((min_distances - corridor_radius) / (1.5 * corridor_radius)) * 80.0)
        )

        avg_deviation_px = float(np.mean(min_distances))
        P = float(np.clip(np.mean(point_scores), 0.0, 100.0))

        return {
            "path_adherence_score": round(P, 2),
            "corridor_compliance_pct": round(float(corridor_compliance_pct), 2),
            "avg_deviation_px": round(avg_deviation_px, 2),
            "corridor_radius_px": round(corridor_radius, 2)
        }
