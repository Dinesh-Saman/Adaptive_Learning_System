import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressionManager } from '../services/grade2ProgressionManager';

// ── Web Audio Synthesizer ──
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === 'lock') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(160, now + 0.15);
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

export default function SinhalaGrade2Hub({ onExit }) {
  const navigate = useNavigate();

  // Load progress from Progression Manager
  const [progress, setProgress] = useState(() => progressionManager.getProgress());
  const [lockModalInfo, setLockModalInfo] = useState(null);
  const [overrideUnlockAll, setOverrideUnlockAll] = useState(false);

  const refreshProgress = () => {
    setProgress({ ...progressionManager.getProgress() });
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  const handleCardClick = (ex, levelNum) => {
    const isUnlocked = overrideUnlockAll || progressionManager.isExerciseUnlocked(ex.id);

    if (isUnlocked) {
      playSound('click');
      navigate(ex.route);
    } else {
      playSound('lock');
      const msg = `මෙම අභ්‍යාසය තවම අගුළු දමා ඇත. පෙර අභ්‍යාසය සාර්ථකව අවසන් කර ලකුණු 70%ක් ලබා ගන්න.`;
      speakSinhala(msg);
      setLockModalInfo({
        exerciseName: ex.title,
        num: ex.num,
        level: levelNum,
        message: msg
      });
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('ඔබේ සියලුම අභ්‍යාස ප්‍රගතිය නැවත මුල සිට සැකසීමට අවශ්‍යද?')) {
      progressionManager.resetProgress();
      refreshProgress();
    }
  };

  // Level 1 Exercises definition (4 Exercises)
  const LEVEL1_EXERCISES = [
    {
      id: 'l1_ex1',
      num: 1,
      title: 'අකුර හඳුනාගනිමු',
      sub: 'අකුර හඳුනාගෙන තිත් ඉරි මත ලියමු (Letter Identification & Tracing)',
      icon: '🔤',
      route: '/module/sinhala/grade2-level1',
      badge: 'පියවර 5',
      color: 'from-amber-400 to-orange-500',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-300'
    },
    {
      id: 'l1_ex2',
      num: 2,
      title: 'පින්තූරයට අකුර',
      sub: 'පින්තූරයට ගැලපෙන අකුර තෝරා ලියන්න (Picture-Letter Matching)',
      icon: '🖼️',
      route: '/module/sinhala/grade2-level1-act2',
      badge: 'පියවර 5',
      color: 'from-pink-400 to-rose-500',
      bgLight: 'bg-pink-50',
      borderColor: 'border-pink-300'
    },
    {
      id: 'l1_ex3',
      num: 3,
      title: 'හිස් අකුර පුරවන්න',
      sub: 'හිස්තැනට ගැලපෙන අකුර තෝරා වචනය සම්පූර්ණ කරන්න (Fill in Blanks)',
      icon: '🐰',
      route: '/module/sinhala/grade2-level1-act3',
      badge: 'පියවර 5',
      color: 'from-emerald-400 to-teal-500',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-300'
    },
    {
      id: 'l1_ex4',
      num: 4,
      title: 'මැජික් පුවරුවේ අකුරු ලියමු',
      sub: 'ශබ්දය අසලා මැජික් පුවරුවේ අකුර ලියන්න (Magic Slate Tracing)',
      icon: '✨',
      route: '/module/sinhala/grade2-level1-act4',
      badge: 'පියවර 5',
      color: 'from-purple-400 to-indigo-500',
      bgLight: 'bg-purple-50',
      borderColor: 'border-purple-300'
    }
  ];

  // Level 2 Exercises definition (5 Exercises)
  const LEVEL2_EXERCISES = [
    {
      id: 'l2_ex1',
      num: 1,
      title: 'වචන ගොඩනගමු',
      sub: 'නිවැරදි වචනය අකුරු අනුපිළිවෙලට සකසා ලියන්න (Word Building)',
      icon: '☁️',
      route: '/module/sinhala/grade2-level2-act1',
      badge: 'පියවර 5',
      color: 'from-indigo-500 to-purple-600',
      bgLight: 'bg-indigo-50',
      borderColor: 'border-indigo-300'
    },
    {
      id: 'l2_ex2',
      num: 2,
      title: 'මැජික් පුවරුවේ වචන ලියමු',
      sub: 'ශබ්දය අසලා මැජික් පුවරුවේ වචනය ලියන්න (Magic Slate Words)',
      icon: '✨',
      route: '/module/sinhala/grade2-level2-act2',
      badge: 'පියවර 5',
      color: 'from-pink-400 to-rose-500',
      bgLight: 'bg-pink-50',
      borderColor: 'border-pink-300'
    },
    {
      id: 'l2_ex3',
      num: 3,
      title: 'අකුරු දුම්රිය',
      sub: 'දුම්රියේ අකුරු පිළිවෙලට සකසා වචනය හදන්න (Letter Train)',
      icon: '🚂',
      route: '/module/sinhala/grade2-level2-act3',
      badge: 'පියවර 5',
      color: 'from-amber-400 to-yellow-500',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-300'
    },
    {
      id: 'l2_ex4',
      num: 4,
      title: 'රූපයට ගැලපෙන වචනය මත ලියමු',
      sub: 'රූපයට ගැලපෙන වචනය තෝරා ලියැවිලි මත ලියන්න (Picture Word Match)',
      icon: '🦋',
      route: '/module/sinhala/grade2-level2-act4',
      badge: 'පියවර 5',
      color: 'from-rose-400 to-pink-500',
      bgLight: 'bg-rose-50',
      borderColor: 'border-rose-300'
    },
    {
      id: 'l2_ex5',
      num: 5,
      title: 'වචන කූඩය (Word Basket)',
      sub: 'කාණ්ඩය අසලා ගැලපෙන වචන කූඩයට දමන්න (Category Sort)',
      icon: '🧺',
      route: '/module/sinhala/grade2-level2-act5',
      badge: 'පියවර 5',
      color: 'from-blue-400 to-cyan-500',
      bgLight: 'bg-blue-50',
      borderColor: 'border-blue-300'
    }
  ];

  // Level 3 Exercises definition (3 Exercises)
  const LEVEL3_EXERCISES = [
    {
      id: 'l3_ex1',
      num: 1,
      title: 'රූපය බලලා වාක්‍යය ලියමු',
      sub: 'රූපය බලා ගැලපෙන සරල වාක්‍යය ඉරි මත ලියන්න (Picture Sentence Tracing)',
      icon: '📝',
      route: '/module/sinhala/grade2-level3-act1',
      badge: 'පියවර 5',
      color: 'from-violet-400 to-purple-600',
      bgLight: 'bg-violet-50',
      borderColor: 'border-violet-300'
    },
    {
      id: 'l3_ex2',
      num: 2,
      title: 'වාක්‍ය පාලම (Sentence Bridge)',
      sub: 'වචන පිළිවෙළට සකස් කර පාලම හදා වාක්‍යය ලියන්න (Sentence Bridge)',
      icon: '🌉',
      route: '/module/sinhala/grade2-level3-act2',
      badge: 'පියවර 5',
      color: 'from-emerald-400 to-green-600',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-300'
    },
    {
      id: 'l3_ex3',
      num: 3,
      title: 'හිස්තැනට වචනයක් යොදමු (Activity 3)',
      sub: 'නිවැරදි වචනය ඇදගෙන ගොස් හිස්තැනට දමන්න (Drag & Fill Blanks)',
      icon: '📝',
      route: '/module/sinhala/grade2-level3-act3',
      badge: 'පියවර 5',
      color: 'from-amber-400 to-orange-600',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-300'
    }
  ];

  const isLevel2Open = overrideUnlockAll || progressionManager.isLevelUnlocked(2);
  const isLevel3Open = overrideUnlockAll || progressionManager.isLevelUnlocked(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200 font-sinhala pb-12 select-none relative overflow-x-hidden">
      
      {/* Background Cartoon Elements */}
      <div className="absolute top-4 left-6 text-7xl opacity-80 pointer-events-none">☀️</div>
      <div className="absolute top-6 right-10 text-6xl opacity-70 pointer-events-none">☁️</div>
      <div className="absolute top-28 left-20 text-4xl opacity-80 pointer-events-none animate-pulse">🦋</div>

      <div className="max-w-5xl mx-auto px-4 py-6 relative z-10">
        
        {/* ── TOP NAVIGATION HEADER ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="flex items-center gap-2 bg-white/90 hover:bg-white text-slate-800 font-extrabold text-base px-5 py-2.5 rounded-full shadow-md border-2 border-white cursor-pointer active:scale-95 transition-all"
          >
            <span>←</span>
            <span>Dashboard</span>
          </button>

          {/* Header Title Pill */}
          <div className="bg-purple-600 text-white px-8 py-3 rounded-full shadow-xl border-4 border-yellow-300 flex items-center gap-3">
            <span className="text-3xl animate-bounce">📚</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-wide drop-shadow">
                2 ශ්‍රේණිය — සිංහල ඉගෙනුම් මාවත
              </h1>
              <p className="text-xs text-yellow-200 font-bold">Grade 2 Sinhala Learning Journey</p>
            </div>
          </div>

          {/* Overall Stars Badge & Teacher Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/module/sinhala/ai-research-panel')}
              className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2.5 rounded-full font-black text-xs shadow-md border-2 border-indigo-400 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 animate-pulse"
              title="View Trained PyTorch AI Models, Confusion Matrix, and DKT Knowledge Tracing"
            >
              <span>🔬</span>
              <span>AI Research Panel</span>
            </button>

            <div className="bg-yellow-400 text-slate-900 px-4 py-2.5 rounded-full font-black text-sm shadow-md border-2 border-white flex items-center gap-1.5">
              <span>⭐</span>
              <span>{progress.totalStars || 0}</span>
            </div>

            {/* Quick Testing Unlock Toggle */}
            <button
              onClick={() => setOverrideUnlockAll(!overrideUnlockAll)}
              className={`px-3 py-2 rounded-2xl text-xs font-black border cursor-pointer transition-all ${
                overrideUnlockAll
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-white/80 hover:bg-white text-slate-700 border-slate-300'
              }`}
              title="Toggle Unlock All for Teacher Verification"
            >
              {overrideUnlockAll ? '🔓 Test Mode' : '🔒 Gated'}
            </button>
          </div>
        </div>

        {/* ── TOP LEVEL NAVIGATION CONTAINER (TOP TO BOTTOM) ── */}
        <div className="flex flex-col gap-10">
          
          {/* ══════════════════════════════════════════════
              LEVEL 1: අකුරු හඳුනාගැනීම (GATED PROGRESSION)
             ══════════════════════════════════════════════ */}
          <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-6 border-amber-300 relative overflow-hidden">
            
            {/* Level Banner Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b-2 border-amber-100 gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg border-2 border-white">
                  1
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      මට්ටම 01 · ආරම්භක
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span>✓</span> විවෘතයි
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-amber-950 mt-1">
                    අකුරු හා මුලික ශබ්ද හඳුනාගැනීම
                  </h2>
                </div>
              </div>

              {/* Score & Progress */}
              <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-bold block">මට්ටමේ ලකුණු</span>
                  <span className="text-xl font-black text-amber-600">{progress.levelScores?.level1 || 0}%</span>
                </div>
                <div className="text-2xl">🏆</div>
              </div>
            </div>

            {/* 4 Exercises Grid for Level 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {LEVEL1_EXERCISES.map((ex) => {
                const isUnlocked = overrideUnlockAll || progressionManager.isExerciseUnlocked(ex.id);
                const score = progress.exerciseScores?.[ex.id];
                const isCompleted = progress.completedExercises?.includes(ex.id);

                return (
                  <div
                    key={ex.id}
                    onClick={() => handleCardClick(ex, 1)}
                    className={`${ex.bgLight} rounded-3xl p-5 border-2 ${
                      isUnlocked ? `${ex.borderColor} hover:border-amber-400 hover:shadow-xl cursor-pointer transform hover:-translate-y-1 group` : 'border-slate-300 opacity-70 cursor-not-allowed bg-slate-100'
                    } transition-all relative flex flex-col justify-between h-52`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${ex.color} text-white flex items-center justify-center font-black text-lg shadow-md`}>
                        {ex.num}
                      </div>
                      <span className="text-3xl group-hover:scale-125 transition-transform drop-shadow-sm">
                        {isUnlocked ? ex.icon : '🔒'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-800 group-hover:text-amber-700 transition-colors">
                        {ex.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                        {ex.sub}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <span className="text-[11px] font-bold text-amber-700 bg-white px-2.5 py-0.5 rounded-full shadow-xs border">
                        {isCompleted ? `✓ ${score}%` : ex.badge}
                      </span>
                      <span className="text-xs font-extrabold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        {isUnlocked ? 'ආරම්භ කරන්න ➔' : 'අගුළු දමා ඇත 🔒'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Level 1 Unlock Info Footnote */}
            <div className="mt-6 pt-4 border-t border-dashed border-amber-200 flex items-center justify-between text-xs text-slate-600 font-bold">
              <span>🎯 Level 2 විවෘත වීමට Level 1 හි ලකුණු 75%ක් ලබා ගන්න.</span>
              <span className={progress.levelScores?.level1 >= 75 ? 'text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200' : 'text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200'}>
                {progress.levelScores?.level1 >= 75 ? '✓ Level 2 විවෘත විය!' : `වත්මන් ලකුණු: ${progress.levelScores?.level1 || 0}%`}
              </span>
            </div>
          </div>


          {/* ══════════════════════════════════════════════
              LEVEL 2: සරල වචන හා රූප සම්බන්ධ කිරීම
             ══════════════════════════════════════════════ */}
          <div className={`rounded-[2.5rem] p-6 md:p-8 shadow-2xl transition-all relative overflow-hidden ${
            isLevel2Open
              ? 'bg-white/95 backdrop-blur-md border-6 border-indigo-300'
              : 'bg-slate-100/90 border-4 border-slate-300 opacity-90'
          }`}>
            
            {/* Level Banner Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b-2 border-indigo-100 gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg border-2 border-white ${
                  isLevel2Open ? 'bg-gradient-to-tr from-indigo-500 to-purple-600' : 'bg-slate-400'
                }`}>
                  2
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      මට්ටම 02 · මධ්‍යම
                    </span>
                    {isLevel2Open ? (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span>✓</span> විවෘතයි
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span>🔒</span> අගුළු දමා ඇත
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-indigo-950 mt-1">
                    සරල වචන හා රූප සම්බන්ධ කිරීම
                  </h2>
                </div>
              </div>

              {/* Level 2 Progress Score */}
              <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-200">
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-bold block">මට්ටමේ ලකුණු</span>
                  <span className="text-xl font-black text-indigo-600">{progress.levelScores?.level2 || 0}%</span>
                </div>
                <div className="text-2xl">{isLevel2Open ? '🌟' : '🔒'}</div>
              </div>
            </div>

            {/* 5 Exercises Grid for Level 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LEVEL2_EXERCISES.map((ex) => {
                const isUnlocked = overrideUnlockAll || (isLevel2Open && progressionManager.isExerciseUnlocked(ex.id));
                const score = progress.exerciseScores?.[ex.id];
                const isCompleted = progress.completedExercises?.includes(ex.id);

                return (
                  <div
                    key={ex.id}
                    onClick={() => handleCardClick(ex, 2)}
                    className={`${ex.bgLight} rounded-3xl p-5 border-2 ${
                      isUnlocked
                        ? `${ex.borderColor} hover:border-indigo-400 hover:shadow-xl cursor-pointer transform hover:-translate-y-1 group`
                        : 'border-slate-300 opacity-60 cursor-not-allowed bg-slate-100'
                    } transition-all relative flex flex-col justify-between h-48`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${ex.color} text-white flex items-center justify-center font-black text-lg shadow-md`}>
                        {ex.num}
                      </div>
                      <span className="text-3xl group-hover:scale-125 transition-transform drop-shadow-sm">
                        {isUnlocked ? ex.icon : '🔒'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-700 transition-colors">
                        {ex.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                        {ex.sub}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <span className="text-[11px] font-bold text-indigo-700 bg-white px-2.5 py-0.5 rounded-full shadow-xs border">
                        {isCompleted ? `✓ ${score}%` : ex.badge}
                      </span>
                      <span className="text-xs font-extrabold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        {isUnlocked ? 'ආරම්භ කරන්න ➔' : 'අගුළු දමා ඇත 🔒'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Level 2 Lock Banner if locked */}
            {!isLevel2Open && (
              <div className="mt-6 p-4 bg-amber-100/80 rounded-2xl border border-amber-300 flex items-center justify-center gap-3 text-amber-900 font-bold text-sm">
                <span>🔒</span>
                <span>මෙම මට්ටම විවෘත කරගැනීමට Level 1 හි ලකුණු 75%ක් ලබා ගන්න!</span>
              </div>
            )}
          </div>


          {/* ══════════════════════════════════════════════
              LEVEL 3: වාක්‍ය ගොඩනැගීම හා ස්වාධීන ලිවීම
             ══════════════════════════════════════════════ */}
          <div className={`rounded-[2.5rem] p-6 md:p-8 shadow-2xl transition-all relative overflow-hidden ${
            isLevel3Open
              ? 'bg-white/95 backdrop-blur-md border-6 border-emerald-300'
              : 'bg-slate-100/90 border-4 border-slate-300 opacity-90'
          }`}>
            
            {/* Level Banner Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b-2 border-emerald-100 gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg border-2 border-white ${
                  isLevel3Open ? 'bg-gradient-to-tr from-emerald-500 to-teal-600' : 'bg-slate-400'
                }`}>
                  3
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      මට්ටම 03 · උසස්
                    </span>
                    {isLevel3Open ? (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span>✓</span> විවෘතයි
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span>🔒</span> අගුළු දමා ඇත
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-emerald-950 mt-1">
                    වාක්‍ය ගොඩනැගීම හා ස්වාධීන ලිවීම
                  </h2>
                </div>
              </div>

              {/* Level 3 Progress Score */}
              <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-bold block">මට්ටමේ ලකුණු</span>
                  <span className="text-xl font-black text-emerald-600">{progress.levelScores?.level3 || 0}%</span>
                </div>
                <div className="text-2xl">{isLevel3Open ? '👑' : '🔒'}</div>
              </div>
            </div>

            {/* 3 Exercises Grid for Level 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LEVEL3_EXERCISES.map((ex) => {
                const isUnlocked = overrideUnlockAll || (isLevel3Open && progressionManager.isExerciseUnlocked(ex.id));
                const score = progress.exerciseScores?.[ex.id];
                const isCompleted = progress.completedExercises?.includes(ex.id);

                return (
                  <div
                    key={ex.id}
                    onClick={() => handleCardClick(ex, 3)}
                    className={`${ex.bgLight} rounded-3xl p-5 border-2 ${
                      isUnlocked
                        ? `${ex.borderColor} hover:border-emerald-400 hover:shadow-xl cursor-pointer transform hover:-translate-y-1 group`
                        : 'border-slate-300 opacity-60 cursor-not-allowed bg-slate-100'
                    } transition-all relative flex flex-col justify-between h-48`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${ex.color} text-white flex items-center justify-center font-black text-lg shadow-md`}>
                        {ex.num}
                      </div>
                      <span className="text-3xl group-hover:scale-125 transition-transform drop-shadow-sm">
                        {isUnlocked ? ex.icon : '🔒'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {ex.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                        {ex.sub}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <span className="text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-0.5 rounded-full shadow-xs border">
                        {isCompleted ? `✓ ${score}%` : ex.badge}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        {isUnlocked ? 'ආරම්භ කරන්න ➔' : 'අගුළු දමා ඇත 🔒'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Level 3 Lock Banner if locked */}
            {!isLevel3Open && (
              <div className="mt-6 p-4 bg-amber-100/80 rounded-2xl border border-amber-300 flex items-center justify-center gap-3 text-amber-900 font-bold text-sm">
                <span>🔒</span>
                <span>මෙම උසස් මට්ටම විවෘත කරගැනීමට Level 2 හි ලකුණු 75%ක් ලබා ගන්න!</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── INTERACTIVE LOCKED EXERCISE MODAL ── */}
      {lockModalInfo && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[3rem] p-6 md:p-8 max-w-md w-full shadow-2xl border-8 border-amber-400 text-center animate-bounce-short">
            <div className="text-6xl mb-2 animate-pulse">🔒🚫</div>
            <h3 className="text-2xl font-black text-amber-900 mb-1">අභ්‍යාසය අගුළු දමා ඇත!</h3>
            <p className="text-sm text-slate-600 font-bold mb-4">{lockModalInfo.message}</p>
            
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs font-black text-amber-950 mb-6">
              💡 ඉඟිය: පෙර අභ්‍යාසය ආරම්භ කර සාර්ථකව අවසන් කරන්න.
            </div>

            <button
              onClick={() => setLockModalInfo(null)}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-base rounded-2xl shadow-lg cursor-pointer transition-all active:scale-95"
            >
              තේරුණා (හරි) 👍
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
