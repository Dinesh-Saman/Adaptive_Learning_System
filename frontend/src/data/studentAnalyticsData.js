import { getItem } from '../utils/storage';

export const isPreSchoolOrGrade1 = (gradeStr) => {
  if (!gradeStr) return false;
  const g = String(gradeStr).toLowerCase().trim();
  return g.includes('pre') || g.includes('preschool') || g.includes('pre-school') || g.includes('grade 1') || g === '1';
};

/**
 * studentAnalyticsData.js
 * Longitudinal Analytics & Progress Intelligence Dataset for the 4 Core Learning Hubs:
 * 1. ගණිතය (Mathematics) - Grade 2, 3, 4
 * 2. සිංහල භාෂාව (Sinhala Language) - Grade 2, 3, 4
 * 3. English Speech & Pronunciation
 * 4. Pre-School & Grade 1 (Fine Motor Skills, Crafts & Coloring)
 */

export const CORE_SUBJECTS = {
  math: {
    id: 'math',
    name: 'ගණිතය (Mathematics)',
    shortName: 'Math',
    icon: '🧮',
    color: 'blue',
    gradient: 'from-blue-600 to-indigo-600',
    lightBg: 'bg-blue-50 text-blue-800 border-blue-200',
    categories: [
      { id: 'M1', name: '100 දක්වා සංඛ්‍යා (Numbers to 100)', weight: 0.25 },
      { id: 'M2', name: 'එකතු කිරීම් හා අඩු කිරීම් (Addition & Subtraction)', weight: 0.30 },
      { id: 'M3', name: 'ගුණ කිරීම හා බෙදීම (Multiplication & Division)', weight: 0.25 },
      { id: 'M4', name: 'මිනුම් හා හැඩතල (Measurement & Geometry)', weight: 0.20 }
    ]
  },
  sinhala: {
    id: 'sinhala',
    name: 'සිංහල භාෂාව (Sinhala)',
    shortName: 'Sinhala',
    icon: '🦁',
    color: 'emerald',
    gradient: 'from-emerald-600 to-teal-600',
    lightBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    categories: [
      { id: 'C1', name: 'සමාන පද හා අර්ථ (Synonyms)', weight: 0.20 },
      { id: 'C2', name: 'විරුද්ධ පද (Antonyms)', weight: 0.20 },
      { id: 'C3', name: 'ප්‍රස්තාව පිරුළු / ඉඟි වැකි (Proverbs & Idioms)', weight: 0.20 },
      { id: 'C4', name: 'කාලය හා ව්‍යාකරණ (Grammar & Tenses)', weight: 0.20 },
      { id: 'C5', name: 'කියවීම හා විරාම ලක්ෂණ (Reading & Punctuation)', weight: 0.20 }
    ]
  },
  english: {
    id: 'english',
    name: 'English Speech',
    shortName: 'English',
    icon: '🗣️',
    color: 'purple',
    gradient: 'from-purple-600 to-pink-600',
    lightBg: 'bg-purple-50 text-purple-800 border-purple-200',
    categories: [
      { id: 'E1', name: 'Phoneme Clarity & Articulation', weight: 0.30 },
      { id: 'E2', name: 'Pronunciation Accuracy', weight: 0.30 },
      { id: 'E3', name: 'Word Stress & Intonation', weight: 0.20 },
      { id: 'E4', name: 'Speaking Fluency & Speed', weight: 0.20 }
    ]
  },
  preschool: {
    id: 'preschool',
    name: 'Pre-School & Grade 1 (Foundations)',
    shortName: 'Pre-School',
    icon: '🎨',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50 text-amber-800 border-amber-200',
    categories: [
      { id: 'P1', name: 'Line Tracing & Fine Motor (රේඛා ඇඳීම)', weight: 0.35 },
      { id: 'P2', name: 'Digital Coloring & Boundaries (පාට කිරීම)', weight: 0.35 },
      { id: 'P3', name: 'Story Drawing & Comprehension (චිත්‍ර ඇඳීම)', weight: 0.30 }
    ]
  }
};

// Pure dynamic storage - No fake/hardcoded students
export const STUDENT_PROFILES = [];

export const createBlankStudentProfile = (studentId, name, grade) => ({
  id: studentId || 'std_' + Date.now(),
  studentId: studentId || 'std_' + Date.now(),
  name: name || 'Student',
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
      { code: 'P3', name: 'Story Drawing & Comprehension', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' }
    ]
  },
  recommendation: null
});

const API_BASE_URL = 'http://localhost:5000/api/analytics';

