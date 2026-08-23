const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev';

// @route   POST /api/auth/register
// @desc    Register a new student
router.post('/register', async (req, res) => {
  const { name, grade, password } = req.body;

  if (!global.dbConnected) {
    const token = jwt.sign({ studentId: 'mock-id-123' }, JWT_SECRET, { expiresIn: '10h' });
    return res.status(201).json({ token, studentId: 'mock-id-123', name: name || 'MockStudent' });
  }

  try {
    // Check if student exists (usually by an ID/Email, but we are using name for this kids app)
    let student = await Student.findOne({ name });
    if (student) {
      return res.status(400).json({ message: 'Student name already exists. Please pick a unique name or add an initial.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    student = new Student({
      name,
      grade,
      password: hashedPassword
    });

    await student.save();

    // Create JWT
    const payload = { studentId: student._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10h' });

    res.status(201).json({ token, studentId: student._id, name: student.name });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate student & get token
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  if (!global.dbConnected) {
    const token = jwt.sign({ studentId: 'mock-id-123' }, JWT_SECRET, { expiresIn: '10h' });
    return res.json({ token, studentId: 'mock-id-123', name: name || 'MockStudent', masteryLevels: { math: 0.8, english: 0.6, sinhala: 0.9, motorSkills: 0.4 } });
  }

  try {
    let student = await Student.findOne({ name });
    if (!student) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { studentId: student._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10h' });

    res.json({ token, studentId: student._id, name: student.name, masteryLevels: student.masteryLevels });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/auth/profile
// @desc    Get logged in student profile
router.get('/profile', async (req, res) => {
  // Simple middleware check inline for brevity
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const student = await Student.findById(decoded.studentId).select('-password');
    res.json(student);
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
});

module.exports = router;
