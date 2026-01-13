import { type ReactNode } from 'react';
import styles from './IPhoneFrame.module.css';

interface IPhoneFrameProps {
  children: ReactNode;
}

/**
 * IPhoneFrame - iPhone bezel wrapper with notch
 *
 * Renders a realistic iPhone frame with:
 * - 16px black border (bezel)
 * - 64px border radius
 * - Notch pseudo-element at top
 */
export function IPhoneFrame({ children }: IPhoneFrameProps) {
  return (
    <div className={styles.frame}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
