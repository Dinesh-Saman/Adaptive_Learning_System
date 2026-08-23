import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Questions for Grade 4 Level 4 Activity 1 (අදාළ නිවැරදි අක්ෂරය තෝරමු) ──
const GRADE4_L4_ACT1_QUESTIONS = [
  {
    id: 1,
    num: 1,
    prefix: 'දේ',
    suffix: 'ගුණය',
    correctChar: 'ශ',
    targetWord: 'දේශගුණය',
    meaning: 'Climate (දේශගුණය - තාලව්‍ය "ශ")',
    imageEmoji: '🌦️🌍✨',
    audioPrompt: 'දේ හිස්තැන ගුණය. ගැලපෙන අක්ෂරය තෝරන්න. තාලව්‍ය ශ ද මූර්ධජ ෂ ද?',
    options: [
      { id: 'opt_1_1', char: 'ශ', isCorrect: true, name: 'තාලව්‍ය (ශ)' },
      { id: 'opt_1_2', char: 'ෂ', isCorrect: false, name: 'මූර්ධජ (ෂ)' },
    ]
  },
  {
    id: 2,
    num: 2,
    prefix: 'සම්පූර්',
    suffix: '',
    correctChar: 'ණ',
    targetWord: 'සම්පූර්ණ',
    meaning: 'Complete / Full (සම්පූර්ණ - මූර්ධජ "ණ")',
    imageEmoji: '🏆💯✨',
    audioPrompt: 'සම්පූර් හිස්තැන. ගැලපෙන අක්ෂරය තෝරන්න. මූර්ධජ ණ ද දන්තජ න ද?',
    options: [
      { id: 'opt_2_1', char: 'ණ', isCorrect: true, name: 'මූර්ධජ (ණ)' },
      { id: 'opt_2_2', char: 'න', isCorrect: false, name: 'දන්තජ (න)' },
    ]
  },
  {
    id: 3,
    num: 3,
    prefix: 'ආත්මාර්',
    suffix: 'කාමී',
    correctChar: 'ථ',
    targetWord: 'ආත්මාර්ථකාමී',
    meaning: 'Selfish (ආත්මාර්ථකාමී - මහාප්‍රාණ "ථ")',
    imageEmoji: '👤💭✨',
    audioPrompt: 'ආත්මාර් හිස්තැන කාමී. ගැලපෙන අක්ෂරය තෝරන්න. දන්තජ ත ද මහාප්‍රාණ ථ ද?',
    options: [
      { id: 'opt_3_1', char: 'ත', isCorrect: false, name: 'දන්තජ (ත)' },
      { id: 'opt_3_2', char: 'ථ', isCorrect: true, name: 'මහාප්‍රාණ (ථ)' },
    ]
  },
  {
    id: 4,
    num: 4,
    prefix: 'සෞ',
    suffix: 'දර්ය',
    correctChar: 'න්',
    targetWord: 'සෞන්දර්ය',
    meaning: 'Beauty / Aesthetics (සෞන්දර්ය - දන්තජ "න්")',
    imageEmoji: '🌸🎨✨',
    audioPrompt: 'සෞ හිස්තැන දර්ය. ගැලපෙන අක්ෂරය තෝරන්න. මූර්ධජ ණ් ද දන්තජ න් ද?',
    options: [
      { id: 'opt_4_1', char: 'ණ්', isCorrect: false, name: 'මූර්ධජ (ණ්)' },
      { id: 'opt_4_2', char: 'න්', isCorrect: true, name: 'දන්තජ (න්)' },
    ]
  },
  {
    id: 5,
    num: 5,
    prefix: 'නි',
    suffix: 'චල',
    correctChar: 'ශ්',
    targetWord: 'නිශ්චල',
    meaning: 'Calm / Motionless (නිශ්චල - තාලව්‍ය "ශ්")',
    imageEmoji: '🌊🧘‍♂️✨',
    audioPrompt: 'නි හිස්තැන චල. ගැලපෙන අක්ෂරය තෝරන්න. තාලව්‍ය ශ් ද මූර්ධජ ෂ් ද?',
    options: [
      { id: 'opt_5_1', char: 'ශ්', isCorrect: true, name: 'තාලව්‍ය (ශ්)' },
      { id: 'opt_5_2', char: 'ෂ්', isCorrect: false, name: 'මූර්ධජ (ෂ්)' },
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

// ── Split Sinhala Unicode String into Grapheme Clusters ──
function splitSinhalaGraphemes(text) {
  if (!text) return [];
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('si', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  const matches = text.match(/[\u0D80-\u0DFF][\u0DCA-\u0DF3]*/g);
  return matches || text.split('');
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

// ── Precision 2D Canvas Tracing Evaluator for Sinhala Handwriting ──
function evaluateCanvasTrace(canvas, targetText, fontSize = 74) {
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

  // Need at least 40 drawn pixels for a valid handwriting attempt
  if (userPoints.length < 40) {
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
    if (d <= 8) {
      onTrackCount++;
    } else if (d > 12 || up.y < Math.max(8, targetMinY - 6) || up.y > Math.min(145, targetMaxY + 8)) {
      strayCount++;
    }
  }

  const precision = (onTrackCount / userPoints.length) * 100;
  const strayRate = (strayCount / userPoints.length) * 100;

  // Stray check
  if (strayCount > 30 || strayRate > 12 || precision < 68) {
    return {
      isComplete: false,
      coverage: 0,
      precision: Math.round(precision),
      strayRate: Math.round(strayRate),
      reason: 'off_track'
    };
  }

  // 6. Check Structural & Sub-Region Coverage for EVERY Individual Letter / Grapheme
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
      // 6A. Overall cluster coverage >= 68%
      let clusterCovered = 0;
      for (const tp of clusterTargetPts) {
        if (userDistMap[tp.y * width + tp.x] <= 8) {
          clusterCovered++;
        }
      }
      const clusterCoverage = (clusterCovered / clusterTargetPts.length) * 100;
      if (clusterCoverage < 65) {
        allClustersPassed = false;
        break;
      }

      // 6B. Sub-Region Verification (Catches missing top ispilla / hal-garandiya / rephaya and missing side loops)
      const cHeight = cMaxY - cMinY;
      const cWidth = cMaxX - cMinX;

      // Top diacritic zone (ispilla 'ි', hal '්', rephaya 'ර්', etc.)
      const topThresholdY = cMinY + cHeight * 0.38;
      let topTarget = 0;
      let topCovered = 0;

      // Left and Right halves (e.g. right loop of 'ල', 'ණ', 'ම')
      const midX = cMinX + cWidth * 0.5;
      let leftTarget = 0, leftCovered = 0;
      let rightTarget = 0, rightCovered = 0;

      for (const tp of clusterTargetPts) {
        const isCovered = userDistMap[tp.y * width + tp.x] <= 8;

        if (tp.y <= topThresholdY) {
          topTarget++;
          if (isCovered) topCovered++;
        }

        if (tp.x <= midX) {
          leftTarget++;
          if (isCovered) leftCovered++;
        } else {
          rightTarget++;
          if (isCovered) rightCovered++;
        }
      }

      // Top diacritic / modifier check
      if (topTarget >= 10) {
        const topCoverage = (topCovered / topTarget) * 100;
        if (topCoverage < 45) {
          allClustersPassed = false;
          break;
        }
      }

      // Left half check
      if (leftTarget >= 15) {
        const leftCoverage = (leftCovered / leftTarget) * 100;
        if (leftCoverage < 45) {
          allClustersPassed = false;
          break;
        }
      }

      // Right half check
      if (rightTarget >= 15) {
        const rightCoverage = (rightCovered / rightTarget) * 100;
        if (rightCoverage < 45) {
          allClustersPassed = false;
          break;
        }
      }

      if (!allClustersPassed) break;
    }
  }

  let coveredTargetPoints = 0;
  for (const tp of targetPoints) {
    if (userDistMap[tp.y * width + tp.x] <= 8) {
      coveredTargetPoints++;
    }
  }

  const overallCoverage = (coveredTargetPoints / targetPoints.length) * 100;

  // Genuine tracing requires overall coverage >= 70%, precision >= 68%, stray points <= 30 (and <= 12%), and all cluster sub-regions passed
  const isComplete = overallCoverage >= 70 && strayCount <= 30 && strayRate <= 12 && precision >= 68 && allClustersPassed;

  let reason = 'ok';
  if (!isComplete) {
    if (strayCount > 30 || strayRate > 12 || precision < 68) {
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
const Grade4RuledTracingSlate = forwardRef(function Grade4RuledTracingSlate({ targetText, onTraceChange, disabled = false }, ref) {
  const width = 540;
  const height = 150;
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const hasDrawnRef = useRef(false);
  const [toolMode, setToolMode] = useState('pen'); // 'pen' | 'eraser'

  const fontSize = targetText?.length > 8 ? 62 : 74;

  useImperativeHandle(ref, () => ({
    checkTracing: () => evaluateCanvasTrace(canvasRef.current, targetText, fontSize),
    clear: () => handleClear()
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawnRef.current = false;
    setToolMode('pen');
    onTraceChange?.(false);
  }, [targetText]);

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
      ctx.lineWidth = 20;
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = '#10B981'; // Green ink
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
    <div className="w-full mt-3 p-3.5 bg-slate-50 rounded-3xl border-2 border-dashed border-sky-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
          <span>✏️</span>
          <span>අකුරු මත ඉරි අඳිමින් ලියන්න (Trace Word on Lined Slate):</span>
        </span>

        {/* Toolbar: Pen, Eraser, Clear */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-sky-200 shadow-xs">
          <button
            type="button"
            onClick={() => setToolMode('pen')}
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-all flex items-center gap-1 cursor-pointer ${
              toolMode === 'pen'
                ? 'bg-emerald-500 text-white shadow-xs ring-2 ring-emerald-300'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="පැන්සල (Draw)"
          >
            <span>✏️</span>
            <span>පැන්සල</span>
          </button>

          <button
            type="button"
            onClick={() => setToolMode('eraser')}
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-all flex items-center gap-1 cursor-pointer ${
              toolMode === 'eraser'
                ? 'bg-pink-500 text-white shadow-xs ring-2 ring-pink-300'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="මකනය (Eraser)"
          >
            <span>🧼</span>
            <span>මකනය</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-2.5 py-0.5 rounded-full font-bold transition-all flex items-center gap-1 cursor-pointer"
            title="මුළුමනින් මකන්න"
          >
            <span>🔄</span>
            <span>මකන්න</span>
          </button>
        </div>
      </div>

      <div className="relative w-full h-44 sm:h-48 bg-white rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full pointer-events-none select-none">
          {/* Exactly 3 Guide Lines */}
          <line x1="15" y1="35" x2={width - 15} y2="35" stroke="#BAE6FD" strokeWidth="2" />
          <line x1="15" y1="75" x2={width - 15} y2="75" stroke="#38BDF8" strokeWidth="2" strokeDasharray="8 8" />
          <line x1="15" y1="115" x2={width - 15} y2="115" stroke="#F43F5E" strokeWidth="2" />

          {/* Actual Sinhala Unicode Guide Text */}
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
            toolMode === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'
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

const STORAGE_KEY = 'sinhala_g4_l4_act1_progress';

function loadSavedProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        typeof parsed.currentIndex === 'number' &&
        parsed.currentIndex >= 0 &&
        parsed.currentIndex < GRADE4_L4_ACT1_QUESTIONS.length &&
        typeof parsed.score === 'number'
      ) {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
}

// ── Main Grade 4 Level 4 Activity 1 Component ──
export default function SinhalaGrade4Level4Act1({ onExit }) {
  const navigate = useNavigate();
  const slateRef = useRef(null);

  const initialSaved = loadSavedProgress();

  const [currentIndex, setCurrentIndex] = useState(initialSaved?.currentIndex ?? 0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(initialSaved?.score ?? 0);
  const [isAllDone, setIsAllDone] = useState(initialSaved?.isAllDone ?? false);

  const currentQ = GRADE4_L4_ACT1_QUESTIONS[currentIndex] || GRADE4_L4_ACT1_QUESTIONS[0];
  const selectedOpt = currentQ.options.find((o) => o.id === selectedOptionId);

  const targetTraceWord = selectedOpt 
    ? (currentQ.prefix + selectedOpt.char + (currentQ.suffix || '')) 
    : currentQ.targetWord;

  // Persist progress across page refreshes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentIndex,
          score,
          isAllDone
        })
      );
    } catch (e) {}
  }, [currentIndex, score, isAllDone]);

  useEffect(() => {
    if (isAllDone) return;
    setSelectedOptionId(null);
    setHasDrawn(false);
    setIsConfirmed(false);
    setFeedback(null);
    const timer = setTimeout(() => {
      speakSinhala(currentQ.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex, isAllDone]);

  const handleSelectOption = (opt) => {
    if (isConfirmed) return;
    playSound('click');
    setSelectedOptionId(opt.id);
    setHasDrawn(false);
    speakSinhala(opt.char);
  };

  const handleConfirm = () => {
    if (isConfirmed) return;

    if (!selectedOptionId) {
      playSound('wrong');
      speakSinhala('කරුණාකර පළමුව අක්ෂරයක් තෝරන්න.');
      return;
    }

    if (!hasDrawn) {
      playSound('wrong');
      speakSinhala('කරුණාකර අකුරු මත ලියා තහවුරු කරන්න.');
      return;
    }

    // Always finalize this question on confirm click so the student can proceed
    setIsConfirmed(true);

    const isChoiceCorrect = Boolean(selectedOpt?.isCorrect);
    const traceResult = slateRef.current?.checkTracing() || { isComplete: false, reason: 'empty' };
    const isTraceCorrect = traceResult.isComplete;

    if (isChoiceCorrect && isTraceCorrect) {
      // Case 1: Both selected letter AND written trace are correct
      playSound('correct');
      setScore((prev) => prev + 20);
      setFeedback({
        isCorrect: true,
        type: 'both_correct',
        text: `විශිෂ්ටයි! ඔබ තෝරාගත් අක්ෂරය ("${selectedOpt.char}") සහ අකුරු ලිවීම නිවැරදියි! සම්පූර්ණ වචනය "${currentQ.targetWord}" ය.`
      });
      speakSinhala(`විශිෂ්ටයි! ඔබ තෝරාගත් අක්ෂරය සහ අකුරු ලිවීම නිවැරදියි.`);
    } else if (isChoiceCorrect && !isTraceCorrect) {
      // Case 2: Selected letter is correct, BUT written trace is wrong or incomplete
      playSound('wrong');
      const traceIssue = traceResult.reason === 'off_track' ? 'අකුරු ලිවීම වැරදියි' : 'අකුරු ලිවීම අසම්පූර්ණයි';
      setFeedback({
        isCorrect: false,
        type: 'choice_correct_trace_wrong',
        text: `ඔබ තෝරාගත් අක්ෂරය ("${selectedOpt.char}") නිවැරදියි, නමුත් ${traceIssue}! සම්පූර්ණ වචනය "${currentQ.targetWord}" ය.`
      });
      speakSinhala(`ඔබ තෝරාගත් අක්ෂරය නිවැරදියි, නමුත් අකුරු ලිවීම නිවැරදි නැත.`);
    } else if (!isChoiceCorrect && isTraceCorrect) {
      // Case 3: Selected letter is wrong, BUT handwriting trace was done correctly
      playSound('wrong');
      setFeedback({
        isCorrect: false,
        type: 'choice_wrong_trace_correct',
        text: `තෝරාගත් අක්ෂරය වැරදියි! නිවැරදි අක්ෂරය වන්නේ "${currentQ.correctChar}" වේ. සම්පූර්ණ වචනය "${currentQ.targetWord}" ය.`
      });
      speakSinhala(`තෝරාගත් අක්ෂරය වැරදියි. නිවැරදි අක්ෂරය වන්නේ ${currentQ.correctChar} වේ.`);
    } else {
      // Case 4: Both selected letter AND written trace are wrong / incomplete
      playSound('wrong');
      setFeedback({
        isCorrect: false,
        type: 'both_wrong',
        text: `තෝරාගත් අක්ෂරය සහ අකුරු ලිවීම යන දෙකම වැරදියි! නිවැරදි අක්ෂරය වන්නේ "${currentQ.correctChar}" වේ. සම්පූර්ණ වචනය "${currentQ.targetWord}" ය.`
      });
      speakSinhala(`තෝරාගත් අක්ෂරය සහ අකුරු ලිවීම යන දෙකම වැරදියි.`);
    }
  };

  const handleNext = () => {
    playSound('click');
    if (!isConfirmed) {
      speakSinhala('කරුණාකර පළමුව තහවුරු කරන්න.');
      return;
    }
    if (currentIndex < GRADE4_L4_ACT1_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    setCurrentIndex(0);
    setIsAllDone(false);
    setIsConfirmed(false);
    setHasDrawn(false);
    setFeedback(null);
    setScore(0);
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-yellow-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center">
          <div className="text-7xl mb-2">🏆🎉💎</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ 4 ශ්‍රේණිය Level 4 Activity 1 (අක්ෂර තේරීම) සාර්ථකව අවසන් කළා!</p>
          <div className="text-4xl font-black text-purple-600 mb-8">ලකුණු: {score} ⭐</div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onExit || (() => navigate('/dashboard'))}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🏠 Dashboard වෙත ආපසු</span>
              <span className="text-2xl">➔</span>
            </button>
            <button
              onClick={handleRestart}
              className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-lg rounded-2xl shadow-md cursor-pointer"
            >
              🔄 නැවත කරන්න
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canConfirm = Boolean(selectedOptionId && hasDrawn);

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
              <span>Grade 4 · Level 4 · Act 1</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-purple-700 via-indigo-700 to-teal-700 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 1: නිවැරදි අක්ෂරය තෝරමු
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
        <div className="w-full mt-3 bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-purple-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
              💎 පහත දැක්වෙන වචනයට <span className="text-purple-700 font-extrabold underline">අදාළ නිවැරදි අක්ෂරය තෝරා අකුරු මත ලියා</span> තහවුරු කරන්න.
            </p>
          </div>
          <div className="text-2xl pointer-events-none select-none flex items-center gap-1">
            <span>✏️</span>
            <span>👧</span>
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: QUESTION CARD & TRACING ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-purple-200 flex flex-col gap-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-purple-100 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                {currentQ.num}
              </div>
              <span className="text-xs font-bold text-slate-500">ප්‍රශ්නය {currentQ.num} / 5</span>
            </div>

            <span className="text-3xl">{currentQ.imageEmoji}</span>
          </div>

          {/* Upper Box: Incomplete Word Card + Radio Choices */}
          <div className="p-6 bg-gradient-to-r from-purple-50 via-indigo-50 to-sky-50 rounded-3xl border-2 border-purple-300 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Left: Illustrated Treasure Card & Word */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
                🎁💎
              </div>

              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-wide flex items-center gap-1.5">
                <span>{currentQ.prefix}</span>
                <span className={`inline-flex min-w-[56px] h-12 px-3 rounded-2xl border-2 text-center transition-all ${
                  !isConfirmed
                    ? selectedOpt
                      ? 'bg-purple-100 text-purple-950 border-purple-500 shadow-xs items-center justify-center'
                      : 'bg-white border-dashed border-purple-400 text-purple-600 items-end justify-center pb-2'
                    : selectedOpt?.isCorrect
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm items-center justify-center'
                    : 'bg-rose-500 text-white border-rose-600 shadow-sm items-center justify-center'
                }`}>
                  {selectedOpt ? selectedOpt.char : <span className="w-10 h-[3.5px] bg-purple-500 rounded-full inline-block" />}
                </span>
                {currentQ.suffix && <span>{currentQ.suffix}</span>}
              </div>
            </div>

            {/* Right: Radio Pill Option Buttons */}
            <div className="flex flex-col gap-2.5 w-full sm:w-48">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrect = opt.isCorrect;

                let btnStyle = '';
                if (!isConfirmed) {
                  if (isSelected) {
                    btnStyle = 'bg-purple-600 text-white border-purple-700 ring-4 ring-purple-200 scale-102 shadow-md';
                  } else {
                    btnStyle = 'bg-white hover:bg-purple-100 text-slate-800 border-slate-300 active:scale-95 shadow-sm';
                  }
                } else {
                  if (isSelected) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 scale-102 shadow-md';
                    } else {
                      btnStyle = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200 shadow-md';
                    }
                  } else if (isCorrect) {
                    btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-200 font-black';
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
                    className={`py-2.5 px-4 rounded-2xl font-black text-xl border-2 transition-all flex items-center justify-between ${
                      isConfirmed ? 'cursor-default' : 'cursor-pointer'
                    } ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-white bg-white/30' : 'border-slate-400'
                      }`}>
                        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white"></span>}
                      </span>
                      <span>{opt.char}</span>
                    </div>

                    <span className="text-xs font-bold opacity-75">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Middle Box: 3-Line Ruled Slate (Visible to write on before confirming) */}
          <div className="flex flex-col gap-2">
            <Grade4RuledTracingSlate
              ref={slateRef}
              targetText={targetTraceWord}
              onTraceChange={setHasDrawn}
              disabled={isConfirmed}
            />
          </div>

          {/* Confirm Button & Feedback Area */}
          <div className="flex flex-col gap-2 mt-1">
            {!isConfirmed && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canConfirm}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-base shadow-md transition-all flex items-center justify-center gap-2 ${
                  canConfirm
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white cursor-pointer active:scale-95 shadow-lg animate-pulse'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60 border border-slate-300'
                }`}
              >
                <span>
                  {!selectedOptionId
                    ? '✓ අක්ෂරයක් තෝරන්න (Select Letter)'
                    : !hasDrawn
                    ? '✍️ අකුරු මත ලියා තහවුරු කරන්න (Trace on Slate to Confirm)'
                    : '✓ තහවුරු කරන්න (Confirm)'}
                </span>
              </button>
            )}

            {isConfirmed && feedback && (
              <div
                className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 text-sm md:text-base font-black animate-fade-in ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                    : 'bg-rose-50 border-rose-400 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{feedback.isCorrect ? '🎉' : '❌'}</span>
                  <span>{feedback.text}</span>
                </div>
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
            {GRADE4_L4_ACT1_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-purple-600 ring-2 ring-purple-300 scale-125'
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
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer active:scale-95'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{currentIndex === GRADE4_L4_ACT1_QUESTIONS.length - 1 ? 'අවසන් කරන්න' : 'ඊළඟ ප්‍රශ්නය'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
