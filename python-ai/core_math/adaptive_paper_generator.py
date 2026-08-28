# -*- coding: utf-8 -*-
"""
adaptive_paper_generator.py
5-Stage Longitudinal Adaptive Paper Generator with Hard Question Non-Repetition Invariant.

Stages:
1. Duplicate Filter (Exclude all previously answered questions for student)
2. Competency / Weakness Analysis (Sort skills by mastery vector)
3. Difficulty Tier Matching (Map mastery level to Difficulty Tiers 1-5)
4. Adaptive Selection (Target weak skills with fallback ranking)
5. Final Validation (Enforce strict intra-paper uniqueness & cross-paper non-repetition)
"""

import json
import os
import random
from typing import Dict, List, Any, Set, Optional


class QuestionPoolExhaustedError(Exception):
    """Raised when available unused questions cannot satisfy paper generation requirements."""
    pass


class AdaptivePaperGenerator:
    def __init__(self, pool_file_path: Optional[str] = None):
        self.question_pool: List[Dict[str, Any]] = []
        if pool_file_path and os.path.exists(pool_file_path):
            self.load_pool(pool_file_path)

    def load_pool(self, pool_file_path: str):
        """Loads question pool from JSON file."""
        with open(pool_file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            self.question_pool = data.get("questions", [])

    def get_unused_questions(
        self,
        answered_question_ids: Set[str],
        pool: Optional[List[Dict[str, Any]]] = None
    ) -> List[Dict[str, Any]]:
        """
        Stage 1: Hard Duplicate Exclusion Filter.
        Permanently filters out all questions previously answered by the student.
        """
        source_pool = pool if pool is not None else self.question_pool
        return [q for q in source_pool if q["id"] not in answered_question_ids]

    def generate_adaptive_paper(
        self,
        student_id: str,
        answered_question_ids: Set[str],
        skill_mastery: Dict[str, float],
        paper_size: int = 20,
        pool: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Generates Paper N with strict non-repetition and adaptive competency targeting.
        """
        source_pool = pool if pool is not None else self.question_pool

        # ── Stage 1: Duplicate Filter ──
        unused_pool = self.get_unused_questions(answered_question_ids, source_pool)

        if len(unused_pool) < paper_size:
            raise QuestionPoolExhaustedError(
                f"Insufficient unused questions for student '{student_id}'. "
                f"Required: {paper_size}, Available unused in pool: {len(unused_pool)}."
            )

        selected_questions: List[Dict[str, Any]] = []
        current_paper_ids: Set[str] = set()

        # ── Stage 2: Weakness & Competency Analysis ──
        # Sort skills ascending by mastery (weakest skills first)
        sorted_skills = sorted(skill_mastery.items(), key=lambda x: x[1])
        weakest_skills = [s[0] for s in sorted_skills] if sorted_skills else []

        # ── Stage 3 & 4: Difficulty Matching & Adaptive Selection ──
        for i in range(paper_size):
            if weakest_skills and i < len(weakest_skills):
                # Primary focus: weakest skills
                target_skill = weakest_skills[i % len(weakest_skills)]
            elif skill_mastery:
                target_skill = random.choice(list(skill_mastery.keys()))
            else:
                target_skill = None

            # Determine appropriate difficulty tier for student's mastery level
            mastery = skill_mastery.get(target_skill, 50.0) if target_skill else 50.0
            if mastery < 35.0:
                target_diff = 1  # Level 1: Basic Recall
            elif mastery < 55.0:
                target_diff = 2  # Level 2: Simple Application
            elif mastery < 75.0:
                target_diff = 3  # Level 3: Moderate Reasoning
            elif mastery < 90.0:
                target_diff = 4  # Level 4: Representation & Steps
            else:
                target_diff = 5  # Level 5: Concept Transfer

            # Candidate Search 1: Exact skill + exact difficulty + not in current paper
            candidates = [
                q for q in unused_pool
                if (target_skill is None or q.get("skill_id") == target_skill)
                and q.get("difficulty_tier") == target_diff
                and q["id"] not in current_paper_ids
            ]

            # Candidate Search 2: Exact skill, closest difficulty
            if not candidates and target_skill:
                candidates = [
                    q for q in unused_pool
                    if q.get("skill_id") == target_skill and q["id"] not in current_paper_ids
                ]
                if candidates:
                    candidates.sort(key=lambda x: abs(x.get("difficulty_tier", 1) - target_diff))

            # Candidate Search 3: Matching difficulty in any skill
            if not candidates:
                candidates = [
                    q for q in unused_pool
                    if q.get("difficulty_tier") == target_diff and q["id"] not in current_paper_ids
                ]

            # Candidate Search 4: Any unseen question remaining in unused pool
            if not candidates:
                candidates = [q for q in unused_pool if q["id"] not in current_paper_ids]

            if not candidates:
                raise QuestionPoolExhaustedError(
                    f"Question pool exhausted during intra-paper generation at question {i + 1}/{paper_size}."
                )

            chosen_q = candidates[0] if len(candidates) == 1 else random.choice(candidates)
            selected_questions.append(chosen_q)
            current_paper_ids.add(chosen_q["id"])

        # ── Stage 5: Final Validation & Invariant Assertions ──
        selected_ids = [q["id"] for q in selected_questions]

        # Invariant 1: No duplicates inside the SAME paper
        assert len(selected_ids) == len(set(selected_ids)), (
            f"INVARIANT VIOLATION: Intra-paper duplicate questions detected! Count={len(selected_ids)}, Unique={len(set(selected_ids))}"
        )

        # Invariant 2: No duplicates ACROSS papers
        overlap = set(selected_ids).intersection(answered_question_ids)
        assert len(overlap) == 0, (
            f"INVARIANT VIOLATION: Cross-paper repeated questions detected: {overlap}"
        )

        assert len(selected_questions) == paper_size, (
            f"INVARIANT VIOLATION: Selected count ({len(selected_questions)}) does not match requested paper size ({paper_size})"
        )

        return {
            "student_id": student_id,
            "paper_size": paper_size,
            "questions": selected_questions,
            "question_ids": selected_ids,
            "total_unused_remaining": len(unused_pool) - paper_size
        }
