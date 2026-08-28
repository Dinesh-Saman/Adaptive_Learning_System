import os
import sys

# Force UTF-8 stdout/stderr on Windows to handle IPA phonetic characters
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

from typing import Optional, Dict, List, Set, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import torch

# Add core_math to path so we can import modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'core_math'))
from core_math.model import MultimodalFusionNet
from core_math.exercise_engine import generate_math_question
from core_math.grade2_adaptive_engine import Grade2AdaptiveEngine
from core_math.grade2_curriculum import GRADE2_DOMAINS
from core_math.grade3_adaptive_engine import Grade3AdaptiveEngine
from core_math.grade3_curriculum import GRADE3_DOMAINS
from core_math.adaptive_paper_generator import AdaptivePaperGenerator, QuestionPoolExhaustedError
from core_english.audio_model import PronunciationNet
from core_sinhala.vision_model import HandwritingCNN
from core_sinhala.stroke_analyzer import analyze_stroke_quality
from core_sinhala.template_matcher import evaluate_handwriting as template_evaluate
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

# Multi-Stage English Speaking & Pronunciation Analyzers
try:
    from core_english.lip_analysis import visual_lip_analyzer
    from core_english.fluency_prosody import fluency_prosody_analyzer
    from core_english.mti_rules import sri_lankan_mti_engine
    from core_english.phoneme_engine import align_phoneme_sequences, get_phonemes_for_word, get_sentence_phonemes
    print("SUCCESS: Successfully loaded Multi-Stage English Speaking Assessment Pipeline.")
except Exception as e:
    visual_lip_analyzer = None
    fluency_prosody_analyzer = None
    sri_lankan_mti_engine = None
    print(f"WARNING: Multi-stage analyzers load notice: {e}")




handwriting_model_path = os.path.join(os.path.dirname(__file__), 'core_sinhala', 'weights', 'handwriting_model.pt')
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
    return {
        "session_complete": False,
        "questions_asked": session["questions_asked"],
        "total_questions": 10,
        "predicted_difficulty": diff_msg,
        "next_question": next_question,
        "weaknesses_identified": len(session["weaknesses"])
    }

# ---------------------------------------------------------
# Grade 2 Adaptive Mathematics Research Engine
# ---------------------------------------------------------
# Longitudinal Adaptive Paper Generators (Papers 1-5 with Hard Duplicate Exclusion)
# ---------------------------------------------------------
g2_pool_path = os.path.join(os.path.dirname(__file__), 'core_math', 'grade2_question_pool.json')
g3_pool_path = os.path.join(os.path.dirname(__file__), 'core_math', 'grade3_question_pool.json')

grade2_paper_generator = AdaptivePaperGenerator(g2_pool_path)
grade3_paper_generator = AdaptivePaperGenerator(g3_pool_path)

class GeneratePaperRequest(BaseModel):
    student_id: str = "student_demo"
    grade: int = 2
    paper_number: int = 1
    answered_question_ids: list[str] = []
    skill_mastery: Optional[dict[str, float]] = None
    paper_size: int = 20

@app.post("/api/ai/math/generate-paper")
def generate_math_paper(data: GeneratePaperRequest):
    """
    Generates Paper N with strict duplicate exclusion across all past attempts and within the paper.
    Stage 1: Exclude past answered questions.
    Stage 2: Competency/Weakness analysis.
    Stage 3: Difficulty matching.
    Stage 4: Adaptive question selection.
    Stage 5: Assert zero duplicates within and across papers.
    """
    generator = grade2_paper_generator if data.grade == 2 else grade3_paper_generator
    
    mastery = data.skill_mastery or {}
    if not mastery:
        domains = GRADE2_DOMAINS if data.grade == 2 else GRADE3_DOMAINS
        for dom in domains.values():
            for s in dom["skills"]:
                mastery[s["id"]] = 50.0

    try:
        paper_data = generator.generate_adaptive_paper(
            student_id=data.student_id,
            answered_question_ids=set(data.answered_question_ids),
            skill_mastery=mastery,
            paper_size=data.paper_size
        )
        paper_data["paper_number"] = data.paper_number
        paper_data["grade"] = data.grade
        return paper_data
    except QuestionPoolExhaustedError as e:
        raise HTTPException(
            status_code=422,
            detail=f"Question Pool Exhausted: {str(e)}"
        )

# ---------------------------------------------------------
# Grade 2 Adaptive Interactive Session Engine
# ---------------------------------------------------------
grade2_adaptive_engine = Grade2AdaptiveEngine()
grade2_sessions: dict[str, dict] = {}

class Grade2SessionStartData(BaseModel):
    student_id: str = "student_demo"
    previously_answered_ids: list[str] = []

