import { useState, useCallback } from 'react';
import { useWindowStore } from '@/stores/windowStore';
import { useAppStore } from '@/stores/appStore';
import { motion, AnimatePresence } from 'motion/react';
import { ContextMenu, type ContextMenuEntry } from '../ContextMenu';
import styles from './Dock.module.css';

/**
 * Bounce animation for dock icons when app is launching
 * - Single bounce: up and down once
 * - Smooth sinusoidal motion
 */
const BOUNCE_HEIGHT = -20;
const BOUNCE_DURATION = 0.4; // seconds for single bounce

const bounceAnimation = {
  y: [0, BOUNCE_HEIGHT, 0],
  transition: {
    duration: BOUNCE_DURATION,
    ease: [0.37, 0, 0.63, 1] as [number, number, number, number],
  },
};

/**
 * Parent app configurations for dock icons
 * Maps parentApp IDs to their display labels
 * TextEdit groups: about, projects, resume, contact
 * Terminal is its own app
 */
const PARENT_APP_CONFIG: Record<string, { label: string }> = {
  textEdit: { label: 'TextEdit' },
  terminal: { label: 'Terminal' },
  finder: { label: 'Finder' },
};

/**
 * Default dock icons that are always present
 * TextEdit and Terminal are always shown but only have running indicator when windows are open
 */
const DEFAULT_DOCK_ICONS = [
  { id: 'finder', label: 'Finder', icon: '/icons/finder.png' },
  { id: 'textEdit', label: 'TextEdit', icon: '/icons/textedit.png' },
  { id: 'terminal', label: 'Terminal', icon: '/icons/terminal.png' },
  { id: 'itunes', label: 'iTunes', icon: '/icons/itunes.png' },
  { id: 'quicktime', label: 'QuickTime Player', icon: '/icons/quicktime-logo.png' },
  { id: 'system-preferences', label: 'System Preferences', icon: '/icons/system-preferences.png' },
] as const;

