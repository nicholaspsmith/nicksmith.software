import { useCallback } from 'react';
import { TrafficLights } from '../TrafficLights';
import styles from './WindowChrome.module.css';

export interface WindowChromeProps {
  title: string;
  titleId?: string;
  isFocused: boolean;
  isShaded?: boolean;
  compact?: boolean;
  /** Panel mode: minimize/zoom disabled, close is grey with X on hover */
  isPanel?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onZoom?: () => void;
  onShade?: () => void;
}

/**
 * WindowChrome component - Tiger-style window title bar
 *
 * Renders the title bar with gradient background, centered title,
 * and focus/unfocus visual states. Serves as drag handle for window.
 *
 * Double-clicking the title bar (not traffic lights) triggers window shade.
 */
export function WindowChrome({
  title,
  titleId,
  isFocused,
  isShaded = false,
  compact = false,
  isPanel = false,
  className,
  children,
  onClose,
  onMinimize,
  onZoom,
  onShade,
}: WindowChromeProps) {
  const titleBarClass = `${styles.titleBar} ${isFocused ? styles.focused : styles.unfocused} ${compact ? styles.compact : ''} ${className || ''}`;

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    // Only trigger shade if not clicking on traffic lights
    const target = e.target as HTMLElement;
    if (!target.closest('[data-testid="traffic-lights"]')) {
      onShade?.();
    }
  }, [onShade]);

  return (
    <div className={styles.chrome} data-testid="window-chrome">
      <div
        className={titleBarClass}
        data-testid="title-bar"
        onDoubleClick={handleDoubleClick}
      >
        <TrafficLights
          isFocused={isFocused}
          compact={compact}
          isPanel={isPanel}
          onClose={onClose}
          onMinimize={onMinimize}
          onZoom={onZoom}
        />
        <span id={titleId} className={styles.title} data-testid="window-title">
          {title}
        </span>
        <div className={styles.spacer} />
      </div>
      {!isShaded && children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
