import os
import csv
import random

def generate_math_dataset(num_samples=10000, output_file="math_dataset.csv"):
    """
    Generates a synthetic dataset for the Multimodal Math AI.
    Features:
      - last_correct (0 or 1)
      - response_time_s (float, 1.0 to 60.0)
      - attention_score (float, 0.0 to 1.0)
      - frustration_score (float, 0.0 to 1.0)
      - current_difficulty (int, 1 to 5)
    Target:
      - difficulty_adjustment (-1: Decrease, 0: Maintain, 1: Increase)
    """
    print(f"Generating {num_samples} samples...")
    
    headers = [
        "last_correct", 
        "response_time_s", 
        "attention_score", 
        "frustration_score", 
        "current_difficulty", 
        "difficulty_adjustment"
    ]
    
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        
        for _ in range(num_samples):
            # Randomize inputs
            last_correct = random.choice([0, 1])
            response_time_s = round(random.uniform(2.0, 45.0), 1)
            attention_score = round(random.uniform(0.1, 1.0), 2)
            frustration_score = round(random.uniform(0.0, 0.9), 2)
            current_difficulty = random.randint(1, 5)
            
            # Heuristic logic for the label
            # Base condition: Maintain difficulty
            adjustment = 0 
            
            if last_correct == 1:
                # Answered correctly
                if response_time_s < 10.0 and attention_score > 0.7 and frustration_score < 0.3:
                    # Fast, attentive, not frustrated -> Too easy
                    if current_difficulty < 5:
                        adjustment = 1
                elif response_time_s > 25.0 and frustration_score > 0.6:
                    # Correct but struggled and frustrated -> Probably guessed or stressed, decrease
                    if current_difficulty > 1:
                        adjustment = -1
            else:
                # Answered incorrectly
                if response_time_s > 15.0 and frustration_score > 0.5:
                    # Tried hard but failed and frustrated -> Too hard
                    if current_difficulty > 1:
                        adjustment = -1
                elif response_time_s < 5.0 and attention_score < 0.4:
                    # Guessed quickly without paying attention -> Maintain (need them to focus, not make it easier)
                    adjustment = 0
                else:
                    # Normal incorrect -> Decrease slightly to build confidence
                    if current_difficulty > 1:
                        adjustment = -1
            
            writer.writerow([
                last_correct,
                response_time_s,
                attention_score,
                frustration_score,
                current_difficulty,
                adjustment
            ])
            
    print(f"Dataset generated successfully at {output_file}")

if __name__ == "__main__":
    generate_math_dataset(15000, "dataset/math_dataset.csv")
