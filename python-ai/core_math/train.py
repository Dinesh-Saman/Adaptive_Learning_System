import os
import csv
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from model import MultimodalFusionNet

# Dataset Definition
class MathDataset(Dataset):
    def __init__(self, csv_file):
        self.features = []
        self.labels = []
        
        with open(csv_file, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Normalize response time (assume max 60s)
                time_norm = min(float(row['response_time_s']) / 60.0, 1.0)
                # Normalize difficulty (1-5 to 0.2-1.0)
                diff_norm = float(row['current_difficulty']) / 5.0
                
                feat = [
                    float(row['last_correct']),
                    time_norm,
                    float(row['attention_score']),
                    float(row['frustration_score']),
                    diff_norm
                ]
                
                # Map -1 -> 0, 0 -> 1, 1 -> 2
                raw_adj = int(row['difficulty_adjustment'])
                label = raw_adj + 1
                
                self.features.append(feat)
                self.labels.append(label)
                
        self.features = torch.tensor(self.features, dtype=torch.float32)
        self.labels = torch.tensor(self.labels, dtype=torch.long)
        
    def __len__(self):
        return len(self.features)
        
    def __getitem__(self, idx):
        return self.features[idx], self.labels[idx]

def train_model():
    dataset_path = "dataset/math_dataset.csv"
    if not os.path.exists(dataset_path):
        print(f"Error: {dataset_path} not found. Run generate_dataset.py first.")
        return
        
    dataset = MathDataset(dataset_path)
    
    # 80/20 train/test split
    train_size = int(0.8 * len(dataset))
    test_size = len(dataset) - train_size
    train_dataset, test_dataset = torch.utils.data.random_split(dataset, [train_size, test_size])
    
    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False)
    
    model = MultimodalFusionNet()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.005)
    
    epochs = 20
    print("Starting training...")
    
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
    torch.save(model.state_dict(), 'weights/math_model.pt')
    print("Model saved to weights/math_model.pt")

if __name__ == "__main__":
    train_model()
