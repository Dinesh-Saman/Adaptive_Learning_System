import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Part 1: Gender Train Sorting (පුරුෂ ලිංග / ස්ත්‍රී ලිංග) ──
const GENDER_TRAIN_WORDS = [
  { id: 'gw_1', text: 'පිරිමි ළමයා', emoji: '👦', gender: 'male' },
  { id: 'gw_2', text: 'ගැහැනු ළමයා', emoji: '👧', gender: 'female' },
  { id: 'gw_3', text: 'රූපලාවණ්‍ය ශිල්පියා', emoji: '💇‍♂️', gender: 'male' },
  { id: 'gw_4', text: 'ගෘහණිය', emoji: '👩', gender: 'female' },
  { id: 'gw_5', text: 'ධීවරයා', emoji: '🎣', gender: 'male' },
  { id: 'gw_6', text: 'සේවිකාව', emoji: '👩‍💼', gender: 'female' },
  { id: 'gw_7', text: 'ඉවුම්පිහුම්කරු', emoji: '👨‍🍳', gender: 'male' },
  { id: 'gw_8', text: 'නිරූපිකාව', emoji: '💃', gender: 'female' },
];

// ── Part 2: 5 Occupational Questions & Writing Reinforcements ──
const OCCUPATION_QUESTIONS = [
  {
    id: 1,
    num: 1,
    definition: 'රසවත් ආහාර පිළියෙල කරන්නා',
    correctWord: 'ඉවුම්පිහුම්කරු',
    meaning: 'Chef / Cook who prepares delicious food',
    imageEmoji: '👨‍🍳🍲',
    sentencePrefix: '',
    sentenceSuffix: 'රසවත් ආහාර පිසී.',
    fullSentence: 'ඉවුම්පිහුම්කරු රසවත් ආහාර පිසී.',
    voicePrompt: 'රසවත් ආහාර පිළියෙල කරන්නා කවුද? නිවැරදි වචනය තෝරා වාක්‍යය ලියන්න.',
    options: [
      { id: 'opt_1_1', text: 'ගැහැනිය' },
      { id: 'opt_1_2', text: 'ඉවුම්පිහුම්කරු', isCorrect: true },
      { id: 'opt_1_3', text: 'සේවිකාව' },
    ]
  },
  {
    id: 2,
    num: 2,
    definition: 'ගෙදර දොර සියලු වැඩ කටයුතු කරන්නී',
    correctWord: 'ගෘහණිය',
    meaning: 'Housewife / Homemaker',
    imageEmoji: '👩🏡',
    sentencePrefix: '',
    sentenceSuffix: 'නිවසේ සියලු වැඩ කරයි.',
    fullSentence: 'ගෘහණිය නිවසේ සියලු වැඩ කරයි.',
    voicePrompt: 'ගෙදර දොර වැඩ කරන්නී කවුද? නිවැරදි වචනය තෝරා වාක්‍යය ලියන්න.',
    options: [
      { id: 'opt_2_1', text: 'සැපයුම්කරු' },
      { id: 'opt_2_2', text: 'ගෘහණිය', isCorrect: true },
      { id: 'opt_2_3', text: 'ධීවරයා' },
    ]
  },
  {
    id: 3,
    num: 3,
    definition: 'ආයතනයක දුරකථන සහ සේවා කටයුතු කරන්නී',
    correctWord: 'සේවිකාව',
    meaning: 'Female Assistant / Operator',
    imageEmoji: '👩‍💼📞',
    sentencePrefix: '',
    sentenceSuffix: 'දුරකථන ඇමතුම් වලට පිළිතුරු දෙයි.',
    fullSentence: 'සේවිකාව දුරකථන ඇමතුම් වලට පිළිතුරු දෙයි.',
    voicePrompt: 'සේවා කටයුතු කරන්නී කවුද? නිවැරදි වචනය තෝරා වාක්‍යය ලියන්න.',
    options: [
      { id: 'opt_3_1', text: 'සේවිකාව', isCorrect: true },
      { id: 'opt_3_2', text: 'ඉතිරි' },
      { id: 'opt_3_3', text: 'රූපශිල්පී' },
    ]
  },
  {
    id: 4,
    num: 4,
    definition: 'මිලදී ගැනීමෙන් පසු ලැබෙන මුදල',
    correctWord: 'ඉතිරි',
    meaning: 'Balance / Remaining Change',
    imageEmoji: '💰🧾',
    sentencePrefix: 'මෙම භාණ්ඩයේ',
    sentenceSuffix: 'මුදල රුපියල් 40 කි.',
    fullSentence: 'මෙම භාණ්ඩයේ ඉතිරි මුදල රුපියල් 40 කි.',
    voicePrompt: 'ලැබෙන මුදල කුමක්ද? නිවැරදි වචනය තෝරා වාක්‍යය ලියන්න.',
    options: [
      { id: 'opt_4_1', text: 'පරිපාලකවරයා' },
      { id: 'opt_4_2', text: 'ඉතිරි', isCorrect: true },
      { id: 'opt_4_3', text: 'ගැහැනිය' },
    ]
  },
  {
    id: 5,
    num: 5,
    definition: 'අලංකාර ඇඳුම් විලාසිතා පෙන්වන්නී',
    correctWord: 'නිරූපිකාව',
    meaning: 'Fashion Model',
    imageEmoji: '💃👗',
    sentencePrefix: '',
    sentenceSuffix: 'අලංකාරවත් ඇඳුම් අඳියි.',
    fullSentence: 'නිරූපිකාව අලංකාරවත් ඇඳුම් අඳියි.',
    voicePrompt: 'විලාසිතා පෙන්වන්නී කවුද? නිවැරදි වචනය තෝරා වාක්‍යය ලියන්න.',
    options: [
      { id: 'opt_5_1', text: 'නිරූපිකාව', isCorrect: true },
      { id: 'opt_5_2', text: 'ගැහැනිය' },
      { id: 'opt_5_3', text: 'සැපයුම්කරු' },
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

// ── Ruled Writing Canvas Slate for Sentences ──
function SentenceWritingCanvas({ fullSentence }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [fullSentence]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handleStart = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0284C7';
    isDrawingRef.current = true;
  };

  const handleMove = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handleEnd = (e) => {
    e?.preventDefault();
    isDrawingRef.current = false;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="w-full mt-3 p-3 bg-slate-50 rounded-2xl border-2 border-dashed border-sky-300">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
          <span>✍️</span>
          <span>වාක්‍යය තිත් ඉරි මත ලියන්න (Write on dotted guide):</span>
        </span>
        <button
          onClick={handleClear}
          className="text-xs text-rose-500 hover:text-rose-700 font-bold underline cursor-pointer"
        >
          මකන්න
        </button>
      </div>

      <div className="relative w-full h-16 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-x-0 top-3 border-b border-sky-100 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-3 border-b border-sky-100 pointer-events-none"></div>

        <svg viewBox="0 0 500 50" className="w-full h-full pointer-events-none select-none">
          <text
            x="250"
            y="32"
            textAnchor="middle"
            fontSize="20"
            fontWeight="300"
            fontFamily="'Noto Sans Sinhala', 'Iskoola Pota', sans-serif"
            fill="none"
            stroke="#64748B"
            strokeWidth="1.2"
            strokeDasharray="3, 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {fullSentence}
          </text>
        </svg>

        <canvas
          ref={canvasRef}
          width={500}
          height={50}
          className="absolute inset-0 w-full h-full touch-none z-10 cursor-crosshair"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>
    </div>
  );
}

// ── Main Activity 3 Component ──
export default function SinhalaGrade3Level1Act3({ onExit }) {
  const navigate = useNavigate();

  // Mode: 'sentences' (5 Definition Questions) | 'train' (Gender Train Bogies)
  const [activeTab, setActiveTab] = useState('sentences');

  // Sentence Questions State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(120);
  const [isAllDone, setIsAllDone] = useState(false);

  // Train Sorting State
  const [maleBogie, setMaleBogie] = useState([]);
  const [femaleBogie, setFemaleBogie] = useState([]);
  const [trainPool, setTrainPool] = useState(GENDER_TRAIN_WORDS);
  const [selectedTrainWord, setSelectedTrainWord] = useState(null);
  const [isTrainConfirmed, setIsTrainConfirmed] = useState(false);

  const currentQ = OCCUPATION_QUESTIONS[currentIndex];

  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    if (activeTab === 'sentences') {
      const timer = setTimeout(() => {
        speakSinhala(currentQ.voicePrompt);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, activeTab]);

  // Handle choosing multiple choice option
  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    playSound('click');
    setSelectedOptionId(opt.id);
    speakSinhala(opt.text);

    if (opt.isCorrect) {
      playSound('correct');
      setIsAnswered(true);
      setScore((prev) => prev + 20);
      speakSinhala(`විශිෂ්ටයි! ${opt.text}. දැන් වාක්‍යය ලියන්න.`);
    } else {
      playSound('wrong');
      speakSinhala('නැවත උත්සාහ කරන්න.');
    }
  };

  const handleNextQuestion = () => {
    playSound('click');
    if (currentIndex < OCCUPATION_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  // ── Train Mode Handlers ──
  const handleSelectTrainWord = (word) => {
    if (isTrainConfirmed) return;
    playSound('click');
    if (selectedTrainWord?.id === word.id) {
      setSelectedTrainWord(null);
    } else {
      setSelectedTrainWord(word);
      speakSinhala(word.text);
    }
  };

  const handlePlaceInBogie = (targetGender) => {
    if (isTrainConfirmed || !selectedTrainWord) return;
    playSound('place');

    if (targetGender === 'male') {
      setMaleBogie((prev) => [...prev, selectedTrainWord]);
    } else {
      setFemaleBogie((prev) => [...prev, selectedTrainWord]);
    }

    setTrainPool((prev) => prev.filter((w) => w.id !== selectedTrainWord.id));
    setSelectedTrainWord(null);
  };

  const handleRemoveFromBogie = (word, fromGender) => {
    if (isTrainConfirmed) return;
    playSound('click');
    if (fromGender === 'male') {
      setMaleBogie((prev) => prev.filter((w) => w.id !== word.id));
    } else {
      setFemaleBogie((prev) => prev.filter((w) => w.id !== word.id));
    }
    setTrainPool((prev) => [...prev, word]);
  };

  const handleConfirmTrain = () => {
    playSound('click');
    if (trainPool.length > 0) {
      playSound('wrong');
      speakSinhala('කරුණාකර සියලුම වචන දුම්රිය මැදිරි වෙත ඇතුළත් කරන්න.');
      return;
    }

    setIsTrainConfirmed(true);
    let correctCount = 0;
    maleBogie.forEach((w) => {
      if (w.gender === 'male') correctCount++;
    });
    femaleBogie.forEach((w) => {
      if (w.gender === 'female') correctCount++;
    });

    if (correctCount === GENDER_TRAIN_WORDS.length) {
      playSound('correct');
      setScore((prev) => prev + 40);
      speakSinhala('විශිෂ්ටයි! ඔබ සියලුම වචන නිවැරදි දුම්රිය මැදිරියට ගෙන ගියා! 🎉');
    } else {
      playSound('wrong');
      speakSinhala(`ඔබ වචන ${correctCount}ක් නිවැරදිව තබා ඇත.`);
    }
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-purple-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-7xl mb-2 animate-bounce">🏆🎉👨‍🍳</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ Activity 3 සාර්ථකව අවසන් කළා!</p>
          <div className="text-4xl font-black text-purple-600 mb-8">ලකුණු: {score} ⭐</div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/module/sinhala/grade3-level2-act4')}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🌟 Activity 4 (රූපයට ගැළපෙන වචනය) වෙත</span>
              <span className="text-2xl">➔</span>
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setIsAllDone(false);
                  setScore(120);
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
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-100 to-emerald-200 font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-6">
      
      {/* ── TOP HEADER BAR ── */}
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
              <span>Activity 3 / 10</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          {/* Center Activity Title */}
          <div className="flex-1 max-w-lg bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 3: වචන අර්ථය සහ වාක්‍ය ලිවීම
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
                speakSinhala(activeTab === 'sentences' ? currentQ.voicePrompt : 'වචන කාණ්ඩයන් නිවැරදි දුම්රිය මැදිරියට ගෙන යන්න.');
              }}
              className="w-11 h-11 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
              title="හඬ අසන්න"
            >
              🔊
            </button>
          </div>
        </div>

        {/* ── Sub-Mode Toggle Tabs ── */}
        <div className="max-w-2xl mx-auto w-full mt-3 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('sentences');
            }}
            className={`flex-1 py-2 px-4 rounded-2xl font-black text-xs md:text-sm shadow-md border-2 cursor-pointer transition-all ${
              activeTab === 'sentences'
                ? 'bg-purple-700 text-white border-yellow-300 scale-105 ring-2 ring-purple-300'
                : 'bg-white/80 hover:bg-white text-purple-900 border-purple-200'
            }`}
          >
            📝 1) අර්ථයට වචනය තෝරා වාක්‍යය ලියන්න
          </button>
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('train');
            }}
            className={`flex-1 py-2 px-4 rounded-2xl font-black text-xs md:text-sm shadow-md border-2 cursor-pointer transition-all ${
              activeTab === 'train'
                ? 'bg-purple-700 text-white border-yellow-300 scale-105 ring-2 ring-purple-300'
                : 'bg-white/80 hover:bg-white text-purple-900 border-purple-200'
            }`}
          >
            🚂 2) පුරුෂ / ස්ත්‍රී ලිංග දුම්රිය
          </button>
        </div>
      </div>

      {/* ── TAB 1: 5 DEFINITION QUESTIONS & WRITING REINFORCEMENT (Matching Screenshot 2 & 3) ── */}
      {activeTab === 'sentences' && (
        <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
          <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-purple-200 flex flex-col gap-4 relative overflow-hidden">
            
            {/* Header with Step indicator */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-500 text-white font-black text-sm md:text-base flex items-center justify-center shadow-md border-2 border-white">
                  {currentQ.num}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500">ප්‍රශ්නය {currentQ.num} / 5</span>
                  <h2 className="text-base sm:text-lg md:text-xl font-black text-purple-950">
                    "{currentQ.definition}"
                  </h2>
                </div>
              </div>

              <button
                onClick={() => {
                  playSound('click');
                  speakSinhala(currentQ.voicePrompt);
                }}
                className="w-8 h-8 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full flex items-center justify-center text-sm shadow-xs cursor-pointer"
              >
                🔊
              </button>
            </div>

            {/* Middle Section: Left Picture + Right 3 Radio Choices */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-1">
              
              {/* Left Picture / Illustration */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-amber-100 via-sky-100 to-emerald-200 border-4 border-yellow-300 shadow-lg flex flex-col items-center justify-center p-3 text-center flex-shrink-0">
                <span className="text-6xl sm:text-7xl drop-shadow-md animate-pulse">
                  {currentQ.imageEmoji}
                </span>
                <span className="text-[11px] font-black text-slate-700 mt-2 bg-white/80 px-2.5 py-0.5 rounded-full shadow-xs">
                  {currentQ.meaning}
                </span>
              </div>

              {/* Right 3 Radio Choices */}
              <div className="flex-1 w-full flex flex-col gap-2.5">
                <span className="text-xs font-black text-slate-600 uppercase tracking-wide">
                  අනුවාදය වන්නේ (Select the matching word):
                </span>

                {currentQ.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrect = opt.isCorrect;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-3.5 rounded-2xl border-2 font-black text-base md:text-lg flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-md scale-102'
                            : 'bg-rose-500 text-white border-rose-600 animate-shake'
                          : isAnswered && isCorrect
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-200'
                          : 'bg-slate-50 hover:bg-purple-50/60 text-slate-800 border-slate-200 active:scale-95'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'bg-white border-white text-emerald-600' : 'bg-white border-slate-400'
                          }`}
                        >
                          {isSelected && <span className="text-[10px]">●</span>}
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {isSelected && isCorrect && <span className="text-base font-black">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Writing Reinforcement Box with Dotted Line Sentence ── */}
            {isAnswered && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 text-xs md:text-sm font-black text-emerald-900 bg-emerald-100/90 py-1.5 px-4 rounded-2xl border border-emerald-300 w-max">
                  <span>✅</span>
                  <span>"{currentQ.correctWord}" යන වචනය භාවිතා කර වාක්‍යය සම්පූර්ණ කරන්න:</span>
                </div>

                <SentenceWritingCanvas fullSentence={currentQ.fullSentence} />
              </div>
            )}

          </div>

          {/* ── Navigation Bottom Bar ── */}
          <div className="flex items-center justify-between gap-4 mt-3">
            <button
              onClick={onExit || (() => navigate('/dashboard'))}
              className="py-2.5 px-5 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>🏠</span>
              <span>මුල් පිටුව</span>
            </button>

            <div className="flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-full shadow-md border border-sky-300">
              {OCCUPATION_QUESTIONS.map((_, i) => (
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
              onClick={handleNextQuestion}
              disabled={!isAnswered}
              className={`py-2.5 px-6 font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-2 transition-all ${
                isAnswered
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer active:scale-95 animate-bounce-short'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <span>ඊළඟ ප්‍රශ්නය</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 2: GENDER TRAIN SORTING (Matching Screenshot 1 Train) ── */}
      {activeTab === 'train' && (
        <div className="max-w-5xl mx-auto w-full px-4 my-3 flex-1 flex flex-col gap-4">
          <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-purple-200 flex flex-col gap-4">
            
            <div className="border-b border-purple-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-purple-950 flex items-center gap-2">
                  <span>🚂</span>
                  <span>වචන කාණ්ඩයන් නිවැරදි දුම්රිය මැදිරියට ගෙන යන්න</span>
                </h2>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  වචනයක් තෝරා පුරුෂ ලිංග (නිල් මැදිරිය) හෝ ස්ත්‍රී ලිංග (රෝස මැදිරිය) වෙත ඇතුළත් කරන්න.
                </p>
              </div>
            </div>

            {/* ── 2 Train Bogies (Blue: පුරුෂ ලිංග / Pink: ස්ත්‍රී ලිංග) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-1">
              
              {/* Bogie 1: පුරුෂ ලිංග (Blue) */}
              <div
                onClick={() => handlePlaceInBogie('male')}
                className={`rounded-3xl border-4 p-4 shadow-lg flex flex-col justify-between min-h-[220px] transition-all bg-sky-50/90 border-sky-400 ${
                  selectedTrainWord ? 'ring-4 ring-sky-300 cursor-pointer scale-102' : ''
                }`}
              >
                <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2 px-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👦</span>
                    <span className="text-base font-black">පුරුෂ ලිංග මැදිරිය</span>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-white/30 text-white font-black text-xs flex items-center justify-center">
                    {maleBogie.length}/4
                  </span>
                </div>

                {/* Placed Words in Male Bogie */}
                <div className="flex flex-wrap gap-2 my-3 p-2 bg-white/80 rounded-2xl min-h-[100px] border border-sky-200">
                  {maleBogie.map((word) => {
                    const isCorrect = isTrainConfirmed && word.gender === 'male';
                    return (
                      <div
                        key={word.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromBogie(word, 'male');
                        }}
                        className={`py-1.5 px-3 rounded-xl border font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs ${
                          isTrainConfirmed
                            ? isCorrect
                              ? 'bg-emerald-500 text-white border-emerald-600'
                              : 'bg-rose-500 text-white border-rose-600'
                            : 'bg-sky-100 hover:bg-rose-100 text-sky-900 border-sky-300 hover:border-rose-300 cursor-pointer'
                        }`}
                        title="ඉවත් කිරීමට ක්ලික් කරන්න"
                      >
                        <span>{word.emoji}</span>
                        <span>{word.text}</span>
                        <span className="text-[10px] opacity-60">✕</span>
                      </div>
                    );
                  })}
                  {maleBogie.length === 0 && (
                    <span className="text-xs text-slate-400 font-bold m-auto">පුරුෂ ලිංග වචන මෙහි තබන්න</span>
                  )}
                </div>

                <div className="text-[11px] text-sky-800 font-bold text-center bg-sky-100/60 py-1 rounded-xl">
                  {selectedTrainWord ? '👆 මෙහි තැබීමට ක්ලික් කරන්න' : 'වචන 4ක් එකතු කරන්න'}
                </div>
              </div>

              {/* Bogie 2: ස්ත්‍රී ලිංග (Pink) */}
              <div
                onClick={() => handlePlaceInBogie('female')}
                className={`rounded-3xl border-4 p-4 shadow-lg flex flex-col justify-between min-h-[220px] transition-all bg-pink-50/90 border-pink-400 ${
                  selectedTrainWord ? 'ring-4 ring-pink-300 cursor-pointer scale-102' : ''
                }`}
              >
                <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white py-2 px-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👧</span>
                    <span className="text-base font-black">ස්ත්‍රී ලිංග මැදිරිය</span>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-white/30 text-white font-black text-xs flex items-center justify-center">
                    {femaleBogie.length}/4
                  </span>
                </div>

                {/* Placed Words in Female Bogie */}
                <div className="flex flex-wrap gap-2 my-3 p-2 bg-white/80 rounded-2xl min-h-[100px] border border-pink-200">
                  {femaleBogie.map((word) => {
                    const isCorrect = isTrainConfirmed && word.gender === 'female';
                    return (
                      <div
                        key={word.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromBogie(word, 'female');
                        }}
                        className={`py-1.5 px-3 rounded-xl border font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs ${
                          isTrainConfirmed
                            ? isCorrect
                              ? 'bg-emerald-500 text-white border-emerald-600'
                              : 'bg-rose-500 text-white border-rose-600'
                            : 'bg-pink-100 hover:bg-rose-100 text-pink-900 border-pink-300 hover:border-rose-300 cursor-pointer'
                        }`}
                        title="ඉවත් කිරීමට ක්ලික් කරන්න"
                      >
                        <span>{word.emoji}</span>
                        <span>{word.text}</span>
                        <span className="text-[10px] opacity-60">✕</span>
                      </div>
                    );
                  })}
                  {femaleBogie.length === 0 && (
                    <span className="text-xs text-slate-400 font-bold m-auto">ස්ත්‍රී ලිංග වචන මෙහි තබන්න</span>
                  )}
                </div>

                <div className="text-[11px] text-pink-800 font-bold text-center bg-pink-100/60 py-1 rounded-xl">
                  {selectedTrainWord ? '👆 මෙහි තැබීමට ක්ලික් කරන්න' : 'වචන 4ක් එකතු කරන්න'}
                </div>
              </div>

            </div>

            {/* Floating Word Bank for Train */}
            <div className="bg-slate-50 rounded-2xl p-4 border-2 border-purple-200">
              <div className="text-xs font-black text-purple-950 uppercase mb-2">
                🏷️ වචන එකතුව (Word Bank):
              </div>

              <div className="flex flex-wrap gap-2">
                {trainPool.map((word) => {
                  const isSelected = selectedTrainWord?.id === word.id;
                  return (
                    <button
                      key={word.id}
                      disabled={isTrainConfirmed}
                      onClick={() => handleSelectTrainWord(word)}
                      className={`py-2 px-4 rounded-2xl font-black text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                        isSelected
                          ? 'bg-purple-600 text-white ring-4 ring-yellow-300 scale-105 shadow-md border-2 border-white'
                          : 'bg-white hover:bg-purple-50 text-slate-800 border border-slate-300'
                      }`}
                    >
                      <span>{word.emoji}</span>
                      <span>{word.text}</span>
                    </button>
                  );
                })}

                {trainPool.length === 0 && !isTrainConfirmed && (
                  <div className="w-full text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                    ✨ සියලු වචන තබා ඇත! "තහවුරු කරන්න" ක්ලික් කරන්න.
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons for Train */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  setMaleBogie([]);
                  setFemaleBogie([]);
                  setTrainPool(GENDER_TRAIN_WORDS);
                  setSelectedTrainWord(null);
                  setIsTrainConfirmed(false);
                }}
                className="py-2.5 px-5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs sm:text-sm rounded-xl cursor-pointer"
              >
                නැවත සකසන්න
              </button>

              <button
                onClick={handleConfirmTrain}
                className="py-2.5 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer"
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
