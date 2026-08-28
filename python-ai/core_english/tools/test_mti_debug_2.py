import os
import sys
import numpy as np
import librosa
import tempfile
import pyttsx3

TMP_DIR = tempfile.mkdtemp(prefix="mti_debug_2_")

TEST_CASES = [
    ("film", "film", "pilm", "F/P Substitution"),
    ("welcome", "welcome", "velcome", "V/W Merger"),
]

def synth(text, path, rate=130):
    engine = pyttsx3.init()
    engine.setProperty('rate', rate)
    engine.save_to_file(text, path)
    engine.runAndWait()
    engine.stop()

def debug_features():
    for word, correct_tts, wrong_tts, expected_pattern in TEST_CASES:
        for is_correct in [True, False]:
            phrase = correct_tts if is_correct else wrong_tts
            path = os.path.join(TMP_DIR, f"{word}_{'correct' if is_correct else 'wrong'}.wav")
            synth(phrase, path, rate=135 if is_correct else 120)
            
            y, sr = librosa.load(path, sr=16000)
            
            # Use EXACTLY the VAD from mti_rules.py
            peak = float(np.max(np.abs(y)))
            speech_idx = np.where(np.abs(y) > 0.05 * peak)[0]
            if len(speech_idx) > 0:
                y_trim = y[speech_idx[0]:speech_idx[-1]]
            else:
                y_trim = y
                
            zcr = librosa.feature.zero_crossing_rate(y_trim)[0]
            cent = librosa.feature.spectral_centroid(y=y_trim, sr=sr)[0]
            S = librosa.feature.melspectrogram(y=y_trim, sr=sr, n_mels=40)
            
            print(f"\n[{word}] {'CORRECT' if is_correct else 'WRONG'}:")
            
            if word == "film":
                onset_len = max(3, int(S.shape[1] * 0.30))
                high = float(np.mean(S[25:, :onset_len]))
                low  = float(np.mean(S[:12, :onset_len]))
                plosive_ratio = low / (high + 1e-6)
                print(f"  F/P Substitution: plosive_ratio = {plosive_ratio:.2f}")
                
            elif word == "welcome":
                onset_cent = float(np.mean(cent[:max(2, int(len(cent) * 0.25))]))
                onset_zcr = float(np.mean(zcr[:max(2, int(len(zcr) * 0.25))]))
                print(f"  V/W Merger: onset_cent = {onset_cent:.0f}, onset_zcr = {onset_zcr:.4f}")

if __name__ == "__main__":
    debug_features()
