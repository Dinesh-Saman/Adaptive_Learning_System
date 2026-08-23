import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressionManager } from '../services/grade2ProgressionManager';

// ── 5 Question Datasets for Level 3 - Activity 1: රූපය බලලා වාක්‍යය ලියමු ──
const LEVEL3_ACT1_CARDS = [
  {
    id: 1,
    num: 1,
    themeColor: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-400',
    badgeBg: 'bg-pink-500',
    headerBg: 'bg-pink-100 text-pink-900 border-pink-200',
    titleText: 'රූපයට ගැලපෙන වාක්‍යය ඉරි මත ලියන්න.',
    imageType: 'girl_reading',
    imageEmoji: '👧📖',
    voicePrompt: 'දැරිය පොත කියවන රූපයට ගැලපෙන වාක්‍යය තෝරා ලියන්න.',
    options: [
      { id: 'c1_opt1', num: 1, text: 'දැරිය පොත කියවයි', isCorrect: true, badgeBg: 'bg-pink-500', border: 'border-pink-300', fontSize: 32 },
      { id: 'c1_opt2', num: 2, text: 'බල්ලා දුවයි', isCorrect: false, badgeBg: 'bg-amber-500', border: 'border-amber-300', fontSize: 32 },
      { id: 'c1_opt3', num: 3, text: 'කුරුල්ලා පියාසර කරයි', isCorrect: false, badgeBg: 'bg-sky-500', border: 'border-sky-300', fontSize: 28 },
    ],
    correctSentence: 'දැරිය පොත කියවයි'
  },
  {
    id: 2,
    num: 2,
    themeColor: 'from-sky-500 to-blue-600',
    borderColor: 'border-sky-400',
    badgeBg: 'bg-sky-500',
    headerBg: 'bg-sky-100 text-sky-900 border-sky-200',
    titleText: 'රූපයට ගැලපෙන වාක්‍යය ඉරි මත ලියන්න.',
    imageType: 'boy_playing',
    imageEmoji: '👦⚽',
    voicePrompt: 'පිරිමි ළමයා පන්දුව ගසන රූපයට ගැලපෙන වාක්‍යය තෝරා ලියන්න.',
    options: [
      { id: 'c2_opt1', num: 1, text: 'පිරිමි ළමයා පන්දුව ගසයි', isCorrect: true, badgeBg: 'bg-emerald-500', border: 'border-emerald-300', fontSize: 28 },
      { id: 'c2_opt2', num: 2, text: 'අම්මා ආහාර උයයි', isCorrect: false, badgeBg: 'bg-amber-500', border: 'border-amber-300', fontSize: 30 },
      { id: 'c2_opt3', num: 3, text: 'මාළුවා පීනයි', isCorrect: false, badgeBg: 'bg-purple-500', border: 'border-purple-300', fontSize: 32 },
    ],
    correctSentence: 'පිරිමි ළමයා පන්දුව ගසයි'
  },
  {
    id: 3,
    num: 3,
    themeColor: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-400',
    badgeBg: 'bg-emerald-500',
    headerBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    titleText: 'රූපයට ගැලපෙන වාක්‍යය ඉරි මත ලියන්න.',
    imageType: 'bird_tree',
    imageEmoji: '🐦🌳',
    voicePrompt: 'කුරුල්ලා ගසේ ඉන්නා රූපයට ගැලපෙන වාක්‍යය තෝරා ලියන්න.',
    options: [
      { id: 'c3_opt1', num: 1, text: 'කුරුල්ලා ගසේ ඉඳී', isCorrect: true, badgeBg: 'bg-pink-500', border: 'border-pink-300', fontSize: 30 },
      { id: 'c3_opt2', num: 2, text: 'බල්ලා නිදයි', isCorrect: false, badgeBg: 'bg-sky-500', border: 'border-sky-300', fontSize: 32 },
      { id: 'c3_opt3', num: 3, text: 'දැරිය ලියයි', isCorrect: false, badgeBg: 'bg-amber-500', border: 'border-amber-300', fontSize: 32 },
    ],
    correctSentence: 'කුරුල්ලා ගසේ ඉඳී'
  },
  {
    id: 4,
    num: 4,
    themeColor: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-400',
    badgeBg: 'bg-purple-600',
    headerBg: 'bg-purple-100 text-purple-900 border-purple-200',
    titleText: 'රූපයට ගැලපෙන වාක්‍යය ඉරි මත ලියන්න.',
    imageType: 'fish_water',
    imageEmoji: '🐟🌊',
    voicePrompt: 'මාළුවා පීනන රූපයට ගැලපෙන වාක්‍යය තෝරා ලියන්න.',
    options: [
      { id: 'c4_opt1', num: 1, text: 'මාළුවා පීනයි', isCorrect: true, badgeBg: 'bg-sky-500', border: 'border-sky-300', fontSize: 32 },
      { id: 'c4_opt2', num: 2, text: 'හාවා දුවයි', isCorrect: false, badgeBg: 'bg-pink-500', border: 'border-pink-300', fontSize: 32 },
      { id: 'c4_opt3', num: 3, text: 'අම්මා උයයි', isCorrect: false, badgeBg: 'bg-emerald-500', border: 'border-emerald-300', fontSize: 32 },
    ],
    correctSentence: 'මාළුවා පීනයි'
  },
  {
    id: 5,
    num: 5,
    themeColor: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-400',
    badgeBg: 'bg-amber-500',
    headerBg: 'bg-amber-100 text-amber-900 border-amber-200',
    titleText: 'රූපයට ගැලපෙන වාක්‍යය ඉරි මත ලියන්න.',
    imageType: 'mother_cooking',
    imageEmoji: '👩🍲',
    voicePrompt: 'අම්මා ආහාර උයන රූපයට ගැලපෙන වාක්‍යය තෝරා ලියන්න.',
    options: [
      { id: 'c5_opt1', num: 1, text: 'අම්මා ආහාර උයයි', isCorrect: true, badgeBg: 'bg-pink-500', border: 'border-pink-300', fontSize: 30 },
      { id: 'c5_opt2', num: 2, text: 'කුරුල්ලා පියාසර කරයි', isCorrect: false, badgeBg: 'bg-sky-500', border: 'border-sky-300', fontSize: 28 },
      { id: 'c5_opt3', num: 3, text: 'ගස වැඩෙයි', isCorrect: false, badgeBg: 'bg-emerald-500', border: 'border-emerald-300', fontSize: 32 },
    ],
    correctSentence: 'අම්මා ආහාර උයයි'
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
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
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
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

// ── SVG Dotted Sentence Tracing Strip ──
function SentenceOptionStrip({
  option,
  isCorrectOption,
  isCardCompleted,
  onComplete,
  onWrong,
  onIncomplete
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasTraced, setHasTraced] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#10b981');
  const [drawnPoints, setDrawnPoints] = useState([]);
  const [tipMessage, setTipMessage] = useState('');

  // Dynamically size canvas buffer to match exact rendered element size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width && rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 6;
  }, []);

  const getCanvasCoords = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : (e.clientX !== undefined ? e.clientX : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : 0));
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : (e.clientY !== undefined ? e.clientY : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : 0));
    const scaleX = canvas.width / (rect.width || 1);
    const scaleY = canvas.height / (rect.height || 1);
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (isCardCompleted && hasTraced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e, canvas);

    const color = isCorrectOption ? '#10b981' : '#ef4444';
    setStrokeColor(color);
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);
    setDrawnPoints([{ x, y }]);
    setTipMessage('');
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e, canvas);

    ctx.lineTo(x, y);
    ctx.stroke();
    setDrawnPoints((prev) => [...prev, { x, y }]);
  };

  const handlePointerUp = (e) => {
    if (!isDrawing) return;
    e.stopPropagation();
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const minX = Math.min(...drawnPoints.map((p) => p.x));
    const maxX = Math.max(...drawnPoints.map((p) => p.x));
    const widthCovered = maxX - minX;

    let verticalReversals = 0;
    let prevDy = 0;
    for (let i = 2; i < drawnPoints.length; i++) {
      const dy = drawnPoints[i].y - drawnPoints[i - 1].y;
      if (Math.abs(dy) > 1.2) {
        if (prevDy !== 0 && ((dy > 0 && prevDy < 0) || (dy < 0 && prevDy > 0))) {
          verticalReversals++;
        }
        prevDy = dy;
      }
    }

    if (drawnPoints.length < 30 || widthCovered < canvas.width * 0.65 || verticalReversals < 8) {
      onIncomplete('වාක්‍යය සම්පූර්ණයෙන්ම ලියන්න!');
      setTipMessage('අකුරු වල නියම හැඩය අනුව ලියන්න ✍️');
      setTimeout(() => setTipMessage(''), 2000);
      return;
    }

    if (isCorrectOption) {
      setHasTraced(true);
      onComplete();
    } else {
      onWrong(option.text);
      setTipMessage('නැවත උත්සාහ කරන්න ❌');
      setTimeout(() => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setTipMessage('');
      }, 1000);
    }
  };

  const clearThisStrip = (e) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasTraced(false);
  };

  return (
    <div className="flex items-center gap-3.5 w-full my-1.5">
      {/* Option Number Circle */}
      <div
        className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl ${option.badgeBg} text-white flex items-center justify-center font-black text-lg md:text-xl shadow-md flex-shrink-0`}
      >
        {option.num}
      </div>

      {/* Single Clean Outline Rectangle Tracing Strip */}
      <div
        className="flex-1 relative h-24 md:h-26 rounded-2xl bg-slate-50/60 hover:bg-white border-2 border-slate-200 hover:border-purple-400 flex items-center justify-center overflow-hidden shadow-xs transition-all select-none"
      >
        {/* Crisp Large Sinhala Tracing Text (Left-Aligned, Fixed 2.2rem on Single Line) */}
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-start px-6 md:px-8">
          <span
            className="text-slate-300 font-extrabold select-none tracking-wide text-left pointer-events-none whitespace-nowrap overflow-hidden"
            style={{
              fontSize: '2.2rem',
              lineHeight: '3rem',
              fontFamily: "'Noto Sans Sinhala', 'Iskoola Pota', sans-serif",
              letterSpacing: '0.04em',
            }}
          >
            {option.text}
          </span>
        </div>

        {/* Freehand Interactive Drawing Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="absolute inset-0 w-full h-full z-20 cursor-crosshair touch-none"
        />

        {/* Success Checkmark */}
        {hasTraced && (
          <div className="absolute top-2 right-3 z-30 animate-bounce">
            <div className="w-8 h-8 bg-emerald-500 text-white rounded-full shadow-md border-2 border-white flex items-center justify-center font-black text-sm">
              ✓
            </div>
          </div>
        )}

        {/* Tip Message */}
        {tipMessage && (
          <div className="absolute bottom-1.5 inset-x-4 text-center bg-amber-500 text-white text-xs font-black py-1 px-3 rounded-full shadow-lg z-30 animate-bounce">
            {tipMessage}
          </div>
        )}
      </div>

      {/* Clear Button */}
      <button
        onClick={clearThisStrip}
        className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-black shadow-xs cursor-pointer active:scale-95 transition-all"
        title="මකන්න"
      >
        ✕
      </button>
    </div>
  );
}

// ── High-Quality Illustrated Graphic Display Box (Full Width & Height, No Caption) ──
function CardGraphicIllustration({ type }) {
  if (type === 'girl_reading') {
    return (
      <div className="w-full h-full min-h-[280px] md:min-h-[340px] bg-amber-50 rounded-3xl relative overflow-hidden border-3 border-amber-300 shadow-md flex items-center justify-center group">
        <img
          src="/images/girl_reading_book.png"
          alt="පොත කියවන දැරිය"
          className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    );
  }

  if (type === 'boy_playing') {
    return (
      <div className="w-full h-full min-h-[280px] md:min-h-[340px] bg-sky-50 rounded-3xl relative overflow-hidden border-3 border-sky-300 shadow-md flex items-center justify-center group">
        <img
          src="/images/boy_playing_ball.png"
          alt="පන්දුව ගසන පිරිමි ළමයා"
          className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    );
  }

  if (type === 'bird_tree') {
    return (
      <div className="w-full h-full min-h-[280px] md:min-h-[340px] bg-emerald-50 rounded-3xl relative overflow-hidden border-3 border-emerald-300 shadow-md flex items-center justify-center group">
        <img
          src="/images/bird_on_tree.png"
          alt="ගසේ ඉන්නා කුරුල්ලා"
          className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    );
  }

  if (type === 'fish_water') {
    return (
      <div className="w-full h-full min-h-[280px] md:min-h-[340px] bg-cyan-50 rounded-3xl relative overflow-hidden border-3 border-cyan-300 shadow-md flex items-center justify-center group">
        <img
          src="/images/fish_swimming.png"
          alt="දියෙහි පීනන මාළුවා"
          className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    );
  }

  // Mother Cooking
  return (
    <div className="w-full h-full min-h-[280px] md:min-h-[340px] bg-amber-50 rounded-3xl relative overflow-hidden border-3 border-amber-300 shadow-md flex items-center justify-center group">
      <img
        src="/images/mother_cooking.png"
        alt="ආහාර උයන අම්මා"
        className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-500"
      />
    </div>
  );
}

// ── Main Grade 2 Level 3 Activity 1: Step-by-Step Question Component ──
export default function SinhalaGrade2Level3Act1({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState({});
  const [score, setScore] = useState(120);
  const [isFinished, setIsFinished] = useState(false);

  const currentCard = LEVEL3_ACT1_CARDS[currentIndex];
  const isCurrentCompleted = completedCards[currentCard.id];

  // Play voice instructions on step change
  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala(currentCard.voicePrompt);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleSpeakerClick = () => {
    playSound('click');
    speakSinhala(currentCard.voicePrompt);
  };

  const handleCompleteCard = (card, opt) => {
    playSound('correct');
    setCompletedCards((prev) => ({ ...prev, [card.id]: true }));
    setScore((prev) => prev + 25);
    speakSinhala(`විශිෂ්ටයි! "${opt.text}" නිවැරදියි!`);
  };

  const handleWrongCard = (card, text) => {
    playSound('wrong');
    speakSinhala('නැවත උත්සාහ කරන්න. රූපයට ගැලපෙන වාක්‍යය තෝරා ලියන්න.');
  };

  const handleIncompleteCard = (card, reason) => {
    playSound('incomplete');
    if (reason && reason.includes('ඉරි තුළ')) {
      speakSinhala('ඉරි තුළ පමණක් ලියන්න!');
    } else {
      speakSinhala('වාක්‍යය සම්පූර්ණයෙන්ම ලියන්න!');
    }
  };

  const handleNext = () => {
    playSound('click');
    if (currentIndex + 1 < LEVEL3_ACT1_CARDS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Record score in Progression Manager
      progressionManager.recordExerciseScore('l3_ex1', 100);
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    playSound('click');
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // ── Final Trophy Celebration Screen ──
  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-300 via-purple-100 to-pink-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-6xl mb-2 animate-bounce">🏆🎉</div>
          <h1 className="text-4xl font-extrabold text-purple-700 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-4">ඔබ Level 3 පළමු අභ්‍යාසය සාර්ථකව අවසන් කළා!</p>

          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-950 border-2 border-emerald-400 px-5 py-2.5 rounded-2xl text-sm font-black inline-flex items-center gap-2 mb-6 shadow-sm">
            <span className="text-xl">🌟</span>
            <span>ඊළඟ අභ්‍යාසය (Activity 2: වාක්‍ය පාලම) දැන් විවෘතයි!</span>
          </div>

          <div className="text-4xl font-black text-purple-600 mb-6">ලකුණු: {score} ⭐</div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/module/sinhala/grade2-level3-act2')}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 border-2 border-emerald-300 animate-pulse"
            >
              <span>🌉 ඊළඟ අභ්‍යාසය (Activity 2: වාක්‍ය පාලම)</span>
              <span className="text-2xl">➔</span>
            </button>
            <div className="flex gap-4 mt-1">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setCompletedCards({});
                  setIsFinished(false);
                }}
                className="flex-1 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-base rounded-2xl shadow-md cursor-pointer"
              >
                🔄 නැවත කරන්න
              </button>
              <button
                onClick={onExit || (() => navigate('/module/sinhala/grade2'))}
                className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-base rounded-2xl shadow-md cursor-pointer"
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
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200 font-sinhala select-none relative overflow-x-hidden pb-8">
      
      {/* Background Decor */}
      <div className="absolute top-2 right-10 text-6xl opacity-80 pointer-events-none">☁️</div>
      <div className="absolute top-6 left-12 text-6xl opacity-80 pointer-events-none">☁️</div>
      <div className="absolute top-24 right-20 text-4xl opacity-70 pointer-events-none animate-pulse">🦋</div>

      <div className="max-w-6xl mx-auto px-4 py-4 relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* ── TOP HEADER BAR ── */}
        <div className="flex items-center justify-between gap-3 mb-2">
          
          {/* Home Button */}
          <button
            onClick={onExit || (() => navigate('/module/sinhala/grade2'))}
            className="w-12 h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all flex-shrink-0"
            title="ආපසු"
          >
            🏠
          </button>

          {/* Activity Title Pill */}
          <div className="flex-1 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 text-white py-2.5 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-base md:text-lg font-extrabold tracking-wide drop-shadow flex items-center justify-center gap-2">
              <span>✨</span>
              <span>Level 3 · Activity 1: රූපය බලලා වාක්‍යය ලියමු</span>
              <span>✨</span>
            </h1>
          </div>

          {/* Speaker Button */}
          <button
            onClick={handleSpeakerClick}
            className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all flex-shrink-0"
            title="හඬ අසන්න"
          >
            🔊
          </button>
        </div>

        {/* ── STEP COUNTER & PROGRESS DOTS ── */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl px-5 py-2.5 shadow-md border border-white mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-purple-700 uppercase tracking-wider">ප්‍රශ්නය</span>
            <span className="bg-purple-600 text-white px-2.5 py-0.5 rounded-full text-xs font-black">
              {currentIndex + 1} / {LEVEL3_ACT1_CARDS.length}
            </span>
          </div>

          {/* 5 Step Indicator Dots */}
          <div className="flex items-center gap-2">
            {LEVEL3_ACT1_CARDS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition-all cursor-pointer ${
                  currentIndex === i
                    ? 'bg-purple-600 text-white ring-4 ring-purple-300 shadow-md scale-110'
                    : (completedCards[c.id] ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 text-slate-500')
                }`}
              >
                {completedCards[c.id] ? '✓' : i + 1}
              </button>
            ))}
          </div>

          {/* Score Badge */}
          <div className="bg-amber-400 text-amber-950 px-3 py-1 rounded-full font-black text-xs flex items-center gap-1 shadow-xs">
            <span>⭐</span>
            <span>{score}</span>
          </div>
        </div>

        {/* ── SINGLE FOCUSED QUESTION CARD (SIDE-BY-SIDE: IMAGE LEFT, ANSWERS RIGHT) ── */}
        <div className="bg-white rounded-[2.5rem] p-5 md:p-7 shadow-2xl border-6 border-yellow-300 relative my-auto">
          
          {/* Top Question Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl ${currentCard.badgeBg} text-white flex items-center justify-center font-black text-lg shadow-md`}>
                {currentCard.num}
              </div>
              <p className="text-base md:text-xl font-extrabold text-slate-800">
                {currentCard.titleText}
              </p>
            </div>
            
            <button
              onClick={handleSpeakerClick}
              className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center text-lg shadow cursor-pointer active:scale-95 transition-all"
              title="නැවත අසන්න"
            >
              🔊
            </button>
          </div>

          {/* ── 2-COLUMN GRID: LEFT IMAGE, RIGHT ANSWERS ── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Image / Illustration (4 Cols) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center h-full">
              <CardGraphicIllustration type={currentCard.imageType} emoji={currentCard.imageEmoji} />
            </div>

            {/* Right Column: 3 Tracing Sentence Strips (8 Cols) */}
            <div className="md:col-span-8 flex flex-col gap-3 justify-center">
              
              {/* Instruction Note */}
              <div className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
                <span>✏️</span>
                <span>රූපයට ගැලපෙන නිවැරදි වාක්‍යය මත ඔබේ ඇඟිල්ලෙන් ලියන්න:</span>
              </div>

              {/* 3 Large Dotted Tracing Sentence Strips */}
              <div className="flex flex-col gap-2.5">
                {currentCard.options.map((opt) => (
                  <SentenceOptionStrip
                    key={opt.id + currentCard.id}
                    option={opt}
                    isCorrectOption={opt.isCorrect}
                    isCardCompleted={isCurrentCompleted}
                    onComplete={() => handleCompleteCard(currentCard, opt)}
                    onWrong={(text) => handleWrongCard(currentCard, text)}
                    onIncomplete={(reason) => handleIncompleteCard(currentCard, reason)}
                  />
                ))}
              </div>

              {/* Checked Success Alert */}
              {isCurrentCompleted && (
                <div className="mt-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-300 text-center flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-sm animate-fade-in shadow-xs">
                  <span>🎉</span>
                  <span>විශිෂ්ටයි! ඔබ නිවැරදි වාක්‍යය සම්පූර්ණ කළා!</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ── BOTTOM NAVIGATION BUTTONS ── */}
        <div className="flex items-center justify-between gap-4 mt-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${
              currentIndex === 0
                ? 'bg-white/40 text-slate-400 cursor-not-allowed opacity-50'
                : 'bg-white text-slate-800 hover:bg-slate-50 shadow-md cursor-pointer active:scale-95'
            }`}
          >
            <span>⬅️</span>
            <span>පෙර ප්‍රශ්නය</span>
          </button>

          <button
            onClick={handleNext}
            className="flex-1 max-w-xs py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {currentIndex + 1 < LEVEL3_ACT1_CARDS.length ? (
              <>
                <span>ඊළඟ ප්‍රශ්නය</span>
                <span className="text-xl">➔</span>
              </>
            ) : (
              <>
                <span>🏆 අවසන් කරන්න</span>
                <span className="text-xl">✓</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
