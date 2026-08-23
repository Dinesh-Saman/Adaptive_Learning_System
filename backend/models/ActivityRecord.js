const mongoose = require('mongoose');

const activityRecordSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  timestamp: { type: Date, default: Date.now },
  module: { type: String, enum: ['math', 'english', 'sinhala', 'motor'], required: true },
  
  // Specific to the module
  taskData: mongoose.Schema.Types.Mixed, // e.g., { question: '23+14', type: 'addition' }
  
  // Performance
  isCorrect: { type: Boolean },
  timeTakenMs: { type: Number },
  attempts: { type: Number, default: 1 },
  hintsRequested: { type: Number, default: 0 },
  
  // AI Predicted State (Multimodal Fusion)
  aiState: {
    attentionLevel: Number, // 0-1
    confusionIndicator: Number, // 0-1
    frustrationIndicator: Number, // 0-1
  },
  
  // AI Recommended Difficulty for next task
  recommendedDifficultyLevel: Number
});

module.exports = mongoose.model('ActivityRecord', activityRecordSchema);
