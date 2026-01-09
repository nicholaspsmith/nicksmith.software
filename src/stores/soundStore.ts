import { create } from 'zustand';

export interface SoundStore {
  audioContext: AudioContext | null;
  buffers: Map<string, AudioBuffer>;
  initialized: boolean;
  startupChimePlayed: boolean;
  sosumiLoaded: boolean;
  volume: number; // 0-1 range

  initialize: () => Promise<void>;
  play: (soundName: string) => void;
  playStartupChime: () => void;
  playSosumi: () => void;
  setVolume: (volume: number) => void;
}

/**
 * Load and decode an audio file
 */
async function loadAudioBuffer(
  audioContext: AudioContext,
  url: string
): Promise<AudioBuffer | null> {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.warn(`Failed to load audio: ${url}`, error);
    return null;
  }
}

/**
 * Play an audio buffer with volume control
 */
function playBuffer(audioContext: AudioContext, buffer: AudioBuffer, volume: number = 1): void {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;

  // Create gain node for volume control
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume;

  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  source.start();
}

/**
 * Synthesize a Mac-like startup chime using Web Audio API
 * The classic Mac chime is an F-sharp major chord (F#, A#, C#, F#)
 */
function playChimeSound(audioContext: AudioContext): void {
  const now = audioContext.currentTime;
  const duration = 1.5;

  // F# major chord frequencies (F#3, A#3, C#4, F#4)
  const frequencies = [185, 233, 277, 370];

  frequencies.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, now);

    // Stagger slightly for richness
    const startTime = now + index * 0.01;

    // Attack, sustain, decay envelope
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  });
}

export const useSoundStore = create<SoundStore>((set, get) => ({
  audioContext: null,
  buffers: new Map(),
  initialized: false,
  startupChimePlayed: false,
  sosumiLoaded: false,
  volume: 0.75, // Default volume at 75%

  initialize: async () => {
    // Browser requires user gesture before AudioContext
    const audioContext = new AudioContext();
    set({ audioContext, initialized: true });

    // Preload sosumi sound
    const sosumiBuffer = await loadAudioBuffer(audioContext, '/sounds/sosumi.mp3');
    if (sosumiBuffer) {
      get().buffers.set('sosumi', sosumiBuffer);
      set({ sosumiLoaded: true });
    }
  },

  play: (soundName) => {
    const { audioContext, buffers } = get();
    if (!audioContext) return;

    const buffer = buffers.get(soundName);
    if (!buffer) return;

    playBuffer(audioContext, buffer);
  },

  playStartupChime: () => {
    const { startupChimePlayed, audioContext, initialized } = get();

    // Only play once per session
    if (startupChimePlayed) return;

    // Initialize audio context if needed (requires user gesture)
    if (!initialized || !audioContext) {
      const ctx = new AudioContext();
      set({ audioContext: ctx, initialized: true, startupChimePlayed: true });
      playChimeSound(ctx);
    } else {
      set({ startupChimePlayed: true });
      playChimeSound(audioContext);
    }
  },

  playSosumi: () => {
    const { audioContext, initialized, buffers, sosumiLoaded, volume } = get();

    // Initialize audio context if needed (requires user gesture)
    if (!initialized || !audioContext) {
      const ctx = new AudioContext();
      set({ audioContext: ctx, initialized: true });

      // Load and play sosumi asynchronously
      loadAudioBuffer(ctx, '/sounds/sosumi.mp3').then((buffer) => {
        if (buffer) {
          get().buffers.set('sosumi', buffer);
          set({ sosumiLoaded: true });
          playBuffer(ctx, buffer, get().volume);
        }
      });
    } else if (sosumiLoaded) {
      // Play from preloaded buffer
      const buffer = buffers.get('sosumi');
      if (buffer) {
        playBuffer(audioContext, buffer, volume);
      }
    } else {
      // Buffer not loaded yet, load and play
      loadAudioBuffer(audioContext, '/sounds/sosumi.mp3').then((buffer) => {
        if (buffer) {
          get().buffers.set('sosumi', buffer);
          set({ sosumiLoaded: true });
          playBuffer(audioContext, buffer, get().volume);
        }
      });
    }
  },

  setVolume: (volume: number) => {
    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, volume));
    set({ volume: clampedVolume });
  },
}));
