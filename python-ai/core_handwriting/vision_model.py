import torch
import torch.nn as nn
import torch.nn.functional as F

class HandwritingCNN(nn.Module):
    def __init__(self, num_classes=3):
        """
        Input: 2D Image tensor of shape (batch, 1, 28, 28)
        Output: 3 Quality Classes (0: Excellent, 1: Good, 2: Poor)
        """
        super(HandwritingCNN, self).__init__()
        
        # 2D Convolutions for Image data
        self.conv1 = nn.Conv2d(in_channels=1, out_channels=16, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(in_channels=16, out_channels=32, kernel_size=3, padding=1)
        
        # Pooling layer
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        
        # After two max pools of 2x2, a 28x28 image becomes 7x7
        # 32 channels * 7 * 7 = 1568 features
        self.fc1 = nn.Linear(32 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, num_classes)
        
        self.dropout = nn.Dropout(0.4)
        
    def forward(self, x):
        # x shape: (batch, 1, 28, 28)
        
        x = F.relu(self.conv1(x))
        x = self.pool(x) # (batch, 16, 14, 14)
        
        x = F.relu(self.conv2(x))
        x = self.pool(x) # (batch, 32, 7, 7)
        
        # Flatten for linear layers
        x = x.view(-1, 32 * 7 * 7)
        
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x
