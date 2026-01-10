import styles from './TrafficLights.module.css';

export interface TrafficLightsProps {
  isFocused: boolean;
  compact?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onZoom?: () => void;
}

/**
 * Close icon (X) - appears on hover
 * Refined dimensions to match Tiger reference
 */
function CloseIcon() {
  return (
    <svg viewBox="0 0 8 8" width="8" height="8" className={styles.icon}>
      <path
        d="M2 2L6 6M6 2L2 6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Minimize icon (horizontal line) - appears on hover
 * Refined dimensions to match Tiger reference
 */
function MinimizeIcon() {
  return (
    <svg viewBox="0 0 8 8" width="8" height="8" className={styles.icon}>
      <path
        d="M1.5 4H6.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Zoom icon (plus) - appears on hover
 * Refined dimensions to match Tiger reference
 */
function ZoomIcon() {
  return (
    <svg viewBox="0 0 8 8" width="8" height="8" className={styles.icon}>
      <path
        d="M4 1.5V6.5M1.5 4H6.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * TrafficLights component - Tiger-style window control buttons
 *
 * Renders the iconic red/yellow/green buttons for close, minimize, zoom.
 * Shows symbols on hover (group hover behavior) and shows outlines when unfocused.
 */
export function TrafficLights({
  isFocused,
  compact = false,
  onClose,
  onMinimize,
  onZoom,
}: TrafficLightsProps) {
  const containerClass = `${styles.container} ${isFocused ? styles.focused : styles.unfocused} ${compact ? styles.compact : ''}`;

  const handleClick = (
    e: React.MouseEvent,
    handler?: () => void
  ) => {
    e.stopPropagation(); // Prevent window drag
    handler?.();
  };

  return (
    <div className={containerClass} data-testid="traffic-lights">
      <button
        type="button"
        className={`${styles.button} ${styles.close}`}
        onClick={(e) => handleClick(e, onClose)}
        aria-label="Close window"
        data-testid="traffic-light-close"
      >
        <CloseIcon />
      </button>
      <button
        type="button"
        className={`${styles.button} ${styles.minimize}`}
        onClick={(e) => handleClick(e, onMinimize)}
        aria-label="Minimize window"
        data-testid="traffic-light-minimize"
      >
        <MinimizeIcon />
      </button>
      <button
        type="button"
        className={`${styles.button} ${styles.zoom}`}
        onClick={(e) => handleClick(e, onZoom)}
        aria-label="Zoom window"
        data-testid="traffic-light-zoom"
      >
        <ZoomIcon />
      </button>
    </div>
  );
}
