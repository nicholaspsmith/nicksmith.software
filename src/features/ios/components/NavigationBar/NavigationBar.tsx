import styles from './NavigationBar.module.css';

export interface NavigationBarProps {
  /** Title displayed in the center */
  title: string;
  /** Back button label (e.g., "Home", "Back") */
  backLabel?: string;
  /** Handler for back button click */
  onBack?: () => void;
  /** Optional right-side button label */
  rightLabel?: string;
  /** Handler for right button click */
  onRightAction?: () => void;
  /** Background color variant */
  variant?: 'blue' | 'gray' | 'wood';
}

/**
 * iOS 6 Navigation Bar
 *
 * The characteristic navigation bar with:
 * - Glossy gradient background
 * - Back button with chevron on left
 * - Centered title
 * - Optional right action button
 */
export function NavigationBar({
  title,
  backLabel = 'Back',
  onBack,
  rightLabel,
  onRightAction,
  variant = 'blue',
}: NavigationBarProps) {
  return (
    <nav
      className={`${styles.navBar} ${styles[variant]}`}
      data-testid="ios-nav-bar"
      data-variant={variant}
    >
      {/* Back button */}
      {onBack && (
        <button
          className={styles.backButton}
          onClick={onBack}
          aria-label={`Go back to ${backLabel}`}
          data-testid="ios-nav-back"
        >
          <span className={styles.backChevron} aria-hidden="true">
            ‹
          </span>
          <span className={styles.backLabel}>{backLabel}</span>
        </button>
      )}

      {/* Title */}
      <h1 className={styles.title}>{title}</h1>

      {/* Right action button */}
      {rightLabel && onRightAction && (
        <button
          className={styles.rightButton}
          onClick={onRightAction}
          data-testid="ios-nav-right"
        >
          {rightLabel}
        </button>
      )}
    </nav>
  );
}
