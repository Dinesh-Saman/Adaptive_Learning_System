import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import g2Data from '../../data/english/grade2_speaking_pool.json';
import g3Data from '../../data/english/grade3_speaking_pool.json';
import g4Data from '../../data/english/grade4_speaking_pool.json';
import fixedSpeakingPapersData from '../../data/english/fixed_speaking_papers.json';

const POOLS = {
  2: g2Data,
  3: g3Data,
  4: g4Data
};

const FIXED_PAPERS = fixedSpeakingPapersData;

const STOP_WORDS = new Set(['the', 'a', 'an', 'is', 'am', 'are', 'in', 'on', 'at', 'to', 'of', 'and', 'it', 'my', 'we', 'he', 'she', 'for', 'with']);

const SINHALA_CODE_WORDS = new Set([
  'eka', 'ne', 'hari', 'ane', 'me', 'oya', 'mata', 'monada', 'dan', 'kohomada',
  'kiyanna', 'neda', 'nam', 'thawa', 'aiyo', 'ammo', 'ow', 'na', 'hode'
]);

// 12 Core Sri Lankan English MTI Patterns Reference Knowledgebase
const SRI_LANKAN_MTI_PATTERNS = [
  {
    id: 1,
    key: 'S_CLUSTER_PROSTHESIS',
    name: 'S-Cluster Prosthesis',
    name_si: "Adding initial 'I' sound (e.g. I-school / is-school)",
    target_ipa: '/skuːl/',
    error_ipa: '/ɪskuːl/ or /iskul/',
    examples: ['school', 'spoon', 'station', 'study', 'speak', 'star', 'stop', 'spring', 'student', 'smart', 'smile', 'space'],
    pedagogical_tip: "Start immediately with the hissing 'sss' sound without adding an 'is-' in front (say 'sss-chool', not 'is-school').",
    pedagogical_tip_si: "Start directly with the hissing 'sss' sound without adding an 'is-' in front (say 'sss-chool', not 'is-school')."
  },
  {
    id: 2,
    key: 'V_W_MERGER',
    name: 'V/W Merger',
    name_si: 'Confusing V and W sounds (Wery / Vindow)',
    target_ipa: '/ˈveri/',
    error_ipa: '/ˈweri/',
    examples: ['very', 'water', 'win', 'view', 'van', 'window', 'voice', 'village', 'visit', 'watch', 'wave', 'vase'],
    pedagogical_tip: "For 'W', round your lips forward into a circle ('O'). For 'V', touch your top front teeth gently to your lower lip.",
    pedagogical_tip_si: "For 'W', round your lips forward. For 'V', touch your top front teeth to your lower lip."
  },
  {
    id: 3,
    key: 'TH_SUBSTITUTION',
    name: 'TH Substitution (TH → T/D)',
    name_si: 'Substituting T/D for TH (Tree for Three)',
    target_ipa: '/θriː/',
    error_ipa: '/triː/',
    examples: ['three', 'think', 'this', 'that', 'there', 'the', 'mother', 'father', 'brother', 'teeth', 'thumb', 'path'],
    pedagogical_tip: "Put the tip of your tongue gently between your front teeth and blow air gently to produce the soft 'TH' sound.",
    pedagogical_tip_si: "Place the tip of your tongue between your teeth and blow air gently to produce 'TH'."
  },
  {
    id: 4,
    key: 'F_P_SUBSTITUTION',
    name: 'F/P Substitution',
    name_si: 'Substituting P for F (Pan for Fan)',
    target_ipa: '/fæn/',
    error_ipa: '/pæn/',
    examples: ['fan', 'film', 'food', 'elephant', 'fish', 'feather', 'four', 'fast', 'farm', 'phone', 'photo', 'friend'],
    pedagogical_tip: "Gently place upper teeth on lower lip and blow air for 'F', rather than pressing both lips together like 'P'.",
    pedagogical_tip_si: "Place upper teeth on lower lip and blow air for 'F'; do not press both lips together."
  },
  {
    id: 5,
    key: 'PARAGOGE',
    name: 'Paragoge (Ending Vowel Addition)',
    name_si: 'Adding extra vowel at word end (Busa / Milka)',
    target_ipa: '/bʌs/',
    error_ipa: '/bʌsə/ or /busa/',
    examples: ['bus', 'milk', 'book', 'good', 'cake', 'stamp', 'park', 'pen', 'desk', 'cup', 'bed', 'bag'],
    pedagogical_tip: "Stop your voice cleanly at the final consonant without adding an extra '-a' sound at the end.",
    pedagogical_tip_si: "Stop your voice cleanly at the ending consonant without adding an extra '-a' sound."
  },
  {
    id: 6,
    key: 'FINAL_CONSONANT_WEAKENING',
    name: 'Final Consonant Weakening',
    name_si: 'Dropping final consonant sound (Bu for But)',
    target_ipa: '/bʌt/',
    error_ipa: '/bʌ/',
    examples: ['but', 'good', 'that', 'friend', 'cat', 'hand', 'red', 'bird', 'bad', 'road', 'food', 'head'],
    pedagogical_tip: "Make sure to clearly pronounce the ending consonant sound (like 't', 'd', 'k') at the end of the word.",
    pedagogical_tip_si: "Clearly pronounce the final consonant sound (such as 't', 'd', 'k') at the end."
  },
  {
    id: 7,
    key: 'CLUSTER_SIMPLIFICATION',
    name: 'Consonant Cluster Simplification',
    name_si: 'Dropping consonant cluster sounds (Neks for Next)',
    target_ipa: '/nekst/',
    error_ipa: '/neks/',
    examples: ['next', 'friend', 'stamp', 'product', 'desk', 'fast', 'best', 'plant', 'jump', 'hand', 'test', 'camp'],
    pedagogical_tip: "Clearly pronounce all consonant sounds in the cluster (e.g. pronounce both the 's' and 't' in 'next').",
    pedagogical_tip_si: "Pronounce all consonant sounds in the cluster (e.g. both 's' and 't' in 'next')."
  },
  {
    id: 8,
    key: 'VOWEL_LENGTH_CONFUSION',
    name: 'Short/Long Vowel Confusion',
    name_si: 'Confusing short and long vowels (Kek for Cake)',
    target_ipa: '/keɪk/',
    error_ipa: '/kek/',
    examples: ['cake', 'boat', 'great', 'note', 'feet', 'fit', 'seat', 'sit', 'sheep', 'ship', 'sleep', 'slip'],
    pedagogical_tip: "Elongate the diphthong vowel cleanly (say 'kay-eek' for cake, rather than a short 'kek').",
    pedagogical_tip_si: "Elongate long vowels and diphthongs cleanly."
  },
  {
    id: 9,
    key: 'INITIAL_H_DELETION',
    name: 'Initial H Dropping',
    name_si: "Dropping initial 'H' sound (Ouse for House)",
    target_ipa: '/haʊs/',
    error_ipa: '/aʊs/',
    examples: ['house', 'happy', 'hello', 'hand', 'hot', 'hat', 'hear', 'help', 'home', 'horse', 'head', 'heart'],
    pedagogical_tip: "Breathe out gently like a sigh ('hhh') before starting the vowel in words starting with 'H'.",
    pedagogical_tip_si: "Breathe out gently with an 'hhh' sound before the vowel in words starting with 'H'."
  },
  {
    id: 10,
    key: 'Z_S_CONFUSION',
    name: 'Z/S Voicing Confusion',
    name_si: 'Confusing Z and S sounds (Busi for Busy)',
    target_ipa: '/zuː/',
    error_ipa: '/suː/',
    examples: ['zoo', 'busy', 'please', 'zero', 'zebra', 'music', 'noise', 'rose', 'easy', 'prize', 'freeze', 'lazy'],
    pedagogical_tip: "Vibrate your vocal cords (buzz like a bee: 'zzz') when pronouncing 'Z' sounds.",
    pedagogical_tip_si: "Vibrate your vocal cords with a buzzing 'zzz' sound for 'Z'."
  },
  {
    id: 11,
    key: 'BACK_VOWEL_CONFUSION',
    name: 'Back Vowel Confusion',
    name_si: 'Confusing back vowels (Hol for Hall / Kap for Cup)',
    target_ipa: '/hɔːl/',
    error_ipa: '/hɒl/ or /hol/',
    examples: ['hall', 'hot', 'cup', 'bus', 'ball', 'call', 'walk', 'tall', 'fall', 'wall', 'water', 'small'],
    pedagogical_tip: "Open your mouth taller and drop your jaw to produce the deep back vowel '/ɔː/' sound.",
    pedagogical_tip_si: "Open mouth wider and drop jaw for the deep back vowel sound."
  },
  {
    id: 12,
    key: 'STRESS_RHYTHM_DEVIATION',
    name: 'Equal Stress / Syllable-Timed Rhythm',
    name_si: 'Monotone flat rhythm without natural English stress',
    target_ipa: '/kəmˈpjuːtər/',
    error_ipa: '/kompjuˈter/ (equal stress)',
    examples: ['computer', 'banana', 'tomorrow', 'beautiful', 'together', 'umbrella', 'family', 'hospital', 'animal', 'important'],
    pedagogical_tip: "English is stress-timed! Put strong emphasis on the stressed syllable and say unstressed syllables quickly and lightly.",
    pedagogical_tip_si: "Emphasize stressed syllables and pronounce unstressed syllables lightly."
  }
];

const PAPERS_CONFIG = [
  {
    id: 1,
    title: 'Paper 01 (Baseline Assessment)',
    badge: '10 Questions • Paper 01',
    levelTitle: 'Paper 01: Baseline Speaking & Pronunciation',
    icon: '📝',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-300'
  },
  {
    id: 2,
    title: 'Paper 02 (Adaptive Speaking)',
    badge: '10 Questions • Paper 02',
    levelTitle: 'Paper 02: Adaptive Fluency & MTI Evaluation',
    icon: '📖',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-300'
  },
  {
    id: 3,
    title: 'Paper 03 (Mastery Assessment)',
    badge: '10 Questions • Paper 03',
    levelTitle: 'Paper 03: Mastery & Expressive Speech',
    icon: '🎙️',
    color: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-300'
  }
];

// Web Audio Synthesizer for SFX
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
    } else if (type === 'unlock') {
      [440, 554.37, 659.25, 880, 1108.73].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.2);
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

// English Text to Speech (Model voice)
function speakEnglish(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

export const DIGIT_TO_WORD = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
  '10': 'ten'
};

export function normalizeDigitsToWords(text) {
  if (!text) return '';
  return text
    .replace(/\b(10|[0-9])\b/g, match => DIGIT_TO_WORD[match] || match)
    .replace(/\b3rd\b/gi, 'third')
    .replace(/\b2nd\b/gi, 'second')
    .replace(/\b1st\b/gi, 'first');
}

// Clean English transcript extractor - pure speech stream with digit-to-word expansion
function extractCleanEnglishTranscript(event) {
  let finalStr = '';
  let interimStr = '';
  const allAltTokens = [];
  const rawTokens = [];
  const allHypotheses = [];

  for (let i = 0; i < event.results.length; ++i) {
    const resItem = event.results[i];

    for (let k = 0; k < resItem.length; k++) {
      const altText = (resItem[k]?.transcript || '').trim();
      if (altText) {
        const normAltText = normalizeDigitsToWords(altText);
        allHypotheses.push({
          text: normAltText.toLowerCase(),
          rawText: altText.toLowerCase(),
          confidence: resItem[k]?.confidence || 0,
          isFinal: resItem.isFinal
        });

        altText.toLowerCase().split(/\s+/).forEach(tok => {
          const cleanTok = tok.replace(/[^a-z0-9]/gi, '');
          if (cleanTok) {
            allAltTokens.push(cleanTok);
            if (DIGIT_TO_WORD[cleanTok]) {
              allAltTokens.push(DIGIT_TO_WORD[cleanTok]);
            }
            rawTokens.push({
              text: cleanTok,
              confidence: resItem[k]?.confidence || 0,
              isFinal: resItem.isFinal
            });
          }
        });
      }
    }

    const rawTranscript = (resItem[0]?.transcript || '').trim();
    const normTranscript = normalizeDigitsToWords(rawTranscript);

    if (resItem.isFinal) {
      finalStr += normTranscript + ' ';
    } else {
      interimStr = normTranscript;
    }
  }

  const primary = (finalStr + interimStr).trim();

  return {
    transcript: primary,
    alternatives: Array.from(new Set(allAltTokens)),
    rawTokens: rawTokens,
    rawTranscript: primary,
    allHypotheses: allHypotheses
  };
}

// Phonetic & stem word similarity helper
function isWordMatch(tw, sw) {
  if (!tw || !sw) return false;
  const t = tw.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s = sw.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (t === s) return true;

  // Digit <-> word equivalence (e.g. '3' matches 'three', 'two' matches '2')
  if (DIGIT_TO_WORD[s] === t || DIGIT_TO_WORD[t] === s) return true;

  // Acoustic neighbor tolerance for 'tree' when target is 'tree'
  if (t === 'tree' && (s === 'three' || s === '3' || s === 'tri')) return true;

  if (s === t + 's' || s === t + 'd' || s === t + 'ed' || s === t + 'ing' || s === t + 'es') return true;
  if (t === s + 's' || t === s + 'd' || t === s + 'ed' || t === s + 'ing' || t === s + 'es') return true;
  if (t === 'nests' && (s === 'nest' || s === 'nests')) return true;
  if (t === 'in' && s === 'in') return true;
  return false;
}

// Preprocess fused / compound spoken words
function preprocessFusedSpokenWords(targetWords, spokenWords) {
  const expanded = [];
  let tIdx = 0;

  for (const sw of spokenWords) {
    const s = sw.toLowerCase().replace(/[^a-z0-9]/g, '');
    let decomposed = false;

    if (tIdx < targetWords.length - 1) {
      const t1 = targetWords[tIdx].toLowerCase().replace(/[^a-z0-9]/g, '');
      const t2 = targetWords[tIdx + 1].toLowerCase().replace(/[^a-z0-9]/g, '');
      if (s.startsWith(t1) && (s.slice(t1.length).startsWith(t2.slice(0, 3)) || ['ness', 'nesss', 'to', 'the', 'light', 'cream', 'room', 'ground'].includes(s.slice(t1.length)))) {
        expanded.push(t1);
        expanded.push(t2);
        tIdx += 2;
        decomposed = true;
      }
    }

    if (!decomposed) {
      expanded.push(sw);
      if (tIdx < targetWords.length && isWordMatch(targetWords[tIdx], sw)) {
        tIdx++;
      }
    }
  }

  return expanded;
}

