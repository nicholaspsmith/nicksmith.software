import { Suspense } from 'react';
import { NavigationBar } from '../../components/NavigationBar';
import { StatusBar } from '../../components/StatusBar';
import { useIOSStore } from '../../stores/iosStore';
import { Resume } from '@/features/apps/Resume';
import styles from './RemindersApp.module.css';

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#8e8e93' }}>
      Loading...
    </div>
  );
}

/**
 * RemindersApp - Wraps Resume portfolio content
 *
 * Displays in Reminders app style but labeled as "Resume"
 * for portfolio purposes.
 */
export function RemindersApp() {
  const closeApp = useIOSStore((s) => s.closeApp);

  return (
    <div className={styles.app}>
      <StatusBar variant="dark" />
      <NavigationBar title="Resume" onBack={closeApp} backLabel="Home" />
      <div className={styles.content}>
        <Suspense fallback={<LoadingSpinner />}>
          <Resume />
        </Suspense>
      </div>
    </div>
  );
}
