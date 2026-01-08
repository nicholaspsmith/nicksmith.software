import { useEffect } from 'react';
import { useSoundStore } from '@/stores/soundStore';

/**
 * useStartupChime - Plays the Mac startup chime on first user interaction
 *
 * Due to browser autoplay policies, audio can only play after a user gesture.
 * This hook listens for the first click/touch/keypress and plays the chime.
 * The chime only plays once per session.
 */
export function useStartupChime(): void {
  const playStartupChime = useSoundStore((s) => s.playStartupChime);
  const startupChimePlayed = useSoundStore((s) => s.startupChimePlayed);

  useEffect(() => {
    // Don't add listeners if chime already played
    if (startupChimePlayed) return;

    const handleFirstInteraction = (): void => {
      playStartupChime();
      // Clean up all listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    // Listen for any user interaction
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [playStartupChime, startupChimePlayed]);
}
