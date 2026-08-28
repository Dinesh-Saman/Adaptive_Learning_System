import cv2
import torch
import numpy as np
from template_matcher import HandwritingCNN, CNN_CLASSES

model = HandwritingCNN(num_classes=20)
model.load_state_dict(torch.load("sinhala_custom_cnn.pt"))
model.eval()

img = cv2.imread("../debug_cnn_input.png", cv2.IMREAD_GRAYSCALE)
tensor = torch.tensor(img, dtype=torch.float32).unsqueeze(0).unsqueeze(0) / 255.0

with torch.no_grad():
    outputs = model(tensor)
    probs = torch.nn.functional.softmax(outputs, dim=1)[0]
    
    print("Predictions for debug_cnn_input.png (canvas drawing):")
    top3 = torch.topk(probs, 3)
    for i in range(3):
        idx = top3.indices[i].item()
        p = top3.values[i].item()
        print(f"{CNN_CLASSES[idx]}: {p*100:.2f}%")
