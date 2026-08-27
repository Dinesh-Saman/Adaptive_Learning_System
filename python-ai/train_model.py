import os
import glob
import torch
import torch.nn as nn
import torch.optim as optim
import librosa
import numpy as np
from torch.utils.data import Dataset, DataLoader
import sys

# Import the model
sys.path.append(os.path.join(os.path.dirname(__file__), 'core_english'))
from audio_model import PronunciationNet

class PronunciationDataset(Dataset):
    def __init__(self, data_dir):
        self.samples = []
        # Files are named like: class_X_Y.wav
        for filepath in glob.glob(os.path.join(data_dir, "*.wav")):
            filename = os.path.basename(filepath)
            parts = filename.split('_')
            class_id = int(parts[1])
            
            # Extract MFCC
            try:
                y, sr = librosa.load(filepath, sr=16000)
                mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
                mfcc_features = np.mean(mfccs.T, axis=0)
                self.samples.append((mfcc_features, class_id))
            except Exception as e:
                print(f"Failed to process {filepath}: {e}")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        features, label = self.samples[idx]
        return torch.tensor(features, dtype=torch.float32), torch.tensor(label, dtype=torch.long)


def train():
    print("Loading dataset and extracting features (this may take a moment)...")
    dataset = PronunciationDataset("training_data")
    print(f"Loaded {len(dataset)} samples.")
    
    # We will duplicate the dataset a bit to ensure the model has enough iterations to converge
    # (Since we only generated 85 samples)
    extended_dataset = torch.utils.data.ConcatDataset([dataset] * 10)
    
    dataloader = DataLoader(extended_dataset, batch_size=16, shuffle=True)
    
    model = PronunciationNet(input_features=40, num_classes=13)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.005)
    
    epochs = 40
    print("Starting training...")
    
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        correct = 0
        total = 0
        
        for batch_features, batch_labels in dataloader:
            optimizer.zero_grad()
            
            outputs = model(batch_features)
            loss = criterion(outputs, batch_labels)
            
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total += batch_labels.size(0)
            correct += (predicted == batch_labels).sum().item()
            
        accuracy = 100 * correct / total
        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1}/{epochs} | Loss: {total_loss/len(dataloader):.4f} | Accuracy: {accuracy:.2f}%")
            
    # Save the model
    os.makedirs(os.path.join("core_english", "weights"), exist_ok=True)
    save_path = os.path.join("core_english", "weights", "english_model.pt")
    torch.save(model.state_dict(), save_path)
    print(f"Model saved successfully to {save_path}")
    
    # Test on a few items
    model.eval()
    print("\n--- Running Final Verification Test ---")
    test_files = glob.glob(os.path.join("training_data", "*.wav"))[:5]
    with torch.no_grad():
        for f in test_files:
            y, sr = librosa.load(f, sr=16000)
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
            features = np.mean(mfccs.T, axis=0)
            tensor_features = torch.tensor(features, dtype=torch.float32).unsqueeze(0)
            
            outputs = model(tensor_features)
            probs = torch.nn.functional.softmax(outputs, dim=1)
            pred = torch.argmax(probs, dim=1).item()
            conf = probs[0][pred].item() * 100
            
            actual_class = int(os.path.basename(f).split('_')[1])
            print(f"File: {os.path.basename(f)} | Actual: {actual_class} | Predicted: {pred} | Confidence: {conf:.1f}%")
            if actual_class != pred:
                print("  => MISMATCH!")

if __name__ == "__main__":
    train()