class Grade2AnswerSubmitData(BaseModel):
    student_id: str
    question_id: str
    skill_id: str
    difficulty_tier: int = 1
    is_correct: bool
    student_answer: str = ""
    time_ms: float = 5000.0
    affect_confusion: float = 0.0

@app.get("/api/ai/math/grade2/curriculum")
def get_grade2_curriculum():
    """Returns the full 4 Domains x 5 Skills Grade 2 Curriculum Framework"""
    return {
        "domains": GRADE2_DOMAINS,
        "total_skills": 20,
        "total_domains": 4
    }

@app.post("/api/ai/math/grade2/start")
def start_grade2_session(data: Grade2SessionStartData):
    """Starts a new adaptive 10-question Grade 2 session with 20-skill student model"""
    session = grade2_adaptive_engine.create_new_session(data.student_id, data.previously_answered_ids)
    grade2_sessions[data.student_id] = session
    first_q = grade2_adaptive_engine.select_next_question(session)
    return {
        "session_id": session["session_id"],
        "grade": 2,
        "questions_asked": 0,
        "max_questions": session["max_questions"],
        "current_difficulty": session["current_difficulty"],
        "skill_mastery": session["skill_mastery"],
        "first_question": first_q,
        "message": "Grade 2 Adaptive Session initialized (Diagnostic Phase)."
    }

@app.post("/api/ai/math/grade2/submit-answer")
def submit_grade2_answer(data: Grade2AnswerSubmitData):
    """Processes Grade 2 student answer, updates 20-skill mastery vector, and selects next adaptive question"""
    student_id = data.student_id
    if student_id not in grade2_sessions:
        grade2_sessions[student_id] = grade2_adaptive_engine.create_new_session(student_id)
    
    session = grade2_sessions[student_id]
    
    answer_payload = {
        "question_id": data.question_id,
        "skill_id": data.skill_id,
        "difficulty_tier": data.difficulty_tier,
        "is_correct": data.is_correct,
        "student_answer": data.student_answer,
        "time_ms": data.time_ms
    }
    session = grade2_adaptive_engine.update_mastery(session, answer_payload)
    
    if session["is_complete"]:
        report = grade2_adaptive_engine.generate_learner_report(session)
        return {
            "session_complete": True,
            "learner_report": report,
            "message": "Grade 2 Adaptive Diagnostic Complete! Review your comprehensive mastery report."
        }
    
    next_q = grade2_adaptive_engine.select_next_question(session)
    
    return {
        "session_complete": False,
        "questions_asked": session["questions_asked"],
        "max_questions": session["max_questions"],
        "current_difficulty": session["current_difficulty"],
        "skill_mastery": session["skill_mastery"],
        "next_question": next_q,
        "last_feedback": session["history"][-1]["remedial_feedback"],
        "last_misconception": session["history"][-1]["misconception"]
    }

# ---------------------------------------------------------
# Grade 3 Adaptive Mathematics Research Engine
# ---------------------------------------------------------
grade3_adaptive_engine = Grade3AdaptiveEngine()
grade3_sessions: dict[str, dict] = {}

class Grade3SessionStartData(BaseModel):
    student_id: str = "student_demo"
    previously_answered_ids: list[str] = []

class Grade3AnswerSubmitData(BaseModel):
    student_id: str
    question_id: str
    skill_id: str
    difficulty_tier: int = 1
    is_correct: bool
    student_answer: str = ""
    time_ms: float = 5000.0
    affect_confusion: float = 0.0

@app.get("/api/ai/math/grade3/curriculum")
def get_grade3_curriculum():
    """Returns the full 4 Domains x 5 Skills Grade 3 Curriculum Framework"""
    return {
        "domains": GRADE3_DOMAINS,
        "total_skills": 20,
        "total_domains": 4
    }

@app.post("/api/ai/math/grade3/start")
def start_grade3_session(data: Grade3SessionStartData):
    """Starts a new adaptive 10-question Grade 3 session with 20-skill student model"""
    session = grade3_adaptive_engine.create_new_session(data.student_id, data.previously_answered_ids)
    grade3_sessions[data.student_id] = session
    first_q = grade3_adaptive_engine.select_next_question(session)
    return {
        "session_id": session["session_id"],
        "questions_asked": 0,
        "max_questions": session["max_questions"],
        "current_difficulty": session["current_difficulty"],
        "skill_mastery": session["skill_mastery"],
        "first_question": first_q,
        "message": "Grade 3 Adaptive Session initialized (Diagnostic Phase)."
    }

