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
  const windows = useWindowStore((s) => s.windows);
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
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

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Skip clearing if we just finished a marquee selection
    if (justFinishedMarquee.current) {
      justFinishedMarquee.current = false;
      return;
    }

    const target = e.target as HTMLElement;

    // Check if click is on or inside elements that should NOT unfocus windows
    const isMenuBar = target.closest('[data-testid="menu-bar"]');
    const isWindow = target.closest('[data-testid^="window-"]');
    const isContextMenu = target.closest('[data-testid="context-menu"]');

    // Never unfocus when clicking menu bar, windows, or context menu
    if (isMenuBar || isWindow || isContextMenu) {
      return;
    }

    // Get the active window's info for exception checking
    const activeWindow = activeWindowId ? windows.find((w) => w.id === activeWindowId) : null;

    // Check for dock click
    const dockElement = target.closest('[data-testid="dock"]');
    if (dockElement) {
      // Find which dock icon was clicked
      const dockIcon = target.closest('[data-testid^="dock-icon-"]');
      if (dockIcon && activeWindow) {
        const testId = dockIcon.getAttribute('data-testid') || '';
        // Extract the app/icon ID from data-testid="dock-icon-{id}"
        const dockItemId = testId.replace('dock-icon-', '').replace('app-', '');

        // Check if this dock item belongs to the active window's app
        // Dock items use parentApp IDs (e.g., 'finder', 'textEdit', 'terminal')
        if (dockItemId === activeWindow.parentApp || dockItemId === activeWindow.app) {
          // Clicking on the dock item of the active window's app - don't unfocus
          return;
        }

        // Also check if it's a minimized window thumbnail of the active window
        if (dockItemId === activeWindow.id) {
          return;
        }
      }
      // Clicking on dock but not on the active app's icon - unfocus
      clearActiveWindow();
      return;
    }

    // Check for desktop icon click
    const desktopIconElement = target.closest('[data-testid^="desktop-icon-"]');
    if (desktopIconElement) {
      if (activeWindow) {
        const testId = desktopIconElement.getAttribute('data-testid') || '';
        // Extract the icon ID from data-testid="desktop-icon-{id}"
        const iconAppId = testId.replace('desktop-icon-', '');

        // Check if this desktop icon is for the active window's app
        if (iconAppId === activeWindow.app) {
          // Clicking on the desktop icon of the active window - don't unfocus
          // But still don't clear selection (handled below)
          return;
        }
      }
      // Clicking on a different desktop icon - unfocus the window
      clearActiveWindow();
      return;
    }

    // Clicking on desktop background - clear selection and unfocus
    clearSelection();
    clearActiveWindow();
  }, [clearSelection, clearActiveWindow, activeWindowId, windows]);

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
      {/* Bounds container for windows - only constrains top (below menu bar) */}
      {/* Extends far beyond viewport on left/right/bottom to allow dragging off-screen */}
      <div
        id="window-bounds"
        style={{
          position: 'absolute',
          top: SACRED.menuBarHeight,
          left: -5000,
          width: 15000,
          height: 10000,
          pointerEvents: 'none',
        }}
      />
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
