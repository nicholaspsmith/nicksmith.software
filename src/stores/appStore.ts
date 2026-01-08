import { create } from 'zustand';

export type AppMode = 'tiger' | 'ios';

interface AppStore {
  // Mode state
  mode: AppMode;
  startupComplete: boolean;

  // Desktop icon selection
  selectedIconId: string | null;

  // Actions
  setMode: (mode: AppMode) => void;
  completeStartup: () => void;
  selectIcon: (iconId: string) => void;
  clearSelection: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  mode: 'tiger',
  startupComplete: false,
  selectedIconId: null,

  setMode: (mode) => set({ mode }),
  completeStartup: () => set({ startupComplete: true }),
  selectIcon: (iconId) => set({ selectedIconId: iconId }),
  clearSelection: () => set({ selectedIconId: null }),
}));
