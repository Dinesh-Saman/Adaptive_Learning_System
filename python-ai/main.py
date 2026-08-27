from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import torch
import os
import sys

# Add core_math to path so we can import modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'core_math'))
from core_math.model import MultimodalFusionNet
from core_math.exercise_engine import generate_math_question
from core_english.audio_model import PronunciationNet
from core_handwriting.vision_model import HandwritingCNN
from core_handwriting.stroke_analyzer import analyze_stroke_quality
from core_handwriting.template_matcher import evaluate_handwriting as template_evaluate
from core_motor.pose_engine import evaluate_motor_skills

app = FastAPI(
    title="LearnAI - Python Microservices",
    description="AI backend for Multimodal Math, Speech, Vision, and Motor Skills",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global AI Model Loading ---
math_model = MultimodalFusionNet()
math_model_path = os.path.join(os.path.dirname(__file__), 'core_math', 'weights', 'math_model.pt')
if os.path.exists(math_model_path):
    math_model.load_state_dict(torch.load(math_model_path, weights_only=True))
    math_model.eval()
    print("SUCCESS: Successfully loaded PyTorch Math AI Model.")
else:
    print(f"WARNING: {math_model_path} not found. Neural Net will use random initialized weights.")

english_model = PronunciationNet()
english_model_path = os.path.join(os.path.dirname(__file__), 'core_english', 'weights', 'english_model.pt')
if os.path.exists(english_model_path):
    try:
        english_model.load_state_dict(torch.load(english_model_path, weights_only=True))
        english_model.eval()
        print("SUCCESS: Successfully loaded PyTorch English Audio AI Model.")
    except RuntimeError as e:
        print(f"WARNING: Incompatible model weights found. The architecture has expanded to 13 classes. Using random initialized weights instead.")
else:
    print(f"WARNING: {english_model_path} not found. Audio Neural Net will use random initialized weights.")

# Global Whisper ASR Model Holder (Loaded Lazily on First Audio Call for Instant Startup)
whisper_asr_model = None

def get_whisper_model():
    global whisper_asr_model
    if whisper_asr_model is None:
        try:
            from faster_whisper import WhisperModel
            whisper_asr_model = WhisperModel('tiny.en', device='cpu', compute_type='int8')
            print("SUCCESS: Successfully loaded Offline Whisper ASR Model (tiny.en).")
        except Exception as e:
            print(f"WARNING: Offline Whisper ASR could not be loaded: {e}")
    return whisper_asr_model

handwriting_model = HandwritingCNN()

# Visual Lip Movement & Viseme Kinematic Analyzer
try:
    from core_english.lip_analysis import visual_lip_analyzer
    print("SUCCESS: Successfully loaded Visual Lip Analyzer (OpenCV).")
except Exception as e:
    visual_lip_analyzer = None
    print(f"WARNING: Visual Lip Analyzer could not be loaded: {e}")



handwriting_model_path = os.path.join(os.path.dirname(__file__), 'core_handwriting', 'weights', 'handwriting_model.pt')
if os.path.exists(handwriting_model_path):
    handwriting_model.load_state_dict(torch.load(handwriting_model_path, weights_only=True))
    handwriting_model.eval()
    print("SUCCESS: Successfully loaded PyTorch Handwriting Vision AI Model.")
else:
    print(f"WARNING: {handwriting_model_path} not found. Vision Neural Net will use random initialized weights.")

from core_math.exercise_engine import generate_math_question, SKILL_TYPES

# Diagnostic Session Tracker for Mathematics
math_diagnostic_sessions = {}

class MathPerformanceData(BaseModel):
    student_id: str
    exercise_id: str = "mixed"
    last_type_id: str = None
    last_correct: bool = False
    t_main_ms: int = 5000
    t_sub_avg_ms: int = 5000
    t_idle_ms: int = 0
    t_resp_ms: int = 1000
    scroll_velocity: float = 0.0
    affect_confusion: float = 0.0  # 0 to 1
    accuracy: float = 0.0
    session_reset: bool = False

EXERCISE_CATEGORIES = {
    "arithmetic": ["G4_ADD_4DIGIT", "G4_SUB_3DIGIT", "G4_MUL_2DIGIT", "G4_DIV_3DIGIT", "G4_DIV_REMAINDER", "G4_ROMAN_NUMERALS", "G4_NUMBER_PATTERNS", "G4_FACTORS", "G4_MULTIPLES", "G4_NUMBER_NAMES", "G4_PLACE_VALUE", "G4_NUMBER_FORMING", "G4_SUB_MISSING_NUMBER", "G4_SUB_TWO_STEP", "G4_NUMBER_EXPANDED_FORM", "G4_NUMBER_SORTING", "G4_MUL_MISSING_NUMBER"],
    "fractions": ["G4_DECIMAL_TENTHS", "G4_DECIMAL_ADD", "G4_FRACTION_IDENTIFY", "G4_FRACTION_ADD", "G4_FRACTION_SUB", "G4_FRACTION_EQUIVALENT", "G4_FRACTION_OF_SET", "G4_FRACTION_WORD_PROBLEM"],
    "geometry": ["G4_SYMMETRY", "G4_PERIMETER_SQUARE", "G4_PERIMETER_RECT", "G4_AREA_SQUARE", "G4_WEIGHT_GRAMS", "G4_WEIGHT_KG", "G4_VOLUME_ML", "G4_VOLUME_L", "G4_ANGLES_RIGHT", "G4_LINES_PARALLEL", "G4_LINES_PERPENDICULAR", "G4_LENGTH_M_TO_CM", "G4_LENGTH_CM_TO_M_CM", "G4_DIRECTIONS", "G4_LENGTH_ADD", "G4_LENGTH_SUB", "G4_WEIGHT_ADD", "G4_WEIGHT_SUB", "G4_WEIGHT_PUZZLE", "G4_VOLUME_ADD", "G4_VOLUME_SUB", "G4_3D_VIEWS", "G4_VOLUME_PUZZLE"],
    "time_money": ["G4_TIME_HOURS_MINS", "G4_TIME_ELAPSED", "G4_MONEY_NOTES", "G4_MONEY_CHANGE", "G4_TIME_UNITS", "G4_CALENDAR", "G4_MONEY_COIN_CONVERSIONS", "G4_TIME_CLOCK", "G4_MONEY_PUZZLE", "G4_MONEY_ADD", "G4_MONEY_BILL"],
    "data_word": ["G4_WORD_ADD", "G4_WORD_SUB", "G4_WORD_MUL", "G4_WORD_DIV", "G4_DATA_BAR_GRAPH", "G4_DATA_PICTOGRAPH", "G4_DATA_TABLE"],
    "mixed": SKILL_TYPES,
    "chapter_1": ["G4_NUMBER_NAMES", "G4_PLACE_VALUE", "G4_NUMBER_EXPANDED_FORM", "G4_NUMBER_SORTING"],
    "chapter_2": ["G4_ADD_4DIGIT", "G4_WORD_ADD"],
    "chapter_3": ["G4_LENGTH_M_TO_CM", "G4_LENGTH_CM_TO_M_CM"],
    "chapter_4": ["G4_SUB_3DIGIT", "G4_WORD_SUB"],
    "chapter_5": ["G4_NUMBER_PATTERNS"],
    "chapter_6": ["G4_MUL_2DIGIT", "G4_WORD_MUL"],
    "chapter_7": ["G4_FRACTION_IDENTIFY", "G4_FRACTION_EQUIVALENT", "G4_FRACTION_ADD", "G4_FRACTION_SUB", "G4_FRACTION_OF_SET", "G4_FRACTION_WORD_PROBLEM", "G4_DECIMAL_TENTHS", "G4_DECIMAL_ADD"],
    "chapter_8": ["G4_SYMMETRY", "G4_3D_VIEWS"],
    "chapter_9": ["G4_NUMBER_FORMING", "G4_ROMAN_NUMERALS"],
    "chapter_10": ["G4_DATA_PICTOGRAPH"],
    "chapter_11": ["G4_DIV_3DIGIT", "G4_WORD_DIV"],
    "chapter_12": SKILL_TYPES,
    "chapter_13": ["G4_VOLUME_ML", "G4_VOLUME_L"],
    "chapter_14": ["G4_WEIGHT_GRAMS", "G4_WEIGHT_KG"],
    "chapter_15": ["G4_DIRECTIONS"],
    "chapter_16": ["G4_ADD_4DIGIT", "G4_WORD_ADD"],
    "chapter_17": ["G4_TIME_CLOCK", "G4_TIME_UNITS"],
    "chapter_18": ["G4_SUB_3DIGIT", "G4_SUB_MISSING_NUMBER", "G4_WORD_SUB"],
    "chapter_19": ["G4_MONEY_COIN_CONVERSIONS", "G4_MONEY_NOTES"],
    "chapter_20": ["G4_MUL_2DIGIT", "G4_MUL_MISSING_NUMBER"],
    "chapter_21": ["G4_LENGTH_ADD", "G4_LENGTH_SUB"],
    "chapter_22": ["G4_TIME_HOURS_MINS", "G4_TIME_ELAPSED", "G4_CALENDAR"],
    "chapter_23": ["G4_DIV_3DIGIT", "G4_DIV_REMAINDER", "G4_WORD_DIV"],
    "chapter_24": SKILL_TYPES,
    "chapter_25": ["G4_FACTORS", "G4_MULTIPLES"],
    "chapter_26": ["G4_ADD_4DIGIT", "G4_WORD_ADD"],
    "chapter_27": ["G4_WEIGHT_ADD", "G4_WEIGHT_SUB", "G4_WEIGHT_PUZZLE"],
    "chapter_28": ["G4_SUB_TWO_STEP", "G4_WORD_SUB"],
    "chapter_29": ["G4_VOLUME_ADD", "G4_VOLUME_SUB", "G4_VOLUME_PUZZLE"],
    "chapter_30": ["G4_MUL_2DIGIT", "G4_WORD_MUL"],
    "chapter_31": ["G4_DIV_3DIGIT", "G4_WORD_DIV"],
    "chapter_32": ["G4_ROMAN_NUMERALS"],
    "chapter_33": ["G4_DATA_BAR_GRAPH", "G4_DATA_TABLE"],
    "chapter_34": ["G4_MONEY_ADD", "G4_MONEY_CHANGE", "G4_MONEY_PUZZLE", "G4_MONEY_BILL"],
    "chapter_35": ["G4_PERIMETER_SQUARE", "G4_PERIMETER_RECT", "G4_AREA_SQUARE", "G4_ANGLES_RIGHT", "G4_LINES_PARALLEL", "G4_LINES_PERPENDICULAR"],
    "chapter_36": SKILL_TYPES
}

class SpeechAudioData(BaseModel):
    student_id: str
    audio_base64: str
    target_text: str = ""
    video_frames_base64: list[str] = []

class HandwritingImageData(BaseModel):
    student_id: str
    image_base64: str
    target_letter: str = "ක"  # The letter shown to the student, default to 'ක'
    reference_base64: str = ""  # Browser-rendered reference image of the target letter

class MotorTrackingData(BaseModel):
    student_id: str
    video_frames_base64: list[str]

class CreativeAssessmentData(BaseModel):
    student_id: str
    activity_type: str # e.g., "Painting", "Handwork", "Singing", "Dancing"
    activity_name: str # e.g., "Draw and colour a butterfly", "Paper Flower"
    current_level: int = 1
    media_base64: str # Could be image, video, or audio base64
    historical_weaknesses: list[str] = [] # List of previously identified weaknesses

class StoryDrawingData(BaseModel):
    student_id: str
    image_base64: str
    expected_elements: list[str]

# ---------------------------------------------------------
# 1. Onel - Multimodal Adaptive Mathematics
# ---------------------------------------------------------
@app.post("/api/ai/math/evaluate")
def evaluate_math_difficulty(data: MathPerformanceData):
    """
    Diagnostic Engine: Evaluates a 20-question session.
    Determines mathematical weaknesses using Accuracy, Solving Time, and Camera Emotion (Frustration).
    """
    student_id = data.student_id
    
    # Initialize or reset session
    if student_id not in math_diagnostic_sessions or data.session_reset:
        math_diagnostic_sessions[student_id] = {
            "questions_asked": 0,
            "strengths": [],
            "weaknesses": [],
            "difficulty": 1,
            "asked_ids": [],
            "asked_texts": [],
            "history": []
        }
        
    session = math_diagnostic_sessions[student_id]
    diff_msg = "Level Maintained ➡️"
    
    # Process the last answered question if available
    if data.last_type_id and session["questions_asked"] < 10:
        session["questions_asked"] += 1
        
        # Track history
        session["history"].append({
            "type_id": data.last_type_id,
            "correct": data.accuracy == 1,
            "time_ms": data.t_main_ms,
            "frustration": data.affect_confusion
        })
        
        # Calculate Mastery Score based on Accuracy, Time, and Emotion
        mu_time = 8000.0 # Expected normal solve time
        time_ratio = min(data.t_main_ms / mu_time, 2.0)
        
        # Mastery = Accuracy heavily weighted, penalized by frustration and long time
        mastery = (data.accuracy * 0.5) + ((1.0 - data.affect_confusion) * 0.3) + ((1.0 - (time_ratio/2)) * 0.2)
        
        old_diff = session["difficulty"]
        if mastery < 0.45 or data.accuracy == 0:
            if data.last_type_id not in session["weaknesses"]:
                session["weaknesses"].append(data.last_type_id)
            session["difficulty"] = max(1, session["difficulty"] - 1)
        elif mastery > 0.75:
            if data.last_type_id not in session["strengths"]:
                session["strengths"].append(data.last_type_id)
            session["difficulty"] = min(3, session["difficulty"] + 1)
        else:
            # Maintain level
            pass
            
        # Generate explicit difficulty shift strings
        if session["difficulty"] > old_diff:
            diff_msg = "Great job! The AI is increasing the complexity for the next question 📈"
        elif session["difficulty"] < old_diff:
            diff_msg = "Let's try a slightly easier question to build confidence 📉"
        else:
            diff_msg = f"Level Maintained at Tier {session['difficulty']} ➡️"

    # Check if session complete
    if session["questions_asked"] >= 10:
        # Aggregate Analytical Summary
        history = session["history"]
        
        topic_stats = {}
        for h in history:
            t = h["type_id"]
            if t not in topic_stats:
                topic_stats[t] = {"correct": 0, "total": 0, "time": 0, "frustration": 0}
            topic_stats[t]["correct"] += 1 if h["correct"] else 0
            topic_stats[t]["total"] += 1
            topic_stats[t]["time"] += h["time_ms"]
            topic_stats[t]["frustration"] += h["frustration"]
            
        summary = {
            "overall_accuracy": 0,
            "strongest_topics": [],
            "weakest_topics": [],
            "time_sink_topic": None,
            "frustrating_topic": None,
            "text_summary": ""
        }
        
        if history:
            summary["overall_accuracy"] = round((sum(1 for h in history if h["correct"]) / len(history)) * 100)
            
            # Averages per topic
            for t, stats in topic_stats.items():
                stats["acc_rate"] = stats["correct"] / stats["total"]
                stats["avg_time"] = stats["time"] / stats["total"]
                stats["avg_frust"] = stats["frustration"] / stats["total"]
                
            sorted_by_acc = sorted(topic_stats.items(), key=lambda x: x[1]["acc_rate"], reverse=True)
            summary["strongest_topics"] = [x[0] for x in sorted_by_acc if x[1]["acc_rate"] >= 0.7]
            summary["weakest_topics"] = [x[0] for x in sorted_by_acc if x[1]["acc_rate"] <= 0.4]
            
            summary["time_sink_topic"] = max(topic_stats.items(), key=lambda x: x[1]["avg_time"])[0] if topic_stats else None
            summary["frustrating_topic"] = max(topic_stats.items(), key=lambda x: x[1]["avg_frust"])[0] if topic_stats else None
            
            text_parts = [f"You completed the session with {summary['overall_accuracy']}% accuracy."]
            if summary["strongest_topics"]:
                text_parts.append(f"You showed great mastery in {', '.join(summary['strongest_topics'][:2])}.")
            if summary["weakest_topics"]:
                text_parts.append(f"You should practice more on {', '.join(summary['weakest_topics'][:2])}.")
            if summary["time_sink_topic"]:
                text_parts.append(f"The topic '{summary['time_sink_topic']}' took you the longest time to solve on average.")
            if summary["frustrating_topic"]:
                text_parts.append(f"The camera noted highest frustration during '{summary['frustrating_topic']}'. Keep practicing!")
                
            summary["text_summary"] = " ".join(text_parts)

        return {
            "session_complete": True,
            "analytical_summary": summary,
            "message": "Diagnostic session complete! Here is your analytical summary."
        }
        
    # Pick next question dynamically
    cat_types = EXERCISE_CATEGORIES.get(data.exercise_id, SKILL_TYPES)
    next_question = generate_math_question(difficulty_level=session["difficulty"], asked_ids=session["asked_ids"], category_types=cat_types, asked_texts=session["asked_texts"])
    
    if next_question and "id" in next_question:
        session["asked_ids"].append(next_question["id"])
        if "text" in next_question:
            session["asked_texts"].append(next_question["text"])
    
    return {
        "session_complete": False,
        "questions_asked": session["questions_asked"],
        "total_questions": 10,
        "predicted_difficulty": diff_msg,
        "next_question": next_question,
        "weaknesses_identified": len(session["weaknesses"])
    }


# ---------------------------------------------------------
# 2. Suvinya - English Pronunciation AI
# ---------------------------------------------------------
@app.post("/api/ai/english/pronunciation")
def analyze_pronunciation(data: SpeechAudioData):
    """
    Advanced Multimodal English Speech Assessment Endpoint
    Evaluates 12 specific Sri Lankan MTI patterns and 6 advanced fluency/prosody metrics.
    """
    import numpy as np
    import base64
    import tempfile
    import os
    import librosa
    
    # 1. Feature Extraction & Acoustic Analysis
    try:
        if not data.audio_base64 or data.audio_base64 == "dummy_base64_audio":
            raise ValueError("Empty or dummy audio provided.")
            
        audio_bytes = base64.b64decode(data.audio_base64)
        print(f"[DEBUG] Received audio: {len(audio_bytes)} bytes, target='{data.target_text}', header={audio_bytes[:4]}")
        
        # Save incoming audio for debugging
        debug_path = r"D:\Kids\test_paper_1_audio\debug_last_recording.wav"
        try:
            with open(debug_path, 'wb') as dbg:
                dbg.write(audio_bytes)
            print(f"[DEBUG] Audio saved to {debug_path} for inspection")
        except: pass
        
        # Universal Audio Ingestion (Supports WAV, WebM, Opus, Ogg, MP3, AAC)
        import io
        import numpy as np
        
        y = None
        sr = 16000
        
        # 1. Fast path: If standard WAV RIFF header, use soundfile
        if audio_bytes[:4] == b'RIFF':
            try:
                import soundfile as sf
                y_raw, file_sr = sf.read(io.BytesIO(audio_bytes), dtype='float32', always_2d=False)
                if file_sr != 16000:
                    y = librosa.resample(y_raw, orig_sr=file_sr, target_sr=16000)
                else:
                    y = y_raw
                sr = 16000
            except Exception as sf_err:
                print(f"[DEBUG] soundfile WAV decode failed: {sf_err}")
                
        # 2. Universal path: PyAV for browser WebM, Opus, OGG, MP3
        if y is None:
            try:
                import av
                container = av.open(io.BytesIO(audio_bytes))
                stream = container.streams.audio[0]
                resampler = av.AudioResampler(format='fltp', layout='mono', rate=16000)
                
                audio_frames = []
                for frame in container.decode(stream):
                    resampled_frames = resampler.resample(frame)
                    for rf in resampled_frames:
                        audio_frames.append(rf.to_ndarray())
                        
                if audio_frames:
                    y = np.concatenate(audio_frames, axis=1).squeeze()
                    sr = 16000
                    print(f"[DEBUG] PyAV decoded container format '{container.format.name}', frames={len(audio_frames)}")
            except Exception as av_err:
                print(f"[DEBUG] PyAV decode error: {av_err}")
                
        if y is None:
            raise ValueError(f"Could not decode audio format. Magic bytes: {audio_bytes[:8]}")
            
        # If stereo, convert to mono
        if y.ndim > 1:
            y = y.mean(axis=1)
            
        print(f"[DEBUG] Audio ready for analysis: shape={y.shape}, sr={sr}")
        
        # Normalize peak audio amplitude so soft/loud microphone levels are normalized uniformly
        max_val = float(np.max(np.abs(y)))
        if max_val > 0.0001:
            y = (y / max_val) * 0.90
            
        duration = librosa.get_duration(y=y, sr=sr)
        
        # --- Volume & Clarity ---
        rms = librosa.feature.rms(y=y)[0]
        max_rms = float(np.max(rms))
        mean_rms = float(np.mean(rms))
        print(f"[DEBUG] duration={duration:.2f}s, max_rms={max_rms:.4f}, mean_rms={mean_rms:.4f}")
        
        volume_status = "Normal"
        if max_rms < 0.005:
            volume_status = "Too soft"
        elif max_rms > 0.4:
            volume_status = "Too loud"
            
        if max_rms < 0.0001 or duration < 0.1:
            print(f"[DEBUG] REJECTED - too quiet or too short")
            return {
                "overall_score": 0,
                "severity_level": 4,
                "diagnostics": {"intelligibility": 0, "phoneme_control": 0, "fluency": 0, "prosody": 0},
                "advanced_features": {
                    "volume": "Silent/Noise Only", "speaking_speed": "N/A", "monotone": "N/A", "non_mti_errors": []
                },
                "l1_contrast_flag": None,
                "feedback": {
                    "learner_message": "I only heard background noise. Please speak clearly into the microphone!",
                    "teacher_message": f"Audio rejected due to low volume (RMS: {max_rms:.4f})."
                }
            }
            
        # --- Step 2: Time-Series Acoustic Feature Extraction (CRNN) ---
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40, n_fft=512, hop_length=256)
        max_frames = 80
        if mfccs.shape[1] < max_frames:
            pad_width = max_frames - mfccs.shape[1]
            mfccs = np.pad(mfccs, ((0, 0), (0, pad_width)), mode='constant')
        else:
            mfccs = mfccs[:, :max_frames]
        # Z-score normalization per sample
        mean_val = np.mean(mfccs)
        std_val = np.std(mfccs) + 1e-6
        mfcc_features = ((mfccs - mean_val) / std_val).astype(np.float32)
        print(f"[DEBUG] Time-Series MFCC Spectrogram extracted: shape={mfcc_features.shape}")




        
        target_word_count = len(data.target_text.split())
        
        if target_word_count == 1:
            fluency_score = 100.0
            prosody_score = 100.0
            speed_status = "Normal"
            is_monotone = False
            syllable_count = 1
            pause_ratio = 0.0
        else:
            # --- Fluency (Pauses & Speed) ---
            silence_threshold = mean_rms * 0.5
            pause_frames = np.sum(rms < silence_threshold)
            pause_ratio = pause_frames / len(rms)
            fluency_score = min(100.0, max(0.0, 100.0 - (pause_ratio * 150.0)))
            
            # Estimate syllables via energy peaks to calculate speed
            onset_env = librosa.onset.onset_strength(y=y, sr=sr)
            peaks = librosa.util.peak_pick(onset_env, pre_max=3, post_max=3, pre_avg=3, post_avg=5, delta=0.5, wait=10)
            syllable_count = len(peaks)
            speed_sps = syllable_count / duration if duration > 0 else 0
            
            speed_status = "Normal"
            if speed_sps > 4.5:
                speed_status = "Too fast"
                fluency_score -= 10
            elif speed_sps < 1.5:
                speed_status = "Too slow"
                fluency_score -= 10
                
            # --- Intonation & Rhythm (Monotone) ---
            pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
            valid_pitches = pitches[magnitudes > np.median(magnitudes)]
            if len(valid_pitches) > 0:
                pitch_std = np.std(valid_pitches)
                prosody_score = min(100.0, max(0.0, (pitch_std / 100.0) * 100))
            else:
                prosody_score = 30.0
                
            is_monotone = prosody_score < 40.0
            
    except Exception as e:
        error_msg = f"Audio extraction failed ({str(e)})."
        print(error_msg.encode('utf-8', 'ignore').decode('utf-8', 'ignore'))
        return {
            "overall_score": 0,
            "severity_level": 4,
            "diagnostics": {"intelligibility": 0, "phoneme_control": 0, "fluency": 0, "prosody": 0},
            "l1_contrast_flag": None,
            "feedback": {
                "learner_message": "There was an error processing your recording. Please try again.",
                "teacher_message": f"Extraction error: {str(e)}"
            }
        }
        
    # 2. Target-Conditioned Acoustic Evaluation & MTI Diagnostics
    WORD_ERROR_MAP = {
        'project': (7, "Consonant Cluster Simplification", "/ˈprɒdʒ.ekt/", "/ˈprɒdʒ.ek/ (dropped final 't')", "1_Correct_project.wav", "2_Wrong_project_ClusterSimplification.wav"),
        'space': (1, "S-Cluster Prosthesis", "/speɪs/", "/ɪs.peɪs/ (extra vowel 'is-')", "1_Correct_space.wav", "2_Wrong_space_SClusterProsthesis.wav"),
        'welcome': (2, "V/W Merger", "/ˈwel.kəm/", "/ˈvel.kəm/ (W swapped with V)", "1_Correct_welcome.wav", "2_Wrong_welcome_VWMerger.wav"),
        'these': (3, "TH Substitution", "/ðiːz/", "/diːz/ (TH replaced with D)", "1_Correct_these.wav", "2_Wrong_these_THSubstitution.wav"),
        'film': (4, "F/P Substitution", "/fɪlm/", "/pɪlm/ (F replaced with P)", "1_Correct_film.wav", "2_Wrong_film_FPSubstitution.wav"),
        'bus': (5, "Paragoge", "/bʌs/", "/bʌs.ə/ (extra ending vowel 'basa')", "1_Correct_bus.wav", "2_Wrong_bus_Paragoge.wav"),
        'friend': (6, "Final Consonant Weakening", "/frend/", "/fren/ (dropped final 'd')", "1_Correct_friend.wav", "2_Wrong_friend_FinalConsonantWeakening.wav"),
        'busy': (10, "Z/S Confusion", "/ˈbɪz.i/", "/ˈbɪs.i/ (Z replaced with S)", "1_Correct_busy.wav", "2_Wrong_busy_ZSConfusion.wav"),
        'house': (9, "Initial H Dropping", "/haʊs/", "/aʊs/ (dropped initial 'H')", "1_Correct_house.wav", "2_Wrong_house_HDropping.wav"),
        'thought': (11, "Back Vowel Confusion", "/θɔːt/", "/θɒt/ (wrong vowel length)", "1_Correct_thought.wav", "2_Wrong_thought_BackVowel.wav"),
        'beautiful': (12, "Equal Stress / Wrong Rhythm", "/ˈbjuː.tɪ.fəl/", "equal robotic stress", "beautiful_correct.wav", "beautiful_wrong_equalstress.wav")
    }
    
    target_clean = data.target_text.strip().lower()
    target_info = WORD_ERROR_MAP.get(target_clean)
    
    predicted_class = 0
    confidence = 0.95
    l1_transfer = None
    expected_ph = "-"
    detected_ph = "-"
    
    audio_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'test_paper_1_audio')
    
    if target_info and os.path.exists(audio_dir):
        err_id, err_name, exp_p, det_p, clean_fname, wrong_fname = target_info
        clean_fpath = os.path.join(audio_dir, clean_fname)
        wrong_fpath = os.path.join(audio_dir, wrong_fname)
        
        try:
            def extract_norm_mel(audio_data):
                y_trim, _ = librosa.effects.trim(audio_data, top_db=15)
                if len(y_trim) < 160: y_trim = audio_data
                S = librosa.feature.melspectrogram(y=y_trim, sr=16000, n_mels=40, n_fft=512, hop_length=160)
                S_db = librosa.power_to_db(S, ref=np.max)
                return (S_db - S_db.mean()) / (S_db.std() + 1e-6)
                
            S_student = extract_norm_mel(y)
            
            corr_clean = 0.0
            corr_wrong = 0.0
            from scipy.ndimage import zoom
            
            if os.path.exists(clean_fpath):
                y_c, _ = sf.read(clean_fpath, dtype='float32')
                if y_c.ndim > 1: y_c = y_c.mean(axis=1)
                S_c = extract_norm_mel(y_c)
                S_s_c = zoom(S_student, (1, S_c.shape[1] / max(1, S_student.shape[1])))
                corr_clean = float(np.corrcoef(S_c.flatten(), S_s_c.flatten())[0, 1])
                
            if os.path.exists(wrong_fpath):
                y_w, _ = sf.read(wrong_fpath, dtype='float32')
                if y_w.ndim > 1: y_w = y_w.mean(axis=1)
                S_w = extract_norm_mel(y_w)
                S_s_w = zoom(S_student, (1, S_w.shape[1] / max(1, S_student.shape[1])))
                corr_wrong = float(np.corrcoef(S_w.flatten(), S_s_w.flatten())[0, 1])
                
            # --- Phoneme-Specific Acoustic Physics Diagnostic ---
            y_trim, _ = librosa.effects.trim(y, top_db=18)
            zcr_full = librosa.feature.zero_crossing_rate(y_trim)[0]
            cent_full = librosa.feature.spectral_centroid(y=y_trim, sr=16000)[0]
            
            is_mti_detected = False
            
            if target_clean == 'film':
                # Check /f/ onset frication vs /p/ plosive using spectral plosive ratio
                onset_len = max(3, int(S_student.shape[1] * 0.25))
                onset_high = np.mean(S_student[20:, :onset_len])
                onset_low = np.mean(S_student[:15, :onset_len])
                plosive_ratio = onset_low / (onset_high + 1e-6)
                print(f"[DEBUG] film plosive_ratio={plosive_ratio:.2f}")
                if plosive_ratio > 50.0:
                    is_mti_detected = True
                    print(f"[DEBUG] Phoneme Rule Triggered: F/P Substitution (plosive_ratio={plosive_ratio:.2f})")
                    
            elif target_clean == 'project':
                # Check /kt/ stop release burst at coda (last 20%)
                coda_len = max(3, int(S_student.shape[1] * 0.20))
                coda_high = np.mean(S_student[20:, -coda_len:])
                coda_low = np.mean(S_student[:15, -coda_len:])
                coda_ratio = coda_low / (coda_high + 1e-6)
                print(f"[DEBUG] project coda_ratio={coda_ratio:.2f}")
                if coda_ratio > 35.0:
                    is_mti_detected = True
                    print(f"[DEBUG] Phoneme Rule Triggered: Consonant Cluster Simplification")
                    
            elif target_clean == 'space':
                # Check for extra vowel /ɪ/ before /s/
                p1_cent = np.mean(cent_full[:max(2, int(len(cent_full) * 0.15))])
                p2_cent = np.mean(cent_full[max(2, int(len(cent_full) * 0.15)):max(4, int(len(cent_full) * 0.40))])
                if p1_cent < 1400.0 and p2_cent > 2200.0:
                    is_mti_detected = True
                    print(f"[DEBUG] Phoneme Rule Triggered: S-Cluster Prosthesis")
                    
            elif target_clean == 'bus':
                # Check for Paragoge extra ending vowel after /s/
                coda_cent = np.mean(cent_full[int(len(cent_full) * 0.85):])
                if coda_cent < 1600.0:
                    is_mti_detected = True
                    print(f"[DEBUG] Phoneme Rule Triggered: Paragoge")
                    
            elif target_clean == 'these':
                # Check /ð/ dental friction vs /d/ stop plosive
                onset_zcr = np.mean(zcr_full[:max(2, int(len(zcr_full) * 0.20))])
                onset_cent = np.mean(cent_full[:max(2, int(len(cent_full) * 0.20))])
                if onset_cent < 1100.0 and onset_zcr < 0.04:
                    is_mti_detected = True
                    print(f"[DEBUG] Phoneme Rule Triggered: TH Substitution")
                    
            elif target_clean == 'welcome':
                # Check /w/ semivowel vs /v/ dental fricative
                onset_cent = np.mean(cent_full[:max(2, int(len(cent_full) * 0.25))])
                if onset_cent > 1600.0:
                    is_mti_detected = True
                    print(f"[DEBUG] Phoneme Rule Triggered: V/W Merger")
                    
            if is_mti_detected:
                predicted_class = err_id
                confidence = 0.88
                l1_transfer = err_name
                expected_ph = exp_p
                detected_ph = det_p
            elif corr_clean >= 0.82 and not is_mti_detected:
                # Strong match with clean pronunciation
                predicted_class = 0
                confidence = min(0.99, max(0.90, corr_clean))
            elif corr_wrong > corr_clean + 0.05 and corr_wrong > 0.45:
                # Student pronounced with the specific MTI accent distortion
                predicted_class = err_id
                confidence = max(0.70, min(0.98, corr_wrong))
                l1_transfer = err_name
                expected_ph = exp_p
                detected_ph = det_p
            else:
                # Clean pronunciation
                predicted_class = 0
                confidence = max(0.85, min(0.99, corr_clean if corr_clean > 0 else 0.90))
        except Exception as eval_err:
            print(f"[DEBUG] Target acoustic evaluation fallback: {eval_err}")
            predicted_class = 0
            confidence = 0.90
    else:
        # Fallback to PyTorch model inference
        input_tensor = torch.tensor(mfcc_features, dtype=torch.float32).unsqueeze(0)
        with torch.no_grad():
            output_logits = english_model(input_tensor)
            probabilities = torch.nn.functional.softmax(output_logits, dim=1)
            predicted_class = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0][predicted_class].item()
            
        mti_patterns = {
            1: ("S-Cluster Prosthesis", "/skuːl/", "/ɪskuːl/"),
            2: ("V/W Merger", "/v/", "/w/"),
            3: ("TH Substitution", "/θ/", "/t/ or /d/"),
            4: ("F/P Substitution", "/f/", "/p/"),
            5: ("Paragoge", "consonant", "add /ə/"),
            6: ("Final Consonant Weakening", "consonant", "dropped"),
            7: ("Consonant Cluster Simplification", "cluster", "reduced"),
            8: ("Short/Long Vowel Confusion", "vowel length", "wrong length"),
            9: ("Initial H Dropping", "/h/", "dropped"),
            10: ("Z/S Confusion", "/z/", "/s/"),
            11: ("Back Vowel Confusion", "/ɔː/", "/ɒ/"),
            12: ("Equal Stress / Wrong Rhythm", "variable stress", "equal stress")
        }
        if predicted_class in mti_patterns:
            l1_transfer = mti_patterns[predicted_class][0]
            expected_ph = mti_patterns[predicted_class][1]
            detected_ph = mti_patterns[predicted_class][2]
        
    # 4. Non-MTI Errors (Mocked via heuristics due to lack of ASR transcription)
    # A real implementation requires Whisper ASR to transcribe the text exactly and diff it against target_text.
    non_mti_errors = []
    # Heuristic: If syllable count is way off from word count, assume missing words or hesitations.
    target_words = len(data.target_text.split())
    if syllable_count < target_words:
        non_mti_errors.append("Missing words in sentence")
    # Only flag hesitations on longer sentences, not single short words
    if pause_ratio > 0.4 and duration > 2.0:
        non_mti_errors.append("Repetitions or hesitations")
            
    # 5. Hierarchical Scoring
    if predicted_class == 0:
        phoneme_control = confidence * 100.0
    else:
        phoneme_control = (1.0 - confidence) * 100.0
        
    intelligibility_penalty = 15.0 if l1_transfer else 0.0
    if is_monotone: intelligibility_penalty += 10.0
    
    raw_intelligibility = (phoneme_control + fluency_score + prosody_score) / 3.0
    intelligibility = min(100.0, max(0.0, raw_intelligibility - intelligibility_penalty))
    
    overall_score = (0.45 * intelligibility) + (0.25 * phoneme_control) + (0.20 * fluency_score) + (0.10 * prosody_score)
    
    # 6. Error Severity Levels
    severity_level = 0
    if overall_score < 50: severity_level = 3
    elif overall_score < 75 or l1_transfer: severity_level = 2
    elif overall_score < 85: severity_level = 1
        
    # 7. Feedback Generation
    learner_message = "Great job! Keep practicing."
    teacher_message = "Clear pronunciation. Good intelligibility."
    
    # 8. Visual Lip Movement & Viseme Evaluation (Camera Feed)
    visual_diagnostics = {
        "bilabial_closure": "Not Provided",
        "lip_rounding": "Not Provided",
        "mouth_motion_detected": True
    }
    visual_score = 90.0
    
    if visual_lip_analyzer is not None and data.video_frames_base64 and len(data.video_frames_base64) > 0:
        try:
            vis_res = visual_lip_analyzer.evaluate_video_sequence(data.video_frames_base64, data.target_text)
            visual_score = vis_res.get("visual_score", 90.0)
            visual_diagnostics = vis_res.get("visual_diagnostics", visual_diagnostics)
            vis_tip = vis_res.get("feedback_tip")
            vis_gest = vis_res.get("articulatory_gestures")
            
            # Fuse visual score: 70% acoustic + 30% visual
            overall_score = (0.70 * overall_score) + (0.30 * visual_score)
            
            if vis_tip and vis_res.get("visual_score", 100) < 80:
                learner_message += f" 👄 Lip Guide: {vis_tip}"
                teacher_message += f" Visual Articulation: {vis_gest} (Visual Score: {visual_score}%)."
            elif vis_tip:
                learner_message += f" 👄 {vis_tip}"
        except Exception as v_err:
            print(f"[DEBUG] Visual lip evaluation error: {v_err}")

    return {
        "overall_score": round(overall_score, 1),
        "severity_level": severity_level,
        "diagnostics": {
            "intelligibility": round(intelligibility, 1),
            "phoneme_control": round(phoneme_control, 1),
            "fluency": round(fluency_score, 1),
            "prosody": round(prosody_score, 1),
            "visual_lip_score": round(visual_score, 1)
        },
        "advanced_features": {
            "volume": volume_status,
            "speaking_speed": speed_status,
            "monotone": "Yes" if is_monotone else "No",
            "non_mti_errors": non_mti_errors
        },
        "visual_diagnostics": visual_diagnostics,
        "l1_contrast_flag": l1_transfer,
        "expected_phoneme": expected_ph,
        "detected_phoneme": detected_ph,
        "feedback": {
            "learner_message": learner_message,
            "teacher_message": teacher_message
        }
    }


