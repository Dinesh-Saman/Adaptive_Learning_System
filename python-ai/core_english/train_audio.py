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
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_dir = os.path.join(base_dir, "dataset")
    features_path = os.path.join(dataset_dir, "english_features.npy")
    labels_path = os.path.join(dataset_dir, "english_labels.npy")
    
    if not os.path.exists(features_path):
        print(f"Error: {features_path} not found. Run generate_audio_data.py first.", flush=True)
        return
        
    dataset = AudioDataset(features_path, labels_path)
    
    # 80/20 train/test split
    train_size = int(0.8 * len(dataset))
    test_size = len(dataset) - train_size
    train_dataset, test_dataset = torch.utils.data.random_split(dataset, [train_size, test_size])
    
    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False)
    
    model = PronunciationNet()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.003)
    
    epochs = 10
    print(f"Starting audio model training on {len(dataset)} samples...", flush=True)
    
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
        print(f"Epoch {epoch+1}/{epochs} - Loss: {total_loss/len(train_loader):.4f} - Val Accuracy: {accuracy:.2f}%", flush=True)
        
    # Save the model
    weights_dir = os.path.join(base_dir, 'weights')
    os.makedirs(weights_dir, exist_ok=True)
    model_save_path = os.path.join(weights_dir, 'english_model.pt')
    torch.save(model.state_dict(), model_save_path)
    print(f"Model saved to {model_save_path}", flush=True)

if __name__ == "__main__":
    train_audio_model()
