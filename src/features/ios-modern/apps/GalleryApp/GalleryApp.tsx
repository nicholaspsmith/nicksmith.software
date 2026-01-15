import { useState } from 'react';
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

function FullscreenCloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 2L14 14M14 2L2 14" strokeLinecap="round" />
    </svg>
  );
}

export function GalleryApp() {
  const closeApp = useIOSStore((s) => s.closeApp);
  const photos = usePhotoStore((s) => s.photos);
  const deletePhoto = usePhotoStore((s) => s.deletePhoto);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  const selectedPhoto = selectedPhotoId
    ? photos.find((p) => p.id === selectedPhotoId)
    : null;

  const handlePhotoClick = (photoId: string) => {
    setSelectedPhotoId(photoId);
  };

  const handleCloseFullscreen = () => {
    setSelectedPhotoId(null);
  };

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
                  onClick={() => handlePhotoClick(photo.id)}
                />
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePhoto(photo.id);
                  }}
                  aria-label="Delete photo"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div className={styles.fullscreenOverlay} onClick={handleCloseFullscreen}>
          <button
            className={styles.fullscreenClose}
            onClick={handleCloseFullscreen}
            aria-label="Close fullscreen"
          >
            <FullscreenCloseIcon />
          </button>
          <img
            src={selectedPhoto.dataUrl}
            alt={`Photo taken at ${new Date(selectedPhoto.timestamp).toLocaleString()}`}
            className={styles.fullscreenPhoto}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
