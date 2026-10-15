import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Volume2, Play, Square, Sparkles, HelpCircle, Maximize2, Minimize2, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

// Phonetic Acoustic Formant Database for English Words & Phonemes
// Frequency ranges (in Hz): F0 (Pitch ~120-220Hz), F1 (Tongue Height 250-850Hz), F2 (Tongue Backness 800-2400Hz), Friction (Consonants 4000-8000Hz)
const PHONEME_ACOUSTICS = {
  // Front Vowels
  'iː': { name: 'Long EE (sheep)', f0: 160, f1: 280, f2: 2250, f3: 2800, friction: 0, type: 'vowel' },
  'ɪ':  { name: 'Short I (fish, milk)', f0: 160, f1: 400, f2: 1900, f3: 2600, friction: 0, type: 'vowel' },
  'e':  { name: 'Short E (bed)', f0: 160, f1: 550, f2: 1800, f3: 2500, friction: 0, type: 'vowel' },
  'eɪ': { name: 'Diphthong AY (cake)', f0: 160, f1: 520, f2: 1950, f3: 2600, friction: 0, type: 'diphthong' },
  'æ':  { name: 'Short A (cat, fan)', f0: 160, f1: 750, f2: 1700, f3: 2450, friction: 0, type: 'vowel' },
  
  // Central & Back Vowels
  'uː': { name: 'Long OO (school)', f0: 150, f1: 320, f2: 850, f3: 2200, friction: 0, type: 'vowel' },
  'ʊ':  { name: 'Short OO (book)', f0: 150, f1: 440, f2: 1050, f3: 2250, friction: 0, type: 'vowel' },
  'ɔː': { name: 'Long OR (water, four)', f0: 150, f1: 500, f2: 820, f3: 2400, friction: 0, type: 'vowel' },
  'ɒ':  { name: 'Short O (dog)', f0: 150, f1: 600, f2: 950, f3: 2450, friction: 0, type: 'vowel' },
  'ɑː': { name: 'Long AH (star)', f0: 150, f1: 700, f2: 1150, f3: 2500, friction: 0, type: 'vowel' },
  'ʌ':  { name: 'Short U (bus, cup)', f0: 150, f1: 650, f2: 1250, f3: 2400, friction: 0, type: 'vowel' },
  'ə':  { name: 'Schwa (banana)', f0: 150, f1: 500, f2: 1500, f3: 2400, friction: 0, type: 'vowel' },
  'aʊ': { name: 'Diphthong OW (house)', f0: 160, f1: 750, f2: 1200, f3: 2400, friction: 0, type: 'diphthong' },

  // Sibilants & High-Frequency Fricatives (Friction > 4 kHz)
  's':  { name: 'Hiss S (school, star)', f0: 0, f1: 0, f2: 0, f3: 0, friction: 6200, frictionBand: 2400, type: 'sibilant' },
  'z':  { name: 'Buzz Z (zoo, busy)', f0: 140, f1: 0, f2: 0, f3: 0, friction: 5800, frictionBand: 2200, type: 'sibilant_voiced' },
  'ʃ':  { name: 'Hush SH (fish, ship)', f0: 0, f1: 0, f2: 0, f3: 0, friction: 3800, frictionBand: 2800, type: 'fricative' },
  'f':  { name: 'Bite F (fan, fish)', f0: 0, f1: 0, f2: 0, f3: 0, friction: 4500, frictionBand: 3200, type: 'fricative' },
  'v':  { name: 'Teeth V (van, very)', f0: 140, f1: 0, f2: 0, f3: 0, friction: 4200, frictionBand: 2600, type: 'fricative_voiced' },
  'θ':  { name: 'Soft TH (three, think)', f0: 0, f1: 0, f2: 0, f3: 0, friction: 5000, frictionBand: 3000, type: 'fricative' },
  'ð':  { name: 'Voiced TH (mother, this)', f0: 140, f1: 0, f2: 0, f3: 0, friction: 4600, frictionBand: 2600, type: 'fricative_voiced' },
  'h':  { name: 'Aspiration H (house)', f0: 0, f1: 600, f2: 1500, f3: 2400, friction: 3200, frictionBand: 2000, type: 'aspiration' },

  // Plosives & Stops (Transient Burst)
  'k':  { name: 'Velar Stop K (cat, milk)', burstFreq: 2200, type: 'plosive' },
  't':  { name: 'Alveolar Stop T (cat, star)', burstFreq: 3800, type: 'plosive' },
  'p':  { name: 'Bilabial Stop P (pan)', burstFreq: 1100, type: 'plosive' },
  'b':  { name: 'Voiced Stop B (bus, book)', f0: 130, burstFreq: 1000, type: 'plosive_voiced' },
  'd':  { name: 'Voiced Stop D (dog)', f0: 130, burstFreq: 3500, type: 'plosive_voiced' },
  'ɡ':  { name: 'Voiced Stop G (girl)', f0: 130, burstFreq: 2000, type: 'plosive_voiced' },

  // Nasals & Liquids
  'm':  { name: 'Nasal M (milk)', f0: 140, f1: 250, f2: 1000, f3: 2200, type: 'nasal' },
  'n':  { name: 'Nasal N (fan, sun)', f0: 140, f1: 250, f2: 1400, f3: 2200, type: 'nasal' },
  'l':  { name: 'Liquid L (school, milk)', f0: 150, f1: 350, f2: 1100, f3: 2700, type: 'liquid' },
  'r':  { name: 'Rhotic R (tree, red)', f0: 150, f1: 350, f2: 1200, f3: 1600, type: 'liquid' },
  'w':  { name: 'Glide W (water)', f0: 140, f1: 300, f2: 750, f3: 2200, type: 'glide' }
};

