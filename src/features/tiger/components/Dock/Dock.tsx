import { useWindowStore } from '@/stores/windowStore';
import { motion, AnimatePresence } from 'motion/react';
import styles from './Dock.module.css';

/**
 * Dock component - Tiger-era application dock
 *
 * Displays minimized windows as icons at the bottom of the screen.
 * Clicking an icon restores the window.
 * Uses authentic Tiger glass shelf styling with reflection.
 */
export function Dock() {
  const windows = useWindowStore((s) => s.windows);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);

  // Get only minimized windows
  const minimizedWindows = windows.filter((w) => w.state === 'minimized');

  // Don't render dock if no minimized windows
  if (minimizedWindows.length === 0) {
    return null;
  }

  const handleIconClick = (windowId: string) => {
    restoreWindow(windowId);
  };

  return (
    <div className={styles.dockContainer} data-testid="dock">
      <div className={styles.dock}>
        <div className={styles.shelf}>
          <AnimatePresence>
            {minimizedWindows.map((window) => (
              <motion.button
                key={window.id}
                className={styles.dockIcon}
                onClick={() => handleIconClick(window.id)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1, y: -8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                aria-label={`Restore ${window.title}`}
                data-testid={`dock-icon-${window.id}`}
              >
                <div className={styles.iconImage}>
                  {getAppIcon(window.app)}
                </div>
                <span className={styles.iconLabel}>{window.title}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        {/* Reflection effect */}
        <div className={styles.reflection} aria-hidden="true" />
      </div>
    </div>
  );
}

/**
 * Get the appropriate icon for an app
 */
function getAppIcon(app: string): React.ReactNode {
  // Simple colored squares for now - can be replaced with actual icons
  const colors: Record<string, string> = {
    'About Me': '#4A90D9',
    'Projects': '#7B68EE',
    'Resume': '#E8E8E8',
    'Contact': '#50C878',
  };

  const color = colors[app] || '#808080';

  return (
    <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
      <defs>
        <linearGradient id={`icon-gradient-${app.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx="8"
        fill={`url(#icon-gradient-${app.replace(/\s/g, '')})`}
      />
      {/* Document icon overlay for minimized windows */}
      <rect x="14" y="10" width="20" height="26" rx="2" fill="white" fillOpacity="0.9" />
      <rect x="17" y="14" width="14" height="2" rx="1" fill={color} fillOpacity="0.5" />
      <rect x="17" y="19" width="14" height="2" rx="1" fill={color} fillOpacity="0.5" />
      <rect x="17" y="24" width="10" height="2" rx="1" fill={color} fillOpacity="0.5" />
    </svg>
  );
}
