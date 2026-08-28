import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GRADE3_DOMAINS } from '../../data/math/grade3_math_curriculum';
import questionData from '../../data/math/grade3_question_pool.json';

// ── Web Audio Synthesizer ──
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

function speakSinhala(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'si-LK';
  utterance.rate = 0.88;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
}

const DIFFICULTY_DELTAS = {
  1: { correct: 5, wrong: -8, label: 'Level 1: මූලික (Basic Recall)' },
  2: { correct: 5, wrong: -6, label: 'Level 2: සරල (Simple Application)' },
  3: { correct: 6, wrong: -5, label: 'Level 3: මධ්‍යම (Moderate Reasoning)' },
  4: { correct: 7, wrong: -3, label: 'Level 4: උසස් (Representation & Steps)' },
  5: { correct: 8, wrong: -2, label: 'Level 5: විශිෂ්ට (Concept Transfer)' }
};

const PAPERS_CONFIG = [
  {
    id: 1,
    title: 'ප්‍රශ්න පත්‍රය 01 (Paper 1)',
    subtitle: 'මූලික විෂය නිර්දේශ ඇගයීම (Diagnostic & Foundational)',
    badge: 'ප්‍රශ්න 20 • Basic to Intermediate',
    icon: '📝',
    color: 'from-blue-600 to-indigo-700',
    borderColor: 'border-blue-300'
  },
  {
    id: 2,
    title: 'ප්‍රශ්න පත්‍රය 02 (Paper 2)',
    subtitle: 'මධ්‍යම මට්ටමේ කුසලතා ඇගයීම (Progressive Mastery)',
    badge: 'ප්‍රශ්න 20 • Intermediate to High',
    icon: '🎯',
    color: 'from-indigo-600 to-purple-700',
    borderColor: 'border-indigo-300'
  },
  {
    id: 3,
    title: 'ප්‍රශ්න පත්‍රය 03 (Paper 3)',
    subtitle: 'උසස් සංකල්ප මට්ටමේ ඇගයීම (Advanced & Concept Transfer)',
    badge: 'ප්‍රශ්න 20 • Advanced Mastery',
    icon: '🏆',
    color: 'from-purple-600 to-pink-700',
    borderColor: 'border-purple-300'
  }
];

