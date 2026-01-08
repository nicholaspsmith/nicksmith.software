import { create } from 'zustand';

export interface SoundStore {
  audioContext: AudioContext | null;
  buffers: Map<string, AudioBuffer>;
  initialized: boolean;

  initialize: () => Promise<void>;
  play: (soundName: string) => void;
}

export const useSoundStore = create<SoundStore>((set, get) => ({
  audioContext: null,
  buffers: new Map(),
  initialized: false,

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
}));
