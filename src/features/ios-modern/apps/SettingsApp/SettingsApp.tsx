import { NavigationBar } from '../../components/NavigationBar';
import { StatusBar } from '../../components/StatusBar';
import { useIOSStore } from '../../stores/iosStore';
import styles from './SettingsApp.module.css';

interface SettingsItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const SETTINGS_ITEMS: SettingsItem[] = [
  {
    id: 'general',
    label: 'General',
    icon: <GearIcon />,
    color: '#8e8e93',
  },
  {
    id: 'display',
    label: 'Display & Brightness',
    icon: <SunIcon />,
    color: '#007AFF',
  },
  {
    id: 'sounds',
    label: 'Sounds & Haptics',
    icon: <SpeakerIcon />,
    color: '#FF3B30',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <BellIcon />,
    color: '#FF3B30',
  },
];

const ABOUT_ITEMS: SettingsItem[] = [
  {
    id: 'about',
    label: 'About',
    icon: <InfoIcon />,
    color: '#8e8e93',
  },
];

/**
 * SettingsApp - iOS 15+ Settings stub
 *
 * Displays settings list with iOS 15+ styling.
 * All items are non-functional stubs.
 */
export function SettingsApp() {
  const closeApp = useIOSStore((s) => s.closeApp);

  return (
    <div className={styles.app}>
      <StatusBar variant="dark" />
      <NavigationBar title="Settings" onBack={closeApp} backLabel="Home" />

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.list}>
            {SETTINGS_ITEMS.map((item) => (
              <button key={item.id} className={styles.item}>
                <div className={styles.itemIcon} style={{ backgroundColor: item.color }}>
                  {item.icon}
                </div>
                <span className={styles.itemLabel}>{item.label}</span>
                <ChevronIcon className={styles.itemChevron} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>Information</div>
          <div className={styles.list}>
            {ABOUT_ITEMS.map((item) => (
              <button key={item.id} className={styles.item}>
                <div className={styles.itemIcon} style={{ backgroundColor: item.color }}>
                  {item.icon}
                </div>
                <span className={styles.itemLabel}>{item.label}</span>
                <ChevronIcon className={styles.itemChevron} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
