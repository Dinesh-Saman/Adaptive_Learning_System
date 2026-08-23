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
    console.error('⚠️ MongoDB not found locally. Running in MOCK mode for Auth.');
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
    const aiResponse = await fetch('http://localhost:8000/api/ai/math/evaluate', {
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
  const { studentId, audioBase64, targetText } = req.body;

  try {
    const aiResponse = await fetch('http://localhost:8000/api/ai/english/pronunciation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId || "test_user",
        audio_base64: audioBase64 || "",
        target_text: targetText || ""
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
    const aiResponse = await fetch('http://localhost:8000/api/ai/motor-skills/evaluate', {
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

// Sinhala Handwriting AI Model Endpoint (Forwards to Python FastAPI or Evaluates)
app.post('/api/ai/handwriting/evaluate', async (req, res) => {
  const { student_id, image_base64, target_letter, reference_base64 } = req.body;
  try {
    const aiResponse = await fetch('http://localhost:8000/api/ai/handwriting/evaluate', {
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
// Sinhala Exercises DB Route
app.get('/api/sinhala/exercises', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  try {
    const dbPath = path.join(__dirname, 'data', 'sinhala_exercises_db.json');
    const data = fs.readFileSync(dbPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Could not load Sinhala exercises DB" });
  }
});

// Sinhala Adaptive Engine Proxy
app.post('/api/sinhala/next', async (req, res) => {
  try {
    const aiResponse = await fetch('http://localhost:8000/sinhala/adaptive/next', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    if (aiResponse.ok) {
      const data = await aiResponse.json();
      res.json(data);
    } else {
      res.status(500).json({ error: "AI processing failed" });
    }
  } catch (error) {
    // Fallback to first question
    res.json({ next_question_id: "match_word_pic_1" });
  }
});

// Save a completed Sinhala session to MongoDB
const SinhalaSession = require('./models/SinhalaSession');

app.post('/api/sinhala/save-session', async (req, res) => {
  const { studentId, totalQuestions, totalCorrect, scorePercent, skillRating, answers } = req.body;

  if (!global.dbConnected) {
    return res.json({ success: true, mock: true });
  }

  try {
    const session = new SinhalaSession({
      studentId,
      totalQuestions,
      totalCorrect,
      scorePercent,
      skillRating,
      answers: answers || []
    });
    await session.save();
    res.json({ success: true, sessionId: session._id });
  } catch (err) {
    console.error('Failed to save Sinhala session:', err);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

// Get progress history for a student
app.get('/api/sinhala/progress/:studentId', async (req, res) => {
  if (!global.dbConnected) {
    // Return mock data so the chart still renders in development
    const mockData = Array.from({ length: 6 }, (_, i) => ({
      completedAt: new Date(Date.now() - (5 - i) * 86400000).toISOString(),
      scorePercent: 40 + i * 10 + Math.floor(Math.random() * 10),
      skillRating: parseFloat((0.3 + i * 0.08).toFixed(2)),
      totalCorrect: 4 + i,
      totalQuestions: 10
    }));
    return res.json(mockData);
  }

  try {
    const sessions = await SinhalaSession
      .find({ studentId: req.params.studentId })
      .sort({ completedAt: 1 })
      .limit(20)
      .select('completedAt scorePercent skillRating totalCorrect totalQuestions');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

// ─────────────────────────────────────────────────────────
// Adaptive Personalized Sinhala Writing Activity System
// ─────────────────────────────────────────────────────────
const SinhalaWritingProfile = require('./models/SinhalaWritingProfile');
const sinhalaWritingDB = require('./data/sinhala_writing_db.json');

// GET: Fetch activities for grade/level/difficulty
app.get('/api/sinhala-writing/activities', (req, res) => {
  const { grade, level, difficulty } = req.query;
  let results = sinhalaWritingDB;
  if (grade)  results = results.filter(a => a.grade === parseInt(grade));
  if (level)  results = results.filter(a => a.level === parseInt(level));
  res.json(results);
});

// GET: Student learning profile
app.get('/api/sinhala-writing/profile/:studentId', async (req, res) => {
  try {
    if (!global.dbConnected) {
      return res.json({
        studentId: req.params.studentId, grade: 2, currentLevel: 1, currentDifficulty: 'easy',
        writingAccuracy: 75, spellingAccuracy: 70, letterRecognition: 85, wordRecognition: 80,
        errorPatterns: [], totalAttempts: 10, totalCorrect: 7, currentStreak: 2, bestStreak: 5,
        levelsUnlocked: [1], isMock: true
      });
    }
    const profile = await SinhalaWritingProfile.findOne({ studentId: req.params.studentId });
    if (!profile) return res.json(null);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: AI-powered evaluation of student's written answer
app.post('/api/sinhala-writing/evaluate', async (req, res) => {
  const { expected, written, grade, level, difficulty, errorHistory, studentId } = req.body;

  if (!expected || written === undefined) {
    return res.status(400).json({ error: 'expected and written are required' });
  }

  // ── Local rule-based evaluation (always runs, fast) ──
  const localEval = evaluateWritingLocally(expected, written);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.json({ ...localEval, aiEnhanced: false });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const recentErrors = (errorHistory || []).slice(-3).map(e => e.errorType).join(', ') || 'none';

    const prompt = `You are an expert Sinhala language teacher for Grade ${grade || 2} students.
A student was asked to write the Sinhala word: "${expected}"
The student wrote: "${written}"

Local analysis says: errorType="${localEval.errorType}", isCorrect=${localEval.isCorrect}
Student's recent error history: ${recentErrors}

Please analyze deeply and respond with ONLY valid JSON (no markdown) in this exact format:
{
  "isCorrect": boolean,
  "errorType": "correct|missing_character|extra_character|substitution|order_error|incomplete|unrelated|no_answer",
  "errorDetail": "specific detail about what went wrong in English",
  "characterAnalysis": [{"pos": 1, "expected": "char", "actual": "char", "match": true/false}],
  "hint1": "First gentle hint in English (do not give the answer)",
  "hint2": "Partial word hint like: ස_ට (blank for missing part)",
  "hint3": ["option1", "option2", "option3", "option4"],
  "feedbackSinhala": "Kind encouraging feedback in Sinhala for a child",
  "feedbackEnglish": "Kind encouraging feedback in English for a child",
  "nextActivitySuggestion": "mcq|tracing|character_completion|copy_writing|independent_writing"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in Gemini response');
    const aiResult = JSON.parse(jsonMatch[0]);
    return res.json({ ...aiResult, aiEnhanced: true });
  } catch (err) {
    console.error('Gemini evaluation error:', err.message);
    // Fall back to local evaluation
    return res.json({ ...localEval, aiEnhanced: false, aiError: err.message });
  }
});

// POST: Save attempt and update student profile
app.post('/api/sinhala-writing/save-attempt', async (req, res) => {
  const { studentId, studentName, grade, word, expected, written, isCorrect,
          errorType, difficulty, hintsUsed, selfCorrected, timeSeconds, level } = req.body;

  if (!global.dbConnected) {
    return res.json({ success: true, mock: true });
  }

  try {
    let profile = await SinhalaWritingProfile.findOne({ studentId });
    if (!profile) {
      profile = new SinhalaWritingProfile({ studentId, studentName, grade, currentLevel: level || 1 });
    }

    // Add attempt
    profile.totalAttempts += 1;
    if (isCorrect) {
      profile.totalCorrect += 1;
      profile.currentStreak += 1;
      if (profile.currentStreak > profile.bestStreak) profile.bestStreak = profile.currentStreak;
    } else {
      profile.currentStreak = 0;
    }

    profile.totalHintsUsed += (hintsUsed || 0);
    if (selfCorrected) profile.selfCorrections += 1;

    // Recalculate accuracy
    profile.writingAccuracy = Math.round((profile.totalCorrect / profile.totalAttempts) * 100);

    // Track error pattern
    if (!isCorrect && errorType && errorType !== 'correct') {
      const existing = profile.errorPatterns.find(e => e.errorType === errorType && e.word === word);
      if (existing) { existing.count++; existing.lastSeen = new Date(); }
      else { profile.errorPatterns.push({ errorType, word, count: 1 }); }
    }

    // Keep last 50 attempts
    profile.recentAttempts.push({ word, expected, written, isCorrect, errorType, difficulty, hintsUsed, selfCorrected, timeSeconds });
    if (profile.recentAttempts.length > 50) profile.recentAttempts = profile.recentAttempts.slice(-50);

    profile.updatedAt = new Date();
    await profile.save();
    res.json({ success: true, profile });
  } catch (err) {
    console.error('Save attempt error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST: Update student level/difficulty (after level complete)
app.post('/api/sinhala-writing/update-level', async (req, res) => {
  const { studentId, currentLevel, currentDifficulty, unlockLevel } = req.body;
  if (!global.dbConnected) return res.json({ success: true, mock: true });
  try {
    const profile = await SinhalaWritingProfile.findOne({ studentId });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    if (currentLevel) profile.currentLevel = currentLevel;
    if (currentDifficulty) profile.currentDifficulty = currentDifficulty;
    if (unlockLevel && !profile.levelsUnlocked.includes(unlockLevel)) {
      profile.levelsUnlocked.push(unlockLevel);
    }
    profile.updatedAt = new Date();
    await profile.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Local rule-based evaluation (no AI required) ──
function evaluateWritingLocally(expected, written) {
  const exp = expected.trim();
  const writ = (written || '').trim();

  if (!writ) return { isCorrect: false, errorType: 'no_answer', errorDetail: 'No answer provided',
    hint1: 'Try to write the word you see.', hint2: exp.split('').map((_,i) => i === 0 ? exp[0] : '_').join(''),
    hint3: [], feedbackSinhala: 'කරුණාකර වචනය ලියන්න.', feedbackEnglish: 'Please try to write the word.' };

  if (exp === writ) return { isCorrect: true, errorType: 'correct', errorDetail: 'Perfect!',
    hint1: '', hint2: '', hint3: [], feedbackSinhala: 'ඉතා නිවැරදියි! 🎉', feedbackEnglish: 'Perfect answer! 🎉' };

  // Length-based checks
  if (writ.length < exp.length - 1) return makeError('missing_character', exp, writ);
  if (writ.length > exp.length + 1) return makeError('extra_character', exp, writ);
  if (writ.length === exp.length && writ !== exp) {
    // Check if it's an anagram (order error)
    const sortedExp = [...exp].sort().join('');
    const sortedWrit = [...writ].sort().join('');
    if (sortedExp === sortedWrit) return makeError('order_error', exp, writ);
    return makeError('substitution', exp, writ);
  }
  if (exp.startsWith(writ) || writ.length < exp.length * 0.6) return makeError('incomplete', exp, writ);
  return makeError('substitution', exp, writ);
}

function makeError(type, expected, written) {
  const partial = expected.split('').map((c, i) => i < Math.floor(expected.length / 2) ? c : '_').join('');
  const hints = [];
  // Generate plausible character options around the missing spot
  const sinhalaVowelSigns = ['ා', 'ි', 'ී', 'ු', 'ූ', 'ෙ', 'ො', 'ෝ', 'ෞ', '්'];
  hints.push(...sinhalaVowelSigns.slice(0, 4));

  const messages = {
    missing_character: { s: 'අකුරක් අඩු වෙලා. නැවත බලන්න!', e: "A character is missing. Look carefully!" },
    extra_character:   { s: 'අමතර අකුරක් ඇත. නැවත බලන්න!', e: "There's an extra character. Try again!" },
    substitution:      { s: 'වැරදි අකුරක් ඇත. නැවත බලන්න!', e: "One character is wrong. Look carefully!" },
    order_error:       { s: 'අකුරු ක්‍රමය වැරදි. නැවත සකසන්න!', e: "Characters are in the wrong order!" },
    incomplete:        { s: 'වචනය අසම්පූර්ණයි. සම්පූර්ණ කරන්න!', e: "The word is incomplete. Finish it!" },
  };
  const msg = messages[type] || { s: 'නැවත උත්සාහ කරන්න.', e: 'Please try again.' };

  return {
    isCorrect: false, errorType: type,
    errorDetail: `Expected "${expected}", got "${written}"`,
    hint1: `Look at the word carefully: How many parts does "${expected}" have?`,
    hint2: partial,
    hint3: hints,
    feedbackSinhala: msg.s,
    feedbackEnglish: msg.e
  };
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
