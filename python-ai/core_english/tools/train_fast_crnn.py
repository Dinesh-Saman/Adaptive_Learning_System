import os
import glob
import torch
import torch.nn as nn
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

class FastAudioDataset(Dataset):
    def __init__(self, data_dir):
        self.samples = []
        
        for filepath in glob.glob(os.path.join(data_dir, "*.wav")):
            filename = os.path.basename(filepath)
            # Skip non-training debug or sample files
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
            
            y_raw, sr = sf.read(filepath, dtype='float32')
            if y_raw.ndim > 1:
                y_raw = y_raw.mean(axis=1)
            if sr != 16000:
                y_base = librosa.resample(y_raw, orig_sr=sr, target_sr=16000)
            else:
                y_base = y_raw
                
            # 1. Base clean sample
            feat = extract_mfcc_timeseries(y_base, sr=16000)
            self.samples.append((feat, class_id))
            
            # 2. Amplitude variations
            for scale in [0.75, 0.9, 1.1, 1.25]:
                y_scaled = y_base * scale
                self.samples.append((extract_mfcc_timeseries(y_scaled, sr=16000), class_id))
                
            # 3. Add microphone background noise variations
            for noise_lvl in [0.002, 0.005]:
                noise = np.random.randn(len(y_base)) * noise_lvl
                self.samples.append((extract_mfcc_timeseries(y_base + noise, sr=16000), class_id))

        print(f"Loaded {len(self.samples)} clean voice spectrogram samples across 13 classes.")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        features, label = self.samples[idx]
        return torch.tensor(features, dtype=torch.float32), torch.tensor(label, dtype=torch.long)

def train():
    dataset = FastAudioDataset("d:/Kids/test_paper_1_audio")
    dataloader = DataLoader(dataset, batch_size=16, shuffle=True)
    
    # Compute inverse class weights for balanced loss
    labels = [s[1] for s in dataset.samples]
    class_counts = np.bincount(labels, minlength=13)
    class_counts[class_counts == 0] = 1
    class_weights = 1.0 / class_counts.astype(np.float32)
    class_weights = class_weights / class_weights.sum() * 13.0
    weight_tensor = torch.tensor(class_weights, dtype=torch.float32)
    
    model = PronunciationNet(input_features=40, max_frames=80, num_classes=13)
    criterion = nn.CrossEntropyLoss(weight=weight_tensor)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    print("\nTraining CRNN (Conv2D + BiLSTM) on your recorded human voice...")
    model.train()
    for epoch in range(100):
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
            
        if (epoch + 1) % 20 == 0 or epoch == 99:
            acc = correct / total * 100.0
            print(f"Epoch {epoch+1:03d}/100 | Loss: {total_loss/total:.4f} | Accuracy: {acc:.2f}%")
            
    os.makedirs("d:/Kids/python-ai/core_english/weights", exist_ok=True)
    save_path = "d:/Kids/python-ai/core_english/weights/english_model.pt"
    torch.save(model.state_dict(), save_path)
    print(f"\n🎉 SUCCESS: CRNN Weights successfully trained and saved to {save_path}!")

if __name__ == "__main__":
    train()
