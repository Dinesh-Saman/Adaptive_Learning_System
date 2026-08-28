const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const StudentAnalytics = require('../models/StudentAnalytics');
const Student = require('../models/Student');
const QuestionAttempt = require('../models/QuestionAttempt');

const MOCK_ANALYTICS_PATH = path.join(__dirname, '../data/mock_analytics.json');

// Helper to get default empty structure for a new real student
const createDefaultStudentAnalyticsStructure = (studentId, name, grade) => {
  return {
    studentId: studentId.toString(),
    name: name,
    grade: grade || 'Grade 4',
    avatar: '👦',
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
        { code: 'P3', name: 'Paper Craft & Origami Steps', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
        { code: 'P4', name: 'Story Drawing & Comprehension', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' }
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
  };
};

const getMockAnalytics = () => {
  try {
    if (fs.existsSync(MOCK_ANALYTICS_PATH)) {
      return JSON.parse(fs.readFileSync(MOCK_ANALYTICS_PATH, 'utf8'));
    }
  } catch (err) {
    console.error("Error reading mock analytics:", err);
  }
  return [];
};

const saveMockAnalytics = (data) => {
  try {
    if (!fs.existsSync(path.dirname(MOCK_ANALYTICS_PATH))) {
      fs.mkdirSync(path.dirname(MOCK_ANALYTICS_PATH), { recursive: true });
    }
    fs.writeFileSync(MOCK_ANALYTICS_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error saving mock analytics:", err);
  }
};

// Sync registered students strictly with MongoDB
const syncRegisteredStudents = async () => {
  if (!global.dbConnected) return [];
  try {
    const registeredStudents = await Student.find({});
    const results = [];

    for (const st of registeredStudents) {
      let analytics = await StudentAnalytics.findOne({ 
        $or: [{ studentId: st._id.toString() }, { name: st.name }] 
      });

      if (!analytics) {
        const initData = createDefaultStudentAnalyticsStructure(st._id.toString(), st.name, st.grade);
        analytics = await StudentAnalytics.create(initData);
      }
      results.push(analytics);
    }
    return results;
  } catch (err) {
    console.warn("Sync students analytics error:", err.message);
    return [];
  }
};

// @route   GET /api/analytics/students
// @desc    Get all real registered students' analytics from MongoDB (no fake data)
router.get('/students', async (req, res) => {
  if (!global.dbConnected) {
    const data = getMockAnalytics();
    return res.json({ success: true, source: 'mock_db', students: data });
  }

  try {
    const students = await syncRegisteredStudents();
    return res.json({ success: true, source: 'mongodb', students });
  } catch (err) {
    console.error("Error fetching students analytics from MongoDB:", err);
    return res.json({ success: true, source: 'fallback', students: [] });
  }
});

// @route   GET /api/analytics/student/:studentId
// @desc    Get specific real student analytics from MongoDB
router.get('/student/:studentId', async (req, res) => {
  const { studentId } = req.params;

  if (!global.dbConnected) {
    const data = getMockAnalytics();
    const student = data.find(s => s.studentId === studentId || s.id === studentId || s.name === studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found in database' });
    }
    return res.json({ success: true, source: 'mock_db', student });
  }

  try {
    let student = await StudentAnalytics.findOne({ 
      $or: [{ studentId }, { name: studentId }] 
    });

    if (!student) {
      let regStudent = null;
      if (studentId.match(/^[0-9a-fA-F]{24}$/)) {
        regStudent = await Student.findById(studentId);
      } else {
        regStudent = await Student.findOne({ name: studentId });
      }

      if (regStudent) {
        const initData = createDefaultStudentAnalyticsStructure(regStudent._id.toString(), regStudent.name, regStudent.grade);
        student = await StudentAnalytics.create(initData);
      } else {
        return res.status(404).json({ success: false, message: 'Student not found in database' });
      }
    }

    return res.json({ success: true, source: 'mongodb', student });
  } catch (err) {
    console.error("Error fetching student from MongoDB:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/analytics/record
// @desc    Record actual marks into MongoDB for a student
router.post('/record', async (req, res) => {
  const { 
    studentId, 
    name = '',
    subject = 'sinhala', 
    categoryCode = 'C1', 
    marks = 0, 
    maxMarks = 30,
    week = 'Week 1'
  } = req.body;

  if (!studentId && !name) {
    return res.status(400).json({ success: false, message: 'studentId or name is required' });
  }

  const pct = maxMarks > 0 ? Math.round((marks / maxMarks) * 100) : 0;
  const status = pct >= 85 ? 'Mastered' : pct >= 70 ? 'Proficient' : pct >= 60 ? 'Developing' : 'Attention Needed';

  if (!global.dbConnected) {
    const data = getMockAnalytics();
    let sIdx = data.findIndex(s => s.studentId === studentId || (name && s.name === name));
    if (sIdx === -1) {
      const newSt = createDefaultStudentAnalyticsStructure(studentId || Date.now().toString(), name || 'Student', 'Grade 4');
      data.push(newSt);
      sIdx = data.length - 1;
    }
    data[sIdx].totalExercises = (data[sIdx].totalExercises || 0) + 1;
    if (data[sIdx].categoryMarks && data[sIdx].categoryMarks[subject]) {
      const cIdx = data[sIdx].categoryMarks[subject].findIndex(c => c.code === categoryCode);
      if (cIdx !== -1) {
        data[sIdx].categoryMarks[subject][cIdx].marks = marks;
        data[sIdx].categoryMarks[subject][cIdx].maxMarks = maxMarks;
        data[sIdx].categoryMarks[subject][cIdx].pct = pct;
        data[sIdx].categoryMarks[subject][cIdx].status = status;
      }
    }
    saveMockAnalytics(data);
    return res.json({ success: true, source: 'mock_db', message: 'Score recorded' });
  }

  try {
    let student = await StudentAnalytics.findOne({ 
      $or: [
        ...(studentId ? [{ studentId }] : []),
        ...(name ? [{ name }] : [])
      ] 
    });

    if (!student) {
      const initData = createDefaultStudentAnalyticsStructure(studentId || Date.now().toString(), name || 'Student', 'Grade 4');
      student = new StudentAnalytics(initData);
    }

    student.totalExercises = (student.totalExercises || 0) + 1;
    if (student.categoryMarks && student.categoryMarks[subject]) {
      const cat = student.categoryMarks[subject].find(c => c.code === categoryCode);
      if (cat) {
        cat.marks = marks;
        cat.maxMarks = maxMarks;
        cat.pct = pct;
        cat.status = status;
      }
    }

    // Recalculate overall average
    let totalPct = 0;
    let countCat = 0;
    ['math', 'sinhala', 'english', 'preschool'].forEach(sKey => {
      if (student.categoryMarks && student.categoryMarks[sKey]) {
        student.categoryMarks[sKey].forEach(c => {
          if (c.pct > 0) {
            totalPct += c.pct;
            countCat += 1;
          }
        });
      }
    });
    student.overallAverage = countCat > 0 ? Math.round(totalPct / countCat) : 0;
    student.lastUpdated = new Date();
    await student.save();

    return res.json({ success: true, source: 'mongodb', message: 'Score recorded in MongoDB', student });
  } catch (err) {
    console.error("Error saving score to MongoDB:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});


// @route   GET /api/analytics/student/:studentId/attempts
// @desc    Get real question attempts history for a student
router.get('/student/:studentId/attempts', async (req, res) => {
  const { studentId } = req.params;
  const { module } = req.query;

  if (!global.dbConnected) {
    return res.json({ success: true, source: 'mock_db', attempts: [] });
  }

  try {
    const query = {};
    if (studentId.match(/^[0-9a-fA-F]{24}$/)) {
      query.studentId = studentId;
    }
    if (module) {
      query.module = module;
    }

    const attempts = await QuestionAttempt.find(query).sort({ timestamp: -1 }).limit(100);
    return res.json({ success: true, source: 'mongodb', attempts });
  } catch (err) {
    console.error("Error fetching question attempts:", err);
    return res.json({ success: true, source: 'fallback', attempts: [] });
  }
});

module.exports = router;

