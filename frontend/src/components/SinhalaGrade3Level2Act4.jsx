import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Sentence Unjumble Questions (වචන නිවැරදි ලෙස ගලපා වාක්‍යය ලියන්න) ──
const UNJUMBLE_QUESTIONS = [
  {
    id: 1,
    num: 1,
    jumbledWords: ['පක්ෂියා', 'යි', 'වැලි කුකුළා', 'ජාතික', 'අපේ'],
    correctOrder: ['අපේ', 'ජාතික', 'පක්ෂියා', 'වැලි කුකුළා', 'යි'],
    fullSentence: 'අපේ ජාතික පක්ෂියා වැලි කුකුළා යි.',
    meaning: 'Our national bird is the junglefowl.',
    imageEmoji: '🐓🇱🇰',
    themeColor: 'from-amber-400 to-orange-500',
    audioPrompt: 'වචන නිවැරදිව ගලපන්න. අපේ ජාතික පක්ෂියා වැලි කුකුළා යි.'
  },
  {
    id: 2,
    num: 2,
    jumbledWords: ['කියවීම', 'කරයි', 'මිනිසා', 'සම්පූර්ණ'],
    correctOrder: ['කියවීම', 'මිනිසා', 'සම්පූර්ණ', 'කරයි'],
    fullSentence: 'කියවීම මිනිසා සම්පූර්ණ කරයි.',
    meaning: 'Reading makes a full man.',
    imageEmoji: '📖🧠',
    themeColor: 'from-sky-400 to-blue-600',
    audioPrompt: 'වචන නිවැරදිව ගලපන්න. කියවීම මිනිසා සම්පූර්ණ කරයි.'
  },
  {
    id: 3,
    num: 3,
    jumbledWords: ['අපේ', 'පරිසරය', 'සුරැකීම', 'යුතුකමකි'],
    correctOrder: ['පරිසරය', 'සුරැකීම', 'අපේ', 'යුතුකමකි'],
    fullSentence: 'පරිසරය සුරැකීම අපේ යුතුකමකි.',
    meaning: 'Protecting the environment is our duty.',
    imageEmoji: '🌿🌍',
    themeColor: 'from-emerald-400 to-green-600',
    audioPrompt: 'වචන නිවැරදිව ගලපන්න. පරිසරය සුරැකීම අපේ යුතුකමකි.'
  },
  {
    id: 4,
    num: 4,
    jumbledWords: ['සතෙකි', 'ගවයා', 'අපට', 'ප්‍රයෝජනවත්'],
    correctOrder: ['ගවයා', 'අපට', 'ප්‍රයෝජනවත්', 'සතෙකි'],
    fullSentence: 'ගවයා අපට ප්‍රයෝජනවත් සතෙකි.',
    meaning: 'The cow is a useful animal to us.',
    imageEmoji: '🐄🥛',
    themeColor: 'from-amber-400 to-yellow-600',
    audioPrompt: 'වචන නිවැරදිව ගලපන්න. ගවයා අපට ප්‍රයෝජනවත් සතෙකි.'
  },
  {
    id: 5,
    num: 5,
    jumbledWords: ['දරුවෝ', 'හොඳ', 'වෙමු', 'අපි'],
    correctOrder: ['අපි', 'හොඳ', 'දරුවෝ', 'වෙමු'],
    fullSentence: 'අපි හොඳ දරුවෝ වෙමු.',
    meaning: 'We will be good children.',
    imageEmoji: '👧👦🌟',
    themeColor: 'from-purple-400 to-indigo-600',
    audioPrompt: 'වචන නිවැරදිව ගලපන්න. අපි හොඳ දරුවෝ වෙමු.'
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
    } else if (type === 'place') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
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

// ── Ruled Lined Canvas Slate for Full Sentence Tracing ──
function SentenceWritingSlate({ fullSentence }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [fullSentence]);

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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0284C7';
    isDrawingRef.current = true;
  };

  const handleMove = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handleEnd = (e) => {
    e?.preventDefault();
    isDrawingRef.current = false;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="w-full mt-3 p-3 bg-slate-50 rounded-2xl border-2 border-dashed border-sky-300">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
          <span>✍️</span>
          <span>දැන් වාක්‍යය තිත් ඉරි මත ලියන්න (Trace on dotted guide):</span>
        </span>
        <button
          onClick={handleClear}
          className="text-xs text-rose-500 hover:text-rose-700 font-bold underline cursor-pointer"
        >
          මකන්න
        </button>
      </div>

      <div className="relative w-full h-16 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-x-0 top-3 border-b border-sky-100 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-3 border-b border-sky-100 pointer-events-none"></div>

        <svg viewBox="0 0 520 50" className="w-full h-full pointer-events-none select-none">
          <text
            x="260"
            y="32"
            textAnchor="middle"
            fontSize="20"
            fontWeight="300"
            fontFamily="'Noto Sans Sinhala', 'Iskoola Pota', sans-serif"
            fill="none"
            stroke="#64748B"
            strokeWidth="1.2"
            strokeDasharray="3, 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {fullSentence}
          </text>
        </svg>

        <canvas
          ref={canvasRef}
          width={520}
          height={50}
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
    </div>
  );
}

