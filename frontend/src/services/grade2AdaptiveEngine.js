/**
 * grade2AdaptiveEngine.js
 * Longitudinal 5-Paper Adaptive Assessment & Multi-Tier Knowledge Tracing Engine for Grade 2 Sinhala
 * 
 * 4-Level Learner Model:
 * 1. Category Level: C1 - C5
 * 2. Letter Sub-Skill Level: Individual Sinhala Letters (ක, ග, ත, ම, ප, ...)
 * 3. Pillama Sub-Skill Level: Individual Pillam (P_NONE, P_AELA, P_AEDA, P_ISPILI, P_PAPILI, P_KOMBU)
 * 4. Combination & Word Level: Graphemes (ගු, කා, පොත, මල, ...)
 * 
 * Dual Evaluation Rule:
 * QuestionCorrect = AnswerCorrect && TracingCorrect (Tracing Accuracy >= TRACING_PASS_THRESHOLD = 85%)
 */

import { QUESTION_BANK, SINHALA_CATEGORIES, SINHALA_LETTERS, SINHALA_PILLAM_REGISTRY, REMEDIAL_EXERCISE_BANK } from '../data/grade2SinhalaQuestionBank';

const ADAPTIVE_STORAGE_KEY = 'sinhala_grade2_adaptive_session';
export const TRACING_PASS_THRESHOLD = 85; // Configurable Research Parameter (0-100)

export function getActiveStudentKey() {
  try {
    const sName = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('studentName')) || 
                  (typeof localStorage !== 'undefined' && localStorage.getItem('studentName')) || '';
    const sId = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('studentId')) || 
                (typeof localStorage !== 'undefined' && localStorage.getItem('studentId')) || '';
    const cleaned = (sName || sId || 'default').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
    return cleaned || 'default';
  } catch (e) {
    return 'default';
  }
}

export class Grade2AdaptiveEngine {
  constructor() {
    this.session = this.loadSession();
  }

  getStorageKey() {
    const student = getActiveStudentKey();
    return `sinhala_grade2_adaptive_session_${student}`;
  }

  loadSession() {
    try {
      const student = getActiveStudentKey();
      const scopedKey = this.getStorageKey();
      const saved = localStorage.getItem(scopedKey);
      if (saved) {
        this.session = JSON.parse(saved);
        return this.session;
      }

      // Legacy migration fallback for default Gr.2 student ('hasara')
      if (student === 'hasara' || student === 'std_001') {
        const legacy = localStorage.getItem(ADAPTIVE_STORAGE_KEY) || localStorage.getItem('sinhala_g2_adaptive_session');
        if (legacy) {
          try {
            const parsed = JSON.parse(legacy);
            this.session = parsed;
            this.saveSession(parsed);
            return parsed;
          } catch (e) {}
        }
      }
    } catch (e) {
      console.error("Error loading adaptive session:", e);
    }
    this.session = this.getDefaultSession();
    return this.session;
  }

  getDefaultSession() {
    const initialLetterMastery = {};
    SINHALA_LETTERS.forEach(l => {
      initialLetterMastery[l] = 0.50;
    });

    const initialPillamMastery = {};
    Object.keys(SINHALA_PILLAM_REGISTRY).forEach(pKey => {
      initialPillamMastery[pKey] = 0.50;
    });

    return {
      studentId: getActiveStudentKey(),
      unlockedPapers: [1],
      completedPapers: [],
      paperHistory: {},
      allAnsweredQuestionIds: [],
      masteryTrajectory: {
        C1: [50],
        C2: [50],
        C3: [50],
        C4: [50],
        C5: [50]
      },
      currentMasteryVector: {
        C1: 0.50,
        C2: 0.50,
        C3: 0.50,
        C4: 0.50,
        C5: 0.50
      },
      currentWeaknessVector: {
        C1: 0.50,
        C2: 0.50,
        C3: 0.50,
        C4: 0.50,
        C5: 0.50
      },
      letterMasteryVector: initialLetterMastery,
      pillamMasteryVector: initialPillamMastery,
      combinationMasteryVector: { 'කා': 0.50, 'ගු': 0.50, 'මි': 0.50, 'කෙ': 0.50 },
      weakestCategory: 'C1',
      weakestLetter: 'ග',
      weakestPillama: 'P_PAPILI',
      weakestCombination: 'ගු',
      remedialCompleted: {},
      lastUpdated: new Date().toISOString()
    };
  }

