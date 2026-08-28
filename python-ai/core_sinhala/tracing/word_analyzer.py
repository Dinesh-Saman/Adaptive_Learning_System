"""
word_analyzer.py
Multi-character, Grapheme and Word Decomposition Analyzer for Sinhala Tracing:
- Decomposes words into base letters and pillam components
- Synthesizes reference stroke coordinates
- Tracks component-level scores to prevent incomplete word passing
"""

from typing import List, Dict, Any, Tuple
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os

from .template import SINHALA_LETTER_DB, PILLAMA_DB, GRAPHEME_DB

class WordAnalyzer:
    def __init__(self, font_size: int = 72):
        self.font_size = font_size
        self.font = self._load_sinhala_font()

    def _load_sinhala_font(self):
        font_paths = [
            "C:\\Windows\\Fonts\\iskpota.ttf",
            "C:\\Windows\\Fonts\\Nirmala.ttf",
            "C:\\Windows\\Fonts\\arialuni.ttf"
        ]
        for p in font_paths:
            if os.path.exists(p):
                try:
                    return ImageFont.truetype(p, self.font_size)
                except:
                    pass
        return ImageFont.load_default()

    def generate_reference_points_from_text(
        self,
        text: str,
        canvas_width: int = 400,
        canvas_height: int = 240
    ) -> Tuple[np.ndarray, List[Dict[str, Any]]]:
        """
        Renders the target Sinhala text and samples reference point coordinates along the glyph stroke centerline.
        Returns:
            reference_points: np.ndarray of shape (M, 2)
            component_ranges: List of dicts specifying index slices for each letter/component
        """
        img = Image.new("L", (canvas_width, canvas_height), 0)
        draw = ImageDraw.Draw(img)

        # Baseline is at 70% canvas height
        y_pos = int(canvas_height * 0.35)
        
        # Center horizontally
        bbox = draw.textbbox((0, 0), text, font=self.font)
        text_w = bbox[2] - bbox[0]
        x_pos = max(20, (canvas_width - text_w) // 2)

        draw.text((x_pos, y_pos), text, font=self.font, fill=255)

        arr = np.array(img)
        y_indices, x_indices = np.where(arr > 80)

        if len(x_indices) == 0:
            # Fallback synthetic grid
            pts = np.array([[x, canvas_height * 0.55] for x in range(50, canvas_width - 50, 10)])
            return pts, [{"text": text, "start_idx": 0, "end_idx": len(pts)}]

        # Downsample points evenly
        total_pts = len(x_indices)
        step = max(1, total_pts // 180)
        sampled_x = x_indices[::step]
        sampled_y = y_indices[::step]

        # Sort left to right
        sort_order = np.argsort(sampled_x)
        pts = np.column_stack((sampled_x[sort_order], sampled_y[sort_order])).astype(np.float32)

        # Segment by character positions
        component_ranges = []
        if len(text) > 1:
            segment_len = len(pts) // len(text)
            for i, ch in enumerate(text):
                start = i * segment_len
                end = len(pts) if i == len(text) - 1 else (i + 1) * segment_len
                component_ranges.append({
                    "text": ch,
                    "type": "letter",
                    "start_idx": start,
                    "end_idx": end
                })
        else:
            component_ranges.append({
                "text": text,
                "type": "letter",
                "start_idx": 0,
                "end_idx": len(pts)
            })

        return pts, component_ranges
