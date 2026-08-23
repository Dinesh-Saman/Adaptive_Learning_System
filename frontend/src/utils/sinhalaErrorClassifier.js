/**
 * sinhalaErrorClassifier.js
 * Comprehensive Sinhala Grapheme Cluster Segmenter & Error Taxonomy Classifier
 * Handles base consonants, vowel signs (Pillam), Kombuwa, Hal kirima, and Yansaya/Rakaransaya.
 */

// Splits Sinhala string into individual grapheme clusters
export function segmentSinhalaWord(word) {
  if (!word) return [];
  const cleanWord = word.trim();
  
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('si', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(cleanWord)).map(s => s.segment);
  }

  // Regex fallback for Sinhala base character + combining diacritics
  const matches = cleanWord.match(/[\u0D80-\u0DFF][\u0DCA-\u0DF3]*/g);
  return matches || cleanWord.split('');
}

/**
 * Classifies the student's written input against the target word
 * @param {string} targetWord - Expected correct Sinhala word
 * @param {string} studentInput - Student's written / recognized text
 * @returns {object} Diagnostic error report with taxonomy, missing parts, and bilingual feedback
 */
export function classifySinhalaError(targetWord, studentInput) {
  const target = (targetWord || '').trim();
  const student = (studentInput || '').trim();

  if (!student) {
    return {
      isCorrect: false,
      errorType: 'NO_ANSWER',
      category: 'Omission',
      feedbackSi: 'කරුණාකර පුවරුවේ පිළිතුර ලියන්න.',
      feedbackEn: 'No answer provided on the slate.',
      missingSegment: target
    };
  }

  // Exact Match
  if (target === student) {
    return {
      isCorrect: true,
      errorType: 'CORRECT',
      category: 'Mastery',
      feedbackSi: 'විශිෂ්ටයි! පිළිතුර සම්පූර්ණයෙන්ම නිවැරදියි! 🎉',
      feedbackEn: 'Correct answer! Excellent writing!'
    };
  }

  const targetGraphemes = segmentSinhalaWord(target);
  const studentGraphemes = segmentSinhalaWord(student);

  // 1. Incomplete Word (prefix match, e.g. සතුට -> සතු)
  if (studentGraphemes.length < targetGraphemes.length && target.startsWith(student)) {
    const missingPart = targetGraphemes.slice(studentGraphemes.length).join('');
    return {
      isCorrect: false,
      errorType: 'INCOMPLETE_WORD',
      category: 'Incompletion',
      missingSegment: missingPart,
      feedbackSi: `වචනය අසම්පූර්ණයි. "${missingPart}" අකුරද ලියන්න.`,
      feedbackEn: `Incomplete word. Missing suffix: ${missingPart}`
    };
  }

  // 2. Missing Character / Omission (e.g. සතුට -> සතට)
  if (studentGraphemes.length < targetGraphemes.length) {
    const missingList = targetGraphemes.filter(char => !studentGraphemes.includes(char));
    const missingStr = missingList.join(', ') || 'අකුරක්';
    return {
      isCorrect: false,
      errorType: 'MISSING_CHARACTER',
      category: 'Omission',
      missingSegment: missingStr,
      feedbackSi: `අකුරක් අඩුවී ඇත. (${missingStr} පරීක්ෂා කරන්න)`,
      feedbackEn: `Missing character/diacritic: ${missingStr}`
    };
  }

  // 3. Extra Character / Insertion (e.g. සතුට -> සතුටු)
  if (studentGraphemes.length > targetGraphemes.length) {
    const extraList = studentGraphemes.filter(char => !targetGraphemes.includes(char));
    const extraStr = extraList.join(', ') || 'අමතර අකුරක්';
    return {
      isCorrect: false,
      errorType: 'EXTRA_CHARACTER',
      category: 'Insertion',
      extraSegment: extraStr,
      feedbackSi: `අමතර අකුරක් ලියා ඇත (${extraStr}). එය ඉවත් කරන්න.`,
      feedbackEn: `Extra character added: ${extraStr}`
    };
  }

  // 4. Character Order Error / Transposition (e.g. සතුට -> සටුත)
  const sortedTarget = [...targetGraphemes].sort().join('');
  const sortedStudent = [...studentGraphemes].sort().join('');
  if (sortedTarget === sortedStudent) {
    return {
      isCorrect: false,
      errorType: 'CHARACTER_ORDER_ERROR',
      category: 'Transposition',
      feedbackSi: 'අකුරු වල අනුපිළිවෙල වැරදියි. නිවැරදි පිළිවෙළට සකසන්න.',
      feedbackEn: 'Character order is jumbled.'
    };
  }

  // 5. Character Substitution / Confusion (e.g. සතුට -> සතුත, or ක -> ත)
  const diffs = [];
  for (let i = 0; i < targetGraphemes.length; i++) {
    if (targetGraphemes[i] !== studentGraphemes[i]) {
      diffs.push({ expected: targetGraphemes[i], given: studentGraphemes[i] });
    }
  }

  const diffSummary = diffs.map(d => `"${d.given || '?'}" වෙනුවට "${d.expected}"`).join(', ');

  return {
    isCorrect: false,
    errorType: 'CHARACTER_SUBSTITUTION',
    category: 'Substitution',
    diffs,
    feedbackSi: `වැරදි අකුරක් භාවිත කර ඇත (${diffSummary}).`,
    feedbackEn: `Character substitution: Expected ${diffs.map(d => d.expected).join(', ')}`
  };
}
