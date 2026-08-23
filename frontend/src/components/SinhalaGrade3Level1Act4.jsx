import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Questions for Grade 3 Level 1 Activity 4 (රූපයට ගැළපෙන වචනය තෝරන්න) ──
const GRADE3_L1_ACT4_QUESTIONS = [
  {
    id: 1,
    num: 1,
    title: 'වර්ෂාව',
    correctWord: 'වර්ෂාව',
    meaning: 'Rain / Rainstorm',
    imageEmoji: '🌧️⛈️',
    options: [
      { id: 'opt_1_1', text: 'ඉඩෝරය' },
      { id: 'opt_1_2', text: 'සීතල' },
      { id: 'opt_1_3', text: 'සුළඟ' },
      { id: 'opt_1_4', text: 'වර්ෂාව', isCorrect: true },
    ],
    audioPrompt: 'පළමු රූපයට ගැලපෙන වචනය තෝරන්න. වර්ෂාව.'
  },
  {
    id: 2,
    num: 2,
    title: 'නිවස',
    correctWord: 'නිවස',
    meaning: 'House / Home',
    imageEmoji: '🏡🌳',
    options: [
      { id: 'opt_2_1', text: 'තුරුලතා' },
      { id: 'opt_2_2', text: 'නගරය' },
      { id: 'opt_2_3', text: 'නිවස', isCorrect: true },
      { id: 'opt_2_4', text: 'කාන්තාරය' },
    ],
    audioPrompt: 'දෙවන රූපයට ගැලපෙන වචනය තෝරන්න. නිවස.'
  },
  {
    id: 3,
    num: 3,
    title: 'උණුසුම',
    correctWord: 'උණුසුම',
    meaning: 'Warmth / Sunny Heat',
    imageEmoji: '☀️🌻',
    options: [
      { id: 'opt_3_1', text: 'උණුසුම', isCorrect: true },
      { id: 'opt_3_2', text: 'ශීත' },
      { id: 'opt_3_3', text: 'වැස්ස' },
      { id: 'opt_3_4', text: 'සුළඟ' },
    ],
    audioPrompt: 'තෙවන රූපයට ගැලපෙන වචනය තෝරන්න. උණුසුම.'
  },
  {
    id: 4,
    num: 4,
    title: 'නාසය',
    correctWord: 'නාසය',
    meaning: 'Nose',
    imageEmoji: '👃✨',
    options: [
      { id: 'opt_4_1', text: 'දෙනෙත' },
      { id: 'opt_4_2', text: 'කන' },
      { id: 'opt_4_3', text: 'නාසය', isCorrect: true },
      { id: 'opt_4_4', text: 'දෙතොල්' },
    ],
    audioPrompt: 'හතරවන රූපයට ගැලපෙන වචනය තෝරන්න. නාසය.'
  },
  {
    id: 5,
    num: 5,
    title: 'තුරඟා',
    correctWord: 'තුරඟා',
    meaning: 'Horse',
    imageEmoji: '🐎🌾',
    options: [
      { id: 'opt_5_1', text: 'සෙබඩ' },
      { id: 'opt_5_2', text: 'තුරඟා', isCorrect: true },
      { id: 'opt_5_3', text: 'මුවා' },
      { id: 'opt_5_4', text: 'ගෝනා' },
    ],
    audioPrompt: 'පස්වන රූපයට ගැලපෙන වචනය තෝරන්න. තුරඟා.'
  }
];

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

function WordWritingSlate({ targetWord }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [targetWord]);

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
    ctx.lineWidth = 6;
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
    <div className="w-full mt-2 pt-2 border-t border-slate-200/80">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
          <span>✏️</span>
          <span>දැන් වචනය ලියන්න:</span>
        </span>
        <button
          onClick={handleClear}
          className="text-[10px] text-slate-400 hover:text-slate-600 underline font-bold cursor-pointer"
        >
          මකන්න
        </button>
      </div>

      <div className="relative w-full h-14 bg-white rounded-xl border border-sky-200 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-x-0 top-2 border-b border-sky-100 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-2 border-b border-sky-100 pointer-events-none"></div>

        <svg viewBox="0 0 280 50" className="w-full h-full pointer-events-none select-none">
          <text
            x="140"
            y="35"
            textAnchor="middle"
            fontSize="30"
            fontWeight="300"
            fontFamily="'Noto Sans Sinhala', 'Iskoola Pota', sans-serif"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.4"
            strokeDasharray="3, 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {targetWord}
          </text>
        </svg>

        <canvas
          ref={canvasRef}
          width={280}
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

