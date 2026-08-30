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
    examples: ['fan', 'film', 'food', 'elephant', 'fish', 'feather', 'four', 'fast'],
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

// Clean English transcript extractor - pure raw speech stream without auto-correction or word substitution
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
        allHypotheses.push({
          text: altText.toLowerCase(),
          confidence: resItem[k]?.confidence || 0,
          isFinal: resItem.isFinal
        });

        altText.toLowerCase().split(/\s+/).forEach(tok => {
          const cleanTok = tok.replace(/[^a-z0-9]/gi, '');
          if (cleanTok) {
            allAltTokens.push(cleanTok);
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

    if (resItem.isFinal) {
      finalStr += rawTranscript + ' ';
    } else {
      interimStr = rawTranscript;
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
  'school': { target: '/skuːl/', error: '/ɪskuːl/' },
  'spoon': { target: '/spuːn/', error: '/ɪspuːn/' },
  'station': { target: '/ˈsteɪʃən/', error: '/ɪsˈteɪʃən/' },
  'study': { target: '/ˈstʌdi/', error: '/ɪsˈtʌdi/' },
  'speak': { target: '/spiːk/', error: '/ɪspiːk/' },
  'star': { target: '/stɑːr/', error: '/ɪsˈtɑːr/ or /esta/' },
  'stop': { target: '/stɒp/', error: '/ɪsˈtɒp/' },
  'spring': { target: '/sprɪŋ/', error: '/ɪsˈprɪŋ/' },
  'very': { target: '/ˈveri/', error: '/ˈweri/' },
  'water': { target: '/ˈwɔːtər/', error: '/ˈvɔːtər/' },
  'win': { target: '/wɪn/', error: '/vɪn/' },
  'view': { target: '/vjuː/', error: '/wjuː/' },
  'van': { target: '/væn/', error: '/wæn/' },
  'window': { target: '/ˈwɪndoʊ/', error: '/ˈvɪndoʊ/' },
  'voice': { target: '/vɔɪs/', error: '/wɔɪs/' },
  'village': { target: '/ˈvɪlɪdʒ/', error: '/ˈwɪlɪdʒ/' },
  'three': { target: '/θriː/', error: '/triː/' },
  'think': { target: '/θɪŋk/', error: '/tɪŋk/' },
  'this': { target: '/ðɪs/', error: '/dɪs/' },
  'that': { target: '/ðæt/', error: '/dæt/' },
  'there': { target: '/ðeər/', error: '/deər/' },
  'the': { target: '/ðə/', error: '/də/' },
  'mother': { target: '/ˈmʌðər/', error: '/ˈmʌdər/' },
  'father': { target: '/ˈfɑːðər/', error: '/ˈfɑːdər/' },
  'fan': { target: '/fæn/', error: '/pæn/' },
  'film': { target: '/fɪlm/', error: '/pɪlm/' },
  'food': { target: '/fuːd/', error: '/puːd/' },
  'elephant': { target: '/ˈelɪfənt/', error: '/ˈelɪpənt/' },
  'fish': { target: '/fɪʃ/', error: '/pɪʃ/' },
  'feather': { target: '/ˈfeðər/', error: '/ˈpedər/' },
  'four': { target: '/fɔːr/', error: '/pɔːr/' },
  'bus': { target: '/bʌs/', error: '/bʌs.ə/' },
  'milk': { target: '/mɪlk/', error: '/mɪlk.ə/' },
  'book': { target: '/bʊk/', error: '/bʊk.ə/' },
  'good': { target: '/ɡʊd/', error: '/ɡʊd.ə/' },
  'cake': { target: '/keɪk/', error: '/keɪk.ə/' },
  'stamp': { target: '/stæmp/', error: '/stæmp.ə/' },
  'park': { target: '/pɑːrk/', error: '/pɑːrk.ə/' },
  'pen': { target: '/pen/', error: '/pen.ə/' },
  'but': { target: '/bʌt/', error: '/bʌ/' },
  'cat': { target: '/kæt/', error: '/kæ/' },
  'hand': { target: '/hænd/', error: '/hæn/' },
  'red': { target: '/red/', error: '/re/' },
  'bird': { target: '/bɜːrd/', error: '/bɜː/' },
  'next': { target: '/nekst/', error: '/neks/' },
  'friend': { target: '/frend/', error: '/fren/' },
  'product': { target: '/ˈprɒdʌkt/', error: '/ˈprɒdʌk/' },
  'desk': { target: '/desk/', error: '/des/' },
  'fast': { target: '/fɑːst/', error: '/fɑːs/' },
  'best': { target: '/best/', error: '/bes/' },
  'plant': { target: '/plɑːnt/', error: '/plɑːn/' },
  'boat': { target: '/boʊt/', error: '/bɒt/' },
  'great': { target: '/ɡreɪt/', error: '/ɡret/' },
  'note': { target: '/noʊt/', error: '/nɒt/' },
  'feet': { target: '/fiːt/', error: '/fɪt/' },
  'fit': { target: '/fɪt/', error: '/fiːt/' },
  'seat': { target: '/siːt/', error: '/sɪt/' },
  'sit': { target: '/sɪt/', error: '/siːt/' },
  'house': { target: '/haʊs/', error: '/aʊs/' },
  'happy': { target: '/ˈhæpi/', error: '/ˈæpi/' },
  'hello': { target: '/həˈloʊ/', error: '/əˈloʊ/' },
  'hot': { target: '/hɒt/', error: '/ɒt/' },
  'hat': { target: '/hæt/', error: '/æt/' },
  'hear': { target: '/hɪər/', error: '/ɪər/' },
  'help': { target: '/help/', error: '/elp/' },
  'zoo': { target: '/zuː/', error: '/suː/' },
  'busy': { target: '/ˈbɪzi/', error: '/ˈbɪsi/' },
  'please': { target: '/pliːz/', error: '/pliːs/' },
  'zero': { target: '/ˈzɪəroʊ/', error: '/ˈsɪəroʊ/' },
  'zebra': { target: '/ˈzebrə/', error: '/ˈsebrə/' },
  'music': { target: '/ˈmjuːzɪk/', error: '/ˈmjuːsɪk/' },
  'noise': { target: '/nɔɪz/', error: '/nɔɪs/' },
  'rose': { target: '/roʊz/', error: '/roʊs/' },
  'hall': { target: '/hɔːl/', error: '/hɒl/' },
  'cup': { target: '/kʌp/', error: '/kæp/' },
  'ball': { target: '/bɔːl/', error: '/bɒl/' },
  'call': { target: '/kɔːl/', error: '/kɒl/' },
  'walk': { target: '/wɔːk/', error: '/wɒk/' },
  'tall': { target: '/tɔːl/', error: '/tɒl/' },
  'computer': { target: '/kəmˈpjuːtər/', error: '/kompjuˈter/' },
  'banana': { target: '/bəˈnɑːnə/', error: '/bananə/' },
  'tomorrow': { target: '/təˈmɒroʊ/', error: '/tomɒroʊ/' },
  'beautiful': { target: '/ˈbjuːtɪfʊl/', error: '/bjuːtiˈful/' },
  'together': { target: '/təˈɡeðər/', error: '/toɡeˈdər/' },
  'umbrella': { target: '/ʌmˈbrelə/', error: '/umbreˈla/' }
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

  // ── 1. S-Cluster Prosthesis (school -> ischool / eschool) ──
  if ((/^s[cptkmnr]/.test(tw) || /^s[lw]/.test(tw)) &&
      (sw === 'i' + tw || sw === 'e' + tw || sw === 'is' + tw.slice(1) || sw === 'es' + tw.slice(1))) {
    return mkPattern(1, tw, sw, `Spoken text shows '${sw}' with an initial prosthesis vowel added before '${tw}'.`);
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
    return { status: 'Too Soft (ශබ්දය මදි)', score: 60 };
  }
  if (avg > 82 || max > 98) {
    return { status: 'Too Loud (ශබ්දය වැඩියි)', score: 70 };
  }
  return { status: 'Clear & Optimal (පැහැදිලියි)', score: 95 };
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
      style: 'Short Utterance (කෙටි ශබ්දය)'
    };
  }
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const range = max - min;
  const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
  const variance = valid.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / valid.length;
  const stdDev = Math.sqrt(variance);

  const isMonotone = (range < 20 || stdDev < 8);
  let style = 'Natural Variation (ස්වභාවික විචලනය)';
  let score = 90;
  if (isMonotone) {
    style = 'Flat / Monotone (ඒකාකාරී ස්වරය)';
    score = 65;
  } else if (range > 65 || stdDev > 22) {
    style = 'Highly Expressive (ඉතා ප්‍රකාශනාත්මක)';
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
    return { isQuestion: false, rising: null, status: 'Statement (ප්‍රකාශනයක්)' };
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
    status: rise > 10 ? 'Rising Question Intonation (ප්‍රශ්නාර්ථ ස්වරය)' : 'Flat/Falling Intonation (පැතලි ස්වරය)'
  };
}

function classifyStartDelay(ms) {
  if (ms < 1500) return { delayMs: Math.round(ms), status: 'Quick Start (ක්ෂණික ආරම්භය)' };
  if (ms < 3500) return { delayMs: Math.round(ms), status: 'Normal Start (සාමාන්‍ය)' };
  if (ms < 6000) return { delayMs: Math.round(ms), status: 'Slow Start (මන්දගාමී)' };
  return { delayMs: Math.round(ms), status: 'Hesitant Start (ප්‍රමාදයි)' };
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

  const spokenClean = (spokenText || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
  const targetClean = (targetText || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
  const spokenWords = spokenClean.split(/\s+/).filter(Boolean);
  const targetWords = targetClean.split(/\s+/).filter(Boolean);
  const allCandidateTokens = Array.from(new Set([...spokenWords, ...(candidateAlternatives || [])])).filter(Boolean);

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

  const speechDetected = Boolean(spokenWords.length > 0 || allCandidateTokens.length > 0 || avgVol > 12);
  if (!speechDetected) {
    return {
      overallScore: 0,
      soundDetected: false,
      wordsCorrect: false,
      pronunciationCorrect: false,
      accuracy: 0,
      statusTitle: 'ශබ්දයක් හඳුනා නොගැනිණි (No Speech Detected)',
      statusMessage: 'මයික්‍රෆෝනයෙන් කිසිදු හඬක් වාර්තා නොවීය. කරුණාකර මයික්‍රෆෝනය ළඟට ගෙන ශබ්ද නගා කතා කරන්න.',
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

  if (isSingleWord) {
    const targetWord = targetWords[0];
    const flaggedThisWord = mtiErrorTargets.has(targetWord);

    let matchedExact = (spokenClean === targetWord);
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
      wordResults = [{ word: targetWord, matched: false, spoken: matchedPattern?.spoken || spokenClean }];
    } else if (matchedExact || (matchedInWords && spokenWords.length === 1)) {
      matchedCount = 1;
      missedWords = [];
      wordResults = [{ word: targetWord, matched: true, spoken: spokenWords[0] || spokenClean }];
    } else {
      matchedCount = 0;
      missedWords = [targetWord];
      wordResults = [{ word: targetWord, matched: false, spoken: spokenWords[0] || '' }];
    }
  } else {
    wordResults = alignWordsLCS(targetWords, spokenWords);
    if (mtiErrorTargets.size > 0) {
      wordResults = wordResults.map(wr => mtiErrorTargets.has(wr.word) ? { ...wr, matched: false } : wr);
    }
    matchedCount = wordResults.filter(w => w.matched).length;
    missedWords = wordResults.filter(w => !w.matched).map(w => w.word);
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

  let speedStatus = 'Optimal / Natural (ස්වභාවික වේගය)';
  let fluencyScore = 90;
  if (speakingRate < 60) {
    speedStatus = 'Too Slow (මන්දගාමී)';
    fluencyScore -= 20;
  } else if (speakingRate > 175) {
    speedStatus = 'Too Fast (ඉතා වේගවත්)';
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
      improvementMessage = `උත්සාහය #${previousAttempts.length + 1}: පසුගිය වාරයට වඩා +${improvementPercentage}% ක දියුණුවක්!`;
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
      ? 'විශිෂ්ට උච්චාරණයක්! (100% Passed)'
      : 'උච්චාරණය තවදුරටත් පුහුණු වන්න (Needs Practice)',
    statusMessage: pronunciationCorrect
      ? 'ඔබේ උච්චාරණය, ස්වර රිද්මය සහ කථන වේගය ඉතා විශිෂ්ටයි (100%).'
      : mtiPatterns.length > 0
      ? `MTI උච්චාරණ රටාවක් හඳුනා ගැනිණි: ${mtiPatterns.map(p => p.name_si).join(', ')}.`
      : `වචන ${matchedCount}/${totalWords} නිවැරදියි. සම්පූර්ණ ලකුණු සඳහා '${missedWords.join(', ')}' නිවැරදිව පවසන්න.`,
    transcript: spokenText,
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
      level_name_si: grade === 2 ? 'තනි වචන (Single Words)' : grade === 3 ? 'කෙටි වාක්‍ය (Short Sentences)' : 'දිගු වාක්‍ය (Long Sentences)'
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
      reco.maxAlternatives = 3;

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
          setLiveTranscript(`🎤 සවන් දෙමින්... (නැවත කතා කරන්න)`);
          restartRecognitionIfNeeded(reco, () => {
            setLiveTranscript('🎤 හඬක් හඳුනා නොගැනිණි. නැවත උත්සාහ කරන්න.');
            stopListening();
          });
          return;
        }

        if (event.error === 'not-allowed') {
          setLiveTranscript('🎤 මයික්‍රෆෝනයට අවසර නැත.');
          stopListening();
        }

        if (event.error === 'audio-capture' || event.error === 'network') {
          setLiveTranscript('🎤 සම්බන්ධතා ගැටළුවක්. නැවත උත්සාහ කරන්න.');
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
            setLiveTranscript('🎤 හඬක් හඳුනා නොගැනිණි. නැවත උත්සාහ කරන්න.');
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
      setLiveTranscript('🎤 දෝෂයක් ඇතිවිය. නැවත උත්සාහ කරන්න.');
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
    const finalHeardText = (latestTranscriptRef.current || liveTranscript || '').replace('සවන් දෙමින්...', '').replace('හඬ ලැබෙමින් පවතී...', '').trim();

    let finalText = finalHeardText;
    if (!finalText && latestAlternativesRef.current && latestAlternativesRef.current.length > 0) {
      finalText = latestAlternativesRef.current.join(' ');
      latestTranscriptRef.current = finalText;
    }

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
      latestAlternativesRef.current || [],
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

    const entry = {
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
      wordResults: assessmentResult ? assessmentResult.wordResults : [],
      mtiPatterns: assessmentResult ? assessmentResult.mtiPatterns : [],
      fluency: assessmentResult ? assessmentResult.fluency : {},
      intonation: assessmentResult ? assessmentResult.intonation : {},
      volume: assessmentResult ? assessmentResult.volume : {},
      language: assessmentResult ? assessmentResult.language : {},
      engagement: assessmentResult ? assessmentResult.engagement : {},
      attempts: questionAttempts
    };

    const updatedHistory = [...history, entry];
    setHistory(updatedHistory);

    if (currentQIndex < 9) {
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
    } else {
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

  const activeMtiPattern = SRI_LANKAN_MTI_PATTERNS.find(p => p.key === selectedMtiPatternKey) || SRI_LANKAN_MTI_PATTERNS[0];
  const mtiLabTargetWord = activeMtiPattern.examples[mtiLabWordIndex % activeMtiPattern.examples.length] || activeMtiPattern.examples[0];

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
      reco.maxAlternatives = 3;

      let autoStopTimer = setTimeout(() => {
        if (isListeningRef.current && !latestTranscriptRef.current && !soundHeardRef.current) {
          setMtiLabLiveTranscript('⏰ කාලය ඉකුත් විය. 🎤 නැවත ඔබන්න.');
        }
      }, 6000);

      reco.onstart = () => { noSpeechAttemptsRef.current = 0; };
      reco.onsoundstart = () => { soundHeardRef.current = true; };
      reco.onspeechstart = () => { soundHeardRef.current = true; };

      const finishAndEvaluate = (text, altWords = []) => {
        if (!text || !isListeningRef.current) return;
        if (autoStopTimer) { clearTimeout(autoStopTimer); autoStopTimer = null; }
        if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
        const duration = Math.max(0.5, (performance.now() - (sessionDataRef.current.startedAt || performance.now())) / 1000);
        sessionDataRef.current.recordingDuration = duration;

        const res = evaluateSpeechSession(
          sessionDataRef.current,
          mtiLabTargetWord,
          text,
          altWords.length > 0 ? altWords : (latestAlternativesRef.current || []),
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
          setMtiLabLiveTranscript(`🎤 සවන් දෙමින්... (නැවත කතා කරන්න)`);
          restartRecognitionIfNeeded(reco, () => {
            setMtiLabLiveTranscript('🎤 හඬක් හඳුනා නොගැනිණි. නැවත උත්සාහ කරන්න.');
            setMtiLabListening(false);
            isListeningRef.current = false;
            try { reco.stop(); } catch (e) {}
          });
          return;
        }

        if (event.error === 'not-allowed') {
          setMtiLabLiveTranscript('🎤 මයික්‍රෆෝනයට අවසර නැත.');
          setMtiLabListening(false);
          isListeningRef.current = false;
        }

        if (event.error === 'audio-capture' || event.error === 'network') {
          setMtiLabLiveTranscript('🎤 සම්බන්ධතා ගැටළුවක්. නැවත උත්සාහ කරන්න.');
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
            setMtiLabLiveTranscript('🎤 හඬක් හඳුනා නොගැනිණි. නැවත උත්සාහ කරන්න.');
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
      <div className="max-w-4xl mx-auto relative z-10 p-4 sm:p-6">

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

              <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl space-y-6 text-center">
                <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-200">
                  <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                    {activeMtiPattern.name} ({activeMtiPattern.name_si})
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

                {mtiLabListening && (
                  <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400 rounded-3xl text-emerald-900 space-y-3 animate-fade-in shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase tracking-wider">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                        🎙️ සජීවීව සවන් දෙමින් පවතී (Live Listening...)
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
                        {mtiLabLiveTranscript ? `"${mtiLabLiveTranscript}"` : '🎙️ දැන් කතා කරන්න... (Speak now)'}
                      </span>
                    </div>

                    <div className="text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1.5">
                      <span className="animate-spin text-sm">⚙️</span> සජීවී හඬ විශ්ලේෂණය සහ Phoneme සංසන්දනය...
                    </div>
                  </div>
                )}

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

                    <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Volume (ශබ්දය)</span>
                        <span className="font-bold text-slate-700">{mtiLabResult.volume?.percent || 0}% ({mtiLabResult.volume?.status?.split(' ')[0] || 'Clear'})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Pitch (ස්වර විචලනය)</span>
                        <span className="font-bold text-slate-700">{mtiLabResult.intonation?.pitchRange || 0} Hz ({mtiLabResult.intonation?.style?.split(' ')[0] || 'Natural'})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Start Delay (ආරම්භය)</span>
                        <span className="font-bold text-slate-700">{mtiLabResult.engagement?.startDelayStatus?.split(' ')[0] || 'Quick'}</span>
                      </div>
                    </div>

                    {mtiLabResult.mtiPatterns && mtiLabResult.mtiPatterns.length > 0 ? (
                      <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-black text-rose-900">
                          <span>📌 හඳුනාගත් MTI රටාව: {mtiLabResult.mtiPatterns[0].name} ({mtiLabResult.mtiPatterns[0].name_si})</span>
                          <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-rose-200">
                            {mtiLabResult.mtiPatterns[0].target_ipa} ➔ {mtiLabResult.mtiPatterns[0].error_ipa}
                          </span>
                        </div>
                        {mtiLabResult.mtiPatterns[0].explanation && (
                          <p className="text-xs text-rose-900 font-semibold">
                            🔍 {mtiLabResult.mtiPatterns[0].explanation}
                          </p>
                        )}
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
                          🔒 ප්‍රශ්න පත්‍රය 0${p.id - 1} සඳහා 75% ක් ලබාගෙන මෙය අගුළු හරින්න.
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

        {viewState === 'quiz' && currentQ && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-xl animate-scale-up space-y-6">

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

            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 text-center">

              <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-200">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
                  {selectedGrade === 2 ? '🔤 Single Word (තනි වචන)' : selectedGrade === 3 ? '📖 Short Sentence (කෙටි වාක්‍ය)' : '🎙️ Long Sentence (දිගු වාක්‍ය)'}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  තේරුම: <strong className="text-slate-800">{currentQ.sinhala_meaning}</strong>
                </span>
              </div>

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

              {isListening && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 space-y-3 animate-fade-in">

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="font-bold text-sm">🎙️ සවන් දෙමින් පවතී ({recordingSeconds}s)</span>

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

                  <div className="p-4 bg-white rounded-2xl border-2 border-emerald-400 text-center shadow-md transition-all">
                    <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100">
                      <span className="text-xs font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                        ඔබ පවසන දෙය (Live Speech):
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        Real-time Stream
                      </span>
                    </div>
                    <div className="min-h-[48px] flex items-center justify-center">
                      {liveTranscript ? (
                        <span className="text-xl sm:text-2xl font-black text-emerald-900 font-sans tracking-wide">
                          "{liveTranscript}"
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-slate-400 italic animate-pulse">
                          🎙️ දැන් කතා කරන්න... ඔබ පවසන වචන මෙතැන සජීවීව දිස්වේ (Speak now...)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {assessmentResult && !isListening && (
                <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 space-y-4 text-left animate-fade-in shadow-sm">

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
                            🌟 +{assessmentResult.engagement.improvementPercentage}% දියුණුවක්!
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
                        <span className="text-[10px] uppercase font-black tracking-wider block opacity-75">ලකුණු</span>
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

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-500 block flex items-center gap-1">
                        🎯 1. උච්චාරණය (Pronunciation)
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
                        MTI දෝෂ: {assessmentResult.mtiPatterns?.length || 0}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-500 block flex items-center gap-1">
                        ⚡ 2. කථන වේගය (Fluency)
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
                        විරාම: {assessmentResult.fluency?.pauseCount || 0} ({assessmentResult.fluency?.totalPauseSec || 0}s)
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-500 block flex items-center gap-1">
                        🎵 3. ස්වර රිද්මය (Intonation)
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
                        🔊 4. ශබ්ද මට්ටම (Volume)
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
                        🔤 5. වචන පිළිවෙළ (Language)
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
                        {assessmentResult.language?.repetitions?.length > 0 ? `නැවත කීම්: ${assessmentResult.language.repetitions.length}` : 'නැවත කීම් නැත'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-500 block flex items-center gap-1">
                        🚀 6. විශ්වාසය & ආරම්භය (Engagement)
                      </span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-black text-slate-800">
                          {assessmentResult.engagement?.score ?? 90}%
                        </span>
                        <span className="text-[10px] font-bold text-slate-600">
                          උත්සාහ #{assessmentResult.engagement?.attempts || questionAttempts}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-600 block truncate">
                        {assessmentResult.engagement?.startDelayStatus?.split(' ')[0] || 'Quick Start'}
                      </span>
                    </div>

                  </div>

                  {assessmentResult.mtiPatterns && assessmentResult.mtiPatterns.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-black text-rose-600 uppercase tracking-wider block">
                        ⚠️ හඳුනාගත් ශ්‍රී ලාංකික MTI උච්චාරණ රටා (Pronunciation Tips):
                      </span>
                      {assessmentResult.mtiPatterns.map((pat, idx) => (
                        <div key={idx} className="p-3.5 bg-rose-50 border-2 border-rose-200 rounded-2xl space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-black text-rose-900">
                            <span>📌 {pat.name} ({pat.name_si})</span>
                            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-rose-200">
                              {pat.target_ipa} ➔ {pat.error_ipa}
                            </span>
                          </div>
                          {pat.explanation && (
                            <p className="text-xs text-rose-900 font-semibold">
                              🔍 {pat.explanation}
                            </p>
                          )}
                          <p className="text-xs text-rose-800 font-bold">
                            💡 උපදෙස: {pat.pedagogical_tip_si}
                          </p>
                          <p className="text-[11px] text-slate-600 italic">
                            ({pat.pedagogical_tip})
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {assessmentResult.wordResults && assessmentResult.wordResults.length > 1 && (
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        වචන අනුව විශ්ලේෂණය (Word-by-Word Alignment):
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

                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 font-bold flex flex-wrap justify-between items-center gap-2">
                    <span>ඔබ පැවසූ දෙය: <strong className="font-sans text-slate-900 text-sm">"{assessmentResult.transcript}"</strong></span>
                    <span>අපේක්ෂිත {selectedGrade === 2 ? 'වචනය' : 'වාක්‍යය'}: <strong className="font-sans text-emerald-700 text-sm">"{currentQ.target_text}"</strong></span>
                  </div>

                </div>
              )}

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
                        {h.overallScore || h.accuracy}% {h.isPassed ? '✓ Passed (100%)' : '✗ Practice'}
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
                          <span className="text-emerald-700 font-black">උත්සාහ #{h.attempts}</span>
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
                🔄 නැවත කරන්න (ප්‍රශ්න පත්‍රය 0{activePaperId})
              </button>

              {activePaperId < 3 && (
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
