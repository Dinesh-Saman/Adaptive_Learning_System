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
  Layers, 
  ExternalLink 
} from 'lucide-react';
import CategoryStudentTable, { isPreSchoolOrGrade1 } from '../components/analytics/CategoryStudentTable';
import { fetchStudentsAnalyticsFromApi, CORE_SUBJECTS } from '../data/studentAnalyticsData';
import { getItem, clearSession } from '../utils/storage';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialTab = () => {
    const fromUrl = searchParams.get('tab');
    if (fromUrl && ['overview', 'math', 'sinhala', 'english', 'preschool'].includes(fromUrl)) {
      return fromUrl;
    }
    try {
      const fromStorage = localStorage.getItem('teacher_dashboard_tab');
      if (fromStorage && ['overview', 'math', 'sinhala', 'english', 'preschool'].includes(fromStorage)) {
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

            {/* Teacher Info Card */}
            <div className="mt-5 p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-sm font-bold text-indigo-300">
                  👩‍🏫
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Logged in Teacher</p>
                  <p className="text-xs font-black text-white truncate max-w-[120px]">{teacherName}</p>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-400/30">
                Admin
              </span>
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
              const count = item.id === 'overview' 
                ? students.length 
                : item.id === 'preschool' 
                  ? preschoolStudents.length 
                  : primaryStudents.length;

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
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                    }`}>
                      {count}
                    </span>
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
              {activeTab === 'overview' ? 'Total Enrolled:' : 'Category Enrolled:'}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              
              {/* Card 1: Total Enrolled */}
              <div className="bg-gradient-to-br from-indigo-50/50 to-slate-50 p-4 rounded-xl border border-indigo-100/80 flex items-center justify-between shadow-2xs">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">{students.length} Students</h3>
                  <p className="text-[10px] text-indigo-600 font-bold mt-1">Across all grades & modules</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2: Primary Cohort */}
              <div className="bg-gradient-to-br from-blue-50/50 to-slate-50 p-4 rounded-xl border border-blue-100/80 flex items-center justify-between shadow-2xs">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Grade 2, 3, 4</p>
                  <h3 className="text-2xl font-black text-blue-700 mt-0.5">{primaryStudents.length} Students</h3>
                  <p className="text-[10px] text-blue-600 font-bold mt-1">Math, Sinhala & English</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3: Pre-School Cohort */}
              <div className="bg-gradient-to-br from-amber-50/50 to-slate-50 p-4 rounded-xl border border-amber-100/80 flex items-center justify-between shadow-2xs">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pre-School & Gr 1</p>
                  <h3 className="text-2xl font-black text-amber-700 mt-0.5">{preschoolStudents.length} Students</h3>
                  <p className="text-[10px] text-amber-600 font-bold mt-1">Motor, Tracing & Coloring</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <Palette className="w-5 h-5" />
                </div>
              </div>

              {/* Card 4: Completed Exercises */}
              <div className="bg-gradient-to-br from-purple-50/50 to-slate-50 p-4 rounded-xl border border-purple-100/80 flex items-center justify-between shadow-2xs">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Completed Tests</p>
                  <h3 className="text-2xl font-black text-purple-700 mt-0.5">{totalExercisesClass}</h3>
                  <p className="text-[10px] text-purple-600 font-bold mt-1">Total recorded attempts</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <Award className="w-5 h-5" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Mathematics Hub Overview */}
                {(() => {
                  const avg = getSubjectClassAverage('math', primaryStudents);
                  return (
                    <div 
                      onClick={() => setActiveTab('math')}
                      className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                            🧮
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                1. Mathematics (ගණිතය)
                              </h3>
                            </div>
                            <p className="text-xs text-slate-500">Grade 2, 3, 4 Primary Math Curriculums</p>
                          </div>
                        </div>
                        <span className="bg-blue-50 text-blue-700 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-blue-200/60 shrink-0">
                          Primary
                        </span>
                      </div>

                      {/* Score Bar & Enrolled Stats */}
                      <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 space-y-2">
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-slate-500">Class Average</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-black px-2 py-0.2 rounded-full ${
                              avg >= 75 ? 'bg-emerald-100 text-emerald-800' : avg >= 50 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {avg >= 75 ? 'Mastery ⭐' : avg >= 50 ? 'Proficient 👍' : 'Needs Practice ⚠️'}
                            </span>
                            <span className="text-base font-black text-slate-900">{avg}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, Math.max(5, avg))}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                          <span>👥 <strong>{primaryStudents.length}</strong> Active Learners</span>
                          <span className="text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
                            Open Hub <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 2. Sinhala Language Hub Overview */}
                {(() => {
                  const avg = getSubjectClassAverage('sinhala', primaryStudents);
                  return (
                    <div 
                      onClick={() => setActiveTab('sinhala')}
                      className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                            🦁
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                                2. Sinhala Language (සිංහල)
                              </h3>
                            </div>
                            <p className="text-xs text-slate-500">Grade 2, 3, 4 5-Paper Adaptive System</p>
                          </div>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                          Primary
                        </span>
                      </div>

                      {/* Score Bar & Enrolled Stats */}
                      <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 space-y-2">
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-slate-500">Class Average</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-black px-2 py-0.2 rounded-full ${
                              avg >= 75 ? 'bg-emerald-100 text-emerald-800' : avg >= 50 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {avg >= 75 ? 'Mastery ⭐' : avg >= 50 ? 'Proficient 👍' : 'Needs Practice ⚠️'}
                            </span>
                            <span className="text-base font-black text-slate-900">{avg}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-emerald-600 h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, Math.max(5, avg))}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                          <span>👥 <strong>{primaryStudents.length}</strong> Active Learners</span>
                          <span className="text-emerald-600 font-bold group-hover:underline flex items-center gap-0.5">
                            Open Hub <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 3. English Speech Hub Overview */}
                {(() => {
                  const avg = getSubjectClassAverage('english', primaryStudents);
                  return (
                    <div 
                      onClick={() => setActiveTab('english')}
                      className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                            🗣️
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                                3. English Speech (කථන පුහුණුව)
                              </h3>
                            </div>
                            <p className="text-xs text-slate-500">Speech Recognition & Fluency Hub</p>
                          </div>
                        </div>
                        <span className="bg-purple-50 text-purple-700 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-purple-200/60 shrink-0">
                          Primary
                        </span>
                      </div>

                      {/* Score Bar & Enrolled Stats */}
                      <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 space-y-2">
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-slate-500">Class Average</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-black px-2 py-0.2 rounded-full ${
                              avg >= 75 ? 'bg-emerald-100 text-emerald-800' : avg >= 50 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {avg >= 75 ? 'Mastery ⭐' : avg >= 50 ? 'Proficient 👍' : 'Needs Practice ⚠️'}
                            </span>
                            <span className="text-base font-black text-slate-900">{avg}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-purple-600 h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, Math.max(5, avg))}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                          <span>👥 <strong>{primaryStudents.length}</strong> Active Learners</span>
                          <span className="text-purple-600 font-bold group-hover:underline flex items-center gap-0.5">
                            Open Hub <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 4. Pre-School & Grade 1 Hub Overview */}
                {(() => {
                  const avg = getSubjectClassAverage('preschool', preschoolStudents);
                  return (
                    <div 
                      onClick={() => setActiveTab('preschool')}
                      className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                            🎨
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                                4. Pre-School & Gr. 1 (පෙර පාසල්)
                              </h3>
                            </div>
                            <p className="text-xs text-slate-500">Fine Motor, Line Tracing & Coloring</p>
                          </div>
                        </div>
                        <span className="bg-amber-50 text-amber-700 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-amber-200/60 shrink-0">
                          Foundations
                        </span>
                      </div>

                      {/* Score Bar & Enrolled Stats */}
                      <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 space-y-2">
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-slate-500">Class Average</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-black px-2 py-0.2 rounded-full ${
                              avg >= 75 ? 'bg-emerald-100 text-emerald-800' : avg >= 50 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {avg >= 75 ? 'Mastery ⭐' : avg >= 50 ? 'Proficient 👍' : 'Needs Practice ⚠️'}
                            </span>
                            <span className="text-base font-black text-slate-900">{avg}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-amber-600 h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, Math.max(5, avg))}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                          <span>👥 <strong>{preschoolStudents.length}</strong> Active Learners</span>
                          <span className="text-amber-700 font-bold group-hover:underline flex items-center gap-0.5">
                            Open Hub <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

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

            {/* Math Quick Launch Hubs (Below Table) */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                🚀 Grade-wise Math Assessment Hubs (ශ්‍රේණි අනුව ගණිත මොඩියුල)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-3 hover:border-slate-300 hover:bg-white transition-all shadow-xs">
                  <div>
                    <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">Grade 2 Math</span>
                    <h3 className="text-base font-black text-slate-900 mt-1.5">2 ශ්‍රේණිය — අනුවර්තී ගණිතය</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      100 දක්වා සංඛ්‍යා, 20 දක්වා එකතු කිරීම්/අඩු කිරීම්, අභිමත මිනුම් සහ හැඩතල කුසලතා 20ක්.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/module/math/grade2')}
                    className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Launch Grade 2 Math</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-3 hover:border-slate-300 hover:bg-white transition-all shadow-xs">
                  <div>
                    <span className="text-[11px] font-extrabold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">Grade 3 Math</span>
                    <h3 className="text-base font-black text-slate-900 mt-1.5">3 ශ්‍රේණිය — අනුවර්තී ගණිතය</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      ප්‍රධාන ක්ෂේත්‍ර 4ක්, කුසලතා 20ක් සහ අපහසුතා මට්ටම් 5ක් ඔස්සේ තනි පුද්ගල ඉගෙනුම් විශ්ලේෂණය.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/module/math/grade3')}
                    className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Launch Grade 3 Math</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-3 hover:border-slate-300 hover:bg-white transition-all shadow-xs">
                  <div>
                    <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Grade 4 Math</span>
                    <h3 className="text-base font-black text-slate-900 mt-1.5">4 ශ්‍රේණිය — ගණිතය (36 Chapters)</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      වාර 3ක පරිච්ඡේද 36ක්, Adaptive AI දුෂ්කරතා මට්ටම් සහ මුහුණේ ඉරියව් හඳුනාගැනීම.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/module/math')}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Launch Grade 4 Math</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
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

            {/* Sinhala Grade Cards (Below Table) */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                🚀 Grade-wise Sinhala Assessment Hubs (ශ්‍රේණි අනුව සිංහල මොඩියුල)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-3 hover:border-slate-300 hover:bg-white transition-all shadow-xs">
                  <div>
                    <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">Grade 2 Sinhala</span>
                    <h3 className="text-base font-black text-slate-900 mt-1.5">2 ශ්‍රේණිය — 5-Paper System</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Paper 1 (Diagnostic) සිට Paper 5 දක්වා දුර්වලතා හඳුනාගැනීම සහ ඉලක්කගත අභ්‍යාස.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/module/sinhala/grade2')}
                    className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Launch Grade 2 Sinhala</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-3 hover:border-slate-300 hover:bg-white transition-all shadow-xs">
                  <div>
                    <span className="text-[11px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">Grade 3 Sinhala</span>
                    <h3 className="text-base font-black text-slate-900 mt-1.5">3 ශ්‍රේණිය — 5-Paper System</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      ප්‍රශ්න 100ක අයිතම බැංකුව (Unique 5 Papers) සහ දුෂ්කරතා අනුවර්තනය.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/module/sinhala/grade3')}
                    className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Launch Grade 3 Sinhala</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-3 hover:border-slate-300 hover:bg-white transition-all shadow-xs">
                  <div>
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">Grade 4 Sinhala</span>
                    <h3 className="text-base font-black text-slate-900 mt-1.5">4 ශ්‍රේණිය — 150-Item Bank</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      කාණ්ඩ 5ක ප්‍රශ්න 150ක් (Zero Repetition Guarantee) සහ පරිපූර්ණ ඇගයීම.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/module/sinhala/grade4')}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Launch Grade 4 Sinhala</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
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

      </main>
    </div>
  );
};

export default TeacherDashboard;
