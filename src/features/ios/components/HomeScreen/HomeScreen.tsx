import { useState, useMemo, useCallback } from 'react';
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
import { useSwipe } from '@/hooks';
import { CONTACT, MAILTO } from '@/constants';
import styles from './HomeScreen.module.css';

/** App IDs that have implemented views */
type AppId = 'about' | 'projects' | 'resume' | 'contact' | 'safari' | 'terminal' | null;

/** Icon components mapped by app id */
const APP_ICONS: Record<string, () => React.ReactElement> = {
  about: NotesIcon,
  projects: PhotosIcon,
  resume: IBooksIcon,
  contact: MailIcon,
  safari: SafariIcon,
  terminal: TerminalIOSIcon,
};

/**
 * App configuration for the iOS 6 home screen
 * Maps portfolio apps to iOS-style app representations
 * Note: Icons are render functions to avoid creating elements on every render
 */
const HOME_SCREEN_APPS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
  { id: 'safari', label: 'Safari' },
  { id: 'terminal', label: 'Terminal' },
] as const;

/**
 * Dock apps (bottom bar)
 */
const DOCK_APPS = [
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
  { id: 'safari', label: 'Safari' },
] as const;

/** Renders the icon for an app */
function renderIcon(appId: string): React.ReactElement {
  const IconComponent = APP_ICONS[appId];
  return IconComponent ? <IconComponent /> : <div />;
}

export interface HomeScreenProps {
  /** Handler when an app is tapped (optional, for external handling) */
  onAppTap?: (appId: string) => void;
}

/** Total number of home screen pages */
const TOTAL_PAGES = 2;

/**
 * iOS 6 Home Screen
 *
 * Recreates the classic iOS 6 home screen with:
 * - Status bar with time and battery
 * - App icon grid (4 columns)
 * - Page indicator dots
 * - Dock with 4 favorite apps
 * - iOS 6 linen wallpaper texture
 * - Swipe navigation between pages
 *
 * Manages app navigation state internally, rendering
 * the appropriate app view when an icon is tapped.
 */
export function HomeScreen({ onAppTap }: HomeScreenProps) {
  const [activeApp, setActiveApp] = useState<AppId>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleAppTap = (appId: string) => {
    // Handle special cases that don't have dedicated iOS views
    if (appId === 'safari') {
      window.open(CONTACT.website, '_blank', 'noopener,noreferrer');
      onAppTap?.(appId);
      return;
    }
    if (appId === 'terminal') {
      // Terminal requires desktop - just trigger callback without navigation
      onAppTap?.(appId);
      return;
    }
    setActiveApp(appId as AppId);
    onAppTap?.(appId);
  };

  const handleBack = () => {
    setActiveApp(null);
  };

  // Swipe handlers for page navigation
  const goToNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(p + 1, TOTAL_PAGES - 1));
  }, []);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 0));
  }, []);

  const swipeHandlers = useSwipe(
    {
      onSwipeLeft: goToNextPage,
      onSwipeRight: goToPrevPage,
    },
    { threshold: 50 }
  );

  // Page indicator dots
  const pageDots = useMemo(
    () =>
      Array.from({ length: TOTAL_PAGES }, (_, i) => (
        <button
          key={i}
          type="button"
          className={`${styles.pageDot} ${i === currentPage ? styles.active : ''}`}
          onClick={() => setCurrentPage(i)}
          aria-label={`Go to page ${i + 1}`}
          aria-current={i === currentPage ? 'page' : undefined}
        />
      )),
    [currentPage]
  );

  
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
    <div
      className={styles.homeScreen}
      data-testid="ios-home-screen"
      {...swipeHandlers}
    >
      <StatusBar />

      {/* Pages container - slides horizontally */}
      <div className={styles.pagesContainer}>
        <div
          className={styles.pagesTrack}
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
          data-testid="pages-track"
        >
          {/* Page 1: App Grid */}
          <div className={styles.page}>
            <div className={styles.content}>
              <div className={styles.appGrid}>
                {HOME_SCREEN_APPS.map((app) => (
                  <AppIcon
                    key={app.id}
                    id={app.id}
                    label={app.label}
                    icon={renderIcon(app.id)}
                    onClick={() => handleAppTap(app.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Page 2: Quick Links */}
          <div className={styles.page}>
            <div className={styles.content}>
              <div className={styles.infoPage} data-testid="info-page">
                <h2 className={styles.infoTitle}>Quick Links</h2>
                <p className={styles.infoText}>
                  {CONTACT.title} passionate about crafting delightful
                  user experiences with React & TypeScript.
                </p>
                <div className={styles.quickLinks}>
                  <a
                    href={CONTACT.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.quickLink}
                  >
                    GitHub
                  </a>
                  <a
                    href={CONTACT.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.quickLink}
                  >
                    LinkedIn
                  </a>
                  <a
                    href={MAILTO}
                    className={styles.quickLink}
                  >
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page indicator dots */}
      <div
        className={styles.pageIndicator}
        aria-label={`Page ${currentPage + 1} of ${TOTAL_PAGES}`}
        data-testid="page-indicator"
      >
        {pageDots}
      </div>

      {/* Dock */}
      <div className={styles.dock} data-testid="ios-dock">
        <div className={styles.dockIcons}>
          {DOCK_APPS.map((app) => (
            <AppIcon
              key={`dock-${app.id}`}
              id={`dock-${app.id}`}
              label={app.label}
              icon={renderIcon(app.id)}
              onClick={() => handleAppTap(app.id)}
              isDockIcon
            />
          ))}
        </div>
      </div>
    </div>
  );
}
