import { NavigationBar } from '../../components/NavigationBar';
import { StatusBar } from '../../components/StatusBar';
import { useIOSStore } from '../../stores/iosStore';
import { usePhotoStore } from '../../stores/photoStore';
import styles from './GalleryApp.module.css';

/**
 * GalleryApp - Photo gallery for captured camera photos
 */
function CloseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 1L9 9M9 1L1 9" strokeLinecap="round" />
    </svg>
  );
}

export function GalleryApp() {
  const closeApp = useIOSStore((s) => s.closeApp);
  const photos = usePhotoStore((s) => s.photos);
  const deletePhoto = usePhotoStore((s) => s.deletePhoto);

  return (
    <div className={styles.app}>
      <StatusBar variant="dark" />
      <NavigationBar title="Photos" onBack={closeApp} backLabel="Home" />
      <div className={styles.content}>
        {photos.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📷</div>
            <p className={styles.emptyTitle}>No Photos</p>
            <p className={styles.emptyMessage}>
              Take photos with the Camera app to see them here.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {photos.map((photo) => (
              <div key={photo.id} className={styles.photoItem}>
                <img
                  src={photo.dataUrl}
                  alt={`Photo taken at ${new Date(photo.timestamp).toLocaleString()}`}
                  className={styles.photo}
                />
                <button
                  className={styles.deleteButton}
                  onClick={() => deletePhoto(photo.id)}
                  aria-label="Delete photo"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
