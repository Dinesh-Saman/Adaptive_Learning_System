import os
import sys
import json
import base64
import soundfile as sf
import numpy as np

# Add parent directory so we can import from main or core_english
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
CORE_ENGLISH_DIR = os.path.dirname(CURRENT_DIR)
PYTHON_AI_DIR = os.path.dirname(CORE_ENGLISH_DIR)
sys.path.insert(0, PYTHON_AI_DIR)
sys.path.insert(0, CORE_ENGLISH_DIR)

from fluency_prosody import fluency_prosody_analyzer
from mti_rules import sri_lankan_mti_engine

MANIFEST_PATH = os.path.join(CORE_ENGLISH_DIR, "dataset", "human_recorded_audios", "manifest.json")
WAV_DIR = os.path.join(CORE_ENGLISH_DIR, "dataset", "human_recorded_audios", "wav_16k")

def evaluate_all_recordings():
    if not os.path.exists(MANIFEST_PATH):
        print(f"Error: Manifest not found at {MANIFEST_PATH}")
        return
        
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)
        
    print("=" * 80)
    print(f"EVALUATING {len(manifest)} HUMAN RECORDED AUDIOS (ENGLISH PRONUNCIATION & ACOUSTICS)")
    print("=" * 80)
    
    evaluated_results = []
    
    for idx, item in enumerate(manifest):
        wav_file = os.path.join(CORE_ENGLISH_DIR, "dataset", "human_recorded_audios", "wav_16k", item["wav_filename"])
        if not os.path.exists(wav_file):
            continue
            
        data, sr = sf.read(wav_file)
        if data.ndim > 1:
            data = data.mean(axis=1)
            
        peak = float(np.max(np.abs(data)))
        duration = float(len(data)) / float(sr)
        
        # Run fluency & acoustic metrics
        fluency = {}
        if fluency_prosody_analyzer is not None:
            fluency = fluency_prosody_analyzer.analyze(
                y=data,
                spoken_text="",
                target_text="school", # sample target
                response_latency_ms=100.0
            )
            
        # Run acoustic MTI engine
        mti_res = {}
        if sri_lankan_mti_engine is not None:
            mti_res = sri_lankan_mti_engine.evaluate(data, target_word="school")
            
        result_entry = {
            "id": item["id"],
            "filename": item["original_file"],
            "wav_filename": item["wav_filename"],
            "duration": round(duration, 2),
            "peak_amplitude": round(peak, 4),
            "clarity": "Clear Audio" if peak > 0.05 else "Low Volume / Whisper",
            "detected_mti": [p.get("pattern_name", p.get("key")) for p in mti_res.get("detected_patterns", [])]
        }
        evaluated_results.append(result_entry)
        
        mti_str = ", ".join(result_entry["detected_mti"]) if result_entry["detected_mti"] else "None (Clear Phonetics)"
        print(f"[{item['id']}] {item['original_file']} | Dur: {duration:.2f}s | Vol: {peak:.3f} | MTI: {mti_str}")
        
    # Save evaluation summary
    summary_path = os.path.join(CORE_ENGLISH_DIR, "dataset", "human_recorded_audios", "evaluation_summary.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(evaluated_results, f, indent=2)
        
    print("\n" + "=" * 80)
    print(f"[+] Successfully evaluated all {len(evaluated_results)} recordings!")
    print(f"[+] Results summary saved to: {summary_path}")
    print("=" * 80)

if __name__ == "__main__":
    evaluate_all_recordings()
