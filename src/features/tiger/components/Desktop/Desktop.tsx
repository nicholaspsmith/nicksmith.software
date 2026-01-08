import { MenuBar } from '../MenuBar';
import styles from './Desktop.module.css';

export interface DesktopProps {
  children?: React.ReactNode;
}

/**
 * Desktop component - The root visual layer of the Tiger UI
 *
 * Renders the Aqua blue background that fills the viewport,
 * serving as the container for all desktop elements (icons, windows).
 * Includes the MenuBar fixed at the top.
 */
export function Desktop({ children }: DesktopProps) {
  return (
    <div className={styles.desktop} data-testid="desktop">
      <MenuBar />
      {children}
    </div>
  );
}
