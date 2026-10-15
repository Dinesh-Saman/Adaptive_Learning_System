require('dotenv').config({ override: true });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');

// Resolve MongoDB Atlas cluster DNS reliably even if local ISP DNS is slow/cold on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where custom DNS servers cannot be set
}

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares ──
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ── MongoDB Connection with Auto-Retry ──
global.dbConnected = false;

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/adaptive_learning_db';
const isAtlas = mongoUri.includes('mongodb.net') || mongoUri.includes('mongodb+srv');

const mongooseOptions = {
  serverSelectionTimeoutMS: isAtlas ? 30000 : 5000, // 30s for Atlas cluster replica set discovery, 5s if local
  connectTimeoutMS: 20000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
};

let retryTimer = null;
const connectWithRetry = async (attempt = 1) => {
  try {
    await mongoose.connect(mongoUri, mongooseOptions);
    console.log('✅ Connected to MongoDB successfully');
    global.dbConnected = true;
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  } catch (err) {
    global.dbConnected = false;
    console.warn(`⚠️ MongoDB Connection Attempt ${attempt} Failed: ${err.message}`);
    const nextWait = Math.min(attempt * 2000, 10000);
    console.log(`🔄 Retrying MongoDB connection in ${nextWait / 1000}s (attempt ${attempt + 1})...`);
    retryTimer = setTimeout(() => connectWithRetry(attempt + 1), nextWait);
  }
};

connectWithRetry();

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected.');
  global.dbConnected = false;
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ Reconnected to MongoDB successfully');
  global.dbConnected = true;
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
