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

class AudioTimeDataset(Dataset):
    def __init__(self, data_dir):
        self.samples = []
        
        for filepath in glob.glob(os.path.join(data_dir, "*.wav")):
            filename = os.path.basename(filepath)
            if "debug" in filename:
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
            
            y_base, sr = librosa.load(filepath, sr=16000)
            
            # Base sample
            feat = extract_mfcc_timeseries(y_base, sr=16000)
            self.samples.append((feat, class_id))
            
            # Data Augmentation: Speeds (0.85x, 1.15x) & Pitch shifts (-2, +2 semitones)
            for rate in [0.85, 1.15]:
                y_speed = librosa.effects.time_stretch(y_base, rate=rate)
                self.samples.append((extract_mfcc_timeseries(y_speed, sr=16000), class_id))
                
            for n_steps in [-2, 2]:
                y_pitch = librosa.effects.pitch_shift(y_base, sr=16000, n_steps=n_steps)
                self.samples.append((extract_mfcc_timeseries(y_pitch, sr=16000), class_id))
                
            # Add slight Gaussian acoustic noise (microphone simulation)
            noise = np.random.randn(len(y_base)) * 0.005
            y_noisy = y_base + noise
            self.samples.append((extract_mfcc_timeseries(y_noisy, sr=16000), class_id))

        print(f"Total augmented dataset samples: {len(self.samples)}")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        features, label = self.samples[idx]
        return torch.tensor(features, dtype=torch.float32), torch.tensor(label, dtype=torch.long)

def train():
    dataset = AudioTimeDataset("d:/Kids/test_paper_1_audio")
    dataloader = DataLoader(dataset, batch_size=8, shuffle=True)
    
    model = PronunciationNet(input_features=40, max_frames=80, num_classes=13)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=0.003, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=120)
    
    print("Training 2D Spectrogram CRNN (Bi-LSTM + Conv2D) for 120 epochs...")
    model.train()
    for epoch in range(120):
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
        if (epoch + 1) % 20 == 0 or epoch == 119:
            acc = correct / total * 100.0
            print(f"Epoch {epoch+1}/120 | Loss: {total_loss/total:.4f} | Accuracy: {acc:.2f}%")
            
    # Save trained weights
    os.makedirs("d:/Kids/python-ai/core_english/weights", exist_ok=True)
    save_path = "d:/Kids/python-ai/core_english/weights/english_model.pt"
    torch.save(model.state_dict(), save_path)
    print(f"CRNN Weights successfully saved to {save_path}")

if __name__ == "__main__":
    train()
