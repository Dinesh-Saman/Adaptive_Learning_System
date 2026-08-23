import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 6 Questions for Grade 4 Level 4 Activity 2 (නිවැරදිව ලියා ඇති වාක්‍යය තෝරන්න) ──
const GRADE4_L4_ACT2_QUESTIONS = [
  {
    id: 1,
    num: 1,
    title: '1. නිවැරදි විරාම ලකුණු සහිත වාක්‍යය තෝරන්න',
    correctSentence: 'ඔබේ නම කුමක්ද?',
    imageEmoji: '❓👦💬',
    ruleTip: '💡 ප්‍රශ්නයක් අසන විට වාක්‍යය අවසානයට ප්‍රශ්නාර්ථ ලකුණ (?) යෙදිය යුතුය.',
    audioPrompt: 'ප්‍රශ්නය එක. ඔබේ නම කුමක්ද? නිවැරදි වාක්‍යය තෝරන්න. පිළිතුර ප්‍රශ්නාර්ථ ලකුණ සහිත වාක්‍යයයි.',
    options: [
      { id: 'q1_opt1', text: 'ඔබේ නම කුමක්ද.', isCorrect: false },
      { id: 'q1_opt2', text: 'ඔබේ නම කුමක්ද?', isCorrect: true },
      { id: 'q1_opt3', text: 'ඔබේ නම කුමක්ද!', isCorrect: false },
      { id: 'q1_opt4', text: 'ඔබේ නම කුමක්ද,', isCorrect: false },
    ]
  },
  {
    id: 2,
    num: 2,
    title: '2. නිවැරදි විරාම ලකුණු සහිත වාක්‍යය තෝරන්න',
    correctSentence: 'අම්මෝ! මෙයින් බේරුණා.',
    imageEmoji: '😲⚡🎉',
    ruleTip: '💡 විස්මය හෝ චිත්තවේග ප්‍රකාශ කරන පදයකින් පසු විස්මයාර්ථ ලකුණ (!) යෙදේ.',
    audioPrompt: 'ප්‍රශ්නය දෙක. අම්මෝ මෙයින් බේරුණා. නිවැරදි වාක්‍යය තෝරන්න. පිළිතුර අම්මෝ විස්මයාර්ථ ලකුණ සහිත වාක්‍යයයි.',
    options: [
      { id: 'q2_opt1', text: 'අම්මෝ මෙයින් බේරුණා.', isCorrect: false },
      { id: 'q2_opt2', text: 'අම්මෝ! මෙයින් බේරුණා.', isCorrect: true },
      { id: 'q2_opt3', text: 'අම්මෝ, මෙයින් බේරුණා.', isCorrect: false },
      { id: 'q2_opt4', text: 'අම්මෝ? මෙයින් බේරුණා.', isCorrect: false },
    ]
  },
  {
    id: 3,
    num: 3,
    title: '3. නිවැරදි විරාම ලකුණු සහිත වාක්‍යය තෝරන්න',
    correctSentence: 'මම අඹ, කෙසෙල්, පේර ගත්තෙමි.',
    imageEmoji: '🥭🍌🍐',
    ruleTip: '💡 නාම පද කිහිපයක් එක ළඟ ලියන විට වෙන් කිරීම සඳහා කොමාව (,) යෙදේ.',
    audioPrompt: 'ප්‍රශ්නය තුන. මම අඹ කෙසෙල් පේර ගත්තෙමි. නිවැරදි වාක්‍යය තෝරන්න. පිළිතුර කොමාව සහිත වාක්‍යයයි.',
    options: [
      { id: 'q3_opt1', text: 'මම අඹ, කෙසෙල්, පේර ගත්තෙමි.', isCorrect: true },
      { id: 'q3_opt2', text: 'මම අඹ කෙසෙල් පේර ගත්තෙමි.', isCorrect: false },
      { id: 'q3_opt3', text: 'මම අඹ. කෙසෙල්. පේර ගත්තෙමි.', isCorrect: false },
      { id: 'q3_opt4', text: 'මම අඹ! කෙසෙල්! පේර ගත්තෙමි.', isCorrect: false },
    ]
  },
  {
    id: 4,
    num: 4,
    title: '4. නිවැරදි විරාම ලකුණු සහිත වාක්‍යය තෝරන්න',
    correctSentence: 'ගුරුතුමිය "මිතුරනි, ඉගෙනුම වැදගත්" යැයි කීවාය.',
    imageEmoji: '👩‍🏫🗣️✨',
    ruleTip: '💡 යමෙකු කළ ප්‍රකාශයක් සෘජුවම උපුටා දක්වන විට යුගල උඩුකොමා (" ") යෙදේ.',
    audioPrompt: 'ප්‍රශ්නය හතර. ගුරුතුමිය මිතුරනි ඉගෙනුම වැදගත් යැයි කීවාය. නිවැරදි වාක්‍යය තෝරන්න. පිළිතුර යුගල උඩුකොමා සහිත වාක්‍යයයි.',
    options: [
      { id: 'q4_opt1', text: 'ගුරුතුමිය මිතුරනි, ඉගෙනුම වැදගත් යැයි කීවාය.', isCorrect: false },
      { id: 'q4_opt2', text: 'ගුරුතුමිය මිතුරනි. ඉගෙනුම වැදගත් යැයි කීවාය.', isCorrect: false },
      { id: 'q4_opt3', text: 'ගුරුතුමිය "මිතුරනි, ඉගෙනුම වැදගත්" යැයි කීවාය.', isCorrect: true },
      { id: 'q4_opt4', text: 'ගුරුතුමිය මිතුරනි ඉගෙනුම වැදගත් යැයි කීවාය', isCorrect: false },
    ]
  },
  {
    id: 5,
    num: 5,
    title: '5. නිවැරදි විරාම ලකුණු සහිත වාක්‍යය තෝරන්න',
    correctSentence: 'ළමයා නිසැක ලෙස පිළිතුරු දුන්නේය.',
    imageEmoji: '👦✍️⭐',
    ruleTip: '💡 සාමාන්‍ය වාක්‍යයක අවසානයේ පමණක් තිත (.) යෙදේ. අනවශ්‍ය විරාම ලකුණු නොයෙදේ.',
    audioPrompt: 'ප්‍රශ්නය පහ. ළමයා නිසැක ලෙස පිළිතුරු දුන්නේය. නිවැරදි වාක්‍යය තෝරන්න.',
    options: [
      { id: 'q5_opt1', text: 'ළමයා නිසැක ලෙස පිළිතුරු දුන්නේය.', isCorrect: true },
      { id: 'q5_opt2', text: 'ළමයා \'නිසැක\' ලෙස පිළිතුරු දුන්නේය.', isCorrect: false },
      { id: 'q5_opt3', text: 'ළමයා, නිසැක, ලෙස පිළිතුරු දුන්නේය.', isCorrect: false },
      { id: 'q5_opt4', text: 'ළමයා ! නිසැක ! ලෙස පිළිතුරු දුන්නේය.', isCorrect: false },
    ]
  },
  {
    id: 6,
    num: 6,
    title: '6. දිනය නිවැරදිව ලියා ඇති ආකාරය තෝරන්න',
    correctSentence: '2024.06.15',
    imageEmoji: '📅🗓️✨',
    ruleTip: '💡 දිනයක් ලිවීමේදී වර්ෂය, මාසය හා දිනය වෙන් කිරීමට තිත (.) යෙදේ.',
    audioPrompt: 'ප්‍රශ්නය හය. දිනය නිවැරදිව ලියා ඇති ආකාරය තෝරන්න. පිළිතුර දෙදහස් විසිහතර තිත බිංදුවයි හය තිත පහළොව.',
    options: [
      { id: 'q6_opt1', text: '2024.06.15', isCorrect: true },
      { id: 'q6_opt2', text: '2024,06,15', isCorrect: false },
      { id: 'q6_opt3', text: '2024?06?15', isCorrect: false },
      { id: 'q6_opt4', text: '2024!06!15', isCorrect: false },
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

// ── Ruled Lined Canvas Slate for Dotted Tracing ──
function Grade4SentenceTracingSlate({ fullSentence, fontSize = 21 }) {
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
    ctx.lineWidth = 2.5;
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
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
          <span>✍️</span>
          <span>නිවැරදි වාක්‍යය තිත් ඉරි මත ලියන්න (Trace Correct Sentence):</span>
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

        <svg viewBox="0 0 540 50" className="w-full h-full pointer-events-none select-none">
          <text
            x="270"
            y="34"
            textAnchor="middle"
            fontSize={fontSize}
            fontWeight="bold"
            fontFamily="'Noto Sans Sinhala', 'Iskoola Pota', sans-serif"
            fill="none"
            stroke="#64748B"
            strokeWidth="1.6"
            strokeDasharray="2 3"
            strokeLinecap="round"
            letterSpacing="1px"
          >
            {fullSentence}
          </text>
        </svg>

        <canvas
          ref={canvasRef}
          width={540}
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

// ── Main Grade 4 Level 4 Activity 2 Component ──
export default function SinhalaGrade4Level4Act2({ onExit }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(175);
  const [isAllDone, setIsAllDone] = useState(false);

  const currentQ = GRADE4_L4_ACT2_QUESTIONS[currentIndex];

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
      speakSinhala(`විශිෂ්ටයි! නිවැරදි වාක්‍යය වන්නේ: ${opt.text}. දැන් වාක්‍යය ලියන්න.`);
    } else {
      playSound('wrong');
      speakSinhala('නැවත උත්සාහ කරන්න. විරාම ලකුණු හොඳින් බලන්න.');
    }
  };

  const handleNext = () => {
    playSound('click');
    if (currentIndex < GRADE4_L4_ACT2_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAllDone(true);
    }
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-teal-100 to-emerald-200 flex items-center justify-center p-4 font-sinhala">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-yellow-300 text-center animate-bounce-short">
          <div className="text-7xl mb-2 animate-bounce">🏆🎉📝</div>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">විශිෂ්ටයි!</h1>
          <p className="text-slate-600 text-lg mb-2">ඔබ 4 ශ්‍රේණිය Level 4 Activity 2 (නිවැරදි වාක්‍ය තේරීම) සාර්ථකව අවසන් කළා!</p>
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
                setScore(175);
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
              <span>Grade 4 · Level 4 · Act 2</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-teal-700 via-emerald-700 to-indigo-700 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 2: නිවැරදිව ලියා ඇති වාක්‍යය තෝරමු
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
        <div className="w-full mt-3 bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-teal-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
              ✍️ <span className="text-teal-800 font-extrabold underline">විරාම ලක්ෂණ හොඳින් බලන්න</span>. නිවැරදිව ලියා ඇති වාක්‍යය තෝරා ලියන්න.
            </p>
          </div>
          <div className="text-2xl pointer-events-none select-none">
            📝✨
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-teal-200 flex flex-col gap-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-teal-100 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                {currentQ.num}
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {currentQ.title}
              </h2>
            </div>

            <span className="text-3xl">{currentQ.imageEmoji}</span>
          </div>

          {/* 4 Choices List */}
          <div className="grid grid-cols-1 gap-2.5 my-1">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrect = opt.isCorrect;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className={`py-3 px-5 rounded-2xl font-black text-base sm:text-lg shadow-md border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 scale-101'
                        : 'bg-rose-500 text-white border-rose-600 animate-shake'
                      : isAnswered && isCorrect
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-200'
                      : 'bg-white hover:bg-teal-50 text-slate-800 border-slate-200 active:scale-98'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center border border-slate-300">
                      {idx + 1}
                    </span>
                    <span>{opt.text}</span>
                  </div>

                  {isSelected && isCorrect && (
                    <span className="text-xs font-bold text-white bg-emerald-700/70 px-3 py-1 rounded-full">
                      ✓ නිවැරදියි
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Rule explanation tip */}
          {isAnswered && (
            <div className="p-3 bg-teal-50 rounded-2xl border-2 border-teal-300 text-xs sm:text-sm font-black text-teal-950 animate-fade-in flex items-center justify-between">
              <span>{currentQ.ruleTip}</span>
              <span className="text-xl">💡</span>
            </div>
          )}

          {/* ── Ruled Sentence Tracing Slate ── */}
          {isAnswered && (
            <div className="animate-fade-in">
              <Grade4SentenceTracingSlate fullSentence={currentQ.correctSentence} fontSize={20} />
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
            {GRADE4_L4_ACT2_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-teal-600 ring-2 ring-teal-300 scale-125'
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
            <span>{currentIndex === GRADE4_L4_ACT2_QUESTIONS.length - 1 ? 'අවසන් කරන්න' : 'ඊළඟ ප්‍රශ්නය'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

    </div>
  );
}
