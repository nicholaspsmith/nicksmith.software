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
 * Apple logo SVG - darker gray on light gray background
 * Matches authentic Tiger boot screen appearance
 */
function AppleLogo() {
  return (
    <svg
      className={styles.logo}
      width="81"
      height="100"
      viewBox="0 0 814 1000"
      fill="#808080"
      aria-hidden="true"
    >
      {/* Apple body */}
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 781.5 0 643.7 0 515.2c0-213.5 138.4-327.2 274.4-327.2 72.2 0 132.3 47.4 177.5 47.4 43.3 0 110.6-50.4 193.4-50.4 31.3 0 143.8 2.8 218.8 106.9z" />
      {/* Apple leaf */}
      <path d="M554.1 0c4.5 75.3-22.2 149.3-62.3 200.6-43.6 56-112 96.5-180.3 91.2-6.7-72.2 26.5-148.1 65.9-195.3C423.8 42.4 498.3 4.5 554.1 0z" />
    </svg>
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
