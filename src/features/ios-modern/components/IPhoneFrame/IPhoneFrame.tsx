import { type ReactNode } from 'react';
import styles from './IPhoneFrame.module.css';

interface IPhoneFrameProps {
  children: ReactNode;
  /** Screen brightness (0-1), applies CSS filter */
  brightness?: number;
}

/**
 * IPhoneFrame - iPhone bezel wrapper with notch
 *
 * Renders a realistic iPhone frame with:
 * - 64px border radius
 * - Notch pseudo-element at top
 * - Optional brightness filter for screen dimming
 */
export function IPhoneFrame({ children, brightness = 1 }: IPhoneFrameProps) {
  return (
    <div className={styles.frame}>
      <div
        className={styles.content}
        style={{ filter: brightness < 1 ? `brightness(${brightness})` : undefined }}
      >
        {children}
      </div>
    </div>
  );
}
