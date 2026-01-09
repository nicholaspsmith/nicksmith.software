import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MenuItem, MenuDivider } from './MenuItem';
import styles from './ContextMenu.module.css';

export interface ContextMenuProps {
  /** X position (clientX from mouse event) */
  x: number;
  /** Y position (clientY from mouse event) */
  y: number;
  /** Handler called when menu should close */
  onClose: () => void;
  /** Handler called when Clean Up is selected */
  onCleanUp?: () => void;
}

/**
 * ContextMenu - Tiger-style right-click context menu
 *
 * Features:
 * - Portal-rendered to escape overflow constraints
 * - Pinstripe texture background
 * - Click-outside to close
 * - Escape key to close
 * - Viewport boundary detection (repositions if near edge)
 *
 * Currently displays desktop context menu items (decorative/disabled).
 */
export function ContextMenu({ x, y, onClose, onCleanUp }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Calculate adjusted position to keep menu within viewport
  const getAdjustedPosition = useCallback(() => {
    if (!menuRef.current) {
      return { left: x, top: y };
    }

    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    // Adjust if menu would overflow right edge
    if (x + menuRect.width > viewportWidth) {
      adjustedX = viewportWidth - menuRect.width - 8;
    }

    // Adjust if menu would overflow bottom edge
    if (y + menuRect.height > viewportHeight) {
      adjustedY = viewportHeight - menuRect.height - 8;
    }

    // Ensure minimum position
    adjustedX = Math.max(8, adjustedX);
    adjustedY = Math.max(8, adjustedY);

    return { left: adjustedX, top: adjustedY };
  }, [x, y]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Update position after render to account for menu dimensions
  useEffect(() => {
    if (menuRef.current) {
      const { left, top } = getAdjustedPosition();
      menuRef.current.style.left = `${left}px`;
      menuRef.current.style.top = `${top}px`;
    }
  }, [getAdjustedPosition]);

  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  // Prevent context menu from closing when clicking inside it
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const menuContent = (
    <>
      {/* Invisible overlay to catch clicks outside */}
      <div
        className={styles.overlay}
        onClick={handleOverlayClick}
        onContextMenu={handleOverlayClick}
        data-testid="context-menu-overlay"
      />

      {/* The actual context menu */}
      <div
        ref={menuRef}
        className={styles.contextMenu}
        onClick={handleMenuClick}
        onContextMenu={(e) => e.preventDefault()}
        role="menu"
        aria-label="Context menu"
        data-testid="context-menu"
        style={{ left: x, top: y }}
      >
        <MenuItem label="New Folder" disabled />
        <MenuItem label="Get Info" disabled />
        <MenuItem label="Change Desktop Background..." disabled />
        <MenuDivider />
        <MenuItem
          label="Clean Up"
          onClick={() => {
            onCleanUp?.();
            onClose();
          }}
        />
        <MenuItem label="Arrange By" hasSubmenu disabled />
      </div>
    </>
  );

  // Render via portal to escape any overflow constraints
  return createPortal(menuContent, document.body);
}
