import { useAppStore } from '@/stores/appStore';
import { useWindowStore } from '@/stores/windowStore';
import { MenuBar } from '../MenuBar';
import { Dock } from '../Dock';
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
 *
 * Clicking on the desktop background clears any icon selection
 * and deactivates any active window.
 */
export function Desktop({ children }: DesktopProps) {
  const clearSelection = useAppStore((s) => s.clearSelection);
  const clearActiveWindow = useWindowStore((s) => s.clearActiveWindow);

  const handleClick = () => {
    clearSelection();
    clearActiveWindow();
  };

  return (
    <div
      className={styles.desktop}
      data-testid="desktop"
      onClick={handleClick}
    >
      <MenuBar />
      {children}
      <Dock />
    </div>
  );
}