// Word-to-Phoneme Breakdown for Standard Words in Curriculum
const WORD_PHONEME_MAP = {
  'school': [
    { ph: 's', dur: 0.28 },
    { ph: 'k', dur: 0.12 },
    { ph: 'uː', dur: 0.38 },
    { ph: 'l', dur: 0.22 }
  ],
  'house': [
    { ph: 'h', dur: 0.18 },
    { ph: 'aʊ', dur: 0.50 },
    { ph: 's', dur: 0.28 }
  ],
  'fish': [
    { ph: 'f', dur: 0.25 },
    { ph: 'ɪ', dur: 0.35 },
    { ph: 'ʃ', dur: 0.35 }
  ],
  'cat': [
    { ph: 'k', dur: 0.15 },
    { ph: 'æ', dur: 0.45 },
    { ph: 't', dur: 0.22 }
  ],
  'fan': [
    { ph: 'f', dur: 0.25 },
    { ph: 'æ', dur: 0.42 },
    { ph: 'n', dur: 0.25 }
  ],
  'star': [
    { ph: 's', dur: 0.28 },
    { ph: 't', dur: 0.14 },
    { ph: 'ɑː', dur: 0.48 },
    { ph: 'r', dur: 0.15 }
  ],
  'elephant': [
    { ph: 'e', dur: 0.20 },
    { ph: 'l', dur: 0.15 },
    { ph: 'ə', dur: 0.15 },
    { ph: 'f', dur: 0.18 },
    { ph: 'æ', dur: 0.22 },
    { ph: 'n', dur: 0.14 },
    { ph: 't', dur: 0.12 }
  ],
  'ship': [
    { ph: 'ʃ', dur: 0.28 },
    { ph: 'ɪ', dur: 0.35 },
    { ph: 'p', dur: 0.18 }
  ],
  'water': [
    { ph: 'w', dur: 0.20 },
    { ph: 'ɔː', dur: 0.38 },
    { ph: 't', dur: 0.14 },
    { ph: 'ə', dur: 0.24 }
  ],
  'milk': [
    { ph: 'm', dur: 0.20 },
    { ph: 'ɪ', dur: 0.35 },
    { ph: 'l', dur: 0.22 },
    { ph: 'k', dur: 0.18 }
  ],
  'van': [
    { ph: 'v', dur: 0.25 },
    { ph: 'æ', dur: 0.45 },
    { ph: 'n', dur: 0.25 }
  ],
  'mother': [
    { ph: 'm', dur: 0.18 },
    { ph: 'ʌ', dur: 0.30 },
    { ph: 'ð', dur: 0.22 },
    { ph: 'ə', dur: 0.25 }
  ],
  'four': [
    { ph: 'f', dur: 0.28 },
    { ph: 'ɔː', dur: 0.50 }
  ],
  'book': [
    { ph: 'b', dur: 0.15 },
    { ph: 'ʊ', dur: 0.40 },
    { ph: 'k', dur: 0.20 }
  ],
  'bus': [
    { ph: 'b', dur: 0.15 },
    { ph: 'ʌ', dur: 0.42 },
    { ph: 's', dur: 0.32 }
  ],
  'sun': [
    { ph: 's', dur: 0.28 },
    { ph: 'ʌ', dur: 0.40 },
    { ph: 'n', dur: 0.25 }
  ],
  'dog': [
    { ph: 'd', dur: 0.15 },
    { ph: 'ɒ', dur: 0.45 },
    { ph: 'ɡ', dur: 0.20 }
  ],
  'bird': [
    { ph: 'b', dur: 0.15 },
    { ph: 'ə', dur: 0.48 },
    { ph: 'd', dur: 0.18 }
  ],
  'tree': [
    { ph: 't', dur: 0.14 },
    { ph: 'r', dur: 0.20 },
    { ph: 'iː', dur: 0.52 }
  ],
  'banana': [
    { ph: 'b', dur: 0.12 },
    { ph: 'ə', dur: 0.18 },
    { ph: 'n', dur: 0.15 },
    { ph: 'ɑː', dur: 0.32 },
    { ph: 'n', dur: 0.15 },
    { ph: 'ə', dur: 0.22 }
  ],
  'three': [
    { ph: 'θ', dur: 0.26 },
    { ph: 'r', dur: 0.18 },
    { ph: 'iː', dur: 0.48 }
  ],
  'cake': [
    { ph: 'k', dur: 0.15 },
    { ph: 'eɪ', dur: 0.48 },
    { ph: 'k', dur: 0.20 }
  ],
  'zoo': [
    { ph: 'z', dur: 0.30 },
    { ph: 'uː', dur: 0.55 }
  ],
  'next': [
    { ph: 'n', dur: 0.18 },
    { ph: 'e', dur: 0.32 },
    { ph: 'k', dur: 0.14 },
    { ph: 's', dur: 0.22 },
    { ph: 't', dur: 0.15 }
  ],
  'busy': [
    { ph: 'b', dur: 0.14 },
    { ph: 'ɪ', dur: 0.30 },
    { ph: 'z', dur: 0.24 },
    { ph: 'iː', dur: 0.32 }
  ]
};

