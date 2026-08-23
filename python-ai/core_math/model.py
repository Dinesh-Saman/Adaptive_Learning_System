import torch
import torch.nn as nn
import torch.nn.functional as F

class MultimodalFusionNet(nn.Module):
    def __init__(self, input_dim=5, hidden_dim=32, output_dim=3):
        """
        Input Features (5):
          1. last_correct (0 or 1)
          2. response_time_s (normalized)
          3. attention_score (0-1)
          4. frustration_score (0-1)
          5. current_difficulty (normalized 1-5)
          
        Output Classes (3):
          0: Decrease Difficulty (-1)
          1: Maintain Difficulty (0)
          2: Increase Difficulty (+1)
        """
        super(MultimodalFusionNet, self).__init__()
        
        # Simple feed-forward network for fusion
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, hidden_dim)
        self.fc3 = nn.Linear(hidden_dim, output_dim)
        
        # Dropout for regularization
        self.dropout = nn.Dropout(0.2)
        
    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = F.relu(self.fc2(x))
        x = self.dropout(x)
        x = self.fc3(x) # Raw logits output
        return x
