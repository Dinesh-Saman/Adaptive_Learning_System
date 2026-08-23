/**
 * sinhalaAdaptiveEngine.js
 * Adaptive Decision Engine for Personalized Sinhala Writing Activity System (Grade 2–5)
 * Dynamically calibrates difficulty, tracks error patterns, and manages targeted remediation.
 */

import { classifySinhalaError } from '../utils/sinhalaErrorClassifier';

const STORAGE_KEY = 'sinhala_adaptive_student_profile';

export const ADAPTIVE_DIFFICULTIES = {
  EASY: 'Easy',       // Guided Tracing with dotted lines
  MEDIUM: 'Medium',   // Visual Memory / Look & Copy
  HARD: 'Hard'        // Independent recall from picture/audio
};

// ── Default Curriculum Bank for Grade 2–5 Adaptive Writing ──
export const ADAPTIVE_CURRICULUM = [
  {
    id: 'w_01',
    word: 'සතුට',
    meaningEn: 'Happiness',
    category: 'Emotions',
    grade: 2,
    level: 1,
    imageEmoji: '😊🎉',
    audioPrompt: 'සතුට යන වචනය තෝරා ලියන්න.',
    options: [
      { id: 'opt_1', text: 'සතුට', isCorrect: true },
      { id: 'opt_2', text: 'අසතුට', isCorrect: false },
      { id: 'opt_3', text: 'සතුන්', isCorrect: false },
      { id: 'opt_4', text: 'සතුටු', isCorrect: false },
    ],
    remediation: {
      missingSegment: 'ු',
      missingCharOptions: ['ු', 'ූ', 'ුා', 'යු'],
      incompletePrompt: 'සත _ ට',
      jumbledParts: ['ට', 'ස', 'තු'],
      correctOrder: ['ස', 'තු', 'ට']
    }
  },
  {
    id: 'w_02',
    word: 'පොත',
    meaningEn: 'Book',
    category: 'School',
    grade: 2,
    level: 1,
    imageEmoji: '📕📚',
    audioPrompt: 'පොත යන වචනය තෝරා ලියන්න.',
    options: [
      { id: 'opt_1', text: 'පත', isCorrect: false },
      { id: 'opt_2', text: 'පොත', isCorrect: true },
      { id: 'opt_3', text: 'පැන්සල', isCorrect: false },
      { id: 'opt_4', text: 'පොත්', isCorrect: false },
    ],
    remediation: {
      missingSegment: 'ො',
      missingCharOptions: ['ො', 'ෝ', 'ෙ', 'ේ'],
      incompletePrompt: 'ප _ ත',
      jumbledParts: ['ත', 'පො'],
      correctOrder: ['පො', 'ත']
    }
  },
  {
    id: 'w_03',
    word: 'හාවා',
    meaningEn: 'Rabbit',
    category: 'Animals',
    grade: 2,
    level: 1,
    imageEmoji: '🐰🥕',
    audioPrompt: 'හාවා යන වචනය තෝරා ලියන්න.',
    options: [
      { id: 'opt_1', text: 'හාවා', isCorrect: true },
      { id: 'opt_2', text: 'හවා', isCorrect: false },
      { id: 'opt_3', text: 'බළලා', isCorrect: false },
      { id: 'opt_4', text: 'හාවෝ', isCorrect: false },
    ],
    remediation: {
      missingSegment: 'ා',
      missingCharOptions: ['ා', 'ැ', 'ෑ', 'ි'],
      incompletePrompt: 'හ _ වා',
      jumbledParts: ['වා', 'හා'],
      correctOrder: ['හා', 'වා']
    }
  },
  {
    id: 'w_04',
    word: 'කුරුල්ලා',
    meaningEn: 'Bird',
    category: 'Animals',
    grade: 2,
    level: 2,
    imageEmoji: '🐦🌳',
    audioPrompt: 'කුරුල්ලා යන වචනය තෝරා ලියන්න.',
    options: [
      { id: 'opt_1', text: 'කුරුල්ලා', isCorrect: true },
      { id: 'opt_2', text: 'කුරුලා', isCorrect: false },
      { id: 'opt_3', text: 'කපුටා', isCorrect: false },
      { id: 'opt_4', text: 'කුරුල්ලෝ', isCorrect: false },
    ],
    remediation: {
      missingSegment: 'ු',
      missingCharOptions: ['ු', 'ූ', 'ි', 'ී'],
      incompletePrompt: 'ක _ රුල්ලා',
      jumbledParts: ['ල්ලා', 'කු', 'රු'],
      correctOrder: ['කු', 'රු', 'ල්ලා']
    }
  },
  {
    id: 'w_05',
    word: 'පාසල',
    meaningEn: 'School',
    category: 'Places',
    grade: 2,
    level: 2,
    imageEmoji: '🏫🎒',
    audioPrompt: 'පාසල යන වචනය තෝරා ලියන්න.',
    options: [
      { id: 'opt_1', text: 'පසල', isCorrect: false },
      { id: 'opt_2', text: 'පාසල', isCorrect: true },
      { id: 'opt_3', text: 'පන්තිය', isCorrect: false },
      { id: 'opt_4', text: 'පොත', isCorrect: false },
    ],
    remediation: {
      missingSegment: 'ා',
      missingCharOptions: ['ා', 'ැ', 'ෑ', 'ො'],
      incompletePrompt: 'ප _ සල',
      jumbledParts: ['ල', 'පා', 'ස'],
      correctOrder: ['පා', 'ස', 'ල']
    }
  }
];

