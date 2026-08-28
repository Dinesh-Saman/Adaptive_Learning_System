"""
sinhala_cnn_model.py
Custom PyTorch Convolutional Neural Network (CNN) for Sinhala Handwritten Character Recognition & Stroke Quality Evaluation
"""

import torch
import torch.nn as nn
import torch.nn.functional as F

# Sinhala Character Class Vocabulary for Grade 2 Curriculum
SINHALA_CLASSES = [
    'ක', 'ර', 'අ', 'ල', 'ට', 'ග', 'ත', 'ස', 'න', 'ම', 'ව', 'ඉ', 'උ', 'එ', 'බ', 'ද', 'ප', 'ය',
    'පා', 'නැ', 'තු', 'මල', 'පාලම', 'පාසල', 'නැව', 'කතුර'
]

CLASS_TO_IDX = {ch: i for i, ch in enumerate(SINHALA_CLASSES)}
IDX_TO_CLASS = {i: ch for i, ch in enumerate(SINHALA_CLASSES)}
NUM_CLASSES = len(SINHALA_CLASSES)


class SinhalaCharacterCNN(nn.Module):
    """
    Custom Deep Convolutional Neural Network Architecture for Grayscale 64x64 Sinhala Handwritten Characters.
    Consists of:
      - 3 Conv-BatchNorm-ReLU-MaxPool feature extractor blocks
      - Global Average Pooling & Dropout for strong regularization
      - Fully-Connected Dense classifier with Softmax output
    """
    def __init__(self, num_classes=NUM_CLASSES):
        super(SinhalaCharacterCNN, self).__init__()
        
        # Block 1: 1 -> 32 channels (Low-level stroke contours)
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.pool1 = nn.MaxPool2d(2, 2)  # 64 -> 32
        
        # Block 2: 32 -> 64 channels (Loop, hook, and kombuwa curve detectors)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        self.pool2 = nn.MaxPool2d(2, 2)  # 32 -> 16
        
        # Block 3: 64 -> 128 channels (Composite Sinhala grapheme features)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        self.pool3 = nn.MaxPool2d(2, 2)  # 16 -> 8
        
        # Dropout for regularization
        self.dropout = nn.Dropout(0.3)
        
        # Fully Connected Classifier
        self.fc1 = nn.Linear(128 * 8 * 8, 256)
        self.bn_fc = nn.BatchNorm1d(256)
        self.fc2 = nn.Linear(256, num_classes)
        
    def forward(self, x):
        # x shape: (batch_size, 1, 64, 64)
        x = self.pool1(F.relu(self.bn1(self.conv1(x))))
        x = self.pool2(F.relu(self.bn2(self.conv2(x))))
        x = self.pool3(F.relu(self.bn3(self.conv3(x))))
        
        x = x.view(x.size(0), -1)  # Flatten
        x = self.dropout(x)
        x = F.relu(self.bn_fc(self.fc1(x)))
        x = self.dropout(x)
        logits = self.fc2(x)
        return logits
    
    def predict_with_confidence(self, x):
        """Returns predicted class, confidence percentage (0-100), and top-3 predictions."""
        self.eval()
        with torch.no_grad():
            logits = self.forward(x)
            probabilities = F.softmax(logits, dim=1)[0]
            top3_prob, top3_idx = torch.topk(probabilities, 3)
            
            top_class = IDX_TO_CLASS[top3_idx[0].item()]
            top_conf = top3_prob[0].item() * 100.0
            
            top3_results = [
                {
                    "class": IDX_TO_CLASS[top3_idx[i].item()],
                    "confidence": round(top3_prob[i].item() * 100.0, 2)
                }
                for i in range(len(top3_idx))
            ]
            
            return {
                "predicted_character": top_class,
                "confidence": round(top_conf, 2),
                "top3": top3_results
            }
