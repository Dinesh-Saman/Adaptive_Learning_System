import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Questions for Grade 4 Level 4 Activity 3 (විරුද්ධ පද තෝරාගැනීම) ──
const GRADE4_L4_ACT3_QUESTIONS = [
  {
    id: 1,
    num: 1,
    baseWord: 'පැමිණීම',
    correctOpposite: 'පිටවීම',
    fullPairText: 'පැමිණීම ↔ පිටවීම',
    imageEmoji: '🚪🚶‍♂️✨',
    meaning: 'Arrival vs Departure (පැමිණීම ↔ පිටවීම)',
    explanation: '💡 යම් ස්ථානයකට ළඟාවීම පැමිණීම වන අතර, එතැනින් ඉවත්ව යාම පිටවීම වේ.',
    audioPrompt: 'පැමිණීම. නිවැරදි විරුද්ධ පදය තෝරන්න.',
    options: [
      { id: 'opt_1_1', text: 'පිටවීම', isCorrect: true },
      { id: 'opt_1_2', text: 'එළියට', isCorrect: false },
      { id: 'opt_1_3', text: 'ඇතුළට', isCorrect: false },
      { id: 'opt_1_4', text: 'නවතී', isCorrect: false },
    ]
  },
  {
    id: 2,
    num: 2,
    baseWord: 'අවශ්‍ය',
    correctOpposite: 'අනවශ්‍ය',
    fullPairText: 'අවශ්‍ය ↔ අනවශ්‍ය',
    imageEmoji: '✨📦💡',
    meaning: 'Necessary vs Unnecessary (අවශ්‍ය ↔ අනවශ්‍ය)',
    explanation: '💡 "අන්" උපසර්ගය මුලට එක්වීමෙන් "අවශ්‍ය" යන්නෙහි විරුද්ධාර්ථය වන "අනවශ්‍ය" සෑදේ.',
    audioPrompt: 'අවශ්‍ය. නිවැරදි විරුද්ධ පදය තෝරන්න.',
    options: [
      { id: 'opt_2_1', text: 'ප්‍රයෝජනවත්', isCorrect: false },
      { id: 'opt_2_2', text: 'අනවශ්‍ය', isCorrect: true },
      { id: 'opt_2_3', text: 'වටිනා', isCorrect: false },
      { id: 'opt_2_4', text: 'හිතකර', isCorrect: false },
    ]
  },
  {
    id: 3,
    num: 3,
    baseWord: 'පුහුණු',
    correctOpposite: 'නුපුහුණු',
    fullPairText: 'පුහුණු ↔ නුපුහුණු',
    imageEmoji: '🏋️‍♂️🎯⭐',
    meaning: 'Trained vs Untrained (පුහුණු ↔ නුපුහුණු)',
    explanation: '💡 "නු" උපසර්ගය මුලට එක්වීමෙන් "පුහුණු" යන්නෙහි විරුද්ධාර්ථය වන "නුපුහුණු" සෑදේ.',
    audioPrompt: 'පුහුණු. නිවැරදි විරුද්ධ පදය තෝරන්න.',
    options: [
      { id: 'opt_3_1', text: 'දක්ෂ', isCorrect: false },
      { id: 'opt_3_2', text: 'දැනුම්', isCorrect: false },
      { id: 'opt_3_3', text: 'නුපුහුණු', isCorrect: true },
      { id: 'opt_3_4', text: 'සමත්', isCorrect: false },
    ]
  },
  {
    id: 4,
    num: 4,
    baseWord: 'වැරදි',
    correctOpposite: 'නිවැරදි',
    fullPairText: 'වැරදි ↔ නිවැරදි',
    imageEmoji: '❌✅✨',
    meaning: 'Wrong vs Correct (වැරදි ↔ නිවැරදි)',
    explanation: '💡 "නි" උපසර්ගය මුලට එක්වීමෙන් "වැරදි" යන්නෙහි විරුද්ධාර්ථය වන "නිවැරදි" සෑදේ.',
    audioPrompt: 'වැරදි. නිවැරදි විරුද්ධ පදය තෝරන්න.',
    options: [
      { id: 'opt_4_1', text: 'වරද', isCorrect: false },
      { id: 'opt_4_2', text: 'නිවැරදි', isCorrect: true },
      { id: 'opt_4_3', text: 'වරදකාර', isCorrect: false },
      { id: 'opt_4_4', text: 'වැරදුණු', isCorrect: false },
    ]
  },
  {
    id: 5,
    num: 5,
    baseWord: 'පිරිසිදු',
    correctOpposite: 'අපිරිසිදු',
    fullPairText: 'පිරිසිදු ↔ අපිරිසිදු',
    imageEmoji: '🧼🧹💧',
    meaning: 'Clean vs Dirty (පිරිසිදු ↔ අපිරිසිදු)',
    explanation: '💡 "අ" උපසර්ගය මුලට එක්වීමෙන් "පිරිසිදු" යන්නෙහි විරුද්ධාර්ථය වන "අපිරිසිදු" සෑදේ.',
    audioPrompt: 'පිරිසිදු. නිවැරදි විරුද්ධ පදය තෝරන්න.',
    options: [
      { id: 'opt_5_1', text: 'පවිත්‍ර', isCorrect: false },
      { id: 'opt_5_2', text: 'සුද්ධ', isCorrect: false },
      { id: 'opt_5_3', text: 'නිර්මල', isCorrect: false },
      { id: 'opt_5_4', text: 'අපිරිසිදු', isCorrect: true },
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

const STORAGE_KEY = 'sinhala_g4_l4_act3_progress';

function loadSavedProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        typeof parsed.currentIndex === 'number' &&
        parsed.currentIndex >= 0 &&
        parsed.currentIndex < GRADE4_L4_ACT3_QUESTIONS.length &&
        typeof parsed.score === 'number'
      ) {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
}

// ── Main Grade 4 Level 4 Activity 3 Component ──
export default function SinhalaGrade4Level4Act3({ onExit }) {
  const navigate = useNavigate();

  const initialSaved = loadSavedProgress();

  const [currentIndex, setCurrentIndex] = useState(initialSaved?.currentIndex ?? 0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(initialSaved?.score ?? 0);
  const [isAllDone, setIsAllDone] = useState(initialSaved?.isAllDone ?? false);

  const currentQ = GRADE4_L4_ACT3_QUESTIONS[currentIndex] || GRADE4_L4_ACT3_QUESTIONS[0];
  const selectedOpt = currentQ.options.find((o) => o.id === selectedOptionId);

  // Persist progress across page refreshes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentIndex,
          score,
          isAllDone
        })
      );
    } catch (e) {}
  }, [currentIndex, score, isAllDone]);

  useEffect(() => {
    if (isAllDone) return;
    setSelectedOptionId(null);
    setIsConfirmed(false);
    setFeedback(null);
    const timer = setTimeout(() => {
      speakSinhala(currentQ.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex, isAllDone]);

  const handleSelectOption = (opt) => {
    if (isConfirmed) return;
    playSound('click');
    setSelectedOptionId(opt.id);
    speakSinhala(opt.text);
  };

  const handleConfirm = () => {
    if (isConfirmed) return;

    if (!selectedOptionId) {
      playSound('wrong');
      speakSinhala('කරුණාකර පළමුව විරුද්ධ පදයක් තෝරන්න.');
      return;
    }

    setIsConfirmed(true);

    if (selectedOpt?.isCorrect) {
      playSound('correct');
      setScore((prev) => prev + 20);
      setFeedback({
        isCorrect: true,
        text: `විශිෂ්ටයි! "${currentQ.baseWord}" යන්නෙහි නිවැරදි විරුද්ධ පදය වන්නේ "${selectedOpt.text}" වේ.`
      });
      speakSinhala(`විශිෂ්ටයි! ${currentQ.baseWord} යන්නෙහි විරුද්ධ පදය වන්නේ ${selectedOpt.text} වේ.`);
    } else {
      playSound('wrong');
      setFeedback({
        isCorrect: false,
        text: `පිළිතුර වැරදියි! "${currentQ.baseWord}" යන්නෙහි නිවැරදි විරුද්ධ පදය වන්නේ "${currentQ.correctOpposite}" වේ.`
      });
      speakSinhala(`පිළිතුර වැරදියි. ${currentQ.baseWord} යන්නෙහි විරුද්ධ පදය වන්නේ ${currentQ.correctOpposite} වේ.`);
    }
  };

  const handleNext = () => {
    playSound('click');
    if (!isConfirmed) {
      speakSinhala('කරුණාකර පළමුව තහවුරු කරන්න.');
      return;
    }
    if (currentIndex < GRADE4_L4_ACT3_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    setCurrentIndex(0);
    setIsAllDone(false);
    setIsConfirmed(false);
    setSelectedOptionId(null);
    setFeedback(null);
    setScore(0);
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-rose-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center">
          <div className="text-7xl mb-2">🏆🎉↔️</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ 4 ශ්‍රේණිය Level 4 Activity 3 (විරුද්ධ පද) සාර්ථකව අවසන් කළා!</p>
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
              onClick={handleRestart}
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
              <span>Grade 4 · Level 4 · Act 3</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Level 4 · Activity 3: විරුද්ධ පද තෝරමු
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/95 text-purple-900 px-4 py-2 rounded-2xl font-black text-sm md:text-base shadow-md border-2 border-purple-200 flex items-center gap-1.5">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span>{score}</span>
            </div>
          </div>
        </div>

        {/* Sub-instruction banner */}
        <div className="w-full mt-3 bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
              ↔️ දී ඇති පදයට <span className="text-rose-700 font-extrabold underline">නිවැරදි විරුද්ධ පදය තෝරා</span> තහවුරු කරන්න.
            </p>
          </div>
          <div className="text-2xl pointer-events-none select-none">
            ↔️✨
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-rose-200 flex flex-col gap-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-rose-100 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                {currentQ.num}
              </div>
              <span className="text-xs font-bold text-slate-500">ප්‍රශ්නය {currentQ.num} / 5</span>
            </div>

            <span className="text-3xl">{currentQ.imageEmoji}</span>
          </div>

          {/* Opposites Interactive Display Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 rounded-3xl border-2 border-rose-300 text-center flex flex-col items-center justify-center gap-2">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 flex items-center justify-center flex-wrap gap-3">
              <span className="text-indigo-900 bg-indigo-100 px-5 py-2 rounded-2xl border border-indigo-200 shadow-xs">
                {currentQ.baseWord}
              </span>
              <span className="text-rose-500 font-extrabold text-2xl sm:text-3xl">↔️</span>
              <span className={`relative inline-flex items-center justify-center min-w-[150px] min-h-[52px] px-5 py-2 rounded-2xl border-2 font-black text-2xl text-center transition-all ${
                isConfirmed
                  ? selectedOpt?.isCorrect
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                    : 'bg-rose-500 text-white border-rose-600 shadow-md'
                  : selectedOpt
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : 'bg-white border-dashed border-rose-400 text-rose-400'
              }`}>
                {isConfirmed 
                  ? (selectedOpt?.isCorrect ? selectedOpt.text : currentQ.correctOpposite) 
                  : (selectedOpt ? selectedOpt.text : <span className="w-24 sm:w-28 h-1 bg-rose-400 rounded-full inline-block absolute bottom-3" />)}
              </span>
            </div>
          </div>

          {/* 4 Choices Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-1">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrect = opt.isCorrect;

              let btnStyle = 'bg-white hover:bg-rose-50 text-slate-800 border-slate-200';
              if (isConfirmed) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300';
                } else {
                  btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-300';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  disabled={isConfirmed}
                  className={`py-4 px-3 rounded-2xl font-black text-lg sm:text-xl shadow-md border-2 transition-all flex flex-col items-center justify-center ${
                    isConfirmed ? 'cursor-default' : 'cursor-pointer active:scale-95'
                  } ${btnStyle}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-white bg-white/30' : 'border-slate-300'
                    }`}>
                      {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white"></span>}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Confirmation Button & Feedback Area */}
          <div className="flex flex-col gap-2 mt-1">
            {!isConfirmed && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedOptionId}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-base shadow-md transition-all flex items-center justify-center gap-2 ${
                  selectedOptionId
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white cursor-pointer active:scale-95 shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60 border border-slate-300'
                }`}
              >
                <span>
                  {!selectedOptionId
                    ? '✓ විරුද්ධ පදයක් තෝරන්න (Select Antonym)'
                    : '✓ තහවුරු කරන්න (Confirm)'}
                </span>
              </button>
            )}

            {isConfirmed && feedback && (
              <div
                className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 text-sm md:text-base font-black animate-fade-in ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                    : 'bg-rose-50 border-rose-400 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{feedback.isCorrect ? '🎉' : '❌'}</span>
                  <span>{feedback.text}</span>
                </div>
              </div>
            )}

            {/* Grammar explanation tip */}
            {isConfirmed && (
              <div className="p-3.5 bg-rose-50 rounded-2xl border-2 border-rose-200 text-xs sm:text-sm font-black text-rose-950 animate-fade-in flex items-center justify-between">
                <span>{currentQ.explanation}</span>
                <span className="text-xl">💡</span>
              </div>
            )}
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
            {GRADE4_L4_ACT3_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-rose-600 ring-2 ring-rose-300 scale-125'
                    : i < currentIndex
                    ? 'bg-emerald-500'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!isConfirmed}
            className={`py-2.5 px-6 font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-2 transition-all ${
              isConfirmed
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer active:scale-95'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{currentIndex === GRADE4_L4_ACT3_QUESTIONS.length - 1 ? 'අවසන් කරන්න' : 'ඊළඟ ප්‍රශ්නය'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
