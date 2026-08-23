import torch
import torch.nn as nn
import torch.nn.functional as F

class PronunciationNet(nn.Module):
    def __init__(self, input_features=40, num_classes=4):
        """
        Input: 1D array of MFCC features (length 40)
        Output: 4 pronunciation classes
        """
        super(PronunciationNet, self).__init__()
        
        # A simple 1D Convolutional setup for sequential audio features
        # We need to reshape the input to (batch, channels, length) during forward pass
        self.conv1 = nn.Conv1d(in_channels=1, out_channels=16, kernel_size=3, padding=1)
        self.conv2 = nn.Conv1d(in_channels=16, out_channels=32, kernel_size=3, padding=1)
        
        # Pooling layer
        self.pool = nn.MaxPool1d(kernel_size=2)
        
        # Fully connected layers
        # After 2 max pools of size 2, the length of 40 becomes 10
        self.fc1 = nn.Linear(32 * 10, 64)
        self.fc2 = nn.Linear(64, num_classes)
        
        self.dropout = nn.Dropout(0.3)
        
    def forward(self, x):
        # x is (batch, 40) -> reshape to (batch, 1, 40)
        x = x.unsqueeze(1)
        
        x = F.relu(self.conv1(x))
        x = self.pool(x) # (batch, 16, 20)
        
        x = F.relu(self.conv2(x))
        x = self.pool(x) # (batch, 32, 10)
        
        # Flatten
        x = x.view(x.size(0), -1)
        
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x
