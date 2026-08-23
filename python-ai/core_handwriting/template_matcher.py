"""
Sinhala Handwriting Evaluator — Bidirectional Chamfer Distance

How it works:
1. Decode both images, crop+resize to 64x64 (removes blank borders)
2. Compute bidirectional Chamfer distance:
   - Student→Reference: avg distance from each student ink pixel to nearest reference ink pixel
   - Reference→Student: avg distance from each reference ink pixel to nearest student ink pixel
   - Combined: max(s→r, r→s)  ← penalises BOTH wrong strokes AND missing strokes
3. Normalise distance to a 0-100 score

Why this works where SSIM and Dice failed:
- A straight line has pixels FAR from ක's curved strokes → high distance → low score ✓
- A circle covers only PART of க's strokes (misses hooks) → high r→s distance → low score ✓
- A correct க drawing has pixels NEAR reference strokes → low distance → high score ✓

Distance transform: scipy.ndimage.distance_transform_edt gives the exact Euclidean
distance from each background pixel to the nearest foreground pixel.
"""

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt
import base64, io
import torch
import cv2
import os

NORM_SIZE = 64     # normalise both images to this
THRESHOLD = 0.30   # ink threshold
MAX_DIST  = 12.0   # distance (px on 64x64) that maps to score=0

# ── CNN Integration ────────────────────────────────────────────────────────
class HandwritingCNN(torch.nn.Module):
    def __init__(self, num_classes=28):
        super(HandwritingCNN, self).__init__()
        self.conv1 = torch.nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.conv2 = torch.nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool = torch.nn.MaxPool2d(2, 2)
        self.fc1 = torch.nn.Linear(64 * 7 * 7, 256)
        self.fc2 = torch.nn.Linear(256, num_classes)
        self.relu = torch.nn.ReLU()
        self.dropout = torch.nn.Dropout(0.4)

    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = x.view(-1, 64 * 7 * 7)
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

CNN_CLASSES = ['ක', 'ග', 'ප', 'ස', 'අ', 'ආ', 'ඇ', 'ඈ', 'ඉ', 'ඊ', 'උ', 'ඌ', 'ඍ', 'එ', 'ඒ', 'ඓ', 'ත', 'ද', 'න', 'ම', 'ර', 'ල', 'ව', 'බ', 'ට', 'හ', 'ඩ', 'ච']
cnn_model = None
try:
    model_path = os.path.join(os.path.dirname(__file__), 'sinhala_custom_cnn.pt')
    if os.path.exists(model_path):
        cnn_model = HandwritingCNN(num_classes=28)
        cnn_model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
        cnn_model.eval()
        print(f"Loaded custom CNN model from {model_path}")
except Exception as e:
    print(f"Warning: Could not load CNN model. Falling back to geometry only. Error: {e}")

def _predict_cnn(arr: np.ndarray) -> tuple[str, float]:
    """Run the array through the CNN and return (predicted_class, confidence)"""
    if cnn_model is None:
        return "", 0.0
        
    # Find bounding box of ink
    binary = arr > THRESHOLD
    rows = np.any(binary, axis=1)
    cols = np.any(binary, axis=0)
    if not rows.any() or not cols.any():
        return "", 0.0
        
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    pad = 10
    h, w = arr.shape
    rmin = max(0, rmin - pad)
    rmax = min(h - 1, rmax + pad)
    cmin = max(0, cmin - pad)
    cmax = min(w - 1, cmax + pad)
    
    crop = arr[rmin:rmax + 1, cmin:cmax + 1]
    
    # Resize to 28x28
    crop_uint8 = (crop * 255).astype(np.uint8)
    pil = Image.fromarray(crop_uint8)
    pil = pil.resize((28, 28), Image.LANCZOS)
    resized = np.array(pil, dtype=np.float32) / 255.0
    
    # DEBUG: Save the tensor image to disk so we can see what the CNN sees
    try:
        debug_img = Image.fromarray((resized * 255).astype(np.uint8))
        debug_img.save("debug_cnn_input.png")
    except:
        pass
    
    # Run model
    with torch.no_grad():
        tensor = torch.tensor(resized).unsqueeze(0).unsqueeze(0) # (1, 1, 28, 28)
        output = cnn_model(tensor)
        probs = torch.nn.functional.softmax(output, dim=1)[0]
        confidence, predicted_idx = torch.max(probs, 0)
        
    return CNN_CLASSES[predicted_idx.item()], confidence.item()


def _decode(b64_str: str) -> np.ndarray | None:
    """base64 PNG → float32 numpy array (ink=1, bg=0)."""
    try:
        img = Image.open(io.BytesIO(base64.b64decode(b64_str))).convert('L')
        arr = 1.0 - np.array(img, dtype=np.float32) / 255.0
        return arr
    except Exception as e:
        print("Decode error:", e)
        return None


