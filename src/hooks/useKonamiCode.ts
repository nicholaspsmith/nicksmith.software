import { useEffect, useState, useCallback } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

/**
 * Hook that detects the Konami code sequence
 * Returns true when the code is successfully entered
 */
export function useKonamiCode(): boolean {
  const [triggered, setTriggered] = useState(false);
  const [inputSequence, setInputSequence] = useState<string[]>([]);

  const resetTriggered = useCallback(() => {
    setTriggered(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...inputSequence, e.code].slice(-KONAMI_CODE.length);
      setInputSequence(newSequence);

      // Check if the sequence matches
      if (newSequence.length === KONAMI_CODE.length) {
        const isMatch = newSequence.every((key, i) => key === KONAMI_CODE[i]);
        if (isMatch) {
          setTriggered(true);
          setInputSequence([]);
          // Auto-reset after animation plays (gif is ~2 seconds)
          setTimeout(resetTriggered, 2500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputSequence, resetTriggered]);

  return triggered;
}
