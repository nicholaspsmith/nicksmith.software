import { useState, useRef, useEffect } from 'react';
import { useWindowStore } from '@/stores/windowStore';
import styles from './QuickTime.module.css';
import videoManifest from '@/generated/video-manifest.json';

interface Video {
  id: string;
  title: string;
  src: string;
  filename: string;
}

/**
 * Videos loaded from generated manifest (scanned from public/videos)
 */
const VIDEOS: Video[] = videoManifest;

export interface QuickTimeProps {
  /** Initial video to play (by filename) */
  initialVideo?: string;
}

/**
 * QuickTime - Tiger-style video player
 *
 * Features video playback with play/pause, prev/next, and seek controls
 */
export function QuickTime({ initialVideo }: QuickTimeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(() => {
    if (initialVideo) {
      const index = VIDEOS.findIndex(v => v.filename === initialVideo);
      return index >= 0 ? index : 0;
    }
    return 0;
  });
  const [isPlaying, setIsPlaying] = useState(true); // Autoplay
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentVideo = VIDEOS[currentVideoIndex];

  // Update window title when video changes
  useEffect(() => {
    const windows = useWindowStore.getState().windows;
    const qtWindow = windows.find(w => w.app === 'quicktime');
    if (qtWindow && currentVideo) {
      useWindowStore.getState().setWindowTitle(qtWindow.id, `QuickTime Player - ${currentVideo.title}`);
    }
  }, [currentVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => {
      if (currentVideoIndex < VIDEOS.length - 1) {
        setCurrentVideoIndex((i) => i + 1);
      } else {
        setIsPlaying(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentVideoIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch((error) => {
        console.warn('Video playback failed:', error);
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, currentVideoIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex((i) => i - 1);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentVideoIndex < VIDEOS.length - 1) {
      setCurrentVideoIndex((i) => i + 1);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    videoRef.current.currentTime = percent * duration;
  };

  const handleVideoClick = () => {
    handlePlayPause();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.quicktime}>
      {/* Video display */}
      <div className={styles.videoContainer} onClick={handleVideoClick}>
        <video
          ref={videoRef}
          src={currentVideo.src}
          className={styles.video}
          preload="metadata"
        />
        {!isPlaying && (
          <div className={styles.playOverlay}>
            <PlayIcon size={64} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.controlButtons}>
          <button
            className={styles.controlButton}
            onClick={handlePrev}
            disabled={currentVideoIndex === 0}
            aria-label="Previous"
          >
            <SkipBackIcon />
          </button>
          <button
            className={styles.controlButton}
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            className={styles.controlButton}
            onClick={handleNext}
            disabled={currentVideoIndex === VIDEOS.length - 1}
            aria-label="Next"
          >
            <SkipForwardIcon />
          </button>
        </div>

        <div className={styles.progressContainer}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <div className={styles.progressBar} onClick={handleSeek}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

function PlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function SkipBackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
  );
}

function SkipForwardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

export { VIDEOS };
