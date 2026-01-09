/**
 * SelectionRectangle - Tiger-style marquee selection box
 *
 * Renders a semi-transparent blue rectangle during click-drag
 * selection on the desktop. Used to select multiple icons at once.
 */

import styles from './SelectionRectangle.module.css';

export interface SelectionRectangleProps {
  /** Starting X coordinate (mousedown position) */
  startX: number;
  /** Starting Y coordinate (mousedown position) */
  startY: number;
  /** Current X coordinate (mousemove position) */
  currentX: number;
  /** Current Y coordinate (mousemove position) */
  currentY: number;
}

/**
 * Calculate rectangle bounds from two points
 * Handles all four drag directions (up-left, up-right, down-left, down-right)
 */
function calculateBounds(startX: number, startY: number, currentX: number, currentY: number) {
  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  return { left, top, width, height };
}

export function SelectionRectangle({
  startX,
  startY,
  currentX,
  currentY,
}: SelectionRectangleProps) {
  const { left, top, width, height } = calculateBounds(startX, startY, currentX, currentY);

  // Don't render if rectangle is too small (prevents flash on click)
  if (width < 3 && height < 3) {
    return null;
  }

  return (
    <div
      className={styles.selectionRectangle}
      data-testid="selection-rectangle"
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  );
}

/**
 * Export bounds calculation for use in intersection detection
 */
export { calculateBounds };
