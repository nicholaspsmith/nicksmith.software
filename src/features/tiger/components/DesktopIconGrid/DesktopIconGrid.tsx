import { SACRED } from '../../constants/sacred';
import styles from './DesktopIconGrid.module.css';

export interface DesktopIconGridProps {
  children: React.ReactNode;
}

/**
 * DesktopIconGrid component - Container for desktop icons
 *
 * Positions icons in a single vertical column on the right side
 * of the screen, authentic to Mac OS X Tiger desktop layout.
 *
 * Positioning:
 * - Starts 20px from right edge, 40px from top (per sacred values)
 * - Icons stack vertically from top to bottom
 */
export function DesktopIconGrid({ children }: DesktopIconGridProps) {
  return (
    <div
      className={styles.grid}
      data-testid="desktop-icon-grid"
      style={{
        top: SACRED.iconGridTopMargin,
        right: SACRED.iconGridRightMargin,
      }}
    >
      {children}
    </div>
  );
}
