import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ContextMenu.module.css';

/** Forward declaration for ContextMenuEntry to avoid circular imports */
export interface SubmenuItemConfig {
  type: 'item';
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface SubmenuDividerConfig {
  type: 'divider';
}

export type SubmenuEntry = SubmenuItemConfig | SubmenuDividerConfig;

export interface MenuItemProps {
  /** The label to display */
  label: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Whether this item has a submenu (visual indicator) */
  hasSubmenu?: boolean;
  /** Submenu items to render on hover */
  submenu?: SubmenuEntry[];
  /** Click handler (only called if not disabled and no submenu) */
  onClick?: () => void;
  /** Handler for submenu item clicks - passes the item's onClick callback */
  onSubmenuItemClick?: (callback?: () => void) => void;
}

/** Hover delay before showing submenu (ms) */
const SUBMENU_DELAY = 350;

/**
 * MenuItem - Individual item within a ContextMenu
 *
 * Supports:
 * - Disabled state (grayed out, no hover effect)
 * - Submenu indicator arrow
 * - Click handling
 * - Nested submenu on hover with 350ms delay
 */
export function MenuItem({
  label,
  disabled = false,
  hasSubmenu = false,
  submenu,
  onClick,
  onSubmenuItemClick,
}: MenuItemProps) {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [submenuPosition, setSubmenuPosition] = useState<{ left: boolean; shiftUp: boolean }>({
    left: false,
    shiftUp: false,
  });
  const itemRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasActualSubmenu = submenu && submenu.length > 0;

  // Calculate submenu position based on viewport boundaries
  const calculateSubmenuPosition = useCallback(() => {
    if (!itemRef.current || !submenuRef.current) return;

    const itemRect = itemRef.current.getBoundingClientRect();
    const submenuRect = submenuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Check if submenu would overflow right edge
    const wouldOverflowRight = itemRect.right + submenuRect.width > viewportWidth;
    // Check if submenu would overflow bottom edge
    const wouldOverflowBottom = itemRect.top + submenuRect.height > viewportHeight;

    setSubmenuPosition({
      left: wouldOverflowRight,
      shiftUp: wouldOverflowBottom,
    });
  }, []);

  // Update position when submenu is shown
  useEffect(() => {
    if (showSubmenu && hasActualSubmenu) {
      // Use requestAnimationFrame to ensure submenu is rendered before calculating
      requestAnimationFrame(calculateSubmenuPosition);
    }
  }, [showSubmenu, hasActualSubmenu, calculateSubmenuPosition]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (disabled || !hasActualSubmenu) return;

    hoverTimeoutRef.current = setTimeout(() => {
      setShowSubmenu(true);
    }, SUBMENU_DELAY);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowSubmenu(false);
  };

  const handleClick = () => {
    // Don't trigger onClick if there's a submenu
    if (!disabled && onClick && !hasActualSubmenu) {
      onClick();
    }
  };

  const handleSubmenuItemClick = (itemOnClick?: () => void) => {
    if (onSubmenuItemClick) {
      onSubmenuItemClick(itemOnClick);
    }
  };

  const submenuClasses = [
    styles.submenu,
    submenuPosition.left ? styles.submenuLeft : '',
    submenuPosition.shiftUp ? styles.submenuShiftUp : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={itemRef}
      className={`${styles.menuItem} ${disabled ? styles.disabled : ''} ${hasActualSubmenu ? styles.submenuContainer : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="menuitem"
      aria-disabled={disabled}
      aria-haspopup={hasActualSubmenu ? 'menu' : undefined}
      aria-expanded={hasActualSubmenu ? showSubmenu : undefined}
      data-testid={`menu-item-${label.toLowerCase().replace(/\s+/g, '-').replace(/\.+/g, '')}`}
    >
      <span className={styles.menuItemLabel}>{label}</span>
      {(hasSubmenu || hasActualSubmenu) && <span className={styles.submenuArrow}>&#9654;</span>}

      {/* Render submenu on hover */}
      {showSubmenu && hasActualSubmenu && (
        <div
          ref={submenuRef}
          className={submenuClasses}
          role="menu"
          aria-label={`${label} submenu`}
        >
          {submenu.map((entry, index) => {
            if (entry.type === 'divider') {
              return <MenuDivider key={`submenu-divider-${index}`} />;
            }
            return (
              <div
                key={entry.label}
                className={`${styles.menuItem} ${entry.disabled ? styles.disabled : ''}`}
                onClick={() => !entry.disabled && handleSubmenuItemClick(entry.onClick)}
                role="menuitem"
                aria-disabled={entry.disabled}
                data-testid={`submenu-item-${entry.label.toLowerCase().replace(/\s+/g, '-').replace(/\.+/g, '')}`}
              >
                <span className={styles.menuItemLabel}>{entry.label}</span>
              </div>
            );
          })}
        </div>
      )}
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
