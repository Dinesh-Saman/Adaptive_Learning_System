import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GRADE2_DOMAINS } from '../../data/math/grade2_math_curriculum';
import questionData from '../../data/math/grade2_question_pool.json';

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

export default function MathGrade2AdaptiveModule({ onExit }) {
  const navigate = useNavigate();
  const pool = questionData.questions || [];

  // Session State
  const [sessionStarted, setSessionStarted] = useState(false);
  const [qNum, setQNum] = useState(1);
  const [currentDiff, setCurrentDiff] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [askedIds, setAskedIds] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [misconception, setMisconception] = useState(null);
  const [remedialFeedback, setRemedialFeedback] = useState(null);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // 20-Skill Mastery Vector (0 to 100%)
  const [skillMastery, setSkillMastery] = useState(() => {
    const init = {};
    Object.values(GRADE2_DOMAINS).forEach(dom => {
      dom.skills.forEach(s => {
        init[s.id] = 50.0;
      });
    });
    return init;
  });

  // Persistent Question History across Papers (Non-repetition Invariant)
  const getPersistentAnsweredIds = () => {
    try {
      const stored = localStorage.getItem('g2_math_answered_ids');
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
        localStorage.setItem('g2_math_answered_ids', JSON.stringify(updated));
      }
    } catch (e) {}
  };

  // Start / Restart Session
  const handleStartSession = () => {
    playSound('click');
    setQNum(1);
    setCurrentDiff(1);
    setAskedIds([]);
    setHistory([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setMisconception(null);
    setRemedialFeedback(null);
    setConsecutiveCorrect(0);
    setConsecutiveWrong(0);
    setSessionComplete(false);

    const init = {};
    Object.values(GRADE2_DOMAINS).forEach(dom => {
      dom.skills.forEach(s => {
        init[s.id] = 50.0;
      });
    });
    setSkillMastery(init);

    const firstQ = selectNextQuestion(1, 1, init, []);
    setCurrentQuestion(firstQ);
    if (firstQ) {
      setAskedIds([firstQ.id]);
      speakSinhala(firstQ.text_si);
    }
    setStartTime(Date.now());
    setSessionStarted(true);
  };

  // 5-Stage Adaptive Question Selection Algorithm with Strict Duplicate Filter
  const selectNextQuestion = (nextQNum, targetDiff, currentMasteries, existingAskedIds) => {
    const persistentExclusions = getPersistentAnsweredIds();
    const allExclusions = new Set([...existingAskedIds, ...persistentExclusions]);

    let targetSkillId = null;

    if (nextQNum === 1) {
      // Diagnostic Q1: Counting or Number Reading or Basic Addition
      const diagSkills = ['G2_D1_S1_COUNTING', 'G2_D1_S2_NUMBER_READING', 'G2_D2_S1_ADDITION_20'];
      targetSkillId = diagSkills[Math.floor(Math.random() * diagSkills.length)];
    } else if (nextQNum === 10) {
      // Q10: Consolidation test of weakest skill
      const sorted = Object.entries(currentMasteries).sort((a, b) => a[1] - b[1]);
      targetSkillId = sorted[0][0];
    } else {
      // Q2 - Q9: Dynamic Selection
      const sorted = Object.entries(currentMasteries).sort((a, b) => a[1] - b[1]);
      const weakestThree = sorted.slice(0, 3).map(x => x[0]);
      
      if (Math.random() < 0.7 && weakestThree.length > 0) {
        targetSkillId = weakestThree[Math.floor(Math.random() * weakestThree.length)];
      } else {
        const testedSkills = new Set(history.map(h => h.skill_id));
        const allSkills = Object.keys(currentMasteries);
        const untested = allSkills.filter(s => !testedSkills.has(s));
        targetSkillId = untested.length > 0
          ? untested[Math.floor(Math.random() * untested.length)]
          : allSkills[Math.floor(Math.random() * allSkills.length)];
      }
    }

    // Stage 1-4 Candidate Matching
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
    return unseen.length > 0 ? unseen[Math.floor(Math.random() * unseen.length)] : null;
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
      playSound('correct');
      nextConsecCorrect += 1;
      nextConsecWrong = 0;
      if (nextConsecCorrect >= 2) {
        nextDiff = Math.min(5, currentDiff + 1);
        nextConsecCorrect = 0;
      }
    } else {
      playSound('wrong');
      nextConsecCorrect = 0;
      nextConsecWrong += 1;
      if (nextConsecWrong >= 2) {
        nextDiff = Math.max(1, currentDiff - 1);
        nextConsecWrong = 0;
      } else if (currentDiff > 1) {
        nextDiff = Math.max(1, currentDiff - 1);
      }

      if (currentQuestion.error_patterns && currentQuestion.error_patterns[opt]) {
        setMisconception(currentQuestion.error_patterns[opt]);
      } else {
        setMisconception(null);
      }
    }

    setConsecutiveCorrect(nextConsecCorrect);
    setConsecutiveWrong(nextConsecWrong);
    setCurrentDiff(nextDiff);

    setRemedialFeedback(
      `නිවැරදි පිළිතුර: ${currentQuestion.answer}. ${currentQuestion.explanation_si || ''}`
    );

    const historyEntry = {
      qNum,
      questionId: currentQuestion.id,
      skillId: currentQuestion.skill_id,
      difficultyTier: currentQuestion.difficulty_tier,
      isCorrect: correct,
      selectedOption: opt,
      correctAnswer: currentQuestion.answer,
      timeSpentSec: timeSpent,
      questionTextSi: currentQuestion.text_si,
      questionTextEn: currentQuestion.text_en
    };
    setHistory(prev => [...prev, historyEntry]);
  };

  // Next Question
  const handleNextQuestion = () => {
    playSound('click');
    if (qNum >= 10) {
      setSessionComplete(true);
      playSound('correct');
      return;
    }

    const nextQNum = qNum + 1;
    setQNum(nextQNum);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setMisconception(null);
    setRemedialFeedback(null);

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

  const domainSummaries = Object.entries(GRADE2_DOMAINS).map(([domId, dom]) => {
    const scores = dom.skills.map(s => skillMastery[s.id] || 50);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return {
      id: domId,
      name_en: dom.name_en,
      name_si: dom.name_si,
      icon: dom.icon,
      color: dom.color,
      masteryAvg: avg
    };
  });

  const sortedSkills = Object.entries(skillMastery).sort((a, b) => a[1] - b[1]);
  const weakestSkills = sortedSkills.slice(0, 2);
  const strongestSkills = [...sortedSkills].reverse().slice(0, 2);

  const getSkillName = (sid) => {
    for (const dom of Object.values(GRADE2_DOMAINS)) {
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
      
      <div className="max-w-4xl mx-auto relative z-10">
      
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-teal-400 text-slate-700 font-bold rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <span>⬅</span>
            <span>Dashboard එකට</span>
          </button>

          {sessionStarted && !sessionComplete && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-teal-100 text-teal-800 px-3 py-1.5 rounded-xl border border-teal-200">
                ප්‍රශ්නය {qNum} / 10
              </span>
              <span className="text-xs font-black bg-blue-100 text-blue-800 px-3 py-1.5 rounded-xl border border-blue-200">
                Tier {currentDiff} ({DIFFICULTY_DELTAS[currentDiff]?.label.split(':')[0]})
              </span>
            </div>
          )}
        </div>

        {/* ── SCREEN 1: PRE-TEST INTRO HERO ── */}
        {!sessionStarted && !sessionComplete && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-teal-200 shadow-xl text-center animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-tr from-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center text-4xl text-white mx-auto mb-5 shadow-md">
              🌱
            </div>
            <div className="inline-block bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full text-xs font-black text-teal-700 uppercase tracking-widest mb-3">
              National Curriculum Research Engine (Grade 2)
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-800 mb-3">
              2 ශ්‍රේණිය — අනුවර්තී ගණිත ඇගයීම් පද්ධතිය
            </h1>
            <p className="text-slate-600 text-base max-w-xl mx-auto mb-8 leading-relaxed">
              ශ්‍රී ලංකා ජාතික ගුරු මාර්ගෝපදේශය පදනම් කරගත් <strong>ප්‍රධාන ක්ෂේත්‍ර 4ක්</strong> සහ <strong>කුසලතා 20ක්</strong> (100 දක්වා සංඛ්‍යා, 20 දක්වා එකතු කිරීම/අඩු කිරීම, අභිමත මිනුම්, හැඩතල) ඔස්සේ ක්‍රියාත්මක වන ඇගයීම් පද්ධතිය.
            </p>

            {/* 4 Domains Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 text-left">
              {Object.values(GRADE2_DOMAINS).map(dom => (
                <div key={dom.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-2xl mb-1 block">{dom.icon}</span>
                  <p className="text-xs font-bold text-slate-800 mb-0.5">{dom.name_si}</p>
                  <p className="text-[10px] font-bold text-slate-400">{dom.name_en}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleStartSession}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-lg px-8 py-4 rounded-2xl shadow-lg shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              🚀 2 ශ්‍රේණිය ඇගයීම අරඹන්න (Start Grade 2 Test)
            </button>
          </div>
        )}

        {/* ── SCREEN 2: ACTIVE QUESTION SCREEN ── */}
        {sessionStarted && !sessionComplete && currentQuestion && (
          <div className="space-y-6 animate-fade-in">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-100 shadow-xl relative overflow-hidden">
              
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                    {getSkillName(currentQuestion.skill_id).si}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    ({getSkillName(currentQuestion.skill_id).en})
                  </span>
                </div>
                <button
                  onClick={() => speakSinhala(currentQuestion.text_si)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  <span>🔊</span> ශබ්ද නගා කියවන්න
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2 leading-relaxed">
                {currentQuestion.text_si}
              </h2>
              <p className="text-sm text-slate-400 font-sans mb-6">
                {currentQuestion.text_en}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {currentQuestion.options.map((opt, idx) => {
                  let btnStyle = 'bg-white border-2 border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-teal-50/50';
                  
                  if (isAnswered) {
                    if (opt === currentQuestion.answer) {
                      btnStyle = 'bg-emerald-500 border-2 border-emerald-600 text-white shadow-md animate-pulse';
                    } else if (opt === selectedOption) {
                      btnStyle = 'bg-rose-500 border-2 border-rose-600 text-white';
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

              {/* Feedback and Misconceptions */}
              {isAnswered && (
                <div className={`rounded-2xl p-5 mb-4 border-2 animate-fade-in ${isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`}>
                  <div className="flex items-center gap-2 mb-2 font-black text-base">
                    <span>{isCorrect ? '🎉 නිවැරදියි!' : '❌ නැවත අවධානය යොමු කරමු:'}</span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed mb-2">
                    {remedialFeedback}
                  </p>
                  {misconception && (
                    <div className="mt-2 pt-2 border-t border-rose-200 text-xs font-bold text-rose-700 flex items-start gap-1">
                      <span>💡</span>
                      <span><strong>AI Diagnostic Note:</strong> {misconception}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Continue Action */}
              {isAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-black px-7 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer text-base"
                  >
                    <span>{qNum >= 10 ? 'සම්පූර්ණ වාර්තාව බලන්න (View Report)' : 'ඊළඟ ප්‍රශ්නය ➔'}</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── SCREEN 3: COMPREHENSIVE LEARNER REPORT ── */}
        {sessionComplete && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-teal-200 shadow-2xl space-y-8 animate-scale-up">
            
            <div className="text-center pb-6 border-b border-slate-200">
              <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center text-4xl text-white mx-auto mb-4 shadow-lg">
                🏆
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-1">
                2 ශ්‍රේණිය ඇගයීම් වාර්තාව (Grade 2 Mastery Report)
              </h2>
              <p className="text-sm text-slate-500 font-bold">
                කුසලතා 20 විශ්ලේෂණය (Grade 2 National Curriculum)
              </p>
            </div>

            {/* Score Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">නිවැරදි පිළිතුරු</p>
                <p className="text-3xl font-black text-teal-700">{totalCorrect} / 10</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">නිරවද්‍යතා ප්‍රතිශතය</p>
                <p className="text-3xl font-black text-emerald-700">{overallAccuracy}%</p>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">ළඟා වූ මට්ටම</p>
                <p className="text-2xl font-black text-blue-700">Tier {currentDiff} / 5</p>
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
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{dom.icon}</span>
                        <span className="font-black text-sm text-slate-800">{dom.name_si}</span>
                        <span className="text-xs text-slate-400 font-sans">({dom.name_en})</span>
                      </div>
                      <span className="font-black text-sm text-teal-600">{dom.masteryAvg}%</span>
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

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={handleStartSession}
                className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer text-center"
              >
                🔄 නැවත ඇගයීමක් කරන්න (Retake Diagnostic)
              </button>
              <button
                onClick={onExit || (() => navigate('/dashboard'))}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-center"
              >
                🏠 Dashboard එකට යන්න (Dashboard)
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
