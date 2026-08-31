import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  BarChart3, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  Brain, 
  Layers, 
  ChevronRight, 
  Lock, 
  AlertCircle 
} from 'lucide-react';
import StudentAnalyticsOverview from '../components/analytics/StudentAnalyticsOverview';
import { fetchStudentAnalyticsFromApi } from '../data/studentAnalyticsData';
import { getItem, clearSession } from '../utils/storage';

const isPreSchoolStudent = (gradeStr) => {
  if (!gradeStr) return false;
  const g = gradeStr.toLowerCase().trim();
  return g.includes('pre') || g.includes('preschool') || g.includes('pre-school') || g.includes('grade 1') || g === '1';
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialView = () => {
    const fromUrl = searchParams.get('view');
    if (fromUrl && ['modules', 'analytics'].includes(fromUrl)) return fromUrl;
    try {
      const fromStorage = localStorage.getItem('student_dashboard_view');
      if (fromStorage && ['modules', 'analytics'].includes(fromStorage)) return fromStorage;
    } catch (e) {}
    return 'modules';
  };

  const [student, setStudent] = useState(null);
  const [activeView, setActiveViewState] = useState(getInitialView);
  const [showSinhalaHubs, setShowSinhalaHubs] = useState(false);
  const [showPreSchoolHub, setShowPreSchoolHub] = useState(false);
  const [showMathHubs, setShowMathHubs] = useState(false);
  const [lockedNotice, setLockedNotice] = useState('');

  const setActiveView = (newView) => {
    setActiveViewState(newView);
    setSearchParams({ view: newView });
    try {
      localStorage.setItem('student_dashboard_view', newView);
    } catch (e) {}
  };

  useEffect(() => {
    const fromUrl = searchParams.get('view');
    if (fromUrl && fromUrl !== activeView && ['modules', 'analytics'].includes(fromUrl)) {
      setActiveViewState(fromUrl);
      try {
        localStorage.setItem('student_dashboard_view', fromUrl);
      } catch (e) {}
    }
    const hub = searchParams.get('hub');
    if (hub === 'sinhala') {
      setShowSinhalaHubs(true);
      setShowMathHubs(false);
      setShowPreSchoolHub(false);
    } else if (hub === 'math') {
      setShowMathHubs(true);
      setShowSinhalaHubs(false);
      setShowPreSchoolHub(false);
    } else if (hub === 'preschool') {
      setShowPreSchoolHub(true);
      setShowSinhalaHubs(false);
      setShowMathHubs(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const token = getItem('token');
    const role = getItem('role');
    if (!token) {
      navigate('/login');
      return;
    }
    if (role === 'teacher') {
      navigate('/teacher/dashboard');
      return;
    }

    const name = getItem('studentName') || 'Student';
    const studentId = getItem('studentId') || name;
    const grade = getItem('studentGrade') || 'Grade 4';
    const masteryLevelsStr = getItem('masteryLevels');
    
    let masteryLevels = { math: 0.5, english: 0.5, sinhala: 0.5, motorSkills: 0.5 };
    if (masteryLevelsStr) {
      try {
        masteryLevels = JSON.parse(masteryLevelsStr);
      } catch (e) {
        console.error("Failed to parse mastery levels");
      }
    }

    setStudent({ name, studentId, grade, masteryLevels, overallAverage: 0 });

    // Fetch dynamic student profile from MongoDB
    fetchStudentAnalyticsFromApi(studentId).then(apiStudent => {
      if (apiStudent) {
        setStudent({
          name: apiStudent.name || name,
          studentId: apiStudent.studentId || studentId,
          grade: apiStudent.grade || grade,
          overallAverage: apiStudent.overallAverage || 0,
          totalExercises: apiStudent.totalExercises || 0,
          masteryLevels
        });
      }
    }).catch(err => {
      console.warn("MongoDB student profile load fallback:", err);
    });
  }, [navigate]);

  const navigateToModule = (moduleId) => {
    navigate(`/module/${moduleId}`);
  };

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  if (!student) return <div className="p-12 text-center text-slate-500">Loading profile...</div>;

  const isPreSchool = isPreSchoolStudent(student.grade);
  const isEnglish = getItem('studentMedium') === 'English';

  const handleCardClick = (target, isLocked, reason) => {
    if (isLocked) {
      setLockedNotice(reason);
      setTimeout(() => setLockedNotice(''), 4000);
      return;
    }
    setLockedNotice('');
    if (target === 'math') setShowMathHubs(true);
    else if (target === 'sinhala') setShowSinhalaHubs(true);
    else if (target === 'preschool') setShowPreSchoolHub(true);
    else if (target === 'english') navigateToModule('english');
  };

  return (
    <div className="flex-grow bg-slate-50 w-full pt-3 pb-10 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation & View Switcher */}
        {!showMathHubs && !showSinhalaHubs && !showPreSchoolHub && (
          <div className="mb-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 sm:p-3.5 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('modules')}
                className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  activeView === 'modules'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{isEnglish ? 'Learning Hubs' : 'ඉගෙනුම් මොඩියුල (Learning Hubs)'}</span>
              </button>
              
              <button
                onClick={() => setActiveView('analytics')}
                className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  activeView === 'analytics'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>{isEnglish ? 'Student Analytics' : 'ප්‍රගති විශ්ලේෂණය (Student Analytics)'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-black px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
                {student.grade}
              </span>
              <button 
                onClick={handleLogout}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Lock Warning Toast Notification */}
        {lockedNotice && (
          <div className="mb-6 p-4 bg-amber-500 text-white rounded-2xl shadow-lg flex items-center gap-3 animate-bounce">
            <Lock className="w-5 h-5 shrink-0" />
            <p className="text-xs sm:text-sm font-bold">{lockedNotice}</p>
          </div>
        )}

        {/* ANALYTICS TAB VIEW */}
        {activeView === 'analytics' && !showMathHubs && !showSinhalaHubs && !showPreSchoolHub ? (
          <StudentAnalyticsOverview initialStudentId={student?.studentId || student?.name || 'std_001'} isTeacherView={false} />
        ) : showMathHubs ? (
          /* MATH HUBS */
          <>
            <header className="mb-10 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button 
                  onClick={() => setShowMathHubs(false)}
                  className="text-xs sm:text-sm font-bold text-blue-700 hover:text-white hover:bg-blue-600 bg-blue-50 border border-blue-200 px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <span>⬅</span> Back to Dashboard
                </button>
                <div className="text-center flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-blue-900 mb-1 whitespace-nowrap">
                    {getItem('studentMedium') === 'English' ? 'Mathematics Grade Hubs' : 'ගණිතය ශ්‍රේණි කාණ්ඩ (Mathematics Grade Hubs)'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {getItem('studentMedium') === 'English' ? 'Choose your Grade level (Grade 2, 3 or 4)' : 'ඔබේ ශ්‍රේණිය තෝරන්න — Choose your Grade level (Grade 2, 3 or 4)'}
                  </p>
                </div>
                <div className="hidden sm:block w-36 shrink-0"></div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Grade 2 Math */}
              <div 
                onClick={() => navigate('/module/math/grade2')}
                className="bg-gradient-to-br from-amber-50 via-teal-50 to-emerald-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-8 cursor-pointer border-3 border-teal-400 hover:border-teal-600 group transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between ring-2 ring-teal-400/30"
              >
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-extrabold text-xs px-5 py-1.5 rounded-full shadow-md transform rotate-12">
                  Adaptive AI ⭐
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-slate-800 group-hover:text-teal-700 transition-colors">
                      {getItem('studentMedium') === 'English' ? 'Grade 2 — Mathematics' : '2 ශ්‍රේණිය — ගණිතය'}
                    </h2>
                    <div className="p-3 bg-teal-100 rounded-2xl group-hover:bg-teal-200 transition-colors">
                      <span className="text-4xl">🌱</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-5 text-sm leading-relaxed">
                    {getItem('studentMedium') === 'English' 
                      ? 'Adaptive Math Assessment System — Numbers up to 100, Addition/Subtraction up to 20, Measurement & Geometry.' 
                      : 'අනුවර්තී ගණිත ඇගයීම් පද්ධතිය — 100 දක්වා සංඛ්‍යා, 20 දක්වා එකතු කිරීම්/අඩු කිරීම්, අභිමත මිනුම් සහ හැඩතල.'}
                  </p>
                </div>
                <div className="space-y-2 pt-4 border-t border-teal-200">
                  <div className="flex justify-between items-center text-xs font-bold text-teal-900">
                    <span>4 Domains · 20 Skills</span>
                    <span className="bg-teal-200 text-teal-900 px-3 py-0.5 rounded-full font-black">Adaptive Test ➔</span>
                  </div>
                </div>
              </div>

              {/* Grade 3 Math */}
              <div 
                onClick={() => navigate('/module/math/grade3')}
                className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-8 cursor-pointer border-3 border-purple-400 hover:border-purple-600 group transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between ring-2 ring-purple-400/30"
              >
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs px-5 py-1.5 rounded-full shadow-md transform rotate-12">
                  Adaptive AI ⭐
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-slate-800 group-hover:text-purple-600 transition-colors">
                      {getItem('studentMedium') === 'English' ? 'Grade 3 — Mathematics' : '3 ශ්‍රේණිය — ගණිතය'}
                    </h2>
                    <div className="p-3 bg-purple-100 rounded-2xl group-hover:bg-purple-200 transition-colors">
                      <span className="text-4xl">🎯</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-5 text-sm leading-relaxed">
                    {getItem('studentMedium') === 'English' 
                      ? 'Adaptive Math Assessment System — 4 Core Domains, 20 Skills & 5 Difficulty Levels.' 
                      : 'අනුවර්තී ගණිත ඇගයීම් පද්ධතිය — ප්‍රධාන ක්ෂේත්‍ර 4ක්, කුසලතා 20ක් සහ අපහසුතා මට්ටම් 5ක් ඔස්සේ තනි පුද්ගල ඇගයීම.'}
                  </p>
                </div>
                <div className="space-y-2 pt-4 border-t border-purple-200">
                  <div className="flex justify-between items-center text-xs font-bold text-purple-900">
                    <span>4 Domains · 20 Skills</span>
                    <span className="bg-purple-200 text-purple-900 px-3 py-0.5 rounded-full font-black">Adaptive Test ➔</span>
                  </div>
                </div>
              </div>

              {/* Grade 4 Math */}
              <div 
                onClick={() => navigate('/module/math/grade4')}
                className="bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-8 cursor-pointer border-3 border-blue-400 hover:border-blue-600 group transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between ring-2 ring-blue-400/30"
              >
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-extrabold text-xs px-5 py-1.5 rounded-full shadow-md transform rotate-12">
                  Adaptive AI ⭐
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                      {getItem('studentMedium') === 'English' ? 'Grade 4 — Mathematics' : '4 ශ්‍රේණිය — ගණිතය'}
                    </h2>
                    <div className="p-3 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors">
                      <span className="text-4xl">🧮</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-5 text-sm leading-relaxed">
                    {getItem('studentMedium') === 'English' 
                      ? 'Adaptive Math Assessment System — 4 Core Domains, 20 Skills & 5 Difficulty Levels.' 
                      : 'අනුවර්තී ගණිත ඇගයීම් පද්ධතිය — ප්‍රධාන ක්ෂේත්‍ර 4ක්, කුසලතා 20ක් සහ අපහසුතා මට්ටම් 5ක් ඔස්සේ තනි පුද්ගල ඇගයීම.'}
                  </p>
                </div>
                <div className="space-y-2 pt-4 border-t border-blue-200">
                  <div className="flex justify-between items-center text-xs font-bold text-blue-900">
                    <span>4 Domains · 20 Skills</span>
                    <span className="bg-blue-200 text-blue-900 px-3 py-0.5 rounded-full font-black">Adaptive Test ➔</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : showSinhalaHubs ? (
          /* SINHALA HUBS */
          <>
            <header className="mb-10 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button 
                  onClick={() => setShowSinhalaHubs(false)}
                  className="text-xs sm:text-sm font-bold text-teal-700 hover:text-white hover:bg-teal-600 bg-teal-50 border border-teal-200 px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <span>⬅</span> Back to Dashboard
                </button>
                <div className="text-center flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-teal-950 mb-1 font-sinhala whitespace-nowrap">
                    සිංහල ශ්‍රේණි කාණ්ඩ (Sinhala Grade Hubs)
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600">5-Paper අනුවර්තී ඇගයීම් පද්ධතිය — Choose your grade level</p>
                </div>
                <div className="hidden sm:block w-36 shrink-0"></div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Grade 2 Sinhala */}
              <div 
                onClick={() => navigate('/module/sinhala/grade2')}
                className="bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-6 sm:p-7 cursor-pointer border-3 border-amber-300 hover:border-amber-500 group transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-extrabold text-[11px] px-3.5 py-1 rounded-full shadow-md">
                  Grade 2 Hub ⭐
                </div>
                <div>
                  <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden mb-4 border border-amber-200/80 shadow-inner relative bg-amber-100">
                    <img 
                      src="/images/sinhala/grade2_banner.jpg" 
                      alt="2 ශ්‍රේණිය — සිංහල" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-950 group-hover:text-amber-800 transition-colors font-sinhala mb-2">
                    2 ශ්‍රේණිය — සිංහල
                  </h2>
                  <p className="text-slate-600 mb-5 text-xs sm:text-sm leading-relaxed font-sinhala">
                    5-Paper අනුවර්තී ඇගයීම් පද්ධතිය, AI දුර්වලතා හඳුනාගැනීම සහ විශේෂ අභ්‍යාස මාලාව.
                  </p>
                </div>
                <div className="pt-3 border-t border-amber-200/80">
                  <span className="bg-amber-200/90 text-amber-900 px-3.5 py-1 rounded-full font-black text-xs inline-block group-hover:bg-amber-500 group-hover:text-white transition-colors">5-Paper System ➔</span>
                </div>
              </div>

              {/* Grade 3 Sinhala */}
              <div 
                onClick={() => navigate('/module/sinhala/grade3')}
                className="bg-gradient-to-br from-purple-50 via-indigo-50 to-sky-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-6 sm:p-7 cursor-pointer border-3 border-purple-300 hover:border-purple-500 group transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-[11px] px-3.5 py-1 rounded-full shadow-md">
                  Grade 3 Adaptive ⭐
                </div>
                <div>
                  <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden mb-4 border border-purple-200/80 shadow-inner relative bg-purple-100">
                    <img 
                      src="/images/sinhala/grade3_banner.jpg" 
                      alt="3 ශ්‍රේණිය — සිංහල" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-purple-950 group-hover:text-purple-800 transition-colors font-sinhala mb-2">
                    3 ශ්‍රේණිය — සිංහල
                  </h2>
                  <p className="text-slate-600 mb-5 text-xs sm:text-sm leading-relaxed font-sinhala">
                    5-Paper අනුවර්තී ඇගයීම් පද්ධතිය (Diagnostic Baseline to Final Mastery).
                  </p>
                </div>
                <div className="pt-3 border-t border-purple-200/80">
                  <span className="bg-purple-200/90 text-purple-950 px-3.5 py-1 rounded-full font-black text-xs inline-block group-hover:bg-purple-600 group-hover:text-white transition-colors">5-Paper System ➔</span>
                </div>
              </div>

              {/* Grade 4 Sinhala */}
              <div 
                onClick={() => navigate('/module/sinhala/grade4')}
                className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-6 sm:p-7 cursor-pointer border-3 border-emerald-300 hover:border-emerald-500 group transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-[11px] px-3.5 py-1 rounded-full shadow-md">
                  Grade 4 Adaptive ⭐
                </div>
                <div>
                  <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden mb-4 border border-emerald-200/80 shadow-inner relative bg-emerald-100">
                    <img 
                      src="/images/sinhala/grade4_banner.jpg" 
                      alt="4 ශ්‍රේණිය — සිංහල" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-emerald-950 group-hover:text-emerald-800 transition-colors font-sinhala mb-2">
                    4 ශ්‍රේණිය — සිංහල
                  </h2>
                  <p className="text-slate-600 mb-5 text-xs sm:text-sm leading-relaxed font-sinhala">
                    5-Paper අනුවර්තී ඇගයීම් පද්ධතිය (150 Items) — සමාන/විරුද්ධ පද, ප්‍රස්තාව පිරුළු, ව්‍යාකරණ.
                  </p>
                </div>
                <div className="pt-3 border-t border-emerald-200/80">
                  <span className="bg-emerald-200/90 text-emerald-950 px-3.5 py-1 rounded-full font-black text-xs inline-block group-hover:bg-emerald-600 group-hover:text-white transition-colors">5-Paper System ➔</span>
                </div>
              </div>
            </div>
          </>
        ) : showPreSchoolHub ? (
          /* PRE-SCHOOL HUBS */
          <>
            <header className="mb-10 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button 
                  onClick={() => setShowPreSchoolHub(false)}
                  className="text-xs sm:text-sm font-bold text-purple-700 hover:text-white hover:bg-purple-600 bg-purple-50 border border-purple-200 px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <span>⬅</span> Back to Dashboard
                </button>
                <div className="text-center flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-purple-950 mb-1 font-sinhala whitespace-nowrap">
                    Pre-School & Grade 1 (පෙර පාසල් සහ 1 ශ්‍රේණිය)
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600">සිත් ඇදගන්නා ක්‍රියාකාරකම් — Line Tracing, Coloring & Story Drawing</p>
                </div>
                <div className="hidden sm:block w-36 shrink-0"></div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              
              {/* 1. Line Tracing Card (Pre-School) */}
              <div 
                onClick={() => navigateToModule('motor')}
                className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all p-5 sm:p-6 cursor-pointer border-3 border-purple-200 hover:border-purple-500 group transform hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden mb-4 bg-purple-50 border border-purple-100 shadow-inner">
                    <img 
                      src="/images/preschool/line_tracing.png" 
                      alt="රේඛා මත ලියමු (Line Tracing)" 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mb-2">
                    <span className="text-[11px] font-extrabold text-purple-700 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      Pre-School (පෙර පාසල්)
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-purple-700 transition-colors font-sinhala mb-1">
                    රේඛා මත ලියමු (Line Tracing)
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    අත් මෝටර් කුසලතා වර්ධනය සඳහා තිත් රේඛා ඔස්සේ ඇඳීමේ අභ්‍යාස.
                  </p>
                </div>
                <div className="pt-3 border-t border-purple-100 flex justify-between items-center text-xs font-black text-purple-700">
                  <span>Pre-School Fine Motor</span>
                  <span className="bg-purple-100 text-purple-900 px-3 py-1 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors">Start Tracing ➔</span>
                </div>
              </div>

              {/* 2. Digital Coloring Card (Pre-School) */}
              <div 
                onClick={() => navigateToModule('coloring')}
                className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all p-5 sm:p-6 cursor-pointer border-3 border-pink-200 hover:border-pink-500 group transform hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden mb-4 bg-pink-50 border border-pink-100 shadow-inner">
                    <img 
                      src="/images/preschool/digital_coloring.jpg" 
                      alt="පින්තූර පාට කරමු (Digital Coloring)" 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mb-2">
                    <span className="text-[11px] font-extrabold text-pink-700 bg-pink-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      Pre-School (පෙර පාසල්)
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-pink-700 transition-colors font-sinhala mb-1">
                    පින්තූර පාට කරමු (Digital Coloring)
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    AI Region Masking සහිත සිත් ඇදගන්නා ඩිජිටල් පාට කිරීමේ පොත.
                  </p>
                </div>
                <div className="pt-3 border-t border-pink-100 flex justify-between items-center text-xs font-black text-pink-700">
                  <span>Pre-School Coloring</span>
                  <span className="bg-pink-100 text-pink-900 px-3 py-1 rounded-full group-hover:bg-pink-600 group-hover:text-white transition-colors">Start Coloring ➔</span>
                </div>
              </div>

              {/* 3. Story Drawing Card (Grade 1) */}
              <div 
                onClick={() => navigateToModule('storydrawing')}
                className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all p-5 sm:p-6 cursor-pointer border-3 border-amber-200 hover:border-amber-500 group transform hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden mb-4 bg-amber-50 border border-amber-100 shadow-inner">
                    <img 
                      src="/images/preschool/story_drawing.jpg" 
                      alt="කතාවට පින්තූරයක් අඳිමු (Story Drawing)" 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mb-2">
                    <span className="text-[11px] font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      Grade 1 (1 ශ්‍රේණිය)
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-amber-700 transition-colors font-sinhala mb-1">
                    කතාවට පින්තූරයක් අඳිමු (Story Drawing)
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    කතාවට සවන් දී චිත්‍රය අඳින්න! AI මගින් ඇගයීම ලබා ගන්න.
                  </p>
                </div>
                <div className="pt-3 border-t border-amber-100 flex justify-between items-center text-xs font-black text-amber-800">
                  <span>Grade 1 Comprehension</span>
                  <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full group-hover:bg-amber-600 group-hover:text-white transition-colors">Start Drawing ➔</span>
                </div>
              </div>

            </div>
          </>
        ) : (
          /* MAIN 4 FUNCTIONS DASHBOARD WITH GRADE-BASED ACCESS CONTROL */
          <>
            <header className="mb-10 text-center animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
                {isEnglish ? `Welcome, ${student.name}!` : `සාදරයෙන් පිළිගනිමු, ${student.name}!`}
              </h1>
              <p className="text-slate-600">
                {isPreSchool 
                  ? 'Your profile is set for Pre-School & Grade 1. Enjoy motor skills, coloring, and craft activities below!'
                  : `Your profile is set for ${student.grade}. Complete your adaptive primary subject modules below!`}
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* 1. Mathematics Grade Hubs Card (Locked for Pre-School) */}
              <div 
                onClick={() => handleCardClick('math', isPreSchool, 'ගණිතය මොඩියුලය 2, 3, 4 ශ්‍රේණි සඳහා පමණක් සීමා කර ඇත (Mathematics is for Grade 2, 3, 4)')}
                className={`rounded-3xl shadow-md transition-all p-5 relative overflow-hidden flex flex-col justify-between ${
                  isPreSchool 
                    ? 'bg-slate-100 border-2 border-slate-200 opacity-65 cursor-not-allowed'
                    : 'bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border-3 border-blue-300 hover:border-blue-500 hover:shadow-2xl cursor-pointer group transform hover:-translate-y-1'
                }`}
              >
                {isPreSchool && (
                  <div className="absolute top-3 right-3 z-20 bg-slate-800/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Lock className="w-2.5 h-2.5" /> Grade 2, 3, 4 Only
                  </div>
                )}
                <div>
                  {/* Card Preview Image */}
                  <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-4 border border-blue-200/80 shadow-inner relative bg-blue-100">
                    <img 
                      src="/images/dashboard_math.jpg" 
                      alt="Mathematics Grade Hubs" 
                      className="w-full h-full object-cover object-[center_48%] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h2 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors mb-1.5 leading-snug">
                    {isEnglish ? 'Mathematics Grade Hubs' : 'ගණිතය ශ්‍රේණි කාණ්ඩ (Mathematics)'}
                  </h2>
                  <p className="text-slate-600 mb-4 text-xs leading-relaxed">
                    {isEnglish
                      ? 'Multimodal AI adaptive math exercises & assessment chapters for Grades 2, 3 and 4.'
                      : '2, 3 සහ 4 ශ්‍රේණි සඳහා Multimodal AI adaptive ගණිත අභ්‍යාස සහ පරිච්ඡේද.'}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-slate-200/80">
                  <span className={`text-[11px] font-bold ${isPreSchool ? 'text-slate-400' : 'text-blue-600'}`}>
                    {isPreSchool ? '🔒 Locked for Pre-School' : (isEnglish ? 'Select Hub ➔' : 'තෝරා ගන්න ➔')}
                  </span>
                </div>
              </div>

              {/* 2. English Module (Locked for Pre-School) */}
              <div 
                onClick={() => handleCardClick('english', isPreSchool, 'English Speech මොඩියුලය 2, 3, 4 ශ්‍රේණි සඳහා පමණක් සීමා කර ඇත (English Speech is for Grade 2, 3, 4)')}
                className={`rounded-3xl shadow-md transition-all p-5 relative overflow-hidden flex flex-col justify-between ${
                  isPreSchool 
                    ? 'bg-slate-100 border-2 border-slate-200 opacity-65 cursor-not-allowed'
                    : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-3 border-emerald-300 hover:border-emerald-500 hover:shadow-2xl cursor-pointer group transform hover:-translate-y-1'
                }`}
              >
                {isPreSchool && (
                  <div className="absolute top-3 right-3 z-20 bg-slate-800/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Lock className="w-2.5 h-2.5" /> Grade 2, 3, 4 Only
                  </div>
                )}
                <div>
                  {/* Card Preview Image */}
                  <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-4 border border-emerald-200/80 shadow-inner relative bg-emerald-100">
                    <img 
                      src="/images/dashboard_english.jpg" 
                      alt="English Speech" 
                      className="w-full h-full object-cover object-[center_48%] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h2 className="text-lg font-black text-slate-800 group-hover:text-green-600 transition-colors mb-1.5 leading-snug">
                    English Speech & Pronunciation
                  </h2>
                  <p className="text-slate-600 mb-4 text-xs leading-relaxed">
                    Interactive speech games and pronunciation error detection tailored for Sinhala speakers.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-slate-200/80">
                  <span className={`text-[11px] font-bold ${isPreSchool ? 'text-slate-400' : 'text-emerald-600'}`}>
                    {isPreSchool ? '🔒 Locked for Pre-School' : 'Start Speech AI ➔'}
                  </span>
                </div>
              </div>

              {/* 3. Pre-School & Grade 1 Combined Card (Locked for Grade 2, 3, 4) */}
              <div 
                onClick={() => handleCardClick('preschool', !isPreSchool, 'පෙර පාසල් ක්‍රියාකාරකම් Pre-School & Grade 1 සිසුන් සඳහා පමණි (For Pre-School & Grade 1 Only)')}
                className={`rounded-3xl shadow-md transition-all p-5 relative overflow-hidden flex flex-col justify-between ${
                  !isPreSchool 
                    ? 'bg-slate-100 border-2 border-slate-200 opacity-65 cursor-not-allowed'
                    : 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 border-3 border-purple-300 hover:border-purple-500 hover:shadow-2xl cursor-pointer group transform hover:-translate-y-1'
                }`}
              >
                {!isPreSchool && (
                  <div className="absolute top-3 right-3 z-20 bg-slate-800/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Lock className="w-2.5 h-2.5" /> Pre-School & Gr 1 Only
                  </div>
                )}
                <div>
                  {/* Card Preview Image */}
                  <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-4 border border-purple-200/80 shadow-inner relative bg-purple-100">
                    <img 
                      src="/images/dashboard_preschool.jpg" 
                      alt="Pre-School & Grade 1" 
                      className="w-full h-full object-cover object-[center_48%] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h2 className="text-lg font-black text-slate-800 group-hover:text-purple-700 transition-colors mb-1.5 leading-snug">
                    {isEnglish ? 'Pre-School & Grade 1' : 'Pre-School & Grade 1 (පෙර පාසල් හා 1 ශ්‍රේණිය)'}
                  </h2>
                  <p className="text-slate-600 mb-4 text-xs leading-relaxed">
                    {isEnglish 
                      ? 'Line tracing, digital coloring, and creative storytelling activities for young learners.' 
                      : 'කුඩා ළමුන් සඳහා රේඛා ඇඳීම, පාට කිරීම සහ කතාවට පින්තූර ඇඳීමේ ක්‍රියාකාරකම්.'}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-slate-200/80">
                  <span className={`text-[11px] font-bold ${!isPreSchool ? 'text-slate-400' : 'text-purple-600'}`}>
                    {!isPreSchool ? '🔒 Locked for Primary Grades' : (isEnglish ? 'Select Hub ➔' : 'තෝරා ගන්න ➔')}
                  </span>
                </div>
              </div>

              {/* 4. Sinhala Grade Hubs Card (Locked for Pre-School) */}
              <div 
                onClick={() => handleCardClick('sinhala', isPreSchool, 'සිංහල භාෂා මොඩියුලය 2, 3, 4 ශ්‍රේණි සඳහා පමණක් සීමා කර ඇත (Sinhala Language is for Grade 2, 3, 4)')}
                className={`rounded-3xl shadow-md transition-all p-5 relative overflow-hidden flex flex-col justify-between ${
                  isPreSchool 
                    ? 'bg-slate-100 border-2 border-slate-200 opacity-65 cursor-not-allowed'
                    : 'bg-gradient-to-br from-amber-50 via-teal-50 to-indigo-50 border-3 border-teal-300 hover:border-teal-500 hover:shadow-2xl cursor-pointer group transform hover:-translate-y-1'
                }`}
              >
                {isPreSchool && (
                  <div className="absolute top-3 right-3 z-20 bg-slate-800/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Lock className="w-2.5 h-2.5" /> Grade 2, 3, 4 Only
                  </div>
                )}
                <div>
                  {/* Card Preview Image */}
                  <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-4 border border-teal-200/80 shadow-inner relative bg-teal-100">
                    <img 
                      src="/images/dashboard_sinhala.jpg" 
                      alt="සිංහල ශ්‍රේණි කාණ්ඩ" 
                      className="w-full h-full object-cover object-[center_48%] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h2 className="text-lg font-black text-slate-800 group-hover:text-teal-700 transition-colors mb-1.5 leading-snug">
                    {isEnglish ? 'Sinhala Grade Hubs' : 'සිංහල ශ්‍රේණි කාණ්ඩ (Grade 2, 3, 4 Hubs)'}
                  </h2>
                  <p className="text-slate-600 mb-4 text-xs leading-relaxed">
                    {isEnglish
                      ? 'Sinhala language learning activities and 5-Paper adaptive assessment system for Grades 2, 3 and 4.'
                      : '2, 3 සහ 4 ශ්‍රේණි සඳහා සිංහල භාෂා ඉගෙනුම් ක්‍රියාකාරකම් සහ 5-Paper පද්ධතිය.'}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-slate-200/80">
                  <span className={`text-[11px] font-bold ${isPreSchool ? 'text-slate-400' : 'text-teal-600'}`}>
                    {isPreSchool ? '🔒 Locked for Pre-School' : (isEnglish ? 'Select Hub ➔' : 'තෝරා ගන්න ➔')}
                  </span>
                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
