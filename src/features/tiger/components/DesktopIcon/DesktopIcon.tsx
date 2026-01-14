import { useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, useAnimationControls, type PanInfo } from 'motion/react';
import { useAppStore } from '@/stores/appStore';
import { iconVariants } from '@/animations/aqua';
import { SACRED } from '../../constants/sacred';
import styles from './DesktopIcon.module.css';

/** Larger icon size for desktop display */
const DESKTOP_ICON_SIZE = 64;

/**
 * Registry of icon DOM elements for direct manipulation during multi-drag.
 * This avoids React re-renders during drag by updating transforms directly.
 */
const iconElementRegistry = new Map<string, HTMLButtonElement>();

/**
 * Icons that were just multi-dragged should skip their next position animation.
 * This prevents the "snap back then animate" visual glitch.
 */
const skipAnimationForIcons = new Set<string>();

/** Position record for multi-drag */
export interface IconPositionRecord {
  [iconId: string]: { x: number; y: number };
}

/** Icon type for context menu determination */
export type DesktopIconType =
  | 'document'
  | 'folder'
  | 'application'
  | 'drive'
  | 'smart-folder'
  | 'burn-folder';

/** Context menu event info passed to handler */
export interface IconContextMenuEvent {
  iconId: string;
  iconLabel: string;
  iconType: DesktopIconType;
  x: number;
  y: number;
}

export interface DesktopIconProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isSelected?: boolean;
  /** Absolute X position on desktop */
  x: number;
  /** Absolute Y position on desktop */
  y: number;
  /** The type of icon (for context menu) */
  iconType?: DesktopIconType;
  onClick?: () => void;
  onDoubleClick?: () => void;
  /** Called when icon is dragged to new position (single icon) */
  onPositionChange?: (x: number, y: number) => void;
  /** IDs of all currently selected icons (for multi-drag) */
  selectedIconIds?: string[];
  /** Positions of all icons (for multi-drag offset calculation) */
  allIconPositions?: IconPositionRecord;
  /** Called when multiple icons are dragged (multi-drag) */
  onMultiPositionChange?: (positions: IconPositionRecord) => void;
  /** Called when drag starts (for special icons like Macintosh HD) */
  onDragStart?: () => void;
  /** Called when drag ends (for special icons like Macintosh HD) */
  onDragEnd?: () => void;
  /** Called when right-click on icon for context menu */
  onContextMenu?: (event: IconContextMenuEvent) => void;
}

/**
 * DesktopIcon component - Draggable desktop icon with label
 *
 * Displays an icon image (64x64) with a text label below.
 * Supports selection state, hover animations, click/double-click handlers,
 * and free-form drag-and-drop within screen boundaries.
 */
