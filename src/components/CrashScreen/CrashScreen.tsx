import { useEffect, useRef, useState } from 'react';
import styles from './CrashScreen.module.css';

interface CrashScreenProps {
  onComplete: () => void;
}

/**
 * CrashScreen - Simulates OS crash for rm -rf / easter egg
 *
 * Sequence:
 * 1. Play HAL 9000 audio
 * 2. Show Sad Mac icon at 200x200px in center
 * 3. Animate: grow to full width while fading to 0 opacity (3 seconds)
 * 4. Call onComplete to trigger restart
 */
export function CrashScreen({ onComplete }: CrashScreenProps) {
  const [showSadMac, setShowSadMac] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play HAL 9000 audio
    audioRef.current = new Audio('/sounds/hal-9000.mp3');
    audioRef.current.play().catch(() => {
      // Ignore autoplay errors
    });

    // Show Sad Mac after a brief delay for dramatic effect
    const showTimer = setTimeout(() => {
      setShowSadMac(true);
    }, 500);

    // Complete after animation (3s animation + 0.5s initial delay)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(completeTimer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [onComplete]);

  return (
    <div className={styles.overlay}>
      {showSadMac && (
        <img
          src="/icons/sad-mac.png"
          alt="Sad Mac"
          className={styles.sadMac}
        />
      )}
    </div>
  );
}
