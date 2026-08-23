import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Question Datasets for Level 3 - Activity 3: නිවැරදි වචනය ඇදගෙන ගොස් හිස්තැනට දමන්න ──
const LEVEL3_ACT3_QUESTIONS = [
  {
    id: 1,
    num: 1,
    badgeColor: 'bg-emerald-500',
    borderColor: 'border-emerald-300',
    imageType: 'rain_house',
    imageEmoji: '🌧️🏠',
    sentencePrefix: 'වැස්ස',
    sentenceSuffix: '.',
    fullCorrectSentence: 'වැස්ස වැටෙයි.',
    correctWord: 'වැටෙයි',
    voicePrompt: 'වැස්ස රූපය බලලා හිස්තැනට ගැලපෙන වචනය තෝරන්න.',
    options: [
      { id: 'q1_o1', text: 'වැටෙයි', isCorrect: true, color: 'bg-gradient-to-r from-pink-300 to-rose-400 text-rose-950 border-rose-400 hover:border-rose-600' },
      { id: 'q1_o2', text: 'දුවයි', isCorrect: false, color: 'bg-gradient-to-r from-sky-300 to-blue-400 text-blue-950 border-blue-400 hover:border-blue-600' },
      { id: 'q1_o3', text: 'ගයයි', isCorrect: false, color: 'bg-gradient-to-r from-amber-300 to-yellow-400 text-amber-950 border-amber-400 hover:border-amber-600' },
    ]
  },
  {
    id: 2,
    num: 2,
    badgeColor: 'bg-sky-500',
    borderColor: 'border-sky-300',
    imageType: 'girl_flowers',
    imageEmoji: '👧🌸',
    sentencePrefix: 'දැරිය',
    sentenceSuffix: 'නෙළයි.',
    fullCorrectSentence: 'දැරිය මල් නෙළයි.',
    correctWord: 'මල්',
    voicePrompt: 'දැරිය මල් නෙළන රූපය බලලා හිස්තැනට ගැලපෙන වචනය තෝරන්න.',
    options: [
      { id: 'q2_o1', text: 'මල්', isCorrect: true, color: 'bg-gradient-to-r from-pink-300 to-rose-400 text-rose-950 border-rose-400 hover:border-rose-600' },
      { id: 'q2_o2', text: 'පොත', isCorrect: false, color: 'bg-gradient-to-r from-sky-300 to-blue-400 text-blue-950 border-blue-400 hover:border-blue-600' },
      { id: 'q2_o3', text: 'කිරි', isCorrect: false, color: 'bg-gradient-to-r from-amber-300 to-yellow-400 text-amber-950 border-amber-400 hover:border-amber-600' },
    ]
  },
  {
    id: 3,
    num: 3,
    badgeColor: 'bg-amber-500',
    borderColor: 'border-amber-300',
    imageType: 'mother_singing',
    imageEmoji: '👩🎤',
    sentencePrefix: 'අම්මා ගීත',
    sentenceSuffix: '.',
    fullCorrectSentence: 'අම්මා ගීත ගයයි.',
    correctWord: 'ගයයි',
    voicePrompt: 'අම්මා ගීත ගයන රූපය බලලා හිස්තැනට ගැලපෙන වචනය තෝරන්න.',
    options: [
      { id: 'q3_o1', text: 'ගයයි', isCorrect: true, color: 'bg-gradient-to-r from-emerald-300 to-green-400 text-green-950 border-green-400 hover:border-green-600' },
      { id: 'q3_o2', text: 'බොයි', isCorrect: false, color: 'bg-gradient-to-r from-purple-300 to-indigo-400 text-indigo-950 border-indigo-400 hover:border-indigo-600' },
      { id: 'q3_o3', text: 'නටයි', isCorrect: false, color: 'bg-gradient-to-r from-amber-300 to-yellow-400 text-amber-950 border-amber-400 hover:border-amber-600' },
    ]
  },
  {
    id: 4,
    num: 4,
    badgeColor: 'bg-purple-500',
    borderColor: 'border-purple-300',
    imageType: 'teacher_classroom',
    imageEmoji: '👨‍🏫📚',
    sentencePrefix: 'ගුරුවරයා',
    sentenceSuffix: '.',
    fullCorrectSentence: 'ගුරුවරයා උගන්වයි.',
    correctWord: 'උගන්වයි',
    voicePrompt: 'ගුරුවරයා පාඩම උගන්වන රූපය බලලා හිස්තැනට ගැලපෙන වචනය තෝරන්න.',
    options: [
      { id: 'q4_o1', text: 'උගන්වයි', isCorrect: true, color: 'bg-gradient-to-r from-rose-300 to-pink-400 text-rose-950 border-rose-400 hover:border-rose-600' },
      { id: 'q4_o2', text: 'නටයි', isCorrect: false, color: 'bg-gradient-to-r from-cyan-300 to-sky-400 text-sky-950 border-sky-400 hover:border-sky-600' },
      { id: 'q4_o3', text: 'පීනයි', isCorrect: false, color: 'bg-gradient-to-r from-purple-300 to-violet-400 text-purple-950 border-purple-400 hover:border-purple-600' },
    ]
  },
  {
    id: 5,
    num: 5,
    badgeColor: 'bg-emerald-600',
    borderColor: 'border-emerald-300',
    imageType: 'cow_grass',
    imageEmoji: '🐄🌿',
    sentencePrefix: 'එළදෙන',
    sentenceSuffix: 'කයි.',
    fullCorrectSentence: 'එළදෙන තණකොළ කයි.',
    correctWord: 'තණකොළ',
    voicePrompt: 'එළදෙන තණකොළ කන රූපය බලලා හිස්තැනට ගැලපෙන වචනය තෝරන්න.',
    options: [
      { id: 'q5_o1', text: 'තණකොළ', isCorrect: true, color: 'bg-gradient-to-r from-emerald-300 to-green-400 text-green-950 border-green-400 hover:border-green-600' },
      { id: 'q5_o2', text: 'පොත', isCorrect: false, color: 'bg-gradient-to-r from-amber-300 to-yellow-400 text-amber-950 border-amber-400 hover:border-amber-600' },
      { id: 'q5_o3', text: 'මාළු', isCorrect: false, color: 'bg-gradient-to-r from-sky-300 to-blue-400 text-blue-950 border-blue-400 hover:border-blue-600' },
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

// ── Image Source Mapping for Activity 3 ──
const ACT3_IMAGES = {
  rain_house: '/images/rain_house.png',
  girl_flowers: '/images/girl_flowers.png',
  mother_singing: '/images/mother_singing.png',
  teacher_classroom: '/images/teacher_classroom.png',
  cow_grass: '/images/cow_grass.png',
};

// ── Artwork Illustration Box for Activity 3 ──
function QuestionIllustration({ type, title }) {
  const imgSrc = ACT3_IMAGES[type] || '/images/rain_house.png';

  return (
    <div className="w-full sm:w-48 md:w-56 h-32 md:h-36 rounded-2xl overflow-hidden shadow-md border-2 border-slate-200 bg-white relative flex-shrink-0">
      <img
        src={imgSrc}
        alt={title || type}
        className="w-full h-full object-cover select-none pointer-events-none"
      />
    </div>
  );
}

// ── Single Horizontal Question Card ──
function FillInBlankCard({
  question,
  selectedOption,
  isConfirmed,
  onSelectWord,
  onRemoveWord
}) {
  const isSelected = !!selectedOption;
  const isCorrect = selectedOption?.isCorrect;

  return (
    <div
      className={`bg-white/95 rounded-3xl p-3 md:p-4 shadow-lg border-3 transition-all flex flex-col md:flex-row items-center gap-4 relative overflow-hidden ${
        isConfirmed
          ? isCorrect
            ? 'border-emerald-500 bg-emerald-50/50 shadow-emerald-100'
            : 'border-rose-400 bg-rose-50/40 shadow-rose-100'
          : question.borderColor
      }`}
    >
      {/* ── Left Number Badge (1, 2, 3...) ── */}
      <div
        className={`w-9 h-9 md:w-10 md:h-10 rounded-full ${
          isConfirmed
            ? isCorrect
              ? 'bg-emerald-500'
              : 'bg-rose-500'
            : question.badgeColor
        } text-white flex items-center justify-center font-black text-base md:text-lg shadow-md flex-shrink-0`}
      >
        {question.num}
      </div>

      {/* ── Graphic Illustration Box ── */}
      <div className="flex-shrink-0">
        <QuestionIllustration type={question.imageType} title={question.fullCorrectSentence} />
      </div>

      {/* ── Right Content Area: Sentence with Drop Slot + 3 Word Pills ── */}
      <div className="flex-1 w-full flex flex-col justify-between gap-3">
        
        {/* Sentence with Target Slot */}
        <div className="flex items-center flex-wrap gap-2 text-lg md:text-2xl font-black text-slate-800">
          <span>{question.sentencePrefix}</span>

          {/* Drop Target Slot */}
          <div
            onClick={isSelected && !isConfirmed ? () => onRemoveWord(question.id) : undefined}
            className={`min-w-[130px] md:min-w-[150px] h-11 md:h-12 px-4 rounded-2xl border-2 flex items-center justify-center font-black text-base md:text-xl transition-all shadow-inner ${
              isConfirmed
                ? isCorrect
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-500 scale-105 shadow-md'
                  : 'bg-rose-100 text-rose-950 border-rose-400'
                : isSelected
                ? 'bg-sky-100 text-sky-950 border-sky-400 shadow-sm cursor-pointer'
                : 'bg-white hover:bg-slate-50 border-dashed border-sky-300 text-slate-400'
            }`}
          >
            {isSelected ? (
              <span className="flex items-center gap-1">
                <span>{selectedOption.text}</span>
                {isConfirmed && isCorrect && <span className="text-emerald-600 text-sm">✓</span>}
                {isConfirmed && !isCorrect && <span className="text-rose-600 text-sm">✕</span>}
              </span>
            ) : (
              <span className="text-xs md:text-sm font-bold opacity-50">හිස්තැන</span>
            )}
          </div>

          {question.sentenceSuffix && <span>{question.sentenceSuffix}</span>}

          {/* Voice Prompt Button */}
          <button
            onClick={() => {
              playSound('click');
              speakSinhala(question.voicePrompt);
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm shadow-xs cursor-pointer ml-auto"
            title="හඬ අසන්න"
          >
            🔊
          </button>
        </div>

        {/* ── 3 Color-Coded Word Option Pills ── */}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {question.options.map((opt) => {
            const isChosen = selectedOption?.id === opt.id;
            return (
              <button
                key={opt.id}
                disabled={isConfirmed}
                onClick={() => onSelectWord(question, opt)}
                className={`flex-1 min-w-[90px] md:min-w-[120px] py-2 px-3 rounded-2xl border-2 font-black text-sm md:text-base shadow-md transition-all active:scale-95 flex items-center justify-center ${
                  isConfirmed
                    ? isChosen
                      ? opt.isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300'
                        : 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300'
                      : 'opacity-40 bg-slate-100 text-slate-400 border-slate-200'
                    : isChosen
                    ? 'ring-4 ring-sky-400 scale-105 opacity-90'
                    : `${opt.color} hover:scale-105 cursor-pointer`
                }`}
              >
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Result Badge (Only visible after confirmation) */}
      {isConfirmed && (
        <div className="absolute top-2 right-2 animate-bounce">
          <div
            className={`w-7 h-7 rounded-full shadow border-2 border-white flex items-center justify-center font-black text-xs text-white ${
              isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          >
            {isCorrect ? '✓' : '✕'}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Grade 2 Level 3 Activity 3 Component ──
export default function SinhalaGrade2Level3Act3({ onExit }) {
  const navigate = useNavigate();

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(125);
  const [isFinished, setIsFinished] = useState(false);

  // Play instructions on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala('නිවැරදි වචනය ඇදගෙන ගොස් හිස්තැනට දමන්න.');
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSpeakerClick = () => {
    playSound('click');
    speakSinhala('නිවැරදි වචනය ඇදගෙන ගොස් හිස්තැනට දමන්න.');
  };

  const handleSelectWord = (question, option) => {
    if (isConfirmed) return;
    playSound('place');
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: option
    }));
  };

  const handleRemoveWord = (questionId) => {
    if (isConfirmed) return;
    playSound('click');
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const handleResetAll = () => {
    playSound('click');
    setSelectedAnswers({});
    setIsConfirmed(false);
    speakSinhala('සියලු පිළිතුරු මකා දමන ලදී.');
  };

  const handleCheckAll = () => {
    playSound('click');
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < LEVEL3_ACT3_QUESTIONS.length) {
      speakSinhala('කරුණාකර සියලුම ප්‍රශ්න 5 සඳහා පිළිතුරු තෝරන්න.');
      return;
    }

    setIsConfirmed(true);

    const correctCount = LEVEL3_ACT3_QUESTIONS.filter(
      (q) => selectedAnswers[q.id]?.isCorrect
    ).length;

    const allCorrect = correctCount === LEVEL3_ACT3_QUESTIONS.length;

    if (allCorrect) {
      playSound('correct');
      setScore((prev) => prev + 50);
      speakSinhala('විශිෂ්ටයි! ඔබ සියලුම ප්‍රශ්න 5 නිවැරදිව සම්පූර්ණ කළා!');
    } else {
      playSound('wrong');
      setScore((prev) => prev + correctCount * 10);
      speakSinhala(`ඔබ ප්‍රශ්න 5න් ${correctCount}ක් නිවැරදිව පිළිතුරු දුන්නා. රතු පැහැති කොටු පරීක්ෂා කරන්න.`);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-300 via-sky-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-7xl mb-2 animate-bounce">🏆🎉🦉</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ Level 3 අභ්‍යාස 3 සාර්ථකව අවසන් කළා!</p>
          <div className="text-4xl font-black text-purple-600 mb-8">ලකුණු: {score} ⭐</div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/module/sinhala/grade2')}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🌟 Grade 2 Learning Hub වෙත</span>
              <span className="text-2xl">➔</span>
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setIsFinished(false);
                }}
                className="flex-1 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-lg rounded-2xl shadow-md cursor-pointer"
              >
                🔄 නැවත කරන්න
              </button>
              <button
                onClick={onExit || (() => navigate('/dashboard'))}
                className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-lg rounded-2xl shadow-md cursor-pointer"
              >
                🏠 Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200 font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-6">
      
      {/* ── TOP HEADER BAR ── */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Home Button (Pink Circle) */}
          <button
            onClick={onExit || (() => navigate('/module/sinhala/grade2'))}
            className="w-12 h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="ආපසු"
          >
            🏠
          </button>

          {/* Center Activity 3 Purple Banner with Gold Stars */}
          <div className="flex-1 max-w-md bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white py-2 px-8 rounded-3xl shadow-xl border-4 border-yellow-300 text-center relative overflow-hidden flex items-center justify-center gap-3">
            <span className="text-2xl text-yellow-300 animate-pulse">⭐</span>
            <h1 className="text-2xl md:text-3xl font-black tracking-wide drop-shadow-md">
              Activity 3
            </h1>
            <span className="text-2xl text-yellow-300 animate-pulse">⭐</span>
          </div>

          {/* Star Score Badge & Wise Owl Mascot */}
          <div className="flex items-center gap-2">
            <div className="bg-white/90 text-slate-800 px-4 py-2 rounded-2xl font-black text-lg shadow-md border-2 border-white flex items-center gap-1.5">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span>{score}</span>
            </div>
            <div className="hidden sm:flex text-4xl drop-shadow-md animate-bounce" title="නුවණැති බකමූණා">
              🦉
            </div>
          </div>
        </div>

        {/* ── SUB-INSTRUCTION BANNER ── */}
        <div className="max-w-3xl mx-auto w-full mt-3">
          <div className="bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-sky-300 flex items-center gap-3">
            <button
              onClick={handleSpeakerClick}
              className="w-9 h-9 bg-pink-500 hover:bg-pink-600 active:scale-90 text-white rounded-full flex items-center justify-center text-lg shadow-sm flex-shrink-0 cursor-pointer"
            >
              🔊
            </button>
            <p className="text-sm md:text-base font-bold text-slate-800">
              නිවැරදි වචනය ඇදගෙන ගොස් <span className="text-purple-600 underline font-black">හිස්තැනට දමන්න.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── ALL 5 QUESTIONS LIST CONTAINER (Questions 1, 2, 3, 4, 5 Together) ── */}
      <div className="max-w-5xl mx-auto w-full px-4 my-3 flex-1 flex flex-col gap-4">
        {LEVEL3_ACT3_QUESTIONS.map((q) => (
          <FillInBlankCard
            key={q.id}
            question={q}
            selectedOption={selectedAnswers[q.id]}
            isConfirmed={isConfirmed}
            onSelectWord={handleSelectWord}
            onRemoveWord={handleRemoveWord}
          />
        ))}
      </div>

      {/* ── BOTTOM CONTROL BAR ── */}
      <div className="max-w-5xl mx-auto w-full px-4 mt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Back Button (Purple) */}
          <button
            onClick={onExit || (() => navigate('/module/sinhala/grade2'))}
            className="flex-1 min-w-[140px] py-2.5 px-5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>⬅️</span>
            <span>ආපසු යන්න</span>
          </button>

          {/* Reset All Button (Orange) */}
          <button
            onClick={handleResetAll}
            className="flex-1 min-w-[140px] py-2.5 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>🔄</span>
            <span>{isConfirmed ? 'නැවත උත්සාහ කරන්න' : 'නැවත සකසන්න'}</span>
          </button>

          {isConfirmed ? (
            /* View Results / Finish Button (Large Purple/Emerald) */
            <button
              onClick={() => setIsFinished(true)}
              className="flex-1 min-w-[180px] py-2.5 px-6 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-black text-sm md:text-base rounded-2xl shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all animate-bounce-short"
            >
              <span>🏆</span>
              <span>ප්‍රතිඵල බලන්න</span>
              <span className="text-lg">➔</span>
            </button>
          ) : (
            /* Check / Verify Answers Button (Green) */
            <button
              onClick={handleCheckAll}
              className="flex-1 min-w-[160px] py-2.5 px-6 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all ring-4 ring-emerald-300 animate-pulse"
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
