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
import { DocumentIcon, TerminalIcon } from '@/features/tiger/components/icons';
import { AboutMe } from '@/features/apps/AboutMe';
import { Projects } from '@/features/apps/Projects';
import { Resume } from '@/features/apps/Resume';
import { Contact } from '@/features/apps/Contact';
import { Terminal as TerminalApp } from '@/features/apps/Terminal';

/**
 * Portfolio app configuration
 * Each entry defines an icon on the desktop
 */
const PORTFOLIO_APPS = [
  { id: 'resume', label: 'Resume', color: '#4ca1e4', abbrev: 'CV', iconType: 'document' },
  { id: 'projects', label: 'Projects', color: '#28c940', abbrev: 'DEV', iconType: 'document' },
  { id: 'about', label: 'About Me', color: '#ff9500', abbrev: 'ME', iconType: 'document' },
  { id: 'contact', label: 'Contact', color: '#ff5f57', abbrev: '@', iconType: 'document' },
  { id: 'terminal', label: 'Terminal', iconType: 'terminal' },
] as const;

type AppConfig = (typeof PORTFOLIO_APPS)[number];

/**
 * Renders the appropriate icon for an app based on its iconType
 */
function AppIcon({ app }: { app: AppConfig }) {
  if (app.iconType === 'terminal') {
    return <TerminalIcon />;
  }
  return <DocumentIcon color={app.color} label={app.abbrev} />;
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
  const windows = useWindowStore((s) => s.windows);
  const openWindow = useWindowStore((s) => s.openWindow);

  const handleDoubleClick = (appId: string) => {
    openWindow(appId);
    // Clear selection after opening window (Tiger behavior)
    useAppStore.getState().clearSelection();
  };

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
      <Desktop>
        <DesktopIconGrid>
          {PORTFOLIO_APPS.map((app) => (
            <DesktopIcon
              key={app.id}
              id={app.id}
              label={app.label}
              icon={<AppIcon app={app} />}
              isSelected={selectedIconId === app.id}
              onClick={() => selectIcon(app.id)}
              onDoubleClick={() => handleDoubleClick(app.id)}
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
    </MotionConfig>
  );
}
