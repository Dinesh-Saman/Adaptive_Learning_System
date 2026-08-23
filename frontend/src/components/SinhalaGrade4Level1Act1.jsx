import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';

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
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {
    console.error('Audio playback error:', e);
  }
}

// ── Native Sinhala Text-to-Speech (TTS) ──
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

  // Pass 1: Top-Left to Bottom-Right
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

  // Pass 2: Bottom-Right to Top-Left
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

// ── Authentic Natural Wicker Basket Matching User's Mockup UI ──
function RealisticWickerBasket({ slotColor = 'emerald', arrowColor = 'text-emerald-700', dropBorder = 'border-emerald-400', dropBg = 'bg-emerald-50/70', isOver = false }) {
  return (
    <div className="relative w-full max-w-[240px] aspect-[16/11] flex items-center justify-center select-none">
      <svg viewBox="0 0 280 200" className="w-full h-full drop-shadow-md select-none pointer-events-none">
        <defs>
          <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="20%" stopColor="#B45309" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="80%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id="basketRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="40%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id="basketBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="35%" stopColor="#D97706" />
            <stop offset="85%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id="basketInside" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451A03" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        {/* 1. Large Arch Handle */}
        <path
          d="M 45 105 C 45 15, 235 15, 235 105"
          fill="none"
          stroke="#78350F"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M 45 105 C 45 15, 235 15, 235 105"
          fill="none"
          stroke="url(#handleGrad)"
          strokeWidth="13"
          strokeLinecap="round"
        />
        {/* Handle wrap details */}
        {[60, 85, 110, 140, 170, 195, 220].map((x, i) => (
          <ellipse key={i} cx={x} cy={30 + Math.abs(140 - x) * 0.45} rx="4" ry="7" fill="#78350F" opacity="0.6" transform={`rotate(${ (x - 140) * 0.4 } ${x} ${30 + Math.abs(140 - x) * 0.45})`} />
        ))}

        {/* 2. Basket Interior (Dark Depths) */}
        <ellipse cx="140" cy="110" rx="112" ry="34" fill="url(#basketInside)" />

        {/* 3. Basket Body (Outer Bowl) */}
        <path
          d="M 24 108 C 30 168, 80 195, 140 195 C 200 195, 250 168, 256 108 Z"
          fill="url(#basketBody)"
        />

        {/* Woven Horizontal Ribs */}
        <path d="M 34 130 C 70 156, 210 156, 246 130" fill="none" stroke="#92400E" strokeWidth="4" opacity="0.75" />
        <path d="M 50 152 C 80 174, 200 174, 230 152" fill="none" stroke="#92400E" strokeWidth="4" opacity="0.75" />
        <path d="M 75 174 C 100 188, 180 188, 205 174" fill="none" stroke="#92400E" strokeWidth="4" opacity="0.75" />

        {/* Woven Vertical Cross-hatches */}
        {[52, 76, 100, 124, 140, 156, 180, 204, 228].map((x, i) => (
          <path
            key={i}
            d={`M ${x} 110 C ${x + (x < 140 ? 8 : -8)} 148, ${x + (x < 140 ? 14 : -14)} 178, ${140 + (x - 140) * 0.68} 193`}
            fill="none"
            stroke="#78350F"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        ))}

        {/* 4. Thick Front Rim */}
        <ellipse cx="140" cy="108" rx="118" ry="22" fill="none" stroke="#78350F" strokeWidth="13" />
        <ellipse cx="140" cy="108" rx="118" ry="22" fill="none" stroke="url(#basketRim)" strokeWidth="9" />
        <ellipse cx="140" cy="106" rx="114" ry="18" fill="none" stroke="#FEF08A" strokeWidth="2.5" opacity="0.8" />
      </svg>

      {/* Inside Basket Drop Zone Slot with Down Arrow ↓ */}
      <div className="absolute top-[28%] inset-x-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <div className={`px-5 py-2 rounded-2xl border-2 border-dashed ${dropBorder} ${dropBg} flex items-center justify-center shadow-xs transition-transform ${isOver ? 'scale-115 bg-white/95 ring-4 ring-amber-300' : ''}`}>
          <span className={`text-2xl font-black ${arrowColor} animate-bounce-short`}>↓</span>
        </div>
      </div>
    </div>
  );
}