/**
 * Dock component - Tiger-era application dock
 *
 * Layout (left to right):
 * - Default system icons (Finder, System Preferences)
 * - Running application icons (with indicator triangle)
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
  const openWindow = useWindowStore((s) => s.openWindow);
  const showAlert = useAppStore((s) => s.showAlert);
  const isDraggingMacintoshHD = useAppStore((s) => s.isDraggingMacintoshHD);
  const trashedIcons = useAppStore((s) => s.trashedIcons);
  const isHoveringOverTrash = useAppStore((s) => s.isHoveringOverTrash);
  const emptyTrash = useAppStore((s) => s.emptyTrash);

  // Track which icons are currently bouncing
  const [bouncingIcons, setBouncingIcons] = useState<Set<string>>(new Set());

  // Context menu state for trash
  const [trashContextMenu, setTrashContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Trigger bounce animation for an icon (single bounce)
  const triggerBounce = useCallback((iconId: string) => {
    setBouncingIcons((prev) => new Set(prev).add(iconId));
    // Clear after animation completes
    setTimeout(() => {
      setBouncingIcons((prev) => {
        const next = new Set(prev);
        next.delete(iconId);
        return next;
      });
    }, BOUNCE_DURATION * 1000);
  }, []);

  // Get running apps (open or minimized, but not closed)
  const runningApps = windows.filter((w) => w.state !== 'closed');

  // Get unique parent app IDs that are running, excluding apps in default icons
  const runningParentAppIds = [...new Set(runningApps.map((w) => w.parentApp))]
    .filter((id) => id !== 'textEdit' && id !== 'finder' && id !== 'terminal' && id !== 'itunes' && id !== 'quicktime');

  // Check if TextEdit has any running windows (for showing indicator)
  const hasTextEditWindows = runningApps.some((w) => w.parentApp === 'textEdit');

  // Check if Finder has any running windows (for showing indicator)
  const hasFinderWindows = runningApps.some((w) => w.parentApp === 'finder');

  // Check if Terminal has any running windows (for showing indicator)
  const hasTerminalWindows = runningApps.some((w) => w.parentApp === 'terminal');

  // Check if iTunes has any running windows (for showing indicator)
  const hasITunesWindows = runningApps.some((w) => w.parentApp === 'itunes');

  // Check if QuickTime has any running windows (for showing indicator)
  const hasQuickTimeWindows = runningApps.some((w) => w.parentApp === 'quicktime');

  // Get only minimized windows for thumbnails
  const minimizedWindows = windows.filter((w) => w.state === 'minimized');

  const handleDefaultIconClick = (e: React.MouseEvent, iconId: string) => {
    e.stopPropagation();

    if (iconId === 'textEdit') {
      // TextEdit: focus or restore windows if any exist
      const textEditWindows = windows
        .filter((w) => w.parentApp === 'textEdit' && w.state !== 'closed')
        .sort((a, b) => b.zIndex - a.zIndex);

      // Only bounce if TextEdit has no running windows (no activity indicator)
      // Apps with running indicator should not bounce
      if (!hasTextEditWindows) {
        triggerBounce('textEdit');
      }

      if (textEditWindows.length > 0) {
        const topWindow = textEditWindows[0];
        if (topWindow.state === 'minimized') {
          restoreWindow(topWindow.id);
        } else {
          focusWindow(topWindow.id);
        }
      } else {
        // No TextEdit windows open - open a blank document
        openWindow('untitled');
      }
    } else if (iconId === 'finder') {
      // Finder: focus or restore windows if any exist
      const finderWindows = windows
        .filter((w) => w.parentApp === 'finder' && w.state !== 'closed')
        .sort((a, b) => b.zIndex - a.zIndex);

      // Only bounce if Finder has no running windows
      if (!hasFinderWindows) {
        triggerBounce('finder');
      }

      if (finderWindows.length > 0) {
        const topWindow = finderWindows[0];
        if (topWindow.state === 'minimized') {
          restoreWindow(topWindow.id);
        } else {
          focusWindow(topWindow.id);
        }
      } else {
        // No Finder windows open - open home folder
        openWindow('finder-home');
      }
    } else if (iconId === 'terminal') {
      // Terminal: focus or restore windows if any exist
      const terminalWindows = windows
        .filter((w) => w.parentApp === 'terminal' && w.state !== 'closed')
        .sort((a, b) => b.zIndex - a.zIndex);

      // Only bounce if Terminal has no running windows
      if (!hasTerminalWindows) {
        triggerBounce('terminal');
      }

      if (terminalWindows.length > 0) {
        const topWindow = terminalWindows[0];
        if (topWindow.state === 'minimized') {
          restoreWindow(topWindow.id);
        } else {
          focusWindow(topWindow.id);
        }
      } else {
        // No Terminal windows open - open a new terminal
        openWindow('terminal');
      }
    } else if (iconId === 'itunes') {
      // iTunes: focus or restore window if it exists
      const itunesWindows = windows
        .filter((w) => w.parentApp === 'itunes' && w.state !== 'closed')
        .sort((a, b) => b.zIndex - a.zIndex);

      // Only bounce if iTunes has no running windows
      if (!hasITunesWindows) {
        triggerBounce('itunes');
      }

      if (itunesWindows.length > 0) {
        const topWindow = itunesWindows[0];
        if (topWindow.state === 'minimized') {
          restoreWindow(topWindow.id);
        } else {
          focusWindow(topWindow.id);
        }
      } else {
        // No iTunes window open - open iTunes
        useWindowStore.getState().openITunes();
      }
    } else if (iconId === 'quicktime') {
      // QuickTime: focus or restore window if it exists
      const quicktimeWindows = windows
        .filter((w) => w.parentApp === 'quicktime' && w.state !== 'closed')
        .sort((a, b) => b.zIndex - a.zIndex);

      // Only bounce if QuickTime has no running windows
      if (!hasQuickTimeWindows) {
        triggerBounce('quicktime');
      }

      if (quicktimeWindows.length > 0) {
        const topWindow = quicktimeWindows[0];
        if (topWindow.state === 'minimized') {
          restoreWindow(topWindow.id);
        } else {
          focusWindow(topWindow.id);
        }
      } else {
        // No QuickTime window open - open QuickTime
        useWindowStore.getState().openQuickTime();
      }
    } else if (iconId === 'system-preferences') {
      showAlert({
        title: 'System Preferences',
        message: 'System Preferences is coming soon!',
        type: 'note',
      });
    }
  };

  const handleParentAppClick = (e: React.MouseEvent, parentAppId: string) => {
    e.stopPropagation();

    // Running apps always have an activity indicator, so never bounce
    // The indicator means the app is already running - just focus the window

    // Find all windows for this parent app, sorted by z-index (most recent first)
    const appWindows = windows
      .filter((w) => w.parentApp === parentAppId && w.state !== 'closed')
      .sort((a, b) => b.zIndex - a.zIndex);

    if (appWindows.length > 0) {
      const topWindow = appWindows[0];
      if (topWindow.state === 'minimized') {
        restoreWindow(topWindow.id);
      } else {
        focusWindow(topWindow.id);
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
    openTrashWindow();
  };

  const openTrashWindow = () => {
    // Trash opens Finder with Trash view
    // Check if Finder Trash window already exists
    const trashWindow = windows.find((w) => w.app === 'finder-trash' && w.state !== 'closed');
    if (trashWindow) {
      if (trashWindow.state === 'minimized') {
        restoreWindow(trashWindow.id);
      } else {
        focusWindow(trashWindow.id);
      }
    } else {
      triggerBounce('trash');
      openWindow('finder-trash');
    }
  };

  const handleTrashContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTrashContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleEmptyTrash = () => {
    if (trashedIcons.length === 0) {
      showAlert({
        title: 'Trash',
        message: 'The Trash is already empty.',
        type: 'note',
      });
      return;
    }

    showAlert({
      title: 'Empty Trash',
      message: `Are you sure you want to permanently delete ${trashedIcons.length} item${trashedIcons.length !== 1 ? 's' : ''}?`,
      type: 'caution',
      okText: 'Empty Trash',
      showCancel: true,
      onOk: () => {
        emptyTrash();
      },
    });
  };

  // Trash context menu items
  const trashContextMenuItems: ContextMenuEntry[] = [
    { type: 'item', label: 'Open', onClick: openTrashWindow },
    { type: 'divider' },
    { type: 'item', label: 'Empty Trash', onClick: handleEmptyTrash, disabled: trashedIcons.length === 0 },
  ];

  return (
    <div
      className={styles.dockContainer}
      data-testid="dock"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.dock}>
        <motion.div
          className={styles.shelf}
          layout
          transition={{ duration: 0.2, ease: 'linear' }}
        >
          {/* Default system icons */}
          <div className={styles.appSection}>
            {DEFAULT_DOCK_ICONS.map((icon) => {
              // Finder always shows indicator (it's always running in macOS)
              // TextEdit, Terminal, iTunes, QuickTime show indicator only when they have windows
              const showIndicator =
                icon.id === 'finder' ||
                (icon.id === 'textEdit' && hasTextEditWindows) ||
                (icon.id === 'terminal' && hasTerminalWindows) ||
                (icon.id === 'itunes' && hasITunesWindows) ||
                (icon.id === 'quicktime' && hasQuickTimeWindows);
              const isBouncing = bouncingIcons.has(icon.id);

              return (
                <div key={icon.id} className={styles.iconWrapper}>
                  <motion.button
                    className={styles.dockIcon}
                    onClick={(e) => handleDefaultIconClick(e, icon.id)}
                    animate={isBouncing ? bounceAnimation : { y: 0 }}
                    aria-label={icon.label}
                    data-label={icon.label}
                    data-testid={`dock-icon-${icon.id}`}
                  >
                    <div className={styles.iconImage}>
                      <img
                        src={icon.icon}
                        alt=""
                        width={48}
                        height={48}
                        draggable={false}
                        aria-hidden="true"
                      />
                    </div>
                  </motion.button>
                  <AnimatePresence>
                    {showIndicator && (
                      <motion.div
                        className={styles.runningIndicator}
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Running application icons (one per parent app, e.g., one TextEdit icon) */}
          <AnimatePresence mode="popLayout">
            {runningParentAppIds.map((parentAppId) => {
              const config = PARENT_APP_CONFIG[parentAppId];
              if (!config) return null;
              const iconKey = `app-${parentAppId}`;
              const isBouncing = bouncingIcons.has(iconKey);
              return (
                <motion.div
                  key={iconKey}
                  className={styles.iconWrapper}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <motion.button
                    className={styles.dockIcon}
                    onClick={(e) => handleParentAppClick(e, parentAppId)}
                    animate={isBouncing ? bounceAnimation : { y: 0 }}
                    aria-label={config.label}
                    data-label={config.label}
                    data-testid={`dock-icon-app-${parentAppId}`}
                  >
                    <div className={styles.iconImage}>
                      <AppIcon parentAppId={parentAppId} />
                    </div>
                  </motion.button>
                  {/* Running indicator stays fixed - doesn't bounce with icon */}
                  <div className={styles.runningIndicator} aria-hidden="true" />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Separator before minimized windows */}
          {minimizedWindows.length > 0 && (
            <div className={styles.separator} aria-hidden="true" />
          )}

          {/* Minimized window thumbnails */}
          <AnimatePresence mode="popLayout">
            {minimizedWindows.map((window) => {
              const isBouncing = bouncingIcons.has(window.id);
              return (
                <motion.div
                  key={window.id}
                  className={styles.iconWrapper}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <motion.button
                    className={styles.dockIcon}
                    onClick={(e) => handleMinimizedWindowClick(e, window.id)}
                    animate={isBouncing ? bounceAnimation : { y: 0 }}
                    aria-label={`Restore ${window.title}`}
                    data-label={window.title}
                    data-testid={`dock-icon-${window.id}`}
                  >
                    <div className={styles.iconImage}>
                      <MinimizedWindowThumbnail app={window.app} title={window.title} />
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Separator before trash */}
          <div className={styles.separator} aria-hidden="true" />

          {/* Trash icon - shows eject when dragging Macintosh HD */}
          <button
            className={`${styles.dockIcon} ${isHoveringOverTrash ? styles.dockIconDragOver : ''}`}
            onClick={(e) => handleTrashClick(e)}
            onContextMenu={handleTrashContextMenu}
            aria-label={isDraggingMacintoshHD ? 'Eject' : 'Trash'}
            data-label={isDraggingMacintoshHD ? 'Eject' : 'Trash'}
            data-testid="dock-icon-trash"
          >
            <div
              className={styles.iconImage}
              style={isHoveringOverTrash ? { filter: 'brightness(0.8)' } : undefined}
            >
              <TrashIcon showEject={isDraggingMacintoshHD} hasItems={trashedIcons.length > 0} />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Trash context menu */}
      {trashContextMenu && (
        <ContextMenu
          x={trashContextMenu.x}
          y={trashContextMenu.y}
          items={trashContextMenuItems}
          onClose={() => setTrashContextMenu(null)}
        />
      )}
    </div>
  );
}

/**
 * App icon for running applications in dock (Terminal, etc.)
 * TextEdit is now a permanent dock icon, so only other apps use this
 */
function AppIcon({ parentAppId }: { parentAppId: string }) {
  if (parentAppId === 'terminal') {
    return (
      <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
        <rect x="4" y="4" width="40" height="40" rx="8" fill="#1A1A1A" />
        <text x="12" y="30" fontSize="20" fill="#33FF33" fontFamily="monospace">&gt;_</text>
      </svg>
    );
  }

  // Fallback: generic document icon
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
 * When a disk (Macintosh HD) is being dragged, shows eject icon instead
 * Shows full trash icon when there are items in the trash
 */
function TrashIcon({ showEject = false, hasItems = false }: { showEject?: boolean; hasItems?: boolean }) {
  let iconSrc = '/icons/trash-empty.png';
  if (showEject) {
    iconSrc = '/icons/EjectMediaIcon.png';
  } else if (hasItems) {
    iconSrc = '/icons/trash-full.png';
  }
  return <img src={iconSrc} alt="" width={48} height={48} draggable={false} aria-hidden="true" />;
}
