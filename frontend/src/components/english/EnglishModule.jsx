import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import g2Data from '../../data/english/grade2_speaking_pool.json';
import g3Data from '../../data/english/grade3_speaking_pool.json';
import g4Data from '../../data/english/grade4_speaking_pool.json';

const POOLS = {
  2: g2Data,
  3: g3Data,
  4: g4Data
};

const PAPERS_CONFIG = [
  {
    id: 1,
    level: 'easy',
    title: 'ප්‍රශ්න පත්‍රය 01 (Easy)',
    levelTitle: 'පහසු මට්ටම — Single Words',
    subtitle: 'තනි වචන නිවැරදිව උච්චාරණය කිරීම',
    badge: 'ප්‍රශ්න 10 • Easy',
    icon: '🔤',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-300'
  },
  {
    id: 2,
    level: 'medium',
    title: 'ප්‍රශ්න පත්‍රය 02 (Medium)',
    levelTitle: 'මධ්‍යම මට්ටම — Short Sentences',
    subtitle: 'කෙටි වාක්‍ය කියවීම සහ ස්වභාවික රිද්මය',
    badge: 'ප්‍රශ්න 10 • Medium',
    icon: '📖',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-300'
  },
  {
    id: 3,
    level: 'hard',
    title: 'ප්‍රශ්න පත්‍රය 03 (Hard)',
    levelTitle: 'උසස් මට්ටම — Long Sentences',
    subtitle: 'දිගු වාක්‍ය සහ චතුර කථන ප්‍රකාශනය',
    badge: 'ප්‍රශ්න 10 • Hard',
    icon: '🎙️',
    color: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-300'
  }
];

// Audio synthesizers for sound feedback
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'correct') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.15, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.18);
      });
    } else if (type === 'unlock') {
      [440, 554.37, 659.25, 880, 1108.73].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.2);
      });
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {}
}