export function DesktopIcon({
  id,
  label,
  icon,
  isSelected = false,
  x,
  y,
  iconType = 'document',
  onClick,
  onDoubleClick,
  onPositionChange,
  selectedIconIds = [],
  allIconPositions = {},
  onMultiPositionChange,
  onDragStart,
  onDragEnd,
  onContextMenu,
}: DesktopIconProps) {
  const controls = useAnimationControls();
  const prevPosition = useRef({ x, y });
  const isDragging = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Multi-drag actions from store (only subscribe to actions, not changing state)
  const startMultiDrag = useAppStore((s) => s.startMultiDrag);
  const endMultiDrag = useAppStore((s) => s.endMultiDrag);
  const moveToTrash = useAppStore((s) => s.moveToTrash);
  const moveToFolder = useAppStore((s) => s.moveToFolder);
  const setHoveringOverTrash = useAppStore((s) => s.setHoveringOverTrash);
  const setDraggingIcon = useAppStore((s) => s.setDraggingIcon);

  // Register this icon's DOM element for direct manipulation during multi-drag
  useEffect(() => {
    if (buttonRef.current) {
      iconElementRegistry.set(id, buttonRef.current);
    }
    return () => {
      iconElementRegistry.delete(id);
    };
  }, [id]);

  // Animate to new position when x/y props change (e.g., from Clean Up)
  useEffect(() => {
    // Skip animation if this icon was just multi-dragged
    if (skipAnimationForIcons.has(id)) {
      skipAnimationForIcons.delete(id);
      prevPosition.current = { x, y };
      controls.set({ x: 0, y: 0 }); // Ensure no lingering transform
      return;
    }

    const prevX = prevPosition.current.x;
    const prevY = prevPosition.current.y;

    // Only animate if position actually changed and we're not dragging
    if ((prevX !== x || prevY !== y) && !isDragging.current) {
      // Calculate the offset from new position to old position
      const offsetX = prevX - x;
      const offsetY = prevY - y;

      // Immediately set transform to offset (so icon appears at old position)
      controls.set({ x: offsetX, y: offsetY });

      // Animate transform to 0 (moving icon to new CSS position)
      controls.start({
        x: 0,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
      });
    }

    // Update ref for next comparison
    prevPosition.current = { x, y };
  }, [x, y, controls, id]);

  // Use mousedown for selection (Tiger behavior: select on press, not release)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only change selection if icon is NOT already selected
    // This preserves multi-selection when starting a drag
    if (!isSelected) {
      onClick?.();
    }
  };

  // Prevent click from bubbling to Desktop (which would clear selection)
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter (Return) opens the icon (like double-click) - Tiger behavior
    if (e.key === 'Enter') {
      e.preventDefault();
      onDoubleClick?.();
    }
  };

  // Handle right-click for context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Select the icon if not already selected
    if (!isSelected) {
      onClick?.();
    }

    onContextMenu?.({
      iconId: id,
      iconLabel: label,
      iconType,
      x: e.clientX,
      y: e.clientY,
    });
  }, [id, label, iconType, isSelected, onClick, onContextMenu]);

  // Calculate drag constraints to keep icon within screen boundaries
  // Allow dragging into dock area so icons can be dropped on trash
  const dragConstraints = useMemo(() => {
    const menuBarHeight = SACRED.menuBarHeight;
    const cellWidth = SACRED.iconGridCellWidth;
    const cellHeight = SACRED.iconGridCellHeight;

    return {
      top: -(y - menuBarHeight),
      left: -x,
      right: window.innerWidth - x - cellWidth,
      // Allow dragging to bottom of screen (into dock area for trash)
      bottom: window.innerHeight - y - cellHeight,
    };
  }, [x, y]);

  const handleDragStart = useCallback(() => {
    isDragging.current = true;
    // Set global dragging state
    setDraggingIcon(true);
    // If this is a multi-drag (icon is selected with others), mark as dragging
    if (isSelected && selectedIconIds.length > 1) {
      startMultiDrag(id);
    }
    // Call external drag start callback (e.g., for Macintosh HD eject icon)
    onDragStart?.();
  }, [id, isSelected, selectedIconIds.length, startMultiDrag, onDragStart, setDraggingIcon]);

  // Track whether we're hovering over trash (to avoid excessive state updates)
  const wasHoveringOverTrash = useRef(false);

  // Track drag offset in real-time for multi-drag using direct DOM manipulation
  const handleDrag = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Check if hovering over trash dock icon or Finder trash window
      if (id !== 'macintosh-hd') {
        const trashDockIcon = document.querySelector('[data-testid="dock-icon-trash"]');
        const finderTrashContent = document.querySelector('[data-testid="finder-trash-content"]');
        const dropX = x + info.offset.x + SACRED.iconGridCellWidth / 2;
        const dropY = y + info.offset.y + SACRED.iconGridCellHeight / 2;

        let isOverTrash = false;

        // Check trash dock icon
        if (trashDockIcon) {
          const trashRect = trashDockIcon.getBoundingClientRect();
          isOverTrash =
            dropX >= trashRect.left &&
            dropX <= trashRect.right &&
            dropY >= trashRect.top &&
            dropY <= trashRect.bottom;
        }

        // Also check Finder trash window content area
        if (!isOverTrash && finderTrashContent) {
          const finderTrashRect = finderTrashContent.getBoundingClientRect();
          isOverTrash =
            dropX >= finderTrashRect.left &&
            dropX <= finderTrashRect.right &&
            dropY >= finderTrashRect.top &&
            dropY <= finderTrashRect.bottom;
        }

        // Only update state if changed (to avoid excessive re-renders)
        if (isOverTrash !== wasHoveringOverTrash.current) {
          wasHoveringOverTrash.current = isOverTrash;
          setHoveringOverTrash(isOverTrash);
        }
      }

      // Only apply multi-drag transforms to other selected icons
      if (!isSelected || selectedIconIds.length <= 1) return;

      // Directly update transforms on other selected icons (no React re-renders)
      for (const iconId of selectedIconIds) {
        if (iconId === id) continue; // Skip the icon being dragged (framer handles it)

        const element = iconElementRegistry.get(iconId);
        if (element) {
          element.style.transform = `translate(${info.offset.x}px, ${info.offset.y}px)`;
          element.style.opacity = '0.7';
          element.style.zIndex = '10000';
        }
      }
    },
    [id, isSelected, selectedIconIds, x, y, setHoveringOverTrash]
  );

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Reset trash hover state and dragging state
      wasHoveringOverTrash.current = false;
      setHoveringOverTrash(false);
      setDraggingIcon(false);

      const menuBarHeight = SACRED.menuBarHeight;
      const dockHeight = SACRED.dockHeight;
      const maxX = window.innerWidth - SACRED.iconGridCellWidth;
      // When positioning icons, keep them above the dock
      const maxY = window.innerHeight - SACRED.iconGridCellHeight - dockHeight;

      // Check if dropped on trash dock icon or Finder trash window
      const trashDockIcon = document.querySelector('[data-testid="dock-icon-trash"]');
      const finderTrashContent = document.querySelector('[data-testid="finder-trash-content"]');
      let droppedOnTrash = false;

      // Calculate drop point (center of dragged icon)
      const dropX = x + info.offset.x + SACRED.iconGridCellWidth / 2;
      const dropY = y + info.offset.y + SACRED.iconGridCellHeight / 2;

      // Check trash dock icon
      if (trashDockIcon) {
        const trashRect = trashDockIcon.getBoundingClientRect();
        droppedOnTrash = (
          dropX >= trashRect.left &&
          dropX <= trashRect.right &&
          dropY >= trashRect.top &&
          dropY <= trashRect.bottom
        );
      }

      // Also check Finder trash window content area
      if (!droppedOnTrash && finderTrashContent) {
        const finderTrashRect = finderTrashContent.getBoundingClientRect();
        droppedOnTrash = (
          dropX >= finderTrashRect.left &&
          dropX <= finderTrashRect.right &&
          dropY >= finderTrashRect.top &&
          dropY <= finderTrashRect.bottom
        );
      }

      // Handle trash drop (Macintosh HD cannot be trashed)
      if (droppedOnTrash && id !== 'macintosh-hd') {
        // For multi-select, trash all selected icons except macintosh-hd
        if (isSelected && selectedIconIds.length > 1) {
          for (const iconId of selectedIconIds) {
            if (iconId !== 'macintosh-hd') {
              moveToTrash(iconId);
            }
          }
        } else {
          moveToTrash(id);
        }

        // Reset transforms and end drag
        controls.set({ x: 0, y: 0 });
        endMultiDrag();
        isDragging.current = false;
        onDragEnd?.();
        return;
      }

      // Check if dropped on a Finder folder (non-trash)
      const finderFolderContents = document.querySelectorAll('[data-testid="finder-folder-content"]');
      let droppedOnFolder = false;
      let targetFolderId: string | null = null;

      // Folders that can accept dropped items (not system locations like macintosh-hd)
      const droppableFolders = ['desktop', 'documents', 'pictures', 'music', 'movies', 'user'];

      for (const folderContent of finderFolderContents) {
        const folderRect = folderContent.getBoundingClientRect();
        const folderId = folderContent.getAttribute('data-folder-id');

        if (
          folderId &&
          droppableFolders.includes(folderId) &&
          dropX >= folderRect.left &&
          dropX <= folderRect.right &&
          dropY >= folderRect.top &&
          dropY <= folderRect.bottom
        ) {
          droppedOnFolder = true;
          targetFolderId = folderId;
          break;
        }
      }

      // Handle folder drop (Macintosh HD cannot be moved to folders)
      if (droppedOnFolder && targetFolderId && id !== 'macintosh-hd') {
        // For multi-select, move all selected icons except macintosh-hd
        if (isSelected && selectedIconIds.length > 1) {
          for (const iconId of selectedIconIds) {
            if (iconId !== 'macintosh-hd') {
              moveToFolder(targetFolderId, iconId);
            }
          }
        } else {
          moveToFolder(targetFolderId, id);
        }

        // Reset transforms and end drag
        controls.set({ x: 0, y: 0 });
        endMultiDrag();
        isDragging.current = false;
        onDragEnd?.();
        return;
      }

      // Check if this is a multi-drag (this icon is selected and there are other selected icons)
      const isMultiDrag = isSelected && selectedIconIds.length > 1 && onMultiPositionChange;

      if (isMultiDrag) {
        // Multi-drag: apply the same offset to all selected icons
        const offsetX = info.offset.x;
        const offsetY = info.offset.y;

        const newPositions: IconPositionRecord = {};

        for (const iconId of selectedIconIds) {
          const currentPos = allIconPositions[iconId];
          if (currentPos) {
            const newX = currentPos.x + offsetX;
            const newY = currentPos.y + offsetY;

            // Constrain each icon to viewport bounds
            newPositions[iconId] = {
              x: Math.max(0, Math.min(newX, maxX)),
              y: Math.max(menuBarHeight, Math.min(newY, maxY)),
            };
          }
        }

        // Update DOM positions BEFORE React state update to prevent visual glitch
        for (const iconId of selectedIconIds) {
          if (iconId === id) {
            // For the dragged icon: update prevPosition and mark to skip animation
            const newPos = newPositions[iconId];
            if (newPos) {
              prevPosition.current = { x: newPos.x, y: newPos.y };
              skipAnimationForIcons.add(iconId);
            }
            continue;
          }

          const element = iconElementRegistry.get(iconId);
          const newPos = newPositions[iconId];

          if (element && newPos) {
            // Set DOM left/top to new position BEFORE clearing transform
            element.style.left = `${newPos.x}px`;
            element.style.top = `${newPos.y}px`;

            // Clear transform and z-index - icon stays visually in place
            element.style.transform = '';
            element.style.opacity = '';
            element.style.zIndex = '';

            // Mark this icon to skip its React animation
            skipAnimationForIcons.add(iconId);
          }
        }

        // Now update React state
        onMultiPositionChange(newPositions);
      } else {
        // Single icon drag
        const newX = x + info.offset.x;
        const newY = y + info.offset.y;

        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(menuBarHeight, Math.min(newY, maxY));

        onPositionChange?.(constrainedX, constrainedY);

        // Update prev position to match new position (skip animation for dragged icon)
        prevPosition.current = { x: constrainedX, y: constrainedY };
      }

      // Reset the transform to 0 since left/top will now have the correct position
      controls.set({ x: 0, y: 0 });

      // Clear multi-drag state
      endMultiDrag();
      isDragging.current = false;

      // Call external drag end callback (e.g., for Macintosh HD eject icon)
      onDragEnd?.();
    },
    [x, y, onPositionChange, controls, isSelected, selectedIconIds, allIconPositions, onMultiPositionChange, endMultiDrag, id, onDragEnd, moveToTrash, moveToFolder, setHoveringOverTrash, setDraggingIcon]
  );

  return (
    <motion.button
      ref={buttonRef}
      className={`${styles.icon} ${isSelected ? styles.selected : ''}`}
      data-testid={`desktop-icon-${id}`}
      variants={iconVariants}
      initial="idle"
      whileHover="hover"
      whileTap="active"
      animate={controls}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      aria-label={label}
      aria-pressed={isSelected}
      // Absolute positioning (multi-drag transforms applied directly via DOM)
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: SACRED.iconGridCellWidth,
        height: SACRED.iconGridCellHeight,
      }}
      // Drag functionality
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={dragConstraints}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={{
        opacity: 0.7,
        zIndex: 10000,
        cursor: 'grabbing',
      }}
    >
      <div
        className={styles.iconImage}
        style={{
          width: DESKTOP_ICON_SIZE,
          height: DESKTOP_ICON_SIZE,
        }}
      >
        {icon}
      </div>
      <span
        className={styles.label}
      >
        {label}
      </span>
    </motion.button>
  );
}
