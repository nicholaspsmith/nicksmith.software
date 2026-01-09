import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useWindowStore } from '@/stores/windowStore';
import { useSoundStore } from '@/stores/soundStore';
import styles from './MenuBar.module.css';

type MenuItem = { label: string; shortcut?: string; disabled?: boolean; hasSubmenu?: boolean; checked?: boolean } | { type: 'divider' };
type MenuConfig = { id: string; label: string; items: MenuItem[] };

/**
 * Finder menu configuration - matches Tiger Finder exactly
 */
const FINDER_MENUS: MenuConfig[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { label: 'New Finder Window', shortcut: '⌘N' },
      { label: 'New Folder', shortcut: '⇧⌘N' },
      { label: 'New Smart Folder', shortcut: '⌥⌘N' },
      { label: 'New Burn Folder' },
      { type: 'divider' },
      { label: 'Open', shortcut: '⌘O', disabled: true },
      { label: 'Open With', hasSubmenu: true, disabled: true },
      { label: 'Print', disabled: true },
      { label: 'Close Window', shortcut: '⌘W' },
      { type: 'divider' },
      { label: 'Get Info', shortcut: '⌘I', disabled: true },
      { type: 'divider' },
      { label: 'Duplicate', shortcut: '⌘D', disabled: true },
      { label: 'Make Alias', shortcut: '⌘L', disabled: true },
      { label: 'Show Original', shortcut: '⌘R', disabled: true },
      { label: 'Add to Favorites', shortcut: '⇧⌘T', disabled: true },
      { label: 'Create Archive', disabled: true },
      { type: 'divider' },
      { label: 'Move to Trash', shortcut: '⌘⌫', disabled: true },
      { label: 'Eject', shortcut: '⌘E', disabled: true },
      { label: 'Burn Disc...', disabled: true },
      { type: 'divider' },
      { label: 'Find...', shortcut: '⌘F' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { label: "Can't Undo", shortcut: '⌘Z', disabled: true },
      { type: 'divider' },
      { label: 'Cut', shortcut: '⌘X', disabled: true },
      { label: 'Copy', shortcut: '⌘C', disabled: true },
      { label: 'Paste', shortcut: '⌘V', disabled: true },
      { label: 'Select All', shortcut: '⌘A' },
      { type: 'divider' },
      { label: 'Show Clipboard' },
      { label: 'Special Characters...' },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { label: 'as Icons', shortcut: '⌘1' },
      { label: 'as List', shortcut: '⌘2' },
      { label: 'as Columns', shortcut: '⌘3' },
      { type: 'divider' },
      { label: 'Clean Up' },
      { label: 'Arrange By', hasSubmenu: true },
      { type: 'divider' },
      { label: 'Hide Toolbar', shortcut: '⌥⌘T' },
      { label: 'Customize Toolbar...' },
      { label: 'Hide Status Bar' },
      { type: 'divider' },
      { label: 'Show View Options', shortcut: '⌘J' },
    ],
  },
  {
    id: 'go',
    label: 'Go',
    items: [
      { label: 'Back', shortcut: '⌘[', disabled: true },
      { label: 'Forward', shortcut: '⌘]', disabled: true },
      { label: 'Enclosing Folder', shortcut: '⌘↑' },
      { type: 'divider' },
      { label: 'Computer', shortcut: '⇧⌘C' },
      { label: 'Home', shortcut: '⇧⌘H' },
      { label: 'Network', shortcut: '⇧⌘K' },
      { label: 'iDisk', hasSubmenu: true },
      { label: 'Applications', shortcut: '⇧⌘A' },
      { label: 'Utilities', shortcut: '⇧⌘U' },
      { type: 'divider' },
      { label: 'Recent Folders', hasSubmenu: true },
      { type: 'divider' },
      { label: 'Go to Folder...', shortcut: '⇧⌘G' },
      { label: 'Connect to Server...', shortcut: '⌘K' },
    ],
  },
  {
    id: 'window',
    label: 'Window',
    items: [
      { label: 'Minimize', shortcut: '⌘M' },
      { label: 'Zoom' },
      { label: 'Cycle Through Windows', shortcut: '⌘`' },
      { type: 'divider' },
      { label: 'Bring All to Front' },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    items: [
      { label: 'Mac Help', shortcut: '⌘?' },
    ],
  },
];

