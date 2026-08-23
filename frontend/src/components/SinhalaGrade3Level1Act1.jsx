import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 10 Questions for Grade 3 Level 1 Activity 1 (ගැලපෙන අක්ෂරය තෝරා ලියන්න) ──
const GRADE3_L1_ACT1_QUESTIONS = [
  {
    id: 1,
    num: 1,
    prefix: 'කො',
    suffix: 'යකට',
    correctLetter: 'ළ',
    fullWord: 'කොළයකට',
    meaning: 'on a leaf',
    imageEmoji: '🍃💧',
    voicePrompt: 'කොළයකට යන වචනය සම්පූර්ණ කිරීමට ගැලපෙන අකුර මත ලියන්න.',
    options: [
      { id: 'opt_1', letter: 'ල', isCorrect: false, bg: 'bg-pink-50', border: 'border-pink-300', textBtn: 'text-pink-600', btnBg: 'bg-pink-100' },
      { id: 'opt_2', letter: 'ළ', isCorrect: true, bg: 'bg-sky-50', border: 'border-sky-300', textBtn: 'text-sky-600', btnBg: 'bg-sky-100' },
    ]
  },
  {
    id: 2,
    num: 2,
    prefix: 'කෝ',
    suffix: 'ය',
    correctLetter: 'ෂ',
    fullWord: 'කෝෂය',
    meaning: 'cell / battery',
    imageEmoji: '🔋⚡',
    voicePrompt: 'කෝෂය යන වචනය සම්පූර්ණ කිරීමට ගැලපෙන අකුර මත ලියන්න.',
    options: [
      { id: 'opt_1', letter: 'ශ', isCorrect: false, bg: 'bg-purple-50', border: 'border-purple-300', textBtn: 'text-purple-600', btnBg: 'bg-purple-100' },
      { id: 'opt_2', letter: 'ෂ', isCorrect: true, bg: 'bg-sky-50', border: 'border-sky-300', textBtn: 'text-sky-600', btnBg: 'bg-sky-100' },
    ]
  },
  {
    id: 3,
    num: 3,
    prefix: 'යා',
    suffix: 'වෝ',
    correctLetter: 'ලු',
    fullWord: 'යාලුවෝ',
    meaning: 'friends',
    imageEmoji: '👭🎈',
    voicePrompt: 'යාලුවෝ යන වචනය සම්පූර්ණ කිරීමට ගැලපෙන අකුර මත ලියන්න.',
    options: [
      { id: 'opt_1', letter: 'ළු', isCorrect: false, bg: 'bg-pink-50', border: 'border-pink-300', textBtn: 'text-pink-600', btnBg: 'bg-pink-100' },
      { id: 'opt_2', letter: 'ලු', isCorrect: true, bg: 'bg-sky-50', border: 'border-sky-300', textBtn: 'text-sky-600', btnBg: 'bg-sky-100' },
    ]
  },
  {
    id: 4,
    num: 4,
    prefix: 'ද',
    suffix: 'ඹුවා',
    correctLetter: 'ළ',
    fullWord: 'දළඹුවා',
    meaning: 'caterpillar',
    imageEmoji: '🐛🌿',
    voicePrompt: 'දළඹුවා යන වචනය සම්පූර්ණ කිරීමට ගැලපෙන අකුර මත ලියන්න.',
    options: [
      { id: 'opt_1', letter: 'ල', isCorrect: false, bg: 'bg-pink-50', border: 'border-pink-300', textBtn: 'text-pink-600', btnBg: 'bg-pink-100' },
      { id: 'opt_2', letter: 'ළ', isCorrect: true, bg: 'bg-sky-50', border: 'border-sky-300', textBtn: 'text-sky-600', btnBg: 'bg-sky-100' },
    ]
  },
  {
    id: 5,
    num: 5,
    prefix: 'දක්',
    suffix: 'තා',
    correctLetter: 'ෂ',
    fullWord: 'දක්ෂතා',
    meaning: 'talents',
    imageEmoji: '🏆🌟',
    voicePrompt: 'දක්ෂතා යන වචනය සම්පූර්ණ කිරීමට ගැලපෙන අකුර මත ලියන්න.',
    options: [
      { id: 'opt_1', letter: 'ෂ', isCorrect: true, bg: 'bg-pink-50', border: 'border-pink-300', textBtn: 'text-pink-600', btnBg: 'bg-pink-100' },
      { id: 'opt_2', letter: 'ශ', isCorrect: false, bg: 'bg-sky-50', border: 'border-sky-300', textBtn: 'text-sky-600', btnBg: 'bg-sky-100' },
    ]
  },
  {
    id: 6,
    num: 6,
    prefix: 'සාර්',
    suffix: 'කයි',
    correctLetter: 'ථ',
    fullWord: 'සාර්ථකයි',
    meaning: 'successful',
    imageEmoji: '🎯✨',
    voicePrompt: 'සාර්ථකයි යන වචනය සම්පූර්ණ කිරීමට ගැලපෙන අකුර මත ලියන්න.',
    options: [
      { id: 'opt_1', letter: 'ථ', isCorrect: true, bg: 'bg-pink-50', border: 'border-pink-300', textBtn: 'text-pink-600', btnBg: 'bg-pink-100' },
      { id: 'opt_2', letter: 'ත', isCorrect: false, bg: 'bg-sky-50', border: 'border-sky-300', textBtn: 'text-sky-600', btnBg: 'bg-sky-100' },
    ]
  },
  {
    id: 7,
    num: 7,
    prefix: 'වි',
    suffix: 'ල',
    correctLetter: 'ශා',
    fullWord: 'විශාල',
    meaning: 'huge / large',
    imageEmoji: '🐘🏞️',
    voicePrompt: 'විශාල යන වචනය සම්පූර්ණ කිරීමට ගැලපෙන අකුර මත ලියන්න.',
    options: [
      { id: 'opt_1', letter: 'ශා', isCorrect: true, bg: 'bg-pink-50', border: 'border-pink-300', textBtn: 'text-pink-600', btnBg: 'bg-pink-100' },
      { id: 'opt_2', letter: 'ෂා', isCorrect: false, bg: 'bg-sky-50', border: 'border-sky-300', textBtn: 'text-sky-600', btnBg: 'bg-sky-100' },
    ]
  },
  {
    id: 8,
    num: 8,
    prefix: 'ද',
    suffix: 'හිස',
    correctLetter: 'ණ',
    fullWord: 'දණහිස',
    meaning: 'knee',
    imageEmoji: '🦵🩺',
    voicePrompt: 'දණහිස යන වචනය සම්පූර්ණ කිරීමට ගැලපෙන අකුර මත ලියන්න.',
    options: [
      { id: 'opt_1', letter: 'ණ', isCorrect: true, bg: 'bg-pink-50', border: 'border-pink-300', textBtn: 'text-pink-600', btnBg: 'bg-pink-100' },
      { id: 'opt_2', letter: 'න', isCorrect: false, bg: 'bg-sky-50', border: 'border-sky-300', textBtn: 'text-sky-600', btnBg: 'bg-sky-100' },
    ]
  },
  {
    id: 9,
    num: 9,
    prefix: '',
    suffix: 'ජය',
    correctLetter: 'ධ',
    fullWord: 'ධජය',
    meaning: 'flag',
    imageEmoji: '🚩🦁',
    voicePrompt: 'ධජය යන වචනය සම්පූර්ණ කිරීමට ගැලපෙන අකුර මත ලියන්න.',
    options: [
      { id: 'opt_1', letter: 'ධ', isCorrect: true, bg: 'bg-pink-50', border: 'border-pink-300', textBtn: 'text-pink-600', btnBg: 'bg-pink-100' },
      { id: 'opt_2', letter: 'ද', isCorrect: false, bg: 'bg-sky-50', border: 'border-sky-300', textBtn: 'text-sky-600', btnBg: 'bg-sky-100' },
    ]
  },
  {
    id: 10,
    num: 10,
    prefix: 'නුව',
    suffix: 'ති',
    correctLetter: 'ණැ',
    fullWord: 'නුවණැති',
    meaning: 'wise / clever',
    imageEmoji: '🦉📖',
    voicePrompt: 'නුවණැති යන වචනය සම්පූර්ණ කිරීමට ගැලපෙන අකුර මත ලියන්න.',
    options: [
      { id: 'opt_1', letter: 'ණැ', isCorrect: true, bg: 'bg-pink-50', border: 'border-pink-300', textBtn: 'text-pink-600', btnBg: 'bg-pink-100' },
      { id: 'opt_2', letter: 'නැ', isCorrect: false, bg: 'bg-sky-50', border: 'border-sky-300', textBtn: 'text-sky-600', btnBg: 'bg-sky-100' },
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

function TracingLetterCard({ option, isTarget, isSelected, isAnswered, onTracedSuccess, onWrongAttempt }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const pointsRef = useRef([]);
  const [hasTraced, setHasTraced] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasTraced(false);
    pointsRef.current = [];
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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isTarget ? '#16A34A' : '#DC2626';
    isDrawingRef.current = true;
    pointsRef.current.push(pos);
  };

  const handleMove = (e) => {
    if (!isDrawingRef.current || isAnswered) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    pointsRef.current.push(pos);
  };

  const handleEnd = (e) => {
    if (!isDrawingRef.current) return;
    e?.preventDefault();
    isDrawingRef.current = false;
    if (pointsRef.current.length < 15) return;

    if (isTarget) {
      setHasTraced(true);
      onTracedSuccess(option.letter);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      onWrongAttempt(option.letter);
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        pointsRef.current = [];
      }, 800);
    }
  };

  return (
    <div
      className={`flex-1 rounded-3xl p-3 md:p-4 border-3 shadow-md flex flex-col items-center justify-between transition-all duration-300 relative select-none ${
        option.bg
      } ${
        hasTraced
          ? 'border-emerald-500 ring-4 ring-emerald-200 bg-emerald-50/60'
          : isSelected && !isTarget
          ? 'border-rose-400 ring-2 ring-rose-200'
          : option.border
      } ${shake ? 'animate-bounce' : 'hover:shadow-lg'}`}
    >
      {hasTraced && (
        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow">
          ✓
        </div>
      )}

      <div className="w-full h-32 sm:h-36 md:h-40 flex items-center justify-center relative">
        <svg viewBox="0 0 200 160" className="w-full h-full pointer-events-none select-none">
          <text
            x="100"
            y="105"
            textAnchor="middle"
            fontSize="100"
            fontWeight="300"
            fontFamily="'Noto Sans Sinhala', 'Iskoola Pota', sans-serif"
            fill="none"
            stroke="#475569"
            strokeWidth="1.6"
            strokeDasharray="4, 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {option.letter}
          </text>
        </svg>

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
      </div>

      <div
        className={`w-full py-1.5 rounded-2xl text-center text-xs md:text-sm font-black flex items-center justify-center gap-1 shadow-xs ${option.btnBg} ${option.textBtn}`}
      >
        <span>👆</span>
        <span>මත ලියන්න</span>
      </div>
    </div>
  );
}

