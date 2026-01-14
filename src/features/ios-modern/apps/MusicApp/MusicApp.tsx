import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useIOSStore } from '../../stores/iosStore';
import { StatusBar } from '../../components/StatusBar';
import { NavigationBar } from '../../components/NavigationBar';
import styles from './MusicApp.module.css';
import musicManifest from '@/generated/music-manifest.json';

interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  filename: string;
}

/**
 * Playlist loaded from generated manifest (same as iTunes)
 * Rickroll easter egg: "Never Gonna Give You Up" is labeled as "Mr Brightside"
 */
const PLAYLIST: Track[] = musicManifest.map((track) => {
  // Easter egg: Rename Rick Astley's song to look like The Killers
  if (track.title === 'Never Gonna Give You Up' && track.artist === 'Rick Astley') {
    return { ...track, title: 'Mr Brightside', artist: 'The Killers' };
  }
  return track;
});

type View = 'list' | 'player';

/**
 * MusicApp - Apple Music-style audio player
 */
export function MusicApp() {
  const closeApp = useIOSStore((s) => s.closeApp);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [view, setView] = useState<View>('list');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Easter egg: Check if playing the fake "Mr Brightside" (actually Rick Astley)
  const isRickrolling = isPlaying && currentTrack.title === 'Mr Brightside' && currentTrack.artist === 'The Killers';

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
    setView('player');
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
    <div className={styles.app}>
      <StatusBar variant="dark" />
      <NavigationBar
        title={view === 'list' ? 'Music' : (isRickrolling ? 'YOU GOT RICK ROLLED' : 'Now Playing')}
        onBack={view === 'player' ? () => setView('list') : closeApp}
        backLabel={view === 'player' ? 'Library' : 'Home'}
      />

      <audio ref={audioRef} src={currentTrack.src} preload="metadata" />

      {/* Rickroll easter egg */}
      {isRickrolling && (
        <img
          src="/rickroll/rick-astley.gif"
          alt=""
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999999,
            pointerEvents: 'none',
            maxHeight: '40vh',
          }}
        />
      )}

      {view === 'list' ? (
        <div className={styles.listContent}>
          <div className={styles.trackList}>
            {PLAYLIST.map((track, index) => (
              <button
                key={track.id}
                className={`${styles.trackItem} ${index === currentTrackIndex && isPlaying ? styles.playing : ''}`}
                onClick={() => handleSelectTrack(index)}
              >
                <div className={styles.trackNumber}>
                  {index === currentTrackIndex && isPlaying ? (
                    <span className={styles.playingIndicator}>▶</span>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className={styles.trackDetails}>
                  <span className={styles.trackItemTitle}>{track.title}</span>
                  <span className={styles.trackItemArtist}>{track.artist}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.playerContent}>
          <div className={styles.albumArt}>
            <MusicNoteIcon className={styles.musicNote} />
          </div>

          <div className={styles.trackInfo}>
            <h2 className={styles.trackTitle}>{isRickrolling ? 'YOU GOT RICK ROLLED' : currentTrack.title}</h2>
            <p className={styles.trackArtist}>{isRickrolling ? 'Rick Astley' : currentTrack.artist}</p>
          </div>

          <div className={styles.progressContainer}>
            <div className={styles.progressBar} onClick={handleSeek}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className={styles.timeDisplay}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className={styles.controls}>
            <motion.button
              className={styles.controlButton}
              onClick={handlePrev}
              disabled={currentTrackIndex === 0}
              whileTap={{ scale: 0.9 }}
            >
              <SkipBackIcon className={styles.skipButton} />
            </motion.button>
            <motion.button
              className={styles.controlButton}
              onClick={handlePlayPause}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <PauseIcon className={styles.playButton} />
              ) : (
                <PlayIcon className={styles.playButton} />
              )}
            </motion.button>
            <motion.button
              className={styles.controlButton}
              onClick={handleNext}
              disabled={currentTrackIndex === PLAYLIST.length - 1}
              whileTap={{ scale: 0.9 }}
            >
              <SkipForwardIcon className={styles.skipButton} />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function SkipBackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
  );
}

function SkipForwardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}
