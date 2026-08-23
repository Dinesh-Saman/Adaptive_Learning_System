import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Question Datasets for Level 3 - Activity 2: වාක්‍ය පාලම (Sentence Bridge) ──
const LEVEL3_ACT2_QUESTIONS = [
  {
    id: 1,
    num: 1,
    shuffledWords: [
      { id: 'w1', text: 'ඉඳී', color: 'bg-pink-100 border-pink-300 text-pink-950 hover:bg-pink-200 shadow-md', woodStyle: 'pink' },
      { id: 'w2', text: 'කුරුල්ලා', color: 'bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200 shadow-md', woodStyle: 'yellow' },
      { id: 'w3', text: 'ගසේ', color: 'bg-emerald-100 border-emerald-300 text-emerald-950 hover:bg-emerald-200 shadow-md', woodStyle: 'green' },
    ],
    correctOrder: ['කුරුල්ලා', 'ගසේ', 'ඉඳී'],
    fullSentence: 'කුරුල්ලා ගසේ ඉඳී.',
    voicePrompt: 'වචන නිවැරදි පිළිවෙළට සකස් කර වාක්‍යය සාදන්න. කුරුල්ලා ගසේ ඉඳී.',
    fontSize: 32
  },
  {
    id: 2,
    num: 2,
    shuffledWords: [
      { id: 'w1', text: 'සෙල්ලම් කරයි', color: 'bg-pink-100 border-pink-300 text-pink-950 hover:bg-pink-200 shadow-md', woodStyle: 'pink' },
      { id: 'w2', text: 'ළමයි', color: 'bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200 shadow-md', woodStyle: 'yellow' },
      { id: 'w3', text: 'මිදුලේ', color: 'bg-emerald-100 border-emerald-300 text-emerald-950 hover:bg-emerald-200 shadow-md', woodStyle: 'green' },
    ],
    correctOrder: ['ළමයි', 'මිදුලේ', 'සෙල්ලම් කරයි'],
    fullSentence: 'ළමයි මිදුලේ සෙල්ලම් කරයි.',
    voicePrompt: 'වචන නිවැරදි පිළිවෙළට සකස් කර වාක්‍යය සාදන්න. ළමයි මිදුලේ සෙල්ලම් කරයි.',
    fontSize: 30
  },
  {
    id: 3,
    num: 3,
    shuffledWords: [
      { id: 'w1', text: 'බොයි', color: 'bg-pink-100 border-pink-300 text-pink-950 hover:bg-pink-200 shadow-md', woodStyle: 'pink' },
      { id: 'w2', text: 'දරුවා', color: 'bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200 shadow-md', woodStyle: 'yellow' },
      { id: 'w3', text: 'වතුර', color: 'bg-emerald-100 border-emerald-300 text-emerald-950 hover:bg-emerald-200 shadow-md', woodStyle: 'green' },
    ],
    correctOrder: ['දරුවා', 'වතුර', 'බොයි'],
    fullSentence: 'දරුවා වතුර බොයි.',
    voicePrompt: 'වචන නිවැරදි පිළිවෙළට සකස් කර වාක්‍යය සාදන්න. දරුවා වතුර බොයි.',
    fontSize: 32
  },
  {
    id: 4,
    num: 4,
    shuffledWords: [
      { id: 'w1', text: 'දුවයි', color: 'bg-pink-100 border-pink-300 text-pink-950 hover:bg-pink-200 shadow-md', woodStyle: 'pink' },
      { id: 'w2', text: 'බල්ලා', color: 'bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200 shadow-md', woodStyle: 'yellow' },
      { id: 'w3', text: 'පාරේ', color: 'bg-emerald-100 border-emerald-300 text-emerald-950 hover:bg-emerald-200 shadow-md', woodStyle: 'green' },
    ],
    correctOrder: ['බල්ලා', 'පාරේ', 'දුවයි'],
    fullSentence: 'බල්ලා පාරේ දුවයි.',
    voicePrompt: 'වචන නිවැරදි පිළිවෙළට සකස් කර වාක්‍යය සාදන්න. බල්ලා පාරේ දුවයි.',
    fontSize: 32
  },
  {
    id: 5,
    num: 5,
    shuffledWords: [
      { id: 'w1', text: 'ලියයි', color: 'bg-pink-100 border-pink-300 text-pink-950 hover:bg-pink-200 shadow-md', woodStyle: 'pink' },
      { id: 'w2', text: 'සිසුවා', color: 'bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200 shadow-md', woodStyle: 'yellow' },
      { id: 'w3', text: 'අකුරු', color: 'bg-emerald-100 border-emerald-300 text-emerald-950 hover:bg-emerald-200 shadow-md', woodStyle: 'green' },
    ],
    correctOrder: ['සිසුවා', 'අකුරු', 'ලියයි'],
    fullSentence: 'සිසුවා අකුරු ලියයි.',
    voicePrompt: 'වචන නිවැරදි පිළිවෙළට සකස් කර වාක්‍යය සාදන්න. සිසුවා අකුරු ලියයි.',
    fontSize: 32
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
    } else if (type === 'bridge_place') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
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

// ── Strict Tracing Evaluator for Full Sinhala Sentence ──
function evaluateBridgeSentenceTracing(canvas, targetSentence, pathPoints = []) {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext('2d');

  if (!canvas || pathPoints.length < 30) {
    return { isComplete: false, reason: 'කරුණාකර සම්පූර්ණ වාක්‍යය ලියන්න! ✏️' };
  }

  // 1. Vertical Direction Reversals (Distinguishes real Sinhala handwriting with loops & curves from a flat wave/scribble line)
  let verticalReversals = 0;
  let prevDy = 0;
  for (let i = 2; i < pathPoints.length; i++) {
    const dy = pathPoints[i].y - pathPoints[i - 1].y;
    if (Math.abs(dy) > 1.2) {
      if (prevDy !== 0 && ((dy > 0 && prevDy < 0) || (dy < 0 && prevDy > 0))) {
        verticalReversals++;
      }
      prevDy = dy;
    }
  }

  // Writing a 3-word Sinhala sentence with 8-12 rounded characters & diacritics requires at least 8 vertical loop reversals
  if (verticalReversals < 8) {
    return { isComplete: false, reason: 'අකුරු වල නියම හැඩය අනුව නිවැරදිව ලියන්න! ✍️' };
  }

  // 2. Offscreen Reference Canvas Matching Exact DOM Font & Alignment
  const refCanvas = document.createElement('canvas');
  refCanvas.width = w;
  refCanvas.height = h;
  const refCtx = refCanvas.getContext('2d');
  refCtx.fillStyle = '#FFFFFF';
  refCtx.fillRect(0, 0, w, h);
  refCtx.fillStyle = '#000000';
  refCtx.font = `bold 32px "Noto Sans Sinhala", "Iskoola Pota", sans-serif`;
  refCtx.textAlign = 'center';
  refCtx.textBaseline = 'middle';
  refCtx.fillText(targetSentence, w / 2, h / 2);

  const refData = refCtx.getImageData(0, 0, w, h).data;
  const drawnData = ctx.getImageData(0, 0, w, h).data;

  let totalRefPixels = 0;
  let minRefX = w, maxRefX = 0, minRefY = h, maxRefY = 0;
  const refMask = new Uint8Array(w * h);
  const drawnMask = new Uint8Array(w * h);

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
      }
    }
  }

  if (totalRefPixels === 0) {
    return { isComplete: false, reason: 'වාක්‍යය සම්පූර්ණයෙන් ලියන්න! ✏️' };
  }

  const refWidth = maxRefX - minRefX;
  const refHeight = maxRefY - minRefY;

  // 3. Horizontal Span Check (Must span at least 70% of text width)
  const minDrawnX = Math.min(...pathPoints.map((p) => p.x));
  const maxDrawnX = Math.max(...pathPoints.map((p) => p.x));
  const drawnSpan = maxDrawnX - minDrawnX;

  if (drawnSpan < refWidth * 0.70) {
    return { isComplete: false, reason: 'වාක්‍යය අග දක්වාම සම්පූර්ණයෙන් ලියන්න! ✍️' };
  }

  // 4. 3x3 Grid Matrix Coverage Evaluation (3 Horizontal Word Segments x 3 Vertical Bands)
  const segWidth = refWidth / 3;
  const bandHeight = Math.max(1, refHeight / 3);

  // Counters for 3 horizontal word segments (Col 0, 1, 2)
  const colRef = [0, 0, 0];
  const colCovered = [0, 0, 0];

  // Counters for 3 vertical height bands (Row 0: Ascenders/Top, Row 1: Mid, Row 2: Descenders/Papili)
  const rowRef = [0, 0, 0];
  const rowCovered = [0, 0, 0];

  let totalCoveredPixels = 0;
  const tolerance = 5; // Strict 5px tolerance to ensure drawing is actually on the letter strokes

  for (let y = minRefY; y <= maxRefY; y += 2) {
    for (let x = minRefX; x <= maxRefX; x += 2) {
      const idx = y * w + x;
      if (refMask[idx] === 1) {
        const colIdx = Math.min(2, Math.floor((x - minRefX) / segWidth));
        const rowIdx = Math.min(2, Math.floor((y - minRefY) / bandHeight));

        colRef[colIdx]++;
        rowRef[rowIdx]++;

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

        if (covered) {
          totalCoveredPixels++;
          colCovered[colIdx]++;
          rowCovered[rowIdx]++;
        }
      }
    }
  }

  // Calculate percentages
  const word1Pct = colRef[0] > 0 ? (colCovered[0] / colRef[0]) * 100 : 100;
  const word2Pct = colRef[1] > 0 ? (colCovered[1] / colRef[1]) * 100 : 100;
  const word3Pct = colRef[2] > 0 ? (colCovered[2] / colRef[2]) * 100 : 100;

  const topBandPct = rowRef[0] > 0 ? (rowCovered[0] / rowRef[0]) * 100 : 100;
  const botBandPct = rowRef[2] > 0 ? (rowCovered[2] / rowRef[2]) * 100 : 100;

  const totalSampledRef = colRef[0] + colRef[1] + colRef[2];
  const overallCoverage = totalSampledRef > 0 ? (totalCoveredPixels / totalSampledRef) * 100 : 0;

  // Validation Checks:
  // A. Every word must be reasonably traced
  if (word1Pct < 38 || word2Pct < 38 || word3Pct < 38) {
    return { isComplete: false, reason: 'සියලුම වචන අග දක්වා ලියන්න! ✍️' };
  }

  // B. Vertical structure: cannot just be a single horizontal wavy line (top or bottom must have real coverage)
  if (topBandPct < 22 && botBandPct < 22) {
    return { isComplete: false, reason: 'අකුරු වල නියම හැඩය මත ලියන්න! ✍️' };
  }

  // C. Overall glyph coverage must be at least 42%
  if (overallCoverage < 40) {
    return { isComplete: false, reason: 'අකුරු මත පැහැදිලිව ලියන්න! ✏️' };
  }

  return { isComplete: true };
}

