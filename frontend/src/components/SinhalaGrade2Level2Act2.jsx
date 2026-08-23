import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Question Datasets for Level 2 - Activity 2: මැජික් පුවරුවේ වචන ලියමු ──
const LEVEL2_ACT2_ITEMS = [
  {
    id: 1,
    num: 1,
    word: 'පොත',
    meaning: 'Book',
    voiceText: 'පොත යන වචනය ලියන්න.',
    border: 'border-emerald-400',
    bg: 'bg-emerald-50/60',
    badgeBg: 'bg-emerald-600',
    accentColor: '#059669',
    decor: '✏️',
    fontSize: '78'
  },
  {
    id: 2,
    num: 2,
    word: 'සාය',
    meaning: 'Skirt',
    voiceText: 'සාය යන වචනය ලියන්න.',
    border: 'border-sky-400',
    bg: 'bg-sky-50/60',
    badgeBg: 'bg-sky-600',
    accentColor: '#0284C7',
    decor: '🦋',
    fontSize: '78'
  },
  {
    id: 3,
    num: 3,
    word: 'හඳ මාමා',
    meaning: 'Moon Uncle',
    voiceText: 'හඳ මාමා යන වචනය ලියන්න.',
    border: 'border-pink-400',
    bg: 'bg-pink-50/60',
    badgeBg: 'bg-pink-600',
    accentColor: '#DB2777',
    decor: '⭐',
    fontSize: '62'
  },
  {
    id: 4,
    num: 4,
    word: 'කජු',
    meaning: 'Cashew',
    voiceText: 'කජු යන වචනය ලියන්න.',
    border: 'border-amber-400',
    bg: 'bg-amber-50/60',
    badgeBg: 'bg-amber-600',
    accentColor: '#D97706',
    decor: '🚀',
    fontSize: '78'
  },
  {
    id: 5,
    num: 5,
    word: 'ණය',
    meaning: 'Credit / Loan',
    voiceText: 'ණය යන වචනය ලියන්න.',
    border: 'border-purple-400',
    bg: 'bg-purple-50/60',
    badgeBg: 'bg-purple-600',
    accentColor: '#7C3AED',
    decor: '👑',
    fontSize: '78'
  }
];

// ── Web Audio Synthesizer ──
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
    } else if (type === 'incomplete') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
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