// ── Main Grade 3 Level 2 Activity 4 Component ──
export default function SinhalaGrade3Level2Act4({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(120);
  const [isAllDone, setIsAllDone] = useState(false);
  const [tipMessage, setTipMessage] = useState(null);

  const currentQ = UNJUMBLE_QUESTIONS[currentIndex];

  useEffect(() => {
    setSelectedWords([]);
    setAvailableWords(currentQ.jumbledWords.map((w, idx) => ({ id: `${idx}_${w}`, text: w })));
    setIsConfirmed(false);
    setIsCorrect(false);
    setTipMessage(null);

    const timer = setTimeout(() => {
      speakSinhala(currentQ.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Click available word to add to sentence
  const handleAddWord = (wordObj) => {
    if (isConfirmed) return;
    playSound('place');
    speakSinhala(wordObj.text);
    setSelectedWords((prev) => [...prev, wordObj]);
    setAvailableWords((prev) => prev.filter((w) => w.id !== wordObj.id));
  };

  // Click placed word in sentence to remove back to pool
  const handleRemoveWord = (wordObj) => {
    if (isConfirmed) return;
    playSound('click');
    setSelectedWords((prev) => prev.filter((w) => w.id !== wordObj.id));
    setAvailableWords((prev) => [...prev, wordObj]);
  };

  // Confirm Sentence Order
  const handleConfirm = () => {
    if (selectedWords.length !== currentQ.correctOrder.length) {
      playSound('wrong');
      setTipMessage('කරුණාකර සියලුම වචන නිවැරදිව තෝරන්න!');
      speakSinhala('කරුණාකර සියලුම වචන තෝරා වාක්‍යය සම්පූර්ණ කරන්න.');
      setTimeout(() => setTipMessage(null), 2500);
      return;
    }

    playSound('click');
    const studentOrder = selectedWords.map((w) => w.text);
    const isOrderCorrect = studentOrder.every((word, idx) => word === currentQ.correctOrder[idx]);

    setIsConfirmed(true);
    setIsCorrect(isOrderCorrect);

    if (isOrderCorrect) {
      playSound('correct');
      setScore((prev) => prev + 20);
      speakSinhala(`විශිෂ්ටයි! ${currentQ.fullSentence}. දැන් වාක්‍යය ලියන්න.`);
    } else {
      playSound('wrong');
      speakSinhala('පිළිතුර වැරදියි. නිවැරදි අනුපිළිවෙල පරීක්ෂා කර නැවත උත්සාහ කරන්න.');
    }
  };

  const handleRetryQuestion = () => {
    playSound('click');
    setSelectedWords([]);
    setAvailableWords(currentQ.jumbledWords.map((w, idx) => ({ id: `${idx}_${w}`, text: w })));
    setIsConfirmed(false);
    setIsCorrect(false);
    speakSinhala('නැවත උත්සාහ කරන්න.');
  };

  const handleNext = () => {
    playSound('click');
    if (currentIndex < UNJUMBLE_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-purple-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-7xl mb-2 animate-bounce">🏆🎉🇱🇰</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ Grade 3 Level 2 Activity 4 සාර්ථකව අවසන් කළා!</p>
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
              onClick={() => {
                setCurrentIndex(0);
                setIsAllDone(false);
                setScore(120);
              }}
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
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-100 to-emerald-200 font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-6">
      
      {/* ── TOP HEADER BAR ── */}
      <div className="max-w-5xl mx-auto w-full px-4 pt-3">
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
              <span>Level 2 · Activity 4</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          {/* Center Title Banner */}
          <div className="flex-1 max-w-lg bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 4: වචන ගලපා වාක්‍යය ලියන්න
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/95 text-purple-900 px-4 py-2 rounded-2xl font-black text-sm md:text-base shadow-md border-2 border-purple-200 flex items-center gap-1.5">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span>{score}</span>
            </div>

            <button
              onClick={() => {
                playSound('click');
                speakSinhala(currentQ.audioPrompt);
              }}
              className="w-11 h-11 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
              title="හඬ අසන්න"
            >
              🔊
            </button>
          </div>
        </div>

        {/* Sub-instruction banner */}
        <div className="max-w-3xl mx-auto w-full mt-3">
          <div className="bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-purple-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound('click');
                  speakSinhala(currentQ.audioPrompt);
                }}
                className="w-8 h-8 bg-purple-600 hover:bg-purple-700 active:scale-90 text-white rounded-full flex items-center justify-center text-base shadow-sm cursor-pointer"
              >
                🔊
              </button>
              <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
                🧩 වචන <span className="text-purple-700 font-extrabold underline">නිවැරදි අනුපිළිවෙලට තෝරා</span> වාක්‍යය ගොඩනගන්න.
              </p>
            </div>
            <div className="text-2xl pointer-events-none select-none">
              ✍️
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN UNJUMBLE WORKSPACE CONTAINER ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-purple-200 flex flex-col gap-4 relative overflow-hidden">
          
          {/* Header & Meaning Row */}
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-black text-sm md:text-base flex items-center justify-center shadow-md border-2 border-white">
                {currentQ.num}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500">ප්‍රශ්නය {currentQ.num} / 5</span>
                <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                  <span>{currentQ.imageEmoji}</span>
                  <span className="text-slate-600 text-xs font-bold bg-slate-100 px-3 py-1 rounded-full border">
                    {currentQ.meaning}
                  </span>
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                speakSinhala(currentQ.audioPrompt);
              }}
              className="w-8 h-8 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full flex items-center justify-center text-sm shadow-xs cursor-pointer"
            >
              🔊
            </button>
          </div>

          {tipMessage && (
            <div className="bg-amber-500 text-white text-xs font-black py-2 px-4 rounded-xl text-center shadow-md animate-bounce">
              {tipMessage}
            </div>
          )}

          {/* ── Active Built Sentence Strip ── */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black text-purple-900 uppercase tracking-wide">
              ගොඩනැගූ වාක්‍යය (Your Sentence):
            </span>

            <div
              className={`min-h-[64px] p-3 rounded-2xl border-3 flex flex-wrap items-center gap-2 transition-all ${
                isConfirmed
                  ? isCorrect
                    ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200 shadow-md'
                    : 'bg-rose-50 border-rose-500 ring-4 ring-rose-200'
                  : selectedWords.length > 0
                  ? 'bg-purple-50/70 border-purple-400 shadow-inner'
                  : 'bg-slate-50 border-dashed border-slate-300'
              }`}
            >
              {selectedWords.map((wordObj) => (
                <button
                  key={wordObj.id}
                  disabled={isConfirmed}
                  onClick={() => handleRemoveWord(wordObj)}
                  className={`py-2 px-4 rounded-2xl font-black text-sm md:text-base shadow-sm flex items-center gap-1.5 transition-all select-none ${
                    isConfirmed
                      ? isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white hover:bg-rose-100 text-purple-950 border-2 border-purple-300 hover:border-rose-400 cursor-pointer active:scale-95'
                  }`}
                  title="ඉවත් කිරීමට ක්ලික් කරන්න"
                >
                  <span>{wordObj.text}</span>
                  {!isConfirmed && <span className="text-xs text-rose-500 font-bold">✕</span>}
                </button>
              ))}

              {selectedWords.length === 0 && (
                <span className="text-xs md:text-sm text-slate-400 font-bold m-auto">
                  පහත වචන මත ක්ලික් කර වාක්‍යය ගොඩනගන්න 👆
                </span>
              )}
            </div>
          </div>

          {/* ── Jumbled Word Options Bank ── */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col gap-2">
            <span className="text-xs font-black text-slate-600 uppercase">
              තෝරාගත හැකි වචන (Click to Add):
            </span>

            <div className="flex flex-wrap gap-2.5">
              {availableWords.map((wordObj) => (
                <button
                  key={wordObj.id}
                  disabled={isConfirmed}
                  onClick={() => handleAddWord(wordObj)}
                  className="py-2 px-4 bg-white hover:bg-purple-100 text-slate-800 hover:text-purple-900 border-2 border-slate-300 hover:border-purple-400 rounded-2xl font-black text-sm md:text-base shadow-sm cursor-pointer active:scale-95 transition-all select-none"
                >
                  {wordObj.text}
                </button>
              ))}

              {availableWords.length === 0 && !isConfirmed && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-xl border border-emerald-200">
                  ✨ සියලු වචන තබා ඇත! "තහවුරු කරන්න" ක්ලික් කරන්න.
                </span>
              )}
            </div>
          </div>

          {/* ── Writing Slate Section upon Correct Match ── */}
          {isConfirmed && isCorrect && (
            <div className="animate-fade-in">
              <SentenceWritingSlate fullSentence={currentQ.fullSentence} />
            </div>
          )}

          {/* If Incorrect, Show Retry Banner */}
          {isConfirmed && !isCorrect && (
            <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-2xl text-center flex items-center justify-between gap-3 animate-shake">
              <span className="text-xs md:text-sm font-black text-rose-800">
                ❌ පිළිතුර වැරදියි. නැවත උත්සාහ කරන්න.
              </span>
              <button
                onClick={handleRetryQuestion}
                className="py-1.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer"
              >
                🔄 නැවත හදන්න
              </button>
            </div>
          )}

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

          {/* 5 Step Progress Dots */}
          <div className="flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-full shadow-md border border-sky-300">
            {UNJUMBLE_QUESTIONS.map((_, i) => (
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

          {isConfirmed && isCorrect ? (
            <button
              onClick={handleNext}
              className="py-2.5 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-2 cursor-pointer active:scale-95 animate-bounce-short"
            >
              <span>ඊළඟ ප්‍රශ්නය</span>
              <span>➔</span>
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="py-2.5 px-6 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-2 cursor-pointer active:scale-95 ring-4 ring-emerald-200 animate-pulse"
            >
              <span>✓</span>
              <span>තහවුරු කරන්න</span>
            </button>
          )}

        </div>
      </div>

    </div>
  );
}
