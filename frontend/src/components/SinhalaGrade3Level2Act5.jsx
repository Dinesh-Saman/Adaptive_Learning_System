import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 5 Word Pair Matching Data for Grade 3 Level 2 Activity 5 ──
const LEFT_WORDS = [
  { id: 'l_1', num: 1, text: 'ගමන්', correctRightId: 'r_4', color: 'bg-amber-100 border-amber-300 text-amber-900', badgeBg: 'bg-amber-400 text-amber-950', lineStroke: '#F59E0B' },
  { id: 'l_2', num: 2, text: 'අහල', correctRightId: 'r_1', color: 'bg-emerald-100 border-emerald-300 text-emerald-900', badgeBg: 'bg-emerald-500 text-white', lineStroke: '#10B981' },
  { id: 'l_3', num: 3, text: 'සිරිත්', correctRightId: 'r_5', color: 'bg-purple-100 border-purple-300 text-purple-900', badgeBg: 'bg-purple-500 text-white', lineStroke: '#8B5CF6' },
  { id: 'l_4', num: 4, text: 'නැගි', correctRightId: 'r_2', color: 'bg-orange-100 border-orange-300 text-orange-900', badgeBg: 'bg-orange-500 text-white', lineStroke: '#F97316' },
  { id: 'l_5', num: 5, text: 'කෑම', correctRightId: 'r_2_alt', color: 'bg-pink-100 border-pink-300 text-pink-900', badgeBg: 'bg-pink-500 text-white', lineStroke: '#EC4899' },
];

