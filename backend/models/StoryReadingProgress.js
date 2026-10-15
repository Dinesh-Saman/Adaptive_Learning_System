const mongoose = require('mongoose');

const storyReadingProgressSchema = new mongoose.Schema({
  studentId: { type: String, required: true, index: true },
  studentName: { type: String, default: '' },
  storyId: { type: String, required: true, index: true },
  storyTitle: { type: String, default: '' },
  paragraphIdx: { type: Number, default: 0 },
  sentenceIdx: { type: Number, default: 0 },
  wordIdx: { type: Number, default: 0 },
  wordText: { type: String, default: '' },
  snippet: { type: String, default: '' },
  progressPercent: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  lastReadAt: { type: Date, default: Date.now }
});

storyReadingProgressSchema.index({ studentId: 1, storyId: 1 }, { unique: true });

module.exports = mongoose.model('StoryReadingProgress', storyReadingProgressSchema);
