/**
 * System sounds for Mac OS X Tiger experience
 *
 * Sound files are located in /public/sounds/
 * Uses global volume from soundStore
 */

import { useSoundStore } from '@/stores/soundStore';

export type SystemSound = 'startup' | 'moveToTrash' | 'emptyTrash' | 'alert';

const SOUND_FILES: Record<SystemSound, string> = {
  startup: '/sounds/startup-chime.wav',
  moveToTrash: '/sounds/move-to-trash.wav',
  emptyTrash: '/sounds/empty-trash.mp3',
  alert: '/sounds/submarine.wav',
};

// Cache audio elements for reuse
const audioCache = new Map<SystemSound, HTMLAudioElement>();

/**
 * Play a system sound using global volume from soundStore
 * @param sound - The sound to play
 */
export function playSound(sound: SystemSound): void {
  // Don't play sounds during SSR
  if (typeof window === 'undefined') return;

  try {
    let audio = audioCache.get(sound);

    if (!audio) {
      audio = new Audio(SOUND_FILES[sound]);
      audioCache.set(sound, audio);
    }

    // Get global volume from soundStore
    const globalVolume = useSoundStore.getState().volume;

    // Reset to beginning if already playing
    audio.currentTime = 0;
    audio.volume = globalVolume;
    audio.play().catch(() => {
      // Ignore autoplay errors - browser may block audio
      // until user interaction
    });
  } catch {
    // Silently fail if audio can't be played
  }
}

/**
 * Preload sounds to reduce latency on first play
 */
export function preloadSounds(): void {
  if (typeof window === 'undefined') return;

  Object.entries(SOUND_FILES).forEach(([key, path]) => {
    const audio = new Audio(path);
    audio.preload = 'auto';
    audioCache.set(key as SystemSound, audio);
  });
}
