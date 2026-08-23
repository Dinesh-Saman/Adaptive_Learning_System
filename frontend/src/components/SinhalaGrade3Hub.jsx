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

export default function SinhalaGrade3Hub({ onExit }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const GRADE3_LEVELS = [
    {
      levelNum: 1,
      title: 'Level 1: මූලික අක්ෂර, වචන සහ ලිංග භේදය',
      sub: 'Foundation Characters, Words & Gender Classification',
      themeColor: 'from-sky-500 to-blue-600',
      badgeBg: 'bg-sky-500',
      activities: [
        {
          id: 'g3_l1_act1',
          actNum: 1,
          title: 'ගැලපෙන අක්ෂරය තෝරා ලියන්න',
          sub: 'හිස්තැනට අකුර තෝරා තිත් ඉරි මත ලියමු (10 Questions with single dotted tracing)',
          icon: '✏️',
          route: '/module/sinhala/grade3-level1-act1',
          color: 'from-amber-400 to-orange-500',
          bgLight: 'bg-amber-50',
          borderColor: 'border-amber-300'
        },
        {
          id: 'g3_l1_act3',
          actNum: 3,
          title: 'වචන අර්ථය, වාක්‍ය ලිවීම සහ ලිංග භේද දුම්රිය',
          sub: 'පුරුෂ/ස්ත්‍රී ලිංග දුම්රිය & වෘත්තීය නාම වාක්‍ය ලිවීම',
          icon: '🚂',
          route: '/module/sinhala/grade3-level1-act3',
          color: 'from-pink-400 to-rose-500',
          bgLight: 'bg-pink-50',
          borderColor: 'border-pink-300'
        },
        {
          id: 'g3_l1_act4',
          actNum: 4,
          title: 'රූපයට ගැළපෙන වචනය තෝරන්න',
          sub: 'රූපයට වචනය තෝරා තිත් ඉරි මත ලියන්න (Rain, House, Sunny, Nose, Horse)',
          icon: '🖼️',
          route: '/module/sinhala/grade3-level1-act4',
          color: 'from-purple-400 to-indigo-500',
          bgLight: 'bg-purple-50',
          borderColor: 'border-purple-300'
        },
        {
          id: 'g3_l1_act5',
          actNum: 5,
          title: 'ශබ්දයෙන් ආරම්භ වන වචන තෝරන්න',
          sub: 'ක, ග, ප, ම, අ ශබ්දවලින් ආරම්භ වන වචන තෝරා තහවුරු කරන්න',
          icon: '🎯',
          route: '/module/sinhala/grade3-level1-act5',
          color: 'from-emerald-400 to-teal-500',
          bgLight: 'bg-emerald-50',
          borderColor: 'border-emerald-300'
        }
      ]
    },
    {
      levelNum: 2,
      title: 'Level 2: නාම පද, පිල්ලම්, විරාම ලකුණු සහ යුගල පද',
      sub: 'Noun Sorting, Pillam Categories, Punctuation & Word Pairs',
      themeColor: 'from-purple-600 to-indigo-600',
      badgeBg: 'bg-purple-600',
      activities: [
        {
          id: 'g3_l2_act1',
          actNum: 1,
          title: 'නාම පද වර්ග කරමු',
          sub: 'සත්ත්ව, පුද්ගල, ද්‍රව්‍ය සහ ස්ථාන නාම 20ක් වර්ගීකරණය කරමු',
          icon: '🦁',
          route: '/module/sinhala/grade3-level2-act1',
          color: 'from-amber-400 to-orange-500',
          bgLight: 'bg-amber-50',
          borderColor: 'border-amber-300'
        },
        {
          id: 'g3_l2_act2',
          actNum: 2,
          title: 'පිල්ලම් වර්ගීකරණය',
          sub: 'ඇලපිල්ල, ඉස්පිල්ල, දීර්ඝ ඉස්පිල්ල, දීර්ඝ ඇදය, කොම්බුව වර්ග කරමු',
          icon: '🏷️',
          route: '/module/sinhala/grade3-level2-act2',
          color: 'from-sky-400 to-blue-500',
          bgLight: 'bg-sky-50',
          borderColor: 'border-sky-300'
        },
        {
          id: 'g3_l2_act3',
          actNum: 3,
          title: 'විරාම ලකුණු තෝරන්න & රවුම් කරන්න',
          sub: 'තිත (.), ප්‍රශ්නාර්ථය (?), විස්මයාර්ථය (!) තෝරා රවුම් කරමු',
          icon: '🦉',
          route: '/module/sinhala/grade3-level2-act3',
          color: 'from-emerald-400 to-green-600',
          bgLight: 'bg-emerald-50',
          borderColor: 'border-emerald-300'
        },
        {
          id: 'g3_l2_act4',
          actNum: 4,
          title: 'වචන නිවැරදි ලෙස ගලපා වාක්‍යය ලියන්න',
          sub: 'වචන අනුපිළිවෙලට සකසා සම්පූර්ණ වාක්‍යය තිත් ඉරි මත ලියන්න',
          icon: '🧩',
          route: '/module/sinhala/grade3-level2-act4',
          color: 'from-orange-400 to-amber-600',
          bgLight: 'bg-orange-50',
          borderColor: 'border-orange-300'
        },
        {
          id: 'g3_l2_act5',
          actNum: 5,
          title: 'ගැළපෙන පද යා කරන්න',
          sub: 'ගමන් බිමන්, අහල පහල, සිරිත් විරිත්, කෑම බීම යුගල පද යා කරමු',
          icon: '🔗',
          route: '/module/sinhala/grade3-level2-act5',
          color: 'from-pink-400 to-purple-500',
          bgLight: 'bg-pink-50',
          borderColor: 'border-pink-300'
        }
      ]
    },
    {
      levelNum: 3,
      title: 'Level 3: සමාන පද, තේරවිලි සහ අර්ථ විවරණ',
      sub: 'Synonyms, Sinhala Riddles & Definitions',
      themeColor: 'from-emerald-600 to-teal-700',
      badgeBg: 'bg-emerald-600',
      activities: [
        {
          id: 'g3_l3_act1',
          actNum: 1,
          title: 'සමාන පද තෝරන්න',
          sub: 'ලස්සන, සතුට, වතුර, ඇඟ, සාගරය සමාන පද තෝරා වාක්‍ය ලියන්න',
          icon: '🌸',
          route: '/module/sinhala/grade3-level3-act1',
          color: 'from-rose-400 to-pink-600',
          bgLight: 'bg-rose-50',
          borderColor: 'border-rose-300'
        },
        {
          id: 'g3_l3_act3',
          actNum: 3,
          title: 'තේරවිලි තෝරා පිළිතුර ලියන්න',
          sub: 'කොකා, ඉදල, කරවිල, යතුර, පොල් තේරවිලි කවි විසඳා ලියන්න',
          icon: '📜',
          route: '/module/sinhala/grade3-level3-act3',
          color: 'from-amber-400 to-yellow-600',
          bgLight: 'bg-amber-50',
          borderColor: 'border-amber-300'
        },
        {
          id: 'g3_l3_act4',
          actNum: 4,
          title: 'අර්ථයට ගැළපෙන වචනය තෝරන්න',
          sub: 'වියලි, පාසල, සඳ, එළදෙන, පුස්තකාලය තෝරා වාක්‍යය ලියන්න',
          icon: '💡',
          route: '/module/sinhala/grade3-level3-act4',
          color: 'from-purple-400 to-indigo-600',
          bgLight: 'bg-purple-50',
          borderColor: 'border-purple-300'
        }
      ]
    },
    {
      levelNum: 4,
      title: 'Level 4: විරුද්ධාර්ථ, ලියන බස, ප්‍රස්ථාපිරුළු, ආරාධනා පත්‍ර & අවබෝධය',
      sub: 'Antonyms, Written Grammar, Proverbs, Invitation Cards & Comprehension',
      themeColor: 'from-amber-600 to-orange-700',
      badgeBg: 'bg-amber-600',
      activities: [
        {
          id: 'g3_l4_act1',
          actNum: 1,
          title: 'විරුද්ධාර්ථ පද යොදා වාක්‍ය සම්පූර්ණ කරන්න',
          sub: 'වේගයෙන් ↔ හිමින්, කීකරු ↔ අකීකරු, ප්‍රශ්න ↔ පිළිතුරු විරුද්ධ පද පුරවමු',
          icon: '↔️',
          route: '/module/sinhala/grade3-level4-act1',
          color: 'from-blue-400 to-indigo-600',
          bgLight: 'bg-blue-50',
          borderColor: 'border-blue-300'
        },
        {
          id: 'g3_l4_act2',
          actNum: 2,
          title: 'ලියන බසින් ලියන්න',
          sub: 'දුන්නාය, ගියෙමු, කරයි, ගියෙමි, ගත්තාය නිවැරදි ක්‍රියා පද තෝරමු',
          icon: '✍️',
          route: '/module/sinhala/grade3-level4-act2',
          color: 'from-emerald-400 to-teal-600',
          bgLight: 'bg-emerald-50',
          borderColor: 'border-emerald-300'
        },
        {
          id: 'g3_l4_act3',
          actNum: 3,
          title: 'අදහසට ගැළපෙන ප්‍රස්ථාපිරුළ තෝරන්න',
          sub: 'පරංගියා කෝට්ටේ ගියා වගෙයි, පිස්සාගේ පලා මල්ල වගේ ප්‍රස්ථාපිරුළු',
          icon: '📜',
          route: '/module/sinhala/grade3-level4-act3',
          color: 'from-purple-400 to-indigo-600',
          bgLight: 'bg-purple-50',
          borderColor: 'border-purple-300'
        },
        {
          id: 'g3_l4_act4',
          actNum: 4,
          title: 'ආරාධනා පත්‍රයක් ලියමු',
          sub: 'උපන් දින සාදය, දිනය, වේලාව, ස්ථානය යොදා ආරාධනා පත්‍රය සම්පූර්ණ කරමු',
          icon: '💌',
          route: '/module/sinhala/grade3-level4-act4',
          color: 'from-pink-400 to-rose-600',
          bgLight: 'bg-pink-50',
          borderColor: 'border-pink-300'
        },
        {
          id: 'g3_l4_act5',
          actNum: 5,
          title: 'ඡේදය කියවා පිළිතුරු සපයන්න',
          sub: 'සරුංගල් සාදන ළමයින්ගේ කතාව කියවා ප්‍රශ්න වලට පිළිතුරු දෙමු',
          icon: '🪁',
          route: '/module/sinhala/grade3-level4-act5',
          color: 'from-amber-400 to-yellow-600',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-purple-50 to-emerald-100 font-sinhala select-none relative overflow-x-hidden pb-12">
      
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
              <span>3 ශ්‍රේණිය</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          {/* Center Main Title Banner */}
          <div className="flex-1 max-w-lg bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white py-2.5 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base lg:text-lg font-black tracking-wide text-yellow-200 drop-shadow">
              3 ශ්‍රේණිය — සිංහල භාෂා ඉගෙනුම් කේන්ද්‍රස්ථානය
            </h1>
          </div>

          <button
            onClick={() => {
              playSound('click');
              speakSinhala('3 ශ්‍රේණිය සිංහල භාෂා ඉගෙනුම් කේන්ද්‍රස්ථානය වෙත සාදරයෙන් පිළිගනිමු.');
            }}
            className="w-11 h-11 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
            title="හඬ අසන්න"
          >
            🔊
          </button>
        </div>

        {/* ── Subtitle Hero Card ── */}
        <div className="max-w-4xl mx-auto w-full mt-4 bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-lg border-3 border-purple-200 flex items-center justify-between gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md flex-shrink-0">
            🌟
          </div>
          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-black text-purple-950">
              Grade 3 Sinhala Learning Hub
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
              මට්ටම් 4ක් යටතේ විවිධ අභ්‍යාස 13ක් සම්පූර්ණ කර තරු ලකුණු එකතු කරන්න!
            </p>
          </div>
          <div className="text-3xl sm:text-4xl flex-shrink-0 animate-bounce">
            👦👧
          </div>
        </div>
      </div>

      {/* ── LEVEL & ACTIVITIES SECTIONS ── */}
      <div className="max-w-6xl mx-auto w-full px-4 mt-6 flex flex-col gap-8">
        {GRADE3_LEVELS.map((level) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {level.activities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => handleCardClick(act)}
                  className={`bg-white rounded-[2rem] p-5 shadow-md hover:shadow-2xl border-3 ${act.borderColor} hover:border-purple-400 transition-all duration-300 flex flex-col justify-between min-h-[170px] cursor-pointer group transform hover:-translate-y-1 relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-100 to-indigo-100 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {act.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest block">
                          Activity {act.actNum}
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-slate-800 group-hover:text-purple-700 transition-colors leading-snug">
                          {act.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-500 text-xs font-bold leading-relaxed line-clamp-2 my-1">
                    {act.sub}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-purple-700 group-hover:text-purple-900">
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
