import { useState, useCallback } from 'react';
import { useWindowStore } from '@/stores/windowStore';
import { useAppStore } from '@/stores/appStore';
import { motion, AnimatePresence } from 'motion/react';
import styles from './Dock.module.css';

/**
 * Bounce animation for dock icons when app is launching
 * - Constant height bounce (same y each time, not decreasing)
 * - Slow, steady rhythm
 * - Only applies to app-launching icons (not Finder, System Preferences, Trash)
 */
const BOUNCE_HEIGHT = -25;
const BOUNCE_CYCLE_DURATION = 0.5; // seconds per bounce cycle

const bounceAnimation = {
  y: [0, BOUNCE_HEIGHT, 0],
  transition: {
    duration: BOUNCE_CYCLE_DURATION,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

/**
 * App configurations for dock icons
 * Maps app IDs to their display labels
 */
const APP_CONFIG: Record<string, { label: string }> = {
  about: { label: 'About Me' },
  projects: { label: 'Projects' },
  resume: { label: 'Resume' },
  contact: { label: 'Contact' },
  terminal: { label: 'Terminal' },
};

/**
 * Default dock icons that are always present (Finder, System Preferences)
 */
const DEFAULT_DOCK_ICONS = [
  { id: 'finder', label: 'Finder' },
  { id: 'system-preferences', label: 'System Preferences' },
] as const;

/**
 * Dock component - Tiger-era application dock
 *
 * Layout (left to right):
 * - Default system icons (Finder, System Preferences)
 * - Running application icons (with indicator dot)
 * - Separator
 * - Minimized window thumbnails
 * - Separator
 * - Trash
 *
 * Clicking behavior:
 * - Running app icon: Focus window (or restore if minimized)
 * - Minimized thumbnail: Restore window
 */
export function Dock() {
  const windows = useWindowStore((s) => s.windows);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const showAlert = useAppStore((s) => s.showAlert);

  // Track which icons are currently bouncing
  const [bouncingIcons, setBouncingIcons] = useState<Set<string>>(new Set());

  // Trigger bounce animation for an icon (for app-launching icons only)
  // Bounces for a random duration between 1-3 seconds
  const triggerBounce = useCallback((iconId: string) => {
    setBouncingIcons((prev) => new Set(prev).add(iconId));
    // Random duration between 1-3 seconds
    const bounceDuration = 1000 + Math.random() * 2000;
    setTimeout(() => {
      setBouncingIcons((prev) => {
        const next = new Set(prev);
        next.delete(iconId);
        return next;
      });
    }, bounceDuration);
  }, []);

  // Get running apps (open or minimized, but not closed)
  const runningApps = windows.filter((w) => w.state !== 'closed');

  // Get unique app IDs that are running
  const runningAppIds = [...new Set(runningApps.map((w) => w.app))];

  // Get only minimized windows for thumbnails
  const minimizedWindows = windows.filter((w) => w.state === 'minimized');

  const handleDefaultIconClick = (e: React.MouseEvent, iconId: string) => {
    e.stopPropagation();
    // Don't bounce - these icons don't launch apps yet
    if (iconId === 'finder') {
      showAlert({
        title: 'Finder',
        message: 'Finder is coming soon!',
        type: 'note',
      });
    } else if (iconId === 'system-preferences') {
      showAlert({
        title: 'System Preferences',
        message: 'System Preferences is coming soon!',
        type: 'note',
      });
    }
  };

  const handleRunningAppClick = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    triggerBounce(`app-${appId}`);
    // Find the window for this app
    const appWindow = windows.find((w) => w.app === appId && w.state !== 'closed');
    if (appWindow) {
      if (appWindow.state === 'minimized') {
        restoreWindow(appWindow.id);
      } else {
        focusWindow(appWindow.id);
      }
    }
  };

  const handleMinimizedWindowClick = (e: React.MouseEvent, windowId: string) => {
    e.stopPropagation();
    triggerBounce(windowId);
    restoreWindow(windowId);
  };

  const handleTrashClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Don't bounce - Trash doesn't launch an app
    showAlert({
      title: 'Trash',
      message: 'The Trash is empty.',
      type: 'note',
      playSound: false, // No error sound for info
    });
  };

  return (
    <div
      className={styles.dockContainer}
      data-testid="dock"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.dock}>
        <div className={styles.shelf}>
          {/* Default system icons - no bounce (they don't launch apps yet) */}
          <div className={styles.appSection}>
            {DEFAULT_DOCK_ICONS.map((icon) => (
              <button
                key={icon.id}
                className={styles.dockIcon}
                onClick={(e) => handleDefaultIconClick(e, icon.id)}
                aria-label={icon.label}
                data-label={icon.label}
                data-testid={`dock-icon-${icon.id}`}
              >
                <div className={styles.iconImage}>
                  <DefaultIcon iconId={icon.id} />
                </div>
              </button>
            ))}
          </div>

          {/* Running application icons */}
          <AnimatePresence>
            {runningAppIds.map((appId) => {
              const config = APP_CONFIG[appId];
              if (!config) return null;
              const iconKey = `app-${appId}`;
              const isBouncing = bouncingIcons.has(iconKey);
              return (
                <motion.button
                  key={iconKey}
                  className={styles.dockIcon}
                  onClick={(e) => handleRunningAppClick(e, appId)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isBouncing ? { ...bounceAnimation, scale: 1, opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  aria-label={config.label}
                  data-label={config.label}
                  data-testid={`dock-icon-app-${appId}`}
                >
                  <div className={styles.iconImage}>
                    <AppIcon appId={appId} />
                  </div>
                  <div className={styles.runningIndicator} aria-hidden="true" />
                </motion.button>
              );
            })}
          </AnimatePresence>

          {/* Separator before minimized windows */}
          {minimizedWindows.length > 0 && (
            <div className={styles.separator} aria-hidden="true" />
          )}

          {/* Minimized window thumbnails */}
          <AnimatePresence>
            {minimizedWindows.map((window) => {
              const isBouncing = bouncingIcons.has(window.id);
              return (
                <motion.button
                  key={window.id}
                  className={styles.dockIcon}
                  onClick={(e) => handleMinimizedWindowClick(e, window.id)}
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={isBouncing ? { ...bounceAnimation, scale: 1, opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  aria-label={`Restore ${window.title}`}
                  data-label={window.title}
                  data-testid={`dock-icon-${window.id}`}
                >
                  <div className={styles.iconImage}>
                    <MinimizedWindowThumbnail app={window.app} title={window.title} />
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>

          {/* Separator before trash */}
          <div className={styles.separator} aria-hidden="true" />

          {/* Trash icon - no bounce (doesn't launch an app) */}
          <button
            className={styles.dockIcon}
            onClick={(e) => handleTrashClick(e)}
            aria-label="Trash"
            data-label="Trash"
            data-testid="dock-icon-trash"
          >
            <div className={styles.iconImage}>
              <TrashIcon />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Default dock icon (Finder, System Preferences)
 * Uses official Tiger PNG icons
 */
function DefaultIcon({ iconId }: { iconId: string }) {
  const iconMap: Record<string, string> = {
    finder: '/icons/finder.png',
    'system-preferences': '/icons/system-preferences.png',
  };

  const src = iconMap[iconId];
  if (!src) return null;

  return <img src={src} alt="" width={48} height={48} draggable={false} aria-hidden="true" />;
}

/**
 * App icon for running applications in dock
 * Terminal uses custom SVG, others use document.png
 */
function AppIcon({ appId }: { appId: string }) {
  if (appId === 'terminal') {
    return (
      <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
        <rect x="4" y="4" width="40" height="40" rx="8" fill="#1A1A1A" />
        <text x="12" y="30" fontSize="20" fill="#33FF33" fontFamily="monospace">&gt;_</text>
      </svg>
    );
  }

  // Generic document icon for other apps
  return <img src="/icons/document.png" alt="" width={48} height={48} draggable={false} aria-hidden="true" />;
}

/**
 * Minimized window thumbnail - looks like a mini version of the window
 */
function MinimizedWindowThumbnail({ app, title }: { app: string; title: string }) {
  const colors: Record<string, string> = {
    about: '#FF9500',
    projects: '#28C940',
    resume: '#4CA1E4',
    contact: '#FF5F57',
    terminal: '#1A1A1A',
  };

  const color = colors[app] || '#808080';

  return (
    <svg viewBox="0 0 64 48" width="64" height="48" aria-hidden="true">
      {/* Window shadow */}
      <rect x="4" y="4" width="56" height="42" rx="4" fill="rgba(0,0,0,0.2)" />
      {/* Window frame */}
      <rect x="2" y="2" width="56" height="42" rx="4" fill="white" stroke="#999" strokeWidth="0.5" />
      {/* Title bar */}
      <rect x="2" y="2" width="56" height="12" rx="4" fill="#E8E8E8" />
      <rect x="2" y="10" width="56" height="4" fill="#E8E8E8" />
      {/* Traffic lights (smaller) */}
      <circle cx="10" cy="8" r="2.5" fill="#FF5F57" />
      <circle cx="18" cy="8" r="2.5" fill="#FFBD2E" />
      <circle cx="26" cy="8" r="2.5" fill="#28C940" />
      {/* Title text (truncated) */}
      <text x="34" y="11" fontSize="6" fill="#333" fontFamily="system-ui">
        {title.length > 8 ? title.slice(0, 8) + '...' : title}
      </text>
      {/* Content area with app color accent */}
      <rect x="4" y="16" width="52" height="26" fill="white" />
      <rect x="6" y="18" width="48" height="3" fill={color} rx="1" />
      <rect x="6" y="24" width="40" height="2" fill="#ddd" rx="1" />
      <rect x="6" y="28" width="44" height="2" fill="#ddd" rx="1" />
      <rect x="6" y="32" width="36" height="2" fill="#ddd" rx="1" />
    </svg>
  );
}

/**
 * Trash can icon - uses official Tiger PNG
 */
function TrashIcon() {
  return <img src="/icons/trash-empty.png" alt="" width={48} height={48} draggable={false} aria-hidden="true" />;
}