const RIGHT_WORDS = [
  { id: 'r_1', text: 'පහල', matchPair: 'අහල පහල' },
  { id: 'r_2_alt', text: 'බීම', matchPair: 'කෑම බීම' },
  { id: 'r_3', text: 'බෝග', matchPair: 'ගොවි බෝග' },
  { id: 'r_4', text: 'බිමන්', matchPair: 'ගමන් බිමන්' },
  { id: 'r_5', text: 'විරිත්', matchPair: 'සිරිත් විරිත්' },
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

export default function SinhalaGrade3Level2Act5({ onExit }) {
  const navigate = useNavigate();

  // Selected Left Word ID
  const [selectedLeftId, setSelectedLeftId] = useState(null);

  // Map of matched connections: { l_1: 'r_4', l_2: 'r_1', ... }
  const [matches, setMatches] = useState({});

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(30);
  const [tipMessage, setTipMessage] = useState(null);
  const [isAllDone, setIsAllDone] = useState(false);

  // Positions for SVG Connector Lines
  const containerRef = useRef(null);
  const leftItemRefs = useRef({});
  const rightItemRefs = useRef({});
  const [lineCoords, setLineCoords] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala('ගැළපෙන පද යා කරන්න. වම් පැත්තේ ඇති පදය ක්ලික් කර දකුණු පැත්තේ ගැළපෙන පදය ක්ලික් කරන්න.');
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Update line coordinates when matches change or resize occurs
  const updateLineCoords = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const newCoords = [];
    Object.entries(matches).forEach(([leftId, rightId]) => {
      const leftEl = leftItemRefs.current[leftId];
      const rightEl = rightItemRefs.current[rightId];

      if (leftEl && rightEl) {
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();

        const x1 = leftRect.right - containerRect.left;
        const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
        const x2 = rightRect.left - containerRect.left;
        const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;

        const leftItem = LEFT_WORDS.find((l) => l.id === leftId);

        newCoords.push({
          leftId,
          rightId,
          x1,
          y1,
          x2,
          y2,
          stroke: leftItem?.lineStroke || '#8B5CF6'
        });
      }
    });

    setLineCoords(newCoords);
  };

  useEffect(() => {
    updateLineCoords();
    window.addEventListener('resize', updateLineCoords);
    return () => window.removeEventListener('resize', updateLineCoords);
  }, [matches, isConfirmed]);

  // Click Left Word
  const handleLeftClick = (leftItem) => {
    if (isConfirmed) return;
    playSound('click');
    speakSinhala(leftItem.text);

    if (selectedLeftId === leftItem.id) {
      setSelectedLeftId(null);
    } else {
      setSelectedLeftId(leftItem.id);
    }
  };

  // Click Right Word
  const handleRightClick = (rightItem) => {
    if (isConfirmed) return;

    if (!selectedLeftId) {
      playSound('click');
      speakSinhala(rightItem.text);
      return;
    }

    playSound('place');
    speakSinhala(rightItem.text);

    // Link selected left to clicked right
    setMatches((prev) => {
      const updated = { ...prev };
      // Remove any existing link to this right item
      Object.keys(updated).forEach((k) => {
        if (updated[k] === rightItem.id) delete updated[k];
      });
      updated[selectedLeftId] = rightItem.id;
      return updated;
    });

    setSelectedLeftId(null);
  };

  // Unlink a matched pair
  const handleUnlink = (leftId) => {
    if (isConfirmed) return;
    playSound('click');
    setMatches((prev) => {
      const updated = { ...prev };
      delete updated[leftId];
      return updated;
    });
  };

  // Check Answers
  const handleCheckAnswers = () => {
    playSound('click');
    const matchedCount = Object.keys(matches).length;

    if (matchedCount < 4) {
      playSound('wrong');
      setTipMessage('කරුණාකර සියලුම පද යුගල යා කරන්න!');
      speakSinhala('කරුණාකර සියලුම පද යුගල යා කරන්න.');
      setTimeout(() => setTipMessage(null), 2500);
      return;
    }

    setIsConfirmed(true);

    let correctCount = 0;
    LEFT_WORDS.forEach((l) => {
      const rightId = matches[l.id];
      if (rightId === l.correctRightId) {
        correctCount++;
      }
    });

    const earnedPoints = correctCount * 20;
    setScore((prev) => prev + earnedPoints);

    if (correctCount >= 4) {
      playSound('correct');
      speakSinhala('විශිෂ්ටයි! ඔබ ගැළපෙන පද නිවැරදිව යා කළා! 🎉');
    } else {
      playSound('wrong');
      speakSinhala(`ඔබ පද ${correctCount}ක් නිවැරදිව යා කර ඇත. රතු පැහැති රේඛා බලන්න.`);
    }
  };

  // Restart Activity
  const handleRestart = () => {
    playSound('click');
    setMatches({});
    setSelectedLeftId(null);
    setIsConfirmed(false);
    speakSinhala('නැවත ආරම්භ කරන ලදී.');
  };

  // Count matches
  const matchCount = Object.keys(matches).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-purple-100 to-indigo-200 font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-6">
      
      {/* ── TOP HEADER BAR (Exact Screenshot 2 Theme) ── */}
      <div className="max-w-5xl mx-auto w-full px-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Back Button */}
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="py-2 px-5 bg-white/90 hover:bg-white text-purple-900 font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-purple-200 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>⬅️</span>
            <span>ආපසු</span>
          </button>

          {/* Center Activity Pill */}
          <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white py-2 px-8 rounded-full shadow-lg border-2 border-yellow-300 flex items-center gap-2">
            <span className="text-yellow-300 text-lg">⭐</span>
            <span className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 5
            </span>
            <span className="text-yellow-300 text-lg">⭐</span>
          </div>

          {/* Score & Audio */}
          <div className="flex items-center gap-3">
            <div className="bg-white/95 text-purple-900 px-4 py-2 rounded-2xl font-black text-sm md:text-base shadow-md border-2 border-purple-200 flex items-center gap-1.5">
              <span className="text-yellow-500 text-xl">🏆</span>
              <span>ලකුණු {score}</span>
            </div>

            <button
              onClick={() => {
                playSound('click');
                speakSinhala('ගැළපෙන පද යා කරන්න. වම් පැත්තේ ඇති පදය ක්ලික් කරන්න. ඉන්පසු එයට ගැළපෙන පදය දකුණු පැත්තෙන් ක්ලික් කරන්න.');
              }}
              className="w-11 h-11 bg-purple-700 hover:bg-purple-800 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
              title="හඬ අසන්න"
            >
              🔊
            </button>
          </div>
        </div>

        {/* ── Big Yellow Instruction Banner (Matching Screenshot 2) ── */}
        <div className="max-w-4xl mx-auto w-full mt-3">
          <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 rounded-3xl p-3 sm:p-4 shadow-lg border-3 border-amber-200 flex items-center justify-between gap-3 relative overflow-hidden">
            
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center text-2xl sm:text-3xl shadow-md border-2 border-white flex-shrink-0">
              📢
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800">
                ගැළපෙන පද යා කරන්න.
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
                වම් පැත්තේ ඇති පදය ක්ලික් කරන්න. ඉන්පසු එයට ගැළපෙන පදය දකුණු පැත්තෙන් ක්ලික් කරන්න.
              </p>
            </div>

            {/* Cartoon Boy Mascot */}
            <div className="text-4xl sm:text-5xl drop-shadow-md flex-shrink-0 animate-bounce">
              👦
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN 3-COLUMN MATCHING BOARD ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        
        {tipMessage && (
          <div className="bg-amber-500 text-white text-xs font-black py-2 px-4 rounded-xl text-center shadow-md animate-bounce mb-2 mx-auto max-w-md">
            {tipMessage}
          </div>
        )}

        <div
          ref={containerRef}
          className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-4 border-purple-200 relative min-h-[360px] flex items-stretch justify-between gap-4"
        >
          {/* Dynamic SVG Connector Lines Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {lineCoords.map((line, idx) => {
              const leftItem = LEFT_WORDS.find((l) => l.id === line.leftId);
              const isPairCorrect = leftItem?.correctRightId === line.rightId;

              // Curved bezier path
              const dx = (line.x2 - line.x1) * 0.5;
              const d = `M ${line.x1} ${line.y1} C ${line.x1 + dx} ${line.y1}, ${line.x2 - dx} ${line.y2}, ${line.x2} ${line.y2}`;

              return (
                <g key={idx}>
                  <path
                    d={d}
                    fill="none"
                    stroke={isConfirmed ? (isPairCorrect ? '#10B981' : '#EF4444') : line.stroke}
                    strokeWidth="4"
                    strokeDasharray={isConfirmed ? 'none' : '6, 6'}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  <circle
                    cx={line.x1}
                    cy={line.y1}
                    r="5"
                    fill={isConfirmed ? (isPairCorrect ? '#10B981' : '#EF4444') : line.stroke}
                  />
                  <circle
                    cx={line.x2}
                    cy={line.y2}
                    r="5"
                    fill={isConfirmed ? (isPairCorrect ? '#10B981' : '#EF4444') : line.stroke}
                  />
                </g>
              );
            })}
          </svg>

          {/* ── Left Column: වම් පැත්ත ── */}
          <div className="w-[38%] flex flex-col justify-between gap-2 z-30">
            <div className="bg-purple-100 text-purple-900 py-1.5 px-4 rounded-2xl text-center font-black text-xs sm:text-sm border border-purple-300 shadow-xs mb-1">
              වම් පැත්ත
            </div>

            {LEFT_WORDS.map((item) => {
              const isSelected = selectedLeftId === item.id;
              const hasMatch = matches[item.id];
              const isPairCorrect = item.correctRightId === hasMatch;

              return (
                <div
                  key={item.id}
                  ref={(el) => (leftItemRefs.current[item.id] = el)}
                  onClick={() => handleLeftClick(item)}
                  className={`h-11 sm:h-12 rounded-2xl border-2 px-3 flex items-center justify-between transition-all select-none cursor-pointer ${
                    isConfirmed && hasMatch
                      ? isPairCorrect
                        ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-200 text-emerald-950 shadow-md'
                        : 'bg-rose-100 border-rose-500 ring-2 ring-rose-200 text-rose-950'
                      : isSelected
                      ? 'bg-purple-200 border-purple-600 ring-4 ring-purple-300 scale-102 shadow-md'
                      : hasMatch
                      ? `${item.color} shadow-xs`
                      : `${item.color} hover:shadow-md hover:scale-101 active:scale-95`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center shadow-xs ${item.badgeBg}`}
                    >
                      {item.num}
                    </span>
                    <span className="font-black text-sm sm:text-base md:text-lg">
                      {item.text}
                    </span>
                  </div>

                  {hasMatch && !isConfirmed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnlink(item.id);
                      }}
                      className="text-[11px] text-rose-500 hover:text-rose-700 font-bold ml-1"
                      title="යා කිරීම ඉවත් කරන්න"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Middle Guide Box (Matching Screenshot 2) ── */}
          <div className="w-[20%] hidden sm:flex flex-col items-center justify-center p-2 rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50/50 text-center z-10">
            <span className="text-2xl animate-bounce">👆</span>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 mt-1 leading-tight">
              වම් පැත්තේ පදයක් ක්ලික් කර දකුණු පැත්තේ ගැළපෙන පදය ක්ලික් කරන්න.
            </p>
          </div>

          {/* ── Right Column: දකුණු පැත්ත ── */}
          <div className="w-[38%] flex flex-col justify-between gap-2 z-30">
            <div className="bg-sky-100 text-sky-900 py-1.5 px-4 rounded-2xl text-center font-black text-xs sm:text-sm border border-sky-300 shadow-xs mb-1">
              දකුණු පැත්ත
            </div>

            {RIGHT_WORDS.map((item) => {
              const isMatchedToSelected = selectedLeftId && matches[selectedLeftId] === item.id;
              const isMatchedAny = Object.values(matches).includes(item.id);

              return (
                <div
                  key={item.id}
                  ref={(el) => (rightItemRefs.current[item.id] = el)}
                  onClick={() => handleRightClick(item)}
                  className={`h-11 sm:h-12 rounded-2xl border-2 px-3 flex items-center justify-between transition-all select-none cursor-pointer ${
                    isMatchedToSelected
                      ? 'bg-sky-200 border-sky-600 ring-4 ring-sky-300 scale-102 shadow-md'
                      : isMatchedAny
                      ? 'bg-sky-50 border-sky-400 shadow-xs'
                      : 'bg-white hover:bg-sky-50/70 border-sky-300 hover:border-sky-400 active:scale-95'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-sky-500 shadow-xs ring-2 ring-sky-200 flex-shrink-0"></span>
                    <span className="font-black text-sm sm:text-base md:text-lg text-slate-800">
                      {item.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── BOTTOM CONTROL BAR (Matching Screenshot 2) ── */}
      <div className="max-w-4xl mx-auto w-full px-4 mt-2">
        <div className="bg-white/95 rounded-3xl p-3 shadow-xl border-2 border-purple-200 flex flex-wrap items-center justify-between gap-3">
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-spin-slow">⭐</span>
            <div>
              <span className="text-xs font-black text-slate-700 block">
                ප්‍රගතිය {matchCount} / 5
              </span>
              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-300"
                  style={{ width: `${(matchCount / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Center Action Buttons */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            <button
              onClick={handleRestart}
              className="py-2 px-4 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <span>🔄</span>
              <span>නැවත අරඹන්න</span>
            </button>

            {isConfirmed ? (
              <button
                onClick={() => {
                  playSound('click');
                  navigate('/dashboard');
                }}
                className="py-2 px-5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all animate-bounce-short"
              >
                <span>🏆 අවසන් කරන්න ➔</span>
              </button>
            ) : (
              <button
                onClick={handleCheckAnswers}
                className="py-2 px-5 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all ring-4 ring-emerald-200 animate-pulse"
              >
                <span>✓</span>
                <span>පිළිතුරු පරීක්ෂා කරන්න</span>
              </button>
            )}
          </div>

          {/* Hint / Instructions Button */}
          <button
            onClick={() => {
              playSound('click');
              speakSinhala('ගමන් බිමන්, අහල පහල, සිරිත් විරිත්, කෑම බීම වැනි ගැළපෙන පද යා කරන්න.');
            }}
            className="py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <span>💡</span>
            <span>උපදෙස්</span>
          </button>

        </div>
      </div>

    </div>
  );
}
