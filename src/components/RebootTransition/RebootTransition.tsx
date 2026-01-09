import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './RebootTransition.module.css';

export interface RebootTransitionProps {
  /** The current viewport mode */
  mode: 'ios' | 'fallback' | 'desktop';
  /** The content to render */
  children: ReactNode;
  /** Whether to skip transition on initial render */
  skipInitial?: boolean;
  /** Duration of fade out in ms */
  fadeOutDuration?: number;
  /** Duration of black screen in ms */
  holdDuration?: number;
  /** Duration of fade in in ms */
  fadeInDuration?: number;
}

/**
 * RebootTransition - Animated transition between viewport modes
 *
 * When the viewport crosses breakpoints (iOS <-> Desktop/Fallback),
 * this component plays a "reboot" animation:
 * 1. Fade to black
 * 2. Brief pause (simulating startup)
 * 3. Fade in the new experience
 *
 * This makes context switches feel intentional rather than jarring.
 */
export function RebootTransition({
  mode,
  children,
  skipInitial = true,
  fadeOutDuration = 300,
  holdDuration = 400,
  fadeInDuration = 500,
}: RebootTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayMode, setDisplayMode] = useState(mode);
  const prevModeRef = useRef<string | null>(null);
  const isInitialRef = useRef(true);

  useEffect(() => {
    // Skip transition on initial render if requested
    if (isInitialRef.current) {
      isInitialRef.current = false;
      prevModeRef.current = mode;
      return;
    }

    const prevMode = prevModeRef.current;

    // Only trigger transition when crossing the iOS threshold
    // iOS <-> Desktop/Fallback transitions get the reboot effect
    // Desktop <-> Fallback doesn't need it (same general experience)
    const crossedIosThreshold =
      (prevMode === 'ios' && mode !== 'ios') ||
      (prevMode !== 'ios' && mode === 'ios');

    if (crossedIosThreshold && !skipInitial) {
      // Start transition sequence
      setIsTransitioning(true);

      // After fade out + hold, update display mode
      const updateTimeout = setTimeout(() => {
        setDisplayMode(mode);
      }, fadeOutDuration + holdDuration / 2);

      // End transition after full sequence
      const endTimeout = setTimeout(() => {
        setIsTransitioning(false);
      }, fadeOutDuration + holdDuration + fadeInDuration);

      prevModeRef.current = mode;

      return () => {
        clearTimeout(updateTimeout);
        clearTimeout(endTimeout);
      };
    } else if (crossedIosThreshold) {
      // Skip animation but still transition
      setDisplayMode(mode);
      prevModeRef.current = mode;
    } else {
      // No iOS threshold crossed, just update immediately
      setDisplayMode(mode);
      prevModeRef.current = mode;
    }
  }, [mode, skipInitial, fadeOutDuration, holdDuration, fadeInDuration]);

  return (
    <>
      {/* Overlay that fades in/out - Tiger-style gray boot screen */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeOutDuration / 1000 }}
            data-testid="reboot-overlay"
          >
            <AppleLogo />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content with key to force remount on mode change */}
      <div
        className={styles.content}
        key={displayMode}
        data-testid="reboot-content"
        data-mode={displayMode}
      >
        {children}
      </div>
    </>
  );
}

/**
 * Apple logo SVG for Tiger boot screen
 * Darker gray on light gray background - matches Loading-Screen-No-Spinner.png
 */
function AppleLogo() {
  return (
    <svg
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
