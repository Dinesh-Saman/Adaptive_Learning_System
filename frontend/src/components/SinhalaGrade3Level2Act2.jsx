import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Grade 3 Level 2 Activity 2: පිල්ලම් යෙදී ඇති වචන දෙක බැගින් තෝරන්න ──
const PILLAM_CATEGORIES = [
  {
    id: 'p1_alapilla',
    num: 1,
    name: 'ඇලපිල්ල',
    symbol: 'ා',
    badgeColor: 'bg-rose-500',
    cardBorder: 'border-rose-300',
    cardBg: 'bg-rose-50/80',
    textColor: 'text-rose-900',
    accentColor: 'from-rose-500 to-pink-600',
    correctWords: ['තාරාවා', 'සාලය'],
    voicePrompt: 'ඇලපිල්ල යෙදුණු වචන දෙක තෝරන්න. තාරාවා, සාලය.',
    desc: 'ඇලපිල්ල ( ා )'
  },
  {
    id: 'p2_ispilla',
    num: 2,
    name: 'ඉස්පිල්ල',
    symbol: 'ි',
    badgeColor: 'bg-sky-500',
    cardBorder: 'border-sky-300',
    cardBg: 'bg-sky-50/80',
    textColor: 'text-sky-900',
    accentColor: 'from-sky-500 to-blue-600',
    correctWords: ['පිටි', 'සිහිනය'],
    voicePrompt: 'ඉස්පිල්ල යෙදුණු වචන දෙක තෝරන්න. පිටි, සිහිනය.',
    desc: 'ඉස්පිල්ල ( ි )'
  },
  {
    id: 'p3_dirgha_ispilla',
    num: 3,
    name: 'දීර්ඝ ඉස්පිල්ල',
    symbol: 'ී',
    badgeColor: 'bg-purple-500',
    cardBorder: 'border-purple-300',
    cardBg: 'bg-purple-50/80',
    textColor: 'text-purple-900',
    accentColor: 'from-purple-500 to-indigo-600',
    correctWords: ['සීල', 'පීනස'],
    voicePrompt: 'දීර්ඝ ඉස්පිල්ල යෙදුණු වචන දෙක තෝරන්න. සීල, පීනස.',
    desc: 'දීර්ඝ ඉස්පිල්ල ( ී )'
  },
  {
    id: 'p4_dirgha_aedaya',
    num: 4,
    name: 'දීර්ඝ ඇදය',
    symbol: 'ෑ',
    badgeColor: 'bg-amber-500',
    cardBorder: 'border-amber-300',
    cardBg: 'bg-amber-50/80',
    textColor: 'text-amber-900',
    accentColor: 'from-amber-500 to-orange-600',
    correctWords: ['රෑට', 'කෑදර'],
    voicePrompt: 'දීර්ඝ ඇදය යෙදුණු වචන දෙක තෝරන්න. රෑට, කෑදර.',
    desc: 'දීර්ඝ ඇදය ( ෑ )'
  },
  {
    id: 'p5_kombuwa',
    num: 5,
    name: 'කොම්බුව',
    symbol: 'ෙ',
    badgeColor: 'bg-emerald-500',
    cardBorder: 'border-emerald-300',
    cardBg: 'bg-emerald-50/80',
    textColor: 'text-emerald-900',
    accentColor: 'from-emerald-500 to-green-600',
    correctWords: ['බෙරය', 'කෙරවල'],
    voicePrompt: 'කොම්බුව යෙදුණු වචන දෙක තෝරන්න. බෙරය, කෙරවල.',
    desc: 'කොම්බුව ( ෙ )'
  }
];

