import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Part 1: නැවතීමේ ලකුණ යෙදී ඇති ස්ථාන රවුම් කරන්න (Circle / Tap Punctuation Marks) ──
const PART1_SENTENCES = [
  {
    id: 'p1_s1',
    num: 1,
    tokens: [
      { text: 'අනේ', isPunctuation: false },
      { text: 'මට', isPunctuation: false },
      { text: 'උදව්', isPunctuation: false },
      { text: 'කරන්න', isPunctuation: false },
      { text: '!', isPunctuation: true, symbol: '!', name: 'විස්මයාර්ථ ලකුණ' },
    ],
    hint: 'විස්මයාර්ථ ලකුණ (!) රවුම් කරන්න.'
  },
  {
    id: 'p1_s2',
    num: 2,
    tokens: [
      { text: '“', isPunctuation: true, symbol: '“', name: 'උද්ධෘත පාඨය' },
      { text: 'එක', isPunctuation: false },
      { text: 'කැලෑවක', isPunctuation: false },
      { text: 'ඉබ්බෙකුයි', isPunctuation: false },
      { text: 'හාවෙකුයි', isPunctuation: false },
      { text: 'හිටියා', isPunctuation: false },
      { text: '”', isPunctuation: true, symbol: '”', name: 'උද්ධෘත පාඨය' },
      { text: '.', isPunctuation: true, symbol: '.', name: 'නැවතීමේ තිත' },
    ],
    hint: 'උද්ධෘත පාඨ (“ ”) සහ නැවතීමේ තිත (.) රවුම් කරන්න.'
  },
  {
    id: 'p1_s3',
    num: 3,
    tokens: [
      { text: 'පොල්', isPunctuation: false },
      { text: 'ගෙඩියක්', isPunctuation: false },
      { text: 'ගඟේ', isPunctuation: false },
      { text: 'ගහගෙන', isPunctuation: false },
      { text: 'ගියේය', isPunctuation: false },
      { text: '.', isPunctuation: true, symbol: '.', name: 'නැවතීමේ තිත' },
    ],
    hint: 'නැවතීමේ තිත (.) රවුම් කරන්න.'
  },
  {
    id: 'p1_s4',
    num: 4,
    tokens: [
      { text: 'මොකක්ද', isPunctuation: false },
      { text: 'මේ', isPunctuation: false },
      { text: '......', isPunctuation: true, symbol: '......', name: 'පාඨ ලොප් ලකුණ' },
      { text: '?', isPunctuation: true, symbol: '?', name: 'ප්‍රශ්නාර්ථ ලකුණ' },
      { text: 'මොකක්ද', isPunctuation: false },
      { text: 'ඔබ', isPunctuation: false },
      { text: 'කරන්නේ', isPunctuation: false },
      { text: '?', isPunctuation: true, symbol: '?', name: 'ප්‍රශ්නාර්ථ ලකුණ' },
    ],
    hint: 'ප්‍රශ්නාර්ථ ලකුණු (?) සහ පාඨ ලොප් ලකුණ (......) රවුම් කරන්න.'
  },
  {
    id: 'p1_s5',
    num: 5,
    tokens: [
      { text: 'අනේ', isPunctuation: false },
      { text: 'මාමේ', isPunctuation: false },
      { text: 'ගස්', isPunctuation: false },
      { text: 'කපන්න', isPunctuation: false },
      { text: 'නම්', isPunctuation: false },
      { text: 'එපා', isPunctuation: false },
      { text: '.', isPunctuation: true, symbol: '.', name: 'නැවතීමේ තිත' },
    ],
    hint: 'නැවතීමේ තිත (.) රවුම් කරන්න.'
  }
];

