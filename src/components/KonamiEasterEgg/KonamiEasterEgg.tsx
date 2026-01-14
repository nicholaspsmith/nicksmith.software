import { useEffect, useRef, useState } from 'react';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import styles from './KonamiEasterEgg.module.css';

/**
 * KonamiEasterEgg - Shows Ryu's Hadouken when Konami code is entered
 *
 * Konami Code: Up, Up, Down, Down, Left, Right, Left, Right, B, A
 * Also available via hadouken() in browser console (toggles on/off)
 */
export function KonamiEasterEgg() {
  const konamiTriggered = useKonamiCode();
  const [manualToggle, setManualToggle] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gifKeyRef = useRef(Date.now());

  // Expose hadouken() function to browser console
  useEffect(() => {
    // @ts-expect-error - Debug function for browser console
    window.hadouken = () => {
      setManualToggle((prev) => {
        const next = !prev;
        console.log(next ? 'HADOUKEN!' : 'Hadouken disabled');
        return next;
      });
    };
    return () => {
      // @ts-expect-error - Debug function cleanup
      delete window.hadouken;
    };
  }, []);

  // Determine if we should show (konami auto-dismisses, manual stays until toggled off)
  const isVisible = konamiTriggered || manualToggle;

  // Play sound when triggered (either way) - with 500ms delay
  useEffect(() => {
    let audioTimeout: ReturnType<typeof setTimeout>;

    if (isVisible) {
      // Update gif key to restart animation
      gifKeyRef.current = Date.now();
      // Play the hadouken sound after 500ms delay
      audioTimeout = setTimeout(() => {
        audioRef.current = new Audio('/konami/hadouken.mp3');
        audioRef.current.play().catch(() => {
          // Ignore autoplay errors
        });
      }, 500);
    }

    return () => {
      clearTimeout(audioTimeout);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={styles.overlay} style={manualToggle ? { animation: 'none', opacity: 1 } : undefined}>
      <img
        src="/konami/ryu-hadouken.gif"
        alt="Hadouken!"
        className={styles.hadouken}
        key={gifKeyRef.current}
      />
    </div>
  );
}
