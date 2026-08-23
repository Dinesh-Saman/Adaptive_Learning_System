const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  focusArea: { type: String, enum: ['math', 'english', 'sinhala', 'motor'], required: true },
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' }
});

module.exports = mongoose.model('Session', sessionSchema);