  saveSession(sessionData) {
    this.session = sessionData || this.session;
    try {
      this.session.lastUpdated = new Date().toISOString();
      const scopedKey = this.getStorageKey();
      localStorage.setItem(scopedKey, JSON.stringify(this.session));
      localStorage.setItem(ADAPTIVE_STORAGE_KEY, JSON.stringify(this.session));
    } catch (e) {
      console.error("Error saving adaptive session:", e);
    }
  }

  resetSession() {
    this.session = this.getDefaultSession();
    this.saveSession(this.session);
    return this.session;
  }

  generatePaper(paperNumber = 1) {
    const categories = ['C1', 'C2', 'C3', 'C4', 'C5'];
    const pastAnswered = new Set(this.session.allAnsweredQuestionIds || []);
    const selectedIds = new Set();
    const adaptivePaperQuestions = [];

    if (paperNumber === 1) {
      categories.forEach(cat => {
        let catQuestions = QUESTION_BANK.filter(q => q.category === cat && !pastAnswered.has(q.id) && !selectedIds.has(q.id));
        if (catQuestions.length < 4) {
          const extra = QUESTION_BANK.filter(q => q.category === cat && !selectedIds.has(q.id));
          catQuestions = catQuestions.concat(extra);
        }
        const sorted = [...catQuestions].sort((a, b) => a.difficulty - b.difficulty);
        const selected = sorted.slice(0, 4);
        selected.forEach(q => {
          if (!selectedIds.has(q.id)) {
            selectedIds.add(q.id);
            adaptivePaperQuestions.push(q);
          }
        });
      });

      if (adaptivePaperQuestions.length < 20) {
        const remaining = QUESTION_BANK.filter(q => !selectedIds.has(q.id));
        this.shuffle(remaining).slice(0, 20 - adaptivePaperQuestions.length).forEach(q => {
          selectedIds.add(q.id);
          adaptivePaperQuestions.push(q);
        });
      }

      return this.shuffle(adaptivePaperQuestions.slice(0, 20));
    }

    const currentMastery = this.session.currentMasteryVector || {
      C1: 0.5, C2: 0.5, C3: 0.5, C4: 0.5, C5: 0.5
    };

    const weaknesses = {};
    let totalWeakness = 0;
    categories.forEach(cat => {
      const m = typeof currentMastery[cat] === 'number' ? currentMastery[cat] : 0.5;
      const w = Math.max(0.1, 1 - m);
      weaknesses[cat] = w;
      totalWeakness += w;
    });

    const categoryAllocation = { C1: 2, C2: 2, C3: 2, C4: 2, C5: 2 };
    let remainingToAllocate = 10;

    const extraAllocations = categories.map(cat => ({
      cat,
      weight: weaknesses[cat] / totalWeakness,
      count: 0
    }));

    extraAllocations.sort((a, b) => b.weight - a.weight);

    for (let i = 0; i < extraAllocations.length && remainingToAllocate > 0; i++) {
      const share = Math.round(extraAllocations[i].weight * 10);
      const toAdd = Math.min(share, remainingToAllocate);
      categoryAllocation[extraAllocations[i].cat] += toAdd;
      remainingToAllocate -= toAdd;
    }

    while (remainingToAllocate > 0) {
      categoryAllocation[extraAllocations[0].cat] += 1;
      remainingToAllocate -= 1;
    }

    categories.forEach(cat => {
      const neededCount = Math.max(2, categoryAllocation[cat]);
      let unseen = QUESTION_BANK.filter(
        q => q.category === cat && !pastAnswered.has(q.id) && !selectedIds.has(q.id)
      );

      const mastery = currentMastery[cat] || 0.5;
      let minDiff = 0.1;
      let maxDiff = 0.9;
      if (mastery < 0.4) {
        minDiff = 0.15;
        maxDiff = 0.55;
      } else if (mastery < 0.7) {
        minDiff = 0.35;
        maxDiff = 0.7;
      } else {
        minDiff = 0.5;
        maxDiff = 0.9;
      }

      let tiered = unseen.filter(q => q.difficulty >= minDiff && q.difficulty <= maxDiff);
      if (tiered.length < neededCount) {
        tiered = unseen;
      }

      const shuffledUnseen = this.shuffle(tiered);
      const chosenUnseen = shuffledUnseen.slice(0, neededCount);
      chosenUnseen.forEach(q => {
        if (!selectedIds.has(q.id)) {
          selectedIds.add(q.id);
          adaptivePaperQuestions.push(q);
        }
      });

      // If still need more questions for this category, recycle from full category bank
      if (chosenUnseen.length < neededCount) {
        const stillNeeded = neededCount - chosenUnseen.length;
        const recycled = QUESTION_BANK.filter(q => q.category === cat && !selectedIds.has(q.id));
        const chosenRecycled = this.shuffle(recycled).slice(0, stillNeeded);
        chosenRecycled.forEach(q => {
          if (!selectedIds.has(q.id)) {
            selectedIds.add(q.id);
            adaptivePaperQuestions.push(q);
          }
        });
      }
    });

    // Fill up to exactly 20 if needed
    if (adaptivePaperQuestions.length < 20) {
      const allAvailable = QUESTION_BANK.filter(q => !selectedIds.has(q.id));
      const needed = 20 - adaptivePaperQuestions.length;
      const fillers = this.shuffle(allAvailable).slice(0, needed);
      fillers.forEach(q => {
        if (!selectedIds.has(q.id)) {
          selectedIds.add(q.id);
          adaptivePaperQuestions.push(q);
        }
      });
    }

    return this.shuffle(adaptivePaperQuestions.slice(0, 20));
  }

