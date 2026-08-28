const express = require('express');
const router = express.Router();
const QuestionAttempt = require('../models/QuestionAttempt');
const Student = require('../models/Student');

const PYTHON_AI_URL = process.env.PYTHON_AI_URL || 'http://127.0.0.1:8000';

// ── 1. Longitudinal Adaptive Paper Generation (Paper 1-5 with Hard Duplicate Exclusion) ──
router.post('/generate-paper', async (req, res) => {
  const { studentId, grade = 2, paperNumber = 1, paperSize = 20, clientAnsweredIds = [] } = req.body;

  try {
    let answeredIds = new Set(clientAnsweredIds);

    // If database is connected, fetch all historic question IDs for this student
    if (global.dbConnected && studentId && studentId.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const pastAttempts = await QuestionAttempt.find({
          studentId,
          module: 'math',
          grade
        }).select('questionId');
        pastAttempts.forEach(a => answeredIds.add(a.questionId));
      } catch (dbErr) {
        console.warn('DB lookup warning in /generate-paper:', dbErr.message);
      }
    }

    // Call Python AI Adaptive Paper Generator
    const aiResponse = await fetch(`${PYTHON_AI_URL}/api/ai/math/generate-paper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId || "student_demo",
        grade: parseInt(grade, 10),
        paper_number: parseInt(paperNumber, 10),
        answered_question_ids: Array.from(answeredIds),
        paper_size: parseInt(paperSize, 10)
      })
    });

    if (aiResponse.ok) {
      const paperData = await aiResponse.json();
      return res.json(paperData);
    } else {
      const errText = await aiResponse.text();
      console.error('Python AI generate-paper error:', errText);
      return res.status(aiResponse.status).json({ error: errText });
    }
  } catch (error) {
    console.error('Error in /api/math/generate-paper:', error);
    return res.status(500).json({ error: 'Failed to generate adaptive paper: ' + error.message });
  }
});

// ── 2. Record Question Attempts & Update Student Question History ──
router.post('/record-attempt', async (req, res) => {
  const { 
    studentId, 
    paperNumber = 1, 
    grade = 2, 
    attempts = [] // Array of { questionId, skillId, difficultyTier, studentAnswer, isCorrect, responseTimeMs, misconception }
  } = req.body;

  if (!attempts || attempts.length === 0) {
    return res.status(400).json({ error: 'No attempts provided to record' });
  }

  try {
    if (global.dbConnected && studentId && studentId.match(/^[0-9a-fA-F]{24}$/)) {
      const recordsToInsert = attempts.map(att => ({
        studentId,
        paperNumber,
        grade,
        module: 'math',
        questionId: att.questionId,
        skillId: att.skillId,
        difficultyTier: att.difficultyTier || 1,
        studentAnswer: att.studentAnswer || '',
        correctAnswer: att.correctAnswer || '',
        isCorrect: Boolean(att.isCorrect),
        responseTimeMs: att.responseTimeMs || 0,
        misconception: att.misconception || null
      }));

      await QuestionAttempt.insertMany(recordsToInsert);
    }

    return res.json({
      success: true,
      recorded_count: attempts.length,
      message: `Successfully recorded ${attempts.length} attempts. Questions are now permanently excluded for future papers.`
    });
  } catch (error) {
    console.error('Error in /api/math/record-attempt:', error);
    return res.status(500).json({ error: 'Failed to record attempt: ' + error.message });
  }
});

// ── 3. Fetch Student Answered History ──
router.get('/history/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { grade = 2 } = req.query;

  try {
    if (global.dbConnected && studentId && studentId.match(/^[0-9a-fA-F]{24}$/)) {
      const attempts = await QuestionAttempt.find({ studentId, module: 'math', grade })
        .sort({ timestamp: -1 });

      const answeredIds = Array.from(new Set(attempts.map(a => a.questionId)));
      return res.json({
        studentId,
        grade: parseInt(grade, 10),
        total_attempts: attempts.length,
        unique_answered_question_ids: answeredIds,
        history: attempts
      });
    }

    return res.json({
      studentId,
      grade: parseInt(grade, 10),
      total_attempts: 0,
      unique_answered_question_ids: [],
      history: []
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ── 4. Item-by-item Next-Question & Adaptive Evaluation ──
router.post('/next-question', async (req, res) => {
  const { studentId, lastQuestionCorrect, responseTimeMs, confusionIndicator, attentionIndicator, grade, domain, difficulty } = req.body;
  
  try {
    const aiResponse = await fetch(`${PYTHON_AI_URL}/api/ai/math/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId || "test_user",
        last_correct: lastQuestionCorrect || false,
        response_time_ms: responseTimeMs || 5000,
        camera_attention_score: attentionIndicator || 0.8,
        camera_frustration_score: confusionIndicator || 0.2,
        grade: grade || 2,
        domain: domain || "Numbers",
        difficulty: difficulty || "Medium"
      })
    });

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      
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
        aiReasoning: aiData.reasoning,
        masteryLevel: aiData.mastery_level || 0.5
      });
    }
  } catch (error) {
    console.log("Python AI server unreachable, falling back to mock Node.js logic.");
  }

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
    aiReasoning: reasoning,
    masteryLevel: 0.5
  });
});

module.exports = router;