export default function MathGrade3AdaptiveModule({ onExit }) {
  const navigate = useNavigate();
  const pool = questionData.questions || [];

  // View: 'papers_hub' | 'quiz' | 'report'
  const [viewState, setViewState] = useState('papers_hub');
  const [activePaperId, setActivePaperId] = useState(1);

  // Quiz State (20 Questions)
  const [qNum, setQNum] = useState(1);
  const [currentDiff, setCurrentDiff] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [askedIds, setAskedIds] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  // 20-Skill Mastery Vector (0 to 100%)
  const [skillMastery, setSkillMastery] = useState(() => {
    const init = {};
    Object.values(GRADE3_DOMAINS).forEach(dom => {
      dom.skills.forEach(s => {
        init[s.id] = 50.0;
      });
    });
    return init;
  });

  // Paper History in LocalStorage
  const [paperHistory, setPaperHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('g3_math_paper_history');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  const savePaperResult = (paperId, resultData) => {
    const updated = {
      ...paperHistory,
      [paperId]: resultData
    };
    setPaperHistory(updated);
    try {
      localStorage.setItem('g3_math_paper_history', JSON.stringify(updated));
    } catch (e) {}
  };

  const getPersistentAnsweredIds = () => {
    try {
      const stored = localStorage.getItem('g3_math_answered_ids');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const savePersistentAnsweredId = (qId) => {
    try {
      const current = getPersistentAnsweredIds();
      if (!current.includes(qId)) {
        const updated = [...current, qId];
        localStorage.setItem('g3_math_answered_ids', JSON.stringify(updated));
      }
    } catch (e) {}
  };

  // Start a specific paper (20 Questions)
  const handleStartPaper = (pId) => {
    playSound('click');
    setActivePaperId(pId);
    setQNum(1);
    setCurrentDiff(pId === 1 ? 1 : pId === 2 ? 2 : 3);
    setAskedIds([]);
    setHistory([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setConsecutiveCorrect(0);
    setConsecutiveWrong(0);

    const init = {};
    Object.values(GRADE3_DOMAINS).forEach(dom => {
      dom.skills.forEach(s => {
        init[s.id] = 50.0;
      });
    });
    setSkillMastery(init);

    const firstQ = selectNextQuestion(1, pId === 1 ? 1 : pId === 2 ? 2 : 3, init, []);
    setCurrentQuestion(firstQ);
    if (firstQ) {
      setAskedIds([firstQ.id]);
      speakSinhala(firstQ.text_si);
    }
    setStartTime(Date.now());
    setViewState('quiz');
  };

  // View existing paper report directly
  const handleViewSavedPaperReport = (pId) => {
    playSound('click');
    const saved = paperHistory[pId];
    if (saved) {
      setActivePaperId(pId);
      setHistory(saved.history || []);
      setSkillMastery(saved.skillMastery || {});
      setCurrentDiff(saved.currentDiff || 1);
      setViewState('report');
    } else {
      handleStartPaper(pId);
    }
  };

  // 5-Stage Adaptive Question Selection Algorithm for 20 Questions
  const selectNextQuestion = (nextQNum, targetDiff, currentMasteries, existingAskedIds) => {
    const persistentExclusions = getPersistentAnsweredIds();
    const allExclusions = new Set([...existingAskedIds, ...persistentExclusions]);

    let targetSkillId = null;

    if (nextQNum === 1) {
      // Diagnostic Q1: Place Values, 3-digit Numbers, Basic Addition
      const diagSkills = ['G3_D1_S1_PLACE_VALUE_1000', 'G3_D1_S2_READ_WRITE_1000', 'G3_D2_S1_ADD_WITHOUT_REGROUP'];
      targetSkillId = diagSkills[Math.floor(Math.random() * diagSkills.length)];
    } else if (nextQNum === 20) {
      // Q20: Final consolidation test of weakest skill
      const sorted = Object.entries(currentMasteries).sort((a, b) => a[1] - b[1]);
      targetSkillId = sorted[0][0];
    } else {
      // Q2 - Q19: Dynamic Adaptive Selection (70% Weakness focus, 30% Coverage)
      const sorted = Object.entries(currentMasteries).sort((a, b) => a[1] - b[1]);
      const weakestThree = sorted.slice(0, 3).map(x => x[0]);
      
      if (Math.random() < 0.7 && weakestThree.length > 0) {
        targetSkillId = weakestThree[Math.floor(Math.random() * weakestThree.length)];
      } else {
        const testedSkills = new Set(history.map(h => h.skillId));
        const allSkills = Object.keys(currentMasteries);
        const untested = allSkills.filter(s => !testedSkills.has(s));
        targetSkillId = untested.length > 0
          ? untested[Math.floor(Math.random() * untested.length)]
          : allSkills[Math.floor(Math.random() * allSkills.length)];
      }
    }

    // Candidate Matching
    let candidates = pool.filter(q => 
      q.skill_id === targetSkillId && 
      q.difficulty_tier === targetDiff && 
      !allExclusions.has(q.id)
    );

    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    let skillCandidates = pool.filter(q => q.skill_id === targetSkillId && !allExclusions.has(q.id));
    if (skillCandidates.length > 0) {
      skillCandidates.sort((a, b) => Math.abs(a.difficulty_tier - targetDiff) - Math.abs(b.difficulty_tier - targetDiff));
      return skillCandidates[0];
    }

    let diffCandidates = pool.filter(q => q.difficulty_tier === targetDiff && !allExclusions.has(q.id));
    if (diffCandidates.length > 0) {
      return diffCandidates[Math.floor(Math.random() * diffCandidates.length)];
    }

    let unseen = pool.filter(q => !allExclusions.has(q.id));
    return unseen.length > 0 ? unseen[Math.floor(Math.random() * unseen.length)] : pool[0];
  };

  // Submit Answer Handler
  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    playSound('click');
    setSelectedOption(opt);
    setIsAnswered(true);

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const correct = (opt === currentQuestion.answer);
    setIsCorrect(correct);
    savePersistentAnsweredId(currentQuestion.id);

    const diffDelta = DIFFICULTY_DELTAS[currentQuestion.difficulty_tier] || DIFFICULTY_DELTAS[1];
    const delta = correct ? diffDelta.correct : diffDelta.wrong;

    const newMasteries = { ...skillMastery };
    const prevScore = newMasteries[currentQuestion.skill_id] || 50.0;
    newMasteries[currentQuestion.skill_id] = Math.max(0, Math.min(100, Math.round((prevScore + delta) * 10) / 10));
    setSkillMastery(newMasteries);

    let nextDiff = currentDiff;
    let nextConsecCorrect = consecutiveCorrect;
    let nextConsecWrong = consecutiveWrong;

    if (correct) {
      nextConsecCorrect += 1;
      nextConsecWrong = 0;
      if (nextConsecCorrect >= 2) {
        nextDiff = Math.min(5, currentDiff + 1);
        nextConsecCorrect = 0;
      }
    } else {
      nextConsecCorrect = 0;
      nextConsecWrong += 1;
      if (nextConsecWrong >= 2) {
        nextDiff = Math.max(1, currentDiff - 1);
        nextConsecWrong = 0;
      } else if (currentDiff > 1) {
        nextDiff = Math.max(1, currentDiff - 1);
      }
    }

    setConsecutiveCorrect(nextConsecCorrect);
    setConsecutiveWrong(nextConsecWrong);
    setCurrentDiff(nextDiff);

    const historyEntry = {
      qNum,
      questionId: currentQuestion.id,
      skillId: currentQuestion.skill_id,
      difficultyTier: currentQuestion.difficulty_tier,
      isCorrect: correct,
      selectedOption: opt,
      correctAnswer: currentQuestion.answer,
      explanationSi: currentQuestion.explanation_si,
      timeSpentSec: timeSpent,
      questionTextSi: currentQuestion.text_si,
      questionTextEn: currentQuestion.text_en
    };
    setHistory(prev => [...prev, historyEntry]);
  };

  // Next Question
  const handleNextQuestion = () => {
    playSound('click');
    if (qNum >= 20) {
      const finalTotalCorrect = history.filter(h => h.isCorrect).length;
      const finalAccuracy = Math.round((finalTotalCorrect / 20) * 100);
      
      savePaperResult(activePaperId, {
        paperId: activePaperId,
        totalCorrect: finalTotalCorrect,
        overallAccuracy: finalAccuracy,
        currentDiff,
        history,
        skillMastery,
        completedAt: new Date().toLocaleDateString('si-LK')
      });

      playSound('correct');
      setViewState('report');
      return;
    }

    const nextQNum = qNum + 1;
    setQNum(nextQNum);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);

    const nextQ = selectNextQuestion(nextQNum, currentDiff, skillMastery, askedIds);
    setCurrentQuestion(nextQ);
    if (nextQ) {
      setAskedIds(prev => [...prev, nextQ.id]);
      speakSinhala(nextQ.text_si);
    }
    setStartTime(Date.now());
  };

  const totalCorrect = history.filter(h => h.isCorrect).length;
  const overallAccuracy = history.length > 0 ? Math.round((totalCorrect / history.length) * 100) : 0;

  const domainSummaries = Object.entries(GRADE3_DOMAINS).map(([domId, dom]) => {
    const scores = dom.skills.map(s => skillMastery[s.id] || 50);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    const domSkillIds = new Set(dom.skills.map(s => s.id));
    const domHistory = history.filter(h => domSkillIds.has(h.skillId));
    const askedCount = domHistory.length;
    const correctCount = domHistory.filter(h => h.isCorrect).length;
    const wrongCount = askedCount - correctCount;

    return {
      id: domId,
      name_en: dom.name_en,
      name_si: dom.name_si,
      icon: dom.icon,
      color: dom.color,
      masteryAvg: avg,
      askedCount,
      correctCount,
      wrongCount
    };
  });

  const sortedSkills = Object.entries(skillMastery).sort((a, b) => a[1] - b[1]);
  const weakestSkills = sortedSkills.slice(0, 2);
  const strongestSkills = [...sortedSkills].reverse().slice(0, 2);

  const getSkillName = (sid) => {
    for (const dom of Object.values(GRADE3_DOMAINS)) {
      for (const s of dom.skills) {
        if (s.id === sid) return { si: s.name_si, en: s.name_en };
      }
    }
    return { si: sid, en: sid };
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed font-sans select-none relative overflow-x-hidden pb-16"
      style={{ backgroundImage: "url('/images/grade4_bg.png')" }}
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
              } else {
                onExit ? onExit() : navigate('/dashboard');
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-blue-400 text-slate-700 font-bold rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <span>⬅</span>
            <span>{viewState === 'papers_hub' ? 'Dashboard එකට' : 'ප්‍රශ්න පත්‍ර තෝරන්න'}</span>
          </button>

          {viewState === 'quiz' && (
            <div className="flex items-center gap-3">
              <span className="bg-blue-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                ප්‍රශ්න පත්‍රය 0{activePaperId}
              </span>
              <span className="bg-white/90 backdrop-blur border border-blue-200 text-blue-800 font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                ප්‍රශ්න {qNum} / 20
              </span>
            </div>
          )}
        </div>

        {/* ── SCREEN 1: 3 ADAPTIVE PAPERS HUB ── */}
        {viewState === 'papers_hub' && (
          <div className="space-y-6 animate-fade-in">
            {/* Hero Welcome Banner */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-blue-100 shadow-xl text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
              <div className="inline-block bg-blue-100 text-blue-800 font-black text-xs px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                Grade 3 • 3 ශ්‍රේණිය ගණිතය
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 font-sinhala">
                අනුවර්තී ප්‍රශ්න පත්‍ර පද්ධතිය (3 Adaptive Papers)
              </h1>
              <p className="text-slate-600 font-bold text-sm sm:text-base max-w-2xl mx-auto">
                ශ්‍රී ලංකා ජාතික විෂය නිර්දේශයේ කුසලතා 20 ආවරණය වන පරිදි සකස් කළ ප්‍රශ්න 20 බැගින් යුත් අනුවර්තී ප්‍රශ්න පත්‍ර 3ක්.
              </p>
            </div>

            {/* 3 Paper Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PAPERS_CONFIG.map((p) => {
                const result = paperHistory[p.id];
                const isCompleted = !!result;

                return (
                  <div 
                    key={p.id}
                    className={`bg-white rounded-3xl p-6 border-2 transition-all duration-300 shadow-lg flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden ${
                      isCompleted ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-4xl">{p.icon}</span>
                        {isCompleted ? (
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
                        <span className="inline-block text-xs font-black bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                          {p.badge}
                        </span>
                      </div>

                      {isCompleted && (
                        <div className="mt-4 p-3 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">පෙර ලකුණු:</span>
                          <span className="text-sm font-black text-emerald-700">
                            {result.totalCorrect}/20 ({result.overallAccuracy}%)
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 space-y-2">
                      <button
                        onClick={() => handleStartPaper(p.id)}
                        className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white shadow-md transition-all cursor-pointer bg-gradient-to-r ${p.color} hover:opacity-95 active:scale-95`}
                      >
                        {isCompleted ? '🔄 නැවත කරන්න (Retake)' : 'ආරම්භ කරන්න (Start) ➔'}
                      </button>
                      {isCompleted && (
                        <button
                          onClick={() => handleViewSavedPaperReport(p.id)}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          📊 වාර්තාව බලන්න (View Report)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SCREEN 2: 20 ADAPTIVE QUESTIONS QUIZ ── */}
        {viewState === 'quiz' && currentQuestion && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-blue-100 shadow-xl animate-scale-up space-y-6">
            
            {/* Progress Bar (20 Questions) */}
            <div>
              <div className="flex justify-between items-center text-xs font-black text-slate-600 mb-2">
                <span>ප්‍රශ්න ප්‍රගතිය (Progress)</span>
                <span>{qNum} / 20 ({Math.round((qNum / 20) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(qNum / 20) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                    {getSkillName(currentQuestion.skill_id).si}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    ({getSkillName(currentQuestion.skill_id).en})
                  </span>
                </div>
                <button
                  onClick={() => speakSinhala(currentQuestion.text_si)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer shadow-sm"
                >
                  <span>🔊</span> ශබ්ද නගා කියවන්න
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-relaxed font-sinhala">
                {currentQuestion.text_si}
              </h2>
              <p className="text-sm text-slate-400 font-sans">
                {currentQuestion.text_en}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {currentQuestion.options.map((opt, idx) => {
                  let btnStyle = 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50';
                  
                  if (isAnswered) {
                    if (opt === selectedOption) {
                      btnStyle = 'bg-blue-600 border-2 border-blue-700 text-white shadow-md scale-[1.02]';
                    } else {
                      btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-5 rounded-2xl font-black text-lg transition-all text-center flex items-center justify-center gap-3 cursor-pointer shadow-sm ${btnStyle}`}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Continue Action */}
              {isAnswered && (
                <div className="flex justify-end pt-4 animate-fade-in border-t border-slate-200">
                  <button
                    onClick={handleNextQuestion}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3.5 rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer text-base active:scale-95"
                  >
                    <span>{qNum >= 20 ? 'සම්පූර්ණ වාර්තාව බලන්න (View Report) ➔' : 'ඊළඟ ප්‍රශ්නය ➔'}</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── SCREEN 3: COMPREHENSIVE LEARNER REPORT (20 QUESTIONS) ── */}
        {viewState === 'report' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-blue-200 shadow-2xl space-y-8 animate-scale-up">
            
            <div className="text-center pb-6 border-b border-slate-200">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-4xl text-white mx-auto mb-4 shadow-lg">
                🏆
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-1 font-sinhala">
                3 ශ්‍රේණිය — ප්‍රශ්න පත්‍රය 0{activePaperId} ඇගයීම් වාර්තාව
              </h2>
              <p className="text-sm text-slate-500 font-bold">
                කුසලතා 20 අනුවර්තී විශ්ලේෂණය (Grade 3 National Curriculum)
              </p>
            </div>

            {/* Score Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">නිවැරදි පිළිතුරු</p>
                <p className="text-3xl font-black text-blue-700">{totalCorrect} / 20</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">නිරවද්‍යතා ප්‍රතිශතය</p>
                <p className="text-3xl font-black text-emerald-700">{overallAccuracy}%</p>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-purple-50 border border-purple-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">ළඟා වූ මට්ටම</p>
                <p className="text-2xl font-black text-purple-700">Tier {currentDiff} / 5</p>
              </div>
            </div>

            {/* 4 Domains Mastery Bars */}
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                <span>📊</span> ප්‍රධාන ක්ෂේත්‍ර 4 හි ප්‍රවීණතා මට්ටම (Domain Mastery)
              </h3>
              <div className="space-y-4">
                {domainSummaries.map(dom => (
                  <div key={dom.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{dom.icon}</span>
                        <span className="font-black text-sm text-slate-800">{dom.name_si}</span>
                        <span className="text-xs text-slate-400 font-sans">({dom.name_en})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {dom.askedCount > 0 ? (
                          <div className="flex items-center gap-1.5 text-xs font-black">
                            <span className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg">
                              ප්‍රශ්න {dom.askedCount}
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                              ✓ {dom.correctCount}
                            </span>
                            {dom.wrongCount > 0 && (
                              <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                ✗ {dom.wrongCount}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                            ප්‍රශ්න අසා නැත
                          </span>
                        )}
                        <span className="font-black text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                          {dom.masteryAvg}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${dom.color} h-3 rounded-full transition-all duration-700`}
                        style={{ width: `${dom.masteryAvg}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-sm mb-3">
                  <span>💪</span> ඉහළම දක්ෂතා දැක්වූ කුසලතා (Strengths)
                </div>
                <div className="space-y-2">
                  {strongestSkills.map(([sid, score]) => (
                    <div key={sid} className="flex justify-between text-xs font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span>{getSkillName(sid).si}</span>
                      <span className="text-emerald-600 font-black">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-amber-800 font-black text-sm mb-3">
                  <span>🎯</span> තවදුරටත් පුහුණු විය යුතු කුසලතා (Areas to Improve)
                </div>
                <div className="space-y-2">
                  {weakestSkills.map(([sid, score]) => (
                    <div key={sid} className="flex justify-between text-xs font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-amber-100">
                      <span>{getSkillName(sid).si}</span>
                      <span className="text-amber-600 font-black">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Question Review Table for all 20 questions */}
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                <span>📋</span> ප්‍රශ්න 20 සමාලෝචනය (Detailed 20-Question Review)
              </h3>
              <div className="space-y-3">
                {history.map((h, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border-2 ${
                      h.isCorrect 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-rose-50 border-rose-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white ${h.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                          {h.isCorrect ? '✓' : '✗'}
                        </span>
                        <span className="font-bold text-slate-800 text-sm">ප්‍රශ්නය {h.qNum} / 20</span>
                      </div>
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${h.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {h.isCorrect ? 'නිවැරදියි' : 'වැරදියි'}
                      </span>
                    </div>
                    <p className="text-slate-800 font-bold text-sm mb-2">{h.questionTextSi}</p>
                    <div className="flex flex-wrap gap-4 text-xs font-bold">
                      <span className="text-slate-600">ඔබේ පිළිතුර: <strong className={h.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{h.selectedOption}</strong></span>
                      {!h.isCorrect && (
                        <span className="text-slate-600">නිවැරදි පිළිතුර: <strong className="text-emerald-700">{h.correctAnswer}</strong></span>
                      )}
                    </div>
                    {h.explanationSi && (
                      <p className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-600 font-medium">
                        💡 {h.explanationSi}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleStartPaper(activePaperId)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer text-center"
              >
                🔄 නැවත කරන්න (Retake Paper 0{activePaperId})
              </button>
              <button
                onClick={() => setViewState('papers_hub')}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-black py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-center"
              >
                📑 වෙනත් ප්‍රශ්න පත්‍රයක් (Select Another Paper)
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