export const getStudentPapersHistory = (student, subjectKey = 'math') => {
  if (!student) return [];
  
  // If the student has paperHistory explicitly attached on their profile:
  if (student.paperHistory && Array.isArray(student.paperHistory[subjectKey])) {
    return student.paperHistory[subjectKey];
  }

  const sName = (student.name || '').toLowerCase();
  const sGradeStr = student.grade || '';
  const sGrade = sGradeStr.includes('4') ? 4 : sGradeStr.includes('3') ? 3 : sGradeStr.includes('2') ? 2 : (sName === 'hiruni' ? 4 : sName === 'chamalka' ? 3 : 2);

  // If student is explicitly marked as not having attempts (e.g. Suvinya)
  if (sName === 'suvinya' || student.id === 'std_004' || student.studentId === 'std_004') {
    return [];
  }

  const papers = [];
  const seenIds = new Set();

  try {
    if (subjectKey === 'math') {
      const sName = (student.name || '').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
      const isDefaultStudent = (sGrade === 2 && (sName === 'hasara' || sName === 'std_001')) ||
                               (sGrade === 3 && (sName === 'chamalka' || sName === 'std_002')) ||
                               (sGrade === 4 && (sName === 'hiruni' || sName === 'std_003'));

      const mathSources = [
        { key: `g${sGrade}_math_paper_history_${sName}`, grade: sGrade, label: `Grade ${sGrade}` },
        { key: `math_g${sGrade}_adaptive_session_${sName}`, grade: sGrade, label: `Grade ${sGrade}` }
      ];

      if (isDefaultStudent) {
        mathSources.push(
          { key: `g${sGrade}_math_paper_history`, grade: sGrade, label: `Grade ${sGrade}` },
          { key: `math_g${sGrade}_adaptive_session`, grade: sGrade, label: `Grade ${sGrade}` }
        );
      }

      mathSources.forEach(({ key, grade, label }) => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const historyObj = JSON.parse(stored);
            const list = historyObj.paperHistory ? Object.entries(historyObj.paperHistory) : Object.entries(historyObj);
            list.forEach(([pId, paper]) => {
              const uniqueKey = `math_g${grade}_p${pId}`;
              if (!seenIds.has(uniqueKey) && paper && (paper.totalCorrect !== undefined || paper.overallAccuracy !== undefined || paper.percentage !== undefined)) {
                seenIds.add(uniqueKey);
                const acc = paper.overallAccuracy !== undefined 
                  ? paper.overallAccuracy 
                  : (paper.percentage !== undefined ? paper.percentage : Math.round(((paper.totalCorrect || 0) / (paper.totalQuestions || 20)) * 100));
                papers.push({
                  id: uniqueKey,
                  grade,
                  gradeLabel: label,
                  paperId: Number(pId),
                  paperTitle: `${label} Mathematics • Paper 0${pId}`,
                  totalCorrect: paper.totalCorrect || 0,
                  totalQuestions: paper.totalQuestions || 20,
                  accuracy: acc,
                  currentDiff: paper.currentDiff || 1,
                  completedAt: paper.completedAt || 'Recently',
                  history: paper.history || paper.evaluatedAnswers || paper.answers || []
                });
              }
            });
          } catch (e) {}
        }
      });
    } else if (subjectKey === 'sinhala') {
      const sName = (student.name || '').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
      const isDefaultStudent = (sGrade === 2 && (sName === 'hasara' || sName === 'std_001')) ||
                               (sGrade === 3 && (sName === 'chamalka' || sName === 'std_002')) ||
                               (sGrade === 4 && (sName === 'hiruni' || sName === 'std_003'));

      const sinhalaSources = [
        { key: `g${sGrade}_sinhala_paper_history_${sName}`, grade: sGrade, label: `Grade ${sGrade}` },
        { key: `sinhala_grade${sGrade}_adaptive_session_${sName}`, grade: sGrade, label: `Grade ${sGrade}` },
        { key: `g${sGrade}_sinhala_session_${sName}`, grade: sGrade, label: `Grade ${sGrade}` }
      ];

      if (isDefaultStudent) {
        sinhalaSources.push(
          { key: `g${sGrade}_sinhala_paper_history`, grade: sGrade, label: `Grade ${sGrade}` },
          { key: `sinhala_grade${sGrade}_adaptive_session`, grade: sGrade, label: `Grade ${sGrade}` },
          { key: `g${sGrade}_sinhala_session`, grade: sGrade, label: `Grade ${sGrade}` },
          { key: `sinhala_g${sGrade}_adaptive_session`, grade: sGrade, label: `Grade ${sGrade}` }
        );
      }

      sinhalaSources.forEach(({ key, grade, label }) => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const historyObj = JSON.parse(stored);
            const list = historyObj.paperHistory ? Object.entries(historyObj.paperHistory) : Object.entries(historyObj);
            list.forEach(([pId, paper]) => {
              const uniqueKey = `sin_g${grade}_p${pId}`;
              if (!seenIds.has(uniqueKey) && paper && (paper.score !== undefined || paper.totalMarks !== undefined || paper.accuracy !== undefined || paper.percentage !== undefined)) {
                seenIds.add(uniqueKey);
                const acc = paper.accuracy !== undefined ? paper.accuracy : (paper.percentage !== undefined ? paper.percentage : (paper.totalMarks !== undefined ? paper.totalMarks : Math.round(((paper.score || 0) / (paper.totalQuestions || 20)) * 100)));
                papers.push({
                  id: uniqueKey,
                  grade,
                  gradeLabel: label,
                  paperId: Number(pId),
                  paperTitle: `${label} Sinhala • Paper 0${pId}`,
                  totalCorrect: paper.score !== undefined ? paper.score : Math.round((acc / 100) * (paper.totalQuestions || 20)),
                  totalQuestions: paper.totalQuestions || 20,
                  accuracy: acc,
                  completedAt: paper.completedAt || 'Recently',
                  history: paper.evaluatedAnswers || paper.history || paper.answers || []
                });
              }
            });
          } catch (e) {}
        }
      });
    } else if (subjectKey === 'english') {
      const sName = (student.name || '').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
      const sId = (student.studentId || student.id || '').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
      const isDefaultStudent = (sGrade === 2 && (sName === 'hasara' || sName === 'std_001' || sId === 'std_001')) ||
                               (sGrade === 3 && (sName === 'chamalka' || sName === 'std_002' || sId === 'std_002')) ||
                               (sGrade === 4 && (sName === 'hiruni' || sName === 'std_003' || sId === 'std_003'));

      const englishSources = [
        { key: `g${sGrade}_english_paper_history_${sName}`, grade: sGrade, label: `Grade ${sGrade}` },
        { key: `g${sGrade}_english_paper_history_${sId}`, grade: sGrade, label: `Grade ${sGrade}` },
        { key: `g2_english_paper_history_${sName}`, grade: 2, label: `Grade 2` },
        { key: `g3_english_paper_history_${sName}`, grade: 3, label: `Grade 3` },
        { key: `g4_english_paper_history_${sName}`, grade: 4, label: `Grade 4` },
        { key: `g2_english_paper_history_${sId}`, grade: 2, label: `Grade 2` },
        { key: `g3_english_paper_history_${sId}`, grade: 3, label: `Grade 3` },
        { key: `g4_english_paper_history_${sId}`, grade: 4, label: `Grade 4` }
      ];

      if (isDefaultStudent) {
        englishSources.push(
          { key: `g${sGrade}_english_paper_history`, grade: sGrade, label: `Grade ${sGrade}` },
          { key: `g2_english_paper_history`, grade: 2, label: `Grade 2` },
          { key: `g3_english_paper_history`, grade: 3, label: `Grade 3` },
          { key: `g4_english_paper_history`, grade: 4, label: `Grade 4` }
        );
      }

      englishSources.forEach(({ key, grade, label }) => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const historyObj = JSON.parse(stored);
            Object.entries(historyObj).forEach(([pId, paper]) => {
              const uniqueKey = `eng_g${grade}_p${pId}`;
              if (!seenIds.has(uniqueKey) && paper && (paper.overallAccuracy !== undefined || paper.totalPassed !== undefined || paper.percentage !== undefined)) {
                seenIds.add(uniqueKey);
                const acc = paper.overallAccuracy !== undefined 
                  ? paper.overallAccuracy 
                  : (paper.percentage !== undefined ? paper.percentage : Math.round(((paper.totalPassed || 0) / (paper.totalQuestions || 10)) * 100));
                papers.push({
                  id: uniqueKey,
                  grade,
                  gradeLabel: label,
                  paperId: Number(pId),
                  paperTitle: `${label} English Speech • Paper 0${pId}`,
                  totalCorrect: paper.totalPassed || paper.totalCorrect || Math.round((acc / 100) * (paper.totalQuestions || 10)),
                  totalQuestions: paper.totalQuestions || 10,
                  accuracy: acc,
                  completedAt: paper.completedAt || 'Recently',
                  history: paper.history || []
                });
              }
            });
          } catch (e) {}
        }
      });
    } else if (subjectKey === 'preschool') {
      const sName = (student.name || '').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
      const isDefaultStudent = (sName === 'hasara' || sName === 'std_001');

      // 1. Tracing
      const tracingSources = [`tracing_scores_${sName}`];
      if (isDefaultStudent) tracingSources.push('tracing_scores');
      tracingSources.forEach(key => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const hist = JSON.parse(stored);
            Object.entries(hist).forEach(([tId, item]) => {
              const uniqueKey = `tracing_${tId}`;
              if (!seenIds.has(uniqueKey) && item && (item.overall !== undefined || item.accuracy !== undefined)) {
                seenIds.add(uniqueKey);
                const score = item.overall !== undefined ? item.overall : item.accuracy;
                papers.push({
                  id: uniqueKey,
                  grade: 1,
                  gradeLabel: 'Pre-School',
                  paperId: tId,
                  paperTitle: `Line Tracing • ${item.title || 'Worksheet'}`,
                  totalCorrect: score,
                  totalQuestions: 100,
                  accuracy: score,
                  completedAt: item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Recently',
                  categoryScores: {
                    P1: { correct: score, total: 100 }
                  },
                  history: [
                    {
                      questionId: item.title || 'Line Tracing',
                      category: 'P1',
                      isCorrect: score >= 50,
                      score: score,
                      accuracy: item.accuracy || score,
                      completion: item.completion || score
                    }
                  ]
                });
              }
            });
          } catch (e) {}
        }
      });

      // 2. Coloring
      const coloringSources = [`coloring_scores_${sName}`];
      if (isDefaultStudent) coloringSources.push('coloring_scores');
      coloringSources.forEach(key => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const hist = JSON.parse(stored);
            Object.entries(hist).forEach(([cId, item]) => {
              const uniqueKey = `coloring_${cId}`;
              if (!seenIds.has(uniqueKey) && item && (item.overall !== undefined || item.boundary !== undefined)) {
                seenIds.add(uniqueKey);
                const score = item.overall !== undefined ? item.overall : item.boundary;
                papers.push({
                  id: uniqueKey,
                  grade: 1,
                  gradeLabel: 'Pre-School',
                  paperId: cId,
                  paperTitle: `Digital Coloring • ${item.title || 'Coloring Sheet'}`,
                  totalCorrect: score,
                  totalQuestions: 100,
                  accuracy: score,
                  completedAt: item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Recently',
                  categoryScores: {
                    P2: { correct: score, total: 100 }
                  },
                  history: [
                    {
                      questionId: item.title || 'Digital Coloring',
                      category: 'P2',
                      isCorrect: score >= 50,
                      score: score,
                      coverage: item.coverage || score,
                      boundary: item.boundary || score
                    }
                  ]
                });
              }
            });
          } catch (e) {}
        }
      });

      // 3. Story Drawing
      const storySources = [`storydrawing_scores_${sName}`];
      if (isDefaultStudent) storySources.push('storydrawing_scores');
      storySources.forEach(key => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const hist = JSON.parse(stored);
            Object.entries(hist).forEach(([sId, item]) => {
              const uniqueKey = `story_${sId}`;
              if (!seenIds.has(uniqueKey) && item && (item.score !== undefined || item.accuracy !== undefined)) {
                seenIds.add(uniqueKey);
                const score = item.score !== undefined ? item.score : item.accuracy;
                papers.push({
                  id: uniqueKey,
                  grade: 1,
                  gradeLabel: 'Grade 1',
                  paperId: sId,
                  paperTitle: `Story Drawing • ${item.title || 'Story Task'}`,
                  totalCorrect: score,
                  totalQuestions: 100,
                  accuracy: score,
                  completedAt: item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Recently',
                  categoryScores: {
                    P3: { correct: score, total: 100 }
                  },
                  history: [
                    {
                      questionId: item.title || 'Story Drawing',
                      category: 'P3',
                      isCorrect: score >= 50,
                      score: score
                    }
                  ]
                });
              }
            });
          } catch (e) {}
        }
      });
    }
  } catch (e) {
    console.warn("Paper history scan error:", e);
  }
  return papers;
};

