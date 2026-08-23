import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Question Datasets for Level 2 - Activity 3: අකුරු දුම්රිය (Letter Train) ──
const LEVEL2_ACT3_ITEMS = [
  {
    id: 1,
    numRoman: 'i)',
    voiceWord: 'මිණුරා',
    voicePrompt: 'මිණුරා',
    audioText: 'මිණුරා යන වචනය සෑදීමට දුම්රියේ අකුරු පිළිවෙලට සකසන්න.',
    fullWord: 'මිණුරා',
    meaning: 'Minura (Gem)',
    carriages: [
      { id: 'c1', char: 'රා', bg: 'bg-sky-500 text-white', border: 'border-sky-600', wheelColor: '#0284C7' },
      { id: 'c2', char: 'ණු', bg: 'bg-emerald-500 text-white', border: 'border-emerald-600', wheelColor: '#059669' },
      { id: 'c3', char: 'මි', bg: 'bg-purple-600 text-white', border: 'border-purple-700', wheelColor: '#7C3AED' },
    ],
    correctOrder: ['මි', 'ණු', 'රා'],
    boxCount: 3,
    cardTheme: 'from-pink-50/90 to-rose-50/70 border-pink-200',
    ribbonBg: 'bg-rose-500',
    ribbonIcon: '☀️',
    trackColor: '#78350F'
  },
  {
    id: 2,
    numRoman: 'ii)',
    voiceWord: 'පැන්සල',
    voicePrompt: 'පැන්සල',
    audioText: 'පැන්සල යන වචනය සෑදීමට දුම්රියේ අකුරු පිළිවෙලට සකසන්න.',
    fullWord: 'පැන්සල',
    meaning: 'Pencil ✏️',
    carriages: [
      { id: 'c1', char: 'ල', bg: 'bg-pink-500 text-white', border: 'border-pink-600', wheelColor: '#DB2777' },
      { id: 'c2', char: 'ස', bg: 'bg-amber-400 text-slate-900', border: 'border-amber-500', wheelColor: '#D97706' },
      { id: 'c3', char: 'න්', bg: 'bg-sky-500 text-white', border: 'border-sky-600', wheelColor: '#0284C7' },
      { id: 'c4', char: 'පැ', bg: 'bg-emerald-500 text-white', border: 'border-emerald-600', wheelColor: '#059669' },
    ],
    correctOrder: ['පැ', 'න්', 'ස', 'ල'],
    boxCount: 4,
    cardTheme: 'from-sky-50/90 to-blue-50/70 border-sky-200',
    ribbonBg: 'bg-sky-600',
    ribbonIcon: '⭐',
    trackColor: '#78350F'
  },
  {
    id: 3,
    numRoman: 'iii)',
    voiceWord: 'කූඩුව',
    voicePrompt: 'කූඩුව',
    audioText: 'කූඩුව යන වචනය සෑදීමට දුම්රියේ අකුරු පිළිවෙලට සකසන්න.',
    fullWord: 'කූඩුව',
    meaning: 'Nest / Cage 🐦',
    carriages: [
      { id: 'c1', char: 'ව', bg: 'bg-purple-500 text-white', border: 'border-purple-600', wheelColor: '#9333EA' },
      { id: 'c2', char: 'කූ', bg: 'bg-emerald-500 text-white', border: 'border-emerald-600', wheelColor: '#059669' },
      { id: 'c3', char: 'ඩු', bg: 'bg-amber-400 text-slate-900', border: 'border-amber-500', wheelColor: '#D97706' },
    ],
    correctOrder: ['කූ', 'ඩු', 'ව'],
    boxCount: 3,
    cardTheme: 'from-amber-50/90 to-yellow-50/70 border-amber-200',
    ribbonBg: 'bg-amber-500',
    ribbonIcon: '🐦',
    trackColor: '#78350F'
  },
  {
    id: 4,
    numRoman: 'iv)',
    voiceWord: 'පන්සල',
    voicePrompt: 'පන්සල',
    audioText: 'පන්සල යන වචනය සෑදීමට දුම්රියේ අකුරු පිළිවෙලට සකසන්න.',
    fullWord: 'පන්සල',
    meaning: 'Temple 🛕',
    carriages: [
      { id: 'c1', char: 'ස', bg: 'bg-rose-500 text-white', border: 'border-rose-600', wheelColor: '#E11D48' },
      { id: 'c2', char: 'න්', bg: 'bg-teal-500 text-white', border: 'border-teal-600', wheelColor: '#0D9488' },
      { id: 'c3', char: 'ප', bg: 'bg-sky-500 text-white', border: 'border-sky-600', wheelColor: '#0284C7' },
      { id: 'c4', char: 'ල', bg: 'bg-purple-500 text-white', border: 'border-purple-600', wheelColor: '#9333EA' },
    ],
    correctOrder: ['ප', 'න්', 'ස', 'ල'],
    boxCount: 4,
    cardTheme: 'from-teal-50/90 to-emerald-50/70 border-teal-200',
    ribbonBg: 'bg-teal-600',
    ribbonIcon: '🛕',
    trackColor: '#78350F'
  },
  {
    id: 5,
    numRoman: 'v)',
    voiceWord: 'කරවිල',
    voicePrompt: 'කරවිල',
    audioText: 'කරවිල යන වචනය සෑදීමට දුම්රියේ අකුරු පිළිවෙලට සකසන්න.',
    fullWord: 'කරවිල',
    meaning: 'Bitter Gourd 🥒',
    carriages: [
      { id: 'c1', char: 'ල', bg: 'bg-pink-500 text-white', border: 'border-pink-600', wheelColor: '#DB2777' },
      { id: 'c2', char: 'වි', bg: 'bg-sky-500 text-white', border: 'border-sky-600', wheelColor: '#0284C7' },
      { id: 'c3', char: 'ක', bg: 'bg-emerald-500 text-white', border: 'border-emerald-600', wheelColor: '#059669' },
      { id: 'c4', char: 'ර', bg: 'bg-amber-400 text-slate-900', border: 'border-amber-500', wheelColor: '#D97706' },
    ],
    correctOrder: ['ක', 'ර', 'වි', 'ල'],
    boxCount: 4,
    cardTheme: 'from-yellow-50/90 to-amber-50/70 border-yellow-200',
    ribbonBg: 'bg-amber-600',
    ribbonIcon: '🌟',
    trackColor: '#78350F'
  }
];

