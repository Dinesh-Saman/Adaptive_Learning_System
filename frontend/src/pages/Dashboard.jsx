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
  ChevronRight
} from 'lucide-react';
import StudentAnalyticsOverview from '../components/analytics/StudentAnalyticsOverview';

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [activeView, setActiveView] = useState('modules'); // 'modules' | 'analytics'
  const [showSinhalaHubs, setShowSinhalaHubs] = useState(false);
  const [showPreSchoolHub, setShowPreSchoolHub] = useState(false);
  const [showMathHubs, setShowMathHubs] = useState(false);
  const [comingSoonGrade, setComingSoonGrade] = useState(null);

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
    const masteryLevelsStr = localStorage.getItem('masteryLevels');
    
    let masteryLevels = { math: 0.5, english: 0.5, sinhala: 0.5, motorSkills: 0.5 };
    if (masteryLevelsStr) {
      try {
        masteryLevels = JSON.parse(masteryLevelsStr);
      } catch (e) {
        console.error("Failed to parse mastery levels");
      }
    }

    setStudent({ name, masteryLevels });
  }, [navigate]);

  const navigateToModule = (moduleId) => {
    navigate(`/module/${moduleId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentName');
    localStorage.removeItem('masteryLevels');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (!student) return <div className="p-12 text-center text-slate-500">Loading profile...</div>;

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
                <span>ඉගෙනුම් මොඩියුල (4 Learning Hubs)</span>
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
                <span>ප්‍රගති විශ්ලේෂණය (Student Analytics & Graphs)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleLogout}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB VIEW */}
        {activeView === 'analytics' && !showMathHubs && !showSinhalaHubs && !showPreSchoolHub ? (
          <StudentAnalyticsOverview initialStudentId="std_001" isTeacherView={false} />
        ) : showMathHubs ? (
          /* MATH HUBS */
          <>
            <header className="mb-12 text-center animate-fade-in-up">
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setShowMathHubs(false)}
                  className="text-sm font-bold text-blue-700 hover:text-white hover:bg-blue-600 bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-2xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>⬅</span> Back to Dashboard
                </button>
                <div>
                  <h1 className="text-4xl font-black text-blue-900 mb-2 font-sinhala">ගණිතය ශ්‍රේණි කාණ්ඩ (Mathematics Grade Hubs)</h1>
                  <p className="text-lg text-slate-600">ඔබේ ශ්‍රේණිය තෝරන්න - Choose your Grade level (Grade 2, 3 or 4)</p>
                </div>
                <div className="w-36"></div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Grade 2 Math Adaptive System */}
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
                    අනුවර්තී ගණිත ඇගයීම් පද්ධතිය (Adaptive Learning System) — 100 දක්වා සංඛ්‍යා, 20 දක්වා එකතු කිරීම්/අඩු කිරීම්, අභිමත මිනුම් සහ හැඩතල කුසලතා 20ක් ඔස්සේ තනි පුද්ගල ඇගයීම.
                  </p>
                </div>
                <div className="space-y-2 pt-4 border-t border-teal-200">
                  <div className="flex justify-between items-center text-xs font-bold text-teal-900">
                    <span>4 Domains · 20 Skills · 5 Tiers</span>
                    <span className="bg-teal-200 text-teal-900 px-3 py-0.5 rounded-full font-black">Adaptive Test ➔</span>
                  </div>
                  <div className="w-full bg-teal-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>

              {/* Grade 3 Math Adaptive System */}
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
                    අනුවර්තී ගණිත ඇගයීම් පද්ධතිය (Adaptive Learning System) — ප්‍රධාන ක්ෂේත්‍ර 4ක්, කුසලතා 20ක් සහ අපහසුතා මට්ටම් 5ක් ඔස්සේ තනි පුද්ගල ඉගෙනුම් විශ්ලේෂණය.
                  </p>
                </div>
                <div className="space-y-2 pt-4 border-t border-purple-200">
                  <div className="flex justify-between items-center text-xs font-bold text-purple-900">
                    <span>4 Domains · 20 Skills · 5 Tiers</span>
                    <span className="bg-purple-200 text-purple-900 px-3 py-0.5 rounded-full font-black">Adaptive Test ➔</span>
                  </div>
                  <div className="w-full bg-purple-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>

              {/* Grade 4 Math Hub */}
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
                    4 ශ්‍රේණිය සම්පූර්ණ විෂය නිර්දේශය — වාර 3ක පරිච්ඡේද 36ක්, Adaptive AI දුෂ්කරතා මට්ටම් සහ මුහුණේ ඉරියව් හඳුනාගැනීම.
                  </p>
                </div>
                <div className="space-y-2 pt-4 border-t border-blue-200">
                  <div className="flex justify-between items-center text-xs font-bold text-blue-900">
                    <span>වාර 3ක් · පරිච්ඡේද 36ක්</span>
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full font-black">All Active ➔</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : showSinhalaHubs ? (
          /* SINHALA HUBS */
          <>
            <header className="mb-12 text-center animate-fade-in-up">
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setShowSinhalaHubs(false)}
                  className="text-sm font-bold text-teal-700 hover:text-white hover:bg-teal-600 bg-teal-50 border border-teal-200 px-4 py-2.5 rounded-2xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>⬅</span> Back to Dashboard
                </button>
                <div>
                  <h1 className="text-4xl font-black text-teal-850 mb-2 font-sinhala">සිංහල ශ්‍රේණි කාණ්ඩ (Grade Hubs)</h1>
                  <p className="text-lg text-slate-600">තබන්න ඊළඟ පියවර - Choose your grade level</p>
                </div>
                <div className="w-36"></div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <p className="text-slate-600 mb-5 h-12 text-sm leading-relaxed font-sinhala">
                  5-Paper අනුවර්තී ඇගයීම් පද්ධතිය (Diagnostic Assessment), AI දුර්වලතා හඳුනාගැනීම සහ විශේෂ අභ්‍යාස මාලාව.
                </p>
                <div className="space-y-2 pt-2 border-t border-amber-200/80">
                  <div className="flex justify-between items-center text-xs font-bold text-amber-800">
                    <span>5 Papers · 5 Domains · AI Adaptive</span>
                    <span className="bg-amber-200/90 text-amber-900 px-3 py-0.5 rounded-full font-black">5-Paper System ➔</span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
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
                <p className="text-slate-600 mb-5 h-12 text-sm leading-relaxed font-sinhala">
                  5-Paper අනුවර්තී ඇගයීම් පද්ධතිය (Diagnostic Baseline to Final Mastery), දුර්වලතා හඳුනාගැනීම සහ ඉලක්කගත පුහුණු අභ්‍යාස.
                </p>
                <div className="space-y-2 pt-2 border-t border-purple-200/80">
                  <div className="flex justify-between items-center text-xs font-bold text-purple-800">
                    <span>5 Papers · 5 Domains · AI Adaptive</span>
                    <span className="bg-purple-200/90 text-purple-950 px-3 py-0.5 rounded-full font-black">5-Paper System ➔</span>
                  </div>
                  <div className="w-full bg-purple-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
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
                <p className="text-slate-600 mb-5 h-12 text-sm leading-relaxed font-sinhala">
                  5-Paper අනුවර්තී ඇගයීම් පද්ධතිය (150 Items) — සමාන/විරුද්ධ පද, ප්‍රස්තාව පිරුළු/ඉඟි වැකි, කාලය/ව්‍යාකරණ, කියවීම/විරාම ලක්ෂණ.
                </p>
                <div className="space-y-2 pt-2 border-t border-emerald-200/80">
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-800">
                    <span>5 Papers · 5 Domains · 150 Items</span>
                    <span className="bg-emerald-200/90 text-emerald-950 px-3 py-0.5 rounded-full font-black">5-Paper System ➔</span>
                  </div>
                  <div className="w-full bg-emerald-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>

              {/* Sinhala Writing Module */}
              <div 
                onClick={() => navigateToModule('sinhala')}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-8 cursor-pointer border-2 border-transparent hover:border-orange-400 group transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">Sinhala Writing</h2>
                  <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                    <span className="text-4xl">✍️</span>
                  </div>
                </div>
                <p className="text-slate-500 mb-6 h-12 text-sm leading-relaxed">Handwritten character recognition and personalized practice.</p>
              </div>
            </div>
          </>
        ) : showPreSchoolHub ? (
          /* PRE-SCHOOL HUBS */
          <>
            <header className="mb-12 text-center animate-fade-in-up">
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setShowPreSchoolHub(false)}
                  className="text-sm font-bold text-purple-700 hover:text-white hover:bg-purple-600 bg-purple-50 border border-purple-200 px-4 py-2.5 rounded-2xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>⬅</span> Back to Dashboard
                </button>
                <div>
                  <h1 className="text-4xl font-black text-purple-850 mb-2 font-sinhala">Pre-School & Grade 1 (පෙර පාසල් සහ 1 ශ්‍රේණිය)</h1>
                  <p className="text-lg text-slate-600">සිත් ඇදගන්නා ක්‍රියාකාරකම් - Line Tracing, Coloring & Paper Crafts</p>
                </div>
                <div className="w-36"></div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Line Tracing */}
              <div 
                onClick={() => navigateToModule('motor')}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-8 cursor-pointer border-2 border-transparent hover:border-purple-400 group transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">Line Tracing</h2>
                  <div className="p-3 bg-purple-50 rounded-2xl group-hover:bg-purple-100 transition-colors">
                    <span className="text-4xl">🖐️</span>
                  </div>
                </div>
                <p className="text-slate-500 mb-6 h-12 text-sm leading-relaxed">Interactive dotted line tracing for fine motor skills development.</p>
              </div>

              {/* Digital Coloring */}
              <div 
                onClick={() => navigateToModule('coloring')}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-8 cursor-pointer border-2 border-transparent hover:border-pink-400 group transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">Digital Coloring</h2>
                  <div className="p-3 bg-pink-50 rounded-2xl group-hover:bg-pink-100 transition-colors">
                    <span className="text-4xl">🎨</span>
                  </div>
                </div>
                <p className="text-slate-500 mb-6 h-12 text-sm leading-relaxed">Interactive boundary-aware coloring book with AI region masking.</p>
              </div>

              {/* Paper Craft AI */}
              <div 
                onClick={() => navigateToModule('papercraft')}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-8 cursor-pointer border-2 border-transparent hover:border-teal-400 group transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors">Paper Craft AI</h2>
                  <div className="p-3 bg-teal-50 rounded-2xl group-hover:bg-teal-100 transition-colors">
                    <span className="text-4xl">📹</span>
                  </div>
                </div>
                <p className="text-slate-500 mb-6 h-12 text-sm leading-relaxed">Upload a video of your paper craft and get AI-powered step evaluation.</p>
              </div>

              {/* Origami */}
              <div 
                onClick={() => navigateToModule('origami')}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-8 cursor-pointer border-2 border-transparent hover:border-yellow-400 group transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800 group-hover:text-yellow-600 transition-colors">Paper Crafts</h2>
                  <div className="p-3 bg-yellow-50 rounded-2xl group-hover:bg-yellow-100 transition-colors">
                    <span className="text-4xl">⛵</span>
                  </div>
                </div>
                <p className="text-slate-500 mb-6 h-12 text-sm leading-relaxed">AI-guided interactive Origami module using computer vision.</p>
              </div>

              {/* Story Drawing */}
              <div 
                onClick={() => navigateToModule('storydrawing')}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-8 cursor-pointer border-2 border-transparent hover:border-orange-400 group transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">Story Drawing</h2>
                  <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                    <span className="text-4xl">📖</span>
                  </div>
                </div>
                <p className="text-slate-500 mb-6 h-12 text-sm leading-relaxed">Listen to a story and draw it! Upload your drawing for AI evaluation.</p>
              </div>
            </div>
          </>
        ) : (
          /* MAIN 4 FUNCTIONS DASHBOARD */
          <>
            {/* Quick Analytics & Insights Banner */}
            <div className="mb-10 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-700/40 relative overflow-hidden">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-500/30 border border-indigo-400/30 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                  📊
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-500 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                      Active Progress: 82.5%
                    </span>
                    <span className="text-xs text-indigo-300 font-semibold">Longitudinal Tracking</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black">
                    ශිෂ්‍ය ප්‍රගති විශ්ලේෂණය (Weekly Performance & Analytics)
                  </h2>
                  <p className="text-indigo-200 text-xs sm:text-sm mt-0.5">
                    ප්‍රධාන විෂය 4 හි සතිපතා ලකුණු, කාණ්ඩ දුර්වලතා හා AI නිර්දේශිත අභ්‍යාස නිරීක්ෂණය කරන්න.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveView('analytics')}
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>විශ්ලේෂණ ප්‍රස්ථාර බලන්න (View Analytics)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <header className="mb-10 text-center animate-fade-in-up">
              <h1 className="text-4xl font-black text-slate-900 mb-2">Welcome back, {student.name}!</h1>
              <p className="text-lg text-slate-600">Choose a learning module to continue your journey today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mathematics Grade Hubs Card */}
              <div 
                onClick={() => setShowMathHubs(true)}
                className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-8 cursor-pointer border-3 border-blue-300 hover:border-blue-500 group transform hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors font-sinhala">ගණිතය ශ්‍රේණි කාණ්ඩ (Grade 2, 3, 4 Hubs)</h2>
                  <div className="p-3 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors">
                    <span className="text-4xl">🧮</span>
                  </div>
                </div>
                <p className="text-slate-600 mb-6 h-12 text-sm leading-relaxed font-sinhala">
                  2, 3 සහ 4 ශ්‍රේණි සඳහා Multimodal AI adaptive ගණිත අභ්‍යාස සහ පරිච්ඡේද (Curriculum-aligned primary math).
                </p>
                <div className="pt-2 border-t border-blue-200">
                  <span className="text-xs font-bold text-blue-600">ශ්‍රේණිය සහ අභ්‍යාස තෝරා ගැනීමට මෙතැන ක්ලික් කරන්න ➔</span>
                </div>
              </div>

              {/* English Module */}
              <div 
                onClick={() => navigateToModule('english')}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-8 cursor-pointer border-2 border-transparent hover:border-green-400 group transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800 group-hover:text-green-600 transition-colors">English Speech</h2>
                  <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
                    <span className="text-4xl">🗣️</span>
                  </div>
                </div>
                <p className="text-slate-500 mb-6 h-12 text-sm leading-relaxed">Pronunciation and speech error detection tailored for Sinhala speakers.</p>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-emerald-600">Start English Speech Module ➔</span>
                </div>
              </div>

              {/* Pre-School & Grade 1 Combined Card */}
              <div 
                onClick={() => setShowPreSchoolHub(true)}
                className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-8 cursor-pointer border-3 border-purple-300 hover:border-purple-500 group transform hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-slate-855 group-hover:text-purple-700 transition-colors font-sinhala">Pre-School & Grade 1 (පෙර පාසල් සහ 1 ශ්‍රේණිය)</h2>
                  <div className="p-3 bg-purple-100 rounded-2xl group-hover:bg-purple-200 transition-colors">
                    <span className="text-4xl">🎨</span>
                  </div>
                </div>
                <p className="text-slate-600 mb-6 h-12 text-sm leading-relaxed font-sinhala">
                  කුඩා ළමුන් සඳහා රේඛා ඇඳීම, පාට කිරීම සහ විවිධ කඩදාසි නිර්මාණ ක්‍රියාකාරකම් (Line tracing, coloring & paper crafts).
                </p>
                <div className="pt-2 border-t border-purple-200">
                  <span className="text-xs font-bold text-purple-600">ක්‍රියාකාරකම් තෝරා ගැනීමට මෙතැන ක්ලික් කරන්න ➔</span>
                </div>
              </div>

              {/* Sinhala Grade Hubs Combined Card */}
              <div 
                onClick={() => setShowSinhalaHubs(true)}
                className="bg-gradient-to-br from-amber-50 via-teal-50 to-indigo-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-8 cursor-pointer border-3 border-teal-300 hover:border-teal-500 group transform hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-slate-855 group-hover:text-teal-700 transition-colors font-sinhala">සිංහල ශ්‍රේණි කාණ්ඩ (Grade 2, 3, 4 Hubs)</h2>
                  <div className="p-3 bg-teal-100 rounded-2xl group-hover:bg-teal-200 transition-colors">
                    <span className="text-4xl">🦁</span>
                  </div>
                </div>
                <p className="text-slate-600 mb-6 h-12 text-sm leading-relaxed font-sinhala">
                  2, 3 සහ 4 ශ්‍රේණි සඳහා සිංහල භාෂා ඉගෙනුම් ක්‍රියාකාරකම් සහ මට්ටම් (Interactive level-based exercises for primary grades).
                </p>
                <div className="pt-2 border-t border-teal-200">
                  <span className="text-xs font-bold text-teal-600">මට්ටම් සහ අභ්‍යාස තෝරා ගැනීමට මෙතැන ක්ලික් කරන්න ➔</span>
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