// ── Cute Blue Bunny Mascot for Step 3 ──
function BlueBunnyMascot() {
  return (
    <div className="relative shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md select-none">
        {/* Ears */}
        <ellipse cx="36" cy="22" rx="9" ry="20" fill="#60A5FA" transform="rotate(-12 36 22)" />
        <ellipse cx="36" cy="22" rx="5" ry="14" fill="#F472B6" transform="rotate(-12 36 22)" />
        
        <ellipse cx="64" cy="22" rx="9" ry="20" fill="#60A5FA" transform="rotate(12 64 22)" />
        <ellipse cx="64" cy="22" rx="5" ry="14" fill="#F472B6" transform="rotate(12 64 22)" />

        {/* Head */}
        <circle cx="50" cy="55" r="28" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2.5" />
        {/* Cheeks */}
        <ellipse cx="34" cy="62" rx="5" ry="3.5" fill="#F472B6" opacity="0.6" />
        <ellipse cx="66" cy="62" rx="5" ry="3.5" fill="#F472B6" opacity="0.6" />

        {/* Big cartoon eyes */}
        <ellipse cx="41" cy="50" rx="4.5" ry="6.5" fill="#1E293B" />
        <circle cx="39" cy="48" r="1.8" fill="#FFFFFF" />
        
        <ellipse cx="59" cy="50" rx="4.5" ry="6.5" fill="#1E293B" />
        <circle cx="57" cy="48" r="1.8" fill="#FFFFFF" />

        {/* Nose & Mouth */}
        <polygon points="50,57 47,54 53,54" fill="#EC4899" />
        <path d="M 46 60 Q 50 64 54 60" fill="none" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ── Cute Illustrated Visual Cards ──
function VisualPeacockCard() {
  return (
    <div className="w-full max-w-[260px] aspect-square rounded-3xl bg-white p-2 shadow-xl border-4 border-emerald-400 flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="w-full h-full rounded-2xl overflow-hidden relative bg-emerald-50 flex items-center justify-center">
        <img
          src="/images/sinhala/peacock.png"
          alt="Peacock"
          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}

function VisualLemonCard() {
  return (
    <div className="w-full max-w-[260px] aspect-square rounded-3xl bg-white p-2 shadow-xl border-4 border-yellow-400 flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="w-full h-full rounded-2xl overflow-hidden relative bg-amber-50 flex items-center justify-center">
        <img
          src="/images/sinhala/lemon.png"
          alt="Lemon"
          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}

function VisualBirdCard() {
  return (
    <div className="w-full max-w-[260px] aspect-square rounded-3xl bg-white p-2 shadow-xl border-4 border-sky-400 flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="w-full h-full rounded-2xl overflow-hidden relative bg-sky-50 flex items-center justify-center p-2">
        <img
          src="/images/sinhala/blue_bird.png"
          alt="Blue Bird"
          className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}

// ── Main Grade 4 Level 1 Activity 1 Component ──
export default function SinhalaGrade4Level1Act1({ onExit }) {
  const navigate = useNavigate();
  const slateRef = useRef(null);

  const [step, setStep] = useState(1); // 1 to 5 steps
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Confirmation & Feedback State
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasTraced, setHasTraced] = useState(false);
  const [stepFeedback, setStepFeedback] = useState(null); // { isCorrect: boolean, text: string }

  // ── Step 1: Peacock Identification ──
  const [step1Selected, setStep1Selected] = useState(null);

  // ── Step 2: Lemon Adjective ──
  const [step2Selected, setStep2Selected] = useState(null);

  // ── Step 3: Basket Sorting ──
  const BASKET_ITEMS = [
    { id: 'item_amba', name: 'අඹ', emoji: '🥭', img: '/images/sinhala/mango_tree.png', targetBasket: 'trees' },
    { id: 'item_pol', name: 'පොල්', emoji: '🌴', img: '/images/sinhala/coconut_tree.jpg', targetBasket: 'trees' },
    { id: 'item_balla', name: 'බල්ලා', emoji: '🐶', img: '/images/sinhala/cute_dog.png', targetBasket: 'animals' },
    { id: 'item_kos', name: 'කොස්', emoji: '🍈', img: '/images/sinhala/jackfruit_tree.png', targetBasket: 'trees' },
    { id: 'item_idda', name: 'මල්', emoji: '🌸', img: '/images/sinhala/rose_flower.png', targetBasket: 'flowers' },
  ];
  const [placedItems, setPlacedItems] = useState({}); // itemId -> basketId
  const [selectedBasketItem, setSelectedBasketItem] = useState(null);
  const [dragOverBasket, setDragOverBasket] = useState(null);

  // ── Step 4: Missing Letters for Blue Bird ──
  const [step4Selected, setStep4Selected] = useState(null);

  // ── Step 5: Sentence Bridge Unjumble ──
  const [bridgeWords, setBridgeWords] = useState([]);

  // Audio prompt per step
  useEffect(() => {
    const prompts = {
      1: 'රූපය බලලා නිවැරදි වචනය තෝරන්න. ඉන්පසු ලියන්න.',
      2: 'පින්තූරයට ගැලපෙන විශේෂණය තෝරා ලියන්න.',
      3: 'වචන කණ්ඩායම් වර්ග කරන්න. නිවැරදි තැනට අදින්න.',
      4: 'පින්තූරය බලා ගැලපෙන අකුරු යොදා හිස්තැන පුරවන්න.',
      5: 'වචන පාලම: නිවැරදි අනුපිළිවෙලට වචන ගලපා වාක්‍යය සකසන්න.'
    };
    const timer = setTimeout(() => {
      speakSinhala(prompts[step]);
    }, 400);
    return () => clearTimeout(timer);
  }, [step]);

  // Step 1 Choice Selection Handler
  const handleStep1Choice = (choice) => {
    playSound('click');
    setStep1Selected(choice);
    setIsConfirmed(false);
    setStepFeedback(null);
    speakSinhala(choice);
  };

  // Step 2 Choice Selection Handler
  const handleStep2Choice = (choice) => {
    playSound('click');
    setStep2Selected(choice);
    setIsConfirmed(false);
    setStepFeedback(null);
    speakSinhala(choice);
  };

  // Step 3 Basket Drop & Click Handlers
  const handlePlaceItemIntoBasket = (itemId, basketKey) => {
    playSound('click');
    const newPlaced = { ...placedItems, [itemId]: basketKey };
    setPlacedItems(newPlaced);
    setSelectedBasketItem(null);
    setIsConfirmed(false);
    setStepFeedback(null);
  };

  const handleRemovePlacedItem = (itemId) => {
    playSound('click');
    const newPlaced = { ...placedItems };
    delete newPlaced[itemId];
    setPlacedItems(newPlaced);
    setIsConfirmed(false);
    setStepFeedback(null);
  };

  // Step 4 Missing Letters Choice Handler
  const handleStep4Choice = (choice) => {
    playSound('click');
    setStep4Selected(choice);
    setIsConfirmed(false);
    setStepFeedback(null);
    speakSinhala(choice);
  };

  // Step 5 Sentence Bridge Handler
  const handleBridgeWordClick = (word) => {
    playSound('click');
    setIsConfirmed(false);
    setStepFeedback(null);
    if (bridgeWords.includes(word)) {
      setBridgeWords(bridgeWords.filter((w) => w !== word));
    } else {
      setBridgeWords([...bridgeWords, word]);
    }
  };

  // Helper to format detailed tracing feedback based on exact error reason
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

  // Confirm Button Handler (Finalizes attempt, locks question, unlocks Next button)
  const handleConfirm = () => {
    if (isConfirmed) return;
    playSound('click');

    if (step === 1) {
      if (!step1Selected) {
        playSound('wrong');
        speakSinhala('කරුණාකර පළමුව පිළිතුරක් තෝරන්න.');
        setStepFeedback({ isCorrect: false, text: 'කරුණාකර පිළිතුරක් තෝරා තිත් ඉරි මත ලියන්න.' });
        return;
      }

      const isChoiceCorrect = step1Selected === 'මයුරා';
      const traceResult = slateRef.current?.checkTracing() || { isComplete: false, reason: 'empty' };
      const isTraceCorrect = traceResult.isComplete;

      if (isChoiceCorrect && isTraceCorrect) {
        playSound('correct');
        setScore((s) => s + 20);
        speakSinhala('විශිෂ්ටයි! ඔබ තෝරාගත් පිළිතුර සහ අකුරු ලිවීම නිවැරදියි.');
        setStepFeedback({ isCorrect: true, text: 'විශිෂ්ටයි! ඔබ තෝරාගත් පිළිතුර සහ අකුරු ලිවීම නිවැරදියි! 🌟' });
      } else {
        playSound('wrong');
        if (!isChoiceCorrect) {
          speakSinhala('පිළිතුර වැරදියි. නිවැරදි පිළිතුර මයුරා වේ.');
          setStepFeedback({ isCorrect: false, text: 'පිළිතුර වැරදියි! නිවැරදි පිළිතුර: මයුරා' });
        } else {
          const fb = getTraceFeedback(traceResult);
          speakSinhala('පිළිතුර නිවැරදියි, නමුත් අකුරු ලිවීම වැරදියි.');
          setStepFeedback({ isCorrect: false, text: `පිළිතුර නිවැරදියි, නමුත් ${fb.text}` });
        }
      }
      setIsConfirmed(true);
    } else if (step === 2) {
      if (!step2Selected) {
        playSound('wrong');
        speakSinhala('කරුණාකර පළමුව පිළිතුරක් තෝරන්න.');
        setStepFeedback({ isCorrect: false, text: 'කරුණාකර විශේෂණයක් තෝරා තිත් ඉරි මත ලියන්න.' });
        return;
      }

      const isChoiceCorrect = step2Selected === 'ඇඹුල්';
      const traceResult = slateRef.current?.checkTracing() || { isComplete: false, reason: 'empty' };
      const isTraceCorrect = traceResult.isComplete;

      if (isChoiceCorrect && isTraceCorrect) {
        playSound('correct');
        setScore((s) => s + 20);
        speakSinhala('විශිෂ්ටයි! ඔබ තෝරාගත් පිළිතුර සහ අකුරු ලිවීම නිවැරදියි.');
        setStepFeedback({ isCorrect: true, text: 'විශිෂ්ටයි! ඔබ තෝරාගත් පිළිතුර සහ අකුරු ලිවීම නිවැරදියි! 🌟' });
      } else {
        playSound('wrong');
        if (!isChoiceCorrect) {
          speakSinhala('පිළිතුර වැරදියි. නිවැරදි පිළිතුර ඇඹුල් වේ.');
          setStepFeedback({ isCorrect: false, text: 'පිළිතුර වැරදියි! නිවැරදි පිළිතුර: ඇඹුල්' });
        } else {
          const fb = getTraceFeedback(traceResult);
          speakSinhala('පිළිතුර නිවැරදියි, නමුත් අකුරු ලිවීම වැරදියි.');
          setStepFeedback({ isCorrect: false, text: `පිළිතුර නිවැරදියි, නමුත් ${fb.text}` });
        }
      }
      setIsConfirmed(true);
    } else if (step === 3) {
      const placedCount = Object.keys(placedItems).length;
      if (placedCount === 0) {
        playSound('wrong');
        speakSinhala('කරුණාකර වචන කූඩ වලට වර්ග කරන්න.');
        setStepFeedback({ isCorrect: false, text: 'කරුණාකර වචන කූඩ වලට දමා තහවුරු කරන්න.' });
        return;
      }

      const allCorrect = placedCount === BASKET_ITEMS.length && BASKET_ITEMS.every((it) => placedItems[it.id] === it.targetBasket);
      if (allCorrect) {
        playSound('correct');
        setScore((s) => s + 20);
        speakSinhala('විශිෂ්ටයි! සියලුම වචන නිවැරදිව වර්ග කර ඇත.');
        setStepFeedback({ isCorrect: true, text: 'විශිෂ්ටයි! සියලුම වචන නිවැරදිව වර්ග කර ඇත! 🌟' });
      } else {
        playSound('wrong');
        speakSinhala('වර්ග කිරීම වැරදියි. නිවැරදි වර්ග කිරීම බලන්න.');
        setStepFeedback({ isCorrect: false, text: 'වර්ග කිරීම වැරදියි! (ගස්: අඹ, පොල්, කොස් | මල්: මල් | සතුන්: බල්ලා)' });
      }
      setIsConfirmed(true);
    } else if (step === 4) {
      if (!step4Selected) {
        playSound('wrong');
        speakSinhala('කරුණාකර පළමුව අකුරු තෝරන්න.');
        setStepFeedback({ isCorrect: false, text: 'කරුණාකර අකුරු තෝරා තිත් ඉරි මත ලියන්න.' });
        return;
      }

      const isChoiceCorrect = step4Selected === 'කුරුල්ලා';
      const traceResult = slateRef.current?.checkTracing() || { isComplete: false, reason: 'empty' };
      const isTraceCorrect = traceResult.isComplete;

      if (isChoiceCorrect && isTraceCorrect) {
        playSound('correct');
        setScore((s) => s + 20);
        speakSinhala('විශිෂ්ටයි! ඔබ තෝරාගත් පිළිතුර සහ අකුරු ලිවීම නිවැරදියි.');
        setStepFeedback({ isCorrect: true, text: 'විශිෂ්ටයි! ඔබ තෝරාගත් පිළිතුර සහ අකුරු ලිවීම නිවැරදියි! 🌟' });
      } else {
        playSound('wrong');
        if (!isChoiceCorrect) {
          speakSinhala('පිළිතුර වැරදියි. නිවැරදි පිළිතුර කුරුල්ලා වේ.');
          setStepFeedback({ isCorrect: false, text: 'පිළිතුර වැරදියි! නිවැරදි පිළිතුර: කුරුල්ලා' });
        } else {
          const fb = getTraceFeedback(traceResult);
          speakSinhala('පිළිතුර නිවැරදියි, නමුත් අකුරු ලිවීම වැරදියි.');
          setStepFeedback({ isCorrect: false, text: `පිළිතුර නිවැරදියි, නමුත් ${fb.text}` });
        }
      }
      setIsConfirmed(true);
    } else if (step === 5) {
      if (bridgeWords.length === 0) {
        playSound('wrong');
        speakSinhala('කරුණාකර වචන පාලම මත තබන්න.');
        setStepFeedback({ isCorrect: false, text: 'කරුණාකර වචන පාලම මත තබා තහවුරු කරන්න.' });
        return;
      }

      const isSentenceCorrect = bridgeWords.join(' ') === 'අම්මා ආහාර උයයි';
      const traceResult = slateRef.current?.checkTracing() || { isComplete: false, reason: 'empty' };
      const isTraceCorrect = traceResult.isComplete;

      if (isSentenceCorrect && isTraceCorrect) {
        playSound('correct');
        setScore((s) => s + 20);
        speakSinhala('විශිෂ්ටයි! අම්මා ආහාර උයයි. වාක්‍යය සහ ලිවීම නිවැරදියි.');
        setStepFeedback({ isCorrect: true, text: 'විශිෂ්ටයි! අම්මා ආහාර උයයි. වාක්‍යය සහ ලිවීම නිවැරදියි! 🌟' });
      } else {
        playSound('wrong');
        if (!isSentenceCorrect) {
          speakSinhala('වාක්‍යය වැරදියි. නිවැරදි පිළිතුර: අම්මා ආහාර උයයි.');
          setStepFeedback({ isCorrect: false, text: 'වාක්‍යය වැරදියි! නිවැරදි පිළිතුර: අම්මා ආහාර උයයි' });
        } else {
          const fb = getTraceFeedback(traceResult);
          speakSinhala('වාක්‍යය නිවැරදියි, නමුත් ලිවීම වැරදියි.');
          setStepFeedback({ isCorrect: false, text: `වාක්‍යය නිවැරදියි, නමුත් ${fb.text}` });
        }
      }
      setIsConfirmed(true);
    }
  };

  // Next Step Handler (Requires Confirmation First)
  const handleNextStep = () => {
    if (!isConfirmed) {
      playSound('wrong');
      speakSinhala('කරුණාකර පළමුව තහවුරු කරන්න.');
      return;
    }
    playSound('click');
    setIsConfirmed(false);
    setStepFeedback(null);
    setHasTraced(false);
    if (step < 5) {
      setStep((s) => s + 1);
    } else {
      setIsCompleted(true);
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

  // Full Activity Reset Handler
  const handleResetActivity = () => {
    playSound('click');
    setStep(1);
    setScore(0);
    setIsCompleted(false);
    setIsConfirmed(false);
    setHasTraced(false);
    setStepFeedback(null);
    setStep1Selected(null);
    setStep2Selected(null);
    setPlacedItems({});
    setSelectedBasketItem(null);
    setDragOverBasket(null);
    setStep4Selected(null);
    setBridgeWords([]);
  };

  if (isCompleted) {
    const isHigh = score >= 80;
    const isMedium = score >= 40 && score < 80;

    const completionTitle = isHigh
      ? 'විශිෂ්ටයි!'
      : isMedium
      ? 'හොඳ උත්සාහයක්!'
      : 'නැවත උත්සාහ කරමු!';

    const completionDesc = isHigh
      ? 'ඔබ 4 ශ්‍රේණිය Level 1 Activity 1 සාර්ථකව අවසන් කළා!'
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
      
      {/* ── TOP HEADER BAR (Mockup: Home button, Center Activity Ribbon, Score & Owl Mascot) ── */}
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
            <span>Activity 1</span>
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
              {step === 1 && 'රූපය බලලා නිවැරදි වචනය තෝරන්න. ඉන්පසු ලියන්න.'}
              {step === 2 && 'පින්තූරයට ගැලපෙන විශේෂණය තෝරා ලියන්න.'}
              {step === 3 && 'වචන කණ්ඩායම් වර්ග කරන්න. නිවැරදි තැනට අදින්න.'}
              {step === 4 && 'පින්තූරය බලා ගැලපෙන අකුරු යොදා හිස්තැන පුරවන්න.'}
              {step === 5 && 'වචන පාලම: නිවැරදි අනුපිළිවෙලට වචන ගලපා වාක්‍යය සකසන්න.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── STEP WORKSPACES ── */}
      <div className="max-w-5xl mx-auto w-full px-4 my-2 flex-1 flex flex-col justify-center">
        
        {/* ── STEP 1: Peacock ── */}
        {step === 1 && (
          <div className="bg-[#FFFDF6] rounded-[2.5rem] p-5 sm:p-7 shadow-2xl border-4 border-amber-100/90 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6">
              
              {/* Left Column: Image Card + Star Character Hint */}
              <div className="w-full md:w-[260px] shrink-0 flex flex-col gap-3 justify-between">
                <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-emerald-50">
                  <img
                    src="/images/sinhala/peacock.png"
                    alt="Peacock"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Cute Star Character Hint Bubble */}
                <div className="flex items-center gap-2.5 bg-rose-50/90 border border-rose-200/80 rounded-2xl p-2.5 shadow-xs">
                  <span className="text-3xl animate-bounce-short">⭐</span>
                  <p className="text-xs sm:text-sm font-bold text-rose-950 leading-tight">
                    නිවැරදි වචනය තෝරා, කොටුවේ ගානට පුහුණු වන්න.
                  </p>
                </div>
              </div>

              {/* Right Column: 3 Horizontal Buttons + 3-Line Tracing Board */}
              <div className="flex-1 flex flex-col gap-4 justify-between w-full">
                
                {/* 3 Horizontal Answer Buttons in 1 Row */}
                <div className="grid grid-cols-3 gap-3 w-full">
                  {[
                    { label: 'මයුරා', normal: 'bg-[#FF5E7E] hover:bg-[#FF476C] text-white', active: 'bg-[#E63956] text-white shadow-xl scale-102' },
                    { label: 'හාවා', normal: 'bg-[#00B4D8] hover:bg-[#0096C7] text-white', active: 'bg-[#0077B6] text-white shadow-xl scale-102' },
                    { label: 'බල්ලා', normal: 'bg-[#FFB703] hover:bg-[#FB8500] text-slate-950', active: 'bg-[#F77F00] text-slate-950 shadow-xl scale-102' }
                  ].map((opt) => {
                    let btnClass = step1Selected === opt.label ? opt.active : opt.normal;
                    if (isConfirmed) {
                      if (opt.label === 'මයුරා') {
                        btnClass = 'bg-emerald-500 text-white ring-4 ring-emerald-300 shadow-xl scale-102';
                      } else if (step1Selected === opt.label) {
                        btnClass = 'bg-rose-600 text-white ring-4 ring-rose-300 shadow-xl';
                      }
                    }
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        disabled={isConfirmed}
                        onClick={() => {
                          if (!isConfirmed) handleStep1Choice(opt.label);
                        }}
                        className={`py-4 px-3 rounded-2xl font-black text-xl sm:text-2xl shadow-md transition-all select-none active:scale-95 text-center border-0 outline-none ${btnClass} ${
                          isConfirmed ? 'cursor-default pointer-events-none' : 'cursor-pointer'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* 3-Line Handwriting Tracing Board with Large Dotted Letters (Shows letters only after selecting) */}
                <div className="w-full flex-1">
                  <Grade4RuledTracingSlate ref={slateRef} targetText={step1Selected || ''} fontSize={98} onTraceChange={setHasTraced} disabled={isConfirmed} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Lemon Adjective ── */}
        {step === 2 && (
          <div className="bg-[#FFFDF6] rounded-[2.5rem] p-5 sm:p-7 shadow-2xl border-4 border-amber-100/90 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6">
              
              {/* Left Column: Lemon Image Card + Star Character Hint */}
              <div className="w-full md:w-[260px] shrink-0 flex flex-col gap-3 justify-between">
                <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-amber-50">
                  <img
                    src="/images/sinhala/lemon.png"
                    alt="Lemon"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Cute Star Character Hint Bubble */}
                <div className="flex items-center gap-2.5 bg-rose-50/90 border border-rose-200/80 rounded-2xl p-2.5 shadow-xs">
                  <span className="text-3xl animate-bounce-short">⭐</span>
                  <p className="text-xs sm:text-sm font-bold text-rose-950 leading-tight">
                    ගැලපෙන විශේෂණය තෝරා, කොටුවේ ගානට පුහුණු වන්න.
                  </p>
                </div>
              </div>

              {/* Right Column: 3 Horizontal Buttons + 3-Line Tracing Board */}
              <div className="flex-1 flex flex-col gap-4 justify-between w-full">
                
                {/* 3 Horizontal Answer Buttons in 1 Row */}
                <div className="grid grid-cols-3 gap-3 w-full">
                  {[
                    { label: 'ඇඹුල්', normal: 'bg-[#FF5E7E] hover:bg-[#FF476C] text-white', active: 'bg-[#E63956] text-white shadow-xl scale-102' },
                    { label: 'මිහිරි', normal: 'bg-[#00B4D8] hover:bg-[#0096C7] text-white', active: 'bg-[#0077B6] text-white shadow-xl scale-102' },
                    { label: 'උණු', normal: 'bg-[#FFB703] hover:bg-[#FB8500] text-slate-950', active: 'bg-[#F77F00] text-slate-950 shadow-xl scale-102' }
                  ].map((opt) => {
                    let btnClass = step2Selected === opt.label ? opt.active : opt.normal;
                    if (isConfirmed) {
                      if (opt.label === 'ඇඹුල්') {
                        btnClass = 'bg-emerald-500 text-white ring-4 ring-emerald-300 shadow-xl scale-102';
                      } else if (step2Selected === opt.label) {
                        btnClass = 'bg-rose-600 text-white ring-4 ring-rose-300 shadow-xl';
                      }
                    }
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        disabled={isConfirmed}
                        onClick={() => {
                          if (!isConfirmed) handleStep2Choice(opt.label);
                        }}
                        className={`py-4 px-3 rounded-2xl font-black text-xl sm:text-2xl shadow-md transition-all select-none active:scale-95 text-center border-0 outline-none ${btnClass} ${
                          isConfirmed ? 'cursor-default pointer-events-none' : 'cursor-pointer'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* 3-Line Handwriting Tracing Board (Shows letters only after selecting) */}
                <div className="w-full flex-1">
                  <Grade4RuledTracingSlate ref={slateRef} targetText={step2Selected || ''} fontSize={98} onTraceChange={setHasTraced} disabled={isConfirmed} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Word Basket Sorting (Exact Mockup UI) ── */}
        {step === 3 && (
          <div className="bg-[#FFFDF6] rounded-[2.5rem] p-4 sm:p-6 shadow-2xl border-4 border-amber-100/90 flex flex-col gap-4">
            
            {/* 3 Top Cards (ගස්, මල්, සතුන්) */}
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 w-full ${isConfirmed ? 'pointer-events-none' : ''}`}>
              {[
                { 
                  id: 'trees', 
                  label: 'ගස්', 
                  emoji: '🌳', 
                  headerBg: 'bg-gradient-to-r from-emerald-100 to-lime-100', 
                  headerBorder: 'border-emerald-300',
                  cardBorder: 'border-emerald-400',
                  slotColor: 'emerald',
                  arrowColor: 'text-emerald-700',
                  dropBorder: 'border-emerald-400',
                  dropBg: 'bg-emerald-50/70',
                },
                { 
                  id: 'flowers', 
                  label: 'මල්', 
                  emoji: '🌸', 
                  headerBg: 'bg-gradient-to-r from-sky-100 to-blue-100', 
                  headerBorder: 'border-sky-300',
                  cardBorder: 'border-sky-400',
                  slotColor: 'sky',
                  arrowColor: 'text-sky-700',
                  dropBorder: 'border-sky-400',
                  dropBg: 'bg-sky-50/70',
                },
                { 
                  id: 'animals', 
                  label: 'සතුන්', 
                  emoji: '🐶', 
                  headerBg: 'bg-gradient-to-r from-amber-100 to-orange-100', 
                  headerBorder: 'border-amber-300',
                  cardBorder: 'border-amber-400',
                  slotColor: 'amber',
                  arrowColor: 'text-amber-700',
                  dropBorder: 'border-amber-400',
                  dropBg: 'bg-amber-50/70',
                },
              ].map((b) => {
                const itemsInThisBasket = BASKET_ITEMS.filter((it) => placedItems[it.id] === b.id);
                const isOver = dragOverBasket === b.id;
                return (
                  <div
                    key={b.id}
                    onDragOver={(e) => {
                      if (isConfirmed) return;
                      e.preventDefault();
                      setDragOverBasket(b.id);
                    }}
                    onDragLeave={() => setDragOverBasket(null)}
                    onDrop={(e) => {
                      if (isConfirmed) return;
                      e.preventDefault();
                      const itemId = e.dataTransfer.getData('text/plain');
                      if (itemId) handlePlaceItemIntoBasket(itemId, b.id);
                      setDragOverBasket(null);
                    }}
                    onClick={() => {
                      if (!isConfirmed && selectedBasketItem) {
                        handlePlaceItemIntoBasket(selectedBasketItem, b.id);
                      }
                    }}
                    className={`bg-white rounded-3xl p-3 sm:p-4 border-2 ${b.cardBorder} shadow-md flex flex-col items-center justify-between relative transition-all min-h-[220px] ${
                      !isConfirmed && selectedBasketItem ? 'cursor-pointer hover:bg-amber-50/50 hover:shadow-xl ring-2 ring-amber-300' : ''
                    }`}
                  >
                    {/* Header Pill */}
                    <div className={`px-5 py-1.5 rounded-full border-2 ${b.headerBorder} ${b.headerBg} shadow-xs flex items-center justify-center gap-2 mb-1`}>
                      <span className="text-xl">{b.emoji}</span>
                      <span className="text-lg sm:text-xl font-black text-slate-800">{b.label}</span>
                    </div>

                    {/* Basket Illustration with Drop Target Slot */}
                    <div className="relative w-full flex items-center justify-center my-1">
                      <RealisticWickerBasket
                        slotColor={b.slotColor}
                        arrowColor={b.arrowColor}
                        dropBorder={b.dropBorder}
                        dropBg={b.dropBg}
                        isOver={isOver}
                      />

                      {/* Items nested inside the basket bowl */}
                      {itemsInThisBasket.length > 0 && (
                        <div className="absolute bottom-3 inset-x-2 flex flex-wrap gap-1.5 justify-center items-center z-20">
                          {itemsInThisBasket.map((it) => (
                            <div
                              key={it.id}
                              onClick={(e) => {
                                if (isConfirmed) return;
                                e.stopPropagation();
                                handleRemovePlacedItem(it.id);
                              }}
                              className={`px-2.5 py-1 rounded-xl font-black text-xs sm:text-sm border shadow-md flex items-center gap-1.5 ${
                                isConfirmed
                                  ? it.targetBasket === b.id
                                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400 ring-2 ring-emerald-300'
                                    : 'bg-rose-100 text-rose-950 border-rose-400 ring-2 ring-rose-300'
                                  : 'bg-white/95 text-slate-900 border-amber-300 hover:bg-rose-50 cursor-pointer hover:scale-105 active:scale-95 transition-transform'
                              }`}
                              title={isConfirmed ? '' : 'ඉවත් කිරීමට ක්ලික් කරන්න'}
                            >
                              {it.img ? (
                                <img src={it.img} alt={it.name} className="w-4 h-4 sm:w-5 sm:h-5 object-contain pointer-events-none rounded-md" />
                              ) : (
                                <span>{it.emoji}</span>
                              )}
                              <span>{it.name}</span>
                              {!isConfirmed && (
                                <span className="text-slate-400 text-xs hover:text-rose-600 font-bold ml-0.5">✕</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Shelf Tray with Blue Bunny Mascot */}
            <div className={`w-full bg-[#FFE4E6] border-2 border-rose-300 rounded-3xl p-3 sm:p-4 shadow-md flex items-center gap-3 sm:gap-4 relative ${
              isConfirmed ? 'pointer-events-none opacity-80' : ''
            }`}>
              
              {/* Blue Bunny Mascot */}
              <div className="hidden xs:flex shrink-0">
                <BlueBunnyMascot />
              </div>

              {/* Items in a single horizontal row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 flex-1">
                {BASKET_ITEMS.map((it) => {
                  const isPlaced = !!placedItems[it.id];
                  const isSelected = selectedBasketItem === it.id;

                  return (
                    <div
                      key={it.id}
                      draggable={!isPlaced && !isConfirmed}
                      onDragStart={(e) => {
                        if (isConfirmed) return;
                        e.dataTransfer.setData('text/plain', it.id);
                      }}
                      onClick={() => {
                        if (isConfirmed) return;
                        if (isPlaced) {
                          handleRemovePlacedItem(it.id);
                        } else {
                          playSound('click');
                          setSelectedBasketItem(isSelected ? null : it.id);
                          speakSinhala(it.name);
                        }
                      }}
                      className={`bg-white rounded-2xl border-2 p-2.5 shadow-sm flex items-center justify-center gap-2.5 transition-all select-none ${
                        isPlaced
                          ? 'opacity-40 border-dashed border-slate-300 bg-slate-100 cursor-default'
                          : isSelected
                          ? 'border-rose-500 ring-4 ring-rose-300 scale-105 bg-rose-50 cursor-pointer shadow-md'
                          : isConfirmed
                          ? 'border-rose-200 cursor-default'
                          : 'border-rose-200/90 hover:border-rose-400 hover:shadow-md hover:scale-102 cursor-grab active:cursor-grabbing'
                      }`}
                    >
                      {/* Image / Emoji */}
                      {it.img ? (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                          <img
                            src={it.img}
                            alt={it.name}
                            className="w-full h-full object-contain pointer-events-none"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-2xl sm:text-3xl shrink-0 pointer-events-none">{it.emoji}</span>
                      )}

                      {/* Sinhala Text */}
                      <span className="text-base sm:text-lg font-black text-slate-800 pointer-events-none">
                        {it.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── STEP 4: Blue Bird Missing Letters ── */}
        {step === 4 && (
          <div className="bg-[#FFFDF6] rounded-[2.5rem] p-5 sm:p-7 shadow-2xl border-4 border-amber-100/90 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6">
              
              {/* Left Column: Bird Image Card + Star Character Hint */}
              <div className="w-full md:w-[260px] shrink-0 flex flex-col gap-3 justify-between">
                <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-sky-50 flex items-center justify-center p-3">
                  <img
                    src="/images/sinhala/blue_bird.png"
                    alt="Blue Bird"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Cute Star Character Hint Bubble */}
                <div className="flex items-center gap-2.5 bg-rose-50/90 border border-rose-200/80 rounded-2xl p-2.5 shadow-xs">
                  <span className="text-3xl animate-bounce-short">⭐</span>
                  <p className="text-xs sm:text-sm font-bold text-rose-950 leading-tight">
                    ගැලපෙන අකුරු තෝරා, කොටුවේ ගානට පුහුණු වන්න.
                  </p>
                </div>
              </div>

              {/* Right Column: 3 Horizontal Buttons + 3-Line Tracing Board */}
              <div className="flex-1 flex flex-col gap-4 justify-between w-full">
                
                {/* 3 Horizontal Answer Buttons in 1 Row */}
                <div className="grid grid-cols-3 gap-3 w-full">
                  {[
                    { label: 'කු , රු', full: 'කුරුල්ලා', normal: 'bg-[#FF5E7E] hover:bg-[#FF476C] text-white', active: 'bg-[#E63956] text-white shadow-xl scale-102' },
                    { label: 'ප , ටු', full: 'පටුල්ලා', normal: 'bg-[#00B4D8] hover:bg-[#0096C7] text-white', active: 'bg-[#0077B6] text-white shadow-xl scale-102' },
                    { label: 'ඔ , ලු', full: 'ඔලුල්ලා', normal: 'bg-[#FFB703] hover:bg-[#FB8500] text-slate-950', active: 'bg-[#F77F00] text-slate-950 shadow-xl scale-102' }
                  ].map((opt) => {
                    let btnClass = step4Selected === opt.full ? opt.active : opt.normal;
                    if (isConfirmed) {
                      if (opt.full === 'කුරුල්ලා') {
                        btnClass = 'bg-emerald-500 text-white ring-4 ring-emerald-300 shadow-xl scale-102';
                      } else if (step4Selected === opt.full) {
                        btnClass = 'bg-rose-600 text-white ring-4 ring-rose-300 shadow-xl';
                      }
                    }
                    return (
                      <button
                        key={opt.full}
                        type="button"
                        disabled={isConfirmed}
                        onClick={() => {
                          if (!isConfirmed) handleStep4Choice(opt.full);
                        }}
                        className={`py-4 px-3 rounded-2xl font-black text-lg sm:text-xl shadow-md transition-all select-none active:scale-95 text-center border-0 outline-none ${btnClass} ${
                          isConfirmed ? 'cursor-default pointer-events-none' : 'cursor-pointer'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* 3-Line Handwriting Tracing Board (Shows letters only after selecting) */}
                <div className="w-full flex-1">
                  <Grade4RuledTracingSlate ref={slateRef} targetText={step4Selected || ''} fontSize={82} onTraceChange={setHasTraced} disabled={isConfirmed} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: Sentence Bridge Unjumble ── */}
        {step === 5 && (
          <div className="bg-[#FFFDF6] rounded-[2.5rem] p-5 sm:p-7 shadow-2xl border-4 border-amber-100/90 flex flex-col gap-4">
            
            {/* Bridge Illustration Header */}
            <div className="p-4 bg-gradient-to-r from-sky-100 via-indigo-100 to-emerald-100 rounded-3xl border-2 border-indigo-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">👧🌉</span>
                <div>
                  <h3 className="text-base font-black text-indigo-950">වචන පාලම (Sentence Bridge)</h3>
                  <p className="text-xs font-bold text-slate-600">වචන නිවැරදි අනුපිළිවෙලට ක්ලික් කර පාලම මත තබන්න.</p>
                </div>
              </div>
              <span className="text-3xl">🐘</span>
            </div>

            {/* Bridge Slots */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-indigo-300 flex items-center justify-center gap-3 flex-wrap">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`min-w-[100px] h-12 rounded-xl border-2 font-black text-base flex items-center justify-center px-3 shadow-xs ${
                    bridgeWords[idx]
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : 'bg-white border-dashed border-indigo-300 text-indigo-300'
                  }`}
                >
                  {bridgeWords[idx] || `${idx + 1}`}
                </div>
              ))}
              <span className="text-xl font-black text-slate-700">.</span>
            </div>

            {/* Word Blocks to Click */}
            <div className={`flex items-center justify-center gap-3 ${isConfirmed ? 'pointer-events-none' : ''}`}>
              {['උයයි', 'අම්මා', 'ආහාර'].map((w) => {
                const isSelected = bridgeWords.includes(w);
                return (
                  <button
                    key={w}
                    disabled={isConfirmed}
                    onClick={() => {
                      if (!isConfirmed) handleBridgeWordClick(w);
                    }}
                    className={`py-3 px-6 rounded-2xl font-black text-lg shadow-md border-2 transition-all ${
                      isSelected
                        ? 'bg-slate-200 text-slate-400 border-slate-300'
                        : w === 'උයයි'
                        ? 'bg-pink-100 hover:bg-pink-200 text-pink-900 border-pink-300'
                        : w === 'අම්මා'
                        ? 'bg-sky-100 hover:bg-sky-200 text-sky-900 border-sky-300'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
                    } ${isConfirmed ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {w}
                  </button>
                );
              })}
            </div>

            {/* 3-Line Handwriting Tracing Board */}
            <div className="w-full">
              <Grade4RuledTracingSlate
                ref={slateRef}
                targetText={bridgeWords.length === 3 ? 'අම්මා ආහාර උයයි' : ''}
                fontSize={80}
                slateWidth={850}
                onTraceChange={setHasTraced}
                disabled={isConfirmed}
              />
            </div>
          </div>
        )}

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
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-700">{step}/5</span>
          </div>

          {/* Pink Glossy Next Button - Enabled and Active Once Confirmed (Right or Wrong) */}
          <button
            type="button"
            onClick={handleNextStep}
            disabled={!isConfirmed}
            className={`font-black text-base sm:text-lg px-6 sm:px-8 py-2.5 rounded-full shadow-lg border-2 border-white flex items-center gap-2 transition-all shrink-0 ${
              isConfirmed
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white cursor-pointer active:scale-95 animate-pulse shadow-xl ring-4 ring-rose-300'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{step === 5 ? 'අවසන්' : 'ඊළඟට'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
