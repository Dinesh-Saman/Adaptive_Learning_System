const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const CreativeActivityRecord = require('../models/CreativeActivityRecord');

// Mock Python AI endpoint wrapper
async function evaluateCreativeSkills(data) {
  try {
    const response = await fetch('http://localhost:8000/api/ai/creative-skills/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch from Python AI');
  } catch (error) {
    console.error('Python AI Error:', error);
    // Fallback Mock
    return {
      scores: {
        "Shape Accuracy": 80,
        "Colour Usage": 85,
        "Creativity": 88,
        "Completion": 90,
        "Fine Motor Skills": 75,
        "Visual Accuracy": 80,
        "Hand-Eye Coordination": 70
      },
      overall_score: 82,
      detected_weakness: "Child has difficulty with cutting/drawing accuracy.",
      recommendation: {
        reason: "Child requires additional practice.",
        next_activity: "Basic Shape Coloring - Level 1",
        recommended_level: 1
      }
    };
  }
}

// Map Python keys to Mongoose keys
const scoreKeyMap = {
  "Shape Accuracy": "shapeAccuracy",
  "Colour Usage": "colourUsage",
  "Creativity": "creativity",
  "Completion": "completion",
  "Fine Motor Skills": "fineMotorSkills",
  "Visual Accuracy": "visualAccuracy",
  "Hand-Eye Coordination": "handEyeCoordination",
  "Rhythm": "rhythm",
  "Movement Coordination": "movementCoordination"
};

// Map activity specific scores to Fingerprint keys
const activityToFingerprintMap = {
  "Painting": ["creativity", "fineMotorSkills", "visualAccuracy", "handEyeCoordination"],
  "Handwork": ["creativity", "fineMotorSkills", "visualAccuracy", "handEyeCoordination"],
  "Singing": ["rhythm", "creativity"],
  "Dancing": ["rhythm", "movementCoordination", "creativity"]
};

// 1. Submit a creative activity for assessment
router.post('/assess', async (req, res) => {
  try {
    const { studentId, activityType, activityName, currentLevel, mediaBase64 } = req.body;
    
    // Check if student exists
    let student = null;
    if (global.dbConnected) {
        student = await Student.findById(studentId);
    }
    if (!student && !global.dbConnected) {
       // Mock student for frontend testing if DB is down
       student = { _id: studentId, creativeFingerprint: {
         creativity: 50, fineMotorSkills: 50, visualAccuracy: 50, handEyeCoordination: 50, rhythm: 50, movementCoordination: 50
       }, save: async () => {} };
    } else if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }

    // Get historical weaknesses
    let historicalWeaknesses = [];
    if (global.dbConnected) {
        const pastRecords = await CreativeActivityRecord.find({ studentId }).select('detectedWeakness').limit(10);
        historicalWeaknesses = pastRecords.filter(r => r.detectedWeakness).map(r => r.detectedWeakness);
    }

    // Call Python AI
    const aiResult = await evaluateCreativeSkills({
      student_id: studentId,
      activity_type: activityType,
      activity_name: activityName,
      current_level: currentLevel,
      media_base64: mediaBase64 || "dummy_data",
      historical_weaknesses: historicalWeaknesses
    });

    // Save Record
    const mappedScores = {};
    for (const [key, val] of Object.entries(aiResult.scores)) {
        if (scoreKeyMap[key]) mappedScores[scoreKeyMap[key]] = val;
    }

    const newRecord = new CreativeActivityRecord({
      studentId,
      activityType,
      activityName,
      level: currentLevel,
      overallScore: aiResult.overall_score,
      scores: mappedScores,
      detectedWeakness: aiResult.detected_weakness,
      recommendedNextActivity: aiResult.recommendation.next_activity,
      recommendedNextLevel: aiResult.recommendation.recommended_level
    });

    if (global.dbConnected) {
        await newRecord.save();
    }

    // Update Student Fingerprint (Moving Average)
    const skillsToUpdate = activityToFingerprintMap[activityType] || [];
    
    skillsToUpdate.forEach(skill => {
        if (mappedScores[skill] !== undefined) {
            const currentVal = student.creativeFingerprint[skill] || 0;
            // Simple moving average where new score has 30% weight
            const newVal = currentVal === 0 ? mappedScores[skill] : Math.round((currentVal * 0.7) + (mappedScores[skill] * 0.3));
            student.creativeFingerprint[skill] = newVal;
        }
    });

    if (global.dbConnected) {
        await student.save();
    }

    res.json({
      success: true,
      assessment: aiResult,
      updatedFingerprint: student.creativeFingerprint
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Get Fingerprint and History
router.get('/fingerprint/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        let student = null;
        if (global.dbConnected) {
            student = await Student.findById(studentId);
        }

        if (!student && !global.dbConnected) {
            student = { _id: studentId, creativeFingerprint: {
                creativity: 88, fineMotorSkills: 67, visualAccuracy: 82, handEyeCoordination: 70, rhythm: 85, movementCoordination: 78
              }};
        }

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        let history = [];
        if (global.dbConnected) {
            history = await CreativeActivityRecord.find({ studentId }).sort({ timestamp: 1 }).limit(20);
        } else {
            // Mock History
            history = [
                { timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), activityType: "Handwork", overallScore: 60, scores: { fineMotorSkills: 67 } },
                { timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), activityType: "Handwork", overallScore: 70, scores: { fineMotorSkills: 74 } },
                { timestamp: new Date(), activityType: "Handwork", overallScore: 82, scores: { fineMotorSkills: 81 } }
            ];
        }

        res.json({
            fingerprint: student.creativeFingerprint,
            history: history
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
