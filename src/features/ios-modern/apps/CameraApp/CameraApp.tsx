import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useIOSStore } from '../../stores/iosStore';
import { usePhotoStore } from '../../stores/photoStore';
import { StatusBar } from '../../components/StatusBar';
import styles from './CameraApp.module.css';

type CameraState = 'loading' | 'active' | 'permission-denied' | 'not-supported' | 'no-camera';
type FacingMode = 'user' | 'environment';

/**
 * CameraApp - Live webcam viewfinder
 *
 * Features:
 * - WebRTC getUserMedia for camera access
 * - Toggle between front and rear cameras
 * - Permission denied / not supported / no camera error states
 * - Stream cleanup on unmount
 */
export function CameraApp() {
  const closeApp = useIOSStore((s) => s.closeApp);
  const addPhoto = usePhotoStore((s) => s.addPhoto);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>('loading');
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');
  // Show toggle on mobile devices (touch support as proxy for mobile)
  const [showCameraToggle, setShowCameraToggle] = useState(false);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || cameraState !== 'active') return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Convert to data URL and save
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    addPhoto(dataUrl);

    // Flash effect
    setIsCapturing(true);
    setTimeout(() => setIsCapturing(false), 150);
  }, [cameraState, addPhoto]);

  const startCamera = useCallback(async (mode: FacingMode): Promise<boolean> => {
    // Stop existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
        audio: false,
      });

      if (videoRef.current) {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        setFacingMode(mode);
        return true;
      } else {
        stream.getTracks().forEach((track) => track.stop());
        return false;
      }
    } catch {
      return false;
    }
  }, []);

  const switchCamera = useCallback(async () => {
    if (cameraState !== 'active') return;

    const newMode: FacingMode = facingMode === 'environment' ? 'user' : 'environment';
    const success = await startCamera(newMode);

    if (!success) {
      // If switching fails, try to restore the original camera
      await startCamera(facingMode);
    }
  }, [cameraState, facingMode, startCamera]);

  useEffect(() => {
    let mounted = true;

    async function initCamera() {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraState('not-supported');
        return;
      }

      // Show camera toggle on mobile devices (they typically have front + rear cameras)
      // Using touch support and screen size as proxy for mobile
      const isMobile = 'ontouchstart' in window && window.innerWidth < 1024;
      if (mounted) {
        setShowCameraToggle(isMobile);
      }

      try {
        // Try rear camera first (environment)
        let success = await startCamera('environment');

        if (!success) {
          // Fallback to front camera (user)
          success = await startCamera('user');
        }

        if (!mounted) return;

        if (success) {
          setCameraState('active');
        } else {
          setCameraState('no-camera');
        }
      } catch (error) {
        if (!mounted) return;

        if (error instanceof Error) {
          if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            setCameraState('permission-denied');
          } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            setCameraState('no-camera');
          } else {
            setCameraState('not-supported');
          }
        } else {
          setCameraState('not-supported');
        }
      }
    }

    initCamera();

    // Cleanup: stop all tracks when component unmounts
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [startCamera]);

  return (
    <div className={styles.app}>
      <StatusBar variant="light" />

      {/* Always render video element so ref is available, hide when not active */}
      <video
        ref={videoRef}
        className={styles.viewfinder}
        autoPlay
        playsInline
        muted
        style={{ display: cameraState === 'active' ? 'block' : 'none' }}
      />

      {cameraState === 'loading' && (
        <div className={styles.fallback}>
          <CameraIcon className={styles.fallbackIcon} />
          <p className={styles.fallbackTitle}>Starting Camera...</p>
        </div>
      )}

      {cameraState === 'permission-denied' && (
        <div className={styles.fallback}>
          <CameraOffIcon className={styles.fallbackIcon} />
          <p className={styles.fallbackTitle}>Camera Access Denied</p>
          <p className={styles.fallbackMessage}>
            Please allow camera access in your browser settings to use this feature.
          </p>
        </div>
      )}

      {cameraState === 'not-supported' && (
        <div className={styles.fallback}>
          <CameraOffIcon className={styles.fallbackIcon} />
          <p className={styles.fallbackTitle}>Camera Not Supported</p>
          <p className={styles.fallbackMessage}>
            Your browser doesn&apos;t support camera access. Try using a modern browser like Chrome or Safari.
          </p>
        </div>
      )}

      {cameraState === 'no-camera' && (
        <div className={styles.fallback}>
          <CameraOffIcon className={styles.fallbackIcon} />
          <p className={styles.fallbackTitle}>No Camera Found</p>
          <p className={styles.fallbackMessage}>
            We couldn&apos;t find a camera on your device.
          </p>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Flash overlay */}
      {isCapturing && <div className={styles.flash} />}

      {/* Bottom controls */}
      {cameraState === 'active' && (
        <div className={styles.bottomControls}>
          {/* Spacer for symmetry */}
          <div className={styles.controlSpacer} />

          {/* Shutter button */}
          <motion.button
            className={styles.shutterButton}
            onClick={capturePhoto}
            whileTap={{ scale: 0.9 }}
            aria-label="Take photo"
          >
            <div className={styles.shutterInner} />
          </motion.button>

          {/* Camera toggle button - show on mobile devices */}
          {showCameraToggle ? (
            <motion.button
              className={styles.flipButton}
              onClick={switchCamera}
              whileTap={{ scale: 0.9 }}
              aria-label="Switch camera"
            >
              <FlipCameraIcon />
            </motion.button>
          ) : (
            <div className={styles.controlSpacer} />
          )}
        </div>
      )}

      <motion.button
        className={styles.closeButton}
        onClick={closeApp}
        whileTap={{ scale: 0.9 }}
        aria-label="Close camera"
      >
        <CloseIcon />
      </motion.button>
    </div>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4z" />
      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
    </svg>
  );
}

function CameraOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 6h-3.17L16 4h-6v2H9V4H7.83L6 6H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-9 11c-2.76 0-5-2.24-5-5 0-.92.26-1.78.69-2.52l1.46 1.46C8.54 11.31 8.5 11.65 8.5 12c0 1.93 1.57 3.5 3.5 3.5.35 0 .69-.05 1.02-.14l1.46 1.46c-.74.43-1.6.68-2.52.68h.04zM12 8.5c-.35 0-.69.05-1.02.14l1.46 1.46c.63.18 1.14.69 1.32 1.32l1.46 1.46c.09-.33.14-.67.14-1.02 0-1.93-1.57-3.36-3.36-3.36z" />
      <path d="M3.27 2L2 3.27l2.53 2.53-.53.2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c.34 0 .66-.09.94-.24l.79.79L24 21.73 3.27 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className={styles.closeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlipCameraIcon() {
  return (
    <svg className={styles.flipIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 3h5v5M8 21H3v-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