// Initial Word Pool matching Screenshot 2
const INITIAL_WORD_POOL = [
  { id: 'w_1', text: 'කෙරවල', pillam: 'කොම්බුව', color: 'bg-gradient-to-r from-teal-400 to-emerald-500 text-white' },
  { id: 'w_2', text: 'කීරි', pillam: 'දීර්ඝ ඉස්පිල්ල', color: 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white' },
  { id: 'w_3', text: 'තාරාවා', pillam: 'ඇලපිල්ල', color: 'bg-gradient-to-r from-pink-400 to-rose-500 text-white' },
  { id: 'w_4', text: 'රෑට', pillam: 'දීර්ඝ ඇදය', color: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' },
  { id: 'w_5', text: 'සාලය', pillam: 'ඇලපිල්ල', color: 'bg-gradient-to-r from-rose-400 to-red-500 text-white' },
  { id: 'w_6', text: 'සීල', pillam: 'දීර්ඝ ඉස්පිල්ල', color: 'bg-gradient-to-r from-indigo-400 to-purple-600 text-white' },
  { id: 'w_7', text: 'පිටි', pillam: 'ඉස්පිල්ල', color: 'bg-gradient-to-r from-sky-400 to-blue-500 text-white' },
  { id: 'w_8', text: 'කෑදර', pillam: 'දීර්ඝ ඇදය', color: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white' },
  { id: 'w_9', text: 'පීනස', pillam: 'දීර්ඝ ඉස්පිල්ල', color: 'bg-gradient-to-r from-violet-400 to-purple-500 text-white' },
  { id: 'w_10', text: 'සිහිනය', pillam: 'ඉස්පිල්ල', color: 'bg-gradient-to-r from-cyan-400 to-sky-500 text-white' },
  { id: 'w_11', text: 'බෙරය', pillam: 'කොම්බුව', color: 'bg-gradient-to-r from-emerald-400 to-teal-600 text-white' },
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

export default function SinhalaGrade3Level2Act2({ onExit }) {
  const navigate = useNavigate();

  // Placed slots map: { categoryId: [wordObjOrNull, wordObjOrNull] }
  const [placedSlots, setPlacedSlots] = useState({
    p1_alapilla: [null, null],
    p2_ispilla: [null, null],
    p3_dirgha_ispilla: [null, null],
    p4_dirgha_aedaya: [null, null],
    p5_kombuwa: [null, null],
  });

  const [availableWords, setAvailableWords] = useState(INITIAL_WORD_POOL);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(120);
  const [isAllDone, setIsAllDone] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState({});
  const [tipMessage, setTipMessage] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala('මෙහි පිල්ලම් යෙදී ඇති වචන දෙක බැගින් තෝරන්න.');
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Select a word from the pool
  const handleSelectPoolWord = (word) => {
    if (isConfirmed) return;
    playSound('click');
    if (selectedWord?.id === word.id) {
      setSelectedWord(null);
    } else {
      setSelectedWord(word);
      speakSinhala(word.text);
    }
  };

  // Place word into category slot
  const handleSlotClick = (categoryId, slotIndex) => {
    if (isConfirmed) return;
    playSound('click');

    const currentPlaced = placedSlots[categoryId][slotIndex];

    // If slot already has a word and no pool word selected -> remove word back to pool
    if (currentPlaced && !selectedWord) {
      playSound('place');
      setPlacedSlots((prev) => {
        const nextSlots = [...prev[categoryId]];
        nextSlots[slotIndex] = null;
        return { ...prev, [categoryId]: nextSlots };
      });
      setAvailableWords((prev) => [...prev, currentPlaced]);
      return;
    }

    // If user has selected a word from pool -> place into this slot
    if (selectedWord) {
      playSound('place');
      setPlacedSlots((prev) => {
        const nextSlots = [...prev[categoryId]];
        const oldWord = nextSlots[slotIndex];
        nextSlots[slotIndex] = selectedWord;

        // If replacing an old word, put old word back to available pool
        if (oldWord) {
          setAvailableWords((p) => [...p.filter((w) => w.id !== selectedWord.id), oldWord]);
        } else {
          setAvailableWords((p) => p.filter((w) => w.id !== selectedWord.id));
        }

        return { ...prev, [categoryId]: nextSlots };
      });
      setSelectedWord(null);
    }
  };

  // Confirm and Evaluate all 5 Pillam Categories
  const handleConfirmAll = () => {
    playSound('click');

    // Check if at least some words are placed
    const allPlacedCount = Object.values(placedSlots).flat().filter(Boolean).length;
    if (allPlacedCount < 10) {
      playSound('wrong');
      setTipMessage('කරුණාකර සියලුම පිල්ලම් සඳහා වචන 2 බැගින් තබන්න! 📝');
      speakSinhala('කරුණාකර සියලුම පිල්ලම් සඳහා වචන දෙක බැගින් තබන්න.');
      setTimeout(() => setTipMessage(null), 3000);
      return;
    }

    setIsConfirmed(true);

    let totalCorrectCount = 0;
    const results = {};

    PILLAM_CATEGORIES.forEach((cat) => {
      const placed = placedSlots[cat.id];
      const w1 = placed[0]?.text;
      const w2 = placed[1]?.text;

      const w1Correct = cat.correctWords.includes(w1);
      const w2Correct = cat.correctWords.includes(w2) && w2 !== w1;

      if (w1Correct) totalCorrectCount++;
      if (w2Correct) totalCorrectCount++;

      results[cat.id] = {
        isFullCorrect: w1Correct && w2Correct,
        w1Correct,
        w2Correct,
      };
    });

    setEvaluationResults(results);

    if (totalCorrectCount === 10) {
      playSound('correct');
      setScore((prev) => prev + 50);
      speakSinhala('විශිෂ්ටයි! ඔබ සියලුම පිල්ලම් සඳහා නිවැරදි වචන තෝරා ගත්තා! 🎉');
    } else {
      playSound('wrong');
      setScore((prev) => prev + totalCorrectCount * 5);
      speakSinhala(`ඔබ වචන ${totalCorrectCount}ක් නිවැරදිව තෝරා ඇත. රතු පැහැති කොටස් පරීක්ෂා කරන්න.`);
    }
  };

  // Reset activity
  const handleResetAll = () => {
    playSound('click');
    setPlacedSlots({
      p1_alapilla: [null, null],
      p2_ispilla: [null, null],
      p3_dirgha_ispilla: [null, null],
      p4_dirgha_aedaya: [null, null],
      p5_kombuwa: [null, null],
    });
    setAvailableWords(INITIAL_WORD_POOL);
    setSelectedWord(null);
    setIsConfirmed(false);
    setEvaluationResults({});
    speakSinhala('සියලු පිළිතුරු නැවත සකස් කරන ලදී.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-purple-100 to-indigo-200 font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-6">
      
      {/* ── TOP HEADER BAR ── */}
      <div className="max-w-5xl mx-auto w-full px-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Back Button */}
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="w-11 h-11 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center text-xl font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="ආපසු"
          >
            ⬅️
          </button>

          {/* Star Score Badge */}
          <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-4 py-2 rounded-2xl font-black text-sm md:text-base shadow-md border-2 border-purple-400 flex items-center gap-1.5">
            <span className="text-yellow-300 text-lg">⭐</span>
            <span>{score}</span>
          </div>

          {/* Center Activity Pill Banner */}
          <div className="flex-1 max-w-md bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 2: පිල්ලම් යෙදී ඇති වචන තෝරන්න
            </h1>
          </div>

          {/* Listen Instruction Button */}
          <button
            onClick={() => {
              playSound('click');
              speakSinhala('මෙහි පිල්ලම් යෙදී ඇති වචන දෙක බැගින් තෝරන්න.');
            }}
            className="w-11 h-11 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="හඬ අසන්න"
          >
            🔊
          </button>
        </div>

        {/* ── SUB-INSTRUCTION BANNER ── */}
        <div className="max-w-3xl mx-auto w-full mt-3">
          <div className="bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-purple-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound('click');
                  speakSinhala('මෙහි පිල්ලම් යෙදී ඇති වචන දෙක බැගින් තෝරන්න.');
                }}
                className="w-8 h-8 bg-purple-600 hover:bg-purple-700 active:scale-90 text-white rounded-full flex items-center justify-center text-base shadow-sm cursor-pointer"
              >
                🔊
              </button>
              <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
                2) මෙහි <span className="text-purple-700 font-extrabold underline">පිල්ලම් යෙදී ඇති වචන දෙක බැගින්</span> තෝරන්න.
              </p>
            </div>
            <div className="text-2xl pointer-events-none select-none">
              📖
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN 5 PILLAM CATEGORIES BOARD (Matches Screenshot 2) ── */}
      <div className="max-w-5xl mx-auto w-full px-4 my-3 flex-1 flex flex-col gap-3">
        
        {/* Toast tip */}
        {tipMessage && (
          <div className="bg-amber-500 text-white text-xs md:text-sm font-black py-2 px-4 rounded-2xl text-center shadow-lg animate-bounce mx-auto max-w-md">
            {tipMessage}
          </div>
        )}

        {/* 5 Pillam Category Cards */}
        {PILLAM_CATEGORIES.map((cat) => {
          const placed = placedSlots[cat.id];
          const result = evaluationResults[cat.id];

          return (
            <div
              key={cat.id}
              className={`rounded-3xl p-3 md:p-4 border-3 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 transition-all ${
                cat.cardBg
              } ${
                isConfirmed
                  ? result?.isFullCorrect
                    ? 'border-emerald-500 bg-emerald-50/70'
                    : 'border-rose-400 bg-rose-50/60'
                  : cat.cardBorder
              }`}
            >
              {/* Left Category Name & Symbol Badge */}
              <div className="flex items-center gap-3 min-w-[200px] sm:min-w-[240px]">
                <div
                  className={`w-9 h-9 rounded-full ${cat.badgeColor} text-white flex items-center justify-center font-black text-sm md:text-base shadow-md`}
                >
                  {cat.num}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-base md:text-lg font-black ${cat.textColor}`}>
                    {cat.name}
                  </span>
                  <span className="w-8 h-8 rounded-xl bg-white text-slate-800 font-black text-lg border shadow-xs flex items-center justify-center">
                    {cat.symbol}
                  </span>
                </div>

                {/* Voice button for category */}
                <button
                  onClick={() => {
                    playSound('click');
                    speakSinhala(cat.voicePrompt);
                  }}
                  className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xs shadow-xs cursor-pointer ml-auto"
                >
                  🔊
                </button>
              </div>

              {/* Center 2 Drop Slots / Lines */}
              <div className="flex-1 w-full flex items-center justify-center sm:justify-end gap-3 md:gap-4">
                {[0, 1].map((slotIdx) => {
                  const placedWord = placed[slotIdx];
                  const isWordCorrect =
                    isConfirmed && placedWord && cat.correctWords.includes(placedWord.text);

                  return (
                    <div
                      key={slotIdx}
                      onClick={() => handleSlotClick(cat.id, slotIdx)}
                      className={`flex-1 max-w-[170px] sm:max-w-[190px] h-12 rounded-2xl border-2 flex items-center justify-center px-3 font-black text-sm md:text-base shadow-inner transition-all cursor-pointer ${
                        placedWord
                          ? isConfirmed
                            ? isWordCorrect
                              ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-md'
                              : 'bg-rose-500 text-white border-rose-600'
                            : 'bg-white text-slate-800 border-purple-400 ring-2 ring-purple-200 shadow-md'
                          : selectedWord
                          ? 'bg-purple-100/70 border-dashed border-purple-400 text-purple-600 animate-pulse'
                          : 'bg-white/80 hover:bg-white border-dashed border-slate-300 text-slate-400'
                      }`}
                      title={placedWord ? 'ඉවත් කිරීමට ක්ලික් කරන්න' : 'වචනයක් තබන්න'}
                    >
                      {placedWord ? (
                        <span className="flex items-center gap-1">
                          <span>{placedWord.text}</span>
                          {isConfirmed && isWordCorrect && <span className="text-xs">✓</span>}
                          {isConfirmed && !isWordCorrect && <span className="text-xs">✕</span>}
                        </span>
                      ) : (
                        <span className="text-xs opacity-50 font-bold">වචනය {slotIdx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status Badge */}
              {isConfirmed && (
                <div className="text-lg">
                  {result?.isFullCorrect ? '✅' : '❌'}
                </div>
              )}
            </div>
          );
        })}

        {/* ── BOTTOM FLOATING WORD POOL ── */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border-3 border-purple-300 mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
              <span>🏷️</span>
              <span>වචන එකතුව (Word List - තෝරා ඉහත හිස්තැන් මත තබන්න):</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              ඉතිරි: {availableWords.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {availableWords.map((word) => {
              const isSelected = selectedWord?.id === word.id;
              return (
                <button
                  key={word.id}
                  disabled={isConfirmed}
                  onClick={() => handleSelectPoolWord(word)}
                  className={`py-2 px-4 rounded-2xl font-black text-sm md:text-base shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center select-none ${
                    isSelected
                      ? 'ring-4 ring-yellow-400 scale-110 shadow-lg border-2 border-white animate-bounce-short ' + word.color
                      : `${word.color} hover:scale-105 border border-white/40`
                  }`}
                >
                  <span>{word.text}</span>
                </button>
              );
            })}

            {availableWords.length === 0 && !isConfirmed && (
              <div className="w-full text-center py-2 text-xs md:text-sm font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                ✨ සියලු වචන තබා ඇත! "පිළිතුරු තහවුරු කරන්න" ක්ලික් කරන්න.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── BOTTOM ACTION CONTROLS ── */}
      <div className="max-w-5xl mx-auto w-full px-4 mt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Back Button */}
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="flex-1 min-w-[130px] py-2.5 px-5 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>⬅️</span>
            <span>ආපසු</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleResetAll}
            className="flex-1 min-w-[130px] py-2.5 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>🔄</span>
            <span>නැවත සකසන්න</span>
          </button>

          {isConfirmed ? (
            /* Next / Complete Activity */
            <button
              onClick={() => {
                playSound('click');
                navigate('/dashboard');
              }}
              className="flex-1 min-w-[180px] py-2.5 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-sm md:text-base rounded-2xl shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all animate-bounce-short"
            >
              <span>🏆</span>
              <span>අවසන් කරන්න</span>
              <span className="text-lg">➔</span>
            </button>
          ) : (
            /* Confirm Button */
            <button
              onClick={handleConfirmAll}
              className="flex-1 min-w-[180px] py-2.5 px-6 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm md:text-base rounded-2xl shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all ring-4 ring-emerald-300 animate-pulse"
            >
              <span>✓</span>
              <span>පිළිතුරු තහවුරු කරන්න</span>
            </button>
          )}

        </div>
      </div>

    </div>
  );
}
