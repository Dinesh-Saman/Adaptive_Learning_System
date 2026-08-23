import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Questions for Grade 4 Level 3 Activity 3 (අදාළ කාලය හඳුනාගෙන ලිඛිත භාෂාවට ලියමු) ──
const GRADE4_L3_ACT3_QUESTIONS = [
  {
    id: 1,
    num: 1,
    spokenSentence: 'මම සෑම දවසකම ගස්වලට වතුර දානවා',
    correctTense: 'present',
    correctTenseName: 'වර්තමාන කාලය',
    writtenSentence: 'මම සෑම දවසකම ගස්වලට වතුර දමමි.',
    imageEmoji: '🌱💧👦',
    meaning: 'I water the plants every day (Present Tense)',
    explanation: '💡 සෑම දිනකම සිදුකරන ක්‍රියාවක් බැවින් මෙය වර්තමාන කාලයයි. ලිඛිත භාෂාවෙන් "මම ... දමමි" ලෙස ලියනු ලැබේ.',
    audioPrompt: 'මම සෑම දවසකම ගස්වලට වතුර දානවා. අදාළ කාලය තෝරන්න.',
    options: [
      { id: 'opt_1_1', text: 'වර්තමාන කාලය', isCorrect: true, emoji: '☀️' },
      { id: 'opt_1_2', text: 'අතීත කාලය', isCorrect: false, emoji: '⏳' },
    ]
  },
  {
    id: 2,
    num: 2,
    spokenSentence: 'මම සහෝදරියත් එක්ක දුවනවා',
    correctTense: 'present',
    correctTenseName: 'වර්තමාන කාලය',
    writtenSentence: 'මම සහෝදරිය සමඟ දුවමි.',
    imageEmoji: '🏃‍♂️👧✨',
    meaning: 'I run with my sister (Present Tense)',
    explanation: '💡 දැන් සිදුවන ක්‍රියාවක් බැවින් වර්තමාන කාලයයි. "එක්ක" යන්න ලිඛිත භාෂාවේදී "සමඟ" වේ. "මම ... දුවමි" වේ.',
    audioPrompt: 'මම සහෝදරියත් එක්ක දුවනවා. අදාළ කාලය තෝරන්න.',
    options: [
      { id: 'opt_2_1', text: 'වර්තමාන කාලය', isCorrect: true, emoji: '☀️' },
      { id: 'opt_2_2', text: 'අතීත කාලය', isCorrect: false, emoji: '⏳' },
    ]
  },
  {
    id: 3,
    num: 3,
    spokenSentence: 'මම තරගයෙන් ජය ගත්තා',
    correctTense: 'past',
    correctTenseName: 'අතීත කාලය',
    writtenSentence: 'මම තරගයෙන් ජය ගත්තෙමි.',
    imageEmoji: '🏆🥇✨',
    meaning: 'I won the competition (Past Tense)',
    explanation: '💡 සිදුවී අවසන් වූ ක්‍රියාවක් බැවින් අතීත කාලයයි. ලිඛිත භාෂාවෙන් "මම ... ජය ගත්තෙමි" වේ.',
    audioPrompt: 'මම තරගයෙන් ජය ගත්තා. අදාළ කාලය තෝරන්න.',
    options: [
      { id: 'opt_3_1', text: 'වර්තමාන කාලය', isCorrect: false, emoji: '☀️' },
      { id: 'opt_3_2', text: 'අතීත කාලය', isCorrect: true, emoji: '⏳' },
    ]
  },
  {
    id: 4,
    num: 4,
    spokenSentence: 'ඇය මල් නෙලනවා',
    correctTense: 'present',
    correctTenseName: 'වර්තමාන කාලය',
    writtenSentence: 'ඇය මල් නෙළයි.',
    imageEmoji: '🌸🌺👧',
    meaning: 'She is plucking flowers (Present Tense)',
    explanation: '💡 වර්තමානයේ සිදුවන ක්‍රියාවකි. ලිඛිත භාෂාවෙන් "නෙලනවා" යන්න "නෙළයි" ලෙස ලියවේ.',
    audioPrompt: 'ඇය මල් නෙලනවා. අදාළ කාලය තෝරන්න.',
    options: [
      { id: 'opt_4_1', text: 'වර්තමාන කාලය', isCorrect: true, emoji: '☀️' },
      { id: 'opt_4_2', text: 'අතීත කාලය', isCorrect: false, emoji: '⏳' },
    ]
  },
  {
    id: 5,
    num: 5,
    spokenSentence: 'ඔහු ඔරු පැද්දා',
    correctTense: 'past',
    correctTenseName: 'අතීත කාලය',
    writtenSentence: 'ඔහු ඔරු පැද්දේය.',
    imageEmoji: '🚣‍♂️🌊✨',
    meaning: 'He rowed the boat (Past Tense)',
    explanation: '💡 පෙර සිදුවූ ක්‍රියාවක් බැවින් අතීත කාලයයි. ලිඛිත භාෂාවෙන් "ඔහු ... පැද්දේය" වේ.',
    audioPrompt: 'ඔහු ඔරු පැද්දා. අදාළ කාලය තෝරන්න.',
    options: [
      { id: 'opt_5_1', text: 'වර්තමාන කාලය', isCorrect: false, emoji: '☀️' },
      { id: 'opt_5_2', text: 'අතීත කාලය', isCorrect: true, emoji: '⏳' },
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

// ── Main Grade 4 Level 3 Activity 3 Component ──
export default function SinhalaGrade4Level3Act3({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isAllDone, setIsAllDone] = useState(false);

  const currentQ = GRADE4_L3_ACT3_QUESTIONS[currentIndex];

  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    const timer = setTimeout(() => {
      speakSinhala(currentQ.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    playSound('click');
    setSelectedOptionId(opt.id);
    speakSinhala(opt.text);

    if (opt.isCorrect) {
      playSound('correct');
      setIsAnswered(true);
      setScore((prev) => prev + 20);
      speakSinhala(`විශිෂ්ටයි! මෙය ${opt.text}යි.`);
    } else {
      playSound('wrong');
      speakSinhala('නැවත උත්සාහ කරන්න.');
    }
  };

  const handleNext = () => {
    playSound('click');
    if (currentIndex < GRADE4_L3_ACT3_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-purple-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-7xl mb-2 animate-bounce">🏆🎉📝</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ 4 ශ්‍රේණිය Level 3 Activity 3 (කාලය හා ලිඛිත භාෂාව) සාර්ථකව අවසන් කළා!</p>
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
              <span>Grade 4 · Level 3 · Act 3</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-indigo-700 via-purple-700 to-teal-700 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 3: අදාළ කාලය හඳුනාගෙන ලිඛිත භාෂාවට ලියමු
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
        <div className="w-full mt-3 bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-indigo-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
              ⏳ <span className="text-indigo-800 font-extrabold underline">අදාළ කාලය හඳුනාගන්න</span> (වර්තමාන කාලය හෝ අතීත කාලය තෝරන්න).
            </p>
          </div>
          <div className="text-2xl pointer-events-none select-none">
            ☀️⏳
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-indigo-200 flex flex-col gap-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                {currentQ.num}
              </div>
              <span className="text-xs font-bold text-slate-500">ප්‍රශ්නය {currentQ.num} / 5</span>
            </div>

            <span className="text-3xl">{currentQ.imageEmoji}</span>
          </div>

          {/* Given Spoken Sentence Display */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-sky-50 rounded-3xl border-2 border-indigo-200 text-center flex flex-col items-center justify-center gap-1.5">
            <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">
              🗣️ දී ඇති කථන වාක්‍යය (Given Spoken Sentence):
            </span>
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
              "{currentQ.spokenSentence}"
            </div>
          </div>

          {/* Step 1: Tense Selector Buttons */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black text-slate-600 uppercase">
              Step 1: නිවැරදි කාලය තෝරන්න (Choose the correct tense):
            </span>

            <div className="grid grid-cols-2 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrect = opt.isCorrect;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    className={`py-4 px-4 rounded-2xl font-black text-base sm:text-lg shadow-md border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 scale-102'
                          : 'bg-rose-500 text-white border-rose-600'
                        : isAnswered && isCorrect
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-200'
                        : 'bg-white hover:bg-indigo-50 text-slate-800 border-slate-200 active:scale-95'
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span>{opt.text}</span>
                    {isSelected && isCorrect && (
                      <span className="text-xs font-bold text-white ml-1">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Grammar transformation hint & Formal Written Sentence */}
          {isAnswered && (
            <div className="flex flex-col gap-3 animate-fade-in">
              <div className="p-3 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-xs sm:text-sm font-black text-emerald-950 flex items-center justify-between">
                <span>{currentQ.explanation}</span>
                <span className="text-xl">💡</span>
              </div>

              <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-200 text-center flex flex-col items-center justify-center gap-1.5">
                <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">
                  ✍️ නිවැරදි ලිඛිත වාක්‍යය (Formal Written Sinhala):
                </span>
                <div className="text-xl sm:text-2xl font-black text-indigo-950">
                  "{currentQ.writtenSentence}"
                </div>
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
            {GRADE4_L3_ACT3_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-indigo-600 ring-2 ring-indigo-300 scale-125'
                    : i < currentIndex
                    ? 'bg-emerald-500'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`py-2.5 px-6 font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-2 transition-all ${
              isAnswered
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer active:scale-95 animate-bounce-short'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{currentIndex === GRADE4_L3_ACT3_QUESTIONS.length - 1 ? 'අවසන් කරන්න' : 'ඊළඟ ප්‍රශ්නය'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
