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

export function speakSinhalaAudio(text, onEnded = null) {
  if (!text) return;
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

  const encoded = encodeURIComponent(text.trim());
  const backendUrl = `http://localhost:5000/api/tts/sinhala?text=${encoded}`;
  const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=si&client=tw-ob&q=${encoded}`;

  const audio = new Audio();
  activeSinhalaAudio = audio;

  const handleEnd = () => {
    if (!isNarrationCancelled && onEnded) onEnded();
  };

  audio.onended = handleEnd;
  audio.onerror = () => {
    // Fallback to SpeechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'si-LK';
      utterance.rate = 0.85;
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
        utterance.rate = 0.85;
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
 * Reads the full question and all 4 options sequentially in natural Sinhala
 */
export function speakQuestionWithAnswers(question, onComplete = null) {
  if (!question) return;
  stopSinhalaAudio();
  isNarrationCancelled = false;

  const ordinalLabels = ['පළමු පිළිතුර', 'දෙවන පිළිතුර', 'තුන්වන පිළිතුර', 'හතරවන පිළිතුර'];
  
  const speechQueue = [
    `ප්‍රශ්නය: ${question.audioPrompt || question.prompt || ''}`
  ];

  if (question.passage) {
    speechQueue.unshift(`ඡේදය: ${question.passage}`);
  }

  if (question.options && Array.isArray(question.options)) {
    question.options.forEach((opt, idx) => {
      const label = ordinalLabels[idx] || `පිළිතුර ${idx + 1}`;
      speechQueue.push(`${label}. ${opt}`);
    });
  }

  let queueIdx = 0;
  const playNextItem = () => {
    if (isNarrationCancelled || queueIdx >= speechQueue.length) {
      if (onComplete) onComplete();
      return;
    }
    const currentText = speechQueue[queueIdx];
    queueIdx++;
    speakSinhalaAudio(currentText, playNextItem);
  };

  playNextItem();
}
