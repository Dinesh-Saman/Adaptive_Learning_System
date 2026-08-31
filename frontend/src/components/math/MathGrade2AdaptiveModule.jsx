import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Lock, Camera, Eye, Smile, Frown, Meh, AlertCircle } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { GRADE2_DOMAINS } from '../../data/math/grade2_math_curriculum';
import questionData from '../../data/math/grade2_question_pool.json';
import { recordStudentTestMarks, recordStudentQuestionAttempts } from '../../data/studentAnalyticsData';
import { getItem } from '../../utils/storage';
import { translateOption } from '../../utils/optionTranslator';

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
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'correct') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.15, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.18);
      });
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {}
}

const DIFFICULTY_DELTAS = {
  1: { correct: 5, wrong: -8, label: 'Level 1: මූලික' },
  2: { correct: 5, wrong: -6, label: 'Level 2: සරල' },
  3: { correct: 6, wrong: -5, label: 'Level 3: මධ්‍යම' },
  4: { correct: 7, wrong: -3, label: 'Level 4: උසස්' },
  5: { correct: 8, wrong: -2, label: 'Level 5: විශිෂ්ට' }
};

const PAPERS_CONFIG = [
  {
    id: 1,
    title_si: 'ප්‍රශ්න පත්‍රය 01',
    title_en: 'Question Paper 01',
    subtitle_si: 'මූලික විෂය නිර්දේශ ඇගයීම',
    subtitle_en: 'Basic Syllabus Assessment',
    badge_si: 'ප්‍රශ්න 20 • මූලික සිට මධ්‍යම දක්වා',
    badge_en: '20 Questions • Basic to Intermediate',
    icon: '📝',
    color: 'from-teal-500 to-emerald-600',
    borderColor: 'border-teal-300'
  },
  {
    id: 2,
    title_si: 'ප්‍රශ්න පත්‍රය 02',
    title_en: 'Question Paper 02',
    subtitle_si: 'මධ්‍යම මට්ටමේ කුසලතා ඇගයීම',
    subtitle_en: 'Intermediate Skill Assessment',
    badge_si: 'ප්‍රශ්න 20 • මධ්‍යම සිට උසස් දක්වා',
    badge_en: '20 Questions • Intermediate to Advanced',
    icon: '🎯',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-300'
  },
  {
    id: 3,
    title_si: 'ප්‍රශ්න පත්‍රය 03',
    title_en: 'Question Paper 03',
    subtitle_si: 'උසස් සංකල්ප මට්ටමේ ඇගයීම',
    subtitle_en: 'Advanced Concept Assessment',
    badge_si: 'ප්‍රශ්න 20 • විශිෂ්ට ප්‍රවීණතාව',
    badge_en: '20 Questions • Mastery Level',
    icon: '🏆',
    color: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-300'
  }
];

