const express = require('express');
const router = express.Router();
const https = require('https');

// GET /api/tts/sinhala?text=...
router.get('/sinhala', (req, res) => {
  const text = (req.query.text || '').trim();
  if (!text) {
    return res.status(400).json({ error: 'Text query parameter is required' });
  }

  const encoded = encodeURIComponent(text.substring(0, 300));
  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=si&client=tw-ob&q=${encoded}`;

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://translate.google.com/'
    }
  };

  https.get(googleTtsUrl, options, (stream) => {
    if (stream.statusCode !== 200) {
      return res.status(stream.statusCode).json({ error: 'TTS upstream error' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    stream.pipe(res);
  }).on('error', (err) => {
    console.error('Sinhala TTS Proxy Error:', err.message);
    res.status(500).json({ error: 'Failed to generate Sinhala audio' });
  });
});

module.exports = router;
