const mongoose = require('mongoose');

const ErrorPatternSchema = new mongoose.Schema({
  errorType: String,       // missing_character, extra_character, substitution, order_error, incomplete, unrelated
  word: String,            // which word caused the error
  count: { type: Number, default: 1 },
  lastSeen: { type: Date, default: Date.now }
});

const AttemptSchema = new mongoose.Schema({
  word: String,
  expected: String,
  written: String,
  isCorrect: Boolean,
  errorType: String,
  difficulty: String,
  hintsUsed: { type: Number, default: 0 },
  selfCorrected: { type: Boolean, default: false },
  timeSeconds: Number,
  timestamp: { type: Date, default: Date.now }
});

const SinhalaWritingProfileSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  studentName: String,
  grade: { type: Number, default: 2 },
  currentLevel: { type: Number, default: 1 },
  currentDifficulty: { type: String, default: 'easy' }, // easy | medium | hard

  // Performance metrics
  totalAttempts: { type: Number, default: 0 },
  totalCorrect: { type: Number, default: 0 },
  writingAccuracy: { type: Number, default: 0 },        // %
  spellingAccuracy: { type: Number, default: 0 },       // %
  letterRecognition: { type: Number, default: 0 },      // %
  wordRecognition: { type: Number, default: 0 },        // %

  // Error tracking
  errorPatterns: [ErrorPatternSchema],

  // Detailed attempts history
  recentAttempts: [AttemptSchema],

  // Level unlock tracking
  levelsUnlocked: { type: [Number], default: [1] },

  // Self-correction count
  selfCorrections: { type: Number, default: 0 },
  totalHintsUsed: { type: Number, default: 0 },

  // Streak
  currentStreak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },

  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SinhalaWritingProfile', SinhalaWritingProfileSchema);