def _crop_resize(arr: np.ndarray, size: int = NORM_SIZE, pad: int = 4) -> np.ndarray | None:
    """Crop to ink bounding box + pad, resize to size×size."""
    binary = arr > THRESHOLD
    rows, cols = np.any(binary, axis=1), np.any(binary, axis=0)
    if not rows.any() or not cols.any():
        return None
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    h, w = arr.shape
    rmin, rmax = max(0, rmin - pad), min(h - 1, rmax + pad)
    cmin, cmax = max(0, cmin - pad), min(w - 1, cmax + pad)
    crop = arr[rmin:rmax + 1, cmin:cmax + 1]
    pil = Image.fromarray((crop * 255).astype(np.uint8))
    return np.array(pil.resize((size, size), Image.LANCZOS), dtype=np.float32) / 255.0


def _chamfer(drawn_bin: np.ndarray, ref_bin: np.ndarray) -> float:
    """
    Bidirectional Chamfer distance (pixels).
    = max( mean dist student→ref, mean dist ref→student )
    Lower is better.
    """
    if drawn_bin.sum() == 0 or ref_bin.sum() == 0:
        return MAX_DIST

    # Distance of every pixel to nearest TRUE pixel in each mask
    ref_dist   = distance_transform_edt(~ref_bin)    # dist to nearest ref ink
    drawn_dist = distance_transform_edt(~drawn_bin)  # dist to nearest student ink

    s_to_r = ref_dist[drawn_bin].mean()    # how far student strokes are from ref
    r_to_s = drawn_dist[ref_bin].mean()    # how much of ref is covered by student

    return float(max(s_to_r, r_to_s))


def evaluate_handwriting(drawn_b64: str, reference_b64: str,
                         target_letter: str) -> dict:
    """
    Evaluate student handwriting via bidirectional Chamfer distance.
    Returns quality label, 0-100 score, and feedback string.
    """

    # ── Decode drawn image ────────────────────────────────────────────────
    drawn_full = _decode(drawn_b64)
    if drawn_full is None:
        return {"quality": "Error", "accuracy_score": 0.0,
                "feedback": "Could not read your drawing. Please try again.",
                "recognized": ""}

    if np.sum(drawn_full > THRESHOLD) < 20:
        return {"quality": "Poor", "accuracy_score": 0.0,
                "feedback": "Canvas is blank — draw the letter boldly!",
                "recognized": ""}

    # ── Try CNN Classification first ──────────────────────────────────────
    if cnn_model is not None and target_letter in CNN_CLASSES:
        pred_class, conf = _predict_cnn(drawn_full)
        if conf > 0:
            if pred_class == target_letter:
                score = round(conf * 100, 1)
                if score >= 60:
                    return {
                        "quality": "Excellent",
                        "accuracy_score": score,
                        "feedback": f"Perfect! The AI recognized your '{target_letter}' clearly with {score}% confidence.",
                        "recognized": pred_class
                    }
                else:
                    return {
                        "quality": "Good",
                        "accuracy_score": score,
                        "feedback": f"Good! It looks like '{target_letter}', but try to make the strokes clearer.",
                        "recognized": pred_class
                    }
            else:
                # Model thinks it's a different letter!
                return {
                    "quality": "Poor",
                    "accuracy_score": max(5.0, 50.0 * (1.0 - conf)), # Give low score
                    "feedback": f"Oops! You drew a '{pred_class}'. Please write '{target_letter}'.",
                    "recognized": pred_class
                }

    # ── Fallback to Chamfer distance for other letters ────────────────────
    # Decode reference
    ref_full = _decode(reference_b64) if reference_b64 else None

    if ref_full is None or np.sum(ref_full > THRESHOLD) < 20:
        return {"quality": "Good", "accuracy_score": 50.0,
                "feedback": (f"Could not load reference for '{target_letter}'. "
                             "Please reload and try again."),
                "recognized": ""}

    # ── Crop + resize to 64×64 ────────────────────────────────────────────
    drawn_n = _crop_resize(drawn_full)
    ref_n   = _crop_resize(ref_full)

    if drawn_n is None or ref_n is None:
        return {"quality": "Poor", "accuracy_score": 5.0,
                "feedback": "Drawing too faint. Please draw bolder!",
                "recognized": ""}

    drawn_bin = drawn_n > THRESHOLD
    ref_bin   = ref_n   > THRESHOLD

    # ── Bidirectional Chamfer distance ────────────────────────────────────
    dist  = _chamfer(drawn_bin, ref_bin)

    # Map: dist=0 → score=100, dist≥MAX_DIST → score=0
    score = round(max(0.0, (1.0 - dist / MAX_DIST)) * 100, 1)

    # ── Classify ──────────────────────────────────────────────────────────
    if score >= 55:
        quality  = "Excellent"
        feedback = (f"Excellent! Your '{target_letter}' is very close to the "
                    f"correct form. Great stroke placement!")
    elif score >= 35:
        quality  = "Good"
        feedback = (f"Good effort on '{target_letter}'! The shape is close, "
                    f"but try to follow the curves more precisely.")
    elif score >= 15:
        quality  = "Poor"
        feedback = (f"Keep practicing '{target_letter}'! Look at the guide letter "
                    f"and trace each stroke carefully.")
    else:
        quality  = "Poor"
        feedback = (f"The drawing doesn't match '{target_letter}'. "
                    f"Follow the faint guide in the corner stroke by stroke.")

    return {
        "quality":        quality,
        "accuracy_score": score,
        "feedback":       feedback,
        "recognized":     ""
    }
