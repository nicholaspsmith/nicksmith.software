import { create } from 'zustand';

export type AppMode = 'tiger' | 'ios';
export type AlertType = 'caution' | 'stop' | 'note';

/** Icon position on desktop (absolute coordinates) */
export interface IconPosition {
  x: number;
  y: number;
}

export interface AlertConfig {
  title: string;
  message: string;
  type?: AlertType;
  okText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  playSound?: boolean;
}

interface AppStore {
  // Mode state
  mode: AppMode;
  startupComplete: boolean;

  // Desktop icon selection
  selectedIconId: string | null;

  // Desktop icon positions (for drag-and-drop)
  iconPositions: Record<string, IconPosition>;
  initialIconPositions: Record<string, IconPosition>;
  iconPositionsInitialized: boolean;

  // Alert dialog state
  alertOpen: boolean;
  alertConfig: AlertConfig | null;

  // Actions
  setMode: (mode: AppMode) => void;
  completeStartup: () => void;
  selectIcon: (iconId: string) => void;
  clearSelection: () => void;

  // Icon position actions
  initializeIconPositions: (positions: Record<string, IconPosition>) => void;
  setIconPosition: (iconId: string, x: number, y: number) => void;
  resetIconPositions: () => void;

  // Alert actions
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  mode: 'tiger',
  startupComplete: false,
  selectedIconId: null,
  iconPositions: {},
  initialIconPositions: {},
  iconPositionsInitialized: false,
  alertOpen: false,
  alertConfig: null,

  setMode: (mode) => set({ mode }),
  completeStartup: () => set({ startupComplete: true }),
  selectIcon: (iconId) => set({ selectedIconId: iconId }),
  clearSelection: () => set({ selectedIconId: null }),

  initializeIconPositions: (positions) => {
    // Only initialize once
    if (!get().iconPositionsInitialized) {
      set({
        iconPositions: positions,
        initialIconPositions: positions,
        iconPositionsInitialized: true,
      });
    }
  },

  setIconPosition: (iconId, x, y) => {
    set((state) => ({
      iconPositions: {
        ...state.iconPositions,
        [iconId]: { x, y },
      },
    }));
  },

  resetIconPositions: () => {
    const { initialIconPositions } = get();
    set({ iconPositions: { ...initialIconPositions } });
  },

  showAlert: (config) => set({ alertOpen: true, alertConfig: config }),
  hideAlert: () => {
    const { alertConfig } = get();
    // Call onOk callback if provided (default dismiss behavior)
    alertConfig?.onOk?.();
    set({ alertOpen: false, alertConfig: null });
  },
}));
