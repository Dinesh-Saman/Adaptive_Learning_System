const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const StudentAnalytics = require('../models/StudentAnalytics');
const Student = require('../models/Student');
const QuestionAttempt = require('../models/QuestionAttempt');

const cleanDatabaseAnalytics = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");

    const students = await Student.find({});
    console.log(`Found ${students.length} registered students in MongoDB.`);

    for (const st of students) {
      console.log(`Checking student: ${st.name} (${st._id})`);
      
      // Check real question attempts
      const attemptsCount = await QuestionAttempt.countDocuments({ studentId: st._id });
      console.log(`Student ${st.name} has ${attemptsCount} real question attempts in DB.`);

      let analytics = await StudentAnalytics.findOne({
        $or: [{ studentId: st._id.toString() }, { name: st.name }]
      });

      if (attemptsCount === 0) {
        console.log(`Resetting analytics for ${st.name} to clean 0 state (no fake data)...`);
        
        const cleanData = {
          studentId: st._id.toString(),
          name: st.name,
          grade: st.grade || 'Grade 4',
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

        if (analytics) {
          Object.assign(analytics, cleanData);
          await analytics.save();
        } else {
          await StudentAnalytics.create(cleanData);
        }
        console.log(`Cleaned analytics for ${st.name} successfully!`);
      }
    }

    console.log("Database clean completed!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("DB clean failed:", err);
    process.exit(1);
  }
};

cleanDatabaseAnalytics();
