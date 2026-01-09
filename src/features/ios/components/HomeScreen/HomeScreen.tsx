import { useState } from 'react';
import { StatusBar } from '../StatusBar';
import {
  AppIcon,
  NotesIcon,
  PhotosIcon,
  IBooksIcon,
  MailIcon,
  SafariIcon,
  TerminalIOSIcon,
} from '../AppIcon';
import { NotesApp } from '../NotesApp';
import { PhotosApp } from '../PhotosApp';
import { IBooksApp } from '../IBooksApp';
import { MailApp } from '../MailApp';
import styles from './HomeScreen.module.css';

/** App IDs that have implemented views */
type AppId = 'about' | 'projects' | 'resume' | 'contact' | 'safari' | 'terminal' | null;

/**
 * App configuration for the iOS 6 home screen
 * Maps portfolio apps to iOS-style app representations
 */
const HOME_SCREEN_APPS = [
  { id: 'about', label: 'About', icon: <NotesIcon /> },
  { id: 'projects', label: 'Projects', icon: <PhotosIcon /> },
  { id: 'resume', label: 'Resume', icon: <IBooksIcon /> },
  { id: 'contact', label: 'Contact', icon: <MailIcon /> },
  { id: 'safari', label: 'Safari', icon: <SafariIcon /> },
  { id: 'terminal', label: 'Terminal', icon: <TerminalIOSIcon /> },
] as const;

/**
 * Dock apps (bottom bar)
 */
const DOCK_APPS = [
  { id: 'about', label: 'About', icon: <NotesIcon /> },
  { id: 'resume', label: 'Resume', icon: <IBooksIcon /> },
  { id: 'contact', label: 'Contact', icon: <MailIcon /> },
  { id: 'safari', label: 'Safari', icon: <SafariIcon /> },
] as const;

export interface HomeScreenProps {
  /** Handler when an app is tapped (optional, for external handling) */
  onAppTap?: (appId: string) => void;
}

/**
 * iOS 6 Home Screen
 *
 * Recreates the classic iOS 6 home screen with:
 * - Status bar with time and battery
 * - App icon grid (4 columns)
 * - Page indicator dots
 * - Dock with 4 favorite apps
 * - iOS 6 linen wallpaper texture
 *
 * Manages app navigation state internally, rendering
 * the appropriate app view when an icon is tapped.
 */
export function HomeScreen({ onAppTap }: HomeScreenProps) {
  const [activeApp, setActiveApp] = useState<AppId>(null);

  const handleAppTap = (appId: string) => {
    setActiveApp(appId as AppId);
    onAppTap?.(appId);
  };

  const handleBack = () => {
    setActiveApp(null);
  };

  // Render the active app if one is selected
  if (activeApp === 'about') {
    return <NotesApp onBack={handleBack} />;
  }
  if (activeApp === 'projects') {
    return <PhotosApp onBack={handleBack} />;
  }
  if (activeApp === 'resume') {
    return <IBooksApp onBack={handleBack} />;
  }
  if (activeApp === 'contact') {
    return <MailApp onBack={handleBack} />;
  }

  return (
    <div className={styles.homeScreen} data-testid="ios-home-screen">
      <StatusBar />

      {/* Main content area with app grid */}
      <div className={styles.content}>
        <div className={styles.appGrid}>
          {HOME_SCREEN_APPS.map((app) => (
            <AppIcon
              key={app.id}
              id={app.id}
              label={app.label}
              icon={app.icon}
              onClick={() => handleAppTap(app.id)}
            />
          ))}
        </div>

        {/* Page indicator dots */}
        <div className={styles.pageIndicator} aria-label="Page 1 of 1">
          <div className={`${styles.pageDot} ${styles.active}`} />
        </div>
      </div>

      {/* Dock */}
      <div className={styles.dock} data-testid="ios-dock">
        <div className={styles.dockIcons}>
          {DOCK_APPS.map((app) => (
            <AppIcon
              key={`dock-${app.id}`}
              id={`dock-${app.id}`}
              label={app.label}
              icon={app.icon}
              onClick={() => handleAppTap(app.id)}
              isDockIcon
            />
          ))}
        </div>
      </div>
    </div>
  );
}
