const mongoose = require('mongoose');

const weeklyProgressSchema = new mongoose.Schema({
  week: { type: String, required: true }, // e.g. "Week 1"
  math: { type: Number, default: 0 },
  sinhala: { type: Number, default: 0 },
  english: { type: Number, default: 0 },
  preschool: { type: Number, default: 0 },
  average: { type: Number, default: 0 }
}, { _id: false });

const categoryMarkSchema = new mongoose.Schema({
  code: { type: String, required: true }, // e.g. "M1", "C1", "E1", "P1"
  name: { type: String, required: true },
  marks: { type: Number, default: 0 },
  maxMarks: { type: Number, default: 30 },
  pct: { type: Number, default: 0 },
  status: { type: String, default: 'Developing' } // "Mastered", "Proficient", "Developing", "Attention Needed"
}, { _id: false });

const recommendationSchema = new mongoose.Schema({
  subjectId: { type: String, default: 'sinhala' },
  subjectName: { type: String, default: 'සිංහල භාෂාව (Sinhala)' },
  categoryCode: { type: String, default: 'C4' },
  categoryName: { type: String, default: 'කාලය හා ව්‍යාකරණ' },
  reason: { type: String, default: '' },
  actionTitle: { type: String, default: 'Adaptive Remedial Exercise' },
  actionUrl: { type: String, default: '/module/sinhala/grade4' },
  priority: { type: String, default: 'High Priority ⭐' }
}, { _id: false });

const studentAnalyticsSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  grade: { type: String, default: 'Grade 4' },
  avatar: { type: String, default: '👦' },
  attendance: { type: String, default: '95%' },
  totalExercises: { type: Number, default: 0 },
  overallAverage: { type: Number, default: 0 },
  weeklyProgress: [weeklyProgressSchema],
  categoryMarks: {
    math: [categoryMarkSchema],
    sinhala: [categoryMarkSchema],
    english: [categoryMarkSchema],
    preschool: [categoryMarkSchema]
  },
  recommendation: recommendationSchema,
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentAnalytics', studentAnalyticsSchema);
