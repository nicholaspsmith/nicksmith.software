import { useAppStore } from '@/stores/appStore';
import { Desktop } from '@/features/tiger/components/Desktop';
import { DesktopIconGrid } from '@/features/tiger/components/DesktopIconGrid';
import { DesktopIcon } from '@/features/tiger/components/DesktopIcon';
import { DocumentIcon } from '@/features/tiger/components/icons';

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
 * App - Root application component
 *
 * Renders the Tiger desktop with portfolio icons.
 * Icons are arranged in the top-right corner following
 * Mac OS X Tiger's column-first layout pattern.
 */
export function App() {
  const selectedIconId = useAppStore((s) => s.selectedIconId);
  const selectIcon = useAppStore((s) => s.selectIcon);

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
          />
        ))}
      </DesktopIconGrid>
    </Desktop>
  );
}
