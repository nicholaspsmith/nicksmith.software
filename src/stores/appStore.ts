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

  // Desktop icon selection (supports multi-select via marquee)
  selectedIconIds: string[];

  // Desktop icon positions (for drag-and-drop)
  iconPositions: Record<string, IconPosition>;
  initialIconPositions: Record<string, IconPosition>;
  iconPositionsInitialized: boolean;

  // Multi-drag state (tracks which icon is being dragged for multi-select)
  draggingIconId: string | null;

  // Alert dialog state
  alertOpen: boolean;
  alertConfig: AlertConfig | null;

  // Actions
  setMode: (mode: AppMode) => void;
  completeStartup: () => void;
  selectIcon: (iconId: string) => void;
  selectMultipleIcons: (iconIds: string[]) => void;
  clearSelection: () => void;

  // Icon position actions
  initializeIconPositions: (positions: Record<string, IconPosition>) => void;
  setIconPosition: (iconId: string, x: number, y: number) => void;
  setMultipleIconPositions: (positions: Record<string, IconPosition>) => void;
  resetIconPositions: () => void;

  // Multi-drag actions
  startMultiDrag: (iconId: string) => void;
  endMultiDrag: () => void;

  // Alert actions
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  mode: 'tiger',
  startupComplete: false,
  selectedIconIds: [],
  iconPositions: {},
  initialIconPositions: {},
  iconPositionsInitialized: false,
  draggingIconId: null,
  alertOpen: false,
  alertConfig: null,

  setMode: (mode) => set({ mode }),
  completeStartup: () => set({ startupComplete: true }),
  selectIcon: (iconId) => set({ selectedIconIds: [iconId] }),
  selectMultipleIcons: (iconIds) => set({ selectedIconIds: iconIds }),
  clearSelection: () => set({ selectedIconIds: [] }),

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

  setMultipleIconPositions: (positions) => {
    set((state) => ({
      iconPositions: {
        ...state.iconPositions,
        ...positions,
      },
    }));
  },

  resetIconPositions: () => {
    const { initialIconPositions } = get();
    set({ iconPositions: { ...initialIconPositions } });
  },

  startMultiDrag: (iconId) => {
    set({ draggingIconId: iconId });
  },

  endMultiDrag: () => {
    set({ draggingIconId: null });
  },

  showAlert: (config) => set({ alertOpen: true, alertConfig: config }),
  hideAlert: () => {
    const { alertConfig } = get();
    // Call onOk callback if provided (default dismiss behavior)
    alertConfig?.onOk?.();
    set({ alertOpen: false, alertConfig: null });
  },
}));
