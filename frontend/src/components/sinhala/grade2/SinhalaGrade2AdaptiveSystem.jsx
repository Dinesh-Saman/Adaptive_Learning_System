import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, XCircle, Volume2, ArrowLeft, ArrowRight, 
  RotateCcw, Award, BookOpen, Brain, Sparkles, AlertCircle, 
  Check, Lock, Play, BarChart2, Target, HelpCircle, Trophy, Eye, FileText,
  Pencil, Flame, ChevronRight, Activity, TrendingUp
} from 'lucide-react';
import { grade2AdaptiveEngine } from '../../../services/grade2AdaptiveEngine';
import { SINHALA_CATEGORIES, SINHALA_LETTERS, SINHALA_PILLAM_REGISTRY } from '../../../data/grade2SinhalaQuestionBank';
import SinhalaTracingCanvas from '../tracing/SinhalaTracingCanvas';

// ── Web Audio Synthesizer ──
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === 'correct') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.setValueAtTime(180, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {}
}

// ── Sinhala TTS ──
function speakSinhala(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'si-LK';
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

export default function SinhalaGrade2AdaptiveSystem({ onExit }) {
  const navigate = useNavigate();

  // Mode: 'overview' | 'test' | 'results' | 'remedial' | 'final_report'
  const [viewMode, setViewMode] = useState('overview');
  const [session, setSession] = useState(() => grade2AdaptiveEngine.loadSession());
  
  // Test State
  const [activePaperNumber, setActivePaperNumber] = useState(1);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [tracingResults, setTracingResults] = useState({});
  const [paperResult, setPaperResult] = useState(null);

  // Remedial State
  const [activeRemedialCategory, setActiveRemedialCategory] = useState('C1');
  const [remedialAnswers, setRemedialAnswers] = useState({});
  const [remedialTracingScores, setRemedialTracingScores] = useState({});

  useEffect(() => {
    setSession(grade2AdaptiveEngine.loadSession());
  }, []);

  const refreshSession = () => {
    setSession({ ...grade2AdaptiveEngine.loadSession() });
  };

  // Start a paper test
  const handleStartPaper = (pNum) => {
    playSound('click');
    const generatedQuestions = grade2AdaptiveEngine.generatePaper(pNum);
    setActivePaperNumber(pNum);
    setCurrentQuestions(generatedQuestions);
    setCurrentQIndex(0);
    setUserAnswers({});
    setTracingResults({});
    setViewMode('test');

    if (generatedQuestions.length > 0) {
      speakSinhala(generatedQuestions[0].audioPrompt || generatedQuestions[0].prompt);
    }
  };

  // View completed paper results overview
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

  // Answer selection in test
  const handleSelectAnswer = (questionId, option) => {
    playSound('click');
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  // Tracing callback for test questions
  const handleTraceComplete = (questionId, traceData) => {
    setTracingResults(prev => ({
      ...prev,
      [questionId]: traceData
    }));
    if (traceData.isPassed) {
      playSound('correct');
    }
  };

  // Submit test with dual scoring
  const handleSubmitTest = () => {
    const result = grade2AdaptiveEngine.evaluatePaperSubmission(
      activePaperNumber,
      currentQuestions,
      userAnswers,
      tracingResults
    );
    setPaperResult(result);
    refreshSession();
    playSound(result.percentage >= 70 ? 'correct' : 'click');
    setViewMode('results');
  };

  // Reset all papers
  const handleResetSession = () => {
    if (window.confirm("ඔබේ සියලුම ප්‍රශ්න පත්‍ර ප්‍රතිඵල සහ ප්‍රගතිය නැවත මුල සිට සැකසීමට අවශ්‍යද?")) {
      const fresh = grade2AdaptiveEngine.resetSession();
      setSession(fresh);
      setViewMode('overview');
    }
  };

  const currentQ = currentQuestions[currentQIndex];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed font-sans select-none relative overflow-x-hidden pb-16"
      style={{ backgroundImage: "url('/images/grade4_bg.png')" }}
    >
      <div className="relative z-10">
      
      {/* ── Top Navigation Bar ── */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-emerald-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <button
            onClick={() => {
              if (viewMode === 'overview') {
                if (onExit) onExit();
                else navigate('/dashboard');
              } else {
                setViewMode('overview');
              }
            }}
            className="flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-2xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {viewMode === 'overview' ? 'ආපසු Dashboard වෙත' : 'ප්‍රශ්න පත්‍ර මෙනුව වෙත'}
          </button>

          <div className="flex items-center gap-3">
            <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              Grade 2 Sinhala AI
            </span>
            <h1 className="text-base md:text-lg font-black text-slate-800 hidden sm:block">
              අනුවර්‍තී ඇගයීම් සහ අත්අකුරු (Tracing) ඉගෙනුම් පද්ධතිය
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('final_report')}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-3.5 py-2 rounded-2xl border border-indigo-200 transition-all cursor-pointer"
            >
              <BarChart2 className="w-4 h-4" />
              <span className="hidden sm:inline">සමස්ත වාර්‍තාව</span>
            </button>
            <button
              onClick={handleResetSession}
              title="නැවත මුල සිට අරඹන්න"
              className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">

        {/* ══════════════════════════════════════════════════════════════
            VIEW 1: ROADMAP / PAPERS OVERVIEW
           ══════════════════════════════════════════════════════════════ */}
        {viewMode === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-[2.5rem] p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
                <Brain className="w-96 h-96" />
              </div>
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border border-white/30">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>2 ශ්‍රේණිය සිංහල අනුවර්‍තී ඇගයීම් මාලාව (Papers 1–5 + Tracing AI)</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black leading-tight">
                  2 ශ්‍රේණිය සිංහල අනුවර්‍තී ඉගෙනුම් පද්ධතිය
                </h2>
                <p className="text-emerald-100 text-sm md:text-base font-medium mt-3 leading-relaxed">
                  අකුරු හඳුනාගැනීම, කියවීම, සහ <strong>අත්අකුරු (Sinhala Handwriting Tracing)</strong> ඇගයීම ඔස්සේ ශිෂ්‍යයාගේ දුර්‍වල අක්ෂර (Weak Letters) සහ පිල්ලම් (Weak Pillam) හඳුනාගෙන ඊළඟ ප්‍රශ්න පත්‍ර ස්වයංක්‍රීයව අනුවර්තනය වේ.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold">
                    📊 සම්පූර්ණ කළ පත්‍ර: <span className="text-amber-300 text-sm">{session.completedPapers.length} / 5</span>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold">
                    ✍️ Tracing ඇගයීම: <span className="text-amber-300 text-sm">Dual-Score Pipeline</span>
                  </div>

                </div>
              </div>
            </div>

            {/* 5 Papers Progression Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { num: 1, title: 'Paper 1', subtitle: 'මූලික ඇගයීම (Baseline Assessment)', desc: 'ප්‍රශ්න කාණ්ඩ 5 සඳහාම සමබර ප්‍රශ්න 20ක් + Tracing' },
                { num: 2, title: 'Paper 2', subtitle: 'පළමු අනුවර්‍තී පරීක්ෂණය (Adaptive Test 1)', desc: 'දුර්‍වල අකුරු/පිල්ලම් ඉලක්ක ප්‍රශ්න' },
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
                        ? 'bg-white/95 backdrop-blur-md border-emerald-300 shadow-md hover:shadow-xl hover:border-emerald-500 cursor-pointer transform hover:-translate-y-1'
                        : isUnlocked
                          ? 'bg-white/95 backdrop-blur-md border-amber-300 shadow-lg ring-4 ring-amber-100 cursor-pointer transform hover:-translate-y-1'
                          : 'bg-slate-100/80 backdrop-blur-sm border-slate-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base shadow-sm transition-transform group-hover:scale-110 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isUnlocked
                              ? 'bg-amber-500 text-white animate-pulse'
                              : 'bg-slate-300 text-slate-600'
                        }`}>
                          {paper.num}
                        </div>
                        {isCompleted ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Check className="w-3 h-3 text-emerald-600" /> {result?.percentage}%
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

                      <h3 className="font-extrabold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                        {paper.title}
                      </h3>
                      <p className="text-xs text-emerald-700 font-bold mb-2">{paper.subtitle}</p>
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
                            className="w-full py-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            වාර්‍තාව බලන්න
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartPaper(paper.num);
                            }}
                            className="w-full py-1.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all"
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

            {/* 3-Level Knowledge Model Overview */}
            <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-white/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-800">3-Level ශිෂ්‍ය දැනුම් ආකෘතිය (3-Tier Learner Model)</h3>
                  <p className="text-xs text-slate-500 mt-1">ප්‍රශ්න කාණ්ඩය (Category) $
ightarrow$ අක්ෂර (Letters) $
ightarrow$ පිල්ලම් (Pillam) මට්ටමින් ප්‍රවීණතාවය</p>
                </div>
                {session.completedPapers.length > 0 && (
                  <button
                    onClick={() => setViewMode('remedial')}
                    className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-4 py-2.5 rounded-2xl text-xs font-black transition-all border border-emerald-200 self-start sm:self-auto cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    දුර්‍වලතා ඉලක්ක පුහුණුව ➔
                  </button>
                )}
              </div>

              {/* Categories Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(SINHALA_CATEGORIES).map(([catKey, cat]) => {
                  const mastery = Math.round((session.currentMasteryVector[catKey] || 0.5) * 100);
                  const isHigh = mastery >= 75;
                  const isMed = mastery >= 50 && mastery < 75;

                  return (
                    <div
                      key={catKey}
                      className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-emerald-200 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs font-black text-slate-400">{catKey}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-800 line-clamp-1">{cat.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                      
                      <div className="mt-4 pt-3 border-t border-slate-200">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-500">ප්‍රවීණතාව:</span>
                          <span className={isHigh ? 'text-green-600 font-black' : isMed ? 'text-amber-600 font-black' : 'text-rose-600 font-black'}>
                            {mastery}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isHigh ? 'bg-green-500' : isMed ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${mastery}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sub-Skill Diagnostics: Weakest Letter & Pillama Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🔤</span>
                    <div>
                      <h4 className="text-xs font-black text-amber-950">හඳුනාගත් දුර්‍වලතම අක්ෂරය (Weakest Letter)</h4>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        අක්ෂරය: <span className="font-black text-base text-amber-950">“{session.weakestLetter || 'ග'}”</span> (ප්‍රවීණතාව: {Math.round((session.letterMasteryVector?.[session.weakestLetter || 'ග'] || 0.45) * 100)}%)
                      </p>
                    </div>
                  </div>
                  <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full">
                    Tracing Focus
                  </span>
                </div>

                <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">✍️</span>
                    <div>
                      <h4 className="text-xs font-black text-purple-950">හඳුනාගත් දුර්‍වලතම පිල්ලම (Weakest Pillama)</h4>
                      <p className="text-[11px] text-purple-800 mt-0.5">
                        පිල්ලම: <span className="font-black text-base text-purple-950">{SINHALA_PILLAM_REGISTRY[session.weakestPillama || 'P_PAPILI']?.name || 'පාපිල්ල'}</span>
                      </p>
                    </div>
                  </div>
                  <span className="bg-purple-200 text-purple-900 text-[10px] font-black px-2.5 py-1 rounded-full">
                    Pillam Transfer
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VIEW 2: ACTIVE QUESTION TEST VIEW WITH INTEGRATED TRACING
           ══════════════════════════════════════════════════════════════ */}
        {viewMode === 'test' && currentQ && (
          <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
            {/* Top Status Header */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-md border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-emerald-600 text-white text-xs font-black px-3.5 py-1.5 rounded-2xl">
                  Paper {activePaperNumber}
                </span>
                <span className="text-sm font-bold text-slate-600">
                  ප්‍රශ්නය {currentQIndex + 1} / {currentQuestions.length}
                </span>
              </div>

              <div className="w-40 md:w-64 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / currentQuestions.length) * 100}%` }}
                />
              </div>

              <button
                onClick={() => setViewMode('overview')}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                පසුව කරන්න
              </button>
            </div>

            {/* Question Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-white/60 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-200">
                    <span>{SINHALA_CATEGORIES[currentQ.category]?.icon}</span>
                    <span>{SINHALA_CATEGORIES[currentQ.category]?.name}</span>
                  </span>
                  {currentQ.tracing_required && (
                    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[11px] font-black px-2.5 py-1 rounded-full border border-indigo-200">
                      <Pencil className="w-3 h-3" />
                      Tracing Required
                    </span>
                  )}
                </div>

                <button
                  onClick={() => speakSinhala(currentQ.audioPrompt || currentQ.prompt)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  හඬින් අසන්න
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-snug">
                  {currentQ.prompt}
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentQ.id] === opt;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(currentQ.id, opt)}
                      className={`p-4 rounded-2xl font-bold text-left transition-all flex items-center justify-between border-2 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-md transform scale-[1.02]'
                          : 'bg-slate-50 border-slate-200 hover:border-emerald-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{opt}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ── Interactive Sinhala Handwriting Tracing Canvas (Rendered ONLY after answer is selected) ── */}
              {currentQ.tracing_required && (
                <div className="pt-4 border-t border-slate-100">
                  {userAnswers[currentQ.id] ? (
                    <div className="animate-fade-in">
                      <SinhalaTracingCanvas
                        key={`${currentQ.id}-${userAnswers[currentQ.id]}`}
                        targetCharacter={userAnswers[currentQ.id] || currentQ.target_character || 'ක'}
                        targetPillama={currentQ.target_pillama || ''}
                        guideText={userAnswers[currentQ.id] || currentQ.target_guide_text || currentQ.target_character || 'ක'}
                        onTraceComplete={(traceData) => handleTraceComplete(currentQ.id, traceData)}
                        initialScore={tracingResults[currentQ.id]?.score || 0}
                        isOptionSelected={true}
                      />
                    </div>
                  ) : (
                    <div className="bg-slate-50 border-2 border-dashed border-indigo-200 rounded-3xl p-5 text-center flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg shadow-xs">
                        ✍️
                      </div>
                      <p className="text-xs font-black text-slate-800">
                        අත්අකුරු ලිවීම (Sinhala Handwriting Tracing)
                      </p>
                      <p className="text-[11px] text-slate-500 font-bold">
                        කරුණාකර පළමුව ඉහත නිවැරදි පිළිතුර තෝරන්න. පිළිතුර තේරූ පසු ලිවීමේ පුවරුව විවෘත වේ.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentQIndex === 0}
                onClick={() => {
                  playSound('click');
                  setCurrentQIndex(prev => prev - 1);
                }}
                className="px-5 py-3 rounded-2xl font-bold text-sm bg-white/90 border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
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
                  className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  ඊළඟ ප්‍රශ්නය
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitTest}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-base shadow-xl transform hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-5 h-5" />
                  ප්‍රශ්න පත්‍රය අවසන් කරන්න ➔
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VIEW 3: POST-PAPER DUAL-EVALUATION RESULTS & REVIEW
           ══════════════════════════════════════════════════════════════ */}
        {viewMode === 'results' && paperResult && (
          <div className="space-y-8 animate-fade-in">
            <div className={`rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl text-center relative overflow-hidden ${
              paperResult.percentage >= 75
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                : 'bg-gradient-to-r from-amber-600 to-orange-700'
            }`}>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 border border-white/30 shadow-inner">
                {paperResult.percentage >= 75 ? '🏆' : '📈'}
              </div>
              <h2 className="text-3xl md:text-4xl font-black">
                Paper {paperResult.paperNumber} ඇගයීම් ප්‍රතිඵල වාර්‍තාව
              </h2>
              <p className="text-emerald-100 text-sm font-medium mt-1">
                සමස්ත ලකුණු: <span className="text-white font-extrabold text-lg">{paperResult.score} / {paperResult.total}</span> ({paperResult.percentage}%)
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setViewMode('remedial')}
                  className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  දුර්‍වලතා පුහුණු අභ්‍යාස ➔
                </button>
                {paperResult.paperNumber < 5 && (
                  <button
                    onClick={() => handleStartPaper(paperResult.paperNumber + 1)}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-2xl font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Paper {paperResult.paperNumber + 1} අරඹන්න ➔
                  </button>
                )}
                <button
                  onClick={() => setViewMode('overview')}
                  className="px-5 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold text-sm transition-all cursor-pointer"
                >
                  ප්‍රශ්න පත්‍ර මෙනුව වෙත
                </button>
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-white/60">
              <h3 className="text-xl font-black text-slate-900 mb-6">ප්‍රශ්න කාණ්ඩ 5 අනුව ලකුණු විශ්ලේෂණය</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(paperResult.categoryScores).map(([catKey, stats]) => {
                  const cat = SINHALA_CATEGORIES[catKey];
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
                          <span className={isHigh ? 'text-green-600 font-black' : isMed ? 'text-amber-600 font-black' : 'text-rose-600 font-black'}>
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

            {/* Detailed Questions & Tracing Review */}
            <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-white/60">
              <h3 className="text-xl font-black text-slate-900 mb-2">ද්විත්ව ඇගයීම් විස්තරාත්මක වාර්‍තාව (Dual-Score Review)</h3>
              <p className="text-xs text-slate-500 mb-6">
                ද්විත්ව නීතිය: (ප්‍රශ්නය නිවැරදියි = පිළිතුර නිවැරදියි සහ Tracing ලකුණු ≥ 90%). පිළිතුර සහ අත්අකුරු යන දෙකම නිවැරදි විය යුතුය.
              </p>
              
              <div className="space-y-4">
                {paperResult.evaluatedAnswers.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 md:p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      item.isCorrect
                        ? 'bg-green-50/70 border-green-200'
                        : 'bg-rose-50/70 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 ${
                        item.isCorrect ? 'bg-green-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {item.isCorrect ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                          <span className="bg-white text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                            {item.category}: {SINHALA_CATEGORIES[item.category]?.name}
                          </span>
                          {item.tracing_required && (
                            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              ✍️ Traced: “{item.target_guide_text || item.target_character}”
                            </span>
                          )}
                        </div>
                        <p className="font-extrabold text-slate-900 text-sm mt-1">{item.prompt}</p>
                        
                        {/* Dual Score Diagnostic Badges */}
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            item.answer_correct ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            පිළිතුර: {item.answer_correct ? 'නිවැරදියි (Correct)' : 'වැරදියි (Incorrect)'}
                          </span>
                          
                          {item.tracing_required && (
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              item.tracing_correct ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'
                            }`}>
                              Tracing Score: {Math.round(item.tracing_score * 100)}% ({item.tracing_correct ? 'සමත්' : 'අසමත් (<70%)'})
                            </span>
                          )}

                          {item.answer_correct && item.tracing_required && !item.tracing_correct && (
                            <span className="text-[11px] font-bold text-amber-700">
                              ⚠️ පිළිතුර හරි, නමුත් අකුර ලිවීම තව පුහුණු විය යුතුයි.
                            </span>
                          )}
                        </div>

                        {item.explanation && (
                          <p className="text-xs text-slate-500 font-medium mt-1">💡 {item.explanation}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold self-end md:self-center flex-shrink-0">
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">ඔබේ පිළිතුර:</span>
                        <span className={item.answer_correct ? 'text-green-700 font-black' : 'text-rose-700 font-black line-through'}>
                          {item.studentAnswer}
                        </span>
                      </div>
                      {!item.answer_correct && (
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
            VIEW 4: TARGETED REMEDIAL PRACTICE HUB WITH 5-LEVEL TRACING
           ══════════════════════════════════════════════════════════════ */}
        {viewMode === 'remedial' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Box */}
            <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-white/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">දුර්‍වලතා ඉලක්ක කරගත් පුහුණු අභ්‍යාස</h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    ශිෂ්‍යයා ප්‍රවීණතාවය ලබා නොමැති (&lt;85%) ප්‍රශ්න කාණ්ඩ, දුර්‍වල අකුරු සහ පිල්ලම් සඳහා 5-Level Scaffolding අභ්‍යාස.
                  </p>
                </div>
                <button
                  onClick={() => setViewMode('overview')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs self-start sm:self-auto cursor-pointer"
                >
                  ප්‍රශ්න පත්‍ර මෙනුව වෙත
                </button>
              </div>

              {/* Category Selector */}
              <div className="flex flex-wrap gap-2 mt-6">
                {Object.entries(SINHALA_CATEGORIES).map(([catKey, cat]) => {
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
                      className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-md'
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

            {/* Exercises Container */}
            <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-white/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{SINHALA_CATEGORIES[activeRemedialCategory]?.icon}</span>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {SINHALA_CATEGORIES[activeRemedialCategory]?.name} පුහුණු මොඩියුලය
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
                {(grade2AdaptiveEngine.generateRemedialRecommendations(session.currentMasteryVector)
                  .find(r => r.categoryKey === activeRemedialCategory)?.exercises || []).map((ex, exIdx) => (
                  <div key={ex.id || exIdx} className="bg-slate-50/90 rounded-3xl p-6 border-2 border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{ex.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{ex.sub}</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
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

                            {/* Optional Tracing Canvas inside Remedial Drill */}
                            {item.type === 'trace' && (
                              <div className="mb-4">
                                <SinhalaTracingCanvas
                                  targetCharacter={item.target_character || 'ක'}
                                  targetPillama={item.target_pillama || ''}
                                  guideText={item.guideText || item.target_character || 'ක'}
                                  onTraceComplete={(traceData) => {
                                    setRemedialTracingScores(prev => ({ ...prev, [itemKey]: traceData }));
                                    if (traceData.isPassed) {
                                      setRemedialAnswers(prev => ({ ...prev, [itemKey]: item.ans }));
                                      playSound('correct');
                                    }
                                  }}
                                  initialScore={remedialTracingScores[itemKey]?.score || 0}
                                />
                              </div>
                            )}

                            {/* Option Buttons */}
                            <div className="flex flex-wrap gap-2">
                              {item.options.map((opt, optIdx) => (
                                <button
                                  key={optIdx}
                                  onClick={() => {
                                    setRemedialAnswers(prev => ({ ...prev, [itemKey]: opt }));
                                    playSound(opt === item.ans ? 'correct' : 'wrong');
                                  }}
                                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
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
            VIEW 5: 3-LEVEL LONGITUDINAL DIAGNOSTIC LEARNING REPORT
           ══════════════════════════════════════════════════════════════ */}
        {viewMode === 'final_report' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/60">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">2 ශ්‍රේණිය සිංහල 3-Level සමස්ත ප්‍රගති වාර්‍තාව</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    ප්‍රශ්න කාණ්ඩ (Categories), අක්ෂර (Letters), සහ පිල්ලම් (Pillam) ඇතුළු ත්‍රිත්ව මට්ටමේ ප්‍රවීණතා විශ්ලේෂණය
                  </p>
                </div>
                <button
                  onClick={() => setViewMode('overview')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  ආපසු
                </button>
              </div>

              {/* Top Level Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-700">සම්පූර්ණ කළ පත්‍ර</span>
                  <p className="text-3xl font-black text-emerald-900 mt-1">{session.completedPapers.length} / 5</p>
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

              {/* 1. Category Mastery Level */}
              <h3 className="text-lg font-black text-slate-800 mb-4">Level 1: ප්‍රශ්න කාණ්ඩ 5 අනුව වත්මන් ප්‍රවීණතා මට්ටම (Categories)</h3>
              <div className="space-y-4 mb-8">
                {Object.entries(SINHALA_CATEGORIES).map(([catKey, cat]) => {
                  const val = Math.round((session.currentMasteryVector[catKey] || 0.5) * 100);
                  return (
                    <div key={catKey}>
                      <div className="flex justify-between text-xs font-black mb-1.5">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <span>{cat.icon}</span> {catKey}: {cat.name}
                        </span>
                        <span className={val >= 75 ? 'text-green-600 font-black' : val >= 50 ? 'text-amber-600 font-black' : 'text-rose-600 font-black'}>
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

              {/* 2. Letter Mastery Sub-skills */}
              <h3 className="text-lg font-black text-slate-800 mb-4">Level 2: සිංහල අක්ෂර ප්‍රවීණතා විශ්ලේෂණය (Letter Sub-Skills)</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2.5 mb-8">
                {SINHALA_LETTERS.map(l => {
                  const mastery = Math.round((session.letterMasteryVector?.[l] ?? 0.50) * 100);
                  const isHigh = mastery >= 75;
                  const isMed = mastery >= 50 && mastery < 75;

                  return (
                    <div key={l} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                      <span className="text-lg font-black text-slate-800 block">{l}</span>
                      <span className={`text-[10px] font-black ${isHigh ? 'text-green-600' : isMed ? 'text-amber-600' : 'text-rose-600'}`}>
                        {mastery}%
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* 3. Pillam Mastery Sub-skills */}
              <h3 className="text-lg font-black text-slate-800 mb-4">Level 3: සිංහල පිල්ලම් ප්‍රවීණතා විශ්ලේෂණය (Pillam Sub-Skills)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {Object.entries(SINHALA_PILLAM_REGISTRY).map(([pKey, pInfo]) => {
                  const pMastery = Math.round((session.pillamMasteryVector?.[pKey] ?? 0.50) * 100);
                  const isHigh = pMastery >= 75;
                  const isMed = pMastery >= 50 && pMastery < 75;

                  return (
                    <div key={pKey} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{pInfo.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">උදා: {pInfo.example}</p>
                      </div>
                      <span className={`text-sm font-black px-2 py-0.5 rounded-lg ${
                        isHigh ? 'bg-green-100 text-green-800' : isMed ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {pMastery}%
                      </span>
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
