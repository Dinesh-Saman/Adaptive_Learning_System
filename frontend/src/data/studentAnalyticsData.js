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
      { id: 'P1', name: 'Line Tracing & Fine Motor (රේඛා ඇඳීම)', weight: 0.30 },
      { id: 'P2', name: 'Digital Coloring & Boundaries (පාට කිරීම)', weight: 0.25 },
      { id: 'P3', name: 'Paper Craft & Origami Steps (කඩදාසි නිර්මාණ)', weight: 0.25 },
      { id: 'P4', name: 'Story Drawing & Comprehension (චිත්‍ර ඇඳීම)', weight: 0.20 }
    ]
  }
};

export const STUDENT_PROFILES = [
  {
    id: 'std_001',
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
    id: 'std_002',
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
    id: 'std_003',
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

export const getStudentAnalytics = (studentId) => {
  return STUDENT_PROFILES.find(s => s.id === studentId) || STUDENT_PROFILES[0];
};
