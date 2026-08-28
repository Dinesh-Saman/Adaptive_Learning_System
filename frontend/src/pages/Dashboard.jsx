import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const isPreSchoolStudent = (gradeStr) => {
  if (!gradeStr) return false;
  const g = gradeStr.toLowerCase().trim();
  return g.includes('pre') || g.includes('preschool') || g.includes('pre-school') || g.includes('grade 1') || g === '1';
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [activeView, setActiveView] = useState('modules'); // 'modules' | 'analytics'
  const [showSinhalaHubs, setShowSinhalaHubs] = useState(false);
  const [showPreSchoolHub, setShowPreSchoolHub] = useState(false);
  const [showMathHubs, setShowMathHubs] = useState(false);
  const [lockedNotice, setLockedNotice] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      navigate('/login');
      return;
    }
    if (role === 'teacher') {
      navigate('/teacher/dashboard');
      return;
    }

    const name = localStorage.getItem('studentName') || 'Student';
    const studentId = localStorage.getItem('studentId') || name;
    const grade = localStorage.getItem('studentGrade') || 'Grade 4';
    const masteryLevelsStr = localStorage.getItem('masteryLevels');
    
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
    localStorage.removeItem('token');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentGrade');
    localStorage.removeItem('studentId');
    localStorage.removeItem('masteryLevels');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (!student) return <div className="p-12 text-center text-slate-500">Loading profile...</div>;

  const isPreSchool = isPreSchoolStudent(student.grade);

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
    <div className="flex-grow bg-slate-50 w-full py-10 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation & View Switcher */}
        {!showMathHubs && !showSinhalaHubs && !showPreSchoolHub && (
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-3xl shadow-sm border border-slate-100">
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
                <span>ඉගෙනුම් මොඩියුල (Learning Hubs)</span>
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
                <span>ප්‍රගති විශ්ලේෂණය (Student Analytics)</span>
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
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-blue-900 mb-1 font-sinhala whitespace-nowrap">
                    ගණිතය ශ්‍රේණි කාණ්ඩ (Mathematics Grade Hubs)
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600">ඔබේ ශ්‍රේණිය තෝරන්න — Choose your Grade level (Grade 2, 3 or 4)</p>
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
                    <h2 className="text-2xl font-black text-slate-800 group-hover:text-teal-700 transition-colors font-sinhala">2 ශ්‍රේණිය — ගණිතය</h2>
                    <div className="p-3 bg-teal-100 rounded-2xl group-hover:bg-teal-200 transition-colors">
                      <span className="text-4xl">🌱</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-5 text-sm leading-relaxed font-sinhala">
                    අනුවර්තී ගණිත ඇගයීම් පද්ධතිය — 100 දක්වා සංඛ්‍යා, 20 දක්වා එකතු කිරීම්/අඩු කිරීම්, අභිමත මිනුම් සහ හැඩතල.
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
                    <h2 className="text-2xl font-black text-slate-800 group-hover:text-purple-600 transition-colors font-sinhala">3 ශ්‍රේණිය — ගණිතය</h2>
                    <div className="p-3 bg-purple-100 rounded-2xl group-hover:bg-purple-200 transition-colors">
                      <span className="text-4xl">🎯</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-5 text-sm leading-relaxed font-sinhala">
                    අනුවර්තී ගණිත ඇගයීම් පද්ධතිය — ප්‍රධාන ක්ෂේත්‍ර 4ක්, කුසලතා 20ක් සහ අපහසුතා මට්ටම් 5ක් ඔස්සේ තනි පුද්ගල ඇගයීම.
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
                onClick={() => navigateToModule('math')}
                className="bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-8 cursor-pointer border-3 border-blue-400 hover:border-blue-600 group transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between ring-2 ring-blue-400/30"
              >
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-extrabold text-xs px-5 py-1.5 rounded-full shadow-md transform rotate-12">
                  Grade 4 Adaptive ⭐
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors font-sinhala">4 ශ්‍රේණිය — ගණිතය</h2>
                    <div className="p-3 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors">
                      <span className="text-4xl">🧮</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-5 text-sm leading-relaxed font-sinhala">
                    4 ශ්‍රේණිය සම්පූර්ණ විෂය නිර්දේශය — වාර 3ක පරිච්ඡේද 36ක්, Adaptive AI දුෂ්කරතා මට්ටම්.
                  </p>
                </div>
                <div className="space-y-2 pt-4 border-t border-blue-200">
                  <div className="flex justify-between items-center text-xs font-bold text-blue-900">
                    <span>වාර 3ක් · පරිච්ඡේද 36ක්</span>
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full font-black">All Active ➔</span>
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
                className="bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-8 cursor-pointer border-3 border-amber-300 hover:border-amber-500 group transform hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-extrabold text-xs px-5 py-1.5 rounded-full shadow-md transform rotate-12">
                  Grade 2 Hub ⭐
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-amber-950 group-hover:text-amber-800 transition-colors font-sinhala">2 ශ්‍රේණිය — සිංහල</h2>
                  <div className="p-3 bg-amber-200/80 rounded-2xl group-hover:bg-amber-300 transition-colors">
                    <span className="text-4xl">🦁</span>
                  </div>
                </div>
                <p className="text-slate-600 mb-5 text-sm leading-relaxed font-sinhala">
                  5-Paper අනුවර්තී ඇගයීම් පද්ධතිය, AI දුර්වලතා හඳුනාගැනීම සහ විශේෂ අභ්‍යාස මාලාව.
                </p>
                <div className="pt-2 border-t border-amber-200/80">
                  <span className="bg-amber-200/90 text-amber-900 px-3 py-0.5 rounded-full font-black text-xs">5-Paper System ➔</span>
                </div>
              </div>

              {/* Grade 3 Sinhala */}
              <div 
                onClick={() => navigate('/module/sinhala/grade3')}
                className="bg-gradient-to-br from-purple-50 via-indigo-50 to-sky-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-8 cursor-pointer border-3 border-purple-300 hover:border-purple-500 group transform hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs px-5 py-1.5 rounded-full shadow-md transform rotate-12">
                  Grade 3 Adaptive ⭐
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-purple-950 group-hover:text-purple-800 transition-colors font-sinhala">3 ශ්‍රේණිය — සිංහල</h2>
                  <div className="p-3 bg-purple-200/80 rounded-2xl group-hover:bg-purple-300 transition-colors">
                    <span className="text-4xl">🌟</span>
                  </div>
                </div>
                <p className="text-slate-600 mb-5 text-sm leading-relaxed font-sinhala">
                  5-Paper අනුවර්තී ඇගයීම් පද්ධතිය (Diagnostic Baseline to Final Mastery).
                </p>
                <div className="pt-2 border-t border-purple-200/80">
                  <span className="bg-purple-200/90 text-purple-950 px-3 py-0.5 rounded-full font-black text-xs">5-Paper System ➔</span>
                </div>
              </div>

              {/* Grade 4 Sinhala */}
              <div 
                onClick={() => navigate('/module/sinhala/grade4')}
                className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-8 cursor-pointer border-3 border-emerald-300 hover:border-emerald-500 group transform hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs px-5 py-1.5 rounded-full shadow-md transform rotate-12">
                  Grade 4 Adaptive ⭐
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-emerald-950 group-hover:text-emerald-800 transition-colors font-sinhala">4 ශ්‍රේණිය — සිංහල</h2>
                  <div className="p-3 bg-emerald-200/80 rounded-2xl group-hover:bg-emerald-300 transition-colors">
                    <span className="text-4xl">🦚</span>
                  </div>
                </div>
                <p className="text-slate-600 mb-5 text-sm leading-relaxed font-sinhala">
                  5-Paper අනුවර්තී ඇගයීම් පද්ධතිය (150 Items) — සමාන/විරුද්ධ පද, ප්‍රස්තාව පිරුළු, ව්‍යාකරණ.
                </p>
                <div className="pt-2 border-t border-emerald-200/80">
                  <span className="bg-emerald-200/90 text-emerald-950 px-3 py-0.5 rounded-full font-black text-xs">5-Paper System ➔</span>
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
                  <p className="text-xs sm:text-sm text-slate-600">සිත් ඇදගන්නා ක්‍රියාකාරකම් — Line Tracing, Coloring & Paper Crafts</p>
                </div>
                <div className="hidden sm:block w-36 shrink-0"></div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div 
                onClick={() => navigateToModule('motor')}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-8 cursor-pointer border-2 border-transparent hover:border-purple-400 group transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">Line Tracing</h2>
                    <div className="p-3 bg-purple-50 rounded-2xl group-hover:bg-purple-100 transition-colors">
                      <span className="text-4xl">🖐️</span>
                    </div>
                  </div>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed">Interactive dotted line tracing for fine motor skills development.</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-purple-700">
                  <span>Fine Motor</span>
                  <span className="bg-purple-50 px-3 py-1 rounded-full">Start Tracing ➔</span>
                </div>
              </div>

              <div 
                onClick={() => navigateToModule('coloring')}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-8 cursor-pointer border-2 border-transparent hover:border-pink-400 group transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">Digital Coloring</h2>
                    <div className="p-3 bg-pink-50 rounded-2xl group-hover:bg-pink-100 transition-colors">
                      <span className="text-4xl">🎨</span>
                    </div>
                  </div>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed">Interactive boundary-aware coloring book with AI region masking.</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-pink-700">
                  <span>Coloring</span>
                  <span className="bg-pink-50 px-3 py-1 rounded-full">Start Coloring ➔</span>
                </div>
              </div>

              <div 
                onClick={() => navigateToModule('storydrawing')}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-8 cursor-pointer border-2 border-transparent hover:border-orange-400 group transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">Story Drawing</h2>
                    <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                      <span className="text-4xl">📖</span>
                    </div>
                  </div>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed">Listen to a story and draw it! Upload your drawing for AI evaluation.</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-orange-700">
                  <span>Creative Arts</span>
                  <span className="bg-orange-50 px-3 py-1 rounded-full">Start Drawing ➔</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* MAIN 4 FUNCTIONS DASHBOARD WITH GRADE-BASED ACCESS CONTROL */
          <>
            <header className="mb-10 text-center animate-fade-in-up">
              <img src="/logo.png" alt="නැණ පියස (Nana Piyasa)" className="h-20 w-auto mx-auto mb-3 object-contain drop-shadow-sm" />
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-1">
                සාදරයෙන් පිළිගනිමු, {student.name}!
              </h1>
              <p className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider mb-2 font-sinhala">
                නැණ පියස — පාඩම් කරන්න • සෙල්ලම් කරන්න • දැනුමෙන් වැඩි වන්න
              </p>
              <p className="text-slate-600">
                {isPreSchool 
                  ? 'Your profile is set for Pre-School & Grade 1. Enjoy motor skills, coloring, and craft activities below!'
                  : `Your profile is set for ${student.grade}. Complete your adaptive primary subject modules below!`}
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* 1. Mathematics Grade Hubs Card (Locked for Pre-School) */}
              <div 
                onClick={() => handleCardClick('math', isPreSchool, 'ගණිතය මොඩියුලය 2, 3, 4 ශ්‍රේණි සඳහා පමණක් සීමා කර ඇත (Mathematics is for Grade 2, 3, 4)')}
                className={`rounded-3xl shadow-md transition-all p-8 relative overflow-hidden flex flex-col justify-between ${
                  isPreSchool 
                    ? 'bg-slate-100 border-2 border-slate-200 opacity-65 cursor-not-allowed'
                    : 'bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border-3 border-blue-300 hover:border-blue-500 hover:shadow-2xl cursor-pointer group transform hover:-translate-y-1'
                }`}
              >
                {isPreSchool && (
                  <div className="absolute top-4 right-4 bg-slate-800/90 text-white text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow">
                    <Lock className="w-3 h-3" /> Grade 2, 3, 4 Only
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors font-sinhala">
                      ගණිතය ශ්‍රේණි කාණ්ඩ (Mathematics)
                    </h2>
                    <div className="p-3 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors">
                      <span className="text-4xl">🧮</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed font-sinhala">
                    2, 3 සහ 4 ශ්‍රේණි සඳහා Multimodal AI adaptive ගණිත අභ්‍යාස සහ පරිච්ඡේද.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className={`text-xs font-bold ${isPreSchool ? 'text-slate-400' : 'text-blue-600'}`}>
                    {isPreSchool ? '🔒 Locked for Pre-School' : 'ශ්‍රේණිය සහ අභ්‍යාස තෝරා ගන්න ➔'}
                  </span>
                </div>
              </div>

              {/* 2. English Module (Locked for Pre-School) */}
              <div 
                onClick={() => handleCardClick('english', isPreSchool, 'English Speech මොඩියුලය 2, 3, 4 ශ්‍රේණි සඳහා පමණක් සීමා කර ඇත (English Speech is for Grade 2, 3, 4)')}
                className={`rounded-3xl shadow-sm transition-all p-8 relative overflow-hidden flex flex-col justify-between ${
                  isPreSchool 
                    ? 'bg-slate-100 border-2 border-slate-200 opacity-65 cursor-not-allowed'
                    : 'bg-white border-2 border-transparent hover:border-green-400 hover:shadow-xl cursor-pointer group transform hover:-translate-y-1'
                }`}
              >
                {isPreSchool && (
                  <div className="absolute top-4 right-4 bg-slate-800/90 text-white text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow">
                    <Lock className="w-3 h-3" /> Grade 2, 3, 4 Only
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 group-hover:text-green-600 transition-colors">English Speech</h2>
                    <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
                      <span className="text-4xl">🗣️</span>
                    </div>
                  </div>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed">Pronunciation and speech error detection tailored for Sinhala speakers.</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className={`text-xs font-bold ${isPreSchool ? 'text-slate-400' : 'text-emerald-600'}`}>
                    {isPreSchool ? '🔒 Locked for Pre-School' : 'Start English Speech Module ➔'}
                  </span>
                </div>
              </div>

              {/* 3. Pre-School & Grade 1 Combined Card (Locked for Grade 2, 3, 4) */}
              <div 
                onClick={() => handleCardClick('preschool', !isPreSchool, 'පෙර පාසල් ක්‍රියාකාරකම් Pre-School & Grade 1 සිසුන් සඳහා පමණි (For Pre-School & Grade 1 Only)')}
                className={`rounded-3xl shadow-md transition-all p-8 relative overflow-hidden flex flex-col justify-between ${
                  !isPreSchool 
                    ? 'bg-slate-100 border-2 border-slate-200 opacity-65 cursor-not-allowed'
                    : 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 border-3 border-purple-300 hover:border-purple-500 hover:shadow-2xl cursor-pointer group transform hover:-translate-y-1'
                }`}
              >
                {!isPreSchool && (
                  <div className="absolute top-4 right-4 bg-slate-800/90 text-white text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow">
                    <Lock className="w-3 h-3" /> Pre-School & Grade 1 Only
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-slate-855 group-hover:text-purple-700 transition-colors font-sinhala">
                      Pre-School & Grade 1 (පෙර පාසල් හා 1 ශ්‍රේණිය)
                    </h2>
                    <div className="p-3 bg-purple-100 rounded-2xl group-hover:bg-purple-200 transition-colors">
                      <span className="text-4xl">🎨</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed font-sinhala">
                    කුඩා ළමුන් සඳහා රේඛා ඇඳීම, පාට කිරීම සහ විවිධ කඩදාසි නිර්මාණ ක්‍රියාකාරකම්.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className={`text-xs font-bold ${!isPreSchool ? 'text-slate-400' : 'text-purple-600'}`}>
                    {!isPreSchool ? '🔒 Locked for Primary Grades' : 'ක්‍රියාකාරකම් තෝරා ගැනීමට ක්ලික් කරන්න ➔'}
                  </span>
                </div>
              </div>

              {/* 4. Sinhala Grade Hubs Card (Locked for Pre-School) */}
              <div 
                onClick={() => handleCardClick('sinhala', isPreSchool, 'සිංහල භාෂා මොඩියුලය 2, 3, 4 ශ්‍රේණි සඳහා පමණක් සීමා කර ඇත (Sinhala Language is for Grade 2, 3, 4)')}
                className={`rounded-3xl shadow-md transition-all p-8 relative overflow-hidden flex flex-col justify-between ${
                  isPreSchool 
                    ? 'bg-slate-100 border-2 border-slate-200 opacity-65 cursor-not-allowed'
                    : 'bg-gradient-to-br from-amber-50 via-teal-50 to-indigo-50 border-3 border-teal-300 hover:border-teal-500 hover:shadow-2xl cursor-pointer group transform hover:-translate-y-1'
                }`}
              >
                {isPreSchool && (
                  <div className="absolute top-4 right-4 bg-slate-800/90 text-white text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow">
                    <Lock className="w-3 h-3" /> Grade 2, 3, 4 Only
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-slate-855 group-hover:text-teal-700 transition-colors font-sinhala">
                      සිංහල ශ්‍රේණි කාණ්ඩ (Grade 2, 3, 4 Hubs)
                    </h2>
                    <div className="p-3 bg-teal-100 rounded-2xl group-hover:bg-teal-200 transition-colors">
                      <span className="text-4xl">🦁</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed font-sinhala">
                    2, 3 සහ 4 ශ්‍රේණි සඳහා සිංහල භාෂා ඉගෙනුම් ක්‍රියාකාරකම් සහ 5-Paper පද්ධතිය.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className={`text-xs font-bold ${isPreSchool ? 'text-slate-400' : 'text-teal-600'}`}>
                    {isPreSchool ? '🔒 Locked for Pre-School' : 'මට්ටම් සහ අභ්‍යාස තෝරා ගන්න ➔'}
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
