import torch
import torch.nn as nn
import torch.nn.functional as F

class PronunciationNet(nn.Module):
    """
    2D Time-Series Spectrogram Convolutional Neural Network.
    Processes sequential MFCC acoustic spectrograms (40 frequency bands x 80 time frames)
    to classify clean speech vs 12 specific MTI accent patterns.
    """
    def __init__(self, input_features=40, max_frames=80, num_classes=13):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.pool1 = nn.MaxPool2d(2, 2)
        
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool2 = nn.MaxPool2d(2, 2)
        
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.pool3 = nn.AdaptiveAvgPool2d((4, 4))
        
        self.fc1 = nn.Linear(128 * 4 * 4, 128)
        self.dropout = nn.Dropout(0.2)
        self.fc2 = nn.Linear(128, num_classes)
        
    def forward(self, x):
        if x.dim() == 2:
            x = x.unsqueeze(1).repeat(1, 1, 80)
        if x.dim() == 3:
            x = x.unsqueeze(1)
            
        x = F.relu(self.conv1(x))
        x = self.pool1(x)
        x = F.relu(self.conv2(x))
        x = self.pool2(x)
        x = F.relu(self.conv3(x))
        x = self.pool3(x)
        
        x = x.view(x.size(0), -1)
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        return self.fc2(x)