// ── Part 2: පහත වාක්‍යවලට ගැලපෙන විරාම ලකුණ තෝරන්න (Matching Screenshot 3 UI) ──
const PART2_QUESTIONS = [
  {
    id: 1,
    num: 1,
    sentence: 'අම්මා මට පොතක් ගෙන දුන්නා',
    correctMark: '.',
    meaning: 'Mother bought me a book.',
    imageEmoji: '👧📖',
    imageBg: 'from-pink-300 to-rose-400',
    flowerBg: 'bg-rose-500',
    audioText: 'අම්මා මට පොතක් ගෙන දුන්නා. මෙය සාමාන්‍ය වාක්‍යයකි. තිත යොදන්න.',
    choices: [
      { mark: '.', label: 'තිත', color: 'bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-300' },
      { mark: '?', label: 'ප්‍රශ්නාර්ථය', color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300' },
      { mark: '!', label: 'විස්මයාර්ථය', color: 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300' },
    ]
  },
  {
    id: 2,
    num: 2,
    sentence: 'ඔයාගේ නම මොකක්ද',
    correctMark: '?',
    meaning: 'What is your name?',
    imageEmoji: '👦❓',
    imageBg: 'from-amber-300 to-orange-400',
    flowerBg: 'bg-amber-500',
    audioText: 'ඔයාගේ නම මොකක්ද? මෙය ප්‍රශ්නයකි. ප්‍රශ්නාර්ථ ලකුණ යොදන්න.',
    choices: [
      { mark: '.', label: 'තිත', color: 'bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-300' },
      { mark: '?', label: 'ප්‍රශ්නාර්ථය', color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300' },
      { mark: '!', label: 'විස්මයාර්ථය', color: 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300' },
    ]
  },
  {
    id: 3,
    num: 3,
    sentence: 'අනේ මගේ සෙල්ලම් බඩුව කැඩිලා',
    correctMark: '!',
    meaning: 'Oh no, my toy is broken!',
    imageEmoji: '🧸💔',
    imageBg: 'from-orange-300 to-amber-500',
    flowerBg: 'bg-green-600',
    audioText: 'අනේ මගේ සෙල්ලම් බඩුව කැඩිලා! මෙය හැඟීමක් ප්‍රකාශ කරන වාක්‍යයකි. විස්මයාර්ථ ලකුණ යොදන්න.',
    choices: [
      { mark: '.', label: 'තිත', color: 'bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-300' },
      { mark: '?', label: 'ප්‍රශ්නාර්ථය', color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300' },
      { mark: '!', label: 'විස්මයාර්ථය', color: 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300' },
    ]
  },
  {
    id: 4,
    num: 4,
    sentence: 'අපි හෙට විනෝද චාරිකාවට යනවා',
    correctMark: '.',
    meaning: 'We are going on a picnic tomorrow.',
    imageEmoji: '🚌🎒',
    imageBg: 'from-sky-300 to-blue-500',
    flowerBg: 'bg-blue-600',
    audioText: 'අපි හෙට විනෝද චාරිකාවට යනවා. මෙය සාමාන්‍ය ප්‍රකාශයකි. තිත යොදන්න.',
    choices: [
      { mark: '.', label: 'තිත', color: 'bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-300' },
      { mark: '?', label: 'ප්‍රශ්නාර්ථය', color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300' },
      { mark: '!', label: 'විස්මයාර්ථය', color: 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300' },
    ]
  },
  {
    id: 5,
    num: 5,
    sentence: 'කවුද ජනේලය ඇරියේ',
    correctMark: '?',
    meaning: 'Who opened the window?',
    imageEmoji: '🪟🤔',
    imageBg: 'from-purple-300 to-indigo-500',
    flowerBg: 'bg-purple-600',
    audioText: 'කවුද ජනේලය ඇරියේ? මෙය ප්‍රශ්නයකි. ප්‍රශ්නාර්ථ ලකුණ යොදන්න.',
    choices: [
      { mark: '.', label: 'තිත', color: 'bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-300' },
      { mark: '?', label: 'ප්‍රශ්නාර්ථය', color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300' },
      { mark: '!', label: 'විස්මයාර්ථය', color: 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300' },
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

export default function SinhalaGrade3Level2Act3({ onExit }) {
  const navigate = useNavigate();

  // Mode: 'part2_choose' (Main Screenshot 3) | 'part1_circle'
  const [activeTab, setActiveTab] = useState('part2_choose');

  // Part 2 state: answers mapping { 1: '.', 2: '?', ... }
  const [part2Answers, setPart2Answers] = useState({});
  const [isPart2Confirmed, setIsPart2Confirmed] = useState(false);
  const [part2Score, setPart2Score] = useState(120);

  // Part 1 state: selected tokens per sentence { 'p1_s1': Set([tokenIndex]) }
  const [part1Clicked, setPart1Clicked] = useState({});
  const [isPart1Confirmed, setIsPart1Confirmed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala('පහත වාක්‍යවලට ගැලපෙන විරාම ලකුණ තෝරන්න.');
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // ── Part 2 Handlers ──
  const handleSelectMark = (qId, mark) => {
    if (isPart2Confirmed) return;
    playSound('click');
    setPart2Answers((prev) => ({
      ...prev,
      [qId]: mark
    }));
    const question = PART2_QUESTIONS.find((q) => q.id === qId);
    if (question) {
      speakSinhala(`${mark === '.' ? 'තිත' : mark === '?' ? 'ප්‍රශ්නාර්ථය' : 'විස්මයාර්ථය'}`);
    }
  };

  const handleConfirmPart2 = () => {
    playSound('click');
    const answeredCount = Object.keys(part2Answers).length;
    if (answeredCount < PART2_QUESTIONS.length) {
      playSound('wrong');
      speakSinhala('කරුණාකර සියලුම ප්‍රශ්න සඳහා විරාම ලකුණු තෝරන්න.');
      return;
    }

    setIsPart2Confirmed(true);
    let correctCount = 0;
    PART2_QUESTIONS.forEach((q) => {
      if (part2Answers[q.id] === q.correctMark) correctCount++;
    });

    if (correctCount === PART2_QUESTIONS.length) {
      playSound('correct');
      setPart2Score((prev) => prev + 50);
      speakSinhala('විශිෂ්ටයි! ඔබ සියලුම වාක්‍ය සඳහා නිවැරදි විරාම ලකුණු තෝරා ගත්තා! 🎉');
    } else {
      playSound('wrong');
      setPart2Score((prev) => prev + correctCount * 10);
      speakSinhala(`ඔබ ප්‍රශ්න ${correctCount}ක් නිවැරදිව පිළිතුරු දුන්නා. වැරදි පිළිතුරු නැවත බලන්න.`);
    }
  };

  const handleResetPart2 = () => {
    playSound('click');
    setPart2Answers({});
    setIsPart2Confirmed(false);
    speakSinhala('නැවත ආරම්භ කරන ලදී.');
  };

  // ── Part 1 Handlers (Circle Punctuation) ──
  const handleToggleToken = (sId, tokenIdx) => {
    if (isPart1Confirmed) return;
    playSound('click');
    setPart1Clicked((prev) => {
      const currentSet = new Set(prev[sId] || []);
      if (currentSet.has(tokenIdx)) {
        currentSet.delete(tokenIdx);
      } else {
        currentSet.add(tokenIdx);
      }
      return { ...prev, [sId]: currentSet };
    });
  };

  const handleConfirmPart1 = () => {
    playSound('click');
    setIsPart1Confirmed(true);
    playSound('correct');
    speakSinhala('නැවතීමේ ලකුණු රවුම් කිරීම තහවුරු කළා!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-100 to-emerald-200 font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-6">
      
      {/* ── TOP HEADER BAR ── */}
      <div className="max-w-5xl mx-auto w-full px-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Back Home Button */}
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
            <span>{part2Score}</span>
          </div>

          {/* Center Activity Pill Banner */}
          <div className="flex-1 max-w-md bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 3: විරාම ලකුණු හඳුනාගනිමු
            </h1>
          </div>

          {/* Voice Prompt Button */}
          <button
            onClick={() => {
              playSound('click');
              speakSinhala('පහත වාක්‍යවලට ගැලපෙන විරාම ලකුණ තෝරන්න.');
            }}
            className="w-11 h-11 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="හඬ අසන්න"
          >
            🔊
          </button>
        </div>

        {/* ── SUB-MODE TOGGLE TABS (Part 2: විරාම ලකුණ තෝරන්න / Part 1: ලකුණු රවුම් කරන්න) ── */}
        <div className="max-w-2xl mx-auto w-full mt-3 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('part2_choose');
            }}
            className={`flex-1 py-2 px-4 rounded-2xl font-black text-xs md:text-sm shadow-md border-2 cursor-pointer transition-all ${
              activeTab === 'part2_choose'
                ? 'bg-purple-700 text-white border-yellow-300 scale-105 ring-2 ring-purple-300'
                : 'bg-white/80 hover:bg-white text-purple-900 border-purple-200'
            }`}
          >
            🎯 2) ගැලපෙන විරාම ලකුණ තෝරන්න
          </button>
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('part1_circle');
            }}
            className={`flex-1 py-2 px-4 rounded-2xl font-black text-xs md:text-sm shadow-md border-2 cursor-pointer transition-all ${
              activeTab === 'part1_circle'
                ? 'bg-purple-700 text-white border-yellow-300 scale-105 ring-2 ring-purple-300'
                : 'bg-white/80 hover:bg-white text-purple-900 border-purple-200'
            }`}
          >
            ⭕ 1) නැවතීමේ ලකුණු රවුම් කරන්න
          </button>
        </div>
      </div>

      {/* ── TAB 1: PART 2 (CHOOSE MATCHING PUNCTUATION MARK - EXACT UI FROM SCREENSHOT 3) ── */}
      {activeTab === 'part2_choose' && (
        <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col gap-3">
          
          {/* Main Card Container */}
          <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-2xl border-4 border-purple-200 relative overflow-hidden flex flex-col gap-3">
            
            {/* Instruction Header with Pencil & Sun */}
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-3xl p-3 sm:p-4 border-2 border-purple-300 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="text-3xl sm:text-4xl animate-bounce">✏️</div>
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow">
                  2
                </div>
                <h2 className="text-sm sm:text-base md:text-lg font-black text-purple-950">
                  පහත වාක්‍යවලට ගැලපෙන විරාම ලකුණ තෝරන්න
                </h2>
              </div>
              <div className="text-3xl animate-spin-slow">☀️</div>
            </div>

            {/* 5 Rows of Sentences with 3 Punctuation Pill Buttons */}
            <div className="flex flex-col gap-3 mt-1">
              {PART2_QUESTIONS.map((q) => {
                const selected = part2Answers[q.id];
                const isCorrect = selected === q.correctMark;

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl p-3 md:p-3.5 border-2 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 transition-all ${
                      isPart2Confirmed
                        ? isCorrect
                          ? 'bg-emerald-50/80 border-emerald-400'
                          : 'bg-rose-50/80 border-rose-400'
                        : 'bg-slate-50 hover:bg-purple-50/50 border-slate-200'
                    }`}
                  >
                    {/* Left: Number Badge + Illustration + Sentence */}
                    <div className="flex items-center gap-3 flex-1 w-full">
                      {/* Flower Number Badge */}
                      <div
                        className={`w-8 h-8 rounded-full ${q.flowerBg} text-white font-black text-xs md:text-sm flex items-center justify-center shadow-md flex-shrink-0`}
                      >
                        {q.num}
                      </div>

                      {/* Small Illustrated Mascot Avatar */}
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-sky-100 to-purple-200 border border-purple-200 flex items-center justify-center text-2xl shadow-xs flex-shrink-0">
                        {q.imageEmoji}
                      </div>

                      {/* Sentence Text with Underline */}
                      <div className="flex-1">
                        <div className="text-sm sm:text-base md:text-lg font-black text-slate-800 flex items-center gap-1.5 flex-wrap">
                          <span>{q.sentence}</span>
                          <span
                            className={`inline-block min-w-[32px] text-center font-extrabold text-xl border-b-3 ${
                              selected
                                ? isPart2Confirmed
                                  ? isCorrect
                                    ? 'border-emerald-500 text-emerald-600'
                                    : 'border-rose-500 text-rose-600'
                                  : 'border-purple-600 text-purple-700'
                                : 'border-slate-400 text-slate-400'
                            }`}
                          >
                            {selected || '___'}
                          </span>
                        </div>
                      </div>

                      {/* Voice button for single sentence */}
                      <button
                        onClick={() => {
                          playSound('click');
                          speakSinhala(q.audioText);
                        }}
                        className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xs shadow-xs cursor-pointer ml-auto flex-shrink-0"
                        title="අසන්න"
                      >
                        🔊
                      </button>
                    </div>

                    {/* Right: 3 Choice Buttons ( . | ? | ! ) */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      {q.choices.map((c) => {
                        const isThisSelected = selected === c.mark;
                        const isThisCorrect = c.mark === q.correctMark;

                        return (
                          <button
                            key={c.mark}
                            disabled={isPart2Confirmed}
                            onClick={() => handleSelectMark(q.id, c.mark)}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-3 font-black text-2xl md:text-3xl flex items-center justify-center shadow-md transition-all cursor-pointer ${
                              isThisSelected
                                ? isPart2Confirmed
                                  ? isThisCorrect
                                    ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300 scale-105'
                                    : 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300'
                                  : 'bg-sky-400 text-white border-sky-600 ring-4 ring-sky-200 scale-105 shadow-lg'
                                : isPart2Confirmed && isThisCorrect
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-400 ring-2 ring-emerald-200'
                                : c.color
                            } ${isPart2Confirmed ? 'cursor-default' : 'active:scale-95'}`}
                          >
                            <span>{c.mark}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Mascot Bar (Wise Owl 🦉 + Voice Prompt Pill + Gold Trophy 🏆) */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-purple-100 mt-2">
              
              {/* Left Owl Mascot */}
              <div className="flex items-center gap-2">
                <span className="text-4xl drop-shadow-md animate-bounce">🦉📖</span>
              </div>

              {/* Center Voice instruction pill */}
              <div
                onClick={() => {
                  playSound('click');
                  speakSinhala('නිවැරදි විරාම ලකුණ තෝරන්න.');
                }}
                className="bg-white/95 border-2 border-yellow-400 px-5 py-2 rounded-full shadow-sm flex items-center gap-2 cursor-pointer hover:bg-yellow-50 transition-all"
              >
                <span className="text-yellow-500 text-base">⭐</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                  නිවැරදි විරාම ලකුණ තෝරන්න.
                </span>
                <span className="text-sm">🔊</span>
              </div>

              {/* Right Gold Trophy */}
              <div className="flex items-center gap-2">
                <span className="text-4xl drop-shadow-md animate-pulse">🏆</span>
              </div>
            </div>

          </div>

          {/* ── Action Buttons for Part 2 ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
            <button
              onClick={onExit || (() => navigate('/dashboard'))}
              className="flex-1 min-w-[120px] py-2.5 px-5 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>⬅️</span>
              <span>ආපසු</span>
            </button>

            <button
              onClick={handleResetPart2}
              className="flex-1 min-w-[120px] py-2.5 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>🔄</span>
              <span>නැවත කරන්න</span>
            </button>

            {isPart2Confirmed ? (
              <button
                onClick={() => {
                  playSound('click');
                  navigate('/dashboard');
                }}
                className="flex-1 min-w-[160px] py-2.5 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-sm md:text-base rounded-2xl shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all animate-bounce-short"
              >
                <span>🏆 අවසන් කරන්න ➔</span>
              </button>
            ) : (
              <button
                onClick={handleConfirmPart2}
                className="flex-1 min-w-[160px] py-2.5 px-6 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm md:text-base rounded-2xl shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all ring-4 ring-emerald-300 animate-pulse"
              >
                <span>✓</span>
                <span>පිළිතුරු තහවුරු කරන්න</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* ── TAB 2: PART 1 (CIRCLE PUNCTUATION MARKS - MATCHING SCREENSHOT 1) ── */}
      {activeTab === 'part1_circle' && (
        <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col gap-3">
          <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-purple-200 flex flex-col gap-4">
            
            {/* Header */}
            <div className="border-b border-purple-100 pb-3">
              <h2 className="text-base sm:text-lg md:text-xl font-black text-purple-950 flex items-center gap-2">
                <span>⭕</span>
                <span>1) නැවතීමේ ලකුණ යෙදී ඇති ස්ථාන රවුම් කරන්න (Tap to Circle)</span>
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-1">
                වාක්‍යයේ ඇති නැවතීමේ ලකුණු ( ! , . , ? , “ ” ) මත ක්ලික් කර රවුම් කරන්න.
              </p>
            </div>

            {/* 5 Interactive Sentences */}
            <div className="flex flex-col gap-3">
              {PART1_SENTENCES.map((item) => {
                const clickedSet = part1Clicked[item.id] || new Set();

                return (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 flex flex-col gap-2 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-center gap-2 flex-wrap text-base sm:text-lg md:text-xl font-bold text-slate-800">
                      <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        {item.num}
                      </span>

                      {item.tokens.map((tok, idx) => {
                        const isClicked = clickedSet.has(idx);

                        if (tok.isPunctuation) {
                          return (
                            <button
                              key={idx}
                              onClick={() => handleToggleToken(item.id, idx)}
                              className={`px-2 py-0.5 rounded-xl font-black text-xl md:text-2xl transition-all cursor-pointer ${
                                isClicked
                                  ? isPart1Confirmed
                                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-300 scale-110 shadow-md'
                                    : 'bg-purple-600 text-white ring-4 ring-yellow-300 scale-110 shadow-md'
                                  : 'bg-amber-100 hover:bg-yellow-200 text-amber-950 border border-amber-300'
                              }`}
                              title={tok.name}
                            >
                              {tok.text}
                            </button>
                          );
                        }

                        return <span key={idx}>{tok.text}</span>;
                      })}
                    </div>

                    <div className="text-[11px] font-bold text-purple-700 bg-purple-50/80 px-2.5 py-1 rounded-xl w-max">
                      💡 ඉඟිය: {item.hint}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Bar for Part 1 */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-purple-100">
              <button
                onClick={() => setPart1Clicked({})}
                className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs md:text-sm rounded-xl cursor-pointer"
              >
                නැවත සකසන්න
              </button>
              <button
                onClick={handleConfirmPart1}
                className="py-2.5 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xs md:text-sm rounded-xl shadow-md cursor-pointer"
              >
                ✓ තහවුරු කරන්න
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
