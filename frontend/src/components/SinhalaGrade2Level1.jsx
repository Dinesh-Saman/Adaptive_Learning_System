import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressionManager } from '../services/grade2ProgressionManager';

// ── Question Bank for Grade 2 Level 1: Letter Identification ──
const QUESTIONS = [
  {
    id: 1,
    targetLetter: 'ක',
    instruction: 'ක අකුර මත ලියන්න.',
    hintWord: 'කපුටා (Kaputa)',
    hintPhoneme: 'ක',
    options: [
      { id: 'i', letter: 'ග', color: 'purple', bg: '#F6EDFF', border: '#D8B4FE', badgeBg: '#9333EA' },
      { id: 'ii', letter: 'ක', color: 'green', bg: '#EDFDF2', border: '#86EFAC', badgeBg: '#16A34A' },
      { id: 'iii', letter: 'ත', color: 'blue', bg: '#EFF6FF', border: '#93C5FD', badgeBg: '#2563EB' },
      { id: 'iv', letter: 'ස', color: 'pink', bg: '#FFF1F5', border: '#F9A8D4', badgeBg: '#DB2777' },
    ],
    correctId: 'ii'
  },
  {
    id: 2,
    targetLetter: 'ර',
    instruction: 'ර අකුර මත ලියන්න.',
    hintWord: 'රතිඤ්ඤා (Rathinna)',
    hintPhoneme: 'ර',
    options: [
      { id: 'i', letter: 'න', color: 'purple', bg: '#F6EDFF', border: '#D8B4FE', badgeBg: '#9333EA' },
      { id: 'ii', letter: 'ර', color: 'green', bg: '#EDFDF2', border: '#86EFAC', badgeBg: '#16A34A' },
      { id: 'iii', letter: 'ම', color: 'blue', bg: '#EFF6FF', border: '#93C5FD', badgeBg: '#2563EB' },
      { id: 'iv', letter: 'ව', color: 'pink', bg: '#FFF1F5', border: '#F9A8D4', badgeBg: '#DB2777' },
    ],
    correctId: 'ii'
  },
  {
    id: 3,
    targetLetter: 'අ',
    instruction: 'අ අකුර මත ලියන්න.',
    hintWord: 'අලියා (Aliya)',
    hintPhoneme: 'අ',
    options: [
      { id: 'i', letter: 'අ', color: 'purple', bg: '#F6EDFF', border: '#D8B4FE', badgeBg: '#9333EA' },
      { id: 'ii', letter: 'ඉ', color: 'green', bg: '#EDFDF2', border: '#86EFAC', badgeBg: '#16A34A' },
      { id: 'iii', letter: 'උ', color: 'blue', bg: '#EFF6FF', border: '#93C5FD', badgeBg: '#2563EB' },
      { id: 'iv', letter: 'එ', color: 'pink', bg: '#FFF1F5', border: '#F9A8D4', badgeBg: '#DB2777' },
    ],
    correctId: 'i'
  },
  {
    id: 4,
    targetLetter: 'ල',
    instruction: 'ල අකුර මත ලියන්න.',
    hintWord: 'ලස්සන (Lassana)',
    hintPhoneme: 'ල',
    options: [
      { id: 'i', letter: 'බ', color: 'purple', bg: '#F6EDFF', border: '#D8B4FE', badgeBg: '#9333EA' },
      { id: 'ii', letter: 'ල', color: 'green', bg: '#EDFDF2', border: '#86EFAC', badgeBg: '#16A34A' },
      { id: 'iii', letter: 'ව', color: 'blue', bg: '#EFF6FF', border: '#93C5FD', badgeBg: '#2563EB' },
      { id: 'iv', letter: 'ස', color: 'pink', bg: '#FFF1F5', border: '#F9A8D4', badgeBg: '#DB2777' },
    ],
    correctId: 'ii'
  },
  {
    id: 5,
    targetLetter: 'ට',
    instruction: 'ට අකුර මත ලියන්න.',
    hintWord: 'ටකරං (Takarang)',
    hintPhoneme: 'ට',
    options: [
      { id: 'i', letter: 'ද', color: 'purple', bg: '#F6EDFF', border: '#D8B4FE', badgeBg: '#9333EA' },
      { id: 'ii', letter: 'ට', color: 'green', bg: '#EDFDF2', border: '#86EFAC', badgeBg: '#16A34A' },
      { id: 'iii', letter: 'ග', color: 'blue', bg: '#EFF6FF', border: '#93C5FD', badgeBg: '#2563EB' },
      { id: 'iv', letter: 'න', color: 'pink', bg: '#FFF1F5', border: '#F9A8D4', badgeBg: '#DB2777' },
    ],
    correctId: 'ii'
  }
];

