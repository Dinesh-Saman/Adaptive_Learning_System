const express = require('express');
const router = express.Router();
const https = require('https');

// In-memory cache for Sinhala TTS audio chunks (key: text -> Buffer)
const ttsCache = new Map();

// Helper to serve audio with HTTP Range support for HTML5 <audio> players
function sendAudioResponse(req, res, buffer) {
  const total = buffer.length;
  const range = req.headers.range;

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'public, max-age=86400');

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

    if (start >= total || end >= total || start > end) {
      res.setHeader('Content-Range', `bytes */${total}`);
      return res.status(416).end();
    }

    const chunksize = (end - start) + 1;
    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
    res.setHeader('Content-Length', chunksize);
    res.end(buffer.subarray(start, end + 1));
  } else {
    res.setHeader('Content-Length', total);
    res.status(200);
    res.end(buffer);
  }
}

// GET /api/tts/sinhala?text=...
router.get('/sinhala', (req, res) => {
  const rawText = (req.query.text || '').trim();
  console.log(`[TTS] Speaking request received: "${rawText.substring(0, 40)}"`);
  if (!rawText) {
    return res.status(400).json({ error: 'Text query parameter is required' });
  }

  // Normalize text: clean quotes and excess whitespace
  const cleanText = rawText
    .replace(/[“”"']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 300);

  const cacheKey = cleanText;

  // Serve from cache if available
  if (ttsCache.has(cacheKey)) {
    const cachedBuffer = ttsCache.get(cacheKey);
    return sendAudioResponse(req, res, cachedBuffer);
  }

  const encoded = encodeURIComponent(cleanText);
  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=si&client=tw-ob&q=${encoded}`;

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://translate.google.com/'
    }
  };

  https.get(googleTtsUrl, options, (stream) => {
    if (stream.statusCode !== 200) {
      console.warn(`[TTS] Upstream status ${stream.statusCode} for: "${cleanText.substring(0, 35)}..."`);
      return res.status(stream.statusCode).json({ error: 'TTS upstream error' });
    }

    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      if (buffer.length > 0) {
        ttsCache.set(cacheKey, buffer);
        sendAudioResponse(req, res, buffer);
      } else {
        console.error('[TTS] Received empty audio buffer');
        res.status(500).json({ error: 'Empty audio buffer received' });
      }
    });
    stream.on('error', (err) => {
      console.error('[TTS] Stream read error:', err.message);
      res.status(500).json({ error: 'Failed to read TTS stream' });
    });
  }).on('error', (err) => {
    console.error('[TTS] Proxy request error:', err.message);
    res.status(500).json({ error: 'Failed to generate Sinhala audio' });
  });
});

module.exports = router;
