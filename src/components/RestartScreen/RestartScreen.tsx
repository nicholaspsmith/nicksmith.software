import { useEffect } from 'react';
import { motion } from 'motion/react';
import styles from './RestartScreen.module.css';

export interface RestartScreenProps {
  /** Callback when restart animation completes */
  onComplete: () => void;
  /** Duration to show the screen before completing (in ms) */
  duration?: number;
}

/**
 * RestartScreen - Mac OS X Tiger boot/restart screen
 *
 * Shows gray screen with Apple logo and spinning indicator,
 * then triggers a page reload after the specified duration.
 */
export function RestartScreen({ onComplete, duration = 2000 }: RestartScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      data-testid="restart-screen"
    >
      <div className={styles.content}>
        <AppleLogo />
        <LoadingSpinner />
      </div>
    </motion.div>
  );
}

/**
 * Apple logo using PNG images (stem + body)
 * Matches authentic Tiger boot screen appearance
 */
function AppleLogo() {
  return (
    <div className={styles.logo} aria-hidden="true">
      <img
        src="/icons/apple-stem.png"
        alt=""
        className={styles.appleStem}
        draggable={false}
      />
      <img
        src="/icons/apple-bottom.png"
        alt=""
        className={styles.appleBody}
        draggable={false}
      />
    </div>
  );
}

/**
 * Loading spinner - Tiger-style spinning gear/progress indicator
 * Appears beneath the Apple logo during boot/restart
 */
function LoadingSpinner() {
  return (
    <div className={styles.spinnerContainer}>
      <svg
        className={styles.spinner}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        {/* Create 12 spokes like Tiger's progress spinner */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = i * 30;
          const opacity = 1 - (i * 0.08);
          return (
            <rect
              key={i}
              x="14.5"
              y="2"
              width="3"
              height="8"
              rx="1.5"
              fill="#666"
              opacity={opacity}
              transform={`rotate(${angle} 16 16)`}
            />
          );
        })}
      </svg>
    </div>
  );
}
