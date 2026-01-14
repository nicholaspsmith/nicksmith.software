import { AnimatePresence, motion } from 'motion/react';
import { IPhoneFrame } from './components/IPhoneFrame';
import { BootScreen } from './components/BootScreen';
import { HomeScreen } from './components/HomeScreen';
import { useIOSStore, type IOSAppId } from './stores/iosStore';
import { useDisplayStore } from './stores/displayStore';
import { IOS_MODERN_SACRED } from './constants/sacred';

// App imports
import { AboutApp } from './apps/AboutApp';
import { PhotosApp } from './apps/PhotosApp';
import { GalleryApp } from './apps/GalleryApp';
import { RemindersApp } from './apps/RemindersApp';
import { MailApp } from './apps/MailApp';
import { CameraApp } from './apps/CameraApp';
import { SafariApp } from './apps/SafariApp';
import { SettingsApp } from './apps/SettingsApp';
import { DisplayBrightnessApp } from './apps/DisplayBrightnessApp';
import { PhoneApp } from './apps/PhoneApp';
import { MessagesApp } from './apps/MessagesApp';
import { MusicApp } from './apps/MusicApp';

import styles from './IOS.module.css';

/**
 * App component mapping
 */
const APP_COMPONENTS: Record<IOSAppId, React.ComponentType> = {
  about: AboutApp,
  photos: PhotosApp,
  gallery: GalleryApp,
  reminders: RemindersApp,
  mail: MailApp,
  camera: CameraApp,
  safari: SafariApp,
  settings: SettingsApp,
  display: DisplayBrightnessApp,
  phone: PhoneApp,
  messages: MessagesApp,
  music: MusicApp,
};

/**
 * IOS - Main iOS 15+ interface component
 *
 * Composes:
 * - IPhoneFrame (bezel wrapper)
 * - BootScreen (initial load animation)
 * - HomeScreen (app grid + dock)
 * - App views (portfolio and utility apps)
 *
 * Handles boot sequence and app open/close animations.
 */
export function IOS() {
  const isBooting = useIOSStore((s) => s.isBooting);
  const activeApp = useIOSStore((s) => s.activeApp);
  const brightness = useDisplayStore((s) => s.brightness);

  const ActiveAppComponent = activeApp ? APP_COMPONENTS[activeApp] : null;

  return (
    <div className={styles.container}>
      <IPhoneFrame brightness={brightness}>
        {/* Home screen is always rendered but hidden when app is open */}
        <HomeScreen />

        {/* Active app overlay */}
        <AnimatePresence>
          {ActiveAppComponent && (
            <motion.div
              key={activeApp}
              className={styles.appContainer}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{
                scale: {
                  duration: IOS_MODERN_SACRED.appOpenDuration / 1000,
                  ease: 'easeOut',
                },
                opacity: {
                  duration: (IOS_MODERN_SACRED.appOpenDuration - 100) / 1000,
                  ease: 'easeOut',
                },
              }}
            >
              <ActiveAppComponent />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Boot screen overlay */}
        <AnimatePresence>
          {isBooting && <BootScreen />}
        </AnimatePresence>
      </IPhoneFrame>
    </div>
  );
}
