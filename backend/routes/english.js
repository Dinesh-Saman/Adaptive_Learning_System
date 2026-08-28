const express = require('express');
const router = express.Router();

const PYTHON_AI_URL = process.env.PYTHON_AI_URL || 'http://127.0.0.1:8000';

// ── English Pronunciation & Speech Assessment Endpoint ──
router.post('/assess', async (req, res) => {
  console.log("--> Received request on /api/english/assess");
  const { studentId, audioBase64, targetText, videoFramesBase64 } = req.body;

  try {
    const aiResponse = await fetch(`${PYTHON_AI_URL}/api/ai/english/pronunciation`, {
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

module.exports = router;
