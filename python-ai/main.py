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
    client_transcript: str = ""
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
    Comprehensive 6-Dimensional English Speech & Pronunciation Assessment:
    1. Overall Score & 100% Pass Standard
    2. Word & Sentence Accuracy (DP LCS alignment)
    3. Fluency (Speech Rate WPM, Pauses, Repetitions / Hesitations)
    4. Intonation & Rhythm (F0 Pitch dynamics, Monotone detection, Question slope)
    5. Volume & Clarity (Too soft / optimal / too loud, SNR clarity)
    6. 12 Sri Lankan MTI Patterns & Non-MTI Syntactic Analysis
    """
    import numpy as np
    import base64
    import io
    import re
    import librosa
    import soundfile as sf
    import speech_recognition as sr

    try:
        if isinstance(data, dict):
            audio_b64 = data.get("audio_base64", "")
            target_text = data.get("target_text", "").strip()
            student_id = data.get("student_id", "student_01")
            client_transcript = data.get("client_transcript", "").strip()
            response_latency_ms = float(data.get("response_latency_ms", 0.0))
        else:
            audio_b64 = getattr(data, "audio_base64", "")
            target_text = getattr(data, "target_text", "").strip()
            student_id = getattr(data, "student_id", "student_01")
            client_transcript = getattr(data, "client_transcript", "").strip()
            response_latency_ms = float(getattr(data, "response_latency_ms", 0.0))

        y = None
        sr_rate = 16000
        peak = 0.0
        
        if audio_b64 and audio_b64 != "dummy_base64_audio":
            try:
                audio_bytes = base64.b64decode(audio_b64)
                if audio_bytes[:4] == b'RIFF':
                    y_raw, file_sr = sf.read(io.BytesIO(audio_bytes), dtype='float32', always_2d=False)
                    if file_sr != 16000:
                        y = librosa.resample(y_raw, orig_sr=file_sr, target_sr=16000)
                    else:
                        y = y_raw
                else:
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
            except Exception as e:
                print(f"[AUDIO DECODE NOTICE] {e}")

        if y is not None and len(y) > 0:
            if y.ndim > 1:
                y = y.mean(axis=1)
            peak = float(np.max(np.abs(y)))
            y_norm = (y / peak) * 0.90 if peak > 0.0001 else y
        else:
            y_norm = np.zeros(1600, dtype=np.float32)

        # 1. Speech-to-Text
        recognized_text = client_transcript or ""
        if y is not None and len(y) > 3200 and not recognized_text:
            try:
                wav_io = io.BytesIO()
                sf.write(wav_io, y_norm, 16000, format='WAV', subtype='PCM_16')
                wav_io.seek(0)
                recognizer = sr.Recognizer()
                with sr.AudioFile(wav_io) as source:
                    audio_data = recognizer.record(source)
                recognized_text = recognizer.recognize_google(audio_data, language='en-US')
            except Exception:
                pass

        if not recognized_text and client_transcript:
            recognized_text = client_transcript

        # 2. Fluency & Prosody Analysis (All 6 Features)
        fluency_res = {}
        if fluency_prosody_analyzer is not None:
            fluency_res = fluency_prosody_analyzer.analyze(
                y=y_norm,
                spoken_text=recognized_text,
                target_text=target_text,
                response_latency_ms=response_latency_ms
            )

        # 3. 12 Sri Lankan MTI Pattern Analysis
        mti_detected = []
        if sri_lankan_mti_engine is not None:
            # Check text-level substitutions
            mti_text_patterns = sri_lankan_mti_engine.analyze_spoken_text(recognized_text, target_text)
            # Check acoustic signal patterns
            mti_acoustic_res = sri_lankan_mti_engine.evaluate(y_norm, target_word=target_text)
            
            seen_keys = set()
            for p in mti_text_patterns:
                if p["key"] not in seen_keys:
                    seen_keys.add(p["key"])
                    mti_detected.append(p)
            for p in mti_acoustic_res.get("detected_patterns", []):
                if p["key"] not in seen_keys:
                    seen_keys.add(p["key"])
                    mti_detected.append(p)

        # 4. Word Level Alignment & Accuracy
        spoken_clean = re.sub(r'[^a-zA-Z0-9 ]', '', recognized_text).lower().strip()
        target_clean = re.sub(r'[^a-zA-Z0-9 ]', '', target_text).lower().strip()
        spoken_words = spoken_clean.split()
        target_words = target_clean.split()

        matches = sum(1 for w in target_words if w in spoken_words)
        total_words = max(1, len(target_words))
        word_accuracy = round((matches / total_words) * 100.0, 1)
        
        # 100% Pass Standard
        is_passed = (matches == total_words and len(mti_detected) == 0 and word_accuracy == 100.0)

        return {
            "sound_detected": bool(peak >= 0.005 or len(spoken_clean) > 0),
            "words_correct": (matches == total_words),
            "pronunciation_correct": is_passed,
            "overall_score": word_accuracy if not mti_detected else min(70.0, word_accuracy),
            "is_passed": is_passed,
            "transcript": recognized_text or "(No speech)",
            "target_text": target_text,
            "word_accuracy": word_accuracy,
            "matched_words_count": matches,
            "total_words_count": total_words,
            "mti_analysis": {
                "has_mti": len(mti_detected) > 0,
                "detected_count": len(mti_detected),
                "patterns": mti_detected
            },
            "fluency": fluency_res.get("fluency", {}),
            "intonation_rhythm": fluency_res.get("intonation_rhythm", {}),
            "volume_clarity": fluency_res.get("volume_clarity", {}),
            "non_mti_errors": fluency_res.get("non_mti_errors", {}),
            "engagement": fluency_res.get("engagement", {})
        }

    except Exception as e:
        print(f"[ENGLISH PRONUNCIATION ENDPOINT ERROR] {e}")
        return {
            "sound_detected": True,
            "words_correct": False,
            "pronunciation_correct": False,
            "overall_score": 0.0,
            "is_passed": False,
            "transcript": client_transcript or "",
            "target_text": target_text,
            "mti_analysis": {"has_mti": False, "detected_count": 0, "patterns": []},
            "fluency": {},
            "intonation_rhythm": {},
            "volume_clarity": {},
            "non_mti_errors": {},
            "engagement": {}
        }

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
    Prevents false positives from pure landscapes, scenery without animals, vehicles,
    buildings, and non-story objects. Accepts drawing if any story character is present.
    """
    import base64
    import io

    # Pure physical feature descriptions for all 16 story characters (NO generic background noise)
    STORY_FEATURE_DESCRIPTIONS = {
        "ant": [
            "a drawing of a black ant insect with six legs and antennae",
            "a tiny black ant crawling",
            "a cartoon sketch of an ant insect"
        ],
        "dove": [
            "a drawing of a white dove bird with wings and beak",
            "a white pigeon or dove bird",
            "a cartoon white bird with wings"
        ],
        "lion": [
            "a drawing of a wild cat lion with a large thick furry mane",
            "a golden lion animal with a mane",
            "a cartoon lion with mane and tail"
        ],
        "mouse": [
            "a drawing of a small rodent mouse with round ears, whiskers, and a long tail",
            "a tiny gray or brown mouse animal",
            "a cartoon little mouse"
        ],
        "rabbit": [
            "a drawing of a rabbit with long upright ears and fluffy tail",
            "a bunny or rabbit animal",
            "a cartoon rabbit with long ears"
        ],
        "tortoise": [
            "a drawing of a tortoise or turtle with a hard dome shell on its back",
            "a reptile turtle with a patterned shell and four short legs",
            "a cartoon tortoise with shell"
        ],
        "crow": [
            "a drawing of a black crow or raven with black feathers and sharp beak",
            "a black crow bird",
            "a cartoon black raven bird"
        ],
        "fox": [
            "a drawing of an orange-red fox animal with pointed ears and a long bushy tail",
            "a red fox with pointed snout and fluffy tail",
            "a cartoon orange fox"
        ],
        "deer": [
            "a drawing of a brown deer or fawn with thin slender legs and spots or antlers",
            "a deer animal with antlers",
            "a cartoon brown deer"
        ],
        "monkey": [
            "a drawing of a brown monkey with a long tail",
            "a monkey animal with long arms and tail",
            "a cartoon monkey"
        ],
        "crocodile": [
            "a drawing of a green crocodile or alligator with sharp teeth and long snout",
            "a large scaly green crocodile reptile",
            "a cartoon green crocodile"
        ],
        "rooster": [
            "a drawing of a rooster chicken with a bright red comb and tail feathers",
            "a colorful rooster bird",
            "a cartoon farm rooster"
        ],
        "jewel": [
            "a drawing of a shiny sparkling gemstone, crystal, ruby, or diamond jewel",
            "a glittering precious gem jewel",
            "a sparkling jewel diamond"
        ],
        "farmer": [
            "a drawing of a human farmer person wearing farm clothes or hat",
            "a human person or farmer man",
            "a cartoon farmer"
        ],
        "owl": [
            "a drawing of an owl bird with large round eyes and feathers",
            "a nocturnal owl bird with big eyes",
            "a cartoon owl"
        ],
        "bird": [
            "a drawing of a small bird with wings, feathers, and beak",
            "a little bird",
            "a cartoon baby bird"
        ]
    }

    # Comprehensive negative non-story & pure-scenery confusers
    GENERAL_NEGATIVE_CONFUSERS = [
        # Scenery / Nature / Landscape WITHOUT animals
        "a scenic landscape painting of trees, waterfall, lake, or mountains with no animals",
        "a nature scenery painting of a forest, river, flowers, or sky with no animals or creatures",
        "a watercolor landscape painting of scenery without any animals or people",
        "a background scenery, landscape view, or nature background with no animals",
        # Vehicles & Machines
        "a car, van, truck, bus, camper, or motor vehicle",
        "an automobile, vehicle, or transport on wheels",
        # Buildings, Rooms & Objects
        "a building, house, room interior, city street, or road",
        "furniture, chair, table, appliance, or household electronics",
        "a scribble, text document, diagram, or abstract pattern",
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

            # Other animals excluding this story's characters
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

            # Discriminative Detection Criteria:
            # Positive match must be significant (>= 0.15), higher than negative general/scenery sum,
            # and not dominated by non-animal/scenery confusers
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