export default function MathGrade2AdaptiveModule({ onExit }) {
  const navigate = useNavigate();
  const pool = questionData.questions || [];
  const isEnglish = getItem('studentMedium') === 'English';

  // View: 'papers_hub' | 'quiz' | 'report'
  const [viewState, setViewState] = useState('papers_hub');
  const [activePaperId, setActivePaperId] = useState(1);

  // Medium mode state: 'English' | 'Sinhala' | 'Both'
  const [langMode, setLangMode] = useState(() => {
    const saved = getItem('studentMedium');
    return saved === 'English' ? 'English' : 'Sinhala';
  });

  // Quiz State (20 Questions)
  const [qNum, setQNum] = useState(1);
  const [currentDiff, setCurrentDiff] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [askedIds, setAskedIds] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  // ── Face-API & Vision Emotion Telemetry ──
  const videoRef = useRef(null);
  const confusionScoresRef = useRef([]);
  const [currentEmotion, setCurrentEmotion] = useState('Neutral 😐');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load Face-API models once
  useEffect(() => {
    let isMounted = true;
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        if (isMounted) setModelsLoaded(true);
      } catch (err) {
        console.warn("Face-API models failed to load:", err);
      }
    };
    loadModels();
    return () => { isMounted = false; };
  }, []);

  // Stop camera stream utility
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      try {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      } catch (e) {}
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Start camera stream utility
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => console.warn(e));
        };
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      setCameraError(isEnglish ? "Camera disabled or not found" : "කැමරාව සම්බන්ධ කළ නොහැක");
      setIsCameraActive(false);
    }
  };

  // Cleanup camera when leaving quiz or unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Real-time Facial Expression Detection Loop
  useEffect(() => {
    let interval;
    let missingFrames = 0;

    if (viewState === 'quiz' && isCameraActive && modelsLoaded) {
      interval = setInterval(async () => {
        if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
          try {
            const detections = await faceapi.detectSingleFace(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.25 })
            ).withFaceExpressions();

            if (detections && detections.expressions) {
              missingFrames = 0;
              const exp = detections.expressions;

              // Frustration & confusion scoring (0.0 to 1.0)
              const frustrationScore = (exp.angry || 0) + (exp.sad || 0) + (exp.fearful || 0) + (exp.disgusted || 0);
              confusionScoresRef.current.push(frustrationScore);

              let dominant = Object.keys(exp).reduce((a, b) => exp[a] > exp[b] ? a : b);
              let maxValue = exp[dominant];

              let display = isEnglish ? 'Neutral 😐' : 'සාමාන්‍ය 😐';

              if (exp.angry > 0.25 && exp.sad > 0.25) {
                display = isEnglish ? 'Frustrated 😕' : 'අපහසුයි 😕';
              } else if (exp.angry > 0.25 && exp.surprised > 0.2) {
                display = isEnglish ? 'Confused 🤔' : 'නොතේරේ 🤔';
              } else if (exp.happy > 0.3 && exp.neutral > 0.3) {
                display = isEnglish ? 'Engaged 😊' : 'උනන්දුයි 😊';
              } else if (dominant === 'neutral' && maxValue > 0.85) {
                display = isEnglish ? 'Focused 😐' : 'අවධානයෙන් 😐';
              } else {
                switch (dominant) {
                  case 'happy': display = isEnglish ? 'Happy 😀' : 'සතුටුයි 😀'; break;
                  case 'sad': display = isEnglish ? 'Sad 😢' : 'කනගාටුයි 😢'; break;
                  case 'angry': display = isEnglish ? 'Puzzled 😠' : 'අමාරුයි 😠'; break;
                  case 'surprised': display = isEnglish ? 'Surprised 😲' : 'පුදුමයි 😲'; break;
                  case 'fearful': display = isEnglish ? 'Tense 😨' : 'තැතිගැන්ම 😨'; break;
                  case 'disgusted': display = isEnglish ? 'Discontent 🤢' : 'අකමැතියි 🤢'; break;
                  case 'neutral': display = isEnglish ? 'Focused 😐' : 'අවධානයෙන් 😐'; break;
                  default: display = isEnglish ? 'Neutral 😐' : 'සාමාන්‍ය 😐';
                }
              }
              setCurrentEmotion(display);
            } else {
              missingFrames++;
              if (missingFrames >= 3) {
                setCurrentEmotion(isEnglish ? 'Align Face 😶' : 'මුහුණ යොමුකරන්න 😶');
              }
            }
          } catch (e) {
            // Silently handle temporary detection frame error
          }
        }
      }, 900);
    }
    return () => clearInterval(interval);
  }, [viewState, isCameraActive, modelsLoaded, isEnglish]);

  // 20-Skill Mastery Vector (0 to 100%)
  const [skillMastery, setSkillMastery] = useState(() => {
    const init = {};
    Object.values(GRADE2_DOMAINS).forEach(dom => {
      dom.skills.forEach(s => {
        init[s.id] = 50.0;
      });
    });
    return init;
  });

  // Paper History in LocalStorage
  const getActiveStudentKey = () => {
    const rawName = getItem('studentName') || getItem('studentId') || '';
    return String(rawName).toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
  };

  const [paperHistory, setPaperHistory] = useState(() => {
    try {
      const studentKey = getActiveStudentKey();
      if (!studentKey) return {};
      const isDefault = studentKey === 'hasara' || studentKey === 'std_hasara' || studentKey === 'std_001';
      const stored = localStorage.getItem(`g2_math_paper_history_${studentKey}`) || (isDefault ? localStorage.getItem('g2_math_paper_history') : null);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  const getPaperLockStatus = (paperId) => {
    if (paperId === 1) return { isUnlocked: true };
    if (paperId === 2) {
      const p1 = paperHistory[1];
      const passed = p1 && ((p1.overallAccuracy >= 75) || (p1.totalCorrect >= 15));
      return {
        isUnlocked: !!passed,
        requiredPaper: 1,
        reasonEn: "Requires 75%+ score in Paper 01 to unlock",
        reasonSi: "විවෘත වීමට 01 ප්‍රශ්න පත්‍රයට 75%+ ලකුණු අවශ්‍යයි"
      };
    }
    if (paperId === 3) {
      const p2 = paperHistory[2];
      const passed = p2 && ((p2.overallAccuracy >= 75) || (p2.totalCorrect >= 15));
      return {
        isUnlocked: !!passed,
        requiredPaper: 2,
        reasonEn: "Requires 75%+ score in Paper 02 to unlock",
        reasonSi: "විවෘත වීමට 02 ප්‍රශ්න පත්‍රයට 75%+ ලකුණු අවශ්‍යයි"
      };
    }
    return { isUnlocked: true };
  };

  const savePaperResult = (paperId, resultData) => {
    const studentKey = getActiveStudentKey();
    const updated = {
      ...paperHistory,
      [paperId]: resultData
    };
    setPaperHistory(updated);
    try {
      if (studentKey) {
        localStorage.setItem(`g2_math_paper_history_${studentKey}`, JSON.stringify(updated));
      }
    } catch (e) {}

    // Record score to MongoDB / Backend Analytics so Teacher Dashboard updates!
    const studentId = getItem('studentId') || getItem('studentName') || 'std_hasara';
    const studentName = getItem('studentName') || 'Hasara';
    const marks = resultData.totalCorrect || 0;
    const maxMarks = 20;

    ['M1', 'M2', 'M3', 'M4'].forEach(code => {
      recordStudentTestMarks({
        studentId,
        name: studentName,
        subject: 'math',
        categoryCode: code,
        marks,
        maxMarks
      });
    });

    if (resultData.history && Array.isArray(resultData.history)) {
      const attemptItems = resultData.history.map((h, idx) => ({
        questionId: `Gr.2 P0${paperId} • Q${h.qNum || (idx + 1)}`,
        skillId: h.skillId || 'Mathematics Operations',
        studentAnswer: String(h.selectedOption ?? '—'),
        correctAnswer: String(h.correctAnswer ?? '—'),
        isCorrect: !!h.isCorrect,
        responseTimeMs: 2000,
        emotion: h.emotion || 'Focused 😐',
        misconception: h.isCorrect ? 'Correct application' : 'Calculation Error'
      }));
      recordStudentQuestionAttempts({
        studentId,
        name: studentName,
        module: 'math',
        grade: 2,
        paperNumber: Number(paperId),
        attempts: attemptItems
      });
    }
  };

  const handleResetAllPapers = () => {
    playSound('click');
    const confirmMsg = isEnglish 
      ? "Are you sure you want to reset all test papers and scores back to initial state?" 
      : "සියලුම ප්‍රශ්න පත්‍ර සහ ලකුණු මුල සිට නැවත සැකසීමට ඔබට සහතිකද?";
    
    if (window.confirm(confirmMsg)) {
      setPaperHistory({});
      try {
        localStorage.removeItem('g2_math_paper_history');
      } catch (e) {}

      const init = {};
      Object.values(GRADE2_DOMAINS).forEach(dom => {
        dom.skills.forEach(s => {
          init[s.id] = 50.0;
        });
      });
      setSkillMastery(init);
      setHistory([]);
      setAskedIds([]);
    }
  };

  const handleResetSinglePaper = (paperId) => {
    playSound('click');
    const confirmMsg = isEnglish 
      ? `Are you sure you want to reset Question Paper 0${paperId}?` 
      : `0${paperId} ප්‍රශ්න පත්‍රය මුල සිට නැවත සැකසීමට ඔබට සහතිකද?`;
    
    if (window.confirm(confirmMsg)) {
      const updated = { ...paperHistory };
      delete updated[paperId];
      setPaperHistory(updated);
      try {
        localStorage.setItem('g2_math_paper_history', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  // Start a specific paper (20 Questions)
  const handleStartPaper = (pId) => {
    const lockStatus = getPaperLockStatus(pId);
    if (!lockStatus.isUnlocked) {
      alert(isEnglish ? lockStatus.reasonEn : lockStatus.reasonSi);
      return;
    }
    playSound('click');
    setActivePaperId(pId);
    setQNum(1);
    const startDiff = pId === 1 ? 1 : pId === 2 ? 2 : 3;
    setCurrentDiff(startDiff);
    setAskedIds([]);
    setHistory([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setConsecutiveCorrect(0);
    setConsecutiveWrong(0);
    confusionScoresRef.current = [];
    setCurrentEmotion(isEnglish ? 'Focusing 😐' : 'අවධානයෙන් 😐');

    const init = {};
    Object.values(GRADE2_DOMAINS).forEach(dom => {
      dom.skills.forEach(s => {
        init[s.id] = 50.0;
      });
    });
    setSkillMastery(init);

    const firstQ = selectNextQuestion(1, startDiff, init, [], pId);
    setCurrentQuestion(firstQ);
    if (firstQ) {
      setAskedIds([firstQ.id]);
    }
    setStartTime(Date.now());
    setViewState('quiz');
    startCamera();
  };

  // View existing paper report directly
  const handleViewSavedPaperReport = (pId) => {
    playSound('click');
    const saved = paperHistory[pId];
    if (saved) {
      setActivePaperId(pId);
      setHistory(saved.history || []);
      setSkillMastery(saved.skillMastery || {});
      setCurrentDiff(saved.currentDiff || 1);
      setViewState('report');
    } else {
      handleStartPaper(pId);
    }
  };

  // 5-Stage Adaptive Question Selection Algorithm for 20 Questions
  const selectNextQuestion = (nextQNum, targetDiff, currentMasteries, existingAskedIds, pId = activePaperId) => {
    const askedSet = new Set(existingAskedIds || []);

    let targetSkillId = null;

    if (nextQNum === 1) {
      let paperStartingSkills = [];
      if (pId === 1) {
        paperStartingSkills = ['G2_D1_S1_COUNTING', 'G2_D1_S2_NUMBER_READING', 'G2_D2_S1_ADDITION_20', 'G2_D2_S2_SUBTRACTION_20'];
      } else if (pId === 2) {
        paperStartingSkills = ['G2_D3_S1_LENGTH', 'G2_D3_S3_TIME', 'G2_D4_S1_2D_SHAPES', 'G2_D1_S3_PLACE_VALUE_TENS'];
      } else {
        paperStartingSkills = ['G2_D2_S3_ADD_SUB_WORD', 'G2_D4_S2_3D_SOLIDS', 'G2_D3_S4_MONEY', 'G2_D4_S3_PATTERNS'];
      }
      targetSkillId = paperStartingSkills[Math.floor(Math.random() * paperStartingSkills.length)];
    } else if (nextQNum === 20) {
      const sorted = Object.entries(currentMasteries).sort((a, b) => a[1] - b[1]);
      targetSkillId = sorted[0] ? sorted[0][0] : null;
    } else {
      const sorted = Object.entries(currentMasteries).sort((a, b) => a[1] - b[1]);
      const weakestThree = sorted.slice(0, 3).map(x => x[0]);
      
      if (Math.random() < 0.7 && weakestThree.length > 0) {
        targetSkillId = weakestThree[Math.floor(Math.random() * weakestThree.length)];
      } else {
        const testedSkills = new Set((history || []).map(h => h.skillId));
        const allSkills = Object.keys(currentMasteries);
        const untested = allSkills.filter(s => !testedSkills.has(s));
        targetSkillId = untested.length > 0
          ? untested[Math.floor(Math.random() * untested.length)]
          : allSkills[Math.floor(Math.random() * allSkills.length)];
      }
    }

    // 1. Exact skill and target difficulty match
    let candidates = pool.filter(q => 
      (!targetSkillId || q.skill_id === targetSkillId) && 
      q.difficulty_tier === targetDiff && 
      !askedSet.has(q.id)
    );

    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    // 2. Same skill with closest difficulty
    if (targetSkillId) {
      let skillCandidates = pool.filter(q => q.skill_id === targetSkillId && !askedSet.has(q.id));
      if (skillCandidates.length > 0) {
        skillCandidates.sort((a, b) => Math.abs(a.difficulty_tier - targetDiff) - Math.abs(b.difficulty_tier - targetDiff));
        return skillCandidates[Math.floor(Math.random() * Math.min(2, skillCandidates.length))];
      }
    }

    // 3. Same difficulty tier not yet asked
    let diffCandidates = pool.filter(q => q.difficulty_tier === targetDiff && !askedSet.has(q.id));
    if (diffCandidates.length > 0) {
      return diffCandidates[Math.floor(Math.random() * diffCandidates.length)];
    }

    // 4. Any question from pool not yet asked in this paper
    let unseen = pool.filter(q => !askedSet.has(q.id));
    if (unseen.length > 0) {
      return unseen[Math.floor(Math.random() * unseen.length)];
    }

    // 5. Ultimate fallback: pick random question from pool
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // Submit Answer Handler
  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    playSound('click');
    setSelectedOption(opt);
    setIsAnswered(true);

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const correct = (opt === currentQuestion.answer);
    setIsCorrect(correct);

    const diffDelta = DIFFICULTY_DELTAS[currentQuestion.difficulty_tier] || DIFFICULTY_DELTAS[1];
    const delta = correct ? diffDelta.correct : diffDelta.wrong;

    const newMasteries = { ...skillMastery };
    const prevScore = newMasteries[currentQuestion.skill_id] || 50.0;
    newMasteries[currentQuestion.skill_id] = Math.max(0, Math.min(100, Math.round((prevScore + delta) * 10) / 10));
    setSkillMastery(newMasteries);

    let nextDiff = currentDiff;
    let nextConsecCorrect = consecutiveCorrect;
    let nextConsecWrong = consecutiveWrong;

    if (correct) {
      nextConsecCorrect += 1;
      nextConsecWrong = 0;
      if (nextConsecCorrect >= 2) {
        nextDiff = Math.min(5, currentDiff + 1);
        nextConsecCorrect = 0;
      }
    } else {
      nextConsecCorrect = 0;
      nextConsecWrong += 1;
      if (nextConsecWrong >= 2) {
        nextDiff = Math.max(1, currentDiff - 1);
        nextConsecWrong = 0;
      } else if (currentDiff > 1) {
        nextDiff = Math.max(1, currentDiff - 1);
      }
    }

    setConsecutiveCorrect(nextConsecCorrect);
    setConsecutiveWrong(nextConsecWrong);
    setCurrentDiff(nextDiff);

    const scores = confusionScoresRef.current;
    const avgConfusion = scores.length > 0 
      ? scores.reduce((a, b) => a + b, 0) / scores.length 
      : 0.0;

    const historyEntry = {
      qNum,
      questionId: currentQuestion.id,
      skillId: currentQuestion.skill_id,
      difficultyTier: currentQuestion.difficulty_tier,
      isCorrect: correct,
      selectedOption: opt,
      correctAnswer: currentQuestion.answer,
      explanationSi: currentQuestion.explanation_si,
      explanationEn: currentQuestion.explanation_en,
      timeSpentSec: timeSpent,
      questionTextSi: currentQuestion.text_si,
      questionTextEn: currentQuestion.text_en,
      emotion: currentEmotion,
      confusionScore: Math.round(avgConfusion * 100) / 100
    };
    setHistory(prev => [...prev, historyEntry]);
    confusionScoresRef.current = [];
  };

  // Next Question
  const handleNextQuestion = () => {
    playSound('click');
    if (qNum >= 20) {
      stopCamera();
      const finalTotalCorrect = history.filter(h => h.isCorrect).length;
      const finalAccuracy = Math.round((finalTotalCorrect / 20) * 100);
      
      savePaperResult(activePaperId, {
        paperId: activePaperId,
        totalCorrect: finalTotalCorrect,
        overallAccuracy: finalAccuracy,
        currentDiff,
        history,
        skillMastery,
        completedAt: new Date().toLocaleDateString('si-LK')
      });

      playSound('correct');
      setViewState('report');
      return;
    }

    const nextQNum = qNum + 1;
    setQNum(nextQNum);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);

    const nextQ = selectNextQuestion(nextQNum, currentDiff, skillMastery, askedIds, activePaperId);
    setCurrentQuestion(nextQ);
    if (nextQ) {
      setAskedIds(prev => [...prev, nextQ.id]);
    }
    setStartTime(Date.now());
  };

  const totalCorrect = history.filter(h => h.isCorrect).length;
  const overallAccuracy = history.length > 0 ? Math.round((totalCorrect / history.length) * 100) : 0;

  const domainSummaries = Object.entries(GRADE2_DOMAINS).map(([domId, dom]) => {
    const domSkillIds = new Set(dom.skills.map(s => s.id));
    const domHistory = history.filter(h => domSkillIds.has(h.skillId));
    const askedCount = domHistory.length;
    const correctCount = domHistory.filter(h => h.isCorrect).length;
    const wrongCount = askedCount - correctCount;
    const accuracy = askedCount > 0 ? Math.round((correctCount / askedCount) * 100) : null;

    return {
      id: domId,
      name_si: dom.name_si,
      name_en: dom.name_en || dom.name_si,
      icon: dom.icon,
      color: dom.color,
      askedCount,
      correctCount,
      wrongCount,
      accuracy
    };
  });

  const sortedSkills = Object.entries(skillMastery).sort((a, b) => a[1] - b[1]);
  const weakestSkills = sortedSkills.slice(0, 2);
  const strongestSkills = [...sortedSkills].reverse().slice(0, 2);

  const getSkillName = (sid) => {
    for (const dom of Object.values(GRADE2_DOMAINS)) {
      for (const s of dom.skills) {
        if (s.id === sid) return { 
          si: s.name_si || s.name_en || sid, 
          en: s.name_en || s.name_si || sid,
          name_si: s.name_si,
          name_en: s.name_en
        };
      }
    }
    return { si: sid, en: sid, name_si: sid, name_en: sid };
  };

  // Emotional Telemetry Metrics for Report
  const emotionHistory = history.filter(h => h.emotion);
  const emotionCounts = {};
  emotionHistory.forEach(h => {
    emotionCounts[h.emotion] = (emotionCounts[h.emotion] || 0) + 1;
  });
  const dominantEmotion = Object.keys(emotionCounts).length > 0
    ? Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b)
    : (isEnglish ? 'Focused 😐' : 'අවධානයෙන් 😐');

  const engagedCount = emotionHistory.filter(h => 
    h.emotion?.includes('Engaged') || h.emotion?.includes('Happy') || h.emotion?.includes('Focused') || 
    h.emotion?.includes('උනන්දුයි') || h.emotion?.includes('සතුටුයි') || h.emotion?.includes('අවධානයෙන්')
  ).length;
  const engagementRate = emotionHistory.length > 0 ? Math.round((engagedCount / emotionHistory.length) * 100) : 100;

  return (
    <div 
      className={`min-h-[calc(100vh-5rem)] bg-cover bg-center bg-fixed font-sans select-none relative overflow-x-hidden ${viewState === 'quiz' ? 'h-[calc(100vh-5rem)] overflow-hidden flex flex-col p-2 sm:p-3' : 'pb-16 p-4 sm:p-6'}`}
      style={{ backgroundImage: "url('/images/grade4_meadow_bg.jpg')" }}
    >
      <div className={`max-w-4xl mx-auto relative z-10 w-full ${viewState === 'quiz' ? 'flex-grow flex flex-col justify-between h-full' : ''}`}>
        
        {/* Top Navigation */}
        <div className={`flex flex-wrap items-center justify-between gap-2 ${viewState === 'quiz' ? 'mb-2' : 'mb-6'}`}>
          <button
            onClick={() => {
              if (viewState === 'quiz') {
                if (window.confirm(isEnglish ? "Do you want to exit this paper?" : "ඔබට මෙම ප්‍රශ්න පත්‍රයෙන් ඉවත් වීමට අවශ්‍යද?")) {
                  stopCamera();
                  setViewState('papers_hub');
                }
              } else if (viewState === 'report') {
                stopCamera();
                setViewState('papers_hub');
              } else {
                stopCamera();
                onExit ? onExit() : navigate('/dashboard');
              }
            }}
            className={`flex items-center gap-2 bg-white/95 border-2 border-slate-200 hover:border-teal-400 text-slate-700 font-bold rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer ${viewState === 'quiz' ? 'px-4 py-1.5 text-xs sm:text-sm' : 'px-5 py-2.5'}`}
          >
            <span>⬅</span>
            <span>{viewState === 'papers_hub' ? (isEnglish ? 'Dashboard' : 'Dashboard එකට') : (isEnglish ? 'Choose Paper' : 'ප්‍රශ්න පත්‍ර තෝරන්න')}</span>
          </button>

          {viewState === 'papers_hub' && Object.keys(paperHistory).length > 0 && (
            <button
              onClick={handleResetAllPapers}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 hover:border-rose-300 text-rose-700 font-black text-xs sm:text-sm rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer"
              title={isEnglish ? "Reset all papers to initial state" : "සියලුම ප්‍රශ්න පත්‍ර මුල සිට නැවත සකසන්න"}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isEnglish ? 'Reset All Papers' : 'මුල සිට නැවත සකසන්න'}</span>
            </button>
          )}

          {viewState === 'quiz' && (
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Live Face Detection & Emotion Telemetry Widget */}
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur border border-teal-200 px-2.5 py-1 rounded-xl shadow-xs">
                <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-slate-900 border border-slate-300 shadow-inner shrink-0">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <span className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${isCameraActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                </div>
                <div className="text-left leading-tight hidden xs:block sm:block">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5 text-teal-600" />
                    <span>{isEnglish ? 'AI Affect' : 'චිත්තවේගය'}</span>
                  </p>
                  <p className="text-xs font-black text-teal-800 whitespace-nowrap">
                    {currentEmotion}
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-block bg-teal-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs">
                {isEnglish ? `Paper 0${activePaperId}` : `පත්‍රය 0${activePaperId}`}
              </span>
              <span className="bg-white/95 backdrop-blur border border-teal-200 text-teal-800 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs">
                {isEnglish ? `Q ${qNum} / 20` : `ප්‍රශ්න ${qNum} / 20`}
              </span>
            </div>
          )}
        </div>

        {/* ── SCREEN 1: 3 ADAPTIVE PAPERS HUB ── */}
        {viewState === 'papers_hub' && (
          <div className="space-y-6 animate-fade-in">
            {/* Hero Welcome Banner */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-teal-100 shadow-xl text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-100 rounded-full blur-2xl opacity-50"></div>
              <div className="inline-block bg-teal-100 text-teal-800 font-black text-xs px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                {isEnglish ? 'Grade 2 • Mathematics' : '2 ශ්‍රේණිය • ගණිතය'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2">
                {isEnglish ? 'Adaptive Test Papers System' : 'අනුවර්තී ප්‍රශ්න පත්‍ර පද්ධතිය'}
              </h1>
              <p className="text-slate-600 font-bold text-sm sm:text-base max-w-2xl mx-auto">
                {isEnglish 
                  ? '3 Adaptive Test Papers with 20 questions each, covering all 20 skills in Grade 2 Sri Lanka National Curriculum.' 
                  : 'ශ්‍රී ලංකා ජාතික විෂය නිර්දේශයේ කුසලතා 20 ආවරණය වන පරිදි සකස් කළ ප්‍රශ්න 20 බැගින් යුත් අනුවර්තී ප්‍රශ්න පත්‍ර 3ක්.'}
              </p>
            </div>

            {/* 3 Paper Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PAPERS_CONFIG.map((p) => {
                const result = paperHistory[p.id];
                const isCompleted = !!result;
                const lockStatus = getPaperLockStatus(p.id);
                const isUnlocked = lockStatus.isUnlocked;

                return (
                  <div 
                    key={p.id}
                    className={`bg-white rounded-3xl p-6 border-2 transition-all duration-300 shadow-lg flex flex-col justify-between relative overflow-hidden ${
                      !isUnlocked 
                        ? 'border-slate-200 bg-slate-50/70 opacity-80' 
                        : isCompleted 
                          ? 'border-emerald-300 bg-emerald-50/20 hover:shadow-2xl hover:-translate-y-1' 
                          : 'border-slate-200 hover:shadow-2xl hover:-translate-y-1'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-4xl">{p.icon}</span>
                        {!isUnlocked ? (
                          <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 border border-amber-300">
                            <Lock className="w-3 h-3 text-amber-700" />
                            <span>{isEnglish ? 'Locked' : 'අගුළුලා ඇත'}</span>
                          </span>
                        ) : isCompleted ? (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                            {isEnglish ? '✓ Completed' : '✓ සම්පූර්ණයි'}
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-xs font-black px-3 py-1 rounded-full">
                            {isEnglish ? 'New Paper' : 'නව ප්‍රශ්න පත්‍රය'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-slate-800 leading-snug">
                        {isEnglish ? p.title_en : p.title_si}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {isEnglish ? p.subtitle_en : p.subtitle_si}
                      </p>

                      <div className="pt-2">
                        <span className="inline-block text-xs font-black bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                          {isEnglish ? p.badge_en : p.badge_si}
                        </span>
                      </div>

                      {!isUnlocked && (
                        <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5">
                          <span className="text-xl shrink-0">🔒</span>
                          <div className="text-left leading-tight">
                            <p className="text-[11px] font-black text-amber-900 uppercase tracking-wide">
                              {isEnglish ? 'Unlock Requirement:' : 'විවෘත වීමේ කොන්දේසිය:'}
                            </p>
                            <p className="text-xs font-black text-amber-700 mt-1">
                              {isEnglish ? lockStatus.reasonEn : lockStatus.reasonSi}
                            </p>
                          </div>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="mt-4 p-3 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">{isEnglish ? 'Previous Score:' : 'පෙර ලකුණු:'}</span>
                          <span className="text-sm font-black text-emerald-700">
                            {result.totalCorrect}/20 ({result.overallAccuracy}%)
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 space-y-2">
                      {!isUnlocked ? (
                        <button
                          disabled
                          className="w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm text-slate-500 bg-slate-200/90 border border-slate-300 cursor-not-allowed flex flex-col items-center justify-center gap-0.5 shadow-inner"
                        >
                          <div className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span>{isEnglish ? 'Locked' : 'අගුළුලා ඇත'}</span>
                          </div>
                          <span className="text-[11px] font-bold text-amber-700">
                            {isEnglish ? `Requires 75%+ in Paper 0${lockStatus.requiredPaper || (p.id - 1)}` : `0${lockStatus.requiredPaper || (p.id - 1)} පත්‍රයට 75%+ අවශ්‍යයි`}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartPaper(p.id)}
                          className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white shadow-md transition-all cursor-pointer bg-gradient-to-r ${p.color} hover:opacity-95 active:scale-95`}
                        >
                          {isCompleted 
                            ? (isEnglish ? '🔄 Retake Paper' : '🔄 නැවත කරන්න') 
                            : (isEnglish ? 'Start Paper ➔' : 'ආරම්භ කරන්න ➔')}
                        </button>
                      )}

                      {isCompleted && (
                        <div className="space-y-1.5">
                          <button
                            onClick={() => handleViewSavedPaperReport(p.id)}
                            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>📊</span> {isEnglish ? 'View Report' : '📊 වාර්තාව බලන්න'}
                          </button>
                          <button
                            onClick={() => handleResetSinglePaper(p.id)}
                            className="w-full py-1 text-center text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{isEnglish ? 'Reset this paper' : 'මෙම පත්‍රය Reset කරන්න'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SCREEN 2: 20 ADAPTIVE QUESTIONS QUIZ (Zero Scroll Viewport Fit) ── */}
        {viewState === 'quiz' && currentQuestion && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-teal-200 shadow-xl flex-grow flex flex-col justify-between animate-scale-up">
            
            {/* Progress Bar (20 Questions) */}
            <div>
              <div className="flex justify-between items-center text-xs font-black text-slate-600 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
                    {isEnglish
                      ? (getSkillName(currentQuestion.skill_id).en || getSkillName(currentQuestion.skill_id).si)
                      : getSkillName(currentQuestion.skill_id).si}
                  </span>
                </span>
                <span>{qNum} / 20 ({Math.round((qNum / 20) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(qNum / 20) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Box */}
            <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-4 sm:p-5 my-auto flex flex-col justify-center text-center">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 leading-snug">
                {isEnglish ? (currentQuestion.text_en || currentQuestion.text_si) : currentQuestion.text_si}
              </h2>
            </div>

            {/* Options (Comfortable 2x2 Grid, Zero-Scroll) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-2">
              {currentQuestion.options.map((opt, idx) => {
                let btnStyle = 'bg-white border-2 border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-teal-50/50';
                
                if (isAnswered) {
                  if (opt === selectedOption) {
                    btnStyle = 'bg-teal-600 border-2 border-teal-700 text-white shadow-md scale-[1.01]';
                  } else {
                    btnStyle = 'bg-slate-100 border-2 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt)}
                    className={`py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-xs ${btnStyle}`}
                  >
                    <span>{translateOption(opt, isEnglish)}</span>
                  </button>
                );
              })}
            </div>

            {/* Continue Action Button */}
            <div className="flex justify-end pt-2 border-t border-slate-200/80 mt-1">
              <button
                disabled={!isAnswered}
                onClick={handleNextQuestion}
                className={`px-6 py-2.5 sm:py-3 rounded-xl font-black text-sm sm:text-base border-2 transition-all flex items-center gap-2 ${
                  isAnswered
                    ? 'bg-teal-600 hover:bg-teal-700 border-teal-600 text-white shadow-md cursor-pointer active:scale-95'
                    : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-75 shadow-none'
                }`}
              >
                <span>{qNum >= 20 ? (isEnglish ? 'View Full Report ➔' : 'සම්පූර්ණ වාර්තාව බලන්න ➔') : (isEnglish ? 'Next Question ➔' : 'ඊළඟ ප්‍රශ්නය ➔')}</span>
              </button>
            </div>

          </div>
        )}

        {/* ── SCREEN 3: COMPREHENSIVE LEARNER REPORT (20 QUESTIONS) ── */}
        {viewState === 'report' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-teal-200 shadow-2xl space-y-8 animate-scale-up">
            
            <div className="text-center pb-6 border-b border-slate-200">
              <h2 className="text-3xl font-black text-slate-800 mb-1">
                {isEnglish ? `Grade 2 — Question Paper 0${activePaperId} Evaluation Report` : `2 ශ්‍රේණිය — ප්‍රශ්න පත්‍රය 0${activePaperId} ඇගයීම් වාර්තාව`}
              </h2>
              <p className="text-sm text-slate-500 font-bold">
                {isEnglish ? '20 Skills Adaptive Analysis' : 'කුසලතා 20 අනුවර්තී විශ්ලේෂණය'}
              </p>
            </div>

            {/* Score Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">
                  {isEnglish ? 'CORRECT ANSWERS' : 'නිවැරදි පිළිතුරු'}
                </p>
                <p className="text-2xl sm:text-3xl font-black text-teal-700">{totalCorrect} / 20</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
                  {isEnglish ? 'ACCURACY SCORE' : 'නිරවද්‍යතා ප්‍රතිශතය'}
                </p>
                <p className="text-2xl sm:text-3xl font-black text-emerald-700">{overallAccuracy}%</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                  {isEnglish ? 'LEVEL REACHED' : 'ළඟා වූ මට්ටම'}
                </p>
                <p className="text-xl sm:text-2xl font-black text-blue-700">Tier {currentDiff} / 5</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">
                  {isEnglish ? 'DOMINANT AFFECT' : 'ප්‍රධාන චිත්තවේගය'}
                </p>
                <p className="text-lg sm:text-xl font-black text-purple-700 truncate">{dominantEmotion}</p>
              </div>
            </div>

            {/* AI Vision & Emotional Telemetry Card */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 border border-slate-700 shadow-xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-xl">
                    🎭
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
                      <span>{isEnglish ? 'AI Facial Expression & Affect Telemetry' : 'AI මුහුණේ ඉරියව් සහ චිත්තවේග විශ්ලේෂණය'}</span>
                    </h3>
                    <p className="text-xs text-indigo-300 font-medium">
                      {isEnglish ? 'Live Computer Vision engagement and cognitive comfort assessment' : 'කැමරාව මඟින් හඳුනාගත් ළමයාගේ අවධානය සහ මානසික සුවපහසුව'}
                    </p>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {isEnglish ? `Engagement: ${engagementRate}%` : `අවධානය: ${engagementRate}%`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                  <span className="text-2xl">😊</span>
                  <div>
                    <p className="text-slate-400 font-bold">{isEnglish ? 'Focus & Confidence' : 'අවධානය සහ විශ්වාසය'}</p>
                    <p className="text-sm font-black text-emerald-400">{engagementRate}% {isEnglish ? 'Optimal Zone' : 'ඉහළ මට්ටමක'}</p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                  <span className="text-2xl">🤔</span>
                  <div>
                    <p className="text-slate-400 font-bold">{isEnglish ? 'Cognitive Puzzling' : 'ගැටලු ගැන කල්පනා කිරීම'}</p>
                    <p className="text-sm font-black text-blue-300">
                      {emotionHistory.filter(h => h.emotion?.includes('Confused') || h.emotion?.includes('නොතේරේ') || h.emotion?.includes('Puzzled')).length} {isEnglish ? 'Questions' : 'ප්‍රශ්න වලදී'}
                    </p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="text-slate-400 font-bold">{isEnglish ? 'Frustration Filter' : 'නොසන්සුන්තා මට්ටම'}</p>
                    <p className="text-sm font-black text-amber-300">
                      {emotionHistory.filter(h => h.emotion?.includes('Frustrated') || h.emotion?.includes('අපහසුයි')).length > 0 
                        ? `${emotionHistory.filter(h => h.emotion?.includes('Frustrated') || h.emotion?.includes('අපහසුයි')).length} ${isEnglish ? 'Mild Instances' : 'අවස්ථා'}` 
                        : (isEnglish ? '0 (Zero Frustration)' : '0 (සම්පූර්ණ සුවපහසුව)')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Domains Mastery Bars */}
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                <span>📊</span> {isEnglish ? 'Mastery Level in 4 Core Domains' : 'ප්‍රධාන ක්ෂේත්‍ර 4 හි ප්‍රවීණතා මට්ටම'}
              </h3>
              <div className="space-y-4">
                {domainSummaries.map(dom => (
                  <div key={dom.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{dom.icon}</span>
                        <span className="font-black text-sm text-slate-800">{isEnglish ? dom.name_en : dom.name_si}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {dom.askedCount > 0 ? (
                          <div className="flex items-center gap-1.5 text-xs font-black">
                            <span className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg">
                              {isEnglish ? `Questions ${dom.askedCount}` : `ප්‍රශ්න ${dom.askedCount}`}
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                              ✓ {dom.correctCount}
                            </span>
                            {dom.wrongCount > 0 && (
                              <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                ✗ {dom.wrongCount}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                            {isEnglish ? 'No questions asked' : 'ප්‍රශ්න අසා නැත'}
                          </span>
                        )}
                        <span className="font-black text-sm text-teal-700 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
                          {dom.accuracy !== null ? `${dom.accuracy}%` : '—'}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${dom.color} h-3 rounded-full transition-all duration-700`}
                        style={{ width: `${dom.accuracy !== null ? dom.accuracy : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-sm mb-3">
                  <span>💪</span> {isEnglish ? 'Top Mastered Skills' : 'ඉහළම දක්ෂතා දැක්වූ කුසලතා'}
                </div>
                <div className="space-y-2">
                  {strongestSkills.map(([sid, score]) => (
                    <div key={sid} className="flex justify-between text-xs font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span>{isEnglish ? (getSkillName(sid).en || getSkillName(sid).si) : getSkillName(sid).si}</span>
                      <span className="text-emerald-600 font-black">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-amber-800 font-black text-sm mb-3">
                  <span>🎯</span> {isEnglish ? 'Skills Requiring Practice' : 'තවදුරටත් පුහුණු විය යුතු කුසලතා'}
                </div>
                <div className="space-y-2">
                  {weakestSkills.map(([sid, score]) => (
                    <div key={sid} className="flex justify-between text-xs font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-amber-100">
                      <span>{isEnglish ? (getSkillName(sid).en || getSkillName(sid).si) : getSkillName(sid).si}</span>
                      <span className="text-amber-600 font-black">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Question Review Table for all 20 questions */}
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                <span>📋</span> {isEnglish ? '20 Questions Detailed Review' : 'ප්‍රශ්න 20 සමාලෝචනය'}
              </h3>
              <div className="space-y-3">
                {history.map((h, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border-2 ${
                      h.isCorrect 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-rose-50 border-rose-200'
                    }`}
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white ${h.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                          {h.isCorrect ? '✓' : '✗'}
                        </span>
                        <span className="font-bold text-slate-800 text-sm">
                          {isEnglish ? `Question ${h.qNum} / 20` : `ප්‍රශ්නය ${h.qNum} / 20`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {h.emotion && (
                          <span className="text-[11px] font-bold bg-white/80 border border-slate-300 text-slate-700 px-2.5 py-0.5 rounded-full shadow-xs">
                            {h.emotion}
                          </span>
                        )}
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${h.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {h.isCorrect ? (isEnglish ? 'Correct' : 'නිවැරදියි') : (isEnglish ? 'Incorrect' : 'වැරදියි')}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-800 font-bold text-sm mb-2 font-sans">
                      {isEnglish 
                        ? (h.questionTextEn || pool.find(q => q.id === h.questionId)?.text_en || h.questionTextSi) 
                        : h.questionTextSi}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs font-bold font-sans">
                      <span className="text-slate-600">
                        {isEnglish ? 'Your Answer: ' : 'ඔබේ පිළිතුර: '}
                        <strong className={h.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                          {translateOption(h.selectedOption, isEnglish)}
                        </strong>
                      </span>
                      {!h.isCorrect && (
                        <span className="text-slate-600">
                          {isEnglish ? 'Correct Answer: ' : 'නිවැරදි පිළිතුර: '}
                          <strong className="text-emerald-700">
                            {translateOption(h.correctAnswer, isEnglish)}
                          </strong>
                        </span>
                      )}
                    </div>
                    {(h.explanationEn || pool.find(q => q.id === h.questionId)?.explanation_en || h.explanationSi) && (
                      <p className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-600 font-medium font-sans">
                        💡 {isEnglish 
                          ? (h.explanationEn || pool.find(q => q.id === h.questionId)?.explanation_en || h.explanationSi) 
                          : h.explanationSi}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleStartPaper(activePaperId)}
                className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer text-center"
              >
                {isEnglish ? `🔄 Retake Paper 0${activePaperId}` : `🔄 නැවත කරන්න (ප්‍රශ්න පත්‍රය 0${activePaperId})`}
              </button>
              <button
                onClick={() => setViewState('papers_hub')}
                className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-black py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-center"
              >
                {isEnglish ? '📑 Select Another Paper' : '📑 වෙනත් ප්‍රශ්න පත්‍රයක් තෝරන්න'}
              </button>
              <button
                onClick={onExit || (() => navigate('/dashboard'))}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-center"
              >
                🏠 Dashboard
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
