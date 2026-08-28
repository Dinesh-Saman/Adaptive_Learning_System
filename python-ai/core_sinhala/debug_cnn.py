import torch
from template_matcher import HandwritingCNN, CNN_CLASSES, _predict_cnn, _decode
import base64
import numpy as np

def test():
    # just loading the model to see if it works
    model = HandwritingCNN(num_classes=16)
    model.load_state_dict(torch.load('sinhala_custom_cnn.pt', map_location='cpu'))
    model.eval()
    print("Model loaded.")
    
if __name__ == "__main__":
    test()
