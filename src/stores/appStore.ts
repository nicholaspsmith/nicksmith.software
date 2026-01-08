import { create } from 'zustand';

export type AppMode = 'tiger' | 'ios';

interface AppStore {
  mode: AppMode;
  startupComplete: boolean;

  setMode: (mode: AppMode) => void;
  completeStartup: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  mode: 'tiger',
  startupComplete: false,

  setMode: (mode) => set({ mode }),
  completeStartup: () => set({ startupComplete: true }),
}));