  evaluatePaperSubmission(paperNumber, questions, userAnswers, tracingResults = {}, passThreshold = TRACING_PASS_THRESHOLD) {
    const categories = ['C1', 'C2', 'C3', 'C4', 'C5'];
    const categoryStats = {
      C1: { correct: 0, total: 0 },
      C2: { correct: 0, total: 0 },
      C3: { correct: 0, total: 0 },
      C4: { correct: 0, total: 0 },
      C5: { correct: 0, total: 0 }
    };

    let totalCorrect = 0;
    const answeredQuestionIds = [];

    const letterAttempts = {};
    const pillamAttempts = {};
    const combinationAttempts = {};

    const evaluatedAnswers = questions.map(q => {
      answeredQuestionIds.push(q.id);
      const studentAns = userAnswers[q.id];
      const answerCorrect = (studentAns === q.answer);

      // Tracing evaluation
      const traceData = tracingResults[q.id] || { overall_score: 0, score: 0, passed: false, isPassed: false };
      const hasTracing = Boolean(q.has_tracing || q.tracing_required);
      
      const tracingPct = typeof traceData.overall_score === 'number' 
        ? traceData.overall_score 
        : (typeof traceData.percentage === 'number' ? traceData.percentage : (traceData.score * 100 || 0));

      const tracingCorrect = hasTracing ? (tracingPct >= passThreshold && traceData.isPassed !== false) : true;

      // Strict Dual Scoring: If tracing is wrong or missing in Grade 2, the whole question is considered wrong
      const isQuestionCorrect = hasTracing
        ? (answerCorrect && tracingCorrect)
        : answerCorrect;

      if (isQuestionCorrect) totalCorrect++;

      if (categoryStats[q.category]) {
        categoryStats[q.category].total += 1;
        if (isQuestionCorrect) categoryStats[q.category].correct += 1;
      }

      // Track Letter sub-skill
      const targetChar = q.target_character || q.target_text || '';
      if (targetChar) {
        if (!letterAttempts[targetChar]) {
          letterAttempts[targetChar] = { correct: 0, total: 0, scores: [] };
        }
        letterAttempts[targetChar].total += 1;
        if (isQuestionCorrect) letterAttempts[targetChar].correct += 1;
        letterAttempts[targetChar].scores.push(hasTracing ? (tracingPct / 100.0) : (answerCorrect ? 1.0 : 0.0));
      }

      // Track Pillama sub-skill
      if (q.target_pillama && q.target_pillama !== 'P_NONE') {
        if (!pillamAttempts[q.target_pillama]) {
          pillamAttempts[q.target_pillama] = { correct: 0, total: 0, scores: [] };
        }
        pillamAttempts[q.target_pillama].total += 1;
        if (isQuestionCorrect) pillamAttempts[q.target_pillama].correct += 1;
        pillamAttempts[q.target_pillama].scores.push(hasTracing ? (tracingPct / 100.0) : (answerCorrect ? 1.0 : 0.0));
      }

      // Track Combination
      if (q.target_guide_text && q.target_guide_text.length > 1) {
        const comb = q.target_guide_text;
        if (!combinationAttempts[comb]) {
          combinationAttempts[comb] = { correct: 0, total: 0, scores: [] };
        }
        combinationAttempts[comb].total += 1;
        if (isQuestionCorrect) combinationAttempts[comb].correct += 1;
        combinationAttempts[comb].scores.push(hasTracing ? (tracingPct / 100.0) : (answerCorrect ? 1.0 : 0.0));
      }

      return {
        questionId: q.id,
        category: q.category,
        prompt: q.prompt,
        options: q.options,
        studentAnswer: studentAns || 'මඟ හැරිණි',
        correctAnswer: q.answer,
        has_tracing: hasTracing,
        tracing_required: hasTracing,
        target_text: q.target_text || q.target_character || '',
        target_character: targetChar,
        target_pillama: q.target_pillama || 'P_NONE',
        tracing_type: q.tracing_type || 'letter',
        target_guide_text: q.target_guide_text || targetChar,
        template_id: q.template_id || `TRACE_${q.id}`,
        answer_correct: answerCorrect,
        tracing_score: tracingPct,
        tracing_correct: tracingCorrect,
        isCorrect: isQuestionCorrect,
        weak_component: traceData.weak_component || null,
        tracing_metrics: {
          path_adherence: traceData.path_adherence || 0,
          shape_similarity: traceData.shape_similarity || 0,
          completeness: traceData.completeness || 0,
          line_alignment: traceData.line_alignment || 0,
          boundary_accuracy: traceData.boundary_accuracy || 0
        },
        explanation: q.explanation || ''
      };
    });

    // 1. Update Category Mastery Vector (Exponential Smoothing / BKT alpha = 0.60)
    const categoryScores = {};
    const updatedMasteryVector = { ...this.session.currentMasteryVector };
    const updatedWeaknessVector = {};

    categories.forEach(cat => {
      const stats = categoryStats[cat];
      const score = stats.total > 0 ? stats.correct / stats.total : 0.5;
      categoryScores[cat] = {
        correct: stats.correct,
        total: stats.total,
        percentage: Math.round(score * 100),
        mastery: score
      };

      const prevMastery = this.session.currentMasteryVector[cat] || 0.5;
      const alpha = 0.60;
      const newMastery = Number((prevMastery * (1 - alpha) + score * alpha).toFixed(2));
      updatedMasteryVector[cat] = newMastery;
      updatedWeaknessVector[cat] = Number((1 - newMastery).toFixed(2));

      if (!this.session.masteryTrajectory[cat]) {
        this.session.masteryTrajectory[cat] = [];
      }
      this.session.masteryTrajectory[cat].push(Math.round(newMastery * 100));
    });

    // 2. Update Letter Mastery
    const updatedLetterMastery = { ...(this.session.letterMasteryVector || {}) };
    Object.entries(letterAttempts).forEach(([letter, stats]) => {
      const avgScore = stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
      const prevL = updatedLetterMastery[letter] || 0.50;
      const alpha = 0.60;
      updatedLetterMastery[letter] = Number((prevL * (1 - alpha) + avgScore * alpha).toFixed(2));
    });

    // 3. Update Pillam Mastery
    const updatedPillamMastery = { ...(this.session.pillamMasteryVector || {}) };
    Object.entries(pillamAttempts).forEach(([pKey, stats]) => {
      const avgScore = stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
      const prevP = updatedPillamMastery[pKey] || 0.50;
      const alpha = 0.60;
      updatedPillamMastery[pKey] = Number((prevP * (1 - alpha) + avgScore * alpha).toFixed(2));
    });

    // 4. Update Combination Mastery
    const updatedCombMastery = { ...(this.session.combinationMasteryVector || {}) };
    Object.entries(combinationAttempts).forEach(([comb, stats]) => {
      const avgScore = stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
      const prevC = updatedCombMastery[comb] || 0.50;
      const alpha = 0.60;
      updatedCombMastery[comb] = Number((prevC * (1 - alpha) + avgScore * alpha).toFixed(2));
    });

    // 5. Weakest Element Detection
    let weakestCat = 'C1';
    let lowestCatScore = 1.0;
    Object.entries(updatedMasteryVector).forEach(([cat, m]) => {
      if (m < lowestCatScore) {
        lowestCatScore = m;
        weakestCat = cat;
      }
    });

    let weakestLetter = 'ග';
    let lowestLetterScore = 1.0;
    Object.entries(updatedLetterMastery).forEach(([l, m]) => {
      if (m < lowestLetterScore) {
        lowestLetterScore = m;
        weakestLetter = l;
      }
    });

    let weakestPillama = 'P_PAPILI';
    let lowestPillamScore = 1.0;
    Object.entries(updatedPillamMastery).forEach(([pKey, m]) => {
      if (m < lowestPillamScore && pKey !== 'P_NONE') {
        lowestPillamScore = m;
        weakestPillama = pKey;
      }
    });

    let weakestComb = 'ගු';
    let lowestCombScore = 1.0;
    Object.entries(updatedCombMastery).forEach(([comb, m]) => {
      if (m < lowestCombScore) {
        lowestCombScore = m;
        weakestComb = comb;
      }
    });

    const totalQuestions = questions.length;
    const overallPercentage = Math.round((totalCorrect / totalQuestions) * 100);

    const paperResult = {
      paperNumber,
      timestamp: new Date().toISOString(),
      score: totalCorrect,
      total: totalQuestions,
      percentage: overallPercentage,
      passThreshold,
      categoryScores,
      evaluatedAnswers,
      weakestCategory: weakestCat,
      weakestLetter,
      weakestPillama,
      weakestCombination: weakestComb
    };

    this.session.currentMasteryVector = updatedMasteryVector;
    this.session.currentWeaknessVector = updatedWeaknessVector;
    this.session.letterMasteryVector = updatedLetterMastery;
    this.session.pillamMasteryVector = updatedPillamMastery;
    this.session.combinationMasteryVector = updatedCombMastery;
    this.session.weakestCategory = weakestCat;
    this.session.weakestLetter = weakestLetter;
    this.session.weakestPillama = weakestPillama;
    this.session.weakestCombination = weakestComb;
    this.session.paperHistory[paperNumber] = paperResult;

    if (!this.session.completedPapers.includes(paperNumber)) {
      this.session.completedPapers.push(paperNumber);
    }

    if (paperNumber < 5 && !this.session.unlockedPapers.includes(paperNumber + 1)) {
      this.session.unlockedPapers.push(paperNumber + 1);
    }

    this.session.allAnsweredQuestionIds = Array.from(
      new Set([...(this.session.allAnsweredQuestionIds || []), ...answeredQuestionIds])
    );

    this.saveSession();
    return paperResult;
  }

