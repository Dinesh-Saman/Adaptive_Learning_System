import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Questions for Grade 4 Level 1 Activity 4 (හිස්තැනට ගැළපෙන නිවැරදි අක්ෂරය තෝරන්න) ──
const GRADE4_L1_ACT4_QUESTIONS = [
  {
    id: 1,
    num: 1,
    prefix: 'පුස්',
    suffix: 'කාලය',
    targetWord: 'පුස්තකාලය',
    fontSize: 82,
    slateWidth: 620,
    meaning: 'Library (පුස්තකාලය)',
    imageEmoji: '📚🏛️',
    audioPrompt: 'පුස් හිස්තැන කාලය. හිස්තැනට ගැළපෙන නිවැරදි අක්ෂරය තෝරා ලියන්න.',
    options: [
      { id: 'opt_1_1', text: 'ථ', isCorrect: false },
      { id: 'opt_1_2', text: 'ත', isCorrect: true },
    ]
  },
  {
    id: 2,
    num: 2,
    prefix: 'මර',
    suffix: '',
    targetWord: 'මරණ',
    fontSize: 98,
    slateWidth: 540,
    meaning: 'Mortality / Death (මූර්ධජ "ණ")',
    imageEmoji: '🌿🕊️',
    audioPrompt: 'මර හිස්තැන. හිස්තැනට ගැළපෙන මූර්ධජ අක්ෂරය තෝරා ලියන්න.',
    options: [
      { id: 'opt_2_1', text: 'ණ', isCorrect: true },
      { id: 'opt_2_2', text: 'න', isCorrect: false },
    ]
  },
  {
    id: 3,
    num: 3,
    prefix: 'නොම',
    suffix: '',
    targetWord: 'නොමළ',
    fontSize: 94,
    slateWidth: 540,
    meaning: 'Immortal / Undying (මූර්ධජ "ළ")',
    imageEmoji: '🌸✨',
    audioPrompt: 'නොම හිස්තැන. හිස්තැනට ගැළපෙන මූර්ධජ අක්ෂරය තෝරා ලියන්න.',
    options: [
      { id: 'opt_3_1', text: 'ල', isCorrect: false },
      { id: 'opt_3_2', text: 'ළ', isCorrect: true },
    ]
  },
  {
    id: 4,
    num: 4,
    prefix: 'පු',
    suffix: 'පය',
    targetWord: 'පුෂ්පය',
    fontSize: 90,
    slateWidth: 540,
    meaning: 'Flower (මූර්ධජ "ෂ්")',
    imageEmoji: '🌺🌼',
    audioPrompt: 'පු හිස්තැන පය. හිස්තැනට ගැළපෙන මූර්ධජ අක්ෂරය තෝරා ලියන්න.',
    options: [
      { id: 'opt_4_1', text: 'ශ්', isCorrect: false },
      { id: 'opt_4_2', text: 'ෂ්', isCorrect: true },
    ]
  },
  {
    id: 5,
    num: 5,
    prefix: 'පරිග',
    suffix: 'කය',
    targetWord: 'පරිගණකය',
    fontSize: 82,
    slateWidth: 620,
    meaning: 'Computer (මූර්ධජ "ණ")',
    imageEmoji: '💻🖥️',
    audioPrompt: 'පරිග හිස්තැන කය. හිස්තැනට ගැළපෙන මූර්ධජ අක්ෂරය තෝරා ලියන්න.',
    options: [
      { id: 'opt_5_1', text: 'න', isCorrect: false },
      { id: 'opt_5_2', text: 'ණ', isCorrect: true },
    ]
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

function speakSinhala(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'si-LK';
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

// ── Fast 2D Euclidean Distance Transform ──
function computeDistanceMap(width, height, binaryMask) {
  const dist = new Float32Array(width * height);
  const INF = 9999;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (binaryMask[idx]) {
        dist[idx] = 0;
      } else {
        let d = INF;
        if (x > 0) d = Math.min(d, dist[idx - 1] + 1);
        if (y > 0) {
          d = Math.min(d, dist[idx - width] + 1);
          if (x > 0) d = Math.min(d, dist[idx - width - 1] + 1.414);
          if (x < width - 1) d = Math.min(d, dist[idx - width + 1] + 1.414);
        }
        dist[idx] = d;
      }
    }
  }

  for (let y = height - 1; y >= 0; y--) {
    for (let x = width - 1; x >= 0; x--) {
      const idx = y * width + x;
      let d = dist[idx];
      if (x < width - 1) d = Math.min(d, dist[idx + 1] + 1);
      if (y < height - 1) {
        d = Math.min(d, dist[idx + width] + 1);
        if (x < width - 1) d = Math.min(d, dist[idx + width + 1] + 1.414);
        if (x > 0) d = Math.min(d, dist[idx + width - 1] + 1.414);
      }
      dist[idx] = d;
    }
  }

  return dist;
}

// ── Helper to accurately split Sinhala words into individual grapheme clusters ──
function splitSinhalaGraphemes(text) {
  if (!text) return [];
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('si', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  const matches = text.match(/[\u0D80-\u0DFF][\u0DCA-\u0DF3]*/g);
  return matches || text.split('');
}

// ── Precision 2D Canvas Tracing Evaluator with 4-Quadrant Structural Verification ──
function evaluateCanvasTrace(canvas, targetText, fontSize = 98) {
  if (!canvas || !targetText || targetText.trim() === '') {
    return { isComplete: false, coverage: 0, precision: 0, strayRate: 0, reason: 'empty' };
  }

  const width = canvas.width || 540;
  const height = canvas.height || 150;
  const ctx = canvas.getContext('2d');
  const userImg = ctx.getImageData(0, 0, width, height).data;

  // 1. Extract user drawn stroke pixels
  const userPoints = [];
  const isUser = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (userImg[idx + 3] > 40) {
        userPoints.push({ x, y });
        isUser[y * width + x] = 1;
      }
    }
  }

  // Need at least 45 drawn pixels for a valid handwriting attempt
  if (userPoints.length < 45) {
    return { isComplete: false, coverage: 0, precision: 0, strayRate: 0, reason: 'empty' };
  }

  // 2. Render target text on offscreen reference canvas
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const offCtx = offscreen.getContext('2d');
  offCtx.clearRect(0, 0, width, height);
  offCtx.font = `bold ${fontSize}px 'Noto Sans Sinhala', 'Iskoola Pota', 'Segoe UI', sans-serif`;
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'alphabetic';
  offCtx.fillStyle = '#000000';
  offCtx.fillText(targetText, width / 2, 115);

  const targetImg = offCtx.getImageData(0, 0, width, height).data;
  const isTarget = new Uint8Array(width * height);
  const targetPoints = [];

  let targetMinY = height;
  let targetMaxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (targetImg[idx + 3] > 40) {
        isTarget[y * width + x] = 1;
        targetPoints.push({ x, y });
        if (y < targetMinY) targetMinY = y;
        if (y > targetMaxY) targetMaxY = y;
      }
    }
  }

  if (targetPoints.length === 0) {
    return { isComplete: true, coverage: 100, precision: 100, strayRate: 0, reason: 'ok' };
  }

  // 3. Segment target into precise grapheme clusters using Canvas measurement
  const graphemes = splitSinhalaGraphemes(targetText);
  const totalTextWidth = offCtx.measureText(targetText).width;
  const startX = (width - totalTextWidth) / 2;

  let currentPrefix = '';
  const graphemeClusters = [];

  for (let i = 0; i < graphemes.length; i++) {
    const g = graphemes[i];
    const leftX = startX + offCtx.measureText(currentPrefix).width;
    currentPrefix += g;
    const rightX = startX + offCtx.measureText(currentPrefix).width;

    graphemeClusters.push({
      grapheme: g,
      minX: leftX - 4,
      maxX: rightX + 4
    });
  }

  // 4. Compute Distance Maps
  const targetDistMap = computeDistanceMap(width, height, isTarget);
  const userDistMap = computeDistanceMap(width, height, isUser);

  // 5. Precision & Stray (Off-Track) Stroke Detection
  let onTrackCount = 0;
  let strayCount = 0;

  for (const up of userPoints) {
    const d = targetDistMap[up.y * width + up.x];
    if (d <= 9) {
      onTrackCount++;
    } else if (d > 12 || up.y < Math.max(15, targetMinY - 6) || up.y > Math.min(142, targetMaxY + 8)) {
      strayCount++;
    }
  }

  const precision = (onTrackCount / userPoints.length) * 100;
  const strayRate = (strayCount / userPoints.length) * 100;

  // STRICT RULE 1: If child drew wild loops/outer bubbles/scribbles/extra boxes outside the letters
  // Max allowed stray points: 28 pixels or 8% stray rate, and minimum precision >= 74%
  if (strayCount > 28 || strayRate > 8 || precision < 74) {
    return {
      isComplete: false,
      coverage: 0,
      precision: Math.round(precision),
      strayRate: Math.round(strayRate),
      reason: 'off_track'
    };
  }

  // 6. Check 4-Quadrant Structural Coverage for EVERY Individual Letter / Grapheme
  let allClustersPassed = true;

  for (const cluster of graphemeClusters) {
    const clusterTargetPts = [];
    let cMinX = width, cMaxX = 0, cMinY = height, cMaxY = 0;

    for (const tp of targetPoints) {
      if (tp.x >= cluster.minX && tp.x <= cluster.maxX) {
        clusterTargetPts.push(tp);
        if (tp.x < cMinX) cMinX = tp.x;
        if (tp.x > cMaxX) cMaxX = tp.x;
        if (tp.y < cMinY) cMinY = tp.y;
        if (tp.y > cMaxY) cMaxY = tp.y;
      }
    }

    if (clusterTargetPts.length > 20) {
      // 6A. Overall cluster coverage >= 60%
      let clusterCovered = 0;
      for (const tp of clusterTargetPts) {
        if (userDistMap[tp.y * width + tp.x] <= 10) {
          clusterCovered++;
        }
      }
      const clusterCoverage = (clusterCovered / clusterTargetPts.length) * 100;
      if (clusterCoverage < 60) {
        allClustersPassed = false;
        break;
      }

      // 6B. 4-Quadrant 2D Sub-Feature Verification
      // Every quadrant with >= 15 target pixels must have >= 40% coverage
      const midX = (cMinX + cMaxX) / 2;
      const midY = (cMinY + cMaxY) / 2;

      const quads = {
        tl: { target: 0, covered: 0 },
        tr: { target: 0, covered: 0 },
        bl: { target: 0, covered: 0 },
        br: { target: 0, covered: 0 }
      };

      for (const tp of clusterTargetPts) {
        const isRight = tp.x > midX;
        const isBottom = tp.y > midY;
        const qKey = (isBottom ? 'b' : 't') + (isRight ? 'r' : 'l');
        quads[qKey].target++;
        if (userDistMap[tp.y * width + tp.x] <= 10) {
          quads[qKey].covered++;
        }
      }

      for (const qKey of ['tl', 'tr', 'bl', 'br']) {
        const q = quads[qKey];
        if (q.target >= 15) {
          const qCoverage = (q.covered / q.target) * 100;
          if (qCoverage < 40) {
            allClustersPassed = false;
            break;
          }
        }
      }

      if (!allClustersPassed) break;
    }
  }

  let coveredTargetPoints = 0;
  for (const tp of targetPoints) {
    if (userDistMap[tp.y * width + tp.x] <= 10) {
      coveredTargetPoints++;
    }
  }

  const overallCoverage = (coveredTargetPoints / targetPoints.length) * 100;

  // Genuine tracing requires overall coverage >= 65%, precision >= 74%, stray points <= 28 (and <= 8%), and ALL quadrants >= 40%
  const isComplete = overallCoverage >= 65 && strayCount <= 28 && strayRate <= 8 && precision >= 74 && allClustersPassed;

  let reason = 'ok';
  if (!isComplete) {
    if (strayCount > 28 || strayRate > 8 || precision < 74) {
      reason = 'off_track';
    } else {
      reason = 'missing_letters';
    }
  }

  return {
    isComplete,
    coverage: Math.round(overallCoverage),
    precision: Math.round(precision),
    strayRate: Math.round(strayRate),
    allClustersCovered: allClustersPassed,
    reason
  };
}

