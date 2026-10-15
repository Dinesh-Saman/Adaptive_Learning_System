import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  BookOpen, 
  Compass, 
  ArrowRight, 
  Database, 
  Calculator, 
  Languages, 
  Mic, 
  Palette, 
  LayoutDashboard, 
  LogOut, 
  ChevronRight, 
  Award, 
  ExternalLink 
} from 'lucide-react';
import CategoryStudentTable, { isPreSchoolOrGrade1 } from '../components/analytics/CategoryStudentTable';
import ExperimentalResultsTable from '../components/analytics/ExperimentalResultsTable';
import { fetchStudentsAnalyticsFromApi, CORE_SUBJECTS } from '../data/studentAnalyticsData';
import { getItem, clearSession } from '../utils/storage';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialTab = () => {
    const fromUrl = searchParams.get('tab');
    if (fromUrl && ['overview', 'math', 'sinhala', 'english', 'preschool', 'evaluation', 'model_comparison'].includes(fromUrl)) {
      return fromUrl;
    }
    try {
      const fromStorage = localStorage.getItem('teacher_dashboard_tab');
      if (fromStorage && ['overview', 'math', 'sinhala', 'english', 'preschool', 'evaluation'].includes(fromStorage)) {
        return fromStorage;
      }
    } catch (e) {}
    return 'overview';
  };

  const [teacherName, setTeacherName] = useState('');
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [loading, setLoading] = useState(true);

  const setActiveTab = (newTab) => {
    setActiveTabState(newTab);
    setSearchParams({ tab: newTab });
    try {
      localStorage.setItem('teacher_dashboard_tab', newTab);
    } catch (e) {}
  };

  useEffect(() => {
    const fromUrl = searchParams.get('tab');
    if (fromUrl && fromUrl !== activeTab && ['overview', 'math', 'sinhala', 'english', 'preschool'].includes(fromUrl)) {
      setActiveTabState(fromUrl);
      try {
        localStorage.setItem('teacher_dashboard_tab', fromUrl);
      } catch (e) {}
    }
  }, [searchParams]);

  useEffect(() => {
    const token = getItem('token');
    const role = getItem('role');
    
    if (!token || role !== 'teacher') {
      navigate('/login');
      return;
    }

    const name = getItem('studentName') || 'Teacher';
    setTeacherName(name);

    fetchStudentsAnalyticsFromApi()
      .then(data => {
        if (data && Array.isArray(data)) {
          setStudents(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const classAverage = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + (s.overallAverage || 0), 0) / students.length) 
    : 0;
  const totalExercisesClass = students.reduce((acc, s) => acc + (s.totalExercises || 0), 0);

  // Category enrollment counts
  const primaryStudents = students.filter(s => !isPreSchoolOrGrade1(s.grade));
  const preschoolStudents = students.filter(s => isPreSchoolOrGrade1(s.grade));

  const getSubjectClassAverage = (subKey, studentList) => {
    if (!studentList || studentList.length === 0) return 0;
    const scores = studentList.map(st => {
      const items = st.categoryMarks?.[subKey] || [];
      if (items.length === 0) return 0;
      const total = items.reduce((acc, curr) => acc + curr.pct, 0);
      return Math.round(total / items.length);
    }).filter(s => s > 0);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const sidebarMenuItems = [
    {
      id: 'overview',
      name: 'සමස්ත විශ්ලේෂණය',
      subtitle: 'Class Overview & Enrollments',
      icon: LayoutDashboard,
      color: 'indigo'
    },
    {
      id: 'math',
      name: '1. ගණිතය (Mathematics)',
      subtitle: 'Grade 2, 3, 4 Hubs',
      icon: Calculator,
      color: 'blue'
    },
    {
      id: 'sinhala',
      name: '2. සිංහල භාෂාව (Sinhala)',
      subtitle: 'Grade 2, 3, 4 & Handwriting AI',
      icon: Languages,
      color: 'emerald'
    },
    {
      id: 'english',
      name: '3. English Speech',
      subtitle: 'Speech, Pronunciation & Fluency',
      icon: Mic,
      color: 'purple'
    },
    {
      id: 'preschool',
      name: '4. Pre-School & Grade 1',
      subtitle: 'Fine Motor, Tracing & Coloring',
      icon: Palette,
      color: 'amber'
    },
    {
      id: 'evaluation',
      name: '5. AI ඇගයීම් වාර්තාව',
      subtitle: 'Experimental Results & Metrics',
      icon: Sparkles,
      color: 'teal'
    }
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800">
      
      {/* ── SIDEBAR NAVIGATION ── */}
      <aside className="w-72 sm:w-80 bg-slate-900 text-white flex flex-col justify-between shrink-0 shadow-2xl border-r border-slate-800 min-h-screen">
        <div>
          {/* Platform Branding */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="නැණ පියස (Nana Piyasa)" 
                className="w-12 h-12 rounded-2xl object-contain bg-white p-1 shadow-lg shrink-0" 
              />
              <div>
                <h1 className="text-lg font-black tracking-tight text-white font-sinhala leading-tight">නැණ පියස</h1>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider -mt-0.5">Nana Piyasa Portal</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] font-bold text-slate-400">Teacher Portal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1.5">
            <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Core Functions
            </p>

            {sidebarMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all font-bold text-left cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{item.name}</p>
                      <p className={`text-[10px] mt-0.5 ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-0.5 text-white' : 'text-slate-600 group-hover:text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              {activeTab === 'overview' ? 'Total Enrolled:' : 'Enrolled:'}
            </span>
            <strong className="text-emerald-300">
              {(activeTab === 'overview' ? students.length : activeTab === 'preschool' ? preschoolStudents.length : primaryStudents.length)} Students
            </strong>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-grow p-2 sm:p-3 lg:p-3.5 w-full overflow-y-auto space-y-4">
        
        {/* ── TAB 1: CLASS OVERVIEW & CATEGORY ENROLLMENT SUMMARY ── */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200/90 space-y-6 animate-fade-in">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <LayoutDashboard className="w-6 h-6 text-indigo-600" /> Class Overview & Enrollment Diagnostics
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                  Cohort enrollment statistics, academic mastery averages, and quick module navigation.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full border border-slate-200/60 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {students.length} Total Enrolled Learners
                </span>
              </div>
            </div>

            {/* Class Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Enrolled */}
              <div className="relative overflow-hidden bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-t-2xl opacity-90"></div>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      Total Enrolled
                    </span>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">{students.length}</span>
                      <span className="text-xs font-bold text-slate-500">Students</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Across all grades & modules
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Users className="w-5 h-5 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Card 2: Primary Cohort */}
              <div className="relative overflow-hidden bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-2xl opacity-90"></div>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Grade 2, 3, 4
                    </span>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-2xl font-black text-blue-700 tracking-tight">{primaryStudents.length}</span>
                      <span className="text-xs font-bold text-slate-500">Students</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Math, Sinhala & English
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <GraduationCap className="w-5 h-5 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Card 3: Pre-School Cohort */}
              <div className="relative overflow-hidden bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-200 transition-all group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl opacity-90"></div>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Pre-School & Gr 1
                    </span>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-2xl font-black text-amber-700 tracking-tight">{preschoolStudents.length}</span>
                      <span className="text-xs font-bold text-slate-500">Students</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Motor, Tracing & Coloring
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-50/80 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all">
                    <Palette className="w-5 h-5 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Card 4: Completed Exercises */}
              <div className="relative overflow-hidden bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-200 transition-all group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-t-2xl opacity-90"></div>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      Completed Tests
                    </span>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-2xl font-black text-purple-700 tracking-tight">{totalExercisesClass}</span>
                      <span className="text-xs font-bold text-slate-500">Recorded</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Total assessment attempts
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-purple-50/80 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <Award className="w-5 h-5 transition-colors" />
                  </div>
                </div>
              </div>

            </div>

            {/* Category Enrollment & Performance Summary Grid */}
            <div className="space-y-3.5 pt-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" /> Subject Hubs & Academic Performance
                </h2>
                <span className="text-xs text-slate-400 font-bold hidden sm:inline">Click any hub to open student records</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                {[
                  {
                    id: 'math',
                    num: '1',
                    title: 'Mathematics',
                    sinhala: 'ගණිතය',
                    subtitle: 'Grade 2, 3, 4 Primary Math Curriculums',
                    badge: 'Primary',
                    icon: '🧮',
                    avg: getSubjectClassAverage('math', primaryStudents),
                    studentCount: primaryStudents.length,
                    accentGradient: 'from-blue-500 to-indigo-600',
                    borderHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
                    iconBg: 'bg-blue-50/90 border-blue-200/80 text-blue-600',
                    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200/70',
                    barGradient: 'bg-gradient-to-r from-blue-500 to-indigo-600',
                    linkHover: 'text-blue-600',
                  },
                  {
                    id: 'sinhala',
                    num: '2',
                    title: 'Sinhala Language',
                    sinhala: 'සිංහල',
                    subtitle: 'Grade 2, 3, 4 5-Paper Adaptive System',
                    badge: 'Primary',
                    icon: '🦁',
                    avg: getSubjectClassAverage('sinhala', primaryStudents),
                    studentCount: primaryStudents.length,
                    accentGradient: 'from-emerald-500 to-teal-600',
                    borderHover: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
                    iconBg: 'bg-emerald-50/90 border-emerald-200/80 text-emerald-600',
                    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
                    barGradient: 'bg-gradient-to-r from-emerald-500 to-teal-600',
                    linkHover: 'text-emerald-600',
                  },
                  {
                    id: 'english',
                    num: '3',
                    title: 'English Speech',
                    sinhala: 'කථන පුහුණුව',
                    subtitle: 'Speech Recognition & Fluency Hub',
                    badge: 'Primary',
                    icon: '🗣️',
                    avg: getSubjectClassAverage('english', primaryStudents),
                    studentCount: primaryStudents.length,
                    accentGradient: 'from-purple-500 to-fuchsia-600',
                    borderHover: 'hover:border-purple-400 hover:shadow-purple-500/10',
                    iconBg: 'bg-purple-50/90 border-purple-200/80 text-purple-600',
                    badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200/70',
                    barGradient: 'bg-gradient-to-r from-purple-500 to-fuchsia-600',
                    linkHover: 'text-purple-600',
                  },
                  {
                    id: 'preschool',
                    num: '4',
                    title: 'Pre-School & Gr. 1',
                    sinhala: 'පෙර පාසල්',
                    subtitle: 'Fine Motor, Line Tracing & Coloring',
                    badge: 'Foundations',
                    icon: '🎨',
                    avg: getSubjectClassAverage('preschool', preschoolStudents),
                    studentCount: preschoolStudents.length,
                    accentGradient: 'from-amber-500 to-orange-500',
                    borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
                    iconBg: 'bg-amber-50/90 border-amber-200/80 text-amber-600',
                    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200/70',
                    barGradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
                    linkHover: 'text-amber-700',
                  }
                ].map((hub) => {
                  const isMastery = hub.avg >= 75;
                  const isProficient = hub.avg >= 50;
                  const statusLabel = isMastery ? 'Mastery ⭐' : isProficient ? 'Proficient 👍' : 'Needs Practice ⚠️';
                  const statusStyle = isMastery 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80' 
                    : isProficient 
                      ? 'bg-blue-50 text-blue-800 border-blue-200/80' 
                      : 'bg-amber-50 text-amber-800 border-amber-200/80';

                  return (
                    <div 
                      key={hub.id}
                      onClick={() => setActiveTab(hub.id)}
                      className={`relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/90 ${hub.borderHover} hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4`}
                    >
                      {/* Top Accent Gradient Line */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${hub.accentGradient} opacity-90`} />

                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl shrink-0 ${hub.iconBg} group-hover:scale-105 transition-transform shadow-2xs`}>
                            {hub.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                                {hub.num}. {hub.title}
                              </h3>
                              <span className="text-xs font-bold text-slate-400 font-sinhala whitespace-nowrap">
                                ({hub.sinhala})
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{hub.subtitle}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${hub.badgeStyle}`}>
                          {hub.badge}
                        </span>
                      </div>

                      {/* Score Bar & Performance Stats Box */}
                      <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-100 space-y-2.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-600 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                            Class Average
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${statusStyle}`}>
                              {statusLabel}
                            </span>
                            <span className="text-base font-black text-slate-900">{hub.avg}%</span>
                          </div>
                        </div>

                        {/* Animated Gradient Progress Bar */}
                        <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-700 ${hub.barGradient}`}
                            style={{ width: `${Math.min(100, Math.max(5, hub.avg))}%` }}
                          />
                        </div>

                        {/* Footer Info */}
                        <div className="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <strong className="text-slate-800 font-bold">{hub.studentCount}</strong> Active Learners
                          </span>
                          <span className={`font-bold flex items-center gap-1 text-xs transition-colors ${hub.linkHover} group-hover:underline`}>
                            Open Hub <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 2: MATHEMATICS HUB (Tabular Students & Individual Drill-down) ── */}
        {activeTab === 'math' && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs border border-slate-200/90 space-y-4 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-4 sm:p-5 rounded-xl shadow-md flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black font-sinhala leading-tight">1. ගණිතය ශ්‍රේණි කළමනාකරණය (Mathematics Hub)</h1>
                <p className="text-blue-200 text-xs sm:text-sm mt-0.5">
                  Grade 2, Grade 3, and Grade 4 Primary Mathematics Curriculums & Adaptive Multi-Tier Testing
                </p>
              </div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0">
                🧮
              </div>
            </div>

            {/* TABULAR STUDENT LIST & DETAILED DRILL-DOWN MODAL WITH SVG CHARTS */}
            <CategoryStudentTable subjectKey="math" students={students} loading={loading} />
          </div>
        )}

        {/* ── TAB 3: SINHALA LANGUAGE HUB (Tabular Students & Individual Drill-down) ── */}
        {activeTab === 'sinhala' && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs border border-slate-200/90 space-y-4 animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-4 sm:p-5 rounded-xl shadow-md flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black font-sinhala leading-tight">2. සිංහල භාෂා කළමනාකරණය (Sinhala Language Hub)</h1>
                <p className="text-emerald-200 text-xs sm:text-sm mt-0.5">
                  Grade 2, 3, 4 5-Paper Adaptive Assessment System & Neural Handwriting Recognition AI
                </p>
              </div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0">
                🦁
              </div>
            </div>

            {/* TABULAR STUDENT LIST & DETAILED DRILL-DOWN MODAL WITH SVG CHARTS */}
            <CategoryStudentTable subjectKey="sinhala" students={students} loading={loading} />
          </div>
        )}

        {/* ── TAB 4: ENGLISH SPEECH HUB (Tabular Students & Individual Drill-down) ── */}
        {activeTab === 'english' && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs border border-slate-200/90 space-y-4 animate-fade-in">
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-4 sm:p-5 rounded-xl shadow-md flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black leading-tight">3. English Speech & Pronunciation Hub</h1>
                <p className="text-purple-200 text-xs sm:text-sm mt-0.5">
                  Real-time Speech Recognition, Phonetic Accuracy & Intonation Monitoring for Primary ESL
                </p>
              </div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-purple-500/20 border border-purple-400/30 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0">
                🗣️
              </div>
            </div>

            {/* TABULAR STUDENT LIST & DETAILED DRILL-DOWN MODAL WITH SVG CHARTS */}
            <CategoryStudentTable subjectKey="english" students={students} loading={loading} />
          </div>
        )}

        {/* ── TAB 5: PRE-SCHOOL & GRADE 1 HUB (Tabular Students & Individual Drill-down) ── */}
        {activeTab === 'preschool' && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs border border-slate-200/90 space-y-4 animate-fade-in">
            <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-amber-950 text-white p-4 sm:p-5 rounded-xl shadow-md flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black font-sinhala leading-tight">4. Pre-School & Grade 1 (පෙර පාසල් හා 1 ශ්‍රේණිය)</h1>
                <p className="text-amber-200 text-xs sm:text-sm mt-0.5">
                  Fine Motor Coordination, Line Tracing, Digital Coloring & Story Drawing
                </p>
              </div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-amber-500/20 border border-amber-400/30 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0">
                🎨
              </div>
            </div>

            {/* TABULAR STUDENT LIST & DETAILED DRILL-DOWN MODAL WITH SVG CHARTS */}
            <CategoryStudentTable subjectKey="preschool" students={students} loading={loading} />
          </div>
        )}

        {/* ── TAB 6: EXPERIMENTAL RESULTS & AI MODEL EVALUATION REPORT ── */}
        {activeTab === 'evaluation' && (
          <div className="space-y-4 animate-fade-in">
            <ExperimentalResultsTable />
          </div>
        )}


      </main>
    </div>
  );
};

export default TeacherDashboard;
