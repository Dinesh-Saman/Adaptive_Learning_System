import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Level 4 Activity 1 (විරුද්ධාර්ථ පදය යොදා වාක්‍ය සම්පූර්ණ කරන්න) ──
const LEVEL4_ACT1_QUESTIONS = [
  {
    id: 1,
    num: 1,
    sentenceContext: 'ඉතා වේගයෙන් දුවගෙන ගිය සඳුන් තරඟයේ පලමුවැනියා විය.',
    targetSentencePart1: 'තරඟයේ අන්තිමයා වූයේ',
    targetSentencePart2: 'දුවගෙන ගිය නිපුන් ය.',
    highlightedWord: 'වේගයෙන්',
    correctAntonym: 'හිමින්',
    meaning: 'වේගයෙන් (Fast) ↔ හිමින් (Slowly)',
    fullSentence: 'තරඟයේ අන්තිමයා වූයේ හිමින් දුවගෙන ගිය නිපුන් ය.',
    imageEmoji: '🏃‍♂️💨🐢',
    options: [
      { id: 'opt_1_1', text: 'හිමින්', isCorrect: true },
      { id: 'opt_1_2', text: 'ඉක්මනින්', isCorrect: false },
      { id: 'opt_1_3', text: 'කෙලින්', isCorrect: false },
    ],
    audioPrompt: 'වේගයෙන් යන වචනයේ විරුද්ධ පදය තෝරා හිස්තැන පුරවන්න. පිළිතුර හිමින්.'
  },
  {
    id: 2,
    num: 2,
    sentenceContext: 'වලස් අයියා හරි ම කීකරු යි.',
    targetSentencePart1: 'වලස් මල්ලී හරි ම',
    targetSentencePart2: 'යි.',
    highlightedWord: 'කීකරු',
    correctAntonym: 'අකීකරු',
    meaning: 'කීකරු (Obedient) ↔ අකීකරු (Disobedient)',
    fullSentence: 'වලස් මල්ලී හරි ම අකීකරු යි.',
    imageEmoji: '🐻🧸',
    options: [
      { id: 'opt_2_1', text: 'අකීකරු', isCorrect: true },
      { id: 'opt_2_2', text: 'කරුණාවන්ත', isCorrect: false },
      { id: 'opt_2_3', text: 'බයගුලු', isCorrect: false },
    ],
    audioPrompt: 'කීකරු යන වචනයේ විරුද්ධ පදය තෝරා හිස්තැන පුරවන්න. පිළිතුර අකීකරු.'
  },
  {
    id: 3,
    num: 3,
    sentenceContext: 'ප්‍රශ්න පත්‍රයේ ප්‍රශ්න දහයක් තිබුණි.',
    targetSentencePart1: 'ඒවාට',
    targetSentencePart2: 'ලිවීම ඉතා අපහසු විය.',
    highlightedWord: 'ප්‍රශ්න',
    correctAntonym: 'පිළිතුරු',
    meaning: 'ප්‍රශ්න (Questions) ↔ පිළිතුරු (Answers)',
    fullSentence: 'ඒවාට පිළිතුරු ලිවීම ඉතා අපහසු විය.',
    imageEmoji: '📝❓💡',
    options: [
      { id: 'opt_3_1', text: 'පිළිතුරු', isCorrect: true },
      { id: 'opt_3_2', text: 'අකුරු', isCorrect: false },
      { id: 'opt_3_3', text: 'චිත්‍ර', isCorrect: false },
    ],
    audioPrompt: 'ප්‍රශ්න යන වචනයේ විරුද්ධ පදය තෝරා හිස්තැන පුරවන්න. පිළිතුර පිළිතුරු.'
  },
  {
    id: 4,
    num: 4,
    sentenceContext: 'රූපයට ගැළපෙන වචනය යා කරන්න.',
    targetSentencePart1: '',
    targetSentencePart2: 'වචනය ඉරකින් කපා හරින්න.',
    highlightedWord: 'ගැළපෙන',
    correctAntonym: 'නොගැළපෙන',
    meaning: 'ගැළපෙන (Matching) ↔ නොගැළපෙන (Mismatching)',
    fullSentence: 'නොගැළපෙන වචනය ඉරකින් කපා හරින්න.',
    imageEmoji: '✂️❌🧩',
    options: [
      { id: 'opt_4_1', text: 'නොගැළපෙන', isCorrect: true },
      { id: 'opt_4_2', text: 'ලස්සන', isCorrect: false },
      { id: 'opt_4_3', text: 'දිග', isCorrect: false },
    ],
    audioPrompt: 'ගැළපෙන යන වචනයේ විරුද්ධ පදය තෝරා හිස්තැන පුරවන්න. පිළිතුර නොගැළපෙන.'
  },
  {
    id: 5,
    num: 5,
    sentenceContext: 'තරංග පුරුදු තැනින් නෑවේ ය.',
    targetSentencePart1: 'සමන්',
    targetSentencePart2: 'තැනකින් නෑමට ගියේ ය.',
    highlightedWord: 'පුරුදු',
    correctAntonym: 'නුපුරුදු',
    meaning: 'පුරුදු (Familiar) ↔ නුපුරුදු (Unfamiliar)',
    fullSentence: 'සමන් නුපුරුදු තැනකින් නෑමට ගියේ ය.',
    imageEmoji: '🌊🏊‍♂️🏞️',
    options: [
      { id: 'opt_5_1', text: 'නුපුරුදු', isCorrect: true },
      { id: 'opt_5_2', text: 'අලුත්', isCorrect: false },
      { id: 'opt_5_3', text: 'පැරණි', isCorrect: false },
    ],
    audioPrompt: 'පුරුදු යන වචනයේ විරුද්ධ පදය තෝරා හිස්තැන පුරවන්න. පිළිතුර නුපුරුදු.'
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

// ── Ruled Lined Canvas Slate for Sentence Tracing ──
function SentenceTracingSlate({ fullSentence }) {
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
          <span>වාක්‍යය තිත් ඉරි මත ලියන්න (Trace on dotted guide):</span>
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

        <svg viewBox="0 0 540 50" className="w-full h-full pointer-events-none select-none">
          <text
            x="270"
            y="32"
            textAnchor="middle"
            fontSize="18"
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
          width={540}
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

export default function SinhalaGrade3Level4Act1({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(120);
  const [isAllDone, setIsAllDone] = useState(false);

  const currentQ = LEVEL4_ACT1_QUESTIONS[currentIndex];

  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    const timer = setTimeout(() => {
      speakSinhala(currentQ.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    playSound('click');
    setSelectedOptionId(opt.id);
    speakSinhala(opt.text);

    if (opt.isCorrect) {
      playSound('correct');
      setIsAnswered(true);
      setScore((prev) => prev + 20);
      speakSinhala(`විශිෂ්ටයි! ${currentQ.highlightedWord} සඳහා විරුද්ධ පදය වන්නේ ${opt.text}. දැන් වාක්‍යය ලියන්න.`);
    } else {
      playSound('wrong');
      speakSinhala('නැවත උත්සාහ කරන්න.');
    }
  };

  const handleNext = () => {
    playSound('click');
    if (currentIndex < LEVEL4_ACT1_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-purple-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-7xl mb-2 animate-bounce">🏆🎉⭐</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ Level 4 Activity 1 (විරුද්ධාර්ථ පද) සාර්ථකව අවසන් කළා!</p>
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
              <span>Level 4 · Activity 1</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 1: විරුද්ධාර්ථ පද යොදා වාක්‍ය සම්පූර්ණ කරන්න
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
                  speakSinhala('ඉරි ඇඳි පදයේ විරුද්ධාර්ථ පදය යොදා පහත දී ඇති වාක්‍ය සම්පූර්ණ කරන්න.');
                }}
                className="w-8 h-8 bg-purple-600 hover:bg-purple-700 active:scale-90 text-white rounded-full flex items-center justify-center text-base shadow-sm cursor-pointer"
              >
                🔊
              </button>
              <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
                🎯 ඉරි ඇඳි පදයේ <span className="text-purple-700 font-extrabold underline">විරුද්ධාර්ථ පදය</span> යොදා වාක්‍යය සම්පූර්ණ කරන්න.
              </p>
            </div>
            <div className="text-2xl pointer-events-none select-none">
              ↔️
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN QUESTION CARD ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-purple-200 flex flex-col gap-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-black text-sm md:text-base flex items-center justify-center shadow-md border-2 border-white">
                {currentQ.num}
              </div>
              <span className="text-xs font-bold text-slate-500">ප්‍රශ්නය {currentQ.num} / 5</span>
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

          {/* Context Sentence with Underlined Target Word */}
          <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-slate-800 text-sm sm:text-base font-bold flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-black text-purple-600 uppercase block mb-0.5">ප්‍රධාන වාක්‍යය:</span>
              <span>
                {currentQ.sentenceContext.split(currentQ.highlightedWord)[0]}
                <span className="text-purple-700 font-extrabold underline decoration-2 decoration-purple-600 bg-purple-100 px-1 py-0.5 rounded">
                  {currentQ.highlightedWord}
                </span>
                {currentQ.sentenceContext.split(currentQ.highlightedWord)[1]}
              </span>
            </div>
            <span className="text-3xl flex-shrink-0">{currentQ.imageEmoji}</span>
          </div>

          {/* Target Sentence with Blank & 3 Options */}
          <div className="flex flex-col gap-3 my-1">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wide">
              විරුද්ධ පදය යොදා සම්පූර්ණ කරන්න:
            </span>

            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-sky-300 text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
              {currentQ.targetSentencePart1 && <span>{currentQ.targetSentencePart1}</span>}
              <span className={`inline-block min-w-[90px] text-center px-3 py-1 rounded-xl border-2 font-black ${
                isAnswered ? 'bg-emerald-500 text-white border-emerald-600 animate-bounce' : 'bg-white border-purple-300 text-purple-700'
              }`}>
                {isAnswered ? currentQ.correctAntonym : '__________'}
              </span>
              <span>{currentQ.targetSentencePart2}</span>
            </div>

            {/* 3 Option Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrect = opt.isCorrect;

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-3.5 rounded-2xl border-2 font-black text-base md:text-lg flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-md scale-102'
                          : 'bg-rose-500 text-white border-rose-600 animate-shake'
                        : isAnswered && isCorrect
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-200'
                        : 'bg-white hover:bg-purple-50 text-slate-800 border-slate-200 active:scale-95'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {isSelected && isCorrect && <span className="text-base font-black">✓</span>}
                  </div>
                );
              })}
            </div>

          </div>

          {/* ── Writing Reinforcement Slate ── */}
          {isAnswered && (
            <div className="animate-fade-in">
              <SentenceTracingSlate fullSentence={currentQ.fullSentence} />
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

          <div className="flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-full shadow-md border border-sky-300">
            {LEVEL4_ACT1_QUESTIONS.map((_, i) => (
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
            disabled={!isAnswered}
            className={`py-2.5 px-6 font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-2 transition-all ${
              isAnswered
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer active:scale-95 animate-bounce-short'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>ඊළඟ ප්‍රශ්නය</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
