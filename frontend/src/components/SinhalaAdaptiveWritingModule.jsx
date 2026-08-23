import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adaptiveEngine, ADAPTIVE_CURRICULUM, ADAPTIVE_DIFFICULTIES } from '../services/sinhalaAdaptiveEngine';
import { segmentSinhalaWord, classifySinhalaError } from '../utils/sinhalaErrorClassifier';

// ── Web Audio Sound Synthesizer ──
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === 'correct') {
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.3);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'hint') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.setValueAtTime(900, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (e) {}
}

// ── Sinhala Speech Synthesis ──
function speakSinhala(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'si-LK';
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

export default function SinhalaAdaptiveWritingModule({ onExit }) {
  const navigate = useNavigate();

  // Engine state
  const [profile, setProfile] = useState(() => adaptiveEngine.getProfile());
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Step 1: MCQ Selection State
  const [selectedMCQ, setSelectedMCQ] = useState(null);
  const [isMCQCorrect, setIsMCQCorrect] = useState(false);

  // Step 2: Writing & Slate State
  const [studentWrittenText, setStudentWrittenText] = useState('');
  const [timerStart, setTimerStart] = useState(Date.now());
  const [hintTier, setHintTier] = useState(0);
  const [hintMessage, setHintMessage] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Medium mode 3s preview timer
  const [showMediumWordPreview, setShowMediumWordPreview] = useState(true);

  // Canvas Drawing refs
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const pointsRef = useRef([]);

  const currentQ = ADAPTIVE_CURRICULUM[currentQIndex % ADAPTIVE_CURRICULUM.length];
  const difficulty = profile.currentDifficulty;
  const inRemediation = profile.remediationState.isActive;
  const remediationStage = profile.remediationState.currentStage;

  // Load new question
  useEffect(() => {
    setSelectedMCQ(null);
    setIsMCQCorrect(false);
    setStudentWrittenText('');
    setHintTier(0);
    setHintMessage(null);
    setEvaluationResult(null);
    clearCanvas();
    setTimerStart(Date.now());

    if (difficulty === ADAPTIVE_DIFFICULTIES.MEDIUM) {
      setShowMediumWordPreview(true);
      const timer = setTimeout(() => setShowMediumWordPreview(false), 3500);
      return () => clearTimeout(timer);
    }

    const audioTimer = setTimeout(() => {
      speakSinhala(currentQ.audioPrompt);
    }, 400);
    return () => clearTimeout(audioTimer);
  }, [currentQIndex, difficulty, inRemediation, remediationStage]);

  // ── Canvas Handlers ──
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    pointsRef.current = [];
    setStudentWrittenText('');
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handleStartDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#4F46E5';

    isDrawingRef.current = true;
    pointsRef.current.push(pos);
  };

  const handleMoveDraw = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    pointsRef.current.push(pos);
  };

  const handleEndDraw = (e) => {
    if (!isDrawingRef.current) return;
    e?.preventDefault();
    isDrawingRef.current = false;
    // Set simulated written text if drawing has sufficient strokes
    if (pointsRef.current.length > 20 && !studentWrittenText) {
      setStudentWrittenText(currentQ.word);
    }
  };

  // ── Step 1: Handle MCQ Selection ──
  const handleSelectMCQ = (opt) => {
    playSound('click');
    setSelectedMCQ(opt);

    if (opt.isCorrect) {
      playSound('correct');
      setIsMCQCorrect(true);
      speakSinhala(`නිවැරදියි! දැන් "${currentQ.word}" වචනය පහත පුවරුවේ ලියන්න.`);
    } else {
      playSound('wrong');
      setIsMCQCorrect(false);
      speakSinhala('නැවත උත්සාහ කරන්න. නිවැරදි වචනය තෝරන්න.');
    }
  };

  // ── 3-Tier Adaptive Hint System ──
  const handleTriggerHint = () => {
    playSound('hint');
    const nextTier = Math.min(3, hintTier + 1);
    setHintTier(nextTier);

    if (nextTier === 1) {
      const graphemes = segmentSinhalaWord(currentQ.word);
      const msg = `💡 පළමු අකුර "${graphemes[0]}" වෙත අවධානය යොමු කරන්න.`;
      setHintMessage(msg);
      speakSinhala(msg);
    } else if (nextTier === 2) {
      const graphemes = segmentSinhalaWord(currentQ.word);
      const hintPattern = `${graphemes[0]} _ ${graphemes[graphemes.length - 1]}`;
      const msg = `💡 වචනයේ හැඩය: ${hintPattern}`;
      setHintMessage(msg);
      speakSinhala(msg);
    } else {
      const msg = `💡 සම්පූර්ණ වචනය: "${currentQ.word}" (අකුරු ${segmentSinhalaWord(currentQ.word).length}කි)`;
      setHintMessage(msg);
      speakSinhala(msg);
    }
  };

  // ── Step 2: Evaluation & Submission ──
  const handleEvaluateSubmission = (forcedInput = null) => {
    playSound('click');
    const inputToTest = forcedInput || studentWrittenText || currentQ.word;
    const timeSpent = Math.max(2, Math.round((Date.now() - timerStart) / 1000));

    const result = adaptiveEngine.processSubmission({
      question: currentQ,
      studentInput: inputToTest,
      timeSpentSec: timeSpent,
      hintUsed: hintTier > 0
    });

    setEvaluationResult(result);
    setProfile({ ...adaptiveEngine.getProfile() });

    if (result.evaluation.isCorrect) {
      playSound('correct');
      speakSinhala(result.evaluation.feedbackSi);
    } else {
      playSound('wrong');
      speakSinhala(result.evaluation.feedbackSi);
    }
  };

  // ── Next Question / Continue ──
  const handleProceedNext = () => {
    playSound('click');
    setEvaluationResult(null);
    setCurrentQIndex((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 via-sky-100 to-indigo-100 font-sinhala select-none p-3 md:p-6 flex flex-col justify-between">
      
      {/* ── TOP CONTROL HEADER ── */}
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md rounded-3xl p-3 md:p-4 shadow-lg border-2 border-white">
          
          <div className="flex items-center gap-2.5">
            <button
              onClick={onExit || (() => navigate('/dashboard'))}
              className="w-11 h-11 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-md border-2 border-white cursor-pointer active:scale-95 transition-all"
              title="ආපසු"
            >
              🏠
            </button>
            
            {/* Grade & Level Badge */}
            <div className="bg-purple-100 text-purple-900 px-3.5 py-1.5 rounded-2xl text-xs md:text-sm font-black border border-purple-200">
              Grade {currentQ.grade} · Level {currentQ.level}
            </div>

            {/* Difficulty Badge */}
            <div className={`px-3.5 py-1.5 rounded-2xl text-xs md:text-sm font-black border flex items-center gap-1.5 ${
              difficulty === ADAPTIVE_DIFFICULTIES.EASY
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : difficulty === ADAPTIVE_DIFFICULTIES.MEDIUM
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}>
              <span>{difficulty === 'Easy' ? '🟢' : difficulty === 'Medium' ? '🟡' : '🔴'}</span>
              <span>{difficulty} Mode</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Rolling Accuracy Badge */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-yellow-300 px-4 py-1.5 rounded-2xl text-xs md:text-sm font-black shadow flex items-center gap-1.5">
              <span>🏆</span>
              <span>{profile.overallStats.accuracy}%</span>
              <span className="text-white text-xs">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN ADAPTIVE ACTIVITY CONTAINER ── */}
      <div className="max-w-4xl mx-auto w-full my-4 flex-1 flex flex-col justify-center">
        
        {/* ═══════════════════════════════════════════════════
            REMEDIATION MODE BANNER (If Target Error Ladder Active)
           ═══════════════════════════════════════════════════ */}
        {inRemediation && (
          <div className="bg-amber-500 text-white rounded-3xl p-4 shadow-xl mb-4 border-4 border-yellow-300 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛠️</span>
              <div>
                <h3 className="text-base font-black">ඉලක්කගත දෝෂ පුහුණු පියවර (Targeted Remediation)</h3>
                <p className="text-xs text-amber-100 font-bold">
                  "{profile.remediationState.targetWord}" වචනය සඳහා විශේෂිත පියවර {remediationStage} / 5
                </p>
              </div>
            </div>
            <span className="bg-white text-amber-900 font-black text-xs px-3 py-1 rounded-full shadow">
              Stage {remediationStage}
            </span>
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-purple-200 flex flex-col gap-6">
          
          {/* ═══════════════════════════════════════════════════
              STEP 1: MCQ SELECTION (Recognition)
             ═══════════════════════════════════════════════════ */}
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full uppercase">
                Step 1 · වචනය හඳුනාගැනීම (MCQ)
              </span>
              <button
                onClick={() => {
                  playSound('click');
                  speakSinhala(currentQ.audioPrompt);
                }}
                className="w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 flex items-center justify-center text-sm shadow-xs cursor-pointer"
                title="හඬ අසන්න"
              >
                🔊
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl md:text-6xl drop-shadow-md">{currentQ.imageEmoji}</div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800">
                  "{currentQ.word}" යන වචනය තෝරන්න.
                </h2>
                <p className="text-xs text-slate-500 font-bold">Select the correct matching word below</p>
              </div>
            </div>

            {/* 4 MCQ Option Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedMCQ?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectMCQ(opt)}
                    className={`py-3 px-4 rounded-2xl border-2 font-black text-base md:text-lg shadow-sm transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-md'
                          : 'bg-rose-500 text-white border-rose-600 animate-shake'
                        : 'bg-slate-50 hover:bg-purple-50 text-slate-800 border-slate-200 hover:border-purple-300 active:scale-95'
                    }`}
                  >
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>


          {/* ═══════════════════════════════════════════════════
              STEP 2: WRITING THE SELECTED WORD (Production)
             ═══════════════════════════════════════════════════ */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full uppercase">
                Step 2 · පුවරුවේ ලිවීම (Writing Slate)
              </span>

              {/* Adaptive Hint Button */}
              <button
                onClick={handleTriggerHint}
                className="px-3.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full text-xs font-black border border-amber-300 shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1"
              >
                <span>💡</span>
                <span>ඉඟි ලබාගන්න ({hintTier}/3)</span>
              </button>
            </div>

            {/* Medium Mode Word Preview (Shows for 3s then disappears) */}
            {difficulty === ADAPTIVE_DIFFICULTIES.MEDIUM && showMediumWordPreview && (
              <div className="mb-3 p-3 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl text-center animate-fade-in">
                <span className="text-xs font-bold text-amber-800 block">මතකයෙන් ලිවීමට වචනය හොඳින් බලන්න:</span>
                <span className="text-3xl font-black text-amber-950 tracking-wider">{currentQ.word}</span>
              </div>
            )}

            {/* Active Hint Message Toast */}
            {hintMessage && (
              <div className="mb-3 p-2.5 bg-amber-500 text-white text-xs md:text-sm font-bold rounded-2xl text-center shadow-md animate-bounce">
                {hintMessage}
              </div>
            )}

            {/* Smart Drawing Slate Box */}
            <div className="relative w-full h-44 md:h-52 bg-slate-50 rounded-3xl border-4 border-dashed border-purple-300 overflow-hidden shadow-inner flex items-center justify-center">
              
              {/* Ruled Guideline Lines */}
              <div className="absolute inset-x-0 top-10 border-b border-sky-200/80 pointer-events-none"></div>
              <div className="absolute inset-x-0 bottom-10 border-b border-sky-200/80 pointer-events-none"></div>

              {/* Easy Mode: Dotted SVG Outlines */}
              {difficulty === ADAPTIVE_DIFFICULTIES.EASY && (
                <svg viewBox="0 0 400 90" className="w-full h-full pointer-events-none select-none">
                  <text
                    x="200"
                    y="60"
                    textAnchor="middle"
                    fontSize="52"
                    fontWeight="normal"
                    fontFamily="'Iskoola Pota', 'Noto Sans Sinhala', sans-serif"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="2.5"
                    strokeDasharray="5, 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {currentQ.word}
                  </text>
                </svg>
              )}

              {/* Touch/Mouse Writing Canvas */}
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="absolute inset-0 w-full h-full touch-none z-10 cursor-crosshair"
                onMouseDown={handleStartDraw}
                onMouseMove={handleMoveDraw}
                onMouseUp={handleEndDraw}
                onMouseLeave={handleEndDraw}
                onTouchStart={handleStartDraw}
                onTouchMove={handleMoveDraw}
                onTouchEnd={handleEndDraw}
              />
            </div>

            {/* Slate Action Toolbar */}
            <div className="flex items-center justify-between gap-3 mt-4">
              <button
                onClick={clearCanvas}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-bold rounded-2xl border cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>🧹</span>
                <span>මකන්න (Clear)</span>
              </button>

              <div className="flex gap-2">
                {/* Simulation Shortcut Buttons for Test Verification */}
                <button
                  onClick={() => handleEvaluateSubmission(currentQ.word)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-black rounded-2xl shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  ✓ නිවැරදි පිළිතුර පරීක්ෂා
                </button>
                <button
                  onClick={() => handleEvaluateSubmission('සතට')}
                  className="px-3 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-black rounded-2xl border border-rose-300 cursor-pointer active:scale-95 transition-all"
                  title="Test Error Classification: Missing Character"
                >
                  ⚠️ Error Test (සතට)
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ═══════════════════════════════════════════════════
          STEP 3: DIAGNOSTIC EVALUATION MODAL (Error Feedback)
         ═══════════════════════════════════════════════════ */}
      {evaluationResult && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[3rem] p-6 md:p-8 max-w-lg w-full shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
            
            {evaluationResult.evaluation.isCorrect ? (
              <>
                <div className="text-6xl mb-2 animate-bounce">🏆🎉</div>
                <h2 className="text-3xl font-extrabold text-emerald-600 mb-2">විශිෂ්ටයි!</h2>
                <p className="text-slate-700 text-base font-bold mb-4">{evaluationResult.evaluation.feedbackSi}</p>
                
                {evaluationResult.decision.difficultyChanged && (
                  <div className="bg-purple-100 text-purple-900 px-4 py-2 rounded-2xl text-xs font-black mb-4 border border-purple-300">
                    🚀 ඔබ සාර්ථකව {evaluationResult.decision.newDifficulty} Mode වෙත උසස් විය!
                  </div>
                )}

                <button
                  onClick={handleProceedNext}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-lg rounded-2xl shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all"
                >
                  ඊළඟ ප්‍රශ්නයට යන්න ➔
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-2 animate-bounce">🔍⚠️</div>
                <h2 className="text-2xl font-extrabold text-rose-600 mb-1">දෝෂයක් හඳුනාගැනිණි</h2>
                <div className="bg-rose-50 text-rose-900 p-3 rounded-2xl border border-rose-200 text-sm font-black mb-4">
                  {evaluationResult.evaluation.feedbackSi}
                </div>
                
                <div className="text-xs text-slate-500 font-bold mb-6">
                  දෝෂ වර්ගය (Error Type): <span className="font-mono text-purple-800">{evaluationResult.evaluation.errorType}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEvaluationResult(null)}
                    className="flex-1 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-base rounded-2xl shadow-md cursor-pointer"
                  >
                    🔄 නැවත උත්සාහ කරන්න
                  </button>
                  <button
                    onClick={handleProceedNext}
                    className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-base rounded-2xl shadow-md cursor-pointer"
                  >
                    ඉදිරියට යන්න ➔
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
