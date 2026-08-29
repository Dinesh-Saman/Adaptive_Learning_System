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

const STOP_WORDS = new Set(['the', 'a', 'an', 'is', 'am', 'are', 'in', 'on', 'at', 'to', 'of', 'and', 'it', 'my', 'we', 'he', 'she']);

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

// Web Audio Synthesizer for SFX
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

// Instant 3-Stage Speech & Word Alignment Evaluation
function evaluate3StageSpeech(spokenText, targetText, soundHeard = false) {
  const spokenClean = (spokenText || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const targetClean = (targetText || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

  // ── Step 1: Instant Sound Check ──
  const soundDetected = Boolean(spokenClean.length > 0 || soundHeard);

  if (!soundDetected) {
    return {
      step: 1,
      soundDetected: false,
      wordsCorrect: false,
      pronunciationCorrect: false,
      accuracy: 0,
      statusTitle: 'ශබ්දයක් හඳුනා නොගැනිණි',
      statusMessage: 'මයික්‍රෆෝනයෙන් කිසිදු හඬක් වාර්තා නොවීය. කරුණාකර මයික්‍රෆෝනය ළඟට ගෙන ශබ්ද නගා කතා කරන්න.',
      transcript: '(No sound detected)',
      wordResults: [],
      missedWords: []
    };
  }

  if (!spokenClean) {
    return {
      step: 2,
      soundDetected: true,
      wordsCorrect: false,
      pronunciationCorrect: false,
      accuracy: 20,
      statusTitle: 'වචනය අපැහැදිලියි (Unclear Speech)',
      statusMessage: `හඬ ලැබුණ නමුත් වචනය පැහැදිලි නැත. කරුණාකර '${targetText}' ශබ්ද නගා පවසන්න.`,
      transcript: '(නොපැහැදිලි හඬක්)',
      wordResults: [{ word: targetText, matched: false, spoken: '' }],
      missedWords: [targetText]
    };
  }

  const spokenWords = spokenClean.split(/\s+/).filter(Boolean);
  const targetWords = targetClean.split(/\s+/).filter(Boolean);

  // ── 1. Single Word Evaluation (Easy Level) ──
  if (targetWords.length === 1) {
    const targetWord = targetWords[0];
    let matched = (spokenWords.includes(targetWord)) || (spokenClean === targetWord);

    // Instant phonetic/suffix fallback (e.g. tree / trees / three / ring / rings)
    if (!matched && spokenWords.length > 0) {
      for (const sw of spokenWords) {
        if (sw === targetWord || sw === targetWord + 's' || sw === targetWord + 'd' || sw === targetWord + 'ing') {
          matched = true;
          break;
        }
      }
    }

    const accuracy = matched ? 100 : 25;
    const isPassed = matched;

    return {
      step: matched ? 3 : 2,
      soundDetected: true,
      wordsCorrect: matched,
      pronunciationCorrect: isPassed,
      accuracy: accuracy,
      statusTitle: isPassed ? 'විශිෂ්ට උච්චාරණයක්! (Passed)' : 'පැවසූ වචනය වැරදියි (Needs Practice)',
      statusMessage: isPassed 
        ? 'ඔබේ උච්චාරණය ඉතා පැහැදිලියි.' 
        : `ඔබ පැවසූ වචනය '${spokenText}' වේ. අපේක්ෂිත වචනය '${targetText}' වේ.`,
      transcript: spokenText,
      wordResults: [{ word: targetWord, matched: matched, spoken: spokenWords[0] || '' }],
      missedWords: matched ? [] : [targetWord]
    };
  }

  // ── 2. Multi-Word Sentence Alignment (Medium & Hard Levels) ──
  const wordResults = [];
  let matchedCount = 0;
  const missedContentWords = [];
  const missedWords = [];

  let spokenIdx = 0;
  for (const tw of targetWords) {
    let isMatched = false;
    let spokenMatchedWord = '';

    for (let j = spokenIdx; j < Math.min(spokenIdx + 3, spokenWords.length); j++) {
      const sw = spokenWords[j];
      if (sw === tw || sw === tw + 's' || sw === tw + 'd') {
        isMatched = true;
        spokenMatchedWord = sw;
        spokenIdx = j + 1;
        break;
      }
    }

    if (isMatched) {
      matchedCount++;
      wordResults.push({ word: tw, matched: true, spoken: spokenMatchedWord });
    } else {
      const actualHeard = spokenIdx < spokenWords.length ? spokenWords[spokenIdx] : '';
      wordResults.push({ word: tw, matched: false, spoken: actualHeard });
      missedWords.push(tw);
      if (!STOP_WORDS.has(tw)) {
        missedContentWords.push(tw);
      }
      if (spokenIdx < spokenWords.length) spokenIdx++;
    }
  }

  const totalWords = targetWords.length;
  const matchRatio = matchedCount / totalWords;

  // Strict content-word sensitive scoring:
  let accuracy = 0;
  let isPassed = false;

  if (missedContentWords.length > 0) {
    // Content word missed: score capped at 65-68% (Needs Practice)
    accuracy = Math.min(68, Math.round(matchRatio * 85));
    isPassed = false;
  } else if (matchRatio >= 0.80) {
    // All content words matched and >=80% total words matched
    accuracy = Math.round(matchRatio * 100);
    isPassed = true;
  } else {
    accuracy = Math.round(matchRatio * 100);
    isPassed = false;
  }

  const allWordsCorrect = (matchedCount === totalWords);

  return {
    step: isPassed ? 3 : (matchedCount > 0 ? 2 : 1),
    soundDetected: true,
    wordsCorrect: allWordsCorrect,
    pronunciationCorrect: isPassed,
    accuracy: accuracy,
    statusTitle: isPassed 
      ? 'විශිෂ්ට උච්චාරණයක්! (Passed)' 
      : 'උච්චාරණය තවදුරටත් පුහුණු වන්න (Needs Practice)',
    statusMessage: isPassed 
      ? 'ඔබේ උච්චාරණය සහ කථන රිද්මය ඉතා පැහැදිලියි.' 
      : missedContentWords.length > 0 
      ? `වචන ${matchedCount}/${totalWords} නිවැරදියි. '${missedContentWords.join(', ')}' වචනය නිවැරදිව උච්චාරණය කරන්න.`
      : `වචන ${matchedCount}/${totalWords} නිවැරදියි. සම්පූර්ණ වාක්‍යය පැහැදිලිව කියවන්න.`,
    transcript: spokenText,
    wordResults: wordResults,
    missedWords: missedWords,
    missedContentWords: missedContentWords
  };
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

  // Recording & 3-Stage Assessment State
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [instantSoundActive, setInstantSoundActive] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const latestTranscriptRef = useRef('');
  const soundHeardRef = useRef(false);
  const timerIntervalRef = useRef(null);
  const soundActiveTimeoutRef = useRef(null);

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

  // Check if a paper is unlocked
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

  // Pick 10 random questions for a specific paper from the 100-question pool
  const generatePaperQuestions = (grade, paperId) => {
    const pool = POOLS[grade]?.questions || [];
    const paperConf = PAPERS_CONFIG.find(p => p.id === paperId);
    const targetLevel = paperConf ? paperConf.level : 'easy';
    const filtered = pool.filter(q => q.level === targetLevel);
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
    setLiveTranscript('');
    setInstantSoundActive(false);
    setAssessmentResult(null);
    setIsAnswered(false);
    latestTranscriptRef.current = '';
    soundHeardRef.current = false;
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

  // Clean shutdown of speech recognition
  const stopListening = () => {
    isListeningRef.current = false;
    setIsListening(false);
    setInstantSoundActive(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (soundActiveTimeoutRef.current) {
      clearTimeout(soundActiveTimeoutRef.current);
      soundActiveTimeoutRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onspeechstart = null;
        recognitionRef.current.onspeechend = null;
        recognitionRef.current.onsoundstart = null;
        recognitionRef.current.onsoundend = null;
        recognitionRef.current.onaudiostart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  // Fast, Low-Latency SpeechRecognition Initialization
  const startRecording = () => {
    playSound('click');
    stopListening(); // Fully clear previous session

    setAssessmentResult(null);
    setIsAnswered(false);
    setLiveTranscript('');
    setInstantSoundActive(false);
    setRecordingSeconds(0);
    latestTranscriptRef.current = '';
    soundHeardRef.current = false;
    isListeningRef.current = true;
    setIsListening(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("ඔබේ බ්‍රවුසරය Web Speech API සඳහා සහාය නොදක්වයි. කරුණාකර Google Chrome හෝ Microsoft Edge භාවිතා කරන්න.");
      stopListening();
      return;
    }

    try {
      const reco = new SpeechRecognition();
      reco.continuous = true;
      reco.interimResults = true;
      reco.lang = 'en-US';
      reco.maxAlternatives = 3;

      reco.onstart = () => {
        if (isListeningRef.current) {
          setIsListening(true);
        }
      };

      // Instant Low-Latency Sound Trigger
      reco.onaudiostart = () => {
        soundHeardRef.current = true;
        setInstantSoundActive(true);
      };

      reco.onsoundstart = () => {
        soundHeardRef.current = true;
        setInstantSoundActive(true);
      };

      reco.onspeechstart = () => {
        soundHeardRef.current = true;
        setInstantSoundActive(true);
      };

      reco.onspeechend = () => {
        // Keep active briefly
        if (soundActiveTimeoutRef.current) clearTimeout(soundActiveTimeoutRef.current);
        soundActiveTimeoutRef.current = setTimeout(() => {
          setInstantSoundActive(false);
        }, 800);
      };

      reco.onsoundend = () => {
        if (soundActiveTimeoutRef.current) clearTimeout(soundActiveTimeoutRef.current);
        soundActiveTimeoutRef.current = setTimeout(() => {
          setInstantSoundActive(false);
        }, 800);
      };

      // Real-Time Immediate Transcript Streaming
      reco.onresult = (event) => {
        soundHeardRef.current = true;
        setInstantSoundActive(true);

        let finalStr = '';
        let interimStr = '';
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript + ' ';
          } else {
            interimStr += event.results[i][0].transcript;
          }
        }
        const combined = (finalStr + interimStr).trim();
        if (combined) {
          latestTranscriptRef.current = combined;
          setLiveTranscript(combined); // Instant update on screen!
        }
      };

      reco.onerror = (event) => {
        console.log("SpeechRecognition notice:", event.error);
      };

      reco.onend = () => {
        // Auto-restart immediately if user is still in speaking mode
        if (isListeningRef.current) {
          try {
            reco.start();
          } catch (e) {}
        }
      };

      recognitionRef.current = reco;
      reco.start();

      // Start elapsed timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);

    } catch (err) {
      console.error("Speech start error:", err);
      stopListening();
    }
  };

  // Instant Stop Recording & Fast Evaluation
  const stopRecordingAndEvaluate = () => {
    playSound('click');
    const finalHeardText = latestTranscriptRef.current || liveTranscript || '';
    const soundDetected = soundHeardRef.current || Boolean(finalHeardText.trim());

    stopListening();

    const currentQ = paperQuestions[currentQIndex];
    const targetText = currentQ ? currentQ.target_text : '';

    const res = evaluate3StageSpeech(finalHeardText, targetText, soundDetected);
    setAssessmentResult(res);
    setIsAnswered(true);

    if (res.pronunciationCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  // Move to next question or complete paper
  const handleNextQuestion = () => {
    playSound('click');
    stopListening();

    const currentQ = paperQuestions[currentQIndex];
    const isPassed = assessmentResult ? assessmentResult.pronunciationCorrect : false;
    const accuracy = assessmentResult ? assessmentResult.accuracy : 0;
    const userTranscript = assessmentResult ? assessmentResult.transcript : '(No speech)';

    const entry = {
      qNum: currentQIndex + 1,
      id: currentQ.id,
      level: currentQ.level,
      targetText: currentQ.target_text,
      userTranscript: userTranscript,
      accuracy: accuracy,
      isPassed: isPassed,
      sinhalaMeaning: currentQ.sinhala_meaning,
      phoneticHint: currentQ.phonetic_hint,
      soundDetected: assessmentResult ? assessmentResult.soundDetected : false,
      wordsCorrect: assessmentResult ? assessmentResult.wordsCorrect : false,
      wordResults: assessmentResult ? assessmentResult.wordResults : []
    };

    const updatedHistory = [...history, entry];
    setHistory(updatedHistory);

    if (currentQIndex < 9) {
      // Next question
      setCurrentQIndex(prev => prev + 1);
      setLiveTranscript('');
      setInstantSoundActive(false);
      setAssessmentResult(null);
      setIsAnswered(false);
      setRecordingSeconds(0);
      latestTranscriptRef.current = '';
      soundHeardRef.current = false;
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
                  stopListening();
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
                පියවර 3ක ශබ්ද, වචන සහ උච්චාරණ ඇගයීම (1. Sound Check ➔ 2. Word Check ➔ 3. Pronunciation Check).
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
                      <div>✓ Paper 01: Easy (Single Words)</div>
                      <div>✓ Paper 02: Medium (Short Sentences)</div>
                      <div>✓ Paper 03: Hard (Long Sentences)</div>
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
                පියවර 3ක විශ්ලේෂණය: 1. ශබ්ද හඳුනා ගැනීම ➔ 2. වචන පරීක්ෂාව ➔ 3. උච්චාරණ නිරවද්‍යතාව.
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
                  onClick={isListening ? stopRecordingAndEvaluate : startRecording}
                  className={`px-8 py-3.5 rounded-2xl font-black text-base transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <span>{isListening ? `⏹️ අවසන් කරන්න (${recordingSeconds}s)` : '🎤 කතා කරන්න (Speak)'}</span>
                </button>
              </div>

              {/* Instant Live Listening & Fast Voice Visualizer */}
              {isListening && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 space-y-3 animate-fade-in">
                  
                  {/* High-speed Real-Time Sound Status Bar */}
                  <div className="flex flex-wrap items-center justify-center gap-2 font-bold text-sm">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                    <span>🎙️ මයික්‍රෆෝනය සක්‍රීයයි ({recordingSeconds}s)... දැන් කතා කරන්න</span>
                    {instantSoundActive ? (
                      <span className="bg-emerald-600 text-white text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                        <span>🟢</span> හඬ ලැබුණි (Voice Active)
                      </span>
                    ) : (
                      <span className="bg-slate-200 text-slate-600 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span>🔈</span> හඬ බලාපොරොත්තුවෙන්...
                      </span>
                    )}
                  </div>

                  {/* Real-time recognized text preview (Instant display on every word) */}
                  {liveTranscript ? (
                    <div className="p-3.5 bg-white rounded-2xl border-2 border-emerald-300 text-center animate-scale-up shadow-sm">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        ඔබ පවසන දෙය (Live Speech):
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-sans">
                        "{liveTranscript}"
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-700 font-medium">
                      (මයික්‍රෆෝනයට පැහැදිලිව කතා කරන්න, ඔබ පවසන වචන මෙහි ක්ෂණිකව දිස්වනු ඇත)
                    </p>
                  )}
                </div>
              )}

              {/* ── 3-STAGE ASSESSMENT BREAKDOWN ── */}
              {assessmentResult && !isListening && (
                <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 space-y-4 text-left animate-fade-in shadow-sm">
                  
                  {/* Status Banner */}
                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    assessmentResult.pronunciationCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : assessmentResult.wordsCorrect
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}>
                    <div>
                      <h4 className="font-black text-sm">{assessmentResult.statusTitle}</h4>
                      <p className="text-xs font-medium mt-0.5">{assessmentResult.statusMessage}</p>
                    </div>
                    <span className={`text-base font-black px-3 py-1 rounded-xl ${
                      assessmentResult.pronunciationCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}>
                      {assessmentResult.accuracy}%
                    </span>
                  </div>

                  {/* 3 Steps Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    
                    {/* Step 1: Sound Check */}
                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold ${
                      assessmentResult.soundDetected ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      <span>{assessmentResult.soundDetected ? '✓' : '✗'}</span>
                      <span>1. ශබ්ද හඳුනා ගැනීම</span>
                    </div>

                    {/* Step 2: Word Check */}
                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold ${
                      !assessmentResult.soundDetected
                        ? 'bg-slate-100 border-slate-200 text-slate-400'
                        : assessmentResult.wordsCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      <span>{assessmentResult.wordsCorrect ? '✓' : '✗'}</span>
                      <span>2. වචන නිරවද්‍යතාව</span>
                    </div>

                    {/* Step 3: Pronunciation Check */}
                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold ${
                      !assessmentResult.wordsCorrect && !assessmentResult.pronunciationCorrect
                        ? 'bg-slate-100 border-slate-200 text-slate-400'
                        : assessmentResult.pronunciationCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}>
                      <span>{assessmentResult.pronunciationCorrect ? '✓' : '✗'}</span>
                      <span>3. උච්චාරණ මට්ටම</span>
                    </div>

                  </div>

                  {/* Word-by-Word Visual Breakdown for Sentences */}
                  {assessmentResult.wordResults && assessmentResult.wordResults.length > 1 && (
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        වචන අනුව විශ්ලේෂණය (Word Breakdown):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {assessmentResult.wordResults.map((wr, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 border ${
                              wr.matched
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
                            }`}
                          >
                            <span>{wr.matched ? '✓' : '✗'}</span>
                            <span>{wr.word}</span>
                            {!wr.matched && wr.spoken && (
                              <span className="text-[10px] text-rose-600 font-normal italic">
                                ("{wr.spoken}")
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Spoken Transcript */}
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 font-bold flex flex-wrap justify-between items-center gap-2">
                    <span>ඔබ පැවසූ දෙය: <strong className="font-sans text-slate-900 text-sm">"{assessmentResult.transcript}"</strong></span>
                    <span>අපේක්ෂිත {currentQ.level === 'easy' ? 'වචනය' : 'වාක්‍යය'}: <strong className="font-sans text-emerald-700 text-sm">"{currentQ.target_text}"</strong></span>
                  </div>

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
                      h.isPassed ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-800 text-sm font-sans">
                        Target: <strong>"{h.targetText}"</strong>
                      </span>
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        h.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {h.accuracy}% {h.isPassed ? '✓ Passed' : '✗ Needs Practice'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-bold">
                      ඔබ පැවසූ දෙය: <span className="font-sans text-slate-800">"{h.userTranscript}"</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200 text-[11px] font-bold text-slate-500">
                      <span>1. Sound: {h.soundDetected ? '✓' : '✗'}</span>
                      <span>•</span>
                      <span>2. Word: {h.wordsCorrect ? '✓' : '✗'}</span>
                      <span>•</span>
                      <span>3. Pronunciation: {h.accuracy}%</span>
                    </div>
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
