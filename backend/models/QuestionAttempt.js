const mongoose = require('mongoose');

const questionAttemptSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  paperNumber: { type: Number, default: 1 },
  questionId: { type: String, required: true, index: true },
  skillId: { type: String, required: true },
  module: { type: String, enum: ['math', 'sinhala', 'english', 'motor'], default: 'math', required: true },
  grade: { type: Number, default: 2 },
  difficultyTier: { type: Number, default: 1 },
  studentAnswer: { type: String },
  correctAnswer: { type: String },
  isCorrect: { type: Boolean, required: true },
  responseTimeMs: { type: Number, default: 0 },
  misconception: { type: String },
  timestamp: { type: Date, default: Date.now }
});

// Composite index to guarantee fast fetching of a student's answered questions
questionAttemptSchema.index({ studentId: 1, questionId: 1 });
questionAttemptSchema.index({ studentId: 1, module: 1, paperNumber: 1 });

module.exports = mongoose.model('QuestionAttempt', questionAttemptSchema);
