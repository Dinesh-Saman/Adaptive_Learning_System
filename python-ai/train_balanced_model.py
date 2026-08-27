import os
import glob
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import soundfile as sf
import librosa
import numpy as np
from torch.utils.data import Dataset, DataLoader
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'core_english'))
from audio_model import PronunciationNet

category_map = {
    'SClusterProsthesis': 1, 'VWMerger': 2, 'THSubstitution': 3,
    'FPSubstitution': 4, 'Paragoge': 5, 'FinalConsonantWeakening': 6,
    'ClusterSimplification': 7, 'ShortLongVowel': 8, 'HDropping': 9,
    'ZSConfusion': 10, 'BackVowel': 11, 'EqualStress': 12
}

def extract_mfcc_timeseries(y, sr=16000, max_frames=80, n_mfcc=40):
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc, n_fft=512, hop_length=256)
    if mfccs.shape[1] < max_frames:
        pad_width = max_frames - mfccs.shape[1]
        mfccs = np.pad(mfccs, ((0, 0), (0, pad_width)), mode='constant')
    else:
        mfccs = mfccs[:, :max_frames]
    mean = np.mean(mfccs)
    std = np.std(mfccs) + 1e-6
    mfccs = (mfccs - mean) / std
    return mfccs.astype(np.float32)

class BalancedAudioDataset(Dataset):
    def __init__(self, data_dir):
        self.samples = []
        raw_files = []
        
        for filepath in glob.glob(os.path.join(data_dir, "*.wav")):
            filename = os.path.basename(filepath)
            if "debug" in filename or "apple" in filename:
                continue
            parts = filename.replace('.wav', '').split('_')
            
            if len(parts) >= 2 and parts[1] == 'Correct':
                class_id = 0
            elif "correct" in filename.lower():
                class_id = 0
            elif "equalstress" in filename.lower() or "EqualStress" in filename:
                class_id = 12
            else:
                cat = parts[3] if len(parts) > 3 else "SClusterProsthesis"
                class_id = category_map.get(cat, 1)
                
            raw_files.append((filepath, class_id))
            
        print(f"Found {len(raw_files)} base human voice recordings.")
        
        # Balance dataset: augment minority error classes more so all classes have equal representation
        for filepath, class_id in raw_files:
            y_raw, sr = sf.read(filepath, dtype='float32')
            if y_raw.ndim > 1:
                y_raw = y_raw.mean(axis=1)
            if sr != 16000:
                y_base = librosa.resample(y_raw, orig_sr=sr, target_sr=16000)
            else:
                y_base = y_raw
                
            # Number of augmentations per sample (more for error classes to achieve 50-50 balance)
            n_aug = 5 if class_id == 0 else 40
            
            # Base sample
            self.samples.append((extract_mfcc_timeseries(y_base, sr=16000), class_id))
            
            for i in range(n_aug):
                # Random amplitude scaling
                gain = np.random.uniform(0.7, 1.3)
                y_aug = y_base * gain
                
                # Random microphone noise
                noise_lvl = np.random.uniform(0.001, 0.006)
                noise = np.random.randn(len(y_aug)) * noise_lvl
                y_aug = y_aug + noise
                
                self.samples.append((extract_mfcc_timeseries(y_aug, sr=16000), class_id))

        print(f"Total balanced dataset: {len(self.samples)} samples across all classes.")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        features, label = self.samples[idx]
        return torch.tensor(features, dtype=torch.float32), torch.tensor(label, dtype=torch.long)

def train():
    dataset = BalancedAudioDataset("d:/Kids/test_paper_1_audio")
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
    
    # 2D Spectrogram Convolutional Neural Network
    class ConvAudioNet(nn.Module):
        def __init__(self, num_classes=13):
            super().__init__()
            self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
            self.pool1 = nn.MaxPool2d(2, 2)
            self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
            self.pool2 = nn.MaxPool2d(2, 2)
            self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
            self.pool3 = nn.AdaptiveAvgPool2d((4, 4))
            self.fc1 = nn.Linear(128 * 4 * 4, 128)
            self.fc2 = nn.Linear(128, num_classes)
            
        def forward(self, x):
            if x.dim() == 2: x = x.unsqueeze(1).repeat(1, 1, 80)
            if x.dim() == 3: x = x.unsqueeze(1)
            x = F.relu(self.conv1(x))
            x = self.pool1(x)
            x = F.relu(self.conv2(x))
            x = self.pool2(x)
            x = F.relu(self.conv3(x))
            x = self.pool3(x)
            x = x.view(x.size(0), -1)
            x = F.relu(self.fc1(x))
            return self.fc2(x)

    model = ConvAudioNet()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.002)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=80)
    
    print("\nTraining on your balanced human voice dataset...")
    model.train()
    for epoch in range(80):
        total_loss = 0.0
        correct = 0
        total = 0
        for batch_features, batch_labels in dataloader:
            optimizer.zero_grad()
            outputs = model(batch_features)
            loss = criterion(outputs, batch_labels)
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item() * len(batch_labels)
            preds = torch.argmax(outputs, dim=1)
            correct += (preds == batch_labels).sum().item()
            total += len(batch_labels)
            
        scheduler.step()
        if (epoch + 1) % 20 == 0 or epoch == 79:
            acc = correct / total * 100.0
            print(f"Epoch {epoch+1:02d}/80 | Loss: {total_loss/total:.4f} | Accuracy: {acc:.2f}%")
            
    os.makedirs("d:/Kids/python-ai/core_english/weights", exist_ok=True)
    save_path = "d:/Kids/python-ai/core_english/weights/english_model.pt"
    torch.save(model.state_dict(), save_path)
    print(f"\nSUCCESS: Balanced model trained and saved to {save_path}!")

if __name__ == "__main__":
    train()
