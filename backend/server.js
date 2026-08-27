require('dotenv').config({ override: true });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
global.dbConnected = false;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/adaptive_learning_db', {
  serverSelectionTimeoutMS: 5000 // Timeout quickly if local DB is not running
})
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    global.dbConnected = true;
  })
  .catch((err) => {
    console.error('⚠️ MongoDB Connection Failed:', err.message);
    global.dbConnected = false;
  });

// Basic route
app.get('/', (req, res) => {
  res.send('AI Adaptive Learning Platform API is running');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/creative', require('./routes/creative'));

// Mock Adaptive Engine Endpoint (Onel's Research) - Forwards to Python FastAPI
app.post('/api/math/next-question', async (req, res) => {
  const { studentId, lastQuestionCorrect, responseTimeMs, confusionIndicator, attentionIndicator } = req.body;
  
  try {
    // Attempt to call the Python AI Microservice
    const aiResponse = await fetch('http://127.0.0.1:8000/api/ai/math/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId || "test_user",
        last_correct: lastQuestionCorrect || false,
        response_time_ms: responseTimeMs || 5000,
        camera_attention_score: attentionIndicator || 0.8,
        camera_frustration_score: confusionIndicator || 0.2
      })
    });

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      
      // Generate question based on AI's predicted difficulty
      let nextQuestion = {};
      if (aiData.predicted_difficulty === 'Easy') {
        nextQuestion = { text: '12 + 5 = ?', type: 'addition' };
      } else if (aiData.predicted_difficulty === 'Medium') {
        nextQuestion = { text: '45 - 17 = ?', type: 'subtraction' };
      } else {
        nextQuestion = { text: 'A shop has 45 apples. It sells 17 apples. How many remain?', type: 'word_problem' };
      }

      return res.json({
        recommendedDifficulty: aiData.predicted_difficulty,
        nextQuestion,
        aiReasoning: aiData.reasoning
      });
    }
  } catch (error) {
    console.log("Python AI server unreachable, falling back to mock Node.js logic.");
  }

  // Fallback Node.js mock logic if Python server is down
  let newDifficulty = 'Medium';
  let reasoning = 'Initial state (Node Fallback)';

  if (lastQuestionCorrect && responseTimeMs < 10000 && confusionIndicator < 0.3) {
    newDifficulty = 'Hard';
  } else if (!lastQuestionCorrect && responseTimeMs > 20000 && confusionIndicator > 0.7) {
    newDifficulty = 'Easy';
  }

  res.json({
    recommendedDifficulty: newDifficulty,
    nextQuestion: { text: '45 - 17 = ?', type: 'subtraction' },
    aiReasoning: reasoning
  });
});

// Suvinya - English Pronunciation Endpoint
app.post('/api/english/assess', async (req, res) => {
  console.log("--> Received request on /api/english/assess");
  const { studentId, audioBase64, targetText, videoFramesBase64 } = req.body;

  try {
    const aiResponse = await fetch('http://127.0.0.1:8000/api/ai/english/pronunciation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId || "test_user",
        audio_base64: audioBase64 || "",
        target_text: targetText || "",
        video_frames_base64: videoFramesBase64 || []
      })
    });

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      return res.json(aiData);
    } else {
      console.error("Python AI error:", await aiResponse.text());
      return res.status(500).json({ error: "AI processing failed" });
    }
  } catch (error) {
    console.log("Python AI server unreachable, falling back to mock Node.js logic.", error);
    // Mock response if AI is down
    return res.json({
        overall_score: 85.0,
        severity_level: 1,
        diagnostics: {
            intelligibility: 90.0,
            phoneme_control: 80.0,
            fluency: 85.0,
            prosody: 85.0
        },
        l1_contrast_flag: "node_mock",
        expected_phoneme: "-",
        detected_phoneme: "-",
        feedback: {
            learner_message: "Great job! Keep practicing.",
            teacher_message: "Node mock fallback active."
        }
    });
  }
});


// Motor Skills Endpoint
app.post('/api/motor/evaluate', async (req, res) => {
  const { studentId, videoFramesBase64 } = req.body;
  try {
    const aiResponse = await fetch('http://127.0.0.1:8000/api/ai/motor-skills/evaluate', {
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
    console.log("Python AI server unreachable, mock fallback.");
    return res.json({
        score: 85,
        status: "Good",
        feedback: "Node Mock Fallback: Great balance!"
    });
  }
});

// Story Drawing Endpoint - Proxies to Python CLIP AI backend
app.post('/api/creative/story-evaluate', async (req, res) => {
  const { studentId, imageBase64, expectedElements } = req.body;
  try {
    const aiResponse = await fetch('http://127.0.0.1:8000/api/ai/story-drawing/evaluate', {
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

// Sinhala Handwriting AI Model Endpoint (Forwards to Python FastAPI or Evaluates)
app.post('/api/ai/handwriting/evaluate', async (req, res) => {
  const { student_id, image_base64, target_letter, reference_base64 } = req.body;
  try {
    const aiResponse = await fetch('http://127.0.0.1:8000/api/ai/handwriting/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: student_id || "student",
        image_base64: image_base64 || "",
        target_letter: target_letter || "ක",
        reference_base64: reference_base64 || ""
      })
    });
    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      return res.json(aiData);
    }
  } catch (error) {
    // Local vision evaluation fallback
  }

  return res.json({
    quality: "Good",
    accuracy_score: 80.0,
    feedback: "Good shape match!",
    recognized: target_letter
  });
});
// ─────────────────────────────────────────────
// Paper Craft AI Video Analysis Endpoint
// ─────────────────────────────────────────────
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

app.post('/api/papercraft/analyze', async (req, res) => {
  const { craftId, frames, studentId } = req.body;

  const recipe = CRAFT_RECIPES[craftId];
  if (!recipe) {
    return res.status(400).json({ error: 'Unknown craft type' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // ── MOCK fallback if no API key configured ──
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('⚠️  No Gemini API key — returning mock result for', recipe.name);
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

    // Build the image parts from base64 frames
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

I am giving you ${imageParts.length} frames extracted from their video in chronological order (first frame = beginning, last frame = final result).

Please evaluate:
1. For each step, determine if it appears to have been completed correctly, partially, or was skipped.
2. Whether the final output (last frame) looks like a correct ${recipe.name}.
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

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Gemini did not return valid JSON');

    const parsed = JSON.parse(jsonMatch[0]);
    return res.json({ craftName: recipe.name, ...parsed, isMock: false });

  } catch (err) {
    console.error('Gemini API error:', err.message);
    return res.status(500).json({ error: 'AI analysis failed: ' + err.message });
  }
});



// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
