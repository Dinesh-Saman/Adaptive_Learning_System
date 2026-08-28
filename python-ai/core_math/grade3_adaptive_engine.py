# -*- coding: utf-8 -*-
"""
Adaptive Question Selection & Student Mastery Engine for Grade 3 Mathematics
Curriculum-Aligned Research Model
"""

import json
import os
import random
from typing import Dict, List, Any, Optional

from grade3_curriculum import GRADE3_DOMAINS, DIFFICULTY_LEVELS

class Grade3AdaptiveEngine:
    def __init__(self):
        self.question_pool = []
        self._load_pool()

    def _load_pool(self):
        pool_path = os.path.join(os.path.dirname(__file__), "grade3_question_pool.json")
        try:
            with open(pool_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.question_pool = data.get("questions", [])
        except Exception as e:
            print(f"Error loading Grade 3 pool: {e}")

    def create_new_session(self, student_id: str, previously_answered_ids: Optional[List[str]] = None) -> Dict[str, Any]:
        """Initializes a new 20-skill student mastery model for Grade 3 with historical exclusion"""
        skill_mastery = {}
        for dom_key, dom_val in GRADE3_DOMAINS.items():
            for skill in dom_val["skills"]:
                skill_mastery[skill["id"]] = 50.0  # Initial baseline mastery 50%

        return {
            "student_id": student_id,
            "session_id": f"g3_sess_{random.randint(10000, 99999)}",
            "questions_asked": 0,
            "max_questions": 10,
            "current_difficulty": 1,
            "skill_mastery": skill_mastery,
            "consecutive_correct": 0,
            "consecutive_wrong": 0,
            "history": [],
            "asked_ids": [],
            "previously_answered_ids": list(set(previously_answered_ids or [])),
            "weakest_skill": None,
            "strongest_skill": None,
            "is_complete": False
        }

    def update_mastery(self, session: Dict[str, Any], last_answer_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Updates student mastery profile based on the last answered question:
        - Accuracy (correct/incorrect)
        - Difficulty tier (1-5)
        - Time spent & Emotion/Affect
        - Consecutive answer streak
        """
        q_id = last_answer_data.get("question_id")
        skill_id = last_answer_data.get("skill_id")
        difficulty_tier = last_answer_data.get("difficulty_tier", 1)
        is_correct = last_answer_data.get("is_correct", False)
        student_ans = str(last_answer_data.get("student_answer", "")).strip()
        time_ms = last_answer_data.get("time_ms", 5000)

        # 1. Update session counters
        session["questions_asked"] += 1
        session["asked_ids"].append(q_id)

        # 2. Mastery Delta based on Difficulty Level
        diff_info = DIFFICULTY_LEVELS.get(difficulty_tier, DIFFICULTY_LEVELS[1])
        if is_correct:
            delta = diff_info["correct_delta"]
            session["consecutive_correct"] += 1
            session["consecutive_wrong"] = 0
        else:
            delta = diff_info["incorrect_delta"]
            session["consecutive_correct"] = 0
            session["consecutive_wrong"] += 1

        # Adjust skill mastery
        current_mastery = session["skill_mastery"].get(skill_id, 50.0)
        new_mastery = max(0.0, min(100.0, current_mastery + delta))
        session["skill_mastery"][skill_id] = round(new_mastery, 1)

        # 3. Decision on Difficulty Level Progression
        # Two correct in a row -> increase difficulty tier
        if session["consecutive_correct"] >= 2:
            session["current_difficulty"] = min(5, session["current_difficulty"] + 1)
            session["consecutive_correct"] = 0
        # Two wrong in a row -> decrease difficulty tier
        elif session["consecutive_wrong"] >= 2:
            session["current_difficulty"] = max(1, session["current_difficulty"] - 1)
            session["consecutive_wrong"] = 0
        elif not is_correct and session["current_difficulty"] > 1:
            # Single wrong on higher level -> decrease by 1 or stay
            session["current_difficulty"] = max(1, session["current_difficulty"] - 1)

        # 4. Error Misconception Analysis
        q_obj = next((q for q in self.question_pool if q["id"] == q_id), None)
        misconception_text = None
        remedial_feedback = None

        if not is_correct and q_obj:
            err_patterns = q_obj.get("error_patterns", {})
            if student_ans in err_patterns:
                misconception_text = err_patterns[student_ans]
            
            remedial_feedback = (
                f"නිවැරදි පිළිතුර: {q_obj['answer']}. "
                f"{q_obj.get('explanation_si', '')}"
            )

        # 5. Log in history
        history_entry = {
            "q_num": session["questions_asked"],
            "question_id": q_id,
            "skill_id": skill_id,
            "difficulty_tier": difficulty_tier,
            "is_correct": is_correct,
            "student_answer": student_ans,
            "correct_answer": q_obj["answer"] if q_obj else "",
            "time_ms": time_ms,
            "misconception": misconception_text,
            "remedial_feedback": remedial_feedback
        }
        session["history"].append(history_entry)

        # Check if 10 questions reached
        if session["questions_asked"] >= session["max_questions"]:
            session["is_complete"] = True

        return session

    def select_next_question(self, session: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Decision 1 (Skill Selection) & Decision 2 (Difficulty Level Selection)
        """
        if session["is_complete"] or session["questions_asked"] >= session["max_questions"]:
            return None

        q_num = session["questions_asked"] + 1
        # Hard exclusion: exclude both questions asked in current session and past answered questions
        asked_ids = set(session.get("asked_ids", [])).union(set(session.get("previously_answered_ids", [])))
        current_diff = session.get("current_difficulty", 1)

        target_skill_id = None

        # Strategy by Question Phase:
        if q_num == 1:
            # Q1: Diagnostic Question from foundational Number Sense / Operations
            target_skill_id = random.choice(["D1_S1_COUNTING", "D1_S3_PLACE_VALUE", "D2_S1_ADDITION"])
        elif q_num == 10:
            # Q10: Consolidation - test the weakest recorded skill
            sorted_skills = sorted(session["skill_mastery"].items(), key=lambda x: x[1])
            target_skill_id = sorted_skills[0][0]
        else:
            # Q2 - Q9: Adaptive skill selection
            # 60% probability pick from bottom 3 weakest skills, 40% explore other domains
            sorted_skills = sorted(session["skill_mastery"].items(), key=lambda x: x[1])
            weakest_3 = [s[0] for s in sorted_skills[:3]]
            
            # Avoid repeating same skill twice consecutively
            last_skill = session["history"][-1]["skill_id"] if session["history"] else None
            candidate_skills = [s for s in weakest_3 if s != last_skill]
            
            if candidate_skills and random.random() < 0.7:
                target_skill_id = random.choice(candidate_skills)
            else:
                # Explore a skill that hasn't been asked yet
                tested_skills = {h["skill_id"] for h in session["history"]}
                all_skills = list(session["skill_mastery"].keys())
                untested = [s for s in all_skills if s not in tested_skills]
                target_skill_id = random.choice(untested) if untested else random.choice(all_skills)

        # Match Question with (target_skill_id, current_diff)
        matching_qs = [
            q for q in self.question_pool
            if q["skill_id"] == target_skill_id and q["difficulty_tier"] == current_diff and q["id"] not in asked_ids
        ]

        if matching_qs:
            return random.choice(matching_qs)

        # Fallback 1: Closest difficulty within same skill
        skill_qs = [q for q in self.question_pool if q["skill_id"] == target_skill_id and q["id"] not in asked_ids]
        if skill_qs:
            skill_qs.sort(key=lambda x: abs(x["difficulty_tier"] - current_diff))
            return skill_qs[0]

        # Fallback 2: Any unseen question with matching difficulty
        any_diff_qs = [q for q in self.question_pool if q["difficulty_tier"] == current_diff and q["id"] not in asked_ids]
        if any_diff_qs:
            return random.choice(any_diff_qs)

        # Ultimate fallback: Any unseen question
        unseen = [q for q in self.question_pool if q["id"] not in asked_ids]
        return random.choice(unseen) if unseen else None

    def generate_learner_report(self, session: Dict[str, Any]) -> Dict[str, Any]:
        """Generates comprehensive diagnostic learner report at end of session"""
        history = session.get("history", [])
        total_q = len(history)
        correct_count = sum(1 for h in history if h["is_correct"])
        overall_acc = round((correct_count / total_q) * 100) if total_q > 0 else 0

        # Domain Level Mastery Rollup
        domain_scores = {}
        for dom_id, dom_info in GRADE3_DOMAINS.items():
            skill_ids = [s["id"] for s in dom_info["skills"]]
            masteries = [session["skill_mastery"].get(sid, 50.0) for sid in skill_ids]
            domain_scores[dom_id] = {
                "name_en": dom_info["name_en"],
                "name_si": dom_info["name_si"],
                "mastery_avg": round(sum(masteries) / len(masteries), 1)
            }

        # Strengths & Weaknesses
        sorted_skills = sorted(session["skill_mastery"].items(), key=lambda x: x[1])
        weakest_skills = sorted_skills[:2]
        strongest_skills = sorted(session["skill_mastery"].items(), key=lambda x: x[1], reverse=True)[:2]

        # Recommendations
        rec_areas = []
        for sid, score in weakest_skills:
            # Find skill name
            for dom in GRADE3_DOMAINS.values():
                for s in dom["skills"]:
                    if s["id"] == sid:
                        rec_areas.append(f"{s['name_si']} ({s['name_en']}) - Mastery: {score}%")

        return {
            "student_id": session.get("student_id"),
            "session_id": session.get("session_id"),
            "total_questions": total_q,
            "correct_answers": correct_count,
            "overall_accuracy_percent": overall_acc,
            "domain_scores": domain_scores,
            "skill_mastery": session["skill_mastery"],
            "strongest_skills": strongest_skills,
            "weakest_skills": weakest_skills,
            "recommended_areas": rec_areas,
            "history": history
        }
