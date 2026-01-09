import { create } from 'zustand';

export type AppMode = 'tiger' | 'ios';
export type AlertType = 'caution' | 'stop' | 'note';

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

  // Alert dialog state
  alertOpen: boolean;
  alertConfig: AlertConfig | null;

  // Actions
  setMode: (mode: AppMode) => void;
  completeStartup: () => void;
  selectIcon: (iconId: string) => void;
  clearSelection: () => void;

  // Alert actions
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  mode: 'tiger',
  startupComplete: false,
  selectedIconId: null,
  alertOpen: false,
  alertConfig: null,

  setMode: (mode) => set({ mode }),
  completeStartup: () => set({ startupComplete: true }),
  selectIcon: (iconId) => set({ selectedIconId: iconId }),
  clearSelection: () => set({ selectedIconId: null }),

  showAlert: (config) => set({ alertOpen: true, alertConfig: config }),
  hideAlert: () => {
    const { alertConfig } = get();
    // Call onOk callback if provided (default dismiss behavior)
    alertConfig?.onOk?.();
    set({ alertOpen: false, alertConfig: null });
  },
}));