/**
 * TextEdit menu configuration - matches Tiger TextEdit exactly
 */
const TEXTEDIT_MENUS: MenuConfig[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { label: 'New', shortcut: '⌘N' },
      { label: 'Open...', shortcut: '⌘O' },
      { label: 'Open Recent', hasSubmenu: true },
      { type: 'divider' },
      { label: 'Close', shortcut: '⌘W' },
      { label: 'Save', shortcut: '⌘S', disabled: true },
      { label: 'Save As...', shortcut: '⇧⌘S', disabled: true },
      { label: 'Save All', disabled: true },
      { label: 'Revert to Saved', disabled: true },
      { type: 'divider' },
      { label: 'Show Properties', shortcut: '⌥⌘P' },
      { type: 'divider' },
      { label: 'Page Setup...', shortcut: '⇧⌘P' },
      { label: 'Print...', shortcut: '⌘P' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { label: 'Undo', shortcut: '⌘Z', disabled: true },
      { label: 'Redo', shortcut: '⇧⌘Z', disabled: true },
      { type: 'divider' },
      { label: 'Cut', shortcut: '⌘X' },
      { label: 'Copy', shortcut: '⌘C' },
      { label: 'Paste', shortcut: '⌘V' },
      { label: 'Paste and Match Style', shortcut: '⌥⇧⌘V' },
      { label: 'Delete' },
      { label: 'Complete', shortcut: '⌥⎋' },
      { label: 'Select All', shortcut: '⌘A' },
      { type: 'divider' },
      { label: 'Insert', hasSubmenu: true },
      { type: 'divider' },
      { label: 'Find', hasSubmenu: true },
      { label: 'Spelling', hasSubmenu: true },
      { label: 'Speech', hasSubmenu: true },
      { type: 'divider' },
      { label: 'Special Characters...', shortcut: '⌥⌘T' },
    ],
  },
  {
    id: 'format',
    label: 'Format',
    items: [
      { label: 'Font', hasSubmenu: true },
      { label: 'Text', hasSubmenu: true },
      { type: 'divider' },
      { label: 'Make Plain Text', shortcut: '⇧⌘T' },
      { label: 'Prevent Editing' },
      { label: 'Wrap to Page', shortcut: '⇧⌘W' },
      { label: 'Allow Hyphenation' },
    ],
  },
  {
    id: 'window',
    label: 'Window',
    items: [
      { label: 'Minimize', shortcut: '⌘M' },
      { label: 'Zoom' },
      { type: 'divider' },
      { label: 'Bring All to Front' },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    items: [
      { label: 'TextEdit Help', shortcut: '⌘?' },
    ],
  },
];

/**
 * MenuBar component - Tiger-era menu bar at top of screen
 *
 * Displays Apple logo, current app name, and clock.
 * Fixed at top with authentic Tiger styling.
 *
 * The app name and menus update based on the focused window's app:
 * - Finder: File, Edit, View, Go, Window, Help
 * - TextEdit: File, Edit, Format, Window, Help
 */
