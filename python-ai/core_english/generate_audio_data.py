import os
import numpy as np

def generate_mfcc_dataset(num_samples=5000, output_dir="dataset"):
    """
    Generates synthetic MFCC features representing different pronunciation classes.
    In a real scenario, this would load .wav files and extract features via librosa.
    
    Classes:
    0: Correct Pronunciation
    1: TH -> D error (e.g. Think -> Dink)
    2: F -> P error (e.g. Fish -> Pish)
    3: Vowel Lengthening error (e.g. Ship -> Sheep)
    """
    os.makedirs(output_dir, exist_ok=True)
    print(f"Generating {num_samples} synthetic MFCC arrays...")
    
    # We will simulate 40 MFCC coefficients
    features = []
    labels = []
    
    for _ in range(num_samples):
        label = np.random.randint(0, 4)
        
        # Base MFCC shape (simulating 40 coefficients)
        mfcc = np.random.normal(loc=0.0, scale=1.0, size=40)
        
        # Add distinct signal patterns for the neural net to learn
        if label == 0:
            mfcc[10:15] += 3.0 # Correct signature
        elif label == 1:
            mfcc[0:5] += 4.0   # TH->D signature
        elif label == 2:
            mfcc[20:25] -= 3.5 # F->P signature
        elif label == 3:
            mfcc[30:35] += 2.5 # Vowel lengthening signature
            
        features.append(mfcc)
        labels.append(label)
        
    # Check and merge real human recorded voice features if available
    human_feat_path = os.path.join(output_dir, "human_recorded_audios", "human_features.npy")
    if os.path.exists(human_feat_path):
        human_feats = np.load(human_feat_path)
        human_labels = np.zeros(len(human_feats), dtype=np.int64)
        features.extend(human_feats)
        labels.extend(human_labels)
        print(f"Merged {len(human_feats)} real human recorded voice samples from {human_feat_path}!")

    # Save as numpy arrays
    np.save(os.path.join(output_dir, "english_features.npy"), np.array(features))
    np.save(os.path.join(output_dir, "english_labels.npy"), np.array(labels))
    
    print(f"Dataset generated at {output_dir}/english_features.npy (Total samples: {len(features)})")

if __name__ == "__main__":
    generate_mfcc_dataset()
