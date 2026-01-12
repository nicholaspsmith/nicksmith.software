import styles from './DesktopIconGrid.module.css';

export interface DesktopIconGridProps {
  children: React.ReactNode;
}

/**
 * DesktopIconGrid component - Container for desktop icons
 *
 * Full-screen container that allows icons to be positioned absolutely.
 * Icons manage their own positions via the appStore.
 * Container has pointer-events: none so clicks pass through to desktop.
 *
 * Uses position: absolute (not fixed) to avoid creating a stacking context,
 * allowing individual dragged icons to appear above windows with their own z-index.
 */
export function DesktopIconGrid({ children }: DesktopIconGridProps) {
  return (
    <div
      className={styles.grid}
      data-testid="desktop-icon-grid"
    >
      {children}
    </div>
  );
}
