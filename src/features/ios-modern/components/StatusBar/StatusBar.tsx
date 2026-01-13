import { useState, useEffect } from 'react';
import styles from './StatusBar.module.css';

interface StatusBarProps {
  /** Color variant - 'light' for white text, 'dark' for black text */
  variant?: 'light' | 'dark';
}

/**
 * iOS 15+ Status Bar
 *
 * Displays at the top of the screen with:
 * - Time (center, left of notch)
 * - Signal bars (left)
 * - Battery indicator (right)
 */
export function StatusBar({ variant = 'light' }: StatusBarProps) {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${styles.statusBar} ${styles[variant]}`} data-testid="ios-modern-status-bar">
      {/* Left section - time (iOS 15+ shows time on left) */}
      <div className={styles.leftSection}>
        <span className={styles.time}>{time}</span>
      </div>

      {/* Right section - signal, wifi, battery */}
      <div className={styles.rightSection}>
        <SignalBars variant={variant} />
        <WifiIcon variant={variant} />
        <div className={styles.battery}>
          <BatteryIcon variant={variant} />
        </div>
      </div>
    </div>
  );
}

/**
 * Format time as 12-hour format without AM/PM (iOS 15+ style)
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(/\s?(AM|PM)$/i, '');
}

/**
 * Signal strength bars (iOS 15+ style - 4 bars)
 */
function SignalBars({ variant }: { variant: 'light' | 'dark' }) {
  const color = variant === 'light' ? '#fff' : '#000';
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-label="Full signal">
      <rect x="0" y="8" width="3" height="4" rx="0.5" fill={color} />
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" fill={color} />
      <rect x="9" y="3" width="3" height="9" rx="0.5" fill={color} />
      <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill={color} />
    </svg>
  );
}

/**
 * WiFi icon (iOS 15+ style)
 */
function WifiIcon({ variant }: { variant: 'light' | 'dark' }) {
  const color = variant === 'light' ? '#fff' : '#000';
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-label="WiFi connected">
      <path
        d="M8 3.5C10.5 3.5 12.7 4.5 14.3 6.1L15.5 4.9C13.5 2.9 10.9 1.7 8 1.7C5.1 1.7 2.5 2.9 0.5 4.9L1.7 6.1C3.3 4.5 5.5 3.5 8 3.5Z"
        fill={color}
      />
      <path
        d="M8 6.5C9.7 6.5 11.2 7.2 12.3 8.3L13.5 7.1C12 5.6 10.1 4.7 8 4.7C5.9 4.7 4 5.6 2.5 7.1L3.7 8.3C4.8 7.2 6.3 6.5 8 6.5Z"
        fill={color}
      />
      <path
        d="M8 9.5C8.9 9.5 9.7 9.9 10.3 10.5L11.5 9.3C10.5 8.3 9.3 7.7 8 7.7C6.7 7.7 5.5 8.3 4.5 9.3L5.7 10.5C6.3 9.9 7.1 9.5 8 9.5Z"
        fill={color}
      />
      <circle cx="8" cy="11" r="1" fill={color} />
    </svg>
  );
}

/**
 * Battery icon (iOS 15+ style)
 */
function BatteryIcon({ variant }: { variant: 'light' | 'dark' }) {
  const color = variant === 'light' ? '#fff' : '#000';
  return (
    <svg
      className={styles.batteryIcon}
      viewBox="0 0 25 12"
      fill="none"
      aria-label="Battery full"
    >
      {/* Battery outline */}
      <rect
        x="0.5"
        y="0.5"
        width="21"
        height="11"
        rx="2.5"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      {/* Battery cap */}
      <path
        d="M23 4V8C24.1 8 24.5 7 24.5 6C24.5 5 24.1 4 23 4Z"
        fill={color}
        opacity="0.4"
      />
      {/* Battery fill */}
      <rect x="2" y="2" width="18" height="8" rx="1.5" fill={color} />
    </svg>
  );
}
