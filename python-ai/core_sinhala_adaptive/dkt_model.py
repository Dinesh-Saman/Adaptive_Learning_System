import torch
import torch.nn as nn
import torch.nn.functional as F

class DeepKnowledgeTracing(nn.Module):
    def __init__(self, num_questions, hidden_size=64, num_layers=1, dropout=0.2):
        super(DeepKnowledgeTracing, self).__init__()
        self.num_questions = num_questions
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        # Input features: 2 * num_questions (to encode correct/incorrect separately)
        self.input_size = num_questions * 2
        
        self.lstm = nn.LSTM(
            input_size=self.input_size,
            hidden_size=self.hidden_size,
            num_layers=self.num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0
        )
        
        # Output layer maps hidden state to a probability for each question
        self.fc = nn.Linear(self.hidden_size, self.num_questions)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        """
        x: tensor of shape (batch_size, seq_len)
           Each element is an integer from 0 to 2*num_questions - 1.
           q_id + 0 if incorrect, q_id + num_questions if correct.
        """
        # Convert integers to one-hot encoding
        # Shape: (batch_size, seq_len, 2*num_questions)
        x_onehot = F.one_hot(x, num_classes=self.input_size).float()
        
        # Pass through LSTM
        # out shape: (batch_size, seq_len, hidden_size)
        out, _ = self.lstm(x_onehot)
        
        # Map to probabilities for all questions
        # shape: (batch_size, seq_len, num_questions)
        logits = self.fc(out)
        probs = self.sigmoid(logits)
        
        return probs

    def predict_next(self, history):
        """
        history: list of integers representing the student's past interactions.
        Returns: list of probabilities for all questions.
        """
        self.eval()
        if not history:
            # If no history, assume 50% probability for everything, or pass a dummy zero tensor
            # Let's pass a dummy sequence of zeros but since 0 is an actual input, we should 
            # ideally have an initial state. For simplicity, if no history, return 0.5.
            return [0.5] * self.num_questions
            
        with torch.no_grad():
            x = torch.tensor([history], dtype=torch.long)
            probs = self.forward(x)
            # Return the predictions for the *next* step (last element in seq_len)
            next_probs = probs[0, -1, :].tolist()
        return next_probs
