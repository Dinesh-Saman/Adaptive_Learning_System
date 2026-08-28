import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import StudentAnalyticsOverview from '../components/analytics/StudentAnalyticsOverview';
import CategoryStudentTable from '../components/analytics/CategoryStudentTable';
import { fetchStudentsAnalyticsFromApi } from '../data/studentAnalyticsData';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacherName, setTeacherName] = useState('');
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'math' | 'sinhala' | 'english' | 'preschool'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'teacher') {
      navigate('/login');
      return;
    }

    const name = localStorage.getItem('studentName') || 'Teacher';
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
    localStorage.removeItem('token');
    localStorage.removeItem('studentName');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const classAverage = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + (s.overallAverage || 0), 0) / students.length) 
    : 0;
  const totalExercisesClass = students.reduce((acc, s) => acc + (s.totalExercises || 0), 0);

  const sidebarMenuItems = [
    {
      id: 'overview',
      name: 'සමස්ත විශ්ලේෂණය',
      subtitle: 'Class Overview & Analytics',
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
      subtitle: 'Fine Motor, Tracing & Crafts',
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-2xl font-black shadow-lg">
                🎓
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-white">Adaptive Learning</h1>
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
              ප්‍රධාන කාර්යයන් (Core Functions)
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
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-0.5 text-white' : 'text-slate-600 group-hover:text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" /> Active Roster:
            </span>
            <strong className="text-emerald-300">{students.length} Students</strong>
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
      <main className="flex-grow p-6 sm:p-10 max-w-7xl mx-auto overflow-y-auto space-y-8">
        
        {/* ── TAB 1: OVERVIEW & ANALYTICS WORKSPACE ── */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    පන්ති කාමර ප්‍රගති විශ්ලේෂණය (Class Overview & Analytics)
                  </h1>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                  Multimodal Learning Analytics & Individual Student Diagnostic Reports
                </p>
              </div>
            </div>

            {/* Class Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
                  👥
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Enrolled Students</p>
                  <h3 className="text-2xl font-black text-slate-900">{students.length} Active</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                  📈
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Class Mastery Avg</p>
                  <h3 className="text-2xl font-black text-emerald-700">{classAverage}%</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold">
                  ✅
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Total Completed Tests</p>
                  <h3 className="text-2xl font-black text-purple-700">{totalExercisesClass}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
                  🎯
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Primary Learning Pillars</p>
                  <h3 className="text-2xl font-black text-amber-700">4 Active Hubs</h3>
                </div>
              </div>
            </div>

            {/* Individual Student Diagnostics */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-indigo-600" /> ශිෂ්‍ය තනි පුද්ගල ප්‍රගති විශ්ලේෂණය (Real Student Diagnostics)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Longitudinal weekly scores, radar competency charts, and AI-recommended remedial actions from MongoDB.
                </p>
              </div>

              <StudentAnalyticsOverview isTeacherView={true} />
            </div>
          </div>
        )}

        {/* ── TAB 2: MATHEMATICS HUB (Tabular Students & Drill-down) ── */}
        {activeTab === 'math' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-8 rounded-3xl shadow-xl flex items-center justify-between gap-6">
              <div>
                <span className="bg-blue-500/30 text-blue-200 border border-blue-400/40 text-xs font-black px-3 py-0.5 rounded-full">
                  Pillar 1 Focus
                </span>
                <h1 className="text-3xl font-black mt-2 font-sinhala">1. ගණිතය ශ්‍රේණි කළමනාකරණය (Mathematics Hub)</h1>
                <p className="text-blue-200 text-sm mt-1">
                  Grade 2, Grade 3, and Grade 4 Primary Mathematics Curriculums & Adaptive Multi-Tier Testing
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                🧮
              </div>
            </div>

            {/* Math Quick Launch Hubs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Grade 2 Math</span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">2 ශ්‍රේණිය — අනුවර්තී ගණිතය</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    100 දක්වා සංඛ්‍යා, 20 දක්වා එකතු කිරීම්/අඩු කිරීම්, අභිමත මිනුම් සහ හැඩතල කුසලතා 20ක්.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/module/math/grade2')}
                  className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Grade 2 Math</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-extrabold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Grade 3 Math</span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">3 ශ්‍රේණිය — අනුවර්තී ගණිතය</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    ප්‍රධාන ක්ෂේත්‍ර 4ක්, කුසලතා 20ක් සහ අපහසුතා මට්ටම් 5ක් ඔස්සේ තනි පුද්ගල ඉගෙනුම් විශ්ලේෂණය.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/module/math/grade3')}
                  className="w-full py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Grade 3 Math</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Grade 4 Math</span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">4 ශ්‍රේණිය — ගණිතය (36 Chapters)</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    වාර 3ක පරිච්ඡේද 36ක්, Adaptive AI දුෂ්කරතා මට්ටම් සහ මුහුණේ ඉරියව් හඳුනාගැනීම.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/module/math')}
                  className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Grade 4 Math</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* TABULAR STUDENT LIST & DETAILED DRILL-DOWN MODAL */}
            <CategoryStudentTable subjectKey="math" students={students} />
          </div>
        )}

        {/* ── TAB 3: SINHALA LANGUAGE HUB (Tabular Students & Drill-down) ── */}
        {activeTab === 'sinhala' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-8 rounded-3xl shadow-xl flex items-center justify-between gap-6">
              <div>
                <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-xs font-black px-3 py-0.5 rounded-full">
                  Pillar 2 Focus
                </span>
                <h1 className="text-3xl font-black mt-2 font-sinhala">2. සිංහල භාෂා කළමනාකරණය (Sinhala Language Hub)</h1>
                <p className="text-emerald-200 text-sm mt-1">
                  Grade 2, 3, 4 5-Paper Adaptive Assessment System & Neural Handwriting Recognition AI
                </p>
              </div>
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                🦁
              </div>
            </div>

            {/* Sinhala Grade Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">Grade 2 Sinhala</span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">2 ශ්‍රේණිය — 5-Paper System</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Paper 1 (Diagnostic) සිට Paper 5 දක්වා දුර්වලතා හඳුනාගැනීම සහ ඉලක්කගත අභ්‍යාස.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/module/sinhala/grade2')}
                  className="w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Grade 2 Sinhala</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">Grade 3 Sinhala</span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">3 ශ්‍රේණිය — 5-Paper System</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    ප්‍රශ්න 100ක අයිතම බැංකුව (Unique 5 Papers) සහ දුෂ්කරතා අනුවර්තනය.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/module/sinhala/grade3')}
                  className="w-full py-3 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Grade 3 Sinhala</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">Grade 4 Sinhala</span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">4 ශ්‍රේණිය — 150-Item Bank</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    කාණ්ඩ 5ක ප්‍රශ්න 150ක් (Zero Repetition Guarantee) සහ පරිපූර්ණ ඇගයීම.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/module/sinhala/grade4')}
                  className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Grade 4 Sinhala</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* TABULAR STUDENT LIST & DETAILED DRILL-DOWN MODAL */}
            <CategoryStudentTable subjectKey="sinhala" students={students} />
          </div>
        )}

        {/* ── TAB 4: ENGLISH SPEECH HUB (Tabular Students & Drill-down) ── */}
        {activeTab === 'english' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-8 rounded-3xl shadow-xl flex items-center justify-between gap-6">
              <div>
                <span className="bg-purple-500/30 text-purple-200 border border-purple-400/40 text-xs font-black px-3 py-0.5 rounded-full">
                  Pillar 3 Focus
                </span>
                <h1 className="text-3xl font-black mt-2">3. English Speech & Pronunciation Hub</h1>
                <p className="text-purple-200 text-sm mt-1">
                  Real-time Speech Recognition, Phonetic Accuracy & Intonation Monitoring for Primary ESL
                </p>
              </div>
              <div className="w-16 h-16 bg-purple-500/20 border border-purple-400/30 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                🗣️
              </div>
            </div>

            {/* TABULAR STUDENT LIST & DETAILED DRILL-DOWN MODAL */}
            <CategoryStudentTable subjectKey="english" students={students} />
          </div>
        )}

        {/* ── TAB 5: PRE-SCHOOL & GRADE 1 HUB (Tabular Students & Drill-down) ── */}
        {activeTab === 'preschool' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-amber-950 text-white p-8 rounded-3xl shadow-xl flex items-center justify-between gap-6">
              <div>
                <span className="bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-black px-3 py-0.5 rounded-full">
                  Pillar 4 Focus
                </span>
                <h1 className="text-3xl font-black mt-2 font-sinhala">4. Pre-School & Grade 1 (පෙර පාසල් හා 1 ශ්‍රේණිය)</h1>
                <p className="text-amber-200 text-sm mt-1">
                  Fine Motor Coordination, Digital Coloring, Computer Vision Paper Craft & Story Drawing
                </p>
              </div>
              <div className="w-16 h-16 bg-amber-500/20 border border-amber-400/30 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                🎨
              </div>
            </div>

            {/* TABULAR STUDENT LIST & DETAILED DRILL-DOWN MODAL */}
            <CategoryStudentTable subjectKey="preschool" students={students} />
          </div>
        )}

      </main>
    </div>
  );
};

export default TeacherDashboard;
