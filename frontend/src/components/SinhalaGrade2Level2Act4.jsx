import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Question Datasets for Level 2 - Activity 4: රූපයට අදාල ගැලපෙන වචනය මත ලියමු ──
const LEVEL2_ACT4_ITEMS = [
  {
    id: 1,
    imageType: 'butterfly',
    imageEmoji: '🦋',
    options: [
      { id: 'opt1', num: 1, word: 'සමනලයා', isCorrect: true, badgeBg: 'bg-pink-500', border: 'border-pink-300', flowerColor: '#EC4899', fontSize: 60 },
      { id: 'opt2', num: 2, word: 'හාවා', isCorrect: false, badgeBg: 'bg-sky-500', border: 'border-sky-300', flowerColor: '#0284C7', fontSize: 60 },
      { id: 'opt3', num: 3, word: 'කුරුල්ලා', isCorrect: false, badgeBg: 'bg-emerald-500', border: 'border-emerald-300', flowerColor: '#10B981', fontSize: 56 },
    ],
    targetWord: 'සමනලයා',
    audioInstruction: 'සමනලයාගේ රූපයට ගැලපෙන වචනය තෝරා එය මත ලියන්න.'
  },
  {
    id: 2,
    imageType: 'milk',
    imageEmoji: '🥛',
    options: [
      { id: 'opt1', num: 1, word: 'කිරි', isCorrect: true, badgeBg: 'bg-pink-500', border: 'border-pink-300', flowerColor: '#EC4899', fontSize: 64 },
      { id: 'opt2', num: 2, word: 'වතුර', isCorrect: false, badgeBg: 'bg-sky-500', border: 'border-sky-300', flowerColor: '#0284C7', fontSize: 64 },
      { id: 'opt3', num: 3, word: 'තේ', isCorrect: false, badgeBg: 'bg-emerald-500', border: 'border-emerald-300', flowerColor: '#10B981', fontSize: 64 },
    ],
    targetWord: 'කිරි',
    audioInstruction: 'කිරි වීදුරුවේ රූපයට ගැලපෙන වචනය තෝරා එය මත ලියන්න.'
  },
  {
    id: 3,
    imageType: 'chair',
    imageEmoji: '🪑',
    options: [
      { id: 'opt1', num: 1, word: 'පොත', isCorrect: false, badgeBg: 'bg-pink-500', border: 'border-pink-300', flowerColor: '#EC4899', fontSize: 64 },
      { id: 'opt2', num: 2, word: 'ගස', isCorrect: false, badgeBg: 'bg-sky-500', border: 'border-sky-300', flowerColor: '#0284C7', fontSize: 64 },
      { id: 'opt3', num: 3, word: 'පුටුව', isCorrect: true, badgeBg: 'bg-emerald-500', border: 'border-emerald-300', flowerColor: '#10B981', fontSize: 64 },
    ],
    targetWord: 'පුටුව',
    audioInstruction: 'පුටුවේ රූපයට ගැලපෙන වචනය තෝරා එය මත ලියන්න.'
  },
  {
    id: 4,
    imageType: 'fish',
    imageEmoji: '🐟',
    options: [
      { id: 'opt1', num: 1, word: 'මාළුවා', isCorrect: true, badgeBg: 'bg-pink-500', border: 'border-pink-300', flowerColor: '#EC4899', fontSize: 62 },
      { id: 'opt2', num: 2, word: 'කකුළුවා', isCorrect: false, badgeBg: 'bg-sky-500', border: 'border-sky-300', flowerColor: '#0284C7', fontSize: 58 },
      { id: 'opt3', num: 3, word: 'මුහුදු මල', isCorrect: false, badgeBg: 'bg-emerald-500', border: 'border-emerald-300', flowerColor: '#10B981', fontSize: 56 },
    ],
    targetWord: 'මාළුවා',
    audioInstruction: 'මාළුවාගේ රූපයට ගැලපෙන වචනය තෝරා එය මත ලියන්න.'
  },
  {
    id: 5,
    imageType: 'bread',
    imageEmoji: '🍞',
    options: [
      { id: 'opt1', num: 1, word: 'බත්', isCorrect: false, badgeBg: 'bg-pink-500', border: 'border-pink-300', flowerColor: '#EC4899', fontSize: 64 },
      { id: 'opt2', num: 2, word: 'පාන්', isCorrect: true, badgeBg: 'bg-sky-500', border: 'border-sky-300', flowerColor: '#0284C7', fontSize: 64 },
      { id: 'opt3', num: 3, word: 'බිස්කට්', isCorrect: false, badgeBg: 'bg-emerald-500', border: 'border-emerald-300', flowerColor: '#10B981', fontSize: 58 },
    ],
    targetWord: 'පාන්',
    audioInstruction: 'පාන් ගෙඩියේ රූපයට ගැලපෙන වචනය තෝරා එය මත ලියන්න.'
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
function evaluateWordStripTracing(canvas, targetWord, fontSize) {
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
  refCtx.font = `normal ${fontSize || 60}px "Iskoola Pota", "Noto Sans Sinhala", sans-serif`;
  refCtx.textAlign = 'center';
  refCtx.textBaseline = 'alphabetic';
  refCtx.strokeText(targetWord, w / 2, h / 2 + 18);

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

  if (totalRefPixels === 0 || totalDrawnPixels < 180) {
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

  // 2. Multi-Zone Recall
  const charCount = Math.max(2, targetWord.length);
  const stepX = (maxRefX - minRefX) / charCount;
  let allZonesPassed = true;

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

  if (accuracyPercent < 78 || strayPixelsCount > 40) {
    reason = 'රේඛාවෙන් පිටතට නොයන්න!';
  } else if (!allZonesPassed || completionPercent < 78) {
    reason = 'වචනය සම්පූර්ණයෙන් ලියන්න';
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

// ── Single Tracing Word Option Strip (Matches Screenshot 2) ──
function WordOptionStrip({
  option,
  isTargetWord,
  isParentCompleted,
  onComplete,
  onWrong,
  onIncomplete
}) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const pathPointsRef = useRef([]);
  const [hasTraced, setHasTraced] = useState(false);
  const [shake, setShake] = useState(false);
  const [tipMessage, setTipMessage] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasTraced(false);
    pathPointsRef.current = [];
  }, [option.word]);

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
    if (isParentCompleted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isTargetWord ? '#16A34A' : '#DC2626';

    isDrawingRef.current = true;
    pathPointsRef.current.push(pos);
  };

  const handleMove = (e) => {
    if (!isDrawingRef.current || isParentCompleted) return;
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
    if (!canvas || isParentCompleted) return;

    if (pathPointsRef.current.length < 20) {
      setTipMessage('වචනය දිගේ ලියන්න! ✏️');
      setTimeout(() => setTipMessage(null), 2500);
      onIncomplete('වචනය සම්පූර්ණයෙන් ලියන්න');
      return;
    }

    const { isComplete, missingReason } = evaluateWordStripTracing(canvas, option.word, option.fontSize);

    if (!isComplete) {
      setTipMessage(`✏️ ${missingReason}`);
      setTimeout(() => setTipMessage(null), 2500);
      onIncomplete(missingReason);
      return;
    }

    if (isTargetWord) {
      setHasTraced(true);
      onComplete(option);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      onWrong(option.word);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pathPointsRef.current = [];
    setTipMessage(null);
  };

  return (
    <div
      className={`flex items-center gap-3.5 w-full transition-all ${shake ? 'animate-bounce' : ''}`}
    >
      {/* Flower Number Badge on Left */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${option.badgeBg} text-white flex items-center justify-center font-black text-xl shadow-md ring-4 ring-yellow-300`}
        >
          {option.num}
        </div>
      </div>

      {/* Dotted Tracing Box Strip */}
      <div
        className={`flex-1 h-20 md:h-22 bg-white rounded-3xl border-3 border-dashed relative flex items-center justify-center overflow-hidden transition-all shadow-xs ${
          hasTraced
            ? 'bg-emerald-50 border-emerald-500 shadow-md'
            : option.border
        }`}
      >
        {/* Thin Dashed Guideline Text */}
        <svg viewBox="0 0 360 80" className="w-full h-full pointer-events-none select-none">
          <text
            x="180"
            y="54"
            textAnchor="middle"
            fontSize={option.fontSize || 60}
            fontWeight="normal"
            fontFamily="'Iskoola Pota', 'Noto Sans Sinhala', sans-serif"
            fill="none"
            stroke="#475569"
            strokeWidth="2.5"
            strokeDasharray="5, 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {option.word}
          </text>
        </svg>

        {/* Tracing Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={360}
          height={80}
          className="absolute inset-0 w-full h-full touch-none z-10 cursor-crosshair"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />

        {/* ✅ Success Stamp */}
        {hasTraced && (
          <div className="absolute top-2 right-3 z-30 animate-bounce">
            <div className="w-8 h-8 bg-emerald-500 text-white rounded-full shadow border-2 border-white flex items-center justify-center font-black text-base">
              ✓
            </div>
          </div>
        )}

        {/* Tip Message */}
        {tipMessage && (
          <div className="absolute bottom-1 inset-x-2 text-center bg-amber-500 text-white text-xs font-bold py-0.5 px-2 rounded-full shadow z-30 animate-bounce">
            {tipMessage}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Illustration Display Box ──
function IllustrationView({ type, emoji }) {
  if (type === 'butterfly') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-amber-100 via-orange-50 to-pink-100 rounded-3xl flex items-center justify-center p-4 relative overflow-hidden shadow-inner border-4 border-amber-200">
        <div className="text-8xl md:text-9xl drop-shadow-lg transform hover:scale-105 transition-transform animate-pulse select-none">
          🦋
        </div>
      </div>
    );
  }

  if (type === 'milk') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-sky-100 via-blue-50 to-emerald-100 rounded-3xl flex items-center justify-center p-4 relative overflow-hidden shadow-inner border-4 border-sky-200">
        <div className="text-8xl md:text-9xl drop-shadow-lg transform hover:scale-105 transition-transform select-none">
          🥛
        </div>
      </div>
    );
  }

  if (type === 'chair') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-amber-100 via-yellow-50 to-emerald-100 rounded-3xl flex items-center justify-center p-4 relative overflow-hidden shadow-inner border-4 border-amber-200">
        <div className="text-8xl md:text-9xl drop-shadow-lg transform hover:scale-105 transition-transform select-none">
          🪑
        </div>
      </div>
    );
  }

  if (type === 'fish') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-cyan-100 via-sky-50 to-blue-200 rounded-3xl flex items-center justify-center p-4 relative overflow-hidden shadow-inner border-4 border-cyan-200">
        <div className="text-8xl md:text-9xl drop-shadow-lg transform hover:scale-105 transition-transform select-none animate-bounce">
          🐟
        </div>
      </div>
    );
  }

  // Bread
  return (
    <div className="w-full h-full bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 rounded-3xl flex items-center justify-center p-4 relative overflow-hidden shadow-inner border-4 border-amber-200">
      <div className="text-8xl md:text-9xl drop-shadow-lg transform hover:scale-105 transition-transform select-none">
        🍞
      </div>
    </div>
  );
}

// ── Main Grade 2 Level 2 Activity 4 Component ──
export default function SinhalaGrade2Level2Act4({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(120);
  const [completedItems, setCompletedItems] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = LEVEL2_ACT4_ITEMS[currentIndex];
  const isCurrentDone = completedItems[currentItem.id];

  // Play instructions on change
  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala(currentItem.audioInstruction);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleSpeakerClick = () => {
    playSound('click');
    speakSinhala(currentItem.audioInstruction);
  };

  const handleStripCompleted = (opt) => {
    playSound('correct');
    setCompletedItems((prev) => ({ ...prev, [currentItem.id]: true }));
    setScore((prev) => prev + 25);
    speakSinhala(`විශිෂ්ටයි! "${opt.word}" වචනය නිවැරදියි!`);
  };

  const handleStripWrong = (word) => {
    playSound('wrong');
    speakSinhala('නැවත උත්සාහ කරන්න. රූපයට ගැලපෙන වචනය තෝරා ලියන්න.');
  };

  const handleStripIncomplete = (reason) => {
    playSound('incomplete');
    if (reason && reason.includes('පිටතට')) {
      speakSinhala('අකුරු තුළ පමණක් ලියන්න!');
    } else {
      speakSinhala('වචනය සම්පූර්ණයෙන්ම ලියන්න!');
    }
  };

  const handleReset = () => {
    playSound('click');
    setCompletedItems((prev) => ({ ...prev, [currentItem.id]: false }));
    // Force re-render key
    setCurrentIndex((prev) => prev);
  };

  const handleNext = () => {
    playSound('click');
    if (currentIndex + 1 < LEVEL2_ACT4_ITEMS.length) {
      setCurrentIndex((prev) => prev + 1);
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
          <p className="text-slate-600 text-lg mb-6">ඔබ Level 2 සිව්වන අභ්‍යාසය සාර්ථකව නිම කළා!</p>
          <div className="text-4xl font-black text-purple-600 mb-8">ලකුණු: {score}</div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/module/sinhala/grade2-level2-act5')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🧺 ඊළඟ අභ්‍යාසය (Activity 5: Word Basket)</span>
              <span className="text-2xl">➔</span>
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setCompletedItems({});
                  setIsFinished(false);
                }}
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
      <div className="absolute top-2 right-10 text-6xl opacity-80 pointer-events-none">☁️</div>
      <div className="absolute top-6 left-12 text-6xl opacity-80 pointer-events-none">☁️</div>

      <div className="max-w-5xl mx-auto px-4 py-3 relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* ── TOP HEADER BAR (Matches Screenshot 2) ── */}
        <div className="flex items-center justify-between gap-3 mb-2">
          
          {/* Back Button (Orange Circle) */}
          <button
            onClick={onExit || (() => navigate('/module/sinhala/grade2'))}
            className="w-12 h-12 bg-amber-400 hover:bg-amber-500 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="ආපසු"
          >
            🏠
          </button>

          {/* Center Activity Title Pill */}
          <div className="flex-1 max-w-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 text-white py-2.5 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-lg md:text-xl font-extrabold tracking-wide drop-shadow flex items-center justify-center gap-2">
              <span>📝</span>
              <span>Activity 4: රූපයට අදාල ගැලපෙන වචනය මත ලියමු</span>
            </h1>
          </div>

          {/* Right Speaker Button (Green Circle) */}
          <button
            onClick={handleSpeakerClick}
            className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="හඬ අසන්න"
          >
            🔊
          </button>
        </div>

        {/* ── SUB-INSTRUCTION BANNER ── */}
        <div className="relative max-w-3xl mx-auto w-full my-2">
          <div className="bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-dashed border-sky-300 flex items-center gap-3">
            <button
              onClick={handleSpeakerClick}
              className="w-9 h-9 bg-purple-600 hover:bg-purple-700 active:scale-90 text-white rounded-full flex items-center justify-center text-lg shadow-sm flex-shrink-0 cursor-pointer"
            >
              🔊
            </button>
            <p className="text-base md:text-lg font-bold text-slate-800">
              රූපයට ගැලපෙන වචනය දක්වා ඇති <span className="text-emerald-600 font-extrabold underline">ලියැවිලි මත ලියන්න.</span>
            </p>
          </div>
        </div>

        {/* ── MAIN WHITEBOARD CARD (Matches Screenshot 2) ── */}
        <div className="bg-white rounded-[2.5rem] p-5 md:p-7 shadow-2xl border-8 border-white/80 my-auto flex flex-col md:flex-row items-center gap-6">
          
          {/* Left Illustration Box */}
          <div className="w-full md:w-72 h-64 md:h-80 flex-shrink-0">
            <IllustrationView type={currentItem.imageType} emoji={currentItem.imageEmoji} />
          </div>

          {/* Right 3 Tracing Option Strips */}
          <div className="flex-1 flex flex-col gap-4 w-full">
            {currentItem.options.map((opt) => (
              <WordOptionStrip
                key={opt.id + currentIndex}
                option={opt}
                isTargetWord={opt.isCorrect}
                isParentCompleted={isCurrentDone}
                onComplete={handleStripCompleted}
                onWrong={handleStripWrong}
                onIncomplete={handleStripIncomplete}
              />
            ))}
          </div>
        </div>

        {/* ── BOTTOM BAR (Matches Screenshot 2) ── */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-3 gap-3">
          
          {/* Left: Mascot with Speech Bubble */}
          <div className="flex items-center gap-3">
            <div className="text-4xl transform -scale-x-100 drop-shadow-md">🐿️</div>
            <div className="bg-amber-100/90 text-amber-900 border border-amber-300 px-4 py-2 rounded-2xl text-xs md:text-sm font-extrabold shadow-sm flex items-center gap-2">
              <button
                onClick={handleSpeakerClick}
                className="text-purple-700 hover:scale-110 cursor-pointer"
              >
                🔊
              </button>
              <span>හොඳයි! නිවැරදි වචනය ලිවීමට උත්සාහ කරන්න. ⭐</span>
            </div>
          </div>

          {/* Right Action Buttons: 🔄 නැවත and ✓ පරීක්ෂා කරන්න / ඊළඟට */}
          <div className="flex items-center gap-3">
            {/* Reset Button (Pink Pill) */}
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-black text-sm shadow-md border-2 border-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <span>🔄</span>
              <span>නැවත</span>
            </button>

            {/* Next / Check Button (Green Pill) */}
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-black text-sm md:text-base shadow-lg border-2 border-white flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span>✓</span>
              <span>පරීක්ෂා කරන්න</span>
              <span className="text-lg">❯❯</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
