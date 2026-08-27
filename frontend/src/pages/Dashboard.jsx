import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [showSinhalaHubs, setShowSinhalaHubs] = useState(false);
  const [showPreSchoolHub, setShowPreSchoolHub] = useState(false);

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

    const name = localStorage.getItem('studentName');
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
    <div className="flex-grow bg-slate-50 w-full py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {showSinhalaHubs ? (
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
                <div className="w-36"></div> {/* Spacer for symmetry */}
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Grade 2 Sinhala Learning Journey Hub */}
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
                  Level 1, Level 2 සහ Level 3 අභ්‍යාස මාලාව (අකුරු, වචන, වාක්‍ය ලිවීම සහ AI ඇගයීම).
                </p>
                <div className="space-y-2 pt-2 border-t border-amber-200/80">
                  <div className="flex justify-between items-center text-xs font-bold text-amber-800">
                    <span>මට්ටම් 3ක් · අභ්‍යාස 15ක්</span>
                    <span className="bg-amber-200/90 text-amber-900 px-3 py-0.5 rounded-full font-black">Level 1 Unlock</span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>

              {/* Grade 3 Sinhala Learning Journey Hub */}
              <div 
                onClick={() => navigate('/module/sinhala/grade3')}
                className="bg-gradient-to-br from-purple-50 via-indigo-50 to-sky-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-8 cursor-pointer border-3 border-purple-300 hover:border-purple-500 group transform hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs px-5 py-1.5 rounded-full shadow-md transform rotate-12">
                  Grade 3 Hub ⭐
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-purple-950 group-hover:text-purple-800 transition-colors font-sinhala">3 ශ්‍රේණිය — සිංහල</h2>
                  <div className="p-3 bg-purple-200/80 rounded-2xl group-hover:bg-purple-300 transition-colors">
                    <span className="text-4xl">🌟</span>
                  </div>
                </div>
                <p className="text-slate-600 mb-5 h-12 text-sm leading-relaxed font-sinhala">
                  Level 1, 2, 3, 4 අභ්‍යාස මාලාව (අක්ෂර, නාම පද, විරාම ලකුණු, සමාන පද, තේරවිලි & වාක්‍ය).
                </p>
                <div className="space-y-2 pt-2 border-t border-purple-200/80">
                  <div className="flex justify-between items-center text-xs font-bold text-purple-800">
                    <span>මට්ටම් 4ක් · අභ්‍යාස 17ක්</span>
                    <span className="bg-purple-200/90 text-purple-950 px-3 py-0.5 rounded-full font-black">All Levels Open</span>
                  </div>
                  <div className="w-full bg-purple-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>

              {/* Grade 4 Sinhala Learning Journey */}
              <div 
                onClick={() => navigate('/module/sinhala/grade4')}
                className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 rounded-3xl shadow-md hover:shadow-2xl transition-all p-8 cursor-pointer border-3 border-emerald-300 hover:border-emerald-500 group transform hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs px-5 py-1.5 rounded-full shadow-md transform rotate-12">
                  Grade 4 Hub ⭐
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-emerald-950 group-hover:text-emerald-800 transition-colors font-sinhala">4 ශ්‍රේණිය — සිංහල</h2>
                  <div className="p-3 bg-emerald-200/80 rounded-2xl group-hover:bg-emerald-300 transition-colors">
                    <span className="text-4xl">🦚</span>
                  </div>
                </div>
                <p className="text-slate-600 mb-5 h-12 text-sm leading-relaxed font-sinhala">
                  Level 1 - 4: රූපයෙන් වචන, ඒක/බහු, අක්ෂර, විරාම ලකුණු, යුගල පද, වාක්‍ය, කාලය & කිම්ඵල කතාව.
                </p>
                <div className="space-y-2 pt-2 border-t border-emerald-200/80">
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-800">
                    <span>මට්ටම් 4ක් · අභ්‍යාස 15ක් (ප්‍රශ්න 76ක්)</span>
                    <span className="bg-emerald-200/90 text-emerald-950 px-3 py-0.5 rounded-full font-black">Open Hub</span>
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
                <div className="w-36"></div> {/* Spacer for symmetry */}
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

              {/* Paper Craft AI Module */}
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

              {/* Origami Module */}
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
                <div className="w-full bg-slate-100 rounded-full h-4 mb-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: `10%` }}></div>
                </div>
                <p className="text-sm font-bold text-yellow-600 text-right">Interactive Craft</p>
              </div>

              {/* Story Drawing Module */}
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
          <>
            <header className="mb-12 text-center animate-fade-in-up">
              <div className="flex justify-between items-start">
                <div className="w-24"></div> {/* Spacer for centering */}
                <div>
                  <h1 className="text-4xl font-bold text-indigo-600 mb-3">Welcome back, {student.name}!</h1>
                  <p className="text-xl text-slate-600">Choose a module to continue your learning journey today.</p>
                </div>
                <div className="w-24 text-right">
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Math Module */}
              <div 
                onClick={() => navigateToModule('math')}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-8 cursor-pointer border-2 border-transparent hover:border-blue-400 group transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Mathematics</h2>
                  <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                    <span className="text-4xl">🧮</span>
                  </div>
                </div>
                <p className="text-slate-500 mb-6 h-12 text-sm leading-relaxed">Multimodal AI adaptive difficulty & cognitive state assessment.</p>
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