// ── Ruled 3-Line Canvas Slate for Dotted Tracing with Pen, Eraser & Clear All ──
const Grade4RuledTracingSlate = forwardRef(function Grade4RuledTracingSlate({ targetText, fontSize = 98, onTraceChange, disabled = false, slateWidth }, ref) {
  const width = slateWidth || (targetText && targetText.length > 8 ? 850 : 540);
  const height = 150;
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const hasDrawnRef = useRef(false);
  const [toolMode, setToolMode] = useState('pen'); // 'pen' | 'eraser'

  useImperativeHandle(ref, () => ({
    checkTracing: () => evaluateCanvasTrace(canvasRef.current, targetText, fontSize),
    clear: () => {
      if (disabled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hasDrawnRef.current = false;
      onTraceChange?.(false);
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawnRef.current = false;
    setToolMode('pen');
    onTraceChange?.(false);
  }, [targetText, fontSize]);

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
    if (disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    if (toolMode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 22;
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#10B981'; // Green tracing stroke
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    isDrawingRef.current = true;
    if (toolMode === 'pen' && !hasDrawnRef.current) {
      hasDrawnRef.current = true;
      onTraceChange?.(true);
    }
  };

  const handleMove = (e) => {
    if (disabled || !isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    if (toolMode === 'pen' && !hasDrawnRef.current) {
      hasDrawnRef.current = true;
      onTraceChange?.(true);
    }
  };

  const handleEnd = (e) => {
    e?.preventDefault();
    isDrawingRef.current = false;
  };

  const handleClear = () => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawnRef.current = false;
    onTraceChange?.(false);
  };

  return (
    <div className="w-full bg-white rounded-3xl border-3 border-emerald-300 shadow-inner p-3 relative h-48 sm:h-56 flex flex-col justify-center overflow-hidden">
      {/* Top action toolbar (Pen, Eraser, Clear All) */}
      {!disabled && (
        <div className="absolute top-2 right-3 z-20 flex items-center gap-1.5 bg-slate-100/90 backdrop-blur-xs p-1 rounded-full border border-emerald-200 shadow-xs">
          {/* Pen Button */}
          <button
            type="button"
            onClick={() => setToolMode('pen')}
            className={`text-xs px-3 py-1 rounded-full font-bold shadow-xs cursor-pointer transition-all flex items-center gap-1 ${
              toolMode === 'pen'
                ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-300'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
            title="පැන්සල (Draw)"
          >
            <span>✏️</span>
            <span>පැන්සල</span>
          </button>

          {/* Eraser Button */}
          <button
            type="button"
            onClick={() => setToolMode('eraser')}
            className={`text-xs px-3 py-1 rounded-full font-bold shadow-xs cursor-pointer transition-all flex items-center gap-1 ${
              toolMode === 'eraser'
                ? 'bg-pink-500 text-white shadow-sm ring-2 ring-pink-300'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
            title="මකනය (Eraser)"
          >
            <span>🧼</span>
            <span>මකනය</span>
          </button>

          {/* Clear All Button */}
          <button
            type="button"
            onClick={handleClear}
            className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1 rounded-full font-bold shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1"
            title="මුළුමනින් මකන්න (Clear All)"
          >
            <span>🔄</span>
            <span>මුළුමනින් මකන්න</span>
          </button>
        </div>
      )}

      <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full pointer-events-none select-none">
          {/* Exactly 3 Guide Lines */}
          <line x1="20" y1="35" x2={width - 20} y2="35" stroke="#BAE6FD" strokeWidth="2" />
          <line x1="20" y1="75" x2={width - 20} y2="75" stroke="#38BDF8" strokeWidth="2" strokeDasharray="8 8" />
          <line x1="20" y1="115" x2={width - 20} y2="115" stroke="#F43F5E" strokeWidth="2" />

          {/* Actual Sinhala Unicode Text rendered only after selecting an answer */}
          {targetText && (
            <text
              x={width / 2}
              y="115"
              textAnchor="middle"
              dominantBaseline="alphabetic"
              fontSize={fontSize}
              fontWeight="bold"
              fontFamily="'Noto Sans Sinhala', 'Iskoola Pota', 'Segoe UI', sans-serif"
              fill="#64748B"
              fillOpacity="0.35"
            >
              {targetText}
            </text>
          )}
        </svg>

        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={`absolute inset-0 w-full h-full touch-none z-10 ${
            disabled
              ? 'pointer-events-none cursor-default opacity-85'
              : toolMode === 'eraser'
              ? 'cursor-cell'
              : 'cursor-crosshair'
          }`}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>
    </div>
  );
});

// ── Main Grade 4 Level 1 Activity 4 Component ──
export default function SinhalaGrade4Level1Act4({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isAllDone, setIsAllDone] = useState(false);

  const slateRef = useRef(null);
  const currentQ = GRADE4_L1_ACT4_QUESTIONS[currentIndex];

  const selectedOpt = currentQ.options.find((o) => o.id === selectedOptionId);
  const displayedWord = selectedOpt ? `${currentQ.prefix}${selectedOpt.text}${currentQ.suffix}` : null;

  useEffect(() => {
    setSelectedOptionId(null);
    setHasDrawn(false);
    setIsConfirmed(false);
    setFeedback(null);
    const timer = setTimeout(() => {
      speakSinhala(currentQ.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleSelectOption = (opt) => {
    if (isConfirmed) return;
    playSound('click');
    setSelectedOptionId(opt.id);
    speakSinhala(opt.text);
  };

  const handleConfirm = () => {
    if (isConfirmed) return;

    if (!selectedOptionId) {
      playSound('wrong');
      speakSinhala('කරුණාකර පළමුව අක්ෂරය තෝරන්න.');
      return;
    }

    // Evaluate Handwriting Tracing
    const traceResult = slateRef.current ? slateRef.current.checkTracing() : { isComplete: false, reason: 'empty' };
    const isLetterCorrect = selectedOpt?.isCorrect ?? false;
    const isTraceCorrect = traceResult.isComplete;

    // Always lock and confirm attempt
    setIsConfirmed(true);

    if (isLetterCorrect && isTraceCorrect) {
      playSound('correct');
      setScore((prev) => prev + 20);
      setFeedback({
        isCorrect: true,
        text: `විශිෂ්ටයි! ඔබ තෝරාගත් අක්ෂරය "${selectedOpt.text}" සහ අකුරු ලිවීම නිවැරදියි.`
      });
      speakSinhala(`විශිෂ්ටයි! ඔබ තෝරාගත් අක්ෂරය ${selectedOpt.text} සහ අකුරු ලිවීම නිවැරදියි.`);
    } else {
      playSound('wrong');
      const correctOpt = currentQ.options.find((o) => o.isCorrect);

      if (!isLetterCorrect) {
        setFeedback({
          isCorrect: false,
          text: `පිළිතුර වැරදියි! නිවැරදි අක්ෂරය වන්නේ "${correctOpt?.text}" (${currentQ.targetWord}) වේ.`
        });
        speakSinhala(`පිළිතුර වැරදියි. නිවැරදි අක්ෂරය වන්නේ ${correctOpt?.text} වේ.`);
      } else {
        let traceMsg = 'අකුරු ලිවීම අසම්පූර්ණයි (බාගෙට ලියා ඇත).';
        if (traceResult.reason === 'empty') {
          traceMsg = 'අකුරු ලියා නැත.';
        } else if (traceResult.reason === 'off_track') {
          traceMsg = 'අකුරු ලිවීම ඉරෙන් පිටතට ගොස් ඇත / වැරදියි.';
        }

        setFeedback({
          isCorrect: false,
          text: `තෝරාගත් අක්ෂරය නිවැරදියි, නමුත් ${traceMsg}`
        });
        speakSinhala(`තෝරාගත් අක්ෂරය නිවැරදියි, නමුත් ${traceMsg}`);
      }
    }
  };

  const handleNext = () => {
    playSound('click');
    if (!isConfirmed) {
      speakSinhala('කරුණාකර පළමුව තහවුරු කරන්න.');
      return;
    }
    if (currentIndex < GRADE4_L1_ACT4_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  const handleResetActivity = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasDrawn(false);
    setIsConfirmed(false);
    setFeedback(null);
    setScore(0);
    setIsAllDone(false);
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-purple-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">
            {score >= 80 ? 'විශිෂ්ටයි!' : score >= 40 ? 'හොඳ උත්සාහයක්!' : 'නැවත උත්සාහ කරමු!'}
          </h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ 4 ශ්‍රේණිය Level 1 Activity 4 (අක්ෂර තේරීම හා ලිවීම) සාර්ථකව අවසන් කළා!</p>
          <div className="text-4xl font-black text-purple-600 mb-8">ලකුණු: {score} / 100 ⭐</div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onExit || (() => navigate('/dashboard'))}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🏠 Dashboard වෙත ආපසු</span>
              <span className="text-2xl">➔</span>
            </button>
            <button
              onClick={handleResetActivity}
              className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-lg rounded-2xl shadow-md cursor-pointer"
            >
              🔄 නැවත කරන්න
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-6"
      style={{ backgroundImage: "url('/images/grade4_bg.png')" }}
    >
      
      {/* ── TOP HEADER BAR ── */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onExit || (() => navigate('/dashboard'))}
              className="w-11 h-11 bg-purple-700 hover:bg-purple-800 text-white rounded-full flex items-center justify-center text-xl font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
              title="Dashboard"
            >
              🏠
            </button>
            <div className="bg-purple-900/90 text-white px-4 py-2 rounded-2xl font-black text-xs sm:text-sm shadow-md border-2 border-purple-400 flex items-center gap-1.5">
              <span>Grade 4 · Level 1 · Act 4</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 4: හිස්තැනට ගැළපෙන නිවැරදි අක්ෂරය තෝරමු
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/95 text-purple-900 px-4 py-2 rounded-2xl font-black text-sm md:text-base shadow-md border-2 border-purple-200 flex items-center gap-1.5">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span>{score}</span>
            </div>
          </div>
        </div>

        {/* Sub-instruction banner */}
        <div className="w-full mt-3 bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-emerald-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
              ✏️ <span className="text-emerald-700 font-extrabold underline">නිවැරදි අක්ෂරය තෝරා</span> තිත් ඉරි මත ලියා තහවුරු කරන්න.
            </p>
          </div>
          <div className="text-2xl pointer-events-none select-none flex items-center gap-1">
            <span>📚</span>
            <span>✏️</span>
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: SINGLE QUESTION HERO & TRACER ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-emerald-200 flex flex-col gap-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                {currentQ.num}
              </div>
              <span className="text-xs font-bold text-slate-500">ප්‍රශ්නය {currentQ.num} / 5</span>
            </div>
          </div>

          {/* Top Section: Word with Single Slot Underline & 2 Option Cards */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-1">
            
            {/* Left: Incomplete Word with Exactly 1-Letter Blank Slot */}
            <div className="flex-1 flex flex-col items-center sm:items-start gap-2">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                හිස්තැන සහිත වචනය (Word with Blank):
              </span>
              
              <div className="flex items-center gap-2 text-3xl sm:text-4xl font-black text-slate-900 bg-emerald-50/70 px-5 py-3 rounded-2xl border-2 border-emerald-200 shadow-sm">
                <span>{currentQ.prefix}</span>
                
                {/* Single 1-Letter Blank Slot */}
                <span className="inline-flex items-center justify-center min-w-[50px] h-[52px] px-3 bg-white border-b-4 border-emerald-600 rounded-xl text-emerald-700 font-black shadow-xs">
                  {selectedOpt ? selectedOpt.text : '＿'}
                </span>

                {currentQ.suffix && <span>{currentQ.suffix}</span>}
              </div>
              <span className="text-xs font-bold text-slate-400 mt-0.5">
                {currentQ.meaning}
              </span>
            </div>

            {/* Right: 2 Option Buttons */}
            <div className="flex flex-col items-center sm:items-end gap-2">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                නිවැරදි අක්ෂරය තෝරන්න (Select Letter):
              </span>

              <div className="flex items-center gap-3">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrect = opt.isCorrect;

                  let btnStyle = '';
                  if (!isConfirmed) {
                    if (isSelected) {
                      btnStyle = 'bg-emerald-600 text-white ring-4 ring-emerald-300 scale-105 shadow-lg border-emerald-700';
                    } else {
                      btnStyle = 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-300 active:scale-95 shadow-sm';
                    }
                  } else {
                    if (isSelected) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300 scale-105';
                      } else {
                        btnStyle = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300 animate-shake';
                      }
                    } else if (isCorrect) {
                      btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-500 ring-2 ring-emerald-300 font-black';
                    } else {
                      btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      disabled={isConfirmed}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl font-black text-2xl sm:text-3xl border-3 transition-all flex items-center justify-center ${
                        isConfirmed ? 'cursor-default' : 'cursor-pointer'
                      } ${btnStyle}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Tracing Area: Exercise 1 Style 3-Line Ruled Slate with Large Font */}
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span>✍️</span>
                <span>සම්පූර්ණ වචනය තිත් ඉරි මත ලියන්න (Trace Word on 3-Line Slate):</span>
              </span>
              {displayedWord && (
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full">
                  {displayedWord}
                </span>
              )}
            </div>

            <Grade4RuledTracingSlate
              ref={slateRef}
              targetText={displayedWord || ''}
              fontSize={currentQ.fontSize}
              slateWidth={currentQ.slateWidth}
              disabled={isConfirmed}
              onTraceChange={(drawn) => setHasDrawn(drawn)}
            />
          </div>

          {/* Confirm Button & Feedback Area */}
          <div className="flex flex-col gap-3 mt-1">
            {!isConfirmed && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedOptionId}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-base shadow-md transition-all flex items-center justify-center gap-2 ${
                  selectedOptionId
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white cursor-pointer active:scale-95 shadow-lg animate-pulse'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60 border border-slate-300'
                }`}
              >
                <span>✓</span>
                <span>තහවුරු කරන්න (Confirm)</span>
              </button>
            )}

            {isConfirmed && feedback && (
              <div
                className={`p-3.5 rounded-2xl border-2 text-sm font-bold flex items-center gap-2 animate-fade-in ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border-rose-300'
                }`}
              >
                <span className="text-xl">{feedback.isCorrect ? '✅' : '❌'}</span>
                <span>{feedback.text}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── BOTTOM NAVIGATION BAR ── */}
      <div className="max-w-4xl mx-auto w-full px-4 mt-2">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="py-2.5 px-5 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <span>🏠</span>
            <span>මුල් පිටුව</span>
          </button>

          <div className="flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-full shadow-md border border-sky-300">
            {GRADE4_L1_ACT4_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-emerald-600 ring-2 ring-emerald-300 scale-125'
                    : i < currentIndex
                    ? 'bg-emerald-500'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!isConfirmed}
            className={`py-2.5 px-6 font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-2 transition-all ${
              isConfirmed
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer active:scale-95 animate-bounce-short ring-4 ring-emerald-200'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{currentIndex === GRADE4_L1_ACT4_QUESTIONS.length - 1 ? 'අවසන් කරන්න' : 'ඊළඟ ප්‍රශ්නය'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
