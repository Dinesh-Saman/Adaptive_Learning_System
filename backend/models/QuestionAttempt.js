const mongoose = require('mongoose');

const questionAttemptSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.Mixed, required: true, index: true },
  paperNumber: { type: Number, default: 1 },
  questionId: { type: String, required: true, index: true },
  skillId: { type: String, required: true },
  module: { 
    type: String, 
    enum: ['math', 'sinhala', 'english', 'motor', 'preschool', 'creative', 'preschool_activity', 'drawing', 'tracing', 'coloring'], 
    default: 'math', 
    required: true 
  },
  grade: { type: mongoose.Schema.Types.Mixed, default: 2 },
  difficultyTier: { type: Number, default: 1 },
  studentAnswer: { type: String, default: '' },
  correctAnswer: { type: String, default: '' },
  isCorrect: { type: Boolean, required: true },
  responseTimeMs: { type: Number, default: 0 },
  misconception: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

// Composite index to guarantee fast fetching of a student's answered questions
questionAttemptSchema.index({ studentId: 1, questionId: 1 });
questionAttemptSchema.index({ studentId: 1, module: 1, paperNumber: 1 });

module.exports = mongoose.model('QuestionAttempt', questionAttemptSchema);