# ---------------------------------------------------------
# 3. Vishmi - Sinhala Handwriting CNN
# ---------------------------------------------------------
@app.post("/api/ai/handwriting/evaluate")
def evaluate_handwriting_endpoint(data: HandwritingImageData):
    """
    Evaluates drawn Sinhala letters by comparing the student's drawing
    against a browser-rendered reference image of the target letter using SSIM.
    The reference is rendered by the React canvas (which correctly supports
    Sinhala OpenType shaping) and sent as reference_base64.
    """
    result = template_evaluate(
        drawn_b64=data.image_base64,
        reference_b64=data.reference_base64,
        target_letter=data.target_letter
    )
    print(f"[Handwriting] letter='{data.target_letter}' "
          f"drawn_len={len(data.image_base64)} "
          f"ref_len={len(data.reference_base64)} "
          f"→ score={result['accuracy_score']} quality={result['quality']}")
    return result


# ---------------------------------------------------------
# 4. Sanduni - Motor Skills Tracking
# ---------------------------------------------------------
@app.post("/api/ai/motor-skills/evaluate")
def track_motor_skills(data: MotorTrackingData):
    """
    Uses Pose Estimation to track gross motor skills like jumping or balancing.
    """
    result = evaluate_motor_skills(data.video_frames_base64)
    return result

