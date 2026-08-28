import os
import sys
import numpy as np

# Force UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from core_english.mti_rules import sri_lankan_mti_engine
from core_english.fluency_prosody import fluency_prosody_analyzer
import librosa
import soundfile as sf
import tempfile
import pyttsx3

TMP_DIR = tempfile.mkdtemp(prefix="mti_local_")

TEST_CASES = [
    ("film", "film", "pilm", "F/P Substitution"),
    ("space", "space", "is space", "S-Cluster Prosthesis"),
    ("these", "these", "dees", "TH Substitution"),
    ("welcome", "welcome", "velcome", "V/W Merger"),
    ("bus", "bus", "busa", "Paragoge"),
]

def synth(text, path, rate=130):
    engine = pyttsx3.init()
    engine.setProperty('rate', rate)
    engine.save_to_file(text, path)
    engine.runAndWait()
    engine.stop()

def run_local_test():
    print(f"Testing MTI locally. Audio saved to {TMP_DIR}")
    for word, correct_tts, wrong_tts, expected_pattern in TEST_CASES:
        for is_correct in [True, False]:
            phrase = correct_tts if is_correct else wrong_tts
            path = os.path.join(TMP_DIR, f"{word}_{'correct' if is_correct else 'wrong'}.wav")
            synth(phrase, path, rate=135 if is_correct else 120)
            
            y, sr = librosa.load(path, sr=16000)
            
            # Evaluate using MTI engine directly
            res = sri_lankan_mti_engine.evaluate(y, word, False, False)
            
            pattern = res.get("primary_mti_flag")
            
            if is_correct:
                status = "PASS" if pattern is None else "FAIL (False Positive)"
            else:
                status = "PASS" if pattern is not None else "FAIL (Missed MTI)"
                
            print(f"[{word}] {'CORRECT' if is_correct else 'WRONG  '} -> Detected: {pattern!r} | {status}")
            
if __name__ == "__main__":
    run_local_test()
