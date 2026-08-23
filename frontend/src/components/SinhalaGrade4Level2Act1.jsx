import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Questions for Grade 4 Level 2 Activity 1 (විරාම ලක්ෂණ / Punctuation Marks) ──
const GRADE4_L2_ACT1_QUESTIONS = [
  {
    id: 1,
    num: 1,
    sentencePrefix: 'ඔබ කොහෙද ඉන්නේ',
    sentenceSuffix: '',
    correctMark: '?',
    correctMarkName: 'ප්‍රශ්නාර්ථ ලකුණ (?)',
    fullPunctuatedSentence: 'ඔබ කොහෙද ඉන්නේ?',
    ruleExplanation: '💡 ප්‍රශ්නයක් අසන විට වාක්‍යයේ අගට ප්‍රශ්නාර්ථ ලකුණ (?) යෙදේ.',
    imageEmoji: '❓🚶‍♂️📍',
    audioPrompt: 'ඔබ කොහෙද ඉන්නේ? හිස්තැනට සුදුසු විරාම ලකුණ තෝරන්න.',
    options: [
      { id: 'opt_1_1', mark: '.', name: 'තිත (.)', isCorrect: false },
      { id: 'opt_1_2', mark: '?', name: 'ප්‍රශ්නාර්ථය (?)', isCorrect: true },
      { id: 'opt_1_3', mark: '!', name: 'විස්මයාර්ථය (!)', isCorrect: false },
      { id: 'opt_1_4', mark: ',', name: 'කොමාව (,)', isCorrect: false },
    ]
  },
  {
    id: 2,
    num: 2,
    sentencePrefix: 'අනේ, මට කොච්චර සතුටුද',
    sentenceSuffix: '',
    correctMark: '!',
    correctMarkName: 'විස්මයාදී / හර්ෂාදී ලකුණ (!)',
    fullPunctuatedSentence: 'අනේ, මට කොච්චර සතුටුද!',
    ruleExplanation: '💡 විස්මය, අධික සතුට හෝ හැඟීම් දැක්වීමට විස්මයාර්ථ ලකුණ (!) යෙදේ.',
    imageEmoji: '🎉😃✨',
    audioPrompt: 'අනේ, මට කොච්චර සතුටුද! හිස්තැනට සුදුසු විරාම ලකුණ තෝරන්න.',
    options: [
      { id: 'opt_2_1', mark: '.', name: 'තිත (.)', isCorrect: false },
      { id: 'opt_2_2', mark: '?', name: 'ප්‍රශ්නාර්ථය (?)', isCorrect: false },
      { id: 'opt_2_3', mark: '!', name: 'විස්මයාර්ථය (!)', isCorrect: true },
      { id: 'opt_2_4', mark: ',', name: 'කොමාව (,)', isCorrect: false },
    ]
  },
  {
    id: 3,
    num: 3,
    sentencePrefix: 'මම අද පාසලට ගියෙමි',
    sentenceSuffix: '',
    correctMark: '.',
    correctMarkName: 'තිත (.)',
    fullPunctuatedSentence: 'මම අද පාසලට ගියෙමි.',
    ruleExplanation: '💡 සාමාන්‍ය වාක්‍යයක් අවසානයේ තිත (.) යෙදේ.',
    imageEmoji: '🏫🎒👧',
    audioPrompt: 'මම අද පාසලට ගියෙමි. හිස්තැනට සුදුසු විරාම ලකුණ තෝරන්න.',
    options: [
      { id: 'opt_3_1', mark: '.', name: 'තිත (.)', isCorrect: true },
      { id: 'opt_3_2', mark: '?', name: 'ප්‍රශ්නාර්ථය (?)', isCorrect: false },
      { id: 'opt_3_3', mark: '!', name: 'විස්මයාර්ථය (!)', isCorrect: false },
      { id: 'opt_3_4', mark: ',', name: 'කොමාව (,)', isCorrect: false },
    ]
  },
  {
    id: 4,
    num: 4,
    sentencePrefix: 'රවි',
    sentenceSuffix: 'කමල් සහ සුනිල් යන සිසුන් ත්‍යාග ලැබුවා.',
    correctMark: ',',
    correctMarkName: 'කොමාව (,)',
    fullPunctuatedSentence: 'රවි, කමල් සහ සුනිල් යන සිසුන් ත්‍යාග ලැබුවා.',
    ruleExplanation: '💡 නම් කිහිපයක් එක පෙළට ලියන විට වෙන් කිරීමට කොමාව (,) යෙදේ.',
    imageEmoji: '🏆👦👦👦',
    audioPrompt: 'රවි හිස්තැන කමල් සහ සුනිල් යන සිසුන් ත්‍යාග ලැබුවා. හිස්තැනට සුදුසු විරාම ලකුණ තෝරන්න.',
    options: [
      { id: 'opt_4_1', mark: '.', name: 'තිත (.)', isCorrect: false },
      { id: 'opt_4_2', mark: '?', name: 'ප්‍රශ්නාර්ථය (?)', isCorrect: false },
      { id: 'opt_4_3', mark: '!', name: 'විස්මයාර්ථය (!)', isCorrect: false },
      { id: 'opt_4_4', mark: ',', name: 'කොමාව (,)', isCorrect: true },
    ]
  },
  {
    id: 5,
    num: 5,
    sentencePrefix: 'නිරෝගී වේවා',
    sentenceSuffix: '',
    correctMark: '!',
    correctMarkName: 'විස්මයාදී / ප්‍රාර්ථනා ලකුණ (!)',
    fullPunctuatedSentence: 'නිරෝගී වේවා!',
    ruleExplanation: '💡 සුබපැතුම් හෝ ප්‍රාර්ථනා දැක්වීමට විස්මයාදී ලකුණ (!) යෙදේ.',
    imageEmoji: '🙏💖🌿',
    audioPrompt: 'නිරෝගී වේවා! හිස්තැනට සුදුසු විරාම ලකුණ තෝරන්න.',
    options: [
      { id: 'opt_5_1', mark: '.', name: 'තිත (.)', isCorrect: false },
      { id: 'opt_5_2', mark: '?', name: 'ප්‍රශ්නාර්ථය (?)', isCorrect: false },
      { id: 'opt_5_3', mark: '!', name: 'විස්මයාර්ථය (!)', isCorrect: true },
      { id: 'opt_5_4', mark: ',', name: 'කොමාව (,)', isCorrect: false },
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

// ── Main Grade 4 Level 2 Activity 1 Component ──
export default function SinhalaGrade4Level2Act1({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isAllDone, setIsAllDone] = useState(false);

  const currentQ = GRADE4_L2_ACT1_QUESTIONS[currentIndex];
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
    speakSinhala(opt.name);
  };

  const handleConfirm = () => {
    if (isConfirmed) return;

    if (!selectedOptionId) {
      playSound('wrong');
      speakSinhala('කරුණාකර පළමුව විරාම ලකුණක් තෝරන්න.');
      return;
    }

    setIsConfirmed(true);

    if (selectedOpt?.isCorrect) {
      playSound('correct');
      setScore((prev) => prev + 20);
      setFeedback({
        isCorrect: true,
        text: `විශිෂ්ටයි! නිවැරදි විරාම ලකුණ වන්නේ "${selectedOpt.name}" වේ.`
      });
      speakSinhala(`විශිෂ්ටයි! නිවැරදි විරාම ලකුණ වන්නේ ${selectedOpt.name} වේ.`);
    } else {
      playSound('wrong');
      const correctOpt = currentQ.options.find((o) => o.isCorrect);
      setFeedback({
        isCorrect: false,
        text: `පිළිතුර වැරදියි! නිවැරදි විරාම ලකුණ වන්නේ "${correctOpt?.name}" වේ.`
      });
      speakSinhala(`පිළිතුර වැරදියි. නිවැරදි විරාම ලකුණ වන්නේ ${correctOpt?.name} වේ.`);
    }
  };

  const handleNext = () => {
    playSound('click');
    if (!isConfirmed) {
      speakSinhala('කරුණාකර පළමුව තහවුරු කරන්න.');
      return;
    }
    if (currentIndex < GRADE4_L2_ACT1_QUESTIONS.length - 1) {
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
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-purple-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-7xl mb-2 animate-bounce">🏆🎉📝</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">
            {score >= 80 ? 'විශිෂ්ටයි!' : score >= 40 ? 'හොඳ උත්සාහයක්!' : 'නැවත උත්සාහ කරමු!'}
          </h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ 4 ශ්‍රේණිය Level 2 Activity 1 (විරාම ලක්ෂණ) සාර්ථකව අවසන් කළා!</p>
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
              <span>Grade 4 · Level 2 · Act 1</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Level 2 · Activity 1: විරාම ලක්ෂණ
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/95 text-purple-900 px-4 py-2 rounded-2xl font-black text-sm md:text-base shadow-md border-2 border-purple-200 flex items-center gap-1.5">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span>{score}</span>
            </div>
          </div>
        </div>

        {/* ── Summary Reference Guide Pill Bar ── */}
        <div className="max-w-4xl mx-auto w-full mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { mark: '.', name: 'තිත', desc: 'වාක්‍ය අවසානයේ' },
            { mark: '?', name: 'ප්‍රශ්නාර්ථය', desc: 'ප්‍රශ්නයක් ඇසීමේදී' },
            { mark: '!', name: 'විස්මයාර්ථය', desc: 'සතුට, විස්මය, ප්‍රාර්ථනා' },
            { mark: ',', name: 'කොමාව', desc: 'නම් වෙන් කිරීමේදී' },
          ].map((item) => (
            <div key={item.name} className="bg-white/90 rounded-2xl p-2 border border-purple-200 shadow-xs flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 font-black text-lg flex items-center justify-center flex-shrink-0">
                {item.mark}
              </span>
              <div className="leading-tight">
                <span className="text-xs font-black text-purple-950 block">{item.name}</span>
                <span className="text-[10px] text-slate-500 font-bold block">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-purple-200 flex flex-col gap-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-purple-100 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                {currentQ.num}
              </div>
              <span className="text-xs font-bold text-slate-500">ප්‍රශ්නය {currentQ.num} / 5</span>
            </div>

            <span className="text-3xl">{currentQ.imageEmoji}</span>
          </div>

          {/* Sentence Display with Missing Punctuation Slot (No jumping animation) */}
          <div className="p-5 bg-gradient-to-r from-purple-50 via-indigo-50 to-sky-50 rounded-3xl border-2 border-purple-300 text-center flex flex-col items-center justify-center gap-2">
            <span className="text-xs font-black text-purple-700 uppercase tracking-wider">
              වාක්‍යය කියවා හිස්තැනට සුදුසු විරාම ලකුණ තෝරන්න:
            </span>

            <div className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 flex items-center justify-center flex-wrap gap-2">
              <span>"{currentQ.sentencePrefix}</span>
              
              {/* Slot box - Smooth static state without jumping/bounce */}
              <span className={`inline-flex items-center justify-center min-w-[50px] h-12 px-3 rounded-2xl border-2 font-black text-2xl sm:text-3xl shadow-sm transition-colors ${
                !isConfirmed
                  ? selectedOpt
                    ? 'bg-purple-100 text-purple-900 border-purple-500'
                    : 'bg-white border-dashed border-purple-400 text-purple-600'
                  : selectedOpt?.isCorrect
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                  : 'bg-rose-500 text-white border-rose-600 shadow-md'
              }`}>
                {selectedOpt ? selectedOpt.mark : '＿'}
              </span>

              {currentQ.sentenceSuffix && <span>{currentQ.sentenceSuffix}</span>}
              <span>"</span>
            </div>
          </div>

          {/* 4 Punctuation Choice Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-1">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrect = opt.isCorrect;

              let btnStyle = '';
              if (!isConfirmed) {
                if (isSelected) {
                  btnStyle = 'bg-purple-600 text-white border-purple-700 ring-4 ring-purple-200 scale-105 shadow-lg';
                } else {
                  btnStyle = 'bg-white hover:bg-purple-50 text-slate-800 border-slate-200 active:scale-95 shadow-sm';
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
                  className={`p-3.5 sm:p-4 rounded-2xl font-black text-lg sm:text-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                    isConfirmed ? 'cursor-default' : 'cursor-pointer'
                  } ${btnStyle}`}
                >
                  <span className="text-3xl sm:text-4xl font-black">{opt.mark}</span>
                  <span className="text-xs font-bold">{opt.name}</span>
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
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white cursor-pointer active:scale-95 shadow-lg animate-pulse'
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

                {/* Rule explanation banner */}
                <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs sm:text-sm font-black text-amber-950 flex items-center justify-between shadow-xs">
                  <span>{currentQ.ruleExplanation}</span>
                  <span className="text-xl">💡</span>
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
            {GRADE4_L2_ACT1_QUESTIONS.map((_, i) => (
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

          <button
            onClick={handleNext}
            disabled={!isConfirmed}
            className={`py-2.5 px-6 font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-2 transition-all ${
              isConfirmed
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer active:scale-95 animate-bounce-short ring-4 ring-emerald-200'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{currentIndex === GRADE4_L2_ACT1_QUESTIONS.length - 1 ? 'අවසන් කරන්න' : 'ඊළඟ ප්‍රශ්නය'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
