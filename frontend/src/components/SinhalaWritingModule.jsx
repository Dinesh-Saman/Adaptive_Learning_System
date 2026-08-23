import React, { useState, useEffect, useRef, useCallback } from 'react';

// ── Constants ──────────────────────────────────────────────
const DIFFICULTY_COLORS = {
  easy:   { bg: 'bg-green-50',  border: 'border-green-400', text: 'text-green-700',  badge: 'bg-green-100 text-green-700',  label: 'Easy (පහසු)' },
  medium: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700', label: 'Medium (මධ්‍යම)' },
  hard:   { bg: 'bg-red-50',    border: 'border-red-400',    text: 'text-red-700',    badge: 'bg-red-100 text-red-700',    label: 'Hard (අපහසු)' },
};
const ERROR_LABELS = {
  correct:           { icon: '✅', label: 'Correct!',           color: 'text-green-600' },
  missing_character: { icon: '⚠️', label: 'Missing Character',   color: 'text-orange-500' },
  extra_character:   { icon: '⚠️', label: 'Extra Character',     color: 'text-orange-500' },
  substitution:      { icon: '❌', label: 'Wrong Character',     color: 'text-red-500' },
  order_error:       { icon: '🔀', label: 'Wrong Order',         color: 'text-purple-500' },
  incomplete:        { icon: '✂️', label: 'Incomplete Word',     color: 'text-orange-500' },
  unrelated:         { icon: '❓', label: 'Unrelated Answer',    color: 'text-red-500' },
  no_answer:         { icon: '🔇', label: 'No Answer',           color: 'text-slate-500' },
};

// ── Adaptive engine: decides next difficulty ──────────────
function getNextDifficulty(accuracy, current) {
  if (accuracy >= 90) {
    if (current === 'easy') return 'medium';
    if (current === 'medium') return 'hard';
    return 'hard';
  }
  if (accuracy < 50) {
    if (current === 'hard') return 'medium';
    if (current === 'medium') return 'easy';
    return 'easy';
  }
  return current;
}

// ── Confetti component ────────────────────────────────────
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-2xl animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1}s`,
            animationDuration: `${0.5 + Math.random() * 1}s`,
          }}
        >
          {['🎉', '⭐', '🌟', '✨', '🎊'][Math.floor(Math.random() * 5)]}
        </div>
      ))}
    </div>
  );
}

// ── Progress Bar ─────────────────────────────────────────
function ProgressBar({ value, max, color = 'bg-indigo-500' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
      <div className={`h-3 rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Main Module ───────────────────────────────────────────
