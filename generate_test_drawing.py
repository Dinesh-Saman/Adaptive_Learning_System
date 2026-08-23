from PIL import Image, ImageDraw
import random

# Load the original apple image
img = Image.open('frontend/public/assets/apple.png')

# The left half is the outline
margin = 25
half_width = img.width // 2
crop_box = (margin, margin, half_width - margin, img.height - margin)

outline = img.crop(crop_box).convert('RGBA')

# Create a drawing context
draw = ImageDraw.Draw(outline)

# Draw some messy red scribbles in the lower center (apple body)
w, h = outline.size
center_x = w // 2
center_y = h // 2 + 50

for _ in range(80):
    # Random red colors (like pastels)
    r = random.randint(200, 255)
    g = random.randint(30, 80)
    b = random.randint(30, 80)
    
    x = center_x + random.randint(-150, 150)
    y = center_y + random.randint(-150, 150)
    
    # draw thick messy lines
    draw.line(
        (x, y, x + random.randint(-40, 40), y + random.randint(-40, 40)),
        fill=(r, g, b, 200),
        width=random.randint(15, 30)
    )

# Draw some messy green scribbles in the upper left (leaves)
leaf_x = w // 2 - 50
leaf_y = h // 2 - 120

for _ in range(30):
    r = random.randint(20, 80)
    g = random.randint(150, 220)
    b = random.randint(20, 80)
    
    x = leaf_x + random.randint(-80, 80)
    y = leaf_y + random.randint(-50, 50)
    
    draw.line(
        (x, y, x + random.randint(-30, 30), y + random.randint(-30, 30)),
        fill=(r, g, b, 200),
        width=random.randint(10, 25)
    )

# Save the test image to artifacts directory so I can display it!
import os
artifact_dir = r"C:\Users\Dinesh\.gemini\antigravity\brain\5aa792a8-efdf-456b-a000-dc9db7c2fada\scratch"
os.makedirs(artifact_dir, exist_ok=True)
outline.save(os.path.join(artifact_dir, 'kids_apple_test.png'))
print("Saved to " + os.path.join(artifact_dir, 'kids_apple_test.png'))
