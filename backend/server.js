require('dotenv').config({ override: true });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares ──
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ── MongoDB Connection ──
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

// ── Health Check Route ──
app.get('/', (req, res) => {
  res.send('AI Adaptive Learning Platform API Gateway is running');
});

// ── Pillar 0: Authentication & User Management ──
app.use('/api/auth', require('./routes/auth'));

// ── Pillar 1: Mathematics (Grade 2, 3, 4 Hubs) ──
app.use('/api/math', require('./routes/math'));

// ── Pillar 2: English Speech & Pronunciation ──
app.use('/api/english', require('./routes/english'));

// ── Pillar 3: Pre-School & Grade 1 (Motor & Creative Skills) ──
const preschoolRouter = require('./routes/preschool');
app.use('/api/preschool', preschoolRouter);
app.use('/api/motor', preschoolRouter);
app.use('/api/creative', preschoolRouter);
app.use('/api/papercraft', preschoolRouter);

// ── Pillar 4: Sinhala Language & Handwriting (Grade 2, 3, 4 Hubs) ──
const sinhalaRouter = require('./routes/sinhala');
app.use('/api/sinhala', sinhalaRouter);
app.use('/api/ai/handwriting', sinhalaRouter);

// ── Multi-Subject Longitudinal Analytics & Progress Intelligence ──
app.use('/api/analytics', require('./routes/analytics'));

// ── Native Sinhala Text-to-Speech Streaming ──
app.use('/api/tts', require('./routes/tts'));

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`🚀 AI Adaptive Learning API Server is running on port ${PORT}`);
});
