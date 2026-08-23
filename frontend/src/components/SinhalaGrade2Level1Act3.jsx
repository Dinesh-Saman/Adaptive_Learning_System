import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Question Datasets for Grade 2 Level 1 - Activity 3: Fill in the Blank ──
const ACTIVITY3_ITEMS = [
  {
    id: 1,
    num: 1,
    wordSuffix: 'වා',
    fullWord: 'හාවා',
    english: 'Rabbit',
    icon: '🐰',
    targetLetter: 'හා',
    soundPrompt: 'හාවා සෑදීමට හිස්තැනට ගැලපෙන "හා" අකුර මත ලියන්න.',
    options: [
      { id: 'a', letter: 'හා', bg: '#FDF2F8', border: '#FBCFE8', badgeBg: '#EC4899', btnBg: '#FCE7F3', btnText: '#BE185D' },
      { id: 'b', letter: 'ම', bg: '#F0F9FF', border: '#BAE6FD', badgeBg: '#0284C7', btnBg: '#E0F2FE', btnText: '#0369A1' },
      { id: 'c', letter: 'න', bg: '#F0FDF4', border: '#BBF7D0', badgeBg: '#16A34A', btnBg: '#DCFCE7', btnText: '#15803D' },
    ],
    correctOptionId: 'a'
  },
  {
    id: 2,
    num: 2,
    wordSuffix: 'ව',
    fullWord: 'නැව',
    english: 'Ship',
    icon: '🚢',
    targetLetter: 'නැ',
    soundPrompt: 'නැව සෑදීමට හිස්තැනට ගැලපෙන "නැ" අකුර මත ලියන්න.',
    options: [
      { id: 'a', letter: 'ලු', bg: '#FAF5FF', border: '#DDD6FE', badgeBg: '#9333EA', btnBg: '#F3E8FF', btnText: '#7E22CE' },
      { id: 'b', letter: 'නැ', bg: '#FEFCE8', border: '#FEF08A', badgeBg: '#CA8A04', btnBg: '#FEF9C3', btnText: '#A16207' },
      { id: 'c', letter: 'ද', bg: '#F0F9FF', border: '#BAE6FD', badgeBg: '#0284C7', btnBg: '#E0F2FE', btnText: '#0369A1' },
    ],
    correctOptionId: 'b'
  },
  {
    id: 3,
    num: 3,
    wordSuffix: 'රුල්ලා',
    fullWord: 'කුරුල්ලා',
    english: 'Bird',
    icon: '🐦',
    targetLetter: 'කු',
    soundPrompt: 'කුරුල්ලා සෑදීමට හිස්තැනට ගැලපෙන "කු" අකුර මත ලියන්න.',
    options: [
      { id: 'a', letter: 'කු', bg: '#FDF2F8', border: '#FBCFE8', badgeBg: '#EC4899', btnBg: '#FCE7F3', btnText: '#BE185D' },
      { id: 'b', letter: 'නු', bg: '#F0FDF4', border: '#BBF7D0', badgeBg: '#16A34A', btnBg: '#DCFCE7', btnText: '#15803D' },
      { id: 'c', letter: 'ත', bg: '#F0F9FF', border: '#BAE6FD', badgeBg: '#0284C7', btnBg: '#E0F2FE', btnText: '#0369A1' },
    ],
    correctOptionId: 'a'
  },
  {
    id: 4,
    num: 4,
    wordSuffix: 'ත්තා',
    fullWord: 'තාත්තා',
    english: 'Father',
    icon: '👨',
    targetLetter: 'තා',
    soundPrompt: 'තාත්තා සෑදීමට හිස්තැනට ගැලපෙන "තා" අකුර මත ලියන්න.',
    options: [
      { id: 'a', letter: 'තා', bg: '#F0FDF4', border: '#BBF7D0', badgeBg: '#16A34A', btnBg: '#DCFCE7', btnText: '#15803D' },
      { id: 'b', letter: 'නා', bg: '#FAF5FF', border: '#DDD6FE', badgeBg: '#9333EA', btnBg: '#F3E8FF', btnText: '#7E22CE' },
      { id: 'c', letter: 'කා', bg: '#FEFCE8', border: '#FEF08A', badgeBg: '#CA8A04', btnBg: '#FEF9C3', btnText: '#A16207' },
    ],
    correctOptionId: 'a'
  },
  {
    id: 5,
    num: 5,
    wordSuffix: 'රම',
    fullWord: 'සරම',
    english: 'Sarong',
    icon: '🥻',
    targetLetter: 'ස',
    soundPrompt: 'සරම සෑදීමට හිස්තැනට ගැලපෙන "ස" අකුර මත ලියන්න.',
    options: [
      { id: 'a', letter: 'ප', bg: '#F0F9FF', border: '#BAE6FD', badgeBg: '#0284C7', btnBg: '#E0F2FE', btnText: '#0369A1' },
      { id: 'b', letter: 'ස', bg: '#FEFCE8', border: '#FEF08A', badgeBg: '#CA8A04', btnBg: '#FEF9C3', btnText: '#A16207' },
      { id: 'c', letter: 'බ', bg: '#FDF2F8', border: '#FBCFE8', badgeBg: '#EC4899', btnBg: '#FCE7F3', btnText: '#BE185D' },
    ],
    correctOptionId: 'b'
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
  } catch (e) {
    // Ignore audio errors
  }
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

// ── Strict Stroke-Skeleton Evaluator ──
function evaluateTracingCoverage(canvas, targetLetter) {
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
  refCtx.lineWidth = 8;
  refCtx.lineCap = 'round';
  refCtx.lineJoin = 'round';
  refCtx.font = 'normal 115px "Iskoola Pota", "Noto Sans Sinhala", sans-serif';
  refCtx.textAlign = 'center';
  refCtx.textBaseline = 'alphabetic';
  refCtx.strokeText(targetLetter, w / 2, 115);

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

  if (totalRefPixels === 0 || totalDrawnPixels < 150) {
    return {
      completionPercent: 0,
      accuracyPercent: 0,
      isComplete: false,
      missingReason: 'අකුර සම්පූර්ණයෙන්ම ලියන්න',
      refDataUrl: refCanvas.toDataURL('image/png')
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

  // 2. 9-Sector Grid
  const stepX = (maxRefX - minRefX) / 3;
  const stepY = (maxRefY - minRefY) / 3;

  const sectors = [
    { name: 'වම් ඉහළ (Top-Left)',    x0: minRefX,             x1: minRefX + stepX,     y0: minRefY,             y1: minRefY + stepY },
    { name: 'මැද ඉහළ (Top-Center)',   x0: minRefX + stepX,     x1: minRefX + 2 * stepX, y0: minRefY,             y1: minRefY + stepY },
    { name: 'දකුණු ඉහළ (Top-Right)',  x0: minRefX + 2 * stepX, x1: maxRefX,             y0: minRefY,             y1: minRefY + stepY },
    
    { name: 'වම් මැද (Mid-Left)',     x0: minRefX,             x1: minRefX + stepX,     y0: minRefY + stepY,     y1: minRefY + 2 * stepY },
    { name: 'මධ්‍යය (Center)',         x0: minRefX + stepX,     x1: minRefX + 2 * stepX, y0: minRefY + stepY,     y1: minRefY + 2 * stepY },
    { name: 'දකුණු මැද (Mid-Right)',  x0: minRefX + 2 * stepX, x1: maxRefX,             y0: minRefY + stepY,     y1: minRefY + 2 * stepY },
    
    { name: 'වම් පහළ (Bottom-Left)',  x0: minRefX,             x1: minRefX + stepX,     y0: minRefY + 2 * stepY, y1: maxRefY },
    { name: 'මැද පහළ (Bottom-Center)',x0: minRefX + stepX,     x1: minRefX + 2 * stepX, y0: minRefY + 2 * stepY, y1: maxRefY },
    { name: 'දකුණු පහළ (Bottom-Right)',x0: minRefX + 2 * stepX,x1: maxRefX,             y0: minRefY + 2 * stepY, y1: maxRefY },
  ];

  let missingSectorName = null;
  let allSectorsPassed = true;

  sectors.forEach((sec) => {
    let secRefTotal = 0;
    let secRefCovered = 0;

    for (let y = Math.floor(sec.y0); y <= Math.ceil(sec.y1); y += 2) {
      for (let x = Math.floor(sec.x0); x <= Math.ceil(sec.x1); x += 2) {
        const idx = y * w + x;
        if (refMask[idx] === 1) {
          secRefTotal++;
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
          if (covered) secRefCovered++;
        }
      }
    }

    if (secRefTotal > 10) {
      const secRatio = secRefCovered / secRefTotal;
      if (secRatio < 0.68) {
        allSectorsPassed = false;
        if (!missingSectorName) missingSectorName = sec.name;
      }
    }
  });

  // 3. Precision & Stray lines
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
  let reason = 'අකුර සම්පූර්ණයෙන් ලියන්න';

  if (accuracyPercent < 80 || strayPixelsCount > 35) {
    reason = 'රේඛාවෙන් පිටතට නොයන්න!';
  } else if (!allSectorsPassed || completionPercent < 80) {
    reason = missingSectorName ? `${missingSectorName} කොටස සම්පූර්ණ කරන්න` : 'අකුර සම්පූර්ණයෙන් ලියන්න';
  } else {
    isComplete = true;
  }

  return {
    completionPercent,
    accuracyPercent,
    isComplete,
    missingReason: reason,
    refDataUrl: refCanvas.toDataURL('image/png')
  };
}

// ── Single Option Letter Tracing Box ──
function OptionTracingCard({
  option,
  isTarget,
  targetLetter,
  isCompleted,
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
  }, [option.letter]);

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
    if (isCompleted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isTarget ? '#15803D' : '#DC2626';

    isDrawingRef.current = true;
    pathPointsRef.current.push(pos);
  };

  const handleMove = (e) => {
    if (!isDrawingRef.current || isCompleted) return;
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
    if (!canvas || isCompleted) return;

    if (pathPointsRef.current.length < 20) {
      setTipMessage('අකුර දිගේ ලියන්න! ✏️');
      setTimeout(() => setTipMessage(null), 2500);
      onIncomplete('අකුර සම්පූර්ණයෙන් ලියන්න');
      return;
    }

    const { isComplete, missingReason } = evaluateTracingCoverage(canvas, option.letter);

    if (!isComplete) {
      setTipMessage(`✏️ ${missingReason}`);
      setTimeout(() => setTipMessage(null), 2500);
      onIncomplete(missingReason);
      return;
    }

    if (isTarget) {
      setHasTraced(true);
      onComplete(option.id);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      onWrong(option.letter);
    }
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

  return (
    <div
      className={`relative rounded-2xl p-2.5 flex flex-col items-center justify-between border-2 transition-all duration-300 ${shake ? 'animate-bounce' : ''}`}
      style={{
        backgroundColor: option.bg,
        borderColor: hasTraced ? '#16A34A' : option.border,
        boxShadow: hasTraced ? '0 0 0 3px #BBF7D0' : '0 2px 8px rgba(0,0,0,0.04)'
      }}
    >
      {/* Clear Stroke Button */}
      {!isCompleted && pathPointsRef.current.length > 0 && !hasTraced && (
        <button
          onClick={handleClear}
          className="absolute top-1.5 right-1.5 bg-white/90 hover:bg-white text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow border z-20 cursor-pointer"
        >
          🧹
        </button>
      )}

      {/* ✅ Top-Right Tick Mark */}
      {hasTraced && (
        <div className="absolute top-1.5 right-1.5 z-30 animate-bounce">
          <div className="w-7 h-7 bg-green-500 text-white rounded-full shadow border-2 border-white flex items-center justify-center font-black text-sm">
            ✓
          </div>
        </div>
      )}

      {/* Letter Tracing Area */}
      <div className="w-full h-28 md:h-32 flex items-center justify-center relative">
        <svg viewBox="0 0 200 160" className="w-full h-full pointer-events-none select-none">
          <text
            x="100"
            y="115"
            textAnchor="middle"
            fontSize="115"
            fontWeight="normal"
            fontFamily="'Iskoola Pota', 'Noto Sans Sinhala', sans-serif"
            fill="none"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeDasharray="5, 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {option.letter}
          </text>
        </svg>

        {/* Tracing Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={200}
          height={160}
          className="absolute inset-0 w-full h-full touch-none z-10 cursor-crosshair"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />

        {tipMessage && (
          <div className="absolute bottom-0 inset-x-1 text-center bg-amber-500 text-white text-[11px] font-bold py-1 px-2 rounded-full shadow z-30 animate-bounce">
            {tipMessage}
          </div>
        )}
      </div>

      {/* Bottom Button Pill */}
      <div
        className="w-full py-1 px-2 rounded-xl text-center text-xs font-extrabold flex items-center justify-center gap-1 shadow-xs mt-1"
        style={{ backgroundColor: option.btnBg, color: option.btnText }}
      >
        <span>👉</span>
        <span>මත ලියන්න</span>
      </div>
    </div>
  );
}

// ── Main Grade 2 Level 1 Activity 3 Component ──
export default function SinhalaGrade2Level1Act3({ onExit }) {
  const navigate = useNavigate();

  // Page 1: Items 1 & 2; Page 2: Items 3 & 4; Page 3: Item 5
  const [currentPage, setCurrentPage] = useState(0);
  const [score, setScore] = useState(120);
  const [completedItems, setCompletedItems] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const totalPages = 3;
  const pageItems =
    currentPage === 0
      ? [ACTIVITY3_ITEMS[0], ACTIVITY3_ITEMS[1]]
      : currentPage === 1
      ? [ACTIVITY3_ITEMS[2], ACTIVITY3_ITEMS[3]]
      : [ACTIVITY3_ITEMS[4]];

  // Play instructions on load
  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala('හිස්තැනට ගැලපෙන අකුර තෝරා එය මත ලියන්න.');
    }, 400);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handleSpeakerClick = () => {
    playSound('click');
    speakSinhala('හිස්තැනට ගැලපෙන අකුර තෝරා එය මත ලියන්න.');
  };

  const handleItemCompleted = (item) => {
    playSound('correct');
    setCompletedItems((prev) => ({ ...prev, [item.id]: true }));
    setScore((prev) => prev + 20);
    speakSinhala(`නියමයි! "${item.fullWord}" වචනය සම්පූර්ණයි!`);
  };

  const handleItemWrong = () => {
    playSound('wrong');
    speakSinhala('නැවත උත්සාහ කරන්න. වචනයට ගැලපෙන අකුර සොයන්න.');
  };

  const handleItemIncomplete = (reason) => {
    playSound('incomplete');
    if (reason && reason.includes('පිටතට')) {
      speakSinhala('අකුර තුළ පමණක් ලියන්න!');
    } else {
      speakSinhala('අකුර සම්පූර්ණයෙන්ම ලියන්න!');
    }
  };

  const handleNextPage = () => {
    playSound('click');
    if (currentPage + 1 < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center">
          <div className="text-6xl mb-2 animate-bounce">🏆</div>
          <h1 className="text-4xl font-extrabold text-purple-700 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-6">ඔබ තෙවන අභ්‍යාසය සාර්ථකව අවසන් කළා!</p>
          <div className="text-4xl font-black text-purple-600 mb-8">ලකුණු: {score}</div>
          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/module/sinhala/grade2-level1-act4')}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all font-sinhala cursor-pointer flex items-center justify-center gap-2"
            >
              <span>✨ ඊළඟ අභ්‍යාසය (Activity 4: මැජික් පුවරුව)</span>
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
                onClick={onExit || (() => navigate('/dashboard'))}
                className="flex-1 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-lg rounded-2xl shadow-md cursor-pointer"
              >
                🏠 Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200 font-sinhala select-none relative overflow-x-hidden pb-6">
      
      {/* Rainbow and Sky Decor */}
      <div className="absolute top-2 left-6 text-7xl opacity-90 pointer-events-none">🌈</div>
      <div className="absolute top-4 left-32 text-4xl opacity-80 pointer-events-none animate-pulse">🦋</div>

      <div className="max-w-5xl mx-auto px-4 py-3 relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* ── TOP HEADER BAR ── */}
        <div className="flex items-center justify-between gap-3 mb-2">
          
          {/* Back Button */}
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="w-12 h-12 bg-amber-400 hover:bg-amber-500 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="ආපසු"
          >
            ←
          </button>

          {/* Star Score Pill */}
          <div className="bg-purple-600 text-white px-5 py-2 rounded-full shadow-lg border-2 border-purple-400 flex items-center gap-2">
            <span className="text-2xl text-yellow-300">⭐</span>
            <span className="text-xl font-extrabold">{score}</span>
          </div>

          {/* Center Activity Title Pill */}
          <div className="flex-1 max-w-xl bg-purple-600 text-white py-2.5 px-6 rounded-full shadow-md border-2 border-purple-300 text-center">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-wide drop-shadow">
              Activity 3: හිස් අකුර පුරවන්න
            </h1>
          </div>

          {/* Right Speaker Button */}
          <button
            onClick={handleSpeakerClick}
            className="w-12 h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="හඬ අසන්න"
          >
            🔊
          </button>
        </div>

        {/* ── SPEECH BUBBLE INSTRUCTION BANNER WITH CUTE BUNNY MASCOT ── */}
        <div className="relative max-w-3xl mx-auto w-full my-2">
          <div className="bg-white/95 backdrop-blur-md rounded-full py-2.5 px-6 shadow-md border-2 border-dashed border-sky-300 flex items-center gap-3">
            <button
              onClick={handleSpeakerClick}
              className="w-9 h-9 bg-sky-500 hover:bg-sky-600 active:scale-90 text-white rounded-full flex items-center justify-center text-lg shadow-sm flex-shrink-0 cursor-pointer"
            >
              🔊
            </button>
            <p className="text-lg md:text-xl font-bold text-slate-800">
              හිස්තැනට ගැලපෙන <span className="text-pink-600 font-extrabold">අකුර</span> තෝරා එය මත <span className="text-emerald-600 font-extrabold underline">ලියන්න.</span>
            </p>
          </div>

          {/* Cute Mascot */}
          <div className="absolute -top-6 -right-6 md:-right-10 pointer-events-none">
            <div className="text-6xl transform -scale-x-100 drop-shadow-lg">
              🐰
            </div>
            <div className="absolute top-1 right-8 text-2xl transform rotate-45">✏️</div>
          </div>
        </div>

        {/* ── MAIN WHITE CARD BOARD ── */}
        <div className="bg-white rounded-[2.5rem] p-5 md:p-6 shadow-2xl border-8 border-white/80 my-auto flex flex-col gap-5">
          {pageItems.map((item, idx) => {
            const isDone = completedItems[item.id];

            return (
              <React.Fragment key={item.id}>
                {idx > 0 && <div className="border-t-2 border-dashed border-slate-200" />}

                <div className="flex flex-col md:flex-row items-center gap-4">
                  
                  {/* Row Number Badge */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg shadow-md flex-shrink-0"
                    style={{ backgroundColor: item.num % 2 === 1 ? '#BE185D' : '#7E22CE' }}
                  >
                    {item.num}
                  </div>

                  {/* Word Puzzle Card showing Missing Blank Box & Illustration */}
                  <div className="w-full md:w-56 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-3 border-2 border-amber-200 shadow-sm flex items-center justify-between gap-2 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="text-4xl drop-shadow-sm">{item.icon}</div>
                      <div className="flex items-baseline gap-1">
                        {/* The Blank Box */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black border-2 transition-all ${
                            isDone
                              ? 'bg-green-100 border-green-500 text-green-700 shadow-sm animate-bounce'
                              : 'bg-white border-dashed border-amber-400 text-amber-500'
                          }`}
                        >
                          {isDone ? item.targetLetter : '___'}
                        </div>
                        {/* Word Suffix */}
                        <span className="text-2xl font-black text-slate-800 tracking-wide">
                          {item.wordSuffix}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Tracing Option Cards */}
                  <div className="flex-1 grid grid-cols-3 gap-3 md:gap-4 w-full">
                    {item.options.map((opt) => (
                      <OptionTracingCard
                        key={opt.id}
                        option={opt}
                        isTarget={opt.id === item.correctOptionId}
                        targetLetter={opt.letter}
                        isCompleted={isDone}
                        onComplete={() => handleItemCompleted(item)}
                        onWrong={handleItemWrong}
                        onIncomplete={handleItemIncomplete}
                      />
                    ))}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* ── BOTTOM NAVIGATION BAR ── */}
        <div className="flex items-center justify-between mt-3 gap-4">
          
          {/* Home Button */}
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-extrabold text-base shadow-lg border-2 border-white flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>🏠</span>
            <span>මුල් පිටුව</span>
          </button>

          {/* Progress Indicator Dots */}
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

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            className="px-8 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full font-black text-lg shadow-lg border-2 border-white flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>ඊළඟට</span>
            <span className="text-xl">❯❯</span>
          </button>
        </div>
      </div>
    </div>
  );
}