// ── Web Audio Synthesizer for Fun Sound Effects ──
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
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);
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
    } else if (type === 'victory') {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.12);
        gain.gain.setValueAtTime(0.25, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.65);
      });
    }
  } catch (e) {
    // Ignore audio context errors
  }
}

// ── Text to Speech for Sinhala Prompts ──
function speakSinhala(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'si-LK';
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

// ── Strict Stroke-Centerline Skeleton & Boundary Evaluator ──
function evaluateTracingCoverage(canvas, targetLetter) {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext('2d');

  // Render ground-truth reference letter STROKE (exact centerline guideline ribbon)
  const refCanvas = document.createElement('canvas');
  refCanvas.width = w;
  refCanvas.height = h;
  const refCtx = refCanvas.getContext('2d');
  refCtx.fillStyle = '#FFFFFF';
  refCtx.fillRect(0, 0, w, h);
  refCtx.strokeStyle = '#000000';
  refCtx.lineWidth = 10;
  refCtx.lineCap = 'round';
  refCtx.lineJoin = 'round';
  refCtx.font = '300 125px "Noto Sans Sinhala", "Iskoola Pota", sans-serif';
  refCtx.textAlign = 'center';
  refCtx.textBaseline = 'alphabetic';
  refCtx.strokeText(targetLetter, w / 2, 145);

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

  // If user drew almost nothing
  if (totalRefPixels === 0 || totalDrawnPixels < 200) {
    return {
      completionPercent: 0,
      accuracyPercent: 0,
      isComplete: false,
      missingReason: 'අකුර සම්පූර්ණයෙන්ම ලියන්න',
      refDataUrl: refCanvas.toDataURL('image/png')
    };
  }

  const tolerance = 6; // Strict 6px matching radius along centerline strokes

  // 1. Overall Contour Recall / Completion
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

  // 2. 9-Sector High-Density Grid (3 Rows x 3 Cols across the stroke skeleton)
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

    // Every active sector of the stroke must have at least 70% coverage!
    if (secRefTotal > 12) {
      const secRatio = secRefCovered / secRefTotal;
      if (secRatio < 0.70) {
        allSectorsPassed = false;
        if (!missingSectorName) {
          missingSectorName = sec.name;
        }
      }
    }
  });

  // 3. Strict Boundary & Stray Ink Detection: Detect drawn ink going OUTSIDE the letter!
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

  // STRICT DECISION RULES:
  // 1. No lines allowed outside: strayPixelsCount must be strictly bounded (accuracy >= 82% AND strayPixels < 40)
  // 2. Completion must be >= 82%
  // 3. All 9 active sectors of the letter must pass!
  let isComplete = false;
  let reason = 'අකුර සම්පූර්ණයෙන් ලියන්න';

  if (accuracyPercent < 82 || strayPixelsCount > 35) {
    reason = 'රේඛාවෙන් පිටතට නොයන්න! (Lines go outside)';
  } else if (!allSectorsPassed || completionPercent < 82) {
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

// ── Individual Letter Card with White-Filled Letter Outline, Top-Right Checkmark, and Strict Tracing ──
function LetterTracingCard({
  option,
  isTarget,
  targetLetter,
  isSelected,
  isAnswered,
  onDrawStart,
  onDrawSuccess,
  onWrongAttempt,
  onIncompleteAttempt
}) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const pathPointsRef = useRef([]);
  const [hasTraced, setHasTraced] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [shake, setShake] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [tipMessage, setTipMessage] = useState(null);

  // Initialize / reset canvas when letter changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasTraced(false);
    pathPointsRef.current = [];
    setTipMessage(null);
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
    if (isAnswered) return;

    onDrawStart(option.id);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isTarget ? '#15803D' : '#DC2626';

    isDrawingRef.current = true;
    pathPointsRef.current.push(pos);
  };

  const handleMove = (e) => {
    if (!isDrawingRef.current || isAnswered) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    pathPointsRef.current.push(pos);
  };

  const handleEnd = async (e) => {
    if (!isDrawingRef.current) return;
    e?.preventDefault();
    isDrawingRef.current = false;

    const canvas = canvasRef.current;
    if (!canvas || isAnswered) return;

    // Check if drawn stroke points are too few
    if (pathPointsRef.current.length < 25) {
      setTipMessage('අකුර දිගේ සම්පූර්ණයෙන් ලියන්න! ✏️');
      setTimeout(() => setTipMessage(null), 2500);
      onIncompleteAttempt('අකුර සම්පූර්ණයෙන් ලියන්න');
      return;
    }

    setIsEvaluating(true);

    try {
      // 1. Strict centerline skeleton and boundary verification
      const { completionPercent, accuracyPercent, isComplete, missingReason, refDataUrl } = evaluateTracingCoverage(canvas, option.letter);

      // If user drew lines going outside or left sections incomplete: REJECT!
      if (!isComplete) {
        setTipMessage(`✏️ ${missingReason}`);
        setTimeout(() => setTipMessage(null), 3000);
        onIncompleteAttempt(missingReason);
        setIsEvaluating(false);
        return;
      }

      // 2. Call the Handwriting AI Evaluation API
      const drawnBase64 = canvas.toDataURL('image/png').split(',')[1];
      const refBase64 = refDataUrl.split(',')[1];

      let aiScore = Math.round((completionPercent + accuracyPercent) / 2);
      try {
        const response = await fetch('http://localhost:5000/api/ai/handwriting/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: localStorage.getItem('studentName') || 'student_g2',
            image_base64: drawnBase64,
            target_letter: option.letter,
            reference_base64: refBase64
          })
        });

        if (response.ok) {
          const aiData = await response.json();
          if (aiData && aiData.accuracy_score !== undefined) {
            aiScore = Math.round(aiData.accuracy_score);
          }
        }
      } catch (err) {
        // Use coverage score
      }

      // 3. Final Verification
      if (isTarget) {
        // Child genuinely traced and completed the full target letter accurately!
        setHasTraced(true);
        onDrawSuccess(option.id, aiScore);
      } else {
        // Child wrote on a wrong letter card!
        setShake(true);
        setTimeout(() => setShake(false), 500);
        onWrongAttempt(option.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleClearCard = (e) => {
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
      className={`relative rounded-3xl p-4 transition-all duration-300 transform select-none ${shake ? 'animate-bounce' : ''}`}
      style={{
        backgroundColor: option.bg,
        border: `4px solid ${isSelected && isTarget && hasTraced ? '#16A34A' : isSelected && !isTarget ? '#EF4444' : option.border}`,
        boxShadow: isSelected && isTarget && hasTraced
          ? '0 12px 28px -4px rgba(22, 163, 74, 0.35), 0 0 0 4px #BBF7D0'
          : isHovered
          ? '0 10px 25px -3px rgba(0,0,0,0.12)'
          : '0 4px 12px rgba(0,0,0,0.06)',
        cursor: 'crosshair'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Roman Numeral Badge (i, ii, iii, iv) in Top-Left */}
      <div
        className="absolute top-3.5 left-3.5 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md z-20"
        style={{ backgroundColor: option.badgeBg }}
      >
        {option.id}
      </div>

      {/* Clear Stroke Button in Top-Right (when not completed) */}
      {!isAnswered && pathPointsRef.current.length > 0 && !hasTraced && (
        <button
          onClick={handleClearCard}
          className="absolute top-3.5 right-3.5 bg-white/90 hover:bg-white text-slate-600 hover:text-red-500 text-xs font-bold px-2.5 py-1 rounded-full shadow border z-20 transition-colors cursor-pointer"
          title="මකන්න"
        >
          🧹 මකන්න
        </button>
      )}

      {/* ✅ Correct Tick Mark in TOP-RIGHT CORNER (NOT over the letter!) */}
      {isSelected && isTarget && hasTraced && (
        <div className="absolute top-3.5 right-3.5 z-30 animate-bounce pointer-events-none">
          <div className="w-10 h-10 bg-green-500 text-white rounded-full shadow-lg border-2 border-white flex items-center justify-center">
            <span className="text-xl font-black">✓</span>
          </div>
        </div>
      )}

      {/* Center White-Filled Letter with Dotted Guideline */}
      <div className="flex items-center justify-center h-44 md:h-52 relative overflow-hidden">
        
        {/* ── Single Thin Dotted Line Letter Guideline ── */}
        <svg viewBox="0 0 300 220" className="w-full h-full pointer-events-none select-none">
          <text
            x="150"
            y="145"
            textAnchor="middle"
            fontSize="125"
            fontWeight="300"
            fontFamily="'Noto Sans Sinhala', 'Iskoola Pota', sans-serif"
            fill="none"
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="4, 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {option.letter}
          </text>
        </svg>

        {/* Tracing Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={300}
          height={220}
          className="absolute inset-0 w-full h-full touch-none z-10"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />

        {/* Evaluating Indicator */}
        {isEvaluating && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex items-center justify-center z-30 rounded-2xl">
            <span className="text-xs font-bold text-slate-700 bg-white px-3.5 py-1.5 rounded-full shadow-md border animate-pulse">
              🤖 AI පරීක්ෂා කරමින්...
            </span>
          </div>
        )}

        {/* Tooltip / Hint on Incomplete Stroke or Stray Line */}
        {tipMessage && (
          <div className="absolute bottom-2 inset-x-2 text-center bg-amber-500 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-lg z-30 animate-bounce">
            {tipMessage}
          </div>
        )}

        {/* Tracing Pen Prompt when hovered */}
        {!hasTraced && !isAnswered && !tipMessage && isHovered && (
          <div className="absolute bottom-2 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-slate-600 shadow-sm pointer-events-none animate-pulse">
            ✏️ තිත් රේඛා මත ලියන්න
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Grade 2 Level 1 Module ──
export default function SinhalaGrade2Level1({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(120);
  const [answeredState, setAnsweredState] = useState(null); // 'correct' | 'wrong' | null
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [starsCollected, setStarsCollected] = useState(0);
  const [history, setHistory] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUESTIONS[currentIndex];

  // Play voice instruction on question load
  useEffect(() => {
    if (!currentQ || isFinished) return;
    setAnsweredState(null);
    setSelectedOptionId(null);
    setShowCelebration(false);

    const timer = setTimeout(() => {
      speakSinhala(`"${currentQ.targetLetter}" අකුර මත ලියන්න.`);
    }, 400);

    return () => clearTimeout(timer);
  }, [currentIndex, isFinished]);

  // Handle speaker button click
  const handlePlayInstruction = () => {
    playSound('click');
    speakSinhala(`"${currentQ.targetLetter}" අකුර මත ලියන්න.`);
  };

  // Handle Hint button click
  const handlePlayHint = () => {
    playSound('click');
    speakSinhala(`අක්ෂරය: ${currentQ.hintPhoneme} ... ${currentQ.hintWord}.`);
  };

  // When child starts drawing
  const handleDrawStart = (optionId) => {
    setSelectedOptionId(optionId);
  };

  // When child successfully draws and COMPLETES the full target letter
  const handleDrawSuccess = (optionId, accuracy) => {
    if (answeredState === 'correct') return;

    setSelectedOptionId(optionId);
    setAnsweredState('correct');
    setScore((prev) => prev + 20);
    setStarsCollected((prev) => prev + 1);
    setShowCelebration(true);
    playSound('correct');
    speakSinhala('නියමයි! අකුර නිවැරදිව හඳුනාගෙන සම්පූර්ණයෙන්ම ලීවා!');

    setHistory((prev) => [
      ...prev,
      { questionId: currentQ.id, targetLetter: currentQ.targetLetter, correct: true, accuracy }
    ]);
  };

  // When child draws on a WRONG letter
  const handleWrongAttempt = (optionId) => {
    if (answeredState === 'correct') return;

    setSelectedOptionId(optionId);
    setAnsweredState('wrong');
    playSound('wrong');
    speakSinhala(`නැවත උත්සාහ කරන්න. "${currentQ.targetLetter}" අකුර සොයන්න.`);

    setHistory((prev) => [
      ...prev,
      { questionId: currentQ.id, targetLetter: currentQ.targetLetter, correct: false }
    ]);
  };

  // When child draws an incomplete stroke or stray lines
  const handleIncompleteAttempt = (reason) => {
    playSound('incomplete');
    if (reason && reason.includes('පිටතට')) {
      speakSinhala(`අකුර තුළ පමණක් ලියන්න!`);
    } else {
      speakSinhala(`අකුර සම්පූර්ණයෙන්ම ලියන්න!`);
    }
  };

  // Next Question or Finish
  const handleNext = () => {
    playSound('click');
    if (currentIndex + 1 < QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      playSound('victory');
      const finalAccuracy = Math.round((history.filter((h) => h.correct).length / QUESTIONS.length) * 100);
      progressionManager.recordExerciseScore('l1_ex1', Math.max(70, finalAccuracy));
      setIsFinished(true);
    }
  };

  // Restart
  const handleRestart = () => {
    playSound('click');
    setCurrentIndex(0);
    setScore(120);
    setStarsCollected(0);
    setHistory([]);
    setIsFinished(false);
  };

  // ── Final Trophy / Results Screen ──
  if (isFinished) {
    const accuracyPct = Math.round((history.filter((h) => h.correct).length / QUESTIONS.length) * 100);
    const passed = accuracyPct >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white/95 backdrop-blur-md rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center relative overflow-hidden animate-bounce-short">
          <div className="text-6xl mb-2 animate-bounce">🏆</div>
          <h1 className="text-4xl font-extrabold text-purple-700 mb-2 font-sinhala">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg font-sinhala mb-4">ඔබ Level 1 අභ්‍යාසය 1 සාර්ථකව අවසන් කළා!</p>

          {/* Adaptive Unlock Badge */}
          {accuracyPct >= 90 ? (
            <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 text-amber-950 border-2 border-amber-400 px-5 py-2.5 rounded-2xl text-sm font-black inline-flex items-center gap-2 mb-6 shadow-sm">
              <span className="text-xl">🌟</span>
              <span>ඉහළම දක්ෂතාවය ({accuracyPct}%)! Level 2 (වචන ගොඩනැගීම) සෘජුවම විවෘත විය!</span>
            </div>
          ) : passed ? (
            <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-5 py-2 rounded-2xl text-sm font-black inline-flex items-center gap-2 mb-6">
              <span>🚀</span>
              <span>ඊළඟ අභ්‍යාසය (Activity 2: පින්තූරයට අකුර) දැන් විවෘතයි!</span>
            </div>
          ) : (
            <div className="bg-amber-100 text-amber-900 border border-amber-300 px-5 py-2 rounded-2xl text-sm font-black inline-flex items-center gap-2 mb-6">
              <span>⚠️</span>
              <span>ලකුණු 70%ක් ලබා ගැනීමෙන් ඊළඟ අභ්‍යාසය විවෘත කරගන්න.</span>
            </div>
          )}

          {/* Stars Display */}
          <div className="flex justify-center gap-3 mb-6">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-4xl animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>
                ⭐
              </span>
            ))}
          </div>

          {/* Stats Box */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 border-2 border-purple-200 rounded-3xl p-4">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">සමස්ත ලකුණු</span>
              <div className="text-4xl font-black text-purple-600 mt-1">{score}</div>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-4">
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest">AI නිරවද්‍යතාව</span>
              <div className="text-4xl font-black text-green-600 mt-1">{accuracyPct}%</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {/* 100% Score: Fast-track promotion button to Level 2 */}
            {accuracyPct >= 90 ? (
              <>
                <button
                  onClick={() => navigate('/module/sinhala/grade2-level2-act1')}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xl rounded-2xl shadow-xl transform hover:-translate-y-1 transition-all font-sinhala cursor-pointer flex items-center justify-center gap-2 border-2 border-yellow-200 animate-pulse"
                >
                  <span>🚀 Level 2 වෙත උසස් වන්න (වචන ගොඩනගමු)</span>
                  <span className="text-2xl">➔</span>
                </button>
                <button
                  onClick={() => navigate('/module/sinhala/grade2-level1-act2')}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-xl shadow cursor-pointer transition-all font-sinhala"
                >
                  📝 Level 1 හි Activity 2 කරන්න
                </button>
              </>
            ) : passed ? (
              <button
                onClick={() => navigate('/module/sinhala/grade2-level1-act2')}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all font-sinhala cursor-pointer flex items-center justify-center gap-2"
              >
                <span>⭐ ඊළඟ අභ්‍යාසය (Activity 2: පින්තූරයට අකුර)</span>
                <span className="text-2xl">➔</span>
              </button>
            ) : null}

            <div className="flex gap-4 mt-1">
              <button
                onClick={handleRestart}
                className="flex-1 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-base rounded-2xl shadow-md cursor-pointer font-sinhala"
              >
                🔄 නැවත කරන්න
              </button>
              <button
                onClick={() => navigate('/module/sinhala/grade2')}
                className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-base rounded-2xl shadow-md cursor-pointer font-sinhala"
              >
                📚 Grade 2 Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-200 font-sinhala select-none relative overflow-x-hidden pb-8">
      
      {/* ── Cartoon Background Elements ── */}
      <div className="absolute top-4 left-10 text-6xl opacity-80 pointer-events-none animate-pulse">☀️</div>
      <div className="absolute top-8 right-24 text-6xl opacity-70 pointer-events-none">☁️</div>

      <div className="max-w-6xl mx-auto px-4 py-4 relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* ── TOP HEADER BAR ── */}
        <div className="flex items-center justify-between gap-3 mb-3">
          
          {/* Left: Star Score Pill */}
          <div className="bg-purple-600 text-white px-5 py-2.5 rounded-full shadow-lg border-2 border-purple-400 flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-bold text-yellow-200">ලකුණු</span>
              <span className="text-xl font-extrabold">{score}</span>
            </div>
          </div>

          {/* Center: Long White Title Pill with Speaker */}
          <div className="flex-1 max-w-2xl bg-white/95 backdrop-blur-md rounded-full py-2.5 px-6 shadow-md border-4 border-yellow-300 flex items-center justify-center gap-3">
            <button
              onClick={handlePlayInstruction}
              className="w-11 h-11 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-full flex items-center justify-center text-xl shadow-md transition-all flex-shrink-0 cursor-pointer"
              title="හඬ අසන්න"
            >
              🔊
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold text-purple-700 tracking-wide text-center">
              <span className="text-red-500 underline mr-1.5">{currentQ.targetLetter}</span>
              අකුර මත ලියන්න
            </h1>
          </div>

          {/* Right: Question Counter & Smiling Star Mascot */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg border-2 border-pink-300">
              {currentIndex + 1}/{QUESTIONS.length}
            </div>
            <div className="text-4xl animate-bounce pointer-events-none">⭐</div>
          </div>
        </div>

        {/* ── MAIN CONTENT AREA (Left Mascot + Center 2x2 Board + Right Side Cards) ── */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 my-auto">
          
          {/* ── Left Side: Cute Mascot (Peacock) ── */}
          <div className="hidden xl:flex flex-col items-center justify-end w-36 self-end pb-8">
            <div className="text-8xl drop-shadow-xl transform -scale-x-100 hover:scale-105 transition-transform cursor-pointer" onClick={handlePlayInstruction}>
              🦚
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm mt-2">
              සොයන්න! 🔍
            </div>
          </div>

          {/* ── Center: Main Yellow-Bordered Card Frame ── */}
          <div className="flex-1 max-w-4xl bg-white rounded-[2.5rem] p-5 md:p-7 shadow-2xl border-8 border-yellow-400 relative">
            
            {/* Top decorative icons inside the board */}
            <div className="absolute top-4 left-6 text-3xl pointer-events-none animate-pulse">🦋</div>
            <div className="absolute top-3 right-8 flex items-center gap-1 pointer-events-none">
              <span className="text-2xl">🎵</span>
              <span className="text-3xl">🐦</span>
            </div>

            {/* Inner Sub-instruction Banner */}
            <div className="flex items-center justify-center gap-3 bg-amber-50/80 rounded-2xl py-2 px-6 border-2 border-amber-200 mb-5 max-w-lg mx-auto">
              <button
                onClick={handlePlayInstruction}
                className="w-9 h-9 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center text-lg shadow-sm cursor-pointer transition-transform active:scale-90"
              >
                🔊
              </button>
              <p className="text-lg md:text-xl font-bold text-slate-800">
                “<span className="text-red-500 font-extrabold text-2xl">{currentQ.targetLetter}</span>” අකුර මත ලියන්න.
              </p>
            </div>

            {/* ── 2x2 Grid of 4 Letter Options ── */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {currentQ.options.map((opt) => (
                <LetterTracingCard
                  key={opt.id + currentQ.id}
                  option={opt}
                  isTarget={opt.id === currentQ.correctId}
                  targetLetter={opt.letter}
                  isSelected={selectedOptionId === opt.id}
                  isAnswered={answeredState === 'correct'}
                  onDrawStart={handleDrawStart}
                  onDrawSuccess={handleDrawSuccess}
                  onWrongAttempt={handleWrongAttempt}
                  onIncompleteAttempt={handleIncompleteAttempt}
                />
              ))}
            </div>
          </div>

          {/* ── Right Side Action Panels ── */}
          <div className="flex lg:flex-col gap-3 w-full lg:w-44 justify-center">
            
            {/* 1. උදව් (Help) Card */}
            <div
              onClick={() => { playSound('click'); setShowHelpModal(true); }}
              className="flex-1 lg:flex-none bg-white rounded-2xl p-3 shadow-md border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer group text-center"
            >
              <div className="bg-purple-600 text-white py-1 px-3 rounded-lg text-xs font-bold mb-2">
                උදව්
              </div>
              <div className="text-4xl my-1 group-hover:scale-110 transition-transform">🦁</div>
              <p className="text-[11px] text-slate-500 font-bold">පැහැදිලි කිරීම</p>
            </div>

            {/* 2. ඉඟිය (Hint) Card */}
            <div
              onClick={handlePlayHint}
              className="flex-1 lg:flex-none bg-white rounded-2xl p-3 shadow-md border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group text-center"
            >
              <div className="bg-amber-500 text-white py-1 px-3 rounded-lg text-xs font-bold mb-2">
                ඉඟිය
              </div>
              <button className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center text-lg mx-auto my-1 group-hover:scale-110 transition-transform shadow-sm cursor-pointer">
                🔊
              </button>
              <p className="text-[11px] text-slate-700 font-extrabold leading-tight">අක්ෂරය අහන්න</p>
            </div>

            {/* 3. දිරිගැන්වීම (Reward) Card */}
            <div
              onClick={() => { playSound('click'); setShowRewardModal(true); }}
              className="flex-1 lg:flex-none bg-white rounded-2xl p-3 shadow-md border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer group text-center"
            >
              <div className="bg-emerald-600 text-white py-1 px-3 rounded-lg text-xs font-bold mb-2">
                දිරිගැන්වීම
              </div>
              <div className="text-4xl my-1 group-hover:scale-110 transition-transform animate-pulse">🏆</div>
              <p className="text-[11px] text-slate-500 font-bold">{starsCollected} තරු දිනුවා</p>
            </div>
          </div>
        </div>

        {/* ── BOTTOM NAVIGATION BAR ── */}
        <div className="flex items-center justify-between mt-4 gap-4">
          
          {/* Home Button (Pink Circle) */}
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl shadow-xl border-4 border-white cursor-pointer active:scale-95 transition-all"
            title="මුල් පිටුවට"
          >
            🏠
          </button>

          {/* Center Wooden Plank Banner */}
          <div className="relative bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-100 px-8 py-3 rounded-2xl shadow-xl border-4 border-amber-950 flex items-center justify-center gap-3">
            <span className="text-xl">🍄</span>
            <span className="text-xl md:text-2xl font-black tracking-wide text-amber-200 drop-shadow">
              අකුරු හඳුනාගනිමු
            </span>
            <span className="text-xl">🌸</span>
          </div>

          {/* Next Button (Blue Pill) */}
          <button
            onClick={handleNext}
            className={`px-8 py-3.5 rounded-full font-black text-xl text-white shadow-xl flex items-center gap-2 transition-all cursor-pointer ${
              answeredState === 'correct'
                ? 'bg-sky-500 hover:bg-sky-600 border-4 border-white scale-105 animate-pulse'
                : 'bg-sky-400/70 hover:bg-sky-500 border-2 border-white/60'
            }`}
          >
            <span>ඉදිරියට</span>
            <span className="text-2xl">➔</span>
          </button>
        </div>
      </div>

      {/* ── Help Modal ── */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-md w-full shadow-2xl border-4 border-purple-400 text-center animate-fade-in-up">
            <div className="text-6xl mb-3">🦁</div>
            <h3 className="text-2xl font-black text-purple-700 mb-2">උදව් අවශ්‍යද?</h3>
            <p className="text-slate-600 text-base leading-relaxed mb-6">
              ඉහළින් ඇසෙන හඬට සවන් දී, නිවැරදි <strong>"{currentQ.targetLetter}"</strong> අකුර ඇති කොටුව තෝරා, එහි ඇති තිත් රේඛා දිගේ අකුර සම්පූර්ණයෙන්ම ලියන්න!
            </p>
            <button
              onClick={() => { setShowHelpModal(false); handlePlayInstruction(); }}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              තේරුණා! (Got it)
            </button>
          </div>
        </div>
      )}

      {/* ── Reward Modal ── */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-md w-full shadow-2xl border-4 border-emerald-400 text-center animate-fade-in-up">
            <div className="text-6xl mb-3 animate-bounce">🏆</div>
            <h3 className="text-2xl font-black text-emerald-700 mb-2">ඔබේ ජයග්‍රහණ</h3>
            <p className="text-slate-600 text-base mb-4">
              ඔබ දැනට තරු <strong>{starsCollected}</strong>ක් සහ ලකුණු <strong>{score}</strong>ක් ලබා ගෙන ඇත!
            </p>
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(starsCollected || 1)].map((_, i) => (
                <span key={i} className="text-3xl">⭐</span>
              ))}
            </div>
            <button
              onClick={() => setShowRewardModal(false)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              නියමයි! ඉදිරියට යමු
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
