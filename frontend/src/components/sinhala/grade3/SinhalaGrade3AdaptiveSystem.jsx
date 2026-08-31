import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, XCircle, Volume2, ArrowLeft, ArrowRight, 
  RotateCcw, Award, BookOpen, Brain, Sparkles, AlertCircle, 
  Check, Lock, Play, BarChart2, Trophy, Eye
} from 'lucide-react';
import { grade3AdaptiveEngine } from '../../../services/grade3AdaptiveEngine';
import { GRADE3_SINHALA_CATEGORIES, GRADE3_REMEDIAL_EXERCISE_BANK } from '../../../data/grade3SinhalaQuestionBank';
import { recordStudentTestMarks } from '../../../data/studentAnalyticsData';
import { speakSinhalaAudio, speakQuestionWithAnswers, stopSinhalaAudio } from '../../../utils/sinhalaTts';

// ── Sinhala TTS ──
function speakSinhala(text) {
  speakSinhalaAudio(text);
}

export default function SinhalaGrade3AdaptiveSystem({ onExit }) {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'test' | 'results' | 'remedial' | 'final_report'
  const [session, setSession] = useState(() => grade3AdaptiveEngine.loadSession());
  
  // Test State
  const [activePaperNumber, setActivePaperNumber] = useState(1);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [paperResult, setPaperResult] = useState(null);

  // Remedial State
  const [activeRemedialCategory, setActiveRemedialCategory] = useState('C1');
  const [remedialAnswers, setRemedialAnswers] = useState({});

  useEffect(() => {
    setSession(grade3AdaptiveEngine.loadSession());
  }, []);

  const refreshSession = () => {
    setSession({ ...grade3AdaptiveEngine.loadSession() });
  };

  const handleStartPaper = (pNum) => {
    playSound('click');
    const generatedQuestions = grade3AdaptiveEngine.generatePaper(pNum);
    setActivePaperNumber(pNum);
    setCurrentQuestions(generatedQuestions);
    setCurrentQIndex(0);
    setUserAnswers({});
    setViewMode('test');

    if (generatedQuestions.length > 0) {
      speakSinhala(generatedQuestions[0].audioPrompt || generatedQuestions[0].prompt);
    }
  };

  const handleViewPaperResult = (pNum) => {
    playSound('click');
    const result = session.paperHistory[pNum];
    if (result) {
      setPaperResult(result);
      setActivePaperNumber(pNum);
      setViewMode('results');
    } else {
      handleStartPaper(pNum);
    }
  };

  const handleSelectAnswer = (questionId, option) => {
    playSound('click');
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmitTest = () => {
    const result = grade3AdaptiveEngine.evaluatePaperSubmission(
      activePaperNumber,
      currentQuestions,
      userAnswers
    );
    setPaperResult(result);
    refreshSession();

    try {
      const studentId = localStorage.getItem('studentId') || 'std_003';
      const name = localStorage.getItem('studentName') || 'Chamalka';
      const studentKey = (name || 'chamalka').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
      const existingHistory = JSON.parse(localStorage.getItem(`g3_sinhala_paper_history_${studentKey}`) || '{}');
      
      // Preserve first attempt for official dashboard records
      if (!existingHistory[activePaperNumber]) {
        const marks = Math.round(((result.percentage || 0) / 100) * 30);
        ['C1', 'C2', 'C3', 'C4', 'C5'].forEach(categoryCode => {
          const catScore = result.categoryScores?.[categoryCode];
          const catMarks = catScore ? Math.round((catScore.percentage / 100) * 30) : marks;
          recordStudentTestMarks({
            studentId,
            name,
            subject: 'sinhala',
            categoryCode,
            marks: catMarks,
            maxMarks: 30
          });
        });

        existingHistory[activePaperNumber] = result;
        localStorage.setItem(`g3_sinhala_paper_history_${studentKey}`, JSON.stringify(existingHistory));
        localStorage.setItem('g3_sinhala_paper_history', JSON.stringify(existingHistory));
      }
    } catch (e) {
      console.warn("Failed to save Grade 3 Sinhala paper result:", e);
    }

    playSound(result.percentage >= 70 ? 'correct' : 'click');
    setViewMode('results');
  };

  const handleResetSession = () => {
    if (window.confirm("ඔබේ 3 ශ්‍රේණිය සියලුම ප්‍රශ්න පත්‍ර ප්‍රතිඵල සහ ප්‍රගතිය නැවත මුල සිට සැකසීමට අවශ්‍යද?")) {
      const fresh = grade3AdaptiveEngine.resetSession();
      setSession(fresh);
      setViewMode('overview');
    }
  };

  const currentQ = currentQuestions[currentQIndex];

  return (
    <div 
      className={`min-h-[calc(100vh-5rem)] bg-cover bg-center bg-fixed font-sans select-none relative overflow-x-hidden ${
        viewMode === 'test' 
          ? 'flex flex-col justify-between pb-8' 
          : 'pb-16'
      }`}
      style={{ backgroundImage: "url('/images/grade4_bg.png')" }}
    >
      <div className={viewMode === 'test' ? 'flex-1 flex flex-col justify-between min-h-0' : 'relative z-10'}>
      
      {/* ── Top Navigation Bar ── */}
      <header className={`bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-purple-100 shadow-sm shrink-0 ${viewMode === 'test' ? 'py-1.5' : 'py-3.5'}`}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (viewMode === 'overview') {
                if (onExit) onExit();
                else navigate('/dashboard');
              } else {
                setViewMode('overview');
              }
            }}
            className="flex items-center gap-1.5 text-purple-800 hover:text-purple-950 font-bold text-xs bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {viewMode === 'overview' ? 'ආපසු Dashboard වෙත' : 'ප්‍රශ්න පත්‍ර මෙනුව වෙත'}
          </button>

          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Grade 3 Sinhala AI
            </span>
            <h1 className="text-sm md:text-base font-black text-slate-800 hidden sm:block">
              අනුවර්‍තී ඇගයීම් සහ කියවීමේ අවබෝධය (Reading Comprehension)
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('final_report')}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-indigo-200 transition-all cursor-pointer shadow-xs"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">සමස්ත වාර්‍තාව</span>
            </button>
            <button
              onClick={handleResetSession}
              title="නැවත මුල සිට අරඹන්න"
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className={`mx-auto px-4 w-full ${viewMode === 'test' ? 'max-w-4xl flex-1 flex flex-col justify-center items-center py-2 my-auto' : 'max-w-5xl pt-8 pb-16'}`}>

        {/* ══════════════════════════════════════════════════════════════
            VIEW 1: ROADMAP / PAPERS OVERVIEW
           ══════════════════════════════════════════════════════════════ */}
        {viewMode === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 rounded-[2.5rem] p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
                <Brain className="w-96 h-96" />
              </div>
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border border-white/30">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>3 ශ්‍රේණිය සිංහල අනුවර්‍තී ඇගයීම් මාලාව (Papers 1–5)</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black leading-tight">
                  3 ශ්‍රේණිය සිංහල අනුවර්‍තී ඉගෙනුම් පද්ධතිය
                </h2>
                <p className="text-purple-100 text-sm md:text-base font-medium mt-3 leading-relaxed">
                  අක්ෂර හා පිල්ලම්, නාම පද හා ලිංග භේදය, සමාන හා විරුද්ධ පද, උක්ත-ආඛ්‍යාත ගැලපීම සහ කියවීමේ අවබෝධය ඔස්සේ ශිෂ්‍ය දුර්‍වලතා හඳුනාගෙන ඊළඟ ප්‍රශ්න පත්‍ර ස්වයංක්‍රීයව අනුවර්තනය වේ.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold">
                    📊 සම්පූර්ණ කළ පත්‍ර: <span className="text-amber-300 text-sm">{session.completedPapers.length} / 5</span>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold">
                    🎯 වත්මන් සාමාන්‍යය: <span className="text-amber-300 text-sm">
                      {session.completedPapers.length > 0
                        ? Math.round(Object.values(session.paperHistory).reduce((acc, p) => acc + p.percentage, 0) / session.completedPapers.length) + '%'
                        : '0%'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Papers Progression Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { num: 1, title: 'Paper 1', subtitle: 'මූලික ඇගයීම (Baseline Assessment)', desc: 'ප්‍රශ්න කාණ්ඩ 5 සඳහාම සමබර ප්‍රශ්න 20ක්' },
                { num: 2, title: 'Paper 2', subtitle: 'පළමු අනුවර්‍තී පරීක්ෂණය (Adaptive Test 1)', desc: 'දුර්‍වල ප්‍රශ්න කාණ්ඩ ඉලක්ක කරගත් ප්‍රශ්න' },
                { num: 3, title: 'Paper 3', subtitle: 'ප්‍රවීණතා තහවුරු කිරීම (Mastery Verification)', desc: 'දැනුම තහවුරු කිරීමේ මධ්‍යම මට්ටම' },
                { num: 4, title: 'Paper 4', subtitle: 'ප්‍රගති ඇගයීම (Progress Challenge)', desc: 'උසස් යෙදුම් සහ සංකීර්ණ වාක්‍ය' },
                { num: 5, title: 'Paper 5', subtitle: 'අවසාන ප්‍රවීණතා පරීක්ෂාව (Final Mastery)', desc: 'සමස්ත ඉගෙනුම් වර්ධනය පරීක්ෂාව' }
              ].map(paper => {
                const isUnlocked = session.unlockedPapers.includes(paper.num);
                const isCompleted = session.completedPapers.includes(paper.num);
                const result = session.paperHistory[paper.num];

                return (
                  <div
                    key={paper.num}
                    onClick={() => {
                      if (isCompleted) {
                        handleViewPaperResult(paper.num);
                      } else if (isUnlocked) {
                        handleStartPaper(paper.num);
                      }
                    }}
                    className={`rounded-[2rem] p-5 flex flex-col justify-between transition-all border-2 group ${
                      isCompleted
                        ? 'bg-white border-purple-300 shadow-md hover:shadow-xl hover:border-purple-500 cursor-pointer transform hover:-translate-y-1'
                        : isUnlocked
                          ? 'bg-white border-amber-300 shadow-lg ring-4 ring-amber-100 cursor-pointer transform hover:-translate-y-1'
                          : 'bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base shadow-sm transition-transform group-hover:scale-110 ${
                          isCompleted
                            ? 'bg-purple-600 text-white'
                            : isUnlocked
                              ? 'bg-amber-500 text-white animate-pulse'
                              : 'bg-slate-300 text-slate-600'
                        }`}>
                          {paper.num}
                        </div>
                        {isCompleted ? (
                          <span className="bg-purple-100 text-purple-800 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Check className="w-3 h-3 text-purple-600" /> {result?.percentage}%
                          </span>
                        ) : isUnlocked ? (
                          <span className="bg-amber-100 text-amber-800 text-[11px] font-black px-2 py-0.5 rounded-full">
                            විවෘතයි
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            <Lock className="w-4 h-4" />
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-slate-800 text-base mb-1 group-hover:text-purple-700 transition-colors">
                        {paper.title}
                      </h3>
                      <p className="text-xs text-purple-700 font-bold mb-2">{paper.subtitle}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{paper.desc}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100">
                      {isCompleted ? (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewPaperResult(paper.num);
                            }}
                            className="w-full py-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            වාර්‍තාව බලන්න
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartPaper(paper.num);
                            }}
                            className="w-full py-1.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-all"
                          >
                            <RotateCcw className="w-3 h-3" />
                            නැවත කරන්න
                          </button>
                        </div>
                      ) : isUnlocked ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartPaper(paper.num);
                          }}
                          className="w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md transition-all"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          ආරම්භ කරන්න
                        </button>
                      ) : (
                        <div className="text-center text-[11px] font-bold text-slate-400 py-2">
                          🔒 පෙර පත්‍රය අවසන් කරන්න
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Diagnostic Categories Grid */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  නිපුණතා කාණ්ඩ 5 (Core Diagnostic Categories)
                </h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium">
                  Grade 3 විෂය නිර්දේශයට අනුව ශිෂ්‍යයාගේ ප්‍රවීණතාවය වර්ගීකරණය කෙරෙන අංශ 5.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(GRADE3_SINHALA_CATEGORIES).map(([key, cat]) => (
                  <div key={key} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                    <div className="text-2xl mb-1.5">{cat.icon}</div>
                    <div className="text-xs font-black text-slate-800 mb-1">{cat.name}</div>
                    <div className="text-[11px] text-slate-500 leading-tight">{cat.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VIEW 2: ACTIVE QUESTION TEST VIEW (BALANCED & COMFORTABLE)
           ══════════════════════════════════════════════════════════════ */}
        {viewMode === 'test' && currentQ && (
          <div className="w-full max-w-5xl mx-auto space-y-3 animate-fade-in my-auto py-2">
            {/* Top Status Header */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl py-2 px-5 shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-purple-600 text-white text-xs sm:text-sm font-black px-3.5 py-1 rounded-xl shadow-xs">
                  Paper {activePaperNumber}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  ප්‍රශ්නය {currentQIndex + 1} / {currentQuestions.length}
                </span>
              </div>

              <div className="w-36 sm:w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / currentQuestions.length) * 100}%` }}
                />
              </div>

              <button
                onClick={() => setViewMode('overview')}
                className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                පසුව කරන්න
              </button>
            </div>

            {/* Well-Balanced & Generously Sized Question Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-[2rem] p-5 sm:p-6 shadow-xl border border-purple-50/80 relative overflow-hidden flex flex-col justify-between">
              <div>
                {/* Header: Category & Audio */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 text-xs sm:text-sm font-black px-3 py-0.5 rounded-full border border-purple-200 shadow-xs">
                    <span>{GRADE3_SINHALA_CATEGORIES[currentQ.category]?.icon}</span>
                    <span>{GRADE3_SINHALA_CATEGORIES[currentQ.category]?.name}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => speakQuestionWithAnswers(currentQ)}
                    className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                    title="ප්‍රශ්නය සහ පිළිතුරු 4 ම ශ්‍රවණය කරන්න"
                  >
                    <Volume2 className="w-4 h-4 text-purple-600 animate-pulse" />
                    <span>හඬින් අසන්න (ප්‍රශ්නය + පිළිතුරු 4)</span>
                  </button>
                </div>

                {currentQ.passage ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-1 items-center">
                    {/* Left Column: Passage Box */}
                    <div className="md:col-span-6 p-4 bg-amber-50/90 border-2 border-amber-200 rounded-2xl text-slate-800 flex flex-col justify-between shadow-xs">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-extrabold text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
                            <span>📖</span> ඡේදය කියවන්න:
                          </span>
                          <button
                            type="button"
                            onClick={() => speakSinhalaAudio(currentQ.passage)}
                            className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <Volume2 className="w-3 h-3" />
                            ඡේදය අසන්න
                          </button>
                        </div>
                        <p className="font-medium text-slate-800 leading-relaxed text-xs sm:text-sm mt-1">{currentQ.passage}</p>
                      </div>
                    </div>

                    {/* Right Column: Prompt & Options */}
                    <div className="md:col-span-6 flex flex-col justify-between space-y-2.5">
                      <h3 className="text-sm sm:text-base font-black text-slate-800 leading-snug">
                        {currentQ.prompt}
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {currentQ.options.map((opt, idx) => {
                          const isSelected = userAnswers[currentQ.id] === opt;

                          return (
                            <div
                              key={idx}
                              onClick={() => handleSelectAnswer(currentQ.id, opt)}
                              className={`py-2 px-3 rounded-xl font-bold text-left transition-all flex items-center justify-between border-2 cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-xs'
                                  : 'bg-slate-50/80 border-slate-200 hover:border-purple-300 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    speakSinhalaAudio(opt);
                                  }}
                                  className="p-1 rounded-lg bg-white hover:bg-purple-100 text-slate-400 hover:text-purple-700 transition-all border border-slate-200/60 shrink-0 cursor-pointer shadow-2xs"
                                  title="මෙම පිළිතුරට සවන් දෙන්න"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs sm:text-sm">{opt}</span>
                              </div>
                              <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 shrink-0 ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-500 text-white'
                                  : 'border-slate-300'
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="my-2 space-y-3">
                    <div className="mb-2">
                      <h3 className="text-base sm:text-xl font-black text-slate-800 leading-snug">
                        {currentQ.prompt}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentQ.options.map((opt, idx) => {
                        const isSelected = userAnswers[currentQ.id] === opt;

                        return (
                          <div
                            key={idx}
                            onClick={() => handleSelectAnswer(currentQ.id, opt)}
                            className={`py-3 px-4 rounded-xl font-bold text-left transition-all flex items-center justify-between border-2 cursor-pointer shadow-xs hover:shadow-sm ${
                              isSelected
                                ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-xs'
                                : 'bg-slate-50/80 border-slate-200 hover:border-purple-300 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  speakSinhalaAudio(opt);
                                }}
                                className="p-1.5 rounded-lg bg-white hover:bg-purple-100 text-slate-400 hover:text-purple-700 transition-all border border-slate-200/70 shrink-0 cursor-pointer shadow-2xs"
                                title="මෙම පිළිතුරට සවන් දෙන්න"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                              <span className="text-sm sm:text-base">{opt}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 ${
                              isSelected
                                ? 'border-purple-500 bg-purple-500 text-white'
                                : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Integrated Card Bottom Actions */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => {
                    playSound('click');
                    setCurrentQIndex(prev => prev - 1);
                  }}
                  className="px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  පෙර ප්‍රශ්නය
                </button>

                {currentQIndex < currentQuestions.length - 1 ? (
                  <button
                    onClick={() => {
                      playSound('click');
                      setCurrentQIndex(prev => prev + 1);
                      const nextQ = currentQuestions[currentQIndex + 1];
                      if (nextQ) speakSinhala(nextQ.audioPrompt || nextQ.prompt);
                    }}
                    className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    ඊළඟ ප්‍රශ්නය
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-black text-xs sm:text-sm shadow-md transform hover:scale-102 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    ප්‍රශ්න පත්‍රය අවසන් කරන්න ➔
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VIEW 3: POST-PAPER DIAGNOSTIC RESULTS & REVIEW
           ══════════════════════════════════════════════════════════════ */}
        {viewMode === 'results' && paperResult && (
          <div className="space-y-8 animate-fade-in">
            <div className={`rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl text-center relative overflow-hidden ${
              paperResult.percentage >= 75
                ? 'bg-gradient-to-r from-purple-600 to-indigo-700'
                : 'bg-gradient-to-r from-amber-600 to-orange-700'
            }`}>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 border border-white/30 shadow-inner">
                {paperResult.percentage >= 75 ? '🏆' : '📈'}
              </div>
              <h2 className="text-3xl md:text-4xl font-black">
                Paper {paperResult.paperNumber} ප්‍රතිඵල වාර්‍තාව
              </h2>
              <p className="text-purple-100 text-sm font-medium mt-1">
                ලකුණු සංඛ්‍යාව: <span className="text-white font-extrabold text-lg">{paperResult.score} / {paperResult.total}</span> ({paperResult.percentage}%)
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setViewMode('remedial')}
                  className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 shadow-md transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  දුර්‍වල ප්‍රශ්න කාණ්ඩ පුහුණු අභ්‍යාස ➔
                </button>
                {paperResult.paperNumber < 5 && (
                  <button
                    onClick={() => handleStartPaper(paperResult.paperNumber + 1)}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-2xl font-black text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Paper {paperResult.paperNumber + 1} අරඹන්න ➔
                  </button>
                )}
                <button
                  onClick={() => setViewMode('overview')}
                  className="px-5 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold text-sm transition-all"
                >
                  ප්‍රශ්න පත්‍ර මෙනුව වෙත
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-6">ප්‍රශ්න කාණ්ඩ 5 අනුව ලකුණු විශ්ලේෂණය</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(paperResult.categoryScores).map(([catKey, stats]) => {
                  const cat = GRADE3_SINHALA_CATEGORIES[catKey];
                  const isHigh = stats.percentage >= 80;
                  const isMed = stats.percentage >= 50 && stats.percentage < 80;

                  return (
                    <div key={catKey} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{cat?.icon}</span>
                        <span className="text-xs font-black text-slate-600">{catKey}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{cat?.name}</h4>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-500">{stats.correct}/{stats.total} හරි</span>
                          <span className={isHigh ? 'text-green-600' : isMed ? 'text-amber-600' : 'text-rose-600'}>
                            {stats.percentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isHigh ? 'bg-green-500' : isMed ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${stats.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-6">ප්‍රශ්න පරීක්ෂාව හා නිවැරදි පිළිතුරු (Detailed Review)</h3>
              
              <div className="space-y-3">
                {paperResult.evaluatedAnswers.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      item.isCorrect
                        ? 'bg-green-50/50 border-green-200'
                        : 'bg-rose-50/60 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 ${
                        item.isCorrect ? 'bg-green-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {item.isCorrect ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                          <span className="bg-white text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                            {item.category}: {GRADE3_SINHALA_CATEGORIES[item.category]?.name}
                          </span>
                        </div>
                        {item.passage && (
                          <div className="mt-1.5 p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-slate-700 leading-relaxed">
                            <span className="font-bold text-amber-800">📖 ඡේදය:</span> {item.passage}
                          </div>
                        )}
                        <p className="font-extrabold text-slate-900 text-sm mt-1">{item.prompt}</p>
                        {item.explanation && (
                          <p className="text-xs text-slate-500 font-medium mt-1">💡 {item.explanation}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold self-end md:self-center flex-shrink-0">
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">ඔබේ පිළිතුර:</span>
                        <span className={item.isCorrect ? 'text-green-700 font-black' : 'text-rose-700 font-black line-through'}>
                          {item.studentAnswer}
                        </span>
                      </div>
                      {!item.isCorrect && (
                        <div className="text-left pl-3 border-l border-slate-200">
                          <span className="text-slate-400 block text-[10px]">නිවැරදි පිළිතුර:</span>
                          <span className="text-green-700 font-black">{item.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VIEW 4: TARGETED REMEDIAL PRACTICE HUB
           ══════════════════════════════════════════════════════════════ */}
        {viewMode === 'remedial' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">දුර්‍වලතා ඉලක්ක කරගත් විශේෂ අභ්‍යාස</h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    ශිෂ්‍යයා ප්‍රවීණතාවය ලබා නොමැති (&lt;85%) ප්‍රශ්න කාණ්ඩ සඳහා පමණක් මෙම අභ්‍යාස නිර්දේශ කෙරේ.
                  </p>
                </div>
                <button
                  onClick={() => setViewMode('overview')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs self-start sm:self-auto"
                >
                  ප්‍රශ්න පත්‍ර මෙනුව වෙත
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {Object.entries(GRADE3_SINHALA_CATEGORIES).map(([catKey, cat]) => {
                  const mastery = session.currentMasteryVector[catKey] || 0.5;
                  const isMastered = mastery >= 0.85;
                  const isSelected = activeRemedialCategory === catKey;

                  return (
                    <button
                      key={catKey}
                      onClick={() => {
                        playSound('click');
                        setActiveRemedialCategory(catKey);
                      }}
                      className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-purple-700 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{catKey}: {cat.name}</span>
                      {isMastered ? (
                        <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          ⭐ ප්‍රගුණයි
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {Math.round(mastery * 100)}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{GRADE3_SINHALA_CATEGORIES[activeRemedialCategory]?.icon}</span>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {GRADE3_SINHALA_CATEGORIES[activeRemedialCategory]?.name} පුහුණු මොඩියුලය
                    </h3>
                    <span className="text-xs text-slate-500 font-bold">
                      වත්මන් ප්‍රවීණතාව: {Math.round((session.currentMasteryVector[activeRemedialCategory] || 0.5) * 100)}%
                    </span>
                  </div>
                </div>

                {session.currentMasteryVector[activeRemedialCategory] >= 0.85 && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-green-600" />
                    <span>මෙම ප්‍රශ්න කාණ්ඩය ඉහළින් ප්‍රගුණ කර ඇත! අමතර පුහුණුවක් අනවශ්‍යයි.</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {(grade3AdaptiveEngine.generateRemedialRecommendations(session.currentMasteryVector)
                  .find(r => r.categoryKey === activeRemedialCategory)?.exercises || []).map((ex, exIdx) => (
                  <div key={ex.id || exIdx} className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{ex.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{ex.sub}</p>
                      </div>
                      <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {ex.difficulty}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {ex.items.map((item, itemIdx) => {
                        const itemKey = `${ex.id}_${itemIdx}`;
                        const selectedAnswer = remedialAnswers[itemKey];
                        const isAnswered = !!selectedAnswer;
                        const isCorrect = selectedAnswer === item.ans;

                        return (
                          <div key={itemIdx} className="bg-white p-4 rounded-2xl border border-slate-200">
                            {item.passage && (
                              <p className="text-sm font-bold text-amber-950 bg-amber-50 p-3 rounded-xl mb-3">
                                “{item.passage}”
                              </p>
                            )}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="text-sm font-bold text-slate-800">{item.q}</span>
                              {isAnswered && (
                                <span className={`text-xs font-black flex items-center gap-1 ${
                                  isCorrect ? 'text-green-600' : 'text-rose-600'
                                }`}>
                                  {isCorrect ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                  {isCorrect ? 'නිවැරදියි!' : `වැරදියි (නිවැරදි: ${item.ans})`}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {item.options.map((opt, optIdx) => (
                                <button
                                  key={optIdx}
                                  onClick={() => {
                                    setRemedialAnswers(prev => ({ ...prev, [itemKey]: opt }));
                                    playSound(opt === item.ans ? 'correct' : 'wrong');
                                  }}
                                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                    selectedAnswer === opt
                                      ? opt === item.ans
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'bg-rose-500 text-white shadow-sm'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VIEW 5: LONGITUDINAL DIAGNOSTIC LEARNING REPORT
           ══════════════════════════════════════════════════════════════ */}
        {viewMode === 'final_report' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">3 ශ්‍රේණිය සිංහල සමස්ත ප්‍රගති වාර්‍තාව</h2>
                  <p className="text-xs text-slate-500 mt-1">ප්‍රශ්න පත්‍ර 5 හරහා ශිෂ්‍යයාගේ අඛණ්ඩ ඉගෙනුම් වර්ධනය සහ ප්‍රවීණතා විශ්ලේෂණය</p>
                </div>
                <button
                  onClick={() => setViewMode('overview')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                >
                  ආපසු
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200">
                  <span className="text-xs font-bold text-purple-700">සම්පූර්ණ කළ පත්‍ර</span>
                  <p className="text-3xl font-black text-purple-900 mt-1">{session.completedPapers.length} / 5</p>
                </div>
                <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-200">
                  <span className="text-xs font-bold text-indigo-700">නැවත නොඇසූ ප්‍රශ්න සංඛ්‍යාව</span>
                  <p className="text-3xl font-black text-indigo-900 mt-1">{session.allAnsweredQuestionIds?.length || 0}</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
                  <span className="text-xs font-bold text-amber-700">දැනුම් වර්ධන වේගය (Learning Rate)</span>
                  <p className="text-3xl font-black text-amber-900 mt-1">α = 0.60</p>
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-800 mb-4">ප්‍රශ්න පත්‍ර 1–5 ප්‍රතිඵල සටහන</h3>
              <div className="space-y-3 mb-8">
                {[1, 2, 3, 4, 5].map(pNum => {
                  const result = session.paperHistory[pNum];
                  const isDone = session.completedPapers.includes(pNum);

                  return (
                    <div
                      key={pNum}
                      className={`p-4 rounded-2xl border flex items-center justify-between ${
                        isDone ? 'bg-purple-50/50 border-purple-200' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                          isDone ? 'bg-purple-600 text-white' : 'bg-slate-300 text-slate-600'
                        }`}>
                          {pNum}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-800">Paper {pNum}</h4>
                          <span className="text-xs text-slate-500">
                            {isDone ? `ලකුණු: ${result.score} / ${result.total} (${result.percentage}%)` : 'තවම සම්පූර්ණ කර නැත'}
                          </span>
                        </div>
                      </div>

                      {isDone && (
                        <button
                          onClick={() => handleViewPaperResult(pNum)}
                          className="px-3.5 py-1.5 bg-white hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold border border-purple-200 transition-all flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          විස්තර බලන්න
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <h3 className="text-lg font-black text-slate-800 mb-4">ප්‍රශ්න කාණ්ඩ 5 අනුව වත්මන් ප්‍රවීණතා මට්ටම</h3>
              <div className="space-y-4">
                {Object.entries(GRADE3_SINHALA_CATEGORIES).map(([catKey, cat]) => {
                  const val = Math.round((session.currentMasteryVector[catKey] || 0.5) * 100);
                  return (
                    <div key={catKey}>
                      <div className="flex justify-between text-xs font-black mb-1.5">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <span>{cat.icon}</span> {catKey}: {cat.name}
                        </span>
                        <span className={val >= 75 ? 'text-green-600' : val >= 50 ? 'text-amber-600' : 'text-rose-600'}>
                          {val}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            val >= 75 ? 'bg-green-500' : val >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
    </div>
  );
}