export default function SinhalaWritingModule({ onExit }) {
  const [stage, setStage] = useState('grade-select');     // grade-select | activity | feedback | level-complete | profile
  const [grade, setGrade] = useState(2);
  const [studentName, setStudentName] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [currentLevel, setCurrentLevel] = useState(1);

  // Activities for this session
  const [activities, setActivities] = useState([]);
  const [activityIndex, setActivityIndex] = useState(0);
  const currentActivity = activities[activityIndex] || null;

  // Activity sub-stage: 'mcq' | 'writing'
  const [activityStage, setActivityStage] = useState('mcq');
  const [selectedMcqIndex, setSelectedMcqIndex] = useState(null);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  // Evaluation state
  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selfCorrecting, setSelfCorrecting] = useState(false);

  // Session tracking
  const [sessionResults, setSessionResults] = useState([]);  // array of { isCorrect, errorType, word, timeSeconds }
  const [startTime, setStartTime] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Error history for AI context
  const [errorHistory, setErrorHistory] = useState([]);

  // Profile
  const [profile, setProfile] = useState(null);

  const inputRef = useRef(null);
  const studentId = studentName ? `${studentName.toLowerCase().replace(/\s+/g, '_')}_g${grade}` : 'student';

  // ── Load activities from backend ──
  const loadActivities = useCallback(async (g, lv) => {
    try {
      const res = await fetch(`http://localhost:5000/api/sinhala-writing/activities?grade=${g}&level=${lv}`);
      const data = await res.json();
      // Shuffle and pick up to 5 per session
      const shuffled = data.sort(() => Math.random() - 0.5).slice(0, 5);
      setActivities(shuffled.length > 0 ? shuffled : []);
    } catch {
      setActivities([]);
    }
  }, []);

  // ── Load student profile ──
  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/sinhala-writing/profile/${studentId}`);
      const data = await res.json();
      setProfile(data);
      if (data) {
        setCurrentLevel(data.currentLevel || 1);
        setDifficulty(data.currentDifficulty || 'easy');
      }
    } catch { setProfile(null); }
  }, [studentId]);

  // ── Start session ──
  const startSession = async () => {
    if (!studentName.trim()) return;
    await loadProfile();
    await loadActivities(grade, currentLevel);
    setActivityIndex(0);
    setSessionResults([]);
    setActivityStage('mcq');
    setSelectedMcqIndex(null);
    setWrittenAnswer('');
    setEvaluation(null);
    setHintsUsed(0);
    setShowHint(false);
    setSelfCorrecting(false);
    setStartTime(Date.now());
    setStage('activity');
  };

  // ── MCQ selection ──
  const handleMcqSelect = (idx) => {
    setSelectedMcqIndex(idx);
  };
  const handleMcqConfirm = () => {
    if (selectedMcqIndex === null) return;
    setActivityStage('writing');
    setWrittenAnswer('');
    setEvaluation(null);
    setHintsUsed(0);
    setShowHint(false);
    setSelfCorrecting(false);
    setStartTime(Date.now());
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  // ── AI Evaluation ──
  const evaluateAnswer = async (answer, isSelfCorrection = false) => {
    if (!currentActivity) return;
    setIsEvaluating(true);
    const timeSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    try {
      const res = await fetch('http://localhost:5000/api/sinhala-writing/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expected: currentActivity.word,
          written: answer,
          grade, level: currentLevel, difficulty,
          errorHistory: errorHistory.slice(-5),
          studentId
        })
      });
      const result = await res.json();

      if (result.isCorrect) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2500);
      }

      setEvaluation({ ...result, timeSeconds, selfCorrected: isSelfCorrection });

      // Save attempt to backend
      fetch('http://localhost:5000/api/sinhala-writing/save-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId, studentName, grade, level: currentLevel,
          word: currentActivity.word,
          expected: currentActivity.word,
          written: answer,
          isCorrect: result.isCorrect,
          errorType: result.errorType,
          difficulty, hintsUsed, selfCorrected: isSelfCorrection, timeSeconds
        })
      }).catch(() => {});

      // Update local error history
      if (!result.isCorrect) {
        setErrorHistory(prev => [...prev, { errorType: result.errorType, word: currentActivity.word }].slice(-20));
      }

      // Update local session results
      setSessionResults(prev => [...prev, {
        isCorrect: result.isCorrect, errorType: result.errorType,
        word: currentActivity.word, timeSeconds
      }]);

      setStage('feedback');
    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // ── Hint management ──
  const handleShowHint = () => {
    setHintsUsed(h => h + 1);
    setShowHint(true);
  };

  // ── Self-correct flow ──
  const handleSelfCorrect = () => {
    setSelfCorrecting(true);
    setWrittenAnswer('');
    setEvaluation(null);
    setShowHint(false);
    setStage('activity');
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  // ── Proceed to next activity ──
  const handleNext = async () => {
    if (activityIndex + 1 >= activities.length) {
      // Session complete — calculate accuracy
      const correct = sessionResults.filter(r => r.isCorrect).length;
      const accuracy = Math.round((correct / sessionResults.length) * 100);
      const nextDiff = getNextDifficulty(accuracy, difficulty);
      const shouldUnlockNext = accuracy >= 80 && sessionResults.filter(r => !r.isCorrect).length <= 2;

      if (shouldUnlockNext && currentLevel < 3) {
        await fetch('http://localhost:5000/api/sinhala-writing/update-level', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, currentDifficulty: nextDiff, unlockLevel: currentLevel + 1 })
        }).catch(() => {});
      } else {
        await fetch('http://localhost:5000/api/sinhala-writing/update-level', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, currentDifficulty: nextDiff })
        }).catch(() => {});
      }

      setDifficulty(nextDiff);
      setStage('level-complete');
    } else {
      setActivityIndex(i => i + 1);
      setActivityStage('mcq');
      setSelectedMcqIndex(null);
      setWrittenAnswer('');
      setEvaluation(null);
      setHintsUsed(0);
      setShowHint(false);
      setSelfCorrecting(false);
      setStartTime(Date.now());
      setStage('activity');
    }
  };

  const sessionAccuracy = sessionResults.length > 0
    ? Math.round((sessionResults.filter(r => r.isCorrect).length / sessionResults.length) * 100)
    : 0;

  // ── RENDER: Grade Select ──────────────────────────────
  if (stage === 'grade-select') return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in-up">
      <h1
        onClick={onExit}
        className="text-4xl font-bold text-indigo-600 mb-2 cursor-pointer hover:opacity-80 transition-opacity text-center"
      >
        📝 සිංහල Writing AI
      </h1>
      <p className="text-slate-500 text-center mb-10">Adaptive Personalized Sinhala Writing System</p>

      <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-indigo-100 flex flex-col gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-2">ඔබේ නම (Your Name)</label>
          <input
            type="text"
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && startSession()}
            placeholder="Type your name..."
            className="w-full border-2 border-slate-200 rounded-2xl px-5 py-4 text-lg font-semibold outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-3">ශ්‍රේණිය (Grade)</label>
          <div className="grid grid-cols-4 gap-3">
            {[2, 3, 4, 5].map(g => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`py-4 rounded-2xl font-black text-2xl transition-all border-4 ${
                  grade === g
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 scale-105'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-3">Difficulty</label>
          <div className="grid grid-cols-3 gap-3">
            {['easy', 'medium', 'hard'].map(d => {
              const c = DIFFICULTY_COLORS[d];
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-3 rounded-2xl font-bold text-sm transition-all border-4 ${
                    difficulty === d ? `${c.border} ${c.bg} ${c.text} scale-105` : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={startSession}
          disabled={!studentName.trim()}
          className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-xl rounded-2xl shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed transform hover:-translate-y-1"
        >
          ▶ ආරම්භ කරන්න (Start)
        </button>
      </div>
    </div>
  );

  // ── RENDER: Activity (MCQ + Writing) ──────────────────
  if (stage === 'activity' && currentActivity) {
    const dc = DIFFICULTY_COLORS[difficulty];
    const mcqCorrect = selectedMcqIndex === currentActivity.correctIndex;

    return (
      <div className="max-w-2xl mx-auto p-4 animate-fade-in-up">
        {showConfetti && <Confetti />}

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={onExit} className="text-slate-400 hover:text-slate-700 px-3 py-1 rounded-xl border border-slate-200 bg-white text-sm font-bold">← Back</button>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${dc.badge}`}>{dc.label}</span>
            <span className="text-xs text-slate-400 font-medium">Level {currentLevel} · Grade {grade}</span>
          </div>
          <button onClick={() => setStage('profile')} className="text-indigo-500 hover:text-indigo-700 px-3 py-1 rounded-xl border border-indigo-200 bg-indigo-50 text-xs font-bold">👤 Profile</button>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Question {activityIndex + 1} of {activities.length}</span>
            <span>Session: {sessionAccuracy}% correct</span>
          </div>
          <ProgressBar value={activityIndex + 1} max={activities.length} color="bg-indigo-500" />
        </div>

        {/* Word card */}
        <div className={`bg-white rounded-3xl shadow-lg border-4 ${dc.border} p-6 mb-5`}>
          {/* Topic tag */}
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{currentActivity.topicSinhala}</span>
            <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full">
              {activityStage === 'mcq' ? 'Step 1: Choose' : 'Step 2: Write'}
            </span>
          </div>

          {/* Emoji */}
          <div className="text-center mb-4">
            <span className="text-7xl">{currentActivity.emoji}</span>
          </div>

          {/* MCQ Stage */}
          {activityStage === 'mcq' && (
            <div>
              <p className="text-center text-slate-600 font-semibold mb-4 text-lg">
                නිවැරදි වචනය තෝරන්න: <span className="font-bold text-slate-800">{currentActivity.meaning}</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                {currentActivity.mcqOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMcqSelect(idx)}
                    className={`py-4 px-4 rounded-2xl text-xl font-bold border-4 transition-all ${
                      selectedMcqIndex === idx
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 scale-105'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button
                onClick={handleMcqConfirm}
                disabled={selectedMcqIndex === null}
                className="mt-5 w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-lg rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ✅ Confirm Selection
              </button>
            </div>
          )}

          {/* Writing Stage */}
          {activityStage === 'writing' && (
            <div>
              {/* Show word or characters based on difficulty */}
              {difficulty === 'easy' && (
                <div className="text-center mb-4">
                  <p className="text-sm text-slate-500 mb-2">Characters to trace:</p>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {currentActivity.characters.map((ch, i) => (
                      <span key={i} className="text-3xl font-bold bg-indigo-50 border-2 border-indigo-200 rounded-xl px-4 py-2 text-indigo-700">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {difficulty === 'medium' && (
                <div className="text-center mb-4">
                  <p className="text-sm text-slate-500 mb-2">Copy this word:</p>
                  <span className="text-5xl font-black text-indigo-700">{currentActivity.word}</span>
                </div>
              )}
              {difficulty === 'hard' && (
                <div className="text-center mb-4">
                  <p className="text-sm text-slate-500 mb-2">Write the Sinhala word for this:</p>
                  <p className="text-2xl font-bold text-slate-600 italic">"{currentActivity.sentence}"</p>
                </div>
              )}

              {/* Input */}
              <p className="text-slate-600 font-semibold mb-2 text-center">
                {difficulty === 'easy' ? 'Now type the word:' : 'Write the word:'}
              </p>
              <input
                ref={inputRef}
                type="text"
                value={writtenAnswer}
                onChange={e => setWrittenAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && writtenAnswer.trim() && evaluateAnswer(writtenAnswer)}
                placeholder="ලියන්න..."
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className={`w-full text-center text-3xl font-black border-4 rounded-2xl py-5 px-4 outline-none transition-all ${
                  inputFocused ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-slate-300'
                }`}
                style={{ fontFamily: "'Noto Sans Sinhala', 'Iskoola Pota', sans-serif", letterSpacing: '0.08em' }}
              />

              {/* Hint section */}
              {showHint && evaluation?.hint1 && (
                <div className="mt-3 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
                  {hintsUsed >= 1 && <p className="text-yellow-700 text-sm font-medium">💡 {evaluation.hint1}</p>}
                  {hintsUsed >= 2 && evaluation.hint2 && (
                    <p className="text-yellow-700 font-bold text-xl text-center mt-1">{evaluation.hint2}</p>
                  )}
                  {hintsUsed >= 3 && evaluation.hint3?.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2 justify-center">
                      {evaluation.hint3.map((h, i) => (
                        <button key={i} onClick={() => setWrittenAnswer(w => w + h)}
                          className="px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-xl font-bold text-yellow-800 text-lg hover:bg-yellow-200">
                          {h}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                {evaluation && !evaluation.isCorrect && !showHint && (
                  <button onClick={handleShowHint} className="flex-1 py-3 rounded-2xl border-2 border-yellow-300 bg-yellow-50 text-yellow-700 font-bold text-sm hover:bg-yellow-100 transition-colors">
                    💡 Hint ({hintsUsed === 0 ? '3 available' : `${3 - hintsUsed} left`})
                  </button>
                )}
                {evaluation && !evaluation.isCorrect && (
                  <button onClick={handleShowHint} className="flex-1 py-3 rounded-2xl border-2 border-yellow-300 bg-yellow-50 text-yellow-700 font-bold text-sm hover:bg-yellow-100 transition-colors">
                    🔍 More Hint
                  </button>
                )}
                <button
                  onClick={() => evaluateAnswer(writtenAnswer)}
                  disabled={!writtenAnswer.trim() || isEvaluating}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed text-lg hover:from-indigo-600 hover:to-purple-600 transition-all"
                >
                  {isEvaluating ? '🤖 Checking...' : '✅ Check Answer'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── RENDER: Feedback ─────────────────────────────────
  if (stage === 'feedback' && evaluation) {
    const errCfg = ERROR_LABELS[evaluation.errorType] || ERROR_LABELS.substitution;
    const dc = DIFFICULTY_COLORS[difficulty];

    return (
      <div className="max-w-2xl mx-auto p-4 animate-fade-in-up">
        {showConfetti && <Confetti />}

        <div className={`bg-white rounded-3xl shadow-xl border-4 p-6 ${evaluation.isCorrect ? 'border-green-400' : 'border-red-300'}`}>

          {/* Status */}
          <div className={`text-center mb-6 py-4 rounded-2xl ${evaluation.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-6xl mb-2">{errCfg.icon}</div>
            <h2 className={`text-2xl font-black ${errCfg.color}`}>{errCfg.label}</h2>
          </div>

          {/* Word comparison */}
          <div className="flex gap-4 mb-5 flex-wrap justify-center">
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-3 text-center">
              <p className="text-xs text-slate-400 font-bold mb-1">Expected / නිවැරදි</p>
              <p className="text-3xl font-black text-green-600" style={{ fontFamily: "'Noto Sans Sinhala', 'Iskoola Pota', sans-serif" }}>{currentActivity?.word}</p>
            </div>
            <div className={`rounded-2xl px-6 py-3 text-center border-2 ${evaluation.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className="text-xs text-slate-400 font-bold mb-1">You wrote / ඔබ ලිව්වා</p>
              <p className={`text-3xl font-black ${evaluation.isCorrect ? 'text-green-600' : 'text-red-500'}`}
                style={{ fontFamily: "'Noto Sans Sinhala', 'Iskoola Pota', sans-serif" }}>
                {evaluation.isCorrect ? writtenAnswer : (writtenAnswer || '—')}
              </p>
            </div>
          </div>

          {/* AI Feedback */}
          <div className={`rounded-2xl p-4 mb-5 ${evaluation.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
            <p className="font-bold text-slate-700 mb-1" style={{ fontFamily: "'Noto Sans Sinhala', 'Iskoola Pota', sans-serif" }}>
              {evaluation.feedbackSinhala}
            </p>
            <p className="text-slate-500 text-sm">{evaluation.feedbackEnglish}</p>
            {evaluation.aiEnhanced && <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold mt-2 inline-block">🤖 AI Enhanced</span>}
          </div>

          {/* Error type detail */}
          {!evaluation.isCorrect && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-5">
              <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-1">Error Type / දෝෂ වර්ගය</p>
              <p className="text-yellow-800 font-semibold">{errCfg.label}</p>
              {evaluation.errorDetail && <p className="text-yellow-600 text-sm mt-1">{evaluation.errorDetail}</p>}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-slate-50 rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-indigo-600">{evaluation.timeSeconds}s</div>
              <div className="text-xs text-slate-400">Time</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-yellow-500">{hintsUsed}</div>
              <div className="text-xs text-slate-400">Hints Used</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-green-500">{sessionAccuracy}%</div>
              <div className="text-xs text-slate-400">Session</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!evaluation.isCorrect && !selfCorrecting && (
              <button
                onClick={handleSelfCorrect}
                className="flex-1 py-3 rounded-2xl border-2 border-orange-300 bg-orange-50 text-orange-700 font-bold hover:bg-orange-100 transition-colors"
              >
                🔄 Try Again
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all text-lg"
            >
              {activityIndex + 1 >= activities.length ? '📊 See Results →' : '▶ Next →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: Level Complete ────────────────────────────
  if (stage === 'level-complete') {
    const correct = sessionResults.filter(r => r.isCorrect).length;
    const accuracy = sessionAccuracy;
    const nextDiff = getNextDifficulty(accuracy, difficulty);
    const unlocked = accuracy >= 80;
    const errorTypes = sessionResults.filter(r => !r.isCorrect).reduce((acc, r) => {
      acc[r.errorType] = (acc[r.errorType] || 0) + 1; return acc;
    }, {});
    const topError = Object.entries(errorTypes).sort((a, b) => b[1] - a[1])[0];

    return (
      <div className="max-w-2xl mx-auto p-4 animate-fade-in-up">
        {unlocked && <Confetti />}
        <div className="bg-white rounded-3xl shadow-xl border-t-8 border-indigo-500 p-8">

          <div className="text-center mb-6">
            <div className="text-7xl mb-3">{accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : '💪'}</div>
            <h2 className="text-3xl font-black text-slate-800">Session Complete!</h2>
            <p className="text-slate-400 mt-1">Level {currentLevel} · Grade {grade}</p>
          </div>

          {/* Big score */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-6 text-center mb-6">
            <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-1">Overall Score</div>
            <div className={`text-6xl font-black ${accuracy >= 80 ? 'text-green-500' : accuracy >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
              {accuracy}<span className="text-3xl text-slate-400">%</span>
            </div>
            <p className="text-slate-500 mt-1">{correct} / {sessionResults.length} correct</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs text-slate-400 font-bold mb-1">ACCURACY</p>
              <ProgressBar value={accuracy} max={100} color={accuracy >= 80 ? 'bg-green-500' : 'bg-yellow-500'} />
              <p className="text-right text-sm font-bold text-slate-600 mt-1">{accuracy}%</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs text-slate-400 font-bold mb-1">NEXT DIFFICULTY</p>
              <span className={`text-sm font-black px-3 py-1 rounded-full ${DIFFICULTY_COLORS[nextDiff].badge}`}>
                {nextDiff !== difficulty ? `↑ ${DIFFICULTY_COLORS[nextDiff].label}` : DIFFICULTY_COLORS[nextDiff].label}
              </span>
            </div>
          </div>

          {/* Top error */}
          {topError && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
              <p className="text-xs text-orange-500 font-bold mb-1">MOST COMMON ERROR</p>
              <p className="font-bold text-orange-700">{ERROR_LABELS[topError[0]]?.label || topError[0]} ({topError[1]}x)</p>
              <p className="text-sm text-orange-500 mt-1">The next session will focus on fixing this!</p>
            </div>
          )}

          {/* Level unlock */}
          {unlocked && currentLevel < 3 && (
            <div className="bg-green-50 border border-green-300 rounded-2xl p-4 mb-6 text-center">
              <p className="text-2xl font-black text-green-600">🔓 Level {currentLevel + 1} Unlocked!</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={async () => {
                await loadActivities(grade, currentLevel);
                setActivityIndex(0); setSessionResults([]);
                setActivityStage('mcq'); setSelectedMcqIndex(null);
                setWrittenAnswer(''); setEvaluation(null);
                setHintsUsed(0); setShowHint(false); setSelfCorrecting(false);
                setStartTime(Date.now()); setStage('activity');
              }}
              className="flex-1 py-4 rounded-2xl font-black text-indigo-600 bg-indigo-50 border-2 border-indigo-200 hover:bg-indigo-100 transition-colors text-lg"
            >
              🔄 Play Again
            </button>
            <button
              onClick={() => setStage('profile')}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-2xl transition-colors text-lg"
            >
              👤 Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: Profile ───────────────────────────────────
  if (stage === 'profile') {
    const correct = sessionResults.filter(r => r.isCorrect).length;
    const errorTypes = sessionResults.filter(r => !r.isCorrect).reduce((acc, r) => {
      acc[r.errorType] = (acc[r.errorType] || 0) + 1; return acc;
    }, {});

    return (
      <div className="max-w-2xl mx-auto p-4 animate-fade-in-up">
        <div className="flex justify-between items-center mb-5">
          <button onClick={() => setStage(sessionResults.length > 0 ? 'level-complete' : 'grade-select')}
            className="text-slate-500 font-bold hover:text-slate-800 px-4 py-2 rounded-xl bg-white border shadow-sm">
            ← Back
          </button>
          <h2 className="text-2xl font-black text-indigo-600">👤 Learning Profile</h2>
          <div className="w-16" />
        </div>

        <div className="bg-white rounded-3xl shadow-lg border-2 border-indigo-100 p-6 flex flex-col gap-5">

          {/* Student info */}
          <div className="flex items-center gap-4 bg-indigo-50 rounded-2xl p-4">
            <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
              {studentName[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-black text-xl text-slate-800">{studentName || 'Student'}</p>
              <p className="text-slate-500 text-sm">Grade {grade} · Level {currentLevel} · {DIFFICULTY_COLORS[difficulty].label}</p>
            </div>
          </div>

          {/* Session summary */}
          {sessionResults.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-600 text-sm uppercase tracking-widest mb-3">This Session</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 rounded-2xl p-3 text-center">
                  <div className="text-2xl font-black text-green-600">{sessionAccuracy}%</div>
                  <div className="text-xs text-slate-400">Accuracy</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-3 text-center">
                  <div className="text-2xl font-black text-blue-600">{correct}/{sessionResults.length}</div>
                  <div className="text-xs text-slate-400">Correct</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-3 text-center">
                  <div className="text-2xl font-black text-purple-600">{sessionResults.reduce((s,r)=>s+r.timeSeconds,0)}s</div>
                  <div className="text-xs text-slate-400">Total Time</div>
                </div>
              </div>
            </div>
          )}

          {/* Accuracy bars */}
          <div>
            <h3 className="font-bold text-slate-600 text-sm uppercase tracking-widest mb-3">Skill Profile</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Writing Accuracy', value: sessionAccuracy || (profile?.writingAccuracy || 0), color: 'bg-indigo-500' },
                { label: 'Letter Recognition', value: profile?.letterRecognition || 85, color: 'bg-green-500' },
                { label: 'Word Recognition', value: profile?.wordRecognition || 80, color: 'bg-blue-500' },
                { label: 'Spelling Accuracy', value: profile?.spellingAccuracy || 70, color: 'bg-purple-500' },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">{m.label}</span>
                    <span className="font-bold text-slate-700">{m.value}%</span>
                  </div>
                  <ProgressBar value={m.value} max={100} color={m.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Error patterns */}
          {Object.keys(errorTypes).length > 0 && (
            <div>
              <h3 className="font-bold text-slate-600 text-sm uppercase tracking-widest mb-3">Error Patterns</h3>
              <div className="flex flex-col gap-2">
                {Object.entries(errorTypes).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
                  const cfg = ERROR_LABELS[type] || { icon: '❓', label: type };
                  return (
                    <div key={type} className="flex justify-between items-center bg-red-50 rounded-xl px-4 py-2">
                      <span className="font-semibold text-slate-700">{cfg.icon} {cfg.label}</span>
                      <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-0.5 rounded-full">{count}x</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Level progress */}
          <div>
            <h3 className="font-bold text-slate-600 text-sm uppercase tracking-widest mb-3">Level Progress</h3>
            <div className="flex gap-3">
              {[1, 2, 3].map(lv => {
                const unlocked = profile?.levelsUnlocked?.includes(lv) || lv === 1;
                return (
                  <div key={lv} className={`flex-1 rounded-2xl p-3 text-center border-2 ${
                    lv === currentLevel ? 'border-indigo-400 bg-indigo-50' :
                    unlocked ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div className="text-2xl">{lv === currentLevel ? '📍' : unlocked ? '✅' : '🔒'}</div>
                    <div className="text-sm font-bold text-slate-600">Level {lv}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setStage('grade-select')}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-lg rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all"
          >
            ▶ Start New Session
          </button>
        </div>
      </div>
    );
  }

  // Loading fallback
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="text-6xl animate-bounce mb-4">📝</div>
        <p className="text-slate-400 font-semibold">Loading activities...</p>
      </div>
    </div>
  );
}
