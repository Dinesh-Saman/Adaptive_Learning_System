/**
 * sinhalaTts.js
 * High-quality Sinhala Voice & Speech Synthesis Utility
 * Supports streaming female Sinhala audio with HTML5 Audio, Google TTS, and Web Speech Synthesis fallbacks.
 */

let activeSinhalaAudio = null;
let isNarrationCancelled = false;

export function stopSinhalaAudio() {
  isNarrationCancelled = true;
  if (activeSinhalaAudio) {
    try {
      activeSinhalaAudio.pause();
      activeSinhalaAudio.src = '';
    } catch (e) {}
    activeSinhalaAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Cleans and formats Sinhala text for clear, natural TTS pronunciation
 */
export function cleanSinhalaTextForTts(text) {
  if (!text) return '';
  return text
    .replace(/[“”"']/g, ' ')
    .replace(/[()[\]{}]/g, ' ')
    .replace(/[:;]/g, ', ')
    .replace(/[-–—_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Speaks a single phrase or sentence
 */
export function speakSinhalaAudio(rawText, onEnded = null) {
  const text = cleanSinhalaTextForTts(rawText);
  if (!text) {
    if (onEnded) onEnded();
    return;
  }

  isNarrationCancelled = false;

  if (activeSinhalaAudio) {
    try {
      activeSinhalaAudio.pause();
      activeSinhalaAudio.src = '';
    } catch (e) {}
    activeSinhalaAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const encoded = encodeURIComponent(text);
  const backendUrl = `http://localhost:5000/api/tts/sinhala?text=${encoded}`;
  const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=si&client=tw-ob&q=${encoded}`;

  const audio = new Audio();
  activeSinhalaAudio = audio;

  const handleEnd = () => {
    if (!isNarrationCancelled && onEnded) {
      onEnded();
    }
  };

  audio.onended = handleEnd;
  audio.onerror = () => {
    // Fallback to SpeechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'si-LK';
      utterance.rate = 0.82;
      utterance.pitch = 1.15;
      utterance.onend = handleEnd;
      utterance.onerror = handleEnd;
      window.speechSynthesis.speak(utterance);
    } else {
      handleEnd();
    }
  };

  audio.src = backendUrl;
  audio.play().catch(() => {
    audio.src = googleUrl;
    audio.play().catch(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'si-LK';
        utterance.rate = 0.82;
        utterance.pitch = 1.15;
        utterance.onend = handleEnd;
        utterance.onerror = handleEnd;
        window.speechSynthesis.speak(utterance);
      } else {
        handleEnd();
      }
    });
  });
}

/**
 * Reads the question prompt and then sequentially each of the 4 options in exact order (1, 2, 3, 4)
 * Triggers onStepChange(stepIndex) where:
 *   -1 : Reading question prompt / passage
 *    0 : Reading Option 1
 *    1 : Reading Option 2
 *    2 : Reading Option 3
 *    3 : Reading Option 4
 *  null : Finished / Idle
 */
export function speakQuestionWithAnswers(question, onStepChange = null, onComplete = null) {
  if (!question) return;
  stopSinhalaAudio();
  isNarrationCancelled = false;

  const numberLabels = ['අංක එක', 'අංක දෙක', 'අංක තුන', 'අංක හතර'];

  const speechItems = [];

  if (question.passage) {
    speechItems.push({
      step: -1,
      text: `ඡේදය: ${cleanSinhalaTextForTts(question.passage)}`
    });
  }

  const promptText = question.audioPrompt || question.prompt || '';
  speechItems.push({
    step: -1,
    text: `ප්‍රශ්නය: ${cleanSinhalaTextForTts(promptText)}`
  });

  if (question.options && Array.isArray(question.options)) {
    question.options.forEach((opt, idx) => {
      const label = numberLabels[idx] || `පිළිතුර ${idx + 1}`;
      speechItems.push({
        step: idx,
        text: `${label}. ${cleanSinhalaTextForTts(opt)}`
      });
    });
  }

  let curIdx = 0;

  const playNext = () => {
    if (isNarrationCancelled || curIdx >= speechItems.length) {
      if (onStepChange) onStepChange(null);
      if (onComplete) onComplete();
      return;
    }

    const item = speechItems[curIdx];
    curIdx++;

    if (onStepChange) onStepChange(item.step);

    // Small natural pause between items
    speakSinhalaAudio(item.text, () => {
      if (isNarrationCancelled) {
        if (onStepChange) onStepChange(null);
        return;
      }
      setTimeout(playNext, 250);
    });
  };

  playNext();
}
