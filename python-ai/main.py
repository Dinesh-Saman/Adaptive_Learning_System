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
from core_sinhala_adaptive.adaptive_engine import AdaptiveEngine

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
    english_model.load_state_dict(torch.load(english_model_path, weights_only=True))
    english_model.eval()
    print("SUCCESS: Successfully loaded PyTorch English Audio AI Model.")
else:
    print(f"WARNING: {english_model_path} not found. Audio Neural Net will use random initialized weights.")

handwriting_model = HandwritingCNN()
handwriting_model_path = os.path.join(os.path.dirname(__file__), 'core_handwriting', 'weights', 'handwriting_model.pt')
if os.path.exists(handwriting_model_path):
    handwriting_model.load_state_dict(torch.load(handwriting_model_path, weights_only=True))
    handwriting_model.eval()
    print("SUCCESS: Successfully loaded PyTorch Handwriting Vision AI Model.")
else:
    print(f"WARNING: {handwriting_model_path} not found. Vision Neural Net will use random initialized weights.")

sinhala_adaptive_engine = AdaptiveEngine()

# We need a state dictionary to track difficulty since it's an adaptive platform. 
# In a real production app, this would be saved in Redis or a DB.
# We'll use an in-memory dictionary mapping student_id -> current_difficulty (1-5).
student_states = {}

# In-memory dictionary for Sinhala adaptive tracking: student_id -> history_sequence
sinhala_student_history = {}

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

class SinhalaAdaptiveRequest(BaseModel):
    student_id: str
    last_question_id: str = None
    last_correct: bool = None
    t_main_ms: int
    t_sub_avg_ms: int
    t_idle_ms: int
    t_resp_ms: int
    scroll_velocity: float
    affect_confusion: float  # 0 to 1
    accuracy: float # 0 to 1