// Generates phoneme structure for any word or sentence
function getPhonemeSequence(text) {
  if (!text) return [];
  const clean = text.toLowerCase().trim();
  if (WORD_PHONEME_MAP[clean]) {
    return WORD_PHONEME_MAP[clean];
  }

  // Multi-word sentence or unknown word heuristic decomposition
  const words = clean.split(/\s+/);
  const result = [];
  words.forEach((w, wIdx) => {
    if (WORD_PHONEME_MAP[w]) {
      WORD_PHONEME_MAP[w].forEach(p => result.push({ ...p }));
    } else {
      // Basic rule-based phoneme approximation
      for (let i = 0; i < w.length; i++) {
        const char = w[i];
        if (char === 's') result.push({ ph: 's', dur: 0.22 });
        else if (char === 'f') result.push({ ph: 'f', dur: 0.20 });
        else if (char === 'v') result.push({ ph: 'v', dur: 0.20 });
        else if (char === 'h') result.push({ ph: 'h', dur: 0.18 });
        else if (char === 'a') result.push({ ph: 'æ', dur: 0.35 });
        else if (char === 'e') result.push({ ph: 'e', dur: 0.32 });
        else if (char === 'i') result.push({ ph: 'ɪ', dur: 0.32 });
        else if (char === 'o') result.push({ ph: 'ɒ', dur: 0.34 });
        else if (char === 'u') result.push({ ph: 'ʌ', dur: 0.34 });
        else if (char === 'k' || char === 'c') result.push({ ph: 'k', dur: 0.15 });
        else if (char === 't') result.push({ ph: 't', dur: 0.14 });
        else if (char === 'p') result.push({ ph: 'p', dur: 0.14 });
        else if (char === 'b') result.push({ ph: 'b', dur: 0.14 });
        else if (char === 'd') result.push({ ph: 'd', dur: 0.14 });
        else if (char === 'm') result.push({ ph: 'm', dur: 0.18 });
        else if (char === 'n') result.push({ ph: 'n', dur: 0.18 });
        else if (char === 'l') result.push({ ph: 'l', dur: 0.20 });
        else if (char === 'r') result.push({ ph: 'r', dur: 0.18 });
        else if (char === 'w') result.push({ ph: 'w', dur: 0.18 });
        else result.push({ ph: 'ə', dur: 0.15 });
      }
    }
    if (wIdx < words.length - 1) {
      result.push({ ph: 'pause', dur: 0.12 });
    }
  });
  return result;
}

