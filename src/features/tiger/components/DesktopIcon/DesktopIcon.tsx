import { motion } from 'motion/react';
import { iconVariants } from '@/animations/aqua';
import { SACRED } from '../../constants/sacred';
import styles from './DesktopIcon.module.css';

export interface DesktopIconProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

/**
 * DesktopIcon component - Clickable desktop icon with label
 *
 * Displays an icon image (48x48) with a text label below.
 * Supports selection state, hover animations, and click/double-click handlers.
 * Positioned within the desktop icon grid (80x90px cells).
 */
export function DesktopIcon({
  id,
  label,
  icon,
  isSelected = false,
  onClick,
  onDoubleClick,
}: DesktopIconProps) {
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

  return (
    <motion.button
      className={`${styles.icon} ${isSelected ? styles.selected : ''}`}
      data-testid={`desktop-icon-${id}`}
      variants={iconVariants}
      initial="idle"
      whileHover="hover"
      whileTap="active"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      aria-label={label}
      aria-pressed={isSelected}
      style={{
        width: SACRED.iconGridCellWidth,
        height: SACRED.iconGridCellHeight,
      }}
    >
      <div
        className={styles.iconImage}
        style={{
          width: SACRED.iconSize,
          height: SACRED.iconSize,
        }}
      >
        {icon}
      </div>
      <span
        className={styles.label}
        style={{ maxWidth: SACRED.iconLabelMaxWidth }}
      >
        {label}
      </span>
    </motion.button>
  );
}
