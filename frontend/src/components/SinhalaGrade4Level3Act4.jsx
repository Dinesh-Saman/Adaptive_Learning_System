import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Sinhala Proverbs for Grade 4 Level 3 Activity 4 (ගැළපෙන ප්‍රස්ථා පිරුළ තෝරන්න) ──
const GRADE4_L3_ACT4_PROVERBS = [
  {
    id: 1,
    num: 1,
    situation: 'කෙනෙකුට කරදරයකින් බේරුණු පසු තවත් විශාල කරදරයකට මුහුණ දීමට සිදු විය.',
    correctProverb: 'කබලෙන් ලිපට වැටුණා වගේ',
    imageEmoji: '🔥🍳😱',
    meaning: 'Out of the frying pan into the fire (කබලෙන් ලිපට වැටුණා වගේ)',
    explanation: '💡 කුඩා කරදරයකින් බේරී ඊටත් වඩා විශාල කරදරයකට මුහුණ දීමට සිදුවීම මේ පිරුළෙන් කියවේ.',
    audioPrompt: 'කෙනෙකුට කරදරයකින් බේරුණු පසු තවත් විශාල කරදරයකට මුහුණ දීමට සිදු විය. ගැළපෙන ප්‍රස්ථා පිරුළ තෝරන්න.',
    options: [
      { id: 'opt_1_1', text: 'කබලෙන් ලිපට වැටුණා වගේ', isCorrect: true, emoji: '🔥' },
      { id: 'opt_1_2', text: 'පරංගියා කෝට්ටේ ගියා වගේ', isCorrect: false, emoji: '🚶‍♂️' },
      { id: 'opt_1_3', text: 'අඹී නැන්දාගේ කැඳ හැලිය වගේ', isCorrect: false, emoji: '🍲' },
    ]
  },
  {
    id: 2,
    num: 2,
    situation: 'අනුන් රැවටීමට ගොස් තමාම රැවටීම.',
    correctProverb: 'ආඬි හත්දෙනාගේ කැඳ හැළිය වගේ',
    imageEmoji: '🍲👥🎭',
    meaning: 'The 7 beggars\' porridge pot (ආඬි හත්දෙනාගේ කැඳ හැළිය වගේ)',
    explanation: '💡 අනුන් මුලා කිරීමට හෝ කපටි වීමට ගොස් තමාම අපහසුවට හා රැවටීමට පත්වීම.',
    audioPrompt: 'අනුන් රැවටීමට ගොස් තමාම රැවටීම. ගැළපෙන ප්‍රස්ථා පිරුළ තෝරන්න.',
    options: [
      { id: 'opt_2_1', text: 'අටුව කඩා පුටුව හැදුවා වගේ', isCorrect: false, emoji: '🪑' },
      { id: 'opt_2_2', text: 'අන්දරේ සීනි කෑවා වගේ', isCorrect: false, emoji: '🍬' },
      { id: 'opt_2_3', text: 'ආඬි හත්දෙනාගේ කැඳ හැළිය වගේ', isCorrect: true, emoji: '🍲' },
    ]
  },
  {
    id: 3,
    num: 3,
    situation: 'සැලසුමක් නැති වැඩ කටයුතු සම්බන්ධයෙන් මේ කියමන යෙදේ.',
    correctProverb: 'කළුවා මාරපන ගියා වගේ',
    imageEmoji: '🚶‍♂️❓🗺️',
    meaning: 'Going aimlessly without a plan (කළුවා මාරපන ගියා වගේ)',
    explanation: '💡 කිසිම නිශ්චිත අරමුණක් හෝ සැලසුමක් නොමැතිව වැඩකටයුතු කිරීම.',
    audioPrompt: 'සැලසුමක් නැති වැඩ කටයුතු සම්බන්ධයෙන් මේ කියමන යෙදේ. ගැළපෙන ප්‍රස්ථා පිරුළ තෝරන්න.',
    options: [
      { id: 'opt_3_1', text: 'වක්කඩේ හකුරු හැංගුවා වගේ', isCorrect: false, emoji: '🍯' },
      { id: 'opt_3_2', text: 'කළුවා මාරපන ගියා වගේ', isCorrect: true, emoji: '🚶‍♂️' },
      { id: 'opt_3_3', text: 'මඩේ හිටවපු ඉන්න වගේ', isCorrect: false, emoji: '🪵' },
    ]
  },
  {
    id: 4,
    num: 4,
    situation: 'මෝඩ කෙනෙකුට වටිනා දෙයක් දුන් විට උඩඟු වීම.',
    correctProverb: 'කටුස්සාගේ කරේ රත්තරන් බැන්දා වගේ',
    imageEmoji: '🦎👑✨',
    meaning: 'A fool becoming haughty with a treasure (කටුස්සාගේ කරේ රත්තරන් බැන්දා වගේ)',
    explanation: '💡 කිසිම වටිනාකමක් නොදන්නා අනුවණයෙකුට වටිනා දෙයක් ලැබුණු විට අධික උඩඟුකමකට පත්වීම.',
    audioPrompt: 'මෝඩ කෙනෙකුට වටිනා දෙයක් දුන් විට උඩඟු වීම. ගැළපෙන ප්‍රස්ථා පිරුළ තෝරන්න.',
    options: [
      { id: 'opt_4_1', text: 'ඉඟුරු දී මිරිස් ගත්තා වගේ', isCorrect: false, emoji: '🌶️' },
      { id: 'opt_4_2', text: 'ඉබ්බාගෙන් පිහාටු ඉල්ලනවා වගේ', isCorrect: false, emoji: '🐢' },
      { id: 'opt_4_3', text: 'කටුස්සාගේ කරේ රත්තරන් බැන්දා වගේ', isCorrect: true, emoji: '🦎' },
    ]
  },
  {
    id: 5,
    num: 5,
    situation: 'අයහපත ඉවත් කිරීමට යාමෙන් ඊට වඩා වැඩි නරකක් සිදුවීම.',
    correctProverb: 'ඉඟුරු දී මිරිස් ගත්තා වගේ',
    imageEmoji: '🌶️🫚🤦‍♂️',
    meaning: 'Giving ginger and getting chili (ඉඟුරු දී මිරිස් ගත්තා වගේ)',
    explanation: '💡 නොගැළපෙන අයහපත් දෙයක් වෙනස් කිරීමට ගොස් ඊටත් වඩා කරදරකාරී දෙයකට මුහුණ දීමට සිදුවීම.',
    audioPrompt: 'අයහපත ඉවත් කිරීමට යාමෙන් ඊට වඩා වැඩි නරකක් සිදුවීම. ගැළපෙන ප්‍රස්ථා පිරුළ තෝරන්න.',
    options: [
      { id: 'opt_5_1', text: 'ඉඟුරු දී මිරිස් ගත්තා වගේ', isCorrect: true, emoji: '🌶️' },
      { id: 'opt_5_2', text: 'පරංගියා කෝට්ටේ ගියා වගේ', isCorrect: false, emoji: '🚶‍♂️' },
      { id: 'opt_5_3', text: 'කැකිල්ලේ රජ්ජුරුවන්ගේ නඩු තීන්දුව වගේ', isCorrect: false, emoji: '👑' },
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

// ── Main Grade 4 Level 3 Activity 4 Component ──
export default function SinhalaGrade4Level3Act4({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isAllDone, setIsAllDone] = useState(false);

  const currentQ = GRADE4_L3_ACT4_PROVERBS[currentIndex];
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
      speakSinhala('කරුණාකර පළමුව ප්‍රස්ථා පිරුළක් තෝරන්න.');
      return;
    }

    setIsConfirmed(true);

    if (selectedOpt?.isCorrect) {
      playSound('correct');
      setScore((prev) => prev + 20);
      setFeedback({
        isCorrect: true,
        text: `විශිෂ්ටයි! නිවැරදි ප්‍රස්ථා පිරුළ "${selectedOpt.text}" වේ. ${currentQ.explanation}`
      });
      speakSinhala(`විශිෂ්ටයි! නිවැරදි ප්‍රස්ථා පිරුළ වන්නේ ${selectedOpt.text} වේ.`);
    } else {
      playSound('wrong');
      setFeedback({
        isCorrect: false,
        text: `පිළිතුර වැරදියි! නිවැරදි ප්‍රස්ථා පිරුළ වන්නේ "${currentQ.correctProverb}" වේ. ${currentQ.explanation}`
      });
      speakSinhala(`පිළිතුර වැරදියි. නිවැරදි ප්‍රස්ථා පිරුළ වන්නේ ${currentQ.correctProverb} වේ.`);
    }
  };

  const handleNext = () => {
    playSound('click');
    if (!isConfirmed) {
      speakSinhala('කරුණාකර පළමුව තහවුරු කරන්න.');
      return;
    }
    if (currentIndex < GRADE4_L3_ACT4_PROVERBS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-amber-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center">
          <div className="text-7xl mb-2 animate-bounce">🏆🎉📜</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ 4 ශ්‍රේණිය Level 3 Activity 4 (ප්‍රස්ථා පිරුළු) සාර්ථකව අවසන් කළා!</p>
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
                setIsConfirmed(false);
                setFeedback(null);
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
              <span>Grade 4 · Level 3 · Act 4</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Level 3 · Activity 4: ප්‍රස්ථා පිරුළු තෝරමු
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
        <div className="w-full mt-3 bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-amber-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
              📜 අවස්ථාව කියවා ගැළපෙන <span className="text-amber-800 font-extrabold underline">ප්‍රස්ථා පිරුළ තෝරා</span> තහවුරු කරන්න.
            </p>
          </div>
          <div className="text-2xl pointer-events-none select-none">
            📜✨
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-amber-200 flex flex-col gap-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                {currentQ.num}
              </div>
              <span className="text-xs font-bold text-slate-500">ප්‍රශ්නය {currentQ.num} / 5</span>
            </div>

            <span className="text-3xl">{currentQ.imageEmoji}</span>
          </div>

          {/* Meaning / Situation Hero Card */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100 rounded-3xl border-3 border-amber-300 shadow-md text-center flex flex-col items-center justify-center gap-2">
            <span className="text-xs font-black text-amber-800 uppercase tracking-widest bg-amber-200/80 px-4 py-1 rounded-full shadow-xs">
              🌟 අර්ථය / සිදුවීම (Situation / Context):
            </span>

            <div className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-relaxed my-1">
              "{currentQ.situation}"
            </div>
          </div>

          {/* 3 Proverb Choice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-1">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrect = opt.isCorrect;

              let btnStyle = '';
              if (!isConfirmed) {
                if (isSelected) {
                  btnStyle = 'bg-amber-600 text-white border-amber-700 ring-4 ring-amber-200 scale-102 shadow-lg';
                } else {
                  btnStyle = 'bg-white hover:bg-amber-50 text-slate-800 border-slate-200 active:scale-95 shadow-sm';
                }
              } else {
                if (isSelected) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 scale-102 shadow-md';
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
                  className={`p-4 rounded-2xl font-black text-base sm:text-lg border-2 transition-all flex flex-col items-center justify-center gap-2 text-center min-h-[110px] ${
                    isConfirmed ? 'cursor-default' : 'cursor-pointer'
                  } ${btnStyle}`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="leading-snug">{opt.text}</span>
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
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white cursor-pointer active:scale-95 shadow-lg animate-pulse'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60 border border-slate-300'
                }`}
              >
                <span>✓ තහවුරු කරන්න (Confirm)</span>
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
            {GRADE4_L3_ACT4_PROVERBS.map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-amber-600 ring-2 ring-amber-300 scale-125'
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
            <span>{currentIndex === GRADE4_L3_ACT4_PROVERBS.length - 1 ? 'අවසන් කරන්න' : 'ඊළඟ ප්‍රශ්නය'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