// True Spectrogram Colormap (Midnight Navy -> Deep Violet -> Vivid Cyan -> Emerald Green -> Hot Amber -> White)
function getSpectrogramColor(intensity) {
  const v = Math.max(0, Math.min(1, intensity));
  if (v <= 0.05) {
    // Background dark midnight slate
    return { r: 11, g: 15, b: 25, a: 1 };
  } else if (v <= 0.22) {
    // Deep violet / indigo
    const t = (v - 0.05) / 0.17;
    return {
      r: Math.round(11 + t * 45),
      g: Math.round(15 + t * 15),
      b: Math.round(25 + t * 90),
      a: 0.85 + t * 0.15
    };
  } else if (v <= 0.45) {
    // Electric Cyan / Teal
    const t = (v - 0.22) / 0.23;
    return {
      r: Math.round(56 - t * 40),
      g: Math.round(30 + t * 150),
      b: Math.round(115 + t * 105),
      a: 1
    };
  } else if (v <= 0.70) {
    // Bright Emerald Green
    const t = (v - 0.45) / 0.25;
    return {
      r: Math.round(16 + t * 140),
      g: Math.round(180 + t * 50),
      b: Math.round(220 - t * 170),
      a: 1
    };
  } else if (v <= 0.88) {
    // Solar Amber / Orange
    const t = (v - 0.70) / 0.18;
    return {
      r: Math.round(156 + t * 90),
      g: Math.round(230 - t * 80),
      b: Math.round(50 - t * 40),
      a: 1
    };
  } else {
    // Peak Hot Yellow-White
    const t = (v - 0.88) / 0.12;
    return {
      r: Math.round(246 + t * 9),
      g: Math.round(150 + t * 105),
      b: Math.round(10 + t * 240),
      a: 1
    };
  }
}

/**
 * PronunciationSpectrogram Component
 * 
 * Visualizes sound frequencies (0 Hz to 8000 Hz) against time (seconds).
 * Features:
 * 1. Target Reference Model Spectrogram (with IPA formants F1, F2, F3 & consonant friction).
 * 2. Real-Time Live Microphone Spectrogram Waterfall when recording.
 * 3. Captured Student Voice Spectrogram (from microphone or audio file).
 * 4. Dual Compare Mode highlighting Sri Lankan MTI patterns & formant alignment.
 * 5. Audio playback sweep cursor synchronization.
 * 6. Responsive high-DPI canvas & expandable studio modal.
 */
