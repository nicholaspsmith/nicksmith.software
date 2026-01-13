import { useState, useRef, useEffect } from 'react';
import { useWindowStore } from '@/stores/windowStore';
import styles from './iTunes.module.css';

interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  filename: string;
}

/**
 * Get playlist from music files in public/music
 */
const PLAYLIST: Track[] = [
  { id: '1', title: 'Uptown Funk', artist: 'Bruno Mars', src: '/music/Bruno Mars - Uptown Funk.mp3', filename: 'Bruno Mars - Uptown Funk.mp3' },
  { id: '2', title: 'Be My Lover', artist: 'La Bouche', src: '/music/La Bouche - Be My Lover.mp3', filename: 'La Bouche - Be My Lover.mp3' },
  { id: '3', title: 'Underneath It All', artist: 'No Doubt ft. Lady Saw', src: '/music/No Doubt - Underneath It All ft. Lady Saw.mp3', filename: 'No Doubt - Underneath It All ft. Lady Saw.mp3' },
  { id: '4', title: 'Drugs Are Good', artist: 'NOFX', src: '/music/NOFX - Drugs Are Good.mp3', filename: 'NOFX - Drugs Are Good.mp3' },
  { id: '5', title: 'Another Night', artist: 'Real McCoy', src: '/music/Real McCoy - Another Night.mp3', filename: 'Real McCoy - Another Night.mp3' },
  { id: '6', title: 'Rhythm Is A Dancer', artist: 'SNAP!', src: '/music/SNAP! - Rhythm Is A Dancer.mp3', filename: 'SNAP! - Rhythm Is A Dancer.mp3' },
];

export interface ITunesProps {
  /** Initial track to play (by filename) */
  initialTrack?: string;
}

/**
 * iTunes - Tiger-style music player
 *
 * Features playlist view and player controls similar to iOS music player
 */
export function ITunesApp({ initialTrack }: ITunesProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    if (initialTrack) {
      const index = PLAYLIST.findIndex(t => t.filename === initialTrack);
      return index >= 0 ? index : 0;
    }
    return 0;
  });
  const [isPlaying, setIsPlaying] = useState(!!initialTrack);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Store reference to update title
  const setWindowTitle = useWindowStore((s) => s.setWindowTitle);
  const windows = useWindowStore((s) => s.windows);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Update window title when track changes
  useEffect(() => {
    const itunesWindow = windows.find(w => w.app === 'itunes');
    if (itunesWindow && currentTrack) {
      setWindowTitle(itunesWindow.id, `${currentTrack.title} - ${currentTrack.artist}`);
    }
  }, [currentTrack, windows, setWindowTitle]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentTrackIndex < PLAYLIST.length - 1) {
        setCurrentTrackIndex((i) => i + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.warn('Audio playback failed:', error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleSelectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((i) => i - 1);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < PLAYLIST.length - 1) {
      setCurrentTrackIndex((i) => i + 1);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.itunes}>
      <audio ref={audioRef} src={currentTrack.src} preload="metadata" />

      {/* Player controls header */}
      <div className={styles.header}>
        <div className={styles.controls}>
          <button
            className={styles.controlButton}
            onClick={handlePrev}
            disabled={currentTrackIndex === 0}
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
            disabled={currentTrackIndex === PLAYLIST.length - 1}
            aria-label="Next"
          >
            <SkipForwardIcon />
          </button>
        </div>

        <div className={styles.display}>
          <div className={styles.trackInfo}>
            <span className={styles.trackTitle}>{currentTrack.title}</span>
            <span className={styles.trackArtist}>{currentTrack.artist}</span>
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

      {/* Playlist */}
      <div className={styles.playlist}>
        <div className={styles.playlistHeader}>
          <span className={styles.colNum}>#</span>
          <span className={styles.colTitle}>Name</span>
          <span className={styles.colArtist}>Artist</span>
        </div>
        <div className={styles.trackList}>
          {PLAYLIST.map((track, index) => (
            <button
              key={track.id}
              className={`${styles.trackRow} ${index === currentTrackIndex ? styles.trackRowActive : ''}`}
              onClick={() => handleSelectTrack(index)}
            >
              <span className={styles.colNum}>
                {index === currentTrackIndex && isPlaying ? (
                  <span className={styles.playingIndicator}>&#9654;</span>
                ) : (
                  index + 1
                )}
              </span>
              <span className={styles.colTitle}>{track.title}</span>
              <span className={styles.colArtist}>{track.artist}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
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

export { PLAYLIST };
