import { create } from 'zustand';

export type AppMode = 'tiger' | 'ios';
export type AlertType = 'caution' | 'stop' | 'note';

/** Icon position on desktop (absolute coordinates) */
export interface IconPosition {
  x: number;
  y: number;
}

/** Dynamic desktop icon (created via File > New Folder, etc.) */
export interface DynamicDesktopIcon {
  id: string;
  label: string;
  icon: string; // Icon path or type
  type: 'folder' | 'smart-folder' | 'burn-folder';
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

  // Dynamic desktop icons (created via File > New Folder, etc.)
  dynamicIcons: DynamicDesktopIcon[];

  // Macintosh HD drag state (for eject icon in Dock)
  isDraggingMacintoshHD: boolean;

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
  /** Recalculate positions for new viewport (updates both current and initial) */
  recalculateIconPositions: (positions: Record<string, IconPosition>) => void;

  // Multi-drag actions
  startMultiDrag: (iconId: string) => void;
  endMultiDrag: () => void;

  // Dynamic icon actions
  createFolder: () => void;
  createSmartFolder: () => void;
  createBurnFolder: () => void;

  // Macintosh HD drag actions
  setDraggingMacintoshHD: (isDragging: boolean) => void;

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
  dynamicIcons: [],
  isDraggingMacintoshHD: false,
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

  recalculateIconPositions: (positions) => {
    // Update both current and initial positions for new viewport
    set({
      iconPositions: positions,
      initialIconPositions: positions,
    });
  },

  startMultiDrag: (iconId) => {
    set({ draggingIconId: iconId });
  },

  endMultiDrag: () => {
    set({ draggingIconId: null });
  },

  createFolder: () => {
    const id = `folder-${crypto.randomUUID()}`;
    const newIcon: DynamicDesktopIcon = {
      id,
      label: 'untitled folder',
      icon: '/icons/GenericFolderIcon.png',
      type: 'folder',
    };
    set((state) => ({
      dynamicIcons: [...state.dynamicIcons, newIcon],
    }));
  },

  createSmartFolder: () => {
    const id = `smart-folder-${crypto.randomUUID()}`;
    const newIcon: DynamicDesktopIcon = {
      id,
      label: 'untitled folder',
      icon: '/icons/SmartFolderIcon.png',
      type: 'smart-folder',
    };
    set((state) => ({
      dynamicIcons: [...state.dynamicIcons, newIcon],
    }));
  },

  createBurnFolder: () => {
    const id = `burn-folder-${crypto.randomUUID()}`;
    const newIcon: DynamicDesktopIcon = {
      id,
      label: 'untitled folder',
      icon: '/icons/BurningIcon.png',
      type: 'burn-folder',
    };
    set((state) => ({
      dynamicIcons: [...state.dynamicIcons, newIcon],
    }));
  },

  setDraggingMacintoshHD: (isDragging) => {
    set({ isDraggingMacintoshHD: isDragging });
  },

  showAlert: (config) => set({ alertOpen: true, alertConfig: config }),
  hideAlert: () => {
    const { alertConfig } = get();
    // Call onOk callback if provided (default dismiss behavior)
    alertConfig?.onOk?.();
    set({ alertOpen: false, alertConfig: null });
  },
}));
