const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Student = require('../models/Student');
const CreativeActivityRecord = require('../models/CreativeActivityRecord');

const PYTHON_AI_URL = process.env.PYTHON_AI_URL || 'http://127.0.0.1:8000';

// ── 1. Motor Skills Evaluation ──
router.post('/motor/evaluate', async (req, res) => {
  const { studentId, videoFramesBase64 } = req.body;
  try {
    const aiResponse = await fetch(`${PYTHON_AI_URL}/api/ai/motor-skills/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId || "test_user",
        video_frames_base64: videoFramesBase64 || []
      })
    });
    
    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      return res.json(aiData);
    } else {
      return res.status(500).json({ error: "AI processing failed" });
    }
  } catch (error) {
    console.log("Python AI server unreachable, mock fallback for motor skills.");
    return res.json({
      score: 85,
      status: "Good",
      feedback: "Node Mock Fallback: Great balance & coordination!"
    });
  }
});

// ── 2. Story Drawing Evaluation ──
router.post('/story-evaluate', async (req, res) => {
  const { studentId, imageBase64, expectedElements } = req.body;
  try {
    const aiResponse = await fetch(`${PYTHON_AI_URL}/api/ai/story-drawing/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId || "test_user",
        image_base64: imageBase64 || "",
        expected_elements: expectedElements || []
      })
    });
    
    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      return res.json(aiData);
    } else {
      const errText = await aiResponse.text();
      console.error("Python AI error:", errText);
      return res.status(500).json({ error: "AI processing failed" });
    }
  } catch (error) {
    console.log("Python AI server unreachable for story evaluation.");
    return res.status(503).json({
      error: "AI server is offline. Please try again in a moment.",
      score: 0,
      detected_elements: [],
      missing_elements: expectedElements || [],
      feedback_sinhala: "AI server එක offline. මොහොතකින් නැවත උත්සාහ කරන්න.",
      feedback_english: "AI server is offline. Please try again in a moment."
    });
  }
});