// ── Strict Stroke-Skeleton Evaluator for Multi-Character Words ──
function evaluateWordTracingCoverage(canvas, targetWord, fontSize) {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext('2d');

  const refCanvas = document.createElement('canvas');
  refCanvas.width = w;
  refCanvas.height = h;
  const refCtx = refCanvas.getContext('2d');
  refCtx.fillStyle = '#FFFFFF';
  refCtx.fillRect(0, 0, w, h);
  refCtx.strokeStyle = '#000000';
  refCtx.lineWidth = 7;
  refCtx.lineCap = 'round';
  refCtx.lineJoin = 'round';
  refCtx.font = `normal ${fontSize || 78}px "Iskoola Pota", "Noto Sans Sinhala", sans-serif`;
  refCtx.textAlign = 'center';
  refCtx.textBaseline = 'alphabetic';
  refCtx.strokeText(targetWord, w / 2, h / 2 + 22);

  const refData = refCtx.getImageData(0, 0, w, h).data;
  const drawnData = ctx.getImageData(0, 0, w, h).data;

  const refMask = new Uint8Array(w * h);
  const drawnMask = new Uint8Array(w * h);
  let totalRefPixels = 0;
  let totalDrawnPixels = 0;

  let minRefX = w, maxRefX = 0, minRefY = h, maxRefY = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const r = refData[idx * 4];
      const a = drawnData[idx * 4 + 3];

      if (r < 120) {
        refMask[idx] = 1;
        totalRefPixels++;
        if (x < minRefX) minRefX = x;
        if (x > maxRefX) maxRefX = x;
        if (y < minRefY) minRefY = y;
        if (y > maxRefY) maxRefY = y;
      }
      if (a > 30) {
        drawnMask[idx] = 1;
        totalDrawnPixels++;
      }
    }
  }

  if (totalRefPixels === 0 || totalDrawnPixels < 200) {
    return {
      completionPercent: 0,
      accuracyPercent: 0,
      isComplete: false,
      missingReason: 'වචනය සම්පූර්ණයෙන්ම ලියන්න'
    };
  }

  const tolerance = 6;

  // 1. Overall Recall
  let refPixelsCovered = 0;
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const idx = y * w + x;
      if (refMask[idx] === 1) {
        let covered = false;
        const minX = Math.max(0, x - tolerance);
        const maxX = Math.min(w - 1, x + tolerance);
        const minY = Math.max(0, y - tolerance);
        const maxY = Math.min(h - 1, y + tolerance);

        for (let ty = minY; ty <= maxY && !covered; ty += 2) {
          for (let tx = minX; tx <= maxX; tx += 2) {
            if (drawnMask[ty * w + tx] === 1) {
              covered = true;
              break;
            }
          }
        }
        if (covered) refPixelsCovered++;
      }
    }
  }

  // 2. Multi-Zone Check (Divide horizontally by number of characters)
  const charCount = Math.max(2, targetWord.length);
  const stepX = (maxRefX - minRefX) / charCount;
  let allZonesPassed = true;
  let missingZoneIndex = -1;

  for (let i = 0; i < charCount; i++) {
    let zoneRefTotal = 0;
    let zoneRefCovered = 0;
    const x0 = minRefX + i * stepX;
    const x1 = minRefX + (i + 1) * stepX;

    for (let y = minRefY; y <= maxRefY; y += 2) {
      for (let x = Math.floor(x0); x <= Math.ceil(x1); x += 2) {
        const idx = y * w + x;
        if (refMask[idx] === 1) {
          zoneRefTotal++;
          let covered = false;
          const minX = Math.max(0, x - tolerance);
          const maxX = Math.min(w - 1, x + tolerance);
          const minY = Math.max(0, y - tolerance);
          const maxY = Math.min(h - 1, y + tolerance);

          for (let ty = minY; ty <= maxY && !covered; ty += 2) {
            for (let tx = minX; tx <= maxX; tx += 2) {
              if (drawnMask[ty * w + tx] === 1) {
                covered = true;
                break;
              }
            }
          }
          if (covered) zoneRefCovered++;
        }
      }
    }

    if (zoneRefTotal > 15) {
      const ratio = zoneRefCovered / zoneRefTotal;
      if (ratio < 0.65) {
        allZonesPassed = false;
        if (missingZoneIndex === -1) missingZoneIndex = i + 1;
      }
    }
  }

  // 3. Precision Check
  let drawnPixelsOnTarget = 0;
  let strayPixelsCount = 0;

  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const idx = y * w + x;
      if (drawnMask[idx] === 1) {
        let onTarget = false;
        const minX = Math.max(0, x - tolerance);
        const maxX = Math.min(w - 1, x + tolerance);
        const minY = Math.max(0, y - tolerance);
        const maxY = Math.min(h - 1, y + tolerance);

        for (let ty = minY; ty <= maxY && !onTarget; ty += 2) {
          for (let tx = minX; tx <= maxX; tx += 2) {
            if (refMask[ty * w + tx] === 1) {
              onTarget = true;
              break;
            }
          }
        }
        if (onTarget) {
          drawnPixelsOnTarget++;
        } else {
          strayPixelsCount++;
        }
      }
    }
  }

  const sampledRefTotal = Math.ceil(totalRefPixels / 4);
  const sampledDrawnTotal = Math.ceil(totalDrawnPixels / 4);

  const completionPercent = sampledRefTotal > 0 ? Math.min(100, Math.round((refPixelsCovered / sampledRefTotal) * 100)) : 0;
  const accuracyPercent = sampledDrawnTotal > 0 ? Math.min(100, Math.round((drawnPixelsOnTarget / sampledDrawnTotal) * 100)) : 0;

  let isComplete = false;
  let reason = 'වචනය සම්පූර්ණයෙන් ලියන්න';

  if (accuracyPercent < 78 || strayPixelsCount > 45) {
    reason = 'රේඛාවෙන් පිටතට නොයන්න!';
  } else if (!allZonesPassed || completionPercent < 78) {
    reason = missingZoneIndex !== -1 ? `අකුරු අංක ${missingZoneIndex} සම්පූර්ණ කරන්න` : 'වචනය සම්පූර්ණයෙන් ලියන්න';
  } else {
    isComplete = true;
  }

  return {
    completionPercent,
    accuracyPercent,
    isComplete,
    missingReason: reason
  };
}

