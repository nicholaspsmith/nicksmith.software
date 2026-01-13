import { StatusBar } from '../StatusBar';
import { AppIcon } from '../AppIcon';
import { useIOSStore, type IOSAppId } from '../../stores/iosStore';
import styles from './HomeScreen.module.css';

/**
 * App configuration for home screen grid
 */
interface AppConfig {
  id: IOSAppId;
  label: string;
  icon: string;
}

/**
 * Home screen apps grid
 */
const HOME_APPS: AppConfig[] = [
  { id: 'about', label: 'About Me', icon: '/icons/ios/extracted/contacts.svg' },
  { id: 'photos', label: 'Projects', icon: '/icons/ios/extracted/files.svg' },
  { id: 'gallery', label: 'Photos', icon: '/icons/ios/photos.svg' },
  { id: 'reminders', label: 'Resume', icon: '/icons/ios/reminders.svg' },
  { id: 'mail', label: 'Contact', icon: '/icons/ios/mail.svg' },
  { id: 'camera', label: 'Camera', icon: '/icons/ios/camera.svg' },
  { id: 'safari', label: 'Safari', icon: '/icons/ios/safari.svg' },
  { id: 'settings', label: 'Settings', icon: '/icons/ios/settings.svg' },
];

/**
 * Dock apps
 * Order: Phone, Safari, Messages, Music
 */
const DOCK_APPS: AppConfig[] = [
  { id: 'phone', label: 'Phone', icon: '/icons/ios/extracted/phone-icon.png' },
  { id: 'safari', label: 'Safari', icon: '/icons/ios/safari.svg' },
  { id: 'messages', label: 'Messages', icon: '/icons/ios/messages.svg' },
  { id: 'music', label: 'Music', icon: '/icons/ios/music.svg' },
];

/**
 * HomeScreen - iOS 15+ home screen with app grid and dock
 *
 * Features:
 * - 6-icon grid (2 rows x 3 columns)
 * - Frosted glass dock with 4 icons
 * - iOS 15+ wallpaper gradient
 * - Proportional scaling for tablets
 */
export function HomeScreen() {
  const openApp = useIOSStore((s) => s.openApp);
  const activeApp = useIOSStore((s) => s.activeApp);

  return (
    <div className={styles.homeScreen}>
      <div className={styles.background} />
      {/* Hide status bar when app is open - app has its own */}
      {!activeApp && <StatusBar variant="light" />}
      <div className={styles.content}>
        <div className={styles.appGrid}>
          {HOME_APPS.map((app) => (
            <AppIcon
              key={app.id}
              icon={app.icon}
              label={app.label}
              onClick={() => openApp(app.id)}
            />
          ))}
        </div>
        <div className={styles.dock}>
          {DOCK_APPS.map((app) => (
            <AppIcon
              key={`dock-${app.id}`}
              icon={app.icon}
              label={app.label}
              onClick={() => openApp(app.id)}
              isDock
            />
          ))}
        </div>
      </div>
    </div>
  );
}
