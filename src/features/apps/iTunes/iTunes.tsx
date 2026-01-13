import { useState, useRef, useEffect, useCallback } from 'react';
import { useWindowStore } from '@/stores/windowStore';
import { AquaScrollbar } from '@/features/tiger/components/AquaScrollbar';
import styles from './iTunes.module.css';
import musicManifest from '@/generated/music-manifest.json';

interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  filename: string;
}

/**
 * Playlist loaded from generated manifest (scanned from public/music)
 */
const PLAYLIST: Track[] = musicManifest;

const RATINGS_STORAGE_KEY = 'itunes-track-ratings';

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
  const [trackDurations, setTrackDurations] = useState<Record<string, number>>({});
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Update window title when track changes
  useEffect(() => {
    const windows = useWindowStore.getState().windows;
    const itunesWindow = windows.find(w => w.app === 'itunes');
    if (itunesWindow && currentTrack) {
      useWindowStore.getState().setWindowTitle(itunesWindow.id, `${currentTrack.title} - ${currentTrack.artist}`);
    }
  }, [currentTrack]);

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

  // Load durations for all tracks
  useEffect(() => {
    const loadedTracks = new Set(Object.keys(trackDurations));

    PLAYLIST.forEach((track) => {
      // Use filename as key since it's stable (index-based IDs can shift)
      if (loadedTracks.has(track.filename)) return;

      const audio = new Audio();
      const filename = track.filename; // Capture in closure
      audio.preload = 'metadata';
      audio.addEventListener('loadedmetadata', () => {
        setTrackDurations((prev) => ({ ...prev, [filename]: audio.duration }));
      });
      audio.src = track.src;
    });
  }, [trackDurations]);

  const handleRatingChange = useCallback((trackId: string, rating: number) => {
    setRatings((prev) => {
      const newRatings = { ...prev, [trackId]: rating };
      localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(newRatings));
      return newRatings;
    });
  }, []);

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
          <span className={styles.colLength}>Length</span>
          <span className={styles.colRating}>Rating</span>
        </div>
        <AquaScrollbar className={styles.trackList}>
          {PLAYLIST.map((track, index) => (
            <div
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
              <span className={styles.colLength}>
                {trackDurations[track.filename] ? formatTime(trackDurations[track.filename]) : '--:--'}
              </span>
              <span className={styles.colRating}>
                <StarRating
                  rating={ratings[track.id] || 0}
                  onChange={(rating) => handleRatingChange(track.id, rating)}
                  isActive={index === currentTrackIndex}
                />
              </span>
            </div>
          ))}
        </AquaScrollbar>
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

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  isActive?: boolean;
}

function StarRating({ rating, onChange, isActive }: StarRatingProps) {
  const handleClick = (e: React.MouseEvent, starValue: number) => {
    e.stopPropagation();
    // Toggle off if clicking same rating
    onChange(rating === starValue ? 0 : starValue);
  };

  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`${styles.star} ${star <= rating ? styles.starFilled : ''} ${isActive ? styles.starActive : ''}`}
          onClick={(e) => handleClick(e, star)}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export { PLAYLIST };
