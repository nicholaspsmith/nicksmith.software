import { Suspense } from 'react';
import { NavigationBar } from '../../components/NavigationBar';
import { StatusBar } from '../../components/StatusBar';
import { useIOSStore } from '../../stores/iosStore';
import { Projects } from '@/features/apps/Projects';
import styles from './PhotosApp.module.css';

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#8e8e93' }}>
      Loading...
    </div>
  );
}

/**
 * PhotosApp - Wraps Projects portfolio content
 *
 * Displays in Photos app style but labeled as "Projects"
 * for portfolio purposes.
 */
export function PhotosApp() {
  const closeApp = useIOSStore((s) => s.closeApp);

  return (
    <div className={styles.app}>
      <StatusBar variant="dark" />
      <NavigationBar title="Projects" onBack={closeApp} backLabel="Home" />
      <div className={styles.content}>
        <Suspense fallback={<LoadingSpinner />}>
          <Projects />
        </Suspense>
      </div>
    </div>
  );
}
