import cv2
import numpy as np
from PIL import Image

def get_sample(file_name, target_idx, out_name):
    image_path = rf"C:\Users\Dinesh\.gemini\antigravity\brain\5aa792a8-efdf-456b-a000-dc9db7c2fada\.user_uploaded\{file_name}"
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY_INV, 21, 15)
    kernel = np.ones((3,3), np.uint8)
    thresh = cv2.dilate(thresh, kernel, iterations=1)

    margin = 50
    thresh[0:margin, :] = 0
    thresh[-margin:, :] = 0
    thresh[:, 0:margin] = 0
    thresh[:, -margin:] = 0

    cnts, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    boxes = []
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        if w > 20 and h > 20:
            boxes.append((x, y, w, h))

    # sort by y, then x
    boxes = sorted(boxes, key=lambda b: (b[1]//50, b[0]))
    
    # Just grab the nth box (target_idx)
    if target_idx < len(boxes):
        x, y, w, h = boxes[target_idx]
        pad = 10
        x1, y1 = max(0, x-pad), max(0, y-pad)
        x2, y2 = min(thresh.shape[1], x+w+pad), min(thresh.shape[0], y+h+pad)

        roi = thresh[y1:y2, x1:x2]
        roi_resized = cv2.resize(roi, (28, 28), interpolation=cv2.INTER_AREA)

        cv2.imwrite(out_name, roi_resized)
        print(f"Saved {out_name}")

if __name__ == "__main__":
    get_sample("media_1786871986482.png", 0, "sample_ka.png")
    get_sample("media_1786883125145.jpg", 0, "sample_tha.png")
