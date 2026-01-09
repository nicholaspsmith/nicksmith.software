import { useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, useAnimationControls, type PanInfo } from 'motion/react';
import { iconVariants } from '@/animations/aqua';
import { SACRED } from '../../constants/sacred';
import styles from './DesktopIcon.module.css';

/** Larger icon size for desktop display */
const DESKTOP_ICON_SIZE = 64;

export interface DesktopIconProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isSelected?: boolean;
  /** Absolute X position on desktop */
  x: number;
  /** Absolute Y position on desktop */
  y: number;
  onClick?: () => void;
  onDoubleClick?: () => void;
  /** Called when icon is dragged to new position */
  onPositionChange?: (x: number, y: number) => void;
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
  onClick,
  onDoubleClick,
  onPositionChange,
}: DesktopIconProps) {
  const controls = useAnimationControls();
  const prevPosition = useRef({ x, y });
  const isDragging = useRef(false);

  // Animate to new position when x/y props change (e.g., from Clean Up)
  useEffect(() => {
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
  }, [x, y, controls]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
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

  // Calculate drag constraints to keep icon within screen boundaries
  const dragConstraints = useMemo(() => {
    const menuBarHeight = SACRED.menuBarHeight;
    const dockHeight = SACRED.dockHeight;
    const cellWidth = SACRED.iconGridCellWidth;
    const cellHeight = SACRED.iconGridCellHeight;

    return {
      top: -(y - menuBarHeight),
      left: -x,
      right: window.innerWidth - x - cellWidth,
      bottom: window.innerHeight - y - cellHeight - dockHeight,
    };
  }, [x, y]);

  const handleDragStart = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Calculate new position based on drag offset
      const newX = x + info.offset.x;
      const newY = y + info.offset.y;

      // Constrain to viewport bounds (accounting for menu bar and dock)
      const menuBarHeight = SACRED.menuBarHeight;
      const dockHeight = SACRED.dockHeight;
      const maxX = window.innerWidth - SACRED.iconGridCellWidth;
      const maxY = window.innerHeight - SACRED.iconGridCellHeight - dockHeight;

      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(menuBarHeight, Math.min(newY, maxY));

      // Update the position in state
      onPositionChange?.(constrainedX, constrainedY);

      // Reset the transform to 0 since left/top will now have the correct position
      controls.set({ x: 0, y: 0 });

      // Update prev position to match new position (skip animation)
      prevPosition.current = { x: constrainedX, y: constrainedY };

      isDragging.current = false;
    },
    [x, y, onPositionChange, controls]
  );

  return (
    <motion.button
      className={`${styles.icon} ${isSelected ? styles.selected : ''}`}
      data-testid={`desktop-icon-${id}`}
      variants={iconVariants}
      initial="idle"
      whileHover="hover"
      whileTap="active"
      animate={controls}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      aria-label={label}
      aria-pressed={isSelected}
      // Absolute positioning
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
      onDragEnd={handleDragEnd}
      whileDrag={{
        opacity: 0.7,
        zIndex: 100,
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