# ---------------------------------------------------------
# 5. Multimodal Creative Skill Assessment
# ---------------------------------------------------------
@app.post("/api/ai/creative-skills/evaluate")
def evaluate_creative_skills(data: CreativeAssessmentData):
    """
    Analyzes creative activities based on media input and returns scores, 
    detects recurring weaknesses, and recommends personalized activities.
    """
    import random
    
    # 1. Base Mock Assessment based on Activity Type
    # In a real app, we'd pass `data.media_base64` to a multimodal model
    scores = {
        "Shape Accuracy": random.randint(70, 95),
        "Colour Usage": random.randint(70, 98),
        "Creativity": random.randint(75, 98),
        "Completion": random.randint(80, 100)
    }
    
    # Fine Motor vs Gross Motor focus
    if data.activity_type in ["Painting", "Handwork"]:
        scores["Fine Motor Skills"] = random.randint(60, 95)
        scores["Visual Accuracy"] = scores["Shape Accuracy"]
        scores["Hand-Eye Coordination"] = random.randint(65, 95)
    elif data.activity_type in ["Dancing", "Singing"]:
        scores["Rhythm"] = random.randint(70, 95)
        scores["Movement Coordination"] = random.randint(65, 90)
    
    overall_score = int(sum(scores.values()) / len(scores))
    
    # 2. Recurring Error / Weakness Detection
    detected_weakness = None
    next_activity = ""
    next_level = data.current_level
    
    # Simulate a weakness if a score is low (< 75)
    low_skills = [skill for skill, score in scores.items() if score < 75]
    
    if "Fine Motor Skills" in low_skills or "Shape Accuracy" in low_skills:
        current_weakness = "Fine Motor Accuracy"
        # Check historical for recurring
        if current_weakness in data.historical_weaknesses:
            detected_weakness = "The child shows a recurring difficulty in fine-motor accuracy."
        else:
            detected_weakness = "Child has difficulty with cutting/drawing accuracy."
    elif "Rhythm" in low_skills:
        current_weakness = "Rhythm & Timing"
        if current_weakness in data.historical_weaknesses:
            detected_weakness = "The child shows a recurring difficulty maintaining rhythm."
        else:
            detected_weakness = "Child struggles with rhythm."
            
    # 3. Personalized Activity + Difficulty Recommendation
    if overall_score >= 85 and not detected_weakness:
        # Performing very well
        recommendation_reason = f"Level {data.current_level} is too easy for this child."
        next_level = data.current_level + 1
        next_activity = f"{data.activity_name} - Level {next_level}"
    else:
        # Struggling
        recommendation_reason = "Child requires additional practice."
        if data.activity_type == "Handwork":
            next_activity = f"Basic Folding & Shape Cutting - Level {data.current_level}"
        elif data.activity_type == "Painting":
            next_activity = f"Basic Shape Coloring - Level {data.current_level}"
        else:
            next_activity = f"Basic Rhythm Practice - Level {data.current_level}"
            
    return {
        "scores": scores,
        "overall_score": overall_score,
        "detected_weakness": detected_weakness,
        "recommendation": {
            "reason": recommendation_reason,
            "next_activity": next_activity,
            "recommended_level": next_level
        }
    }

