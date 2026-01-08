import { Desktop } from '@/features/tiger/components/Desktop';
import { DesktopIconGrid } from '@/features/tiger/components/DesktopIconGrid';
import { DesktopIcon } from '@/features/tiger/components/DesktopIcon';
import { DocumentIcon } from '@/features/tiger/components/icons';

/**
 * App - Root application component
 *
 * Renders the Tiger desktop with portfolio icons.
 * Icons are arranged in the top-right corner following
 * Mac OS X Tiger's column-first layout pattern.
 */
export function App() {
  return (
    <Desktop>
      <DesktopIconGrid>
        <DesktopIcon
          id="resume"
          label="Resume"
          icon={<DocumentIcon color="#4ca1e4" label="CV" />}
        />
        <DesktopIcon
          id="projects"
          label="Projects"
          icon={<DocumentIcon color="#28c940" label="DEV" />}
        />
        <DesktopIcon
          id="about"
          label="About Me"
          icon={<DocumentIcon color="#ff9500" label="ME" />}
        />
        <DesktopIcon
          id="contact"
          label="Contact"
          icon={<DocumentIcon color="#ff5f57" label="@" />}
        />
      </DesktopIconGrid>
    </Desktop>
  );
}
