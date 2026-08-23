import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Questions for Grade 4 Level 1 Activity 3 (ඒකවචන හා බහු වචන / Singular & Plural Nouns) ──
const GRADE4_L1_ACT3_QUESTIONS = [
  {
    id: 1,
    num: 1,
    word: 'අලි',
    form: 'බහු වචන',
    singularEquivalent: 'අලියා (ඒකවචන) ➔ අලි (බහු වචන)',
    imageEmoji: '🐘🐘',
    meaning: 'Elephants (Plural Noun)',
    audioPrompt: 'අලි යන වචනය කියවා එය ඒකවචන ද බහු වචන ද යන්න තෝරන්න.',
    options: [
      { id: 'opt_1_1', text: 'ඒකවචන', isCorrect: false, color: 'bg-emerald-500 hover:bg-emerald-600' },
      { id: 'opt_1_2', text: 'බහු වචන', isCorrect: true, color: 'bg-blue-600 hover:bg-blue-700' },
    ]
  },
  {
    id: 2,
    num: 2,
    word: 'බල්ලා',
    form: 'ඒකවචන',
    singularEquivalent: 'බල්ලා (ඒකවචන) ➔ බල්ලෝ (බහු වචන)',
    imageEmoji: '🐶',
    meaning: 'Dog (Singular Noun)',
    audioPrompt: 'බල්ලා යන වචනය කියවා එය ඒකවචන ද බහු වචන ද යන්න තෝරන්න.',
    options: [
      { id: 'opt_2_1', text: 'ඒකවචන', isCorrect: true, color: 'bg-emerald-500 hover:bg-emerald-600' },
      { id: 'opt_2_2', text: 'බහු වචන', isCorrect: false, color: 'bg-blue-600 hover:bg-blue-700' },
    ]
  },
  {
    id: 3,
    num: 3,
    word: 'කුරුල්ලෝ',
    form: 'බහු වචන',
    singularEquivalent: 'කුරුල්ලා (ඒකවචන) ➔ කුරුල්ලෝ (බහු වචන)',
    imageEmoji: '🐦🐦',
    meaning: 'Birds (Plural Noun)',
    audioPrompt: 'කුරුල්ලෝ යන වචනය කියවා එය ඒකවචන ද බහු වචන ද යන්න තෝරන්න.',
    options: [
      { id: 'opt_3_1', text: 'ඒකවචන', isCorrect: false, color: 'bg-emerald-500 hover:bg-emerald-600' },
      { id: 'opt_3_2', text: 'බහු වචන', isCorrect: true, color: 'bg-blue-600 hover:bg-blue-700' },
    ]
  },
  {
    id: 4,
    num: 4,
    word: 'සිසුන්',
    form: 'බහු වචන',
    singularEquivalent: 'සිසුවා (ඒකවචන) ➔ සිසුන් (බහු වචන)',
    imageEmoji: '👧👦📚',
    meaning: 'Students (Plural Noun)',
    audioPrompt: 'සිසුන් යන වචනය කියවා එය ඒකවචන ද බහු වචන ද යන්න තෝරන්න.',
    options: [
      { id: 'opt_4_1', text: 'ඒකවචන', isCorrect: false, color: 'bg-emerald-500 hover:bg-emerald-600' },
      { id: 'opt_4_2', text: 'බහු වචන', isCorrect: true, color: 'bg-blue-600 hover:bg-blue-700' },
    ]
  },
  {
    id: 5,
    num: 5,
    word: 'මල්',
    form: 'බහු වචන',
    singularEquivalent: 'මල (ඒකවචන) ➔ මල් (බහු වචන)',
    imageEmoji: '🌸🌼🌺',
    meaning: 'Flowers (Plural Noun)',
    audioPrompt: 'මල් යන වචනය කියවා එය ඒකවචන ද බහු වචන ද යන්න තෝරන්න.',
    options: [
      { id: 'opt_5_1', text: 'ඒකවචන', isCorrect: false, color: 'bg-emerald-500 hover:bg-emerald-600' },
      { id: 'opt_5_2', text: 'බහු වචන', isCorrect: true, color: 'bg-blue-600 hover:bg-blue-700' },
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

// ── Main Grade 4 Level 1 Activity 3 Component ──
export default function SinhalaGrade4Level1Act3({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isAllDone, setIsAllDone] = useState(false);

  const currentQ = GRADE4_L1_ACT3_QUESTIONS[currentIndex];

  useEffect(() => {
    setSelectedOptionId(null);
    setIsConfirmed(false);
    setFeedback(null);
    const timer = setTimeout(() => {
      speakSinhala(currentQ.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex]);

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
      speakSinhala('කරුණාකර පළමුව පිළිතුරක් තෝරන්න.');
      return;
    }

    const selectedOpt = currentQ.options.find((o) => o.id === selectedOptionId);
    const isCorrect = selectedOpt?.isCorrect ?? false;

    setIsConfirmed(true);

    if (isCorrect) {
      playSound('correct');
      setScore((prev) => prev + 20);
      setFeedback({
        isCorrect: true,
        text: `විශිෂ්ටයි! ඔබ තෝරාගත් පිළිතුර නිවැරදියි. "${currentQ.word}" යනු ${selectedOpt.text} පදයකි.`
      });
      speakSinhala(`විශිෂ්ටයි! ඔබ තෝරාගත් පිළිතුර නිවැරදියි. ${currentQ.word} යනු ${selectedOpt.text} පදයකි.`);
    } else {
      playSound('wrong');
      const correctOpt = currentQ.options.find((o) => o.isCorrect);
      setFeedback({
        isCorrect: false,
        text: `පිළිතුර වැරදියි! "${currentQ.word}" යනු ${correctOpt?.text} පදයකි.`
      });
      speakSinhala(`පිළිතුර වැරදියි. ${currentQ.word} යනු ${correctOpt?.text} පදයකි.`);
    }
  };

  const handleNext = () => {
    playSound('click');
    if (!isConfirmed) {
      speakSinhala('කරුණාකර පළමුව තහවුරු කරන්න.');
      return;
    }
    if (currentIndex < GRADE4_L1_ACT3_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-purple-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">
            {score >= 80 ? 'විශිෂ්ටයි!' : score >= 40 ? 'හොඳ උත්සාහයක්!' : 'නැවත උත්සාහ කරමු!'}
          </h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ 4 ශ්‍රේණිය Level 1 Activity 3 (ඒකවචන / බහු වචන) සාර්ථකව අවසන් කළා!</p>
          <div className="text-4xl font-black text-purple-600 mb-8">ලකුණු: {score} / 100 ⭐</div>

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
              <span>Grade 4 · Level 1 · Act 3</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 3: නාම පද වර්ග කරමු (ඒකවචන / බහු වචන)
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
        <div className="w-full mt-3 bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-emerald-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
              🏷️ වචනය කියවා <span className="text-emerald-700 font-extrabold underline">ඒකවචන ද බහු වචන ද</span> යන්න තෝරා තහවුරු කරන්න.
            </p>
          </div>
          <div className="text-2xl pointer-events-none select-none">
            🐘
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-emerald-200 flex flex-col gap-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                {currentQ.num}
              </div>
              <span className="text-xs font-bold text-slate-500">ප්‍රශ්නය {currentQ.num} / 5</span>
            </div>
          </div>

          {/* Target Word Hero Display & Image */}
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-1">
            
            {/* Visual Card */}
            <div className="w-48 h-48 rounded-3xl bg-gradient-to-tr from-sky-100 via-emerald-100 to-teal-100 border-4 border-emerald-300 shadow-xl flex flex-col items-center justify-center p-4">
              <div className="text-7xl drop-shadow-md animate-bounce-short">
                {currentQ.imageEmoji}
              </div>
              <span className="text-xs font-black text-emerald-900 mt-2 bg-white/90 px-3 py-0.5 rounded-full shadow-xs">
                {currentQ.meaning}
              </span>
            </div>

            {/* Target Word & Category Selector */}
            <div className="flex flex-col gap-4 w-full sm:w-[48%] items-center sm:items-start">
              
              <div className="text-center sm:text-left">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">
                  දී ඇති නාම පදය (Given Noun):
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-wide drop-shadow-sm">
                  "{currentQ.word}"
                </h2>
              </div>

              <div className="w-full flex flex-col gap-2.5">
                <span className="text-xs font-black text-slate-600 uppercase">
                  නිවැරදි කාණ්ඩය තෝරන්න (Select Category):
                </span>

                <div className="grid grid-cols-2 gap-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    const isCorrect = opt.isCorrect;

                    let cardStyle = '';
                    let statusBadge = null;

                    if (!isConfirmed) {
                      // BEFORE CONFIRMATION: Only highlight selection without revealing answer
                      if (isSelected) {
                        cardStyle = 'bg-sky-100 text-sky-950 border-sky-500 ring-4 ring-sky-300 shadow-lg scale-102';
                        statusBadge = <span className="text-xs font-bold text-sky-700">✓ තෝරාගෙන ඇත</span>;
                      } else {
                        cardStyle = opt.text === 'ඒකවචන'
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300 active:scale-95'
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-300 active:scale-95';
                      }
                    } else {
                      // AFTER CONFIRMATION: Reveal answers & lock
                      if (isSelected) {
                        if (isCorrect) {
                          cardStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300 scale-102';
                          statusBadge = <span className="text-xs font-black">✓ නිවැරදියි</span>;
                        } else {
                          cardStyle = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300 animate-shake';
                          statusBadge = <span className="text-xs font-black">✗ වැරදියි</span>;
                        }
                      } else if (isCorrect) {
                        cardStyle = 'bg-emerald-100 text-emerald-900 border-emerald-500 ring-2 ring-emerald-300 font-black';
                        statusBadge = <span className="text-xs font-bold text-emerald-700">✓ නිවැරදි පිළිතුර</span>;
                      } else {
                        cardStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        disabled={isConfirmed}
                        className={`py-4 px-4 rounded-2xl font-black text-lg shadow-md border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                          isConfirmed ? 'cursor-default' : 'cursor-pointer'
                        } ${cardStyle}`}
                      >
                        <span className="text-xs font-bold opacity-80">
                          {opt.text === 'ඒකවචන' ? '🟩 Singular' : '🟦 Plural'}
                        </span>
                        <span className="text-base sm:text-lg">{opt.text}</span>
                        {statusBadge}
                      </button>
                    );
                  })}
                </div>

                {/* Confirm Button */}
                {!isConfirmed && (
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!selectedOptionId}
                    className={`mt-2 w-full py-3 px-4 rounded-2xl font-extrabold text-base shadow-md transition-all flex items-center justify-center gap-2 ${
                      selectedOptionId
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white cursor-pointer active:scale-95 shadow-lg animate-pulse'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60 border border-slate-300'
                    }`}
                  >
                    <span>✓</span>
                    <span>තහවුරු කරන්න (Confirm)</span>
                  </button>
                )}

              </div>

            </div>

          </div>

          {/* Feedback & Grammatical Insight Hint */}
          {isConfirmed && feedback && (
            <div className="flex flex-col gap-2 animate-fade-in">
              <div
                className={`p-3 rounded-2xl border-2 text-sm font-bold flex items-center gap-2 ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border-rose-300'
                }`}
              >
                <span className="text-lg">{feedback.isCorrect ? '✅' : '❌'}</span>
                <span>{feedback.text}</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-xs sm:text-sm font-black text-emerald-950 flex items-center justify-between">
                <span>💡 {currentQ.singularEquivalent}</span>
                <span className="text-xl">✨</span>
              </div>
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
            {GRADE4_L1_ACT3_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-emerald-600 ring-2 ring-emerald-300 scale-125'
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
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer active:scale-95 animate-bounce-short ring-4 ring-emerald-200'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{currentIndex === GRADE4_L1_ACT3_QUESTIONS.length - 1 ? 'අවසන් කරන්න' : 'ඊළඟ ප්‍රශ්නය'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
