import { useCallback } from 'react';
import { MotionConfig } from 'motion/react';
import { useAppStore } from '@/stores/appStore';
import { useWindowStore } from '@/stores/windowStore';
import {
  useKeyboardShortcuts,
  useReducedMotion,
  useViewport,
  MOBILE_BREAKPOINT,
} from '@/hooks';
import { Desktop } from '@/features/tiger/components/Desktop';
import { DesktopIconGrid } from '@/features/tiger/components/DesktopIconGrid';
import { DesktopIcon } from '@/features/tiger/components/DesktopIcon';
import { Window } from '@/features/tiger/components/Window';
import { MobileFallback } from '@/features/tiger/components/MobileFallback';
import { AlertDialog } from '@/features/tiger/components/AlertDialog';
import { TerminalIcon } from '@/features/tiger/components/icons';
import { AboutMe } from '@/features/apps/AboutMe';
import { Projects } from '@/features/apps/Projects';
import { Resume } from '@/features/apps/Resume';
import { Contact } from '@/features/apps/Contact';
import { Terminal as TerminalApp } from '@/features/apps/Terminal';

/**
 * Desktop icons configuration
 * Vertical column: Macintosh HD at top, then apps below
 * Using official Tiger icons from /icons/
 */
const DESKTOP_ICONS = [
  { id: 'macintosh-hd', label: 'Macintosh HD', icon: '/icons/macintosh-hd.png', opensWindow: false },
  { id: 'terminal', label: 'Terminal', icon: 'terminal', opensWindow: true },
  { id: 'about', label: 'About Me', icon: '/icons/document.png', opensWindow: true },
  { id: 'projects', label: 'Projects', icon: '/icons/document.png', opensWindow: true },
  { id: 'resume', label: 'Resume', icon: '/icons/document.png', opensWindow: true },
  { id: 'contact', label: 'Contact', icon: '/icons/document.png', opensWindow: true },
] as const;

type IconConfig = (typeof DESKTOP_ICONS)[number];

/**
 * Renders the appropriate icon based on config
 * Uses official Tiger PNG icons where available
 */
function DesktopIconImage({ icon, isSelected }: { icon: IconConfig; isSelected?: boolean }) {
  // Special case for Macintosh HD - changes when selected
  if (icon.id === 'macintosh-hd') {
    const src = isSelected ? '/icons/macintosh-hd-selected.png' : '/icons/macintosh-hd.png';
    return <img src={src} alt="" width={48} height={48} draggable={false} />;
  }

  // Terminal uses custom SVG (no official icon available)
  if (icon.icon === 'terminal') {
    return <TerminalIcon />;
  }

  // PNG icons for documents and other items
  return <img src={icon.icon} alt="" width={48} height={48} draggable={false} />;
}

/**
 * Renders the appropriate content for a window based on its app type
 */
function WindowContent({ app }: { app: string }) {
  switch (app) {
    case 'about':
      return <AboutMe />;
    case 'projects':
      return <Projects />;
    case 'resume':
      return <Resume />;
    case 'contact':
      return <Contact />;
    case 'terminal':
      return <TerminalApp />;
    default:
      return <div style={{ padding: 16 }}>{app} content</div>;
  }
}

/**
 * App - Root application component
 *
 * Renders the Tiger desktop with portfolio icons.
 * Icons are arranged in the top-right corner following
 * Mac OS X Tiger's column-first layout pattern.
 *
 * Double-clicking an icon opens a window for that app.
 */
export function App() {
  // Enable Tiger keyboard shortcuts (⌘W, ⌘M)
  useKeyboardShortcuts();
  // Detect reduced motion preference
  const prefersReducedMotion = useReducedMotion();
  // Track viewport for mobile fallback
  const viewport = useViewport();

  // Show mobile fallback for small screens (< 1024px)
  if (viewport.width < MOBILE_BREAKPOINT) {
    return <MobileFallback />;
  }

  const selectedIconId = useAppStore((s) => s.selectedIconId);
  const selectIcon = useAppStore((s) => s.selectIcon);
  const alertOpen = useAppStore((s) => s.alertOpen);
  const alertConfig = useAppStore((s) => s.alertConfig);
  const hideAlert = useAppStore((s) => s.hideAlert);
  const windows = useWindowStore((s) => s.windows);
  const openWindow = useWindowStore((s) => s.openWindow);

  // Handle alert OK button
  const handleAlertOk = useCallback(() => {
    alertConfig?.onOk?.();
    hideAlert();
  }, [alertConfig, hideAlert]);

  // Handle alert Cancel button
  const handleAlertCancel = useCallback(() => {
    alertConfig?.onCancel?.();
    hideAlert();
  }, [alertConfig, hideAlert]);

  const handleDoubleClick = (icon: IconConfig) => {
    if (icon.opensWindow) {
      openWindow(icon.id);
      // Clear selection after opening window (Tiger behavior)
      useAppStore.getState().clearSelection();
    }
  };

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
      <Desktop>
        <DesktopIconGrid>
          {DESKTOP_ICONS.map((icon) => (
            <DesktopIcon
              key={icon.id}
              id={icon.id}
              label={icon.label}
              icon={<DesktopIconImage icon={icon} isSelected={selectedIconId === icon.id} />}
              isSelected={selectedIconId === icon.id}
              onClick={() => selectIcon(icon.id)}
              onDoubleClick={() => handleDoubleClick(icon)}
            />
          ))}
        </DesktopIconGrid>
        {windows
          .filter((w) => w.state !== 'closed')
          .map((w) => (
            <Window key={w.id} id={w.id} title={w.title}>
              <WindowContent app={w.app} />
            </Window>
          ))}
      </Desktop>
      {/* Global alert dialog */}
      <AlertDialog
        isOpen={alertOpen}
        title={alertConfig?.title ?? ''}
        message={alertConfig?.message ?? ''}
        type={alertConfig?.type}
        okText={alertConfig?.okText}
        cancelText={alertConfig?.cancelText}
        showCancel={alertConfig?.showCancel}
        onOk={handleAlertOk}
        onCancel={handleAlertCancel}
        playSound={alertConfig?.playSound}
      />
    </MotionConfig>
  );
}
