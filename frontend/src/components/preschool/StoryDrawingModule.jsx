import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Sparkles, Headphones, RotateCcw, CheckCircle2 } from 'lucide-react';
import { STORIES } from '../../data/creative/stories';
import { getItem } from '../../utils/storage';
import { recordStudentTestMarks, recordStudentQuestionAttempts } from '../../data/studentAnalyticsData';


// In-memory audio blob cache for instant narration without HTTP Range / streaming interruption
const audioBlobCache = new Map();

const fetchAudioBlobUrl = async (text) => {
  const trimmed = (text || '').trim();
  if (!trimmed) return null;

  if (audioBlobCache.has(trimmed)) {
    return audioBlobCache.get(trimmed);
  }

  const encoded = encodeURIComponent(trimmed);
  const urls = [
    `/api/tts/sinhala?text=${encoded}`,
    `http://localhost:5000/api/tts/sinhala?text=${encoded}`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const blob = await res.blob();
        if (blob && blob.size > 200) {
          const blobUrl = URL.createObjectURL(blob);
          audioBlobCache.set(trimmed, blobUrl);
          return blobUrl;
        }
      }
    } catch (e) {
      // Continue to next endpoint if primary fails
    }
  }
  return null;
};

const StoryDrawingModule = ({ onExit }) => {
    const [activeStory, setActiveStory] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setEvaluationResult(null); // Reset on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items || [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          processFile(blob);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const audioRef = useRef(null);
  const isCancelledRef = useRef(false);
  const playbackStateRef = useRef('idle');
  const playSessionIdRef = useRef(0);
  const [playbackState, setPlaybackState] = useState('idle'); // 'idle' | 'playing' | 'paused'
  const [activeParagraphIndex, setActiveParagraphIndex] = useState(null);
  const [activeWordInfo, setActiveWordInfo] = useState(null); // { paragraphIdx, sentenceIdx, wordIdx, wordText }
  
  // Tracking playback position for Resume functionality
  const queueRef = useRef([]);
  const secIdxRef = useRef(0);
  const sentIdxRef = useRef(0);
  const isSingleModeRef = useRef(false);
  const wordTrackerRef = useRef(null);

  // Student identification (Preserves across login/logout)
  const currentStudentId = getItem('studentId') || 'std_001';
  const currentStudentName = getItem('studentName') || 'Hasara';
  const studentKey = (currentStudentName || currentStudentId || 'student').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');

  // Multi-session reading progress
  const [allSavedProgress, setAllSavedProgress] = useState({});
  const [savedStoryProgress, setSavedStoryProgress] = useState(null);

  // Sentence and Word Calculation Helpers
  const getSentenceWordRanges = (text) => {
    if (!text) return [];
    const rawSentences = text
      .split(/(?<=[.!?\n])\s+/)
      .map(s => s.trim())
      .filter(Boolean);
    const sentences = rawSentences.length > 0 ? rawSentences : [text.trim()];

    let runningOffset = 0;
    return sentences.map((sentence) => {
      const words = sentence.split(/\s+/).filter(Boolean);
      const startWordIdx = runningOffset;
      runningOffset += words.length;
      return {
        sentence,
        words,
        startWordIdx,
        endWordIdx: Math.max(startWordIdx, runningOffset - 1)
      };
    });
  };

  const calculateWordIntervals = (words) => {
    if (!words || words.length === 0) return [];
    const weights = words.map(w => {
      const clean = w.replace(/^[“"'(]+|[.,!?:;’”")]+$/g, '');
      let wt = Math.max([...clean].length, 2);
      if (/[.,!?:;“”"']$/.test(w)) {
        wt += 2.5; // slight extra duration for punctuation pauses
      }
      return wt;
    });
    const totalWeight = weights.reduce((sum, val) => sum + val, 0) || 1;
    let cum = 0;
    return words.map((word, i) => {
      const startFrac = cum / totalWeight;
      cum += weights[i];
      const endFrac = cum / totalWeight;
      return { word, startFrac, endFrac };
    });
  };

  const getSurroundingSnippet = (story, paragraphIdx, wordIdx) => {
    if (!story) return '';
    let text = '';
    if (paragraphIdx === -1) text = story.title;
    else if (paragraphIdx === 999) text = story.moral;
    else if (story.paragraphs && story.paragraphs[paragraphIdx]) text = story.paragraphs[paragraphIdx];
    else return '';

    const words = text.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '';
    const safeIdx = Math.max(0, Math.min(wordIdx, words.length - 1));
    const start = Math.max(0, safeIdx - 2);
    const end = Math.min(words.length, safeIdx + 4);
    return words.slice(start, end).join(' ');
  };

  const calculateStoryProgressPercent = (story, paragraphIdx, wordIdx) => {
    if (!story || !story.paragraphs) return 0;
    const totalParas = story.paragraphs.length + 1; // paragraphs + moral
    if (paragraphIdx === 999) return 100;
    const pIdx = Math.max(0, paragraphIdx);
    const currentParaWords = (story.paragraphs[pIdx] || '').trim().split(/\s+/).filter(Boolean).length || 1;
    const paraFraction = Math.min(Math.max(wordIdx / currentParaWords, 0), 1);
    const percent = Math.round(((pIdx + paraFraction) / totalParas) * 100);
    return Math.min(99, Math.max(1, percent));
  };

  // Load reading progress from localStorage & Backend API (Persists across logout/login)
  const loadSavedProgress = async () => {
    try {
      const storageKey = `story_reading_progress_${studentKey}`;
      let localData = {};
      try {
        localData = {
          ...JSON.parse(localStorage.getItem('story_reading_progress') || '{}'),
          ...JSON.parse(localStorage.getItem(storageKey) || '{}')
        };
      } catch (e) {}
      setAllSavedProgress(localData);

      try {
        const res = await fetch(`http://localhost:5000/api/preschool/story-progress/${studentKey}`);
        if (res.ok) {
          const apiData = await res.json();
          if (apiData?.progress && typeof apiData.progress === 'object') {
            const merged = { ...localData, ...apiData.progress };
            setAllSavedProgress(merged);
            localStorage.setItem(storageKey, JSON.stringify(merged));
          }
        }
      } catch (err) {
        // Fallback to local storage
      }
    } catch (e) {
      console.warn('Error loading story progress:', e);
    }
  };

  useEffect(() => {
    loadSavedProgress();
  }, [studentKey]);

  // Synchronize active story's progress
  useEffect(() => {
    if (activeStory) {
      const storageKey = `story_reading_progress_${studentKey}`;
      let localFallback = {};
      try {
        localFallback = {
          ...JSON.parse(localStorage.getItem('story_reading_progress') || '{}'),
          ...JSON.parse(localStorage.getItem(storageKey) || '{}')
        };
      } catch (e) {}
      const prog = allSavedProgress[activeStory.id] || localFallback[activeStory.id] || null;
      setSavedStoryProgress(prog);
    } else {
      setSavedStoryProgress(null);
    }
  }, [activeStory, allSavedProgress, studentKey]);

  // Save Progress Helper
  const saveProgress = (progressData) => {
    if (!activeStory || !progressData) return;
    try {
      const storageKey = `story_reading_progress_${studentKey}`;
      const updated = {
        ...allSavedProgress,
        [activeStory.id]: progressData
      };
      setAllSavedProgress(updated);
      setSavedStoryProgress(progressData);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.setItem('story_reading_progress', JSON.stringify(updated));

      fetch('http://localhost:5000/api/preschool/story-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData)
      }).catch(err => {
        console.warn('Backend progress save failed (local copy preserved):', err.message);
      });
    } catch (e) {
      console.warn('Could not save progress:', e);
    }
  };

  const clearSavedProgressForStory = (storyId) => {
    try {
      const storageKey = `story_reading_progress_${studentKey}`;
      const updated = { ...allSavedProgress };
      delete updated[storyId];
      setAllSavedProgress(updated);
      setSavedStoryProgress(null);
      localStorage.setItem(storageKey, JSON.stringify(updated));

      fetch(`http://localhost:5000/api/preschool/story-progress/${studentKey}/${storyId}`, {
        method: 'DELETE'
      }).catch(() => {});
    } catch (e) {}
  };

  const clearWordTimer = () => {
    if (wordTrackerRef.current) {
      clearInterval(wordTrackerRef.current);
      wordTrackerRef.current = null;
    }
  };

  const stopStory = (preserveProgress = false) => {
    isCancelledRef.current = true;
    playSessionIdRef.current += 1;
    clearWordTimer();
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      } catch (e) {}
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (preserveProgress && activeStory && activeParagraphIndex !== null && activeParagraphIndex !== undefined) {
      const wordIdx = activeWordInfo?.wordIdx ?? 0;
      const wordText = activeWordInfo?.wordText ?? '';
      const progressRecord = {
        studentId: currentStudentId,
        studentName: currentStudentName,
        storyId: activeStory.id,
        storyTitle: activeStory.title,
        paragraphIdx: activeParagraphIndex,
        sentenceIdx: sentIdxRef.current,
        wordIdx,
        wordText,
        snippet: getSurroundingSnippet(activeStory, activeParagraphIndex, wordIdx),
        progressPercent: calculateStoryProgressPercent(activeStory, activeParagraphIndex, wordIdx),
        completed: false,
        timestamp: new Date().toISOString()
      };
      saveProgress(progressRecord);
    }

    playbackStateRef.current = 'idle';
    setPlaybackState('idle');
    setActiveParagraphIndex(null);
    setActiveWordInfo(null);
    secIdxRef.current = 0;
    sentIdxRef.current = 0;
    isSingleModeRef.current = false;
  };

  const pauseStory = () => {
    playbackStateRef.current = 'paused';
    clearWordTimer();
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch (e) {}
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    setPlaybackState('paused');

    // Immediately persist where child paused so it survives logout and re-login!
    if (activeStory && activeParagraphIndex !== null) {
      const wordIdx = activeWordInfo?.wordIdx ?? 0;
      const wordText = activeWordInfo?.wordText ?? '';
      const progressRecord = {
        studentId: currentStudentId,
        studentName: currentStudentName,
        storyId: activeStory.id,
        storyTitle: activeStory.title,
        paragraphIdx: activeParagraphIndex,
        sentenceIdx: sentIdxRef.current,
        wordIdx,
        wordText,
        snippet: getSurroundingSnippet(activeStory, activeParagraphIndex, wordIdx),
        progressPercent: calculateStoryProgressPercent(activeStory, activeParagraphIndex, wordIdx),
        completed: false,
        timestamp: new Date().toISOString()
      };
      saveProgress(progressRecord);
    }
  };

  const resumeStory = () => {
    isCancelledRef.current = false;
    playbackStateRef.current = 'playing';
    setPlaybackState('playing');
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      return;
    }
    if (audioRef.current && audioRef.current.src && !audioRef.current.ended) {
      audioRef.current.play().catch(() => {
        playFromCurrentIndex();
      });
    } else {
      playFromCurrentIndex();
    }
  };

  const playFromCurrentIndex = () => {
    if (!activeStory) return;
    isCancelledRef.current = false;
    playbackStateRef.current = 'playing';
    const currentSessionId = ++playSessionIdRef.current;
    setPlaybackState('playing');

    const sections = queueRef.current.length > 0 ? queueRef.current : [
      { text: activeStory.title, paragraphIdx: -1 },
      ...activeStory.paragraphs.map((p, idx) => ({ text: p, paragraphIdx: idx })),
      { text: `කතාවේ ආදර්ශය. ${activeStory.moral}`, paragraphIdx: 999 }
    ];
    queueRef.current = sections;

    const playSection = (secIdx, startSentIdx = 0) => {
      if (isCancelledRef.current || playSessionIdRef.current !== currentSessionId || secIdx >= sections.length) {
        if (!isSingleModeRef.current && activeStory && secIdx >= sections.length) {
          const completedRecord = {
            studentId: currentStudentId,
            studentName: currentStudentName,
            storyId: activeStory.id,
            storyTitle: activeStory.title,
            paragraphIdx: 999,
            sentenceIdx: 0,
            wordIdx: 0,
            wordText: '',
            snippet: 'කතාව සම්පූර්ණයෙන්ම අසා අවසන්!',
            progressPercent: 100,
            completed: true,
            timestamp: new Date().toISOString()
          };
          saveProgress(completedRecord);
        }
        stopStory();
        return;
      }

      secIdxRef.current = secIdx;
      const item = sections[secIdx];
      setActiveParagraphIndex(item.paragraphIdx);

      const sentenceRanges = getSentenceWordRanges(item.text);
      const sentences = sentenceRanges.length > 0 ? sentenceRanges : [{
        sentence: item.text,
        words: item.text.split(/\s+/).filter(Boolean),
        startWordIdx: 0,
        endWordIdx: item.text.split(/\s+/).filter(Boolean).length - 1
      }];

      const playSentence = async (sIdx) => {
        if (isCancelledRef.current || playbackStateRef.current !== 'playing' || playSessionIdRef.current !== currentSessionId) return;
        if (sIdx >= sentences.length) {
          if (isSingleModeRef.current) {
            stopStory();
          } else {
            playSection(secIdx + 1, 0);
          }
          return;
        }

        sentIdxRef.current = sIdx;
        const currentSentenceObj = sentences[sIdx];
        const sentenceText = currentSentenceObj.sentence;
        const sentenceWords = currentSentenceObj.words;

        const intervals = calculateWordIntervals(sentenceWords);

        // Word Tracking Logic for Real-time Highlight
        const attachAudioTracker = (audioEl) => {
          clearWordTimer();
          const tracker = () => {
            if (!audioEl || audioEl.paused || audioEl.ended) return;
            const curTime = audioEl.currentTime;
            const dur = (audioEl.duration && !isNaN(audioEl.duration) && audioEl.duration > 0)
              ? audioEl.duration
              : Math.max(1.5, sentenceWords.length * 0.45);
            const frac = Math.min(Math.max(curTime / dur, 0), 0.999);

            let matchedIdx = 0;
            for (let i = 0; i < intervals.length; i++) {
              if (frac >= intervals[i].startFrac && frac < intervals[i].endFrac) {
                matchedIdx = i;
                break;
              }
            }

            const globalIdx = currentSentenceObj.startWordIdx + matchedIdx;
            const word = sentenceWords[matchedIdx] || '';
            setActiveWordInfo({
              paragraphIdx: item.paragraphIdx,
              sentenceIdx: sIdx,
              wordIdx: globalIdx,
              wordText: word
            });
          };

          audioEl.ontimeupdate = tracker;
          wordTrackerRef.current = setInterval(tracker, 45);
        };

        const attachSpeechSynthesisTracker = (utterance) => {
          clearWordTimer();
          const startTime = Date.now();
          const estimatedDur = Math.max(1500, sentenceWords.length * 520);

          wordTrackerRef.current = setInterval(() => {
            if (!('speechSynthesis' in window) || !window.speechSynthesis.speaking) return;
            const elapsed = Date.now() - startTime;
            const frac = Math.min(Math.max(elapsed / estimatedDur, 0), 0.999);

            let matchedIdx = 0;
            for (let i = 0; i < intervals.length; i++) {
              if (frac >= intervals[i].startFrac && frac < intervals[i].endFrac) {
                matchedIdx = i;
                break;
              }
            }

            setActiveWordInfo({
              paragraphIdx: item.paragraphIdx,
              sentenceIdx: sIdx,
              wordIdx: currentSentenceObj.startWordIdx + matchedIdx,
              wordText: sentenceWords[matchedIdx] || ''
            });
          }, 45);

          utterance.onboundary = (e) => {
            if (e.name === 'word' || typeof e.charIndex === 'number') {
              const charIdx = e.charIndex;
              let counted = 0;
              for (let i = 0; i < sentenceWords.length; i++) {
                counted += sentenceWords[i].length + 1;
                if (charIdx <= counted) {
                  setActiveWordInfo({
                    paragraphIdx: item.paragraphIdx,
                    sentenceIdx: sIdx,
                    wordIdx: currentSentenceObj.startWordIdx + i,
                    wordText: sentenceWords[i]
                  });
                  break;
                }
              }
            }
          };
        };

        let hasTransitioned = false;
        const transitionToNext = () => {
          if (hasTransitioned) return;
          hasTransitioned = true;
          clearWordTimer();
          if (!isCancelledRef.current && playbackStateRef.current === 'playing' && playSessionIdRef.current === currentSessionId) {
            playSentence(sIdx + 1);
          }
        };

        const trySpeechSynthesisFallback = () => {
          if (isCancelledRef.current || hasTransitioned || playbackStateRef.current !== 'playing' || playSessionIdRef.current !== currentSessionId) return;
          if (!('speechSynthesis' in window)) {
            transitionToNext();
            return;
          }
          try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(sentenceText);
            const voices = window.speechSynthesis.getVoices() || [];
            const siVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('si'));
            if (siVoice) {
              utterance.voice = siVoice;
              utterance.lang = siVoice.lang;
            }
            utterance.rate = 0.85;
            utterance.pitch = 1.15;
            utterance.onend = () => transitionToNext();
            utterance.onerror = () => transitionToNext();
            attachSpeechSynthesisTracker(utterance);
            window.speechSynthesis.speak(utterance);
          } catch (e) {
            console.warn('[TTS] Synthesis fallback error:', e);
            transitionToNext();
          }
        };

        // Prefetch next sentence in background for instant smooth playback
        if (sIdx + 1 < sentences.length) {
          fetchAudioBlobUrl(sentences[sIdx + 1].sentence).catch(() => {});
        }

        // Fetch audio blob for current sentence
        let blobUrl = null;
        try {
          blobUrl = await fetchAudioBlobUrl(sentenceText);
        } catch (err) {
          console.warn('[TTS] Error fetching blob:', err);
        }

        if (isCancelledRef.current || playbackStateRef.current !== 'playing' || playSessionIdRef.current !== currentSessionId) {
          return;
        }

        if (!blobUrl) {
          console.warn('[TTS] Blob unavailable, falling back to speech synthesis');
          trySpeechSynthesisFallback();
          return;
        }

        let audio = audioRef.current;
        if (!audio) {
          audio = new Audio();
          audioRef.current = audio;
        }

        // Clean previous callbacks
        audio.onended = null;
        audio.onerror = null;
        audio.onplay = null;
        audio.ontimeupdate = null;

        audio.onended = () => {
          if (playSessionIdRef.current === currentSessionId) {
            transitionToNext();
          }
        };

        audio.onplay = () => {
          if (playSessionIdRef.current === currentSessionId) {
            attachAudioTracker(audio);
          }
        };

        audio.onerror = (e) => {
          console.warn('[TTS] Audio element error with blob:', e);
          if (playSessionIdRef.current === currentSessionId) {
            trySpeechSynthesisFallback();
          }
        };

        audio.src = blobUrl;
        try {
          await audio.play();
        } catch (playErr) {
          console.warn('[TTS] Blob play() rejected:', playErr.message);
          if (!isCancelledRef.current && playbackStateRef.current === 'playing' && playSessionIdRef.current === currentSessionId) {
            trySpeechSynthesisFallback();
          }
        }
      };

      playSentence(startSentIdx);
    };

    playSection(secIdxRef.current, sentIdxRef.current);
  };

  const startFullStory = () => {
    stopStory();
    if (!activeStory) return;
    queueRef.current = [
      { text: activeStory.title, paragraphIdx: -1 },
      ...activeStory.paragraphs.map((p, idx) => ({ text: p, paragraphIdx: idx })),
      { text: `කතාවේ ආදර්ශය. ${activeStory.moral}`, paragraphIdx: 999 }
    ];
    secIdxRef.current = 0;
    sentIdxRef.current = 0;
    isSingleModeRef.current = false;
    playFromCurrentIndex();
  };

  const playSingleParagraph = (pIdx, pText) => {
    // If this paragraph is where the child paused/stopped previously and playback is idle, resume from that sentence!
    if (playbackState === 'idle' && savedStoryProgress?.storyId === activeStory.id && savedStoryProgress.paragraphIdx === pIdx && !savedStoryProgress.completed) {
      resumeFromSavedProgress(savedStoryProgress);
      return;
    }

    // If already playing this paragraph, toggle pause/resume
    if (activeParagraphIndex === pIdx && playbackState === 'playing') {
      pauseStory();
      return;
    }
    if (activeParagraphIndex === pIdx && playbackState === 'paused') {
      resumeStory();
      return;
    }

    stopStory(true);
    queueRef.current = [{ text: pText, paragraphIdx: pIdx }];
    secIdxRef.current = 0;
    sentIdxRef.current = 0;
    isSingleModeRef.current = true;
    playFromCurrentIndex();
  };

  const resumeFromSavedProgress = (saved) => {
    if (!activeStory || !saved) return;
    stopStory(false);

    const sections = [
      { text: activeStory.title, paragraphIdx: -1 },
      ...activeStory.paragraphs.map((p, idx) => ({ text: p, paragraphIdx: idx })),
      { text: `කතාවේ ආදර්ශය. ${activeStory.moral}`, paragraphIdx: 999 }
    ];
    queueRef.current = sections;

    let targetSecIdx = 1;
    if (saved.paragraphIdx === -1) targetSecIdx = 0;
    else if (saved.paragraphIdx === 999) targetSecIdx = sections.length - 1;
    else if (typeof saved.paragraphIdx === 'number' && saved.paragraphIdx >= 0) {
      targetSecIdx = saved.paragraphIdx + 1;
    }

    secIdxRef.current = Math.min(targetSecIdx, sections.length - 1);
    sentIdxRef.current = saved.sentenceIdx || 0;
    isSingleModeRef.current = false;

    setActiveParagraphIndex(saved.paragraphIdx);
    setActiveWordInfo({
      paragraphIdx: saved.paragraphIdx,
      sentenceIdx: saved.sentenceIdx || 0,
      wordIdx: saved.wordIdx || 0,
      wordText: saved.wordText || ''
    });

    playFromCurrentIndex();
  };


  // Keep latest state in ref for safe access on beforeunload/unmount without re-triggering cleanup
  const latestStateRef = useRef({ activeStory, activeParagraphIndex, activeWordInfo, studentKey, currentStudentId, currentStudentName });
  useEffect(() => {
    latestStateRef.current = { activeStory, activeParagraphIndex, activeWordInfo, studentKey, currentStudentId, currentStudentName };
  }, [activeStory, activeParagraphIndex, activeWordInfo, studentKey, currentStudentId, currentStudentName]);

  // Save on tab close or page exit (runs ONLY once on mount, cleanup ONLY on unmount)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const state = latestStateRef.current;
      if (state.activeStory && state.activeParagraphIndex !== null && state.activeWordInfo) {
        const record = {
          studentId: state.currentStudentId,
          studentName: state.currentStudentName,
          storyId: state.activeStory.id,
          storyTitle: state.activeStory.title,
          paragraphIdx: state.activeParagraphIndex,
          sentenceIdx: sentIdxRef.current,
          wordIdx: state.activeWordInfo.wordIdx,
          wordText: state.activeWordInfo.wordText,
          snippet: getSurroundingSnippet(state.activeStory, state.activeParagraphIndex, state.activeWordInfo.wordIdx),
          progressPercent: calculateStoryProgressPercent(state.activeStory, state.activeParagraphIndex, state.activeWordInfo.wordIdx),
          completed: false,
          timestamp: new Date().toISOString()
        };
        const storageKey = `story_reading_progress_${state.studentKey}`;
        const existing = JSON.parse(localStorage.getItem(storageKey) || '{}');
        existing[state.activeStory.id] = record;
        localStorage.setItem(storageKey, JSON.stringify(existing));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
      stopStory(); // Only stops when component truly unmounts!
    };
  }, []);

  // Helper to render words with real-time highlighting and paused markers
  const renderParagraphWords = (text, pIdx) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const isThisActivePara = activeParagraphIndex === pIdx;
    const isThisSavedResume = savedStoryProgress?.storyId === activeStory?.id && 
                              savedStoryProgress?.paragraphIdx === pIdx && 
                              !savedStoryProgress?.completed;

    return words.map((word, wIdx) => {
      const isSpeakingWord = isThisActivePara && playbackState === 'playing' && activeWordInfo?.wordIdx === wIdx;
      const isPausedSpeakingWord = isThisActivePara && playbackState === 'paused' && activeWordInfo?.wordIdx === wIdx;
      const isSavedResumeWord = isThisSavedResume && playbackState === 'idle' && savedStoryProgress?.wordIdx === wIdx;

      if (isSpeakingWord) {
        return (
          <span
            key={wIdx}
            className="inline-block mx-0.5 text-amber-600 font-bold transition-colors duration-150 font-sinhala"
          >
            {word}
          </span>
        );
      }

      if (isPausedSpeakingWord) {
        return (
          <span
            key={wIdx}
            className="inline-block mx-0.5 text-amber-600 font-bold underline decoration-amber-500 decoration-2 underline-offset-4 font-sinhala"
            title="ශ්‍රවණය විරාම කළ ස්ථානය"
          >
            {word}
          </span>
        );
      }

      if (isSavedResumeWord) {
        return (
          <span
            key={wIdx}
            className="inline-block mx-0.5 text-emerald-800 font-bold underline decoration-emerald-500 decoration-2 underline-offset-4 bg-emerald-100/90 px-1 rounded shadow-2xs font-sinhala"
            title="පෙර ඔබ නැවතුණු ස්ථානය"
          >
            {word}
          </span>
        );
      }

      return (
        <span
          key={wIdx}
          className={`inline-block mx-0.5 transition-colors duration-150 ${
            isThisActivePara && activeWordInfo && wIdx < activeWordInfo.wordIdx
              ? 'text-amber-800/80 font-medium'
              : ''
          }`}
        >
          {word}
        </span>
      );
    });
  };

  const handleEvaluate = async () => {
    if (!selectedImage) return;

    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const token = localStorage.getItem('token');
      const expectedElements = activeStory.expectedElements;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch('http://localhost:5000/api/creative/story-evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: getItem('studentId') || getItem('studentName') || "student",
          imageBase64: selectedImage,
          expectedElements: expectedElements
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setEvaluationResult(data);

        const drawingScore = data.score !== undefined ? data.score : 85;
        const currentStudentId = getItem('studentId') || 'std_001';
        const currentStudentName = getItem('studentName') || 'Hasara';

        try {
          const studentKey = (currentStudentName || 'hasara').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
          const storyId = activeStory?.id || 'story_task';
          const existing = JSON.parse(localStorage.getItem(`storydrawing_scores_${studentKey}`) || '{}');
          if (!existing[storyId]) {
            existing[storyId] = {
              storyId,
              title: activeStory?.title || activeStory?.englishTitle,
              score: drawingScore,
              grade: 'Grade 1',
              timestamp: new Date().toISOString()
            };
            localStorage.setItem(`storydrawing_scores_${studentKey}`, JSON.stringify(existing));
            if (studentKey === 'hasara' || studentKey === 'std_001') {
              localStorage.setItem('storydrawing_scores', JSON.stringify(existing));
            }
          }
        } catch (e) {}

        const p3Marks = Math.round((drawingScore / 100) * 30);
        recordStudentTestMarks({
          studentId: currentStudentId,
          name: currentStudentName,
          subject: 'preschool',
          categoryCode: 'P3',
          marks: p3Marks,
          maxMarks: 30
        });

        recordStudentQuestionAttempts({
          studentId: currentStudentId,
          module: 'preschool',
          grade: 'Grade 1',
          paperNumber: 1,
          attempts: [
            {
              questionId: `Story Drawing • ${activeStory?.title || 'Story Task'}`,
              domain: 'P3',
              category: 'P3',
              difficulty: 'Grade 1',
              isCorrect: drawingScore >= 50,
              score: drawingScore,
              timestamp: new Date().toISOString()
            }
          ]
        });
      } else {
        const errData = await response.json().catch(() => ({}));
        setEvaluationResult({
          feedback_sinhala: errData.feedback_sinhala || "ඇගයීම සම්පූර්ණ කිරීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.",
          feedback_english: errData.feedback_english || "Could not complete evaluation. Please try again."
        });
      }
    } catch (error) {
      console.error("Error evaluating drawing:", error);
      setEvaluationResult({
        feedback_sinhala: "සම්බන්ධතාවයේ දෝෂයක් හෝ ප්‍රමාදයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.",
        feedback_english: "Connection error or request timed out. Please try again."
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleBack = () => {
    stopStory(true);
    if (activeStory) {
      setActiveStory(null);
      setSelectedImage(null);
      setEvaluationResult(null);
    } else {
      onExit();
    }
  };

  return (
    <div className="flex-grow bg-slate-50 w-full min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-12 flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <button 
            onClick={handleBack}
            className="text-sm font-bold text-orange-700 hover:text-white hover:bg-orange-600 bg-orange-50 border border-orange-200 px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 shadow-sm font-sinhala"
          >
            <span>⬅</span> ආපසු (Back)
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-black text-slate-800 mb-1 font-sinhala">කතන්දර චිත්‍ර (Story Drawing)</h1>
            <p className="text-slate-500 font-medium text-sm font-sinhala">කතාව කියවා ඔබ සිතින් මවාගන්නා දේ අඳින්න! (Read the story and draw what you imagine!)</p>
          </div>
          <div className="w-24"></div>
        </header>

        {/* If no story is selected, show the story list (4 per row, total 2 rows) */}
          {!activeStory ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STORIES.map(story => (
                <div 
                  key={story.id}
                  onClick={() => setActiveStory(story)}
                  className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 hover:border-orange-300 hover:shadow-xl cursor-pointer transition-all transform hover:-translate-y-1.5 flex flex-col items-center text-center group"
                >
                  {story.image ? (
                    <div className="w-full h-64 sm:h-72 mb-4 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm flex items-center justify-center">
                      <img 
                        src={story.image} 
                        alt={story.title} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 sm:h-72 mb-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-orange-100 flex items-center justify-center text-5xl shadow-inner">
                      {story.emoji}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-slate-800 font-sinhala mb-1 leading-snug">{story.title}</h3>
                  <p className="text-slate-500 font-medium text-xs mb-2">{story.englishTitle}</p>
                  {allSavedProgress[story.id]?.completed && (
                    <div className="mt-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-[11px] font-bold shadow-2xs font-sinhala">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>අසා අවසන් (Completed)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: The Story */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col">
                {/* Title & Avatar */}
                <div className="flex items-center gap-3 mb-4">
                  {activeStory.image ? (
                    <img 
                      src={activeStory.image} 
                      alt={activeStory.title} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0" 
                    />
                  ) : (
                    <span className="text-3xl shrink-0">{activeStory.emoji}</span>
                  )}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 font-sinhala">
                      {activeParagraphIndex === -1 ? renderParagraphWords(activeStory.title, -1) : activeStory.title}
                    </h2>
                    {activeStory.englishTitle && (
                      <p className="text-xs text-slate-400 font-medium">{activeStory.englishTitle}</p>
                    )}
                  </div>
                </div>

                {/* Actions Button Group below the topic */}
                <div className="flex flex-wrap items-center gap-2.5 mb-6 border-b border-slate-100 pb-4">
                  {playbackState === 'idle' && (
                    <>
                      {savedStoryProgress?.storyId === activeStory.id && !savedStoryProgress.completed ? (
                        <>
                          <button 
                            type="button"
                            onClick={() => resumeFromSavedProgress(savedStoryProgress)}
                            className="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs sm:text-sm font-bold font-sinhala whitespace-nowrap shadow-sm shadow-emerald-200 active:scale-95 transition-all cursor-pointer animate-pulse"
                            title="නැවතුණු ස්ථානයේ සිට කතාව දිගටම අසන්න"
                          >
                            <Play className="w-4 h-4 fill-current shrink-0" />
                            <span>නැවතුණු තැනින් අසන්න ({savedStoryProgress.paragraphIdx === 999 ? 'ආදර්ශය' : `ඡේදය ${savedStoryProgress.paragraphIdx + 1}`})</span>
                          </button>
                          <button 
                            type="button"
                            onClick={startFullStory}
                            className="h-10 px-3.5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold font-sinhala whitespace-nowrap border border-slate-200/70 shadow-xs active:scale-95 transition-all cursor-pointer"
                            title="කතාව මුල සිට අසන්න"
                          >
                            <Volume2 className="w-4 h-4 shrink-0 text-slate-500" />
                            <span>මුල සිට කියවන්න</span>
                          </button>
                        </>
                      ) : (
                        <button 
                          type="button"
                          onClick={startFullStory}
                          className="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold font-sinhala whitespace-nowrap shadow-sm shadow-orange-200 active:scale-95 transition-all cursor-pointer"
                          title="මුළු කතාවටම සවන් දෙන්න"
                        >
                          <Volume2 className="w-4 h-4 shrink-0" />
                          <span>කතාව කියවන්න</span>
                        </button>
                      )}
                    </>
                  )}

                  {playbackState === 'playing' && (
                    <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                      <button 
                        type="button"
                        onClick={pauseStory}
                        className="h-8 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold font-sinhala whitespace-nowrap shadow-xs active:scale-95 transition-all cursor-pointer"
                        title="ශ්‍රවණය විරාම ගන්වන්න"
                      >
                        <Pause className="w-3.5 h-3.5 shrink-0" />
                        <span>විරාමය</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => stopStory(true)}
                        className="h-8 px-2.5 inline-flex items-center justify-center gap-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold font-sinhala whitespace-nowrap shadow-xs active:scale-95 transition-all cursor-pointer"
                        title="ශ්‍රවණය නවත්වන්න"
                      >
                        <Square className="w-3 h-3 shrink-0" />
                        <span>නවත්වන්න</span>
                      </button>
                    </div>
                  )}

                  {playbackState === 'paused' && (
                    <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                      <button 
                        type="button"
                        onClick={resumeStory}
                        className="h-8 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold font-sinhala whitespace-nowrap shadow-xs active:scale-95 transition-all cursor-pointer animate-pulse"
                        title="කතාව නැවත දිගටම කියවන්න"
                      >
                        <Play className="w-3.5 h-3.5 shrink-0" />
                        <span>දිගටම අසන්න</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => stopStory(true)}
                        className="h-8 px-2.5 inline-flex items-center justify-center gap-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold font-sinhala whitespace-nowrap active:scale-95 transition-all cursor-pointer"
                        title="ශ්‍රවණය නවත්වන්න"
                      >
                        <Square className="w-3 h-3 shrink-0" />
                        <span>නවත්වන්න</span>
                      </button>
                    </div>
                  )}

                  <button 
                    type="button"
                    onClick={() => { 
                      stopStory(true);
                      setActiveStory(null); 
                      setSelectedImage(null); 
                      setEvaluationResult(null); 
                    }}
                    className="h-10 px-3.5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold font-sinhala whitespace-nowrap border border-slate-200/70 shadow-xs active:scale-95 transition-all cursor-pointer"
                    title="වෙනත් කතාවක් තෝරන්න"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    <span>කතාව වෙනස් කරන්න</span>
                  </button>
                </div>


                {/* If Child Completed Story Banner */}
                {savedStoryProgress?.storyId === activeStory.id && savedStoryProgress.completed && (
                  <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-800">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <h5 className="text-xs font-bold font-sinhala">සුබ පැතුම්! ඔබ මෙම කතාව සම්පූර්ණයෙන්ම අසා අවසන් කර ඇත.</h5>
                        <p className="text-[11px] text-emerald-600 font-sinhala">නැවත සවන් දීමට 'කතාව කියවන්න' ඔබන්න.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => clearSavedProgressForStory(activeStory.id)}
                      className="text-[11px] font-bold text-emerald-700 hover:underline px-2 py-1 font-sinhala"
                    >
                      යළි පිහිටුවන්න
                    </button>
                  </div>
                )}
                
                <div id="story-paragraphs-scroll-container" className="prose text-slate-700 font-sinhala leading-relaxed flex-grow overflow-y-auto pr-2 max-h-[50vh] custom-scrollbar space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
                    <span className="flex items-center gap-1.5 text-amber-800">
                      <Headphones className="w-3.5 h-3.5 text-amber-600" />
                      <span>ඕනෑම ඡේදයක් මත ක්ලික් කර එයට පමණක් සවන් දෙන්න:</span>
                    </span>
                    {playbackState === 'playing' && (
                      <span className="text-[11px] text-amber-700 animate-pulse font-black flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block"></span>
                        හඬ වාදනය වේ...
                      </span>
                    )}
                  </div>

                  {activeStory.paragraphs.map((p, idx) => {
                    const isThisActive = activeParagraphIndex === idx;
                    const isThisPlaying = isThisActive && playbackState === 'playing';
                    const isThisPaused = isThisActive && playbackState === 'paused';
                    const isThisSavedResume = savedStoryProgress?.storyId === activeStory.id && 
                                              savedStoryProgress?.paragraphIdx === idx && 
                                              !savedStoryProgress?.completed;

                    return (
                      <div 
                        key={idx}
                        id={`story-para-box-${idx}`}
                        onClick={() => playSingleParagraph(idx, p)}
                        className={`group relative text-[1.08rem] p-4 rounded-2xl transition-all duration-300 cursor-pointer border ${
                          isThisPlaying
                            ? 'bg-amber-50/70 border-amber-300 shadow-xs' 
                            : isThisPaused
                            ? 'bg-amber-50/40 border-amber-200'
                            : isThisSavedResume && playbackState === 'idle'
                            ? 'bg-emerald-50/40 border-emerald-300 shadow-xs ring-1 ring-emerald-300/50'
                            : 'bg-white hover:bg-slate-50 border-slate-100 shadow-2xs'
                        }`}
                      >
                        {isThisSavedResume && playbackState === 'idle' && (
                          <div className="mb-2 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300/80 shadow-2xs font-sinhala">
                              <span>📌</span>
                              <span>පෙර නැවතුණු ස්ථානය (ඡේදය {idx + 1})</span>
                            </span>
                            {savedStoryProgress.wordText && (
                              <span className="text-[11px] text-emerald-700 font-bold font-sinhala">
                                වචනය: "{savedStoryProgress.wordText}"
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-3">
                          <p className="flex-grow select-text leading-relaxed">
                            {renderParagraphWords(p, idx)}
                          </p>
                          <div className="shrink-0 pt-0.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playSingleParagraph(idx, p);
                              }}
                              className={`p-2 rounded-xl transition-all cursor-pointer ${
                                isThisPlaying 
                                  ? 'bg-amber-500 text-white shadow-sm animate-pulse' 
                                  : isThisPaused
                                  ? 'bg-emerald-500 text-white'
                                  : isThisSavedResume && playbackState === 'idle'
                                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                                  : 'bg-slate-100 group-hover:bg-orange-200 text-slate-500 group-hover:text-orange-800'
                              }`}
                              title={
                                isThisPlaying 
                                  ? "විරාමය" 
                                  : isThisSavedResume && playbackState === 'idle' 
                                  ? "නැවතුණු තැනින් අසන්න" 
                                  : "මෙම ඡේදයට සවන් දෙන්න"
                              }
                            >
                              {isThisPlaying ? (
                                <Pause className="w-4 h-4" />
                              ) : isThisPaused ? (
                                <Play className="w-4 h-4" />
                              ) : isThisSavedResume && playbackState === 'idle' ? (
                                <Play className="w-4 h-4 fill-current" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Moral Section (Also Click-to-Listen with word highlighting) */}
                  <div 
                    id="story-para-box-999"
                    onClick={() => playSingleParagraph(999, `කතාවේ ආදර්ශය. ${activeStory.moral}`)}
                    className={`mt-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      activeParagraphIndex === 999 && playbackState === 'playing'
                        ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                        : activeParagraphIndex === 999 && playbackState === 'paused'
                        ? 'bg-amber-50/40 border-amber-200'
                        : savedStoryProgress?.storyId === activeStory.id && savedStoryProgress?.paragraphIdx === 999 && !savedStoryProgress?.completed && playbackState === 'idle'
                        ? 'bg-emerald-50/40 border-emerald-300 shadow-xs ring-1 ring-emerald-300/50'
                        : 'bg-orange-50/60 hover:bg-orange-50 border-orange-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-orange-800 flex items-center gap-1.5 font-sinhala">
                        <span>ආදර්ශය:</span>
                        {savedStoryProgress?.storyId === activeStory.id && savedStoryProgress?.paragraphIdx === 999 && !savedStoryProgress?.completed && playbackState === 'idle' && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300/80">
                            📌 පෙර නැවතුණු ස්ථානය
                          </span>
                        )}
                      </h4>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSingleParagraph(999, `කතාවේ ආදර්ශය. ${activeStory.moral}`);
                        }}
                        className="p-1.5 rounded-xl bg-orange-200 hover:bg-orange-300 text-orange-900 transition-all cursor-pointer"
                        title="ආදර්ශයට සවන් දෙන්න"
                      >
                        {activeParagraphIndex === 999 && playbackState === 'playing' ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : savedStoryProgress?.storyId === activeStory.id && savedStoryProgress?.paragraphIdx === 999 && !savedStoryProgress?.completed && playbackState === 'idle' ? (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-orange-700 font-medium italic text-[1.05rem]">
                      {renderParagraphWords(activeStory.moral, 999)}
                    </p>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-2">ඔබේ කාර්යය:</h3>
              <p className="text-blue-700 text-sm">
                කතාව කියවා ඔබ සිතින් මවාගන්නා දේ චිත්‍රයට නඟන්න! ඉන්පසු එහි ඡායාරූපයක් ගෙන මෙහි උඩුගත කරන්න.
              </p>
            </div>
          </div>

          {/* Right Column: Upload and Evaluate */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <span className="text-3xl">🎨</span>
              <h2 className="text-2xl font-bold text-slate-800 font-sinhala">ඔබේ චිත්‍රය (Your Drawing)</h2>
            </div>

            <div className="flex-grow flex flex-col justify-center">
              {!selectedImage ? (
                <div 
                  className={`border-4 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isDragging ? 'border-orange-500 bg-orange-100' : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                  onClick={() => fileInputRef.current.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <span className="text-6xl mb-4 block animate-bounce-slow">📸</span>
                  <p className="text-slate-700 font-bold mb-2">Click, Paste, or Drag your drawing here</p>
                  <p className="text-slate-500 text-sm">Supports JPG and PNG</p>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 bg-slate-50 flex items-center justify-center min-h-[300px]">
                  <img src={selectedImage} alt="Student Drawing" className="max-h-[400px] object-contain" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-700 p-2 rounded-xl shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange}
              />
            </div>

            {selectedImage && (
              <div className="mt-6">
                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating}
                  className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-md transition-all ${
                    isEvaluating ? 'bg-slate-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {isEvaluating ? 'පරීක්ෂා කරමින් පවතී...' : 'ඇගයීම ආරම්භ කරන්න (Evaluate)'}
                </button>
              </div>
            )}

            {evaluationResult && (
              <div className="mt-6 bg-slate-50 rounded-2xl p-6 border border-slate-200 animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-lg">AI Feedback</h3>
                </div>
                
                <p className="text-slate-700 font-sinhala text-lg">
                  {evaluationResult.feedback_sinhala}
                </p>
              </div>
            )}

          </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default StoryDrawingModule;
