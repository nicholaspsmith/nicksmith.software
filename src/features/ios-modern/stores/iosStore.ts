import { create } from 'zustand';

/**
 * App IDs for iOS modern interface
 */
export type IOSAppId =
  | 'about'
  | 'photos'
  | 'gallery'
  | 'reminders'
  | 'mail'
  | 'camera'
  | 'safari'
  | 'settings'
  | 'phone'
  | 'messages'
  | 'music';

/**
 * iOS Modern Interface State
 */
interface IOSState {
  /** Currently open app (null = home screen) */
  activeApp: IOSAppId | null;
  /** Whether boot screen is showing */
  isBooting: boolean;
}

/**
 * iOS Modern Interface Actions
 */
interface IOSActions {
  /** Open an app */
  openApp: (appId: IOSAppId) => void;
  /** Close current app and return to home screen */
  closeApp: () => void;
  /** Complete boot sequence */
  completeBoot: () => void;
  /** Reset to initial state */
  reset: () => void;
}

const initialState: IOSState = {
  activeApp: null,
  isBooting: true,
};

/**
 * Zustand store for iOS modern interface state
 */
export const useIOSStore = create<IOSState & IOSActions>((set, get) => ({
  ...initialState,

  openApp: (appId) => {
    // Prevent reopening the same app
    if (get().activeApp !== appId) {
      set({ activeApp: appId });
    }
  },

  closeApp: () => {
    set({ activeApp: null });
  },

  completeBoot: () => {
    set({ isBooting: false });
  },

  reset: () => {
    set(initialState);
  },
}));