  generateRemedialRecommendations(masteryVector) {
    const recommendations = [];
    const vector = masteryVector || this.session.currentMasteryVector || {};

    Object.entries(vector).forEach(([catKey, masteryScore]) => {
      const categoryInfo = SINHALA_CATEGORIES[catKey];
      const availableExercises = REMEDIAL_EXERCISE_BANK[catKey] || [];

      let tier = '';
      let status = '';
      let exercises = [];

      if (masteryScore >= 0.85) {
        tier = 'Mastered';
        status = 'විශිෂ්ටයි (ප්‍රගුණ කර ඇත) ⭐';
        exercises = [];
      } else if (masteryScore >= 0.60) {
        tier = 'Developing';
        status = 'සාමාන්‍යයි (සුළු පුහුණුවක් ප්‍රමාණවත්)';
        exercises = availableExercises.slice(0, 1);
      } else if (masteryScore >= 0.40) {
        tier = 'Needs Practice';
        status = 'වැඩිදුර පුහුණුව අවශ්‍යයි ⚠️';
        exercises = availableExercises.slice(0, 2);
      } else {
        tier = 'Weak';
        status = 'දුර්‍වලයි (විශේෂ අවධානය සහ දැඩි පුහුණුව අවශ්‍යයි) 🔴';
        exercises = availableExercises;
      }

      recommendations.push({
        categoryKey: catKey,
        categoryName: categoryInfo?.name || catKey,
        masteryPercentage: Math.round(masteryScore * 100),
        tier,
        status,
        exercises
      });
    });

    recommendations.sort((a, b) => a.masteryPercentage - b.masteryPercentage);
    return recommendations;
  }

  shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

export const grade2AdaptiveEngine = new Grade2AdaptiveEngine();