# ---------------------------------------------------------
# 6. Story Drawing Assessment (CLIP-based AI Vision)
# ---------------------------------------------------------
_clip_model = None
_clip_processor = None

def get_clip_model():
    """Lazily load the CLIP model on first use."""
    global _clip_model, _clip_processor
    if _clip_model is None:
        try:
            try:
                from transformers import CLIPProcessor, CLIPModel
            except ImportError:
                try:
                    from transformers import AutoProcessor as CLIPProcessor, CLIPModel
                except ImportError:
                    from transformers.models.clip import CLIPProcessor, CLIPModel
            print("Loading CLIP model for story drawing evaluation...")
            try:
                _clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32", local_files_only=True)
                _clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32", local_files_only=True)
            except Exception:
                _clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
                _clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
            _clip_model.eval()
            print("CLIP model loaded successfully!")
        except Exception as e:
            print(f"CLIP model could not be loaded: {e}")
            _clip_model = None
            _clip_processor = None
    return _clip_model, _clip_processor

@app.post("/api/ai/story-drawing/evaluate")
def evaluate_story_drawing(data: StoryDrawingData):
    """
    Uses CLIP with FEATURE-BASED descriptions to detect story elements.
    Instead of generic labels like 'rabbit', we describe specific physical
    features (long ears, shell, trunk) so CLIP can discriminate between animals.
    """
    import base64
    import io

    # --- Feature-based descriptions for each animal ---
    # Key idea: describe what makes each animal UNIQUE so CLIP doesn't confuse them
    # Also include line-drawing and coloring page styles!
    FEATURE_DESCRIPTIONS = {
        "rabbit": [
            "a small animal with long floppy ears and a short fluffy tail",
            "a bunny with big upright ears hopping",
            "a rabbit with long ears sitting or running",
            "a black and white line drawing of a rabbit",
            "a children's coloring page of a bunny",
        ],
        "tortoise": [
            "a reptile with a large hard round shell on its back and four short legs",
            "a turtle or tortoise with a dome-shaped shell crawling slowly",
            "a shelled reptile with a patterned shell on its body",
            "a black and white line drawing of a tortoise or turtle",
            "a children's coloring page of a turtle with a shell",
        ],
        "elephant": [
            "a very large gray animal with a long trunk and big floppy ears",
            "an elephant with tusks and a long nose trunk",
            "a line drawing of an elephant with a trunk",
        ],
        "deer": [
            "a slender brown animal with spots on its body and thin long legs",
            "a deer or fawn with antlers or spotted fur",
            "a line drawing of a deer",
            "a children's coloring page of a deer",
            "a cartoon drawing of a brown deer",
            "a watercolor painting of a deer",
        ],
        "duck": [
            "a bird swimming on water with an orange beak",
            "a duck or goose with webbed feet near water",
            "a line drawing of a duck",
        ],
        "lion": [
            "a large wild cat with a thick furry mane around its face",
            "a lion with a golden mane roaring",
            "a line drawing of a lion with a mane",
            "a children's coloring page of a lion",
        ],
        "mouse": [
            "a tiny rodent with round ears and a long thin tail",
            "a small mouse looking up",
            "a black and white line drawing of a mouse",
            "a children's coloring page of a mouse",
        ],
        "fox": [
            "an orange-red animal with a long bushy tail and pointed snout",
            "a fox with a pointed face and fluffy tail",
        ],
        "bear": [
            "a large round furry animal standing on four legs or two legs",
            "a bear with thick brown or black fur",
        ],
        "cat": [
            "a small furry animal with whiskers and pointed ears",
            "a cat or kitten with a long tail and whiskers",
        ],
        "dog": [
            "a domesticated animal with floppy or pointed ears and a wagging tail",
            "a dog or puppy playing or sitting",
        ],
        "frog": [
            "a small green amphibian with big bulging eyes and long back legs",
            "a frog sitting on a lily pad or jumping",
        ],
        "fish": [
            "an aquatic animal with fins and scales swimming in water",
            "a fish with a tail fin swimming underwater",
        ],
    }

    # Confuser descriptions - things that are NOT the target animal
    CONFUSER_DESCRIPTIONS = [
        "a person or child standing or walking",
        "a very large gray animal with a long trunk and big floppy ears",
        "a slender brown animal with spots and thin long legs",
        "a bird flying in the sky",
        "a small furry animal with whiskers",
        "a large wild cat with a thick furry mane",
        "a reptile with a hard shell on its back",
        "a small animal with long floppy ears",
        "a colorful rooster or chicken with a red comb",
        "a drawing of a shiny jewel or diamond",
        "a small black ant or insect",
        "a green crocodile or alligator with sharp teeth",
        "a monkey with a long tail",
        "a black crow or raven",
        "a white dove or pigeon",
        "a drawing of an owl with big eyes",
    ]

    detected = []
    missing = []

    try:
        from PIL import Image
        import torch

        model, processor = get_clip_model()

        if model is None or processor is None:
            raise RuntimeError("CLIP model not available")

        # Decode base64 image
        img_data = data.image_base64
        if "," in img_data:
            img_data = img_data.split(",", 1)[1]
        image_bytes = base64.b64decode(img_data)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image.thumbnail((512, 512))

        # --- For each expected element, run a focused feature-based comparison ---
        # 0.025 threshold allows elements to be detected even if a strong background (e.g. river 0.80) suppresses the softmax.
        DETECTION_THRESHOLD = 0.10

        for element in data.expected_elements:
            element_key = element.lower().strip()
            positive_descs = FEATURE_DESCRIPTIONS.get(element_key, [
                "a drawing of a " + element_key,
            ])

            # Build comparison: positive feature descriptions vs confusers
            # Remove confusers that describe the target animal itself
            filtered_confusers = []
            for c in CONFUSER_DESCRIPTIONS:
                # Skip confusers that match the target element
                if element_key in c.lower():
                    continue
                # Skip confusers with matching keywords
                skip = False
                if element_key == "rabbit" and ("long floppy ears" in c or "bunny" in c):
                    skip = True
                elif element_key == "tortoise" and ("shell" in c or "turtle" in c):
                    skip = True
                elif element_key == "elephant" and "trunk" in c:
                    skip = True
                elif element_key == "deer" and ("spots" in c or "slender" in c):
                    skip = True
                elif element_key == "lion" and "mane" in c:
                    skip = True
                elif element_key == "mouse" and "small furry animal" in c:
                    skip = True
                elif element_key == "crow" and "bird" in c:
                    skip = True
                elif element_key == "rooster" and "bird" in c:
                    skip = True
                elif element_key == "fox" and "small furry animal" in c:
                    skip = True
                elif element_key == "ant" and ("small" in c or "insect" in c):
                    skip = True
                elif element_key == "dove" and "bird" in c:
                    skip = True
                elif element_key == "monkey" and "slender brown animal" in c:
                    skip = True
                elif element_key == "crocodile" and "reptile" in c:
                    skip = True
                elif element_key == "rooster" and ("bird" in c or "person" in c):
                    skip = True
                elif element_key == "jewel" and ("person" in c or "bird" in c or "reptile" in c):
                    skip = True
                elif element_key == "owl" and "bird" in c:
                    skip = True
                elif element_key == "bird" and "bird" in c:
                    skip = True
                elif element_key == "farmer" and "person" in c:
                    skip = True
                if not skip:
                    filtered_confusers.append(c)

            all_texts = positive_descs + filtered_confusers
            num_positive = len(positive_descs)

            inputs = processor(
                text=all_texts,
                images=image,
                return_tensors="pt",
                padding=True
            )

            with torch.no_grad():
                outputs = model(**inputs)
                logits = outputs.logits_per_image
                probs = logits.softmax(dim=1)[0]

            # Sum probabilities for positive (feature) descriptions
            positive_score = sum(probs[i].item() for i in range(num_positive))
            # Find highest single positive description
            best_positive_idx = max(range(num_positive), key=lambda i: probs[i].item())
            best_positive_score = probs[best_positive_idx].item()

            # Also get the top overall prediction
            all_scores = [(all_texts[i], probs[i].item()) for i in range(len(all_texts))]
            all_scores.sort(key=lambda x: x[1], reverse=True)
            top3_str = str([(t[:50], round(s, 3)) for t, s in all_scores[:3]])

            found = best_positive_score >= 0.25

            print("  '" + element + "': positive_sum=" + str(round(positive_score, 3))
                  + " best=" + str(round(best_positive_score, 3))
                  + " => " + ("DETECTED" if found else "MISSING")
                  + " | top3: " + top3_str)

            if found:
                detected.append(element)
            else:
                missing.append(element)

        print("Final: detected=" + str(detected) + ", missing=" + str(missing))

    except Exception as e:
        print("CLIP detection failed: " + str(e))
        # If CLIP fails, mark ALL elements as missing (never fake success)
        for el in data.expected_elements:
            missing.append(el)

    # --- Score & Feedback ---
    score = round((len(detected) / len(data.expected_elements)) * 100) if data.expected_elements else 100

    if score > 0:
        feedback_sinhala = "ඔබ කතාවට අනුව චිත්‍රය නිවැරදිව ඇඳ ඇත!"
        feedback_english  = "You correctly drew the drawing according to the story!"
    else:
        feedback_sinhala = "කතාවේ චරිත චිත්‍රයේ පැහැදිලිව දක්නට නැත. නැවත උත්සාහ කරන්න!"
        feedback_english  = "The characters of the story are not clearly visible in the drawing. Try again!"

    return {
        "score": score,
        "detected_elements": detected,
        "missing_elements": missing,
        "feedback_sinhala": feedback_sinhala,
        "feedback_english": feedback_english
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
