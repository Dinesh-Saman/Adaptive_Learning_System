import cv2
import numpy as np
from PIL import Image

def thicken_and_resize():
    # simulate what we do in template_matcher
    img = Image.open(r"d:\Kids\python-ai\debug_cnn_input.png").convert('L')
    arr = np.array(img, dtype=np.float32) / 255.0
    
    # Actually, debug_cnn_input.png is ALREADY resized to 28x28.
    # We need to look at the process before resize.
    pass

if __name__ == "__main__":
    pass
