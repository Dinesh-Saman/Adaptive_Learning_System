import sys
sys.path.insert(0, '..')
sys.stdout.reconfigure(encoding='utf-8')

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from template_matcher import render_reference, _ssim, _dilated_overlap, IMG_SIZE

def make_circle(size=IMG_SIZE):
    """Simulate a student drawing just a circle (wrong answer for most letters)."""
    img = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(img)
    draw.ellipse([size//4, size//4, size*3//4, size*3//4], outline=255, width=8)
    return np.array(img, dtype=np.float32) / 255.0

def make_random_scribble(size=IMG_SIZE):
    """Simulate a random scribble."""
    arr = np.zeros((size, size), dtype=np.float32)
    arr[size//3:size*2//3, size//4:size*3//4] = 0.8
    return arr

def make_exact_reference(letter):
    """Use the exact rendered reference as 'perfect' student drawing."""
    return render_reference(letter)

def score(drawn, reference):
    ssim_val = _ssim(drawn, reference)
    overlap_val = _dilated_overlap(drawn, reference)
    coverage = np.sum(drawn > 0.3) / (IMG_SIZE * IMG_SIZE)
    if 0.05 <= coverage <= 0.55:
        ink_bonus = 20
    elif 0.02 <= coverage < 0.05 or 0.55 < coverage <= 0.7:
        ink_bonus = 12
    else:
        ink_bonus = 4
    total = (ssim_val * 50) + (overlap_val * 30) + ink_bonus
    return round(min(total, 100), 1), round(ssim_val, 3), round(overlap_val, 3)

test_letters = ['ක', 'ග', 'ප', 'ස', 'ම']

print("=" * 65)
print(f"{'Test':<35} {'Total':>7} {'SSIM':>7} {'Overlap':>9}")
print("=" * 65)

circle = make_circle()
scribble = make_random_scribble()

for letter in test_letters:
    ref = render_reference(letter)
    
    # Perfect drawing (reference vs itself)
    t, s, o = score(ref, ref)
    print(f"PERFECT  '{letter}' vs itself:           {t:>7.1f} {s:>7.3f} {o:>9.3f}")
    
    # Circle drawing (wrong answer)
    t, s, o = score(circle, ref)
    print(f"CIRCLE   vs '{letter}':                  {t:>7.1f} {s:>7.3f} {o:>9.3f}")
    
    # Wrong letter vs another letter reference
    if letter != 'ස':
        ref2 = render_reference('ස')
        t, s, o = score(ref, ref2)
        print(f"LETTER   '{letter}' vs 'ස' reference:   {t:>7.1f} {s:>7.3f} {o:>9.3f}")
    
    print("-" * 65)
