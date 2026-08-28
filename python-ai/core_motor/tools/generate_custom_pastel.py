from PIL import Image, ImageDraw
import random

# Load the user's uploaded image
img_path = r"C:\Users\Dinesh\.gemini\antigravity\brain\5aa792a8-efdf-456b-a000-dc9db7c2fada\.user_uploaded\media_1787224335602.png"
img = Image.open(img_path).convert('RGBA')
pixels = img.load()

# 1. Convert it into a blank outline (make all colored pixels white, keep black lines)
for y in range(img.height):
    for x in range(img.width):
        r, g, b, a = pixels[x, y]
        # If it's dark, it's a line. Otherwise, make it white.
        if r < 100 and g < 100 and b < 100:
            pixels[x, y] = (0, 0, 0, 255)
        else:
            pixels[x, y] = (255, 255, 255, 255)

# 2. Draw messy pastel scribbles
draw = ImageDraw.Draw(img)

w, h = img.size
center_x = w // 2
center_y = h // 2 + 30

# Apple body (Red)
for _ in range(100):
    r = random.randint(200, 255)
    g = random.randint(30, 80)
    b = random.randint(30, 80)
    
    x = center_x + random.randint(-120, 120)
    y = center_y + random.randint(-120, 120)
    
    draw.line(
        (x, y, x + random.randint(-50, 50), y + random.randint(-50, 50)),
        fill=(r, g, b, 180),
        width=random.randint(15, 30)
    )

# Leaves (Green)
leaf_x = w // 2 - 30
leaf_y = h // 2 - 100

for _ in range(40):
    r = random.randint(20, 80)
    g = random.randint(150, 220)
    b = random.randint(20, 80)
    
    x = leaf_x + random.randint(-70, 70)
    y = leaf_y + random.randint(-40, 40)
    
    draw.line(
        (x, y, x + random.randint(-40, 40), y + random.randint(-40, 40)),
        fill=(r, g, b, 180),
        width=random.randint(10, 25)
    )

# Save the test image to artifacts directory
import os
artifact_dir = r"C:\Users\Dinesh\.gemini\antigravity\brain\5aa792a8-efdf-456b-a000-dc9db7c2fada\scratch"
os.makedirs(artifact_dir, exist_ok=True)
save_path = os.path.join(artifact_dir, 'custom_messy_apple.png')
img.save(save_path)
print("Saved to " + save_path)
