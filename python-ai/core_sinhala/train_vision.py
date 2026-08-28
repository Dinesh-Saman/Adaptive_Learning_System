import os
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from vision_model import HandwritingCNN

class VisionDataset(Dataset):
    def __init__(self, images_file, labels_file):
        images = np.load(images_file)
        labels = np.load(labels_file)
        
        self.images = torch.tensor(images, dtype=torch.float32)
        self.labels = torch.tensor(labels, dtype=torch.long)
        
    def __len__(self):
        return len(self.images)
        
    def __getitem__(self, idx):
        return self.images[idx], self.labels[idx]

def train_vision_model():
    dataset_dir = "dataset"
    images_path = os.path.join(dataset_dir, "vision_images.npy")
    labels_path = os.path.join(dataset_dir, "vision_labels.npy")
    
    if not os.path.exists(images_path):
        print(f"Error: {images_path} not found. Run generate_vision_data.py first.")
        return
        
    dataset = VisionDataset(images_path, labels_path)
    
    # 80/20 train/test split
    train_size = int(0.8 * len(dataset))
    test_size = len(dataset) - train_size
    train_dataset, test_dataset = torch.utils.data.random_split(dataset, [train_size, test_size])
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)
    
    model = HandwritingCNN()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    epochs = 10
    print("Starting Vision CNN training...")
    
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        for images, labels in train_loader:
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
            
        # Validation
        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for images, labels in test_loader:
                outputs = model(images)
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
                
        accuracy = 100 * correct / total
        print(f"Epoch {epoch+1}/{epochs} - Loss: {total_loss/len(train_loader):.4f} - Val Accuracy: {accuracy:.2f}%")
        
    os.makedirs('weights', exist_ok=True)
    torch.save(model.state_dict(), 'weights/handwriting_model.pt')
    print("Model saved to weights/handwriting_model.pt")

if __name__ == "__main__":
    train_vision_model()
