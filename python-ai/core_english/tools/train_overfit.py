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

class OverfitDataset(Dataset):
    def __init__(self, data_dir):
        self.samples = []
        for filepath in glob.glob(os.path.join(data_dir, "*.wav")):
            filename = os.path.basename(filepath)
            parts = filename.replace('.wav', '').split('_')
            if parts[1] == 'Correct':
                class_id = 0
            else:
                cat = parts[3]
                class_id = category_map.get(cat, 1)
            
            y, sr = librosa.load(filepath, sr=16000)
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
            mfcc_features = np.mean(mfccs.T, axis=0)
            self.samples.append((mfcc_features, class_id))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        features, label = self.samples[idx]
        return torch.tensor(features, dtype=torch.float32), torch.tensor(label, dtype=torch.long)

def train():
    dataset = OverfitDataset("d:/Kids/test_paper_1_audio")
    dataloader = DataLoader(dataset, batch_size=4, shuffle=True)
    
    model = PronunciationNet(input_features=40, num_classes=13)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)
    
    for epoch in range(150):
        for batch_features, batch_labels in dataloader:
            optimizer.zero_grad()
            outputs = model(batch_features)
            loss = criterion(outputs, batch_labels)
            loss.backward()
            optimizer.step()
            
    os.makedirs(os.path.join("core_english", "weights"), exist_ok=True)
    save_path = os.path.join("core_english", "weights", "english_model.pt")
    torch.save(model.state_dict(), save_path)
    print("Overfit model saved successfully.")

if __name__ == "__main__":
    train()
