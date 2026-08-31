/**
 * sinhalaTts.js
 * Robust Sinhala Voice & Speech Synthesis Utility
 * Uses Async/Await sequential audio streaming with HTML5 Audio & multi-layer fallback.
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
 * Cleans Sinhala text so Google TTS pronounces every word accurately without glitching on symbols
 */
export function cleanSinhalaTextForTts(text) {
  if (!text) return '';
  return text
    .replace(/[“”"']/g, ' ')
    .replace(/[()[\]{}]/g, ' ')
    .replace(/[/]/g, ' , ') // Convert / (slash) to comma pause so (කයි / බත් / පුතා) reads "කයි, බත්, පුතා"
    .replace(/[:;]/g, ' , ')
    .replace(/[-–—_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Internal async function that plays one audio sentence and resolves ONLY when playback is completely finished
 */
function playAudioPromise(rawText) {
  const text = cleanSinhalaTextForTts(rawText);
  return new Promise((resolve) => {
    if (!text || isNarrationCancelled) {
      resolve();
      return;
    }

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
    const urls = [
      `/api/tts/sinhala?text=${encoded}`,
      `http://localhost:5000/api/tts/sinhala?text=${encoded}`
    ];

    let urlIdx = 0;
    let finished = false;

    const done = () => {
      if (!finished) {
        finished = true;
        resolve();
      }
    };

    const tryNextUrl = () => {
      if (isNarrationCancelled) {
        done();
        return;
      }

      if (urlIdx >= urls.length) {
        // Fallback to SpeechSynthesis
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'si-LK';
          utterance.rate = 0.85;
          utterance.pitch = 1.15;

          const fallbackTimer = setTimeout(() => {
            done();
          }, Math.max(1800, text.length * 140));

          utterance.onend = () => {
            clearTimeout(fallbackTimer);
            done();
          };
          utterance.onerror = () => {
            clearTimeout(fallbackTimer);
            done();
          };

          window.speechSynthesis.speak(utterance);
        } else {
          setTimeout(done, Math.max(1500, text.length * 100));
        }
        return;
      }

      const currentUrl = urls[urlIdx];
      urlIdx++;

      const audio = new Audio();
      activeSinhalaAudio = audio;

      audio.onended = () => {
        done();
      };

      audio.onerror = () => {
        tryNextUrl();
      };

      audio.src = currentUrl;
      audio.play().catch(() => {
        tryNextUrl();
      });
    };

    tryNextUrl();
  });
}

/**
 * Public function to speak a single text string
 */
export function speakSinhalaAudio(rawText, onEnded = null) {
  stopSinhalaAudio();
  isNarrationCancelled = false;
  playAudioPromise(rawText).then(() => {
    if (!isNarrationCancelled && onEnded) {
      onEnded();
    }
  });
}

/**
 * Reads the question prompt and then sequentially options 1, 2, 3, 4 with guaranteed sequential completion
 */
export async function speakQuestionWithAnswers(question, onStepChange = null, onComplete = null) {
  if (!question) return;
  stopSinhalaAudio();
  isNarrationCancelled = false;

  const items = [];

  if (question.passage) {
    items.push({
      step: -1,
      text: question.passage
    });
  }

  const promptText = question.audioPrompt || question.prompt || '';
  if (promptText) {
    items.push({
      step: -1,
      text: promptText
    });
  }

  if (question.options && Array.isArray(question.options)) {
    question.options.forEach((opt, idx) => {
      items.push({
        step: idx,
        text: `${idx + 1}. ${opt}`
      });
    });
  }

  for (let i = 0; i < items.length; i++) {
    if (isNarrationCancelled) break;
    const item = items[i];

    if (onStepChange) onStepChange(item.step);
    await playAudioPromise(item.text);

    if (isNarrationCancelled) break;
    // Short natural pause between question and choices
    await new Promise((r) => setTimeout(r, 350));
  }

  if (onStepChange) onStepChange(null);
  if (!isNarrationCancelled && onComplete) onComplete();
}
