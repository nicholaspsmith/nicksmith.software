import { useState, useCallback } from 'react';
import { useAppStore } from '@/stores/appStore';
import { useWindowStore } from '@/stores/windowStore';
import { MenuBar } from '../MenuBar';
import { Dock } from '../Dock';
import { ContextMenu } from '../ContextMenu';
import styles from './Desktop.module.css';

export interface DesktopProps {
  children?: React.ReactNode;
}

/** Position for context menu */
interface ContextMenuPosition {
  x: number;
  y: number;
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
 */
export function Desktop({ children }: DesktopProps) {
  const clearSelection = useAppStore((s) => s.clearSelection);
  const resetIconPositions = useAppStore((s) => s.resetIconPositions);
  const clearActiveWindow = useWindowStore((s) => s.clearActiveWindow);

  // Context menu state
  const [contextMenuPosition, setContextMenuPosition] = useState<ContextMenuPosition | null>(null);

  const handleClick = useCallback(() => {
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

  return (
    <div
      className={styles.desktop}
      data-testid="desktop"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <MenuBar />
      {children}
      <Dock />

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