// ── 3. Creative Activity Assessment ──
router.post('/assess', async (req, res) => {
  try {
    const { studentId, activityType, activityName, currentLevel, mediaBase64 } = req.body;
    
    let student = null;
    if (global.dbConnected) {
      student = await Student.findById(studentId);
    }
    if (!student && !global.dbConnected) {
      student = { 
        _id: studentId, 
        creativeFingerprint: {
          creativity: 50, fineMotorSkills: 50, visualAccuracy: 50, handEyeCoordination: 50, rhythm: 50, movementCoordination: 50
        }, 
        save: async () => {} 
      };
    } else if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    let historicalWeaknesses = [];
    if (global.dbConnected) {
      const pastRecords = await CreativeActivityRecord.find({ studentId }).select('detectedWeakness').limit(10);
      historicalWeaknesses = pastRecords.filter(r => r.detectedWeakness).map(r => r.detectedWeakness);
    }

    let aiResult;
    try {
      const response = await fetch(`${PYTHON_AI_URL}/api/ai/creative-skills/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          activity_type: activityType,
          activity_name: activityName,
          current_level: currentLevel,
          media_base64: mediaBase64 || "dummy_data",
          historical_weaknesses: historicalWeaknesses
        })
      });
      if (response.ok) {
        aiResult = await response.json();
      } else {
        throw new Error('Python AI Error');
      }
    } catch (e) {
      aiResult = {
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

    res.json({
      success: true,
      data: {
        scores: aiResult.scores,
        overallScore: aiResult.overall_score,
        detectedWeakness: aiResult.detected_weakness,
        recommendation: aiResult.recommendation
      }
    });
  } catch (error) {
    console.error('Error submitting creative assessment:', error);
    res.status(500).json({ error: 'Failed to process assessment' });
  }
});

// ── 4. Paper Craft Video Analysis via Gemini ──
const CRAFT_RECIPES = {
  boat: {
    name: 'Paper Boat',
    steps: [
      'Fold the paper in half horizontally (landscape fold)',
      'Fold the paper in half again vertically, then unfold to get a centre crease',
      'Fold both top corners down to the centre crease to form a triangle',
      'Fold the bottom strip up on the front, then flip and fold up on the back',
      'Open the hat shape and press flat to form a square',
      'Fold the two bottom corners of the square up to the top point',
      'Open the resulting shape and pull apart to reveal the boat',
    ]
  },
  airplane: {
    name: 'Paper Airplane',
    steps: [
      'Fold the paper in half lengthwise (hot dog fold)',
      'Fold the top two corners down to the centre crease',
      'Fold the new top edges down to the centre crease again',
      'Fold the plane in half along the original centre crease',
      'Fold down one wing so its edge aligns with the bottom of the plane',
      'Flip and fold down the other wing to match',
      'Open the wings to be horizontal and the plane is ready to fly',
    ]
  },
  crown: {
    name: 'Paper Crown',
    steps: [
      'Take a long strip of paper (or tape two A4 sheets together lengthwise)',
      'Fold the strip in half lengthwise',
      'Make evenly spaced diagonal folds to create triangular points along the top',
      'Fold each triangular point upward to form the crown peaks',
      'Curl or tape the ends of the strip together to form a circle',
      'Adjust the size to fit on the head and secure with tape or glue',
    ]
  },
  windmill: {
    name: 'Paper Windmill',
    steps: [
      'Start with a square piece of paper',
      'Fold the paper diagonally both ways and unfold to get X creases',
      'Cut from each corner toward the centre, stopping 2cm from the middle',
      'Bend (do not fold) every other corner point toward the centre',
      'Secure all four bent points at the centre with a pin or glue',
      'Attach the centre to a straw or stick with a pin so it can spin freely',
    ]
  }
};

router.post('/papercraft/analyze', async (req, res) => {
  const { craftId, frames, studentId } = req.body;

  const recipe = CRAFT_RECIPES[craftId];
  if (!recipe) {
    return res.status(400).json({ error: 'Unknown craft type' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('⚠️ No Gemini API key — returning mock result for', recipe.name);
    const mockSteps = recipe.steps.map((s, i) => ({
      step: i + 1,
      description: s,
      status: i < Math.floor(recipe.steps.length * 0.75) ? 'correct' : 'partial',
      note: i < Math.floor(recipe.steps.length * 0.75) ? 'Well done!' : 'Try to be a little neater here.'
    }));
    return res.json({
      craftName: recipe.name,
      stepResults: mockSteps,
      overallScore: 72,
      finalOutputCorrect: true,
      feedback: `Great effort on the ${recipe.name}! (Mock result — add your Gemini API key for real AI analysis.)`,
      isMock: true
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const imageParts = (frames || []).map(f => ({
      inlineData: {
        mimeType: 'image/jpeg',
        data: f.replace(/^data:image\/\w+;base64,/, '')
      }
    }));

    const stepsText = recipe.steps.map((s, i) => `Step ${i + 1}: ${s}`).join('\n');

    const prompt = `You are an expert children's craft evaluator. A child has attempted to make a "${recipe.name}".

The correct steps are:
${stepsText}

I am giving you ${imageParts.length} frames extracted from their video in chronological order.

Please evaluate:
1. For each step, determine if it appears to have been completed correctly, partially, or was skipped.
2. Whether the final output looks like a correct ${recipe.name}.
3. Give an overall score out of 100.
4. Write one short, encouraging, kid-friendly feedback sentence.

Respond ONLY with valid JSON in this exact format:
{
  "stepResults": [
    { "step": 1, "description": "...", "status": "correct|partial|skipped", "note": "..." }
  ],
  "finalOutputCorrect": true,
  "overallScore": 85,
  "feedback": "Great job! ..."
}`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Gemini did not return valid JSON');

    const parsed = JSON.parse(jsonMatch[0]);
    return res.json({ craftName: recipe.name, ...parsed, isMock: false });
  } catch (err) {
    console.error('Gemini API error:', err.message);
    return res.status(500).json({ error: 'AI analysis failed: ' + err.message });
  }
});

module.exports = router;
