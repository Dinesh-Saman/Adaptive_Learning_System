import os
import sys
import numpy as np
import librosa

SAVE_DIR = "human_calibration_voices"

TEST_CASES = [
    ("film", "F_P_SUBSTITUTION"),
    ("space", "S_CLUSTER_PROSTHESIS"),
    ("welcome", "V_W_MERGER"),
    ("bus", "PARAGOGE"),
]

def calibrate():
    print("="*60)
    print(" HUMAN VOICE MTI CALIBRATION ANALYSIS")
    print("="*60)
    
    for word, pattern in TEST_CASES:
        print(f"\n--- Analyzing '{word}' ---")
        for type_label in ["correct", "wrong"]:
            path = os.path.join(SAVE_DIR, f"{word}_{type_label}.wav")
            if not os.path.exists(path):
                print(f"File missing: {path}")
                continue
                
            y, sr = librosa.load(path, sr=16000)
            
            # Exact VAD from mti_rules.py
            peak = float(np.max(np.abs(y)))
            speech_idx = np.where(np.abs(y) > 0.05 * peak)[0]
            if len(speech_idx) > 0:
                y_trim = y[speech_idx[0]:speech_idx[-1]]
            else:
                y_trim = y
                
            zcr = librosa.feature.zero_crossing_rate(y_trim)[0]
            cent = librosa.feature.spectral_centroid(y=y_trim, sr=sr)[0]
            S = librosa.feature.melspectrogram(y=y_trim, sr=sr, n_mels=40)
            
            print(f"[{type_label.upper()}] Peak Vol: {peak:.3f}")
            
            if word == "film":
                onset_len = max(3, int(S.shape[1] * 0.30))
                high = float(np.mean(S[25:, :onset_len]))
                low  = float(np.mean(S[:12, :onset_len]))
                plosive_ratio = low / (high + 1e-6)
                print(f"  -> F/P Substitution (plosive_ratio): {plosive_ratio:.2f}")
                
            elif word == "space":
                p1 = float(np.mean(cent[:max(2, int(len(cent) * 0.15))]))
                p2 = float(np.mean(cent[max(2, int(len(cent) * 0.15)):max(4, int(len(cent) * 0.40))]))
                print(f"  -> S-Cluster (p1_cent): {p1:.0f}Hz, (p2_cent): {p2:.0f}Hz, Diff: {p2-p1:.0f}Hz")
                
            elif word == "welcome":
                onset_cent = float(np.mean(cent[:max(2, int(len(cent) * 0.25))]))
                onset_zcr = float(np.mean(zcr[:max(2, int(len(zcr) * 0.25))]))
                print(f"  -> V/W Merger (onset_cent): {onset_cent:.0f}Hz, (onset_zcr): {onset_zcr:.4f}")
                
            elif word == "bus":
                coda_cent = float(np.mean(cent[-max(2, int(len(cent) * 0.2)):]))
                print(f"  -> Paragoge (coda_cent): {coda_cent:.0f}Hz")

if __name__ == "__main__":
    calibrate()
