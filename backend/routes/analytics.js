const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const StudentAnalytics = require('../models/StudentAnalytics');

const MOCK_ANALYTICS_PATH = path.join(__dirname, '../data/mock_analytics.json');

// Default Seed Data
const DEFAULT_STUDENTS_SEED = [
  {
    studentId: 'std_001',
    name: 'කසුන් පෙරේරා (Kasun Perera)',
    grade: 'Grade 4',
    avatar: '👦',
    attendance: '96%',
    totalExercises: 142,
    overallAverage: 82.5,
    weeklyProgress: [
      { week: 'Week 1', math: 70, sinhala: 65, english: 72, preschool: 88, average: 73.8 },
      { week: 'Week 2', math: 74, sinhala: 70, english: 75, preschool: 90, average: 77.3 },
      { week: 'Week 3', math: 78, sinhala: 72, english: 78, preschool: 92, average: 80.0 },
      { week: 'Week 4', math: 82, sinhala: 78, english: 80, preschool: 94, average: 83.5 },
      { week: 'Week 5', math: 86, sinhala: 84, english: 82, preschool: 95, average: 86.8 },
      { week: 'Week 6', math: 90, sinhala: 88, english: 85, preschool: 96, average: 89.8 }
    ],
    categoryMarks: {
      math: [
        { code: 'M1', name: '100 දක්වා සංඛ්‍යා', marks: 28, maxMarks: 30, pct: 93, status: 'Mastered' },
        { code: 'M2', name: 'එකතු කිරීම් හා අඩු කිරීම්', marks: 26, maxMarks: 30, pct: 87, status: 'Mastered' },
        { code: 'M3', name: 'ගුණ කිරීම හා බෙදීම', marks: 22, maxMarks: 30, pct: 73, status: 'Developing' },
        { code: 'M4', name: 'මිනුම් හා හැඩතල', marks: 27, maxMarks: 30, pct: 90, status: 'Mastered' }
      ],
      sinhala: [
        { code: 'C1', name: 'සමාන පද හා අර්ථ', marks: 27, maxMarks: 30, pct: 90, status: 'Mastered' },
        { code: 'C2', name: 'විරුද්ධ පද', marks: 28, maxMarks: 30, pct: 93, status: 'Mastered' },
        { code: 'C3', name: 'ප්‍රස්තාව පිරුළු / ඉඟි වැකි', marks: 25, maxMarks: 30, pct: 83, status: 'Proficient' },
        { code: 'C4', name: 'කාලය හා ව්‍යාකරණ', marks: 19, maxMarks: 30, pct: 63, status: 'Attention Needed' },
        { code: 'C5', name: 'කියවීම හා විරාම ලක්ෂණ', marks: 26, maxMarks: 30, pct: 87, status: 'Mastered' }
      ],
      english: [
        { code: 'E1', name: 'Phoneme Clarity & Articulation', marks: 26, maxMarks: 30, pct: 87, status: 'Mastered' },
        { code: 'E2', name: 'Pronunciation Accuracy', marks: 24, maxMarks: 30, pct: 80, status: 'Proficient' },
        { code: 'E3', name: 'Word Stress & Intonation', marks: 22, maxMarks: 30, pct: 73, status: 'Developing' },
        { code: 'E4', name: 'Speaking Fluency & Speed', marks: 25, maxMarks: 30, pct: 83, status: 'Proficient' }
      ],
      preschool: [
        { code: 'P1', name: 'Line Tracing & Fine Motor', marks: 29, maxMarks: 30, pct: 97, status: 'Mastered' },
        { code: 'P2', name: 'Digital Coloring & Boundaries', marks: 28, maxMarks: 30, pct: 93, status: 'Mastered' },
        { code: 'P3', name: 'Paper Craft & Origami Steps', marks: 27, maxMarks: 30, pct: 90, status: 'Mastered' },
        { code: 'P4', name: 'Story Drawing & Comprehension', marks: 28, maxMarks: 30, pct: 93, status: 'Mastered' }
      ]
    },
    recommendation: {
      subjectId: 'sinhala',
      subjectName: 'සිංහල භාෂාව (Sinhala)',
      categoryCode: 'C4',
      categoryName: 'කාලය හා ව්‍යාකරණ (Grammar, Tenses & Spelling)',
      reason: 'C4 කාණ්ඩයේ ලකුණු ප්‍රතිශතය 63% ක් වන අතර වර්‍තමාන/අතීත කාල ආඛ්‍යාත සහ ණ/න, ළ/ල අක්ෂර වින්‍යාසය තවදුරටත් පුහුණු විය යුතුය.',
      actionTitle: 'Grade 4 Sinhala C4 Adaptive Remedial Exercise',
      actionUrl: '/module/sinhala/grade4',
      priority: 'High Priority ⭐'
    }
  },
  {
    studentId: 'std_002',
    name: 'දිනිති සිල්වා (Dinithi Silva)',
    grade: 'Grade 3',
    avatar: '👧',
    attendance: '98%',
    totalExercises: 128,
    overallAverage: 88.2,
    weeklyProgress: [
      { week: 'Week 1', math: 80, sinhala: 85, english: 75, preschool: 92, average: 83.0 },
      { week: 'Week 2', math: 82, sinhala: 86, english: 78, preschool: 93, average: 84.8 },
      { week: 'Week 3', math: 85, sinhala: 88, english: 80, preschool: 95, average: 87.0 },
      { week: 'Week 4', math: 87, sinhala: 90, english: 82, preschool: 95, average: 88.5 },
      { week: 'Week 5', math: 89, sinhala: 92, english: 84, preschool: 96, average: 90.3 },
      { week: 'Week 6', math: 92, sinhala: 95, english: 86, preschool: 98, average: 92.8 }
    ],
    categoryMarks: {
      math: [
        { code: 'M1', name: '100 දක්වා සංඛ්‍යා', marks: 29, maxMarks: 30, pct: 97, status: 'Mastered' },
        { code: 'M2', name: 'එකතු කිරීම් හා අඩු කිරීම්', marks: 28, maxMarks: 30, pct: 93, status: 'Mastered' },
        { code: 'M3', name: 'ගුණ කිරීම හා බෙදීම', marks: 24, maxMarks: 30, pct: 80, status: 'Proficient' },
        { code: 'M4', name: 'මිනුම් හා හැඩතල', marks: 27, maxMarks: 30, pct: 90, status: 'Mastered' }
      ],
      sinhala: [
        { code: 'C1', name: 'සමාන පද හා අර්ථ', marks: 29, maxMarks: 30, pct: 97, status: 'Mastered' },
        { code: 'C2', name: 'විරුද්ධ පද', marks: 29, maxMarks: 30, pct: 97, status: 'Mastered' },
        { code: 'C3', name: 'ප්‍රස්තාව පිරුළු / ඉඟි වැකි', marks: 28, maxMarks: 30, pct: 93, status: 'Mastered' },
        { code: 'C4', name: 'කාලය හා ව්‍යාකරණ', marks: 27, maxMarks: 30, pct: 90, status: 'Mastered' },
        { code: 'C5', name: 'කියවීම හා විරාම ලක්ෂණ', marks: 29, maxMarks: 30, pct: 97, status: 'Mastered' }
      ],
      english: [
        { code: 'E1', name: 'Phoneme Clarity & Articulation', marks: 27, maxMarks: 30, pct: 90, status: 'Mastered' },
        { code: 'E2', name: 'Pronunciation Accuracy', marks: 25, maxMarks: 30, pct: 83, status: 'Proficient' },
        { code: 'E3', name: 'Word Stress & Intonation', marks: 21, maxMarks: 30, pct: 70, status: 'Developing' },
        { code: 'E4', name: 'Speaking Fluency & Speed', marks: 26, maxMarks: 30, pct: 87, status: 'Mastered' }
      ],
      preschool: [
        { code: 'P1', name: 'Line Tracing & Fine Motor', marks: 30, maxMarks: 30, pct: 100, status: 'Mastered' },
        { code: 'P2', name: 'Digital Coloring & Boundaries', marks: 29, maxMarks: 30, pct: 97, status: 'Mastered' },
        { code: 'P3', name: 'Paper Craft & Origami Steps', marks: 29, maxMarks: 30, pct: 97, status: 'Mastered' },
        { code: 'P4', name: 'Story Drawing & Comprehension', marks: 29, maxMarks: 30, pct: 97, status: 'Mastered' }
      ]
    },
    recommendation: {
      subjectId: 'english',
      subjectName: 'English Speech',
      categoryCode: 'E3',
      categoryName: 'Word Stress & Intonation',
      reason: 'E3 Intonation කුසලතාවය 70% මට්ටමේ පවතින අතර ස්වර භේද හා වාක්‍ය උච්චාරණ පුහුණුව මඟින් තවදුරටත් චතුරතාව ඉහළ නැංවිය හැක.',
      actionTitle: 'English Speech Intonation Practice Hub',
      actionUrl: '/module/english',
      priority: 'Medium Priority 🎯'
    }
  },
  {
    studentId: 'std_003',
    name: 'සහන් ජයවර්ධන (Sahan Jayawardena)',
    grade: 'Grade 2',
    avatar: '👦',
    attendance: '92%',
    totalExercises: 110,
    overallAverage: 76.4,
    weeklyProgress: [
      { week: 'Week 1', math: 62, sinhala: 68, english: 60, preschool: 82, average: 68.0 },
      { week: 'Week 2', math: 66, sinhala: 72, english: 65, preschool: 85, average: 72.0 },
      { week: 'Week 3', math: 70, sinhala: 75, english: 68, preschool: 88, average: 75.3 },
      { week: 'Week 4', math: 72, sinhala: 78, english: 70, preschool: 90, average: 77.5 },
      { week: 'Week 5', math: 75, sinhala: 82, english: 72, preschool: 91, average: 80.0 },
      { week: 'Week 6', math: 78, sinhala: 85, english: 74, preschool: 92, average: 82.3 }
    ],
    categoryMarks: {
      math: [
        { code: 'M1', name: '100 දක්වා සංඛ්‍යා', marks: 25, maxMarks: 30, pct: 83, status: 'Proficient' },
        { code: 'M2', name: 'එකතු කිරීම් හා අඩු කිරීම්', marks: 19, maxMarks: 30, pct: 63, status: 'Attention Needed' },
        { code: 'M3', name: 'ගුණ කිරීම හා බෙදීම', marks: 18, maxMarks: 30, pct: 60, status: 'Attention Needed' },
        { code: 'M4', name: 'මිනුම් හා හැඩතල', marks: 26, maxMarks: 30, pct: 87, status: 'Mastered' }
      ],
      sinhala: [
        { code: 'C1', name: 'සමාන පද හා අර්ථ', marks: 26, maxMarks: 30, pct: 87, status: 'Mastered' },
        { code: 'C2', name: 'විරුද්ධ පද', marks: 27, maxMarks: 30, pct: 90, status: 'Mastered' },
        { code: 'C3', name: 'ප්‍රස්තාව පිරුළු / ඉඟි වැකි', marks: 24, maxMarks: 30, pct: 80, status: 'Proficient' },
        { code: 'C4', name: 'කාලය හා ව්‍යාකරණ', marks: 22, maxMarks: 30, pct: 73, status: 'Developing' },
        { code: 'C5', name: 'කියවීම හා විරාම ලක්ෂණ', marks: 25, maxMarks: 30, pct: 83, status: 'Proficient' }
      ],
      english: [
        { code: 'E1', name: 'Phoneme Clarity & Articulation', marks: 23, maxMarks: 30, pct: 77, status: 'Proficient' },
        { code: 'E2', name: 'Pronunciation Accuracy', marks: 21, maxMarks: 30, pct: 70, status: 'Developing' },
        { code: 'E3', name: 'Word Stress & Intonation', marks: 20, maxMarks: 30, pct: 67, status: 'Developing' },
        { code: 'E4', name: 'Speaking Fluency & Speed', marks: 22, maxMarks: 30, pct: 73, status: 'Developing' }
      ],
      preschool: [
        { code: 'P1', name: 'Line Tracing & Fine Motor', marks: 28, maxMarks: 30, pct: 93, status: 'Mastered' },
        { code: 'P2', name: 'Digital Coloring & Boundaries', marks: 27, maxMarks: 30, pct: 90, status: 'Mastered' },
        { code: 'P3', name: 'Paper Craft & Origami Steps', marks: 26, maxMarks: 30, pct: 87, status: 'Mastered' },
        { code: 'P4', name: 'Story Drawing & Comprehension', marks: 27, maxMarks: 30, pct: 90, status: 'Mastered' }
      ]
    },
    recommendation: {
      subjectId: 'math',
      subjectName: 'ගණිතය (Mathematics)',
      categoryCode: 'M2',
      categoryName: 'එකතු කිරීම් හා අඩු කිරීම් (Addition & Subtraction)',
      reason: 'ගණිතය M2 සහ M3 කාණ්ඩවල ලකුණු 63% ක අගයක් ගන්නා බැවින් 2 ශ්‍රේණිය අනුවර්තී ගණිත අභ්‍යාස මඟින් මූලික සංඛ්‍යා සංකල්ප තහවුරු කළ යුතුය.',
      actionTitle: 'Grade 2 Math Adaptive Practice Module',
      actionUrl: '/module/math/grade2',
      priority: 'High Priority ⭐'
    }
  }
];