// ── Single Magic Board Word Slate Component ──
function MagicWordSlate({ item, isDone, onComplete, onIncomplete }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const pathPointsRef = useRef([]);
  const [hasTraced, setHasTraced] = useState(false);
  const [tipMessage, setTipMessage] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasTraced(false);
    pathPointsRef.current = [];
  }, [item.word]);

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

  const handleStart = (e) => {
    e.preventDefault();
    if (isDone) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#16A34A'; // Magic Green

    isDrawingRef.current = true;
    pathPointsRef.current.push(pos);
  };

  const handleMove = (e) => {
    if (!isDrawingRef.current || isDone) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    pathPointsRef.current.push(pos);
  };

  const handleEnd = (e) => {
    if (!isDrawingRef.current) return;
    e?.preventDefault();
    isDrawingRef.current = false;

    const canvas = canvasRef.current;
    if (!canvas || isDone) return;

    if (pathPointsRef.current.length < 25) {
      setTipMessage('වචනය දිගේ ලියන්න! ✏️');
      setTimeout(() => setTipMessage(null), 2500);
      onIncomplete('වචනය සම්පූර්ණයෙන් ලියන්න');
      return;
    }

    const { isComplete, missingReason } = evaluateWordTracingCoverage(canvas, item.word, parseInt(item.fontSize));

    if (!isComplete) {
      setTipMessage(`✏️ ${missingReason}`);
      setTimeout(() => setTipMessage(null), 2500);
      onIncomplete(missingReason);
      return;
    }

    setHasTraced(true);
    onComplete(item);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pathPointsRef.current = [];
    setTipMessage(null);
  };

  const handlePlayVoice = (e) => {
    e.stopPropagation();
    playSound('click');
    speakSinhala(`"${item.word}" යන වචනය ලියන්න.`);
  };

  return (
    <div className={`relative bg-white rounded-3xl p-4 shadow-lg border-4 ${item.border} flex flex-col justify-between transition-all hover:shadow-xl`}>
      
      {/* Slate Header with Number Badge & Voice Button */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${item.badgeBg} text-white flex items-center justify-center font-black text-sm shadow-sm`}>
            {item.num}
          </div>
          <button
            onClick={handlePlayVoice}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <span className="text-sm">🔊</span>
            <span>"{item.word}" යන වචනය ලියන්න.</span>
          </button>
        </div>

        {/* Clear button or decoration */}
        {!isDone && pathPointsRef.current.length > 0 && !hasTraced ? (
          <button
            onClick={handleClear}
            className="text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 px-2 py-0.5 rounded-full border border-red-200 cursor-pointer"
          >
            🧹 මකන්න
          </button>
        ) : (
          <span className="text-2xl">{item.decor}</span>
        )}
      </div>

      {/* Main Tracing Word Blackboard Canvas */}
      <div className="w-full h-36 md:h-40 bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-300 relative flex items-center justify-center overflow-hidden shadow-inner">
        
        {/* Thin Dashed Guideline Word */}
        <svg viewBox="0 0 320 180" className="w-full h-full pointer-events-none select-none">
          <text
            x="160"
            y="112"
            textAnchor="middle"
            fontSize={item.fontSize || '78'}
            fontWeight="normal"
            fontFamily="'Iskoola Pota', 'Noto Sans Sinhala', sans-serif"
            fill="none"
            stroke="#334155"
            strokeWidth="2.5"
            strokeDasharray="5, 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {item.word}
          </text>
        </svg>

        {/* Finger pointer prompt when untouched */}
        {!hasTraced && !isDone && pathPointsRef.current.length === 0 && (
          <div className="absolute bottom-2 left-3 flex items-center gap-1 text-slate-400 text-xs font-bold pointer-events-none animate-pulse">
            <span className="text-lg">👆</span>
            <span>අතින් ලියන්න</span>
          </div>
        )}

        {/* Interactive Drawing Canvas */}
        <canvas
          ref={canvasRef}
          width={320}
          height={180}
          className="absolute inset-0 w-full h-full touch-none z-10 cursor-crosshair"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />

        {/* ✅ Success Stamp in Top-Right */}
        {(hasTraced || isDone) && (
          <div className="absolute top-2 right-2 z-30 animate-bounce">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full shadow border-2 border-white flex items-center justify-center font-black text-base">
              ✓
            </div>
          </div>
        )}

        {/* Feedback Message */}
        {tipMessage && (
          <div className="absolute bottom-2 inset-x-2 text-center bg-amber-500 text-white text-xs font-bold py-1 px-3 rounded-full shadow z-30 animate-bounce">
            {tipMessage}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Grade 2 Level 2 Activity 2 Component ──
export default function SinhalaGrade2Level2Act2({ onExit }) {
  const navigate = useNavigate();

  // Page 1: Items 1, 2, 3, 4 (2x2 grid); Page 2: Item 5
  const [currentPage, setCurrentPage] = useState(0);
  const [score, setScore] = useState(120);
  const [completedItems, setCompletedItems] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const totalPages = 2;
  const pageItems = currentPage === 0 ? LEVEL2_ACT2_ITEMS.slice(0, 4) : LEVEL2_ACT2_ITEMS.slice(4);

  // Play instructions on load
  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala('මැජික් පුවරුවේ ශබ්දය අසලා වචනය ලියන්න.');
    }, 400);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handleSpeakerClick = () => {
    playSound('click');
    speakSinhala('මැජික් පුවරුවේ ශබ්දය අසලා වචනය ලියන්න.');
  };

  const handleSlateCompleted = (item) => {
    playSound('correct');
    setCompletedItems((prev) => ({ ...prev, [item.id]: true }));
    setScore((prev) => prev + 25);
    speakSinhala(`නියමයි! "${item.word}" වචනය නිවැරදියි!`);
  };

  const handleSlateIncomplete = (reason) => {
    playSound('incomplete');
    if (reason && reason.includes('පිටතට')) {
      speakSinhala('අකුරු තුළ පමණක් ලියන්න!');
    } else {
      speakSinhala('වචනය සම්පූර්ණයෙන්ම ලියන්න!');
    }
  };

  const handleNext = () => {
    playSound('click');
    if (currentPage + 1 < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-300 via-purple-100 to-pink-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center">
          <div className="text-6xl mb-2 animate-bounce">🏆</div>
          <h1 className="text-4xl font-extrabold text-purple-700 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-6">ඔබ Level 2 දෙවන අභ්‍යාසය සාර්ථකව නිම කළා!</p>
          <div className="text-4xl font-black text-purple-600 mb-8">ලකුණු: {score}</div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/module/sinhala/grade2-level2-act3')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🚂 ඊළඟ අභ්‍යාසය (Activity 3: අකුරු දුම්රිය)</span>
              <span className="text-2xl">➔</span>
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => { setCurrentPage(0); setCompletedItems({}); setIsFinished(false); }}
                className="flex-1 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-lg rounded-2xl shadow-md cursor-pointer"
              >
                🔄 නැවත කරන්න
              </button>
              <button
                onClick={onExit || (() => navigate('/module/sinhala/grade2'))}
                className="flex-1 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-lg rounded-2xl shadow-md cursor-pointer"
              >
                🏠 Grade 2 Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200 font-sinhala select-none relative overflow-x-hidden pb-6">
      
      {/* Background Decor */}
      <div className="absolute top-2 left-6 text-7xl opacity-90 pointer-events-none">✨</div>
      <div className="absolute top-4 right-20 text-4xl opacity-80 pointer-events-none animate-pulse">🪄</div>

      <div className="max-w-5xl mx-auto px-4 py-3 relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* ── TOP HEADER BAR ── */}
        <div className="flex items-center justify-between gap-3 mb-2">
          
          {/* Home/Back Button */}
          <button
            onClick={onExit || (() => navigate('/module/sinhala/grade2'))}
            className="w-12 h-12 bg-amber-400 hover:bg-amber-500 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="ආපසු"
          >
            🏠
          </button>

          {/* Center Magic Board Word Writing Title */}
          <div className="flex-1 max-w-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 text-white py-2.5 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-wide drop-shadow flex items-center justify-center gap-2">
              <span>✨</span>
              <span>Activity 2: මැජික් පුවරුවේ වචන ලියමු</span>
              <span>✨</span>
            </h1>
          </div>

          {/* Right Speaker Button */}
          <button
            onClick={handleSpeakerClick}
            className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="හඬ අසන්න"
          >
            🔊
          </button>
        </div>

        {/* ── SPEECH BUBBLE INSTRUCTION BANNER WITH SMILING STAR ── */}
        <div className="relative max-w-3xl mx-auto w-full my-2">
          <div className="bg-white/95 backdrop-blur-md rounded-full py-2.5 px-6 shadow-md border-2 border-dashed border-purple-300 flex items-center gap-3">
            <button
              onClick={handleSpeakerClick}
              className="w-9 h-9 bg-purple-600 hover:bg-purple-700 active:scale-90 text-white rounded-full flex items-center justify-center text-lg shadow-sm flex-shrink-0 cursor-pointer"
            >
              🔊
            </button>
            <p className="text-lg md:text-xl font-bold text-slate-800">
              <span className="text-purple-700 font-extrabold">ශබ්දය අසලා</span> වචනය <span className="text-emerald-600 font-extrabold underline">ලියන්න.</span>
            </p>
          </div>

          {/* Smiling Star Mascot with Wand */}
          <div className="absolute -top-6 -right-6 md:-right-10 pointer-events-none">
            <div className="text-6xl drop-shadow-lg animate-bounce">
              ⭐
            </div>
            <div className="absolute -bottom-1 -left-2 text-2xl">🪄</div>
          </div>
        </div>

        {/* ── 2x2 GRID OF MAGIC BOARD WORD SLATES ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 my-auto">
          {pageItems.map((item) => (
            <MagicWordSlate
              key={item.id}
              item={item}
              isDone={completedItems[item.id]}
              onComplete={handleSlateCompleted}
              onIncomplete={handleSlateIncomplete}
            />
          ))}
        </div>

        {/* ── BOTTOM NAVIGATION BAR ── */}
        <div className="flex items-center justify-between mt-3 gap-4">
          
          {/* Trophy Score Pill */}
          <div className="bg-purple-700 text-yellow-300 px-6 py-2 rounded-full font-black text-lg shadow-lg border-2 border-white flex items-center gap-2">
            <span>🏆</span>
            <span>{score}</span>
            <span className="text-sm text-white">⭐</span>
          </div>

          {/* Pagination Dots */}
          <div className="bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full shadow-md border-2 border-slate-200 flex items-center gap-2">
            <span className="text-yellow-400 text-lg">⭐</span>
            {[...Array(totalPages)].map((_, i) => (
              <span
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all ${
                  i === currentPage ? 'bg-emerald-500 scale-125' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Complete / Next Button */}
          <button
            onClick={handleNext}
            className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-black text-lg shadow-lg border-2 border-white flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>✓ සම්පූර්ණයි!</span>
            <span className="text-xl">❯❯</span>
          </button>
        </div>
      </div>
    </div>
  );
}
