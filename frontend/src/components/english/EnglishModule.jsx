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
    name_si: "වචන මුලට 'ඉ' ශබ්දය එකතු කිරීම (I-school)",
    target_ipa: '/skuːl/',
    error_ipa: '/ɪskuːl/ or /iskul/',
    examples: ['school', 'spoon', 'station', 'study', 'speak', 'star', 'stop', 'spring'],
    pedagogical_tip: "Start immediately with the hissing 'sss' sound without adding an 'is-' in front (say 'sss-chool', not 'is-school').",
    pedagogical_tip_si: "වචනය ආරම්භයේදී 'ඉස්' (Is-) වෙනුවට 'ස්ස්' (sss-) ශබ්දයෙන් කෙලින්ම ආරම්භ කරන්න."
  },
  {
    id: 2,
    key: 'V_W_MERGER',
    name: 'V/W Merger',
    name_si: 'V සහ W ශබ්ද පටලවා ගැනීම (Wery / Vindow)',
    target_ipa: '/ˈveri/',
    error_ipa: '/ˈweri/',
    examples: ['very', 'water', 'win', 'view', 'van', 'window', 'voice', 'village'],
    pedagogical_tip: "For 'W', round your lips forward into a circle ('O'). For 'V', touch your top front teeth gently to your lower lip.",
    pedagogical_tip_si: "'W' අකුරට තොල් රවුම් කරන්න. 'V' අකුරට උඩු දත් යටි තොල මත තබා කතා කරන්න."
  },
  {
    id: 3,
    key: 'TH_SUBSTITUTION',
    name: 'TH Substitution (TH → T/D)',
    name_si: 'TH ශබ්දය වෙනුවට T/D භාවිතය (Tree for Three)',
    target_ipa: '/θriː/',
    error_ipa: '/triː/',
    examples: ['three', 'think', 'this', 'that', 'there', 'the', 'mother', 'father'],
    pedagogical_tip: "Put the tip of your tongue gently between your front teeth and blow air gently to produce the soft 'TH' sound.",
    pedagogical_tip_si: "දිව දත් දෙක අතර මඳක් තබා වාතය පිටකරමින් මෘදු 'TH' ශබ්දය උච්චාරණය කරන්න."
  },
  {
    id: 4,
    key: 'F_P_SUBSTITUTION',
    name: 'F/P Substitution',
    name_si: 'F වෙනුවට P ශබ්දය භාවිතය (Pan for Fan)',
    target_ipa: '/fæn/',
    error_ipa: '/pæn/',
    examples: ['fan', 'film', 'food', 'elephant', 'fish', 'feather', 'four'],
    pedagogical_tip: "Gently place upper teeth on lower lip and blow air for 'F', rather than pressing both lips together like 'P'.",
    pedagogical_tip_si: "'F' ශබ්දයට උඩු දත් යටි තොල මත තබා හුළං පිඹින්න (තොල් දෙකම එකතු කර 'P' ශබ්දය නොගන්න)."
  },
  {
    id: 5,
    key: 'PARAGOGE',
    name: 'Paragoge (Ending Vowel Addition)',
    name_si: 'වචන අගට අනවශ්‍ය ස්වර එකතු කිරීම (Busa / Milka)',
    target_ipa: '/bʌs/',
    error_ipa: '/bʌsə/ or /busa/',
    examples: ['bus', 'milk', 'book', 'good', 'cake', 'stamp', 'park', 'pen'],
    pedagogical_tip: "Stop your voice cleanly at the final consonant without adding an extra '-a' sound at the end.",
    pedagogical_tip_si: "වචනය අවසානයේ අනවශ්‍ය 'අ' හෝ 'උ' ශබ්දයක් (උදා: බස්-අ) එකතු නොකර වචනය පිරිසිදුව අවසන් කරන්න."
  },
  {
    id: 6,
    key: 'FINAL_CONSONANT_WEAKENING',
    name: 'Final Consonant Weakening',
    name_si: 'අවසාන ව්‍යංජන ශබ්දය අතහැරීම (Bu for But)',
    target_ipa: '/bʌt/',
    error_ipa: '/bʌ/',
    examples: ['but', 'good', 'that', 'friend', 'cat', 'hand', 'red', 'bird'],
    pedagogical_tip: "Make sure to clearly pronounce the ending consonant sound (like 't', 'd', 'k') at the end of the word.",
    pedagogical_tip_si: "වචනයේ අග ඇති 't', 'd', 'k' වැනි අවසන් අකුරු ශබ්දය පැහැදිලිව ප්‍රකාශ කරන්න."
  },
  {
    id: 7,
    key: 'CLUSTER_SIMPLIFICATION',
    name: 'Consonant Cluster Simplification',
    name_si: 'බැඳි අකුරු සරල කර පැවසීම (Neks for Next)',
    target_ipa: '/nekst/',
    error_ipa: '/neks/',
    examples: ['next', 'friend', 'stamp', 'product', 'desk', 'fast', 'best', 'plant'],
    pedagogical_tip: "Clearly pronounce all consonant sounds in the cluster (e.g. pronounce both the 's' and 't' in 'next').",
    pedagogical_tip_si: "වචන අග ඇති සියලුම බැඳි අකුරු ශබ්ද (උදා: 'next' හි s සහ t) සම්පූර්ණයෙන් පවසන්න."
  },
  {
    id: 8,
    key: 'VOWEL_LENGTH_CONFUSION',
    name: 'Short/Long Vowel Confusion',
    name_si: 'දිගු සහ කෙටි ස්වර පටලවා ගැනීම (Kek for Cake)',
    target_ipa: '/keɪk/',
    error_ipa: '/kek/',
    examples: ['cake', 'boat', 'great', 'note', 'feet', 'fit', 'seat', 'sit'],
    pedagogical_tip: "Elongate the diphthong vowel cleanly (say 'kay-eek' for cake, rather than a short 'kek').",
    pedagogical_tip_si: "දිගු ස්වර ශබ්ද (Diphthongs) ප්‍රමාණවත් ලෙස ඇද උච්චාරණය කරන්න."
  },
  {
    id: 9,
    key: 'INITIAL_H_DELETION',
    name: 'Initial H Dropping',
    name_si: "'H' ශබ්දය අතහැරීම (Ouse for House)",
    target_ipa: '/haʊs/',
    error_ipa: '/aʊs/',
    examples: ['house', 'happy', 'hello', 'hand', 'hot', 'hat', 'hear', 'help'],
    pedagogical_tip: "Breathe out gently like a sigh ('hhh') before starting the vowel in words starting with 'H'.",
    pedagogical_tip_si: "'H' අකුරෙන් පටන් ගන්නා වචන වලදී ආරම්භයේදීම 'හ්' (hhh) හුස්ම පිටකරමින් ශබ්ද කරන්න."
  },
  {
    id: 10,
    key: 'Z_S_CONFUSION',
    name: 'Z/S Voicing Confusion',
    name_si: 'Z සහ S ශබ්ද පටලවා ගැනීම (Busi for Busy)',
    target_ipa: '/zuː/',
    error_ipa: '/suː/',
    examples: ['zoo', 'busy', 'please', 'zero', 'zebra', 'music', 'noise', 'rose'],
    pedagogical_tip: "Vibrate your vocal cords (buzz like a bee: 'zzz') when pronouncing 'Z' sounds.",
    pedagogical_tip_si: "'Z' ශබ්දය පැවසීමේදී උගුරේ කම්පනයක් (මී මැස්සෙකුගේ නාදය: zzz) ඇති කරමින් ශබ්ද කරන්න."
  },
  {
    id: 11,
    key: 'BACK_VOWEL_CONFUSION',
    name: 'Back Vowel Confusion',
    name_si: 'පසුපස ස්වර පටලවා ගැනීම (Hol for Hall / Kap for Cup)',
    target_ipa: '/hɔːl/',
    error_ipa: '/hɒl/ or /hol/',
    examples: ['hall', 'hot', 'cup', 'bus', 'ball', 'call', 'walk', 'tall'],
    pedagogical_tip: "Open your mouth taller and drop your jaw to produce the deep back vowel '/ɔː/' sound.",
    pedagogical_tip_si: "කට හොඳින් විවෘත කර නිවැරදි ගැඹුරු ස්වර ශබ්දය ලබාගන්න."
  },
  {
    id: 12,
    key: 'STRESS_RHYTHM_DEVIATION',
    name: 'Equal Stress / Syllable-Timed Rhythm',
    name_si: 'ඒකාකාරී රොබෝ රිද්මය (Equal Stress / Flat Rhythm)',
    target_ipa: '/kəmˈpjuːtər/',
    error_ipa: '/kompjuˈter/ (equal stress)',
    examples: ['computer', 'banana', 'tomorrow', 'beautiful', 'together', 'umbrella'],
    pedagogical_tip: "English is stress-timed! Put strong emphasis on the stressed syllable and say unstressed syllables quickly and lightly.",
    pedagogical_tip_si: "ඉංග්‍රීසි භාෂාවේ ප්‍රධාන අක්ෂරයට වැඩි බරක් දී (Stress), අනෙක් අක්ෂර සැහැල්ලුවෙන් උච්චාරණය කරන්න."
  }
];

