import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Brain, 
  Compass, 
  ChevronRight, 
  BarChart3, 
  Calendar,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { CORE_SUBJECTS, STUDENT_PROFILES } from '../../data/studentAnalyticsData';

const StudentAnalyticsOverview = ({ initialStudentId = 'std_001', isTeacherView = false }) => {
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId);
  const [activeSubjectTab, setActiveSubjectTab] = useState('all');
  const [activeCategoryTab, setActiveCategoryTab] = useState('math');
  const [hoveredWeek, setHoveredWeek] = useState(null);

  const student = STUDENT_PROFILES.find(s => s.id === selectedStudentId) || STUDENT_PROFILES[0];

  // Subject KPI metrics
  const getSubjectAverage = (subjectKey) => {
    if (!student.categoryMarks[subjectKey]) return 0;
    const items = student.categoryMarks[subjectKey];
    const total = items.reduce((acc, curr) => acc + curr.pct, 0);
    return Math.round(total / items.length);
  };

  // SVG Chart Geometry Constants
  const chartWidth = 720;
  const chartHeight = 260;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const weeks = student.weeklyProgress.map(w => w.week);
  const getX = (index) => padding.left + (index / (weeks.length - 1)) * graphWidth;
  const getY = (val) => padding.top + graphHeight - ((val - 50) / 50) * graphHeight; // 50 to 100 range

  // Line paths generator
  const getLinePath = (key) => {
    return student.weeklyProgress
      .map((item, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(item[key])}`)
      .join(' ');
  };

  const getAreaPath = (key) => {
    const line = getLinePath(key);
    const firstX = getX(0);
    const lastX = getX(student.weeklyProgress.length - 1);
    const bottomY = padding.top + graphHeight;
    return `${line} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  // Radar chart calculation for the 4 pillars
  const radarPoints = [
    { label: 'ගණිතය', val: getSubjectAverage('math'), angle: -Math.PI / 2 },
    { label: 'සිංහල', val: getSubjectAverage('sinhala'), angle: 0 },
    { label: 'English', val: getSubjectAverage('english'), angle: Math.PI / 2 },
    { label: 'Pre-School', val: getSubjectAverage('preschool'), angle: Math.PI }
  ];

  const radarCenter = { x: 150, y: 150 };
  const radarRadius = 100;

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
    <div className="space-y-8 animate-fade-in text-slate-800">
      
      {/* Student Profile & Selector Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/20">
              {student.avatar}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black">{student.name}</h1>
                <span className="bg-indigo-500/40 text-indigo-200 border border-indigo-300/30 px-3 py-0.5 rounded-full text-xs font-bold">
                  {student.grade}
                </span>
              </div>
              <p className="text-indigo-200 text-sm mt-1">
                4-Pillar Longitudinal Adaptive Progress & Performance Analytics
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-indigo-200">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
                  <Calendar className="w-3.5 h-3.5 text-indigo-300" /> පැමිණීම: <strong>{student.attendance}</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> සම්පූර්ණ කළ අභ්‍යාස: <strong>{student.totalExercises}</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
                  <Award className="w-3.5 h-3.5 text-amber-300" /> සාමාන්‍ය ලකුණු: <strong>{student.overallAverage}%</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Student Switcher */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 self-start md:self-auto">
            <label className="block text-xs font-bold text-indigo-200 mb-1.5">
              {isTeacherView ? 'Select Student Profile (ශිෂ්‍යයා තෝරන්න):' : 'Active Profile:'}
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-slate-900/80 text-white font-bold text-sm rounded-xl px-4 py-2 border border-indigo-400/40 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer w-full"
            >
              {STUDENT_PROFILES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.grade})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Object.keys(CORE_SUBJECTS).map((subKey) => {
          const subject = CORE_SUBJECTS[subKey];
          const avg = getSubjectAverage(subKey);
          return (
            <div
              key={subKey}
              onClick={() => setActiveCategoryTab(subKey)}
              className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg border-2 transition-all cursor-pointer transform hover:-translate-y-1 ${
                activeCategoryTab === subKey ? `border-${subject.color}-500 ring-4 ring-${subject.color}-500/10` : 'border-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-slate-50 border border-slate-100 shadow-sm">
                  {subject.icon}
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  avg >= 85 ? 'bg-emerald-100 text-emerald-800' :
                  avg >= 70 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {avg >= 85 ? 'Mastery ⭐' : avg >= 70 ? 'Proficient 👍' : 'Needs Practice ⚠️'}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-800 mb-1">{subject.name}</h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black text-slate-900">{avg}%</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +5.4% vs W1
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
                <div 
                  className={`bg-gradient-to-r ${subject.gradient} h-2 rounded-full transition-all duration-1000`} 
                  style={{ width: `${avg}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                <span>{subject.categories.length} Categories</span>
                <span className="text-indigo-600 font-bold flex items-center gap-0.5 hover:underline">
                  View Detail <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-2 border-amber-300 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {student.recommendation.priority}
                </span>
                <span className="text-xs font-bold text-amber-900">
                  AI Adaptive Diagnostic Recommendation
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                ඉලක්කගත පුහුණු නිර්දේශය: {student.recommendation.subjectName} — {student.recommendation.categoryName}
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {student.recommendation.reason}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(student.recommendation.actionUrl)}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>{student.recommendation.actionTitle}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle Section: Weekly Trend Graph & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Trend Multi-Line Graph (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" /> සතිපතා ලකුණු වර්ධන ප්‍රස්තාරය (Weekly Progress Trend)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Weeks 1 to 6 Longitudinal Performance Across Pillars</p>
            </div>
            
            {/* Subject Filters */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl">
              {['all', 'math', 'sinhala', 'english', 'preschool'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveSubjectTab(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSubjectTab === filter
                      ? 'bg-white text-indigo-700 shadow-sm'
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
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto min-w-[500px]">
              <defs>
                <linearGradient id="mathGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="sinhalaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="englishGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="preschoolGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[50, 60, 70, 80, 90, 100].map((val) => (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={getY(val)}
                    x2={chartWidth - padding.right}
                    y2={getY(val)}
                    stroke="#f1f5f9"
                    strokeWidth="1.5"
                    strokeDasharray={val === 50 ? "0" : "4 4"}
                  />
                  <text
                    x={padding.left - 10}
                    y={getY(val) + 4}
                    fill="#94a3b8"
                    fontSize="11"
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
                  y={chartHeight - 12}
                  fill="#64748b"
                  fontSize="12"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {w}
                </text>
              ))}

              {/* Shaded Areas & Lines based on Active Filter */}
              {(activeSubjectTab === 'all' || activeSubjectTab === 'math') && (
                <>
                  <path d={getAreaPath('math')} fill="url(#mathGrad)" />
                  <path d={getLinePath('math')} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {student.weeklyProgress.map((item, idx) => (
                    <circle key={idx} cx={getX(idx)} cy={getY(item.math)} r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                  ))}
                </>
              )}

              {(activeSubjectTab === 'all' || activeSubjectTab === 'sinhala') && (
                <>
                  <path d={getAreaPath('sinhala')} fill="url(#sinhalaGrad)" />
                  <path d={getLinePath('sinhala')} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {student.weeklyProgress.map((item, idx) => (
                    <circle key={idx} cx={getX(idx)} cy={getY(item.sinhala)} r="4.5" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                  ))}
                </>
              )}

              {(activeSubjectTab === 'all' || activeSubjectTab === 'english') && (
                <>
                  <path d={getAreaPath('english')} fill="url(#englishGrad)" />
                  <path d={getLinePath('english')} fill="none" stroke="#9333ea" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {student.weeklyProgress.map((item, idx) => (
                    <circle key={idx} cx={getX(idx)} cy={getY(item.english)} r="4.5" fill="#9333ea" stroke="#ffffff" strokeWidth="2" />
                  ))}
                </>
              )}

              {(activeSubjectTab === 'all' || activeSubjectTab === 'preschool') && (
                <>
                  <path d={getAreaPath('preschool')} fill="url(#preschoolGrad)" />
                  <path d={getLinePath('preschool')} fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {student.weeklyProgress.map((item, idx) => (
                    <circle key={idx} cx={getX(idx)} cy={getY(item.preschool)} r="4.5" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
                  ))}
                </>
              )}
            </svg>
          </div>

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100 text-xs font-bold">
            <span className="flex items-center gap-2 text-blue-600">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span> ගණිතය (Math)
            </span>
            <span className="flex items-center gap-2 text-emerald-600">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span> සිංහල (Sinhala)
            </span>
            <span className="flex items-center gap-2 text-purple-600">
              <span className="w-3 h-3 rounded-full bg-purple-600"></span> English Speech
            </span>
            <span className="flex items-center gap-2 text-amber-600">
              <span className="w-3 h-3 rounded-full bg-amber-600"></span> Pre-School Foundations
            </span>
          </div>
        </div>

        {/* Competency Mastery Radar Chart (Span 1) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-1">
              <Compass className="w-5 h-5 text-purple-600" /> විෂය සමතුලිතතාවය (Mastery Radar)
            </h3>
            <p className="text-xs text-slate-500 mb-4">4-Pillar Competency Balance Profile</p>
          </div>

          <div className="flex justify-center my-auto">
            <svg width="300" height="300" className="overflow-visible">
              {/* Radar Circles */}
              {[25, 50, 75, 100].map((ring) => (
                <circle
                  key={ring}
                  cx={radarCenter.x}
                  cy={radarCenter.y}
                  r={(ring / 100) * radarRadius}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />
              ))}

              {/* Axis Lines */}
              {radarPoints.map((pt, idx) => {
                const { x, y } = getRadarCoords(pt.angle, 100);
                return (
                  <line
                    key={idx}
                    x1={radarCenter.x}
                    y1={radarCenter.y}
                    x2={x}
                    y2={y}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                );
              })}

              {/* Polygon Area */}
              <path
                d={radarPolygonPath}
                fill="rgba(99, 102, 241, 0.25)"
                stroke="#4f46e5"
                strokeWidth="2.5"
              />

              {/* Radar Point Nodes & Labels */}
              {radarPoints.map((pt, idx) => {
                const node = getRadarCoords(pt.angle, pt.val);
                const labelPos = getRadarCoords(pt.angle, 122);
                return (
                  <g key={idx}>
                    <circle cx={node.x} cy={node.y} r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                    <text
                      x={labelPos.x}
                      y={labelPos.y + 4}
                      fill="#334155"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {pt.label} ({pt.val}%)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl text-center text-xs text-slate-600 font-semibold border border-slate-200/60 mt-4">
            🌟 <strong>Pre-School & Math</strong> highest performing pillars with steady growth in <strong>Sinhala & English</strong>.
          </div>
        </div>

      </div>

      {/* Category-wise Granular Marks Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" /> විෂය කාණ්ඩ අනුව ලකුණු විශ්ලේෂණය (Category Marks Breakdown)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Granular performance, marks obtained, and mastery ratings</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(CORE_SUBJECTS).map((subKey) => {
              const s = CORE_SUBJECTS[subKey];
              return (
                <button
                  key={subKey}
                  onClick={() => setActiveCategoryTab(subKey)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeCategoryTab === subKey
                      ? `bg-${s.color}-600 text-white shadow-md`
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Bar & Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {student.categoryMarks[activeCategoryTab]?.map((cat) => (
            <div key={cat.code} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 mr-2">
                    {cat.code}
                  </span>
                  <span className="text-sm font-bold text-slate-800">{cat.name}</span>
                </div>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  cat.status === 'Mastered' ? 'bg-emerald-100 text-emerald-800' :
                  cat.status === 'Proficient' ? 'bg-blue-100 text-blue-800' :
                  cat.status === 'Developing' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {cat.status}
                </span>
              </div>

              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-slate-500 font-semibold">
                  ලකුණු: <strong>{cat.marks}</strong> / {cat.maxMarks}
                </span>
                <span className="text-lg font-black text-slate-900">{cat.pct}%</span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-1000 ${
                    cat.pct >= 85 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                    cat.pct >= 70 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                    cat.pct >= 60 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-rose-500 to-red-500'
                  }`}
                  style={{ width: `${cat.pct}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Longitudinal Weekly Gradebook Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 overflow-hidden">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-indigo-600" /> සතිපතා විස්තරාත්මක ලකුණු සටහන (Weekly Gradebook)
        </h3>
        <p className="text-xs text-slate-500 mb-6">Historical chronological evaluation marks across the 6-week learning timeline</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-extrabold border-b border-slate-200">
                <th className="py-3.5 px-4 rounded-l-xl">සතිය (Week)</th>
                <th className="py-3.5 px-4">🧮 ගණිතය (Math)</th>
                <th className="py-3.5 px-4">🦁 සිංහල (Sinhala)</th>
                <th className="py-3.5 px-4">🗣️ English Speech</th>
                <th className="py-3.5 px-4">🎨 Pre-School</th>
                <th className="py-3.5 px-4">සාමාන්‍යය (Average)</th>
                <th className="py-3.5 px-4 rounded-r-xl">ප්‍රගති තත්ත්වය (Status)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {student.weeklyProgress.map((wp, index) => (
                <tr key={wp.week} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-black text-slate-900">{wp.week}</td>
                  <td className="py-4 px-4 text-blue-600 font-bold">{wp.math}%</td>
                  <td className="py-4 px-4 text-emerald-600 font-bold">{wp.sinhala}%</td>
                  <td className="py-4 px-4 text-purple-600 font-bold">{wp.english}%</td>
                  <td className="py-4 px-4 text-amber-600 font-bold">{wp.preschool}%</td>
                  <td className="py-4 px-4 font-black text-slate-900">{wp.average}%</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      wp.average >= 85 ? 'bg-emerald-100 text-emerald-800' :
                      wp.average >= 75 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {index === 0 ? 'Baseline Diagnostic' : `+${(wp.average - student.weeklyProgress[0].average).toFixed(1)}% Growth 🚀`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StudentAnalyticsOverview;
