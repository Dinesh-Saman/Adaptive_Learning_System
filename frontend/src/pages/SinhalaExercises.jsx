import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Exercise Bank: 35 unique questions, AI picks 10 per session ──────────────
const ALL_EXERCISES = [

  // ══════════════════ DIFFICULTY 1 — Basic words & pictures ══════════════════
  {
    id: "wpm_1", type: "WordPictureMatch", difficulty: 1,
    title: "රූපයට ගැළපෙන වචනය තෝරන්න",
    words: ["අලියා", "අන්නාසි", "මාළුවා"],
    pictures: [
      { src: "/images/sinhala/elephant.jpg",  label: "අලියා"   },
      { src: "/images/sinhala/pineapple.jpg", label: "අන්නාසි" },
      { src: "/images/sinhala/fish.jpg",      label: "මාළුවා"  },
    ]
  },
  {
    id: "wpm_2", type: "WordPictureMatch", difficulty: 1,
    title: "රූපයට ගැළපෙන වචනය තෝරන්න",
    words: ["අලියා", "ගස", "අන්නාසි"],
    pictures: [
      { src: "/images/sinhala/elephant.jpg",  label: "අලියා"   },
      { src: "/images/sinhala/mangotree.jpg", label: "ගස"       },
      { src: "/images/sinhala/pineapple.jpg", label: "අන්නාසි" },
    ]
  },
  { id: "ms_1", type: "MissingSyllable", difficulty: 1,
    title: "නිවැරදි අක්ෂරය තෝරන්න",
    image: "/images/sinhala/fish.jpg",
    suffix: "ාළුවා", answer: "ම", options: ["ම","ක","ල","ප"] },
  { id: "ms_2", type: "MissingSyllable", difficulty: 1,
    title: "නිවැරදි අක්ෂරය තෝරන්න",
    image: "/images/sinhala/pineapple.jpg",
    suffix: "න්නාසි", answer: "අ", options: ["අ","ඉ","උ","ම"] },
  { id: "mc_1", type: "MultipleChoice", difficulty: 1,
    question: "අලියා ජීවත් වෙන්නේ කොතනද?",
    options: ["ජලයේ","කැලේ","ගෙදර","ගුවනේ"], answer: "කැලේ" },
  { id: "mc_2", type: "MultipleChoice", difficulty: 1,
    question: "මාළුවා ජීවත් වෙන්නේ කොතනද?",
    options: ["ගෙදර","ගස් මත","ජලයේ","ගල් මත"], answer: "ජලයේ" },
  { id: "mc_3", type: "MultipleChoice", difficulty: 1,
    question: "ඉරු උදාවෙන්නේ කොයි දිශාවෙන්ද?",
    options: ["බටහිරින්","දකුණෙන්","නැගෙනහිරින්","උතුරෙන්"], answer: "නැගෙනහිරින්" },
  { id: "mc_4", type: "MultipleChoice", difficulty: 1,
    question: "ගස් කොළ සාමාන්‍යයෙන් කොයි වර්ණයෙන් පෙනෙනවාද?",
    options: ["රතු","නිල්","කොළ","කහ"], answer: "කොළ" },

  // ══════════════════ DIFFICULTY 2 — Basic facts & nature ══════════════════
  {
    id: "wpm_3", type: "WordPictureMatch", difficulty: 2,
    title: "රූපයට ගැළපෙන වචනය තෝරන්න",
    words: ["මාළුවා", "ගස", "අලියා"],
    pictures: [
      { src: "/images/sinhala/fish.jpg",      label: "මාළුවා" },
      { src: "/images/sinhala/mangotree.jpg", label: "ගස"     },
      { src: "/images/sinhala/elephant.jpg",  label: "අලියා"  },
    ]
  },
  { id: "ms_3", type: "MissingSyllable", difficulty: 2,
    title: "නිවැරදි අක්ෂරය තෝරන්න",
    image: "/images/sinhala/elephant.jpg",
    suffix: "ලියා", answer: "අ", options: ["අ","ඉ","ල","ම"] },
  { id: "ms_4", type: "MissingSyllable", difficulty: 2,
    title: "නිවැරදි අක්ෂරය තෝරන්න",
    image: "/images/sinhala/mangotree.jpg",
    suffix: "ස", answer: "ග", options: ["ග","ක","ල","ප"] },
  { id: "mc_5", type: "MultipleChoice", difficulty: 2,
    question: "ශ්‍රී ලංකාවේ ජාතික ගසේ නම කුමක්ද?",
    options: ["නා ගස","පොල් ගස","අඹ ගස","දෙල් ගස"], answer: "නා ගස" },
  { id: "mc_6", type: "MultipleChoice", difficulty: 2,
    question: "ශ්‍රී ලංකාවේ ජාතික සත්ත්වයා කවුද?",
    options: ["ලිහිණියා","ගවයා","ශ්‍රී ලංකා අලියා","දේශීය හාවා"], answer: "ශ්‍රී ලංකා අලියා" },
  { id: "mc_7", type: "MultipleChoice", difficulty: 2,
    question: "ශ්‍රී ලංකාවේ ජාතික මලේ නම කුමක්ද?",
    options: ["රෝස","නිල් නෙළුම","සම්පගි","ජෑස්මින්"], answer: "නිල් නෙළුම" },
  { id: "mc_8", type: "MultipleChoice", difficulty: 2,
    question: "ගසෙන් ලැබෙන ආහාරය කුමක්ද?",
    options: ["ගල්","ජලය","ගෙඩි","රෙදි"], answer: "ගෙඩි" },

  // ══════════════════ DIFFICULTY 3 — Sri Lanka knowledge & basic language ══════════════════
  { id: "mc_9", type: "MultipleChoice", difficulty: 3,
    question: "ශ්‍රී ලංකාවේ ජාතික ක්‍රීඩාව කුමක්ද?",
    options: ["ක්‍රිකට්","පාපන්දු","වොලිබෝල්","රග්බි"], answer: "වොලිබෝල්" },
  { id: "mc_10", type: "MultipleChoice", difficulty: 3,
    question: "සිංහල අලුත් අවුරුද්ද සමරන්නේ කුමන මාසයේද?",
    options: ["ජනවාරි","මාර්තු","අප්‍රේල්","දෙසැම්බර්"], answer: "අප්‍රේල්" },
  { id: "mc_11", type: "MultipleChoice", difficulty: 3,
    question: "ශ්‍රී ලංකාවේ ජාතික ගීතය ආරම්භ වෙන්නේ?",
    options: ["නමෝ නමෝ","ශ්‍රී ලංකා මාතා","ජය ජය","අපේ රට"], answer: "ශ්‍රී ලංකා මාතා" },
  { id: "mc_12", type: "MultipleChoice", difficulty: 3,
    question: "ශ්‍රී ලංකාවේ ජාතික කුරුල්ලා කවුද?",
    options: ["ගිජු ලිහිණියා","ශ්‍රී ලංකා ළිහිණියා","ගොම්මනා","මල් කොකා"], answer: "ශ්‍රී ලංකා ළිහිණියා" },
  { id: "mc_13", type: "MultipleChoice", difficulty: 3,
    question: "\"ළමා\" යන්නෙහි \"ළ\" අකුර ලිය යුත්තේ කෙසේද?",
    options: ["ල","ළ","ල්","ළ්"], answer: "ළ" },
  { id: "ms_5", type: "MissingSyllable", difficulty: 3,
    title: "නිවැරදි අක්ෂරය තෝරන්න",
    image: "/images/sinhala/fish.jpg",
    suffix: "ාළු", answer: "ම", options: ["ම","ල","ප","ස"] },
  { id: "mc_14", type: "MultipleChoice", difficulty: 3,
    question: "\"ගෙදර\" යන්නෙහි \"ගෙ\" යනු කුමන ආකාරයේ පදයක්ද?",
    options: ["ක්‍රියා","නාම","සර්ව නාම","ආඛ්‍යාත"], answer: "නාම" },

  // ══════════════════ DIFFICULTY 4 — Grammar & language structure ══════════════════
  { id: "mc_15", type: "MultipleChoice", difficulty: 4,
    question: "\"ළමයා ගෙදර යයි\" — \"යයි\" යනු?",
    options: ["නාම","කර්තෘ","ක්‍රියාව","විශේෂණ"], answer: "ක්‍රියාව" },
  { id: "mc_16", type: "MultipleChoice", difficulty: 4,
    question: "\"ඔහු\", \"ඇය\", \"ඔවුන්\" — මේවා කුමන වර්ගයේ පද ද?",
    options: ["නාම","ක්‍රියා","සර්ව නාම","විශේෂණ"], answer: "සර්ව නාම" },
  { id: "mc_17", type: "MultipleChoice", difficulty: 4,
    question: "\"සුන්දර\" යන්න කුමන වර්ගයේ පදයක්ද?",
    options: ["නාම","ක්‍රියා","විශේෂණ","සර්ව නාම"], answer: "විශේෂණ" },
  { id: "mc_18", type: "MultipleChoice", difficulty: 4,
    question: "\"ා\", \"ි\", \"ී\", \"ු\" — මේවා සිංහල ලිපිවල?",
    options: ["ව්‍යංජන","ස්වර","ශ්‍රිත","ගණිත"], answer: "ස්වර" },
  { id: "mc_19", type: "MultipleChoice", difficulty: 4,
    question: "\"ළමයා ජලය බීවා\" — \"ළමයා\" යනු?",
    options: ["ක්‍රියාව","කර්ම","කර්තෘ","විශේෂණ"], answer: "කර්තෘ" },
  { id: "ms_6", type: "MissingSyllable", difficulty: 4,
    title: "නිවැරදි අක්ෂරය තෝරන්න",
    image: "/images/sinhala/elephant.jpg",
    suffix: "ිළිදෙනා", answer: "ළ", options: ["ළ","ල","ල්","ළ්"] },
  { id: "mc_20", type: "MultipleChoice", difficulty: 4,
    question: "\"ළ\" හා \"ල\" — කුමන වෙනස?",
    options: ["එකම අකුරු","ළ = දළ ළකාරය, ල = දන්ත ලකාරය","ල = දළ ළකාරය, ළ = දන්ත ලකාරය","දෙකම ස්වර"], answer: "ළ = දළ ළකාරය, ල = දන්ත ලකාරය" },

  // ══════════════════ DIFFICULTY 5 — Advanced grammar & spelling ══════════════════
  { id: "mc_21", type: "MultipleChoice", difficulty: 5,
    question: "\"ළමයා ජලය බීවා\" — \"ජලය\" යනු?",
    options: ["කර්තෘ","ක්‍රියාව","කර්ම","විශේෂණ"], answer: "කර්ම" },
  { id: "mc_22", type: "MultipleChoice", difficulty: 5,
    question: "\"ළමයා ජලය බීවා\" — \"බීවා\" යනු?",
    options: ["කර්තෘ","ක්‍රියාව","කර්ම","නාම"], answer: "ක්‍රියාව" },
  { id: "mc_23", type: "MultipleChoice", difficulty: 5,
    question: "\"ගොවිතැන\" නිවැරදිව ලිය යුත්තේ?",
    options: ["ගොවිතැන","ගෝවිතැන","ගොවිතැන්","ගෙවිතැන"], answer: "ගොවිතැන" },
  { id: "mc_24", type: "MultipleChoice", difficulty: 5,
    question: "\"රෑ\" + \"ට\" = ?",
    options: ["රෑ ට","රේට","රෑට","රෑt"], answer: "රෑට" },
  { id: "mc_25", type: "MultipleChoice", difficulty: 5,
    question: "\"ශ්‍රී ලංකා\" නිවැරදිව ලිය යුත්තේ?",
    options: ["ශ‍්‍රී ලංකා","ශ්‍රී ලංකා","ශ‍්‍රි ලංකා","ශ්‍රි ලංකා"], answer: "ශ්‍රී ලංකා" },
  { id: "mc_26", type: "MultipleChoice", difficulty: 5,
    question: "\"ළමා\" + \"ය\" = ?",
    options: ["ළමාය","ළමා ය","ළමය","ළමා-ය"], answer: "ළමාය" },
  { id: "mc_27", type: "MultipleChoice", difficulty: 5,
    question: "\"ළමයා ගෙදර ගියා\" — \"ළමයා\" කර්තෘ නිසා?",
    options: ["ක්‍රියාව කරන්නා","ශ්‍රිතය","ක්‍රියාව","කර්ම"], answer: "ක්‍රියාව කරන්නා" },
];