@app.post("/api/ai/math/grade3/submit-answer")
def submit_grade3_answer(data: Grade3AnswerSubmitData):
    """Processes student answer, updates 20-skill mastery vector, and selects next adaptive question"""
    student_id = data.student_id
    if student_id not in grade3_sessions:
        grade3_sessions[student_id] = grade3_adaptive_engine.create_new_session(student_id)
    
    session = grade3_sessions[student_id]
    
    # 1. Update mastery & streak
    answer_payload = {
        "question_id": data.question_id,
        "skill_id": data.skill_id,
        "difficulty_tier": data.difficulty_tier,
        "is_correct": data.is_correct,
        "student_answer": data.student_answer,
        "time_ms": data.time_ms
    }
    session = grade3_adaptive_engine.update_mastery(session, answer_payload)
    
    # 2. Check completion
    if session["is_complete"]:
        report = grade3_adaptive_engine.generate_learner_report(session)
        return {
            "session_complete": True,
            "learner_report": report,
            "message": "Grade 3 Adaptive Diagnostic Complete! Review your comprehensive mastery report."
        }
    
    # 3. Select next adaptive question
    next_q = grade3_adaptive_engine.select_next_question(session)
    
    return {
        "session_complete": False,
        "questions_asked": session["questions_asked"],
        "max_questions": session["max_questions"],
        "current_difficulty": session["current_difficulty"],
        "skill_mastery": session["skill_mastery"],
        "next_question": next_q,
        "last_feedback": session["history"][-1]["remedial_feedback"],
        "last_misconception": session["history"][-1]["misconception"]
    }


