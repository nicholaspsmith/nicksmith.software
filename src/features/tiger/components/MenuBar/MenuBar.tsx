import { useState, useEffect, useRef, useCallback } from 'react';
import { useWindowStore } from '@/stores/windowStore';
import styles from './MenuBar.module.css';

// Menu item definitions with their dropdown content
const MENU_ITEMS = [
  {
    id: 'file',
    label: 'File',
    items: [
      { label: 'New', shortcut: '⌘N' },
      { label: 'Open...', shortcut: '⌘O' },
      { type: 'divider' as const },
      { label: 'Close', shortcut: '⌘W' },
      { label: 'Save', shortcut: '⌘S', disabled: true },
      { type: 'divider' as const },
      { label: 'Print...', shortcut: '⌘P' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { label: 'Undo', shortcut: '⌘Z', disabled: true },
      { label: 'Redo', shortcut: '⇧⌘Z', disabled: true },
      { type: 'divider' as const },
      { label: 'Cut', shortcut: '⌘X' },
      { label: 'Copy', shortcut: '⌘C' },
      { label: 'Paste', shortcut: '⌘V' },
      { label: 'Select All', shortcut: '⌘A' },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { label: 'as Icons', shortcut: '⌘1' },
      { label: 'as List', shortcut: '⌘2' },
      { label: 'as Columns', shortcut: '⌘3' },
      { type: 'divider' as const },
      { label: 'Show Toolbar', shortcut: '⌥⌘T' },
      { label: 'Hide Status Bar' },
    ],
  },
  {
    id: 'go',
    label: 'Go',
    items: [
      { label: 'Back', shortcut: '⌘[', disabled: true },
      { label: 'Forward', shortcut: '⌘]', disabled: true },
      { type: 'divider' as const },
      { label: 'Computer', shortcut: '⇧⌘C' },
      { label: 'Home', shortcut: '⇧⌘H' },
      { label: 'Applications', shortcut: '⇧⌘A' },
      { type: 'divider' as const },
      { label: 'Go to Folder...', shortcut: '⇧⌘G' },
    ],
  },
  {
    id: 'window',
    label: 'Window',
    items: [
      { label: 'Minimize', shortcut: '⌘M' },
      { label: 'Zoom' },
      { type: 'divider' as const },
      { label: 'Bring All to Front' },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    items: [
      { label: 'Mac Help', shortcut: '⌘?' },
      { type: 'divider' as const },
      { label: 'Search' },
    ],
  },
];

type MenuItem = { label: string; shortcut?: string; disabled?: boolean } | { type: 'divider' };

/**
 * MenuBar component - Tiger-era menu bar at top of screen
 *
 * Displays Apple logo, current app name, and clock.
 * Fixed at top with authentic Tiger styling.
 *
 * The app name updates to show the focused window's app,
 * or "Finder" when no windows are focused.
 *
 * All menu items now open dropdown menus with tracking behavior
 * (hovering switches menus when one is already open).
 */
export function MenuBar() {
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const windows = useWindowStore((s) => s.windows);
  const [time, setTime] = useState(new Date());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLElement>(null);

  // Derive app name from focused window, default to "Finder"
  const activeWindow = windows.find((w) => w.id === activeWindowId);
  // Show parent app name (e.g., TextEdit), not document title (e.g., Resume)
  // Capitalize: textEdit → TextEdit, terminal → Terminal
  const parentApp = activeWindow?.parentApp;
  const appName = parentApp
    ? parentApp.charAt(0).toUpperCase() + parentApp.slice(1)
    : 'Finder';

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Close all menus when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openMenuId) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [openMenuId]);

  const handleMenuClick = useCallback((menuId: string) => {
    setOpenMenuId((prev) => (prev === menuId ? null : menuId));
  }, []);

  // Menu tracking: when a menu is open, hovering another opens it
  const handleMenuHover = useCallback((menuId: string) => {
    if (openMenuId !== null && openMenuId !== menuId) {
      setOpenMenuId(menuId);
    }
  }, [openMenuId]);

  const handleMenuItemClick = useCallback((label: string) => {
    setOpenMenuId(null);

    // Handle specific menu actions
    if (label === 'About This Mac') {
      alert('Mac OS X Tiger 10.4.11\n\nThis is a portfolio website by Nick Smith');
    } else if (label === 'Restart...') {
      window.location.reload();
    }
    // Other menu items are decorative for now
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderDropdownItems = (items: MenuItem[]) => {
    return items.map((item, index) => {
      if ('type' in item && item.type === 'divider') {
        return <div key={index} className={styles.dropdownDivider} role="separator" />;
      }

      const menuItem = item as { label: string; shortcut?: string; disabled?: boolean };
      return (
        <button
          key={menuItem.label}
          type="button"
          className={`${styles.dropdownItem} ${menuItem.disabled ? styles.dropdownItemDisabled : ''}`}
          onClick={() => !menuItem.disabled && handleMenuItemClick(menuItem.label)}
          role="menuitem"
          aria-disabled={menuItem.disabled}
          data-testid={`menu-item-${menuItem.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
        >
          <span className={styles.dropdownItemLabel}>{menuItem.label}</span>
          {menuItem.shortcut && (
            <span className={styles.dropdownItemShortcut}>{menuItem.shortcut}</span>
          )}
        </button>
      );
    });
  };

  return (
    <header className={styles.menuBar} data-testid="menu-bar" ref={menuBarRef}>
      <div className={styles.left}>
        {/* Apple Logo with Dropdown */}
        <div className={styles.menuContainer}>
          <button
            type="button"
            className={`${styles.appleLogo} ${openMenuId === 'apple' ? styles.menuActive : ''}`}
            onClick={() => handleMenuClick('apple')}
            onMouseEnter={() => handleMenuHover('apple')}
            aria-label="Apple menu"
            aria-expanded={openMenuId === 'apple'}
            aria-haspopup="menu"
            data-testid="apple-menu-button"
          >
            {/* Tiger-era blue Apple logo - 20x20 to almost fill menu bar height */}
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
              className={styles.appleLogoSvg}
            >
              <defs>
                <linearGradient id="appleBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7CB8FF" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>
              </defs>
              <path
                fill="url(#appleBlueGradient)"
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
              />
            </svg>
          </button>

          {/* Apple Menu Dropdown */}
          {openMenuId === 'apple' && (
            <div
              className={styles.dropdown}
              role="menu"
              data-testid="apple-menu-dropdown"
            >
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => handleMenuItemClick('About This Mac')}
                role="menuitem"
                data-testid="menu-item-about-this-mac"
              >
                <span className={styles.dropdownItemLabel}>About This Mac</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`}
                role="menuitem"
                aria-disabled="true"
                data-testid="menu-item-system-preferences"
              >
                <span className={styles.dropdownItemLabel}>System Preferences...</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => handleMenuItemClick('Restart...')}
                role="menuitem"
                data-testid="menu-item-restart"
              >
                <span className={styles.dropdownItemLabel}>Restart...</span>
              </button>
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`}
                role="menuitem"
                aria-disabled="true"
                data-testid="menu-item-shut-down"
              >
                <span className={styles.dropdownItemLabel}>Shut Down...</span>
              </button>
            </div>
          )}
        </div>

        {/* App Name Menu */}
        <div className={styles.menuContainer}>
          <button
            type="button"
            className={`${styles.appName} ${openMenuId === 'app' ? styles.menuActive : ''}`}
            onClick={() => handleMenuClick('app')}
            onMouseEnter={() => handleMenuHover('app')}
            aria-expanded={openMenuId === 'app'}
            aria-haspopup="menu"
            data-testid="app-name"
          >
            {appName}
          </button>

          {openMenuId === 'app' && (
            <div
              className={styles.dropdown}
              role="menu"
              data-testid="app-menu-dropdown"
            >
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => handleMenuItemClick(`About ${appName}`)}
                role="menuitem"
                data-testid="menu-item-about-app"
              >
                <span className={styles.dropdownItemLabel}>About {appName}</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`}
                role="menuitem"
                aria-disabled="true"
                data-testid="menu-item-preferences"
              >
                <span className={styles.dropdownItemLabel}>Preferences...</span>
                <span className={styles.dropdownItemShortcut}>⌘,</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`}
                role="menuitem"
                aria-disabled="true"
                data-testid="menu-item-services"
              >
                <span className={styles.dropdownItemLabel}>Services</span>
                <span className={styles.dropdownItemShortcut}>▶</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`}
                role="menuitem"
                aria-disabled="true"
                data-testid="menu-item-hide"
              >
                <span className={styles.dropdownItemLabel}>Hide {appName}</span>
                <span className={styles.dropdownItemShortcut}>⌘H</span>
              </button>
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`}
                role="menuitem"
                aria-disabled="true"
                data-testid="menu-item-hide-others"
              >
                <span className={styles.dropdownItemLabel}>Hide Others</span>
                <span className={styles.dropdownItemShortcut}>⌥⌘H</span>
              </button>
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`}
                role="menuitem"
                aria-disabled="true"
                data-testid="menu-item-show-all"
              >
                <span className={styles.dropdownItemLabel}>Show All</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`}
                role="menuitem"
                aria-disabled="true"
                data-testid="menu-item-quit"
              >
                <span className={styles.dropdownItemLabel}>Quit {appName}</span>
                <span className={styles.dropdownItemShortcut}>⌘Q</span>
              </button>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className={styles.menuItems} aria-label="Application menu">
          {MENU_ITEMS.map((menu) => (
            <div key={menu.id} className={styles.menuContainer}>
              <button
                type="button"
                className={`${styles.menuItem} ${openMenuId === menu.id ? styles.menuActive : ''}`}
                onClick={() => handleMenuClick(menu.id)}
                onMouseEnter={() => handleMenuHover(menu.id)}
                aria-expanded={openMenuId === menu.id}
                aria-haspopup="menu"
                data-testid={`menu-${menu.id}`}
              >
                {menu.label}
              </button>

              {openMenuId === menu.id && (
                <div
                  className={styles.dropdown}
                  role="menu"
                  data-testid={`${menu.id}-menu-dropdown`}
                >
                  {renderDropdownItems(menu.items)}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.right}>
        {/* Status Icons */}
        <div className={styles.statusIcons}>
          {/* Volume Icon */}
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
            className={styles.statusIcon}
            aria-label="Volume"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        </div>

        {/* Clock */}
        <span className={styles.clock} data-testid="clock">
          {formatTime(time)}
        </span>

        {/* Spotlight Icon - Tiger blue circle with white magnifying glass */}
        <svg
          viewBox="0 0 20 20"
          width="20"
          height="20"
          className={styles.spotlightIcon}
          aria-label="Spotlight"
        >
          {/* Blue gradient circle background - fills most of the icon */}
          <defs>
            <linearGradient id="spotlightBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7CB8FF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
          </defs>
          <circle cx="10" cy="10" r="9.5" fill="url(#spotlightBlueGradient)" />
          {/* White magnifying glass - smaller and centered */}
          <circle cx="8.5" cy="8.5" r="3" fill="none" stroke="white" strokeWidth="1.5" />
          <line x1="11" y1="11" x2="14" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </header>
  );
}
