import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Web Audio Synthesizer ──
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    if (type === 'click') {
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

export default function SinhalaGrade4Hub({ onExit }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // ── Grade 4 Level-Organized Curriculum ──
  const GRADE4_LEVELS = [
    {
      levelNum: 1,
      title: 'Level 1: මූලික නාම පද, රූප, වර්ගීකරණය සහ අක්ෂර',
      sub: 'Basic Nouns, Word Image Association, Singular/Plural & Letter Tracing',
      themeColor: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-500',
      activities: [
        {
          id: 'g4_l1_act1',
          actNum: 1,
          title: 'රූපයෙන් වචන හා වාක්‍ය ලිවීම',
          sub: 'මොනරා, දෙහි, කූඩ, කුරුල්ලා, පාලම රූප හඳුනාගෙන වාක්‍ය ලියමු',
          icon: '🦚',
          route: '/module/sinhala/grade4-level1-act1',
          color: 'from-emerald-400 to-teal-500',
          bgLight: 'bg-emerald-50',
          borderColor: 'border-emerald-300'
        },
        {
          id: 'g4_l1_act2',
          actNum: 2,
          title: 'අයත් නොවන වචනය සොයමු',
          sub: 'බස් රථය, පොත, කුකුළා, කඩදාසිය, ගල අයත් නොවන වචන සොයා ලියමු',
          icon: '🔍',
          route: '/module/sinhala/grade4-level1-act2',
          color: 'from-sky-400 to-blue-500',
          bgLight: 'bg-sky-50',
          borderColor: 'border-sky-300'
        },
        {
          id: 'g4_l1_act3',
          actNum: 3,
          title: 'නාම පද වර්ග කරමු (ඒක/බහු)',
          sub: 'අලි, බල්ලා, කුරුල්ලෝ, සිසුන්, මල් ඒකවචන හා බහුවචන වෙන් කරමු',
          icon: '🐘',
          route: '/module/sinhala/grade4-level1-act3',
          color: 'from-amber-400 to-orange-500',
          bgLight: 'bg-amber-50',
          borderColor: 'border-amber-300'
        },
        {
          id: 'g4_l1_act4',
          actNum: 4,
          title: 'හිස්තැනට නිවැරදි අක්ෂරය තෝරමු',
          sub: 'පුස්තකාලය, මරණ, නොමළ, පුෂ්පය, පරිගණකය අකුරු තෝරා ලියමු',
          icon: '✏️',
          route: '/module/sinhala/grade4-level1-act4',
          color: 'from-purple-400 to-indigo-500',
          bgLight: 'bg-purple-50',
          borderColor: 'border-purple-300'
        }
      ]
    },
    {
      levelNum: 2,
      title: 'Level 2: විරාම ලකුණු, යුගල පද සහ ස්වර/ව්‍යංජන',
      sub: 'Punctuation Marks, Paired Words & Vowel/Consonant Classification',
      themeColor: 'from-purple-600 to-indigo-600',
      badgeBg: 'bg-purple-600',
      activities: [
        {
          id: 'g4_l2_act1',
          actNum: 1,
          title: 'මතක් කර ගනිමු - විරාම ලක්ෂණ',
          sub: 'තිත (.), ප්‍රශ්නාර්ථය (?), විස්මයාර්ථය (!), කොමාව (,) යොදා වාක්‍ය ලියමු',
          icon: '📝',
          route: '/module/sinhala/grade4-level2-act1',
          color: 'from-purple-400 to-indigo-500',
          bgLight: 'bg-purple-50',
          borderColor: 'border-purple-300'
        },
        {
          id: 'g4_l2_act2',
          actNum: 2,
          title: 'යුගල පද සම්පූර්ණ කරමු',
          sub: 'ගෙවල් දොරවල්, යාන වාහන, වතු පිටි, කෙළි සෙල්ලම්, පොත් පත් ලියමු',
          icon: '🧩',
          route: '/module/sinhala/grade4-level2-act2',
          color: 'from-emerald-400 to-teal-500',
          bgLight: 'bg-emerald-50',
          borderColor: 'border-emerald-300'
        },
        {
          id: 'g4_l2_act3',
          actNum: 3,
          title: 'ස්වර හා ව්‍යංජන අක්ෂර තෝරමු',
          sub: 'අ, ඉ, උ ස්වර අකුරු සහ ග, න, ල ව්‍යංජන අකුරු වෙන් කර ලියමු',
          icon: '☁️',
          route: '/module/sinhala/grade4-level2-act3',
          color: 'from-pink-400 to-rose-500',
          bgLight: 'bg-pink-50',
          borderColor: 'border-pink-300'
        }
      ]
    },
    {
      levelNum: 3,
      title: 'Level 3: වාක්‍ය සම්පූර්ණ කිරීම, කෙටි කතා, කාලය සහ ප්‍රස්ථා පිරුළු',
      sub: 'Sentence Completion, Story Comprehension, Tenses & Sinhala Proverbs',
      themeColor: 'from-teal-600 to-emerald-700',
      badgeBg: 'bg-teal-600',
      activities: [
        {
          id: 'g4_l3_act1',
          actNum: 1,
          title: 'වාක්‍ය සම්පූර්ණ කරමු',
          sub: 'කතාවක්, ඉක්මනින්, වර්ධනය, ගුරුවරුන්, වගකීම යොදා වාක්‍ය ලියමු',
          icon: '📖',
          route: '/module/sinhala/grade4-level3-act1',
          color: 'from-teal-400 to-emerald-500',
          bgLight: 'bg-teal-50',
          borderColor: 'border-teal-300'
        },
        {
          id: 'g4_l3_act2',
          actNum: 2,
          title: 'කෙටි කතාව කියවා පිළිතුරු දෙමු',
          sub: 'මලීගේ කතාව කියවා ප්‍රශ්න 5කට නිවැරදි පිළිතුරු තෝරා ලියමු',
          icon: '👧',
          route: '/module/sinhala/grade4-level3-act2',
          color: 'from-amber-400 to-yellow-500',
          bgLight: 'bg-amber-50',
          borderColor: 'border-amber-300'
        },
        {
          id: 'g4_l3_act3',
          actNum: 3,
          title: 'කාලය හා ලිඛිත භාෂාව',
          sub: 'වර්තමාන හා අතීත කාලය හඳුනාගෙන නිවැරදි ලිඛිත භාෂාවට පරිවර්තනය කරමු',
          icon: '⏳',
          route: '/module/sinhala/grade4-level3-act3',
          color: 'from-indigo-400 to-purple-500',
          bgLight: 'bg-indigo-50',
          borderColor: 'border-indigo-300'
        },
        {
          id: 'g4_l3_act4',
          actNum: 4,
          title: 'ප්‍රස්ථා පිරුළු තෝරමු',
          sub: 'කබලෙන් ලිපට, ආඬි හත්දෙනාගේ කැඳ හැළිය, කළුවා මාරපන ගියා, ඉඟුරු දී මිරිස්',
          icon: '📜',
          route: '/module/sinhala/grade4-level3-act4',
          color: 'from-amber-500 to-orange-600',
          bgLight: 'bg-amber-50',
          borderColor: 'border-amber-300'
        }
      ]
    },
    {
      levelNum: 4,
      title: 'Level 4: අක්ෂර වින්‍යාසය, නිවැරදි වාක්‍ය, විරුද්ධ පද සහ කතාව කියවා පිළිතුරු දෙමු',
      sub: 'Spelling Precision, Punctuated Sentences, Antonyms & Story Comprehension',
      themeColor: 'from-amber-600 to-orange-700',
      badgeBg: 'bg-amber-600',
      activities: [
        {
          id: 'g4_l4_act1',
          actNum: 1,
          title: 'නිවැරදි අක්ෂරය තෝරමු',
          sub: 'දේශගුණය, සම්පූර්ණ, ආත්මාර්ථකාමී, සෞන්දර්ය, නිශ්චල අකුරු තෝරා ලියමු',
          icon: '💎',
          route: '/module/sinhala/grade4-level4-act1',
          color: 'from-purple-400 to-pink-500',
          bgLight: 'bg-purple-50',
          borderColor: 'border-purple-300'
        },
        {
          id: 'g4_l4_act2',
          actNum: 2,
          title: 'නිවැරදි වාක්‍යය තෝරමු',
          sub: 'ප්‍රශ්නාර්ථ (?), විස්මයාර්ථ (!), කොමා (,), උඩුකොමා (" "), තිත් (.) සහ දින',
          icon: '✍️',
          route: '/module/sinhala/grade4-level4-act2',
          color: 'from-teal-400 to-emerald-500',
          bgLight: 'bg-teal-50',
          borderColor: 'border-teal-300'
        },
        {
          id: 'g4_l4_act3',
          actNum: 3,
          title: 'විරුද්ධ පද තෝරමු',
          sub: 'පැමිණීම ↔ පිටවීම, අවශ්‍ය ↔ අනවශ්‍ය, පුහුණු ↔ නුපුහුණු, වැරදි ↔ නිවැරදි, පිරිසිදු ↔ අපිරිසිදු',
          icon: '↔️',
          route: '/module/sinhala/grade4-level4-act3',
          color: 'from-rose-400 to-pink-500',
          bgLight: 'bg-rose-50',
          borderColor: 'border-rose-300'
        },
        {
          id: 'g4_l4_act4',
          actNum: 4,
          title: 'කතාව කියවා පිළිතුරු දෙමු',
          sub: 'ජාතක කතාව කියවා ප්‍රශ්න 5කට නිවැරදි පිළිතුරු තෝරා ලියමු',
          icon: '🐂',
          route: '/module/sinhala/grade4-level4-act4',
          color: 'from-amber-400 to-emerald-500',
          bgLight: 'bg-amber-50',
          borderColor: 'border-amber-300'
        }
      ]
    }
  ];

  const handleCardClick = (act) => {
    playSound('click');
    speakSinhala(act.title);
    navigate(act.route);
  };

  const filteredLevels = activeTab === 'all' 
    ? GRADE4_LEVELS 
    : GRADE4_LEVELS.filter(l => l.levelNum === parseInt(activeTab, 10));

  const totalActivitiesCount = GRADE4_LEVELS.reduce((acc, l) => acc + l.activities.length, 0);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed font-sinhala select-none relative overflow-x-hidden pb-12"
      style={{ backgroundImage: "url('/images/grade4_bg.png')" }}
    >
      
      {/* ── TOP HEADER BAR ── */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-4">
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
              <span>4 ශ්‍රේණිය</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          {/* Center Main Title Banner */}
          <div className="flex-1 max-w-lg bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white py-2.5 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base lg:text-lg font-black tracking-wide text-yellow-200 drop-shadow">
              4 ශ්‍රේණිය — සිංහල භාෂා ඉගෙනුම් කේන්ද්‍රස්ථානය
            </h1>
          </div>

        </div>

        {/* ── Subtitle Hero Card ── */}
        <div className="max-w-4xl mx-auto w-full mt-4 bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-lg border-3 border-emerald-200 flex items-center justify-between gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-2xl shadow-md flex-shrink-0">
            🦚
          </div>
          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-black text-emerald-950">
              Grade 4 Sinhala Learning Hub
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
              මට්ටම් 4ක් යටතේ විවිධ අභ්‍යාස {totalActivitiesCount}ක් සම්පූර්ණ කර තරු ලකුණු එකතු කරන්න!
            </p>
          </div>
          <div className="text-3xl sm:text-4xl flex-shrink-0 animate-bounce">
            👧👦
          </div>
        </div>

        {/* ── Level Filter Tabs ── */}
        <div className="max-w-3xl mx-auto w-full mt-4 flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('all');
            }}
            className={`py-2 px-4 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-purple-700 text-white ring-2 ring-purple-300 scale-105'
                : 'bg-white/90 hover:bg-white text-slate-700 border border-purple-200'
            }`}
          >
            🌟 සියලු මට්ටම් ({totalActivitiesCount})
          </button>
          {GRADE4_LEVELS.map((lvl) => (
            <button
              key={lvl.levelNum}
              onClick={() => {
                playSound('click');
                setActiveTab(lvl.levelNum.toString());
              }}
              className={`py-2 px-4 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer ${
                activeTab === lvl.levelNum.toString()
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 scale-105'
                  : 'bg-white/90 hover:bg-white text-slate-700 border border-emerald-200'
              }`}
            >
              Level {lvl.levelNum} ({lvl.activities.length})
            </button>
          ))}
        </div>
      </div>

      {/* ── LEVEL & ACTIVITIES SECTIONS ── */}
      <div className="max-w-6xl mx-auto w-full px-4 mt-6 flex flex-col gap-8">
        {filteredLevels.map((level) => (
          <div key={level.levelNum} className="flex flex-col gap-3">
            
            {/* Level Header Banner */}
            <div className={`p-3.5 bg-gradient-to-r ${level.themeColor} text-white rounded-3xl shadow-lg flex items-center justify-between gap-3 border-2 border-white`}>
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-2xl bg-white/20 text-white font-black text-base flex items-center justify-center border border-white/40">
                  L{level.levelNum}
                </span>
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-black leading-tight drop-shadow-sm">
                    {level.title}
                  </h3>
                  <span className="text-[11px] text-white/80 font-bold block">{level.sub}</span>
                </div>
              </div>
              <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full border border-white/30">
                අභ්‍යාස {level.activities.length}ක්
              </span>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {level.activities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => handleCardClick(act)}
                  className={`bg-white rounded-[2rem] p-5 shadow-md hover:shadow-2xl border-3 ${act.borderColor} hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between min-h-[175px] cursor-pointer group transform hover:-translate-y-1 relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-100 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {act.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block">
                          Activity {act.actNum}
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug">
                          {act.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-500 text-xs font-bold leading-relaxed line-clamp-2 my-1">
                    {act.sub}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-emerald-700 group-hover:text-emerald-900">
                    <span>ආරම්භ කරන්න</span>
                    <span className="text-base group-hover:translate-x-1 transition-transform">➔</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