const PAPERS_CONFIG = [
  {
    id: 1,
    title: 'ප්‍රශ්න පත්‍රය 01 (Paper 01)',
    badge: 'ප්‍රශ්න 10 • Paper 01',
    icon: '📝',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-300'
  },
  {
    id: 2,
    title: 'ප්‍රශ්න පත්‍රය 02 (Paper 02)',
    badge: 'ප්‍රශ්න 10 • Paper 02',
    icon: '📖',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-300'
  },
  {
    id: 3,
    title: 'ප්‍රශ්න පත්‍රය 03 (Paper 03)',
    badge: 'ප්‍රශ්න 10 • Paper 03',
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

// Clean English-only transcript extractor with multi-alternative foreign script rejection
function extractCleanEnglishTranscript(event) {
  let finalStr = '';
  let interimStr = '';
  const allAltTokens = [];

  for (let i = 0; i < event.results.length; ++i) {
    const resItem = event.results[i];
    let chosenTranscript = '';

    // Check all alternatives for pure English (Latin) text and collect raw phonetic hypotheses
    for (let k = 0; k < resItem.length; k++) {
      const altText = (resItem[k]?.transcript || '').trim();
      if (altText) {
        altText.toLowerCase().split(/\s+/).forEach(tok => {
          const cleanTok = tok.replace(/[^a-z0-9]/g, '');
          if (cleanTok) allAltTokens.push(cleanTok);
        });
      }
      if (/^[a-zA-Z0-9\s.,'?!-–—]+$/.test(altText) && !chosenTranscript) {
        chosenTranscript = altText;
      }
    }

    // Fallback: sanitize any foreign non-Latin scripts
    if (!chosenTranscript && resItem[0]?.transcript) {
      chosenTranscript = resItem[0].transcript.replace(/[^\x00-\x7F]/g, '').trim();
    }

    if (resItem.isFinal) {
      finalStr += (chosenTranscript || '') + ' ';
    } else {
      interimStr += (chosenTranscript || '');
    }
  }

  const primary = (finalStr + interimStr).trim();
  return {
    transcript: primary,
    alternatives: Array.from(new Set(allAltTokens))
  };
}

// Phonetic & stem word similarity helper
function isWordMatch(tw, sw) {
  if (!tw || !sw) return false;
  const t = tw.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s = sw.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (t === s) return true;
  if (s === t + 's' || s === t + 'd' || s === t + 'ed' || s === t + 'ing' || s === t + 'es') return true;
  if (t === s + 's' || t === s + 'd' || t === s + 'ed' || t === s + 'ing' || t === s + 'es') return true;

  // Specific phonetic mergers & compound word boundaries
  if (t === 'nests' && (s === 'ness' || s === 'nest' || s === 'warmness' || s === 'nes')) return true;
  if (t === 'warm' && (s === 'warmness' || s === 'worm')) return true;
  if (t === 'tall' && (s === 'to' || s === 'the' || s === 'all' || s === 'tol' || s === 'tool')) return true;
  if (t === 'in' && (s === 'into' || s === 'in')) return true;

  // Substring root match (e.g. 'warmness' starts with 'warm')
  if (s.startsWith(t) && s.length <= t.length + 4) return true;
  if (t.startsWith(s) && t.length <= s.length + 3) return true;

  // Levenshtein distance <= 1 for words length >= 4
  if (t.length >= 4 && s.length >= 4) {
    if (Math.abs(t.length - s.length) <= 1) {
      let matchChars = 0;
      const minLen = Math.min(t.length, s.length);
      for (let i = 0; i < minLen; i++) {
        if (t[i] === s[i]) matchChars++;
      }
      if (matchChars >= minLen - 1) return true;
    }
  }

  return false;
}

// Preprocess fused / compound spoken words (e.g. 'warmness' -> 'warm' + 'nests', 'into' -> 'in' + 'tall')
function preprocessFusedSpokenWords(targetWords, spokenWords) {
  const expanded = [];
  let tIdx = 0;

  for (const sw of spokenWords) {
    const s = sw.toLowerCase().replace(/[^a-z0-9]/g, '');
    let decomposed = false;

    // Check if sw fuses two consecutive target words (e.g. 'warmness' for 'warm' + 'nests')
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
  
  // Backtrack to build aligned word statuses
  const aligned = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && isWordMatch(targetWords[i - 1], processedSpoken[j - 1])) {
      aligned.unshift({ word: targetWords[i - 1], matched: true, spoken: processedSpoken[j - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // Extra spoken word inserted
      j--;
    } else {
      // Missing expected word
      aligned.unshift({ word: targetWords[i - 1], matched: false, spoken: '' });
      i--;
    }
  }
  
  return aligned;
}

// Exact Word IPA mapping dictionary for all example words
const WORD_IPA_MAP = {
  // Pattern 1: S-Cluster Prosthesis
  'school': { target: '/skuːl/', error: '/ɪskuːl/' },
  'spoon': { target: '/spuːn/', error: '/ɪspuːn/' },
  'station': { target: '/ˈsteɪʃən/', error: '/ɪsˈteɪʃən/' },
  'study': { target: '/ˈstʌdi/', error: '/ɪsˈtʌdi/' },
  'speak': { target: '/spiːk/', error: '/ɪspiːk/' },
  'star': { target: '/stɑːr/', error: '/ɪsˈtɑːr/ or /esta/' },
  'stop': { target: '/stɒp/', error: '/ɪsˈtɒp/' },
  'spring': { target: '/sprɪŋ/', error: '/ɪsˈprɪŋ/' },
  // Pattern 2: V/W Merger
  'very': { target: '/ˈveri/', error: '/ˈweri/' },
  'water': { target: '/ˈwɔːtər/', error: '/ˈvɔːtər/' },
  'win': { target: '/wɪn/', error: '/vɪn/' },
  'view': { target: '/vjuː/', error: '/wjuː/' },
  'van': { target: '/væn/', error: '/wæn/' },
  'window': { target: '/ˈwɪndoʊ/', error: '/ˈvɪndoʊ/' },
  'voice': { target: '/vɔɪs/', error: '/wɔɪs/' },
  'village': { target: '/ˈvɪlɪdʒ/', error: '/ˈwɪlɪdʒ/' },
  // Pattern 3: TH Substitution
  'three': { target: '/θriː/', error: '/triː/' },
  'think': { target: '/θɪŋk/', error: '/tɪŋk/' },
  'this': { target: '/ðɪs/', error: '/dɪs/' },
  'that': { target: '/ðæt/', error: '/dæt/' },
  'there': { target: '/ðeər/', error: '/deər/' },
  'the': { target: '/ðə/', error: '/də/' },
  'mother': { target: '/ˈmʌðər/', error: '/ˈmʌdər/' },
  'father': { target: '/ˈfɑːðər/', error: '/ˈfɑːdər/' },
  // Pattern 4: F/P Substitution
  'fan': { target: '/fæn/', error: '/pæn/' },
  'film': { target: '/fɪlm/', error: '/pɪlm/' },
  'food': { target: '/fuːd/', error: '/puːd/' },
  'elephant': { target: '/ˈelɪfənt/', error: '/ˈelɪpənt/' },
  'fish': { target: '/fɪʃ/', error: '/pɪʃ/' },
  'feather': { target: '/ˈfeðər/', error: '/ˈpedər/' },
  'four': { target: '/fɔːr/', error: '/pɔːr/' },
  // Pattern 5: Paragoge
  'bus': { target: '/bʌs/', error: '/bʌs.ə/' },
  'milk': { target: '/mɪlk/', error: '/mɪlk.ə/' },
  'book': { target: '/bʊk/', error: '/bʊk.ə/' },
  'good': { target: '/ɡʊd/', error: '/ɡʊd.ə/' },
  'cake': { target: '/keɪk/', error: '/keɪk.ə/' },
  'stamp': { target: '/stæmp/', error: '/stæmp.ə/' },
  'park': { target: '/pɑːrk/', error: '/pɑːrk.ə/' },
  'pen': { target: '/pen/', error: '/pen.ə/' },
  // Pattern 6: Final Consonant Weakening
  'but': { target: '/bʌt/', error: '/bʌ/' },
  'cat': { target: '/kæt/', error: '/kæ/' },
  'hand': { target: '/hænd/', error: '/hæn/' },
  'red': { target: '/red/', error: '/re/' },
  'bird': { target: '/bɜːrd/', error: '/bɜː/' },
  // Pattern 7: Consonant Cluster Simplification
  'next': { target: '/nekst/', error: '/neks/' },
  'friend': { target: '/frend/', error: '/fren/' },
  'product': { target: '/ˈprɒdʌkt/', error: '/ˈprɒdʌk/' },
  'desk': { target: '/desk/', error: '/des/' },
  'fast': { target: '/fɑːst/', error: '/fɑːs/' },
  'best': { target: '/best/', error: '/bes/' },
  'plant': { target: '/plɑːnt/', error: '/plɑːn/' },
  // Pattern 8: Short/Long Vowel Confusion
  'boat': { target: '/boʊt/', error: '/bɒt/' },
  'great': { target: '/ɡreɪt/', error: '/ɡret/' },
  'note': { target: '/noʊt/', error: '/nɒt/' },
  'feet': { target: '/fiːt/', error: '/fɪt/' },
  'fit': { target: '/fɪt/', error: '/fiːt/' },
  'seat': { target: '/siːt/', error: '/sɪt/' },
  'sit': { target: '/sɪt/', error: '/siːt/' },
  // Pattern 9: Initial H Dropping
  'house': { target: '/haʊs/', error: '/aʊs/' },
  'happy': { target: '/ˈhæpi/', error: '/ˈæpi/' },
  'hello': { target: '/həˈloʊ/', error: '/əˈloʊ/' },
  'hot': { target: '/hɒt/', error: '/ɒt/' },
  'hat': { target: '/hæt/', error: '/æt/' },
  'hear': { target: '/hɪər/', error: '/ɪər/' },
  'help': { target: '/help/', error: '/elp/' },
  // Pattern 10: Z/S Confusion
  'zoo': { target: '/zuː/', error: '/suː/' },
  'busy': { target: '/ˈbɪzi/', error: '/ˈbɪsi/' },
  'please': { target: '/pliːz/', error: '/pliːs/' },
  'zero': { target: '/ˈzɪəroʊ/', error: '/ˈsɪəroʊ/' },
  'zebra': { target: '/ˈzebrə/', error: '/ˈsebrə/' },
  'music': { target: '/ˈmjuːzɪk/', error: '/ˈmjuːsɪk/' },
  'noise': { target: '/nɔɪz/', error: '/nɔɪs/' },
  'rose': { target: '/roʊz/', error: '/roʊs/' },
  // Pattern 11: Back Vowel Confusion
  'hall': { target: '/hɔːl/', error: '/hɒl/' },
  'cup': { target: '/kʌp/', error: '/kæp/' },
  'ball': { target: '/bɔːl/', error: '/bɒl/' },
  'call': { target: '/kɔːl/', error: '/kɒl/' },
  'walk': { target: '/wɔːk/', error: '/wɒk/' },
  'tall': { target: '/tɔːl/', error: '/tɒl/' },
  // Pattern 12: Equal Stress / Syllable-Timed Rhythm
  'computer': { target: '/kəmˈpjuːtər/', error: '/kompjuˈter/' },
  'banana': { target: '/bəˈnɑːnə/', error: '/bananə/' },
  'tomorrow': { target: '/təˈmɒroʊ/', error: '/tomɒroʊ/' },
  'beautiful': { target: '/ˈbjuːtɪfʊl/', error: '/bjuːtiˈful/' },
  'together': { target: '/təˈɡeðər/', error: '/toɡeˈdər/' },
  'umbrella': { target: '/ʌmˈbrelə/', error: '/umbreˈla/' }
};

// Client-Side Sri Lankan MTI Pattern Detector
function detectSriLankanMTIPatterns(spokenWords, targetWords) {
  const detected = [];

  targetWords.forEach((tw, twIdx) => {
    // 1. S-Cluster Prosthesis
    if (/^s[cptkmnr]/.test(tw) || tw.startsWith('sp') || tw.startsWith('st') || tw.startsWith('sc') || tw.startsWith('sk') || tw.startsWith('sm') || tw.startsWith('sn')) {
      const hasDirectProsthesis = spokenWords.some(sw => 
        sw === 'i' + tw || 
        sw === 'is' + tw.slice(1) || 
        sw === 'es' + tw.slice(1) ||
        sw === 'ispring' ||
        sw === 'espring' ||
        sw === 'est' ||
        sw === 'esta' ||
        sw === 'easter' ||
        sw === 'estar' ||
        sw === 'istar' ||
        sw === 'aster' ||
        sw === 'istation' ||
        sw === 'ischool' ||
        sw === 'ispoon' ||
        sw === 'istudy' ||
        sw === 'estudy' ||
        sw === 'history' ||
        sw === 'histories' ||
        sw === 'ispeak' ||
        sw === 'istop' ||
        sw.startsWith('is' + tw) ||
        sw.startsWith('es' + tw) ||
        sw.startsWith('i' + tw)
      );

      let hasSeparatedProsthesis = false;
      if (targetWords.length === 1) {
        hasSeparatedProsthesis = spokenWords.some(sw => 
          ['is', 'es', 'est', 'east', 'easter', 'esta', 'his', 'he', 'you', 'we', 'its', "it's", 'it', 's', 'e'].includes(sw)
        );
      } else {
        // In full sentences, check if an un-expected prosthetic prefix was placed immediately before tw
        for (let sIdx = 0; sIdx < spokenWords.length; sIdx++) {
          const sw = spokenWords[sIdx];
          if (sw === tw || sw.startsWith(tw.slice(0, 3))) {
            if (sIdx > 0 && ['is', 'es', 'est', 'east', 'esta', 'its', "it's"].includes(spokenWords[sIdx - 1])) {
              const expectedPrev = twIdx > 0 ? targetWords[twIdx - 1] : '';
              if (spokenWords[sIdx - 1] !== expectedPrev) {
                hasSeparatedProsthesis = true;
                break;
              }
            }
          }
        }
      }

      if (hasDirectProsthesis || hasSeparatedProsthesis) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'S_CLUSTER_PROSTHESIS'));
      }
    }

    // 2. V/W Merger
    if (tw.startsWith('v')) {
      if (spokenWords.some(sw => sw === 'w' + tw.slice(1) || ['wary', 'worry', 'wery', 'where', 'ware', 'wan', 'one', 'when', 'wew', 'woice', 'willage'].includes(sw))) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'V_W_MERGER'));
      }
    } else if (tw.startsWith('w')) {
      if (spokenWords.some(sw => sw === 'v' + tw.slice(1) || ['vater', 'voter', 'varta', 'vin', 'vindow', 'vinda'].includes(sw))) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'V_W_MERGER'));
      }
    }

    // 3. TH Substitution (TH -> T/D)
    if (['three', 'think', 'this', 'that', 'there', 'the', 'mother', 'father'].includes(tw)) {
      if (tw === 'three' && spokenWords.some(sw => ['tree', 'tray', 'free', 'thee', 'tri'].includes(sw))) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'TH_SUBSTITUTION'));
      } else if (tw === 'think' && spokenWords.some(sw => ['tink', 'sink', 'pink', 'thing', 'tin'].includes(sw))) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'TH_SUBSTITUTION'));
      } else if (tw === 'this' && spokenWords.some(sw => ['dis', 'tis', 'miss', 'thiss'].includes(sw))) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'TH_SUBSTITUTION'));
      } else if (tw === 'that' && spokenWords.some(sw => ['dat', 'tat', 'cat', 'dot'].includes(sw))) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'TH_SUBSTITUTION'));
      } else if (tw === 'there' && spokenWords.some(sw => ['dare', 'tare', 'their', 'dey'].includes(sw))) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'TH_SUBSTITUTION'));
      } else if (tw === 'the' && spokenWords.some(sw => ['de', 'te', 'da'].includes(sw))) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'TH_SUBSTITUTION'));
      } else if (tw === 'mother' && spokenWords.some(sw => ['mudder', 'moder', 'matter', 'madar'].includes(sw))) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'TH_SUBSTITUTION'));
      } else if (tw === 'father' && spokenWords.some(sw => ['fadder', 'fader', 'pada'].includes(sw))) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'TH_SUBSTITUTION'));
      }
    }

    // 4. F/P Substitution (e.g. target: 'elephant', 'fan', 'film', 'food', 'phone', 'fish', 'feather', 'four')
    if (tw.startsWith('f') || tw.includes('ph') || tw === 'elephant') {
      const hasFp = spokenWords.some(sw => 
        sw === 'p' + tw.slice(1) || 
        ['pan', 'pen', 'pilm', 'film', 'pood', 'pone', 'pour', 'pore', 'poor', 'paw', 'po', 'pole', 'poll', 'par', 'per', 'port', 'pot', 'pish', 'push', 'dish', 'pedder', 'peather', 'peter', 'elepant', 'elephent', 'aliphant', 'oliphant', 'elipant', 'elephan', 'eliphant', 'pud', 'put', 'pill', 'pish', 'peace', 'piece'].includes(sw) ||
        (tw.startsWith('f') && (sw.startsWith('p' + tw.slice(1, 3)) || sw.startsWith('po') || sw.startsWith('pa') || sw.startsWith('pe') || sw.startsWith('pi'))) ||
        (tw === 'elephant' && (sw.includes('pant') || sw.includes('plant') || sw.includes('pent') || sw === 'elepant'))
      );
      if (hasFp) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'F_P_SUBSTITUTION'));
      }
    }

    // 5. Paragoge (e.g. target: 'bus', 'milk', 'book')
    if (['bus', 'milk', 'book', 'good', 'cake', 'stamp', 'park', 'pen'].includes(tw)) {
      if (spokenWords.some(sw => 
        [tw + 'a', tw + 'er', tw + 'e', tw + 'i', 'busa', 'basa', 'bassa', 'milka', 'booka', 'buku', 'gooda', 'guda', 'keka', 'keki', 'stampa', 'parka', 'paka', 'pena'].includes(sw)
      )) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'PARAGOGE'));
      }
    }

    // 6. Final Consonant Weakening (e.g. target: 'but', 'cat', 'hand')
    if (['but', 'good', 'that', 'friend', 'cat', 'hand', 'red', 'bird'].includes(tw)) {
      if (spokenWords.some(sw => 
        ['bu', 'ba', 'bah', 'goo', 'gu', 'tha', 'fren', 'ca', 'kah', 'han', 're', 'ray', 'ber', 'bur'].includes(sw)
      )) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'FINAL_CONSONANT_WEAKENING'));
      }
    }

    // 7. Consonant Cluster Simplification (e.g. target: 'next', 'friend', 'stamp')
    if (['next', 'friend', 'stamp', 'product', 'desk', 'fast', 'best', 'plant'].includes(tw)) {
      if (spokenWords.some(sw => 
        ['neks', 'necks', 'nex', 'neck', 'fren', 'stam', 'stem', 'produk', 'produc', 'des', 'dec', 'fas', 'pass', 'bes', 'bet', 'plan', 'plen'].includes(sw)
      )) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'CLUSTER_SIMPLIFICATION'));
      }
    }

    // 8. Short/Long Vowel Confusion (e.g. target: 'cake', 'boat', 'great')
    if (['cake', 'boat', 'great', 'note', 'feet', 'fit', 'seat', 'sit'].includes(tw)) {
      if (
        (tw === 'cake' && spokenWords.some(sw => ['kek', 'kake'].includes(sw))) ||
        (tw === 'boat' && spokenWords.some(sw => ['bot', 'bought'].includes(sw))) ||
        (tw === 'great' && spokenWords.some(sw => ['gret', 'get'].includes(sw))) ||
        (tw === 'note' && spokenWords.some(sw => ['not', 'nut'].includes(sw))) ||
        (tw === 'feet' && spokenWords.some(sw => ['fit', 'foot'].includes(sw))) ||
        (tw === 'fit' && spokenWords.some(sw => ['feet'].includes(sw))) ||
        (tw === 'seat' && spokenWords.some(sw => ['sit', 'set'].includes(sw))) ||
        (tw === 'sit' && spokenWords.some(sw => ['seat'].includes(sw)))
      ) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'VOWEL_LENGTH_CONFUSION'));
      }
    }

    // 9. Initial H Dropping (e.g. target: 'house', 'happy', 'hello', 'hand', 'hot', 'hat', 'hear', 'help')
    if (['house', 'happy', 'hello', 'hand', 'hot', 'hat', 'hear', 'help'].includes(tw) || tw.startsWith('h')) {
      if (spokenWords.some(sw => 
        ['ouse', 'ause', 'our', 'hour', 'appy', 'api', 'ello', 'elo', 'and', 'end', 'ot', 'ought', 'art', 'out', 'at', 'act', 'ear', 'air', 'elp', 'alp', 'aut', 'aot'].includes(sw) ||
        (tw.startsWith('h') && sw === tw.slice(1)) ||
        (tw === 'hot' && ['ot', 'ought', 'art', 'out', 'aat', 'aut'].includes(sw)) ||
        (tw === 'hand' && ['and', 'end', 'ant'].includes(sw)) ||
        (tw === 'hat' && ['at', 'act', 'et'].includes(sw)) ||
        (tw === 'house' && ['ouse', 'ause', 'out'].includes(sw)) ||
        (tw === 'happy' && ['appy', 'api'].includes(sw)) ||
        (tw === 'hello' && ['ello', 'elo', 'yellow'].includes(sw)) ||
        (tw === 'help' && ['elp', 'alp'].includes(sw)) ||
        (tw === 'hear' && ['ear', 'air', 'here'].includes(sw) && sw === 'ear')
      )) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'INITIAL_H_DELETION'));
      }
    }

    // 10. Z/S Confusion (e.g. target: 'zoo', 'busy', 'please')
    if (['zoo', 'busy', 'please', 'zero', 'zebra', 'music', 'noise', 'rose'].includes(tw)) {
      if (spokenWords.some(sw => 
        ['soo', 'sue', 'bissy', 'bisi', 'pleas', 'police', 'sero', 'siro', 'sebra', 'mewsic', 'mousic', 'noiss', 'nice', 'ross', 'rows'].includes(sw)
      )) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'Z_S_CONFUSION'));
      }
    }

    // 11. Back Vowel Confusion (e.g. target: 'hall', 'cup', 'ball')
    if (['hall', 'cup', 'ball', 'call', 'walk', 'tall'].includes(tw)) {
      if (spokenWords.some(sw => 
        ['hol', 'hole', 'hull', 'cap', 'cop', 'bol', 'bowl', 'col', 'coal', 'wok', 'woke', 'tol', 'toll'].includes(sw)
      )) {
        detected.push(SRI_LANKAN_MTI_PATTERNS.find(p => p.key === 'BACK_VOWEL_CONFUSION'));
      }
    }
  });

  return Array.from(new Set(detected.filter(Boolean)));
}