// ─── Adaptive selector ────────────────────────────────────────────────────────
function pickNextQuestion(history, allExercises, usedIds) {
  const available = allExercises.filter(q => !usedIds.has(q.id));
  if (available.length === 0) {
    return allExercises[Math.floor(Math.random() * allExercises.length)];
  }

  // Shuffle so ties are broken randomly, not by array order
  const shuffled = [...available].sort(() => Math.random() - 0.5);

  if (history.length === 0) {
    const minDiff = Math.min(...shuffled.map(q => q.difficulty));
    const easiest = shuffled.filter(q => q.difficulty === minDiff);
    return easiest[Math.floor(Math.random() * easiest.length)];
  }

  const recent = history.slice(-5);
  const recentScore = recent.filter(h => h.correct).length / recent.length;
  const currentDiff = history[history.length - 1]?.difficulty || 1;
  const targetDiff = recentScore > 0.6
    ? Math.min(5, currentDiff + 1)
    : Math.max(1, currentDiff - 1);

  const minDist = Math.min(...shuffled.map(q => Math.abs(q.difficulty - targetDiff)));
  const candidates = shuffled.filter(q => Math.abs(q.difficulty - targetDiff) === minDist);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// ─── Sub Components ───────────────────────────────────────────────────────────

function WordPictureMatch({ question, onSubmit }) {
  const [selectedWord, setSelectedWord] = useState(null);
  const [matches, setMatches] = useState({});

  const handleWordClick = (word) => {
    if (Object.values(matches).includes(word)) return;
    setSelectedWord(word);
  };

  const handlePicClick = (pic) => {
    if (!selectedWord) return;
    if (selectedWord === pic.label) {
      const newMatches = { ...matches, [pic.label]: selectedWord };
      setMatches(newMatches);
      setSelectedWord(null);
      if (Object.keys(newMatches).length === question.pictures.length) {
        setTimeout(() => onSubmit(true), 800);
      }
    } else {
      setSelectedWord(null);
    }
  };

  return (
    <div>
      <p style={{ color: '#555', marginBottom: 12, fontSize: 14 }}>
        ඉහළ වචනයක් තෝරා, ගැළපෙන රූපය ස්පර්ශ කරන්න.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        {question.words.map(w => {
          const isMatched = Object.values(matches).includes(w);
          const isSelected = selectedWord === w;
          return (
            <button key={w} onClick={() => handleWordClick(w)} disabled={isMatched}
              style={{
                padding: '10px 20px', borderRadius: 24, fontSize: 18, cursor: isMatched ? 'default' : 'pointer',
                border: isSelected ? '2px solid #ff9500' : '2px solid #b0c4de',
                background: isMatched ? '#d4edda' : isSelected ? '#ff9500' : '#fff',
                color: isMatched ? '#155724' : isSelected ? '#fff' : '#333',
                fontFamily: 'inherit', transition: 'all 0.15s'
              }}>
              {w}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {question.pictures.map(pic => {
          const matched = matches[pic.label];
          return (
            <div key={pic.label} onClick={() => handlePicClick(pic)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 12,
                border: `2px solid ${matched ? '#28a745' : selectedWord ? '#ff9500' : '#dee2e6'}`,
                cursor: matched ? 'default' : 'pointer',
                background: matched ? '#d4edda' : '#f8f9fa', transition: 'all 0.15s'
              }}>
              <img src={pic.src} alt={pic.label}
                style={{ width: 72, height: 72, objectFit: 'contain', borderRadius: 8, background: '#fff' }} />
              <span style={{ flex: 1, fontSize: 20, color: matched ? '#155724' : '#999', textAlign: 'center' }}>
                {matched || 'ස්පර්ශ කරන්න…'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MissingSyllable({ question, onSubmit }) {
  const [chosen, setChosen] = useState(null);

  const handleClick = (opt) => {
    if (chosen) return;
    setChosen(opt);
    setTimeout(() => onSubmit(opt === question.answer), 800);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 28 }}>
        <img src={question.image} alt="" style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 12 }} />
        <div style={{ fontSize: 36, fontWeight: 'bold', color: '#333' }}>
          <span style={{
            display: 'inline-block', minWidth: 50, borderBottom: '3px solid #ff9500',
            color: !chosen ? '#ff9500' : chosen === question.answer ? '#28a745' : '#dc3545',
            textAlign: 'center', marginRight: 2
          }}>
            {chosen || '___'}
          </span>
          {question.suffix}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {question.options.map(opt => (
          <button key={opt} onClick={() => handleClick(opt)}
            style={{
              padding: '14px 28px', borderRadius: 12, fontSize: 22, cursor: chosen ? 'default' : 'pointer',
              border: '2px solid',
              borderColor: !chosen ? '#b0c4de' : opt === question.answer ? '#28a745' : opt === chosen ? '#dc3545' : '#b0c4de',
              background: !chosen ? '#fff' : opt === question.answer ? '#d4edda' : opt === chosen ? '#f8d7da' : '#fff',
              color: '#333', fontFamily: 'inherit', fontWeight: 'bold', transition: 'all 0.2s'
            }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultipleChoice({ question, onSubmit }) {
  const [chosen, setChosen] = useState(null);

  const handleClick = (opt) => {
    if (chosen) return;
    setChosen(opt);
    setTimeout(() => onSubmit(opt === question.answer), 900);
  };

  return (
    <div>
      <div style={{
        fontSize: 20, fontWeight: 'bold', color: '#333',
        background: '#f0f4ff', borderRadius: 10, padding: '14px 18px', marginBottom: 24
      }}>
        {question.question}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {question.options.map(opt => {
          let bg = '#fff', border = '#b0c4de', color = '#333';
          if (chosen) {
            if (opt === question.answer) { bg = '#d4edda'; border = '#28a745'; color = '#155724'; }
            else if (opt === chosen)    { bg = '#f8d7da'; border = '#dc3545'; color = '#721c24'; }
          }
          return (
            <button key={opt} onClick={() => handleClick(opt)}
              style={{
                padding: '14px 20px', borderRadius: 10, fontSize: 17, textAlign: 'left',
                cursor: chosen ? 'default' : 'pointer',
                border: `2px solid ${border}`, background: bg, color,
                fontFamily: 'inherit', transition: 'all 0.2s',
                fontWeight: chosen && opt === question.answer ? 'bold' : 'normal'
              }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SinhalaExercises() {
  const navigate = useNavigate();
  const TOTAL = 10;
  const [step, setStep]       = useState(1);
  const [score, setScore]     = useState(0);
  const [history, setHistory] = useState([]);
  const [usedIds]             = useState(() => new Set());
  const [current, setCurrent] = useState(() => {
    const easiest = ALL_EXERCISES.filter(q => q.difficulty === 1);
    return easiest[Math.floor(Math.random() * easiest.length)];
  });
  const [finished, setFinished]   = useState(false);
  const [questionKey, setQuestionKey] = useState(0);

  const handleSubmit = useCallback((correct) => {
    const newScore   = correct ? score + 1 : score;
    const newHistory = [...history, { id: current.id, difficulty: current.difficulty, correct }];
    usedIds.add(current.id);

    if (step >= TOTAL) {
      const totalWeight    = newHistory.reduce((s, h) => s + h.difficulty, 0);
      const weightedCorrect = newHistory.reduce((s, h) => s + (h.correct ? h.difficulty : 0), 0);
      const skillRating    = totalWeight > 0 ? parseFloat((weightedCorrect / totalWeight).toFixed(2)) : 0;

      fetch('http://localhost:5000/api/sinhala/save-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId:      localStorage.getItem('studentName') || 'student_123',
          totalQuestions: TOTAL,
          totalCorrect:   newScore,
          scorePercent:   Math.round((newScore / TOTAL) * 100),
          skillRating,
          answers: newHistory.map(h => ({ questionId: h.id, difficulty: h.difficulty, correct: h.correct }))
        })
      }).catch(() => {});

      setScore(newScore);
      setHistory(newHistory);
      setFinished(true);
      return;
    }

    const next = pickNextQuestion(newHistory, ALL_EXERCISES, usedIds);
    setScore(newScore);
    setHistory(newHistory);
    setCurrent(next);
    setStep(s => s + 1);
    setQuestionKey(k => k + 1);
  }, [score, history, current, step, usedIds]);

  // ── Results screen ──────────────────────────────────────────────────────────
  if (finished) {
    const pct           = Math.round((score / TOTAL) * 100);
    const totalWeight   = history.reduce((s, h) => s + h.difficulty, 0);
    const weighted      = history.reduce((s, h) => s + (h.correct ? h.difficulty : 0), 0);
    const skillRating   = totalWeight > 0 ? Math.round((weighted / totalWeight) * 100) : 0;
    const hardCorrect   = history.filter(h => h.difficulty >= 3 && h.correct).length;
    const easyCorrect   = history.filter(h => h.difficulty <= 2 && h.correct).length;
    const emoji         = pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : pct >= 40 ? '💪' : '📚';
    const grade         = pct >= 80 ? 'විශිෂ්ට!' : pct >= 60 ? 'හොඳයි!' : pct >= 40 ? 'වැඩිදියුණු වෙනවා!' : 'නැවත උත්සාහ කරන්න!';
    const gradeColor    = pct >= 80 ? '#28a745' : pct >= 60 ? '#ffc107' : pct >= 40 ? '#fd7e14' : '#dc3545';

    return (
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '24px 16px', fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
        <div style={{ textAlign: 'center', background: '#fff', borderRadius: 20, padding: '32px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', marginBottom: 20 }}>
          <div style={{ fontSize: 72, marginBottom: 8 }}>{emoji}</div>
          <h2 style={{ fontSize: 30, fontWeight: 'bold', color: gradeColor, margin: 0 }}>{grade}</h2>
          <p style={{ color: '#666', fontSize: 16, marginTop: 6 }}>ව්‍යායාමය සම්පූර්ණයි!</p>
          <div style={{ position: 'relative', width: 140, height: 140, margin: '24px auto 8px' }}>
            <svg viewBox="0 0 36 36" style={{ width: 140, height: 140, transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={gradeColor} strokeWidth="3"
                strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 'bold', color: gradeColor }}>{pct}%</div>
              <div style={{ fontSize: 12, color: '#888' }}>{score}/{TOTAL}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'AI Skill Rating', value: `${skillRating}%`, icon: '🧠', color: '#6f42c1' },
            { label: 'Hard Qs Correct', value: `${hardCorrect}`,  icon: '💎', color: '#0dcaf0' },
            { label: 'Easy Qs Correct', value: `${easyCorrect}`,  icon: '✅', color: '#28a745' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#fff', borderRadius: 14, padding: '16px 12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: 26 }}>{stat.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: stat.color, margin: '4px 0' }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: '#888' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 15, color: '#444', fontWeight: 600 }}>📋 ප්‍රශ්න විශ්ලේෂණය</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((h, i) => {
              const ex = ALL_EXERCISES.find(e => e.id === h.id);
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10,
                  background: h.correct ? '#f0fff4' : '#fff5f5',
                  border: `1px solid ${h.correct ? '#b7ebc8' : '#ffd0d0'}`
                }}>
                  <span style={{ fontSize: 20 }}>{h.correct ? '✅' : '❌'}</span>
                  <span style={{ flex: 1, fontSize: 13, color: '#444' }}>
                    {ex?.question || ex?.title || h.id}
                  </span>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 20,
                    background: h.difficulty >= 3 ? '#e8d5ff' : '#d5eeff',
                    color: h.difficulty >= 3 ? '#6f42c1' : '#0d6efd', fontWeight: 600
                  }}>{'★'.repeat(h.difficulty)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg,#e8f4ff,#f0e8ff)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 15, color: '#444' }}>🤖 AI නිර්දේශය</h3>
          <p style={{ margin: 0, fontSize: 14, color: '#555', lineHeight: 1.6 }}>
            {pct >= 80 ? 'ඔබ ඉතා හොඳ කාර්ය සාධනයක් දක්වයි! ඊළඟ සැසිවලදී AI ඔබට වඩා දුෂ්කර ප්‍රශ්න ලබා දෙනු ඇත.'
              : pct >= 60 ? 'ඔබ හොඳ ප්‍රගතියක් ලබා ගනී. AI ඔබේ දුර්වල ක්ෂේත්‍ර ඉලක්ක කරමින් ප්‍රශ්න ලබා දෙනු ඇත.'
              : 'සිංහල කිහිපවාරක් පුහුණු කරන්න. AI ඔබේ ශිල්ප මට්ටමට ගැළපෙන ප්‍රශ්න තෝරා ගනු ඇත.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => window.location.reload()}
            style={{ flex: 1, padding: '14px 0', borderRadius: 14, background: '#fff', color: '#14b8a6', border: '2px solid #14b8a6', fontSize: 16, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            🔄 නැවත කරන්න
          </button>
          <button onClick={() => navigate('/dashboard')}
            style={{ flex: 1, padding: '14px 0', borderRadius: 14, background: '#14b8a6', color: '#fff', border: 'none', fontSize: 16, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            📊 Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Exercise screen ─────────────────────────────────────────────────────────
  const progress = ((step - 1) / TOTAL) * 100;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px', fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
      <div style={{ background: '#fffde7', borderRadius: 14, padding: '14px 20px', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 'bold', fontSize: 16 }}>⭐ පියවර {step} / {TOTAL}</span>
          <span style={{ color: '#888', fontSize: 14 }}>ලකුණු: {score}/{step - 1 > 0 ? step - 1 : 0}</span>
        </div>
        <div style={{ background: '#e0e0e0', borderRadius: 20, height: 12, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#ffc107,#ff9500)', height: '100%', borderRadius: 20, transition: 'width 0.5s ease' }} />
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 18, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ background: '#f0f4ff', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 15, color: '#333', fontWeight: 500 }}>
          {current.title || 'හරි පිළිතුර තෝරන්න'}
        </div>

        {current.type === 'WordPictureMatch' && (
          <WordPictureMatch key={questionKey} question={current} onSubmit={handleSubmit} />
        )}
        {current.type === 'MissingSyllable' && (
          <MissingSyllable key={questionKey} question={current} onSubmit={handleSubmit} />
        )}
        {current.type === 'MultipleChoice' && (
          <MultipleChoice key={questionKey} question={current} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}
