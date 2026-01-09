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
      {/* Overlay that fades in/out */}
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
            {/* Apple logo silhouette during transition */}
            <div className={styles.logo} aria-hidden="true">
              <AppleLogo />
            </div>
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
 * Simple Apple logo SVG for the transition screen
 */
function AppleLogo() {
  return (
    <svg
      width="80"
      height="96"
      viewBox="0 0 170 200"
      fill="currentColor"
      className={styles.appleLogo}
    >
      <path d="M150.4 172.3c-3.8 8.3-8.2 16-13.3 23-6.9 9.5-12.5 16.1-16.8 19.8-6.7 6.1-13.9 9.2-21.6 9.4-5.5 0-12.2-1.6-20-4.8-7.8-3.2-15-4.8-21.6-4.8-6.9 0-14.3 1.6-22.2 4.8-7.9 3.2-14.3 4.9-19.1 5.1-7.4.4-14.8-2.8-22.2-9.6-4.7-4-10.5-10.8-17.6-20.6-7.5-10.5-13.7-22.6-18.6-36.5C4.6 143.9 2 130.2 2 116.9c0-15.2 3.3-28.3 9.9-39.3 5.2-8.8 12.1-15.8 20.8-20.9 8.7-5.1 18.1-7.7 28.2-7.9 5.9 0 13.6 1.8 23.2 5.4 9.6 3.6 15.7 5.4 18.4 5.4 2 0 8.8-2.1 20.3-6.3 10.9-3.9 20.1-5.5 27.6-4.8 20.4 1.6 35.7 9.6 45.8 24-18.3 11.1-27.3 26.6-27.1 46.5.2 15.5 5.8 28.4 16.7 38.7 5 4.7 10.5 8.4 16.6 11-1.3 3.9-2.8 7.6-4.4 11.2zM118.1 7.3c0 12.2-4.4 23.5-13.3 34-10.7 12.5-23.6 19.8-37.6 18.6-.2-1.5-.3-3.1-.3-4.8 0-11.7 5.1-24.2 14.1-34.4 4.5-5.1 10.2-9.4 17.1-12.8 6.9-3.4 13.4-5.2 19.5-5.6.2 1.7.3 3.4.3 5z" />
    </svg>
  );
}
