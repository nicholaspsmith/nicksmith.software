import { useState, useEffect } from 'react';
import styles from './StatusBar.module.css';

/**
 * iOS 6 Status Bar
 *
 * Displays at the top of the screen with:
 * - Carrier name (left)
 * - Time (center)
 * - Battery indicator (right)
 */
export function StatusBar() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.statusBar} data-testid="ios-status-bar">
      {/* Left section - carrier and signal */}
      <div className={styles.leftSection}>
        <SignalBars />
        <span className={styles.carrier}>Carrier</span>
      </div>

      {/* Center - time */}
      <div className={styles.centerSection}>
        <span className={styles.time}>{time}</span>
      </div>

      {/* Right section - battery */}
      <div className={styles.rightSection}>
        <span className={styles.batteryPercent}>100%</span>
        <BatteryIcon />
      </div>
    </div>
  );
}

/**
 * Format time as 12-hour with AM/PM (iOS 6 style)
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Signal strength bars (iOS 6 style - 5 bars)
 */
function SignalBars() {
  return (
    <svg
      className={styles.signal}
      viewBox="0 0 20 12"
      width="20"
      height="12"
      aria-label="Full signal"
    >
      <rect x="0" y="9" width="3" height="3" fill="white" />
      <rect x="4" y="6" width="3" height="6" fill="white" />
      <rect x="8" y="4" width="3" height="8" fill="white" />
      <rect x="12" y="2" width="3" height="10" fill="white" />
      <rect x="16" y="0" width="3" height="12" fill="white" />
    </svg>
  );
}

/**
 * Battery icon (iOS 6 style)
 */
function BatteryIcon() {
  return (
    <svg
      className={styles.battery}
      viewBox="0 0 25 12"
      width="25"
      height="12"
      aria-label="Battery full"
    >
      {/* Battery outline */}
      <rect
        x="0"
        y="1"
        width="21"
        height="10"
        rx="2"
        fill="none"
        stroke="white"
        strokeWidth="1"
      />
      {/* Battery cap */}
      <rect x="22" y="4" width="2" height="4" rx="0.5" fill="white" />
      {/* Battery fill (green for full) */}
      <rect x="2" y="3" width="17" height="6" rx="1" fill="#4CD964" />
    </svg>
  );
}
