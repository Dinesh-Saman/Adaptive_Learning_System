import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 4 Interactive Letter Sorting Rounds for Grade 4 Activity 3 (ස්වර හා ව්‍යංජන අක්ෂර තෝරමු) ──
const GRADE4_L2_ACT3_ROUNDS = [
  {
    id: 1,
    num: 1,
    title: 'ස්වර අක්ෂර පමණක් තෝරන්න',
    categoryName: 'ස්වර අක්ෂර (Vowels)',
    targetType: 'swara',
    voicePrompt: 'පහත අකුරු අතරින් ස්වර අක්ෂර පමණක් තෝරන්න.',
    instruction: '☁️ පහත අකුරු අතරින් <span class="text-pink-600 font-extrabold underline">ස්වර අක්ෂර පමණක්</span> තෝරා පහත කොටුවට දමන්න.',
    letters: [
      { id: 'l1_1', char: 'අ', isTarget: true, type: 'swara', bg: 'bg-rose-100 border-rose-400 text-rose-700' },
      { id: 'l1_2', char: 'ක', isTarget: false, type: 'vyanjana', bg: 'bg-sky-100 border-sky-400 text-sky-700' },
      { id: 'l1_3', char: 'ඉ', isTarget: true, type: 'swara', bg: 'bg-emerald-100 border-emerald-400 text-emerald-700' },
      { id: 'l1_4', char: 'ට', isTarget: false, type: 'vyanjana', bg: 'bg-purple-100 border-purple-400 text-purple-700' },
      { id: 'l1_5', char: 'උ', isTarget: true, type: 'swara', bg: 'bg-amber-100 border-amber-400 text-amber-700' },
      { id: 'l1_6', char: 'ම', isTarget: false, type: 'vyanjana', bg: 'bg-red-100 border-red-400 text-red-700' },
    ],
    correctChars: ['අ', 'ඉ', 'උ'],
    tracingText: 'අ  ඉ  උ'
  },
  {
    id: 2,
    num: 2,
    title: 'ව්‍යංජන අක්ෂර පමණක් තෝරන්න',
    categoryName: 'ව්‍යංජන අක්ෂර (Consonants)',
    targetType: 'vyanjana',
    voicePrompt: 'පහත අකුරු අතරින් ව්‍යංජන අක්ෂර පමණක් තෝරන්න.',
    instruction: '☁️ පහත අකුරු අතරින් <span class="text-blue-600 font-extrabold underline">ව්‍යංජන අක්ෂර පමණක්</span> තෝරා පහත කොටුවට දමන්න.',
    letters: [
      { id: 'l2_1', char: 'එ', isTarget: false, type: 'swara', bg: 'bg-rose-100 border-rose-400 text-rose-700' },
      { id: 'l2_2', char: 'ග', isTarget: true, type: 'vyanjana', bg: 'bg-sky-100 border-sky-400 text-sky-700' },
      { id: 'l2_3', char: 'ඔ', isTarget: false, type: 'swara', bg: 'bg-purple-100 border-purple-400 text-purple-700' },
      { id: 'l2_4', char: 'න', isTarget: true, type: 'vyanjana', bg: 'bg-emerald-100 border-emerald-400 text-emerald-700' },
      { id: 'l2_5', char: 'ඇ', isTarget: false, type: 'swara', bg: 'bg-amber-100 border-amber-400 text-amber-700' },
      { id: 'l2_6', char: 'ල', isTarget: true, type: 'vyanjana', bg: 'bg-indigo-100 border-indigo-400 text-indigo-700' },
    ],
    correctChars: ['ග', 'න', 'ල'],
    tracingText: 'ග  න  ල'
  },
  {
    id: 3,
    num: 3,
    title: 'දීර්ඝ ස්වර අක්ෂර තෝරන්න',
    categoryName: 'දීර්ඝ ස්වර අක්ෂර (Long Vowels)',
    targetType: 'swara',
    voicePrompt: 'පහත අකුරු අතරින් දීර්ඝ ස්වර අක්ෂර තෝරන්න.',
    instruction: '☁️ පහත අකුරු අතරින් <span class="text-emerald-600 font-extrabold underline">දීර්ඝ ස්වර අක්ෂර</span> තෝරා පහත කොටුවට දමන්න.',
    letters: [
      { id: 'l3_1', char: 'ආ', isTarget: true, type: 'swara', bg: 'bg-rose-100 border-rose-400 text-rose-700' },
      { id: 'l3_2', char: 'ප', isTarget: false, type: 'vyanjana', bg: 'bg-sky-100 border-sky-400 text-sky-700' },
      { id: 'l3_3', char: 'ඊ', isTarget: true, type: 'swara', bg: 'bg-emerald-100 border-emerald-400 text-emerald-700' },
      { id: 'l3_4', char: 'ස', isTarget: false, type: 'vyanjana', bg: 'bg-purple-100 border-purple-400 text-purple-700' },
      { id: 'l3_5', char: 'ඌ', isTarget: true, type: 'swara', bg: 'bg-amber-100 border-amber-400 text-amber-700' },
      { id: 'l3_6', char: 'ද', isTarget: false, type: 'vyanjana', bg: 'bg-teal-100 border-teal-400 text-teal-700' },
    ],
    correctChars: ['ආ', 'ඊ', 'ඌ'],
    tracingText: 'ආ  ඊ  ඌ'
  },
  {
    id: 4,
    num: 4,
    title: 'මූර්ධජ අක්ෂර තෝරන්න',
    categoryName: 'මූර්ධජ අක්ෂර (Murdhaja Letters)',
    targetType: 'murdhaja',
    voicePrompt: 'පහත අකුරු අතරින් මූර්ධජ අක්ෂර තෝරන්න.',
    instruction: '☁️ පහත අකුරු අතරින් <span class="text-purple-600 font-extrabold underline">මූර්ධජ අක්ෂර</span> තෝරා පහත කොටුවට දමන්න.',
    letters: [
      { id: 'l4_1', char: 'ණ', isTarget: true, type: 'murdhaja', bg: 'bg-pink-100 border-pink-400 text-pink-700' },
      { id: 'l4_2', char: 'න', isTarget: false, type: 'dantaja', bg: 'bg-sky-100 border-sky-400 text-sky-700' },
      { id: 'l4_3', char: 'ළ', isTarget: true, type: 'murdhaja', bg: 'bg-emerald-100 border-emerald-400 text-emerald-700' },
      { id: 'l4_4', char: 'ල', isTarget: false, type: 'dantaja', bg: 'bg-purple-100 border-purple-400 text-purple-700' },
      { id: 'l4_5', char: 'ෂ', isTarget: true, type: 'murdhaja', bg: 'bg-amber-100 border-amber-400 text-amber-700' },
      { id: 'l4_6', char: 'ස', isTarget: false, type: 'dantaja', bg: 'bg-rose-100 border-rose-400 text-rose-700' },
    ],
    correctChars: ['ණ', 'ළ', 'ෂ'],
    tracingText: 'ණ  ළ  ෂ'
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

// ── Main Grade 4 Level 2 Activity 3 Component ──
export default function SinhalaGrade4Level2Act3({ onExit }) {
  const navigate = useNavigate();

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]); // array of letter objects
  const [isCompletedRound, setIsCompletedRound] = useState(false);
  const [score, setScore] = useState(0);
  const [isAllDone, setIsAllDone] = useState(false);

  const currentRound = GRADE4_L2_ACT3_ROUNDS[currentRoundIndex];

  useEffect(() => {
    setSelectedLetters([]);
    setIsCompletedRound(false);
    const timer = setTimeout(() => {
      speakSinhala(currentRound.voicePrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentRoundIndex]);

  const handleLetterClick = (item) => {
    if (isCompletedRound) return;
    if (selectedLetters.some((l) => l.id === item.id)) return; // already in tray

    playSound('click');
    speakSinhala(item.char);

    if (item.isTarget) {
      playSound('correct');
      const updated = [...selectedLetters, item];
      setSelectedLetters(updated);

      if (updated.length === currentRound.correctChars.length) {
        setIsCompletedRound(true);
        setScore((prev) => prev + 25);
        speakSinhala(`විශිෂ්ටයි! ඔබ සියලුම ${currentRound.categoryName} නිවැරදිව තෝරාගත්තා!`);
      }
    } else {
      playSound('wrong');
      speakSinhala('නැවත උත්සාහ කරන්න. මෙය වෙනත් වර්ගයේ අකුරකි.');
    }
  };

  const handleNextRound = () => {
    playSound('click');
    if (currentRoundIndex < GRADE4_L2_ACT3_ROUNDS.length - 1) {
      setCurrentRoundIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-pink-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-7xl mb-2 animate-bounce">🏆🎉☀️</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ 4 ශ්‍රේණිය Activity 3 (ස්වර හා ව්‍යංජන අක්ෂර) සාර්ථකව අවසන් කළා!</p>
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
                setCurrentRoundIndex(0);
                setIsAllDone(false);
                setScore(0);
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
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-6"
      style={{ backgroundImage: "url('/images/grade4_bg.png')" }}
    >
      
      {/* ── TOP HEADER BAR ── */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-3">
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
              <span>Grade 4 · Act 3</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 3: {currentRound.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/95 text-purple-900 px-4 py-2 rounded-2xl font-black text-sm md:text-base shadow-md border-2 border-purple-200 flex items-center gap-1.5">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span>{score}</span>
            </div>
          </div>
        </div>

        {/* Sub-instruction banner with Sun & Bird */}
        <div className="w-full mt-3 bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-pink-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <p
              className="text-xs sm:text-sm md:text-base font-bold text-slate-800"
              dangerouslySetInnerHTML={{ __html: currentRound.instruction }}
            />
          </div>
          <div className="text-2xl pointer-events-none select-none flex items-center gap-1">
            <span>☀️</span>
            <span>🐦</span>
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-pink-200 flex flex-col gap-5 relative overflow-hidden">
          
          {/* Top Row: Cloud Letter Bubbles (Matching Screenshot Pool) */}
          <div className="bg-gradient-to-r from-sky-50 via-pink-50 to-amber-50 rounded-3xl p-4 sm:p-5 border-2 border-pink-200">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block text-center mb-3">
              අකුරු මත ක්ලික් කරන්න (Click to Select):
            </span>

            <div className="flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap">
              {currentRound.letters.map((item) => {
                const isPicked = selectedLetters.some((l) => l.id === item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleLetterClick(item)}
                    disabled={isPicked}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[1.8rem] font-black text-2xl sm:text-3xl border-3 shadow-md transition-all flex items-center justify-center cursor-pointer ${
                      isPicked
                        ? 'opacity-20 scale-90 border-slate-300 bg-slate-200 cursor-not-allowed'
                        : `${item.bg} hover:scale-110 active:scale-95 shadow-md`
                    }`}
                  >
                    {item.char}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Tray: Selected Target Letters */}
          <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 rounded-3xl border-2 border-emerald-300 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-black text-emerald-900 flex items-center gap-1.5">
                <span className="text-xl">💡</span>
                <span>{currentRound.categoryName} තැටිය:</span>
              </span>
              <span className="text-xs font-bold text-emerald-700">
                {selectedLetters.length} / {currentRound.correctChars.length} සම්පූර්ණයි
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 sm:gap-6 min-h-[90px]">
              {Array.from({ length: currentRound.correctChars.length }).map((_, idx) => {
                const picked = selectedLetters[idx];

                return (
                  <div
                    key={idx}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 flex items-center justify-center font-black text-3xl sm:text-4xl shadow-md transition-all relative ${
                      picked
                        ? 'bg-gradient-to-tr from-rose-100 to-pink-200 border-pink-500 text-pink-900'
                        : 'bg-white/80 border-dashed border-emerald-300 text-emerald-300'
                    }`}
                  >
                    {picked ? picked.char : '?'}

                    {picked && (
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-xs">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

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
            {GRADE4_L2_ACT3_ROUNDS.map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  i === currentRoundIndex
                    ? 'bg-pink-600 ring-2 ring-pink-300 scale-125'
                    : i < currentRoundIndex
                    ? 'bg-emerald-500'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNextRound}
            disabled={!isCompletedRound}
            className={`py-2.5 px-6 font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-2 transition-all ${
              isCompletedRound
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer active:scale-95 animate-bounce-short'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{currentRoundIndex === GRADE4_L2_ACT3_ROUNDS.length - 1 ? 'අවසන් කරන්න' : 'ඊළඟ වටය'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
