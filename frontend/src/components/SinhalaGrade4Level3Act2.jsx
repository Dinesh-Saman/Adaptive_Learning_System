import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Comprehension Story & 5 Questions for Grade 4 Level 3 Activity 2 ──
const STORY_PASSAGE = {
  title: 'මලීගේ කෙටි කතාව',
  paragraphs: [
    'ඇයගේ නම මලී.',
    'මලී පාසලේ සිව්වන පන්තියේ ඉගෙන ගනී.',
    'ඇය පොත් කියවීමට, චිත්‍ර ඇඳීමට සහ මවට උදවු කිරීමට කැමතිය.',
    'සති අන්තයේ ඇය ඇයගේ මිතුරියන් සමඟ ගෙවත්තේ ක්‍රීඩා කරයි.',
    'මලී සිහින දකින්නේ ගුරුවරියක් වීමටයි.'
  ],
  fullTextSinhala: 'ඇයගේ නම මලී. මලී පාසලේ සිව්වන පන්තියේ ඉගෙන ගනී. ඇය පොත් කියවීමට, චිත්‍ර ඇඳීමට සහ මවට උදවු කිරීමට කැමතිය. සති අන්තයේ ඇය ඇයගේ මිතුරියන් සමඟ ගෙවත්තේ ක්‍රීඩා කරයි. මලී සිහින දකින්නේ ගුරුවරියක් වීමටයි.'
};

