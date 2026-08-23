/**
 * grade2ProgressionManager.js
 * Adaptive Progression, Performance-Based Gating & Unlocking Manager for Grade 2 Sinhala
 */

const PROGRESS_STORAGE_KEY = 'sinhala_grade2_mastery_progress';

export const EXERCISE_PASS_THRESHOLD = 70; // 70% required to unlock next exercise
export const LEVEL_PASS_THRESHOLD = 75;    // 75% average required to unlock next level

export const GRADE2_CURRICULUM_MAP = {
  level1: [
    { id: 'l1_ex1', num: 1, title: 'අකුර හඳුනාගනිමු', route: '/module/sinhala/grade2-level1', next: 'l1_ex2' },
    { id: 'l1_ex2', num: 2, title: 'පින්තූරයට අකුර', route: '/module/sinhala/grade2-level1-act2', next: 'l1_ex3' },
    { id: 'l1_ex3', num: 3, title: 'හිස් අකුර පුරවන්න', route: '/module/sinhala/grade2-level1-act3', next: 'l1_ex4' },
    { id: 'l1_ex4', num: 4, title: 'මැජික් පුවරුවේ අකුරු ලියමු', route: '/module/sinhala/grade2-level1-act4', next: null }
  ],
  level2: [
    { id: 'l2_ex1', num: 1, title: 'වචන ගොඩනගමු', route: '/module/sinhala/grade2-level2-act1', next: 'l2_ex2' },
    { id: 'l2_ex2', num: 2, title: 'මැජික් පුවරුවේ වචන ලියමු', route: '/module/sinhala/grade2-level2-act2', next: 'l2_ex3' },
    { id: 'l2_ex3', num: 3, title: 'අකුරු දුම්රිය', route: '/module/sinhala/grade2-level2-act3', next: 'l2_ex4' },
    { id: 'l2_ex4', num: 4, title: 'රූපයට ගැලපෙන වචනය මත ලියමු', route: '/module/sinhala/grade2-level2-act4', next: 'l2_ex5' },
    { id: 'l2_ex5', num: 5, title: 'වචන කූඩය', route: '/module/sinhala/grade2-level2-act5', next: null }
  ],
  level3: [
    { id: 'l3_ex1', num: 1, title: 'රූපය බලලා වාක්‍යය ලියමු', route: '/module/sinhala/grade2-level3-act1', next: 'l3_ex2' },
    { id: 'l3_ex2', num: 2, title: 'වාක්‍ය පාලම', route: '/module/sinhala/grade2-level3-act2', next: 'l3_ex3' },
    { id: 'l3_ex3', num: 3, title: 'හිස්තැනට වචනයක් යොදමු', route: '/module/sinhala/grade2-level3-act3', next: null }
  ]
};

export class Grade2ProgressionManager {
  constructor() {
    this.progress = this.loadProgress();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}

