import os
import sys
import numpy as np
import librosa
import tempfile
import pyttsx3

TMP_DIR = tempfile.mkdtemp(prefix="mti_debug_")

TEST_CASES = [
    ("film", "film", "pilm", "F/P Substitution"),
    ("welcome", "welcome", "velcome", "V/W Merger"),
    ("bus", "bus", "busa", "Paragoge"),
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
            
            # Extract features exactly as mti_rules.py does
            y_trim, _ = librosa.effects.trim(y, top_db=30)
            S_trim = np.abs(librosa.stft(y_trim))
            cent = librosa.feature.spectral_centroid(y=y_trim, sr=sr)[0]
            zcr = librosa.feature.zero_crossing_rate(y_trim)[0]
            
            print(f"\n[{word}] {'CORRECT' if is_correct else 'WRONG'}:")
            
            if word == "film":
                onset_len = max(3, int(S_trim.shape[1] * 0.30))
                high = float(np.mean(S_trim[25:, :onset_len]))
                low  = float(np.mean(S_trim[:12, :onset_len]))
                plosive_ratio = low / (high + 1e-6)
                print(f"  F/P Substitution: plosive_ratio = {plosive_ratio:.2f}")
                
            elif word == "welcome":
                onset_cent = float(np.mean(cent[:max(2, int(len(cent) * 0.25))]))
                onset_zcr = float(np.mean(zcr[:max(2, int(len(zcr) * 0.25))]))
                print(f"  V/W Merger: onset_cent = {onset_cent:.0f}, onset_zcr = {onset_zcr:.4f}")
                
            elif word == "bus":
                coda_cent = float(np.mean(cent[-max(2, int(len(cent) * 0.2)):]))
                coda_zcr = float(np.mean(zcr[-max(2, int(len(zcr) * 0.2)):]))
                print(f"  Paragoge: coda_cent = {coda_cent:.0f}, coda_zcr = {coda_zcr:.4f}, duration = {len(y_trim)/sr:.2f}s")

if __name__ == "__main__":
    debug_features()
