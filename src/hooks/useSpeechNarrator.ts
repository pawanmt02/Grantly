/**
 * @file useSpeechNarrator.ts
 * @description Native Web Speech API narrator hook for Accessibility (WCAG 2.1 compliance).
 * Enables visually impaired and neurodivergent students to hear scholarship requirements and match explanations.
 */

import { useState, useEffect, useCallback } from 'react';

export function useSpeechNarrator() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any active speech

    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { speak, stop, isSpeaking, isSupported };
}