export default function PronunciationSpectrogram({
  targetText = 'school',
  phoneticHint = '/skuːl/',
  mtiPattern = null,
  isListening = false,
  liveAnalyser = null,
  recordedAudioUrl = null,
  recordedSpectrogramFrames = [],
  assessmentResult = null,
  onPlayModelAudio = null,
  className = ''
}) {
  const [activeTab, setActiveTab] = useState('target'); // 'target' | 'student' | 'compare'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0.0 to 1.0
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const liveWaterfallHistoryRef = useRef([]);
  const audioElementRef = useRef(null);

  const phonemeSeq = useMemo(() => getPhonemeSequence(targetText), [targetText]);

  const totalTargetDuration = useMemo(() => {
    return phonemeSeq.reduce((acc, p) => acc + p.dur, 0) || 1.2;
  }, [phonemeSeq]);

  // If student speaks and finishes, switch tab to student or compare
  useEffect(() => {
    if (recordedSpectrogramFrames && recordedSpectrogramFrames.length > 5) {
      setActiveTab('compare');
    }
  }, [recordedSpectrogramFrames]);

  // When listening starts, ensure live tab is visible
  useEffect(() => {
    if (isListening) {
      setActiveTab('student');
    }
  }, [isListening]);

  // Clean audio playback on unmount
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Handle Playback with Sweep Cursor
  const handlePlayRecording = () => {
    if (!recordedAudioUrl) return;
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    const audio = new Audio(recordedAudioUrl);
    audioElementRef.current = audio;
    setIsPlayingAudio(true);
    setPlaybackProgress(0);

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setPlaybackProgress(audio.currentTime / audio.duration);
      }
    };
    audio.onended = () => {
      setIsPlayingAudio(false);
      setPlaybackProgress(0);
    };
    audio.play().catch(err => console.log("Audio play error:", err));
  };

  const handlePlayModel = () => {
    if (onPlayModelAudio) {
      onPlayModelAudio();
    }
    // Animate sweep line for target duration
    setIsPlayingAudio(true);
    setPlaybackProgress(0);
    const start = performance.now();
    const durationMs = totalTargetDuration * 1000;

    const tick = (now) => {
      const elapsed = now - start;
      const prog = Math.min(1, elapsed / durationMs);
      setPlaybackProgress(prog);
      if (prog < 1) {
        requestAnimationFrame(tick);
      } else {
        setIsPlayingAudio(false);
        setPlaybackProgress(0);
      }
    };
    requestAnimationFrame(tick);
  };

  // Generate Synthesized 2D Matrix for Target Model Spectrogram (Time x Freq)
  // Frequency bins: 100 bins covering 0 Hz to 8000 Hz (80 Hz per bin)
  const targetSpectrogramMatrix = useMemo(() => {
    const numTimeFrames = 80;
    const numFreqBins = 100; // 0 to 8000 Hz, ~80Hz/bin
    const matrix = Array.from({ length: numTimeFrames }, () => new Float32Array(numFreqBins));

    let accumulatedTime = 0;
    phonemeSeq.forEach(item => {
      const phKey = item.ph;
      const phDur = item.dur;
      const startFr = Math.floor((accumulatedTime / totalTargetDuration) * numTimeFrames);
      const endFr = Math.min(numTimeFrames - 1, Math.floor(((accumulatedTime + phDur) / totalTargetDuration) * numTimeFrames));
      accumulatedTime += phDur;

      const info = PHONEME_ACOUSTICS[phKey] || { f0: 150, f1: 500, f2: 1500, f3: 2500, friction: 0 };

      for (let t = startFr; t <= endFr; t++) {
        const frame = matrix[t];
        // Bell-shaped envelope for each phoneme slice
        const segRel = (t - startFr) / Math.max(1, endFr - startFr);
        const env = Math.sin(Math.PI * segRel);

        // Voicing F0 fundamental & pitch harmonics
        if (info.f0 > 0) {
          const f0Bin = Math.floor(info.f0 / 80);
          for (let h = 1; h <= 6; h++) {
            const hBin = f0Bin * h;
            if (hBin < numFreqBins) {
              frame[hBin] = Math.max(frame[hBin], 0.45 * env * (1 / Math.sqrt(h)));
            }
          }
        }

        // Formant 1 (Vowel Height: 250 - 850 Hz)
        if (info.f1 > 0) {
          const f1Bin = Math.floor(info.f1 / 80);
          for (let b = Math.max(0, f1Bin - 3); b <= Math.min(numFreqBins - 1, f1Bin + 3); b++) {
            const dist = Math.abs(b - f1Bin);
            const intensity = Math.exp(-(dist * dist) / 4) * 0.95 * env;
            frame[b] = Math.max(frame[b], intensity);
          }
        }

        // Formant 2 (Vowel Backness: 800 - 2400 Hz)
        if (info.f2 > 0) {
          const f2Bin = Math.floor(info.f2 / 80);
          for (let b = Math.max(0, f2Bin - 4); b <= Math.min(numFreqBins - 1, f2Bin + 4); b++) {
            const dist = Math.abs(b - f2Bin);
            const intensity = Math.exp(-(dist * dist) / 5) * 0.90 * env;
            frame[b] = Math.max(frame[b], intensity);
          }
        }

        // Formant 3 (2200 - 3200 Hz)
        if (info.f3 > 0) {
          const f3Bin = Math.floor(info.f3 / 80);
          for (let b = Math.max(0, f3Bin - 3); b <= Math.min(numFreqBins - 1, f3Bin + 3); b++) {
            const dist = Math.abs(b - f3Bin);
            const intensity = Math.exp(-(dist * dist) / 4) * 0.65 * env;
            frame[b] = Math.max(frame[b], intensity);
          }
        }

        // High Frequency Friction (Sibilant / Fricative noise: 4000 - 8000 Hz)
        if (info.friction > 0) {
          const fricCenterBin = Math.floor(info.friction / 80);
          const fricSpread = Math.floor((info.frictionBand || 2000) / 80 / 2);
          for (let b = Math.max(0, fricCenterBin - fricSpread); b <= Math.min(numFreqBins - 1, fricCenterBin + fricSpread); b++) {
            const noise = 0.5 + Math.random() * 0.5;
            const dist = Math.abs(b - fricCenterBin) / fricSpread;
            const intensity = Math.max(0, 1 - dist) * 0.92 * noise * env;
            frame[b] = Math.max(frame[b], intensity);
          }
        }

        // Plosive Burst (Transient vertical release)
        if (info.burstFreq) {
          if (t === startFr + 1 || t === startFr + 2) {
            for (let b = 5; b < numFreqBins - 5; b++) {
              frame[b] = Math.max(frame[b], 0.75 + Math.random() * 0.25);
            }
          }
        }
      }
    });

    return matrix;
  }, [phonemeSeq, totalTargetDuration]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Clear with Deep Midnight Background
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, width, height);

      // Graph Plotting Boundaries (Left axis 52px, Bottom axis 24px, Right info 64px)
      const plotLeft = 52;
      const plotTop = 14;
      const plotRight = width - 64;
      const plotBottom = height - 24;
      const plotWidth = Math.max(10, plotRight - plotLeft);
      const plotHeight = Math.max(10, plotBottom - plotTop);

      // 2. Draw Live Waterfall IF Listening
      if (isListening && liveAnalyser) {
        const freqCount = liveAnalyser.frequencyBinCount;
        const liveData = new Uint8Array(freqCount);
        liveAnalyser.getByteFrequencyData(liveData);

        // Keep 80-frame sliding waterfall
        liveWaterfallHistoryRef.current.push(new Uint8Array(liveData.subarray(0, 360)));
        if (liveWaterfallHistoryRef.current.length > 80) {
          liveWaterfallHistoryRef.current.shift();
        }

        const history = liveWaterfallHistoryRef.current;
        const colW = plotWidth / Math.max(1, history.length);

        for (let t = 0; t < history.length; t++) {
          const colData = history[t];
          const x = plotLeft + t * colW;
          const numBins = Math.min(100, colData.length);
          const binH = plotHeight / numBins;

          for (let b = 0; b < numBins; b++) {
            const rawVal = colData[b] / 255;
            const y = plotBottom - (b + 1) * binH;
            const col = getSpectrogramColor(rawVal);
            ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${col.a})`;
            ctx.fillRect(x, y, colW + 0.6, binH + 0.6);
          }
        }
      } else {
        // Render Static Spectrogram (Target Model, Student Voice, or Compare Mode)
        let matrixToDraw = null;

        if (activeTab === 'target') {
          matrixToDraw = targetSpectrogramMatrix;
        } else if (activeTab === 'student') {
          if (recordedSpectrogramFrames && recordedSpectrogramFrames.length > 0) {
            matrixToDraw = recordedSpectrogramFrames;
          } else {
            // Default placeholder target if not spoken yet
            matrixToDraw = targetSpectrogramMatrix;
          }
        } else if (activeTab === 'compare') {
          matrixToDraw = (recordedSpectrogramFrames && recordedSpectrogramFrames.length > 0)
            ? recordedSpectrogramFrames
            : targetSpectrogramMatrix;
        }

        if (matrixToDraw && matrixToDraw.length > 0) {
          const totalFrames = matrixToDraw.length;
          const colW = plotWidth / totalFrames;

          for (let t = 0; t < totalFrames; t++) {
            const frame = matrixToDraw[t];
            const x = plotLeft + t * colW;
            const numBins = Math.min(100, frame.length);
            const binH = plotHeight / numBins;

            for (let b = 0; b < numBins; b++) {
              let val = frame[b];
              // Normalize if Uint8Array (0-255) vs Float32Array (0.0 - 1.0)
              if (val > 1.0) val = val / 255;

              const y = plotBottom - (b + 1) * binH;
              const col = getSpectrogramColor(val);
              ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${col.a})`;
              ctx.fillRect(x, y, colW + 0.6, binH + 0.6);
            }
          }
        }

        // Draw Compare Overlay (Target Formants as Translucent Glowing Corridors)
        if (activeTab === 'compare') {
          const targetFrames = targetSpectrogramMatrix.length;
          const colW = plotWidth / targetFrames;

          ctx.lineWidth = 2;
          ctx.strokeStyle = 'rgba(52, 211, 153, 0.7)'; // Emerald Guide
          ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';

          phonemeSeq.forEach(item => {
            const info = PHONEME_ACOUSTICS[item.ph];
            if (info && info.f1 > 0 && info.f2 > 0) {
              const startX = plotLeft + (phonemeSeq.indexOf(item) / phonemeSeq.length) * plotWidth;
              const boxW = (item.dur / totalTargetDuration) * plotWidth;

              const f1Y = plotBottom - (info.f1 / 8000) * plotHeight;
              const f2Y = plotBottom - (info.f2 / 8000) * plotHeight;

              // Glowing Formant Target Box
              ctx.strokeRect(startX, f2Y - 8, boxW, 16);
              ctx.strokeRect(startX, f1Y - 6, boxW, 12);
              ctx.fillRect(startX, f2Y - 8, boxW, 16);
              ctx.fillRect(startX, f1Y - 6, boxW, 12);
            }
          });
        }
      }

      // 3. Grid & Reference Lines (0Hz, 2kHz, 4kHz, 6kHz, 8kHz)
      const freqMarkers = [
        { label: '8 kHz', hz: 8000, color: 'rgba(244, 63, 94, 0.4)' },
        { label: '6 kHz', hz: 6000, color: 'rgba(251, 191, 36, 0.25)' },
        { label: '4 kHz', hz: 4000, color: 'rgba(56, 189, 248, 0.25)' },
        { label: '2 kHz', hz: 2000, color: 'rgba(52, 211, 153, 0.35)' },
        { label: '500 Hz', hz: 500, color: 'rgba(168, 85, 247, 0.35)' },
        { label: '0 Hz', hz: 0, color: 'rgba(148, 163, 184, 0.4)' }
      ];

      ctx.setLineDash([3, 4]);
      freqMarkers.forEach(m => {
        const y = plotBottom - (m.hz / 8000) * plotHeight;
        ctx.strokeStyle = m.color;
        ctx.beginPath();
        ctx.moveTo(plotLeft, y);
        ctx.lineTo(plotRight, y);
        ctx.stroke();

        // Left Axis Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(m.label, plotLeft - 5, y);
      });
      ctx.setLineDash([]);

      // Right Axis Formant Annotations
      ctx.font = '10px ui-monospace, monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('Friction', plotRight + 6, plotBottom - (6500 / 8000) * plotHeight);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('F2 Vowel', plotRight + 6, plotBottom - (1900 / 8000) * plotHeight);
      ctx.fillStyle = '#34d399';
      ctx.fillText('F1 Height', plotRight + 6, plotBottom - (450 / 8000) * plotHeight);
      ctx.fillStyle = '#a855f7';
      ctx.fillText('F0 Pitch', plotRight + 6, plotBottom - (120 / 8000) * plotHeight);

      // 4. Time Axis (0.0s, 0.25s, 0.5s, 0.75s, 1.0s...)
      const timeStep = width > 700 ? 0.25 : 0.5;
      for (let s = 0; s <= totalTargetDuration + 0.15; s += timeStep) {
        const x = plotLeft + (s / totalTargetDuration) * plotWidth;
        if (x <= plotRight) {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
          ctx.beginPath();
          ctx.moveTo(x, plotTop);
          ctx.lineTo(x, plotBottom);
          ctx.stroke();

          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(`${s.toFixed(2)}s`, x, plotBottom + 5);
        }
      }

      // 5. Phonetic Alignment Labels on Top Timeline
      if (activeTab === 'target' || activeTab === 'compare') {
        let accTime = 0;
        phonemeSeq.forEach(item => {
          const startX = plotLeft + (accTime / totalTargetDuration) * plotWidth;
          const w = (item.dur / totalTargetDuration) * plotWidth;
          accTime += item.dur;

          if (item.ph !== 'pause') {
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 11px ui-sans-serif, system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(item.ph, startX + w / 2, plotTop - 2);
          }
        });
      }

      // 6. Playback Sweep Line
      if (isPlayingAudio && playbackProgress > 0) {
        const sweepX = plotLeft + playbackProgress * plotWidth;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(sweepX, plotTop);
        ctx.lineTo(sweepX, plotBottom);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Sweep time cursor bubble
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(sweepX, plotTop, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. Outer Border Frame
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(plotLeft, plotTop, plotWidth, plotHeight);

      ctx.restore();

      if (isListening) {
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [
    activeTab,
    isListening,
    liveAnalyser,
    targetSpectrogramMatrix,
    recordedSpectrogramFrames,
    isPlayingAudio,
    playbackProgress,
    phonemeSeq,
    totalTargetDuration
  ]);

  const hasStudentRecording = (recordedSpectrogramFrames && recordedSpectrogramFrames.length > 5) || Boolean(recordedAudioUrl);

  return (
    <div className={`bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-xl text-white relative transition-all duration-300 ${className} ${isExpanded ? 'fixed inset-4 z-50 overflow-y-auto max-w-5xl mx-auto flex flex-col justify-between shadow-2xl ring-4 ring-emerald-500/30' : ''}`}>
      
      {/* ── Top Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black text-slate-100 tracking-wide font-sans">
                Acoustic Spectrogram Studio
              </h4>
              <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-500/40">
                Target: "{targetText}" {phoneticHint}
              </span>
              {isListening && (
                <span className="flex items-center gap-1 text-[10px] font-black text-rose-400 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded-full animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  LIVE MIC FFT
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Frequency Spectrum (0 Hz – 8 kHz) • Voice Formants F1, F2 & Consonant Friction
            </p>
          </div>
        </div>

        {/* Action Controls & Fullscreen Modal Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowHelpGuide(!showHelpGuide)}
            title="How to read this spectrogram"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">Guide</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse view' : 'Expand full screen'}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Collapsible Educational Guide Drawer ── */}
      {showHelpGuide && (
        <div className="my-3 p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs space-y-2 animate-fade-in text-slate-300">
          <div className="flex items-center justify-between font-black text-emerald-400 text-[11px] uppercase tracking-wider">
            <span>💡 How to Read Your Voice Spectrogram:</span>
            <button onClick={() => setShowHelpGuide(false)} className="text-slate-400 hover:text-white text-xs cursor-pointer">✕</button>
          </div>
          <p className="leading-relaxed">
            A <strong>spectrogram</strong> shows the sound frequencies of your voice over time:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-sans text-[11px]">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-emerald-500/30">
              <span className="font-bold text-emerald-300 block">🟢 Bottom (0 – 2 kHz):</span>
              Vowel formants (F1 & F2) created by your tongue height and jaw. Warm glowing bars.
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-rose-500/30">
              <span className="font-bold text-rose-300 block">🔴 Top (4 – 8 kHz):</span>
              Consonants like 'S', 'SH', 'F' appear as high-frequency friction clouds at the top.
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-amber-500/30">
              <span className="font-bold text-amber-300 block">🟡 Bursts (Vertical Lines):</span>
              Plosive sounds like 'T', 'K', 'P' create quick vertical lightning strikes.
            </div>
          </div>
        </div>
      )}

      {/* ── Mode Switcher Pills & Replay Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 my-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('target')}
            className={`px-3 py-1.5 rounded-xl font-black text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'target'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🎯</span> Target Model
          </button>

          <button
            onClick={() => setActiveTab('student')}
            className={`px-3 py-1.5 rounded-xl font-black text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🎙️</span> Your Voice
            {hasStudentRecording && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-xl font-black text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⚡</span> Compare Formants
          </button>
        </div>

        {/* Audio Replay Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'target' && (
            <button
              onClick={handlePlayModel}
              disabled={isPlayingAudio}
              className="px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50 transition-all shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isPlayingAudio ? 'Listening...' : 'Play Model'}</span>
            </button>
          )}

          {(activeTab === 'student' || activeTab === 'compare') && hasStudentRecording && (
            <button
              onClick={handlePlayRecording}
              disabled={isPlayingAudio}
              className="px-3 py-1.5 rounded-xl font-bold text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50 transition-all shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isPlayingAudio ? 'Replaying...' : 'Replay Voice'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Main Canvas Viewport ── */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner group">
        <canvas
          ref={canvasRef}
          className={`w-full block cursor-crosshair ${isExpanded ? 'h-[360px] sm:h-[440px]' : 'h-[175px] sm:h-[210px]'}`}
        />

        {/* Status Overlay Badge if not recorded yet and looking at student voice */}
        {activeTab === 'student' && !hasStudentRecording && !isListening && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-1">
            <span className="text-2xl animate-bounce">🎤</span>
            <p className="text-xs font-bold text-slate-300">
              No Voice Recorded Yet for "{targetText}"
            </p>
            <p className="text-[11px] text-slate-400 max-w-xs">
              Click <strong>"Speak to Test"</strong> above to record your voice and generate your live spectrogram!
            </p>
          </div>
        )}
      </div>

      {/* ── Telemetry & Formant Indicators Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-3 text-xs font-mono text-slate-300">
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between px-3.5 shadow-xs">
          <span className="text-slate-400 text-xs">Formant F1 (Tongue):</span>
          <span className="font-bold text-emerald-400 text-sm">
            {phonemeSeq.find(p => PHONEME_ACOUSTICS[p.ph]?.f1)?.ph
              ? `${PHONEME_ACOUSTICS[phonemeSeq.find(p => PHONEME_ACOUSTICS[p.ph]?.f1).ph].f1} Hz`
              : '450 Hz'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between px-3.5 shadow-xs">
          <span className="text-slate-400 text-xs">Formant F2 (Backness):</span>
          <span className="font-bold text-sky-400 text-sm">
            {phonemeSeq.find(p => PHONEME_ACOUSTICS[p.ph]?.f2)?.ph
              ? `${PHONEME_ACOUSTICS[phonemeSeq.find(p => PHONEME_ACOUSTICS[p.ph]?.f2).ph].f2} Hz`
              : '1850 Hz'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between px-3.5 shadow-xs">
          <span className="text-slate-400 text-xs">Friction Band:</span>
          <span className="font-bold text-rose-400 text-sm">
            {phonemeSeq.some(p => PHONEME_ACOUSTICS[p.ph]?.friction > 0) ? 'Active (>5kHz)' : 'Clean'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between px-3.5 shadow-xs">
          <span className="text-slate-400 text-xs">Acoustic Match:</span>
          <span className={`font-bold text-sm ${
            assessmentResult?.pronunciationCorrect
              ? 'text-emerald-400'
              : hasStudentRecording
                ? 'text-amber-400'
                : 'text-slate-400'
          }`}>
            {assessmentResult?.pronunciation?.score
              ? `${assessmentResult.pronunciation.score}% Match`
              : hasStudentRecording
                ? 'Analyzed'
                : 'Target Ready'}
          </span>
        </div>
      </div>

    </div>
  );
}
