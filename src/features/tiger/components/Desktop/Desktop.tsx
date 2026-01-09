import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppStore, type IconPosition } from '@/stores/appStore';
import { useWindowStore } from '@/stores/windowStore';
import { MenuBar } from '../MenuBar';
import { Dock } from '../Dock';
import { ContextMenu } from '../ContextMenu';
import { SelectionRectangle, calculateBounds } from '../SelectionRectangle';
import { SACRED } from '../../constants/sacred';
import styles from './Desktop.module.css';

export interface DesktopProps {
  children?: React.ReactNode;
  /** Icon positions for intersection detection during marquee select */
  iconPositions?: Record<string, IconPosition>;
  /** Callback when icons are selected via marquee */
  onIconsSelected?: (iconIds: string[]) => void;
}

/** Position for context menu */
interface ContextMenuPosition {
  x: number;
  y: number;
}

/** Selection rectangle state */
interface SelectionState {
  isSelecting: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

/**
 * Check if two rectangles intersect
 */
function rectanglesIntersect(
  r1: { left: number; top: number; width: number; height: number },
  r2: { left: number; top: number; width: number; height: number }
): boolean {
  return !(
    r1.left + r1.width < r2.left ||
    r2.left + r2.width < r1.left ||
    r1.top + r1.height < r2.top ||
    r2.top + r2.height < r1.top
  );
}

/**
 * Desktop component - The root visual layer of the Tiger UI
 *
 * Renders the Aqua blue background that fills the viewport,
 * serving as the container for all desktop elements (icons, windows).
 * Includes the MenuBar fixed at the top.
 *
 * Features:
 * - Click to clear icon selection and deactivate windows
 * - Right-click (or Ctrl+click) to show Tiger-style context menu
 * - Click and drag to draw selection rectangle (marquee select)
 */
export function Desktop({ children, iconPositions, onIconsSelected }: DesktopProps) {
  const clearSelection = useAppStore((s) => s.clearSelection);
  const resetIconPositions = useAppStore((s) => s.resetIconPositions);
  const clearActiveWindow = useWindowStore((s) => s.clearActiveWindow);
  const desktopRef = useRef<HTMLDivElement>(null);

  // Track if we just finished a marquee selection (to prevent click from clearing)
  const justFinishedMarquee = useRef(false);

  // Context menu state
  const [contextMenuPosition, setContextMenuPosition] = useState<ContextMenuPosition | null>(null);

  // Selection rectangle state
  const [selection, setSelection] = useState<SelectionState>({
    isSelecting: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  const handleClick = useCallback(() => {
    // Skip clearing if we just finished a marquee selection
    if (justFinishedMarquee.current) {
      justFinishedMarquee.current = false;
      return;
    }
    clearSelection();
    clearActiveWindow();
  }, [clearSelection, clearActiveWindow]);

  // Handle right-click to show context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Only show context menu if clicking on the desktop background itself
    // (not on children like windows or icons)
    if (e.target === e.currentTarget) {
      e.preventDefault();
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
    }
  }, []);

  // Close context menu
  const handleCloseContextMenu = useCallback(() => {
    setContextMenuPosition(null);
  }, []);

  // Handle mouse down to start selection rectangle
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start selection if left click on desktop background
    // Check if this is the desktop element itself (not children)
    if (e.button === 0 && e.target === e.currentTarget) {
      setSelection({
        isSelecting: true,
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
      });
      // Clear existing selection when starting new marquee
      clearSelection();
    }
  }, [clearSelection]);

  // Handle mouse move during selection
  useEffect(() => {
    if (!selection.isSelecting) return;

    const handleMouseMove = (e: MouseEvent) => {
      setSelection((prev) => ({
        ...prev,
        currentX: e.clientX,
        currentY: e.clientY,
      }));

      // Real-time selection: find icons within rectangle as we drag
      if (iconPositions && onIconsSelected) {
        const selectionBounds = calculateBounds(
          selection.startX,
          selection.startY,
          e.clientX,
          e.clientY
        );

        const selectedIds: string[] = [];
        for (const [iconId, pos] of Object.entries(iconPositions)) {
          const iconBounds = {
            left: pos.x,
            top: pos.y,
            width: SACRED.iconGridCellWidth,
            height: SACRED.iconGridCellHeight,
          };

          if (rectanglesIntersect(selectionBounds, iconBounds)) {
            selectedIds.push(iconId);
          }
        }

        onIconsSelected(selectedIds);
      }
    };

    const handleMouseUp = () => {
      // Mark that we just finished a marquee selection
      // This prevents the click handler from clearing the selection
      justFinishedMarquee.current = true;
      setSelection((prev) => ({
        ...prev,
        isSelecting: false,
      }));
    };

    // Listen on window for mouse events (to capture even when mouse leaves desktop)
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selection.isSelecting, selection.startX, selection.startY, iconPositions, onIconsSelected]);

  return (
    <div
      ref={desktopRef}
      className={styles.desktop}
      data-testid="desktop"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      <MenuBar />
      {children}
      <Dock />

      {/* Selection rectangle (marquee select) */}
      {selection.isSelecting && (
        <SelectionRectangle
          startX={selection.startX}
          startY={selection.startY}
          currentX={selection.currentX}
          currentY={selection.currentY}
        />
      )}

      {/* Context menu (portal-rendered) */}
      {contextMenuPosition && (
        <ContextMenu
          x={contextMenuPosition.x}
          y={contextMenuPosition.y}
          onClose={handleCloseContextMenu}
          onCleanUp={resetIconPositions}
        />
      )}
    </div>
  );
}
