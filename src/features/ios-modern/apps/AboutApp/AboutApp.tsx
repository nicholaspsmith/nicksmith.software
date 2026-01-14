import { Suspense } from 'react';
import { NavigationBar } from '../../components/NavigationBar';
import { StatusBar } from '../../components/StatusBar';
import { useIOSStore } from '../../stores/iosStore';
import { AboutMe } from '@/features/apps/AboutMe';
import styles from './AboutApp.module.css';

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#8e8e93' }}>
      Loading...
    </div>
  );
}

/**
 * AboutApp - Wraps About Me portfolio content
 *
 * Displays personal bio and introduction in iOS app style.
 */
export function AboutApp() {
  const closeApp = useIOSStore((s) => s.closeApp);

  return (
    <div className={styles.app}>
      <StatusBar variant="dark" />
      <NavigationBar title="About Me" onBack={closeApp} backLabel="Home" />
      <div className={styles.content}>
        <Suspense fallback={<LoadingSpinner />}>
          <AboutMe variant="mobile" />
        </Suspense>
      </div>
    </div>
  );
}