export default function SinhalaGrade3Level1Act1({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(120);
  const [isAnswered, setIsAnswered] = useState(false);
  const [filledLetter, setFilledLetter] = useState(null);
  const [isAllDone, setIsAllDone] = useState(false);

  const currentQ = GRADE3_L1_ACT1_QUESTIONS[currentIndex];

  useEffect(() => {
    setIsAnswered(false);
    setFilledLetter(null);
    const timer = setTimeout(() => {
      speakSinhala(currentQ.voicePrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleTracedSuccess = (letter) => {
    playSound('correct');
    setIsAnswered(true);
    setFilledLetter(letter);
    setScore((prev) => prev + 10);
    speakSinhala(`විශිෂ්ටයි! ${currentQ.fullWord}.`);
  };

  const handleWrongAttempt = () => {
    playSound('wrong');
    speakSinhala('නැවත උත්සාහ කරන්න.');
  };

  const handleNext = () => {
    playSound('click');
    if (currentIndex < GRADE3_L1_ACT1_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-7xl mb-2 animate-bounce">🏆🎉🐿️</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ Grade 3 Level 1 Activity 1 සාර්ථකව අවසන් කළා!</p>
          <div className="text-4xl font-black text-purple-600 mb-8">ලකුණු: {score} ⭐</div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/module/sinhala/grade3-level2-act1')}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🌟 Level 2 (නාම පද වර්ග කරමු) වෙත</span>
              <span className="text-2xl">➔</span>
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setIsAllDone(false);
                  setScore(120);
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
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200 font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-4">
      
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full px-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="w-11 h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="Dashboard"
          >
            ⬅️
          </button>

          <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-4 py-2 rounded-2xl font-black text-sm md:text-base shadow-md border-2 border-purple-400 flex items-center gap-1.5">
            <span className="text-yellow-300 text-lg">⭐</span>
            <span>{score}</span>
          </div>

          <div className="flex-1 max-w-md bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Level 1 · Activity 1: ගැලපෙන අක්ෂරය තෝරා ලියන්න
            </h1>
          </div>

          <button
            onClick={() => {
              playSound('click');
              speakSinhala(currentQ.voicePrompt);
            }}
            className="w-11 h-11 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="හඬ අසන්න"
          >
            🔊
          </button>
        </div>

        {/* Sub-instruction banner */}
        <div className="max-w-3xl mx-auto w-full mt-3">
          <div className="bg-white/95 backdrop-blur-md rounded-full py-2 px-5 shadow-md border-2 border-sky-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound('click');
                  speakSinhala('පහත දී ඇති වචනවල හිස්තැනට ගැලපෙන අක්ෂරය තෝරා ලියන්න.');
                }}
                className="w-8 h-8 bg-sky-500 hover:bg-sky-600 active:scale-90 text-white rounded-full flex items-center justify-center text-base shadow-sm cursor-pointer"
              >
                🔊
              </button>
              <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
                පහත දී ඇති වචනවල හිස්තැනට ගැලපෙන <span className="text-rose-500 font-extrabold">අක්ෂරය</span> තෝරා ලියන්න.
              </p>
            </div>
            <div className="text-3xl pointer-events-none select-none">✏️</div>
          </div>
        </div>
      </div>

      {/* Main Tracing Card */}
      <div className="max-w-4xl mx-auto w-full px-4 my-2 flex-1 flex items-center justify-center">
        <div className="w-full bg-white rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-2xl border-4 border-pink-200 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
          
          <div className="absolute top-4 left-4 w-9 h-9 md:w-10 md:h-10 rounded-full bg-rose-500 text-white font-black text-base md:text-lg flex items-center justify-center shadow-md border-2 border-white">
            {currentQ.num}
          </div>

          <div className="w-full max-w-xl mx-auto py-3 px-6 bg-white rounded-2xl border-2 border-pink-300 shadow-sm flex items-center justify-center gap-2 text-2xl sm:text-3xl md:text-4xl font-black text-slate-800">
            <span>{currentQ.prefix}</span>
            <span className={`inline-block min-w-[50px] text-center border-b-4 ${
              isAnswered ? 'border-emerald-500 text-emerald-600 animate-bounce' : 'border-rose-400 text-rose-500'
            }`}>
              {filledLetter || '_'}
            </span>
            <span>{currentQ.suffix}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-4">
            <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-3xl bg-gradient-to-tr from-sky-200 via-emerald-100 to-green-300 border-4 border-yellow-300 shadow-lg flex flex-col items-center justify-center p-3 relative overflow-hidden flex-shrink-0">
              <span className="text-6xl sm:text-7xl drop-shadow-md animate-pulse">
                {currentQ.imageEmoji}
              </span>
              <span className="text-[11px] font-black text-emerald-900 mt-2 bg-white/80 px-2.5 py-0.5 rounded-full shadow-xs">
                {currentQ.meaning}
              </span>
            </div>

            <div className="flex-1 w-full flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
              {currentQ.options.map((opt) => (
                <TracingLetterCard
                  key={opt.id + currentQ.id}
                  option={opt}
                  isTarget={opt.isCorrect}
                  isSelected={filledLetter === opt.letter}
                  isAnswered={isAnswered}
                  onTracedSuccess={handleTracedSuccess}
                  onWrongAttempt={handleWrongAttempt}
                />
              ))}
            </div>

            <div className="hidden md:flex flex-col items-center justify-end w-24 flex-shrink-0">
              <span className="text-6xl drop-shadow-lg animate-bounce">🐿️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-4xl mx-auto w-full px-4 mt-2">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="py-2.5 px-5 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <span>🏠</span>
            <span>මුල් පිටුව</span>
          </button>

          <div className="flex items-center gap-1.5 bg-white/90 px-4 py-2.5 rounded-full shadow-md border border-sky-300">
            {GRADE3_L1_ACT1_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-emerald-500 ring-2 ring-emerald-300 scale-125'
                    : i < currentIndex
                    ? 'bg-emerald-400'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`py-2.5 px-6 font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-2 transition-all ${
              isAnswered
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white cursor-pointer active:scale-95 animate-bounce-short'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>ඉදිරියට</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
