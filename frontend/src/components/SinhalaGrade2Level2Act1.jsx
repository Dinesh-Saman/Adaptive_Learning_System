import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressionManager } from '../services/grade2ProgressionManager';

// ── 5 Question Datasets for Level 2 - Activity 1: වචන ගොඩනගමු ──
const LEVEL2_ACT1_ITEMS = [
  {
    id: 1,
    numRoman: 'i)',
    scrambledLetters: [
      { id: 'l1', char: 'පා', color: 'bg-emerald-500 text-white', shadow: 'shadow-emerald-200' },
      { id: 'l2', char: 'ල', color: 'bg-pink-500 text-white', shadow: 'shadow-pink-200' },
      { id: 'l3', char: 'ස', color: 'bg-sky-500 text-white', shadow: 'shadow-sky-200' },
    ],
    correctOrder: ['පා', 'ස', 'ල'],
    fullWord: 'පාසල',
    meaning: 'School 🏫',
    boxCount: 3,
    cardBg: 'bg-gradient-to-r from-amber-50 to-orange-50/70 border-amber-200',
    flowerBg: 'bg-pink-500 text-white ring-4 ring-yellow-300'
  },
  {
    id: 2,
    numRoman: 'ii)',
    scrambledLetters: [
      { id: 'l1', char: 'ල', color: 'bg-sky-500 text-white', shadow: 'shadow-sky-200' },
      { id: 'l2', char: 'ම', color: 'bg-amber-500 text-white', shadow: 'shadow-amber-200' },
      { id: 'l3', char: 'පා', color: 'bg-emerald-500 text-white', shadow: 'shadow-emerald-200' },
    ],
    correctOrder: ['පා', 'ල', 'ම'],
    fullWord: 'පාලම',
    meaning: 'Bridge 🌉',
    boxCount: 3,
    cardBg: 'bg-gradient-to-r from-purple-50 to-pink-50/70 border-purple-200',
    flowerBg: 'bg-pink-500 text-white ring-4 ring-yellow-300'
  },
  {
    id: 3,
    numRoman: 'iii)',
    scrambledLetters: [
      { id: 'l1', char: 'ල', color: 'bg-purple-500 text-white', shadow: 'shadow-purple-200' },
      { id: 'l2', char: 'ම', color: 'bg-pink-500 text-white', shadow: 'shadow-pink-200' },
      { id: 'l3', char: 'පා', color: 'bg-emerald-500 text-white', shadow: 'shadow-emerald-200' },
    ],
    correctOrder: ['පා', 'ල', 'ම'],
    fullWord: 'පාලම',
    meaning: 'Bridge 🌉',
    boxCount: 3,
    cardBg: 'bg-gradient-to-r from-sky-50 to-blue-50/70 border-sky-200',
    flowerBg: 'bg-pink-500 text-white ring-4 ring-yellow-300'
  },
  {
    id: 4,
    numRoman: 'iv)',
    scrambledLetters: [
      { id: 'l1', char: 'ව', color: 'bg-teal-500 text-white', shadow: 'shadow-teal-200' },
      { id: 'l2', char: 'නැ', color: 'bg-indigo-500 text-white', shadow: 'shadow-indigo-200' },
    ],
    correctOrder: ['නැ', 'ව'],
    fullWord: 'නැව',
    meaning: 'Ship 🚢',
    boxCount: 2,
    cardBg: 'bg-gradient-to-r from-emerald-50 to-teal-50/70 border-emerald-200',
    flowerBg: 'bg-pink-500 text-white ring-4 ring-yellow-300'
  },
  {
    id: 5,
    numRoman: 'v)',
    scrambledLetters: [
      { id: 'l1', char: 'තු', color: 'bg-rose-500 text-white', shadow: 'shadow-rose-200' },
      { id: 'l2', char: 'ක', color: 'bg-amber-500 text-white', shadow: 'shadow-amber-200' },
      { id: 'l3', char: 'ර', color: 'bg-sky-500 text-white', shadow: 'shadow-sky-200' },
    ],
    correctOrder: ['ක', 'තු', 'ර'],
    fullWord: 'කතුර',
    meaning: 'Scissors ✂️',
    boxCount: 3,
    cardBg: 'bg-gradient-to-r from-yellow-50 to-amber-50/70 border-yellow-200',
    flowerBg: 'bg-pink-500 text-white ring-4 ring-yellow-300'
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

// ── Single Question Card Row (Matches Screenshot 2) ──
function WordBuildingRow({
  item,
  placedLetters,
  onSelectBubble,
  onRemoveSlot,
  isRowCompleted,
  rowStatus
}) {
  const isSelected = (letterObj) => {
    return placedLetters.some((p) => p && p.id === letterObj.id);
  };

  return (
    <div
      className={`relative rounded-[2.5rem] p-4 md:p-6 border-4 shadow-md transition-all ${item.cardBg} flex flex-col md:flex-row items-center justify-between gap-4`}
    >
      {/* Flower Roman Number Badge on Left */}
      <div className="flex items-center gap-3 self-start md:self-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center font-black text-lg shadow-md ring-4 ring-yellow-300">
            {item.numRoman}
          </div>
          {/* Flower Petals Decor */}
          <div className="absolute -bottom-1 -right-1 text-sm pointer-events-none">🌸</div>
        </div>
      </div>

      {/* Target Letter Slot Boxes (Left side of Card) */}
      <div className="flex items-center gap-3">
        {[...Array(item.boxCount)].map((_, idx) => {
          const placed = placedLetters[idx];

          return (
            <div
              key={idx}
              onClick={() => placed && !isRowCompleted && onRemoveSlot(item.id, idx)}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-3 border-dashed flex items-center justify-center text-3xl font-black transition-all cursor-pointer select-none relative ${
                placed
                  ? isRowCompleted
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-sm animate-bounce'
                    : rowStatus === 'wrong'
                    ? 'bg-red-100 border-red-400 text-red-700 animate-shake'
                    : 'bg-white border-purple-400 text-slate-800 shadow-md transform hover:scale-105'
                  : 'bg-white/80 border-amber-300/80 hover:border-amber-400 text-slate-300'
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

      {/* Fluffy Cloud with Colored Letter Bubbles (Right side of Card) */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-full py-4 px-8 md:px-10 shadow-lg border-2 border-sky-200 flex items-center justify-center gap-4 flex-wrap">
        {/* Star Badges Decorating Cloud */}
        <div className="absolute -top-3 -right-2 text-xl pointer-events-none">⭐</div>
        <div className="absolute -bottom-2 -left-2 text-lg text-pink-400 pointer-events-none">✨</div>

        {item.scrambledLetters.map((letterObj) => {
          const used = isSelected(letterObj);

          return (
            <button
              key={letterObj.id}
              disabled={used || isRowCompleted}
              onClick={() => onSelectBubble(item.id, letterObj)}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl font-black shadow-lg border-2 border-white transform transition-all cursor-pointer ${
                letterObj.color
              } ${
                used
                  ? 'opacity-30 scale-90 cursor-not-allowed filter grayscale'
                  : 'hover:scale-115 active:scale-95 animate-pulse'
              }`}
            >
              {letterObj.char}
            </button>
          );
        })}
      </div>

      {/* ✅ Complete Checkmark Badge */}
      {isRowCompleted && (
        <div className="absolute top-3 right-4 animate-bounce">
          <div className="w-9 h-9 bg-emerald-500 text-white rounded-full shadow-lg border-2 border-white flex items-center justify-center font-black text-lg">
            ✓
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Grade 2 Level 2 Activity 1 Component ──
export default function SinhalaGrade2Level2Act1({ onExit }) {
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
  const pageItems = currentPage === 0 ? LEVEL2_ACT1_ITEMS.slice(0, 2) : LEVEL2_ACT1_ITEMS.slice(2);

  // Play instructions on load
  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala('නිවැරදි වචනය අකුරු අනුපිළිවෙල සකසා ලියන්න.');
    }, 400);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handleSpeakerClick = () => {
    playSound('click');
    speakSinhala('නිවැරදි වචනය අකුරු අනුපිළිවෙල සකසා ලියන්න.');
  };

  // Place a letter into the next empty slot
  const handleSelectBubble = (itemId, letterObj) => {
    playSound('click');
    const currentSlots = slotsState[itemId] || [];
    const item = LEVEL2_ACT1_ITEMS.find((it) => it.id === itemId);

    if (currentSlots.length < item.boxCount) {
      const updated = [...currentSlots, letterObj];
      setSlotsState((prev) => ({ ...prev, [itemId]: updated }));

      // Auto-check if all slots filled
      if (updated.length === item.boxCount) {
        checkRowOrder(item, updated);
      }
    }
  };

  // Remove a letter from a slot
  const handleRemoveSlot = (itemId, slotIdx) => {
    playSound('click');
    const currentSlots = slotsState[itemId] || [];
    const updated = currentSlots.filter((_, idx) => idx !== slotIdx);
    setSlotsState((prev) => ({ ...prev, [itemId]: updated }));
    setRowStatus((prev) => ({ ...prev, [itemId]: null }));
  };

  // Check correct order
  const checkRowOrder = (item, slots) => {
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
        checkRowOrder(item, slots);
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
      progressionManager.recordExerciseScore('l2_ex1', 100);
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-300 via-sky-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-6xl mb-2 animate-bounce">🏆</div>
          <h1 className="text-4xl font-extrabold text-purple-700 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-4">ඔබ Level 2 පළමු අභ්‍යාසය සාර්ථකව අවසන් කළා!</p>

          {/* Unlock Badge */}
          <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 text-amber-950 border-2 border-amber-400 px-5 py-2.5 rounded-2xl text-sm font-black inline-flex items-center gap-2 mb-6 shadow-sm">
            <span className="text-xl">🌟</span>
            <span>ඉහළම දක්ෂතාවය! Level 3 (වාක්‍ය ගොඩනැගීම) සෘජුවම විවෘත විය!</span>
          </div>

          <div className="text-4xl font-black text-purple-600 mb-6">ලකුණු: {score} ⭐</div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {/* Primary Fast-track Promotion to Level 3 */}
            <button
              onClick={() => navigate('/module/sinhala/grade2-level3-act1')}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xl rounded-2xl shadow-xl transform hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 border-2 border-emerald-300 animate-pulse"
            >
              <span>🚀 Level 3 වෙත උසස් වන්න (වාක්‍ය ලිවීම)</span>
              <span className="text-2xl">➔</span>
            </button>

            {/* Secondary Activity 2 Option */}
            <button
              onClick={() => navigate('/module/sinhala/grade2-level2-act2')}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-base rounded-2xl shadow cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <span>✨ Level 2 හි ඊළඟ අභ්‍යාසය (Activity 2: මැජික් පුවරුව)</span>
            </button>

            <div className="flex gap-4 mt-1">
              <button
                onClick={() => {
                  setCurrentPage(0);
                  setSlotsState({});
                  setCompletedRows({});
                  setIsFinished(false);
                }}
                className="flex-1 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-base rounded-2xl shadow-md cursor-pointer"
              >
                🔄 නැවත කරන්න
              </button>
              <button
                onClick={onExit || (() => navigate('/module/sinhala/grade2'))}
                className="flex-1 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-base rounded-2xl shadow-md cursor-pointer"
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
      
      {/* Rainbow and Sunny Background Decor */}
      <div className="absolute top-2 right-6 text-7xl opacity-90 pointer-events-none">🌈</div>
      <div className="absolute top-6 left-10 text-5xl opacity-80 pointer-events-none animate-pulse">☁️</div>

      <div className="max-w-5xl mx-auto px-4 py-3 relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* ── TOP HEADER BAR (Matches Screenshot 2) ── */}
        <div className="flex items-center justify-between gap-3 mb-2">
          
          {/* Back Button (Pink/Red Circle) */}
          <button
            onClick={onExit || (() => navigate('/module/sinhala/grade2'))}
            className="w-12 h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="ආපසු"
          >
            ←
          </button>

          {/* Center Pill: LEVEL 2 - වචන ගොඩනැගීම & Activity 1 */}
          <div className="flex flex-col items-center flex-1 max-w-xl">
            <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 text-white py-2 px-8 rounded-full shadow-lg border-2 border-yellow-300 text-center">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-wide drop-shadow">
                LEVEL 2 — වචන ගොඩනැගීම
              </h1>
            </div>
            <div className="bg-emerald-600 text-white text-xs font-black px-6 py-1 rounded-full shadow-md -mt-1 border border-emerald-300">
              Activity 1: වචන ගොඩනගමු
            </div>
          </div>

          {/* Right Speaker Button (Purple Circle) */}
          <button
            onClick={handleSpeakerClick}
            className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="හඬ අසන්න"
          >
            🔊
          </button>
        </div>

        {/* ── SUB-INSTRUCTION BANNER WITH MEGAPHONE & BUTTERFLY ── */}
        <div className="relative max-w-3xl mx-auto w-full my-2">
          <div className="bg-white/95 backdrop-blur-md rounded-full py-2.5 px-6 shadow-md border-2 border-dashed border-sky-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📢</span>
              <p className="text-lg md:text-xl font-bold text-slate-800">
                නිවැරදි වචනය අකුරු අනුපිළිවෙල <span className="text-emerald-600 font-extrabold underline">සකසා ලියන්න.</span>
              </p>
            </div>
            <span className="text-3xl animate-bounce">🦋</span>
          </div>
        </div>

        {/* ── QUESTION ROWS (Matches Screenshot 2) ── */}
        <div className="flex flex-col gap-4 my-auto">
          {pageItems.map((item) => (
            <WordBuildingRow
              key={item.id}
              item={item}
              placedLetters={slotsState[item.id] || []}
              onSelectBubble={handleSelectBubble}
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
              <span>අකුරු එක තෝරාගෙන නිවැරදි අනුපිළිවෙලට දාන්න.</span>
              <span>⭐</span>
            </div>
          </div>

          {/* Right Action Buttons: 💡 උපදෙස් and ✓ පරීක්ෂා කරන්න / ඊළඟට */}
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

            {/* Check / Next Button */}
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
                වලාකුළේ ඇති පාට බෝල මත click කර, නිවැරදි වචනය සෑදෙන පරිදි කොටු තුළට දමන්න!
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
