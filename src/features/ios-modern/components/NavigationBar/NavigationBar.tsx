import { motion } from 'motion/react';
import styles from './NavigationBar.module.css';

interface NavigationBarProps {
  /** Title text */
  title: string;
  /** Back button click handler */
  onBack: () => void;
  /** Back button label (default: "Back") */
  backLabel?: string;
  /** Whether to use transparent style (for dark backgrounds) */
  transparent?: boolean;
  /** Whether to use large title style */
  largeTitle?: boolean;
  /** Whether to use solid white style (no blur, fully opaque) */
  solid?: boolean;
}

/**
 * NavigationBar - iOS 15+ navigation bar with back button
 *
 * Features:
 * - Back chevron with label
 * - Centered or large title
 * - Frosted glass blur effect
 * - Transparent variant for dark backgrounds
 */
export function NavigationBar({
  title,
  onBack,
  backLabel = 'Back',
  transparent = false,
  largeTitle = false,
  solid = false,
}: NavigationBarProps) {
  const classNames = [
    styles.navBar,
    transparent && styles.transparent,
    largeTitle && styles.largeTitle,
    solid && styles.solid,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      <motion.button
        className={styles.backButton}
        onClick={onBack}
        whileTap={{ scale: 0.95 }}
      >
        <BackChevron transparent={transparent} />
        <span>{backLabel}</span>
      </motion.button>
      <span className={styles.title}>{title}</span>
    </div>
  );
}

/**
 * Back chevron SVG icon
 */
function BackChevron({ transparent }: { transparent?: boolean }) {
  const color = transparent ? '#fff' : '#007AFF';
  return (
    <svg
      className={styles.backChevron}
      viewBox="0 0 12 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 2L2 10L10 18"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
