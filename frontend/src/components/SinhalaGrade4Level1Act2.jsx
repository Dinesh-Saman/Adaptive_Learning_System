import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Questions for Grade 4 Level 1 Activity 2 (අයත් නොවන වචනය සොයමු / Odd One Out) ──
const GRADE4_L1_ACT2_QUESTIONS = [
  {
    id: 1,
    num: 1,
    correctId: 'opt_1_3',
    correctWord: 'බස් රථය',
    fontSize: 82,
    hintExplanation: '💡 අඹ, කොස්, කෙසෙල් පලතුරු වන අතර, බස් රථය වාහනයකි.',
    voicePrompt: 'කණ්ඩායමට නොගැළපෙන අයත් නොවන වචනය තෝරන්න.',
    options: [
      { id: 'opt_1_1', text: 'අඹ', emoji: '🥭', isOdd: false, label: 'පලතුරක්' },
      { id: 'opt_1_2', text: 'කොස්', emoji: '🍈', isOdd: false, label: 'පලතුරක්' },
      { id: 'opt_1_3', text: 'බස් රථය', emoji: '🚌', isOdd: true, label: 'වාහනයක්' },
      { id: 'opt_1_4', text: 'කෙසෙල්', emoji: '🍌', isOdd: false, label: 'පලතුරක්' },
    ]
  },
  {
    id: 2,
    num: 2,
    correctId: 'opt_2_3',
    correctWord: 'පොත',
    fontSize: 98,
    hintExplanation: '💡 ගුරුවරයා, වෛද්‍යවරයා, ගොවියා පුද්ගල නාම වන අතර, පොත ද්‍රව්‍යයකි.',
    voicePrompt: 'කණ්ඩායමට නොගැළපෙන අයත් නොවන වචනය තෝරන්න.',
    options: [
      { id: 'opt_2_1', text: 'ගුරුවරයා', emoji: '👨‍🏫', isOdd: false, label: 'පුද්ගලයෙක්' },
      { id: 'opt_2_2', text: 'වෛද්‍යවරයා', emoji: '👨‍⚕️', isOdd: false, label: 'පුද්ගලයෙක්' },
      { id: 'opt_2_3', text: 'පොත', emoji: '📘', isOdd: true, label: 'ද්‍රව්‍යයක්' },
      { id: 'opt_2_4', text: 'ගොවියා', emoji: '👨‍🌾', isOdd: false, label: 'පුද්ගලයෙක්' },
    ]
  },
  {
    id: 3,
    num: 3,
    correctId: 'opt_3_2',
    correctWord: 'කුකුළා',
    fontSize: 82,
    hintExplanation: '💡 පොත, පැන්සල, මකනය පාසල් උපකරණ වන අතර, කුකුළා සතෙකි.',
    voicePrompt: 'කණ්ඩායමට නොගැළපෙන අයත් නොවන වචනය තෝරන්න.',
    options: [
      { id: 'opt_3_1', text: 'පොත', emoji: '📘', isOdd: false, label: 'උපකරණයක්' },
      { id: 'opt_3_2', text: 'කුකුළා', emoji: '🐓', isOdd: true, label: 'සතෙක්' },
      { id: 'opt_3_3', text: 'පැන්සල', emoji: '✏️', isOdd: false, label: 'උපකරණයක්' },
      { id: 'opt_3_4', text: 'මකනය', emoji: '🧼', isOdd: false, label: 'උපකරණයක්' },
    ]
  },
  {
    id: 4,
    num: 4,
    correctId: 'opt_4_1',
    correctWord: 'කඩදාසිය',
    fontSize: 82,
    hintExplanation: '💡 සඳ, තරුව, සූර්යයා අහසේ වස්තූන් වන අතර, කඩදාසිය ද්‍රව්‍යයකි.',
    voicePrompt: 'කණ්ඩායමට නොගැළපෙන අයත් නොවන වචනය තෝරන්න.',
    options: [
      { id: 'opt_4_1', text: 'කඩදාසිය', emoji: '📄', isOdd: true, label: 'ද්‍රව්‍යයක්' },
      { id: 'opt_4_2', text: 'සඳ', emoji: '🌕', isOdd: false, label: 'අහසේ වස්තුවක්' },
      { id: 'opt_4_3', text: 'තරුව', emoji: '⭐', isOdd: false, label: 'අහසේ වස්තුවක්' },
      { id: 'opt_4_4', text: 'සූර්යයා', emoji: '☀️', isOdd: false, label: 'අහසේ වස්තුවක්' },
    ]
  },
  {
    id: 5,
    num: 5,
    correctId: 'opt_5_4',
    correctWord: 'ගල',
    fontSize: 98,
    hintExplanation: '💡 කිරි, තේ, ජලය දියර පාන වර්ග වන අතර, ගල ඝන ද්‍රව්‍යයකි.',
    voicePrompt: 'කණ්ඩායමට නොගැළපෙන අයත් නොවන වචනය තෝරන්න.',
    options: [
      { id: 'opt_5_1', text: 'කිරි', emoji: '🥛', isOdd: false, label: 'දියරයක්' },
      { id: 'opt_5_2', text: 'තේ', emoji: '☕', isOdd: false, label: 'දියරයක්' },
      { id: 'opt_5_3', text: 'ජලය', emoji: '💧', isOdd: false, label: 'දියරයක්' },
      { id: 'opt_5_4', text: 'ගල', emoji: '🪨', isOdd: true, label: 'ඝන ද්‍රව්‍යයක්' },
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
function getSinhalaGraphemes(text) {
  if (!text) return [];
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('si-LK', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (s) => s.segment).filter((s) => s.trim().length > 0);
  }
  return text.match(/[\u0D80-\u0DFF][\u0DCA-\u0DF3]*/g) || text.split('');
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

// ── Precision 2D Canvas Tracing Evaluator for Sinhala Handwriting ──
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
    <div className="w-full bg-white rounded-3xl border-3 border-sky-300 shadow-inner p-3 relative h-48 sm:h-56 flex flex-col justify-center overflow-hidden">
      {/* Top action toolbar (Pen, Eraser, Clear All) */}
      {!disabled && (
        <div className="absolute top-2 right-3 z-20 flex items-center gap-1.5 bg-slate-100/90 backdrop-blur-xs p-1 rounded-full border border-sky-200 shadow-xs">
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

// ── Main Grade 4 Level 1 Activity 2 Component ──
export default function SinhalaGrade4Level1Act2({ onExit }) {
  const navigate = useNavigate();
  const slateRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasTraced, setHasTraced] = useState(false);
  const [stepFeedback, setStepFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isAllDone, setIsAllDone] = useState(false);

  const currentQ = GRADE4_L1_ACT2_QUESTIONS[currentIndex];

  useEffect(() => {
    setSelectedOption(null);
    setIsConfirmed(false);
    setHasTraced(false);
    setStepFeedback(null);
    const timer = setTimeout(() => {
      speakSinhala(currentQ.voicePrompt);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleSelectOption = (opt) => {
    if (isConfirmed) return;
    playSound('click');
    setSelectedOption(opt);
    speakSinhala(opt.text);
    setStepFeedback(null);
  };

  const getTraceFeedback = (traceResult) => {
    if (traceResult.reason === 'empty') {
      return {
        speech: 'කරුණාකර තිත් ඉරි මත අකුරු ලියන්න.',
        text: 'කරුණාකර තිත් ඉරි මත අකුරු ලියන්න. ✍️'
      };
    }
    if (traceResult.reason === 'off_track') {
      return {
        speech: 'අකුරු ලිවීම වැරදියි. කරුණාකර තිත් ඉරි මත පමණක් නිවැරදිව ලියන්න.',
        text: 'අකුරු ලිවීම වැරදියි! කරුණාකර තිත් ඉරි මත පමණක් ලියන්න. (පිටතට නොයන්න) ✍️'
      };
    }
    if (traceResult.reason === 'missing_letters') {
      return {
        speech: 'අකුරු ලිවීම අසම්පූර්ණයි. කරුණාකර සියලුම අකුරු ලියා අවසන් කරන්න.',
        text: 'අකුරු ලිවීම අසම්පූර්ණයි! කරුණාකර සියලුම අකුරු ලියා අවසන් කරන්න. ✍️'
      };
    }
    return {
      speech: 'අකුරු ලිවීම ප්‍රමාණවත් නැත. කරුණාකර සම්පූර්ණ අකුරු ලියන්න.',
      text: 'අකුරු ලිවීම ප්‍රමාණවත් නැත! කරුණාකර සම්පූර්ණ අකුරු ලියන්න. ✍️'
    };
  };

  const handleConfirm = () => {
    if (isConfirmed) return;
    playSound('click');

    if (!selectedOption) {
      playSound('wrong');
      speakSinhala('කරුණාකර පළමුව අයත් නොවන වචනය තෝරන්න.');
      setStepFeedback({ isCorrect: false, text: 'කරුණාකර වචනයක් තෝරා තිත් ඉරි මත ලියන්න.' });
      return;
    }

    const isChoiceCorrect = selectedOption.isOdd;
    const traceResult = slateRef.current?.checkTracing() || { isComplete: false, reason: 'empty' };
    const isTraceCorrect = traceResult.isComplete;

    if (isChoiceCorrect && isTraceCorrect) {
      playSound('correct');
      setScore((prev) => prev + 20);
      speakSinhala('විශිෂ්ටයි! ඔබ තෝරාගත් පිළිතුර සහ අකුරු ලිවීම නිවැරදියි.');
      setStepFeedback({ isCorrect: true, text: 'විශිෂ්ටයි! ඔබ තෝරාගත් පිළිතුර සහ අකුරු ලිවීම නිවැරදියි! 🌟' });
    } else {
      playSound('wrong');
      if (!isChoiceCorrect) {
        speakSinhala(`පිළිතුර වැරදියි. නිවැරදි පිළිතුර ${currentQ.correctWord} වේ.`);
        setStepFeedback({ isCorrect: false, text: `පිළිතුර වැරදියි! නිවැරදි පිළිතුර: ${currentQ.correctWord}` });
      } else {
        const fb = getTraceFeedback(traceResult);
        speakSinhala('පිළිතුර නිවැරදියි, නමුත් අකුරු ලිවීම වැරදියි.');
        setStepFeedback({ isCorrect: false, text: `පිළිතුර නිවැරදියි, නමුත් ${fb.text}` });
      }
    }
    setIsConfirmed(true);
  };

  const handleNext = () => {
    if (!isConfirmed) {
      playSound('wrong');
      speakSinhala('කරුණාකර පළමුව තහවුරු කරන්න.');
      return;
    }
    playSound('click');
    if (currentIndex < GRADE4_L1_ACT2_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
      if (score >= 80) {
        playSound('correct');
        speakSinhala('විශිෂ්ටයි! ඔබ සාර්ථකව අවසන් කළා.');
      } else if (score >= 40) {
        speakSinhala('හොඳ උත්සාහයක්! නැවත පුහුණු වන්න.');
      } else {
        speakSinhala('නැවත උත්සාහ කර ලකුණු වැඩිකර ගන්න.');
      }
    }
  };

  const handleResetActivity = () => {
    playSound('click');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsConfirmed(false);
    setHasTraced(false);
    setStepFeedback(null);
    setScore(0);
    setIsAllDone(false);
  };

  if (isAllDone) {
    const isHigh = score >= 80;
    const isMedium = score >= 40 && score < 80;

    const completionTitle = isHigh
      ? 'විශිෂ්ටයි!'
      : isMedium
      ? 'හොඳ උත්සාහයක්!'
      : 'නැවත උත්සාහ කරමු!';

    const completionDesc = isHigh
      ? 'ඔබ 4 ශ්‍රේණිය Level 1 Activity 2 සාර්ථකව අවසන් කළා!'
      : isMedium
      ? 'තව ටිකක් පුහුණු වී සියලුම ලකුණු ලබා ගන්න!'
      : 'නැවත උත්සාහ කර නිවැරදි පිළිතුරු හා අකුරු ලිවීම පුහුණු වන්න.';

    const titleColor = isHigh
      ? 'text-purple-800'
      : isMedium
      ? 'text-amber-600'
      : 'text-rose-600';

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-purple-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <h1 className={`text-4xl font-extrabold ${titleColor} mb-2`}>{completionTitle}</h1>
          <p className="text-slate-600 text-lg mb-2">{completionDesc}</p>
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
              onClick={handleResetActivity}
              className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-lg rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              <span>නැවත කරන්න</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-4"
      style={{ backgroundImage: "url('/images/grade4_bg.png')" }}
    >
      
      {/* ── TOP HEADER BAR (Matching Exercise 1) ── */}
      <div className="max-w-5xl mx-auto w-full px-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Pink Home Button */}
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="w-12 h-12 bg-gradient-to-b from-rose-400 to-rose-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-4 border-white cursor-pointer active:scale-95 transition-transform shrink-0"
            title="Dashboard"
          >
            🏠
          </button>

          {/* Center Purple Activity Ribbon */}
          <div className="px-6 sm:px-8 py-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-black text-lg sm:text-xl rounded-2xl shadow-lg border-2 border-purple-300 flex items-center gap-2">
            <span className="text-yellow-300 text-lg">⭐</span>
            <span>Activity 2</span>
            <span className="text-yellow-300 text-lg">⭐</span>
          </div>

          {/* Score Pill & Owl Mascot */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-[#FFFDF6] px-4 py-1.5 rounded-2xl font-black text-slate-800 text-base sm:text-lg shadow-md border-2 border-amber-200 flex items-center gap-2">
              <span className="text-yellow-400 text-2xl drop-shadow-xs">⭐</span>
              <span>{score}</span>
            </div>
            <div className="text-3xl filter drop-shadow-md select-none pointer-events-none" title="Mascot">
              🦉
            </div>
          </div>
        </div>

        {/* Mascot Prompt Banner */}
        <div className="w-full mt-2.5 bg-[#FFFDE8] rounded-full py-2 px-5 shadow-sm border-2 border-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p className="text-sm sm:text-base md:text-lg font-bold text-slate-800">
              කණ්ඩායමට නොගැළපෙන අයත් නොවන වචනය තෝරා තිත් ඉරි මත ලියන්න.
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: 4 ILLUSTRATED CARDS + 3-LINE TRACING BOARD ── */}
      <div className="max-w-5xl mx-auto w-full px-4 my-2 flex-1 flex flex-col justify-center">
        <div className="bg-[#FFFDF6] rounded-[2.5rem] p-5 sm:p-7 shadow-2xl border-4 border-amber-100/90 flex flex-col gap-4">
          
          {/* Question Badge Header */}
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                {currentQ.num}
              </div>
              <span className="text-base sm:text-lg font-black text-slate-800">ප්‍රශ්නය {currentQ.num} / 5</span>
            </div>
          </div>

          {/* 4 Illustrated Option Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-1">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption?.id === opt.id;
              const isOdd = opt.isOdd;

              let cardBg = 'bg-white hover:bg-amber-50/60 border-slate-200 shadow-md';
              if (isSelected) {
                cardBg = 'bg-gradient-to-b from-rose-50 to-pink-100 border-rose-500 ring-4 ring-rose-300 shadow-xl scale-102';
              }
              if (isConfirmed) {
                if (isOdd) {
                  cardBg = 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-300 shadow-xl scale-102';
                } else if (isSelected) {
                  cardBg = 'bg-rose-500 text-white border-rose-600 shadow-xl';
                } else {
                  cardBg = 'bg-slate-100 border-slate-200 opacity-60';
                }
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className={`rounded-3xl p-3.5 border-3 transition-all duration-300 flex flex-col items-center justify-between min-h-[170px] select-none relative overflow-hidden ${cardBg} ${
                    isConfirmed ? 'cursor-default pointer-events-none' : 'cursor-pointer hover:-translate-y-1 active:scale-95'
                  }`}
                >
                  <div className="text-5xl sm:text-6xl drop-shadow-md my-2 group-hover:scale-110 transition-transform pointer-events-none">
                    {opt.emoji}
                  </div>

                  <div className={`w-full text-center py-2 px-1 rounded-xl font-black text-base sm:text-lg border shadow-xs pointer-events-none ${
                    isSelected
                      ? 'bg-rose-600 text-white border-rose-700'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    {opt.text}
                  </div>

                  {isConfirmed && isOdd && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-black shadow-xs">
                      අයත් නොවේ ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 3-Line Handwriting Tracing Board (Exercise 1 UI Style) */}
          <div className="w-full mt-2">
            <Grade4RuledTracingSlate
              ref={slateRef}
              targetText={selectedOption ? selectedOption.text : ''}
              fontSize={selectedOption?.text && selectedOption.text.length > 5 ? 82 : 98}
              onTraceChange={setHasTraced}
              disabled={isConfirmed}
            />
          </div>

        </div>

        {/* Step Confirmation Feedback Notification Banner */}
        {stepFeedback && (
          <div
            className={`max-w-5xl mx-auto w-full mt-4 sm:mt-5 px-5 py-3.5 rounded-2xl border-2 flex items-center justify-between shadow-md transition-all animate-bounce-short ${
              stepFeedback.isCorrect
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-rose-50 border-rose-400 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2.5 font-black text-sm sm:text-base">
              <span className="text-2xl">{stepFeedback.isCorrect ? '✅' : '❌'}</span>
              <span>{stepFeedback.text}</span>
            </div>
            {isConfirmed && (
              <span className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full animate-pulse ${
                stepFeedback.isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
              }`}>
                දැන් 'ඊළඟට' ක්ලික් කරන්න ➔
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── BOTTOM CONTROLS BAR (Confirm Button, Star Progress Track, Pink Next Button) ── */}
      <div className="max-w-5xl mx-auto w-full px-4 mt-1 mb-2">
        <div className="flex items-center justify-between gap-3">
          
          {/* Confirm Action Button */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmed}
            className={`font-black text-sm sm:text-base px-6 sm:px-8 py-2.5 rounded-full shadow-lg border-2 border-white flex items-center gap-2 transition-all shrink-0 ${
              isConfirmed
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
                : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer active:scale-95 shadow-lg'
            }`}
          >
            <span>✓</span>
            <span>{isConfirmed ? 'තහවුරු කරන ලදී' : 'තහවුරු කරන්න'}</span>
          </button>

          {/* Star Progress Bar */}
          <div className="flex items-center gap-2 bg-[#FFFDE8] border-2 border-amber-200 rounded-full px-4 py-2 shadow-sm">
            <span className="text-yellow-400 text-xl">⭐</span>
            <div className="bg-amber-950/20 w-32 sm:w-56 h-3.5 rounded-full overflow-hidden p-0.5 border border-amber-300 shadow-inner">
              <div 
                className="bg-gradient-to-r from-lime-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / 5) * 100}%` }}
              />
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-700">{currentIndex + 1}/5</span>
          </div>

          {/* Pink Glossy Next Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!isConfirmed}
            className={`font-black text-base sm:text-lg px-6 sm:px-8 py-2.5 rounded-full shadow-lg border-2 border-white flex items-center gap-2 transition-all shrink-0 ${
              isConfirmed
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white cursor-pointer active:scale-95 animate-pulse shadow-xl ring-4 ring-rose-300'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{currentIndex === GRADE4_L1_ACT2_QUESTIONS.length - 1 ? 'අවසන්' : 'ඊළඟට'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
