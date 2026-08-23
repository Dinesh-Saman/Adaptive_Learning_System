const mongoose = require('mongoose');

const sinhalaSessionSchema = new mongoose.Schema({
  studentId: { type: String, required: true },  // can be name or mongo id
  completedAt: { type: Date, default: Date.now },
  totalQuestions: { type: Number, required: true },
  totalCorrect: { type: Number, required: true },
  scorePercent: { type: Number, required: true }, // 0-100
  skillRating: { type: Number, required: true },  // 0.0-1.0 estimated ability
  answers: [
    {
      questionId: String,
      difficulty: Number,
      correct: Boolean,
    }
  ]
});

module.exports = mongoose.model('SinhalaSession', sinhalaSessionSchema);
