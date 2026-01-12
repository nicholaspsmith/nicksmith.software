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
 * Apple logo using PNG images (stem + body)
 * Matches the RestartScreen appearance
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
