import { NavigationBar } from '../../components/NavigationBar';
import { StatusBar } from '../../components/StatusBar';
import { useIOSStore } from '../../stores/iosStore';
import styles from './MessagesApp.module.css';

/**
 * MessagesApp - Placeholder "Coming Soon" screen
 */
export function MessagesApp() {
  const closeApp = useIOSStore((s) => s.closeApp);

  return (
    <div className={styles.app}>
      <StatusBar variant="dark" />
      <NavigationBar title="Messages" onBack={closeApp} backLabel="Home" />
      <div className={styles.content}>
        <div className={styles.icon}>
          <img
            src="/icons/ios/messages.svg"
            alt="Messages"
            className={styles.iconImage}
          />
        </div>
        <h1 className={styles.title}>Coming Soon</h1>
        <p className={styles.message}>
          Messages functionality will be available in a future update.
        </p>
      </div>
    </div>
  );
}
