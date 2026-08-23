import cv2
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as transforms
import os

# Set random seeds for reproducibility
torch.manual_seed(42)
np.random.seed(42)

UPLOAD_DIR = r"C:\Users\Dinesh\.gemini\antigravity\brain\5aa792a8-efdf-456b-a000-dc9db7c2fada\.user_uploaded"
MODEL_SAVE_PATH = "sinhala_custom_cnn.pt"

# Define the image sources and the 4 classes contained in each image
# Each image has 8 rows: 2 rows per class
IMAGE_INFO = [
    {
        "filename": "media_1786871986482.png",
        "classes": ['ක', 'ග', 'ප', 'ස']
    },
    {
        "filename": "media_1786875077385.png",
        "classes": ['අ', 'ආ', 'ඇ', 'ඈ']
    },
    {
        "filename": "media_1786875095146.png",
        "classes": ['ඉ', 'ඊ', 'උ', 'ඌ']
    },
    {
        "filename": "media_1786875116764.png",
        "classes": ['ඍ', 'එ', 'ඒ', 'ඓ']
    },
    {
        "filename": "media_1786883125145.jpg",
        "classes": ['ත', 'ද', 'න', 'ම']
    },
    {
        "filename": "media_1786887250014.jpg",
        "classes": ['ත', 'ත', 'ක', 'ක']
    },
    {
        "filename": "media_1786889122938.jpg",
        "classes": ['ස', 'ස', 'ප', 'ප']
    },
    {
        "filename": "media_1786895696183.png",
        "classes": ['ර', 'ල', 'ව', 'ව']
    },
    {
        "filename": "media_1786897186984.png",
        "classes": ['බ', 'ට', 'හ', 'ඩ', 'ච']
    }
]

# Build a flattened list of all unique classes to act as our master label list
ALL_CLASSES = []
for img_info in IMAGE_INFO:
    for c in img_info["classes"]:
        if c not in ALL_CLASSES:
            ALL_CLASSES.append(c)

def extract_characters(img_path, class_names):
    """Extracts characters from an image and labels them based on class_names."""
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not read image at {img_path}")
        
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY_INV, 21, 15)
                                   
    kernel = np.ones((3,3), np.uint8)
    thresh = cv2.dilate(thresh, kernel, iterations=1)
    
    # Ignore paper edges by zeroing out the borders
    margin = 50
    thresh[0:margin, :] = 0
    thresh[-margin:, :] = 0
    thresh[:, 0:margin] = 0
    thresh[:, -margin:] = 0
    
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    char_boxes = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        if w > 15 and h > 15 and w < 180 and h < 180:
            char_boxes.append((x, y, w, h))
            
    char_boxes.sort(key=lambda b: b[1])
    
    rows = []
    current_row = []
    last_y = char_boxes[0][1] if len(char_boxes) > 0 else 0
    
    for box in char_boxes:
        x, y, w, h = box
        if abs(y - last_y) > 30:
            current_row.sort(key=lambda b: b[0])
            rows.append(current_row)
            current_row = []
        current_row.append(box)
        last_y = y
    
    if current_row:
        current_row.sort(key=lambda b: b[0])
        rows.append(current_row)
        
    print(f"[{os.path.basename(img_path)}] Found {len(rows)} rows.")
    
    dataset = []
    
    for r_idx, row in enumerate(rows):
        if len(class_names) <= 4:
            if r_idx >= 8: break # Max 8 rows for 2-row-per-class images
            class_idx_in_image = r_idx // 2 
        else:
            if r_idx >= len(class_names): break # Max N rows for 1-row-per-class images
            class_idx_in_image = r_idx
            
        if class_idx_in_image >= len(class_names): 
            class_idx_in_image = len(class_names) - 1
        
        # Get the global label index
        char_name = class_names[class_idx_in_image]
        global_label = ALL_CLASSES.index(char_name)
        
        for c_idx, box in enumerate(row):
            if len(class_names) <= 4 and c_idx >= 5: break
            if len(class_names) > 4 and c_idx >= 10: break
            x, y, w, h = box
            
            pad = 10
            y1 = max(0, y - pad)
            y2 = min(img.shape[0], y + h + pad)
            x1 = max(0, x - pad)
            x2 = min(img.shape[1], x + w + pad)
            
            roi = thresh[y1:y2, x1:x2]
            roi_resized = cv2.resize(roi, (28, 28), interpolation=cv2.INTER_AREA)
            roi_norm = roi_resized.astype(np.float32) / 255.0
            
            dataset.append((roi_norm, global_label))
            
    print(f"[{os.path.basename(img_path)}] Extracted {len(dataset)} valid character samples.")
    return dataset

class SinhalaDataset(Dataset):
    def __init__(self, data, transform=None):
        self.data = data
        self.transform = transform
        
    def __len__(self):
        return len(self.data)
        
    def __getitem__(self, idx):
        img_arr, label = self.data[idx]
        img_tensor = torch.tensor(img_arr).unsqueeze(0)
        if self.transform:
            img_tensor = self.transform(img_tensor)
        return img_tensor, label

class HandwritingCNN(nn.Module):
    def __init__(self, num_classes=16):
        super(HandwritingCNN, self).__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(64 * 7 * 7, 256)
        self.fc2 = nn.Linear(256, num_classes)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.4)

    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = x.view(-1, 64 * 7 * 7)
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

def train_model():
    print("Starting data extraction for all images...")
    all_data = []
    
    for img_info in IMAGE_INFO:
        filename = img_info["filename"]
        full_path = os.path.join(UPLOAD_DIR, filename)
        
        if not os.path.exists(full_path):
            print(f"Warning: {filename} not found in user uploads!")
            continue
            
        data = extract_characters(full_path, img_info["classes"])
        all_data.extend(data)
        
    if len(all_data) == 0:
        print("Error: No characters extracted.")
        return
        
    print(f"Total extracted characters across all images: {len(all_data)}")
    
    class RandomMorphology:
        def __call__(self, tensor):
            if torch.rand(1).item() < 0.5:
                return tensor
            import torch.nn.functional as F
            # randomly dilate or erode
            if torch.rand(1).item() < 0.5:
                # dilate (ink is > 0)
                return F.max_pool2d(tensor, kernel_size=3, stride=1, padding=1)
            else:
                # erode
                return -F.max_pool2d(-tensor, kernel_size=3, stride=1, padding=1)
                
    train_transform = transforms.Compose([
        RandomMorphology(),
        transforms.RandomRotation(15),
        transforms.RandomAffine(degrees=0, translate=(0.15, 0.15), scale=(0.8, 1.2)),
    ])
    
    # 40 augmentations per sample
    augmented_data = all_data * 40
    
    train_dataset = SinhalaDataset(augmented_data, transform=train_transform)
    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on {device} with {len(ALL_CLASSES)} classes...")
    
    model = HandwritingCNN(num_classes=len(ALL_CLASSES)).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    epochs = 30
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
        print(f"Epoch {epoch+1}/{epochs} - Loss: {running_loss/len(train_loader):.4f} - Acc: {100 * correct / total:.2f}%")
        
    print("Saving model to sinhala_custom_cnn.pt")
    torch.save(model.state_dict(), 'sinhala_custom_cnn.pt')
    
    # Safely print classes
    try:
        print("Training complete! Classes trained:", ALL_CLASSES)
    except UnicodeEncodeError:
        print("Training complete! Total classes trained:", len(ALL_CLASSES))

if __name__ == "__main__":
    train_model()