export function MenuBar() {
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const windows = useWindowStore((s) => s.windows);
  const volume = useSoundStore((s) => s.volume);
  const setVolume = useSoundStore((s) => s.setVolume);
  const playSosumi = useSoundStore((s) => s.playSosumi);
  const [time, setTime] = useState(new Date());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [clockDropdownOpen, setClockDropdownOpen] = useState(false);
  const [volumeDropdownOpen, setVolumeDropdownOpen] = useState(false);
  const menuBarRef = useRef<HTMLElement>(null);
  const spotlightInputRef = useRef<HTMLInputElement>(null);

  // Derive app name from focused window, default to "Finder"
  const activeWindow = windows.find((w) => w.id === activeWindowId);
  const parentApp = activeWindow?.parentApp;
  const appName = parentApp
    ? parentApp.charAt(0).toUpperCase() + parentApp.slice(1)
    : 'Finder';

  // Select menus based on active app
  const menus = useMemo(() => {
    if (parentApp === 'textEdit') {
      return TEXTEDIT_MENUS;
    }
    // Default to Finder menus (for Finder, Terminal, or no active window)
    return FINDER_MENUS;
  }, [parentApp]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Close all menus/dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
        setSpotlightOpen(false);
        setClockDropdownOpen(false);
        setVolumeDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openMenuId) setOpenMenuId(null);
        if (spotlightOpen) {
          setSpotlightOpen(false);
          setSpotlightQuery('');
        }
        if (clockDropdownOpen) setClockDropdownOpen(false);
        if (volumeDropdownOpen) setVolumeDropdownOpen(false);
      }
    };

    if (openMenuId || spotlightOpen || clockDropdownOpen || volumeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [openMenuId, spotlightOpen, clockDropdownOpen, volumeDropdownOpen]);

  // Focus spotlight input when opened
  useEffect(() => {
    if (spotlightOpen && spotlightInputRef.current) {
      spotlightInputRef.current.focus();
    }
  }, [spotlightOpen]);

  const handleMenuClick = useCallback((menuId: string) => {
    setOpenMenuId((prev) => (prev === menuId ? null : menuId));
    setSpotlightOpen(false);
    setClockDropdownOpen(false);
  }, []);

  const handleMenuHover = useCallback((menuId: string) => {
    if (openMenuId !== null && openMenuId !== menuId) {
      setOpenMenuId(menuId);
    }
  }, [openMenuId]);

  const handleMenuItemClick = useCallback((label: string) => {
    setOpenMenuId(null);
    if (label === 'About This Mac') {
      alert('Mac OS X Tiger 10.4.11\n\nThis is a portfolio website by Nick Smith');
    } else if (label === 'Restart...') {
      window.location.reload();
    }
  }, []);

  const handleSpotlightClick = useCallback(() => {
    setSpotlightOpen((prev) => !prev);
    setOpenMenuId(null);
    setClockDropdownOpen(false);
    if (!spotlightOpen) {
      setSpotlightQuery('');
    }
  }, [spotlightOpen]);

  const handleClockClick = useCallback(() => {
    setClockDropdownOpen((prev) => !prev);
    setOpenMenuId(null);
    setSpotlightOpen(false);
    setVolumeDropdownOpen(false);
  }, []);

  const handleVolumeClick = useCallback(() => {
    setVolumeDropdownOpen((prev) => !prev);
    setOpenMenuId(null);
    setSpotlightOpen(false);
    setClockDropdownOpen(false);
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  }, [setVolume]);

  const handleVolumeMouseUp = useCallback(() => {
    // Play sosumi to preview volume when user releases slider
    playSosumi();
  }, [playSosumi]);

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

      const menuItem = item as { label: string; shortcut?: string; disabled?: boolean; hasSubmenu?: boolean; checked?: boolean };
      return (
        <button
          key={menuItem.label}
          type="button"
          className={`${styles.dropdownItem} ${menuItem.disabled ? styles.dropdownItemDisabled : ''} ${menuItem.hasSubmenu ? styles.hasSubmenu : ''}`}
          onClick={() => !menuItem.disabled && !menuItem.hasSubmenu && handleMenuItemClick(menuItem.label)}
          role="menuitem"
          aria-disabled={menuItem.disabled}
          data-testid={`menu-item-${menuItem.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
        >
          {menuItem.checked && <span className={styles.checkmark}>✓</span>}
          <span className={styles.dropdownItemLabel}>{menuItem.label}</span>
          {menuItem.shortcut && !menuItem.hasSubmenu && (
            <span className={styles.dropdownItemShortcut}>{menuItem.shortcut}</span>
          )}
          {menuItem.hasSubmenu && (
            <span className={styles.dropdownItemShortcut}>▶</span>
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
            <div className={styles.dropdown} role="menu" data-testid="apple-menu-dropdown">
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => handleMenuItemClick('About This Mac')}
                role="menuitem"
              >
                <span className={styles.dropdownItemLabel}>About This Mac</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button type="button" className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`} role="menuitem" aria-disabled="true">
                <span className={styles.dropdownItemLabel}>Software Update...</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button type="button" className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`} role="menuitem" aria-disabled="true">
                <span className={styles.dropdownItemLabel}>System Preferences...</span>
              </button>
              <button type="button" className={`${styles.dropdownItem} ${styles.hasSubmenu}`} role="menuitem">
                <span className={styles.dropdownItemLabel}>Dock</span>
                <span className={styles.dropdownItemShortcut}>▶</span>
              </button>
              <button type="button" className={`${styles.dropdownItem} ${styles.hasSubmenu}`} role="menuitem">
                <span className={styles.dropdownItemLabel}>Location</span>
                <span className={styles.dropdownItemShortcut}>▶</span>
              </button>
              <button type="button" className={`${styles.dropdownItem} ${styles.hasSubmenu}`} role="menuitem">
                <span className={styles.dropdownItemLabel}>Recent Items</span>
                <span className={styles.dropdownItemShortcut}>▶</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button type="button" className={styles.dropdownItem} onClick={() => handleMenuItemClick('Force Quit')} role="menuitem">
                <span className={styles.dropdownItemLabel}>Force Quit {appName}</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button type="button" className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`} role="menuitem" aria-disabled="true">
                <span className={styles.dropdownItemLabel}>Sleep</span>
              </button>
              <button type="button" className={styles.dropdownItem} onClick={() => handleMenuItemClick('Restart...')} role="menuitem">
                <span className={styles.dropdownItemLabel}>Restart...</span>
              </button>
              <button type="button" className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`} role="menuitem" aria-disabled="true">
                <span className={styles.dropdownItemLabel}>Shut Down...</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button type="button" className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`} role="menuitem" aria-disabled="true">
                <span className={styles.dropdownItemLabel}>Log Out Nick Smith...</span>
                <span className={styles.dropdownItemShortcut}>⇧⌘Q</span>
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
            <div className={styles.dropdown} role="menu" data-testid="app-menu-dropdown">
              <button type="button" className={styles.dropdownItem} onClick={() => handleMenuItemClick(`About ${appName}`)} role="menuitem">
                <span className={styles.dropdownItemLabel}>About {appName}</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button type="button" className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`} role="menuitem" aria-disabled="true">
                <span className={styles.dropdownItemLabel}>Preferences...</span>
                <span className={styles.dropdownItemShortcut}>⌘,</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button type="button" className={`${styles.dropdownItem} ${styles.hasSubmenu}`} role="menuitem">
                <span className={styles.dropdownItemLabel}>Services</span>
                <span className={styles.dropdownItemShortcut}>▶</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button type="button" className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`} role="menuitem" aria-disabled="true">
                <span className={styles.dropdownItemLabel}>Hide {appName}</span>
                <span className={styles.dropdownItemShortcut}>⌘H</span>
              </button>
              <button type="button" className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`} role="menuitem" aria-disabled="true">
                <span className={styles.dropdownItemLabel}>Hide Others</span>
                <span className={styles.dropdownItemShortcut}>⌥⌘H</span>
              </button>
              <button type="button" className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`} role="menuitem" aria-disabled="true">
                <span className={styles.dropdownItemLabel}>Show All</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button type="button" className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`} role="menuitem" aria-disabled="true">
                <span className={styles.dropdownItemLabel}>Quit {appName}</span>
                <span className={styles.dropdownItemShortcut}>⌘Q</span>
              </button>
            </div>
          )}
        </div>

        {/* Application Menus - context-aware based on active app */}
        <nav className={styles.menuItems} aria-label="Application menu">
          {menus.map((menu) => (
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
                <div className={styles.dropdown} role="menu" data-testid={`${menu.id}-menu-dropdown`}>
                  {renderDropdownItems(menu.items)}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.right}>
        {/* Volume Control */}
        <div className={styles.menuContainer}>
          <button
            type="button"
            className={`${styles.volumeButton} ${volumeDropdownOpen ? styles.menuActive : ''}`}
            onClick={handleVolumeClick}
            aria-label="Volume control"
            aria-expanded={volumeDropdownOpen}
            data-testid="volume-button"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </button>

          {volumeDropdownOpen && (
            <div className={styles.volumeDropdown} data-testid="volume-dropdown">
              <div className={styles.volumeSliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  onMouseUp={handleVolumeMouseUp}
                  onTouchEnd={handleVolumeMouseUp}
                  className={styles.volumeSlider}
                  aria-label="Volume"
                />
                <div className={styles.volumeTrack}>
                  <div
                    className={styles.volumeFill}
                    style={{ height: `${volume * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clock with Dropdown */}
        <div className={styles.menuContainer}>
          <button
            type="button"
            className={`${styles.clockButton} ${clockDropdownOpen ? styles.menuActive : ''}`}
            onClick={handleClockClick}
            data-testid="clock"
          >
            {formatTime(time)}
          </button>

          {clockDropdownOpen && (
            <div className={`${styles.dropdown} ${styles.clockDropdown}`} data-testid="clock-dropdown">
              <div className={styles.clockDateDisplay}>
                {time.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className={styles.dropdownDivider} role="separator" />
              <button type="button" className={styles.dropdownItem} role="menuitem">
                <span className={styles.dropdownItemLabel}>View as Analog</span>
              </button>
              <button type="button" className={styles.dropdownItem} role="menuitem">
                <span className={styles.checkmark}>✓</span>
                <span className={styles.dropdownItemLabel}>View as Digital</span>
              </button>
              <div className={styles.dropdownDivider} role="separator" />
              <button type="button" className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`} role="menuitem" aria-disabled="true">
                <span className={styles.dropdownItemLabel}>Open Date & Time...</span>
              </button>
            </div>
          )}
        </div>

        {/* Spotlight - Tiger style horizontal bar */}
        <div className={styles.menuContainer}>
          <button
            type="button"
            className={styles.spotlightButton}
            onClick={handleSpotlightClick}
            aria-label="Spotlight search"
            aria-expanded={spotlightOpen}
            data-testid="spotlight-button"
          >
            <svg viewBox="0 0 20 20" width="20" height="20" className={styles.spotlightIcon} aria-hidden="true">
              <defs>
                <linearGradient id="spotlightBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7CB8FF" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>
              </defs>
              <circle cx="10" cy="10" r="9.5" fill="url(#spotlightBlueGradient)" />
              <circle cx="8.5" cy="8.5" r="3" fill="none" stroke="white" strokeWidth="1.5" />
              <line x1="11" y1="11" x2="14" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {spotlightOpen && (
            <div className={styles.spotlightDropdown} data-testid="spotlight-dropdown">
              <div className={styles.spotlightBar}>
                <span className={styles.spotlightLabel}>Spotlight</span>
                <input
                  ref={spotlightInputRef}
                  type="text"
                  className={styles.spotlightInput}
                  value={spotlightQuery}
                  onChange={(e) => setSpotlightQuery(e.target.value)}
                  aria-label="Search"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
