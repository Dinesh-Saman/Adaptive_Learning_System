"""
Self-test: verifies the Dice evaluator correctly scores correct vs wrong drawings.
Run from: D:\Kids\python-ai\core_handwriting\
"""
import sys, os
sys.path.insert(0, '..')
sys.stdout.reconfigure(encoding='utf-8')

import numpy as np
from PIL import Image, ImageDraw
import base64, io
from template_matcher import evaluate_handwriting

def arr_to_b64(arr_ink1_bg0: np.ndarray) -> str:
    """Convert ink=1,bg=0 array back to white-background PNG base64."""
    uint8 = ((1.0 - arr_ink1_bg0) * 255).astype(np.uint8)
    buf = io.BytesIO()
    Image.fromarray(uint8).save(buf, format='PNG')
    return base64.b64encode(buf.getvalue()).decode()

# ── Build a fake "reference" letter: simulate what browser renders for '\u0d9a' ──
def make_reference_letter(size=128):
    """
    Fake reference simulating a complex Sinhala letter structure:
    - Top horizontal hook
    - Vertical stroke down the left
    - Curved bottom
    - Small hook on the right
    Distinctly NOT a circle.
    """
    img = Image.new('L', (size, size), 255)
    d = ImageDraw.Draw(img)
    # Top hook (horizontal bar with curl, like ක's top)
    d.line([25, 25, 85, 25], fill=0, width=8)
    d.arc([65, 15, 95, 45], start=270, end=90, fill=0, width=8)
    # Left vertical stroke
    d.line([25, 25, 25, 95], fill=0, width=8)
    # Bottom curve
    d.arc([20, 75, 90, 120], start=0, end=180, fill=0, width=8)
    # Right hook curl
    d.arc([75, 55, 110, 95], start=270, end=180, fill=0, width=8)
    arr = 1.0 - np.array(img, dtype=np.float32) / 255.0
    return arr


# ── Build different types of student drawings ──
def make_straight_line(size=(128, 128)):
    img = Image.new('L', size, 255)
    d = ImageDraw.Draw(img)
    d.line([10, 64, size[0]-10, 90], fill=0, width=8)
    arr = 1.0 - np.array(img, dtype=np.float32) / 255.0
    return arr

def make_circle(size=(128, 128)):
    img = Image.new('L', size, 255)
    d = ImageDraw.Draw(img)
    d.ellipse([20, 20, 108, 108], outline=0, width=8)
    arr = 1.0 - np.array(img, dtype=np.float32) / 255.0
    return arr

def make_correct_copy(reference):
    """'Correct' drawing: add slight noise to the reference (simulates careful drawing)."""
    noise = np.random.normal(0, 0.05, reference.shape)
    noisy = np.clip(reference + noise, 0, 1)
    return noisy

ref_arr  = make_reference_letter()
ref_b64  = arr_to_b64(ref_arr)
letter   = '\u0d9a'  # ක

cases = [
    ("PERFECT (reference itself)",    arr_to_b64(ref_arr)),
    ("GOOD (noisy copy of reference)",arr_to_b64(make_correct_copy(ref_arr))),
    ("WRONG (straight line)",         arr_to_b64(make_straight_line())),
    ("WRONG (simple circle)",         arr_to_b64(make_circle())),
]

print("=" * 65)
print(f"{'Test':<40} {'Score':>7}  {'Quality'}")
print("=" * 65)
for name, drawn_b64 in cases:
    result = evaluate_handwriting(drawn_b64, ref_b64, letter)
    print(f"{name:<40} {result['accuracy_score']:>7.1f}  {result['quality']}")
print("=" * 65)
print("\nExpected: PERFECT=high, GOOD=high, LINE=low, CIRCLE=low")