export default function SinhalaGrade3Level1Act4({ onExit }) {
  const navigate = useNavigate();

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(120);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala('රූපයට ගැලපෙන වචනය තෝරන්න.');
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectOption = (qId, option) => {
    playSound('click');
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: option.id
    }));
    speakSinhala(option.text);

    if (option.isCorrect) {
      playSound('correct');
    }
  };

  const handleRestart = () => {
    playSound('click');
    setSelectedAnswers({});
    setScore(120);
    speakSinhala('නැවත ආරම්භ කරන ලදී.');
  };

  const correctAnswersCount = GRADE3_L1_ACT4_QUESTIONS.filter((q) => {
    const selectedOptId = selectedAnswers[q.id];
    const opt = q.options.find((o) => o.id === selectedOptId);
    return opt?.isCorrect;
  }).length;

  const totalScorePoints = correctAnswersCount * 20;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-100 to-emerald-200 font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-4">
      
      {/* Top Header */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-3">
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
              <span>Level 1 · Activity 4</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 text-amber-950 py-2.5 px-6 rounded-3xl shadow-lg border-4 border-amber-400 text-center relative">
            <h1 className="text-base sm:text-lg md:text-xl font-black tracking-wide text-amber-950">
              රූපයට ගැළපෙන වචනය තෝරන්න.
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/95 text-purple-900 px-4 py-2 rounded-2xl font-black text-sm md:text-base shadow-md border-2 border-purple-200 flex items-center gap-1.5">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span>{score + totalScorePoints}</span>
            </div>

            <button
              onClick={() => {
                playSound('click');
                speakSinhala('රූපයට ගැලපෙන වචනය තෝරන්න.');
              }}
              className="w-11 h-11 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
              title="හඬ අසන්න"
            >
              🔊
            </button>
          </div>
        </div>
      </div>

      {/* 5 Questions Grid */}
      <div className="max-w-6xl mx-auto w-full px-4 my-3 flex-1 flex flex-col gap-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GRADE3_L1_ACT4_QUESTIONS.slice(0, 3).map((q) => {
            const selectedOptId = selectedAnswers[q.id];

            return (
              <div
                key={q.id}
                className="bg-white rounded-[2rem] p-4 shadow-xl border-3 border-sky-200 flex flex-col justify-between hover:shadow-2xl transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shadow-xs ${
                        q.id === 1 ? 'bg-purple-600' : q.id === 2 ? 'bg-sky-600' : 'bg-amber-500'
                      }`}
                    >
                      {q.num}
                    </div>
                    <span className="text-xs font-bold text-slate-700">රූපයට ගැලපෙන වචනය තෝරන්න.</span>
                  </div>

                  <button
                    onClick={() => {
                      playSound('click');
                      speakSinhala(q.audioPrompt);
                    }}
                    className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] shadow-xs cursor-pointer ${
                      q.id === 1 ? 'bg-purple-500' : q.id === 2 ? 'bg-sky-500' : 'bg-amber-500'
                    }`}
                  >
                    🔊
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-sky-100 to-indigo-100 border-2 border-slate-200 flex flex-col items-center justify-center text-4xl shadow-inner flex-shrink-0">
                    <span className="drop-shadow-md animate-pulse">{q.imageEmoji}</span>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">{q.meaning}</span>
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    {q.options.map((opt) => {
                      const isSelected = selectedOptId === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectOption(q.id, opt)}
                          className={`px-2.5 py-1 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? opt.isCorrect
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-200 shadow-sm'
                                : 'bg-rose-50 text-rose-900 border-rose-400'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? opt.isCorrect
                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                    : 'border-rose-500 bg-rose-500 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <span className="text-[8px]">●</span>}
                            </span>
                            <span>{opt.text}</span>
                          </div>

                          {isSelected && opt.isCorrect && (
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
                              ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <WordWritingSlate targetWord={q.correctWord} />
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GRADE3_L1_ACT4_QUESTIONS.slice(3, 5).map((q) => {
            const selectedOptId = selectedAnswers[q.id];

            return (
              <div
                key={q.id}
                className="bg-white rounded-[2rem] p-4 shadow-xl border-3 border-sky-200 flex flex-col justify-between hover:shadow-2xl transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shadow-xs ${
                        q.id === 4 ? 'bg-green-600' : 'bg-pink-500'
                      }`}
                    >
                      {q.num}
                    </div>
                    <span className="text-xs font-bold text-slate-700">රූපයට ගැලපෙන වචනය තෝරන්න.</span>
                  </div>

                  <button
                    onClick={() => {
                      playSound('click');
                      speakSinhala(q.audioPrompt);
                    }}
                    className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] shadow-xs cursor-pointer ${
                      q.id === 4 ? 'bg-green-600' : 'bg-pink-500'
                    }`}
                  >
                    🔊
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-sky-100 to-indigo-100 border-2 border-slate-200 flex flex-col items-center justify-center text-4xl shadow-inner flex-shrink-0">
                    <span className="drop-shadow-md animate-pulse">{q.imageEmoji}</span>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">{q.meaning}</span>
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    {q.options.map((opt) => {
                      const isSelected = selectedOptId === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectOption(q.id, opt)}
                          className={`px-2.5 py-1 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? opt.isCorrect
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-200 shadow-sm'
                                : 'bg-rose-50 text-rose-900 border-rose-400'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? opt.isCorrect
                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                    : 'border-rose-500 bg-rose-500 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <span className="text-[8px]">●</span>}
                            </span>
                            <span>{opt.text}</span>
                          </div>

                          {isSelected && opt.isCorrect && (
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
                              ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <WordWritingSlate targetWord={q.correctWord} />
              </div>
            );
          })}

          <div className="bg-white rounded-[2rem] p-4 shadow-xl border-3 border-amber-300 flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div className="text-4xl sm:text-5xl animate-bounce mt-1">🏆✨</div>

            <div className="w-full">
              <span className="text-[11px] font-black text-purple-900 uppercase tracking-wide bg-purple-100 px-3 py-0.5 rounded-full">
                ඔබේ ලකුණු
              </span>
              <div className="text-2xl sm:text-3xl font-black text-purple-800 mt-1">
                {totalScorePoints} / 100
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-2 w-full border border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-center gap-1.5">
              <span>⭐</span>
              <span>
                {correctAnswersCount === 5
                  ? 'ඉතා හොඳයි! ඔබ විශිෂ්ටයි! 😊'
                  : correctAnswersCount >= 3
                  ? 'හොඳ උත්සාහයක්! දිගටම කරන්න! 👍'
                  : 'නැවත උත්සාහ කර ලකුණු ලබා ගන්න!'}
              </span>
            </div>

            <div className="w-full flex items-center gap-2 mt-1">
              <button
                onClick={handleRestart}
                className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1"
              >
                <span>🔄</span>
                <span>නැවත කරන්න</span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  navigate('/dashboard');
                }}
                className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1"
              >
                <span>ඊළඟට යන්න</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 mt-1 flex items-center gap-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-2 border-pink-300 shadow-md flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0 animate-bounce">
          👧
        </div>
        <div className="flex-1 bg-amber-100/90 rounded-2xl py-2.5 px-4 shadow-sm border border-amber-300 flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-950">
          <span className="text-lg">💡</span>
          <span>රූපය හොඳින් බලලා නිවැරදි වචනය තෝරන්න. පසුව වචනය ලියන්න.</span>
        </div>
      </div>

    </div>
  );
}
