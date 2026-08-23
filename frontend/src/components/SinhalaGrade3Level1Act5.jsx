import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Questions for Grade 3 Level 1 Activity 5 (ශබ්දයෙන් ආරම්භ වන වචන තෝරන්න) ──
const GRADE3_L1_ACT5_QUESTIONS = [
  {
    id: 1,
    num: 1,
    targetSound: 'ක',
    promptText: '"ක" ශබ්දයෙන් ආරම්භ වන වචන තෝරන්න',
    audioPrompt: 'ක ශබ්දයෙන් ආරම්භ වන වචන තෝරන්න.',
    words: [
      { id: 'w_1_1', text: 'කුරුල්ලා', emoji: '🐦', isCorrect: true },
      { id: 'w_1_2', text: 'අඹ', emoji: '🥭', isCorrect: false },
      { id: 'w_1_3', text: 'කපුටා', emoji: '🦅', isCorrect: true },
      { id: 'w_1_4', text: 'මල', emoji: '🌸', isCorrect: false },
      { id: 'w_1_5', text: 'කොටියා', emoji: '🐅', isCorrect: true },
    ]
  },
  {
    id: 2,
    num: 2,
    targetSound: 'ග',
    promptText: '"ග" ශබ්දයෙන් ආරම්භ වන වචන තෝරන්න',
    audioPrompt: 'ග ශබ්දයෙන් ආරම්භ වන වචන තෝරන්න.',
    words: [
      { id: 'w_2_1', text: 'ගස', emoji: '🌳', isCorrect: true },
      { id: 'w_2_2', text: 'අලියා', emoji: '🐘', isCorrect: false },
      { id: 'w_2_3', text: 'ගිරවා', emoji: '🦜', isCorrect: true },
      { id: 'w_2_4', text: 'පොත', emoji: '📕', isCorrect: false },
      { id: 'w_2_5', text: 'ගෙදර', emoji: '🏡', isCorrect: true },
    ]
  },
  {
    id: 3,
    num: 3,
    targetSound: 'ප',
    promptText: '"ප" ශබ්දයෙන් ආරම්භ වන වචන තෝරන්න',
    audioPrompt: 'ප ශබ්දයෙන් ආරම්භ වන වචන තෝරන්න.',
    words: [
      { id: 'w_3_1', text: 'පූසා', emoji: '🐱', isCorrect: true },
      { id: 'w_3_2', text: 'අන්නාසි', emoji: '🍍', isCorrect: false },
      { id: 'w_3_3', text: 'පොත', emoji: '📖', isCorrect: true },
      { id: 'w_3_4', text: 'මල', emoji: '🌺', isCorrect: false },
      { id: 'w_3_5', text: 'පාසල', emoji: '🏫', isCorrect: true },
    ]
  },
  {
    id: 4,
    num: 4,
    targetSound: 'ම',
    promptText: '"ම" ශබ්දයෙන් ආරම්භ වන වචන තෝරන්න',
    audioPrompt: 'ම ශබ්දයෙන් ආරම්භ වන වචන තෝරන්න.',
    words: [
      { id: 'w_4_1', text: 'මල', emoji: '🌻', isCorrect: true },
      { id: 'w_4_2', text: 'ගස', emoji: '🌲', isCorrect: false },
      { id: 'w_4_3', text: 'මාළුවා', emoji: '🐟', isCorrect: true },
      { id: 'w_4_4', text: 'පොත', emoji: '📚', isCorrect: false },
      { id: 'w_4_5', text: 'මුවා', emoji: '🦌', isCorrect: true },
    ]
  },
  {
    id: 5,
    num: 5,
    targetSound: 'අ',
    promptText: '"අ" ශබ්දයෙන් ආරම්භ වන වචන තෝරන්න',
    audioPrompt: 'අ ශබ්දයෙන් ආරම්භ වන වචන තෝරන්න.',
    words: [
      { id: 'w_5_1', text: 'අන්නාසි', emoji: '🍍', isCorrect: true },
      { id: 'w_5_2', text: 'අලියා', emoji: '🐘', isCorrect: true },
      { id: 'w_5_3', text: 'කුරුල්ලා', emoji: '🐤', isCorrect: false },
      { id: 'w_5_4', text: 'අඹ', emoji: '🥭', isCorrect: true },
      { id: 'w_5_5', text: 'පොත', emoji: '📒', isCorrect: false },
    ]
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

export default function SinhalaGrade3Level1Act5({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWordIds, setSelectedWordIds] = useState(new Set());
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(120);
  const [isAllDone, setIsAllDone] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const currentQ = GRADE3_L1_ACT5_QUESTIONS[currentIndex];

  useEffect(() => {
    setSelectedWordIds(new Set());
    setIsConfirmed(false);
    setFeedback(null);
    const timer = setTimeout(() => {
      speakSinhala(currentQ.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleToggleWord = (word) => {
    if (isConfirmed) return;
    playSound('click');
    speakSinhala(word.text);

    setSelectedWordIds((prev) => {
      const next = new Set(prev);
      if (next.has(word.id)) {
        next.delete(word.id);
      } else {
        next.add(word.id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    if (selectedWordIds.size === 0) {
      playSound('wrong');
      speakSinhala('කරුණාකර අවම වශයෙන් එක් වචනයක්වත් තෝරන්න.');
      return;
    }

    playSound('click');
    setIsConfirmed(true);

    const correctWords = currentQ.words.filter((w) => w.isCorrect);
    const correctCount = correctWords.filter((w) => selectedWordIds.has(w.id)).length;
    const wrongCount = currentQ.words.filter((w) => !w.isCorrect && selectedWordIds.has(w.id)).length;

    if (correctCount === correctWords.length && wrongCount === 0) {
      playSound('correct');
      setScore((prev) => prev + 20);
      setFeedback({
        isSuccess: true,
        message: 'විශිෂ්ටයි! ඔබ සියලුම නිවැරදි වචන තෝරා ගත්තා! 🎉'
      });
      speakSinhala('විශිෂ්ටයි! ඔබ සියලුම නිවැරදි වචන තෝරා ගත්තා!');
    } else {
      playSound('wrong');
      setScore((prev) => prev + Math.max(0, correctCount * 5 - wrongCount * 2));
      setFeedback({
        isSuccess: false,
        message: `ඔබ නිවැරදි වචන ${correctCount}ක් තෝරා ඇත.`
      });
      speakSinhala(`ඔබ නිවැරදි වචන ${correctCount}ක් තෝරා ඇත.`);
    }
  };

  const handleNext = () => {
    playSound('click');
    if (currentIndex < GRADE3_L1_ACT5_QUESTIONS.length - 1) {
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
          <p className="text-slate-600 text-lg mb-2">ඔබ Level 1 Activity 5 සාර්ථකව අවසන් කළා!</p>
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
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-100 to-emerald-200 font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-4">
      
      {/* Top Header */}
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
              <span>Level 1 · Activity 5</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 5: ශබ්දයෙන් ආරම්භ වන වචන තෝරන්න
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
                🎯 <span className="text-purple-700 font-extrabold underline">"{currentQ.targetSound}"</span> ශබ්දයෙන් ආරම්භ වන වචන තෝරා තහවුරු කරන්න.
              </p>
            </div>
            <div className="text-2xl pointer-events-none select-none">🎯</div>
          </div>
        </div>
      </div>

      {/* Main Question Workspace */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-purple-200 flex flex-col gap-6 relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-purple-50 via-sky-50 to-pink-50 p-4 rounded-3xl border-2 border-purple-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-lg border-2 border-white">
                {currentQ.targetSound}
              </div>
              <div>
                <span className="text-xs font-black text-purple-600 uppercase tracking-widest block">
                  Question {currentQ.num} of 5
                </span>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 mt-0.5">
                  "{currentQ.targetSound}" ශබ්දයෙන් ආරම්භ වන වචන:
                </h2>
              </div>
            </div>

            <div className="text-xs font-extrabold text-purple-900 bg-white/90 px-4 py-2 rounded-2xl border border-purple-200 shadow-xs">
              තෝරාගත් වචන: {selectedWordIds.size} / 3
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {currentQ.words.map((word) => {
              const isSelected = selectedWordIds.has(word.id);
              const isWordCorrect = word.isCorrect;

              return (
                <div
                  key={word.id}
                  onClick={() => handleToggleWord(word)}
                  className={`p-4 rounded-3xl border-3 shadow-md flex items-center justify-between gap-3 transition-all duration-200 select-none ${
                    isConfirmed
                      ? isWordCorrect
                        ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200 shadow-lg scale-102'
                        : isSelected
                        ? 'bg-rose-50 border-rose-500 ring-4 ring-rose-200'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                      : isSelected
                      ? 'bg-purple-100 border-purple-500 ring-4 ring-purple-200 shadow-lg scale-102 cursor-pointer'
                      : 'bg-white hover:bg-purple-50/50 border-slate-200 hover:border-purple-300 cursor-pointer active:scale-95'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl drop-shadow-sm">
                      {word.emoji}
                    </span>
                    <span className="text-base sm:text-lg md:text-xl font-black text-slate-800">
                      {word.text}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">
                    {isConfirmed ? (
                      isWordCorrect ? (
                        <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                          ✓
                        </span>
                      ) : isSelected ? (
                        <span className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
                          ✕
                        </span>
                      ) : (
                        <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-400"></span>
                      )
                    ) : isSelected ? (
                      <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md animate-pulse">
                        ✓
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-full border-2 border-slate-300 bg-white"></span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-2xl text-center text-xs sm:text-sm font-black shadow-md animate-bounce ${
                feedback.isSuccess ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
              }`}
            >
              {feedback.message}
            </div>
          )}

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

          <div className="flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-full shadow-md border border-sky-300">
            {GRADE3_L1_ACT5_QUESTIONS.map((_, i) => (
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

          {isConfirmed ? (
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