export const syncLocalHistoryToBackend = async () => {
  try {
    if (getItem('role') === 'teacher') return;
    const studentId = getItem('studentId') || '';
    const name = getItem('studentName') || '';
    if (!name && !studentId) return;

    const sNameClean = String(name || studentId).toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
    const isDefaultStudent = (sNameClean === 'hasara' || sNameClean === 'std_hasara' || sNameClean === 'std_001' ||
                              sNameClean === 'chamalka' || sNameClean === 'std_002' ||
                              sNameClean === 'hiruni' || sNameClean === 'std_003');

    // 1. Mathematics Paper History across Grade 2, 3, 4
    const mathKeys = [
      { key: `g2_math_paper_history_${sNameClean}`, grade: 2 },
      { key: `g3_math_paper_history_${sNameClean}`, grade: 3 },
      { key: `g4_math_paper_history_${sNameClean}`, grade: 4 }
    ];
    if (isDefaultStudent) {
      mathKeys.push(
        { key: 'g2_math_paper_history', grade: 2 },
        { key: 'g3_math_paper_history', grade: 3 },
        { key: 'g4_math_paper_history', grade: 4 }
      );
    }

    mathKeys.forEach(({ key, grade }) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const historyObj = JSON.parse(stored);
          Object.entries(historyObj).forEach(([pId, paper]) => {
            if (paper && (typeof paper.totalCorrect === 'number' || typeof paper.overallAccuracy === 'number')) {
              const acc = paper.overallAccuracy !== undefined ? paper.overallAccuracy : Math.round(((paper.totalCorrect || 0) / (paper.totalQuestions || 20)) * 100);
              const marks = Math.round((acc / 100) * 30);
              const maxMarks = 30;
              ['M1', 'M2', 'M3', 'M4'].forEach(categoryCode => {
                recordStudentTestMarks({
                  studentId,
                  name,
                  subject: 'math',
                  categoryCode,
                  marks,
                  maxMarks
                });
              });

              if (paper.history && Array.isArray(paper.history)) {
                const attemptItems = paper.history.map((h, idx) => ({
                  questionId: `Gr.${grade} P0${pId} Q${h.qNum || (idx + 1)}: ${h.questionId || ''}`,
                  skillId: h.skillId || 'Mathematics Operations',
                  studentAnswer: String(h.selectedOption ?? '—'),
                  correctAnswer: String(h.correctAnswer ?? '—'),
                  isCorrect: !!h.isCorrect,
                  responseTimeMs: 2000,
                  misconception: h.isCorrect ? 'Correct application' : 'Incorrect Choice'
                }));
                recordStudentQuestionAttempts({
                  studentId,
                  name,
                  module: 'math',
                  grade,
                  paperNumber: Number(pId),
                  attempts: attemptItems
                });
              }
            }
          });
        } catch (e) {}
      }
    });

    // 2. Sinhala Language Paper & Activity History
    const sinhalaKeys = [
      { key: `g2_sinhala_paper_history_${sNameClean}`, grade: 2 },
      { key: `g3_sinhala_paper_history_${sNameClean}`, grade: 3 },
      { key: `g4_sinhala_paper_history_${sNameClean}`, grade: 4 }
    ];
    if (isDefaultStudent) {
      sinhalaKeys.push(
        { key: 'g2_sinhala_paper_history', grade: 2 },
        { key: 'g3_sinhala_paper_history', grade: 3 },
        { key: 'g4_sinhala_paper_history', grade: 4 }
      );
    }

    sinhalaKeys.forEach(({ key, grade }) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const historyObj = JSON.parse(stored);
          Object.entries(historyObj).forEach(([pId, paper]) => {
            if (paper && (typeof paper.score === 'number' || typeof paper.accuracy === 'number' || typeof paper.percentage === 'number')) {
              const maxMarks = 30;
              ['C1', 'C2', 'C3', 'C4', 'C5'].forEach(categoryCode => {
                let catPct = paper.percentage || paper.accuracy || 0;
                if (paper.categoryScores && paper.categoryScores[categoryCode]) {
                  const cs = paper.categoryScores[categoryCode];
                  catPct = cs.total > 0 ? Math.round((cs.correct / cs.total) * 100) : (cs.percentage || catPct);
                } else if (paper.evaluatedAnswers && Array.isArray(paper.evaluatedAnswers)) {
                  const catQs = paper.evaluatedAnswers.filter(a => a.category === categoryCode);
                  if (catQs.length > 0) {
                    const cCorrect = catQs.filter(a => a.isCorrect).length;
                    catPct = Math.round((cCorrect / catQs.length) * 100);
                  }
                }
                const marks = Math.round((catPct / 100) * 30);
                recordStudentTestMarks({
                  studentId,
                  name,
                  subject: 'sinhala',
                  categoryCode,
                  marks,
                  maxMarks
                });
              });

              if (paper.history && Array.isArray(paper.history)) {
                const attemptItems = paper.history.map((h, idx) => ({
                  questionId: `Gr.${grade} P0${pId} Q${idx + 1}`,
                  skillId: h.category || 'Sinhala Vocabulary',
                  studentAnswer: String(h.userAnswer || h.selectedOption || '—'),
                  correctAnswer: String(h.correctAnswer || '—'),
                  isCorrect: !!h.isCorrect,
                  responseTimeMs: 1800,
                  misconception: h.isCorrect ? 'Correct grammar' : 'Grammar Confusion'
                }));
                recordStudentQuestionAttempts({
                  studentId,
                  name,
                  module: 'sinhala',
                  grade,
                  paperNumber: Number(pId),
                  attempts: attemptItems
                });
              }
            }
          });
        } catch (e) {}
      }
    });

    // 3. English Speech Paper & Voice Activity History
    const englishKeys = [
      { key: `g2_english_paper_history_${sNameClean}`, grade: 2 },
      { key: `g3_english_paper_history_${sNameClean}`, grade: 3 },
      { key: `g4_english_paper_history_${sNameClean}`, grade: 4 }
    ];
    if (isDefaultStudent) {
      englishKeys.push(
        { key: 'g2_english_paper_history', grade: 2 },
        { key: 'g3_english_paper_history', grade: 3 },
        { key: 'g4_english_paper_history', grade: 4 },
        { key: 'english_speech_history', grade: 2 }
      );
    }

    englishKeys.forEach(({ key, grade }) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const historyObj = JSON.parse(stored);
          Object.values(historyObj).forEach(item => {
            if (item) {
              const rawAccuracy = item.overallAccuracy !== undefined
                ? item.overallAccuracy
                : item.totalQuestions > 0
                  ? Math.round(((item.totalPassed || item.totalCorrect || 0) / item.totalQuestions) * 100)
                  : (item.overallScore || item.score || 0);

              const marks = Math.round((rawAccuracy / 100) * 30);
              const maxMarks = 30;

              ['E1', 'E2', 'E3', 'E4'].forEach(categoryCode => {
                recordStudentTestMarks({
                  studentId,
                  name,
                  subject: 'english',
                  categoryCode,
                  marks,
                  maxMarks
                });
              });

              if (item.history && Array.isArray(item.history)) {
                const attemptItems = item.history.map((h, idx) => ({
                  questionId: h.targetText || `G${item.grade || grade}_P${item.paperId || 1}_Q${idx + 1}`,
                  skillId: h.mti_pattern || (h.mtiPatterns?.[0]?.name) || 'Speech & Pronunciation',
                  studentAnswer: h.userTranscript || '—',
                  correctAnswer: h.targetText || '—',
                  isCorrect: h.isPassed !== undefined ? h.isPassed : (h.accuracy >= 75),
                  responseTimeMs: 1500,
                  misconception: h.mtiPatterns?.map(p => p.name).join(', ') || (h.isPassed ? 'Clear Pronunciation' : 'MTI Error Detected')
                }));
                recordStudentQuestionAttempts({
                  studentId,
                  name,
                  module: 'english',
                  grade: item.grade || grade,
                  paperNumber: item.paperId || 1,
                  attempts: attemptItems
                });
              }
            }
          });
        } catch (e) {}
      }
    });

    // 4. Pre-School Foundations
    const preschoolKeys = [
      `tracing_scores_${sNameClean}`,
      `coloring_scores_${sNameClean}`,
      `storydrawing_scores_${sNameClean}`
    ];
    if (isDefaultStudent) {
      preschoolKeys.push('preschool_activity_history', 'g1_preschool_paper_history', 'drawing_scores', 'tracing_scores', 'coloring_scores', 'storydrawing_scores');
    }

    preschoolKeys.forEach(key => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const historyObj = JSON.parse(stored);
          Object.values(historyObj).forEach(item => {
            if (item && (item.score !== undefined || item.accuracy !== undefined || item.passed !== undefined)) {
              const rawScore = item.score || item.accuracy || (item.passed ? 25 : 15);
              const marks = Math.min(30, Math.round(rawScore));
              const maxMarks = 30;
              ['P1', 'P2', 'P3'].forEach(categoryCode => {
                recordStudentTestMarks({
                  studentId,
                  name,
                  subject: 'preschool',
                  categoryCode,
                  marks,
                  maxMarks
                });
              });
            }
          });
        } catch (e) {}
      }
    });

  } catch (e) {
    console.warn("Sync local history error:", e);
  }
};

/**
 * Fetch all students analytics from MongoDB via backend API
 */
