import { useState, useEffect, useRef, useCallback } from 'react';
import { useWindowStore } from '@/stores/windowStore';
import styles from './MenuBar.module.css';

/**
 * MenuBar component - Tiger-era menu bar at top of screen
 *
 * Displays Apple logo, current app name, and clock.
 * Fixed at top with authentic Tiger styling.
 *
 * The app name updates to show the focused window's app,
 * or "Finder" when no windows are focused.
 */
export function MenuBar() {
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const windows = useWindowStore((s) => s.windows);
  const [time, setTime] = useState(new Date());
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const appleMenuRef = useRef<HTMLDivElement>(null);

  // Derive app name from focused window, default to "Finder"
  const activeWindow = windows.find((w) => w.id === activeWindowId);
  const appName = activeWindow?.title ?? 'Finder';

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Close Apple menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (appleMenuRef.current && !appleMenuRef.current.contains(e.target as Node)) {
        setIsAppleMenuOpen(false);
      }
    };

    if (isAppleMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isAppleMenuOpen]);

  // Close Apple menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAppleMenuOpen) {
        setIsAppleMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAppleMenuOpen]);

  const handleAppleMenuClick = useCallback(() => {
    setIsAppleMenuOpen((prev) => !prev);
  }, []);

  const handleAboutClick = useCallback(() => {
    // For MVP, just log or show alert - could open a modal later
    setIsAppleMenuOpen(false);
    alert('Mac OS X Tiger 10.4.11\n\nThis is a portfolio website by Nick Smith');
  }, []);

  const handleRestartClick = useCallback(() => {
    setIsAppleMenuOpen(false);
    // Reload the page for "restart"
    window.location.reload();
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <header className={styles.menuBar} data-testid="menu-bar">
      <div className={styles.left}>
        {/* Apple Logo with Dropdown */}
        <div className={styles.appleMenuContainer} ref={appleMenuRef}>
          <button
            type="button"
            className={`${styles.appleLogo} ${isAppleMenuOpen ? styles.appleLogoActive : ''}`}
            onClick={handleAppleMenuClick}
            aria-label="Apple menu"
            aria-expanded={isAppleMenuOpen}
            aria-haspopup="menu"
            data-testid="apple-menu-button"
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          </button>

          {/* Apple Menu Dropdown */}
          {isAppleMenuOpen && (
            <div
              className={styles.dropdown}
              role="menu"
              data-testid="apple-menu-dropdown"
            >
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={handleAboutClick}
                role="menuitem"
              >
                About This Mac
              </button>
              <div className={styles.dropdownDivider} />
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={handleRestartClick}
                role="menuitem"
              >
                Restart...
              </button>
            </div>
          )}
        </div>

        {/* App Name */}
        <span className={styles.appName} data-testid="app-name">
          {appName}
        </span>
      </div>

      <div className={styles.right}>
        {/* Clock */}
        <span className={styles.clock} data-testid="clock">
          {formatTime(time)}
        </span>
      </div>
    </header>
  );
}
