const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const StudentAnalytics = require('../models/StudentAnalytics');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev';
const MOCK_DB_PATH = path.join(__dirname, '../data/mock_db.json');

// Helper to get/set mock DB data
const getMockDb = () => {
  try {
    if (!fs.existsSync(path.dirname(MOCK_DB_PATH))) {
      fs.mkdirSync(path.dirname(MOCK_DB_PATH), { recursive: true });
    }
    if (!fs.existsSync(MOCK_DB_PATH)) {
      fs.writeFileSync(MOCK_DB_PATH, JSON.stringify({ students: [], teachers: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(MOCK_DB_PATH, 'utf8'));
  } catch (err) {
    console.error("Error reading mock DB:", err);
    return { students: [], teachers: [] };
  }
};

const saveMockDb = (data) => {
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to mock DB:", err);
  }
};

// @route   POST /api/auth/forgot-password
// @desc    Reset password for a student or teacher (works in both Mongo and Mock mode)
router.post('/forgot-password', async (req, res) => {
  const { name, role, newPassword } = req.body;
  const isTeacher = role === 'teacher';

  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ message: 'Password must be at least 4 characters long.' });
  }

  // Fallback Mock DB mode
  if (!global.dbConnected) {
    const db = getMockDb();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (isTeacher) {
      const idx = db.teachers.findIndex(t => t.name.toLowerCase() === name.toLowerCase());
      if (idx === -1) {
        return res.status(404).json({ message: 'Teacher name not found.' });
      }
      db.teachers[idx].password = hashedPassword;
    } else {
      const idx = db.students.findIndex(s => s.name.toLowerCase() === name.toLowerCase());
      if (idx === -1) {
        return res.status(404).json({ message: 'Student name not found.' });
      }
      db.students[idx].password = hashedPassword;
    }

    saveMockDb(db);
    return res.json({ message: 'Password reset successful. You can now login with your new password.' });
  }

  // Real MongoDB Mode
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (isTeacher) {
      let teacher = await Teacher.findOne({ name });
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher name not found.' });
      }
      teacher.password = hashedPassword;
      await teacher.save();
    } else {
      let student = await Student.findOne({ name });
      if (!student) {
        return res.status(404).json({ message: 'Student name not found.' });
      }
      student.password = hashedPassword;
      await student.save();
    }

    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/register
