import { create } from 'zustand';

export interface SoundStore {
  audioContext: AudioContext | null;
  buffers: Map<string, AudioBuffer>;
  initialized: boolean;
  startupChimePlayed: boolean;

  initialize: () => Promise<void>;
  play: (soundName: string) => void;
  playStartupChime: () => void;
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

  initialize: async () => {
    // Browser requires user gesture before AudioContext
    const audioContext = new AudioContext();
    set({ audioContext, initialized: true });

    // Preload sounds would go here in future stories
    // const response = await fetch('/sounds/startup.mp3');
    // const arrayBuffer = await response.arrayBuffer();
    // const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    // get().buffers.set('startup', audioBuffer);
  },

  play: (soundName) => {
    const { audioContext, buffers } = get();
    if (!audioContext) return;

    const buffer = buffers.get(soundName);
    if (!buffer) return;

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
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
}));
