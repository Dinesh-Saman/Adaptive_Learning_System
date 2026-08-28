"""
Automated MTI Detection Accuracy Testing Suite
==============================================
Uses Windows SAPI5 TTS via pyttsx3 to synthesize correct and wrong versions
of each target word, then tests the multi-stage pipeline until we hit
acceptable accuracy thresholds.

Usage:  python test_mti_accuracy.py
"""

import base64
import json
import os
import sys
import time
import tempfile
import urllib.request

# Force UTF-8 output on Windows to avoid cp1252 UnicodeEncodeError
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import numpy as np
import soundfile as sf

# ---------------------------------------------------------------------------
# Word list: (word, mti_pattern, correct_phoneme_hint, wrong_phrase_to_speak)
# wrong_phrase_to_speak is what SAPI says to approximate the MTI version
# ---------------------------------------------------------------------------
TEST_CASES = [
    # word,          mti_pattern,               correct_tts,   wrong_tts (MTI approximation)
    ("film",         "F/P Substitution",        "film",        "pilm"),
    ("space",        "S-Cluster Prosthesis",    "space",       "is space"),
    ("these",        "TH Substitution",         "these",       "dees"),
    ("welcome",      "V/W Merger",              "welcome",     "velcome"),
    ("bus",          "Paragoge",                "bus",         "busa"),
    ("friend",       "Final Consonant Weakening","friend",     "fren"),
    ("busy",         "Z/S Confusion",           "busy",        "bissy"),
    ("house",        "Initial H Deletion",      "house",       "owse"),
    ("beautiful",    "Stress/Rhythm Deviation", "beautiful",   "beau ti ful"),
    ("project",      "Cluster Simplification",  "project",     "projec"),
]

ENDPOINT = "http://127.0.0.1:8000/api/ai/english/pronunciation"
TMP_DIR  = tempfile.mkdtemp(prefix="mti_test_")

# ---------------------------------------------------------------------------
def synth_to_wav(text: str, output_path: str, rate: int = 140, voice_idx: int = 0) -> bool:
    """Synthesize text to WAV file using pyttsx3 (Windows SAPI)."""
    try:
        import pyttsx3
        engine = pyttsx3.init()
        voices = engine.getProperty('voices')
        if voices and voice_idx < len(voices):
            engine.setProperty('voice', voices[voice_idx].id)
        engine.setProperty('rate', rate)
        engine.setProperty('volume', 0.95)
        engine.save_to_file(text, output_path)
        engine.runAndWait()
        engine.stop()
        return os.path.exists(output_path) and os.path.getsize(output_path) > 1000
    except Exception as e:
        print(f"  [TTS ERROR] {e}")
        return False


def call_assessment(audio_path: str, target_word: str) -> dict | None:
    """Call the FastAPI assessment endpoint with a local audio file."""
    try:
        with open(audio_path, 'rb') as f:
            b64 = base64.b64encode(f.read()).decode()
        payload = {
            "student_id": "autotest",
            "audio_base64": b64,
            "target_text": target_word,
            "video_frames_base64": []
        }
        req = urllib.request.Request(
            ENDPOINT,
            data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"  [API ERROR] {e}")
        return None


def assess_batch(cases, iterations=3):
    """Run all test cases N times and compute accuracy."""
    correct_clean_detected   = 0  # correct speech -> no MTI flagged
    correct_mti_detected     = 0  # wrong speech  -> MTI correctly flagged
    total = len(cases) * iterations

    print("\n" + "="*70)
    print(f" MTI DETECTION ACCURACY TEST  ({iterations} iterations per case)")
    print("="*70)

    for word, pattern, correct_phrase, wrong_phrase in cases:
        clean_pass = 0
        mti_pass   = 0

        for i in range(iterations):
            # --- Correct pronunciation ---
            clean_wav = os.path.join(TMP_DIR, f"{word}_correct_{i}.wav")
            if synth_to_wav(correct_phrase, clean_wav, rate=135):
                res = call_assessment(clean_wav, word)
                if res:
                    detected = res.get("l1_contrast_flag")
                    score    = res.get("overall_score", 0)
                    diag     = res.get("diagnostics", {})
                    ok       = detected is None
                    if ok:
                        clean_pass += 1
                    status = "PASS" if ok else "FAIL (false positive)"
                    print(f"  [{word}] CORRECT  iter={i+1}  Score={score}%  Pattern={detected!r}  -> {status}")

            # --- Wrong pronunciation (MTI) ---
            wrong_wav = os.path.join(TMP_DIR, f"{word}_wrong_{i}.wav")
            if synth_to_wav(wrong_phrase, wrong_wav, rate=120):
                res = call_assessment(wrong_wav, word)
                if res:
                    detected = res.get("l1_contrast_flag")
                    score    = res.get("overall_score", 0)
                    ok       = detected is not None
                    if ok:
                        mti_pass += 1
                    status = "PASS" if ok else "FAIL (missed MTI)"
                    print(f"  [{word}] WRONG    iter={i+1}  Score={score}%  Pattern={detected!r}  -> {status}")

        correct_clean_detected += clean_pass
        correct_mti_detected   += mti_pass

        clean_acc = (clean_pass / iterations) * 100
        mti_acc   = (mti_pass  / iterations) * 100
        print(f"  >> [{word}] Clean accuracy: {clean_acc:.0f}%  |  MTI detection: {mti_acc:.0f}%")
        print()

    n = len(cases) * iterations
    overall_clean = (correct_clean_detected / n) * 100
    overall_mti   = (correct_mti_detected   / n) * 100
    overall_total = ((correct_clean_detected + correct_mti_detected) / (n * 2)) * 100

    print("="*70)
    print(f"  CLEAN SPEECH  -> Correctly NOT flagged:  {overall_clean:.1f}%")
    print(f"  MTI SPEECH    -> Correctly flagged:      {overall_mti:.1f}%")
    print(f"  OVERALL ACCURACY:                        {overall_total:.1f}%")
    print("="*70)
    return overall_total


if __name__ == "__main__":
    print(f"\nSynthesized audio files will be saved to: {TMP_DIR}")
    print("Checking Python AI server...")
    try:
        urllib.request.urlopen("http://127.0.0.1:8000/docs", timeout=3)
        print("  Python AI server: ONLINE\n")
    except:
        print("  ERROR: Python AI server not reachable at localhost:8000")
        print("  Run: python main.py  in D:\\Kids\\python-ai  first.")
        sys.exit(1)

    iterations = 3
    attempt    = 1

    while True:
        acc = assess_batch(TEST_CASES, iterations=iterations)
        print(f"\n[Attempt {attempt}] Overall Accuracy = {acc:.1f}%")

        if acc >= 70.0:
            print(f"\nTarget accuracy (70%) reached! System is ready.\n")
            break
        else:
            print(f"\nAccuracy below 70%. Diagnose and re-calibrate the MTI rules, then re-run.\n")
            break  # Remove this break to loop automatically after threshold tuning

        attempt += 1
