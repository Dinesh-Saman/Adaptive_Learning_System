import torch
import os
import json
from .dkt_model import DeepKnowledgeTracing

NUM_QUESTIONS = 10

class AdaptiveEngine:
    def __init__(self):
        self.model = DeepKnowledgeTracing(num_questions=NUM_QUESTIONS)
        self.is_loaded = False
        
        # Load weights
        weights_path = os.path.join(os.path.dirname(__file__), 'weights', 'dkt_model.pt')
        if os.path.exists(weights_path):
            self.model.load_state_dict(torch.load(weights_path, weights_only=True))
            self.model.eval()
            self.is_loaded = True
            print(f"Loaded Sinhala Adaptive DKT model from {weights_path}")
        else:
            print(f"WARNING: Adaptive DKT weights not found at {weights_path}")

        # Map internal indices 0..9 to actual DB exercise IDs
        self.db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'data', 'sinhala_exercises_db.json')
        self.question_id_map = [] # idx to ID
        self.question_id_to_idx = {} # ID to idx
        
        if os.path.exists(self.db_path):
            with open(self.db_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for i, ex in enumerate(data):
                    if i >= NUM_QUESTIONS:
                        break
                    self.question_id_map.append(ex['id'])
                    self.question_id_to_idx[ex['id']] = i
        else:
            print("WARNING: Sinhala exercises DB not found.")

    def get_next_question(self, history_sequence):
        """
        history_sequence: list of dicts [{'id': 'match_word_pic_1', 'correct': bool}, ...]
        """
        if not self.is_loaded or not self.question_id_map:
            # Fallback: just return random or first
            return self.question_id_map[0] if self.question_id_map else "fallback_id"
            
        # Convert history into DKT input format
        dkt_history = []
        for h in history_sequence:
            idx = self.question_id_to_idx.get(h['id'])
            if idx is not None:
                val = idx + NUM_QUESTIONS if h['correct'] else idx
                dkt_history.append(val)
                
        # Get probabilities for all next questions
        probs = self.model.predict_next(dkt_history)
        
        # We want to pick a question the student has a ~60% chance of getting right.
        # This keeps them in the "Zone of Proximal Development" (not too easy, not too hard)
        target_prob = 0.60
        
        best_q_idx = 0
        min_diff = float('inf')
        
        for i, p in enumerate(probs):
            diff = abs(p - target_prob)
            if diff < min_diff:
                min_diff = diff
                best_q_idx = i
                
        return self.question_id_map[best_q_idx]
