const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  grade: { type: String, required: true }, // e.g., "Grade 3"
  masteryLevels: {
    math: {
      addition: { type: Number, default: 0.5 },
      subtraction: { type: Number, default: 0.5 },
      multiplication: { type: Number, default: 0.5 },
      wordProblems: { type: Number, default: 0.5 },
    },
    english: {
      pronunciation: { type: Number, default: 0.5 },
    },
    sinhala: {
      writing: { type: Number, default: 0.5 },
    },
    motorSkills: {
      coordination: { type: Number, default: 0.5 },
    },
    creativeFingerprint: {
      creativity: { type: Number, default: 0 },
      fineMotorSkills: { type: Number, default: 0 },
      visualAccuracy: { type: Number, default: 0 },
      handEyeCoordination: { type: Number, default: 0 },
      rhythm: { type: Number, default: 0 },
      movementCoordination: { type: Number, default: 0 }
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
