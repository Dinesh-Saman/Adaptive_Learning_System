import torch
from template_matcher import HandwritingCNN, CNN_CLASSES
from PIL import Image
import numpy as np

def test():
    model = HandwritingCNN(num_classes=20)
    model.load_state_dict(torch.load('sinhala_custom_cnn.pt', map_location='cpu'))
    model.eval()
    
    img = Image.open('../debug_cnn_input.png').convert('L')
    arr = np.array(img, dtype=np.float32) / 255.0
    
    tensor = torch.tensor(arr).unsqueeze(0).unsqueeze(0)
    
    with torch.no_grad():
        output = model(tensor)
        probs = torch.nn.functional.softmax(output, dim=1)[0]
        
    for i, c in enumerate(CNN_CLASSES):
        print(f"Class {i}: {probs[i].item()*100:.2f}%")
        
if __name__ == "__main__":
    test()
