import os
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from audio_model import PronunciationNet

# Dataset Definition
class AudioDataset(Dataset):
    def __init__(self, features_file, labels_file):
        features = np.load(features_file)
        labels = np.load(labels_file)
        
        self.features = torch.tensor(features, dtype=torch.float32)
        self.labels = torch.tensor(labels, dtype=torch.long)
        
    def __len__(self):
        return len(self.features)
        
    def __getitem__(self, idx):
        return self.features[idx], self.labels[idx]

def train_audio_model():
    dataset_dir = "dataset"
    features_path = os.path.join(dataset_dir, "english_features.npy")
    labels_path = os.path.join(dataset_dir, "english_labels.npy")
    
    if not os.path.exists(features_path):
        print(f"Error: {features_path} not found. Run generate_audio_data.py first.")
        return
        
    dataset = AudioDataset(features_path, labels_path)
    
    # 80/20 train/test split
    train_size = int(0.8 * len(dataset))
    test_size = len(dataset) - train_size
    train_dataset, test_dataset = torch.utils.data.random_split(dataset, [train_size, test_size])
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)
    
    model = PronunciationNet()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.002)
    
    epochs = 15
    print("Starting audio model training...")
    
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        for features, labels in train_loader:
            optimizer.zero_grad()
            outputs = model(features)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
            
        # Validation
        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for features, labels in test_loader:
                outputs = model(features)
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
                
        accuracy = 100 * correct / total
        print(f"Epoch {epoch+1}/{epochs} - Loss: {total_loss/len(train_loader):.4f} - Val Accuracy: {accuracy:.2f}%")
        
    # Save the model
    os.makedirs('weights', exist_ok=True)
    torch.save(model.state_dict(), 'weights/english_model.pt')
    print("Model saved to weights/english_model.pt")

if __name__ == "__main__":
    train_audio_model()
