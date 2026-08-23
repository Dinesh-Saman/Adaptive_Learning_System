import random
import json
import os

# Exactly 35 distinct Grade 4 mathematical topics
SKILL_TYPES = [
    "G4_SYMMETRY", "G4_ROMAN_NUMERALS", "G4_ADD_4DIGIT", "G4_SUB_3DIGIT", "G4_MUL_2DIGIT",
    "G4_DIV_3DIGIT", "G4_DECIMAL_TENTHS", "G4_DECIMAL_ADD", "G4_FRACTION_IDENTIFY", "G4_FRACTION_ADD",
    "G4_FRACTION_SUB", "G4_FRACTION_EQUIVALENT", "G4_PERIMETER_SQUARE", "G4_PERIMETER_RECT", "G4_AREA_SQUARE",
    "G4_TIME_HOURS_MINS", "G4_TIME_ELAPSED", "G4_WEIGHT_GRAMS", "G4_WEIGHT_KG", "G4_VOLUME_ML",
    "G4_VOLUME_L", "G4_MONEY_NOTES", "G4_MONEY_CHANGE", "G4_NUMBER_PATTERNS", "G4_FACTORS",
    "G4_MULTIPLES", "G4_WORD_ADD", "G4_WORD_SUB", "G4_WORD_MUL", "G4_WORD_DIV",
    "G4_DATA_BAR_GRAPH", "G4_DATA_PICTOGRAPH", "G4_ANGLES_RIGHT", "G4_LINES_PARALLEL", "G4_LINES_PERPENDICULAR",
    "G4_NUMBER_NAMES", "G4_PLACE_VALUE", "G4_NUMBER_FORMING", "G4_LENGTH_M_TO_CM", "G4_LENGTH_CM_TO_M_CM",
    "G4_SUB_MISSING_NUMBER", "G4_SUB_TWO_STEP", "G4_FRACTION_OF_SET", "G4_FRACTION_WORD_PROBLEM", "G4_NUMBER_EXPANDED_FORM", "G4_DIV_REMAINDER",
    "G4_DIRECTIONS", "G4_DATA_TABLE", "G4_TIME_UNITS", "G4_CALENDAR", "G4_MONEY_COIN_CONVERSIONS",
    "G4_LENGTH_ADD", "G4_LENGTH_SUB", "G4_TIME_CLOCK", "G4_MONEY_PUZZLE", "G4_NUMBER_SORTING",
    "G4_WEIGHT_ADD", "G4_WEIGHT_SUB", "G4_WEIGHT_PUZZLE", "G4_VOLUME_ADD", "G4_VOLUME_SUB",
    "G4_MONEY_ADD", "G4_MONEY_BILL", "G4_MUL_MISSING_NUMBER", "G4_3D_VIEWS", "G4_VOLUME_PUZZLE"
]

_QUESTION_POOL = []

def _load_pool():
    global _QUESTION_POOL
    pool_path = os.path.join(os.path.dirname(__file__), "question_pool.json")
    try:
        with open(pool_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            _QUESTION_POOL = data.get("questions", [])
    except Exception as e:
        print(f"Error loading question pool: {e}")

def generate_math_question(difficulty_level: int = 1, asked_ids: list = None, category_types: list = None, asked_texts: list = None):
    _load_pool()
    if not _QUESTION_POOL:
        return {"id": -1, "type_id": "G4_ADD_3DIGIT", "text": "100 + 200 = ?", "answer": "300", "q_format": "fill_blank"}

    # Filter by category if specified
    base_qs = _QUESTION_POOL
    if category_types:
        base_qs = [q for q in base_qs if q["type_id"] in category_types]
        if not base_qs:
            base_qs = _QUESTION_POOL

    # Filter by difficulty tier
    valid_qs = [q for q in base_qs if q.get("difficulty_tier", 1) == difficulty_level]
    
    # Try to find a unique question matching difficulty and category
    asked_texts = asked_texts or []
    asked_ids = asked_ids or []
    
    unseen_valid = [q for q in valid_qs if q["id"] not in asked_ids and q.get("text", "") not in asked_texts]
    if unseen_valid:
        return random.choice(unseen_valid)
        
    # Fallback 1: Try to find a unique question in the requested categories, prioritizing closest difficulty
    unseen_base = [q for q in base_qs if q["id"] not in asked_ids and q.get("text", "") not in asked_texts]
    if unseen_base:
        unseen_base.sort(key=lambda x: abs(x.get("difficulty_tier", 1) - difficulty_level))
        best_diff = unseen_base[0].get("difficulty_tier", 1)
        best_qs = [x for x in unseen_base if x.get("difficulty_tier", 1) == best_diff]
        return random.choice(best_qs)
        
    # Fallback 2: Ignore category entirely, find any unique question in the entire pool
    unseen_all = [q for q in _QUESTION_POOL if q["id"] not in asked_ids and q.get("text", "") not in asked_texts]
    if unseen_all:
        return random.choice(unseen_all)
        
    # Ultimate Fallback (if they literally exhausted the entire 1000-question pool somehow)
    return random.choice(valid_qs)

