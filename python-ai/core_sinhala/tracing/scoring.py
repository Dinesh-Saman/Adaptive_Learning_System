"""
scoring.py
Multi-criteria Weighted Scoring Engine for Sinhala Tracing Assessment:
T = 0.35 * P + 0.25 * S + 0.20 * C + 0.10 * L + 0.10 * B

Passing Rule:
Tracing Correct iff T >= TRACING_PASS_THRESHOLD (default 85%) AND all required components >= MIN_COMPONENT_THRESHOLD (70%)
"""

from typing import Dict, Any, List

# ── Configurable Research Parameters ──
TRACING_PASS_THRESHOLD = 85.0
MIN_COMPONENT_THRESHOLD = 70.0

DEFAULT_WEIGHTS = {
    "path_adherence": 0.35,      # P
    "shape_similarity": 0.25,    # S
    "completeness": 0.20,        # C
    "line_alignment": 0.10,      # L
    "boundary_accuracy": 0.10    # B
}

class TracingScorer:
    def __init__(
        self,
        pass_threshold: float = TRACING_PASS_THRESHOLD,
        min_comp_threshold: float = MIN_COMPONENT_THRESHOLD,
        weights: Dict[str, float] = None
    ):
        self.pass_threshold = pass_threshold
        self.min_comp_threshold = min_comp_threshold
        self.weights = weights or DEFAULT_WEIGHTS

    def calculate_composite_score(
        self,
        P: float,
        S: float,
        C: float,
        L: float,
        B: float,
        weakest_component_pass: bool = True
    ) -> Dict[str, Any]:
        """
        Calculates the weighted composite score T (0 - 100) and pass/fail status.
        """
        w_P = self.weights.get("path_adherence", 0.35)
        w_S = self.weights.get("shape_similarity", 0.25)
        w_C = self.weights.get("completeness", 0.20)
        w_L = self.weights.get("line_alignment", 0.10)
        w_B = self.weights.get("boundary_accuracy", 0.10)

        # Normalize weights to sum to 1.0
        total_w = w_P + w_S + w_C + w_L + w_B
        if total_w > 0:
            w_P, w_S, w_C, w_L, w_B = w_P/total_w, w_S/total_w, w_C/total_w, w_L/total_w, w_B/total_w

        composite_T = (w_P * P) + (w_S * S) + (w_C * C) + (w_L * L) + (w_B * B)
        composite_T = max(0.0, min(100.0, composite_T))

        # Dual condition: score meets threshold AND no required sub-component is severely incomplete
        is_passed = (composite_T >= self.pass_threshold) and weakest_component_pass

        # Identify primary weak component if failed
        weak_component = None
        if not is_passed:
            metrics = {
                "path_adherence": P,
                "shape_similarity": S,
                "completeness": C,
                "line_alignment": L,
                "boundary_accuracy": B
            }
            if not weakest_component_pass:
                weak_component = "incomplete_component"
            else:
                weak_component = min(metrics, key=metrics.get)

        return {
            "overall_score": round(composite_T, 2),
            "passed": bool(is_passed),
            "pass_threshold": self.pass_threshold,
            "weak_component": weak_component,
            "weights_used": {
                "P": round(w_P, 2),
                "S": round(w_S, 2),
                "C": round(w_C, 2),
                "L": round(w_L, 2),
                "B": round(w_B, 2)
            }
        }
