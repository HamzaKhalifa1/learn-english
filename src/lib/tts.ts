// High-quality Microsoft Edge Natural TTS player with browser synthesis fallback
let activeAudio: HTMLAudioElement | null = null;

export interface TTSOptions {
  voice?: 'en-US-AriaNeural' | 'en-US-JennyNeural' | 'en-US-GuyNeural' | 'en-US-ChristopherNeural' | string;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Plays text using Microsoft Edge Natural Neural voice via /api/tts.
 * Automatically falls back to native Web Speech API if offline or if Audio play fails.
 */
export function playTTS(text: string, options?: TTSOptions) {
  if (typeof window === 'undefined') return;

  const cleanText = text.trim();
  if (!cleanText) return;

  // Stop any ongoing playback
  stopTTS();

  const voice = options?.voice || 'en-US-AriaNeural';
  const url = `/api/tts?text=${encodeURIComponent(cleanText)}&voice=${encodeURIComponent(voice)}`;

  try {
    const audio = new Audio(url);
    activeAudio = audio;

    if (options?.onStart) {
      audio.onplay = () => options.onStart?.();
    }

    audio.onended = () => {
      if (activeAudio === audio) activeAudio = null;
      options?.onEnd?.();
    };

    audio.onerror = () => {
      // Graceful fallback to native browser Web Speech API
      fallbackToBrowserTTS(cleanText, options);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        fallbackToBrowserTTS(cleanText, options);
      });
    }
  } catch {
    fallbackToBrowserTTS(cleanText, options);
  }
}

/**
 * Immediately stops any playing speech (both Audio and Web Speech).
 */
export function stopTTS() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function fallbackToBrowserTTS(text: string, options?: TTSOptions) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;

  if (options?.onStart) utterance.onstart = () => options.onStart?.();
  if (options?.onEnd) utterance.onend = () => options.onEnd?.();
  utterance.onerror = () => options?.onEnd?.();

  window.speechSynthesis.speak(utterance);
}
