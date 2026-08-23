import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 4 Noun Classification Categories (සත්ත්ව, පුද්ගල, ද්‍රව්‍ය, ස්ථාන) ──
const NOUN_CATEGORIES = [
  {
    id: 'cat_animals',
    num: 1,
    title: 'සත්ත්ව නාම',
    sub: 'Animals & Birds',
    icon: '🦁',
    badgeColor: 'bg-amber-500',
    cardBorder: 'border-amber-300',
    cardBg: 'bg-amber-50/80',
    headerBg: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
    ringColor: 'ring-amber-300',
    correctWords: ['අලියා', 'අශ්වයා', 'කුරුල්ලා', 'බල්ලා', 'මොණරා'],
    voicePrompt: 'සත්ත්ව නාම: අලියා, අශ්වයා, කුරුල්ලා, බල්ලා, මොණරා.'
  },
  {
    id: 'cat_people',
    num: 2,
    title: 'පුද්ගල නාම',
    sub: 'People & Roles',
    icon: '👥',
    badgeColor: 'bg-purple-600',
    cardBorder: 'border-purple-300',
    cardBg: 'bg-purple-50/80',
    headerBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
    ringColor: 'ring-purple-300',
    correctWords: ['ගුරුවරයා', 'සිසුවා', 'දැරිය', 'අම්මා', 'මල්ලි'],
    voicePrompt: 'පුද්ගල නාම: ගුරුවරයා, සිසුවා, දැරිය, අම්මා, මල්ලි.'
  },
  {
    id: 'cat_objects',
    num: 3,
    title: 'ද්‍රව්‍ය නාම',
    sub: 'Objects & Things',
    icon: '📦',
    badgeColor: 'bg-emerald-600',
    cardBorder: 'border-emerald-300',
    cardBg: 'bg-emerald-50/80',
    headerBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
    ringColor: 'ring-emerald-300',
    correctWords: ['පොත', 'මල', 'ගස', 'කෝප්පය', 'බෑගය'],
    voicePrompt: 'ද්‍රව්‍ය නාම: පොත, මල, ගස, කෝප්පය, බෑගය.'
  },
  {
    id: 'cat_places',
    num: 4,
    title: 'ස්ථාන නාම',
    sub: 'Places & Cities',
    icon: '📍',
    badgeColor: 'bg-sky-600',
    cardBorder: 'border-sky-300',
    cardBg: 'bg-sky-50/80',
    headerBg: 'bg-gradient-to-r from-sky-600 to-blue-600 text-white',
    ringColor: 'ring-sky-300',
    correctWords: ['රෝහල', 'පුස්තකාලය', 'කොළඹ', 'මීගමුව', 'පාසල'],
    voicePrompt: 'ස්ථාන නාම: රෝහල, පුස්තකාලය, කොළඹ, මීගමුව, පාසල.'
  }
];

