import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Questions for Grade 4 Level 3 Activity 1 (වාක්‍ය සම්පූර්ණ කිරීම / Sentence Completion) ──
const GRADE4_L3_ACT1_QUESTIONS = [
  {
    id: 1,
    num: 1,
    sentencePrefix: 'ගුරුතුමිය ළමයින්ට රසවත්',
    sentenceSuffix: 'ක් කියා දුන්නාය.',
    correctWord: 'කතාවක්',
    fullCompletedSentence: 'ගුරුතුමිය ළමයින්ට රසවත් කතාවක් කියා දුන්නාය.',
    imageEmoji: '👩‍🏫📖✨',
    explanation: '💡 රසවත් ලෙස ළමයින්ට කියා දෙනු ලබන්නේ කතාවකි.',
    audioPrompt: 'ගුරුතුමිය ළමයින්ට රසවත් හිස්තැනක් කියා දුන්නාය. ගැලපෙන වචනය තෝරන්න.',
    options: [
      { id: 'opt_1_1', text: 'කතාවක්', isCorrect: true },
      { id: 'opt_1_2', text: 'ගසක්', isCorrect: false },
      { id: 'opt_1_3', text: 'බෝට්ටුවක්', isCorrect: false },
      { id: 'opt_1_4', text: 'ගඟක්', isCorrect: false },
    ]
  },
  {
    id: 2,
    num: 2,
    sentencePrefix: 'උදෑසන',
    sentenceSuffix: 'නැඟිටීමෙන් සෞඛ්‍යය වර්‌ධනය වේ.',
    correctWord: 'ඉක්මනින්',
    fullCompletedSentence: 'උදෑසන ඉක්මනින් නැඟිටීමෙන් සෞඛ්‍යය වර්‌ධනය වේ.',
    imageEmoji: '🌅⏰🏃‍♂️',
    explanation: '💡 උදෑසන වේලාසනින් ඉක්මනින් අවදි වීම ශරීර සෞඛ්‍යයට ඉතා ගුණදායකය.',
    audioPrompt: 'උදෑසන හිස්තැන නැඟිටීමෙන් සෞඛ්‍යය වර්‌ධනය වේ. ගැලපෙන වචනය තෝරන්න.',
    options: [
      { id: 'opt_2_1', text: 'ඉක්මනින්', isCorrect: true },
      { id: 'opt_2_2', text: 'මන්දගාමීව', isCorrect: false },
      { id: 'opt_2_3', text: 'විරෝධීව', isCorrect: false },
      { id: 'opt_2_4', text: 'නිද්‍රාශීලීව', isCorrect: false },
    ]
  },
  {
    id: 3,
    num: 3,
    sentencePrefix: 'පොත් කියවීම දැනුම',
    sentenceSuffix: 'කර ගැනීමට හොඳ ක්‍රමයකි.',
    correctWord: 'වර්‌ධනය',
    fullCompletedSentence: 'පොත් කියවීම දැනුම වර්‌ධනය කර ගැනීමට හොඳ ක්‍රමයකි.',
    imageEmoji: '📚💡🧠',
    explanation: '💡 නිතර පොත් කියවීමෙන් අපගේ බුද්ධිය හා දැනුම වර්‌ධනය වේ.',
    audioPrompt: 'පොත් කියවීම දැනුම හිස්තැන කර ගැනීමට හොඳ ක්‍රමයකි. ගැලපෙන වචනය තෝරන්න.',
    options: [
      { id: 'opt_3_1', text: 'වර්‌ධනය', isCorrect: true },
      { id: 'opt_3_2', text: 'විනාශ', isCorrect: false },
      { id: 'opt_3_3', text: 'අඩු', isCorrect: false },
      { id: 'opt_3_4', text: 'නැති', isCorrect: false },
    ]
  },
  {
    id: 4,
    num: 4,
    sentencePrefix: 'ළමයින් සැම විටම',
    sentenceSuffix: 'ට ගරු කළ යුතුය.',
    correctWord: 'ගුරුවරුන්',
    fullCompletedSentence: 'ළමයින් සැම විටම ගුරුවරුන්ට ගරු කළ යුතුය.',
    imageEmoji: '👨‍🏫🙏✨',
    explanation: '💡 අපට ශිල්ප ශාස්ත්‍ර කියාදෙන ගුරුවරුන්ට සැමවිටම ගරු කළ යුතුය.',
    audioPrompt: 'ළමයින් සැම විටම හිස්තැනට ගරු කළ යුතුය. ගැලපෙන වචනය තෝරන්න.',
    options: [
      { id: 'opt_4_1', text: 'ගුරුවරුන්', isCorrect: true },
      { id: 'opt_4_2', text: 'සතුන්', isCorrect: false },
      { id: 'opt_4_3', text: 'වාහන', isCorrect: false },
      { id: 'opt_4_4', text: 'ගස්', isCorrect: false },
    ]
  },
  {
    id: 5,
    num: 5,
    sentencePrefix: 'පරිසරය ආරක්ෂා කර ගැනීම අපගේ',
    sentenceSuffix: 'වේ.',
    correctWord: 'වගකීම',
    fullCompletedSentence: 'පරිසරය ආරක්ෂා කර ගැනීම අපගේ වගකීම වේ.',
    imageEmoji: '🌱🌍💚',
    explanation: '💡 අප අවට පරිසරය පිරිසිදුව හා සුරක්ෂිතව තබා ගැනීම සැමගේ වගකීමකි.',
    audioPrompt: 'පරිසරය ආරක්ෂා කර ගැනීම අපගේ හිස්තැන වේ. ගැලපෙන වචනය තෝරන්න.',
    options: [
      { id: 'opt_5_1', text: 'වගකීම', isCorrect: true },
      { id: 'opt_5_2', text: 'වාසිය', isCorrect: false },
      { id: 'opt_5_3', text: 'වෙහෙස', isCorrect: false },
      { id: 'opt_5_4', text: 'ප්‍රමෝදය', isCorrect: false },
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

// ── Main Grade 4 Level 3 Activity 1 Component ──
export default function SinhalaGrade4Level3Act1({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isAllDone, setIsAllDone] = useState(false);

  const currentQ = GRADE4_L3_ACT1_QUESTIONS[currentIndex];
  const selectedOpt = currentQ.options.find((o) => o.id === selectedOptionId);

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
      speakSinhala('කරුණාකර පළමුව ගැලපෙන වචනයක් තෝරන්න.');
      return;
    }

    setIsConfirmed(true);

    if (selectedOpt?.isCorrect) {
      playSound('correct');
      setScore((prev) => prev + 20);
      setFeedback({
        isCorrect: true,
        text: `විශිෂ්ටයි! නිවැරදි වචනය "${selectedOpt.text}" වේ. ${currentQ.explanation}`
      });
      speakSinhala(`විශිෂ්ටයි! නිවැරදි වචනය ${selectedOpt.text} වේ.`);
    } else {
      playSound('wrong');
      setFeedback({
        isCorrect: false,
        text: `පිළිතුර වැරදියි! නිවැරදි වචනය වන්නේ "${currentQ.correctWord}" වේ. ${currentQ.explanation}`
      });
      speakSinhala(`පිළිතුර වැරදියි. නිවැරදි වචනය වන්නේ ${currentQ.correctWord} වේ.`);
    }
  };

  const handleNext = () => {
    playSound('click');
    if (!isConfirmed) {
      speakSinhala('කරුණාකර පළමුව තහවුරු කරන්න.');
      return;
    }
    if (currentIndex < GRADE4_L3_ACT1_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  const handleResetActivity = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsConfirmed(false);
    setFeedback(null);
    setScore(0);
    setIsAllDone(false);
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-emerald-100 to-teal-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-7xl mb-2 animate-bounce">🏆🎉📝</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">
            {score >= 80 ? 'විශිෂ්ටයි!' : score >= 40 ? 'හොඳ උත්සාහයක්!' : 'නැවත උත්සාහ කරමු!'}
          </h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ 4 ශ්‍රේණිය Level 3 Activity 1 (වාක්‍ය සම්පූර්ණ කිරීම) සාර්ථකව අවසන් කළා!</p>
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
              onClick={handleResetActivity}
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
              <span>Grade 4 · Level 3 · Act 1</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Level 3 · Activity 1: වාක්‍ය සම්පූර්ණ කරමු
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
              ✏️ වාක්‍යය සම්පූර්ණ කිරීමට <span className="text-emerald-700 font-extrabold underline">වඩාත් සුදුසු වචනය තෝරා</span> තහවුරු කරන්න.
            </p>
          </div>
          <div className="text-2xl pointer-events-none select-none">
            📖✨
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: SENTENCE DISPLAY & 4 CHOICES ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-emerald-200 flex flex-col gap-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                {currentQ.num}
              </div>
              <span className="text-xs font-bold text-slate-500">ප්‍රශ්නය {currentQ.num} / 5</span>
            </div>

            <span className="text-3xl">{currentQ.imageEmoji}</span>
          </div>

          {/* Sentence Display Card with Missing Word Slot */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-3xl border-2 border-emerald-300 text-center flex flex-col items-center justify-center gap-2">
            <div className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 flex items-center justify-center flex-wrap gap-2 leading-relaxed">
              <span>{currentQ.sentencePrefix}</span>
              <span className={`inline-flex min-w-[110px] h-11 px-4 rounded-2xl border-2 font-black text-xl transition-colors ${
                !isConfirmed
                  ? selectedOpt
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-500 shadow-sm items-center justify-center pb-0'
                    : 'bg-white border-dashed border-emerald-400 text-emerald-600 items-end justify-center pb-2'
                  : selectedOpt?.isCorrect
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md items-center justify-center pb-0'
                  : 'bg-rose-500 text-white border-rose-600 shadow-md items-center justify-center pb-0'
              }`}>
                {selectedOpt ? selectedOpt.text : <span className="w-16 h-[3px] bg-emerald-500/80 rounded-full inline-block" />}
              </span>
              {currentQ.sentenceSuffix && <span>{currentQ.sentenceSuffix}</span>}
            </div>
          </div>

          {/* 4 Choices Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-1">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrect = opt.isCorrect;

              let btnStyle = '';
              if (!isConfirmed) {
                if (isSelected) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-200 scale-105 shadow-lg';
                } else {
                  btnStyle = 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-200 active:scale-95 shadow-sm';
                }
              } else {
                if (isSelected) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 scale-105 shadow-md';
                  } else {
                    btnStyle = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200 shadow-md';
                  }
                } else if (isCorrect) {
                  btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-500 ring-2 ring-emerald-300 font-black';
                } else {
                  btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  disabled={isConfirmed}
                  className={`py-4 px-3 rounded-2xl font-black text-lg sm:text-xl border-2 transition-all flex flex-col items-center justify-center ${
                    isConfirmed ? 'cursor-default' : 'cursor-pointer'
                  } ${btnStyle}`}
                >
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Confirm Button & Feedback Area */}
          <div className="flex flex-col gap-2 mt-1">
            {!isConfirmed && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedOptionId}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-base shadow-md transition-all flex items-center justify-center gap-2 ${
                  selectedOptionId
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white cursor-pointer active:scale-95 shadow-lg animate-pulse'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60 border border-slate-300'
                }`}
              >
                <span>✓</span>
                <span>තහවුරු කරන්න (Confirm)</span>
              </button>
            )}

            {isConfirmed && feedback && (
              <div className="flex flex-col gap-2 animate-fade-in">
                <div
                  className={`p-3.5 rounded-2xl border-2 text-sm font-bold flex items-center gap-2 ${
                    feedback.isCorrect
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-rose-50 text-rose-900 border-rose-300'
                  }`}
                >
                  <span className="text-xl">{feedback.isCorrect ? '✅' : '❌'}</span>
                  <span>{feedback.text}</span>
                </div>
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
            {GRADE4_L3_ACT1_QUESTIONS.map((_, i) => (
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
            <span>{currentIndex === GRADE4_L3_ACT1_QUESTIONS.length - 1 ? 'අවසන් කරන්න' : 'ඊළඟ ප්‍රශ්නය'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
