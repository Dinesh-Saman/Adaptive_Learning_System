"""
student_dkt_lstm.py
Custom PyTorch Deep Knowledge Tracing (DKT) with LSTM for Student Cognitive Mastery Modeling & Adaptive Exercise Recommendation
"""

import torch
import torch.nn as nn
import torch.nn.functional as F

# Curriculum Concepts / Exercises for Grade 2
EXERCISE_CONCEPTS = [
    'l1_ex1', 'l1_ex2', 'l1_ex3', 'l1_ex4',
    'l2_ex1', 'l2_ex2', 'l2_ex3', 'l2_ex4', 'l2_ex5',
    'l3_ex1', 'l3_ex2', 'l3_ex3'
]
CONCEPT_TO_IDX = {c: i for i, c in enumerate(EXERCISE_CONCEPTS)}
IDX_TO_CONCEPT = {i: c for i, c in enumerate(EXERCISE_CONCEPTS)}
NUM_CONCEPTS = len(EXERCISE_CONCEPTS)


class DeepKnowledgeTracingLSTM(nn.Module):
    """
    Deep Knowledge Tracing (DKT) Model with LSTM:
    Takes an interaction sequence tuple (concept_id, correctness, response_time, hint_count)
    and models the latent cognitive knowledge state of the student over time.
    Outputs:
      - Probability of mastering each curriculum concept P(L_t) in range [0, 1].
    """
    def __init__(self, num_concepts=NUM_CONCEPTS, embedding_dim=32, hidden_dim=64, num_layers=2):
        super(DeepKnowledgeTracingLSTM, self).__init__()
        self.num_concepts = num_concepts
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        
        # Interaction input: concept_id (one-hot or embedding) + correctness (binary) + normalized response time + hint count
        # Total input feature dim: embedding_dim + 3
        self.concept_embedding = nn.Embedding(num_concepts, embedding_dim)
        
        input_dim = embedding_dim + 3
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers=num_layers, batch_first=True, dropout=0.2)
        
        # Output layer: projects hidden state to mastery probabilities for all concepts
        self.fc_mastery = nn.Linear(hidden_dim, num_concepts)
        self.sigmoid = nn.Sigmoid()

    def forward(self, concept_seq, correctness_seq, time_seq, hints_seq):
        """
        concept_seq: (batch_size, seq_len)
        correctness_seq: (batch_size, seq_len, 1)
        time_seq: (batch_size, seq_len, 1)
        hints_seq: (batch_size, seq_len, 1)
        """
        # Embed concept sequence
        c_emb = self.concept_embedding(concept_seq)  # (batch_size, seq_len, emb_dim)
        
        # Concatenate features: [embedding, correctness, normalized_time, hints]
        x = torch.cat([c_emb, correctness_seq, time_seq, hints_seq], dim=2)
        
        # LSTM forward pass
        lstm_out, _ = self.lstm(x)  # (batch_size, seq_len, hidden_dim)
        
        # Predict mastery across all concepts
        logits = self.fc_mastery(lstm_out)  # (batch_size, seq_len, num_concepts)
        mastery_probs = self.sigmoid(logits)
        
        return mastery_probs

    def predict_next_recommendation(self, history):
        """
        history: list of dicts [{'concept': 'l1_ex1', 'correct': True, 'time': 4.2, 'hints': 0}, ...]
        Returns mastery probabilities across all concepts and the optimal recommended next exercise/level.
        """
        self.eval()
        if not history:
            return {
                "mastery_probability": 0.5,
                "current_level_mastery": 0.5,
                "recommendation": "l1_ex1",
                "recommendation_type": "START",
                "concept_masteries": {c: 0.5 for c in EXERCISE_CONCEPTS}
            }
            
        with torch.no_grad():
            seq_len = len(history)
            c_indices = torch.tensor([[CONCEPT_TO_IDX.get(h.get('concept', 'l1_ex1'), 0) for h in history]], dtype=torch.long)
            corr = torch.tensor([[[1.0 if h.get('correct', True) else 0.0] for h in history]], dtype=torch.float32)
            time_norm = torch.tensor([[[min(h.get('time', 5.0) / 30.0, 1.0)] for h in history]], dtype=torch.float32)
            hints_norm = torch.tensor([[[min(h.get('hints', 0) / 3.0, 1.0)] for h in history]], dtype=torch.float32)
            
            mastery_seq = self.forward(c_indices, corr, time_norm, hints_norm)  # (1, seq_len, num_concepts)
            latest_mastery = mastery_seq[0, -1].numpy()  # (num_concepts,)
            
            concept_masteries = {
                IDX_TO_CONCEPT[i]: round(float(latest_mastery[i]), 4)
                for i in range(NUM_CONCEPTS)
            }
            
            last_concept = history[-1].get('concept', 'l1_ex1')
            last_idx = CONCEPT_TO_IDX.get(last_concept, 0)
            current_concept_mastery = float(latest_mastery[last_idx])
            
            # Level 1 Average Mastery
            l1_avg = sum(concept_masteries[c] for c in ['l1_ex1', 'l1_ex2', 'l1_ex3', 'l1_ex4']) / 4.0
            # Level 2 Average Mastery
            l2_avg = sum(concept_masteries[c] for c in ['l2_ex1', 'l2_ex2', 'l2_ex3', 'l2_ex4', 'l2_ex5']) / 5.0
            
            # Calculate student accuracy and efficiency across trajectory
            recent_correct_count = sum(1.0 for h in history if h.get('correct', True))
            accuracy_rate = recent_correct_count / max(len(history), 1)
            avg_time = sum(h.get('time', 5.0) for h in history) / max(len(history), 1)
            total_hints = sum(h.get('hints', 0) for h in history)
            
            # Combine LSTM recurrent latent output with observable attempt metrics for calibrated mastery
            raw_lstm_mastery = float(latest_mastery[last_idx])
            calibrated_mastery = (raw_lstm_mastery * 0.5) + (accuracy_rate * 0.4) + (max(0, 1.0 - (avg_time / 20.0)) * 0.1) - (min(total_hints, 5) * 0.03)
            calibrated_mastery = max(0.05, min(0.99, calibrated_mastery))
            
            # Fast-Track, Sequential, or Remediation Decision Rules
            if calibrated_mastery >= 0.78 and accuracy_rate >= 0.90:
                if 'l1' in last_concept:
                    rec = 'l2_ex1'
                    rec_type = 'FAST_TRACK_PROMOTION_LEVEL_2'
                elif 'l2' in last_concept:
                    rec = 'l3_ex1'
                    rec_type = 'FAST_TRACK_PROMOTION_LEVEL_3'
                else:
                    rec = 'l3_ex3'
                    rec_type = 'CURRICULUM_COMPLETED'
            elif calibrated_mastery >= 0.55:
                # Next sequential exercise in the level
                next_idx = min(last_idx + 1, NUM_CONCEPTS - 1)
                rec = IDX_TO_CONCEPT[next_idx]
                rec_type = 'SEQUENTIAL_STEP'
            else:
                rec = last_concept
                rec_type = 'TARGETED_REMEDIATION'
                
            return {
                "mastery_probability": round(calibrated_mastery * 100.0, 2),
                "accuracy_rate": round(accuracy_rate * 100.0, 1),
                "average_response_time_sec": round(avg_time, 1),
                "total_hints_used": total_hints,
                "level1_average_mastery": round(l1_avg * 100.0, 2),
                "level2_average_mastery": round(l2_avg * 100.0, 2),
                "recommendation": rec,
                "recommendation_type": rec_type,
                "concept_masteries": concept_masteries
            }
