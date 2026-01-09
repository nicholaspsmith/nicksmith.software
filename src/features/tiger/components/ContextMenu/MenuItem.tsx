import styles from './ContextMenu.module.css';

export interface MenuItemProps {
  /** The label to display */
  label: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Whether this item has a submenu */
  hasSubmenu?: boolean;
  /** Click handler (only called if not disabled) */
  onClick?: () => void;
}

/**
 * MenuItem - Individual item within a ContextMenu
 *
 * Supports:
 * - Disabled state (grayed out, no hover effect)
 * - Submenu indicator arrow
 * - Click handling
 */
export function MenuItem({
  label,
  disabled = false,
  hasSubmenu = false,
  onClick,
}: MenuItemProps) {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`${styles.menuItem} ${disabled ? styles.disabled : ''}`}
      onClick={handleClick}
      role="menuitem"
      aria-disabled={disabled}
      data-testid={`menu-item-${label.toLowerCase().replace(/\s+/g, '-').replace(/\.+/g, '')}`}
    >
      <span className={styles.menuItemLabel}>{label}</span>
      {hasSubmenu && <span className={styles.submenuArrow}>&#9654;</span>}
    </div>
  );
}

export interface MenuDividerProps {
  /** Optional test ID */
  testId?: string;
}

/**
 * MenuDivider - Horizontal separator line between menu items
 */
export function MenuDivider({ testId }: MenuDividerProps) {
  return (
    <div
      className={styles.divider}
      role="separator"
      data-testid={testId ?? 'menu-divider'}
    />
  );
}