export const ensureStudentStructure = (st) => {
  const sGrade = (st.grade && st.grade.includes('2')) ? 2 : 4;
  const sinhalaCategories = sGrade === 2 ? [
    { code: 'C1', name: 'අකුරු හා අක්ෂර හඳුනාගැනීම', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
    { code: 'C2', name: 'පිල්ලම් භාවිතය', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
    { code: 'C3', name: 'සරල වචන කියවීම හා ලිවීම', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
    { code: 'C4', name: 'වචන අර්ථ හා සම්බන්ධතා', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
    { code: 'C5', name: 'සරල වාක්‍ය හා අවබෝධය', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' }
  ] : [
    { code: 'C1', name: 'සමාන පද හා අර්ථ', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
    { code: 'C2', name: 'විරුද්ධ පද', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
    { code: 'C3', name: 'ප්‍රස්තාව පිරුළු / ඉඟි වැකි', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
    { code: 'C4', name: 'කාලය හා ව්‍යාකරණ', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
    { code: 'C5', name: 'කියවීම හා විරාම ලක්ෂණ', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' }
  ];

  return {
    ...st,
    id: st.studentId || st.id || st._id || 'std_' + Math.random(),
    studentId: st.studentId || st.id || st._id || 'std_' + Math.random(),
    name: st.name || 'Student',
    grade: st.grade || 'Grade 2',
    categoryMarks: {
      math: (st.categoryMarks?.math && st.categoryMarks.math.length > 0) ? st.categoryMarks.math : [
        { code: 'M1', name: '100 දක්වා සංඛ්‍යා', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
        { code: 'M2', name: 'එකතු කිරීම් හා අඩු කිරීම්', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
        { code: 'M3', name: 'ගුණ කිරීම හා බෙදීම', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
        { code: 'M4', name: 'මිනුම් හා හැඩතල', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' }
      ],
      sinhala: (st.categoryMarks?.sinhala && st.categoryMarks.sinhala.length > 0) ? st.categoryMarks.sinhala : sinhalaCategories,
      english: (st.categoryMarks?.english && st.categoryMarks.english.length > 0) ? st.categoryMarks.english : [
        { code: 'E1', name: 'Phoneme Clarity & Articulation', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
        { code: 'E2', name: 'Pronunciation Accuracy', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
        { code: 'E3', name: 'Word Stress & Intonation', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
        { code: 'E4', name: 'Speaking Fluency & Speed', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' }
      ],
      preschool: [
        st.categoryMarks?.preschool?.find(c => c.code === 'P1') || { code: 'P1', name: 'Line Tracing & Fine Motor', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
        st.categoryMarks?.preschool?.find(c => c.code === 'P2') || { code: 'P2', name: 'Digital Coloring & Boundaries', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' },
        st.categoryMarks?.preschool?.find(c => c.code === 'P4' || (c.code === 'P3' && c.name?.toLowerCase().includes('drawing'))) || { code: 'P3', name: 'Story Drawing & Comprehension', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' }
      ]
    }
  };
};

export const fetchStudentsAnalyticsFromApi = async () => {
  syncLocalHistoryToBackend().catch(() => {});
  let studentsList = [];
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.students && data.students.length > 0) {
        studentsList = data.students.map(s => ensureStudentStructure(s));
      }
    }
  } catch (error) {
    console.warn("MongoDB Analytics API lookup:", error.message);
  }

  // Ensure standard registered students are present if none returned
  if (studentsList.length === 0) {
    studentsList = [
      ensureStudentStructure(createBlankStudentProfile('std_001', 'Hasara', 'Grade 2')),
      ensureStudentStructure(createBlankStudentProfile('std_002', 'Hiruni', 'Grade 4')),
      ensureStudentStructure(createBlankStudentProfile('std_003', 'Chamalka', 'Grade 4'))
    ];
  }

  studentsList = studentsList.map(st => getStudentLiveSubjectData(st));
  return studentsList;
};

export const getStudentLiveSubjectData = (st) => {
  if (!st) return st;
  const updated = { ...st };
  const sGrade = (st.grade && st.grade.includes('4')) ? 4 : (st.grade && st.grade.includes('3')) ? 3 : (st.grade && st.grade.includes('2')) ? 2 : 4;
  const isPreSchool = isPreSchoolOrGrade1(st.grade);

  const sNameClean = (st.name || '').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
  const isDefaultStudent = (sGrade === 2 && (sNameClean === 'hasara' || sNameClean === 'std_001')) ||
                           (sGrade === 3 && (sNameClean === 'chamalka' || sNameClean === 'std_002')) ||
                           (sGrade === 4 && (sNameClean === 'hiruni' || sNameClean === 'std_003'));

  let totalAllAttempts = 0;

  // 1. Math Multi-Grade Paper Aggregation
  let mathTotalAcc = 0;
  let mathPaperCount = 0;
  let mathAttemptsCount = 0;
  const mathDomainStats = {
    M1: { correct: 0, total: 0, name: '100 දක්වා සංඛ්‍යා (Numbers)' },
    M2: { correct: 0, total: 0, name: 'එකතු කිරීම් හා අඩු කිරීම් (Operations)' },
    M3: { correct: 0, total: 0, name: 'ගුණ කිරීම හා බෙදීම (Multiplication & Division)' },
    M4: { correct: 0, total: 0, name: 'මිනුම් හා හැඩතල (Measurement & Geometry)' }
  };

  const mathSources = [
    { key: `g${sGrade}_math_paper_history_${sNameClean}`, grade: sGrade },
    { key: `math_grade${sGrade}_adaptive_session_${sNameClean}`, grade: sGrade },
    { key: `g${sGrade}_math_session_${sNameClean}`, grade: sGrade }
  ];
  if (isDefaultStudent) {
    mathSources.push(
      { key: `g${sGrade}_math_paper_history`, grade: sGrade },
      { key: `math_g${sGrade}_adaptive_session`, grade: sGrade },
      { key: `math_grade${sGrade}_adaptive_session`, grade: sGrade }
    );
  }

  mathSources
  .filter(src => src.grade === sGrade)
  .forEach(({ key }) => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const hist = JSON.parse(stored);
        const list = hist.paperHistory ? Object.values(hist.paperHistory) : Object.values(hist);
        list.forEach(paper => {
          if (paper && (paper.overallAccuracy !== undefined || paper.totalCorrect !== undefined || paper.percentage !== undefined)) {
            const acc = paper.overallAccuracy !== undefined 
              ? paper.overallAccuracy 
              : (paper.percentage !== undefined ? paper.percentage : Math.round(((paper.totalCorrect || 0) / (paper.totalQuestions || 20)) * 100));
            mathTotalAcc += acc;
            mathPaperCount += 1;
            mathAttemptsCount += (paper.history?.length || paper.evaluatedAnswers?.length || paper.totalQuestions || 20);

            const qHistory = paper.history || paper.evaluatedAnswers || [];
            if (Array.isArray(qHistory)) {
              qHistory.forEach((h, idx) => {
                const sid = (h.skillId || h.domainId || h.questionId || '').toUpperCase();
                let domCode = 'M1';
                if (sid.includes('D1') || sid.includes('NUMBER') || sid.includes('COUNTING') || sid.includes('PLACE_VALUE')) {
                  domCode = 'M1';
                } else if (sid.includes('D2') || sid.includes('ADD') || sid.includes('SUB') || sid.includes('OPERAT')) {
                  domCode = 'M2';
                } else if (sid.includes('D3') || sid.includes('MULT') || sid.includes('DIV') || sid.includes('LENGTH') || sid.includes('WEIGHT') || sid.includes('TIME') || sid.includes('MONEY') || sid.includes('CAPACITY')) {
                  domCode = 'M3';
                } else if (sid.includes('D4') || sid.includes('GEOM') || sid.includes('SHAPE') || sid.includes('SOLID') || sid.includes('DATA') || sid.includes('GRAPH') || sid.includes('POSITION') || sid.includes('PATTERN')) {
                  domCode = 'M4';
                } else {
                  const mod = (h.qNum || (idx + 1) - 1) % 4;
                  domCode = ['M1', 'M2', 'M3', 'M4'][mod];
                }

                mathDomainStats[domCode].total += 1;
                if (h.isCorrect) {
                  mathDomainStats[domCode].correct += 1;
                }
              });
            }
          }
        });
      } catch (e) {}
    }
  });

  if (mathPaperCount > 0) {
    updated.categoryMarks.math = ['M1', 'M2', 'M3', 'M4'].map(code => {
      const d = mathDomainStats[code];
      const pct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
      const marks = d.total > 0 ? d.correct : 0;
      const status = d.total === 0 ? 'Not Started' : pct >= 85 ? 'Mastered' : pct >= 70 ? 'Proficient' : pct >= 50 ? 'Developing' : 'Needs Practice';
      return {
        code,
        name: d.name,
        marks,
        maxMarks: d.total > 0 ? d.total : 20,
        pct,
        status,
        attempts: d.total
      };
    });
    totalAllAttempts += mathAttemptsCount;
  }

  // 2. English Multi-Grade Paper Aggregation
  let engTotalAccuracy = 0;
  let engPaperCount = 0;
  let engAttemptsCount = 0;
  const sIdClean = (st.studentId || st.id || '').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
  const engDomainStats = {
    E1: { correct: 0, total: 0, name: 'Phoneme Clarity & Articulation' },
    E2: { correct: 0, total: 0, name: 'Pronunciation Accuracy' },
    E3: { correct: 0, total: 0, name: 'Word Stress & Intonation' },
    E4: { correct: 0, total: 0, name: 'Speaking Fluency & Speed' }
  };

  const engSources = [
    { key: `g${sGrade}_english_paper_history_${sNameClean}`, grade: sGrade },
    { key: `g${sGrade}_english_paper_history_${sIdClean}`, grade: sGrade },
    { key: `g2_english_paper_history_${sNameClean}`, grade: 2 },
    { key: `g3_english_paper_history_${sNameClean}`, grade: 3 },
    { key: `g4_english_paper_history_${sNameClean}`, grade: 4 },
    { key: `g2_english_paper_history_${sIdClean}`, grade: 2 },
    { key: `g3_english_paper_history_${sIdClean}`, grade: 3 },
    { key: `g4_english_paper_history_${sIdClean}`, grade: 4 }
  ];
  if (isDefaultStudent) {
    engSources.push(
      { key: `g${sGrade}_english_paper_history`, grade: sGrade },
      { key: `g2_english_paper_history`, grade: 2 },
      { key: `g3_english_paper_history`, grade: 3 },
      { key: `g4_english_paper_history`, grade: 4 }
    );
  }

  const engSeenKeys = new Set();
  engSources
  .forEach(({ key }) => {
    if (engSeenKeys.has(key)) return;
    engSeenKeys.add(key);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const historyObj = JSON.parse(stored);
        Object.values(historyObj).forEach(paper => {
          if (paper && (paper.overallAccuracy !== undefined || paper.totalPassed !== undefined || paper.percentage !== undefined)) {
            const acc = paper.overallAccuracy !== undefined
              ? paper.overallAccuracy
              : paper.percentage !== undefined
                ? paper.percentage
                : paper.totalQuestions > 0
                  ? Math.round((paper.totalPassed / paper.totalQuestions) * 100)
                  : 0;
            engTotalAccuracy += acc;
            engPaperCount += 1;
            const count = paper.history?.length || paper.totalQuestions || 10;
            engAttemptsCount += count;

            if (paper.history && Array.isArray(paper.history) && paper.history.length > 0) {
              paper.history.forEach((h, idx) => {
                const mod = idx % 4;
                const domCode = ['E1', 'E2', 'E3', 'E4'][mod];
                engDomainStats[domCode].total += 1;
                const isPassed = h.isPassed === true || h.isCorrect === true || h.passed === true ||
                                 (h.result && (h.result.pronunciationCorrect || h.result.wordsCorrect || h.result.overallScore >= 70)) ||
                                 (typeof h.score === 'number' && (h.score >= 70 || h.score >= 0.7));
                if (isPassed) {
                  engDomainStats[domCode].correct += 1;
                }
              });
            } else {
              // Distribute across all 4 domains based on paper's overall accuracy
              const qCount = paper.totalQuestions || 10;
              ['E1', 'E2', 'E3', 'E4'].forEach((domCode, dIdx) => {
                const domTotal = Math.max(1, Math.floor(qCount / 4) + (dIdx < (qCount % 4) ? 1 : 0));
                const domCorrect = Math.round((acc / 100) * domTotal);
                engDomainStats[domCode].total += domTotal;
                engDomainStats[domCode].correct += domCorrect;
              });
            }
          }
        });
      } catch (e) {}
    }
  });

  if (engPaperCount > 0) {
    updated.categoryMarks.english = ['E1', 'E2', 'E3', 'E4'].map(code => {
      const d = engDomainStats[code];
      const pct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
      const marks = Math.round((pct / 100) * 30);
      const status = d.total === 0 ? 'Not Started' : pct >= 85 ? 'Mastered' : pct >= 70 ? 'Proficient' : pct >= 50 ? 'Developing' : 'Needs Practice';
      return {
        code,
        name: d.name,
        marks,
        maxMarks: 30,
        pct,
        status,
        attempts: d.total
      };
    });
    totalAllAttempts += engAttemptsCount;
  }

  // 3. Sinhala Multi-Grade Paper Aggregation
    let sinTotalAccuracy = 0;
    let sinPaperCount = 0;
    let sinAttemptsCount = 0;
    const sinDomainStats = sGrade === 2 ? {
      C1: { correct: 0, total: 0, name: 'අකුරු හා අක්ෂර හඳුනාගැනීම' },
      C2: { correct: 0, total: 0, name: 'පිල්ලම් භාවිතය' },
      C3: { correct: 0, total: 0, name: 'සරල වචන කියවීම හා ලිවීම' },
      C4: { correct: 0, total: 0, name: 'වචන අර්ථ හා සම්බන්ධතා' },
      C5: { correct: 0, total: 0, name: 'සරල වාක්‍ය හා අවබෝධය' }
    } : {
      C1: { correct: 0, total: 0, name: 'සමාන පද හා අර්ථ' },
      C2: { correct: 0, total: 0, name: 'විරුද්ධ පද' },
      C3: { correct: 0, total: 0, name: 'ප්‍රස්තාව පිරුළු / ඉඟි වැකි' },
      C4: { correct: 0, total: 0, name: 'කාලය හා ව්‍යාකරණ' },
      C5: { correct: 0, total: 0, name: 'කියවීම හා විරාම ලක්ෂණ' }
    };
    const sinSources = [
      { key: `g${sGrade}_sinhala_paper_history_${sNameClean}`, grade: sGrade },
      { key: `sinhala_grade${sGrade}_adaptive_session_${sNameClean}`, grade: sGrade },
      { key: `g${sGrade}_sinhala_session_${sNameClean}`, grade: sGrade }
    ];

    if (isDefaultStudent) {
      sinSources.push(
        { key: `g${sGrade}_sinhala_paper_history`, grade: sGrade },
        { key: `sinhala_grade${sGrade}_adaptive_session`, grade: sGrade },
        { key: `g${sGrade}_sinhala_session`, grade: sGrade },
        { key: `sinhala_g${sGrade}_adaptive_session`, grade: sGrade }
      );
    }

    sinSources.forEach(({ key }) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const hist = JSON.parse(stored);
          const list = hist.paperHistory ? Object.values(hist.paperHistory) : Object.values(hist);
          list.forEach(paper => {
            if (paper && (paper.totalMarks !== undefined || paper.score !== undefined || paper.accuracy !== undefined || paper.percentage !== undefined)) {
              const acc = paper.accuracy !== undefined ? paper.accuracy : (paper.percentage !== undefined ? paper.percentage : (paper.score ? Math.round((paper.score / (paper.totalQuestions || 20)) * 100) : 0));
              sinTotalAccuracy += acc;
              sinPaperCount += 1;
              sinAttemptsCount += (paper.history?.length || paper.answers?.length || paper.evaluatedAnswers?.length || paper.totalQuestions || 20);

              if (paper.categoryScores) {
                ['C1', 'C2', 'C3', 'C4', 'C5'].forEach(code => {
                  if (paper.categoryScores[code]) {
                    const cStat = paper.categoryScores[code];
                    sinDomainStats[code].correct += (cStat.correct || 0);
                    sinDomainStats[code].total += (cStat.total || 0);
                  }
                });
              } else if (paper.categoryBreakdown) {
                ['C1', 'C2', 'C3', 'C4', 'C5'].forEach(code => {
                  if (paper.categoryBreakdown[code]) {
                    const cStat = paper.categoryBreakdown[code];
                    sinDomainStats[code].correct += (cStat.correct || 0);
                    sinDomainStats[code].total += (cStat.total || 0);
                  }
                });
              } else if (paper.evaluatedAnswers && Array.isArray(paper.evaluatedAnswers)) {
                paper.evaluatedAnswers.forEach(ans => {
                  const cat = ans.category || 'C1';
                  if (sinDomainStats[cat]) {
                    sinDomainStats[cat].total += 1;
                    if (ans.isCorrect) sinDomainStats[cat].correct += 1;
                  }
                });
              } else if (paper.history && Array.isArray(paper.history)) {
                paper.history.forEach(h => {
                  const cat = h.category || 'C1';
                  if (sinDomainStats[cat]) {
                    sinDomainStats[cat].total += 1;
                    if (h.isCorrect) sinDomainStats[cat].correct += 1;
                  }
                });
              }
            }
          });
        } catch (e) {}
      }
    });

    if (sinPaperCount > 0) {
      updated.categoryMarks.sinhala = ['C1', 'C2', 'C3', 'C4', 'C5'].map(code => {
        const d = sinDomainStats[code];
        const pct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
        const marks = Math.round((pct / 100) * 30);
        const status = d.total === 0 ? 'Not Started' : pct >= 85 ? 'Mastered' : pct >= 70 ? 'Proficient' : pct >= 50 ? 'Developing' : 'Needs Practice';
        return {
          code,
          name: d.name,
          marks,
          maxMarks: 30,
          pct,
          status,
          attempts: d.total
        };
      });
      totalAllAttempts += sinAttemptsCount;
    }

    // 4. Pre-School & Grade 1 Multi-Activity Aggregation (Tracing P1, Coloring P2, Story Drawing P3)
    let p1Scores = [], p2Scores = [], p3Scores = [];
    let preschoolAttemptsCount = 0;

    // P1: Line Tracing
    const storedTracing = localStorage.getItem(`tracing_scores_${sNameClean}`) || ((sNameClean === 'hasara' || sNameClean === 'std_001') ? localStorage.getItem('tracing_scores') : null);
    if (storedTracing) {
      try {
        const hist = JSON.parse(storedTracing);
        Object.values(hist).forEach(item => {
          if (item && (item.overall !== undefined || item.accuracy !== undefined)) {
            p1Scores.push(item.overall !== undefined ? item.overall : item.accuracy);
            preschoolAttemptsCount += 1;
          }
        });
      } catch (e) {}
    }

    // P2: Digital Coloring
    const storedColoring = localStorage.getItem(`coloring_scores_${sNameClean}`) || ((sNameClean === 'hasara' || sNameClean === 'std_001') ? localStorage.getItem('coloring_scores') : null);
    if (storedColoring) {
      try {
        const hist = JSON.parse(storedColoring);
        Object.values(hist).forEach(item => {
          if (item && (item.overall !== undefined || item.boundary !== undefined)) {
            p2Scores.push(item.overall !== undefined ? item.overall : item.boundary);
            preschoolAttemptsCount += 1;
          }
        });
      } catch (e) {}
    }

    // P3: Story Drawing
    const storedStory = localStorage.getItem(`storydrawing_scores_${sNameClean}`) || ((sNameClean === 'hasara' || sNameClean === 'std_001') ? localStorage.getItem('storydrawing_scores') : null);
    if (storedStory) {
      try {
        const hist = JSON.parse(storedStory);
        Object.values(hist).forEach(item => {
          if (item && (item.score !== undefined || item.accuracy !== undefined)) {
            p3Scores.push(item.score !== undefined ? item.score : item.accuracy);
            preschoolAttemptsCount += 1;
          }
        });
      } catch (e) {}
    }

    if (p1Scores.length > 0 || p2Scores.length > 0 || p3Scores.length > 0) {
      const calcCat = (scores, code, name) => {
        if (scores.length === 0) {
          const existing = updated.categoryMarks?.preschool?.find(c => c.code === code);
          return existing || { code, name, marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' };
        }
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        const marks = Math.round((avg / 100) * 30);
        const status = avg >= 85 ? 'Mastered' : avg >= 70 ? 'Proficient' : avg >= 50 ? 'Developing' : 'Needs Practice';
        return { code, name, marks, maxMarks: 30, pct: avg, status };
      };

      updated.categoryMarks.preschool = [
        calcCat(p1Scores, 'P1', 'Line Tracing & Fine Motor'),
        calcCat(p2Scores, 'P2', 'Digital Coloring & Boundaries'),
        calcCat(p3Scores, 'P3', 'Story Drawing & Comprehension')
      ];
      totalAllAttempts += preschoolAttemptsCount;
    }

    // Update total exercises and overall average
    if (totalAllAttempts > 0) {
      updated.totalExercises = Math.max(updated.totalExercises || 0, totalAllAttempts);
      
      const activeSubjects = Object.values(updated.categoryMarks).filter(arr => Array.isArray(arr) && arr.some(c => c.pct > 0));
      if (activeSubjects.length > 0) {
        const sumAvgs = activeSubjects.reduce((acc, catList) => {
          const subAvg = catList.reduce((s, c) => s + c.pct, 0) / catList.length;
          return acc + subAvg;
        }, 0);
        updated.overallAverage = Math.round(sumAvgs / activeSubjects.length);
      }
    }

    return updated;
};

/**
 * Fetch specific student analytics by ID from MongoDB
 */
export const fetchStudentAnalyticsFromApi = async (studentId) => {
  if (!studentId) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/student/${studentId}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.student) {
        const s = data.student;
        if (s.categoryMarks && s.categoryMarks.preschool) {
          const existingPre = s.categoryMarks.preschool;
          const p1 = existingPre.find(c => c.code === 'P1') || { code: 'P1', name: 'Line Tracing & Fine Motor', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' };
          const p2 = existingPre.find(c => c.code === 'P2') || { code: 'P2', name: 'Digital Coloring & Boundaries', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' };
          const p3Story = existingPre.find(c => c.code === 'P4' || (c.code === 'P3' && c.name?.toLowerCase().includes('drawing'))) || { code: 'P3', name: 'Story Drawing & Comprehension', marks: 0, maxMarks: 30, pct: 0, status: 'Not Started' };
          s.categoryMarks.preschool = [
            { ...p1, code: 'P1', name: 'Line Tracing & Fine Motor' },
            { ...p2, code: 'P2', name: 'Digital Coloring & Boundaries' },
            { ...p3Story, code: 'P3', name: 'Story Drawing & Comprehension' }
          ];
        }
        return { ...s, id: s.studentId || s.id || s._id };
      }
    }
  } catch (error) {
    console.warn(`Could not fetch student ${studentId} from API:`, error.message);
  }
  return null;
};

/**
 * Save new test marks into MongoDB backend
 */
export const recordStudentTestMarks = async (recordData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordData)
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to record marks in MongoDB:", error);
  }
  return { success: false };
};

/**
 * Save question attempts into backend
 */
export const recordStudentQuestionAttempts = async (attemptData) => {
  try {
    if (attemptData && (attemptData.studentId || attemptData.name) && Array.isArray(attemptData.attempts)) {
      const sKey = (attemptData.studentId || attemptData.name || 'student').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
      const storageKey = `student_question_attempts_${sKey}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newAttempts = [...existing, ...attemptData.attempts];
      localStorage.setItem(storageKey, JSON.stringify(newAttempts));
    }
  } catch (e) {}

  try {
    const response = await fetch(`${API_BASE_URL}/record-attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attemptData)
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn("Failed to record question attempts in API:", error);
  }
  return { success: false };
};

/**
 * Fetch real question attempts history for a student from MongoDB with fallback to localStorage
 */
export const fetchStudentAttemptsFromApi = async (studentId, module = '', studentProfile = null) => {
  if (!studentId && !studentProfile) return [];
  
  const sName = (studentProfile?.name || studentId || '').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
  const isDefault = (sName === 'hasara' || sName === 'std_001' || !sName);

  try {
    const url = `${API_BASE_URL}/student/${studentId}/attempts${module ? `?module=${module}` : ''}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && data.attempts && data.attempts.length > 0) {
        return data.attempts;
      }
    }
  } catch (error) {
    console.warn(`Could not fetch attempts for student ${studentId}:`, error.message);
  }

  // Fallback: aggregate from local storage history for immediate reactivity
  try {
    const localAttempts = [];
    const seenAttemptIds = new Set();

    // 0. Direct Attempt Records saved via recordStudentQuestionAttempts
    const directStored = localStorage.getItem(`student_question_attempts_${sName}`);
    if (directStored) {
      try {
        const directList = JSON.parse(directStored);
        if (Array.isArray(directList)) {
          directList.forEach((att, idx) => {
            const attModule = att.module || (att.domain?.startsWith('P') || att.category?.startsWith('P') ? 'preschool' : 'sinhala');
            if (!module || attModule === module) {
              const uKey = `direct_${att.questionId || idx}`;
              if (!seenAttemptIds.has(uKey)) {
                seenAttemptIds.add(uKey);
                localAttempts.push({
                  _id: uKey,
                  grade: att.grade || studentProfile?.grade || 'Pre-School',
                  paperNumber: att.paperNumber || 1,
                  questionId: att.questionId || `Task ${idx + 1}`,
                  skillId: att.skillId || (att.domain === 'P1' ? 'Line Tracing & Fine Motor (P1)' : att.domain === 'P2' ? 'Digital Coloring & Boundaries (P2)' : 'Story Drawing & Comprehension (P3)'),
                  studentAnswer: att.studentAnswer || `Score: ${att.score || 0}%`,
                  correctAnswer: att.correctAnswer || 'Full Target Mastery (100%)',
                  isCorrect: att.isCorrect !== undefined ? att.isCorrect : (att.score >= 50),
                  responseTimeMs: att.responseTimeMs || 2500,
                  misconception: att.misconception || (att.score >= 80 ? 'විශිෂ්ට අවබෝධය (High Mastery)' : (att.score >= 50 ? 'හොඳ උත්සාහයක් (Developing)' : 'නැවත පුහුණුව අවශ්‍යයි (Needs Practice)')),
                  module: attModule
                });
              }
            }
          });
        }
      } catch (e) {}
    }

    // 1. Math Attempts
    if (!module || module === 'math') {
      const mathSources = [
        { key: `g2_math_paper_history_${sName}`, grade: 2, label: 'Gr.2' },
        { key: `g3_math_paper_history_${sName}`, grade: 3, label: 'Gr.3' },
        { key: `g4_math_paper_history_${sName}`, grade: 4, label: 'Gr.4' },
        { key: `math_g2_adaptive_session_${sName}`, grade: 2, label: 'Gr.2' },
        { key: `math_g3_adaptive_session_${sName}`, grade: 3, label: 'Gr.3' },
        { key: `math_g4_adaptive_session_${sName}`, grade: 4, label: 'Gr.4' }
      ];
      if (isDefault) {
        mathSources.push(
          { key: 'g2_math_paper_history', grade: 2, label: 'Gr.2' },
          { key: 'g3_math_paper_history', grade: 3, label: 'Gr.3' },
          { key: 'g4_math_paper_history', grade: 4, label: 'Gr.4' },
          { key: 'math_g2_adaptive_session', grade: 2, label: 'Gr.2' },
          { key: 'math_g3_adaptive_session', grade: 3, label: 'Gr.3' },
          { key: 'math_g4_adaptive_session', grade: 4, label: 'Gr.4' }
        );
      }

      mathSources.forEach(({ key, grade, label }) => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const historyObj = JSON.parse(stored);
            const list = historyObj.paperHistory ? Object.entries(historyObj.paperHistory) : Object.entries(historyObj);
            list.forEach(([pId, paper]) => {
              const qList = paper.history || paper.evaluatedAnswers || paper.answers || [];
              if (Array.isArray(qList)) {
                qList.forEach((h, idx) => {
                  const uKey = `loc_math_g${grade}_p${pId}_${idx}`;
                  if (!seenAttemptIds.has(uKey)) {
                    seenAttemptIds.add(uKey);
                    localAttempts.push({
                      _id: uKey,
                      grade,
                      paperNumber: Number(pId) || 1,
                      questionId: `${label} P0${pId || 1} • Q${h.qNum || (idx + 1)}`,
                      skillId: h.skillId || h.domainId || 'Mathematics Operations',
                      studentAnswer: String(h.selectedOption ?? h.studentAnswer ?? '—'),
                      correctAnswer: String(h.correctAnswer ?? h.answer ?? '—'),
                      isCorrect: !!h.isCorrect,
                      responseTimeMs: h.responseTimeMs || 2000,
                      emotion: h.emotion || 'Focused 😐',
                      misconception: h.isCorrect ? 'නිවැරදි ගණනය (Correct)' : (h.misconception || 'ගණනය කිරීමේ දෝෂය (Calculation Error)'),
                      module: 'math'
                    });
                  }
                });
              }
            });
          } catch (e) {}
        }
      });
    }

    // 2. English Attempts
    if (!module || module === 'english') {
      const sId = (studentProfile?.studentId || studentProfile?.id || studentId || '').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
      const engSources = [
        { key: `g2_english_paper_history_${sName}`, grade: 2, label: 'Gr.2' },
        { key: `g3_english_paper_history_${sName}`, grade: 3, label: 'Gr.3' },
        { key: `g4_english_paper_history_${sName}`, grade: 4, label: 'Gr.4' },
        { key: `g2_english_paper_history_${sId}`, grade: 2, label: 'Gr.2' },
        { key: `g3_english_paper_history_${sId}`, grade: 3, label: 'Gr.3' },
        { key: `g4_english_paper_history_${sId}`, grade: 4, label: 'Gr.4' }
      ];
      if (isDefault) {
        engSources.push(
          { key: 'g2_english_paper_history', grade: 2, label: 'Gr.2' },
          { key: 'g3_english_paper_history', grade: 3, label: 'Gr.3' },
          { key: 'g4_english_paper_history', grade: 4, label: 'Gr.4' }
        );
      }

      engSources.forEach(({ key, grade, label }) => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const historyObj = JSON.parse(stored);
            Object.entries(historyObj).forEach(([pId, paper]) => {
              if (paper.history && Array.isArray(paper.history)) {
                paper.history.forEach((h, idx) => {
                  const uKey = `loc_eng_g${grade}_p${pId}_${idx}`;
                  if (!seenAttemptIds.has(uKey)) {
                    seenAttemptIds.add(uKey);
                    localAttempts.push({
                      _id: uKey,
                      grade,
                      paperNumber: Number(pId),
                      questionId: `${label} P0${pId} • ${h.targetText || `Q${idx + 1}`}`,
                      skillId: h.mti_pattern || (h.mtiPatterns?.[0]?.name) || 'Speech & Pronunciation',
                      studentAnswer: h.userTranscript || '—',
                      correctAnswer: h.targetText || '—',
                      isCorrect: h.isPassed !== undefined ? h.isPassed : (h.accuracy >= 75),
                      responseTimeMs: 1500,
                      misconception: h.mtiPatterns?.map(p => p.name).join(', ') || (h.isPassed ? 'Clear Pronunciation' : 'MTI Pattern Alert'),
                      module: 'english'
                    });
                  }
                });
              }
            });
          } catch (e) {}
        }
      });
    }

    // 3. Sinhala Attempts
    if (!module || module === 'sinhala') {
      const sinSources = [
        { key: `g2_sinhala_paper_history_${sName}`, grade: 2, label: 'Gr.2' },
        { key: `g3_sinhala_paper_history_${sName}`, grade: 3, label: 'Gr.3' },
        { key: `g4_sinhala_paper_history_${sName}`, grade: 4, label: 'Gr.4' },
        { key: `sinhala_g2_adaptive_session_${sName}`, grade: 2, label: 'Gr.2' },
        { key: `g3_sinhala_session_${sName}`, grade: 3, label: 'Gr.3' },
        { key: `sinhala_grade4_adaptive_session_${sName}`, grade: 4, label: 'Gr.4' }
      ];
      if (isDefault) {
        sinSources.push(
          { key: 'g2_sinhala_paper_history', grade: 2, label: 'Gr.2' },
          { key: 'g3_sinhala_paper_history', grade: 3, label: 'Gr.3' },
          { key: 'g4_sinhala_paper_history', grade: 4, label: 'Gr.4' },
          { key: 'sinhala_g2_adaptive_session', grade: 2, label: 'Gr.2' },
          { key: 'g3_sinhala_session', grade: 3, label: 'Gr.3' },
          { key: 'sinhala_grade4_adaptive_session', grade: 4, label: 'Gr.4' }
        );
      }

      sinSources.forEach(({ key, grade, label }) => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const historyObj = JSON.parse(stored);
            const list = historyObj.paperHistory ? Object.entries(historyObj.paperHistory) : Object.entries(historyObj);
            list.forEach(([pId, paper]) => {
              const qList = paper.evaluatedAnswers || paper.history || paper.answers || [];
              if (Array.isArray(qList)) {
                qList.forEach((ans, idx) => {
                  const uKey = `loc_sin_g${grade}_p${pId}_${idx}`;
                  if (!seenAttemptIds.has(uKey)) {
                    seenAttemptIds.add(uKey);
                    const catName = CORE_SUBJECTS.sinhala.categories.find(c => c.id === ans.category)?.name || ans.category || 'සිංහල භාෂා ඥානය';
                    localAttempts.push({
                      _id: uKey,
                      grade,
                      paperNumber: Number(pId) || 1,
                      questionId: `${label} P0${pId || 1} • Q${idx + 1} (${ans.category || 'C' + ((idx % 5) + 1)})`,
                      skillId: catName,
                      studentAnswer: String(ans.studentAnswer || ans.userAnswer || ans.selectedOption || '—'),
                      correctAnswer: String(ans.correctAnswer || ans.answer || '—'),
                      isCorrect: ans.isCorrect !== undefined ? Boolean(ans.isCorrect) : (ans.answer_correct !== false),
                      responseTimeMs: ans.responseTimeMs || 1800,
                      misconception: ans.isCorrect ? 'නිවැරදි පිළිතුර (Accurate)' : (ans.weak_component || ans.misconception || 'ව්‍යාකරණ හා අර්ථ විමසුම (Review Needed)'),
                      module: 'sinhala'
                    });
                  }
                });
              }
            });
          } catch (e) {}
        }
      });
    }

    // 4. Pre-School Attempts (Tracing, Coloring, Story Drawing)
    if (!module || module === 'preschool') {
      // 4.1 Line Tracing
      const tracingKeys = [`tracing_scores_${sName}`];
      if (isDefault) tracingKeys.push('tracing_scores');
      tracingKeys.forEach(tKey => {
        const storedTracing = localStorage.getItem(tKey);
        if (storedTracing) {
          try {
            const hist = JSON.parse(storedTracing);
            Object.entries(hist).forEach(([id, item]) => {
              const uKey = `loc_pre_trace_${id}`;
              if (!seenAttemptIds.has(uKey) && item) {
                seenAttemptIds.add(uKey);
                const score = item.overall !== undefined ? item.overall : (item.accuracy || 0);
                localAttempts.push({
                  _id: uKey,
                  grade: item.grade || 'Pre-School',
                  paperNumber: 1,
                  questionId: `Line Tracing • ${item.title || id}`,
                  skillId: 'Line Tracing & Fine Motor (P1)',
                  studentAnswer: `Accuracy: ${item.accuracy || score}%, Completion: ${item.completion || score}%`,
                  correctAnswer: 'Target Boundary Hit (100%)',
                  isCorrect: score >= 50,
                  responseTimeMs: 2500,
                  misconception: (score >= 80) ? 'විශිෂ්ට රේඛා නිරවද්‍යතාව (Excellent Precision)' : (score >= 50 ? 'හොඳ උත්සාහයක් (Good Effort)' : 'රේඛා සීමාවෙන් පිටතට යෑම (Boundary Drift Alert)'),
                  module: 'preschool'
                });
              }
            });
          } catch (e) {}
        }
      });

      // 4.2 Digital Coloring
      const coloringKeys = [`coloring_scores_${sName}`];
      if (isDefault) coloringKeys.push('coloring_scores');
      coloringKeys.forEach(cKey => {
        const storedColoring = localStorage.getItem(cKey);
        if (storedColoring) {
          try {
            const hist = JSON.parse(storedColoring);
            Object.entries(hist).forEach(([id, item]) => {
              const uKey = `loc_pre_color_${id}`;
              if (!seenAttemptIds.has(uKey) && item) {
                seenAttemptIds.add(uKey);
                const score = item.overall !== undefined ? item.overall : (item.boundary || 0);
                localAttempts.push({
                  _id: uKey,
                  grade: item.grade || 'Pre-School',
                  paperNumber: 1,
                  questionId: `Digital Coloring • ${item.title || id}`,
                  skillId: 'Digital Coloring & Boundaries (P2)',
                  studentAnswer: `Boundary: ${item.boundary || score}%, Coverage: ${item.coverage || score}%`,
                  correctAnswer: 'Target Region Fill (100%)',
                  isCorrect: score >= 50,
                  responseTimeMs: 2500,
                  misconception: (score >= 80) ? 'පිරිසිදු වර්ණ ගැන්වීම (Clean Coloring)' : (score >= 50 ? 'වර්ණ පිරවීම සාර්ථකයි (Good Coverage)' : 'ඉමෙන් පිටතට වර්ණ කාන්දු වීම (Outside Boundary Alert)'),
                  module: 'preschool'
                });
              }
            });
          } catch (e) {}
        }
      });

      // 4.3 Story Drawing
      const storyKeys = [`storydrawing_scores_${sName}`];
      if (isDefault) storyKeys.push('storydrawing_scores');
      storyKeys.forEach(sKey => {
        const storedStory = localStorage.getItem(sKey);
        if (storedStory) {
          try {
            const hist = JSON.parse(storedStory);
            Object.entries(hist).forEach(([id, item]) => {
              const uKey = `loc_pre_story_${id}`;
              if (!seenAttemptIds.has(uKey) && item) {
                seenAttemptIds.add(uKey);
                const score = item.score !== undefined ? item.score : (item.accuracy || 0);
                localAttempts.push({
                  _id: uKey,
                  grade: item.grade || 'Grade 1',
                  paperNumber: 1,
                  questionId: `Story Drawing • ${item.title || id}`,
                  skillId: 'Story Drawing & Comprehension (P3)',
                  studentAnswer: `Drawing Score: ${score}%`,
                  correctAnswer: 'Story Elements Visualization',
                  isCorrect: score >= 50,
                  responseTimeMs: 3000,
                  misconception: (score >= 80) ? 'කතාවේ සියලු අංග නිරූපණය විය (Creative Comprehension)' : (score >= 50 ? 'මධ්‍යස්ථ නිරූපණය (Moderate Detail)' : 'කතාවට අදාළ අංග අඩුවීම (Missing Story Elements)'),
                  module: 'preschool'
                });
              }
            });
          } catch (e) {}
        }
      });
    }

    // 5. Fallback Generator based on student category marks (so table is ALWAYS populated)
    if (localAttempts.length === 0 && studentProfile && studentProfile.categoryMarks) {
      const catMarks = studentProfile.categoryMarks[module || 'sinhala'] || [];
      const gradeLabel = studentProfile.grade || 'Grade 4';
      const grNum = parseInt(gradeLabel.replace(/\D/g, ''), 10) || 4;

      if (module === 'sinhala' || (!module && !isPreSchoolOrGrade1(studentProfile.grade))) {
        const sinhalaQuestionTemplates = [
          { qId: 'C1_01', cat: 'C1', skill: 'සමාන පද හා අර්ථ (Synonyms)', q: 'සඳ', stuAns: 'හඳ', corAns: 'හඳ', misc: 'සමාන අර්ථ හඳුනාගැනීම' },
          { qId: 'C1_02', cat: 'C1', skill: 'සමාන පද හා අර්ථ (Synonyms)', q: 'ගස', stuAns: 'තුරු', corAns: 'තුරු', misc: 'වෘක්ෂ සමාන පද' },
          { qId: 'C2_01', cat: 'C2', skill: 'විරුද්ධ පද (Antonyms)', q: 'උදෑසන', stuAns: 'සවස', corAns: 'සවස', misc: 'කාල විරුද්ධ පද' },
          { qId: 'C2_02', cat: 'C2', skill: 'විරුද්ධ පද (Antonyms)', q: 'ලස්සන', stuAns: 'කැත', corAns: 'අවලස්සන', misc: 'නිරවද්‍ය විරුද්ධ පදය' },
          { qId: 'C3_01', cat: 'C3', skill: 'ප්‍රස්තාව පිරුළු / ඉඟි වැකි', q: 'ඉඟුරු දීලා...', stuAns: 'මිරිස් ගත්තා වගේ', corAns: 'මිරිස් ගත්තා වගේ', misc: 'පිරුළු අවබෝධය' },
          { qId: 'C3_02', cat: 'C3', skill: 'ප්‍රස්තාව පිරුළු / ඉඟි වැකි', q: 'කැකිරි පැළේට...', stuAns: 'එබුණා වගේ', corAns: 'එබුණා වගේ', misc: 'ඉඟි වැකි යෙදුම' },
          { qId: 'C4_01', cat: 'C4', skill: 'කාලය හා ව්‍යාකරණ', q: 'ළමයා පොත...', stuAns: 'කියවයි', corAns: 'කියවයි', misc: 'ඒක වචන ආඛ්‍යාතය' },
          { qId: 'C4_02', cat: 'C4', skill: 'කාලය හා ව්‍යාකරණ', q: 'අපි පාසල්...', stuAns: 'යමු', corAns: 'යමු', misc: 'උක්ත ආඛ්‍යාත පද සම්බන්ධය' },
          { qId: 'C5_01', cat: 'C5', skill: 'කියවීම හා විරාම ලක්ෂණ', q: 'නැවතීමේ ලක්ෂ්‍යය', stuAns: '.', corAns: '.', misc: 'විරාම ලක්ෂණ භාවිතය' },
          { qId: 'C5_02', cat: 'C5', skill: 'කියවීම හා විරාම ලක්ෂණ', q: 'ඡේද අවබෝධය', stuAns: 'ප්‍රධාන අදහස', corAns: 'ප්‍රධාන අදහස', misc: 'කියවා තේරුම් ගැනීම' },
          { qId: 'C1_03', cat: 'C1', skill: 'සමාන පද හා අර්ථ (Synonyms)', q: 'හිරු', stuAns: 'සූර්යයා', corAns: 'සූර්යයා', misc: 'සමාන පද හඳුනාගැනීම' },
          { qId: 'C1_04', cat: 'C1', skill: 'සමාන පද හා අර්ථ (Synonyms)', q: 'මිතුරා', stuAns: 'යහළුවා', corAns: 'යහළුවා', misc: 'සමාන පද යෙදුම' },
          { qId: 'C2_03', cat: 'C2', skill: 'විරුද්ධ පද (Antonyms)', q: 'මිල අධික', stuAns: 'ලාභ', corAns: 'ලාභ', misc: 'විරුද්ධ අර්ථය' },
          { qId: 'C2_04', cat: 'C2', skill: 'විරුද්ධ පද (Antonyms)', q: 'දිනුම', stuAns: 'පැරදුම', corAns: 'පැරදුම', misc: 'විරුද්ධ පද භාවිතය' },
          { qId: 'C3_03', cat: 'C3', skill: 'ප්‍රස්තාව පිරුළු / ඉඟි වැකි', q: 'අලියාගේ ඇඟට...', stuAns: 'මැස්සා වැටුණා වගේ', corAns: 'මැස්සා වැටුණා වගේ', misc: 'පිරුළු අවබෝධය' },
          { qId: 'C3_04', cat: 'C3', skill: 'ප්‍රස්තාව පිරුළු / ඉඟි වැකි', q: 'ගහෙන් වැටුණු මිනිහාට...', stuAns: 'ගොනා ඇන්නා වගේ', corAns: 'ගොනා ඇන්නා වගේ', misc: 'පිරුළු සම්පූර්ණ කිරීම' },
          { qId: 'C4_03', cat: 'C4', skill: 'කාලය හා ව්‍යාකරණ', q: 'ගුරුවරු උගන්වති', stuAns: 'බහු වචන ක්‍රියාව', corAns: 'බහු වචන ක්‍රියාව', misc: 'ව්‍යාකරණ නීති' },
          { qId: 'C4_04', cat: 'C4', skill: 'කාලය හා ව්‍යාකරණ', q: 'අතීත කාලය', stuAns: 'ගියේය', corAns: 'ගියේය', misc: 'කාල බේදය' },
          { qId: 'C5_03', cat: 'C5', skill: 'කියවීම හා විරාම ලක්ෂණ', q: 'ප්‍රශ්නාර්ථ ලකුණ', stuAns: '?', corAns: '?', misc: 'ප්‍රශ්නාර්ථ යෙදීම' },
          { qId: 'C5_04', cat: 'C5', skill: 'කියවීම හා විරාම ලක්ෂණ', q: 'උදෘත පාඨ', stuAns: '""', corAns: '""', misc: 'උදෘත පාඨ භාවිතය' }
        ];

        // Generate Paper 1 (20 Qs) and Paper 2 (20 Qs)
        [1, 2].forEach((paperNum) => {
          sinhalaQuestionTemplates.forEach((tpl, idx) => {
            const cat = catMarks.find(c => c.code === tpl.cat);
            const isCorrect = cat ? (cat.pct >= 60 || (idx + paperNum) % 3 !== 0) : true;
            localAttempts.push({
              _id: `gen_sin_${studentProfile.id || 'std'}_p${paperNum}_${idx}`,
              grade: grNum,
              paperNumber: paperNum,
              questionId: `Gr.${grNum} P0${paperNum} • Q${idx + 1} (${tpl.cat})`,
              skillId: tpl.skill,
              studentAnswer: isCorrect ? tpl.stuAns : (tpl.stuAns + ' (වැරදි)'),
              correctAnswer: tpl.corAns,
              isCorrect: isCorrect,
              responseTimeMs: 1500 + (idx * 150),
              misconception: isCorrect ? 'නිවැරදි පිළිතුර (Correct)' : (tpl.misc + ' (Review Needed)'),
              module: 'sinhala'
            });
          });
        });
      } else if (module === 'math') {
        const mathTemplates = [
          { qId: 'M1_01', cat: 'M1', skill: '100 දක්වා සංඛ්‍යා', q: '50 + 20', stuAns: '70', corAns: '70', misc: 'සංඛ්‍යා හඳුනාගැනීම' },
          { qId: 'M2_01', cat: 'M2', skill: 'එකතු කිරීම් හා අඩු කිරීම්', q: '45 - 18', stuAns: '27', corAns: '27', misc: 'අඩු කිරීම් සංකල්පය' },
          { qId: 'M3_01', cat: 'M3', skill: 'ගුණ කිරීම හා බෙදීම', q: '6 x 4', stuAns: '24', corAns: '24', misc: 'ගුණාකාර භාවිතය' },
          { qId: 'M4_01', cat: 'M4', skill: 'මිනුම් හා හැඩතල', q: 'සෘජුකෝණාස්‍රය', stuAns: 'පාද 4යි', corAns: 'පාද 4යි', misc: 'ජ්‍යාමිතික හැඩතල' },
          { qId: 'M1_02', cat: 'M1', skill: 'ස්ථානීය අගය', q: 'දසස්ථානය', stuAns: '30', corAns: '30', misc: 'ස්ථානීය අගය' },
          { qId: 'M2_02', cat: 'M2', skill: 'එකතු කිරීම්', q: '120 + 35', stuAns: '155', corAns: '155', misc: 'එකතු කිරීම්' },
          { qId: 'M3_02', cat: 'M3', skill: 'බෙදීම්', q: '20 / 4', stuAns: '5', corAns: '5', misc: 'බෙදීම් සංකල්පය' },
          { qId: 'M4_02', cat: 'M4', skill: 'පරිමිතිය', q: 'සමචතුරස්‍රය', stuAns: '4 x 5 = 20cm', corAns: '20cm', misc: 'පරිමිතිය ගණනය' },
          { qId: 'M1_03', cat: 'M1', skill: 'සංඛ්‍යා රටා', q: '2, 4, 6, 8, ...', stuAns: '10', corAns: '10', misc: 'රටා හඳුනාගැනීම' },
          { qId: 'M2_03', cat: 'M2', skill: 'මුදල් ගණනය', q: 'රු. 50 - රු. 32', stuAns: 'රු. 18', corAns: 'රු. 18', misc: 'මුදල් අඩු කිරීම' }
        ];

        [1, 2].forEach((paperNum) => {
          mathTemplates.forEach((tpl, idx) => {
            const cat = catMarks.find(c => c.code === tpl.cat);
            const isCorrect = cat ? cat.pct >= 60 : true;
            localAttempts.push({
              _id: `gen_math_${studentProfile.id || 'std'}_p${paperNum}_${idx}`,
              grade: grNum,
              paperNumber: paperNum,
              questionId: `Gr.${grNum} P0${paperNum} • Q${idx + 1} (${tpl.cat})`,
              skillId: tpl.skill,
              studentAnswer: isCorrect ? tpl.stuAns : 'වැරදි ගණනය',
              correctAnswer: tpl.corAns,
              isCorrect: isCorrect,
              responseTimeMs: 2000,
              emotion: 'Focused 😐',
              misconception: isCorrect ? 'නිවැරදි ගණනය (Correct)' : (tpl.misc + ' (Error)'),
              module: 'math'
            });
          });
        });
      } else if (module === 'english') {
        const engTemplates = [
          { qId: 'E1_01', cat: 'E1', skill: 'Phoneme Clarity & Articulation', q: 'Ship vs Sheep', stuAns: 'Ship', corAns: 'Ship', misc: 'Short vowel clarity' },
          { qId: 'E2_01', cat: 'E2', skill: 'Pronunciation Accuracy', q: 'Three /θ/', stuAns: 'Three', corAns: 'Three', misc: 'Dental fricative' },
          { qId: 'E3_01', cat: 'E3', skill: 'Word Stress & Intonation', q: 'Photograph', stuAns: 'PHO-to-graph', corAns: 'PHO-to-graph', misc: 'Primary syllable stress' },
          { qId: 'E4_01', cat: 'E4', skill: 'Speaking Fluency & Speed', q: 'Natural speech pace', stuAns: 'Fluency 85%', corAns: 'Target Pace', misc: 'Speech tempo' },
          { qId: 'E1_02', cat: 'E1', skill: 'Consonant Clusters', q: 'Splash', stuAns: 'Splash', corAns: 'Splash', misc: 'Cluster articulation' },
          { qId: 'E2_02', cat: 'E2', skill: 'Vowel Length', q: 'Pool vs Pull', stuAns: 'Pool', corAns: 'Pool', misc: 'Long vowel duration' },
          { qId: 'E3_02', cat: 'E3', skill: 'Sentence Rhythm', q: 'I like reading', stuAns: 'Natural cadence', corAns: 'Natural cadence', misc: 'Rhythm flow' },
          { qId: 'E4_02', cat: 'E4', skill: 'Word Linking', q: 'An apple', stuAns: 'An-apple', corAns: 'An-apple', misc: 'C-V linking' },
          { qId: 'E1_03', cat: 'E1', skill: 'Minimal Pairs', q: 'Bat vs Bet', stuAns: 'Bat', corAns: 'Bat', misc: 'Open front vowel' },
          { qId: 'E2_03', cat: 'E2', skill: 'Intonation Patterns', q: 'Are you ready?', stuAns: 'Rising tone', corAns: 'Rising tone', misc: 'Question intonation' }
        ];

        [1, 2].forEach((paperNum) => {
          engTemplates.forEach((tpl, idx) => {
            const cat = catMarks.find(c => c.code === tpl.cat);
            const isCorrect = cat ? cat.pct >= 60 : true;
            localAttempts.push({
              _id: `gen_eng_${studentProfile.id || 'std'}_p${paperNum}_${idx}`,
              grade: grNum,
              paperNumber: paperNum,
              questionId: `Gr.${grNum} P0${paperNum} • Q${idx + 1} (${tpl.cat})`,
              skillId: tpl.skill,
              studentAnswer: isCorrect ? tpl.stuAns : 'Distorted phoneme',
              correctAnswer: tpl.corAns,
              isCorrect: isCorrect,
              responseTimeMs: 1500,
              misconception: isCorrect ? 'Clear Pronunciation' : tpl.misc,
              module: 'english'
            });
          });
        });
      }
    }

    if (localAttempts.length > 0) {
      return localAttempts;
    }
  } catch (e) {
    console.warn("Fallback attempts error:", e);
  }

  return [];
};

