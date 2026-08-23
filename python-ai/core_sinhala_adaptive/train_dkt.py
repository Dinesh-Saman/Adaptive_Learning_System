import torch
import torch.nn as nn
import torch.optim as optim
import random
import os
from dkt_model import DeepKnowledgeTracing

NUM_QUESTIONS = 10
NUM_STUDENTS = 200
SEQ_LENGTH = 15

def generate_synthetic_data():
    """
    Generates synthetic data for DKT training.
    We assign a static difficulty to each question (0.1 to 0.9)
    We assign a static ability to each student (0.1 to 0.9)
    Correct probability = sigmoid(ability - difficulty)
    """
    difficulties = torch.linspace(0.1, 0.9, NUM_QUESTIONS)
    
    dataset = []
    
    for _ in range(NUM_STUDENTS):
        ability = random.uniform(-1.0, 1.0)
        
        # Student answers a sequence of random questions
        history = []
        labels = [] # What they actually got (1 or 0)
        q_ids = []  # Which question was asked
        
        for _ in range(SEQ_LENGTH + 1):
            # Pick a random question
            q = random.randint(0, NUM_QUESTIONS - 1)
            diff = difficulties[q].item()
            
            # Probability of correct
            logit = ability - diff
            prob = 1.0 / (1.0 + torch.exp(torch.tensor(-logit * 3))).item()
            
            is_correct = 1 if random.random() < prob else 0
            
            q_ids.append(q)
            labels.append(is_correct)
            
            # Their ability slightly increases over time
            ability += 0.05
            
        dataset.append((q_ids, labels))
        
    return dataset

def prepare_tensors(dataset):
    """
    Converts dataset into X (inputs) and Y (targets).
    For DKT, X is the interaction at t, Y is the label at t+1 for the question asked at t+1.
    """
    X = []
    Y_q = []
    Y_ans = []
    
    for q_ids, labels in dataset:
        # x sequence is from 0 to SEQ_LENGTH-1
        # y sequence is from 1 to SEQ_LENGTH
        
        x_seq = []
        for i in range(SEQ_LENGTH):
            q = q_ids[i]
            c = labels[i]
            # Encode: q if incorrect, q + NUM_QUESTIONS if correct
            x_val = q + NUM_QUESTIONS if c == 1 else q
            x_seq.append(x_val)
            
        X.append(x_seq)
        Y_q.append(q_ids[1:SEQ_LENGTH+1])
        Y_ans.append(labels[1:SEQ_LENGTH+1])
        
    return torch.tensor(X, dtype=torch.long), torch.tensor(Y_q, dtype=torch.long), torch.tensor(Y_ans, dtype=torch.float32)

def train():
    dataset = generate_synthetic_data()
    X, Y_q, Y_ans = prepare_tensors(dataset)
    
    model = DeepKnowledgeTracing(num_questions=NUM_QUESTIONS)
    optimizer = optim.Adam(model.parameters(), lr=0.01)
    criterion = nn.BCELoss()
    
    epochs = 50
    batch_size = 16
    
    print("Training DKT Model on Synthetic Data...")
    
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        
        for i in range(0, NUM_STUDENTS, batch_size):
            batch_X = X[i:i+batch_size]
            batch_Y_q = Y_q[i:i+batch_size]
            batch_Y_ans = Y_ans[i:i+batch_size]
            
            optimizer.zero_grad()
            
            # probs shape: (batch_size, seq_len, num_questions)
            probs = model(batch_X)
            
            # We only care about the predictions for the specific questions that were asked at t+1
            # Gather the probabilities for the asked questions
            # probs shape is [B, S, Q], batch_Y_q is [B, S]
            # We want to extract [B, S, 1] using gather
            pred_probs = probs.gather(2, batch_Y_q.unsqueeze(2)).squeeze(2)
            
            loss = criterion(pred_probs, batch_Y_ans)
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            
        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1}/{epochs} | Loss: {total_loss/NUM_STUDENTS:.4f}")
            
    # Save the model
    save_path = os.path.join(os.path.dirname(__file__), "weights")
    os.makedirs(save_path, exist_ok=True)
    torch.save(model.state_dict(), os.path.join(save_path, "dkt_model.pt"))
    print(f"Saved DKT model to {save_path}/dkt_model.pt")

if __name__ == "__main__":
    train()