export class SinhalaAdaptiveEngine {
  constructor() {
    this.profile = this.loadProfile();
  }

  loadProfile() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}

    return this.getDefaultProfile();
  }

  getDefaultProfile() {
    return {
      studentId: 'student_001',
      studentName: 'දිනූෂි',
      grade: 2,
      currentLevel: 1,
      currentDifficulty: ADAPTIVE_DIFFICULTIES.EASY,
      overallStats: {
        totalAttempts: 0,
        correctAttempts: 0,
        accuracy: 100,
        avgTimePerWordSec: 0,
        totalTimeSpentSec: 0,
        hintUsageCount: 0
      },
      skillBreakdown: {
        letterRecognition: 90,
        wordRecognition: 85,
        writingAccuracy: 80,
        spellingAccuracy: 75,
        independentWriting: 60
      },
      errorTaxonomy: {
        MISSING_CHARACTER: 0,
        EXTRA_CHARACTER: 0,
        CHARACTER_SUBSTITUTION: 0,
        CHARACTER_ORDER_ERROR: 0,
        INCOMPLETE_WORD: 0
      },
      remediationState: {
        isActive: false,
        targetWord: null,
        targetQuestionId: null,
        errorType: null,
        currentStage: 1 // 1: Select, 2: Fill, 3: Jumble, 4: Copy, 5: Independent
      },
      history: []
    };
  }

  saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    } catch (e) {}
  }

  resetProfile() {
    this.profile = this.getDefaultProfile();
    this.saveProfile();
    return this.profile;
  }

  getProfile() {
    return this.profile;
  }

  /**
   * Evaluates a submission, updates rolling stats & decides next difficulty/activity
   */
  processSubmission({ question, studentInput, timeSpentSec = 8, hintUsed = false }) {
    const targetWord = question.word;
    const evaluation = classifySinhalaError(targetWord, studentInput);

    // 1. Update overall counts
    this.profile.overallStats.totalAttempts++;
    this.profile.overallStats.totalTimeSpentSec += timeSpentSec;
    this.profile.overallStats.avgTimePerWordSec = Math.round(
      this.profile.overallStats.totalTimeSpentSec / this.profile.overallStats.totalAttempts
    );

    if (hintUsed) {
      this.profile.overallStats.hintUsageCount++;
    }

    if (evaluation.isCorrect) {
      this.profile.overallStats.correctAttempts++;
    } else {
      if (this.profile.errorTaxonomy[evaluation.errorType] !== undefined) {
        this.profile.errorTaxonomy[evaluation.errorType]++;
      }
    }

    // 2. Compute overall & rolling accuracy
    this.profile.overallStats.accuracy = Math.round(
      (this.profile.overallStats.correctAttempts / this.profile.overallStats.totalAttempts) * 100
    );

    // 3. Record history item
    const historyItem = {
      id: Date.now(),
      targetWord,
      studentInput,
      isCorrect: evaluation.isCorrect,
      errorType: evaluation.errorType,
      difficulty: this.profile.currentDifficulty,
      timeSpentSec,
      hintUsed,
      timestamp: new Date().toLocaleTimeString()
    };
    this.profile.history.unshift(historyItem);
    if (this.profile.history.length > 20) this.profile.history.pop();

    // 4. Update Skill Matrix
    if (evaluation.isCorrect) {
      this.profile.skillBreakdown.writingAccuracy = Math.min(100, this.profile.skillBreakdown.writingAccuracy + 2);
      this.profile.skillBreakdown.spellingAccuracy = Math.min(100, this.profile.skillBreakdown.spellingAccuracy + 2);
      if (this.profile.currentDifficulty === ADAPTIVE_DIFFICULTIES.HARD) {
        this.profile.skillBreakdown.independentWriting = Math.min(100, this.profile.skillBreakdown.independentWriting + 5);
      }
    } else {
      this.profile.skillBreakdown.writingAccuracy = Math.max(30, this.profile.skillBreakdown.writingAccuracy - 3);
      this.profile.skillBreakdown.spellingAccuracy = Math.max(30, this.profile.skillBreakdown.spellingAccuracy - 3);
    }

    // 5. Adaptive Decision Engine
    const decision = this.computeAdaptiveNextStep(evaluation, question);

    this.saveProfile();

    return {
      evaluation,
      profile: this.profile,
      decision
    };
  }

  computeAdaptiveNextStep(evaluation, currentQuestion) {
    const recent = this.profile.history.slice(0, 5);
    const recentCorrect = recent.filter(h => h.isCorrect).length;
    const rollingAccuracy = recent.length > 0 ? Math.round((recentCorrect / recent.length) * 100) : 100;

    // A. Remediation Branch: If active, advance or retry stage
    if (this.profile.remediationState.isActive) {
      if (evaluation.isCorrect) {
        if (this.profile.remediationState.currentStage < 5) {
          this.profile.remediationState.currentStage++;
          return {
            action: 'REMEDIATION_ADVANCE',
            stage: this.profile.remediationState.currentStage,
            messageSi: `විශිෂ්ටයි! පියවර ${this.profile.remediationState.currentStage} වෙත යමු.`
          };
        } else {
          // Finished all 5 remediation stages!
          this.profile.remediationState.isActive = false;
          this.profile.remediationState.targetWord = null;
          this.profile.remediationState.currentStage = 1;
          return {
            action: 'REMEDIATION_COMPLETED',
            messageSi: 'නියමයි! ඔබ අපහසු වචනය සාර්ථකව ප්‍රගුණ කළා! 🎉'
          };
        }
      } else {
        return {
          action: 'REMEDIATION_RETRY',
          stage: this.profile.remediationState.currentStage,
          hint: evaluation.feedbackSi
        };
      }
    }

    // B. Trigger Targeted Remediation if student made >= 2 errors of same type
    if (!evaluation.isCorrect && this.profile.errorTaxonomy[evaluation.errorType] >= 2) {
      this.profile.remediationState = {
        isActive: true,
        targetWord: currentQuestion.word,
        targetQuestionId: currentQuestion.id,
        errorType: evaluation.errorType,
        currentStage: 1
      };
      return {
        action: 'TRIGGER_REMEDIATION',
        stage: 1,
        targetWord: currentQuestion.word,
        errorType: evaluation.errorType,
        messageSi: `අපි "${currentQuestion.word}" වචනයේ අපහසු අකුරු විශේෂ පියවර 5කින් පුහුණු වෙමු!`
      };
    }

    // C. Adaptive Difficulty Calibration based on rolling accuracy
    let difficultyChanged = false;
    let oldDifficulty = this.profile.currentDifficulty;

    if (rollingAccuracy >= 80 && recent.length >= 3) {
      if (this.profile.currentDifficulty === ADAPTIVE_DIFFICULTIES.EASY) {
        this.profile.currentDifficulty = ADAPTIVE_DIFFICULTIES.MEDIUM;
        difficultyChanged = true;
      } else if (this.profile.currentDifficulty === ADAPTIVE_DIFFICULTIES.MEDIUM) {
        this.profile.currentDifficulty = ADAPTIVE_DIFFICULTIES.HARD;
        difficultyChanged = true;
      }
    } else if (rollingAccuracy < 60 && recent.length >= 3) {
      if (this.profile.currentDifficulty === ADAPTIVE_DIFFICULTIES.HARD) {
        this.profile.currentDifficulty = ADAPTIVE_DIFFICULTIES.MEDIUM;
        difficultyChanged = true;
      } else if (this.profile.currentDifficulty === ADAPTIVE_DIFFICULTIES.MEDIUM) {
        this.profile.currentDifficulty = ADAPTIVE_DIFFICULTIES.EASY;
        difficultyChanged = true;
      }
    }

    return {
      action: 'NEXT_QUESTION',
      difficultyChanged,
      oldDifficulty,
      newDifficulty: this.profile.currentDifficulty,
      rollingAccuracy
    };
  }
}

// Singleton Instance for App-wide usage
export const adaptiveEngine = new SinhalaAdaptiveEngine();
