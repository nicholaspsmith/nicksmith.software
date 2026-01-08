import { TrafficLights } from '../TrafficLights';
import styles from './WindowChrome.module.css';

export interface WindowChromeProps {
  title: string;
  isFocused: boolean;
  className?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onZoom?: () => void;
}

/**
 * WindowChrome component - Tiger-style window title bar
 *
 * Renders the title bar with gradient background, centered title,
 * and focus/unfocus visual states. Serves as drag handle for window.
 */
export function WindowChrome({
  title,
  isFocused,
  className,
  children,
  onClose,
  onMinimize,
  onZoom,
}: WindowChromeProps) {
  const titleBarClass = `${styles.titleBar} ${isFocused ? styles.focused : styles.unfocused} ${className || ''}`;

  return (
    <div className={styles.chrome} data-testid="window-chrome">
      <div className={titleBarClass} data-testid="title-bar">
        <TrafficLights
          isFocused={isFocused}
          onClose={onClose}
          onMinimize={onMinimize}
          onZoom={onZoom}
        />
        <span className={styles.title} data-testid="window-title">
          {title}
        </span>
        <div className={styles.spacer} />
      </div>
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
