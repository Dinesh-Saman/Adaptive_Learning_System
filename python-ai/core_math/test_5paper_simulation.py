# -*- coding: utf-8 -*-
"""
test_5paper_simulation.py
Automated verification of 5-Paper longitudinal assessment with hard non-repetition.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from adaptive_paper_generator import AdaptivePaperGenerator

def run_test():
    g2_path = os.path.join(os.path.dirname(__file__), 'grade2_question_pool.json')
    gen = AdaptivePaperGenerator(g2_path)
    
    student_id = 'S_LONGITUDINAL_001'
    all_answered = set()
    mastery = {
        'G2_D1_S1_COUNTING': 40.0,
        'G2_D1_S2_NUMBER_READING': 45.0,
        'G2_D2_S1_ADDITION_20': 30.0,
        'G2_D2_S2_SUBTRACTION_20': 35.0
    }
    
    print("=== STARTING 5-PAPER ADAPTIVE LONGITUDINAL SIMULATION ===")
    
    for paper_num in range(1, 6):
        paper = gen.generate_adaptive_paper(
            student_id=student_id,
            answered_question_ids=all_answered,
            skill_mastery=mastery,
            paper_size=20
        )
        
        q_ids = paper["question_ids"]
        
        # Intra-paper uniqueness check
        assert len(q_ids) == 20, f"Paper {paper_num} must have 20 questions"
        assert len(q_ids) == len(set(q_ids)), f"Paper {paper_num} contains intra-paper duplicates!"
        
        # Cross-paper non-repetition check
        overlap = all_answered.intersection(set(q_ids))
        assert len(overlap) == 0, f"Paper {paper_num} repeated questions: {overlap}"
        
        # Update cumulative answered questions
        all_answered.update(q_ids)
        
        # Simulate learning progression
        mastery['G2_D2_S1_ADDITION_20'] = min(100.0, mastery['G2_D2_S1_ADDITION_20'] + 12.0)
        mastery['G2_D1_S1_COUNTING'] = min(100.0, mastery['G2_D1_S1_COUNTING'] + 8.0)
        
        print(f"[OK] Paper {paper_num}: 20 unique questions generated. (Cumulative unique answered: {len(all_answered)})")

    print(f"\nTotal unique questions across all 5 papers: {len(all_answered)}")
    print("Duplicate question rate: 0.00%")
    print("SUCCESS: 5-Paper Adaptive Longitudinal Pipeline verified with zero repeats!")

if __name__ == '__main__':
    run_test()