// @desc    Register a new student or teacher
router.post('/register', async (req, res) => {
  const { name, grade, password, role } = req.body;
  const isTeacher = role === 'teacher';

  if (!name || !password) {
    return res.status(400).json({ message: 'Please provide both name and password.' });
  }

  // Fallback Mock DB mode
  if (!global.dbConnected) {
    const db = getMockDb();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (isTeacher) {
      const exists = db.teachers.some(t => t.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        return res.status(400).json({ message: 'Teacher name already exists.' });
      }
      const newTeacher = {
        id: 'mock-t-' + Date.now(),
        name,
        password: hashedPassword,
        role: 'teacher'
      };
      db.teachers.push(newTeacher);
      saveMockDb(db);

      const token = jwt.sign({ userId: newTeacher.id, role: 'teacher' }, JWT_SECRET, { expiresIn: '10h' });
      return res.status(201).json({ token, userId: newTeacher.id, name: newTeacher.name, role: 'teacher' });
    } else {
      const exists = db.students.some(s => s.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        return res.status(400).json({ message: 'Student name already exists. Please pick a unique name.' });
      }
      const newStudent = {
        id: 'mock-s-' + Date.now(),
        name,
        grade: grade || 'Grade 1',
        password: hashedPassword,
        role: 'student',
        masteryLevels: { math: 0.5, english: 0.5, sinhala: 0.5, motorSkills: 0.5 }
      };
      db.students.push(newStudent);
      saveMockDb(db);

      const token = jwt.sign({ userId: newStudent.id, role: 'student' }, JWT_SECRET, { expiresIn: '10h' });
      return res.status(201).json({ token, userId: newStudent.id, name: newStudent.name, role: 'student', masteryLevels: newStudent.masteryLevels });
    }
  }

  // Real MongoDB Mode
  try {
    if (isTeacher) {
      let teacher = await Teacher.findOne({ name });
      if (teacher) {
        return res.status(400).json({ message: 'Teacher name already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      teacher = new Teacher({
        name,
        password: hashedPassword
      });

      await teacher.save();

      const payload = { userId: teacher._id, role: 'teacher' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10h' });

      res.status(201).json({ token, userId: teacher._id, name: teacher.name, role: 'teacher' });
    } else {
      let student = await Student.findOne({ name });
      if (student) {
        return res.status(400).json({ message: 'Student name already exists. Please pick a unique name or add an initial.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      student = new Student({
        name,
        grade: grade || 'Grade 1',
        password: hashedPassword
      });

      await student.save();

      const payload = { userId: student._id, role: 'student' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10h' });

      // Ensure initial analytics record exists in MongoDB
      try {
        const existingAnalytics = await StudentAnalytics.findOne({ studentId: student._id.toString() });
        if (!existingAnalytics) {
          await StudentAnalytics.create({
            studentId: student._id.toString(),
            name: student.name,
            grade: student.grade || 'Grade 4',
            attendance: '100%',
            totalExercises: 0,
            overallAverage: 0,
            weeklyProgress: [],
            categoryMarks: {
              math: [
                { code: 'M1', name: '100 දක්වා සංඛ්‍යා', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
                { code: 'M2', name: 'එකතු කිරීම් හා අඩු කිරීම්', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
                { code: 'M3', name: 'ගුණ කිරීම හා බෙදීම', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
                { code: 'M4', name: 'මිනුම් හා හැඩතල', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' }
              ],
              sinhala: [
                { code: 'C1', name: 'සමාන පද හා අර්ථ', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
                { code: 'C2', name: 'විරුද්ධ පද', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
                { code: 'C3', name: 'ප්‍රස්තාව පිරුළු / ඉඟි වැකි', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
                { code: 'C4', name: 'කාලය හා ව්‍යාකරණ', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
                { code: 'C5', name: 'කියවීම හා විරාම ලක්ෂණ', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' }
              ],
              english: [
                { code: 'E1', name: 'Phoneme Clarity & Articulation', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
                { code: 'E2', name: 'Pronunciation Accuracy', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
                { code: 'E3', name: 'Word Stress & Intonation', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
                { code: 'E4', name: 'Speaking Fluency & Speed', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' }
              ],
              preschool: [
                { code: 'P1', name: 'Line Tracing & Fine Motor', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
                { code: 'P2', name: 'Digital Coloring & Boundaries', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
                { code: 'P3', name: 'Story Drawing & Comprehension', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' }
              ]
            },
            recommendation: {
              subjectId: 'sinhala',
              subjectName: 'සිංහල භාෂාව (Sinhala)',
              categoryCode: 'C1',
              categoryName: 'සමාන පද හා අර්ථ',
              reason: 'ඇගයීම් අභ්‍යාස සම්පූර්ණ කර ඔබේ පළමු ඉගෙනුම් වාර්තාව ලබා ගන්න.',
              actionTitle: 'Start First Assessment Module',
              actionUrl: '/module/sinhala/grade4',
              priority: 'Initial Assessment ⭐'
            }
          });
        }
      } catch (err) {
        console.warn("Analytics creation error on register:", err.message);
      }

      res.status(201).json({ token, userId: student._id, studentId: student._id, name: student.name, grade: student.grade, role: 'student', masteryLevels: student.masteryLevels });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate student or teacher & get token
router.post('/login', async (req, res) => {
  const { name, password, role } = req.body;
  const isTeacher = role === 'teacher';

  if (!name || !password) {
    return res.status(400).json({ message: 'Please provide both name and password.' });
  }

  // Fallback Mock DB mode
  if (!global.dbConnected) {
    const db = getMockDb();
    if (isTeacher) {
      const teacher = db.teachers.find(t => t.name.toLowerCase() === name.toLowerCase());
      if (!teacher) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, teacher.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const token = jwt.sign({ userId: teacher.id, role: 'teacher' }, JWT_SECRET, { expiresIn: '10h' });
      return res.json({ token, userId: teacher.id, name: teacher.name, role: 'teacher' });
    } else {
      const student = db.students.find(s => s.name.toLowerCase() === name.toLowerCase());
      if (!student) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const token = jwt.sign({ userId: student.id, role: 'student' }, JWT_SECRET, { expiresIn: '10h' });
      return res.json({ token, userId: student.id, name: student.name, role: 'student', masteryLevels: student.masteryLevels });
    }
  }

  // Real MongoDB Mode
  try {
    if (isTeacher) {
      let teacher = await Teacher.findOne({ name });
      if (!teacher) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, teacher.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const payload = { userId: teacher._id, role: 'teacher' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10h' });

      res.json({ token, userId: teacher._id, name: teacher.name, role: 'teacher' });
    } else {
      let student = await Student.findOne({ name });
      if (!student) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const payload = { userId: student._id, role: 'student' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10h' });

      res.json({ token, userId: student._id, studentId: student._id, name: student.name, grade: student.grade, role: 'student', masteryLevels: student.masteryLevels });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/auth/profile
// @desc    Get logged in user profile
router.get('/profile', async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!global.dbConnected) {
      const db = getMockDb();
      if (decoded.role === 'teacher') {
        const teacher = db.teachers.find(t => t.id === decoded.userId);
        return res.json({ id: teacher.id, name: teacher.name, role: 'teacher' });
      } else {
        const student = db.students.find(s => s.id === decoded.userId);
        return res.json({ id: student.id, name: student.name, role: 'student', masteryLevels: student.masteryLevels });
      }
    }

    if (decoded.role === 'teacher') {
      const teacher = await Teacher.findById(decoded.userId).select('-password');
      res.json({ ...teacher.toObject(), role: 'teacher' });
    } else {
      const student = await Student.findById(decoded.userId).select('-password');
      res.json({ ...student.toObject(), role: 'student' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
});

module.exports = router;