const GRADE4_L3_ACT2_QUESTIONS = [
  {
    id: 1,
    num: 1,
    questionText: '1. ඇයගේ නම කවුද?',
    correctAnswer: 'මලී',
    fullAnswerSentence: 'ඇයගේ නම මලී වේ.',
    voicePrompt: 'ප්‍රශ්නය එක. ඇයගේ නම කවුද?',
    options: [
      { id: 'q1_a', label: 'A', text: 'මලී', isCorrect: true },
      { id: 'q1_b', label: 'B', text: 'දිනේෂ්', isCorrect: false },
      { id: 'q1_c', label: 'C', text: 'සහන්', isCorrect: false },
      { id: 'q1_d', label: 'D', text: 'මාලී', isCorrect: false },
    ]
  },
  {
    id: 2,
    num: 2,
    questionText: '2. ඇය කුමන පන්තියේ ඉගෙන ගනීද?',
    correctAnswer: 'සිව්වන',
    fullAnswerSentence: 'මලී ඉගෙන ගන්නේ සිව්වන පන්තියේ ය.',
    voicePrompt: 'ප්‍රශ්නය දෙක. ඇය කුමන පන්තියේ ඉගෙන ගනීද?',
    options: [
      { id: 'q2_a', label: 'A', text: 'දෙවන', isCorrect: false },
      { id: 'q2_b', label: 'B', text: 'තුන්වන', isCorrect: false },
      { id: 'q2_c', label: 'C', text: 'සිව්වන', isCorrect: true },
      { id: 'q2_d', label: 'D', text: 'පස්වන', isCorrect: false },
    ]
  },
  {
    id: 3,
    num: 3,
    questionText: '3. ඇයගේ කැමැති මොනවාටද?',
    correctAnswer: 'පොත් කියවීම',
    fullAnswerSentence: 'ඇය කැමති පොත් කියවීමටයි.',
    voicePrompt: 'ප්‍රශ්නය තුන. ඇයගේ කැමැත්ත මොනවාටද?',
    options: [
      { id: 'q3_a', label: 'A', text: 'ගායනය', isCorrect: false },
      { id: 'q3_b', label: 'B', text: 'නැටුම්', isCorrect: false },
      { id: 'q3_c', label: 'C', text: 'පොත් කියවීම', isCorrect: true },
      { id: 'q3_d', label: 'D', text: 'ටෙලිවිෂන් බැලීම', isCorrect: false },
    ]
  },
  {
    id: 4,
    num: 4,
    questionText: '4. සති අන්තයේ ඇය මොනවා කරයිද?',
    correctAnswer: 'ගෙවත්තේ ක්‍රීඩා කරයි',
    fullAnswerSentence: 'සති අන්තයේ ඇය ගෙවත්තේ ක්‍රීඩා කරයි.',
    voicePrompt: 'ප්‍රශ්නය හතර. සති අන්තයේ ඇය මොනවා කරයිද?',
    options: [
      { id: 'q4_a', label: 'A', text: 'නාට්‍ය නරඹයි', isCorrect: false },
      { id: 'q4_b', label: 'B', text: 'ගෙවත්තේ ක්‍රීඩා කරයි', isCorrect: true },
      { id: 'q4_c', label: 'C', text: 'සිනමා බලයි', isCorrect: false },
      { id: 'q4_d', label: 'D', text: 'නිදාගනී', isCorrect: false },
    ]
  },
  {
    id: 5,
    num: 5,
    questionText: '5. ඇය සිහින දකින්නේ කුමක් වීමටද?',
    correctAnswer: 'ගුරුවරියක්',
    fullAnswerSentence: 'මලී සිහින දකින්නේ ගුරුවරියක් වීමටයි.',
    voicePrompt: 'ප්‍රශ්නය පහ. ඇය සිහින දකින්නේ කුමක් වීමටද?',
    options: [
      { id: 'q5_a', label: 'A', text: 'ගුරුවරියක්', isCorrect: true },
      { id: 'q5_b', label: 'B', text: 'ඉංජිනේරුවරියක්', isCorrect: false },
      { id: 'q5_c', label: 'C', text: 'ගායන ශිල්පිනියක්', isCorrect: false },
      { id: 'q5_d', label: 'D', text: 'නර්තන ශිල්පිනියක්', isCorrect: false },
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

// ── Main Grade 4 Level 3 Activity 2 Component ──
export default function SinhalaGrade4Level3Act2({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isAllDone, setIsAllDone] = useState(false);

  const currentQ = GRADE4_L3_ACT2_QUESTIONS[currentIndex];

  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    const timer = setTimeout(() => {
      speakSinhala(currentQ.voicePrompt);
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
      speakSinhala(`විශිෂ්ටයි! නිවැරදි පිළිතුර වන්නේ ${opt.text}.`);
    } else {
      playSound('wrong');
      speakSinhala('නැවත උත්සාහ කරන්න.');
    }
  };

  const handleNext = () => {
    playSound('click');
    if (currentIndex < GRADE4_L3_ACT2_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-purple-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-7xl mb-2 animate-bounce">🏆🎉📚</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ 4 ශ්‍රේණිය Activity 2 (කෙටි කතාව කියවා පිළිතුරු දීම) සාර්ථකව අවසන් කළා!</p>
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
              <span>Grade 4 · Level 3 · Act 2</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 2: කෙටි කතාව කියවා පිළිතුරු දෙමු
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/95 text-purple-900 px-4 py-2 rounded-2xl font-black text-sm md:text-base shadow-md border-2 border-purple-200 flex items-center gap-1.5">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span>{score}</span>
            </div>
          </div>
        </div>

        {/* Sub-instruction banner with Owl Professor */}
        <div className="w-full mt-3 bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-amber-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
              📖 <span className="text-amber-800 font-extrabold underline">කෙටි කතාව කියවන්න</span>. ඉන්පසු ප්‍රශ්න වලට නිවැරදි පිළිතුරු තෝරා ලියන්න.
            </p>
          </div>
          <div className="text-2xl pointer-events-none select-none">
            🦉🎓
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: STORY CARD & QUESTIONS ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col gap-4 justify-center">
        
        {/* Story Card */}
        <div className="bg-amber-50/90 rounded-3xl p-4 sm:p-5 border-3 border-amber-300 shadow-md flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-200 to-orange-200 flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
            👧📖
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-amber-800 uppercase tracking-wider">
                {STORY_PASSAGE.title}
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
              "{STORY_PASSAGE.fullTextSinhala}"
            </p>
          </div>
        </div>

        {/* Question & 4 Choice Buttons */}
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 shadow-2xl border-4 border-amber-200 flex flex-col gap-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                {currentQ.num}
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {currentQ.questionText}
              </h2>
            </div>
          </div>

          {/* 4 Choices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-1">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrect = opt.isCorrect;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className={`py-3.5 px-4 rounded-2xl font-black text-base sm:text-lg shadow-md border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 scale-102'
                        : 'bg-rose-500 text-white border-rose-600'
                      : isAnswered && isCorrect
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-200'
                      : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-200 active:scale-95'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center border border-slate-300">
                      {opt.label}
                    </span>
                    <span>{opt.text}</span>
                  </div>

                  {isSelected && isCorrect && (
                    <span className="text-xs font-bold text-white">✓ නිවැරදියි</span>
                  )}
                </button>
              );
            })}
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
            {GRADE4_L3_ACT2_QUESTIONS.map((_, i) => (
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
            disabled={!isAnswered}
            className={`py-2.5 px-6 font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-2 transition-all ${
              isAnswered
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer active:scale-95 animate-bounce-short'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{currentIndex === GRADE4_L3_ACT2_QUESTIONS.length - 1 ? 'අවසන් කරන්න' : 'ඊළඟ ප්‍රශ්නය'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
