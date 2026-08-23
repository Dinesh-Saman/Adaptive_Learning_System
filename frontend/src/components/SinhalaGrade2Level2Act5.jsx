import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Category Baskets Dataset for Level 2 - Activity 5: Word Basket (වචන කූඩය) ──
const LEVEL2_ACT5_BASKETS = [
  {
    id: 1,
    num: 1,
    categoryName: 'සුරතල් සතුන්',
    categoryIcon: '🐾',
    badgeColor: 'bg-pink-500',
    headerPillBg: 'bg-pink-50 text-pink-900 border-pink-200',
    borderColor: 'border-pink-300',
    cardBg: 'bg-pink-50/40',
    voicePrompt: 'සුරතල් සතුන් වන වචන කූඩයට දමන්න.',
    words: [
      { id: 'b1_w1', text: 'බළලා', emoji: '🐱', isCorrect: true },
      { id: 'b1_w2', text: 'මේසය', emoji: '🪑', isCorrect: false },
      { id: 'b1_w3', text: 'හාවා', emoji: '🐰', isCorrect: true },
    ]
  },
  {
    id: 2,
    num: 2,
    categoryName: 'පාසල් දේවල්',
    categoryIcon: '📚',
    badgeColor: 'bg-sky-500',
    headerPillBg: 'bg-sky-50 text-sky-900 border-sky-200',
    borderColor: 'border-sky-300',
    cardBg: 'bg-sky-50/40',
    voicePrompt: 'පාසලට අයිති දේවල් කූඩයට දමන්න.',
    words: [
      { id: 'b2_w1', text: 'පොත', emoji: '📕', isCorrect: true },
      { id: 'b2_w2', text: 'පැන්සල', emoji: '✏️', isCorrect: true },
      { id: 'b2_w3', text: 'කුරුල්ලා', emoji: '🐦', isCorrect: false },
    ]
  },
  {
    id: 3,
    num: 3,
    categoryName: 'කෑම වර්ග',
    categoryIcon: '🍎',
    badgeColor: 'bg-emerald-500',
    headerPillBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    borderColor: 'border-emerald-300',
    cardBg: 'bg-emerald-50/40',
    voicePrompt: 'කෑමට ගන්නා දේවල් කූඩයට දමන්න.',
    words: [
      { id: 'b3_w1', text: 'කිරි', emoji: '🥛', isCorrect: true },
      { id: 'b3_w2', text: 'අඹ', emoji: '🥭', isCorrect: true },
      { id: 'b3_w3', text: 'පුටුව', emoji: '🪑', isCorrect: false },
    ]
  },
  {
    id: 4,
    num: 4,
    categoryName: 'ප්‍රවාහන',
    categoryIcon: '🚗',
    badgeColor: 'bg-purple-500',
    headerPillBg: 'bg-purple-50 text-purple-900 border-purple-200',
    borderColor: 'border-purple-300',
    cardBg: 'bg-purple-50/40',
    voicePrompt: 'ගමන් කිරීමට භාවිත කරන ප්‍රවාහන දේවල් කූඩයට දමන්න.',
    words: [
      { id: 'b4_w1', text: 'නැව', emoji: '🚢', isCorrect: true },
      { id: 'b4_w2', text: 'බස් රථය', emoji: '🚌', isCorrect: true },
      { id: 'b4_w3', text: 'මල', emoji: '🌸', isCorrect: false },
    ]
  },
  {
    id: 5,
    num: 5,
    categoryName: 'පවුල',
    categoryIcon: '👨‍👩‍👧',
    badgeColor: 'bg-amber-500',
    headerPillBg: 'bg-amber-50 text-amber-900 border-amber-200',
    borderColor: 'border-amber-300',
    cardBg: 'bg-amber-50/40',
    voicePrompt: 'පවුලේ සාමාජිකයන් වන වචන කූඩයට දමන්න.',
    words: [
      { id: 'b5_w1', text: 'අම්මා', emoji: '👩', isCorrect: true },
      { id: 'b5_w2', text: 'තාත්තා', emoji: '👨', isCorrect: true },
      { id: 'b5_w3', text: 'පොත', emoji: '📕', isCorrect: false },
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
    } else if (type === 'basket_drop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
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

// ── Wicker Basket Component with 2 Target Slots ──
function WickerBasketCard({
  basket,
  placedItems = [],
  onSlotClick,
  onWordClick,
  isComplete
}) {
  const handleBasketSpeak = (e) => {
    e.stopPropagation();
    playSound('click');
    speakSinhala(basket.voicePrompt);
  };

  const slot1 = placedItems[0] || null;
  const slot2 = placedItems[1] || null;

  return (
    <div
      className={`relative bg-white rounded-3xl p-3 md:p-4 shadow-md border-4 ${basket.borderColor} flex flex-col justify-between transition-all hover:shadow-xl ${
        isComplete ? 'bg-emerald-50/50 border-emerald-400' : ''
      }`}
    >
      {/* ── Top Header on Basket Card ── */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-8 h-8 rounded-full ${basket.badgeColor} text-white flex items-center justify-center font-black text-sm shadow-xs flex-shrink-0`}
        >
          {basket.num}
        </div>

        <button
          onClick={handleBasketSpeak}
          className={`flex-1 flex items-center justify-between px-3 py-1 rounded-xl text-xs md:text-sm font-extrabold border cursor-pointer active:scale-95 transition-all text-left ${basket.headerPillBg}`}
        >
          <span className="flex items-center gap-1.5 truncate">
            <span>{basket.categoryIcon}</span>
            <span>{basket.categoryName}</span>
          </span>
          <span className="text-sm ml-1 flex-shrink-0">🔊</span>
        </button>
      </div>

      {/* ── Realistic Wicker Basket Graphic with 2 Drop Target Slots ── */}
      <div className="my-2 p-2 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-3xl shadow-inner border-4 border-amber-950 relative overflow-hidden">
        {/* Wicker Pattern Texture Lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]"></div>

        <div className="flex items-center justify-center gap-2 relative z-10">
          {/* Slot 1 */}
          <div
            onClick={() => slot1 && onSlotClick(basket.id, 0)}
            className={`flex-1 h-14 md:h-16 bg-amber-50/90 rounded-2xl border-2 border-dashed flex items-center justify-center font-black text-sm md:text-base transition-all shadow-inner cursor-pointer ${
              slot1
                ? 'bg-white border-amber-500 scale-105 shadow-md text-slate-800'
                : 'border-amber-400/80 text-amber-900/40 hover:bg-white'
            }`}
          >
            {slot1 ? (
              <span className="flex items-center gap-1">
                <span className="text-xl">{slot1.emoji}</span>
                <span>{slot1.text}</span>
              </span>
            ) : (
              <span className="text-xs font-bold opacity-60">තබන්න 1</span>
            )}
          </div>

          {/* Slot 2 */}
          <div
            onClick={() => slot2 && onSlotClick(basket.id, 1)}
            className={`flex-1 h-14 md:h-16 bg-amber-50/90 rounded-2xl border-2 border-dashed flex items-center justify-center font-black text-sm md:text-base transition-all shadow-inner cursor-pointer ${
              slot2
                ? 'bg-white border-amber-500 scale-105 shadow-md text-slate-800'
                : 'border-amber-400/80 text-amber-900/40 hover:bg-white'
            }`}
          >
            {slot2 ? (
              <span className="flex items-center gap-1">
                <span className="text-xl">{slot2.emoji}</span>
                <span>{slot2.text}</span>
              </span>
            ) : (
              <span className="text-xs font-bold opacity-60">තබන්න 2</span>
            )}
          </div>
        </div>
      </div>

      {/* ── 3 Item Option Cards at the Bottom of Basket ── */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {basket.words.map((word) => {
          const isPlaced = placedItems.some((item) => item.id === word.id);
          return (
            <button
              key={word.id}
              onClick={() => !isPlaced && onWordClick(basket, word)}
              disabled={isPlaced}
              className={`p-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                isPlaced
                  ? 'opacity-30 bg-slate-100 border-slate-300 scale-95 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer'
              }`}
            >
              <div className="text-3xl md:text-4xl drop-shadow-xs">{word.emoji}</div>
              <span className="text-xs md:text-sm font-extrabold text-slate-800 tracking-tight truncate w-full text-center">
                {word.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* ✅ Complete Checkmark Badge */}
      {isComplete && (
        <div className="absolute top-2 right-2 animate-bounce z-20">
          <div className="w-8 h-8 bg-emerald-500 text-white rounded-full shadow-md border-2 border-white flex items-center justify-center font-black text-base">
            ✓
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Grade 2 Level 2 Activity 5 Component ──
export default function SinhalaGrade2Level2Act5({ onExit }) {
  const navigate = useNavigate();

  const [basketState, setBasketState] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  });

  const [score, setScore] = useState(120);
  const [isFinished, setIsFinished] = useState(false);

  // Play instructions on load
  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala('කාණ්ඩය අසලා ගැලපෙන වචන කූඩයට දමන්න.');
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSpeakerClick = () => {
    playSound('click');
    speakSinhala('Listen to the category. Drag the correct words into the basket. කාණ්ඩයට ගැලපෙන වචන කූඩයට දමන්න.');
  };

  // Place word into basket
  const handleWordClick = (basket, word) => {
    const current = basketState[basket.id] || [];
    if (current.length >= 2) return;

    if (word.isCorrect) {
      playSound('basket_drop');
      const updated = [...current, word];
      setBasketState((prev) => ({
        ...prev,
        [basket.id]: updated
      }));

      // Check if 2 correct items filled
      if (updated.length === 2) {
        playSound('correct');
        setScore((prev) => prev + 20);
        speakSinhala(`විශිෂ්ටයි! ${basket.categoryName} කූඩය සම්පූර්ණයි!`);
      }
    } else {
      playSound('wrong');
      speakSinhala(`නැවත උත්සාහ කරන්න. "${word.text}" මෙම කූඩයට අයත් නොවේ.`);
    }
  };

  // Remove word from basket slot
  const handleSlotClick = (basketId, slotIndex) => {
    playSound('click');
    setBasketState((prev) => {
      const current = prev[basketId] || [];
      const updated = current.filter((_, idx) => idx !== slotIndex);
      return {
        ...prev,
        [basketId]: updated
      };
    });
  };

  const handleFinishCheck = () => {
    playSound('click');
    const allCompleted = LEVEL2_ACT5_BASKETS.every(
      (b) => (basketState[b.id] || []).length === 2
    );

    if (allCompleted) {
      setIsFinished(true);
    } else {
      speakSinhala('කරුණාකර සියලුම කූඩ සඳහා නිවැරදි වචන 2 බැගින් තෝරා දමන්න.');
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-300 via-purple-100 to-pink-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-7xl mb-2 animate-bounce">🧺🏆🎉</div>
          <h1 className="text-4xl font-extrabold text-purple-700 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ Level 2 සියලුම අභ්‍යාස සාර්ථකව අවසන් කළා!</p>
          <div className="bg-emerald-100 text-emerald-800 font-black px-6 py-2 rounded-full inline-block mb-4 border border-emerald-300 shadow-xs">
            🌟 Level 3 දැන් සම්පූර්ණයෙන් විවෘතයි!
          </div>
          <div className="text-4xl font-black text-purple-600 mb-8">සමස්ත ලකුණු: {score} ⭐</div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/module/sinhala/grade2')}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🌟 Grade 2 Learning Hub වෙත (Level 3)</span>
              <span className="text-2xl">➔</span>
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setBasketState({ 1: [], 2: [], 3: [], 4: [], 5: [] });
                  setIsFinished(false);
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
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200 font-sinhala select-none relative overflow-x-hidden pb-8">
      
      {/* Background Decor */}
      <div className="absolute top-2 right-10 text-6xl opacity-80 pointer-events-none">☁️</div>
      <div className="absolute top-6 left-12 text-6xl opacity-80 pointer-events-none">☁️</div>

      <div className="max-w-6xl mx-auto px-4 py-3 relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* ── TOP HEADER BAR (Matches Screenshot) ── */}
        <div className="flex items-center justify-between gap-3 mb-2">
          
          {/* Home Button (Pink Circle) */}
          <button
            onClick={onExit || (() => navigate('/module/sinhala/grade2'))}
            className="w-12 h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="ආපසු"
          >
            🏠
          </button>

          {/* Center Activity Title Pill */}
          <div className="flex-1 max-w-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-lg md:text-xl font-extrabold tracking-wide drop-shadow flex items-center justify-center gap-2">
              <span>🧺</span>
              <span>Activity 5: Word Basket</span>
              <span>🧺</span>
            </h1>
          </div>

          {/* Right Speaker Button (Green Circle) */}
          <button
            onClick={handleSpeakerClick}
            className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="හඬ අසන්න"
          >
            🔊
          </button>
        </div>

        {/* ── SUB-INSTRUCTION BANNER (Matches Screenshot) ── */}
        <div className="relative max-w-3xl mx-auto w-full my-2">
          <div className="bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-dashed border-sky-300 flex items-center gap-3">
            <button
              onClick={handleSpeakerClick}
              className="w-9 h-9 bg-purple-600 hover:bg-purple-700 active:scale-90 text-white rounded-full flex items-center justify-center text-lg shadow-sm flex-shrink-0 cursor-pointer"
            >
              🔊
            </button>
            <p className="text-sm md:text-base font-extrabold text-slate-800">
              Listen to the category. Drag the correct words into the basket.
            </p>
          </div>
        </div>

        {/* ── 5 BASKET CARDS GRID (Matches Screenshot: 3 Top / 2 Bottom) ── */}
        <div className="flex flex-col gap-4 my-auto">
          
          {/* Top Row: Baskets 1, 2, 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LEVEL2_ACT5_BASKETS.slice(0, 3).map((b) => (
              <WickerBasketCard
                key={b.id}
                basket={b}
                placedItems={basketState[b.id] || []}
                onSlotClick={handleSlotClick}
                onWordClick={handleWordClick}
                isComplete={(basketState[b.id] || []).length === 2}
              />
            ))}
          </div>

          {/* Bottom Row: Baskets 4, 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
            {LEVEL2_ACT5_BASKETS.slice(3).map((b) => (
              <WickerBasketCard
                key={b.id}
                basket={b}
                placedItems={basketState[b.id] || []}
                onSlotClick={handleSlotClick}
                onWordClick={handleWordClick}
                isComplete={(basketState[b.id] || []).length === 2}
              />
            ))}
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="flex items-center justify-between mt-4 gap-4">
          
          {/* Trophy Score Pill */}
          <div className="bg-purple-700 text-yellow-300 px-6 py-2 rounded-full font-black text-lg shadow-lg border-2 border-white flex items-center gap-2">
            <span>🏆</span>
            <span>{score}</span>
            <span className="text-sm text-white">⭐</span>
          </div>

          {/* Completion Button */}
          <button
            onClick={handleFinishCheck}
            className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-black text-lg shadow-lg border-2 border-white flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>✓ සම්පූර්ණයි!</span>
            <span className="text-xl">❯❯</span>
          </button>
        </div>

      </div>
    </div>
  );
}
