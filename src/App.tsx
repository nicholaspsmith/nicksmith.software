import { useAppStore } from '@/stores/appStore';
import { useWindowStore } from '@/stores/windowStore';
import { useKeyboardShortcuts, useStartupChime } from '@/hooks';
import { Desktop } from '@/features/tiger/components/Desktop';
import { DesktopIconGrid } from '@/features/tiger/components/DesktopIconGrid';
import { DesktopIcon } from '@/features/tiger/components/DesktopIcon';
import { Window } from '@/features/tiger/components/Window';
import { DocumentIcon } from '@/features/tiger/components/icons';
import { AboutMe } from '@/features/apps/AboutMe';
import { Projects } from '@/features/apps/Projects';
import { Resume } from '@/features/apps/Resume';
import { Contact } from '@/features/apps/Contact';

/**
 * Portfolio app configuration
 * Each entry defines an icon on the desktop
 */
const PORTFOLIO_APPS = [
  { id: 'resume', label: 'Resume', color: '#4ca1e4', abbrev: 'CV' },
  { id: 'projects', label: 'Projects', color: '#28c940', abbrev: 'DEV' },
  { id: 'about', label: 'About Me', color: '#ff9500', abbrev: 'ME' },
  { id: 'contact', label: 'Contact', color: '#ff5f57', abbrev: '@' },
] as const;

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
  // Play startup chime on first user interaction
  useStartupChime();

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
    <Desktop>
      <DesktopIconGrid>
        {PORTFOLIO_APPS.map((app) => (
          <DesktopIcon
            key={app.id}
            id={app.id}
            label={app.label}
            icon={<DocumentIcon color={app.color} label={app.abbrev} />}
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
  );
}
