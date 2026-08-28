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

/**
 * Fetch all students analytics from MongoDB via backend API
 */
export const fetchStudentsAnalyticsFromApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.students) {
        return data.students.map(s => ({ ...s, id: s.studentId || s.id || s._id }));
      }
    }
  } catch (error) {
    console.warn("MongoDB Analytics API lookup:", error.message);
  }
  return [];
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
        return { ...data.student, id: data.student.studentId || data.student.id || data.student._id };
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
 * Fetch real question attempts history for a student from MongoDB
 */
export const fetchStudentAttemptsFromApi = async (studentId, module = '') => {
  if (!studentId) return [];
  try {
    const url = `${API_BASE_URL}/student/${studentId}/attempts${module ? `?module=${module}` : ''}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && data.attempts) {
        return data.attempts;
      }
    }
  } catch (error) {
    console.warn(`Could not fetch attempts for student ${studentId}:`, error.message);
  }
  return [];
};

