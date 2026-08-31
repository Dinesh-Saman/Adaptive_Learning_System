/**
 * grade4AdaptiveEngine.js
 * Longitudinal 5-Paper Adaptive Assessment & Tracing Engine for Grade 4 Sinhala
 */

import { GRADE4_QUESTION_BANK, GRADE4_SINHALA_CATEGORIES, GRADE4_REMEDIAL_BANK } from '../data/grade4SinhalaQuestionBank';

const G4_ADAPTIVE_STORAGE_KEY = 'sinhala_grade4_adaptive_session';
export const TRACING_PASS_THRESHOLD = 85;
export const PAPER_UNLOCK_THRESHOLD = 75; // Minimum 75% required to unlock next paper

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

export class Grade4AdaptiveEngine {
  constructor() {
    this.session = this.loadSession();
  }

  getStorageKey() {
    const student = getActiveStudentKey();
    return `sinhala_grade4_adaptive_session_${student}`;
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
      if (student === 'hiruni' || student === 'std_003') {
        const legacy = localStorage.getItem(G4_ADAPTIVE_STORAGE_KEY) || localStorage.getItem('sinhala_g4_adaptive_session');
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
      console.error("Error loading grade 4 adaptive session:", e);
    }
    this.session = this.getDefaultSession();
    return this.session;
  }

  getDefaultSession() {
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
      wordWritingMastery: {
        'ප්‍රස්තාව': 0.50,
        'අවබෝධය': 0.50,
        'අක්ෂර': 0.50
      },
      weakestCategory: 'C1',
      weakestWord: 'ප්‍රස්තාව',
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
      localStorage.setItem(G4_ADAPTIVE_STORAGE_KEY, JSON.stringify(this.session));
    } catch (e) {
      console.error("Error saving grade 4 adaptive session:", e);
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
        let catQuestions = GRADE4_QUESTION_BANK.filter(q => q.category === cat && !pastAnswered.has(q.id) && !selectedIds.has(q.id));
        if (catQuestions.length < 4) {
          const extra = GRADE4_QUESTION_BANK.filter(q => q.category === cat && !selectedIds.has(q.id));
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
        const remaining = GRADE4_QUESTION_BANK.filter(q => !selectedIds.has(q.id));
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
      let unseen = GRADE4_QUESTION_BANK.filter(
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

      if (chosenUnseen.length < neededCount) {
        const stillNeeded = neededCount - chosenUnseen.length;
        const recycled = GRADE4_QUESTION_BANK.filter(q => q.category === cat && !selectedIds.has(q.id));
        const chosenRecycled = this.shuffle(recycled).slice(0, stillNeeded);
        chosenRecycled.forEach(q => {
          if (!selectedIds.has(q.id)) {
            selectedIds.add(q.id);
            adaptivePaperQuestions.push(q);
          }
        });
      }
    });

    if (adaptivePaperQuestions.length < 20) {
      const allAvailable = GRADE4_QUESTION_BANK.filter(q => !selectedIds.has(q.id));
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

    const evaluatedAnswers = questions.map(q => {
      answeredQuestionIds.push(q.id);
      const studentAns = userAnswers[q.id];
      const answerCorrect = (studentAns === q.answer);

      const traceData = tracingResults[q.id] || { overall_score: 0, score: 0, passed: false, isPassed: false };
      const hasTracing = Boolean(q.has_tracing || q.tracing_required);

      const tracingPct = typeof traceData.overall_score === 'number' 
        ? traceData.overall_score 
        : (typeof traceData.percentage === 'number' ? traceData.percentage : (traceData.score * 100 || 0));

      const tracingCorrect = hasTracing ? (tracingPct >= passThreshold && traceData.isPassed !== false) : true;

      // Question correctness based on multiple-choice answer
      const isQuestionCorrect = answerCorrect;

      if (isQuestionCorrect) totalCorrect++;

      if (categoryStats[q.category]) {
        categoryStats[q.category].total += 1;
        if (isQuestionCorrect) categoryStats[q.category].correct += 1;
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
        target_text: q.target_text || '',
        tracing_type: q.tracing_type || 'word',
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

    let weakestCat = 'C1';
    let lowestCatScore = 1.0;
    Object.entries(updatedMasteryVector).forEach(([cat, m]) => {
      if (m < lowestCatScore) {
        lowestCatScore = m;
        weakestCat = cat;
      }
    });

    const totalQuestions = questions.length;
    const overallPercentage = Math.round((totalCorrect / totalQuestions) * 100);
    const isPassed = overallPercentage >= PAPER_UNLOCK_THRESHOLD;

    const paperResult = {
      paperNumber,
      timestamp: new Date().toISOString(),
      score: totalCorrect,
      total: totalQuestions,
      percentage: overallPercentage,
      passThreshold,
      isPassed,
      unlockThreshold: PAPER_UNLOCK_THRESHOLD,
      categoryScores,
      evaluatedAnswers,
      weakestCategory: weakestCat
    };

    this.session.currentMasteryVector = updatedMasteryVector;
    this.session.currentWeaknessVector = updatedWeaknessVector;
    this.session.weakestCategory = weakestCat;
    this.session.paperHistory[paperNumber] = paperResult;

    if (!this.session.completedPapers.includes(paperNumber)) {
      this.session.completedPapers.push(paperNumber);
    }

    // Unlock next paper ONLY if student achieves >= 75% marks on current paper
    if (isPassed && paperNumber < 5 && !this.session.unlockedPapers.includes(paperNumber + 1)) {
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
      const categoryInfo = GRADE4_SINHALA_CATEGORIES[catKey];
      const availableExercises = GRADE4_REMEDIAL_BANK[catKey] || [];

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

export const grade4AdaptiveEngine = new Grade4AdaptiveEngine();
