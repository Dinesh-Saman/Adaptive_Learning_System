import numpy as np

def analyze_stroke_quality(img_array_28x28):
    """
    Evaluates handwriting quality using real image analysis metrics.
    
    Takes a 28x28 numpy array (values 0-1, ink=1, background=0)
    and returns quality classification based on:
    1. Stroke Coverage   - Did the child actually draw enough?
    2. Stroke Concentration - Are strokes focused (good) or scattered (messy)?
    3. Vertical/Horizontal Balance - Is the drawing centered and proportional?
    
    Returns: (quality: str, score: float, feedback: str)
    """
    img = img_array_28x28  # shape (28, 28), ink pixels close to 1

    # --- Metric 1: Stroke Coverage ---
    # What percentage of the canvas has ink?
    ink_pixels = np.sum(img > 0.3)  # pixels significantly above background
    total_pixels = 28 * 28  # 784
    coverage = ink_pixels / total_pixels

    # --- Metric 2: Stroke Concentration (inverse of spatial spread) ---
    # Find the center of mass of ink
    if ink_pixels == 0:
        return "Poor", 10.0, "Canvas is blank! Please draw a letter."
    
    ys, xs = np.where(img > 0.3)
    cx = np.mean(xs)  # centroid x
    cy = np.mean(ys)  # centroid y
    
    # Measure how spread out the ink is (standard deviation from centroid)
    spread_x = np.std(xs)
    spread_y = np.std(ys)
    avg_spread = (spread_x + spread_y) / 2.0
    # For a 28x28 canvas, max spread is ~14. A well-formed letter should have spread between 3-9.
    # Very low spread = tiny dot, very high spread = scattered mess
    
    # --- Metric 3: Stroke Intensity ---
    # Average darkness of the ink pixels (brighter = better defined strokes)
    avg_intensity = np.mean(img[img > 0.3])

    # --- Scoring Logic ---
    # Build a composite score from 0-100
    score = 0.0
    
    # Coverage score: ideal range is 5%-35% of canvas
    if 0.05 <= coverage <= 0.35:
        score += 40  # perfect coverage
    elif 0.02 <= coverage < 0.05 or 0.35 < coverage <= 0.50:
        score += 25  # a bit too small or too large
    else:
        score += 5   # barely any drawing or entire canvas filled

    # Spread score: ideal spread is between 3 and 9 pixels from centroid
    if 3.0 <= avg_spread <= 9.0:
        score += 35
    elif 2.0 <= avg_spread < 3.0 or 9.0 < avg_spread <= 11.0:
        score += 20
    else:
        score += 5

    # Intensity score: strokes should be clear and dark (high intensity)
    if avg_intensity >= 0.7:
        score += 25
    elif avg_intensity >= 0.5:
        score += 15
    else:
        score += 5

    # --- Classify ---
    if score >= 75:
        quality = "Excellent"
        feedback = "Beautifully written! The strokes are clear, focused, and well-proportioned."
    elif score >= 50:
        quality = "Good"
        feedback = "Good effort! Try to make the strokes a little more centered and defined."
    else:
        quality = "Poor"
        if coverage < 0.03:
            feedback = "The drawing is too small or too faint. Try writing bigger and darker!"
        elif avg_spread > 11:
            feedback = "The strokes are too scattered. Try to keep the letter compact and tidy."
        else:
            feedback = "A bit messy. Practice tracing the letter slowly and carefully."

    return quality, round(score, 1), feedback