    return this.getDefaultProgress();
  }

  getDefaultProgress() {
    return {
      // Exercise 1 of Level 1 is unlocked by default for every student
      unlockedExercises: ['l1_ex1'],
      completedExercises: [],
      exerciseScores: {},
      levelScores: {
        level1: 0,
        level2: 0,
        level3: 0
      },
      isLevel2Unlocked: false,
      isLevel3Unlocked: false,
      totalStars: 0,
      history: []
    };
  }

  saveProgress() {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(this.progress));
    } catch (e) {}
  }

  getProgress() {
    return this.progress;
  }

  resetProgress() {
    this.progress = this.getDefaultProgress();
    this.saveProgress();
    return this.progress;
  }

  /**
   * Check if a specific exercise ID is currently unlocked
   */
  isExerciseUnlocked(exerciseId) {
    if (!exerciseId) return false;
    return this.progress.unlockedExercises.includes(exerciseId);
  }

  /**
   * Check if a specific Level (1, 2, 3) is unlocked
   */
  isLevelUnlocked(levelNumber) {
    if (levelNumber === 1) return true;
    if (levelNumber === 2) return this.progress.isLevel2Unlocked;
    if (levelNumber === 3) return this.progress.isLevel3Unlocked;
    return false;
  }

  /**
   * Records student score for an exercise and calculates unlocks
   * @param {string} exerciseId - e.g. 'l1_ex1'
   * @param {number} scorePct - Score between 0 and 100
   * @returns {object} Unlocking results, next recommended route, and message
   */
  recordExerciseScore(exerciseId, scorePct) {
    const score = Math.max(0, Math.min(100, Math.round(scorePct)));
    this.progress.exerciseScores[exerciseId] = Math.max(
      this.progress.exerciseScores[exerciseId] || 0,
      score
    );

    if (!this.progress.completedExercises.includes(exerciseId)) {
      this.progress.completedExercises.push(exerciseId);
    }

    // Award stars (1 star per 20%)
    this.progress.totalStars += Math.round(score / 20);

    // Find exercise info in curriculum
    let currentLevel = 'level1';
    let currentEx = null;
    for (const [levelKey, exercises] of Object.entries(GRADE2_CURRICULUM_MAP)) {
      const found = exercises.find(e => e.id === exerciseId);
      if (found) {
        currentLevel = levelKey;
        currentEx = found;
        break;
      }
    }

    let nextExerciseUnlocked = false;
    let nextExercise = null;

    // Check if score meets passing threshold (>= 70%)
    if (score >= EXERCISE_PASS_THRESHOLD) {
      if (currentEx && currentEx.next) {
        if (!this.progress.unlockedExercises.includes(currentEx.next)) {
          this.progress.unlockedExercises.push(currentEx.next);
          nextExerciseUnlocked = true;
        }
        nextExercise = GRADE2_CURRICULUM_MAP[currentLevel].find(e => e.id === currentEx.next);
      }
    }

    // If student scored 100% (or >= 90%), also unlock the NEXT LEVEL immediately as fast-track promotion!
    if (score >= 90) {
      if (currentLevel === 'level1') {
        this.progress.isLevel2Unlocked = true;
        if (!this.progress.unlockedExercises.includes('l2_ex1')) {
          this.progress.unlockedExercises.push('l2_ex1');
        }
      } else if (currentLevel === 'level2') {
        this.progress.isLevel3Unlocked = true;
        if (!this.progress.unlockedExercises.includes('l3_ex1')) {
          this.progress.unlockedExercises.push('l3_ex1');
        }
      }
    }

    // Recalculate Level Averages & Level Unlocks
    this.recalculateLevelUnlocks();

    this.saveProgress();

    return {
      passed: score >= EXERCISE_PASS_THRESHOLD,
      isFastTrack: score >= 90,
      currentLevel,
      score,
      nextExerciseUnlocked,
      nextExercise,
      isLevel2Unlocked: this.progress.isLevel2Unlocked,
      isLevel3Unlocked: this.progress.isLevel3Unlocked,
      progress: this.progress
    };
  }

  recalculateLevelUnlocks() {
    // Level 1 Average
    const l1Exs = GRADE2_CURRICULUM_MAP.level1;
    const l1Scores = l1Exs.map(e => this.progress.exerciseScores[e.id] || 0);
    const l1CompletedCount = l1Exs.filter(e => this.progress.completedExercises.includes(e.id)).length;
    const l1Avg = Math.round(l1Scores.reduce((a, b) => a + b, 0) / l1Exs.length);
    this.progress.levelScores.level1 = l1Avg;

    // Unlock Level 2 if Level 1 has passing average (>= 75%) or high score on Act 1
    if ((l1Avg >= LEVEL_PASS_THRESHOLD && l1CompletedCount >= 2) || (this.progress.exerciseScores['l1_ex1'] >= 90)) {
      this.progress.isLevel2Unlocked = true;
      if (!this.progress.unlockedExercises.includes('l2_ex1')) {
        this.progress.unlockedExercises.push('l2_ex1');
      }
    }

    // Level 2 Average
    const l2Exs = GRADE2_CURRICULUM_MAP.level2;
    const l2Scores = l2Exs.map(e => this.progress.exerciseScores[e.id] || 0);
    const l2CompletedCount = l2Exs.filter(e => this.progress.completedExercises.includes(e.id)).length;
    const l2Avg = Math.round(l2Scores.reduce((a, b) => a + b, 0) / l2Exs.length);
    this.progress.levelScores.level2 = l2Avg;

    // Unlock Level 3 if Level 2 has passing average (>= 75%) or high score on Act 1
    if ((l2Avg >= LEVEL_PASS_THRESHOLD && l2CompletedCount >= 2) || (this.progress.exerciseScores['l2_ex1'] >= 90)) {
      this.progress.isLevel3Unlocked = true;
      if (!this.progress.unlockedExercises.includes('l3_ex1')) {
        this.progress.unlockedExercises.push('l3_ex1');
      }
    }

    // Level 3 Average
    const l3Exs = GRADE2_CURRICULUM_MAP.level3;
    const l3Scores = l3Exs.map(e => this.progress.exerciseScores[e.id] || 0);
    const l3Avg = Math.round(l3Scores.reduce((a, b) => a + b, 0) / l3Exs.length);
    this.progress.levelScores.level3 = l3Avg;
  }

  /**
   * Queries the local PyTorch Deep Knowledge Tracing (DKT) LSTM model for live cognitive recommendations
   */
  async getDKTRecommendation(history) {
    try {
      const res = await fetch('http://127.0.0.1:8001/api/ai/recommend-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: history || [] })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return null;
  }
}

export const progressionManager = new Grade2ProgressionManager();
