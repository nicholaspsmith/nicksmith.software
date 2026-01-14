import { NavigationBar } from '../../components/NavigationBar';
import { StatusBar } from '../../components/StatusBar';
import { useIOSStore } from '../../stores/iosStore';
import { useDisplayStore, WALLPAPERS, getWallpaperPath } from '../../stores/displayStore';
import styles from './DisplayBrightnessApp.module.css';

/**
 * DisplayBrightnessApp - iOS Display & Brightness settings
 *
 * Features:
 * - Wallpaper selection from available options
 * - Brightness slider with live preview
 */
export function DisplayBrightnessApp() {
  const openApp = useIOSStore((s) => s.openApp);
  const wallpaperId = useDisplayStore((s) => s.wallpaperId);
  const brightness = useDisplayStore((s) => s.brightness);
  const setWallpaper = useDisplayStore((s) => s.setWallpaper);
  const setBrightness = useDisplayStore((s) => s.setBrightness);

  const handleBack = () => {
    openApp('settings');
  };

  return (
    <div className={styles.app}>
      <StatusBar variant="dark" />
      <NavigationBar title="Display & Brightness" onBack={handleBack} backLabel="Settings" />

      <div className={styles.content}>
        {/* Brightness Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>Brightness</div>
          <div className={styles.list}>
            <div className={styles.brightnessControl}>
              <SunDimIcon className={styles.brightnessIcon} />
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.01"
                value={brightness}
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
                className={styles.brightnessSlider}
              />
              <SunBrightIcon className={styles.brightnessIcon} />
            </div>
          </div>
        </div>

        {/* Wallpaper Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>Wallpaper</div>
          <div className={styles.wallpaperGrid}>
            {WALLPAPERS.map((wallpaper) => (
              <button
                key={wallpaper.id}
                className={`${styles.wallpaperOption} ${wallpaperId === wallpaper.id ? styles.wallpaperSelected : ''}`}
                onClick={() => setWallpaper(wallpaper.id)}
              >
                <img
                  src={getWallpaperPath(wallpaper.id)}
                  alt={wallpaper.label}
                  className={styles.wallpaperThumb}
                />
                {wallpaperId === wallpaper.id && (
                  <div className={styles.checkmark}>
                    <CheckIcon />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SunDimIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function SunBrightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
