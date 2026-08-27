import os
import glob
import torch
import torch.nn as nn
import torch.optim as optim
import librosa
import numpy as np
from torch.utils.data import Dataset, DataLoader
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'core_english'))
from audio_model import PronunciationNet

class MassivePronunciationDataset(Dataset):
    def __init__(self, data_dir, add_noise=True):
        self.samples = []
        self.add_noise = add_noise
        files = glob.glob(os.path.join(data_dir, "*.wav"))
        print(f"Discovered {len(files)} files on disk. Extracting base MFCCs...")
        for filepath in files:
            filename = os.path.basename(filepath)
            class_id = int(filename.split('_')[1])
            try:
                y, sr = librosa.load(filepath, sr=16000)
                mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
                mfcc_features = np.mean(mfccs.T, axis=0)
                self.samples.append((mfcc_features, class_id))
            except:
                pass

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        features, label = self.samples[idx]
        
        # Data Augmentation: Add random gaussian noise 50% of the time
        if self.add_noise and np.random.rand() > 0.5:
            noise = np.random.normal(0, 0.5, features.shape)
            features = features + noise
            
        return torch.tensor(features, dtype=torch.float32), torch.tensor(label, dtype=torch.long)


def train():
    dataset = MassivePronunciationDataset("training_data_massive")
    
    # We copy the dataset 5 times to increase epoch size. 
    # Because __getitem__ has random noise, each copy will yield slightly different variations!
    # 1000 base files * 5 copies = 5,000 augmented training samples per epoch!
    extended_dataset = torch.utils.data.ConcatDataset([dataset] * 5)
    
    dataloader = DataLoader(extended_dataset, batch_size=32, shuffle=True)
    
    model = PronunciationNet(input_features=40, num_classes=13)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.003)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.5)
    
    epochs = 30
    print(f"Starting advanced training on {len(extended_dataset)} augmented samples...")
    
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
            
        scheduler.step()
        accuracy = 100 * correct / total
        if (epoch + 1) % 5 == 0:
            print(f"Epoch {epoch+1}/{epochs} | Loss: {total_loss/len(dataloader):.4f} | Accuracy: {accuracy:.2f}%")
            
    os.makedirs(os.path.join("core_english", "weights"), exist_ok=True)
    save_path = os.path.join("core_english", "weights", "english_model.pt")
    torch.save(model.state_dict(), save_path)
    print(f"PRODUCTION MODEL SAVED TO {save_path}")

if __name__ == "__main__":
    train()