// ── Web Audio Synthesizer ──
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === 'train') {
      // Train Whistle Sound
      [587.33, 880].forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.55);
      });
    } else if (type === 'correct') {
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
      osc.frequency.setValueAtTime(650, now);
      gain.gain.setValueAtTime(0.15, now);
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
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

// ── Single Train Carriage SVG / Box Component ──
function TrainCarriage({ carriage, isSelected, onClick, disabled }) {
  return (
    <button
      disabled={disabled || isSelected}
      onClick={onClick}
      className={`relative group flex flex-col items-center select-none transform transition-all cursor-pointer ${
        isSelected ? 'opacity-25 scale-90 cursor-not-allowed filter grayscale' : 'hover:-translate-y-1 active:scale-95'
      }`}
    >
      {/* Carriage Body */}
      <div
        className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${carriage.bg} border-3 ${carriage.border} flex items-center justify-center text-2xl md:text-3xl font-black shadow-lg relative`}
      >
        <span>{carriage.char}</span>
        {/* Carriage Link Connector on side */}
        <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-3 h-2 bg-slate-700 rounded-sm" />
      </div>

      {/* Wheels on Railroad Track */}
      <div className="flex justify-between w-12 md:w-14 -mt-1.5 z-10">
        <div
          className="w-4 h-4 rounded-full border-2 border-slate-900 shadow-sm animate-spin-slow"
          style={{ backgroundColor: carriage.wheelColor }}
        />
        <div
          className="w-4 h-4 rounded-full border-2 border-slate-900 shadow-sm animate-spin-slow"
          style={{ backgroundColor: carriage.wheelColor }}
        />
      </div>
    </button>
  );
}

// ── Single Train Question Card Row (Matches Screenshot 2) ──
function TrainWordRow({
  item,
  placedCarriages,
  onSelectCarriage,
  onRemoveSlot,
  isRowCompleted,
  rowStatus
}) {
  const isSelected = (c) => {
    return placedCarriages.some((p) => p && p.id === c.id);
  };

  const handlePlaySound = (e) => {
    e.stopPropagation();
    playSound('click');
    speakSinhala(`"${item.voiceWord}" යන වචනය.`);
  };

  return (
    <div
      className={`relative rounded-[2.5rem] p-4 md:p-5 border-4 shadow-lg transition-all bg-gradient-to-r ${item.cardTheme} flex flex-col lg:flex-row items-center justify-between gap-4`}
    >
      {/* Left Top: Flower Number Badge & Voice Button */}
      <div className="flex items-center gap-3 self-start lg:self-center">
        <div className="relative flex-shrink-0">
          <div className="w-11 h-11 rounded-full bg-pink-500 text-white flex items-center justify-center font-black text-base shadow-md ring-4 ring-yellow-300">
            {item.numRoman}
          </div>
        </div>

        {/* Word Voice Button Pill */}
        <button
          onClick={handlePlaySound}
          className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full text-sm font-extrabold shadow-md border border-white cursor-pointer active:scale-95 transition-all"
        >
          <span>🔊</span>
          <span>{item.voicePrompt}</span>
        </button>
      </div>

      {/* Center: Wooden Signpost + Colorful Train on Tracks */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Wooden Signpost */}
        <div className="bg-amber-200/90 text-amber-950 border-2 border-amber-400 p-2.5 rounded-xl text-center text-[11px] md:text-xs font-bold max-w-[140px] shadow-sm leading-tight">
          අකුරු දුම්රියේ නිවැරදි පිළිවෙලව සකස් කරන්න.
        </div>

        {/* Train Carriages on Track */}
        <div className="relative pt-1 pb-3 px-2 flex items-center gap-3.5 border-b-4 border-amber-800">
          {item.carriages.map((c) => (
            <TrainCarriage
              key={c.id}
              carriage={c}
              isSelected={isSelected(c)}
              disabled={isRowCompleted}
              onClick={() => onSelectCarriage(item.id, c)}
            />
          ))}
        </div>
      </div>

      {/* Right: Station Output Box ("★ ඔබ සකස් කල වචනය ★") */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-3.5 shadow-md border-2 border-slate-200 flex flex-col items-center flex-shrink-0">
        
        {/* Ribbon Header with Smiling Mascot */}
        <div className={`-mt-7 px-4 py-1 rounded-full ${item.ribbonBg} text-white text-xs font-black shadow-md flex items-center gap-1.5 border border-white`}>
          <span>★</span>
          <span>ඔබ සකස් කල වචනය</span>
          <span>{item.ribbonIcon}</span>
        </div>

        {/* Target Slot Boxes */}
        <div className="flex items-center gap-2 mt-3">
          {[...Array(item.boxCount)].map((_, idx) => {
            const placed = placedCarriages[idx];

            return (
              <div
                key={idx}
                onClick={() => placed && !isRowCompleted && onRemoveSlot(item.id, idx)}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border-3 border-dashed flex items-center justify-center text-2xl md:text-3xl font-black transition-all select-none relative cursor-pointer ${
                  placed
                    ? isRowCompleted
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-sm animate-bounce'
                      : rowStatus === 'wrong'
                      ? 'bg-red-100 border-red-400 text-red-700 animate-shake'
                      : 'bg-white border-purple-400 text-slate-800 shadow-md transform hover:scale-105'
                    : 'bg-slate-50 border-slate-300 text-slate-300'
                }`}
              >
                {placed ? placed.char : ''}
                {placed && !isRowCompleted && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-400 text-white rounded-full text-[10px] flex items-center justify-center font-bold shadow">
                    ✕
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Complete Checkmark Stamp */}
      {isRowCompleted && (
        <div className="absolute top-2 right-3 animate-bounce">
          <div className="w-8 h-8 bg-emerald-500 text-white rounded-full shadow-md border-2 border-white flex items-center justify-center font-black text-base">
            ✓
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Grade 2 Level 2 Activity 3 Component ──
export default function SinhalaGrade2Level2Act3({ onExit }) {
  const navigate = useNavigate();

  // Page 1: Items 1 & 2; Page 2: Items 3, 4, 5
  const [currentPage, setCurrentPage] = useState(0);
  const [score, setScore] = useState(120);
  const [slotsState, setSlotsState] = useState({});
  const [completedRows, setCompletedRows] = useState({});
  const [rowStatus, setRowStatus] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);

  const totalPages = 2;
  const pageItems = currentPage === 0 ? LEVEL2_ACT3_ITEMS.slice(0, 2) : LEVEL2_ACT3_ITEMS.slice(2);

  // Play instructions on load
  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala('නිවැරදි ලෙස සකස් කර වචනය හදන්න.');
    }, 400);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handleSpeakerClick = () => {
    playSound('train');
    speakSinhala('නිවැරදි ලෙස සකස් කර වචනය හදන්න.');
  };

  // Place a carriage letter into the next empty slot
  const handleSelectCarriage = (itemId, carriage) => {
    playSound('click');
    const currentSlots = slotsState[itemId] || [];
    const item = LEVEL2_ACT3_ITEMS.find((it) => it.id === itemId);

    if (currentSlots.length < item.boxCount) {
      const updated = [...currentSlots, carriage];
      setSlotsState((prev) => ({ ...prev, [itemId]: updated }));

      // Auto-check if all slots filled
      if (updated.length === item.boxCount) {
        checkTrainOrder(item, updated);
      }
    }
  };

  // Remove a carriage from a slot
  const handleRemoveSlot = (itemId, slotIdx) => {
    playSound('click');
    const currentSlots = slotsState[itemId] || [];
    const updated = currentSlots.filter((_, idx) => idx !== slotIdx);
    setSlotsState((prev) => ({ ...prev, [itemId]: updated }));
    setRowStatus((prev) => ({ ...prev, [itemId]: null }));
  };

  // Check correct order
  const checkTrainOrder = (item, slots) => {
    const formedWord = slots.map((s) => s.char).join('');
    const correctWord = item.correctOrder.join('');

    if (formedWord === correctWord) {
      playSound('correct');
      setCompletedRows((prev) => ({ ...prev, [item.id]: true }));
      setRowStatus((prev) => ({ ...prev, [item.id]: 'correct' }));
      setScore((prev) => prev + 25);
      speakSinhala(`නියමයි! "${item.fullWord}" වචනය නිවැරදියි!`);
    } else {
      playSound('wrong');
      setRowStatus((prev) => ({ ...prev, [item.id]: 'wrong' }));
      speakSinhala('අකුරු මාරු කර නැවත උත්සාහ කරන්න.');
      setTimeout(() => {
        setRowStatus((prev) => ({ ...prev, [item.id]: null }));
      }, 1200);
    }
  };

  // Manual "පරීක්ෂා කරන්න" button
  const handleCheckAll = () => {
    playSound('click');
    pageItems.forEach((item) => {
      const slots = slotsState[item.id] || [];
      if (slots.length === item.boxCount) {
        checkTrainOrder(item, slots);
      } else {
        speakSinhala('කරුණාකර සියලු කොටු පුරවන්න.');
      }
    });
  };

  const handleNextPage = () => {
    playSound('click');
    if (currentPage + 1 < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-300 via-sky-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center">
          <div className="text-6xl mb-2 animate-bounce">🚂🏆</div>
          <h1 className="text-4xl font-extrabold text-purple-700 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-6">ඔබ අකුරු දුම්රිය සියලු වචන සාර්ථකව සාදා අවසන් කළා!</p>
          <div className="text-4xl font-black text-purple-600 mb-8">ලකුණු: {score}</div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/module/sinhala/grade2-level2-act4')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🦋 ඊළඟ අභ්‍යාසය (Activity 4: රූපයට ගැලපෙන වචනය)</span>
              <span className="text-2xl">➔</span>
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setCurrentPage(0);
                  setSlotsState({});
                  setCompletedRows({});
                  setIsFinished(false);
                }}
                className="flex-1 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-lg rounded-2xl shadow-md cursor-pointer"
              >
                🔄 නැවත කරන්න
              </button>
              <button
                onClick={onExit || (() => navigate('/module/sinhala/grade2'))}
                className="flex-1 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-lg rounded-2xl shadow-md cursor-pointer"
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
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200 font-sinhala select-none relative overflow-x-hidden pb-6">
      
      {/* Background Decor */}
      <div className="absolute top-2 right-10 text-6xl opacity-80 pointer-events-none">☁️</div>
      <div className="absolute top-6 left-12 text-6xl opacity-80 pointer-events-none">☁️</div>

      <div className="max-w-5xl mx-auto px-4 py-3 relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* ── TOP HEADER BAR (Matches Screenshot 2) ── */}
        <div className="flex items-center justify-between gap-3 mb-2">
          
          {/* Back Button */}
          <button
            onClick={onExit || (() => navigate('/module/sinhala/grade2'))}
            className="w-12 h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="ආපසු"
          >
            ←
          </button>

          {/* Center Activity Title Pill */}
          <div className="flex-1 max-w-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 text-white py-2.5 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-wide drop-shadow flex items-center justify-center gap-2">
              <span>🚂</span>
              <span>Activity 3: අකුරු දුම්රිය</span>
              <span>✨</span>
            </h1>
          </div>

          {/* Cute Captain Elephant Mascot & Speaker */}
          <div className="flex items-center gap-2">
            <div className="text-4xl drop-shadow-md transform hover:scale-110 transition-transform">
              🐘
            </div>
            <button
              onClick={handleSpeakerClick}
              className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
              title="හඬ අසන්න"
            >
              🔊
            </button>
          </div>
        </div>

        {/* ── SUB-INSTRUCTION BANNER ── */}
        <div className="relative max-w-3xl mx-auto w-full my-2">
          <div className="bg-white/95 backdrop-blur-md rounded-full py-2.5 px-6 shadow-md border-2 border-dashed border-sky-300 flex items-center gap-3">
            <button
              onClick={handleSpeakerClick}
              className="w-9 h-9 bg-purple-600 hover:bg-purple-700 active:scale-90 text-white rounded-full flex items-center justify-center text-lg shadow-sm flex-shrink-0 cursor-pointer"
            >
              🔊
            </button>
            <p className="text-lg md:text-xl font-bold text-slate-800">
              නිවැරදි ලෙස සකස් කර <span className="text-emerald-600 font-extrabold underline">වචනය හදන්න.</span>
            </p>
          </div>
        </div>

        {/* ── QUESTION ROWS (Matches Screenshot 2) ── */}
        <div className="flex flex-col gap-4 my-auto">
          {pageItems.map((item) => (
            <TrainWordRow
              key={item.id}
              item={item}
              placedCarriages={slotsState[item.id] || []}
              onSelectCarriage={handleSelectCarriage}
              onRemoveSlot={handleRemoveSlot}
              isRowCompleted={completedRows[item.id]}
              rowStatus={rowStatus[item.id]}
            />
          ))}
        </div>

        {/* ── BOTTOM BAR (Matches Screenshot 2) ── */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-3 gap-3">
          
          {/* Left: Cartoon Squirrel Mascot with Speech Bubble */}
          <div className="flex items-center gap-3">
            <div className="text-4xl transform -scale-x-100 drop-shadow-md">🐿️</div>
            <div className="bg-amber-100/90 text-amber-900 border border-amber-300 px-4 py-2 rounded-2xl text-xs md:text-sm font-extrabold shadow-sm flex items-center gap-2">
              <span>හලෝ! හරිම ලස්සනයි! වචනය හදන්න උත්සාහ කරන්න. ❤️</span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Hint Button */}
            <button
              onClick={() => {
                playSound('click');
                setShowHintModal(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full font-black text-sm shadow-md border-2 border-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <span>💡</span>
              <span>උපදෙස්</span>
            </button>

            {/* Check Button */}
            <button
              onClick={handleCheckAll}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-black text-sm md:text-base shadow-lg border-2 border-white flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span>✓</span>
              <span>පරීක්ෂා කරන්න</span>
            </button>

            {/* Next Page Arrow Button */}
            <button
              onClick={handleNextPage}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full font-black text-sm shadow-lg border-2 border-white flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
            >
              <span>ඊළඟට</span>
              <span>❯❯</span>
            </button>
          </div>
        </div>

        {/* Hint Modal */}
        {showHintModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-yellow-300 text-center animate-bounce-short">
              <div className="text-4xl mb-2">💡</div>
              <h3 className="text-xl font-extrabold text-purple-700 mb-2">උපදෙස්</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                දුම්රියේ ඇති අකුරු පෙට්ටි මත click කර, නිවැරදි වචනය සෑදෙන පිළිවෙළට දකුණු පස ඇති කොටු තුළට දමන්න!
              </p>
              <button
                onClick={() => setShowHintModal(false)}
                className="w-full py-2 bg-purple-600 text-white font-bold rounded-xl shadow cursor-pointer"
              >
                තේරුණා 👍
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