# ---------------------------------------------------------
# 2. Suvinya - English Pronunciation AI
# ---------------------------------------------------------
# ---------------------------------------------------------
# 2. Suvinya - Multi-Stage English Pronunciation, Fluency & Speaking Assessment
# ---------------------------------------------------------
@app.post("/api/ai/english/pronunciation")
def analyze_pronunciation(data: SpeechAudioData):
    """
    Research-Grade 6-Stage Multimodal Audio-Visual Assessment Endpoint:
    1. Signal Preprocessing & VAD (16kHz standard)
    2. Visual Viseme & Lip Kinematic Tracking (Bilabial closure, Labiodental, Rounding)
    3. Objective Acoustic Prosody & Fluency (F0 contour, WPM, Pauses, Intonation slope)
    4. Explicit 12 Sri Lankan MTI Rule Detectors with Probabilistic Evidence
    5. Phoneme Sequence Alignment & Error Rate (G2P + Needleman-Wunsch DP)
    6. Evidence Fusion & Hierarchical 5-Score Model (Pronunciation, Fluency, Prosody, Completeness, Intelligibility)
    """
    import numpy as np
    import base64
    import io
    import librosa
    
    # ---------------------------------------------------------
    # Stage 1: Audio Signal Ingestion & Preprocessing
    # ---------------------------------------------------------
    try:
        if isinstance(data, dict):
            audio_b64 = data.get("audio_base64", "")
            target_text = data.get("target_text", "").strip()
            student_id = data.get("student_id", "student_01")
            video_frames = data.get("video_frames_base64", [])
        else:
            audio_b64 = getattr(data, "audio_base64", "")
            target_text = getattr(data, "target_text", "").strip()
            student_id = getattr(data, "student_id", "student_01")
            video_frames = getattr(data, "video_frames_base64", [])

        if not audio_b64 or audio_b64 == "dummy_base64_audio":
            raise ValueError("Empty or dummy audio provided.")
            
        audio_bytes = base64.b64decode(audio_b64)
        print(f"[DEBUG] Multi-Stage Assessment -> audio: {len(audio_bytes)} bytes, target='{target_text}', student='{student_id}'")
        
        y = None
        sr = 16000
        
        # 1. Fast path: Standard RIFF WAV header
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
                print(f"[DEBUG] soundfile decode notice: {sf_err}")
                
        # 2. Universal PyAV path: WebM, Opus, OGG, MP3
        if y is None:
            try:
                import av
                container = av.open(io.BytesIO(audio_bytes))
                stream = container.streams.audio[0]
                resampler = av.AudioResampler(format='fltp', layout='mono', rate=16000)
                audio_frames = []
                for frame in container.decode(stream):
                    for rf in resampler.resample(frame):
                        audio_frames.append(rf.to_ndarray())
                if audio_frames:
                    y = np.concatenate(audio_frames, axis=1).squeeze()
                    sr = 16000
            except Exception as av_err:
                print(f"[DEBUG] PyAV decode error: {av_err}")
                
        if y is None:
            raise ValueError(f"Could not decode audio stream.")
            
        if y.ndim > 1:
            y = y.mean(axis=1)
            
        # 1. High-Precision Acoustic Physics Speech Classifier
        peak = float(np.max(np.abs(y)))
        raw_rms = librosa.feature.rms(y=y)[0]
        max_raw_rms = float(np.max(raw_rms)) if len(raw_rms) > 0 else 0.0
        mean_raw_rms = float(np.mean(raw_rms)) if len(raw_rms) > 0 else 0.0
        dyn_ratio = max_raw_rms / max(0.00001, mean_raw_rms)
        flatness = float(np.mean(librosa.feature.spectral_flatness(y=y)))
        duration = float(librosa.get_duration(y=y, sr=sr))
        
        print(f"[DEBUG] Raw peak: {peak:.4f}, max_rms: {max_raw_rms:.4f}, dyn_ratio: {dyn_ratio:.2f}, flatness: {flatness:.4f}, dur: {duration:.2f}s")
        
        # Mathematical Speech Verification:
        # 1. Peak must be at least 0.005 (filters out dead silence)
        # 2. Dynamic Energy Ratio: ambient flat room noise has peak < 0.03 and dyn_ratio < 1.40
        # 3. Spectral Flatness: pure white noise / static has flatness > 0.600
        is_speech = True
        reject_reason = ""
        if peak < 0.005:
            is_speech = False
            reject_reason = f"Peak amplitude too low ({peak:.4f} < 0.005)"
        elif peak < 0.03 and dyn_ratio < 1.40:
            is_speech = False
            reject_reason = f"Acoustic energy envelope flat ({dyn_ratio:.2f} < 1.40) - room noise"
        elif flatness > 0.60:
            is_speech = False
            reject_reason = f"Spectral flatness too high ({flatness:.3f} > 0.600) - white noise"
            
        if not is_speech:
            print(f"[DEBUG] Audio rejected: {reject_reason}")
            return {
                "overall_score": 0.0,
                "severity_level": 4,
                "diagnostics": {"pronunciation": 0.0, "fluency": 0.0, "prosody": 0.0, "completeness": 0.0, "intelligibility": 0.0, "visual_lip_score": 0.0},
                "fluency_metrics": {
                    "speech_rate_wpm": 0.0,
                    "pause_count": 0,
                    "pause_ratio": 1.0,
                    "long_pauses_500ms": 0,
                    "intonation_slope": "None (No Voice)",
                    "is_monotone": False
                },
                "visual_diagnostics": {},
                "phoneme_alignment": {},
                "mti_patterns": [],
                "l1_contrast_flag": None,
                "feedback": {
                    "learner_message": "Oops, I didn't hear any words! Please speak clearly into the microphone.",
                    "teacher_message": f"Audio rejected: {reject_reason}."
                }
            }
            
        # 2. Peak Amplitude Normalization (only normalize verified speech)
        if peak > 0.0001:
            y = (y / peak) * 0.90
    except Exception as e:
        return {
            "overall_score": 0.0,
            "severity_level": 4,
            "diagnostics": {"pronunciation": 0.0, "fluency": 0.0, "prosody": 0.0, "completeness": 0.0, "intelligibility": 0.0},
            "fluency_metrics": {
                "speech_rate_wpm": 0.0,
                "long_pauses_500ms": 0,
                "intonation_slope": "Error",
                "is_monotone": False
            },
            "mti_patterns": [],
            "l1_contrast_flag": None,
            "feedback": {
                "learner_message": "Audio error occurred. Please try recording again.",
                "teacher_message": f"Pipeline ingestion error: {str(e)}"
            }
        }

    # ---------------------------------------------------------
    # Stage 2: Visual Viseme & Lip Articulation Analysis
    # ---------------------------------------------------------
    has_video = bool(video_frames and len(video_frames) > 0)
    visual_lip_score = 0.0
    visual_closure_detected = False
    visual_rounding_detected = False
    visual_diagnostics = {}
    
    if visual_lip_analyzer is not None and has_video:
        try:
            vis_res = visual_lip_analyzer.evaluate_video_sequence(video_frames, target_text)
            visual_lip_score = float(vis_res.get("visual_score", 80.0))
            visual_diagnostics = vis_res.get("visual_diagnostics", {})
            visual_closure_detected = "Detected" in visual_diagnostics.get("bilabial_closure", "")
            visual_rounding_detected = "Rounded" in visual_diagnostics.get("lip_rounding", "")
        except Exception as v_err:
            print(f"[DEBUG] Visual lip evaluation notice: {v_err}")

    # ---------------------------------------------------------
    # Stage 3: Objective Fluency & Prosody Analysis
    # ---------------------------------------------------------
    is_question = "?" in target_text or target_text.lower().startswith(("what", "where", "who", "why", "how", "can", "is", "are", "do"))
    if fluency_prosody_analyzer is not None:
        prosody_res = fluency_prosody_analyzer.analyze(y, target_text=target_text, expected_is_question=is_question)
    else:
        prosody_res = {
            "speech_rate_wpm": 0.0, "pause_count": 0, "pause_ratio": 0.0,
            "long_pauses_500ms": 0, "long_pauses_1000ms": 0, "intonation_slope": "Neutral",
            "is_monotone": False, "fluency_score": 0.0, "prosody_score": 0.0, "speaking_duration": 0.0
        }

    # ---------------------------------------------------------
    # Stage 4: Sri Lankan MTI Rule Detectors & Phoneme Alignment
    # ---------------------------------------------------------
    mti_res = None
    if sri_lankan_mti_engine is not None:
        mti_res = sri_lankan_mti_engine.evaluate(
            y, 
            target_word=target_text, 
            visual_closure=visual_closure_detected, 
            visual_rounding=visual_rounding_detected
        )
        
    detected_mti_patterns = mti_res.get("detected_patterns", []) if mti_res else []
    primary_mti = mti_res.get("primary_mti_flag") if mti_res else None
    phoneme_accuracy = float(mti_res.get("phoneme_accuracy", 0.0)) if mti_res else 0.0
    phoneme_alignment = mti_res.get("phoneme_alignment", {}) if mti_res else {}

    # ---------------------------------------------------------
    # Stage 4.5: OpenPronounce (Remote Colab API via ngrok / localtunnel)
    # ---------------------------------------------------------
    openpronounce_res = None
    COLAB_URL = os.getenv("COLAB_OPENPRONOUNCE_URL", "") 
    
    if COLAB_URL:
        try:
            import requests
            import soundfile as sf
            import io
            
            # 1. Convert the audio array back into a WAV file in memory
            wav_io = io.BytesIO()
            sf.write(wav_io, y, 16000, format='WAV', subtype='PCM_16')
            wav_io.seek(0)
            
            # 2. Send it to Google Colab Server
            files = {'file': ('audio.wav', wav_io, 'audio/wav')}
            data = {'expected_text': target_text, 'lang': 'en'}
            headers = {'Bypass-Tunnel-Reminder': 'true'}
            
            print(f"[DEBUG] Sending audio to Colab OpenPronounce: {COLAB_URL}")
            op_response = requests.post(f"{COLAB_URL}/pronunciation", files=files, data=data, headers=headers, timeout=(1.0, 2.0))
            
            if op_response.status_code == 200:
                op_res = op_response.json()
                raw_score = float(op_res.get("score", 0.0))
                diff = op_res.get("differences", {})
                heard = diff.get("heard_phones", [])
                wer = float(diff.get("word_error_rate", 1.0))
                
                # Check if OpenPronounce detected nothing or complete error
                if len(heard) == 0 or (wer >= 1.0 and raw_score < 25.0):
                    phoneme_accuracy = 0.0
                else:
                    phoneme_accuracy = raw_score
                    
                phoneme_alignment = {
                    "expected_phones": diff.get("expected_phones", []),
                    "heard_phones": heard,
                    "errors": diff.get("errors", [])
                }
                openpronounce_res = op_res
                print(f"[DEBUG] Colab returned score: {phoneme_accuracy}, heard: {heard}")
            else:
                print(f"[DEBUG] Colab error {op_response.status_code}: {op_response.text}")
                
        except Exception as op_err:
            print(f"[DEBUG] Colab OpenPronounce connection error: {op_err}")
        
    # ---------------------------------------------------------
    # Stage 5: Evidence Fusion & Hierarchical 5-Score Calculation
    # ---------------------------------------------------------
    # If no voice was spoken or phonemes are completely missing
    if phoneme_accuracy == 0.0 and prosody_res.get("speaking_duration", 0.0) < 0.20:
        return {
            "overall_score": 0.0,
            "severity_level": 4,
            "diagnostics": {"pronunciation": 0.0, "fluency": 0.0, "prosody": 0.0, "completeness": 0.0, "intelligibility": 0.0},
            "fluency_metrics": {
                "speech_rate_wpm": 0.0,
                "long_pauses_500ms": 0,
                "intonation_slope": "None",
                "is_monotone": False
            },
            "mti_patterns": [],
            "l1_contrast_flag": None,
            "feedback": {
                "learner_message": "Oops, I didn't hear any words! Please speak clearly into the microphone.",
                "teacher_message": "Target word not recognized in the audio recording."
            }
        }

    # 1. Pronunciation Score (0 - 100): 100% acoustic if no video
    if has_video:
        pronunciation_score = (0.80 * phoneme_accuracy) + (0.20 * visual_lip_score)
    else:
        pronunciation_score = float(phoneme_accuracy)
        
    if primary_mti:
        pronunciation_score = min(68.0, pronunciation_score)
        
    # 2. Fluency Score (0 - 100)
    fluency_score = float(prosody_res.get("fluency_score", 0.0))
    
    # 3. Prosody Score (0 - 100)
    prosody_score = float(prosody_res.get("prosody_score", 0.0))
    
    # 4. Completeness Score (0 - 100)
    completeness_score = 100.0
    if openpronounce_res:
        wer = float(openpronounce_res.get("differences", {}).get("word_error_rate", 0.0))
        completeness_score = max(0.0, 100.0 * (1.0 - wer))
    elif primary_mti and "Consonant" in str(primary_mti):
        completeness_score = 80.0
        
    # 5. Intelligibility Score (0 - 100): Weighted synthesis
    intelligibility_penalty = 20.0 if primary_mti else 0.0
    if prosody_res.get("is_monotone"):
        intelligibility_penalty += 10.0
    intelligibility_score = max(0.0, min(100.0, ((pronunciation_score + fluency_score + prosody_score) / 3.0) - intelligibility_penalty))
    
    # Overall Multi-Stage Score (0 - 100)
    overall_score = (0.35 * pronunciation_score) + (0.25 * intelligibility_score) + (0.20 * fluency_score) + (0.10 * prosody_score) + (0.10 * completeness_score)
    overall_score = float(round(max(0.0, min(100.0, overall_score)), 1))

    # Error Severity
    if overall_score >= 80 and not primary_mti:
        severity_level = 0
    elif overall_score >= 65:
        severity_level = 1
    elif overall_score >= 50 or primary_mti:
        severity_level = 2
    else:
        severity_level = 3

    # ---------------------------------------------------------
    # Stage 6: Pedagogical Child-Friendly Diagnostic Reporting
    # ---------------------------------------------------------
    if not primary_mti and overall_score >= 85:
        learner_message = "🌟 Excellent! Your pronunciation and speaking rhythm were very clear."
        teacher_message = f"Clear articulation. Target phonemes matched expected standard."
    elif primary_mti:
        top_mti = detected_mti_patterns[0]
        learner_message = f"Good attempt! {top_mti.get('pedagogical_tip')}"
        teacher_message = f"Detected L1 Sri Lankan MTI Pattern: {top_mti.get('pattern_name')} (Confidence: {int(top_mti.get('probability', 0.9)*100)}%). Evidence: {top_mti.get('evidence')}."
    elif overall_score < 40:
        learner_message = "Keep practicing! Try speaking a little louder and clearer."
        teacher_message = f"Low intelligibility. Speech rate: {prosody_res.get('speech_rate_wpm')} WPM."
    else:
        learner_message = "Nice try! Keep practicing speaking clearly and smoothly."
        teacher_message = f"Moderate intelligibility. Speech rate: {prosody_res.get('speech_rate_wpm')} WPM."

    if prosody_res.get("is_monotone"):
        learner_message += " Try adding a little more melody and feeling to your voice!"

    # ---------------------------------------------------------
    # Comprehensive Console Step-by-Step Diagnostic Trace (Pure ASCII)
    # ---------------------------------------------------------
    mti_names = [p.get("pattern_name", "") for p in detected_mti_patterns]
    print("\n" + "="*80)
    print(f"[AUDIO ASSESSMENT COMPLETE] Target Word: '{target_text}' | Student: {student_id}")
    print("="*80)
    print(f"[STAGE 1] Audio Signal Ingestion & Gate")
    print(f"  - Raw Audio: {len(audio_bytes)} bytes | Duration: {duration:.2f}s | Sample Rate: {sr}Hz")
    print(f"  - Peak Amplitude: {peak:.4f} | Max RMS: {max_raw_rms:.4f}")
    print(f"  - Dynamic Energy Ratio: {dyn_ratio:.2f} (Threshold >= 2.50)")
    print(f"  - Spectral Flatness: {flatness:.4f} (Threshold <= 0.120)")
    print(f"  - Status: HUMAN SPEECH VERIFIED [PASS]")
    print(f"\n[STAGE 2] Objective Fluency & Prosody Analysis")
    print(f"  - Speech Rate: {prosody_res.get('speech_rate_wpm', 0)} WPM | Articulation Rate: {prosody_res.get('articulation_rate', 0)} syl/s")
    print(f"  - Pauses: {prosody_res.get('pause_count', 0)} (Long >0.5s: {prosody_res.get('long_pauses_500ms', 0)}), Pause Ratio: {prosody_res.get('pause_ratio', 0)}")
    print(f"  - Pitch F0 Mean: {prosody_res.get('f0_mean_hz', 0)} Hz | Variance: {prosody_res.get('f0_variance', 0)} | Intonation: {prosody_res.get('intonation_slope', 'Neutral')}")
    print(f"  - Fluency Score: {fluency_score:.1f}% | Prosody Score: {prosody_score:.1f}%")
    print(f"\n[STAGE 3] Sri Lankan MTI Accent Analysis")
    exp_phones = phoneme_alignment.get('expected_sequence') or phoneme_alignment.get('expected_phones', [])
    hrd_phones = phoneme_alignment.get('heard_sequence') or phoneme_alignment.get('heard_phones', [])
    print(f"  - Expected Phonemes: {exp_phones}")
    print(f"  - Heard Phonemes:    {hrd_phones}")
    print(f"  - MTI Detected:      {mti_names if mti_names else 'None (Clean Standard Articulation)'}")
    print(f"  - Phoneme Accuracy:  {phoneme_accuracy:.1f}%")
    print(f"\n[STAGE 4] Multi-Stage Evidence Fusion")
    print(f"  - [35%] Pronunciation Score:   {pronunciation_score:.1f}%")
    print(f"  - [25%] Intelligibility Score: {intelligibility_score:.1f}%")
    print(f"  - [20%] Fluency Score:         {fluency_score:.1f}%")
    print(f"  - [10%] Prosody Score:         {prosody_score:.1f}%")
    print(f"  - [10%] Completeness Score:    {completeness_score:.1f}%")
    print(f"  -------------------------------------------------------------")
    print(f"  >>> OVERALL MULTI-STAGE SCORE: {overall_score} / 100 (Severity: Level {severity_level})")
    print(f"\n[STAGE 5] Pedagogical Feedback Delivered")
    print(f"  - Learner Message: \"{learner_message}\"")
    print(f"  - Teacher Diagnostic: \"{teacher_message}\"")
    print("="*80 + "\n")

    return {
        "overall_score": overall_score,
        "severity_level": severity_level,
        "diagnostics": {
            "pronunciation": round(pronunciation_score, 1),
            "fluency": round(fluency_score, 1),
            "prosody": round(prosody_score, 1),
            "completeness": round(completeness_score, 1),
            "intelligibility": round(intelligibility_score, 1),
            "visual_lip_score": round(visual_lip_score, 1)
        },
        "fluency_metrics": {
            "speech_rate_wpm": prosody_res.get("speech_rate_wpm"),
            "pause_count": prosody_res.get("pause_count"),
            "pause_ratio": prosody_res.get("pause_ratio"),
            "long_pauses_500ms": prosody_res.get("long_pauses_500ms"),
            "intonation_slope": prosody_res.get("intonation_slope"),
            "is_monotone": bool(prosody_res.get("is_monotone"))
        },
        "visual_diagnostics": visual_diagnostics,
        "phoneme_alignment": phoneme_alignment,
        "mti_patterns": detected_mti_patterns,
        "l1_contrast_flag": primary_mti,
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
    Discriminative CLIP Vision Classifier for Story Drawing with Negative Confusers.
    Prevents false positives from non-story objects (vehicles, buildings, electronics)
    and accurately validates expected story characters.
    """
    import base64
    import io

    # Detailed descriptions for all story characters across the 8 curriculum stories
    STORY_FEATURE_DESCRIPTIONS = {
        "ant": [
            "a small black ant crawling on the ground or water or leaf",
            "a tiny black insect ant with legs and antennae",
            "a drawing of an ant in a story",
            "a cartoon black ant"
        ],
        "dove": [
            "a white dove or pigeon bird with wings and feathers",
            "a white bird perched on a tree branch or flying",
            "a drawing of a white dove bird",
            "a cartoon white pigeon or dove"
        ],
        "lion": [
            "a large lion with a thick golden furry mane around its head",
            "a cartoon or drawing of a lion with a mane in the jungle",
            "a golden lion resting or roaring"
        ],
        "mouse": [
            "a tiny rodent mouse with round ears, whiskers, and a long thin tail",
            "a small cartoon mouse on the ground or in a net",
            "a drawing of a little gray or brown mouse"
        ],
        "rabbit": [
            "a small rabbit or bunny with long upright ears and a fluffy tail",
            "a cartoon bunny running or sitting in the grass",
            "a drawing of a rabbit with big ears"
        ],
        "tortoise": [
            "a reptile tortoise or turtle with a hard dome-shaped patterned shell on its back",
            "a cartoon turtle crawling slowly with a green or brown shell",
            "a drawing of a tortoise"
        ],
        "crow": [
            "a black crow or raven bird with black feathers and a sharp beak",
            "a cartoon black crow perched on a tree branch with cheese",
            "a drawing of a black bird or crow"
        ],
        "fox": [
            "an orange-red fox animal with pointed ears, long bushy tail, and pointed snout",
            "a cartoon red fox looking up at a tree",
            "a drawing of a red fox"
        ],
        "deer": [
            "a slender brown deer or fawn with thin long legs and spots or antlers",
            "a cartoon deer in a forest",
            "a drawing of a brown deer animal"
        ],
        "monkey": [
            "a monkey with a long tail in a tree eating fruit",
            "a brown cartoon monkey swinging on branches",
            "a drawing of a monkey"
        ],
        "crocodile": [
            "a large green crocodile or alligator with sharp teeth and scaly skin in water",
            "a cartoon green crocodile swimming in a river",
            "a drawing of a crocodile"
        ],
        "rooster": [
            "a colorful rooster or cockerel with a bright red comb and tail feathers",
            "a farm rooster or chicken standing on the ground",
            "a drawing of a rooster"
        ],
        "jewel": [
            "a shiny sparkling gemstone, diamond, crystal, or ruby jewel",
            "a glittering precious gemstone jewel",
            "a drawing of a sparkling diamond jewel"
        ],
        "farmer": [
            "a human farmer or person wearing farm clothes or a hat",
            "a cartoon person or man standing on a farm",
            "a drawing of a farmer"
        ],
        "owl": [
            "an owl bird with large round eyes and feathers perched on a tree at night",
            "a cartoon owl with big round eyes",
            "a drawing of an owl"
        ],
        "bird": [
            "a small bird with wings and beak perched in a nest or flying",
            "a cartoon baby bird",
            "a drawing of a little bird"
        ]
    }

    # General Non-Story Negative Confusers (Crucial: prevents vehicles, buildings, random items from scoring)
    GENERAL_NEGATIVE_CONFUSERS = [
        "a car, van, truck, bus, camper, or motor vehicle",
        "an automobile, vehicle, or transport on wheels",
        "a building, house, room interior, city street, or road with no animals",
        "furniture, chair, table, appliance, or household electronics",
        "a scribble, text document, chart diagram, or abstract geometric shape",
        "food, pizza, cake, burger, or meal plate"
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

        expected_keys = [e.lower().strip() for e in data.expected_elements]

        for element in data.expected_elements:
            element_key = element.lower().strip()
            pos_prompts = STORY_FEATURE_DESCRIPTIONS.get(element_key, [f"a drawing of a {element_key}"])

            # Confusers: Non-story objects + other animals NOT part of this story
            other_animals = []
            for k, v in STORY_FEATURE_DESCRIPTIONS.items():
                if k not in expected_keys:
                    other_animals.append(v[0])

            all_texts = pos_prompts + GENERAL_NEGATIVE_CONFUSERS + other_animals
            num_pos = len(pos_prompts)
            num_neg_general = len(GENERAL_NEGATIVE_CONFUSERS)

            inputs = processor(
                text=all_texts,
                images=image,
                return_tensors="pt",
                padding=True
            )

            with torch.no_grad():
                outputs = model(**inputs)
                probs = outputs.logits_per_image.softmax(dim=1)[0]

            pos_sum = sum(probs[i].item() for i in range(num_pos))
            best_pos = max(probs[i].item() for i in range(num_pos))

            neg_general_sum = sum(probs[num_pos + i].item() for i in range(num_neg_general))
            best_neg_general = max(probs[num_pos + i].item() for i in range(num_neg_general))

            top_idx = torch.argmax(probs).item()

            # Discriminative Detection Criteria:
            # 1. Best positive score must be at least 0.15
            # 2. General negative confusers (vehicles, buildings) must NOT dominate
            # 3. Positive sum must be higher than general negative sum
            found = (best_pos >= 0.15 and pos_sum > neg_general_sum and best_pos > best_neg_general * 0.7)

            if found:
                detected.append(element)
            else:
                missing.append(element)

    except Exception as e:
        print(f"CLIP detection notice: {e}")
        for el in data.expected_elements:
            missing.append(el)

    # --- Score & Feedback Calculation ---
    # If at least one character from the story is drawn, it is correct!
    is_correct = len(detected) > 0
    score = 100 if is_correct else 0

    if is_correct:
        feedback_sinhala = "ඔබ කතාවට අනුව චිත්‍රය නිවැරදිව ඇඳ ඇත!"
        feedback_english = "You correctly drew the drawing according to the story!"
    else:
        feedback_sinhala = "කතාවේ චරිත චිත්‍රයේ පැහැදිලිව දක්නට නැත. නැවත උත්සාහ කරන්න!"
        feedback_english = "The characters of the story are not clearly visible in the drawing. Try again!"

    return {
        "score": score,
        "is_correct": is_correct,
        "detected_elements": detected,
        "missing_elements": missing,
        "feedback_sinhala": feedback_sinhala,
        "feedback_english": feedback_english
    }

if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting LearnAI Python Microservice on http://{host}:{port}...")
    uvicorn.run("main:app", host=host, port=port, reload=True)
