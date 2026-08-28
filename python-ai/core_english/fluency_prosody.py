import numpy as np
import librosa
from typing import Dict, Any, List

class FluencyProsodyAnalyzer:
    """
    Objective Acoustic Signal Analyzer for Primary Speaking Assessment:
    - Pitch / F0 Contour (pYIN/yin algorithm)
    - Speech Rate (Words Per Minute / Syllables Per Second)
    - Pause Metrics (Pause Ratio, Long Pauses >500ms and >1000ms)
    - Intonation Slope (Rising Question Intonation vs Falling Statement Intonation)
    - Repetitions, Restarts & Energy Variation
    """
    def __init__(self, sr: int = 16000):
        self.sr = sr
        
    def analyze(self, y: np.ndarray, target_text: str = "", expected_is_question: bool = False) -> Dict[str, Any]:
        """Runs acoustic fluency and prosody extraction over the standardized audio array."""
        duration = float(librosa.get_duration(y=y, sr=self.sr))
        if duration < 0.1 or len(y) < 1600:
            return {
                "speech_rate_wpm": 0.0,
                "articulation_rate": 0.0,
                "total_duration": duration,
                "speaking_duration": 0.0,
                "pause_count": 0,
                "pause_ratio": 0.0,
                "long_pauses_500ms": 0,
                "long_pauses_1000ms": 0,
                "f0_mean_hz": 0.0,
                "f0_variance": 0.0,
                "f0_range_hz": 0.0,
                "intonation_slope": "Flat",
                "is_monotone": True,
                "fluency_score": 0.0,
                "prosody_score": 0.0
            }
            
        # 1. Voice Activity & Energy Envelopes
        frame_len = int(0.025 * self.sr) # 25ms
        hop_len = int(0.010 * self.sr)   # 10ms
        rms = librosa.feature.rms(y=y, frame_length=frame_len, hop_length=hop_len)[0]
        
        peak_rms = float(np.max(rms)) if len(rms) > 0 else 0.001
        threshold = max(0.015, peak_rms * 0.15)
        voiced_frames = rms > threshold
        
        # 2. Pause & Silence Analysis
        # Count contiguous non-voiced frame segments
        pauses_samples = []
        current_pause_len = 0
        
        for v in voiced_frames:
            if not v:
                current_pause_len += 1
            else:
                if current_pause_len > 0:
                    pauses_samples.append(current_pause_len * 0.010) # in seconds
                    current_pause_len = 0
        if current_pause_len > 0:
            pauses_samples.append(current_pause_len * 0.010)
            
        # Filter pauses: significant pauses are >= 200ms
        sig_pauses = [p for p in pauses_samples if p >= 0.20]
        long_pauses_500 = len([p for p in pauses_samples if p >= 0.50])
        long_pauses_1000 = len([p for p in pauses_samples if p >= 1.00])
        
        total_pause_dur = sum(sig_pauses)
        speaking_dur = max(0.1, duration - total_pause_dur)
        pause_ratio = float(total_pause_dur / max(0.1, duration))
        
        # 3. Speech Rate (WPM & Syllables/sec)
        words_count = max(1, len(target_text.split())) if target_text else 1
        speech_rate_wpm = float((words_count / duration) * 60.0)
        articulation_rate = float(words_count / speaking_dur)
        
        # 4. F0 Pitch Contour Extraction (using Yin)
        f0_mean = 0.0
        f0_variance = 0.0
        f0_range = 0.0
        intonation_slope = "Neutral"
        is_monotone = False
        
        try:
            f0 = librosa.yin(y, fmin=80, fmax=450, sr=self.sr, frame_length=frame_len, hop_length=hop_len)
            f0_voiced = f0[(f0 > 80) & (f0 < 450)]
            
            if len(f0_voiced) > 5:
                f0_mean = float(np.mean(f0_voiced))
                f0_variance = float(np.std(f0_voiced))
                f0_range = float(np.max(f0_voiced) - np.min(f0_voiced))
                
                # Sentence-final pitch trajectory (last 25% of voiced speech)
                final_split = int(len(f0_voiced) * 0.75)
                f0_final = f0_voiced[final_split:]
                if len(f0_final) > 2:
                    slope = float(f0_final[-1] - f0_final[0])
                    if slope > 25.0:
                        intonation_slope = "Rising (Question Style)"
                    elif slope < -25.0:
                        intonation_slope = "Falling (Statement Style)"
                    else:
                        intonation_slope = "Flat (Neutral)"
                        
                if f0_variance < 12.0 or f0_range < 25.0:
                    is_monotone = True
        except Exception as e:
            print(f"[DEBUG] F0 extraction notice: {e}")
            
        # Check if voiced frames actually exist
        voiced_count = np.sum(voiced_frames)
        if voiced_count < 10 or len(f0_voiced) < 3 or peak_rms < 0.01:
            return {
                "speech_rate_wpm": 0.0,
                "articulation_rate": 0.0,
                "total_duration": round(duration, 2),
                "speaking_duration": 0.0,
                "pause_count": 0,
                "pause_ratio": 1.0,
                "long_pauses_500ms": 0,
                "long_pauses_1000ms": 0,
                "f0_mean_hz": 0.0,
                "f0_variance": 0.0,
                "f0_range_hz": 0.0,
                "intonation_slope": "None (No Voice)",
                "is_monotone": False,
                "fluency_score": 0.0,
                "prosody_score": 0.0
            }
            
        # 5. Fluency & Prosody Aggregate Scoring (0 - 100)
        # Optimal child speaking rate: 60 - 110 WPM for primary grades
        if speech_rate_wpm < 30:
            rate_score = 40.0
        elif speech_rate_wpm <= 120:
            rate_score = 95.0
        else:
            rate_score = 75.0 # too fast
            
        pause_penalty = min(35.0, (long_pauses_500 * 8.0) + (long_pauses_1000 * 15.0) + (pause_ratio * 30.0))
        fluency_score = max(0.0, min(100.0, rate_score - pause_penalty))
        
        prosody_score = 90.0
        if is_monotone:
            prosody_score -= 25.0
        if expected_is_question and "Rising" not in intonation_slope:
            prosody_score -= 15.0
        elif not expected_is_question and "Rising" in intonation_slope:
            prosody_score -= 10.0
            
        return {
            "speech_rate_wpm": round(speech_rate_wpm, 1),
            "articulation_rate": round(articulation_rate, 2),
            "total_duration": round(duration, 2),
            "speaking_duration": round(speaking_dur, 2),
            "pause_count": len(sig_pauses),
            "pause_ratio": round(pause_ratio, 2),
            "long_pauses_500ms": long_pauses_500,
            "long_pauses_1000ms": long_pauses_1000,
            "f0_mean_hz": round(f0_mean, 1),
            "f0_variance": round(f0_variance, 1),
            "f0_range_hz": round(f0_range, 1),
            "intonation_slope": intonation_slope,
            "is_monotone": is_monotone,
            "fluency_score": round(fluency_score, 1),
            "prosody_score": round(prosody_score, 1)
        }

fluency_prosody_analyzer = FluencyProsodyAnalyzer()
