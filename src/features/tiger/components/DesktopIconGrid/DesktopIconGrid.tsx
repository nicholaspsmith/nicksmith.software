import { SACRED } from '../../constants/sacred';
import styles from './DesktopIconGrid.module.css';

export interface DesktopIconGridProps {
  children: React.ReactNode;
}

/**
 * DesktopIconGrid component - Container for desktop icons
 *
 * Positions icons in a top-right, column-first grid layout
 * authentic to Mac OS X Tiger. Icons flow from top to bottom,
 * then right to left as columns fill.
 *
 * Grid positioning:
 * - Starts 20px from right edge, 40px from top (per sacred values)
 * - Each cell is 80x90px
 * - Icons flow column-first (top-to-bottom, then right-to-left)
 */
export function DesktopIconGrid({ children }: DesktopIconGridProps) {
  return (
    <div
      className={styles.grid}
      data-testid="desktop-icon-grid"
      style={{
        top: SACRED.iconGridTopMargin,
        right: SACRED.iconGridRightMargin,
        gridAutoRows: SACRED.iconGridCellHeight,
        gridTemplateColumns: `repeat(auto-fill, ${SACRED.iconGridCellWidth}px)`,
      }}
    >
      {children}
    </div>
  );
}