// Helper to get/set mock JSON data
const getMockAnalytics = () => {
  try {
    if (!fs.existsSync(path.dirname(MOCK_ANALYTICS_PATH))) {
      fs.mkdirSync(path.dirname(MOCK_ANALYTICS_PATH), { recursive: true });
    }
    if (!fs.existsSync(MOCK_ANALYTICS_PATH)) {
      fs.writeFileSync(MOCK_ANALYTICS_PATH, JSON.stringify(DEFAULT_STUDENTS_SEED, null, 2));
    }
    return JSON.parse(fs.readFileSync(MOCK_ANALYTICS_PATH, 'utf8'));
  } catch (err) {
    console.error("Error reading mock analytics:", err);
    return DEFAULT_STUDENTS_SEED;
  }
};

const saveMockAnalytics = (data) => {
  try {
    fs.writeFileSync(MOCK_ANALYTICS_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error saving mock analytics:", err);
  }
};

// Auto seed MongoDB if connected and empty
const autoSeedMongo = async () => {
  if (!global.dbConnected) return;
  try {
    const count = await StudentAnalytics.countDocuments();
    if (count === 0) {
      await StudentAnalytics.insertMany(DEFAULT_STUDENTS_SEED);
      console.log("🌱 Auto-seeded StudentAnalytics in MongoDB successfully");
    }
  } catch (err) {
    console.warn("Auto-seed error:", err.message);
  }
};

// Run seed on router load
setTimeout(autoSeedMongo, 2000);

// @route   GET /api/analytics/students
// @desc    Get all students' analytics overview
router.get('/students', async (req, res) => {
  if (!global.dbConnected) {
    const data = getMockAnalytics();
    return res.json({ success: true, source: 'mock_db', students: data });
  }

  try {
    let students = await StudentAnalytics.find({}).sort({ studentId: 1 });
    if (students.length === 0) {
      await StudentAnalytics.insertMany(DEFAULT_STUDENTS_SEED);
      students = await StudentAnalytics.find({}).sort({ studentId: 1 });
    }
    return res.json({ success: true, source: 'mongodb', students });
  } catch (err) {
    console.error("Error fetching students analytics from MongoDB:", err);
    const data = getMockAnalytics();
    return res.json({ success: true, source: 'fallback', students: data });
  }
});

// @route   GET /api/analytics/student/:studentId
// @desc    Get specific student analytics
router.get('/student/:studentId', async (req, res) => {
  const { studentId } = req.params;

  if (!global.dbConnected) {
    const data = getMockAnalytics();
    const student = data.find(s => s.studentId === studentId || s.id === studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student analytics not found' });
    }
    return res.json({ success: true, source: 'mock_db', student });
  }

  try {
    let student = await StudentAnalytics.findOne({ studentId });
    if (!student) {
      const fallback = DEFAULT_STUDENTS_SEED.find(s => s.studentId === studentId);
      if (fallback) {
        student = new StudentAnalytics(fallback);
        await student.save();
      } else {
        return res.status(404).json({ success: false, message: 'Student analytics not found' });
      }
    }
    return res.json({ success: true, source: 'mongodb', student });
  } catch (err) {
    console.error("Error fetching student from MongoDB:", err);
    const data = getMockAnalytics();
    const student = data.find(s => s.studentId === studentId);
    return res.json({ success: true, source: 'fallback', student: student || DEFAULT_STUDENTS_SEED[0] });
  }
});

// @route   POST /api/analytics/record
// @desc    Record marks from a test / paper attempt into MongoDB & recalculate analytics
router.post('/record', async (req, res) => {
  const { 
    studentId = 'std_001', 
    subject = 'sinhala', 
    categoryCode = 'C1', 
    marks = 28, 
    maxMarks = 30,
    week = 'Week 6'
  } = req.body;

  const pct = Math.round((marks / maxMarks) * 100);
  const status = pct >= 85 ? 'Mastered' : pct >= 70 ? 'Proficient' : pct >= 60 ? 'Developing' : 'Attention Needed';

  if (!global.dbConnected) {
    const data = getMockAnalytics();
    const sIdx = data.findIndex(s => s.studentId === studentId);
    if (sIdx !== -1) {
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
    }
    return res.json({ success: true, source: 'mock_db', message: 'Score recorded successfully' });
  }

  try {
    let student = await StudentAnalytics.findOne({ studentId });
    if (!student) {
      student = new StudentAnalytics({
        studentId,
        name: req.body.name || 'Student',
        weeklyProgress: DEFAULT_STUDENTS_SEED[0].weeklyProgress,
        categoryMarks: DEFAULT_STUDENTS_SEED[0].categoryMarks,
        recommendation: DEFAULT_STUDENTS_SEED[0].recommendation
      });
    }

    student.totalExercises += 1;
    if (student.categoryMarks && student.categoryMarks[subject]) {
      const cat = student.categoryMarks[subject].find(c => c.code === categoryCode);
      if (cat) {
        cat.marks = marks;
        cat.maxMarks = maxMarks;
        cat.pct = pct;
        cat.status = status;
      }
    }
    student.lastUpdated = new Date();
    await student.save();

    return res.json({ success: true, source: 'mongodb', message: 'Score recorded in MongoDB successfully', student });
  } catch (err) {
    console.error("Error saving score to MongoDB:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