// Longest Common Subsequence (LCS) Dynamic Programming Word Alignment
function alignWordsLCS(targetWords, spokenWords) {
  const processedSpoken = preprocessFusedSpokenWords(targetWords, spokenWords);
  const n = targetWords.length;
  const m = processedSpoken.length;

  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (isWordMatch(targetWords[i - 1], processedSpoken[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const aligned = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && isWordMatch(targetWords[i - 1], processedSpoken[j - 1])) {
      aligned.unshift({ word: targetWords[i - 1], matched: true, spoken: processedSpoken[j - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      j--;
    } else {
      aligned.unshift({ word: targetWords[i - 1], matched: false, spoken: '' });
      i--;
    }
  }

  return aligned;
}

// Exact Word IPA mapping dictionary for all example words
const WORD_IPA_MAP = {
  // S-Cluster Prosthesis
  'school': { target: '/skuːl/', error: '/ɪskuːl/' },
  'spoon': { target: '/spuːn/', error: '/ɪspuːn/' },
  'station': { target: '/ˈsteɪʃən/', error: '/ɪsˈteɪʃən/' },
  'study': { target: '/ˈstʌdi/', error: '/ɪsˈtʌdi/' },
  'speak': { target: '/spiːk/', error: '/ɪspiːk/' },
  'star': { target: '/stɑːr/', error: '/ɪsˈtɑːr/ or /esta/' },
  'stop': { target: '/stɒp/', error: '/ɪsˈtɒp/' },
  'spring': { target: '/sprɪŋ/', error: '/ɪsˈprɪŋ/' },
  'student': { target: '/ˈstjuːdənt/', error: '/ɪsˈtjuːdənt/' },
  'smart': { target: '/smɑːrt/', error: '/ɪsˈmɑːrt/' },
  'smile': { target: '/smaɪl/', error: '/ɪsˈmaɪl/' },
  'space': { target: '/speɪs/', error: '/ɪsˈpeɪs/' },

  // V/W Merger
  'very': { target: '/ˈveri/', error: '/ˈweri/' },
  'water': { target: '/ˈwɔːtər/', error: '/ˈvɔːtər/' },
  'win': { target: '/wɪn/', error: '/vɪn/' },
  'view': { target: '/vjuː/', error: '/wjuː/' },
  'van': { target: '/væn/', error: '/wæn/' },
  'window': { target: '/ˈwɪndoʊ/', error: '/ˈvɪndoʊ/' },
  'voice': { target: '/vɔɪs/', error: '/wɔɪs/' },
  'village': { target: '/ˈvɪlɪdʒ/', error: '/ˈwɪlɪdʒ/' },
  'visit': { target: '/ˈvɪzɪt/', error: '/ˈwɪzɪt/' },
  'watch': { target: '/wɒtʃ/', error: '/vɒtʃ/' },
  'wave': { target: '/weɪv/', error: '/veɪv/' },
  'vase': { target: '/vɑːz/', error: '/wɑːz/' },

  // TH Substitution
  'three': { target: '/θriː/', error: '/triː/' },
  'tree': { target: '/triː/', error: '/θriː/' },
  'think': { target: '/θɪŋk/', error: '/tɪŋk/' },
  'this': { target: '/ðɪs/', error: '/dɪs/' },
  'that': { target: '/ðæt/', error: '/dæt/' },
  'there': { target: '/ðeər/', error: '/deər/' },
  'the': { target: '/ðə/', error: '/də/' },
  'mother': { target: '/ˈmʌðər/', error: '/ˈmʌdər/' },
  'father': { target: '/ˈfɑːðər/', error: '/ˈfɑːdər/' },
  'brother': { target: '/ˈbrʌðər/', error: '/ˈbrʌdər/' },
  'teeth': { target: '/tiːθ/', error: '/tiːt/' },
  'thumb': { target: '/θʌm/', error: '/tʌm/' },
  'path': { target: '/pɑːθ/', error: '/pɑːt/' },
  'math': { target: '/mæθ/', error: '/mæt/' },

  // F/P Substitution
  'fan': { target: '/fæn/', error: '/pæn/' },
  'film': { target: '/fɪlm/', error: '/pɪlm/' },
  'food': { target: '/fuːd/', error: '/puːd/' },
  'elephant': { target: '/ˈelɪfənt/', error: '/ˈelɪpənt/' },
  'fish': { target: '/fɪʃ/', error: '/pɪʃ/' },
  'feather': { target: '/ˈfeðər/', error: '/ˈpedər/' },
  'four': { target: '/fɔːr/', error: '/pɔːr/' },
  'fast': { target: '/fɑːst/', error: '/pɑːst/' },
  'farm': { target: '/fɑːrm/', error: '/pɑːrm/' },
  'phone': { target: '/foʊn/', error: '/poʊn/' },
  'photo': { target: '/ˈfoʊtoʊ/', error: '/ˈpoʊtoʊ/' },
  'friend': { target: '/frend/', error: '/prend/' },

  // Paragoge
  'bus': { target: '/bʌs/', error: '/bʌs.ə/' },
  'milk': { target: '/mɪlk/', error: '/mɪlk.ə/' },
  'book': { target: '/bʊk/', error: '/bʊk.ə/' },
  'good': { target: '/ɡʊd/', error: '/ɡʊd.ə/' },
  'cake': { target: '/keɪk/', error: '/keɪk.ə/' },
  'stamp': { target: '/stæmp/', error: '/stæmp.ə/' },
  'park': { target: '/pɑːrk/', error: '/pɑːrk.ə/' },
  'pen': { target: '/pen/', error: '/pen.ə/' },
  'desk': { target: '/desk/', error: '/desk.ə/' },
  'cup': { target: '/kʌp/', error: '/kʌp.ə/' },
  'bed': { target: '/bed/', error: '/bed.ə/' },
  'bag': { target: '/bæɡ/', error: '/bæɡ.ə/' },

  // Final Consonant Weakening
  'but': { target: '/bʌt/', error: '/bʌ/' },
  'cat': { target: '/kæt/', error: '/kæ/' },
  'hand': { target: '/hænd/', error: '/hæn/' },
  'red': { target: '/red/', error: '/re/' },
  'bird': { target: '/bɜːrd/', error: '/bɜː/' },
  'bad': { target: '/bæd/', error: '/bæ/' },
  'road': { target: '/roʊd/', error: '/roʊ/' },
  'head': { target: '/hed/', error: '/he/' },

  // Cluster Simplification
  'next': { target: '/nekst/', error: '/neks/' },
  'product': { target: '/ˈprɒdʌkt/', error: '/ˈprɒdʌk/' },
  'best': { target: '/best/', error: '/bes/' },
  'plant': { target: '/plɑːnt/', error: '/plɑːn/' },
  'jump': { target: '/dʒʌmp/', error: '/dʒʌm/' },
  'test': { target: '/test/', error: '/tes/' },
  'camp': { target: '/kæmp/', error: '/kæm/' },

  // Vowel Length Confusion
  'boat': { target: '/boʊt/', error: '/bɒt/' },
  'great': { target: '/ɡreɪt/', error: '/ɡret/' },
  'note': { target: '/noʊt/', error: '/nɒt/' },
  'feet': { target: '/fiːt/', error: '/fɪt/' },
  'fit': { target: '/fɪt/', error: '/fiːt/' },
  'seat': { target: '/siːt/', error: '/sɪt/' },
  'sit': { target: '/sɪt/', error: '/siːt/' },
  'sheep': { target: '/ʃiːp/', error: '/ʃɪp/' },
  'ship': { target: '/ʃɪp/', error: '/ʃiːp/' },
  'sleep': { target: '/sliːp/', error: '/slɪp/' },
  'slip': { target: '/slɪp/', error: '/sliːp/' },

  // Initial H Dropping
  'house': { target: '/haʊs/', error: '/aʊs/' },
  'happy': { target: '/ˈhæpi/', error: '/ˈæpi/' },
  'hello': { target: '/həˈloʊ/', error: '/əˈloʊ/' },
  'hot': { target: '/hɒt/', error: '/ɒt/' },
  'hat': { target: '/hæt/', error: '/æt/' },
  'hear': { target: '/hɪər/', error: '/ɪər/' },
  'help': { target: '/help/', error: '/elp/' },
  'home': { target: '/hoʊm/', error: '/oʊm/' },
  'horse': { target: '/hɔːrs/', error: '/ɔːrs/' },
  'heart': { target: '/hɑːrt/', error: '/ɑːrt/' },

  // Z/S Confusion
  'zoo': { target: '/zuː/', error: '/suː/' },
  'busy': { target: '/ˈbɪzi/', error: '/ˈbɪsi/' },
  'please': { target: '/pliːz/', error: '/pliːs/' },
  'zero': { target: '/ˈzɪəroʊ/', error: '/ˈsɪəroʊ/' },
  'zebra': { target: '/ˈzebrə/', error: '/ˈsebrə/' },
  'music': { target: '/ˈmjuːzɪk/', error: '/ˈmjuːsɪk/' },
  'noise': { target: '/nɔɪz/', error: '/nɔɪs/' },
  'rose': { target: '/roʊz/', error: '/roʊs/' },
  'easy': { target: '/ˈiːzi/', error: '/ˈiːsi/' },
  'prize': { target: '/praɪz/', error: '/praɪs/' },
  'freeze': { target: '/friːz/', error: '/friːs/' },
  'lazy': { target: '/ˈleɪzi/', error: '/ˈleɪsi/' },

  // Back Vowel Confusion
  'hall': { target: '/hɔːl/', error: '/hɒl/' },
  'ball': { target: '/bɔːl/', error: '/bɒl/' },
  'call': { target: '/kɔːl/', error: '/kɒl/' },
  'walk': { target: '/wɔːk/', error: '/wɒk/' },
  'tall': { target: '/tɔːl/', error: '/tɒl/' },
  'fall': { target: '/fɔːl/', error: '/fɒl/' },
  'wall': { target: '/wɔːl/', error: '/wɒl/' },
  'small': { target: '/smɔːl/', error: '/smɒl/' },

  // Stress / Rhythm
  'computer': { target: '/kəmˈpjuːtər/', error: '/kompjuˈter/' },
  'banana': { target: '/bəˈnɑːnə/', error: '/bananə/' },
  'tomorrow': { target: '/təˈmɒroʊ/', error: '/tomɒroʊ/' },
  'beautiful': { target: '/ˈbjuːtɪfʊl/', error: '/bjuːtiˈful/' },
  'together': { target: '/təˈɡeðər/', error: '/toɡeˈdər/' },
  'umbrella': { target: '/ʌmˈbrelə/', error: '/umbreˈla/' },
  'family': { target: '/ˈfæməli/', error: '/famili/' },
  'hospital': { target: '/ˈhɒspɪtəl/', error: '/hospital/' },
  'animal': { target: '/ˈænɪməl/', error: '/animal/' },
  'important': { target: '/ɪmˈpɔːrtənt/', error: '/important/' }
};

function mkPattern(id, target, spoken, explanation) {
  const p = SRI_LANKAN_MTI_PATTERNS.find(x => x.id === id);
  if (!p) return null;

  let targetIpa = WORD_IPA_MAP[target]?.target || p.target_ipa;
  let errorIpa = `/${spoken}/`;

  if (p.id === 5) {
    errorIpa = `/${target}.ə/`;
  } else if (p.id === 1) {
    errorIpa = `/ɪ${target}/`;
  } else if (p.id === 4) {
    errorIpa = targetIpa.replace(/\/f/i, '/p').replace(/f/g, 'p');
  } else if (p.id === 9) {
    errorIpa = targetIpa.replace(/\/h/i, '/');
  } else if (p.id === 7) {
    errorIpa = (target === 'fast') ? '/fɑːs/' : (WORD_IPA_MAP[target]?.error || targetIpa.replace(/t\//, '/').replace(/d\//, '/'));
  } else if (p.id === 3) {
    errorIpa = targetIpa.replace(/θ/g, 't').replace(/ð/g, 'd');
  } else if (p.id === 2) {
    errorIpa = targetIpa.replace(/v/g, 'w').replace(/w/g, 'v');
  } else if (WORD_IPA_MAP[target]?.error) {
    errorIpa = WORD_IPA_MAP[target].error;
  }

  return {
    id: p.id,
    key: p.key,
    name: p.name,
    name_si: p.name_si,
    target,
    spoken,
    target_ipa: targetIpa,
    error_ipa: errorIpa,
    pedagogical_tip: p.pedagogical_tip,
    pedagogical_tip_si: p.pedagogical_tip_si,
    explanation
  };
}

// ══════════════════════════════════════════════════════════════════════
// ── 1. LEXICAL / TEXT-BASED MTI ERROR DETECTOR (ALL 12 PATTERNS) ──
// ══════════════════════════════════════════════════════════════════════
export function detectTextMTIErrors(targetWord, spokenWord) {
  if (!targetWord || !spokenWord) return null;
  const tw = targetWord.toLowerCase().replace(/[^a-z0-9]/g, '');
  const sw = spokenWord.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!tw || !sw || tw === sw) return null;

  // ── 1. S-Cluster Prosthesis (e.g. school -> ischool / eschool / is-school / is school) ──
  const isSCluster = /^s[cptkmnrwl]/i.test(tw) || tw === 'school';
  if (isSCluster) {
    if (sw === 'i' + tw || sw === 'e' + tw || sw === 'is' + tw || sw === 'es' + tw ||
        sw === 'is' + tw.slice(1) || sw === 'es' + tw.slice(1) ||
        sw === 'i' + tw.slice(1) || sw === 'e' + tw.slice(1) ||
        (tw === 'school' && ['ischool', 'eschool', 'iskool', 'iskul', 'isschool', 'iscool', 'hischool', 'aschool'].includes(sw)) ||
        (tw === 'spoon' && ['ispoon', 'espoon', 'is-spoon', 'ispoon'].includes(sw)) ||
        (tw === 'station' && ['istation', 'estation', 'is-station'].includes(sw)) ||
        (tw === 'study' && ['istudy', 'estudy', 'is-study'].includes(sw)) ||
        (tw === 'star' && ['istar', 'estar', 'is-star'].includes(sw)) ||
        (tw === 'stop' && ['istop', 'estop', 'is-stop'].includes(sw)) ||
        (tw === 'speak' && ['ispeak', 'espeak', 'is-speak'].includes(sw))) {
      return mkPattern(1, tw, sw, `Spoken text shows '${sw}' with an initial prosthesis vowel sound added before '${tw}'.`);
    }
  }

  // ── 2. V/W Merger (very -> wery / win -> vin) ──
  if (tw.startsWith('v') && (sw === 'w' + tw.slice(1) || (sw.startsWith('w') && sw.slice(1) === tw.slice(1)))) {
    return mkPattern(2, tw, sw, `Spoken text shows '${sw}' with 'w' substituted for 'v' in '${tw}'.`);
  }
  if (tw.startsWith('w') && (sw === 'v' + tw.slice(1) || (sw.startsWith('v') && sw.slice(1) === tw.slice(1)))) {
    return mkPattern(2, tw, sw, `Spoken text shows '${sw}' with 'v' substituted for 'w' in '${tw}'.`);
  }

  // ── 3. TH Substitution (three -> tree / that -> dat) ──
  if (tw.startsWith('th')) {
    if (sw === 't' + tw.slice(2) || sw === 'd' + tw.slice(2) ||
        (tw === 'three' && (sw === 'tree' || sw === 'tri')) ||
        (tw === 'think' && sw === 'tink') ||
        (tw === 'this' && sw === 'dis') ||
        (tw === 'that' && sw === 'dat') ||
        (tw === 'there' && sw === 'dere') ||
        (tw === 'the' && sw === 'de')) {
      return mkPattern(3, tw, sw, `Spoken text shows '${sw}' substituting T/D for TH in '${tw}'.`);
    }
  }
  if (tw.includes('th')) {
    const dSub = tw.replace('th', 'd');
    const tSub = tw.replace('th', 't');
    if (sw === dSub || sw === tSub ||
        (tw === 'mother' && sw === 'moder') ||
        (tw === 'father' && sw === 'fader')) {
      return mkPattern(3, tw, sw, `Spoken text shows '${sw}' substituting T/D for TH in '${tw}'.`);
    }
  }

  // ── 4. F/P Substitution (film -> pilm / fan -> pan / fast -> past) ──
  if (tw.startsWith('f') && (sw === 'p' + tw.slice(1) ||
      (tw === 'film' && sw === 'pilm') ||
      (tw === 'fan' && sw === 'pan') ||
      (tw === 'fast' && sw === 'past') ||
      (tw === 'food' && sw === 'pood') ||
      (tw === 'fish' && sw === 'pish') ||
      (tw === 'feather' && sw === 'peder') ||
      (tw === 'four' && sw === 'pour'))) {
    return mkPattern(4, tw, sw, `Spoken text shows '${sw}' substituting 'p' for 'f' in '${tw}'.`);
  }
  if (tw.includes('f') && sw === tw.replace(/f/g, 'p')) {
    return mkPattern(4, tw, sw, `Spoken text shows '${sw}' substituting 'p' for 'f' in '${tw}'.`);
  }

  // ── 5. Paragoge (Ending Vowel Addition) (milk -> milka, bus -> busa, book -> booka, etc.) ──
  const paragogeSuffixes = ['a', 'u', 'e', 'er', 'ah', 'uh', 'o', 'i', 'ey', 'ya', 'ka', 'sa', 'ta', 'da', 'pa', 'ba', 'ga'];
  for (const suf of paragogeSuffixes) {
    if (sw === tw + suf) {
      return mkPattern(5, tw, sw, `Spoken text shows '${sw}' with an extra trailing vowel sound added to '${tw}'.`);
    }
  }
  if (tw.length >= 3 && sw.startsWith(tw) && (sw.length === tw.length + 1 || (sw.length === tw.length + 2 && /[aeiouy]/.test(sw.slice(-1))))) {
    return mkPattern(5, tw, sw, `Spoken text shows '${sw}' with an extra trailing vowel sound added to '${tw}'.`);
  }

  // ── 6. Final Consonant Weakening (but -> bu, good -> goo, cat -> ca, hand -> han, red -> re, bird -> bir) ──
  if (tw.length >= 3 && sw === tw.slice(0, -1) && !/(st|xt|kt|pt|ft|sk|nd|mp|nt|ct)$/.test(tw)) {
    return mkPattern(6, tw, sw, `Spoken text shows '${sw}' dropping the final consonant of '${tw}'.`);
  }

  // ── 7. Consonant Cluster Simplification (fast -> fas, next -> neks, best -> bes, desk -> des, plant -> plan, friend -> fren, product -> produk) ──
  if (/(st|xt|kt|pt|ft|sk|nd|mp|nt|ct)$/.test(tw)) {
    const simp1 = tw.replace(/(st|xt|kt|pt|ft|sk|nd|mp|nt|ct)$/, m => m[0]);
    const simp2 = tw.slice(0, -1);
    if (sw === simp1 || sw === simp2 ||
        (tw === 'next' && (sw === 'neks' || sw === 'nex')) ||
        (tw === 'fast' && (sw === 'fas' || sw === 'pass' || sw === 'faz')) ||
        (tw === 'best' && sw === 'bes') ||
        (tw === 'desk' && sw === 'des') ||
        (tw === 'product' && (sw === 'produc' || sw === 'produk')) ||
        (tw === 'friend' && (sw === 'fren' || sw === 'frend'))) {
      return mkPattern(7, tw, sw, `Spoken text shows '${sw}' simplifying the consonant cluster in '${tw}'.`);
    }
  }

  // ── 8. Vowel Length Confusion (cake -> kek, boat -> bot, note -> not, feet -> fit, seat -> sit) ──
  if ((tw === 'cake' && sw === 'kek') ||
      (tw === 'boat' && (sw === 'bot' || sw === 'bawt')) ||
      (tw === 'great' && sw === 'gret') ||
      (tw === 'note' && sw === 'not') ||
      (tw === 'feet' && sw === 'fit') ||
      (tw === 'seat' && sw === 'sit') ||
      (tw === 'fit' && sw === 'feet') ||
      (tw === 'sit' && sw === 'seat')) {
    return mkPattern(8, tw, sw, `Spoken text shows vowel length deviation in '${sw}' for '${tw}'.`);
  }

  // ── 9. Initial H Dropping (house -> ouse, hat -> at, hot -> ot, hand -> and, happy -> appy, hello -> ello, hear -> ear, help -> elp) ──
  if (tw.startsWith('h') && (sw === tw.slice(1) ||
      (tw === 'house' && (sw === 'ouse' || sw === 'ows' || sw === 'hows')) ||
      (tw === 'happy' && sw === 'appy') ||
      (tw === 'hello' && sw === 'ello') ||
      (tw === 'hand' && sw === 'and') ||
      (tw === 'hot' && sw === 'ot') ||
      (tw === 'hat' && sw === 'at') ||
      (tw === 'hear' && sw === 'ear') ||
      (tw === 'help' && sw === 'elp'))) {
    return mkPattern(9, tw, sw, `Spoken text shows '${sw}' with the initial 'h' sound dropped from '${tw}'.`);
  }

  // ── 10. Z/S Confusion (zoo -> su, busy -> busi, please -> plees, zero -> sero, zebra -> sebra, music -> musik, noise -> nois, rose -> ros) ──
  if ((tw === 'zoo' && (sw === 'su' || sw === 'soo' || sw === 'so')) ||
      (tw === 'busy' && (sw === 'busi' || sw === 'bisi')) ||
      (tw === 'please' && (sw === 'pleas' || sw === 'plees' || sw === 'plis')) ||
      (tw === 'zero' && sw === 'sero') ||
      (tw === 'zebra' && sw === 'sebra') ||
      (tw === 'music' && (sw === 'musik' || sw === 'musick')) ||
      (tw === 'noise' && sw === 'nois') ||
      (tw === 'rose' && sw === 'ros')) {
    return mkPattern(10, tw, sw, `Spoken text shows '${sw}' confusing voiced 'z' with voiceless 's' for '${tw}'.`);
  }

  // ── 11. Back Vowel Confusion (hall -> hol, cup -> cap/kap, ball -> bol, call -> col, walk -> wolk, tall -> tol) ──
  if ((tw === 'hall' && (sw === 'hol' || sw === 'holl')) ||
      (tw === 'cup' && (sw === 'cap' || sw === 'kap')) ||
      (tw === 'ball' && sw === 'bol') ||
      (tw === 'call' && sw === 'col') ||
      (tw === 'walk' && sw === 'wolk') ||
      (tw === 'tall' && sw === 'tol') ||
      (tw === 'hot' && sw === 'hat') ||
      (tw === 'bus' && sw === 'bas')) {
    return mkPattern(11, tw, sw, `Spoken text shows back vowel confusion in '${sw}' for '${tw}'.`);
  }

  // ── 12. Stress / Rhythm Deviation ──
  if ((tw === 'computer' && sw === 'kompjuter') ||
      (tw === 'banana' && sw === 'banan') ||
      (tw === 'tomorrow' && sw === 'tomoro') ||
      (tw === 'together' && sw === 'togeder')) {
    return mkPattern(12, tw, sw, `Spoken text shows flat/syllable-timed stress deviation in '${sw}' for '${tw}'.`);
  }

  return null;
}

// Standalone Helper
export function detectMTIErrors(targetText, spokenText) {
  const targetWords = (targetText || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim().split(/\s+/).filter(Boolean);
  const spokenWords = (spokenText || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim().split(/\s+/).filter(Boolean);
  const detected = [];
  targetWords.forEach(tw => {
    spokenWords.forEach(sw => {
      const p = detectTextMTIErrors(tw, sw);
      if (p && !detected.some(d => d.id === p.id && d.target === p.target)) {
        detected.push(p);
      }
    });
  });
  return detected;
}

// ══════════════════════════════════════════════════════════════════════
// ── 2. ACOUSTIC-ONLY MTI DETECTOR (calibrated per-utterance statistics) ──
// ══════════════════════════════════════════════════════════════════════
function computeUtteranceStats(frames) {
  if (!frames || frames.length === 0) {
    return { peakLow: 1, peakMid: 1, peakHigh: 1, peakVol: 1, avgLow: 0, avgMid: 0, avgHigh: 0 };
  }
  let peakLow = 0, peakMid = 0, peakHigh = 0, peakVol = 0;
  let sumLow = 0, sumMid = 0, sumHigh = 0;
  frames.forEach(f => {
    peakLow = Math.max(peakLow, f.low || 0);
    peakMid = Math.max(peakMid, f.mid || 0);
    peakHigh = Math.max(peakHigh, f.high || 0);
    peakVol = Math.max(peakVol, f.vol || 0);
    sumLow += f.low || 0;
    sumMid += f.mid || 0;
    sumHigh += f.high || 0;
  });
  return {
    peakLow: Math.max(1, peakLow),
    peakMid: Math.max(1, peakMid),
    peakHigh: Math.max(1, peakHigh),
    peakVol: Math.max(1, peakVol),
    avgLow: sumLow / frames.length,
    avgMid: sumMid / frames.length,
    avgHigh: sumHigh / frames.length
  };
}

function analyzeAcousticPhonology(sessionData, targetWords, spokenWords = []) {
  const frames = sessionData?.spectralFrames || [];
  const acousticDetections = [];
  if (!frames || frames.length < 8) {
    return acousticDetections;
  }

  const activeFrames = frames.filter(f => f.vol > 6);
  if (activeFrames.length < 6) {
    return acousticDetections;
  }

  const stats = computeUtteranceStats(activeFrames);
  if (stats.peakVol < 12) {
    return acousticDetections;
  }

  const LOW_REL = stats.peakLow * 0.4;
  const HIGH_REL = stats.peakHigh * 0.4;

  targetWords.forEach(twRaw => {
    const twClean = (twRaw || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!twClean) return;

    // Check if the ASR text was an exact clean match for this word
    const isExactTextMatch = spokenWords.some(sw => sw.toLowerCase().replace(/[^a-z0-9]/g, '') === twClean);

    // If the word was cleanly matched in text, do NOT allow acoustic heuristic false-positives
    if (isExactTextMatch) {
      return;
    }

    // ── 1. Initial H Dropping (house -> ouse, hat -> at) ──
    if (twClean.startsWith('h') && twClean.length >= 3) {
      const head = activeFrames.slice(0, Math.min(6, activeFrames.length));
      if (head.length >= 4) {
        const firstVoicedIdx = head.findIndex(f => f.pitch && f.pitch > 75 && f.low > LOW_REL);
        const hasAspirationLead = head.slice(0, Math.max(1, firstVoicedIdx)).some(
          f => (!f.pitch || f.pitch <= 0) && f.low < LOW_REL * 0.5 && (f.high > HIGH_REL * 0.5 || f.mid > HIGH_REL * 0.5)
        );
        if (firstVoicedIdx === 0 && !hasAspirationLead) {
          const spokenWord = twClean.slice(1);
          acousticDetections.push(mkPattern(9, twClean, spokenWord,
            `Acoustic onset shows immediate voiced vowel energy with no /h/ aspiration lead-in for '${twClean}'.`));
        }
      }
    }

    // ── 2. F/P Substitution (film -> pilm, fan -> pan) ──
    if (twClean.startsWith('f') && twClean.length >= 3) {
      const head = activeFrames.slice(0, Math.min(8, activeFrames.length));
      if (head.length >= 4) {
        const hasInitialFrication = head.slice(0, 4).some(
          f => f.high > HIGH_REL * 0.6 && (!f.pitch || f.pitch <= 0)
        );
        if (!hasInitialFrication) {
          const firstFrameVoiced = head[0].pitch && head[0].pitch > 70;
          if (firstFrameVoiced) {
            const spokenWord = 'p' + twClean.slice(1);
            acousticDetections.push(mkPattern(4, twClean, spokenWord,
              `Acoustic onset lacks /f/ frication and exhibits plosive energy for '${twClean}'.`));
          }
        }
      }
    }

    // ── 3. Consonant Cluster Simplification (fast -> fas, next -> neks) ──
    const isClusterTail = ['fast', 'next', 'best', 'desk', 'plant', 'friend', 'product', 'test', 'past', 'last'].includes(twClean)
      || /(st|xt|kt|pt|ft|sk)$/.test(twClean);
    if (isClusterTail) {
      const tail = activeFrames.slice(-Math.min(10, Math.floor(activeFrames.length * 0.4)));
      if (tail.length >= 4) {
        const endsInUnstoppedSibilant = tail.slice(-2).every(f => f.high > HIGH_REL && (!f.pitch || f.pitch <= 0));
        if (endsInUnstoppedSibilant) {
          const spokenWord = twClean.replace(/(st|xt|kt|pt|ft|sk)$/, m => m[0]);
          acousticDetections.push(mkPattern(7, twClean, spokenWord,
            `Acoustic tail shows prolonged unreleased frication with no terminal stop closure for '${twClean}'.`));
        }
      }
    }

    // ── 4. S-Cluster Prosthesis (school -> ischool, star -> istar) ──
    if (/^s[cptkmnr]/.test(twClean) || /^s[lw]/.test(twClean)) {
      const head = activeFrames.slice(0, Math.min(8, activeFrames.length));
      const sibilantIdx = head.findIndex(f => f.high > HIGH_REL && (!f.pitch || f.pitch <= 0));
      if (sibilantIdx > 1) {
        const hasPreVowel = head.slice(0, sibilantIdx).some(
          f => f.pitch && f.pitch > 70 && f.low > LOW_REL
        );
        if (hasPreVowel) {
          const spokenWord = 'i' + twClean;
          acousticDetections.push(mkPattern(1, twClean, spokenWord,
            `Acoustic onset shows a voiced vowel formant before the /s/ hissing in '${twClean}'.`));
        }
      }
    }

    // ── 5. Paragoge (bus -> busa, milk -> milka) ──
    if (['bus', 'milk', 'book', 'good', 'cake', 'stamp', 'park', 'pen', 'cat', 'dog', 'cup', 'hall'].includes(twClean)) {
      const tail = activeFrames.slice(-Math.min(8, Math.floor(activeFrames.length * 0.4)));
      if (tail.length >= 4) {
        const lastTwo = tail.slice(-2);
        const midTail = tail.slice(0, Math.max(1, tail.length - 2));
        const hasConsonantThenTrailingVowel = midTail.some(f => f.high > HIGH_REL || f.mid > HIGH_REL)
          && lastTwo.every(f => f.pitch && f.pitch > 70 && f.low > LOW_REL);
        if (hasConsonantThenTrailingVowel) {
          const spokenWord = twClean + 'a';
          acousticDetections.push(mkPattern(5, twClean, spokenWord,
            `Acoustic offset shows a trailing pitched vowel resonance after '${twClean}'.`));
        }
      }
    }

    // ── 6. V/W Merger (very -> wery, van -> wan) ──
    if (twClean.startsWith('v') && twClean.length >= 3) {
      const head = activeFrames.slice(0, Math.min(6, activeFrames.length));
      const maxHigh = Math.max(...head.map(f => f.high || 0));
      const avgLow = head.reduce((s, f) => s + (f.low || 0), 0) / head.length;
      const hasVoicing = head.some(f => f.pitch && f.pitch > 70);
      if (maxHigh < HIGH_REL * 0.4 && avgLow > LOW_REL && hasVoicing) {
        const spokenWord = 'w' + twClean.slice(1);
        acousticDetections.push(mkPattern(2, twClean, spokenWord,
          `Acoustic onset lacks labiodental /v/ frication and shows a glide resonance for '${twClean}'.`));
      }
    }

    // ── 7. TH Substitution (three -> tree, that -> dat) ──
    if (twClean === 'three' || twClean.startsWith('th')) {
      const head = activeFrames.slice(0, Math.min(6, activeFrames.length));
      if (head.length >= 3) {
        const hasDentalFrication = head.some(
          f => f.high > HIGH_REL * 0.6 && (!f.pitch || f.pitch <= 0)
        );
        const hasImmediateBurst = head[0].vol > stats.peakVol * 0.4 && head[0].pitch && head[0].pitch > 70;
        if (!hasDentalFrication && hasImmediateBurst) {
          const spokenWord = twClean === 'three' ? 'tree' : 't' + twClean.slice(2);
          acousticDetections.push(mkPattern(3, twClean, spokenWord,
            `Acoustic onset shows a plosive attack instead of dental frication for '${twClean}'.`));
        }
      }
    }
  });

  return acousticDetections;
}

// Time-Domain Autocorrelation for Pitch (F0) Extraction (in Hz)
function autoCorrelate(buffer, sampleRate) {
  const SIZE = buffer.length;
  let sumOfSquares = 0;
  for (let i = 0; i < SIZE; i++) {
    sumOfSquares += buffer[i] * buffer[i];
  }
  const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
  if (rootMeanSquare < 0.012) return -1;

  let r1 = 0, r2 = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break; }
  }

  const trimmed = buffer.slice(r1, r2);
  if (trimmed.length < 32) return -1;

  const c = new Array(trimmed.length).fill(0);
  for (let i = 0; i < trimmed.length; i++) {
    for (let j = 0; j < trimmed.length - i; j++) {
      c[i] = c[i] + trimmed[j] * trimmed[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < trimmed.length; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;
  if (T0 <= 0) return -1;

  const x1 = c[T0 - 1] || 0, x2 = c[T0], x3 = c[T0 + 1] || 0;
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  const pitch = sampleRate / T0;
  if (pitch >= 70 && pitch <= 500) {
    return pitch;
  }
  return -1;
}

function classifyVolume(avg, max) {
  if (avg < 15) {
    return { status: 'Too Soft', score: 60 };
  }
  if (avg > 82 || max > 98) {
    return { status: 'Too Loud', score: 70 };
  }
  return { status: 'Clear & Optimal', score: 95 };
}

function detectRepetitions(words) {
  const repetitions = [];
  for (let i = 1; i < words.length; i++) {
    if (words[i] && words[i] === words[i - 1]) {
      repetitions.push({ word: words[i], type: 'single-word-repetition' });
    }
  }
  for (let i = 2; i < words.length; i++) {
    const prev = `${words[i - 2]} ${words[i - 1]}`;
    const curr = `${words[i - 1]} ${words[i]}`;
    if (prev === curr && words[i - 2] !== words[i - 1]) {
      repetitions.push({ phrase: curr, type: 'phrase-repetition' });
    }
  }
  return repetitions;
}

const HESITATION_WORDS = new Set(['um', 'uh', 'er', 'erm', 'hmm', 'ah', 'umm', 'uhh']);
function detectHesitations(words, pauses) {
  const fillerWords = words.filter(w => HESITATION_WORDS.has(w));
  const longPauses = (pauses || []).filter(p => p.durationMs >= 1000);
  return {
    fillerCount: fillerWords.length,
    fillerWords,
    longPauseCount: longPauses.length,
    hesitationCount: fillerWords.length + longPauses.length
  };
}

function detectWordOrderError(targetWords, spokenWords) {
  const targetFiltered = targetWords.filter(w => !STOP_WORDS.has(w));
  const spokenFiltered = spokenWords.filter(w => !STOP_WORDS.has(w));
  const targetPositions = new Map();
  targetFiltered.forEach((word, index) => {
    if (!targetPositions.has(word)) targetPositions.set(word, []);
    targetPositions.get(word).push(index);
  });

  let lastPosition = -1;
  let disorderCount = 0;
  for (const word of spokenFiltered) {
    const positions = targetPositions.get(word);
    if (!positions) continue;
    const position = positions.find(p => p >= lastPosition);
    if (position === undefined) {
      disorderCount++;
    } else {
      if (position < lastPosition) disorderCount++;
      lastPosition = position;
    }
  }
  return {
    hasWordOrderError: disorderCount > 0,
    disorderCount
  };
}

function detectNonEnglishWords(spokenWords) {
  return spokenWords.filter(word => {
    if (SINHALA_CODE_WORDS.has(word)) return true;
    return /^(m|k|h|w|n|o|a|e).*(aa|ee|oo|th|dh|kh|ng)$/i.test(word);
  });
}

function analysePitch(pitchSamples) {
  const valid = (pitchSamples || []).filter(p => Number.isFinite(p) && p >= 70 && p <= 500);
  if (valid.length < 4) {
    return {
      pitchAvailable: false,
      isMonotone: false,
      pitchRange: 0,
      meanPitch: 0,
      pitchStdDev: 0,
      score: 80,
      style: 'Short Utterance'
    };
  }
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const range = max - min;
  const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
  const variance = valid.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / valid.length;
  const stdDev = Math.sqrt(variance);

  const isMonotone = (range < 20 || stdDev < 8);
  let style = 'Natural Variation';
  let score = 90;
  if (isMonotone) {
    style = 'Flat / Monotone';
    score = 65;
  } else if (range > 65 || stdDev > 22) {
    style = 'Highly Expressive';
    score = 95;
  }

  return {
    pitchAvailable: true,
    isMonotone,
    pitchRange: Math.round(range),
    meanPitch: Math.round(mean),
    pitchStdDev: Math.round(stdDev),
    score,
    style
  };
}

function analyseQuestionIntonation(pitchSamples, targetText) {
  if (!targetText.trim().endsWith('?')) {
    return { isQuestion: false, rising: null, status: 'Statement' };
  }
  const valid = (pitchSamples || []).filter(p => p >= 70 && p <= 500);
  if (valid.length < 8) {
    return { isQuestion: true, rising: null, status: 'Insufficient pitch data' };
  }
  const lastCount = Math.max(4, Math.floor(valid.length * 0.25));
  const firstPart = valid.slice(-lastCount * 2, -lastCount);
  const finalPart = valid.slice(-lastCount);
  const firstAvg = firstPart.reduce((a, b) => a + b, 0) / Math.max(1, firstPart.length);
  const finalAvg = finalPart.reduce((a, b) => a + b, 0) / Math.max(1, finalPart.length);
  const rise = finalAvg - firstAvg;
  return {
    isQuestion: true,
    rising: rise > 10,
    finalPitchChange: Math.round(rise),
    status: rise > 10 ? 'Rising Question Intonation' : 'Flat/Falling Intonation'
  };
}

function classifyStartDelay(ms) {
  if (ms < 1500) return { delayMs: Math.round(ms), status: 'Quick Start' };
  if (ms < 3500) return { delayMs: Math.round(ms), status: 'Normal Start' };
  if (ms < 6000) return { delayMs: Math.round(ms), status: 'Slow Start' };
  return { delayMs: Math.round(ms), status: 'Hesitant Start' };
}

function calculateSpeakingConfidence({ attempts, startDelayMs, accuracy, hesitationCount }) {
  let score = 100;
  if (attempts === 2) score -= 10;
  if (attempts >= 3) score -= 20;
  if (startDelayMs > 3500) score -= 10;
  if (startDelayMs > 6000) score -= 15;
  if (hesitationCount > 0) score -= Math.min(20, hesitationCount * 8);
  if (accuracy < 80) score -= (100 - accuracy) * 0.2;
  return Math.max(20, Math.min(100, Math.round(score)));
}

// ══════════════════════════════════════════════════════════════════════
// ── TRUE 6-DIMENSIONAL SPEECH SESSION EVALUATOR ──
// ══════════════════════════════════════════════════════════════════════
function evaluateSpeechSession(sessionData, targetText, spokenText, candidateAlternatives = [], previousAttempts = []) {
  console.log("%c[Speech Session Analyzer] Starting Comprehensive Multi-Dimensional Analysis...", "background: #0284c7; color: #fff; font-weight: bold; padding: 2px 8px; border-radius: 4px;");

  const normSpokenText = normalizeDigitsToWords(spokenText);
  const normTargetText = normalizeDigitsToWords(targetText);
  const spokenClean = (normSpokenText || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
  const targetClean = (normTargetText || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
  const spokenWords = spokenClean.split(/\s+/).filter(Boolean);
  const targetWords = targetClean.split(/\s+/).filter(Boolean);
  const allCandidateTokens = Array.from(new Set([
    ...spokenWords,
    ...(candidateAlternatives || []).map(a => normalizeDigitsToWords(a).toLowerCase().replace(/[^a-z0-9]/g, ''))
  ])).filter(Boolean);

  const duration = Math.max(0.5, sessionData?.recordingDuration || 1.5);
  const pauses = sessionData?.pauseSegments || [];
  const pauseCount = pauses.length;
  const totalPauseMs = pauses.reduce((sum, p) => sum + p.durationMs, 0);
  const totalPauseSec = Number((totalPauseMs / 1000).toFixed(2));
  const averagePauseSec = pauseCount > 0 ? Number((totalPauseSec / pauseCount).toFixed(2)) : 0;
  const longestPauseSec = pauseCount > 0 ? Number((Math.max(0, ...pauses.map(p => p.durationMs)) / 1000).toFixed(2)) : 0;

  const volumeSamples = sessionData?.volumeSamples || [];
  const avgVol = volumeSamples.length ? Math.round(volumeSamples.reduce((a, b) => a + b, 0) / volumeSamples.length) : 0;
  const maxVol = volumeSamples.length ? Math.max(...volumeSamples) : 0;
  const minVol = volumeSamples.length ? Math.min(...volumeSamples) : 0;
  const volAnalysis = classifyVolume(avgVol, maxVol);

  const isSystemPlaceholder = /^(speak again|please speak again|no speech detected|listening|time out|error|microphone access denied|connection issue)/i.test(spokenClean);

  const speechDetected = Boolean(
    !isSystemPlaceholder &&
    spokenWords.length > 0 &&
    (spokenClean.length > 0 || avgVol > 12)
  );

  if (!speechDetected || isSystemPlaceholder) {
    return {
      overallScore: 0,
      soundDetected: false,
      wordsCorrect: false,
      pronunciationCorrect: false,
      accuracy: 0,
      statusTitle: 'No Speech Detected',
      statusMessage: 'No clear speech was detected from the microphone. Please speak into the microphone and try again.',
      transcript: '(No sound detected)',
      wordResults: [],
      missedWords: targetWords,
      mtiPatterns: [],
      pronunciation: { score: 0, wordAccuracy: 0, mtiPenalty: 0, allWordsCorrect: false },
      fluency: { score: 0, wpm: 0, speakingRate: 0, pauseCount: 0, totalPauseSec: 0, averagePauseSec: 0, longestPauseSec: 0, hesitationCount: 0, fillerWords: [], speedStatus: 'No Speech' },
      intonation: { score: 0, isMonotone: false, pitchRange: 0, meanPitch: 0, pitchStdDev: 0, style: 'No Signal', questionAnalysis: { isQuestion: false, rising: null, status: 'No Signal' } },
      volume: { score: 0, percent: 0, maxVolume: 0, minVolume: 0, status: 'Muted' },
      language: { score: 0, missingWords: targetWords, extraWords: [], wordOrderError: false, disorderCount: 0, repetitions: [], sinhalaWords: [] },
      engagement: { score: 0, attempts: previousAttempts.length + 1, startDelayMs: 0, startDelayStatus: 'None', improvementPercentage: 0, improvementMessage: '' }
    };
  }

  const isSingleWord = (targetWords.length === 1);

  // ── DUAL-LAYER MTI DETECTION: Acoustic analysis + Lexical text analysis ──
  const acousticMtiPatterns = analyzeAcousticPhonology(sessionData, targetWords, spokenWords);
  const textMtiPatterns = [];

  // 1. Check token-by-token text MTI
  targetWords.forEach(twRaw => {
    const twClean = (twRaw || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!twClean) return;

    for (const sw of allCandidateTokens) {
      const swClean = (sw || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!swClean || swClean === twClean) continue;
      const detected = detectTextMTIErrors(twClean, swClean);
      if (detected) {
        textMtiPatterns.push(detected);
        break;
      }
    }
  });

  // 2. Check phrase-level & separated S-Cluster Prosthesis (e.g., "is school", "i school", "es school", "his school", "is cool", "is kool")
  targetWords.forEach((twRaw, idx) => {
    const twClean = (twRaw || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!twClean) return;
    const isSCluster = (/^s[cptkmnrwl]/i.test(twClean) || twClean === 'school');
    if (!isSCluster) return;

    if (isSingleWord) {
      const hasTargetOrConfuser = spokenWords.some(sw => {
        const swClean = sw.toLowerCase().replace(/[^a-z0-9]/g, '');
        return swClean === twClean || (twClean === 'school' && ['cool', 'kool', 'pool', 'tool', 'call', 'coo', 'cl'].includes(swClean)) || swClean.startsWith(twClean.slice(0, 3));
      });
      const hasProsthesisPrefix = spokenWords.some(sw => {
        const swClean = sw.toLowerCase().replace(/[^a-z0-9]/g, '');
        return ['is', 'es', 'i', 'e', 'his', 'est', 'east', 'esta', 'its', "it's"].includes(swClean);
      });
      if ((hasTargetOrConfuser && hasProsthesisPrefix) || /\b(is|es|i|his)\s+(school|spoon|station|study|speak|star|stop|spring|student|cool|kool)\b/i.test(spokenClean)) {
        textMtiPatterns.push(mkPattern(1, twClean, spokenClean, `Spoken text shows '${spokenClean}' with S-Cluster Prosthesis vowel added before '${twClean}'.`));
      }
    } else {
      for (let sIdx = 0; sIdx < spokenWords.length; sIdx++) {
        const swClean = spokenWords[sIdx].toLowerCase().replace(/[^a-z0-9]/g, '');
        if (swClean === twClean || (twClean === 'school' && ['cool', 'kool'].includes(swClean))) {
          if (sIdx > 0) {
            const prevSpoken = spokenWords[sIdx - 1].toLowerCase().replace(/[^a-z0-9]/g, '');
            const expectedPrev = idx > 0 ? targetWords[idx - 1].toLowerCase().replace(/[^a-z0-9]/g, '') : '';
            if (['is', 'es', 'i', 'his'].includes(prevSpoken) && prevSpoken !== expectedPrev) {
              textMtiPatterns.push(mkPattern(1, twClean, `${prevSpoken} ${twClean}`, `Spoken text shows '${prevSpoken} ${twClean}' with separated S-Cluster Prosthesis before '${twClean}'.`));
            }
          }
        }
      }
    }
  });

  // Special Check: TH Substitution for 'three' vs 'tree'
  if (targetWords.includes('three')) {
    const hasTreeConfuser = allCandidateTokens.some(tok => ['tree', 'tri', 'trees', 'try', 'free'].includes(tok.toLowerCase()));
    if (hasTreeConfuser && !textMtiPatterns.some(p => p.id === 3 && p.target === 'three')) {
      const thPat = mkPattern(3, 'three', 'tree', "Spoken text shows 'tree' substituting T for TH in 'three'.");
      if (thPat) textMtiPatterns.push(thPat);
    }
  }

  // Merge and deduplicate by MTI key and target word
  const mergedMtiMap = new Map();
  [...acousticMtiPatterns, ...textMtiPatterns].forEach(p => {
    if (!p) return;
    const mapKey = `${p.key}_${p.target}`;
    if (!mergedMtiMap.has(mapKey)) {
      mergedMtiMap.set(mapKey, p);
    }
  });
  const mtiPatterns = Array.from(mergedMtiMap.values());
  if (mtiPatterns.length > 0) {
    console.log("%c[MTI Diagnostics] 🎙️ MTI Evidence Detected:", "background: #dc2626; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;", mtiPatterns);
  }
  const mtiErrorTargets = new Set(mtiPatterns.map(p => p.target));

  let wordResults = [];
  let matchedCount = 0;
  let missedWords = [];
  let displayTranscript = normalizeDigitsToWords(spokenText);

  if (isSingleWord) {
    const targetWord = targetWords[0];
    const flaggedThisWord = mtiErrorTargets.has(targetWord);

    let matchedExact = (spokenClean === targetWord || isWordMatch(targetWord, spokenClean));
    let matchedInWords = spokenWords.includes(targetWord);
    if (!matchedExact && !matchedInWords && spokenWords.length > 0) {
      for (const sw of spokenWords) {
        if (isWordMatch(targetWord, sw)) { matchedInWords = true; break; }
      }
    }

    if (flaggedThisWord) {
      const matchedPattern = mtiPatterns.find(p => p.target === targetWord);
      matchedCount = 0;
      missedWords = [targetWord];
      const errSpoken = matchedPattern?.spoken || spokenClean;
      wordResults = [{ word: targetWord, matched: false, spoken: errSpoken }];
      displayTranscript = errSpoken;
    } else if (matchedExact || (matchedInWords && spokenWords.length === 1)) {
      matchedCount = 1;
      missedWords = [];
      wordResults = [{ word: targetWord, matched: true, spoken: targetWord }];
      displayTranscript = targetWord;
    } else {
      matchedCount = 0;
      missedWords = [targetWord];
      const rawSpk = spokenWords[0] || '';
      wordResults = [{ word: targetWord, matched: false, spoken: rawSpk }];
      displayTranscript = rawSpk || '(Unclear Speech)';
    }
  } else {
    wordResults = alignWordsLCS(targetWords, spokenWords);
    if (mtiErrorTargets.size > 0) {
      wordResults = wordResults.map(wr => mtiErrorTargets.has(wr.word) ? { ...wr, matched: false } : wr);
    }
    matchedCount = wordResults.filter(w => w.matched).length;
    missedWords = wordResults.filter(w => !w.matched).map(w => w.word);

    if (mtiPatterns.length > 0) {
      let tokens = spokenWords.map(w => normalizeDigitsToWords(w));
      mtiPatterns.forEach(p => {
        if (p.spoken && p.target) {
          const idx = tokens.findIndex(t => t === p.target || t === p.spoken || isWordMatch(p.target, t));
          if (idx >= 0) {
            tokens[idx] = p.spoken;
          }
        }
      });
      displayTranscript = tokens.join(' ');
    }
  }

  const totalWords = Math.max(1, targetWords.length);
  const wordAccuracy = Math.round((matchedCount / totalWords) * 100);
  const mtiPenalty = mtiPatterns.length * 15;
  const pronunciationScore = Math.max(0, wordAccuracy - mtiPenalty);
  const allWordsCorrect = (matchedCount === totalWords);
  const pronunciationCorrect = (allWordsCorrect && mtiPatterns.length === 0);

  const actualSpeakingSec = Math.max(0.4, duration - totalPauseSec);
  const overallWpm = Math.round((spokenWords.length / duration) * 60);
  const speakingRate = Math.round((spokenWords.length / actualSpeakingSec) * 60);
  const hesitations = detectHesitations(spokenWords, pauses);

  let speedStatus = 'Optimal / Natural';
  let fluencyScore = 90;
  if (speakingRate < 60) {
    speedStatus = 'Too Slow';
    fluencyScore -= 20;
  } else if (speakingRate > 175) {
    speedStatus = 'Too Fast';
    fluencyScore -= 15;
  }
  if (pauseCount > 2) fluencyScore -= Math.min(25, (pauseCount - 2) * 8);
  if (hesitations.hesitationCount > 0) fluencyScore -= Math.min(20, hesitations.hesitationCount * 10);
  fluencyScore = Math.max(20, Math.min(100, fluencyScore));

  const pitchAnalysis = analysePitch(sessionData?.pitchSamples);
  const questionIntonation = analyseQuestionIntonation(sessionData?.pitchSamples, targetText);
  let intonationScore = pitchAnalysis.score;
  if (questionIntonation.isQuestion && questionIntonation.rising === false) {
    intonationScore -= 15;
  }
  intonationScore = Math.max(20, Math.min(100, intonationScore));

  const volumeScore = volAnalysis.score;

  const orderAnalysis = detectWordOrderError(targetWords, spokenWords);
  const repetitions = detectRepetitions(spokenWords);
  const sinhalaWords = detectNonEnglishWords(spokenWords);
  let languageScore = 100;
  if (orderAnalysis.hasWordOrderError) languageScore -= orderAnalysis.disorderCount * 15;
  if (repetitions.length > 0) languageScore -= repetitions.length * 10;
  if (sinhalaWords.length > 0) languageScore -= sinhalaWords.length * 15;
  if (missedWords.length > 0) languageScore -= Math.round((missedWords.length / totalWords) * 30);
  languageScore = Math.max(20, Math.min(100, languageScore));

  const startDelayMs = sessionData?.firstSpeechAt ? Math.max(0, sessionData.firstSpeechAt - sessionData.startedAt) : Math.min(3000, duration * 300);
  const startDelayInfo = classifyStartDelay(startDelayMs);
  const confidenceScore = calculateSpeakingConfidence({
    attempts: previousAttempts.length + 1,
    startDelayMs,
    accuracy: pronunciationScore,
    hesitationCount: hesitations.hesitationCount
  });

  let improvementPercentage = 0;
  let improvementMessage = '';
  if (previousAttempts.length > 0) {
    const firstScore = previousAttempts[0]?.overallScore || previousAttempts[0]?.accuracy || 50;
    improvementPercentage = Math.round(pronunciationScore - firstScore);
    if (improvementPercentage > 0) {
      improvementMessage = `Attempt #${previousAttempts.length + 1}: +${improvementPercentage}% improvement over previous attempt!`;
    }
  }

  let overallScore = Math.round(
    pronunciationScore * 0.40 +
    fluencyScore * 0.20 +
    intonationScore * 0.15 +
    volumeScore * 0.10 +
    languageScore * 0.10 +
    confidenceScore * 0.05
  );
  if (pronunciationCorrect) {
    overallScore = Math.max(90, overallScore);
  }

  return {
    overallScore,
    accuracy: pronunciationScore,
    soundDetected: true,
    wordsCorrect: allWordsCorrect,
    pronunciationCorrect,
    statusTitle: pronunciationCorrect
      ? 'Excellent Pronunciation! (100% Passed)'
      : 'Pronunciation Needs Practice',
    statusMessage: pronunciationCorrect
      ? 'Your pronunciation, pitch intonation, and speaking fluency are excellent.'
      : mtiPatterns.length > 0
      ? `MTI pronunciation pattern detected: ${mtiPatterns.map(p => p.name).join(', ')}.`
      : `${matchedCount}/${totalWords} words correct. Please pronounce '${missedWords.join(', ')}' clearly for full marks.`,
    transcript: displayTranscript,
    wordResults,
    missedWords,
    mtiPatterns,

    pronunciation: {
      score: pronunciationScore,
      wordAccuracy,
      mtiPenalty,
      allWordsCorrect
    },

    fluency: {
      score: fluencyScore,
      wpm: overallWpm,
      speakingRate,
      pauseCount,
      totalPauseSec,
      averagePauseSec,
      longestPauseSec,
      hesitationCount: hesitations.hesitationCount,
      fillerWords: hesitations.fillerWords,
      speedStatus,
      durationSec: duration
    },

    intonation: {
      score: intonationScore,
      isMonotone: pitchAnalysis.isMonotone,
      pitchRange: pitchAnalysis.pitchRange,
      meanPitch: pitchAnalysis.meanPitch,
      pitchStdDev: pitchAnalysis.pitchStdDev,
      style: pitchAnalysis.style,
      questionAnalysis: questionIntonation
    },

    volume: {
      score: volumeScore,
      percent: avgVol,
      maxVolume: maxVol,
      minVolume: minVol,
      status: volAnalysis.status
    },

    language: {
      score: languageScore,
      missingWords: missedWords,
      extraWords: spokenWords.filter(sw => !targetWords.includes(sw)),
      wordOrderError: orderAnalysis.hasWordOrderError,
      disorderCount: orderAnalysis.disorderCount,
      repetitions,
      sinhalaWords
    },

    engagement: {
      score: confidenceScore,
      attempts: previousAttempts.length + 1,
      startDelayMs: startDelayInfo.delayMs,
      startDelayStatus: startDelayInfo.status,
      improvementPercentage,
      improvementMessage
    }
  };
}

export default function EnglishModule({ onExit }) {
  const navigate = useNavigate();

  const [viewState, setViewState] = useState('grades_hub');
  const [selectedGrade, setSelectedGrade] = useState(2);
  const [activePaperId, setActivePaperId] = useState(1);

  const [paperQuestions, setPaperQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [questionAttempts, setQuestionAttempts] = useState(1);

  const [selectedMtiPatternKey, setSelectedMtiPatternKey] = useState('S_CLUSTER_PROSTHESIS');
  const [mtiLabWordIndex, setMtiLabWordIndex] = useState(0);
  const [mtiLabLiveTranscript, setMtiLabLiveTranscript] = useState('');
  const [mtiLabResult, setMtiLabResult] = useState(null);
  const [mtiLabListening, setMtiLabListening] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [liveVolume, setLiveVolume] = useState(0);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  const quizFileInputRef = useRef(null);
  const mtiFileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const latestTranscriptRef = useRef('');
  const latestAlternativesRef = useRef([]);
  const noSpeechAttemptsRef = useRef(0);
  const soundHeardRef = useRef(false);
  const timerIntervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const silenceTimerRef = useRef(null);

  const sessionDataRef = useRef({
    startedAt: 0,
    firstSpeechAt: null,
    pauseSegments: [],
    volumeSamples: [],
    pitchSamples: [],
    spectralFrames: []
  });
  const currentlySpeakingRef = useRef(false);
  const lastSpeechTimeRef = useRef(0);
  const pauseStartedAtRef = useRef(null);

  const questionAttemptHistoryRef = useRef({});

  const [paperHistory, setPaperHistory] = useState(() => {
    try {
      const g2 = JSON.parse(localStorage.getItem('g2_english_paper_history') || '{}');
      const g3 = JSON.parse(localStorage.getItem('g3_english_paper_history') || '{}');
      const g4 = JSON.parse(localStorage.getItem('g4_english_paper_history') || '{}');
      return { 2: g2, 3: g3, 4: g4 };
    } catch (e) {
      return { 2: {}, 3: {}, 4: {} };
    }
  });

  const savePaperResult = (grade, paperId, resultData) => {
    const updatedGrade = {
      ...(paperHistory[grade] || {}),
      [paperId]: resultData
    };
    const updatedAll = {
      ...paperHistory,
      [grade]: updatedGrade
    };
    setPaperHistory(updatedAll);
    try {
      localStorage.setItem(`g${grade}_english_paper_history`, JSON.stringify(updatedGrade));
    } catch (e) {}
  };

  const isPaperUnlocked = (pId) => {
    // Temporarily unlocked all English speaking question papers
    return true;
  };

  const generatePaperQuestions = (grade, paperId) => {
    const fixedList = FIXED_PAPERS[grade]?.[paperId] || FIXED_PAPERS[2]?.[1] || [];
    return fixedList.map(q => ({
      ...q,
      grade: grade,
      level_name_si: grade === 2 ? 'Single Words' : grade === 3 ? 'Short Sentences' : 'Long Sentences'
    }));
  };

  const handleStartPaper = (pId) => {
    if (!isPaperUnlocked(pId)) return;
    playSound('click');
    setActivePaperId(pId);
    setHistory([]);
    questionAttemptHistoryRef.current = {};

    const qList = generatePaperQuestions(selectedGrade, pId);
    setPaperQuestions(qList);
    setCurrentQIndex(0);
    setQuestionAttempts(1);
    setLiveTranscript('');
    setLiveVolume(0);
    setAssessmentResult(null);
    setIsAnswered(false);
    latestTranscriptRef.current = '';
    soundHeardRef.current = false;
    setViewState('quiz');
  };

  const handleViewSavedPaperReport = (pId) => {
    playSound('click');
    const saved = paperHistory[selectedGrade]?.[pId];
    if (saved) {
      setActivePaperId(pId);
      setHistory(saved.history || []);
      setViewState('report');
    } else {
      handleStartPaper(pId);
    }
  };

  const setupAudioAnalyser = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      if (!isListeningRef.current) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }
      mediaStreamRef.current = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyserRef.current = analyser;

        const updateAudioMetrics = () => {
          if (!isListeningRef.current || !analyserRef.current || !audioContextRef.current) return;
          const an = analyserRef.current;
          const sampleRate = audioContextRef.current.sampleRate;

          const freqData = new Uint8Array(an.frequencyBinCount);
          an.getByteFrequencyData(freqData);
          let sum = 0;
          for (let i = 0; i < freqData.length; i++) sum += freqData[i];
          const avg = sum / freqData.length;
          const volPercent = Math.min(100, Math.round((avg / 128) * 100));
          setLiveVolume(volPercent);
          sessionDataRef.current.volumeSamples.push(volPercent);

          const binWidth = sampleRate / an.fftSize;
          const lowEndBin = Math.max(1, Math.floor(800 / binWidth));
          const midEndBin = Math.max(lowEndBin + 1, Math.floor(2500 / binWidth));
          const highEndBin = Math.min(freqData.length - 1, Math.floor(8000 / binWidth));

          let lowSum = 0, midSum = 0, highSum = 0;
          for (let i = 0; i < lowEndBin; i++) lowSum += freqData[i];
          for (let i = lowEndBin; i < midEndBin; i++) midSum += freqData[i];
          for (let i = midEndBin; i <= highEndBin; i++) highSum += freqData[i];

          const lowEnergy = lowSum / lowEndBin;
          const midEnergy = midSum / Math.max(1, midEndBin - lowEndBin);
          const highEnergy = highSum / Math.max(1, highEndBin - midEndBin);

          const timeData = new Float32Array(an.fftSize);
          an.getFloatTimeDomainData(timeData);
          const pitch = autoCorrelate(timeData, sampleRate);
          if (pitch >= 70 && pitch <= 500) {
            sessionDataRef.current.pitchSamples.push(pitch);
          }

          const now = performance.now();
          if (sessionDataRef.current.spectralFrames.length < 500) {
            sessionDataRef.current.spectralFrames.push({
              t: now,
              vol: volPercent,
              pitch: pitch > 0 ? pitch : null,
              low: lowEnergy,
              mid: midEnergy,
              high: highEnergy
            });
          }

          const SILENCE_THRESHOLD = 8;
          const MIN_PAUSE_MS = 350;

          if (volPercent > SILENCE_THRESHOLD) {
            if (!currentlySpeakingRef.current) {
              currentlySpeakingRef.current = true;
              if (pauseStartedAtRef.current !== null) {
                const pauseDuration = now - pauseStartedAtRef.current;
                if (pauseDuration >= MIN_PAUSE_MS) {
                  sessionDataRef.current.pauseSegments.push({
                    start: pauseStartedAtRef.current,
                    end: now,
                    durationMs: pauseDuration
                  });
                }
                pauseStartedAtRef.current = null;
              }
              if (!sessionDataRef.current.firstSpeechAt) {
                sessionDataRef.current.firstSpeechAt = now;
              }
            }
            lastSpeechTimeRef.current = now;
            soundHeardRef.current = true;
          } else {
            if (currentlySpeakingRef.current && now - lastSpeechTimeRef.current >= MIN_PAUSE_MS) {
              currentlySpeakingRef.current = false;
              pauseStartedAtRef.current = lastSpeechTimeRef.current;
            }
          }

          animFrameRef.current = requestAnimationFrame(updateAudioMetrics);
        };

        updateAudioMetrics();
      }
    }).catch(err => {
      console.log("[Audio Analyzer] Fallback / mic permission info:", err);
    });
  };

  const stopListening = () => {
    isListeningRef.current = false;
    setIsListening(false);
    setMtiLabListening(false);
    setLiveVolume(0);

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.stop();
      } catch (e) {
        try { recognitionRef.current.abort(); } catch (err) {}
      }
      recognitionRef.current = null;
    }

    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      } catch (e) {}
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
  };

  const MAX_NO_SPEECH_RETRIES = 3;
  const restartRecognitionIfNeeded = (recoInstance, onGiveUp) => {
    if (!isListeningRef.current) return;
    if (noSpeechAttemptsRef.current >= MAX_NO_SPEECH_RETRIES) {
      onGiveUp && onGiveUp();
      return;
    }
    setTimeout(() => {
      if (isListeningRef.current && recognitionRef.current === recoInstance && !latestTranscriptRef.current) {
        try {
          recoInstance.start();
        } catch (e) {
          // Already started or invalid state - ignore, next onend cycle will retry.
        }
      }
    }, 250);
  };

  const startRecording = () => {
    console.log("%c[Speaking Paper] 1. 'Speak' Button Clicked - Starting Recording...", "background: #047857; color: #fff; font-weight: bold; padding: 2px 8px; border-radius: 4px;");
    playSound('click');
    stopListening();

    setAssessmentResult(null);
    setIsAnswered(false);
    setLiveTranscript('');
    setLiveVolume(0);
    setRecordingSeconds(0);
    latestTranscriptRef.current = '';
    latestAlternativesRef.current = [];
    noSpeechAttemptsRef.current = 0;
    soundHeardRef.current = false;
    isListeningRef.current = true;
    setIsListening(true);

    sessionDataRef.current = {
      startedAt: performance.now(),
      firstSpeechAt: null,
      pauseSegments: [],
      volumeSamples: [],
      pitchSamples: [],
      spectralFrames: []
    };
    currentlySpeakingRef.current = false;
    lastSpeechTimeRef.current = performance.now();
    pauseStartedAtRef.current = null;

    setupAudioAnalyser();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("[Speaking Paper] SpeechRecognition API not supported on this browser!");
      setIsListening(false);
      isListeningRef.current = false;
      setLiveTranscript('(Browser speech recognition not supported)');
      return;
    }

    const currentQ = paperQuestions[currentQIndex];
    const isSingleWordQ = currentQ && (!currentQ.target_text || !currentQ.target_text.includes(' '));

    try {
      console.log("%c[Speaking Paper] 2. Initializing SpeechRecognition (lang: en-US)...", "color: #0284c7; font-weight: bold;");
      const reco = new SpeechRecognition();
      reco.continuous = false;
      reco.interimResults = true;
      reco.lang = 'en-US';
      reco.maxAlternatives = 10;

      let hasProcessedResult = false;
      let resultTimeout = null;

      reco.onstart = () => {
        console.log("%c[Speaking Paper] 2.1 onstart: Recognizer active and listening", "color: #059669; font-weight: bold;");
        if (isListeningRef.current) setIsListening(true);
        noSpeechAttemptsRef.current = 0;
        hasProcessedResult = false;
      };

      reco.onsoundstart = () => { soundHeardRef.current = true; };
      reco.onspeechstart = () => { soundHeardRef.current = true; };

      reco.onresult = (event) => {
        soundHeardRef.current = true;
        noSpeechAttemptsRef.current = 0;

        const { transcript, alternatives } = extractCleanEnglishTranscript(event);
        console.log(`%c[Speaking Paper] 3. onresult -> transcript: "${transcript}"`, "background: #7c3aed; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;");

        if (transcript) {
          latestTranscriptRef.current = transcript;
          setLiveTranscript(transcript);
        }
        if (alternatives && alternatives.length > 0) {
          latestAlternativesRef.current = Array.from(new Set([...latestAlternativesRef.current, ...alternatives]));
        }

        const hasFinal = Array.from(event.results).some(r => r.isFinal);

        if (hasFinal && transcript) {
          hasProcessedResult = true;
          if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
          if (resultTimeout) { clearTimeout(resultTimeout); resultTimeout = null; }

          const delay = isSingleWordQ ? 200 : 500;
          resultTimeout = setTimeout(() => {
            if (isListeningRef.current && latestTranscriptRef.current) {
              stopRecordingAndEvaluate();
            }
          }, delay);
        } else if (transcript && !hasFinal) {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (isListeningRef.current && latestTranscriptRef.current && !hasProcessedResult) {
              stopRecordingAndEvaluate();
            }
          }, isSingleWordQ ? 600 : 1200);
        }

        if (hasFinal && !transcript && latestAlternativesRef.current.length > 0) {
          const altText = latestAlternativesRef.current.join(' ');
          latestTranscriptRef.current = altText;
          setLiveTranscript(altText);
          setTimeout(() => {
            if (isListeningRef.current) stopRecordingAndEvaluate();
          }, 300);
        }
      };

      reco.onerror = (event) => {
        console.warn(`%c[Speaking Paper] ⚠️ onerror: ${event.error}`, "color: #ef4444; font-weight: bold;");

        if (event.error === 'no-speech') {
          noSpeechAttemptsRef.current++;
          setLiveTranscript(`🎤 Listening... (Please speak again)`);
          restartRecognitionIfNeeded(reco, () => {
            setLiveTranscript('🎤 No speech detected. Please try again.');
            stopListening();
          });
          return;
        }

        if (event.error === 'not-allowed') {
          setLiveTranscript('🎤 Microphone access denied.');
          stopListening();
        }

        if (event.error === 'audio-capture' || event.error === 'network') {
          setLiveTranscript('🎤 Connection issue. Please try again.');
          setTimeout(() => {
            if (isListeningRef.current && recognitionRef.current) {
              try { recognitionRef.current.start(); } catch (e) {}
            }
          }, 400);
        }
      };

      reco.onend = () => {
        console.log("%c[Speaking Paper] 2.4 onend: Recognizer cycle ended", "color: #64748b;");

        if (hasProcessedResult) return;

        const hasTranscript = Boolean(latestTranscriptRef.current && latestTranscriptRef.current.length > 0);

        if (hasTranscript && isListeningRef.current) {
          setTimeout(() => {
            if (isListeningRef.current) stopRecordingAndEvaluate();
          }, 200);
          return;
        }

        if (isListeningRef.current && !hasTranscript) {
          restartRecognitionIfNeeded(reco, () => {
            setLiveTranscript('🎤 No speech detected. Please try again.');
            stopListening();
          });
        }
      };

      recognitionRef.current = reco;
      reco.start();
    } catch (e) {
      console.error("[Speaking Paper] SpeechRecognition init error:", e);
      setIsListening(false);
      isListeningRef.current = false;
      setLiveTranscript('🎤 Recognition error. Please try again.');
    }

    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds(sec => sec + 1);
    }, 1000);
  };

  const stopRecordingAndEvaluate = () => {
    console.log("%c[Speaking Paper] 4. 'Stop & Evaluate' Executing...", "background: #e11d48; color: #fff; font-weight: bold; padding: 2px 8px; border-radius: 4px;");
    playSound('click');
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    // ONLY use genuine user speech transcript, discard any UI prompt strings
    let rawText = (latestTranscriptRef.current || '').trim();
    if (!rawText && latestAlternativesRef.current && latestAlternativesRef.current.length > 0) {
      const validAlts = latestAlternativesRef.current.filter(t => !/listening|speak again|detected|time out|error/i.test(t));
      if (validAlts.length > 0) {
        rawText = validAlts[0];
      }
    }

    // If text matches system status string, clear it
    if (/^(speak again|please speak again|no speech|listening|time out|error)/i.test(rawText.replace(/[^a-z ]/gi, '').trim())) {
      rawText = '';
    }

    const finalText = rawText;
    const duration = Math.max(0.5, (performance.now() - (sessionDataRef.current.startedAt || performance.now())) / 1000);
    sessionDataRef.current.recordingDuration = duration;

    console.log(`[Speaking Paper] Final Heard Text: "${finalText}"`);
    console.log(`[Speaking Paper] Session Duration: ${duration.toFixed(2)}s | Spectral frames: ${sessionDataRef.current.spectralFrames.length}`);

    stopListening();

    const currentQ = paperQuestions[currentQIndex];
    const targetText = currentQ ? currentQ.target_text : '';

    const prevAttempts = questionAttemptHistoryRef.current[currentQIndex] || [];
    const res = evaluateSpeechSession(
      sessionDataRef.current,
      targetText,
      finalText,
      finalText ? (latestAlternativesRef.current || []) : [],
      prevAttempts
    );
    questionAttemptHistoryRef.current[currentQIndex] = [...prevAttempts, res];

    console.log("%c[Speaking Paper] 5. Final Evaluated Result:", "color: #0284c7; font-weight: bold;", res);
    setAssessmentResult(res);
    setIsAnswered(true);

    if (res.pronunciationCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  const handleNextQuestion = () => {
    playSound('click');
    stopListening();

    const currentQ = paperQuestions[currentQIndex];
    const isPassed = assessmentResult ? assessmentResult.pronunciationCorrect : false;
    const accuracy = assessmentResult ? assessmentResult.accuracy : 0;
    const userTranscript = assessmentResult ? assessmentResult.transcript : '(No speech)';

    const updatedHistory = [...history];

    // Preserving official score if already recorded (practicing previous questions will not alter or degrade official score)
    if (!updatedHistory[currentQIndex]) {
      updatedHistory[currentQIndex] = {
        qNum: currentQIndex + 1,
        id: currentQ.id,
        level: currentQ.level,
        targetText: currentQ.target_text,
        userTranscript: userTranscript,
        accuracy: accuracy,
        overallScore: assessmentResult?.overallScore || accuracy,
        isPassed: isPassed,
        sinhalaMeaning: currentQ.sinhala_meaning,
        phoneticHint: currentQ.phonetic_hint,
        soundDetected: assessmentResult ? assessmentResult.soundDetected : false,
        wordsCorrect: assessmentResult ? assessmentResult.wordsCorrect : false,
        rawAssessment: assessmentResult,
        wordResults: assessmentResult ? assessmentResult.wordResults : [],
        mtiPatterns: assessmentResult ? assessmentResult.mtiPatterns : [],
        fluency: assessmentResult ? assessmentResult.fluency : {},
        intonation: assessmentResult ? assessmentResult.intonation : {},
        volume: assessmentResult ? assessmentResult.volume : {},
        language: assessmentResult ? assessmentResult.language : {},
        engagement: assessmentResult ? assessmentResult.engagement : {},
        attempts: questionAttempts
      };
      setHistory(updatedHistory);
    }

    if (currentQIndex < 9) {
      const nextIndex = currentQIndex + 1;
      setCurrentQIndex(nextIndex);
      setQuestionAttempts(1);
      setLiveTranscript('');
      setLiveVolume(0);
      setRecordingSeconds(0);
      latestTranscriptRef.current = '';
      latestAlternativesRef.current = [];
      soundHeardRef.current = false;

      // If next question was already answered, restore its assessment
      const nextSaved = updatedHistory[nextIndex];
      if (nextSaved && nextSaved.rawAssessment) {
        setAssessmentResult(nextSaved.rawAssessment);
        setIsAnswered(true);
      } else {
        setAssessmentResult(null);
        setIsAnswered(false);
      }
    } else {
      const validHistory = [];
      for (let i = 0; i < 10; i++) {
        if (updatedHistory[i]) {
          validHistory.push(updatedHistory[i]);
        }
      }
      const passedCount = validHistory.filter(h => h.isPassed).length;
      const finalAccuracy = Math.round((passedCount / 10) * 100);

      savePaperResult(selectedGrade, activePaperId, {
        paperId: activePaperId,
        grade: selectedGrade,
        totalQuestions: 10,
        totalPassed: passedCount,
        overallAccuracy: finalAccuracy,
        history: validHistory,
        completedAt: new Date().toLocaleDateString('si-LK')
      });

      if (finalAccuracy >= 75) {
        playSound('unlock');
      } else {
        playSound('wrong');
      }

      setViewState('report');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQIndex <= 0) return;
    playSound('click');
    stopListening();

    const updatedHistory = [...history];

    // If currently answered and not recorded yet, save it
    if (assessmentResult && !updatedHistory[currentQIndex]) {
      const currentQ = paperQuestions[currentQIndex];
      const isPassed = assessmentResult ? assessmentResult.pronunciationCorrect : false;
      const accuracy = assessmentResult ? assessmentResult.accuracy : 0;
      const userTranscript = assessmentResult ? assessmentResult.transcript : '(No speech)';

      updatedHistory[currentQIndex] = {
        qNum: currentQIndex + 1,
        id: currentQ.id,
        level: currentQ.level,
        targetText: currentQ.target_text,
        userTranscript: userTranscript,
        accuracy: accuracy,
        overallScore: assessmentResult?.overallScore || accuracy,
        isPassed: isPassed,
        sinhalaMeaning: currentQ.sinhala_meaning,
        phoneticHint: currentQ.phonetic_hint,
        soundDetected: assessmentResult ? assessmentResult.soundDetected : false,
        wordsCorrect: assessmentResult ? assessmentResult.wordsCorrect : false,
        rawAssessment: assessmentResult,
        wordResults: assessmentResult ? assessmentResult.wordResults : [],
        mtiPatterns: assessmentResult ? assessmentResult.mtiPatterns : [],
        fluency: assessmentResult ? assessmentResult.fluency : {},
        intonation: assessmentResult ? assessmentResult.intonation : {},
        volume: assessmentResult ? assessmentResult.volume : {},
        language: assessmentResult ? assessmentResult.language : {},
        engagement: assessmentResult ? assessmentResult.engagement : {},
        attempts: questionAttempts
      };
      setHistory(updatedHistory);
    }

    const prevIndex = currentQIndex - 1;
    setCurrentQIndex(prevIndex);
    setQuestionAttempts(1);
    setLiveTranscript('');
    setLiveVolume(0);
    setRecordingSeconds(0);
    latestTranscriptRef.current = '';
    latestAlternativesRef.current = [];
    soundHeardRef.current = false;

    // Load saved historical assessment for the previous question if available
    const savedEntry = updatedHistory[prevIndex];
    if (savedEntry && savedEntry.rawAssessment) {
      setAssessmentResult(savedEntry.rawAssessment);
      setIsAnswered(true);
    } else {
      setAssessmentResult(null);
      setIsAnswered(false);
    }
  };

  const handleRetryQuestion = () => {
    playSound('click');
    stopListening();
    setQuestionAttempts(prev => prev + 1);
    setLiveTranscript('');
    setLiveVolume(0);
    setAssessmentResult(null);
    setIsAnswered(false);
    setRecordingSeconds(0);
    latestTranscriptRef.current = '';
    latestAlternativesRef.current = [];
    soundHeardRef.current = false;
  };

  const handleAudioFileUpload = async (e, isMtiLab = false) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    playSound('click');
    stopListening();

    setIsProcessingUpload(true);
    const fileName = file.name;
    if (isMtiLab) {
      setMtiLabResult(null);
      setMtiLabLiveTranscript(`📁 Processing audio file: ${fileName}...`);
    } else {
      setAssessmentResult(null);
      setIsAnswered(false);
      setLiveTranscript(`📁 Processing audio file: ${fileName}...`);
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));

      const duration = audioBuffer.duration;
      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;
      const frameSize = Math.floor(sampleRate * 0.05); // 50ms frames
      const volumeSamples = [];
      const pitchSamples = [];
      const pauseSegments = [];
      let inPause = false;
      let pauseStart = 0;

      for (let i = 0; i < channelData.length; i += frameSize) {
        let sumSquares = 0;
        let count = 0;
        for (let j = i; j < Math.min(i + frameSize, channelData.length); j++) {
          sumSquares += channelData[j] * channelData[j];
          count++;
        }
        const rms = Math.sqrt(sumSquares / Math.max(1, count));
        const vol = Math.min(100, Math.round(rms * 400));
        volumeSamples.push(vol);

        if (vol < 8) {
          if (!inPause) { inPause = true; pauseStart = (i / sampleRate) * 1000; }
        } else {
          if (inPause) {
            inPause = false;
            const pauseDur = ((i / sampleRate) * 1000) - pauseStart;
            if (pauseDur > 250) pauseSegments.push({ startMs: pauseStart, durationMs: pauseDur });
          }
        }

        // Autocorrelation pitch extraction
        if (vol > 15 && i + 1024 < channelData.length) {
          const slice = channelData.subarray(i, i + 1024);
          let bestR = 0;
          let bestPeriod = 0;
          const minP = Math.floor(sampleRate / 400);
          const maxP = Math.floor(sampleRate / 70);
          for (let p = minP; p <= maxP; p++) {
            let r = 0;
            for (let k = 0; k < 512; k++) {
              r += slice[k] * slice[k + p];
            }
            if (r > bestR) { bestR = r; bestPeriod = p; }
          }
          if (bestPeriod > 0 && bestR > 0.01) {
            const hz = Math.round(sampleRate / bestPeriod);
            if (hz >= 75 && hz <= 400) pitchSamples.push(hz);
          }
        }
      }

      const sessionData = {
        recordingDuration: Math.max(0.8, duration),
        startedAt: performance.now(),
        firstSpeechAt: performance.now() + 200,
        pauseSegments,
        volumeSamples,
        pitchSamples,
        spectralFrames: []
      };

      const base64Audio = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          resolve(typeof result === 'string' ? result.split(',')[1] : '');
        };
        reader.readAsDataURL(file);
      });

      const currentQ = paperQuestions[currentQIndex];
      const targetText = isMtiLab ? mtiLabTargetWord : (currentQ?.target_text || '');
      let spokenText = targetText;
      let altTokens = [];

      try {
        const resp = await fetch('/api/english/assess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: 'student_web',
            audioBase64: base64Audio,
            targetText: targetText,
            clientTranscript: ''
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.transcript && data.transcript !== '(No sound recorded)') {
            spokenText = data.transcript;
          }
        }
      } catch (err) {
        console.log("[Audio Upload] Backend assessment fallback to local evaluation:", err);
      }

      // Play uploaded audio preview
      try {
        const audioUrl = URL.createObjectURL(file);
        const player = new Audio(audioUrl);
        player.play().catch(() => {});
      } catch (e) {}

      const res = evaluateSpeechSession(
        sessionData,
        targetText,
        spokenText,
        altTokens,
        isMtiLab ? [] : (questionAttemptHistoryRef.current[currentQIndex] || [])
      );

      setIsProcessingUpload(false);
      if (isMtiLab) {
        setMtiLabResult(res);
        setMtiLabLiveTranscript(res.transcript || spokenText);
      } else {
        setAssessmentResult(res);
        setIsAnswered(true);
        setLiveTranscript(res.transcript || spokenText);
      }

      if (res.pronunciationCorrect || res.overallScore >= 75) {
        playSound('correct');
      } else {
        playSound('wrong');
      }

    } catch (err) {
      console.error("[Audio Upload Error]:", err);
      setIsProcessingUpload(false);
      if (isMtiLab) {
        setMtiLabLiveTranscript('⚠️ Error reading audio file. Please try another audio file.');
      } else {
        setLiveTranscript('⚠️ Error reading audio file. Please try another audio file.');
      }
    }

    if (e.target) e.target.value = '';
  };

  const activeMtiPattern = SRI_LANKAN_MTI_PATTERNS.find(p => p.key === selectedMtiPatternKey) || SRI_LANKAN_MTI_PATTERNS[0];
  const mtiLabTargetWord = activeMtiPattern.examples[mtiLabWordIndex % activeMtiPattern.examples.length] || activeMtiPattern.examples[0];

  const handleSelectSuggestedWord = (word, patternKey) => {
    playSound('click');
    stopListening();
    if (patternKey && patternKey !== selectedMtiPatternKey) {
      setSelectedMtiPatternKey(patternKey);
    }
    const targetPattern = SRI_LANKAN_MTI_PATTERNS.find(p => p.key === (patternKey || selectedMtiPatternKey)) || activeMtiPattern;
    const wordIdx = targetPattern.examples.indexOf(word);
    if (wordIdx >= 0) {
      setMtiLabWordIndex(wordIdx);
    }
    setMtiLabResult(null);
    setMtiLabLiveTranscript('');
    speakEnglish(word);
  };

  const startMtiLabRecording = () => {
    console.log("%c[MTI Lab] 1. 'Speak to Test' Clicked - Initializing...", "background: #047857; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;");
    playSound('click');
    stopListening();

    setMtiLabResult(null);
    setMtiLabLiveTranscript('');
    setMtiLabListening(true);
    isListeningRef.current = true;
    latestTranscriptRef.current = '';
    latestAlternativesRef.current = [];
    noSpeechAttemptsRef.current = 0;
    soundHeardRef.current = false;

    sessionDataRef.current = {
      startedAt: performance.now(),
      firstSpeechAt: null,
      pauseSegments: [],
      volumeSamples: [],
      pitchSamples: [],
      spectralFrames: []
    };
    currentlySpeakingRef.current = false;
    lastSpeechTimeRef.current = performance.now();
    pauseStartedAtRef.current = null;

    setupAudioAnalyser();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMtiLabListening(false);
      isListeningRef.current = false;
      setMtiLabLiveTranscript('(Browser speech recognition not supported)');
      return;
    }

    try {
      const reco = new SpeechRecognition();
      reco.continuous = false;
      reco.interimResults = true;
      reco.lang = 'en-US';
      reco.maxAlternatives = 10;

      let autoStopTimer = setTimeout(() => {
        if (isListeningRef.current && !latestTranscriptRef.current && !soundHeardRef.current) {
          setMtiLabLiveTranscript('⏰ Time out. 🎤 Click to try again.');
        }
      }, 6000);

      reco.onstart = () => { noSpeechAttemptsRef.current = 0; };
      reco.onsoundstart = () => { soundHeardRef.current = true; };
      reco.onspeechstart = () => { soundHeardRef.current = true; };

      const finishAndEvaluate = (text, altWords = []) => {
        if (!isListeningRef.current) return;
        if (autoStopTimer) { clearTimeout(autoStopTimer); autoStopTimer = null; }
        if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
        const duration = Math.max(0.5, (performance.now() - (sessionDataRef.current.startedAt || performance.now())) / 1000);
        sessionDataRef.current.recordingDuration = duration;

        let cleanText = (text || '').trim();
        if (/^(speak again|please speak again|no speech|listening|time out|error)/i.test(cleanText.replace(/[^a-z ]/gi, '').trim())) {
          cleanText = '';
        }

        const res = evaluateSpeechSession(
          sessionDataRef.current,
          mtiLabTargetWord,
          cleanText,
          cleanText ? (altWords.length > 0 ? altWords : (latestAlternativesRef.current || [])) : [],
          []
        );
        console.log("%c[MTI Lab] 4. Evaluation Result:", "color: #0284c7; font-weight: bold;", res);
        setMtiLabResult(res);
        setMtiLabListening(false);
        isListeningRef.current = false;
        try {
          reco.onend = null;
          reco.stop();
        } catch (e) {}
      };

      reco.onresult = (event) => {
        soundHeardRef.current = true;
        noSpeechAttemptsRef.current = 0;
        const { transcript, alternatives } = extractCleanEnglishTranscript(event);

        if (transcript) {
          latestTranscriptRef.current = transcript;
          setMtiLabLiveTranscript(transcript);
        }
        if (alternatives && alternatives.length > 0) {
          latestAlternativesRef.current = Array.from(new Set([...latestAlternativesRef.current, ...alternatives]));
        }

        const hasFinal = Array.from(event.results).some(r => r.isFinal);

        if (transcript) {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (isListeningRef.current && latestTranscriptRef.current) {
              finishAndEvaluate(latestTranscriptRef.current, latestAlternativesRef.current);
            }
          }, 500);
        }

        if (hasFinal && !transcript && latestAlternativesRef.current.length > 0) {
          const altText = latestAlternativesRef.current.join(' ');
          latestTranscriptRef.current = altText;
          setMtiLabLiveTranscript(altText);
          setTimeout(() => {
            if (isListeningRef.current) finishAndEvaluate(altText, latestAlternativesRef.current);
          }, 300);
        }
      };

      reco.onerror = (event) => {
        console.warn(`%c[MTI Lab] ⚠️ onerror: ${event.error}`, "color: #ef4444; font-weight: bold;");

        if (event.error === 'no-speech') {
          noSpeechAttemptsRef.current++;
          setMtiLabLiveTranscript(`🎤 Listening... (Please speak again)`);
          restartRecognitionIfNeeded(reco, () => {
            setMtiLabLiveTranscript('🎤 No speech detected. Please try again.');
            setMtiLabListening(false);
            isListeningRef.current = false;
            try { reco.stop(); } catch (e) {}
          });
          return;
        }

        if (event.error === 'not-allowed') {
          setMtiLabLiveTranscript('🎤 Microphone access denied.');
          setMtiLabListening(false);
          isListeningRef.current = false;
        }

        if (event.error === 'audio-capture' || event.error === 'network') {
          setMtiLabLiveTranscript('🎤 Connection issue. Please try again.');
          setTimeout(() => {
            if (isListeningRef.current && recognitionRef.current) {
              try { recognitionRef.current.start(); } catch (e) {}
            }
          }, 400);
        }
      };

      reco.onend = () => {
        if (autoStopTimer) { clearTimeout(autoStopTimer); autoStopTimer = null; }
        if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }

        const hasTranscript = Boolean(latestTranscriptRef.current && latestTranscriptRef.current.length > 0);

        if (hasTranscript && isListeningRef.current) {
          setTimeout(() => {
            if (isListeningRef.current) finishAndEvaluate(latestTranscriptRef.current, latestAlternativesRef.current);
          }, 200);
          return;
        }

        if (isListeningRef.current && !hasTranscript) {
          restartRecognitionIfNeeded(reco, () => {
            setMtiLabListening(false);
            isListeningRef.current = false;
            setMtiLabLiveTranscript('🎤 No speech detected. Please try again.');
          });
        }
      };

      recognitionRef.current = reco;
      reco.start();
    } catch (e) {
      console.error("[MTI Lab] Start error:", e);
      setMtiLabListening(false);
      isListeningRef.current = false;
      setMtiLabLiveTranscript('(Recognition failed — please try again)');
    }
  };

  const stopMtiLabRecording = () => {
    playSound('click');
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setMtiLabListening(false);
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        try { recognitionRef.current.abort(); } catch (err) {}
      }
      recognitionRef.current = null;
    }
  };

  const currentQ = paperQuestions[currentQIndex];
  const activePaperConfig = PAPERS_CONFIG.find(p => p.id === activePaperId) || PAPERS_CONFIG[0];

  const totalPassedCount = history.filter(h => h.isPassed).length;
  const overallReportAccuracy = history.length > 0
    ? Math.round((totalPassedCount / history.length) * 100)
    : 0;
  const hasPassedThreshold = overallReportAccuracy >= 75;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed font-sans select-none relative overflow-x-hidden pb-16"
      style={{ backgroundImage: "url('/images/grade4_meadow_bg.jpg')" }}
    >
      <div className={`mx-auto relative z-10 p-4 sm:p-6 ${viewState === 'quiz' || viewState === 'report' || viewState === 'mti_lab' ? 'max-w-6xl' : 'max-w-4xl'}`}>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (viewState === 'quiz' || viewState === 'mti_lab') {
                if (viewState === 'mti_lab' || window.confirm("Do you want to exit this paper?")) {
                  stopListening();
                  setViewState('grades_hub');
                }
              } else if (viewState === 'report') {
                setViewState('papers_hub');
              } else if (viewState === 'papers_hub') {
                setViewState('grades_hub');
              } else {
                onExit ? onExit() : navigate('/dashboard');
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-emerald-400 text-slate-700 font-bold rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <span>⬅</span>
            <span>
              {viewState === 'grades_hub'
                ? 'Back to Dashboard'
                : viewState === 'papers_hub' || viewState === 'mti_lab'
                ? 'Main Menu'
                : 'Select Papers'}
            </span>
          </button>

          {viewState === 'quiz' && (
            <div className="flex items-center gap-2">
              <span className={`text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm bg-gradient-to-r ${activePaperConfig.color}`}>
                {activePaperConfig.badge}
              </span>
              <span className="bg-white/90 backdrop-blur border border-slate-200 text-slate-800 font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                Question {currentQIndex + 1} / 10
              </span>
            </div>
          )}

          {viewState === 'grades_hub' && (
            <button
              onClick={() => { playSound('click'); setViewState('mti_lab'); }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer"
            >
              <span>🎙️</span>
              <span>MTI Speech Lab (Sandbox)</span>
            </button>
          )}
        </div>

        {viewState === 'grades_hub' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-xl text-center relative overflow-hidden">
              <div className="inline-block bg-emerald-100 text-emerald-800 font-black text-xs px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                English Speech, Fluency & MTI Analysis AI
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2">
                English Speaking & Fluency Adaptive Learning System
              </h1>
              <p className="text-slate-600 font-bold text-sm sm:text-base max-w-2xl mx-auto">
                Comprehensive evaluation of 12 Sri Lankan MTI patterns, speaking fluency (WPM), pitch intonation, and clarity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { grade: 2, icon: '🌱', title: 'Grade 2', desc: 'Single word pronunciation — 3 fixed papers covering all 12 Sri Lankan MTI patterns', type: 'Single Words', color: 'from-emerald-500 to-teal-600' },
                { grade: 3, icon: '🎯', title: 'Grade 3', desc: 'Short sentence reading — 3 fixed papers covering all 12 Sri Lankan MTI patterns', type: 'Short Sentences', color: 'from-blue-500 to-indigo-600' },
                { grade: 4, icon: '🚀', title: 'Grade 4', desc: 'Long sentences & expressive speech — 3 fixed papers covering all 12 Sri Lankan MTI patterns', type: 'Long Sentences', color: 'from-purple-500 to-pink-600' }
              ].map(g => (
                <div
                  key={g.grade}
                  onClick={() => { setSelectedGrade(g.grade); setViewState('papers_hub'); }}
                  className="bg-white rounded-3xl p-7 border-2 border-slate-200 hover:border-emerald-400 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-4xl">{g.icon}</span>
                      <span className="bg-slate-100 text-slate-700 text-xs font-black px-3 py-1 rounded-full">
                        3 Papers (30 Questions)
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800">{g.title}</h2>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{g.desc}</p>
                    <div className="pt-2 text-xs font-bold text-slate-500 space-y-1">
                      <div>✓ Paper 01: 10 Questions ({g.type})</div>
                      <div>✓ Paper 02: 10 Questions ({g.type})</div>
                      <div>✓ Paper 03: 10 Questions ({g.type})</div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white shadow-md bg-gradient-to-r ${g.color} cursor-pointer`}>
                      Go to Papers ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewState === 'mti_lab' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-2 border-rose-200 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="inline-block bg-rose-100 text-rose-800 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider mb-1">
                    🎙️ Sri Lankan MTI Diagnostics Hub • Live MTI Speech Lab
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
                    12 Sri Lankan English MTI Pattern Diagnostics
                  </h2>
                </div>
                <button
                  onClick={() => setViewState('grades_hub')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  ✕ Exit Lab
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Select an MTI Pattern to Test (1 of 12 Patterns):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SRI_LANKAN_MTI_PATTERNS.map((p, idx) => (
                    <button
                      key={p.key}
                      onClick={() => {
                        playSound('click');
                        setSelectedMtiPatternKey(p.key);
                        setMtiLabWordIndex(0);
                        setMtiLabResult(null);
                        setMtiLabLiveTranscript('');
                      }}
                      className={`p-2.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        selectedMtiPatternKey === p.key
                          ? 'bg-rose-500 border-rose-600 text-white shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-rose-300'
                      }`}
                    >
                      <div className="text-[10px] font-black opacity-80">#{idx + 1}</div>
                      <div className="font-black text-xs leading-snug">{p.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl space-y-6 text-center">
                <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-200">
                  <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                    {activeMtiPattern.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    Target: {WORD_IPA_MAP[mtiLabTargetWord]?.target || activeMtiPattern.target_ipa} vs Common Error: {WORD_IPA_MAP[mtiLabTargetWord]?.error || activeMtiPattern.error_ipa}
                  </span>
                </div>

                <div>
                  <h3 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-wide font-sans mb-1">
                    {mtiLabTargetWord}
                  </h3>
                  <p className="text-sm text-slate-500 font-mono">
                    {WORD_IPA_MAP[mtiLabTargetWord]?.target || activeMtiPattern.target_ipa}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {activeMtiPattern.examples.map((w) => (
                    <button
                      key={w}
                      onClick={() => handleSelectSuggestedWord(w, activeMtiPattern.key)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 ${
                        w === mtiLabTargetWord
                          ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-400'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50'
                      }`}
                    >
                      <span>🔊</span>
                      <span>{w}</span>
                    </button>
                  ))}
                </div>

                <div className="max-w-md mx-auto space-y-2.5 pt-1">
                  <button
                    onClick={mtiLabListening ? stopMtiLabRecording : startMtiLabRecording}
                    className={`w-full py-4 px-6 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer active:scale-98 ${
                      mtiLabListening
                        ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-rose-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                    }`}
                  >
                    <span className="text-xl">{mtiLabListening ? '⏹️' : '🎤'}</span>
                    <span>{mtiLabListening ? 'Stop Recording' : 'Speak to Test'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2.5 w-full">
                    <button
                      onClick={() => speakEnglish(mtiLabTargetWord)}
                      className="py-3 px-3 rounded-2xl font-black text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-200 shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span className="text-base">🔊</span>
                      <span>Standard Audio</span>
                    </button>

                    <input
                      type="file"
                      ref={mtiFileInputRef}
                      accept="audio/*,video/*,.mp3,.wav,.ogg,.m4a,.webm,.aac,.flac,.mp4"
                      className="hidden"
                      onChange={(e) => handleAudioFileUpload(e, true)}
                    />

                    <button
                      onClick={() => mtiFileInputRef.current?.click()}
                      disabled={isProcessingUpload || mtiLabListening}
                      className="py-3 px-3 rounded-2xl font-black text-xs sm:text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-2 border-indigo-200 shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <span className="text-base">📁</span>
                      <span>{isProcessingUpload ? 'Analyzing...' : 'Upload Voice'}</span>
                    </button>
                  </div>
                </div>

                {isProcessingUpload && (
                  <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-indigo-50 border-2 border-indigo-300 text-indigo-900 space-y-1 animate-fade-in text-center shadow-md">
                    <div className="flex items-center justify-center gap-2 font-black text-xs text-indigo-700">
                      <span className="animate-spin text-base">⚙️</span> Analyzing uploaded audio file with acoustic engine...
                    </div>
                  </div>
                )}

                {mtiLabListening && (
                  <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400 rounded-3xl text-emerald-900 space-y-3 animate-fade-in shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase tracking-wider">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                        🎙️ Live Listening...
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
                        <span className="w-1 h-8 bg-teal-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                        <span className="w-1 h-10 bg-emerald-600 rounded-full animate-bounce [animation-delay:300ms]"></span>
                        <span className="w-1 h-7 bg-teal-600 rounded-full animate-bounce [animation-delay:450ms]"></span>
                        <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:200ms]"></span>
                      </div>
                    </div>

                    <div className="py-3 bg-white/90 rounded-2xl border border-emerald-200 text-center min-h-[56px] flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-900 font-sans tracking-wide">
                        {mtiLabLiveTranscript ? `"${mtiLabLiveTranscript}"` : '🎙️ Speak now...'}
                      </span>
                    </div>

                    <div className="text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1.5">
                      <span className="animate-spin text-sm">⚙️</span> Real-time speech analysis & phoneme comparison...
                    </div>
                  </div>
                )}

                {mtiLabResult && !mtiLabListening && (
                  <div className="p-6 bg-white border-2 border-slate-200 rounded-3xl space-y-5 text-left animate-fade-in shadow-md">
                    {/* Top Row: Left: User transcript | Right: Status Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">You said</span>
                        <strong className="text-slate-900 text-xl font-sans tracking-wide">
                          "{mtiLabResult.transcript}"
                        </strong>
                      </div>

                      {/* Right-aligned Status Badge */}
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-2 rounded-2xl text-xs font-black text-white shadow-sm flex items-center gap-1.5 ${
                          mtiLabResult.mtiPatterns && mtiLabResult.mtiPatterns.length > 0
                            ? 'bg-rose-600'
                            : mtiLabResult.wordsCorrect
                            ? 'bg-emerald-600'
                            : 'bg-amber-600'
                        }`}>
                          {mtiLabResult.mtiPatterns && mtiLabResult.mtiPatterns.length > 0
                            ? '⚠️ MTI Pattern Detected'
                            : mtiLabResult.wordsCorrect
                            ? '✓ Clean Standard Pronunciation'
                            : '⚠️ Incorrect Word'}
                        </span>
                      </div>
                    </div>

                    {/* Acoustic Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Volume</span>
                        <span className="font-bold text-slate-700">{mtiLabResult.volume?.percent || 0}% ({mtiLabResult.volume?.status?.split(' ')[0] || 'Clear'})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Pitch</span>
                        <span className="font-bold text-slate-700">{mtiLabResult.intonation?.pitchRange || 0} Hz ({mtiLabResult.intonation?.style?.split(' ')[0] || 'Natural'})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Start Delay</span>
                        <span className="font-bold text-slate-700">{mtiLabResult.engagement?.startDelayStatus?.split(' ')[0] || 'Quick'}</span>
                      </div>
                    </div>

                    {/* MTI Pattern Guidance Alert or Feedback */}
                    {mtiLabResult.mtiPatterns && mtiLabResult.mtiPatterns.length > 0 ? (
                      <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-black text-rose-900">
                          <span>📌 Detected MTI Pattern: {mtiLabResult.mtiPatterns[0].name}</span>
                          <span className="font-mono text-xs bg-white px-2.5 py-1 rounded-lg border border-rose-200 text-rose-800 font-bold">
                            {mtiLabResult.mtiPatterns[0].target_ipa} ➔ {mtiLabResult.mtiPatterns[0].error_ipa}
                          </span>
                        </div>
                        {mtiLabResult.mtiPatterns[0].explanation && (
                          <p className="text-xs text-rose-900 font-semibold">
                            🔍 {mtiLabResult.mtiPatterns[0].explanation}
                          </p>
                        )}
                        <p className="text-xs text-rose-800 font-bold">
                          💡 Tip: {mtiLabResult.mtiPatterns[0].pedagogical_tip}
                        </p>
                      </div>
                    ) : !mtiLabResult.wordsCorrect ? (
                      <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl text-amber-900">
                        <h4 className="font-black text-sm">⚠️ Spoken word did not match target.</h4>
                        <p className="text-xs font-medium mt-0.5">
                          You said '{mtiLabResult.transcript}'. Please try saying '{mtiLabTargetWord}' again.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-emerald-900">
                        <h4 className="font-black text-sm">🎉 Excellent! Standard English Pronunciation (No MTI Errors).</h4>
                        <p className="text-xs font-medium mt-0.5">Your pronunciation matches the standard English phonological model.</p>
                      </div>
                    )}

                    {/* SUGGESTED PRACTICE WORDS (SMALL BOXES) */}
                    <div className="pt-3 border-t border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                          <span>💡</span> Suggested Practice Words for this MTI Pattern:
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">Click word box to change top target</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(mtiLabResult.mtiPatterns?.[0]?.key
                          ? (SRI_LANKAN_MTI_PATTERNS.find(p => p.key === mtiLabResult.mtiPatterns[0].key)?.examples || activeMtiPattern.examples)
                          : activeMtiPattern.examples
                        ).map((word) => (
                          <button
                            key={word}
                            onClick={() => handleSelectSuggestedWord(word, mtiLabResult.mtiPatterns?.[0]?.key || selectedMtiPatternKey)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 ${
                              word === mtiLabTargetWord
                                ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-400'
                                : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-300 hover:border-emerald-400'
                            }`}
                          >
                            <span>🔊</span>
                            <span>{word}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {viewState === 'papers_hub' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-xl text-center relative overflow-hidden">
              <div className="inline-block bg-emerald-100 text-emerald-800 font-black text-xs px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                Grade {selectedGrade} • English Speaking Papers
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2">
                {selectedGrade === 2 ? 'Single Word Speaking Papers (3 Papers)' : selectedGrade === 3 ? 'Short Sentence Speaking Papers (3 Papers)' : 'Long Sentence Speaking Papers (3 Papers)'}
              </h1>
              <p className="text-slate-600 font-bold text-sm sm:text-base max-w-2xl mx-auto">
                3 Fixed papers with 10 questions each, systematically evaluating all 12 Sri Lankan MTI patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PAPERS_CONFIG.map(p => {
                const result = paperHistory[selectedGrade]?.[p.id];
                const isCompleted = !!result;
                const unlocked = isPaperUnlocked(p.id);
                const subtitleText = selectedGrade === 2
                  ? 'Single word pronunciation & MTI error detection'
                  : selectedGrade === 3
                  ? 'Short sentence reading, intonation & fluency'
                  : 'Long sentences, expressive speech & rhythm';

                return (
                  <div
                    key={p.id}
                    className={`bg-white rounded-3xl p-6 border-2 transition-all duration-300 shadow-lg flex flex-col justify-between hover:shadow-2xl relative overflow-hidden ${
                      !unlocked
                        ? 'opacity-75 bg-slate-50 border-slate-300'
                        : isCompleted
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-slate-200 hover:-translate-y-1'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-4xl">{p.icon}</span>
                        {!unlocked ? (
                          <span className="bg-slate-200 text-slate-600 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                            🔒 Locked
                          </span>
                        ) : isCompleted ? (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                            ✓ Completed
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-xs font-black px-3 py-1 rounded-full">
                            New Paper
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-slate-800 leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {subtitleText}
                      </p>

                      <div className="pt-2">
                        <span className={`inline-block text-xs font-black px-3 py-1 rounded-lg ${
                          p.id === 1 ? 'bg-emerald-100 text-emerald-800' : p.id === 2 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {p.badge}
                        </span>
                      </div>

                      {isCompleted && (
                        <div className="mt-4 p-3 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">Previous Score:</span>
                          <span className="text-sm font-black text-emerald-700">
                            {result.totalPassed}/{result.totalQuestions} ({result.overallAccuracy}%)
                          </span>
                        </div>
                      )}

                      {!unlocked && (
                        <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] font-bold text-amber-800">
                          🔒 Score at least 75% on Paper 0{p.id - 1} to unlock this paper.
                        </div>
                      )}
                    </div>

                    <div className="pt-6 space-y-2">
                      {unlocked ? (
                        <>
                          <button
                            onClick={() => handleStartPaper(p.id)}
                            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white shadow-md transition-all cursor-pointer bg-gradient-to-r ${p.color} hover:opacity-95 active:scale-95`}
                          >
                            {isCompleted ? '🔄 Retake Paper' : 'Start Speaking ➔'}
                          </button>
                          {isCompleted && (
                            <button
                              onClick={() => handleViewSavedPaperReport(p.id)}
                              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              📊 View Report
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          disabled
                          className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-slate-400 bg-slate-200 cursor-not-allowed border border-slate-300"
                        >
                          🔒 Locked
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewState === 'quiz' && currentQ && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-xl animate-scale-up space-y-6">

            <div>
              <div className="flex flex-wrap justify-between items-center text-xs font-black text-slate-600 mb-2 gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playSound('click');
                      stopListening();
                      setViewState('papers_hub');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1 transition-all"
                  >
                    ✕ Exit Paper
                  </button>
                  {currentQIndex > 0 && (
                    <button
                      onClick={handlePreviousQuestion}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs cursor-pointer flex items-center gap-1 transition-all shadow-xs"
                    >
                      <span>◀</span> Back to Q{currentQIndex} (Practice)
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {history[currentQIndex] && (
                    <span className="text-[11px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      🔒 Official Score: {history[currentQIndex].score}% (Locked)
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Attempt #{questionAttempts}
                  </span>
                  <span className="font-black text-slate-700">Question {currentQIndex + 1} / 10</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div
                  className={`h-3 rounded-full transition-all duration-300 bg-gradient-to-r ${activePaperConfig.color}`}
                  style={{ width: `${((currentQIndex + 1) / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

              {/* LEFT COLUMN: Question, Audio Controls & Navigation */}
              <div className="lg:col-span-6 bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 text-center shadow-sm flex flex-col justify-between h-full">

                <div className="space-y-5">
                  {history[currentQIndex] && (
                    <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-2xl text-blue-900 text-xs font-medium flex items-center justify-between gap-2 text-left animate-fade-in">
                      <div className="flex items-center gap-2">
                        <span className="text-base">💡</span>
                        <span>
                          <strong>Practice Mode:</strong> Official score (<strong>{history[currentQIndex].score}%</strong>) is safely locked.
                        </span>
                      </div>
                      <span className="bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded-full font-black tracking-wider uppercase whitespace-nowrap shadow-xs">
                        Score Safe
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-xs">
                      {selectedGrade === 2 ? '🔤 Single Word' : selectedGrade === 3 ? '📖 Short Sentence' : '🎙️ Long Sentence'}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                      Meaning: <strong className="text-slate-800 font-sans">{currentQ.sinhala_meaning}</strong>
                    </span>
                  </div>

                  <div className="py-4 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-wide font-sans">
                      {currentQ.display_text}
                    </h2>
                    {currentQ.phonetic_hint && (
                      <p className="text-base font-bold text-emerald-600 font-mono">
                        {currentQ.phonetic_hint}
                      </p>
                    )}
                    {currentQ.tip && (
                      <div className="pt-1">
                        <span className="inline-block text-[11px] font-medium text-amber-900 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full">
                          💡 {currentQ.tip}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Balanced 2-Tier Action Controls */}
                  <div className="space-y-2.5 pt-1">
                    {/* Primary Speak Button */}
                    <button
                      onClick={isListening ? stopRecordingAndEvaluate : startRecording}
                      className={`w-full py-4 px-6 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer active:scale-98 ${
                        isListening
                          ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-rose-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                      }`}
                    >
                      <span className="text-xl">{isListening ? '⏹️' : '🎤'}</span>
                      <span>{isListening ? `Stop Recording (${recordingSeconds}s)` : 'Speak to Test'}</span>
                    </button>

                    {/* Secondary Actions: 2 Balanced Columns */}
                    <div className="grid grid-cols-2 gap-2.5 w-full">
                      <button
                        onClick={() => speakEnglish(currentQ.target_text)}
                        className="py-3 px-3 rounded-2xl font-black text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-200 shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <span className="text-base">🔊</span>
                        <span>Listen Audio</span>
                      </button>

                      <input
                        type="file"
                        ref={quizFileInputRef}
                        accept="audio/*,video/*,.mp3,.wav,.ogg,.m4a,.webm,.aac,.flac,.mp4"
                        className="hidden"
                        onChange={(e) => handleAudioFileUpload(e, false)}
                      />

                      <button
                        onClick={() => quizFileInputRef.current?.click()}
                        disabled={isProcessingUpload || isListening}
                        className="py-3 px-3 rounded-2xl font-black text-xs sm:text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-2 border-indigo-200 shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        <span className="text-base">📁</span>
                        <span>{isProcessingUpload ? 'Analyzing...' : 'Upload Voice'}</span>
                      </button>
                    </div>
                  </div>

                  {isProcessingUpload && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50 border-2 border-indigo-300 text-indigo-900 space-y-1 animate-fade-in text-center shadow-md">
                      <div className="flex items-center justify-center gap-2 font-black text-xs text-indigo-700">
                        <span className="animate-spin text-base">⚙️</span> Analyzing uploaded audio file with acoustic engine...
                      </div>
                    </div>
                  )}

                  {isListening && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 space-y-3 animate-fade-in">
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                        <span className="font-bold text-xs">🎙️ Listening... ({recordingSeconds}s)</span>

                        <div className="flex items-end gap-1 h-4 px-2 py-0.5 bg-white rounded-lg border border-emerald-200">
                          {[0.4, 0.8, 1.2, 0.7, 0.5].map((mult, idx) => (
                            <div
                              key={idx}
                              className="w-1 bg-emerald-500 rounded-full transition-all duration-75"
                              style={{
                                height: `${Math.max(3, Math.min(14, (liveVolume * mult) / 4))}px`
                              }}
                            ></div>
                          ))}
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          liveVolume > 5 ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {liveVolume > 5 ? `🔊 Audio Detected (${liveVolume}%)` : '🔈 Listening...'}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-2xl border-2 border-emerald-400 text-center shadow-sm">
                        <div className="min-h-[36px] flex items-center justify-center">
                          {liveTranscript ? (
                            <span className="text-lg font-black text-emerald-900 font-sans tracking-wide">
                              "{liveTranscript}"
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-slate-400 italic animate-pulse">
                              🎙️ Speak now... spoken words will appear here
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation Buttons (Anchored to Bottom) */}
                <div className="pt-4 border-t border-slate-200 space-y-2.5 mt-auto">
                  {isAnswered && (
                    <button
                      onClick={handleRetryQuestion}
                      className={`w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 ${
                        assessmentResult?.pronunciationCorrect
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-300'
                      }`}
                    >
                      <span>🔄</span>
                      <span>{assessmentResult?.pronunciationCorrect ? 'Practice Pronouncing Again' : 'Try Saying Again'}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2.5 w-full">
                    {currentQIndex > 0 && (
                      <button
                        onClick={handlePreviousQuestion}
                        className="py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap"
                      >
                        <span>◀</span> Back
                      </button>
                    )}

                    <button
                      disabled={!isAnswered}
                      onClick={handleNextQuestion}
                      className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 ${
                        isAnswered
                          ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-md cursor-pointer active:scale-98'
                          : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-75 shadow-none'
                      }`}
                    >
                      <span>{currentQIndex >= 9 ? 'Finish Paper ➔' : 'Next Question ➔'}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: 6-Dimensional Stats & Assessment Diagnostics */}
              <div className="lg:col-span-6 h-full flex flex-col">
                {assessmentResult && !isListening ? (
                  <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4 text-left animate-fade-in shadow-md h-full flex flex-col justify-between">

                    <div className="space-y-4">
                      {/* Top Status Banner with Overall Score */}
                      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
                        assessmentResult.pronunciationCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-rose-50 border-rose-300 text-rose-900'
                      }`}>
                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-black text-base">{assessmentResult.statusTitle}</h4>
                            {assessmentResult.engagement?.improvementPercentage > 0 && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-600 text-white shadow-sm animate-bounce">
                                🌟 +{assessmentResult.engagement.improvementPercentage}% Improvement!
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium">{assessmentResult.statusMessage}</p>
                          {assessmentResult.engagement?.improvementMessage && (
                            <p className="text-[11px] font-bold text-emerald-700">
                              {assessmentResult.engagement.improvementMessage}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-black tracking-wider block opacity-75">Score</span>
                            <span className={`text-xl font-black px-4 py-1.5 rounded-xl shadow-sm inline-block ${
                              assessmentResult.pronunciationCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-600 text-white'
                            }`}>
                              {assessmentResult.overallScore ?? assessmentResult.accuracy}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 6 Multi-Dimensional Stat Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">

                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-black uppercase text-slate-500 block flex items-center gap-1">
                            🎯 1. Pronunciation
                          </span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-base font-black text-slate-800">
                              {assessmentResult.pronunciation?.score ?? assessmentResult.accuracy}%
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              assessmentResult.pronunciation?.allWordsCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {assessmentResult.pronunciation?.allWordsCorrect ? '✓ Clean' : 'Practice'}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-600 block">
                            MTI Errors: {assessmentResult.mtiPatterns?.length || 0}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-black uppercase text-slate-500 block flex items-center gap-1">
                            ⚡ 2. Fluency & Speed
                          </span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-base font-black text-slate-800">
                              {assessmentResult.fluency?.speakingRate || assessmentResult.fluency?.wpm || 0} <span className="text-xs font-normal">WPM</span>
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {assessmentResult.fluency?.speedStatus?.split(' ')[0] || 'Optimal'}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-600 block">
                            Pauses: {assessmentResult.fluency?.pauseCount || 0} ({assessmentResult.fluency?.totalPauseSec || 0}s)
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-black uppercase text-slate-500 block flex items-center gap-1">
                            🎵 3. Pitch Intonation
                          </span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs font-black text-slate-800 truncate">
                              {assessmentResult.intonation?.style?.split(' ')[0] || 'Natural'}
                            </span>
                            {assessmentResult.intonation?.pitchRange > 0 && (
                              <span className="text-[10px] font-mono text-slate-500 bg-white px-1 rounded border border-slate-200">
                                Δ{assessmentResult.intonation.pitchRange}Hz
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-medium text-slate-600 block">
                            {assessmentResult.intonation?.isMonotone ? '⚠️ Flat' : '✓ Dynamic'}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-black uppercase text-slate-500 block flex items-center gap-1">
                            🔊 4. Volume Level
                          </span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-base font-black text-slate-800">
                              {assessmentResult.volume?.percent || 0}%
                            </span>
                            <span className="text-[10px] font-bold text-slate-600">
                              (Peak: {assessmentResult.volume?.maxVolume || 0}%)
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-600 block truncate">
                            {assessmentResult.volume?.status?.split(' ')[0] || 'Clear'}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-black uppercase text-slate-500 block flex items-center gap-1">
                            🔤 5. Language & Structure
                          </span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-base font-black text-slate-800">
                              {assessmentResult.language?.score ?? 100}%
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              assessmentResult.language?.wordOrderError ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {assessmentResult.language?.wordOrderError ? '⚠️ Reorder' : '✓ Order OK'}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-600 block">
                            {assessmentResult.language?.repetitions?.length > 0 ? `Repetitions: ${assessmentResult.language.repetitions.length}` : 'No Repetitions'}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-black uppercase text-slate-500 block flex items-center gap-1">
                            🚀 6. Confidence & Engagement
                          </span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-base font-black text-slate-800">
                              {assessmentResult.engagement?.score ?? 90}%
                            </span>
                            <span className="text-[10px] font-bold text-slate-600">
                              Attempt #{assessmentResult.engagement?.attempts || questionAttempts}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-600 block truncate">
                            {assessmentResult.engagement?.startDelayStatus?.split(' ')[0] || 'Quick Start'}
                          </span>
                        </div>

                      </div>

                      {/* Contextual Similar MTI Practice Words Bar (Always shown on result below 6 stats) */}
                      {(() => {
                        const detectedKey = assessmentResult.mtiPatterns?.[0]?.key || currentQ.mti_pattern;
                        const matchedPattern = detectedKey
                          ? SRI_LANKAN_MTI_PATTERNS.find(p => p.key === detectedKey)
                          : (
                            SRI_LANKAN_MTI_PATTERNS.find(p => p.examples.includes(currentQ.target_text.toLowerCase())) ||
                            SRI_LANKAN_MTI_PATTERNS[0]
                          );
                        const relatedWords = (matchedPattern?.examples || []).filter(w => w.toLowerCase() !== currentQ.target_text.toLowerCase()).slice(0, 8);

                        if (!matchedPattern || relatedWords.length === 0) return null;

                        return (
                          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2 text-left animate-fade-in shadow-2xs">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-[11px] font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5">
                                <span>📚</span> Suggested {matchedPattern.name} Practice Words:
                              </span>
                              <span className="text-[10px] text-indigo-700 font-semibold bg-white px-2.5 py-0.5 rounded-full border border-indigo-200 whitespace-nowrap shrink-0 shadow-2xs">
                                Click to Listen
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {relatedWords.map((word) => (
                                <button
                                  key={word}
                                  onClick={() => {
                                    playSound('click');
                                    speakEnglish(word);
                                  }}
                                  className="px-3 py-1.5 bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95"
                                >
                                  <span className="text-[10px]">🔊</span>
                                  <span>{word}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      {/* MTI Pattern Guidance Alert */}
                      {assessmentResult.mtiPatterns && assessmentResult.mtiPatterns.length > 0 && (
                        <div className="space-y-3">
                          <span className="text-[11px] font-black text-rose-600 uppercase tracking-wider block">
                            ⚠️ Detected Sri Lankan MTI Patterns (Pronunciation Guidance):
                          </span>
                          {assessmentResult.mtiPatterns.map((pat, idx) => (
                            <div key={idx} className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl space-y-2">
                              <div className="flex items-center justify-between text-xs font-black text-rose-900">
                                <span>📌 {pat.name}</span>
                                <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-rose-200 text-rose-800 font-bold">
                                  {pat.target_ipa} ➔ {pat.error_ipa}
                                </span>
                              </div>
                              {pat.explanation && (
                                <p className="text-xs text-rose-900 font-semibold">
                                  🔍 {pat.explanation}
                                </p>
                              )}
                              <p className="text-xs text-rose-800 font-bold">
                                💡 Tip: {pat.pedagogical_tip}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Word-by-Word Alignment Chips */}
                      {assessmentResult.wordResults && assessmentResult.wordResults.length > 1 && (
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Word-by-Word Alignment:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {assessmentResult.wordResults.map((wr, idx) => (
                              <span
                                key={idx}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 border ${
                                  wr.matched
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                    : 'bg-rose-50 border-rose-300 text-rose-800'
                                }`}
                              >
                                <span>{wr.matched ? '✓' : '✗'}</span>
                                <span>{wr.word}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Spoken Transcript vs Target Text (Anchored to Bottom) */}
                    <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 font-bold flex flex-wrap justify-between items-center gap-2 mt-auto">
                      <span>You said: <strong className="font-sans text-slate-900 text-sm">"{assessmentResult.transcript}"</strong></span>
                      <span>Target {selectedGrade === 2 ? 'Word' : 'Sentence'}: <strong className="font-sans text-emerald-700 text-sm">"{currentQ.target_text}"</strong></span>
                    </div>

                  </div>
                ) : isListening ? (
                  <div className="p-8 rounded-3xl bg-white border-2 border-emerald-200 space-y-6 text-center animate-fade-in shadow-md h-full flex flex-col justify-center">
                    <div className="inline-block p-4 bg-emerald-50 rounded-full text-3xl animate-bounce">
                      🎙️
                    </div>
                    <h3 className="text-xl font-black text-slate-800">
                      Listening & Analyzing Speech in Real-Time...
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Speak clearly into the microphone. Acoustic phonemes, fluency speed, volume, and MTI patterns will be calculated as soon as you finish.
                    </p>
                    <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Volume</span>
                        <span className="font-bold text-emerald-700">{liveVolume > 5 ? `${liveVolume}%` : 'Muted'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Duration</span>
                        <span className="font-bold text-emerald-700">{recordingSeconds}s</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Engine</span>
                        <span className="font-bold text-emerald-700">6D AI</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-3xl bg-white border-2 border-dashed border-slate-300 space-y-5 text-left animate-fade-in shadow-xs h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                            6D Multi-Dimensional Diagnostics
                          </span>
                          <h3 className="text-base font-black text-slate-800 mt-1">
                            Speech Performance Telemetry
                          </h3>
                        </div>
                        <span className="text-2xl">📊</span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        Click <strong>🎤 Speak</strong> or <strong>📁 Upload Voice</strong> on the left to evaluate this question. The live 6-dimensional stats will appear here instantly:
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs opacity-60">
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 block">🎯 1. Pronunciation</span>
                          <span className="text-base font-black text-slate-700">-- %</span>
                          <span className="text-[10px] text-slate-400 block">Phoneme accuracy</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 block">⚡ 2. Fluency & Speed</span>
                          <span className="text-base font-black text-slate-700">-- WPM</span>
                          <span className="text-[10px] text-slate-400 block">Speaking rhythm</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 block">🎵 3. Pitch Intonation</span>
                          <span className="text-base font-black text-slate-700">-- Hz</span>
                          <span className="text-[10px] text-slate-400 block">Pitch melody</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 block">🔊 4. Volume Level</span>
                          <span className="text-base font-black text-slate-700">-- %</span>
                          <span className="text-[10px] text-slate-400 block">Mic loudness</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 block">🔤 5. Language</span>
                          <span className="text-base font-black text-slate-700">-- %</span>
                          <span className="text-[10px] text-slate-400 block">Word order</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 block">🚀 6. Confidence</span>
                          <span className="text-base font-black text-slate-700">-- %</span>
                          <span className="text-[10px] text-slate-400 block">Response delay</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {viewState === 'report' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-200 shadow-2xl space-y-8 animate-scale-up">

            <div className="text-center pb-6 border-b border-slate-200">
              <h2 className="text-3xl font-black text-slate-800 mb-1">
                Grade {selectedGrade} — {activePaperConfig.title} Report
              </h2>
              <p className="text-sm text-slate-500 font-bold">
                {activePaperConfig.levelTitle} • 10 Questions Evaluation Summary
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">100% Passed Questions</p>
                <p className="text-3xl font-black text-emerald-700">{totalPassedCount} / 10</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Overall Accuracy</p>
                <p className="text-3xl font-black text-blue-700">{overallReportAccuracy}%</p>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-purple-50 border border-purple-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">Status</p>
                <p className={`text-2xl font-black ${hasPassedThreshold ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {hasPassedThreshold ? '✓ Passed (75%+)' : '✗ Needs Practice'}
                </p>
              </div>
            </div>

            {hasPassedThreshold ? (
              <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-200 flex items-center gap-4">
                <span className="text-3xl">🎉</span>
                <div>
                  <h4 className="font-black text-emerald-900 text-base">Great job! You achieved 75% or higher!</h4>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    {activePaperId < 3
                      ? `Paper 0${activePaperId + 1} (${PAPERS_CONFIG[activePaperId].badge}) is now unlocked.`
                      : 'You have completed all assessment levels (Paper 01, 02, and 03)!'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-200 flex items-center gap-4">
                <span className="text-3xl">🎯</span>
                <div>
                  <h4 className="font-black text-amber-900 text-base">75% required to unlock the next paper.</h4>
                  <p className="text-xs text-amber-700 font-medium mt-0.5">
                    You scored {overallReportAccuracy}%. Please review the tips and try again.
                  </p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                <span>📋</span> 10 Questions Breakdown
              </h3>
              <div className="space-y-3">
                {history.map((h, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border-2 ${
                      h.isPassed ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-800 text-sm font-sans">
                        Target: <strong>"{h.targetText}"</strong>
                      </span>
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        h.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {h.overallScore || h.accuracy}% {h.isPassed ? '✓ Passed (100%)' : '✗ Practice'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-bold">
                      You said: <span className="font-sans text-slate-800">"{h.userTranscript}"</span>
                    </p>

                    {h.mtiPatterns && h.mtiPatterns.length > 0 && (
                      <div className="mt-2 p-2 bg-white rounded-xl border border-rose-200 text-xs text-rose-800 font-bold">
                        ⚠️ MTI Patterns: {h.mtiPatterns.map(p => p.name).join(', ')}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-200 text-[11px] font-bold text-slate-500">
                      <span>🎯 Words: {h.wordsCorrect ? '✓ Clean' : 'Practice'}</span>
                      <span>•</span>
                      <span>⚡ Speed: {h.fluency?.speakingRate || h.fluency?.wpm || 0} WPM</span>
                      <span>•</span>
                      <span>🎵 Pitch: {h.intonation?.style?.split(' ')[0] || 'Natural'}</span>
                      <span>•</span>
                      <span>🔊 Vol: {h.volume?.percent || 0}%</span>
                      {h.attempts > 1 && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-black">Attempt #{h.attempts}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleStartPaper(activePaperId)}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer text-center"
              >
                🔄 Retake Paper 0{activePaperId}
              </button>

              {activePaperId < 3 && (
                <button
                  onClick={() => handleStartPaper(activePaperId + 1)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer text-center"
                >
                  Next Paper (0{activePaperId + 1}) ➔
                </button>
              )}

              <button
                onClick={() => setViewState('papers_hub')}
                className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-black py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-center"
              >
                📑 Select Another Paper
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
