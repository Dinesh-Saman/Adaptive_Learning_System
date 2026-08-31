import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  TrendingUp, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Compass, 
  ChevronLeft,
  ChevronRight, 
  BarChart3, 
  Calendar, 
  Layers, 
  ArrowUpRight, 
  Database, 
  X, 
  Lock 
} from 'lucide-react';
import { CORE_SUBJECTS, fetchStudentAttemptsFromApi, getStudentPapersHistory } from '../../data/studentAnalyticsData';

export const isPreSchoolOrGrade1 = (gradeStr) => {
  if (!gradeStr) return false;
  const g = gradeStr.toLowerCase().trim();
  return g.includes('pre') || g.includes('preschool') || g.includes('pre-school') || g.includes('grade 1') || g === '1';
};

export const getNumericGrade = (gradeStr) => {
  if (!gradeStr) return 2;
  const g = String(gradeStr).toLowerCase().trim();
  if (g.includes('4')) return 4;
  if (g.includes('3')) return 3;
  if (g.includes('2')) return 2;
  if (g.includes('1') || g.includes('pre')) return 1;
  return 2;
};

const CategoryStudentTable = ({ subjectKey = 'math', students = [] }) => {
  const navigate = useNavigate();
  const subject = CORE_SUBJECTS[subjectKey] || CORE_SUBJECTS.math;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('all');
  const [activeStudentModal, setActiveStudentModal] = useState(null);
  const [studentAttempts, setStudentAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [activeChartSubject, setActiveChartSubject] = useState('all');
  const [selectedAttemptPaper, setSelectedAttemptPaper] = useState('all');
  const [attemptPage, setAttemptPage] = useState(1);
  const attemptsPerPage = 10;

  // Helper to calculate student overall average score across all papers in this subject or selected domain
  const getSubjectScore = (student) => {
    if (!student) return 0;
    
    // Check if student has completed papers in this subject
    const papers = getStudentPapersHistory(student, subjectKey);
    
    if (selectedDomainFilter === 'all') {
      if (papers && papers.length > 0) {
        const totalAccuracy = papers.reduce((acc, p) => acc + (p.accuracy || 0), 0);
        return Math.round(totalAccuracy / papers.length);
      }
      if (student.categoryMarks && student.categoryMarks[subjectKey]) {
        const items = student.categoryMarks[subjectKey].filter(c => c.pct > 0);
        if (items.length > 0) {
          const total = items.reduce((acc, curr) => acc + (curr.pct || 0), 0);
          return Math.round(total / items.length);
        }
      }
      return 0;
    } else {
      // Specific domain selected (e.g. C1, C2, M1, etc.)
      let totalDomainQs = 0;
      let correctDomainQs = 0;

      if (papers && papers.length > 0) {
        papers.forEach(p => {
          if (p.categoryScores && p.categoryScores[selectedDomainFilter]) {
            const cs = p.categoryScores[selectedDomainFilter];
            correctDomainQs += (cs.correct || 0);
            totalDomainQs += (cs.total || 0);
          } else if (p.history && Array.isArray(p.history)) {
            const domQs = p.history.filter(h => h.category === selectedDomainFilter || (h.skillId && h.skillId.includes(selectedDomainFilter)));
            if (domQs.length > 0) {
              totalDomainQs += domQs.length;
              correctDomainQs += domQs.filter(h => h.isCorrect).length;
            }
          }
        });
      }

      if (totalDomainQs > 0) {
        return Math.round((correctDomainQs / totalDomainQs) * 100);
      }
      
      // Fallback to student.categoryMarks[subjectKey]
      if (student.categoryMarks && student.categoryMarks[subjectKey]) {
        const domainCat = student.categoryMarks[subjectKey].find(c => c.code === selectedDomainFilter);
        if (domainCat && domainCat.pct > 0) return Math.round(domainCat.pct || 0);
      }
      return 0;
    }
  };

  // Helper to calculate student attempts in this subject or selected domain
  const getStudentAttempts = (student) => {
    if (!student) return 0;
    const papers = getStudentPapersHistory(student, subjectKey);
    if (papers && papers.length > 0) {
      if (selectedDomainFilter === 'all') {
        return papers.reduce((acc, p) => acc + (p.totalQuestions || p.history?.length || 20), 0);
      } else {
        return papers.reduce((acc, p) => {
          if (p.categoryScores && p.categoryScores[selectedDomainFilter]) {
            return acc + (p.categoryScores[selectedDomainFilter].total || 0);
          }
          if (p.history && Array.isArray(p.history)) {
            const domQs = p.history.filter(h => h.category === selectedDomainFilter || (h.skillId && h.skillId.includes(selectedDomainFilter)));
            return acc + domQs.length;
          }
          return acc;
        }, 0);
      }
    }
    return 0;
  };

  const getSubScoreForModal = (student, subKey) => {
    if (!student) return 0;
    const papers = getStudentPapersHistory(student, subKey);
    if (papers && papers.length > 0) {
      const totalAccuracy = papers.reduce((acc, p) => acc + (p.accuracy || 0), 0);
      return Math.round(totalAccuracy / papers.length);
    }
    if (student.categoryMarks && student.categoryMarks[subKey]) {
      const items = student.categoryMarks[subKey].filter(c => c.pct > 0);
      if (items.length > 0) {
        const total = items.reduce((acc, curr) => acc + (curr.pct || 0), 0);
        return Math.round(total / items.length);
      }
    }
    return 0;
  };

  const getDomainBreakdownForModal = (student, subKey) => {
    if (!student || !student.categoryMarks || !student.categoryMarks[subKey]) return [];
    const baseCategories = student.categoryMarks[subKey];
    const papers = getStudentPapersHistory(student, subKey);
    const sGrade = getNumericGrade(student.grade);
    
    // Grade-specific Sinhala Category Names
    const grade2SinhalaNames = {
      C1: 'අකුරු හා අක්ෂර හඳුනාගැනීම',
      C2: 'පිල්ලම් භාවිතය',
      C3: 'සරල වචන කියවීම හා ලිවීම',
      C4: 'වචන අර්ථ හා සම්බන්ධතා',
      C5: 'සරල වාක්‍ය හා අවබෝධය'
    };

    // Aggregate category stats across all completed papers
    const catStats = {};
    baseCategories.forEach(c => {
      catStats[c.code] = { correct: 0, total: 0 };
    });

    if (papers && papers.length > 0) {
      papers.forEach(p => {
        if (p.categoryScores) {
          Object.entries(p.categoryScores).forEach(([code, stat]) => {
            if (catStats[code]) {
              catStats[code].correct += (stat.correct || 0);
              catStats[code].total += (stat.total || 0);
            }
          });
        } else if (p.history && Array.isArray(p.history)) {
          p.history.forEach(h => {
            const code = h.category || (h.skillId && h.skillId.startsWith('C') ? h.skillId.substring(0, 2) : null);
            if (code && catStats[code]) {
              catStats[code].total += 1;
              if (h.isCorrect) catStats[code].correct += 1;
            }
          });
        }
      });
    }

    return baseCategories.map(cat => {
      const stat = catStats[cat.code] || { correct: 0, total: 0 };
      const domainName = (subKey === 'sinhala' && sGrade === 2 && grade2SinhalaNames[cat.code])
        ? grade2SinhalaNames[cat.code]
        : cat.name;

      if (stat.total > 0) {
        const pct = Math.round((stat.correct / stat.total) * 100);
        const marks = Math.round((pct / 100) * (cat.maxMarks || 30));
        const status = pct >= 85 ? 'Mastered' : pct >= 70 ? 'Proficient' : pct >= 50 ? 'Developing' : 'Needs Practice';
        return {
          ...cat,
          name: domainName,
          correct: stat.correct,
          total: stat.total,
          marks,
          pct,
          status,
          attempts: stat.total
        };
      }
      return {
        ...cat,
        name: domainName,
        correct: 0,
        total: 0,
        marks: 0,
        pct: 0,
        status: 'Not Started',
        attempts: 0
      };
    });
  };

  const getStudentStatus = (score) => {
    if (score >= 85) return { label: 'Mastered ⭐', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (score >= 70) return { label: 'Proficient 👍', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (score >= 50) return { label: 'Developing 📈', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    if (score > 0) return { label: 'Needs Practice ⚠️', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    return { label: 'Not Started', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  };

  // Grade-based strict filtering rule
  const eligibleStudents = (students || []).filter((st) => {
    if (!st) return false;
    const isPreSchool = isPreSchoolOrGrade1(st.grade);
    if (subjectKey === 'preschool') {
      return isPreSchool;
    } else {
      return !isPreSchool;
    }
  });

  // Filter students based on search query
  const filteredStudents = eligibleStudents.filter((st) => {
    const matchesSearch = !searchQuery || 
                          (st.name && st.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (st.grade && st.grade.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Load question attempts when a student modal is opened
  const handleOpenStudentModal = async (student) => {
    setActiveStudentModal(student);
    setActiveChartSubject('all');
    setSelectedAttemptPaper('all');
    setAttemptPage(1);
    setLoadingAttempts(true);
    try {
      const attempts = await fetchStudentAttemptsFromApi(student.studentId || student.id, subjectKey, student);
      setStudentAttempts(attempts);
    } catch (e) {
      console.warn("Attempts load error:", e);
      setStudentAttempts([]);
    } finally {
      setLoadingAttempts(false);
    }
  };

  // SVG Chart Calculation for Individual Student in Modal
  const chartWidth = 600;
  const chartHeight = 220;
  const padding = { top: 25, right: 25, bottom: 35, left: 45 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const weeklyData = activeStudentModal && activeStudentModal.weeklyProgress && activeStudentModal.weeklyProgress.length > 0 
    ? activeStudentModal.weeklyProgress 
    : [
        { 
          week: 'Week 1', 
          math: getSubScoreForModal(activeStudentModal, 'math'), 
          sinhala: getSubScoreForModal(activeStudentModal, 'sinhala'), 
          english: getSubScoreForModal(activeStudentModal, 'english'), 
          preschool: getSubScoreForModal(activeStudentModal, 'preschool'), 
          average: activeStudentModal?.overallAverage || 0 
        }
      ];

  const weeks = weeklyData.map(w => w.week);
  const getX = (index) => padding.left + (index / Math.max(1, weeks.length - 1)) * graphWidth;
  const getY = (val) => padding.top + graphHeight - ((Math.max(0, Math.min(100, val))) / 100) * graphHeight;

  const getLinePath = (key) => {
    return weeklyData
      .map((item, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(item[key] || 0)}`)
      .join(' ');
  };

  const getAreaPath = (key) => {
    const line = getLinePath(key);
    const firstX = getX(0);
    const lastX = getX(weeklyData.length - 1);
    const bottomY = padding.top + graphHeight;
    return `${line} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  // Radar chart calculations for Individual Student
  const isModalPreSchool = activeStudentModal && isPreSchoolOrGrade1(activeStudentModal.grade);

  const radarPoints = activeStudentModal ? (
    isModalPreSchool ? [
      { label: 'Line Tracing', val: activeStudentModal.categoryMarks?.preschool?.find(c => c.code === 'P1')?.pct || getSubScoreForModal(activeStudentModal, 'preschool'), angle: -Math.PI / 2 },
      { label: 'Coloring', val: activeStudentModal.categoryMarks?.preschool?.find(c => c.code === 'P2')?.pct || 0, angle: Math.PI / 6 },
      { label: 'Story Drawing', val: activeStudentModal.categoryMarks?.preschool?.find(c => c.code === 'P3')?.pct || 0, angle: (5 * Math.PI) / 6 }
    ] : [
      { label: 'ගණිතය', val: getSubScoreForModal(activeStudentModal, 'math'), angle: -Math.PI / 2 },
      { label: 'සිංහල', val: getSubScoreForModal(activeStudentModal, 'sinhala'), angle: Math.PI / 6 },
      { label: 'English', val: getSubScoreForModal(activeStudentModal, 'english'), angle: (5 * Math.PI) / 6 }
    ]
  ) : [];

  const radarCenter = { x: 155, y: 135 };
  const radarRadius = 75;

  const getRadarCoords = (angle, value) => {
    const r = (value / 100) * radarRadius;
    return {
      x: radarCenter.x + r * Math.cos(angle),
      y: radarCenter.y + r * Math.sin(angle)
    };
  };

  const radarPolygonPath = radarPoints
    .map((pt, idx) => {
      const { x, y } = getRadarCoords(pt.angle, pt.val);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ') + ' Z';

  return (
    <div className="space-y-4 w-full">
      
      {/* Subject Header & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{subject.icon}</span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 whitespace-nowrap">
              {subject.name} — ලියාපදිංචි ශිෂ්‍ය ලේඛනය
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {subjectKey === 'preschool' 
              ? 'Showing only registered Pre-School & Grade 1 students for fine motor & creative activities.'
              : 'Showing only registered Grade 2, 3, 4 students for primary academic modules.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Domain Quick Filters - Single Line Layout */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 whitespace-nowrap">
        <span className="text-[11px] font-black text-slate-500 mr-1 uppercase tracking-wider shrink-0">Domains:</span>
        <button
          onClick={() => setSelectedDomainFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedDomainFilter === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Domains
        </button>
        {subject.categories.map((cat) => {
          const shortTitle = cat.name.split('(')[0].split('&')[0].trim();
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedDomainFilter(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                selectedDomainFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`px-1 py-0.2 rounded text-[10px] font-black ${
                selectedDomainFilter === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {cat.id}
              </span>
              <span>{shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Registered Students Tabular List */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden w-full">
        {filteredStudents.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">
              {eligibleStudents.length === 0 
                ? `No ${subjectKey === 'preschool' ? 'Pre-School / Grade 1' : 'Grade 2, 3, 4'} students registered yet`
                : 'No student matches the search filter'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {subjectKey === 'preschool'
                ? 'Only Pre-School and Grade 1 learners appear in this table.'
                : 'Only Grade 2, 3, and 4 learners appear in this table.'}
            </p>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full text-left text-xs table-auto">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 uppercase font-extrabold text-[11px] border-b border-slate-200">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Grade</th>
                  <th className="py-3 px-3">
                    {selectedDomainFilter === 'all' ? 'Mastery' : `${selectedDomainFilter} Mastery`}
                  </th>
                  <th className="py-3 px-3">Skill Level</th>
                  <th className="py-3 px-3 text-center">Attempts</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredStudents.map((st) => {
                  const score = getSubjectScore(st);
                  const status = getStudentStatus(score);
                  const attempts = getStudentAttempts(st);
                  return (
                    <tr 
                      key={st.studentId || st.id}
                      onClick={() => handleOpenStudentModal(st)}
                      className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-base shadow-sm border border-slate-200 shrink-0">
                            {st.avatar || '👦'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                              {st.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {st.grade || (subjectKey === 'preschool' ? 'Pre-School' : 'Grade 4')}
                        </span>
                      </td>

                      {/* Mastery Progress */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="w-24 sm:w-28">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <span className="text-xs font-black text-slate-900">{score}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-700 ${
                                score >= 85 ? 'bg-emerald-500' :
                                score >= 70 ? 'bg-blue-500' :
                                score >= 50 ? 'bg-amber-500' : 'bg-slate-300'
                              }`}
                              style={{ width: `${Math.max(4, score)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Skill Status Badge */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${status.color}`}>
                          {status.label}
                        </span>
                      </td>

                      {/* Attempts */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap font-black text-slate-800">
                        {attempts}
                      </td>

                      {/* Inspect Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenStudentModal(st);
                          }}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── INDIVIDUAL STUDENT DRILL-DOWN MODAL WITH PROGRESS TREND & MASTERY RADAR ── */}
      {activeStudentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-5xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Modal Top Bar */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl shadow-inner">
                  {activeStudentModal.avatar || '👦'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-900">{activeStudentModal.name}</h2>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                      {activeStudentModal.grade || (subjectKey === 'preschool' ? 'Pre-School' : 'Grade 4')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Individual Student Diagnostic Report & Assessment Performance
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveStudentModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Individual Student KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-700 uppercase">Overall Subject Mastery</p>
                <h3 className="text-2xl font-black text-indigo-900 mt-1">
                  {getSubjectScore(activeStudentModal)}%
                </h3>
                <p className="text-[11px] text-indigo-600 mt-0.5">Cumulative average across all completed papers</p>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                <p className="text-xs font-bold text-emerald-700 uppercase">Skill Competency Level</p>
                <h3 className="text-lg font-black text-emerald-900 mt-1">
                  {getStudentStatus(getSubjectScore(activeStudentModal)).label}
                </h3>
                <p className="text-[11px] text-emerald-600 mt-0.5">Adaptive diagnostic rating</p>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
                <p className="text-xs font-bold text-amber-700 uppercase">Total Completed Tests</p>
                <h3 className="text-2xl font-black text-amber-900 mt-1">
                  {activeStudentModal.totalExercises || 0}
                </h3>
                <p className="text-[11px] text-amber-600 mt-0.5">Recorded question attempts</p>
              </div>
            </div>

            {/* ── CHARTS SECTION: WEEKLY PROGRESS TREND & MASTERY RADAR ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Weekly Trend Multi-Line Graph (Span 2) */}
              <div className="lg:col-span-2 bg-slate-50/60 rounded-3xl p-5 border border-slate-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-600" /> සතිපතා ලකුණු වර්ධන ප්‍රස්තාරය (Weekly Progress Trend)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Weekly assessment trajectory</p>
                  </div>
                  
                  {/* Subject Filters */}
                  <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-slate-200/60">
                    {['all', 'math', 'sinhala', 'english', 'preschool'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveChartSubject(filter)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          activeChartSubject === filter
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {filter === 'all' ? 'All Subjects' : CORE_SUBJECTS[filter].shortName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Area & Line Chart */}
                <div className="relative w-full overflow-x-auto">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto min-w-[450px]">
                    <defs>
                      <linearGradient id="mathGradModal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="sinhalaGradModal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="englishGradModal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="preschoolGradModal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 20, 40, 60, 80, 100].map((val) => (
                      <g key={val}>
                        <line
                          x1={padding.left}
                          y1={getY(val)}
                          x2={chartWidth - padding.right}
                          y2={getY(val)}
                          stroke="#e2e8f0"
                          strokeWidth="1"
                          strokeDasharray={val === 0 ? "0" : "4 4"}
                        />
                        <text
                          x={padding.left - 8}
                          y={getY(val) + 3}
                          fill="#94a3b8"
                          fontSize="10"
                          textAnchor="end"
                          fontWeight="600"
                        >
                          {val}%
                        </text>
                      </g>
                    ))}

                    {/* X Axis Labels */}
                    {weeks.map((w, idx) => (
                      <text
                        key={w}
                        x={getX(idx)}
                        y={chartHeight - 10}
                        fill="#64748b"
                        fontSize="11"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {w}
                      </text>
                    ))}

                    {/* Shaded Areas & Lines based on Active Filter */}
                    {(activeChartSubject === 'all' || activeChartSubject === 'math') && (
                      <>
                        <path d={getAreaPath('math')} fill="url(#mathGradModal)" />
                        <path d={getLinePath('math')} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        {weeklyData.map((item, idx) => (
                          <circle key={idx} cx={getX(idx)} cy={getY(item.math || 0)} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                        ))}
                      </>
                    )}

                    {(activeChartSubject === 'all' || activeChartSubject === 'sinhala') && (
                      <>
                        <path d={getAreaPath('sinhala')} fill="url(#sinhalaGradModal)" />
                        <path d={getLinePath('sinhala')} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        {weeklyData.map((item, idx) => (
                          <circle key={idx} cx={getX(idx)} cy={getY(item.sinhala || 0)} r="4" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                        ))}
                      </>
                    )}

                    {(activeChartSubject === 'all' || activeChartSubject === 'english') && (
                      <>
                        <path d={getAreaPath('english')} fill="url(#englishGradModal)" />
                        <path d={getLinePath('english')} fill="none" stroke="#9333ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        {weeklyData.map((item, idx) => (
                          <circle key={idx} cx={getX(idx)} cy={getY(item.english || 0)} r="4" fill="#9333ea" stroke="#ffffff" strokeWidth="2" />
                        ))}
                      </>
                    )}

                    {(activeChartSubject === 'all' || activeChartSubject === 'preschool') && (
                      <>
                        <path d={getAreaPath('preschool')} fill="url(#preschoolGradModal)" />
                        <path d={getLinePath('preschool')} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        {weeklyData.map((item, idx) => (
                          <circle key={idx} cx={getX(idx)} cy={getY(item.preschool || 0)} r="4" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
                        ))}
                      </>
                    )}
                  </svg>
                </div>

                {/* Legend Pills */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-blue-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> ගණිතය (Math)
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> සිංහල (Sinhala)
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> English Speech
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Pre-School Foundations
                  </span>
                </div>
              </div>

              {/* Mastery Radar / Competency Balance Chart */}
              <div className="bg-slate-50/60 rounded-3xl p-5 border border-slate-200/80 flex flex-col justify-between items-center text-center">
                <div className="w-full">
                  <h4 className="text-sm font-black text-slate-900 flex items-center justify-center gap-1.5">
                    <Compass className="w-4 h-4 text-purple-600" /> විෂය සමතුලිතතාවය (Mastery Radar)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Competency Balance Profile</p>
                </div>

                {/* Radar SVG */}
                <div className="relative py-2 w-full flex items-center justify-center overflow-visible">
                  <svg width="100%" height="260" viewBox="0 0 310 260" className="overflow-visible max-w-[310px]">
                    {/* Concentric rings */}
                    {[25, 50, 75, 100].map((ring) => (
                      <circle
                        key={ring}
                        cx={radarCenter.x}
                        cy={radarCenter.y}
                        r={(ring / 100) * radarRadius}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        strokeDasharray={ring === 100 ? "0" : "3 3"}
                      />
                    ))}

                    {/* Axes */}
                    {radarPoints.map((pt, idx) => {
                      const outerCoord = getRadarCoords(pt.angle, 100);
                      return (
                        <line
                          key={idx}
                          x1={radarCenter.x}
                          y1={radarCenter.y}
                          x2={outerCoord.x}
                          y2={outerCoord.y}
                          stroke="#cbd5e1"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Polygon Filled Area */}
                    <path
                      d={radarPolygonPath}
                      fill="rgba(99, 102, 241, 0.25)"
                      stroke="#4f46e5"
                      strokeWidth="2"
                    />

                    {/* Vertex Points & Labels */}
                    {radarPoints.map((pt, idx) => {
                      const coords = getRadarCoords(pt.angle, pt.val);
                      const textCoords = getRadarCoords(pt.angle, 114);
                      return (
                        <g key={idx}>
                          <circle
                            cx={coords.x}
                            cy={coords.y}
                            r="4"
                            fill="#4f46e5"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <text
                            x={textCoords.x}
                            y={textCoords.y + (pt.angle === -Math.PI / 2 ? -8 : 12)}
                            fontSize="10"
                            fontWeight="bold"
                            fill="#475569"
                            textAnchor={pt.angle === -Math.PI / 2 ? "middle" : (pt.angle < Math.PI / 2 ? "start" : "end")}
                          >
                            {pt.label} ({pt.val}%)
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="w-full bg-white p-2.5 rounded-2xl border border-slate-200/60 text-[11px] text-slate-600 font-medium">
                  📊 Real-time balance computed from assessment submissions.
                </div>
              </div>

            </div>

            {/* Domain-wise Marks Progress Bars */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-indigo-600" /> Domain-wise Marks Breakdown (ක්ෂේත්‍ර අනුව ලකුණු)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getDomainBreakdownForModal(activeStudentModal, subjectKey).map((cat) => (
                  <div key={cat.code} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-600">
                          {cat.code}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        {cat.total > 0 ? `${cat.pct}% (${cat.correct}/${cat.total} Qs)` : `${cat.pct}%`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          cat.pct >= 85 ? 'bg-emerald-500' :
                          cat.pct >= 70 ? 'bg-blue-500' :
                          cat.pct >= 50 ? 'bg-amber-500' : 'bg-slate-300'
                        }`}
                        style={{ width: `${Math.max(4, cat.pct)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Test Papers & Grade-wise History Breakdown */}
            {(() => {
              const papers = getStudentPapersHistory(activeStudentModal, subjectKey);
              if (!papers || papers.length === 0) return null;
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-indigo-600" /> Completed Question Papers & Grade Breakdown (සිදු කළ ප්‍රශ්න පත්‍ර)
                    </h4>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                      {papers.length} Papers Completed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {papers.map((p) => {
                      const isPassing = p.accuracy >= 75;
                      return (
                        <div key={p.id} className="bg-white p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 transition-all shadow-xs space-y-2.5">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-lg">
                              {p.gradeLabel || `Grade ${p.grade}`}
                            </span>
                            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              isPassing ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {isPassing ? '✓ 75%+ Passed' : 'Needs Practice'}
                            </span>
                          </div>

                          <div>
                            <h5 className="text-sm font-black text-slate-800 leading-tight">{p.paperTitle}</h5>
                            <p className="text-[11px] text-slate-500 font-bold mt-0.5">{subjectKey === 'preschool' ? '1 Activity Worksheet' : `${p.totalQuestions} Questions`} • Completed {p.completedAt}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-500">Score Achieved:</span>
                            <span className="text-sm font-black text-slate-900">
                              {p.totalCorrect} / {p.totalQuestions} <span className="text-indigo-600">({p.accuracy}%)</span>
                            </span>
                          </div>

                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-1.5 rounded-full transition-all ${
                                p.accuracy >= 75 ? 'bg-emerald-500' : p.accuracy >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                              }`} 
                              style={{ width: `${Math.max(5, p.accuracy)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Real Answered Questions & Responses Log */}
            {(() => {
              const availablePaperNumbers = Array.from(
                new Set(studentAttempts.map(a => Number(a.paperNumber) || 1))
              ).sort((a, b) => a - b);

              const filteredAttempts = selectedAttemptPaper === 'all'
                ? studentAttempts
                : studentAttempts.filter(a => (Number(a.paperNumber) || 1) === Number(selectedAttemptPaper));

              const totalAttemptPages = Math.ceil(filteredAttempts.length / attemptsPerPage) || 1;
              const currentAttemptPage = Math.min(attemptPage, totalAttemptPages);
              const paginatedAttempts = filteredAttempts.slice(
                (currentAttemptPage - 1) * attemptsPerPage,
                currentAttemptPage * attemptsPerPage
              );

              return (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-indigo-600" /> Answered Questions Log & Question History (පිළිතුරු වාර්තාව)
                      </h4>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {studentAttempts.length} Recorded Attempts
                      </span>
                    </div>

                    {/* Paper Selector / Pagination Tabs */}
                    {availablePaperNumbers.length > 1 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-500 mr-0.5">Paper No:</span>
                        <button
                          onClick={() => {
                            setSelectedAttemptPaper('all');
                            setAttemptPage(1);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            selectedAttemptPaper === 'all'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          All Papers ({studentAttempts.length})
                        </button>
                        {availablePaperNumbers.map((pNum) => {
                          const pCount = studentAttempts.filter(a => (Number(a.paperNumber) || 1) === pNum).length;
                          return (
                            <button
                              key={pNum}
                              onClick={() => {
                                setSelectedAttemptPaper(pNum);
                                setAttemptPage(1);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                selectedAttemptPaper === pNum
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Paper 0{pNum} ({pCount})
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {loadingAttempts ? (
                    <div className="p-6 text-center text-xs text-slate-500 font-semibold bg-slate-50 rounded-2xl">
                      Loading question attempt log from database...
                    </div>
                  ) : studentAttempts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 font-semibold bg-slate-50 rounded-2xl border border-slate-200/60">
                      No individual question submission logs recorded yet for this student in this category.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-100 text-slate-600 uppercase font-extrabold border-b border-slate-200">
                              <th className="py-2.5 px-3">Question ID</th>
                              <th className="py-2.5 px-3">Skill Tested</th>
                              <th className="py-2.5 px-3">Student Answer</th>
                              <th className="py-2.5 px-3">Correct Answer</th>
                              <th className="py-2.5 px-3">Result</th>
                              <th className="py-2.5 px-3">Response Time</th>
                              <th className="py-2.5 px-3">Misconception</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {paginatedAttempts.map((att, index) => (
                              <tr key={att._id || index} className="hover:bg-slate-50 transition-colors">
                                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{att.questionId}</td>
                                <td className="py-2.5 px-3">{att.skillId}</td>
                                <td className="py-2.5 px-3 font-semibold text-slate-800">{att.studentAnswer || '—'}</td>
                                <td className="py-2.5 px-3 font-semibold text-emerald-700">{att.correctAnswer || '—'}</td>
                                <td className="py-2.5 px-3">
                                  {att.isCorrect ? (
                                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-rose-600 font-bold">
                                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3">{att.responseTimeMs ? `${(att.responseTimeMs / 1000).toFixed(1)}s` : '—'}</td>
                                <td className="py-2.5 px-3 text-slate-500 italic">{att.misconception || 'Standard attempt'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {totalAttemptPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs text-slate-600">
                          <div className="font-semibold text-slate-500 text-[11px]">
                            Showing <span className="font-bold text-slate-800">{(currentAttemptPage - 1) * attemptsPerPage + 1}</span> – <span className="font-bold text-slate-800">{Math.min(currentAttemptPage * attemptsPerPage, filteredAttempts.length)}</span> of <span className="font-bold text-slate-800">{filteredAttempts.length}</span> questions {selectedAttemptPaper !== 'all' ? `(Paper 0${selectedAttemptPaper})` : ''}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setAttemptPage(p => Math.max(1, p - 1))}
                              disabled={currentAttemptPage === 1}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-bold text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-xs"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" /> Previous
                            </button>

                            <div className="flex items-center gap-1 mx-1">
                              {Array.from({ length: totalAttemptPages }, (_, i) => i + 1).map((pg) => (
                                <button
                                  key={pg}
                                  onClick={() => setAttemptPage(pg)}
                                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                                    currentAttemptPage === pg
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  {pg}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() => setAttemptPage(p => Math.min(totalAttemptPages, p + 1))}
                              disabled={currentAttemptPage === totalAttemptPages}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-bold text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-xs"
                            >
                              Next <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Modal Bottom Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveStudentModal(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow cursor-pointer"
              >
                Close Student Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CategoryStudentTable;
