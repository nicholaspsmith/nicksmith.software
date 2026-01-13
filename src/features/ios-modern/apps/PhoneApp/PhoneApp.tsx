import { Suspense } from 'react';
import { NavigationBar } from '../../components/NavigationBar';
import { StatusBar } from '../../components/StatusBar';
import { useIOSStore } from '../../stores/iosStore';
import { Contact } from '@/features/apps/Contact';
import styles from './PhoneApp.module.css';

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#8e8e93' }}>
      Loading...
    </div>
  );
}

/**
 * PhoneApp - Phone app showing contacts (same as Mail/Contact)
 *
 * Uses "Contacts" header to match phone app style.
 */
export function PhoneApp() {
  const closeApp = useIOSStore((s) => s.closeApp);

  return (
    <div className={styles.app}>
      <StatusBar variant="dark" />
      <NavigationBar title="Contacts" onBack={closeApp} backLabel="Home" />
      <div className={styles.content}>
        <Suspense fallback={<LoadingSpinner />}>
          <Contact />
        </Suspense>
      </div>
    </div>
  );
}
