const mongoose = require('mongoose');

const creativeActivityRecordSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  activityType: { type: String, enum: ['Painting', 'Handwork', 'Singing', 'Dancing'], required: true },
  activityName: { type: String, required: true },
  level: { type: Number, default: 1 },
  timestamp: { type: Date, default: Date.now },
  
  // Overall assessment
  overallScore: { type: Number },
  
  // Specific scores based on Multimodal Analysis
  scores: {
    shapeAccuracy: Number,
    colourUsage: Number,
    creativity: Number,
    completion: Number,
    fineMotorSkills: Number,
    visualAccuracy: Number,
    handEyeCoordination: Number,
    rhythm: Number,
    movementCoordination: Number
  },
  
  // Recurring Error / Weakness Detection
  detectedWeakness: { type: String },
  
  // Personalized Recommendation
  recommendedNextActivity: { type: String },
  recommendedNextLevel: { type: Number }
});

module.exports = mongoose.model('CreativeActivityRecord', creativeActivityRecordSchema);