export default function SinhalaGrade2Level3Act2({ onExit }) {
  const navigate = useNavigate();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [placedSlots, setPlacedSlots] = useState([null, null, null]);
  const [availableWords, setAvailableWords] = useState([]);
  const [isBridgeCorrect, setIsBridgeCorrect] = useState(false);
  const [isTracingDone, setIsTracingDone] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null); // 'correct' | 'wrong'
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(125);
  const [isAllDone, setIsAllDone] = useState(false);
  const [tipMessage, setTipMessage] = useState(null);

  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const pathPointsRef = useRef([]);

  const currentQ = LEVEL3_ACT2_QUESTIONS[currentIdx];

  // Initialize words for current question
  useEffect(() => {
    setPlacedSlots([null, null, null]);
    setAvailableWords([...currentQ.shuffledWords]);
    setIsBridgeCorrect(false);
    setIsTracingDone(false);
    setIsConfirmed(false);
    setSubmissionResult(null);
    setFeedbackMessage('');
    clearCanvas();

    const timer = setTimeout(() => {
      speakSinhala(currentQ.voicePrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  // Adjust canvas pixel density on mount / question change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
    }
  }, [currentIdx, isBridgeCorrect]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    pathPointsRef.current = [];
    setIsTracingDone(false);
  };

  // Tap or Click word to place into first empty slot
  const handleWordClick = (word) => {
    if (isConfirmed) return;
    playSound('click');
    const emptyIndex = placedSlots.findIndex((s) => s === null);
    if (emptyIndex === -1) return;

    const newPlaced = [...placedSlots];
    newPlaced[emptyIndex] = word;
    setPlacedSlots(newPlaced);
    setAvailableWords((prev) => prev.filter((w) => w.id !== word.id));
    playSound('bridge_place');

    if (newPlaced.every((s) => s !== null)) {
      speakSinhala('දැන් පහතින් වාක්‍යය ලියන්න.');
    }
  };

  // Click placed slot to return word to pool
  const handleSlotClick = (index) => {
    if (isConfirmed) return;
    const word = placedSlots[index];
    if (!word) return;

    playSound('click');
    const newPlaced = [...placedSlots];
    newPlaced[index] = null;
    setPlacedSlots(newPlaced);
    setAvailableWords((prev) => [...prev, word]);
    setIsBridgeCorrect(false);
  };

  // Restart current question
  const handleRestartCurrent = () => {
    if (isConfirmed) return;
    playSound('click');
    setPlacedSlots([null, null, null]);
    setAvailableWords([...currentQ.shuffledWords]);
    setIsBridgeCorrect(false);
    clearCanvas();
    speakSinhala(currentQ.voicePrompt);
  };

  // Guidance hint
  const handleShowHint = () => {
    if (isConfirmed) return;
    playSound('click');
    setTipMessage(`💡 ඉඟිය: "${currentQ.correctOrder[0]}..." ආරම්භ කරන්න.`);
    speakSinhala(`පළමුව "${currentQ.correctOrder[0]}" තෝරන්න.`);
    setTimeout(() => setTipMessage(null), 3500);
  };

  // Exact 1:1 Tracing Canvas Coordinates
  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const isAllSlotsPlaced = placedSlots.every((s) => s !== null);

  const handleStartDraw = (e) => {
    if (!isAllSlotsPlaced || isConfirmed) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#16A34A';

    isDrawingRef.current = true;
    pathPointsRef.current.push(pos);
  };

  const handleMoveDraw = (e) => {
    if (!isDrawingRef.current || !isAllSlotsPlaced || isConfirmed) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    pathPointsRef.current.push(pos);
  };

  const handleEndDraw = (e) => {
    if (!isDrawingRef.current) return;
    e?.preventDefault();
    isDrawingRef.current = false;
  };

  // ── Manual Confirmation on "තහවුරු කරන්න" Button Click ──
  const handleConfirmTracing = () => {
    playSound('click');

    if (!isAllSlotsPlaced) {
      playSound('wrong');
      setTipMessage('පළමුව වචන 3 ම පාලම මත තබන්න! 🌉');
      speakSinhala('පළමුව වචන 3 ම පාලම මත තබන්න.');
      setTimeout(() => setTipMessage(null), 2500);
      return;
    }

    if (isConfirmed) return;

    const canvas = canvasRef.current;
    if (!canvas || pathPointsRef.current.length < 20) {
      playSound('wrong');
      setTipMessage('කරුණාකර පහතින් වාක්‍යය ලියන්න! ✏️');
      speakSinhala('කරුණාකර පහතින් වාක්‍යය ලියන්න.');
      setTimeout(() => setTipMessage(null), 2500);
      return;
    }

    // Lock the submission so no re-do is possible after confirm
    setIsConfirmed(true);

    // Step 1: Evaluate Word Order
    const constructedOrder = placedSlots.map((s) => s.text);
    const isOrderCorrect = constructedOrder.every((text, i) => text === currentQ.correctOrder[i]);

    // Step 2: Evaluate Handwriting
    const { isComplete, reason } = evaluateBridgeSentenceTracing(canvas, currentQ.fullSentence, pathPointsRef.current);

    if (isOrderCorrect && isComplete) {
      // ✅ Completely Correct
      playSound('correct');
      setSubmissionResult('correct');
      setIsTracingDone(true);
      setIsBridgeCorrect(true);
      setScore((prev) => prev + 10);
      setFeedbackMessage('විශිෂ්ටයි! පිළිතුර සහ අත්අකුරු නිවැරදියි! 🎉 (+10 ලකුණු)');
      speakSinhala('විශිෂ්ටයි! ඔබගේ පිළිතුර නිවැරදියි!');
    } else {
      // ❌ Incorrect
      playSound('wrong');
      setSubmissionResult('wrong');
      if (!isOrderCorrect) {
        setFeedbackMessage(`පිළිතුර වැරදියි ❌ නිවැරදි වාක්‍යය: "${currentQ.fullSentence}"`);
        speakSinhala(`පිළිතුර වැරදියි. නිවැරදි වාක්‍යය: ${currentQ.fullSentence}`);
      } else {
        setFeedbackMessage(`අත්අකුරු වැරදියි ❌ ${reason || 'අකුරු වල නියම හැඩය අනුව ලියන්න!'}`);
        speakSinhala('අත්අකුරු වැරදියි. අකුරු මත පැහැදිලිව ලියන්න.');
      }
    }
  };

  // ── Next Question Handler ──
  const handleNextQuestion = () => {
    playSound('click');
    if (currentIdx < LEVEL3_ACT2_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-emerald-100 to-amber-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-7xl mb-2 animate-bounce">🌉🏆🎉</div>
          <h1 className="text-4xl font-extrabold text-amber-800 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ සියලු වාක්‍ය පාලම් සාර්ථකව ගොඩනැගුවා!</p>
          <div className="text-4xl font-black text-purple-600 mb-8">ලකුණු: {score} ⭐</div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/module/sinhala/grade2-level3-act3')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>⭐ ඊළඟ අභ්‍යාසය (Activity 3: හිස්තැනට වචනයක්)</span>
              <span className="text-2xl">➔</span>
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setCurrentIdx(0);
                  setIsAllDone(false);
                }}
                className="flex-1 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-lg rounded-2xl shadow-md cursor-pointer"
              >
                🔄 නැවත කරන්න
              </button>
              <button
                onClick={onExit || (() => navigate('/dashboard'))}
                className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-lg rounded-2xl shadow-md cursor-pointer"
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
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-300 font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-4">
      
      {/* ── TOP HEADER ── */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Home Button */}
          <button
            onClick={onExit || (() => navigate('/module/sinhala/grade2'))}
            className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="ආපසු"
          >
            🏠
          </button>

          {/* Center Wooden Plank Header */}
          <div className="flex-1 max-w-md bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 text-white py-2 px-8 rounded-3xl shadow-xl border-4 border-amber-900 text-center relative overflow-hidden">
            <span className="absolute -top-1 left-2 text-xl">🍃</span>
            <span className="absolute -bottom-1 right-2 text-xl">🍃</span>
            <h1 className="text-2xl md:text-3xl font-black tracking-wide drop-shadow-md text-amber-100">
              වාක්‍ය පාලම
            </h1>
          </div>

          {/* Star Score Badges */}
          <div className="flex items-center gap-2">
            <div className="bg-white/90 text-slate-800 px-4 py-2 rounded-2xl font-black text-lg shadow-md border-2 border-white flex items-center gap-1.5">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span>{score}</span>
            </div>
            <div className="hidden sm:flex flex-col items-center bg-yellow-400 text-purple-950 px-3 py-1 rounded-2xl font-black text-xs shadow-md border-2 border-white animate-bounce">
              <span>⭐</span>
              <span>+10</span>
            </div>
          </div>
        </div>

        {/* ── SUB-INSTRUCTION BANNER ── */}
        <div className="max-w-3xl mx-auto w-full mt-3">
          <div className="bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-sky-300 flex items-center gap-3">
            <button
              onClick={() => {
                playSound('click');
                speakSinhala('වචන ඇදගෙන ගොස් නිවැරදි පිළිවෙළට සකස් කර වාක්‍යය සාදන්න.');
              }}
              className="w-9 h-9 bg-sky-500 hover:bg-sky-600 active:scale-90 text-white rounded-full flex items-center justify-center text-lg shadow-sm flex-shrink-0 cursor-pointer"
            >
              🔊
            </button>
            <p className="text-sm md:text-base font-bold text-slate-800">
              වචන ඇදගෙන ගොස් නිවැරදි පිළිවෙළට සකස් කර වාක්‍යය සාදන්න.
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN SCENE CONTAINER (Illustrated Suspension Bridge Scene) ── */}
      <div className="max-w-5xl mx-auto w-full px-4 my-2 flex-1 flex flex-col justify-between">
        
        {/* Question Header Bar (Placed OUTSIDE / ABOVE the bridge image) */}
        <div className="flex items-center justify-between gap-3 mb-2.5 px-2">
          <div className="bg-purple-600 text-white font-black text-sm md:text-base px-5 py-1.5 rounded-2xl shadow-md border-2 border-white">
            ප්‍රශ්නය {currentIdx + 1} / {LEVEL3_ACT2_QUESTIONS.length}
          </div>

          <div className="bg-white/95 text-slate-800 font-extrabold text-xs md:text-sm px-6 py-1.5 rounded-full shadow-md border-2 border-amber-300">
            වචන නිවැරදි පිළිවෙලට සකස් කරන්න.
          </div>
        </div>

        {/* Bridge Frame Box with Pixel-Matched Coordinates */}
        <div className="relative w-full aspect-[1024/441] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-yellow-300 bg-sky-200">
          
          {/* Background Illustration */}
          <img
            src="/images/sentence_bridge_bg.png"
            alt="Sentence Bridge"
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
          />

          {/* ── 3 TARGET DROP SLOTS (Pixel-Matched directly over the 3 wooden boards in image) ── */}
          {[
            { idx: 0, left: '22.27%', top: '26.30%', width: '13.09%', height: '19.05%' },
            { idx: 1, left: '43.95%', top: '26.30%', width: '13.09%', height: '19.05%' },
            { idx: 2, left: '65.23%', top: '26.30%', width: '13.09%', height: '19.05%' },
          ].map(({ idx, left, top, width, height }) => {
            const placed = placedSlots[idx];
            return (
              <div
                key={idx}
                onClick={() => handleSlotClick(idx)}
                style={{ left, top, width, height }}
                className="absolute z-10 flex items-center justify-center p-0.5 sm:p-1 cursor-pointer select-none"
                title={placed ? 'ඉවත් කිරීමට ක්ලික් කරන්න' : `ස්ථානය ${idx + 1}`}
              >
                {placed ? (
                  <div
                    className={`w-full h-full ${placed.color} rounded-xl shadow-md border-2 border-amber-900/40 flex items-center justify-center font-black text-xs sm:text-sm md:text-base lg:text-lg text-center px-1 animate-scale-in`}
                  >
                    <span className="drop-shadow-xs truncate">{placed.text}</span>
                  </div>
                ) : (
                  <div className="w-full h-full rounded-xl border border-dashed border-amber-800/30 hover:border-amber-800/70 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <span className="text-[10px] sm:text-xs md:text-sm font-extrabold text-amber-900/40 select-none">
                      ස්ථානය {idx + 1}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* ── INTERACTIVE WOODEN PLANKS ON BRIDGE WALKWAY ── */}
          <div
            style={{ left: '16.0%', top: '61.5%', width: '68.0%', height: '20.0%' }}
            className="absolute z-10 flex items-center justify-center gap-2 sm:gap-4 md:gap-6 px-2"
          >
            {availableWords.map((word) => (
              <button
                key={word.id}
                onClick={() => handleWordClick(word)}
                className={`flex-1 h-full max-w-[170px] rounded-xl ${word.color} border-2 md:border-3 border-amber-900/60 flex items-center justify-center font-black text-xs sm:text-sm md:text-base lg:text-xl shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all select-none px-1.5`}
              >
                <span className="truncate">{word.text}</span>
              </button>
            ))}

            {availableWords.length === 0 && (
              <div className="bg-emerald-600/95 text-white font-extrabold text-xs sm:text-sm md:text-base px-4 py-1.5 rounded-full shadow-2xl border border-white flex items-center gap-2 animate-bounce backdrop-blur-xs">
                <span>✨ සියලු වචන පාලම මත තබා ඇත! පහතින් ලියන්න ✍️ ✨</span>
              </div>
            )}
          </div>

        </div>

        {/* ── BOTTOM SENTENCE TRACING BOARD (වාක්‍යය ලියන්න - Single Dotted Guideline) ── */}
        <div className="bg-amber-50 rounded-3xl p-3 md:p-4 shadow-xl border-4 border-amber-200 mt-3 relative">
          
          {/* Header Tab Pill */}
          <div className="absolute -top-3.5 left-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs md:text-sm px-6 py-1 rounded-full shadow-md border-2 border-white">
            වාක්‍යය ලියන්න.
          </div>

          {/* Left / Right Mascots */}
          <div className="absolute -left-3 -bottom-3 text-4xl md:text-5xl drop-shadow-md pointer-events-none select-none animate-bounce">
            🐦
          </div>
          <div className="absolute -right-3 -bottom-3 text-4xl md:text-5xl drop-shadow-md pointer-events-none select-none">
            🐣
          </div>

          {/* Clean Writing Box */}
          <div
            className={`mx-8 md:mx-12 my-1 h-18 md:h-22 bg-white rounded-2xl border-2 flex items-center justify-center relative overflow-hidden transition-all shadow-inner ${
              isTracingDone
                ? 'bg-emerald-50 border-emerald-500'
                : isAllSlotsPlaced
                ? 'border-amber-400 cursor-crosshair ring-2 ring-amber-200'
                : 'border-slate-300 opacity-60 cursor-not-allowed'
            }`}
          >
            {/* Crisp Single Sinhala Guide Text (Reflects the sentence as formed by student) */}
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center px-4">
              <span
                className="text-slate-300 font-extrabold select-none tracking-wide text-center pointer-events-none whitespace-nowrap overflow-hidden"
                style={{
                  fontSize: '2rem',
                  lineHeight: '2.8rem',
                  fontFamily: "'Noto Sans Sinhala', 'Iskoola Pota', sans-serif",
                  letterSpacing: '0.04em',
                }}
              >
                {isAllSlotsPlaced ? placedSlots.map((s) => s.text).join(' ') + '.' : currentQ.fullSentence}
              </span>
            </div>

            {/* Freehand Canvas Drawing */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full touch-none z-20"
              onMouseDown={handleStartDraw}
              onMouseMove={handleMoveDraw}
              onMouseUp={handleEndDraw}
              onMouseLeave={handleEndDraw}
              onTouchStart={handleStartDraw}
              onTouchMove={handleMoveDraw}
              onTouchEnd={handleEndDraw}
            />

            {/* Success Badge */}
            {isConfirmed && submissionResult === 'correct' && (
              <div className="absolute top-2 right-4 z-30 animate-bounce">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full shadow-md border-2 border-white flex items-center justify-center font-black text-sm">
                  ✓
                </div>
              </div>
            )}

            {/* Error Badge */}
            {isConfirmed && submissionResult === 'wrong' && (
              <div className="absolute top-2 right-4 z-30 animate-bounce">
                <div className="w-8 h-8 bg-rose-500 text-white rounded-full shadow-md border-2 border-white flex items-center justify-center font-black text-sm">
                  ✕
                </div>
              </div>
            )}

            {/* Result Feedback Banner */}
            {isConfirmed && feedbackMessage && (
              <div
                className={`absolute inset-x-2 bottom-1.5 text-center text-xs md:text-sm font-black py-1.5 px-3 rounded-xl shadow-lg z-30 flex items-center justify-center gap-2 animate-fade-in ${
                  submissionResult === 'correct'
                    ? 'bg-emerald-600 text-white border border-white'
                    : 'bg-rose-600 text-white border border-white'
                }`}
              >
                <span>{feedbackMessage}</span>
              </div>
            )}

            {/* Tip Message Toast (before confirm) */}
            {!isConfirmed && tipMessage && (
              <div className="absolute bottom-1.5 inset-x-8 text-center bg-amber-500 text-white text-xs font-black py-1 px-3 rounded-full shadow-lg z-30 animate-bounce">
                {tipMessage}
              </div>
            )}

            {/* Clear Button */}
            {isAllSlotsPlaced && !isConfirmed && (
              <button
                onClick={clearCanvas}
                className="absolute right-3 bottom-2.5 z-30 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                title="මකන්න"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ── BOTTOM ACTION BUTTONS ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          
          {isConfirmed ? (
            <>
              {/* Proceed to Next Question Button (Large Purple/Indigo) */}
              <button
                onClick={handleNextQuestion}
                className="flex-1 min-w-[200px] py-3 px-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 active:scale-95 text-white font-black text-base md:text-lg rounded-2xl shadow-xl border-2 border-white flex items-center justify-center gap-3 cursor-pointer transition-all animate-bounce-short"
              >
                <span>{currentIdx < LEVEL3_ACT2_QUESTIONS.length - 1 ? 'ඊළඟ ප්‍රශ්නය' : 'ප්‍රතිඵල බලන්න'}</span>
                <span className="text-xl">➔</span>
              </button>

              {/* Listen Correct Sentence */}
              <button
                onClick={() => {
                  playSound('click');
                  speakSinhala(currentQ.fullSentence);
                }}
                className="py-3 px-6 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 active:scale-95 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>🔊</span>
                <span>නිවැරදි වාක්‍යය අසන්න</span>
              </button>
            </>
          ) : (
            <>
              {/* Confirm Button (Green) - Validates handwriting & order when clicked */}
              <button
                onClick={handleConfirmTracing}
                disabled={!isAllSlotsPlaced}
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 transition-all active:scale-95 text-white font-black text-sm md:text-base ${
                  isAllSlotsPlaced
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 ring-4 ring-emerald-300 animate-pulse cursor-pointer'
                    : 'bg-slate-400 opacity-60 cursor-not-allowed'
                }`}
              >
                <span>✓</span>
                <span>තහවුරු කරන්න</span>
              </button>

              {/* Restart Question (Orange) */}
              <button
                onClick={handleRestartCurrent}
                className="flex-1 min-w-[130px] py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>🔄</span>
                <span>නැවත අරඹන්න</span>
              </button>

              {/* Advice / Hint (Teal) */}
              <button
                onClick={handleShowHint}
                className="flex-1 min-w-[130px] py-2.5 px-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 active:scale-95 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>💡</span>
                <span>උපදෙස්</span>
              </button>

              {/* Listen Again (Blue) */}
              <button
                onClick={() => {
                  playSound('click');
                  speakSinhala(currentQ.voicePrompt);
                }}
                className="flex-1 min-w-[130px] py-2.5 px-4 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 active:scale-95 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>🔊</span>
                <span>යළිත් අසන්න</span>
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