class SpeechAudioData(BaseModel):
    student_id: str
    audio_base64: str
    target_text: str = ""

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
    Processes audio to detect Sinhala-influenced English pronunciation errors
    and provides a hierarchical score based on intelligibility, phonemes, fluency, and prosody.
    """
    import numpy as np
    import base64
    import tempfile
    import os
    import librosa
    
    # 1. Feature Extraction & Audio Pre-processing
    try:
        if not data.audio_base64 or data.audio_base64 == "dummy_base64_audio":
            raise ValueError("Empty or dummy audio provided.")
            
        audio_bytes = base64.b64decode(data.audio_base64)
        
        # Save to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            tmp_file.write(audio_bytes)
            tmp_path = tmp_file.name
            
        y, sr = librosa.load(tmp_path, sr=16000)
        os.remove(tmp_path)
        
        # --- Real-World Silence & Speech Detection ---
        rms = librosa.feature.rms(y=y)[0]
        mean_rms = np.mean(rms)
        
        # If the audio is extremely quiet or shorter than 0.3 seconds, reject it.
        if mean_rms < 0.005 or len(y) < sr * 0.3:
            return {
                "overall_score": 0,
                "severity_level": 4,
                "diagnostics": {"intelligibility": 0, "phoneme_control": 0, "fluency": 0, "prosody": 0},
                "l1_contrast_flag": None,
                "expected_phoneme": "-",
                "detected_phoneme": "-",
                "feedback": {
                    "learner_message": "I didn't hear anything. Please speak a little louder!",
                    "teacher_message": f"Audio rejected due to low volume or duration (RMS: {mean_rms:.4f})."
                }
            }
            
        # Extract MFCCs for the neural network
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
        mfcc_features = np.mean(mfccs.T, axis=0)
        
        # --- Fluency Calculation (Based on Pause Ratio) ---
        silence_threshold = mean_rms * 0.5
        pause_frames = np.sum(rms < silence_threshold)
        pause_ratio = pause_frames / len(rms)
        # High pause ratio = low fluency
        fluency_score = min(100.0, max(0.0, 100.0 - (pause_ratio * 150.0)))
        
        # --- Prosody Calculation (Based on Pitch/F0 Variation) ---
        # Note: using piptrack as it is much faster than pyin for real-time
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
        valid_pitches = pitches[magnitudes > np.median(magnitudes)]
        if len(valid_pitches) > 0:
            pitch_std = np.std(valid_pitches)
            # More variation = better prosody (up to a reasonable cap)
            prosody_score = min(100.0, max(0.0, (pitch_std / 100.0) * 100))
        else:
            prosody_score = 30.0 # Monotone or whisper
            
    except Exception as e:
        print(f"⚠️ Audio extraction failed ({str(e)}).")
        return {
            "overall_score": 0,
            "severity_level": 4,
            "diagnostics": {"intelligibility": 0, "phoneme_control": 0, "fluency": 0, "prosody": 0},
            "l1_contrast_flag": None,
            "expected_phoneme": "-",
            "detected_phoneme": "-",
            "feedback": {
                "learner_message": "There was an error processing your recording. Please try again.",
                "teacher_message": f"Extraction error: {str(e)}"
            }
        }
        
    input_tensor = torch.tensor(mfcc_features, dtype=torch.float32).unsqueeze(0)
    
    # 2. PyTorch Model Inference
    with torch.no_grad():
        output_logits = english_model(input_tensor)
        probabilities = torch.nn.functional.softmax(output_logits, dim=1)
        predicted_class = torch.argmax(probabilities, dim=1).item()
        confidence = probabilities[0][predicted_class].item()
        
    # 3. L1 Contrastive Engine (Strictly based on the model's actual prediction)
    target_lower = data.target_text.lower().strip()
    l1_transfer = None
    expected_ph = "-"
    detected_ph = "-"
    
    # Class 1: TH->D, Class 2: F->P, etc. (Based on your mock design)
    if "w" in target_lower or "v" in target_lower:
        if predicted_class == 1: # Assuming class 1 maps to this specific local error here
            l1_transfer = "w_v_substitution"
            expected_ph = "/w/" if "w" in target_lower else "/v/"
            detected_ph = "/v/" if expected_ph == "/w/" else "/w/"
    elif "th" in target_lower:
        if predicted_class == 2: # Assuming class 2 maps to TH->D
            l1_transfer = "th_d_substitution"
            expected_ph = "/θ/"
            detected_ph = "/d/"
            
    # 4. Hierarchical Scoring
    # Phoneme control: If the model predicts class 0 (Correct), it's highly confident it's right.
    # If it predicts an error class, phoneme control drops proportionally to confidence in that error.
    if predicted_class == 0:
        phoneme_control = confidence * 100.0
    else:
        phoneme_control = (1.0 - confidence) * 100.0
        
    intelligibility_penalty = 25.0 if l1_transfer else 0.0
    
    # Intelligibility is an aggregate of articulation (phoneme), flow (fluency), and intonation (prosody)
    raw_intelligibility = (phoneme_control + fluency_score + prosody_score) / 3.0
    intelligibility = min(100.0, max(0.0, raw_intelligibility - intelligibility_penalty))
    
    # Formula: 0.45 × Intelligibility + 0.25 × Phoneme Control + 0.20 × Fluency + 0.10 × Prosody
    overall_score = (0.45 * intelligibility) + (0.25 * phoneme_control) + (0.20 * fluency_score) + (0.10 * prosody_score)
    
    # 5. Error Severity Levels
    severity_level = 0
    if overall_score < 50:
        severity_level = 3
    elif overall_score < 75 or l1_transfer:
        severity_level = 2
    elif overall_score < 85:
        severity_level = 1
        
    # 6. Feedback Generation
    learner_message = "Great job! Keep practicing."
    teacher_message = "Clear pronunciation. Good intelligibility."
    
    if l1_transfer == "w_v_substitution":
        learner_message = f"Your '{expected_ph.strip('/')}' sounded a bit like '{detected_ph.strip('/')}'. Try rounding your lips more!"
        teacher_message = f"Student exhibited L1 transfer substituting {detected_ph} for {expected_ph}."
    elif l1_transfer == "th_d_substitution":
        learner_message = "Make sure to place your tongue between your teeth to pronounce 'TH'."
        teacher_message = "Student exhibited Sinhala phonological influence (TH -> D)."
    elif severity_level >= 2:
        learner_message = "That was a bit hard to understand. Let's try saying it a bit slower and clearer."
        teacher_message = f"Low intelligibility detected (Score: {int(intelligibility)}/100)."

    return {
        "overall_score": round(overall_score, 1),
        "severity_level": severity_level,
        "diagnostics": {
            "intelligibility": round(intelligibility, 1),
            "phoneme_control": round(phoneme_control, 1),
            "fluency": round(fluency_score, 1),
            "prosody": round(prosody_score, 1)
        },
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

@app.post("/sinhala/adaptive/next")
async def get_next_sinhala_question(data: SinhalaAdaptiveRequest):
    """
    Get the next best question ID for the student based on their history using DKT.
    """
    student_id = data.student_id
    
    # Initialize history if not exists
    if student_id not in sinhala_student_history:
        sinhala_student_history[student_id] = []
        
    # Append the last answer to history if provided
    if data.last_question_id is not None and data.last_correct is not None:
        sinhala_student_history[student_id].append({
            'id': data.last_question_id,
            'correct': data.last_correct
        })
        
    history = sinhala_student_history[student_id]
    
    # Predict next
    try:
        next_q_id = sinhala_adaptive_engine.get_next_question(history)
        return {"next_question_id": next_q_id, "history_len": len(history)}
    except Exception as e:
        print(f"Error in DKT prediction: {e}")
        return {"next_question_id": "match_word_pic_1", "history_len": len(history)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