// All 20 Words from the user screenshot
const INITIAL_ALL_WORDS = [
  { id: 'w_01', text: 'අලියා', emoji: '🐘', correctCat: 'cat_animals' },
  { id: 'w_02', text: 'ගුරුවරයා', emoji: '👨‍🏫', correctCat: 'cat_people' },
  { id: 'w_03', text: 'අශ්වයා', emoji: '🐎', correctCat: 'cat_animals' },
  { id: 'w_04', text: 'සිසුවා', emoji: '🧑‍🎓', correctCat: 'cat_people' },
  { id: 'w_05', text: 'පොත', emoji: '📕', correctCat: 'cat_objects' },
  { id: 'w_06', text: 'පුස්තකාලය', emoji: '📚', correctCat: 'cat_places' },
  { id: 'w_07', text: 'මල', emoji: '🌸', correctCat: 'cat_objects' },
  { id: 'w_08', text: 'කොළඹ', emoji: '🏙️', correctCat: 'cat_places' },
  { id: 'w_09', text: 'මීගමුව', emoji: '🏖️', correctCat: 'cat_places' },
  { id: 'w_10', text: 'කුරුල්ලා', emoji: '🐦', correctCat: 'cat_animals' },
  { id: 'w_11', text: 'දැරිය', emoji: '👧', correctCat: 'cat_people' },
  { id: 'w_12', text: 'පාසල', emoji: '🏫', correctCat: 'cat_places' },
  { id: 'w_13', text: 'අම්මා', emoji: '👩', correctCat: 'cat_people' },
  { id: 'w_14', text: 'රෝහල', emoji: '🏥', correctCat: 'cat_places' },
  { id: 'w_15', text: 'බල්ලා', emoji: '🐕', correctCat: 'cat_animals' },
  { id: 'w_16', text: 'ගස', emoji: '🌳', correctCat: 'cat_objects' },
  { id: 'w_17', text: 'මොණරා', emoji: '🦚', correctCat: 'cat_animals' },
  { id: 'w_18', text: 'මල්ලි', emoji: '👦', correctCat: 'cat_people' },
  { id: 'w_19', text: 'කෝප්පය', emoji: '☕', correctCat: 'cat_objects' },
  { id: 'w_20', text: 'බෑගය', emoji: '🎒', correctCat: 'cat_objects' }
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

export default function SinhalaGrade3Level2Act1({ onExit }) {
  const navigate = useNavigate();

  // Categorized Placed Words map: { cat_animals: [w1, w2, ...], cat_people: [], ... }
  const [categorizedWords, setCategorizedWords] = useState({
    cat_animals: [],
    cat_people: [],
    cat_objects: [],
    cat_places: []
  });

  const [availableWords, setAvailableWords] = useState(INITIAL_ALL_WORDS);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(120);
  const [tipMessage, setTipMessage] = useState(null);
  const [isAllDone, setIsAllDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala('නාම පද වර්ග කරමු. සත්ත්ව, පුද්ගල, ද්‍රව්‍ය සහ ස්ථාන නාම වෙන් කරන්න.');
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Select a word from available pool
  const handleSelectPoolWord = (word) => {
    if (isConfirmed) return;
    playSound('click');
    if (selectedWord?.id === word.id) {
      setSelectedWord(null);
    } else {
      setSelectedWord(word);
      speakSinhala(word.text);
    }
  };

  // Place selected word into a category bucket
  const handleCategoryClick = (catId) => {
    if (isConfirmed) return;

    if (!selectedWord) {
      // Just speak the category name
      const cat = NOUN_CATEGORIES.find((c) => c.id === catId);
      if (cat) speakSinhala(cat.title);
      return;
    }

    const currentList = categorizedWords[catId];
    if (currentList.length >= 5) {
      playSound('wrong');
      setTipMessage('මෙම කාණ්ඩයේ උපරිම වචන 5 සම්පූර්ණයි!');
      speakSinhala('මෙම කාණ්ඩයේ උපරිම වචන 5 සම්පූර්ණයි!');
      setTimeout(() => setTipMessage(null), 2500);
      return;
    }

    playSound('place');
    setCategorizedWords((prev) => ({
      ...prev,
      [catId]: [...prev[catId], selectedWord]
    }));

    setAvailableWords((prev) => prev.filter((w) => w.id !== selectedWord.id));
    setSelectedWord(null);
  };

  // Remove a word from category back to pool
  const handleRemoveWord = (catId, wordId) => {
    if (isConfirmed) return;
    playSound('click');

    const removedWord = categorizedWords[catId].find((w) => w.id === wordId);
    if (!removedWord) return;

    setCategorizedWords((prev) => ({
      ...prev,
      [catId]: prev[catId].filter((w) => w.id !== wordId)
    }));

    setAvailableWords((prev) => [...prev, removedWord]);
  };

  // Confirm All Classifications
  const handleConfirm = () => {
    playSound('click');
    const totalPlaced = Object.values(categorizedWords).reduce((acc, curr) => acc + curr.length, 0);

    if (totalPlaced < 20) {
      playSound('wrong');
      setTipMessage('කරුණාකර සියලුම වචන 20 අදාළ කාණ්ඩ වෙත යොමු කරන්න!');
      speakSinhala('කරුණාකර සියලුම වචන අදාළ කාණ්ඩ වෙත යොමු කරන්න.');
      setTimeout(() => setTipMessage(null), 3000);
      return;
    }

    setIsConfirmed(true);

    let correctCount = 0;
    NOUN_CATEGORIES.forEach((cat) => {
      const placed = categorizedWords[cat.id] || [];
      placed.forEach((w) => {
        if (cat.correctWords.includes(w.text)) {
          correctCount++;
        }
      });
    });

    const awardedPoints = correctCount * 5;
    setScore((prev) => prev + awardedPoints);

    if (correctCount === 20) {
      playSound('correct');
      speakSinhala('විශිෂ්ටයි! ඔබ සියලුම නාම පද 20 නිවැරදිව වර්ග කළා! 🎉');
    } else {
      playSound('wrong');
      speakSinhala(`ඔබ වචන ${correctCount}ක් නිවැරදිව වර්ග කර ඇත. රතු පැහැති වචන පරීක්ෂා කරන්න.`);
    }
  };

  // Reset entire activity
  const handleReset = () => {
    playSound('click');
    setCategorizedWords({
      cat_animals: [],
      cat_people: [],
      cat_objects: [],
      cat_places: []
    });
    setAvailableWords(INITIAL_ALL_WORDS);
    setSelectedWord(null);
    setIsConfirmed(false);
    speakSinhala('සියල්ල නැවත ආරම්භ කරන ලදී.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-purple-100 to-indigo-200 font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-6">
      
      {/* ── TOP HEADER BAR ── */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-3">
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
              <span>Level 2 · Activity 1</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          {/* Center Wooden Title Banner */}
          <div className="flex-1 max-w-lg bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 1: නාම පද වර්ග කරමු
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
                speakSinhala('නාම පද වර්ග කරමු. සත්ත්ව, පුද්ගල, ද්‍රව්‍ය සහ ස්ථාන නාම වෙන් කරන්න.');
              }}
              className="w-11 h-11 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
              title="හඬ අසන්න"
            >
              🔊
            </button>
          </div>
        </div>

        {/* Sub-instruction banner */}
        <div className="max-w-4xl mx-auto w-full mt-3">
          <div className="bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-purple-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound('click');
                  speakSinhala('පහත දී ඇති වචන අදාළ නාම පද කාණ්ඩය වෙත තෝරා තබන්න.');
                }}
                className="w-8 h-8 bg-purple-600 hover:bg-purple-700 active:scale-90 text-white rounded-full flex items-center justify-center text-base shadow-sm cursor-pointer"
              >
                🔊
              </button>
              <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
                පහත දී ඇති වචන <span className="text-purple-700 font-extrabold underline">සත්ත්ව, පුද්ගල, ද්‍රව්‍ය, ස්ථාන</span> ලෙස නිවැරදිව වර්ග කරන්න.
              </p>
            </div>
            <div className="text-2xl pointer-events-none select-none">
              📋
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 CATEGORY COLUMNS BOARD (Matching Screenshot 4 Columns) ── */}
      <div className="max-w-6xl mx-auto w-full px-4 my-3 flex-1 flex flex-col gap-3">
        
        {tipMessage && (
          <div className="bg-amber-500 text-white text-xs md:text-sm font-black py-2 px-4 rounded-2xl text-center shadow-lg animate-bounce mx-auto max-w-md">
            {tipMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {NOUN_CATEGORIES.map((cat) => {
            const placedList = categorizedWords[cat.id] || [];

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`rounded-3xl border-3 shadow-xl flex flex-col justify-between overflow-hidden transition-all duration-300 min-h-[310px] ${
                  cat.cardBg
                } ${
                  selectedWord
                    ? `${cat.cardBorder} ring-4 ${cat.ringColor} cursor-pointer scale-102`
                    : cat.cardBorder
                }`}
              >
                {/* Column Header Banner */}
                <div className={`p-3.5 ${cat.headerBg} flex items-center justify-between shadow-sm`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h3 className="text-base sm:text-lg font-black leading-tight drop-shadow-xs">
                        {cat.title}
                      </h3>
                      <span className="text-[10px] text-white/80 font-bold block">{cat.sub}</span>
                    </div>
                  </div>

                  <span className="w-6 h-6 rounded-full bg-white/30 text-white font-black text-xs flex items-center justify-center">
                    {placedList.length}/5
                  </span>
                </div>

                {/* 5 Word Slots List */}
                <div className="p-3 flex-1 flex flex-col gap-1.5 justify-start">
                  {[0, 1, 2, 3, 4].map((slotIdx) => {
                    const word = placedList[slotIdx];
                    const isCorrect = isConfirmed && word && cat.correctWords.includes(word.text);

                    return (
                      <div
                        key={slotIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (word) handleRemoveWord(cat.id, word.id);
                          else handleCategoryClick(cat.id);
                        }}
                        className={`h-11 rounded-2xl border-2 flex items-center justify-between px-3 text-xs sm:text-sm font-black transition-all ${
                          word
                            ? isConfirmed
                              ? isCorrect
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                                : 'bg-rose-500 text-white border-rose-600'
                              : 'bg-white text-slate-800 border-purple-300 shadow-xs hover:border-rose-400 hover:bg-rose-50/50 cursor-pointer'
                            : selectedWord
                            ? 'bg-purple-100/60 border-dashed border-purple-400 text-purple-400 animate-pulse cursor-pointer'
                            : 'bg-white/60 border-dashed border-slate-300 text-slate-300'
                        }`}
                        title={word ? 'ඉවත් කිරීමට ක්ලික් කරන්න' : 'තෝරාගත් වචනය තබන්න'}
                      >
                        {word ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="flex items-center gap-1.5">
                              <span>{word.emoji}</span>
                              <span>{word.text}</span>
                            </span>
                            {isConfirmed ? (
                              <span className="text-xs">{isCorrect ? '✓' : '✕'}</span>
                            ) : (
                              <span className="text-[10px] text-slate-400 opacity-60">✕</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] opacity-40">හිස්තැන {slotIdx + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Voice Speaker button for Category */}
                <div className="p-2 border-t border-slate-200/60 bg-white/40 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">වචන 5ක් තබන්න</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound('click');
                      speakSinhala(cat.voicePrompt);
                    }}
                    className="w-6 h-6 bg-white hover:bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-[10px] shadow-xs cursor-pointer"
                    title="අසන්න"
                  >
                    🔊
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM FLOATING WORD POOL ── */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border-3 border-purple-300 mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
              <span>🏷️</span>
              <span>වචන එකතුව (Word Bank - වචනයක් තෝරා ඉහත අදාළ කාණ්ඩය මත ක්ලික් කරන්න):</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              ඉතිරි: {availableWords.length} / 20
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
            {availableWords.map((word) => {
              const isSelected = selectedWord?.id === word.id;
              return (
                <button
                  key={word.id}
                  disabled={isConfirmed}
                  onClick={() => handleSelectPoolWord(word)}
                  className={`py-1.5 px-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-sm cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 select-none ${
                    isSelected
                      ? 'bg-purple-600 text-white ring-4 ring-yellow-400 scale-105 shadow-md border-2 border-white animate-bounce-short'
                      : 'bg-slate-50 hover:bg-purple-50 text-slate-800 border border-slate-300 hover:border-purple-300'
                  }`}
                >
                  <span>{word.emoji}</span>
                  <span>{word.text}</span>
                </button>
              );
            })}

            {availableWords.length === 0 && !isConfirmed && (
              <div className="w-full text-center py-2 text-xs md:text-sm font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                ✨ සියලු වචන 20 තබා ඇත! "පිළිතුරු තහවුරු කරන්න" ක්ලික් කරන්න.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── BOTTOM ACTION BUTTONS ── */}
      <div className="max-w-6xl mx-auto w-full px-4 mt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="flex-1 min-w-[130px] py-2.5 px-5 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>⬅️</span>
            <span>ආපසු</span>
          </button>

          <button
            onClick={handleReset}
            className="flex-1 min-w-[130px] py-2.5 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>🔄</span>
            <span>නැවත සකසන්න</span>
          </button>

          {isConfirmed ? (
            <button
              onClick={() => {
                playSound('click');
                navigate('/dashboard');
              }}
              className="flex-1 min-w-[180px] py-2.5 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-sm md:text-base rounded-2xl shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all animate-bounce-short"
            >
              <span>🏆 අවසන් කරන්න ➔</span>
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="flex-1 min-w-[180px] py-2.5 px-6 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm md:text-base rounded-2xl shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all ring-4 ring-emerald-300 animate-pulse"
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