// English Text to Speech (Model voice)
function speakEnglish(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

// Levenshtein distance similarity calculation
function calculateSimilarity(str1, str2) {
  const s1 = (str1 || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const s2 = (str2 || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  if (s1 === s2) return 100;
  if (!s1 || !s2) return 0;

  // Exact token match
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  let matchedWords = 0;
  words1.forEach(w => {
    if (words2.includes(w)) matchedWords++;
  });
  const wordMatchScore = (matchedWords / Math.max(words1.length, words2.length)) * 100;

  // Character Levenshtein
  const matrix = [];
  for (let i = 0; i <= s1.length; i++) matrix[i] = [i];
  for (let j = 0; j <= s2.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  const maxLen = Math.max(s1.length, s2.length);
  const charScore = Math.max(0, Math.round(((maxLen - matrix[s1.length][s2.length]) / maxLen) * 100));

  return Math.round(Math.max(wordMatchScore, charScore));
}

export default function EnglishModule({ onExit }) {
  const navigate = useNavigate();

  // Navigation State: 'grades_hub' | 'papers_hub' | 'quiz' | 'report'
  const [viewState, setViewState] = useState('grades_hub');
  const [selectedGrade, setSelectedGrade] = useState(2);
  const [activePaperId, setActivePaperId] = useState(1);

  // Active Paper State (10 Questions)
  const [paperQuestions, setPaperQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [history, setHistory] = useState([]);

  // Recording State
  const [isListening, setIsListening] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [recordedAccuracy, setRecordedAccuracy] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const recognitionRef = useRef(null);

  // LocalStorage Paper History
  const [paperHistory, setPaperHistory] = useState(() => {
    try {
      const g2 = JSON.parse(localStorage.getItem('g2_english_paper_history') || '{}');
      const g3 = JSON.parse(localStorage.getItem('g3_english_paper_history') || '{}');
      const g4 = JSON.parse(localStorage.getItem('g4_english_paper_history') || '{}');
      return { 2: g2, 3: g3, 4: g4 };
    } catch (e) {
      return { 2: {}, 3: {}, 4: {} };
    }
  });

  const savePaperResult = (grade, paperId, resultData) => {
    const updatedGrade = {
      ...(paperHistory[grade] || {}),
      [paperId]: resultData
    };
    const updatedAll = {
      ...paperHistory,
      [grade]: updatedGrade
    };
    setPaperHistory(updatedAll);
    try {
      localStorage.setItem(`g${grade}_english_paper_history`, JSON.stringify(updatedGrade));
    } catch (e) {}
  };

  // Check if a paper is unlocked (Paper 1 is unlocked, Paper 2 needs Paper 1 >= 75%, Paper 3 needs Paper 2 >= 75%)
  const isPaperUnlocked = (pId) => {
    if (pId === 1) return true;
    if (pId === 2) {
      const p1Result = paperHistory[selectedGrade]?.[1];
      return p1Result && p1Result.overallAccuracy >= 75;
    }
    if (pId === 3) {
      const p2Result = paperHistory[selectedGrade]?.[2];
      return p2Result && p2Result.overallAccuracy >= 75;
    }
    return false;
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const reco = new SpeechRecognition();
      reco.continuous = false;
      reco.interimResults = true;
      reco.lang = 'en-US';

      reco.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setUserTranscript(transcript);
        if (event.results[0].isFinal) {
          handleEvaluateSpeech(transcript);
        }
      };

      reco.onerror = (event) => {
        setIsListening(false);
      };

      reco.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = reco;
    }
  }, [currentQIndex, paperQuestions]);

  // Pick 10 random questions for a specific paper from the 100-question pool
  const generatePaperQuestions = (grade, paperId) => {
    const pool = POOLS[grade]?.questions || [];
    const paperConf = PAPERS_CONFIG.find(p => p.id === paperId);
    const targetLevel = paperConf ? paperConf.level : 'easy';
    const filtered = pool.filter(q => q.level === targetLevel);
    // Shuffle and pick 10
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  // Start a specific paper
  const handleStartPaper = (pId) => {
    if (!isPaperUnlocked(pId)) return;
    playSound('click');
    setActivePaperId(pId);
    setHistory([]);

    const qList = generatePaperQuestions(selectedGrade, pId);
    setPaperQuestions(qList);
    setCurrentQIndex(0);
    setUserTranscript('');
    setRecordedAccuracy(null);
    setIsAnswered(false);
    setIsPassed(false);
    setViewState('quiz');
  };

  // View saved paper report
  const handleViewSavedPaperReport = (pId) => {
    playSound('click');
    const saved = paperHistory[selectedGrade]?.[pId];
    if (saved) {
      setActivePaperId(pId);
      setHistory(saved.history || []);
      setViewState('report');
    } else {
      handleStartPaper(pId);
    }
  };

  // Toggle Microphone recording
  const handleToggleMic = () => {
    playSound('click');
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setUserTranscript('');
      setRecordedAccuracy(null);
      setIsAnswered(false);
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsListening(true);
        } else {
          // Fallback simulation for unsupported browsers
          const currentQ = paperQuestions[currentQIndex];
          setTimeout(() => {
            const sim = currentQ ? currentQ.target_text : "test";
            setUserTranscript(sim);
            handleEvaluateSpeech(sim);
          }, 2000);
        }
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Evaluate spoken transcript against target
  const handleEvaluateSpeech = (transcript) => {
    const currentQ = paperQuestions[currentQIndex];
    if (!currentQ) return;

    const acc = calculateSimilarity(transcript, currentQ.target_text);
    const passed = acc >= 75;

    setRecordedAccuracy(acc);
    setIsPassed(passed);
    setIsAnswered(true);
    setIsListening(false);

    if (passed) {
      playSound('correct');
    } else {
      playSound('click');
    }
  };

  // Move to next question or complete paper
  const handleNextQuestion = () => {
    playSound('click');
    const currentQ = paperQuestions[currentQIndex];
    const entry = {
      qNum: currentQIndex + 1,
      id: currentQ.id,
      level: currentQ.level,
      targetText: currentQ.target_text,
      userTranscript: userTranscript || '(No speech detected)',
      accuracy: recordedAccuracy !== null ? recordedAccuracy : 0,
      isPassed: isPassed,
      sinhalaMeaning: currentQ.sinhala_meaning,
      phoneticHint: currentQ.phonetic_hint
    };

    const updatedHistory = [...history, entry];
    setHistory(updatedHistory);

    if (currentQIndex < 9) {
      // Next question
      setCurrentQIndex(prev => prev + 1);
      setUserTranscript('');
      setRecordedAccuracy(null);
      setIsAnswered(false);
      setIsPassed(false);
    } else {
      // Paper Completed (10 questions finished)
      const passedCount = updatedHistory.filter(h => h.isPassed).length;
      const finalAccuracy = Math.round((passedCount / 10) * 100);

      savePaperResult(selectedGrade, activePaperId, {
        paperId: activePaperId,
        grade: selectedGrade,
        totalQuestions: 10,
        totalPassed: passedCount,
        overallAccuracy: finalAccuracy,
        history: updatedHistory,
        completedAt: new Date().toLocaleDateString('si-LK')
      });

      if (finalAccuracy >= 75) {
        playSound('unlock');
      } else {
        playSound('wrong');
      }

      setViewState('report');
    }
  };

  const currentQ = paperQuestions[currentQIndex];
  const activePaperConfig = PAPERS_CONFIG.find(p => p.id === activePaperId) || PAPERS_CONFIG[0];

  const totalPassedCount = history.filter(h => h.isPassed).length;
  const overallReportAccuracy = history.length > 0
    ? Math.round((totalPassedCount / history.length) * 100)
    : 0;
  const hasPassedThreshold = overallReportAccuracy >= 75;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed font-sans select-none relative overflow-x-hidden pb-16"
      style={{ backgroundImage: "url('/images/grade4_meadow_bg.jpg')" }}
    >
      <div className="max-w-4xl mx-auto relative z-10 p-4 sm:p-6">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (viewState === 'quiz') {
                if (window.confirm("ඔබට මෙම ප්‍රශ්න පත්‍රයෙන් ඉවත් වීමට අවශ්‍යද?")) {
                  setViewState('papers_hub');
                }
              } else if (viewState === 'report') {
                setViewState('papers_hub');
              } else if (viewState === 'papers_hub') {
                setViewState('grades_hub');
              } else {
                onExit ? onExit() : navigate('/dashboard');
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-emerald-400 text-slate-700 font-bold rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <span>⬅</span>
            <span>
              {viewState === 'grades_hub'
                ? 'Dashboard එකට'
                : viewState === 'papers_hub'
                ? 'ශ්‍රේණිය තෝරන්න'
                : 'ප්‍රශ්න පත්‍ර තෝරන්න'}
            </span>
          </button>

          {viewState === 'quiz' && (
            <div className="flex items-center gap-2">
              <span className={`text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm bg-gradient-to-r ${activePaperConfig.color}`}>
                {activePaperConfig.badge}
              </span>
              <span className="bg-white/90 backdrop-blur border border-slate-200 text-slate-800 font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                ප්‍රශ්න {currentQIndex + 1} / 10
              </span>
            </div>
          )}
        </div>

        {/* ── SCREEN 1: GRADE SELECTOR HUB ── */}
        {viewState === 'grades_hub' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-xl text-center relative overflow-hidden">
              <div className="inline-block bg-emerald-100 text-emerald-800 font-black text-xs px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                English Speech & Fluency AI • ඉංග්‍රීසි කථන පුහුණුව
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 font-sinhala">
                ඉංග්‍රීසි කථන අනුවර්තී පද්ධතිය
              </h1>
              <p className="text-slate-600 font-bold text-sm sm:text-base max-w-2xl mx-auto">
                2, 3 සහ 4 ශ්‍රේණි සඳහා සකස් කළ කථන ප්‍රශ්න 100 බැගින් යුත් ප්‍රශ්න පත්‍ර පද්ධතිය. ඔබේ ශ්‍රේණිය තෝරන්න.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { grade: 2, icon: '🌱', title: '2 ශ්‍රේණිය', desc: 'මූලික ඉංග්‍රීසි වචන සහ සරල වාක්‍ය උච්චාරණය', color: 'from-emerald-500 to-teal-600' },
                { grade: 3, icon: '🎯', title: '3 ශ්‍රේණිය', desc: 'විස්තීර්ණ වචන මාලාව, වාක්‍ය කියවීම සහ රිද්මය', color: 'from-blue-500 to-indigo-600' },
                { grade: 4, icon: '🚀', title: '4 ශ්‍රේණිය', desc: 'උසස් වාග්කෝෂය, චතුර කථනය සහ ප්‍රකාශන හැකියාව', color: 'from-purple-500 to-pink-600' }
              ].map(g => (
                <div
                  key={g.grade}
                  onClick={() => { setSelectedGrade(g.grade); setViewState('papers_hub'); }}
                  className="bg-white rounded-3xl p-7 border-2 border-slate-200 hover:border-emerald-400 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-4xl">{g.icon}</span>
                      <span className="bg-slate-100 text-slate-700 text-xs font-black px-3 py-1 rounded-full">
                        ප්‍රශ්න 100 කෝෂය
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 font-sinhala">{g.title}</h2>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{g.desc}</p>
                    <div className="pt-2 text-xs font-bold text-slate-500 space-y-1">
                      <div>✓ Paper 01: Easy (10 Qs)</div>
                      <div>✓ Paper 02: Medium (10 Qs)</div>
                      <div>✓ Paper 03: Hard (10 Qs)</div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white shadow-md bg-gradient-to-r ${g.color} cursor-pointer`}>
                      ප්‍රශ්න පත්‍ර වෙත ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SCREEN 2: 3 PAPERS HUB (EASY, MEDIUM, HARD) ── */}
        {viewState === 'papers_hub' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-xl text-center relative overflow-hidden">
              <div className="inline-block bg-emerald-100 text-emerald-800 font-black text-xs px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                Grade {selectedGrade} • {selectedGrade} ශ්‍රේණිය ඉංග්‍රීසි
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 font-sinhala">
                කථන ප්‍රශ්න පත්‍ර 3 (Easy, Medium, Hard)
              </h1>
              <p className="text-slate-600 font-bold text-sm sm:text-base max-w-2xl mx-auto">
                Easy මට්ටමෙන් ආරම්භ කර 75% කට වඩා ලකුණු ලබාගෙන Medium සහ Hard මට්ටම් අගුළු හරින්න.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PAPERS_CONFIG.map(p => {
                const result = paperHistory[selectedGrade]?.[p.id];
                const isCompleted = !!result;
                const unlocked = isPaperUnlocked(p.id);

                return (
                  <div 
                    key={p.id}
                    className={`bg-white rounded-3xl p-6 border-2 transition-all duration-300 shadow-lg flex flex-col justify-between hover:shadow-2xl relative overflow-hidden ${
                      !unlocked 
                        ? 'opacity-75 bg-slate-50 border-slate-300' 
                        : isCompleted 
                        ? 'border-emerald-300 bg-emerald-50/20' 
                        : 'border-slate-200 hover:-translate-y-1'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-4xl">{p.icon}</span>
                        {!unlocked ? (
                          <span className="bg-slate-200 text-slate-600 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                            🔒 අගුළු දමා ඇත
                          </span>
                        ) : isCompleted ? (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                            ✓ සම්පූර්ණයි
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-xs font-black px-3 py-1 rounded-full">
                            නව ප්‍රශ්න පත්‍රය
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-slate-800 font-sinhala leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {p.subtitle}
                      </p>

                      <div className="pt-2">
                        <span className={`inline-block text-xs font-black px-3 py-1 rounded-lg ${
                          p.id === 1 ? 'bg-emerald-100 text-emerald-800' : p.id === 2 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {p.badge}
                        </span>
                      </div>

                      {isCompleted && (
                        <div className="mt-4 p-3 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">පෙර ලකුණු:</span>
                          <span className="text-sm font-black text-emerald-700">
                            {result.totalPassed}/{result.totalQuestions} ({result.overallAccuracy}%)
                          </span>
                        </div>
                      )}

                      {!unlocked && (
                        <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] font-bold text-amber-800">
                          🔒 ප්‍රශ්න පත්‍රය 0{p.id - 1} සඳහා 75% ක් ලබාගෙන මෙය අගුළු හරින්න.
                        </div>
                      )}
                    </div>

                    <div className="pt-6 space-y-2">
                      {unlocked ? (
                        <>
                          <button
                            onClick={() => handleStartPaper(p.id)}
                            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white shadow-md transition-all cursor-pointer bg-gradient-to-r ${p.color} hover:opacity-95 active:scale-95`}
                          >
                            {isCompleted ? '🔄 නැවත කරන්න' : 'ආරම්භ කරන්න ➔'}
                          </button>
                          {isCompleted && (
                            <button
                              onClick={() => handleViewSavedPaperReport(p.id)}
                              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              📊 වාර්තාව බලන්න
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          disabled
                          className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-slate-400 bg-slate-200 cursor-not-allowed border border-slate-300"
                        >
                          🔒 අගුළු දමා ඇත
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SCREEN 3: ACTIVE SPEAKING QUIZ (10 QUESTIONS) ── */}
        {viewState === 'quiz' && currentQ && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-xl animate-scale-up space-y-6">
            
            {/* Level Stepper and Progress */}
            <div>
              <div className="flex justify-between items-center text-xs font-black text-slate-600 mb-2">
                <span>{activePaperConfig.levelTitle}</span>
                <span>ප්‍රශ්න {currentQIndex + 1} / 10</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 bg-gradient-to-r ${activePaperConfig.color}`}
                  style={{ width: `${((currentQIndex + 1) / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Speaking Activity Card */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 text-center">
              
              <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-200">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
                  {currentQ.level === 'easy' ? '🔤 Easy (Single Word)' : currentQ.level === 'medium' ? '📖 Medium (Short Sentence)' : '🎙️ Hard (Long Sentence)'}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  තේරුම: <strong className="text-slate-800">{currentQ.sinhala_meaning}</strong>
                </span>
              </div>

              {/* Target Prompt Display */}
              <div className="py-4">
                <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-wide font-sans mb-2">
                  {currentQ.display_text}
                </h2>
                {currentQ.phonetic_hint && (
                  <p className="text-sm font-bold text-emerald-600 font-mono">
                    {currentQ.phonetic_hint}
                  </p>
                )}
                {currentQ.tip && (
                  <p className="text-xs text-slate-500 font-medium mt-2">
                    💡 {currentQ.tip}
                  </p>
                )}
              </div>

              {/* Interactive Audio & Mic Controls */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => speakEnglish(currentQ.target_text)}
                  className="px-5 py-3 rounded-2xl font-black text-sm bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-200 shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>🔊</span> හඬට සවන් දෙන්න (Listen)
                </button>

                <button
                  onClick={handleToggleMic}
                  className={`px-8 py-3.5 rounded-2xl font-black text-base transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <span>{isListening ? '⏹️ නවත්වන්න' : '🎤 කතා කරන්න (Speak)'}</span>
                </button>
              </div>

              {/* Live Transcript and Accuracy Feedback */}
              {userTranscript && (
                <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 space-y-2 animate-fade-in">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ඔබ පැවසූ දෙය (Recognized Speech):</p>
                  <p className="text-lg font-black text-slate-800 font-sans">
                    "{userTranscript}"
                  </p>
                  {recordedAccuracy !== null && (
                    <div className="flex justify-center items-center gap-2 pt-2">
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${
                        recordedAccuracy >= 75
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        නිරවද්‍යතාව: {recordedAccuracy}% {recordedAccuracy >= 75 ? '✓ (Passed)' : '✗ (Needs 75%)'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Next Question Action */}
              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  disabled={!isAnswered}
                  onClick={handleNextQuestion}
                  className={`px-8 py-3.5 rounded-2xl font-black text-base border-2 transition-all flex items-center gap-2 ${
                    isAnswered
                      ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-lg cursor-pointer active:scale-95'
                      : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-75 shadow-none'
                  }`}
                >
                  <span>{currentQIndex >= 9 ? 'ප්‍රශ්න පත්‍රය අවසන් කරන්න ➔' : 'ඊළඟ ප්‍රශ්නය ➔'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── SCREEN 4: COMPREHENSIVE PAPER REPORT ── */}
        {viewState === 'report' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-200 shadow-2xl space-y-8 animate-scale-up">
            
            <div className="text-center pb-6 border-b border-slate-200">
              <h2 className="text-3xl font-black text-slate-800 mb-1 font-sinhala">
                {selectedGrade} ශ්‍රේණිය — {activePaperConfig.title} වාර්තාව
              </h2>
              <p className="text-sm text-slate-500 font-bold">
                {activePaperConfig.levelTitle} • ප්‍රශ්න 10 ඇගයීම් ප්‍රතිඵලය
              </p>
            </div>

            {/* Score Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">සාර්ථක උච්චාරණ</p>
                <p className="text-3xl font-black text-emerald-700">{totalPassedCount} / 10</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">නිරවද්‍යතා ප්‍රතිශතය</p>
                <p className="text-3xl font-black text-blue-700">{overallReportAccuracy}%</p>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-purple-50 border border-purple-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">තත්ත්වය</p>
                <p className={`text-2xl font-black ${hasPassedThreshold ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {hasPassedThreshold ? '✓ Passed (75%+)' : '✗ Needs Practice'}
                </p>
              </div>
            </div>

            {/* Unlock Status Alert */}
            {hasPassedThreshold ? (
              <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-200 flex items-center gap-4">
                <span className="text-3xl">🎉</span>
                <div>
                  <h4 className="font-black text-emerald-900 text-base">විශිෂ්ටයි! ඔබ 75% කට වඩා ලබා ගත්තා!</h4>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    {activePaperId < 3 
                      ? `ඊළඟ ප්‍රශ්න පත්‍රය 0${activePaperId + 1} (${PAPERS_CONFIG[activePaperId].badge}) දැන් අගුළු හැරී ඇත.` 
                      : 'ඔබ සියලුම මට්ටම් (Easy, Medium, Hard) සාර්ථකව සම්පූර්ණ කළා!'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-200 flex items-center gap-4">
                <span className="text-3xl">🎯</span>
                <div>
                  <h4 className="font-black text-amber-900 text-base">ඊළඟ ප්‍රශ්න පත්‍රයට යාමට 75% ක් අවශ්‍ය වේ.</h4>
                  <p className="text-xs text-amber-700 font-medium mt-0.5">
                    ඔබ ලබාගෙන ඇත්තේ {overallReportAccuracy}% කි. කරුණාකර නැවත උත්සාහ කරන්න.
                  </p>
                </div>
              </div>
            )}

            {/* Detailed Question Review */}
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                <span>📋</span> ප්‍රශ්න 10 සමාලෝචනය
              </h3>
              <div className="space-y-3">
                {history.map((h, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border-2 ${
                      h.isPassed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-800 text-sm font-sans">
                        Target: <strong>"{h.targetText}"</strong>
                      </span>
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        h.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {h.accuracy}% {h.isPassed ? '✓ Passed' : '✗ Needs Practice'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-bold">
                      ඔබ පැවසූ දෙය: <span className="font-sans text-slate-800">"{h.userTranscript}"</span>
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      තේරුම: {h.sinhalaMeaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleStartPaper(activePaperId)}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer text-center"
              >
                🔄 නැවත කරන්න (ප්‍රශ්න පත්‍රය 0{activePaperId})
              </button>
              
              {hasPassedThreshold && activePaperId < 3 && (
                <button
                  onClick={() => handleStartPaper(activePaperId + 1)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer text-center"
                >
                  ඊළඟ ප්‍රශ්න පත්‍රය වෙත (0{activePaperId + 1}) ➔
                </button>
              )}

              <button
                onClick={() => setViewState('papers_hub')}
                className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-black py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-center"
              >
                📑 වෙනත් ප්‍රශ්න පත්‍රයක් තෝරන්න
              </button>
              <button
                onClick={onExit || (() => navigate('/dashboard'))}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-center"
              >
                🏠 Dashboard
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
