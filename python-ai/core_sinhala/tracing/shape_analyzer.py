"""
shape_analyzer.py
Shape Similarity and Boundary/Position Accuracy Analyzer:
- Bounding box aspect ratio comparison
- Contour & density distribution
- Spatial centering & boundary containment (B)
"""

from typing import List, Dict, Any, Tuple
import numpy as np

class ShapeAnalyzer:
    def __init__(self):
        pass

    def evaluate_shape_and_boundary(
        self,
        student_strokes: List[List[Dict[str, Any]]],
        reference_points: np.ndarray
    ) -> Dict[str, Any]:
        """
        Computes Shape Similarity (S) and Boundary Accuracy (B).
        """
        if not student_strokes or len(reference_points) == 0:
            return {
                "shape_similarity_score": 0.0,
                "boundary_accuracy_score": 0.0,
                "aspect_ratio_match": 0.0,
                "centroid_offset_px": 999.0
            }

        all_points = []
        for stroke in student_strokes:
            for pt in stroke:
                x = pt.get("x", pt.get("X", 0))
                y = pt.get("y", pt.get("Y", 0))
                all_points.append([x, y])

        if not all_points:
            return {
                "shape_similarity_score": 0.0,
                "boundary_accuracy_score": 0.0,
                "aspect_ratio_match": 0.0,
                "centroid_offset_px": 999.0
            }

        student_arr = np.array(all_points, dtype=np.float32)
        ref_arr = np.array(reference_points, dtype=np.float32)

        # 1. Bounding Boxes
        min_sx, min_sy = np.min(student_arr, axis=0)
        max_sx, max_sy = np.max(student_arr, axis=0)
        w_s = max(1.0, max_sx - min_sx)
        h_s = max(1.0, max_sy - min_sy)

        min_rx, min_ry = np.min(ref_arr, axis=0)
        max_rx, max_ry = np.max(ref_arr, axis=0)
        w_r = max(1.0, max_rx - min_rx)
        h_r = max(1.0, max_ry - min_ry)

        aspect_s = w_s / h_s
        aspect_r = w_r / h_r
        aspect_ratio_match = min(aspect_s / aspect_r, aspect_r / aspect_s) * 100.0

        # 2. Centroid alignment
        c_s = np.mean(student_arr, axis=0)
        c_r = np.mean(ref_arr, axis=0)
        centroid_offset = np.linalg.norm(c_s - c_r)

        ref_diag = np.sqrt(w_r ** 2 + h_r ** 2)
        centroid_score = max(0.0, 100.0 - (centroid_offset / (ref_diag * 0.25)) * 100.0)

        # 3. Spatial IoU (Bounding Overlap)
        inter_min_x = max(min_sx, min_rx)
        inter_min_y = max(min_sy, min_ry)
        inter_max_x = min(max_sx, max_rx)
        inter_max_y = min(max_sy, max_ry)

        inter_w = max(0.0, inter_max_x - inter_min_x)
        inter_h = max(0.0, inter_max_y - inter_min_y)
        inter_area = inter_w * inter_h

        union_area = (w_s * h_s) + (w_r * h_r) - inter_area
        iou = (inter_area / max(1.0, union_area)) * 100.0

        # Composite S (Shape Similarity) & B (Boundary Accuracy)
        S = float(np.clip(0.60 * aspect_ratio_match + 0.40 * iou, 0.0, 100.0))
        B = float(np.clip(0.50 * centroid_score + 0.50 * iou, 0.0, 100.0))

        return {
            "shape_similarity_score": round(S, 2),
            "boundary_accuracy_score": round(B, 2),
            "aspect_ratio_match": round(float(aspect_ratio_match), 2),
            "centroid_offset_px": round(float(centroid_offset), 2),
            "bounding_iou_pct": round(float(iou), 2)
        }