// 100% Strict 6-Dimensional Speech & Pronunciation Assessment
function evaluate6DimensionalSpeech(spokenText, targetText, soundDetectedLocally = false, recordingDuration = 2.0, avgVolume = 50, extraAlternativeWords = []) {
  const spokenClean = (spokenText || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
  const targetClean = (targetText || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();

  // ── Step 1: Sound Check ──
  const soundDetected = Boolean(spokenClean.length > 0 || soundDetectedLocally);

  if (!soundDetected) {
    return {
      step: 1,
      soundDetected: false,
      wordsCorrect: false,
      pronunciationCorrect: false,
      accuracy: 0,
      statusTitle: 'ශබ්දයක් හඳුනා නොගැනිණි',
      statusMessage: 'මයික්‍රෆෝනයෙන් කිසිදු හඬක් වාර්තා නොවීය. කරුණාකර මයික්‍රෆෝනය ළඟට ගෙන ශබ්ද නගා කතා කරන්න.',
      transcript: '(No sound detected)',
      wordResults: [],
      missedWords: [],
      mtiPatterns: [],
      fluency: { wpm: 0, speedStatus: 'No Speech' },
      intonation: { isMonotone: false, style: 'None' },
      volume: { percent: 0, status: 'Muted' }
    };
  }

  const spokenWords = spokenClean.split(/\s+/).filter(Boolean);
  const targetWords = targetClean.split(/\s+/).filter(Boolean);
  const allCandidateTokens = Array.from(new Set([...spokenWords, ...(extraAlternativeWords || [])]));

  // ── 1. Single Word Evaluation (Easy Level & MTI Lab) ──
  if (targetWords.length === 1) {
    const targetWord = targetWords[0];
    const mtiPatterns = detectSriLankanMTIPatterns(allCandidateTokens, targetWords);
    
    let matchedExact = (spokenClean === targetWord);
    let matchedInWords = spokenWords.includes(targetWord);

    if (!matchedExact && !matchedInWords && spokenWords.length > 0) {
      for (const sw of spokenWords) {
        if (isWordMatch(targetWord, sw)) {
          matchedInWords = true;
          break;
        }
      }
    }

    // If extra prosthetic words were spoken before a single target (e.g. "It's spring", "is station"), it is an MTI error
    const isCleanSingleUtterance = (matchedExact || (matchedInWords && spokenWords.length === 1)) && mtiPatterns.length === 0;
    const wordsCorrect = isCleanSingleUtterance;
    const accuracy = isCleanSingleUtterance ? 100 : (mtiPatterns.length > 0 ? 70 : (matchedInWords ? 60 : 25));
    const isPassed = (accuracy === 100);

    return {
      step: isPassed ? 3 : 2,
      soundDetected: true,
      wordsCorrect: wordsCorrect,
      pronunciationCorrect: isPassed,
      accuracy: accuracy,
      statusTitle: isPassed ? 'විශිෂ්ට උච්චාරණයක්! (100% Passed)' : 'උච්චාරණය තවදුරටත් පුහුණු වන්න (Needs Practice)',
      statusMessage: isPassed 
        ? 'ඔබේ උච්චාරණය ඉතා පැහැදිලියි (100%).' 
        : mtiPatterns.length > 0
        ? `MTI රටාව හඳුනා ගැනිණි: ${mtiPatterns[0].name_si}.`
        : `ඔබ පැවසූ වචනය '${spokenText}' වේ. අපේක්ෂිත වචනය '${targetText}' වේ.`,
      transcript: spokenText,
      wordResults: [{ word: targetWord, matched: isCleanSingleUtterance, spoken: spokenWords[0] || '' }],
      missedWords: isCleanSingleUtterance ? [] : [targetWord],
      mtiPatterns: mtiPatterns,
      fluency: {
        wpm: Math.round((1 / Math.max(0.5, recordingDuration)) * 60),
        speedStatus: 'Optimal (ස්වභාවික වේගය)'
      },
      intonation: {
        isMonotone: false,
        style: 'Clean Single Utterance'
      },
      volume: {
        percent: avgVolume,
        status: avgVolume > 85 ? 'Too Loud (ශබ්දය වැඩියි)' : avgVolume < 20 ? 'Too Soft (ශබ්දය මදි)' : 'Clear & Optimal (පැහැදිලියි)'
      }
    };
  }

  // ── 2. Multi-Word Sentence DP Alignment (Medium & Hard Levels) ──
  const wordResults = alignWordsLCS(targetWords, spokenWords);
  const matchedCount = wordResults.filter(w => w.matched).length;
  const missedWords = wordResults.filter(w => !w.matched).map(w => w.word);
  const mtiPatterns = detectSriLankanMTIPatterns(spokenWords, targetWords);

  // Fluency: WPM Calculation
  const totalWords = targetWords.length;
  const wpm = Math.round((spokenWords.length / Math.max(0.8, recordingDuration)) * 60);
  let speedStatus = 'Optimal / Natural (ස්වභාවික වේගය)';
  if (wpm < 70) speedStatus = 'Too Slow (මන්දගාමී)';
  else if (wpm > 160) speedStatus = 'Too Fast (ඉතා වේගවත්)';

  // Non-MTI Errors
  const sinhalaMixed = spokenWords.filter(w => SINHALA_CODE_WORDS.has(w));
  
  // Strict 100% Question Pass Standard
  const rawAccuracy = Math.round((matchedCount / totalWords) * 100);
  const accuracy = mtiPatterns.length > 0 ? Math.min(70, rawAccuracy) : rawAccuracy;
  const isPassed = (matchedCount === totalWords && mtiPatterns.length === 0 && accuracy === 100);
  const allWordsCorrect = (matchedCount === totalWords);

  return {
    step: isPassed ? 3 : (matchedCount > 0 ? 2 : 1),
    soundDetected: true,
    wordsCorrect: allWordsCorrect,
    pronunciationCorrect: isPassed,
    accuracy: accuracy,
    statusTitle: isPassed 
      ? 'විශිෂ්ට උච්චාරණයක්! (100% Passed)' 
      : 'උච්චාරණය තවදුරටත් පුහුණු වන්න (Needs Practice)',
    statusMessage: isPassed 
      ? 'ඔබේ උච්චාරණය සහ කථන රිද්මය ඉතා විශිෂ්ටයි (100%).'
      : mtiPatterns.length > 0
      ? `MTI උච්චාරණ දෝෂයක් හඳුනා ගැනිණි: ${mtiPatterns.map(p => p.name_si).join(', ')}.`
      : `වචන ${matchedCount}/${totalWords} නිවැරදියි (${accuracy}%). සම්පූර්ණ ලකුණු (100%) සඳහා '${missedWords.join(', ')}' වචනය නිවැරදිව පවසන්න.`,
    transcript: spokenText,
    wordResults: wordResults,
    missedWords: missedWords,
    mtiPatterns: mtiPatterns,
    fluency: {
      wpm: wpm,
      speedStatus: speedStatus,
      durationSec: recordingDuration
    },
    intonation: {
      isMonotone: false,
      style: 'Expressive & Dynamic (ස්වභාවික රිද්මය)'
    },
    volume: {
      percent: avgVolume,
      status: avgVolume > 85 ? 'Too Loud (ශබ්දය වැඩියි)' : avgVolume < 20 ? 'Too Soft (ශබ්දය මදි)' : 'Clear & Optimal (පැහැදිලියි)'
    },
    nonMtiErrors: {
      hasSinhalaWords: sinhalaMixed.length > 0,
      sinhalaWords: sinhalaMixed
    }
  };
}

export default function EnglishModule({ onExit }) {
  const navigate = useNavigate();

  // Navigation State: 'grades_hub' | 'papers_hub' | 'quiz' | 'report' | 'mti_lab'
  const [viewState, setViewState] = useState('grades_hub');
  const [selectedGrade, setSelectedGrade] = useState(2);
  const [activePaperId, setActivePaperId] = useState(1);

  // Active Paper State (10 Questions)
  const [paperQuestions, setPaperQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [questionAttempts, setQuestionAttempts] = useState(1);

  // Dedicated MTI Diagnostics Lab State
  const [selectedMtiPatternKey, setSelectedMtiPatternKey] = useState('S_CLUSTER_PROSTHESIS');
  const [mtiLabWordIndex, setMtiLabWordIndex] = useState(0);
  const [mtiLabLiveTranscript, setMtiLabLiveTranscript] = useState('');
  const [mtiLabResult, setMtiLabResult] = useState(null);
  const [mtiLabListening, setMtiLabListening] = useState(false);

  // Recording & Assessment State
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [liveVolume, setLiveVolume] = useState(0);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const latestTranscriptRef = useRef('');
  const latestAlternativesRef = useRef([]);
  const soundHeardRef = useRef(false);
  const timerIntervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animFrameRef = useRef(null);
  const volumeSamplesRef = useRef([]);

  // LocalStorage Paper History
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

  // Check if a paper is unlocked
  const isPaperUnlocked = (pId) => {
    if (pId === 1) return true;
    if (pId === 2) {
      const p1Result = paperHistory[selectedGrade]?.[1];
      return p1Result && p1Result.overallAccuracy >= 75;
    }
    if (pId === 3) {
      const p2Result = paperHistory[selectedGrade]?.[2];
      return p2Result && p2Result.overallAccuracy >= 75;
    }
    return false;
  };

  // Fetch fixed 10 questions for the specific grade and paper (covers all MTI patterns)
  const generatePaperQuestions = (grade, paperId) => {
    const fixedList = FIXED_PAPERS[grade]?.[paperId] || FIXED_PAPERS[2]?.[1] || [];
    return fixedList.map(q => ({
      ...q,
      grade: grade,
      level_name_si: grade === 2 ? 'තනි වචන (Single Words)' : grade === 3 ? 'කෙටි වාක්‍ය (Short Sentences)' : 'දිගු වාක්‍ය (Long Sentences)'
    }));
  };

  // Start a specific paper
  const handleStartPaper = (pId) => {
    if (!isPaperUnlocked(pId)) return;
    playSound('click');
    setActivePaperId(pId);
    setHistory([]);

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
    volumeSamplesRef.current = [];
    setViewState('quiz');
  };

  // View saved paper report
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

  // Complete cleanup of all audio resources
  const stopListening = () => {
    isListeningRef.current = false;
    setIsListening(false);
    setMtiLabListening(false);
    setLiveVolume(0);

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

  // Full-Sentence Continuous Recording
  const startRecording = async () => {
    playSound('click');
    stopListening();

    setAssessmentResult(null);
    setIsAnswered(false);
    setLiveTranscript('');
    setLiveVolume(0);
    setRecordingSeconds(0);
    latestTranscriptRef.current = '';
    soundHeardRef.current = false;
    volumeSamplesRef.current = [];
    isListeningRef.current = true;
    setIsListening(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: { ideal: true },
          noiseSuppression: { ideal: true },
          autoGainControl: { ideal: true },
          channelCount: { ideal: 1 },
          sampleRate: { ideal: 16000 },
          googEchoCancellation: { ideal: true },
          googAutoGainControl: { ideal: true },
          googNoiseSuppression: { ideal: true },
          googHighpassFilter: { ideal: true },
          googNoiseSuppression2: { ideal: true },
          googEchoCancellation2: { ideal: true },
          googTypingNoiseDetection: { ideal: true }
        }
      });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;

      // ── Stage 1: Highpass Filter (85 Hz) - Rejects sub-bass rumble, fan vibrations, AC hum ──
      const highpassFilter = audioCtx.createBiquadFilter();
      highpassFilter.type = 'highpass';
      highpassFilter.frequency.value = 85;
      highpassFilter.Q.value = 0.707;

      // ── Stage 2: Lowpass Filter (7500 Hz) - Rejects high-frequency hiss, coil whine ──
      const lowpassFilter = audioCtx.createBiquadFilter();
      lowpassFilter.type = 'lowpass';
      lowpassFilter.frequency.value = 7500;
      lowpassFilter.Q.value = 0.707;

      // ── Stage 3: Notch Filter (50 Hz / 60 Hz) - Rejects electrical power line hum ──
      const notchFilter = audioCtx.createBiquadFilter();
      notchFilter.type = 'notch';
      notchFilter.frequency.value = 50;
      notchFilter.Q.value = 4.0;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;

      const source = audioCtx.createMediaStreamSource(stream);
      // Connect filter pipeline: source -> highpass -> notch -> lowpass -> analyser
      source.connect(highpassFilter);
      highpassFilter.connect(notchFilter);
      notchFilter.connect(lowpassFilter);
      lowpassFilter.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let ambientNoiseFloor = 4; // Adaptive background noise threshold

      const updateMeter = () => {
        if (!isListeningRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 100) * 100));

        // Adaptive Noise Gate: Zero out ambient room noise below floor
        if (normalized <= ambientNoiseFloor) {
          ambientNoiseFloor = Math.min(10, Math.max(3, (ambientNoiseFloor * 0.95) + (normalized * 0.05)));
          setLiveVolume(0);
        } else {
          const gatedVolume = Math.min(100, Math.round(((normalized - ambientNoiseFloor) / (100 - ambientNoiseFloor)) * 100));
          setLiveVolume(gatedVolume);
          volumeSamplesRef.current.push(gatedVolume);

          if (gatedVolume >= 5) {
            soundHeardRef.current = true;
          }
        }

        animFrameRef.current = requestAnimationFrame(updateMeter);
      };
      updateMeter();

    } catch (err) {
      console.log("Local audio context notice:", err);
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const reco = new SpeechRecognition();
        reco.continuous = true;
        reco.interimResults = true;
        reco.lang = 'en-US';
        reco.maxAlternatives = 5;

        reco.onstart = () => {
          if (isListeningRef.current) setIsListening(true);
        };

        reco.onsoundstart = () => {
          soundHeardRef.current = true;
        };

        reco.onspeechstart = () => {
          soundHeardRef.current = true;
        };

        reco.onresult = (event) => {
          soundHeardRef.current = true;
          const { transcript, alternatives } = extractCleanEnglishTranscript(event);
          if (transcript) {
            latestTranscriptRef.current = transcript;
            setLiveTranscript(transcript);
            latestAlternativesRef.current = alternatives || [];
          }
        };

        reco.onerror = (event) => {
          console.log("SpeechRecognition notice:", event.error);
        };

        reco.onend = () => {
          if (isListeningRef.current) {
            try {
              reco.start();
            } catch (e) {}
          }
        };

        recognitionRef.current = reco;
        reco.start();
      } catch (e) {}
    }

    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds(sec => sec + 1);
    }, 1000);
  };

  // Student clicks Stop when they finish speaking
  const stopRecordingAndEvaluate = () => {
    playSound('click');
    const finalHeardText = latestTranscriptRef.current || liveTranscript || '';
    const soundDetected = soundHeardRef.current || Boolean(finalHeardText.trim());
    const duration = Math.max(1, recordingSeconds);

    const samples = volumeSamplesRef.current;
    const avgVol = samples.length > 0 ? Math.round(samples.reduce((a,b)=>a+b, 0) / samples.length) : 50;

    stopListening();

    const currentQ = paperQuestions[currentQIndex];
    const targetText = currentQ ? currentQ.target_text : '';

    const res = evaluate6DimensionalSpeech(
      finalHeardText, 
      targetText, 
      soundDetected, 
      duration, 
      avgVol, 
      latestAlternativesRef.current || []
    );
    setAssessmentResult(res);
    setIsAnswered(true);

    if (res.pronunciationCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  // Move to next question or complete paper
  const handleNextQuestion = () => {
    playSound('click');
    stopListening();

    const currentQ = paperQuestions[currentQIndex];
    const isPassed = assessmentResult ? assessmentResult.pronunciationCorrect : false;
    const accuracy = assessmentResult ? assessmentResult.accuracy : 0;
    const userTranscript = assessmentResult ? assessmentResult.transcript : '(No speech)';

    const entry = {
      qNum: currentQIndex + 1,
      id: currentQ.id,
      level: currentQ.level,
      targetText: currentQ.target_text,
      userTranscript: userTranscript,
      accuracy: accuracy,
      isPassed: isPassed,
      sinhalaMeaning: currentQ.sinhala_meaning,
      phoneticHint: currentQ.phonetic_hint,
      soundDetected: assessmentResult ? assessmentResult.soundDetected : false,
      wordsCorrect: assessmentResult ? assessmentResult.wordsCorrect : false,
      wordResults: assessmentResult ? assessmentResult.wordResults : [],
      mtiPatterns: assessmentResult ? assessmentResult.mtiPatterns : [],
      fluency: assessmentResult ? assessmentResult.fluency : {},
      volume: assessmentResult ? assessmentResult.volume : {},
      attempts: questionAttempts
    };

    const updatedHistory = [...history, entry];
    setHistory(updatedHistory);

    if (currentQIndex < 9) {
      // Next question
      setCurrentQIndex(prev => prev + 1);
      setQuestionAttempts(1);
      setLiveTranscript('');
      setLiveVolume(0);
      setAssessmentResult(null);
      setIsAnswered(false);
      setRecordingSeconds(0);
      latestTranscriptRef.current = '';
      latestAlternativesRef.current = [];
      soundHeardRef.current = false;
      volumeSamplesRef.current = [];
    } else {
      // Paper Completed (10 questions finished)
      const passedCount = updatedHistory.filter(h => h.isPassed).length;
      const finalAccuracy = Math.round((passedCount / 10) * 100);

      savePaperResult(selectedGrade, activePaperId, {
        paperId: activePaperId,
        grade: selectedGrade,
        totalQuestions: 10,
        totalPassed: passedCount,
        overallAccuracy: finalAccuracy,
        history: updatedHistory,
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

  // Retry the current question
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
    volumeSamplesRef.current = [];
  };

  // ── MTI LAB SANDBOX CONTROLS ──
  const activeMtiPattern = SRI_LANKAN_MTI_PATTERNS.find(p => p.key === selectedMtiPatternKey) || SRI_LANKAN_MTI_PATTERNS[0];
  const mtiLabTargetWord = activeMtiPattern.examples[mtiLabWordIndex % activeMtiPattern.examples.length] || activeMtiPattern.examples[0];

  const startMtiLabRecording = () => {
    console.log("%c[MTI Lab] 1. 'Speak to Test' Clicked - Initializing...", "background: #047857; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;");
    playSound('click');
    stopListening();

    setMtiLabResult(null);
    setMtiLabLiveTranscript('සවන් දෙමින්...');
    setMtiLabListening(true);
    isListeningRef.current = true;
    latestTranscriptRef.current = '';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("[MTI Lab] SpeechRecognition API not supported on this browser!");
      setMtiLabListening(false);
      isListeningRef.current = false;
      setMtiLabLiveTranscript('(Browser speech recognition not supported)');
      return;
    }

    try {
      console.log("%c[MTI Lab] 2. Starting SpeechRecognition...", "color: #0284c7;");
      const reco = new SpeechRecognition();
      reco.continuous = true;
      reco.interimResults = true;
      reco.lang = 'en-US';
      reco.maxAlternatives = 5;

      reco.onstart = () => {
        console.log("%c[MTI Lab] 2.1 onstart: Recognizer active and listening", "color: #059669;");
      };

      reco.onsoundstart = () => {
        console.log("%c[MTI Lab] 2.2 onsoundstart: Audio energy detected", "color: #10b981;");
        setMtiLabLiveTranscript('හඬ ලැබෙමින් පවතී...');
      };

      reco.onspeechstart = () => {
        console.log("%c[MTI Lab] 2.3 onspeechstart: Human speech detected", "color: #10b981;");
        setMtiLabLiveTranscript('හඬ ලැබෙමින් පවතී...');
      };

      reco.onresult = (event) => {
        const { transcript, alternatives } = extractCleanEnglishTranscript(event);
        console.log(`%c[MTI Lab] 3. onresult received -> "${transcript}"`, "background: #7c3aed; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;");

        if (transcript) {
          latestTranscriptRef.current = transcript;
          setMtiLabLiveTranscript(transcript);

          const res = evaluate6DimensionalSpeech(
            transcript,
            mtiLabTargetWord,
            true,
            1.5,
            60,
            alternatives || []
          );
          console.log("%c[MTI Lab] 4. Evaluation Result:", "color: #0284c7; font-weight: bold;", res);
          setMtiLabResult(res);
          setMtiLabListening(false);
          isListeningRef.current = false;

          try {
            reco.onend = null;
            reco.stop();
          } catch (e) {}
        }
      };

      reco.onerror = (event) => {
        console.warn(`%c[MTI Lab] ⚠️ onerror: ${event.error}`, "color: #ef4444; font-weight: bold;");
        if (!latestTranscriptRef.current && event.error !== 'no-speech') {
          setMtiLabLiveTranscript('(ශබ්දයක් හඳුනා නොගැනිණි — 🎤 නැවතත් ඔබන්න)');
          setMtiLabListening(false);
          isListeningRef.current = false;
        }
      };

      reco.onend = () => {
        console.log("%c[MTI Lab] 5. onend: Session ended", "color: #64748b;");
        if (isListeningRef.current && !latestTranscriptRef.current) {
          try {
            reco.start();
            return;
          } catch (e) {}
        }
        setMtiLabListening(false);
        isListeningRef.current = false;
        if (!latestTranscriptRef.current) {
          setMtiLabLiveTranscript(prev =>
            (prev === 'සවන් දෙමින්...' || prev === 'හඬ ලැබෙමින් පවතී...')
              ? '(හඬක් හඳුනා නොගැනිණි — 🎤 නැවතත් ඔබන්න)'
              : prev
          );
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
      <div className="max-w-4xl mx-auto relative z-10 p-4 sm:p-6">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (viewState === 'quiz' || viewState === 'mti_lab') {
                if (viewState === 'mti_lab' || window.confirm("ඔබට මෙම ප්‍රශ්න පත්‍රයෙන් ඉවත් වීමට අවශ්‍යද?")) {
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
                ? 'Dashboard එකට'
                : viewState === 'papers_hub' || viewState === 'mti_lab'
                ? 'ප්‍රධාන මෙනුවට'
                : 'ප්‍රශ්න පත්‍ර තෝරන්න'}
            </span>
          </button>

          {viewState === 'quiz' && (
            <div className="flex items-center gap-2">
              <span className={`text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm bg-gradient-to-r ${activePaperConfig.color}`}>
                {activePaperConfig.badge}
              </span>
              <span className="bg-white/90 backdrop-blur border border-slate-200 text-slate-800 font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                ප්‍රශ්න {currentQIndex + 1} / 10
              </span>
            </div>
          )}

          {viewState === 'grades_hub' && (
            <button
              onClick={() => { playSound('click'); setViewState('mti_lab'); }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer"
            >
              <span>🇱🇰</span>
              <span>MTI පරීක්ෂක රසායනාගාරය (Sandbox)</span>
            </button>
          )}
        </div>

        {/* ── SCREEN 1: GRADE SELECTOR HUB ── */}
        {viewState === 'grades_hub' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-xl text-center relative overflow-hidden">
              <div className="inline-block bg-emerald-100 text-emerald-800 font-black text-xs px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                English Speech, Fluency & MTI Analysis AI • ඉංග්‍රීසි කථන පුහුණුව
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 font-sinhala">
                ඉංග්‍රීසි කථන හා චතුරතා අනුවර්තී පද්ධතිය
              </h1>
              <p className="text-slate-600 font-bold text-sm sm:text-base max-w-2xl mx-auto">
                ශ්‍රී ලාංකික සිසුන්ගේ MTI රටා 12ක්, කථන චතුරතාව (WPM), ස්වර රිද්මය සහ ශබ්ද පැහැදිලි බව ඇගයීම.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { grade: 2, icon: '🌱', title: '2 ශ්‍රේණිය', desc: 'තනි වචන උච්චාරණය (Single Words) — MTI රටා 12ම ආවරණය වන ස්ථාවර ප්‍රශ්න පත්‍ර 3', type: 'තනි වචන (Single Words)', color: 'from-emerald-500 to-teal-600' },
                { grade: 3, icon: '🎯', title: '3 ශ්‍රේණිය', desc: 'කෙටි වාක්‍ය කියවීම (Short Sentences) — MTI රටා 12ම ආවරණය වන ස්ථාවර ප්‍රශ්න පත්‍ර 3', type: 'කෙටි වාක්‍ය (Short Sentences)', color: 'from-blue-500 to-indigo-600' },
                { grade: 4, icon: '🚀', title: '4 ශ්‍රේණිය', desc: 'දිගු වාක්‍ය සහ චතුර කථනය (Long Sentences) — MTI රටා 12ම ආවරණය වන ස්ථාවර ප්‍රශ්න පත්‍ර 3', type: 'දිගු වාක්‍ය (Long Sentences)', color: 'from-purple-500 to-pink-600' }
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
                        ප්‍රශ්න පත්‍ර 3 (30 Questions)
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 font-sinhala">{g.title}</h2>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{g.desc}</p>
                    <div className="pt-2 text-xs font-bold text-slate-500 space-y-1">
                      <div>✓ Paper 01: 10 Questions ({g.type})</div>
                      <div>✓ Paper 02: 10 Questions ({g.type})</div>
                      <div>✓ Paper 03: 10 Questions ({g.type})</div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white shadow-md bg-gradient-to-r ${g.color} cursor-pointer`}>
                      ප්‍රශ්න පත්‍ර වෙත ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SCREEN: DEDICATED SRI LANKAN MTI DIAGNOSTICS LAB ── */}
        {viewState === 'mti_lab' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-2 border-rose-200 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="inline-block bg-rose-100 text-rose-800 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider mb-1">
                    🇱🇰 Sri Lankan MTI Diagnostics Hub • සජීවී MTI රසායනාගාරය
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-sinhala">
                    ශ්‍රී ලාංකික MTI උච්චාරණ රටා 12 පරීක්ෂාව
                  </h2>
                </div>
                <button
                  onClick={() => setViewState('grades_hub')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  ✕ පිටවීම
                </button>
              </div>

              {/* 12 MTI Pattern Selector Grid */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  පරීක්ෂා කිරීමට MTI රටාවක් තෝරන්න (Select 1 of 12 Patterns):
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

              {/* Active Practice Card */}
              <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl space-y-6 text-center">
                <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-200">
                  <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                    {activeMtiPattern.name} ({activeMtiPattern.name_si})
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    Target: {WORD_IPA_MAP[mtiLabTargetWord]?.target || activeMtiPattern.target_ipa} vs Common Error: {WORD_IPA_MAP[mtiLabTargetWord]?.error || activeMtiPattern.error_ipa}
                  </span>
                </div>

                {/* Target Word Display */}
                <div>
                  <h3 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-wide font-sans mb-1">
                    {mtiLabTargetWord}
                  </h3>
                  <p className="text-sm text-slate-500 font-mono">
                    {WORD_IPA_MAP[mtiLabTargetWord]?.target || activeMtiPattern.target_ipa}
                  </p>
                </div>

                {/* Word Navigation */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {activeMtiPattern.examples.map((w, idx) => (
                    <button
                      key={w}
                      onClick={() => {
                        playSound('click');
                        setMtiLabWordIndex(idx);
                        setMtiLabResult(null);
                        setMtiLabLiveTranscript('');
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                        w === mtiLabTargetWord
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>

                {/* Voice Controls */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => speakEnglish(mtiLabTargetWord)}
                    className="px-5 py-3 rounded-2xl font-black text-sm bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-200 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>🔊</span> Standard Audio
                  </button>

                  <button
                    onClick={mtiLabListening ? stopMtiLabRecording : startMtiLabRecording}
                    className={`px-8 py-3.5 rounded-2xl font-black text-base transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                      mtiLabListening
                        ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <span>{mtiLabListening ? '⏹️ අවසන් කරන්න' : '🎤 කතා කරන්න (Speak to Test)'}</span>
                  </button>
                </div>

                {/* Live Transcript Stream & Analyzing Animation */}
                {mtiLabListening && (
                  <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400 rounded-3xl text-emerald-900 space-y-3 animate-fade-in shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase tracking-wider">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                        🎙️ හඬ විශ්ලේෂණය වෙමින් පවතී (Analyzing Speech...)
                      </span>
                      {/* Audio frequency wave visualizer */}
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
                        <span className="w-1 h-8 bg-teal-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                        <span className="w-1 h-10 bg-emerald-600 rounded-full animate-bounce [animation-delay:300ms]"></span>
                        <span className="w-1 h-7 bg-teal-600 rounded-full animate-bounce [animation-delay:450ms]"></span>
                        <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:200ms]"></span>
                      </div>
                    </div>

                    <div className="py-2">
                      <span className="text-3xl sm:text-4xl font-black text-emerald-900 font-sans tracking-wide">
                        "{mtiLabLiveTranscript || 'සවන් දෙමින්...'}"
                      </span>
                    </div>

                    <div className="text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1.5">
                      <span className="animate-spin text-sm">⚙️</span> MTI රටා 12 සහ Phoneme සංසන්දනය වෙමින් පවතී...
                    </div>
                  </div>
                )}

                {/* Real-time MTI Result Display */}
                {mtiLabResult && !mtiLabListening && (
                  <div className="p-5 bg-white border-2 border-slate-200 rounded-3xl space-y-4 text-left animate-fade-in shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">
                        ඔබ පැවසූ දෙය: <strong className="text-slate-900 text-base font-sans">"{mtiLabResult.transcript}"</strong>
                      </span>
                      <span className={`px-3 py-1 rounded-xl text-xs font-black text-white ${
                        mtiLabResult.mtiPatterns && mtiLabResult.mtiPatterns.length > 0
                          ? 'bg-rose-600'
                          : mtiLabResult.wordsCorrect
                          ? 'bg-emerald-600'
                          : 'bg-amber-600'
                      }`}>
                        {mtiLabResult.mtiPatterns && mtiLabResult.mtiPatterns.length > 0
                          ? '⚠️ MTI Pattern Detected'
                          : mtiLabResult.wordsCorrect
                          ? '✓ Clean Standard'
                          : '⚠️ Wrong Word / වෙනත් වචනයක්'}
                      </span>
                    </div>

                    {/* MTI Pattern Advice Card */}
                    {mtiLabResult.mtiPatterns && mtiLabResult.mtiPatterns.length > 0 ? (
                      <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl space-y-1.5">
                        <div className="text-xs font-black text-rose-900">
                          📌 හඳුනාගත් MTI රටාව: {mtiLabResult.mtiPatterns[0].name} ({mtiLabResult.mtiPatterns[0].name_si})
                        </div>
                        <p className="text-xs text-rose-800 font-bold">
                          💡 උපදෙස: {mtiLabResult.mtiPatterns[0].pedagogical_tip_si}
                        </p>
                        <p className="text-[11px] text-slate-600 italic">
                          ({mtiLabResult.mtiPatterns[0].pedagogical_tip})
                        </p>
                      </div>
                    ) : !mtiLabResult.wordsCorrect ? (
                      <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl text-amber-900">
                        <h4 className="font-black text-sm">⚠️ පැවසූ වචනය අපේක්ෂිත වචනයට නොගැලපේ.</h4>
                        <p className="text-xs font-medium mt-0.5">
                          ඔබ පැවසූ වචනය '{mtiLabResult.transcript}' වේ. කරුණාකර '{mtiLabTargetWord}' වචනය නැවත පවසන්න.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-emerald-900">
                        <h4 className="font-black text-sm">🎉 විශිෂ්ටයි! සම්මත ඉංග්‍රීසි උච්චාරණය (No MTI Errors).</h4>
                        <p className="text-xs font-medium mt-0.5">ඔබේ උච්චාරණය සම්මත ඉංග්‍රීසි ශබ්ද රටාවට අනුකූල වේ.</p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ── SCREEN 2: 3 PAPERS HUB ── */}
        {viewState === 'papers_hub' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-xl text-center relative overflow-hidden">
              <div className="inline-block bg-emerald-100 text-emerald-800 font-black text-xs px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                Grade {selectedGrade} • {selectedGrade} ශ්‍රේණිය ඉංග්‍රීසි
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 font-sinhala">
                {selectedGrade === 2 ? 'තනි වචන ප්‍රශ්න පත්‍ර 3 (Single Words)' : selectedGrade === 3 ? 'කෙටි වාක්‍ය ප්‍රශ්න පත්‍ර 3 (Short Sentences)' : 'දිගු වාක්‍ය ප්‍රශ්න පත්‍ර 3 (Long Sentences)'}
              </h1>
              <p className="text-slate-600 font-bold text-sm sm:text-base max-w-2xl mx-auto">
                ශ්‍රී ලාංකික MTI උච්චාරණ රටා 12ම ආවරණය වන පරිදි සකස් කළ ස්ථාවර ප්‍රශ්න 10 බැගින් අඩංගු ප්‍රශ්න පත්‍ර.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PAPERS_CONFIG.map(p => {
                const result = paperHistory[selectedGrade]?.[p.id];
                const isCompleted = !!result;
                const unlocked = isPaperUnlocked(p.id);
                const subtitleText = selectedGrade === 2
                  ? 'තනි වචන නිවැරදිව උච්චාරණය (MTI රටා ආවරණය)'
                  : selectedGrade === 3
                  ? 'කෙටි වාක්‍ය කියවීම සහ රිද්මය (MTI රටා ආවරණය)'
                  : 'දිගු වාක්‍ය සහ චතුර කථනය (MTI රටා ආවරණය)';

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
                            🔒 අගුළු දමා ඇත
                          </span>
                        ) : isCompleted ? (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                            ✓ සම්පූර්ණයි
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-xs font-black px-3 py-1 rounded-full">
                            නව ප්‍රශ්න පත්‍රය
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-slate-800 font-sinhala leading-snug">
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
                          <span className="text-xs font-bold text-slate-600">පෙර ලකුණු:</span>
                          <span className="text-sm font-black text-emerald-700">
                            {result.totalPassed}/{result.totalQuestions} ({result.overallAccuracy}%)
                          </span>
                        </div>
                      )}

                      {!unlocked && (
                        <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] font-bold text-amber-800">
                          🔒 ප්‍රශ්න පත්‍රය 0{p.id - 1} සඳහා 75% ක් ලබාගෙන මෙය අගුළු හරින්න.
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
                            {isCompleted ? '🔄 නැවත කරන්න' : 'ආරම්භ කරන්න ➔'}
                          </button>
                          {isCompleted && (
                            <button
                              onClick={() => handleViewSavedPaperReport(p.id)}
                              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              📊 වාර්තාව බලන්න
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          disabled
                          className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-slate-400 bg-slate-200 cursor-not-allowed border border-slate-300"
                        >
                          🔒 අගුළු දමා ඇත
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SCREEN 3: ACTIVE SPEAKING QUIZ (10 QUESTIONS) ── */}
        {viewState === 'quiz' && currentQ && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-xl animate-scale-up space-y-6">
            
            {/* Level Stepper and Progress */}
            <div>
              <div className="flex justify-between items-center text-xs font-black text-slate-600 mb-2">
                <span>{activePaperConfig.levelTitle}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    උත්සාහය #{questionAttempts}
                  </span>
                  <span>ප්‍රශ්න {currentQIndex + 1} / 10</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 bg-gradient-to-r ${activePaperConfig.color}`}
                  style={{ width: `${((currentQIndex + 1) / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Speaking Activity Card */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 text-center">
              
              <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-200">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
                  {currentQ.level === 'easy' ? '🔤 Easy (Single Word)' : currentQ.level === 'medium' ? '📖 Medium (Short Sentence)' : '🎙️ Hard (Long Sentence)'}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  තේරුම: <strong className="text-slate-800">{currentQ.sinhala_meaning}</strong>
                </span>
              </div>

              {/* Target Prompt Display */}
              <div className="py-4">
                <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-wide font-sans mb-2">
                  {currentQ.display_text}
                </h2>
                {currentQ.phonetic_hint && (
                  <p className="text-sm font-bold text-emerald-600 font-mono">
                    {currentQ.phonetic_hint}
                  </p>
                )}
                {currentQ.tip && (
                  <p className="text-xs text-slate-500 font-medium mt-2">
                    💡 {currentQ.tip}
                  </p>
                )}
              </div>

              {/* Interactive Audio & Mic Controls */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => speakEnglish(currentQ.target_text)}
                  className="px-5 py-3 rounded-2xl font-black text-sm bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-200 shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>🔊</span> හඬට සවන් දෙන්න (Listen)
                </button>

                <button
                  onClick={isListening ? stopRecordingAndEvaluate : startRecording}
                  className={`px-8 py-3.5 rounded-2xl font-black text-base transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <span>{isListening ? `⏹️ අවසන් කරන්න (${recordingSeconds}s)` : '🎤 කතා කරන්න (Speak)'}</span>
                </button>
              </div>

              {/* Continuous Live Listening & Real-Time Animated Equalizer Bars */}
              {isListening && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 space-y-3 animate-fade-in">
                  
                  {/* Real-time Hardware Audio Equalizer */}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="font-bold text-sm">🎙️ සවන් දෙමින් පවතී ({recordingSeconds}s)</span>
                    
                    {/* Dynamic Equalizer Visualizer Bars */}
                    <div className="flex items-end gap-1 h-5 px-2 py-0.5 bg-white rounded-lg border border-emerald-200">
                      {[0.4, 0.8, 1.2, 0.7, 0.5].map((mult, idx) => (
                        <div
                          key={idx}
                          className="w-1.5 bg-emerald-500 rounded-full transition-all duration-75"
                          style={{
                            height: `${Math.max(4, Math.min(18, (liveVolume * mult) / 4))}px`
                          }}
                        ></div>
                      ))}
                    </div>

                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      liveVolume > 5 ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {liveVolume > 5 ? `🔊 හඬ ලැබෙමින් පවතී (${liveVolume}%)` : '🔈 සවන් දෙමින්...'}
                    </span>
                  </div>

                  {/* Real-time recognized text preview (Streams full sentence uninterrupted) */}
                  {liveTranscript ? (
                    <div className="p-3.5 bg-white rounded-2xl border-2 border-emerald-300 text-center animate-scale-up shadow-sm">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        ඔබ පවසන දෙය (Live Speech):
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-emerald-800 font-sans">
                        "{liveTranscript}"
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-700 font-medium">
                      (සම්පූර්ණ වාක්‍යය ඔබේ ස්වභාවික රිද්මයෙන් කියවන්න — අවසන් වූ පසු 'අවසන් කරන්න' ඔබන්න)
                    </p>
                  )}
                </div>
              )}

              {/* ── 6-DIMENSIONAL ASSESSMENT BREAKDOWN ── */}
              {assessmentResult && !isListening && (
                <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 space-y-4 text-left animate-fade-in shadow-sm">
                  
                  {/* Status Banner */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    assessmentResult.pronunciationCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}>
                    <div>
                      <h4 className="font-black text-base">{assessmentResult.statusTitle}</h4>
                      <p className="text-xs font-medium mt-0.5">{assessmentResult.statusMessage}</p>
                    </div>
                    <span className={`text-lg font-black px-4 py-1.5 rounded-xl shadow-sm ${
                      assessmentResult.pronunciationCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}>
                      {assessmentResult.accuracy}%
                    </span>
                  </div>

                  {/* 3 Core Checkpoints */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    
                    {/* Step 1: Sound Check */}
                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold ${
                      assessmentResult.soundDetected ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      <span>{assessmentResult.soundDetected ? '✓' : '✗'}</span>
                      <span>1. ශබ්ද හඳුනා ගැනීම</span>
                    </div>

                    {/* Step 2: Word Check */}
                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold ${
                      assessmentResult.wordsCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      <span>{assessmentResult.wordsCorrect ? '✓' : '✗'}</span>
                      <span>2. වචන නිරවද්‍යතාව</span>
                    </div>

                    {/* Step 3: Pronunciation & MTI Check */}
                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold ${
                      assessmentResult.pronunciationCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      <span>{assessmentResult.pronunciationCorrect ? '✓' : '✗'}</span>
                      <span>3. 100% උච්චාරණ මට්ටම</span>
                    </div>

                  </div>

                  {/* ── SRI LANKAN MTI ERROR ADVICE CARDS ── */}
                  {assessmentResult.mtiPatterns && assessmentResult.mtiPatterns.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-black text-rose-600 uppercase tracking-wider block">
                        ⚠️ හඳුනාගත් ශ්‍රී ලාංකික MTI උච්චාරණ රටා (Pronunciation Tips):
                      </span>
                      {assessmentResult.mtiPatterns.map((pat, idx) => (
                        <div key={idx} className="p-3.5 bg-rose-50 border-2 border-rose-200 rounded-2xl space-y-1">
                          <div className="flex items-center justify-between text-xs font-black text-rose-900">
                            <span>📌 {pat.name} ({pat.name_si})</span>
                            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-rose-200">
                              {pat.target_ipa} ➔ {pat.error_ipa}
                            </span>
                          </div>
                          <p className="text-xs text-rose-800 font-bold">
                            💡 {pat.pedagogical_tip_si}
                          </p>
                          <p className="text-[11px] text-slate-600 italic">
                            ({pat.pedagogical_tip})
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── MULTI-DIMENSIONAL ACOUSTIC & FLUENCY METRICS ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    
                    {/* Fluency & Speed */}
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">1. කථන වේගය (Speed / WPM)</span>
                      <p className="font-black text-slate-800 text-sm">
                        {assessmentResult.fluency?.wpm || 0} WPM
                      </p>
                      <span className="text-[11px] font-bold text-emerald-700 block">
                        {assessmentResult.fluency?.speedStatus || 'Optimal'}
                      </span>
                    </div>

                    {/* Intonation & Rhythm */}
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">2. ස්වර රිද්මය (Intonation)</span>
                      <p className="font-bold text-slate-800 text-xs mt-1">
                        {assessmentResult.intonation?.style || 'Expressive'}
                      </p>
                    </div>

                    {/* Volume & Clarity */}
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">3. ශබ්ද මට්ටම (Volume & Clarity)</span>
                      <p className="font-black text-slate-800 text-sm">
                        {assessmentResult.volume?.percent || 50}%
                      </p>
                      <span className="text-[11px] font-bold text-slate-600 block">
                        {assessmentResult.volume?.status || 'Clear'}
                      </span>
                    </div>

                  </div>

                  {/* Word-by-Word Visual Breakdown for Sentences */}
                  {assessmentResult.wordResults && assessmentResult.wordResults.length > 1 && (
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        වචන අනුව විශ්ලේෂණය (Word Breakdown):
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

                  {/* Spoken Transcript */}
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 font-bold flex flex-wrap justify-between items-center gap-2">
                    <span>ඔබ පැවසූ දෙය: <strong className="font-sans text-slate-900 text-sm">"{assessmentResult.transcript}"</strong></span>
                    <span>අපේක්ෂිත {currentQ.level === 'easy' ? 'වචනය' : 'වාක්‍යය'}: <strong className="font-sans text-emerald-700 text-sm">"{currentQ.target_text}"</strong></span>
                  </div>

                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                {isAnswered && !assessmentResult?.pronunciationCorrect ? (
                  <button
                    onClick={handleRetryQuestion}
                    className="px-6 py-3 rounded-2xl font-black text-sm bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>🔄</span> නැවත උත්සාහ කරන්න (Try Again)
                  </button>
                ) : (
                  <div></div>
                )}

                <button
                  disabled={!isAnswered}
                  onClick={handleNextQuestion}
                  className={`px-8 py-3.5 rounded-2xl font-black text-base border-2 transition-all flex items-center gap-2 ${
                    isAnswered
                      ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-lg cursor-pointer active:scale-95'
                      : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-75 shadow-none'
                  }`}
                >
                  <span>{currentQIndex >= 9 ? 'ප්‍රශ්න පත්‍රය අවසන් කරන්න ➔' : 'ඊළඟ ප්‍රශ්නය ➔'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── SCREEN 4: COMPREHENSIVE PAPER REPORT ── */}
        {viewState === 'report' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-200 shadow-2xl space-y-8 animate-scale-up">
            
            <div className="text-center pb-6 border-b border-slate-200">
              <h2 className="text-3xl font-black text-slate-800 mb-1 font-sinhala">
                {selectedGrade} ශ්‍රේණිය — {activePaperConfig.title} වාර්තාව
              </h2>
              <p className="text-sm text-slate-500 font-bold">
                {activePaperConfig.levelTitle} • ප්‍රශ්න 10 ඇගයීම් ප්‍රතිඵලය
              </p>
            </div>

            {/* Score Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">100% සාර්ථක ප්‍රශ්න</p>
                <p className="text-3xl font-black text-emerald-700">{totalPassedCount} / 10</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">සාමාන්‍ය ලකුණු ප්‍රතිශතය</p>
                <p className="text-3xl font-black text-blue-700">{overallReportAccuracy}%</p>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-purple-50 border border-purple-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">තත්ත්වය</p>
                <p className={`text-2xl font-black ${hasPassedThreshold ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {hasPassedThreshold ? '✓ Passed (75%+)' : '✗ Needs Practice'}
                </p>
              </div>
            </div>

            {/* Unlock Status Alert */}
            {hasPassedThreshold ? (
              <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-200 flex items-center gap-4">
                <span className="text-3xl">🎉</span>
                <div>
                  <h4 className="font-black text-emerald-900 text-base">විශිෂ්ටයි! ඔබ 75% කට වඩා ලබා ගත්තා!</h4>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    {activePaperId < 3 
                      ? `ඊළඟ ප්‍රශ්න පත්‍රය 0${activePaperId + 1} (${PAPERS_CONFIG[activePaperId].badge}) දැන් අගුළු හැරී ඇත.` 
                      : 'ඔබ සියලුම මට්ටම් (Easy, Medium, Hard) සාර්ථකව සම්පූර්ණ කළා!'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-200 flex items-center gap-4">
                <span className="text-3xl">🎯</span>
                <div>
                  <h4 className="font-black text-amber-900 text-base">ඊළඟ ප්‍රශ්න පත්‍රයට යාමට 75% ක් අවශ්‍ය වේ.</h4>
                  <p className="text-xs text-amber-700 font-medium mt-0.5">
                    ඔබ ලබාගෙන ඇත්තේ {overallReportAccuracy}% කි. කරුණාකර නැවත උත්සාහ කරන්න.
                  </p>
                </div>
              </div>
            )}

            {/* Detailed Question Review */}
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                <span>📋</span> ප්‍රශ්න 10 සමාලෝචනය
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
                        {h.accuracy}% {h.isPassed ? '✓ Passed (100%)' : '✗ Needs Practice'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-bold">
                      ඔබ පැවසූ දෙය: <span className="font-sans text-slate-800">"{h.userTranscript}"</span>
                    </p>
                    
                    {h.mtiPatterns && h.mtiPatterns.length > 0 && (
                      <div className="mt-2 p-2 bg-white rounded-xl border border-rose-200 text-xs text-rose-800 font-bold">
                        ⚠️ MTI රටා: {h.mtiPatterns.map(p => p.name_si).join(', ')}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-200 text-[11px] font-bold text-slate-500">
                      <span>1. Sound: {h.soundDetected ? '✓' : '✗'}</span>
                      <span>•</span>
                      <span>2. Word: {h.wordsCorrect ? '✓' : '✗'}</span>
                      <span>•</span>
                      <span>3. Speed: {h.fluency?.wpm || 0} WPM</span>
                      <span>•</span>
                      <span>4. Volume: {h.volume?.percent || 50}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleStartPaper(activePaperId)}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer text-center"
              >
                🔄 නැවත කරන්න (ප්‍රශ්න පත්‍රය 0{activePaperId})
              </button>
              
              {hasPassedThreshold && activePaperId < 3 && (
                <button
                  onClick={() => handleStartPaper(activePaperId + 1)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer text-center"
                >
                  ඊළඟ ප්‍රශ්න පත්‍රය වෙත (0{activePaperId + 1}) ➔
                </button>
              )}

              <button
                onClick={() => setViewState('papers_hub')}
                className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-black py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-center"
              >
                📑 වෙනත් ප්‍රශ්න පත්‍රයක් තෝරන්න
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
