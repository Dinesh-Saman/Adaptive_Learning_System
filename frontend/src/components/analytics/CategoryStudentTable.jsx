import React, { useState, useEffect } from 'react';
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
  Brain, 
  Compass, 
  ChevronRight, 
  BarChart3, 
  Calendar,
  Layers,
  ArrowUpRight,
  Database,
  ExternalLink,
  X,
  Clock,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { CORE_SUBJECTS, fetchStudentAttemptsFromApi } from '../../data/studentAnalyticsData';

const CategoryStudentTable = ({ subjectKey = 'math', students = [] }) => {
  const navigate = useNavigate();
  const subject = CORE_SUBJECTS[subjectKey] || CORE_SUBJECTS.math;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('all');
  const [activeStudentModal, setActiveStudentModal] = useState(null);
  const [studentAttempts, setStudentAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  // Helper to calculate student score in this subject
  const getSubjectScore = (student) => {
    if (!student.categoryMarks || !student.categoryMarks[subjectKey]) return 0;
    const items = student.categoryMarks[subjectKey];
    const total = items.reduce((acc, curr) => acc + curr.pct, 0);
    return Math.round(total / items.length);
  };

  const getStudentStatus = (score) => {
    if (score >= 85) return { label: 'Mastered ⭐', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (score >= 70) return { label: 'Proficient 👍', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (score >= 50) return { label: 'Developing 📈', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    if (score > 0) return { label: 'Attention Needed ⚠️', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    return { label: 'Not Started', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  };

  // Filter students based on search and selected domain filter
  const filteredStudents = students.filter((st) => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (st.grade && st.grade.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (selectedDomainFilter !== 'all') {
      const catList = st.categoryMarks?.[subjectKey] || [];
      const domainCat = catList.find(c => c.code === selectedDomainFilter);
      if (!domainCat || domainCat.pct === 0) return false;
    }
    return true;
  });

  // Load question attempts when a student modal is opened
  const handleOpenStudentModal = async (student) => {
    setActiveStudentModal(student);
    setLoadingAttempts(true);
    try {
      const attempts = await fetchStudentAttemptsFromApi(student.studentId || student.id, subjectKey);
      setStudentAttempts(attempts);
    } catch (e) {
      console.warn("Attempts load error:", e);
      setStudentAttempts([]);
    } finally {
      setLoadingAttempts(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Subject Header & Filter Toolbar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{subject.icon}</span>
            <h3 className="text-xl font-black text-slate-900">
              {subject.name} — ලියාපදිංචි ශිෂ්‍ය ලේඛනය (Registered Students)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time enrolled student mastery levels, category scores, and question responses from MongoDB
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student name or grade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Domain Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black text-slate-500 mr-2 uppercase tracking-wider">Domain Focus:</span>
        <button
          onClick={() => setSelectedDomainFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedDomainFilter === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Domains ({subject.categories.length})
        </button>
        {subject.categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedDomainFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedDomainFilter === cat.id
                ? `bg-indigo-600 text-white shadow-sm`
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">{cat.id}</span>
            <span>{cat.name.split('(')[0]}</span>
          </button>
        ))}
      </div>

      {/* Registered Students Tabular List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No student records found in MongoDB for this filter</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When students register and complete activities in {subject.name}, their scores and detailed answered question logs will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-extrabold border-b border-slate-200">
                  <th className="py-4 px-5">ශිෂ්‍යයා (Student Name)</th>
                  <th className="py-4 px-4">ශ්‍රේණිය (Grade)</th>
                  <th className="py-4 px-4">ලකුණු මට්ටම (Mastery Score)</th>
                  <th className="py-4 px-4">කුසලතා මට්ටම (Skill Level)</th>
                  <th className="py-4 px-4">අභ්‍යාස ගණන (Attempts)</th>
                  <th className="py-4 px-4">පැමිණීම (Attendance)</th>
                  <th className="py-4 px-5 text-right">ක්‍රියාමාර්ග (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredStudents.map((st) => {
                  const score = getSubjectScore(st);
                  const status = getStudentStatus(score);
                  return (
                    <tr 
                      key={st.studentId || st.id}
                      onClick={() => handleOpenStudentModal(st)}
                      className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shadow-sm border border-slate-200">
                            {st.avatar || '👦'}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {st.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">ID: {st.studentId || st.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {st.grade || 'Grade 4'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="w-36">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-xs font-black text-slate-900">{score}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-700 ${
                                score >= 85 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                                score >= 70 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                                score >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-slate-300'
                              }`}
                              style={{ width: `${Math.max(4, score)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-black text-slate-800">
                        {st.totalExercises || 0} Attempts
                      </td>

                      <td className="py-4 px-4 text-xs font-bold text-slate-600">
                        {st.attendance || '100%'}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenStudentModal(st);
                          }}
                          className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
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

      {/* ── INTERACTIVE STUDENT DRILL-DOWN MODAL ── */}
      {activeStudentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Modal Top Bar */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl shadow-inner">
                  {activeStudentModal.avatar || '👦'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-900">{activeStudentModal.name}</h2>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                      {activeStudentModal.grade || 'Grade 4'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">
                    MongoDB Student ID: {activeStudentModal.studentId || activeStudentModal.id} • Registered Profile
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

            {/* Subject Performance & Skill Level Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-700 uppercase">Subject Mastery Score</p>
                <h3 className="text-3xl font-black text-indigo-900 mt-1">
                  {getSubjectScore(activeStudentModal)}%
                </h3>
                <p className="text-[11px] text-indigo-600 mt-0.5">Across all {subject.categories.length} tested domains</p>
              </div>

              <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100">
                <p className="text-xs font-bold text-emerald-700 uppercase">Skill Competency Level</p>
                <h3 className="text-xl font-black text-emerald-900 mt-1">
                  {getStudentStatus(getSubjectScore(activeStudentModal)).label}
                </h3>
                <p className="text-[11px] text-emerald-600 mt-0.5">Adaptive diagnostic rating</p>
              </div>

              <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-100">
                <p className="text-xs font-bold text-amber-700 uppercase">Total Completed Tests</p>
                <h3 className="text-3xl font-black text-amber-900 mt-1">
                  {activeStudentModal.totalExercises || 0}
                </h3>
                <p className="text-[11px] text-amber-600 mt-0.5">Recorded question attempts in DB</p>
              </div>
            </div>

            {/* Domain-wise Marks Progress Bars */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-indigo-600" /> Domain-wise Marks Breakdown (ක්ෂේත්‍ර අනුව ලකුණු)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeStudentModal.categoryMarks?.[subjectKey]?.map((cat) => (
                  <div key={cat.code} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <div className="flex justify-between items-baseline mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-black bg-white px-2 py-0.5 rounded border border-slate-200 text-indigo-600">
                          {cat.code}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">{cat.pct}% ({cat.marks}/{cat.maxMarks})</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
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

            {/* Real Answered Questions & Responses Log */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" /> Answered Questions Log & Question History (පිළිතුරු වාර්තාව)
                </h4>
                <span className="text-xs font-bold text-slate-500">
                  {studentAttempts.length} Recorded Attempts
                </span>
              </div>

              {loadingAttempts ? (
                <div className="p-6 text-center text-xs text-slate-500 font-semibold bg-slate-50 rounded-2xl">
                  Loading real question attempt log from database...
                </div>
              ) : studentAttempts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 font-semibold bg-slate-50 rounded-2xl border border-slate-200/60">
                  No individual question submission logs recorded yet for this student. Submissions during tests are saved directly here.
                </div>
              ) : (
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
                        <th className="py-2.5 px-3">Misconception Diagnostic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {studentAttempts.map((att, index) => (
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
              )}
            </div>

            {/* AI Recommendation Box */}
            {activeStudentModal.recommendation && (
              <div className="p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 rounded-2xl border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Brain className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200 px-2 py-0.5 rounded">
                      AI Remedial Guidance
                    </span>
                    <h5 className="text-sm font-black text-slate-900 mt-1">
                      {activeStudentModal.recommendation.categoryName}
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {activeStudentModal.recommendation.reason}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(activeStudentModal.recommendation.actionUrl || '/dashboard')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition-all shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <span>Launch Remedial Test</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

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
