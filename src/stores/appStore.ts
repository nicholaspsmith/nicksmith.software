import { create } from 'zustand';
import { playSound } from '@/utils/sounds';

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
  type: 'folder' | 'smart-folder' | 'burn-folder' | 'document';
  /** Document ID for document icons (links to documentStore) */
  documentId?: string;
}

/** Trashed icon - includes original icon data plus metadata */
export interface TrashedIcon extends DynamicDesktopIcon {
  /** Original position on desktop before trashing */
  originalPosition?: IconPosition;
  /** Timestamp when trashed */
  trashedAt: number;
}

/** localStorage key for persisting trash */
const TRASH_STORAGE_KEY = 'trash:icons';

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

  // Trashed icons (in Trash folder)
  trashedIcons: TrashedIcon[];

  // Macintosh HD drag state (for eject icon in Dock)
  isDraggingMacintoshHD: boolean;

  // Trash hover state (for visual feedback when dragging over trash)
  isHoveringOverTrash: boolean;

  // Icon dragging state (for z-index management)
  isDraggingIcon: boolean;

  // Restart state (for restart screen overlay)
  isRestarting: boolean;

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
  /** Create a desktop icon for a saved document */
  createDocumentIcon: (documentId: string, label: string) => void;
  /** Delete a document icon by documentId */
  deleteDocumentIcon: (documentId: string) => void;

  // Trash actions
  /** Move an icon to trash (works for dynamic icons and built-in icons except Macintosh HD) */
  moveToTrash: (iconId: string, iconData?: DynamicDesktopIcon) => void;
  /** Permanently delete all items in trash */
  emptyTrash: () => void;
  /** Restore an icon from trash to desktop */
  restoreFromTrash: (iconId: string) => void;
  /** Load trashed icons from localStorage (called on startup) */
  loadTrashFromStorage: () => void;

  // Macintosh HD drag actions
  setDraggingMacintoshHD: (isDragging: boolean) => void;

  // Trash hover actions
  setHoveringOverTrash: (isHovering: boolean) => void;

  // Icon dragging actions
  setDraggingIcon: (isDragging: boolean) => void;

  // Restart actions
  triggerRestart: () => void;

  // Alert actions
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
  confirmAlert: () => void;
  cancelAlert: () => void;
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
  trashedIcons: [],
  isDraggingMacintoshHD: false,
  isHoveringOverTrash: false,
  isDraggingIcon: false,
  isRestarting: false,
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

  createDocumentIcon: (documentId, label) => {
    // Check if icon already exists for this documentId
    const { dynamicIcons } = get();
    if (dynamicIcons.some((icon) => icon.documentId === documentId)) {
      return; // Already exists
    }

    const id = `document-${documentId}`;
    const newIcon: DynamicDesktopIcon = {
      id,
      label,
      icon: '/icons/TextEditIcon.png',
      type: 'document',
      documentId,
    };
    set((state) => ({
      dynamicIcons: [...state.dynamicIcons, newIcon],
    }));

    // Store title for document for hydration on reload
    localStorage.setItem(`textedit:title:${documentId}`, label);
  },

  deleteDocumentIcon: (documentId) => {
    set((state) => ({
      dynamicIcons: state.dynamicIcons.filter((icon) => icon.documentId !== documentId),
    }));
    // Clean up title from localStorage
    localStorage.removeItem(`textedit:title:${documentId}`);
  },

  moveToTrash: (iconId, iconData) => {
    const { dynamicIcons, iconPositions, trashedIcons } = get();

    // Built-in desktop icon configurations (for trashing built-in icons)
    const BUILT_IN_ICONS: Record<string, DynamicDesktopIcon> = {
      about: { id: 'about', label: 'About Me', icon: '/icons/AlertNoteIcon.png', type: 'document' },
      projects: { id: 'projects', label: 'Projects', icon: '/icons/ADCReferenceLibraryIcon.png', type: 'document' },
      resume: { id: 'resume', label: 'Resume', icon: '/icons/pdf.png', type: 'document' },
      contact: { id: 'contact', label: 'Contact', icon: '/icons/AddressBook.png', type: 'document' },
      terminal: { id: 'terminal', label: 'Terminal', icon: '/icons/terminal.png', type: 'document' },
    };

    // Find the icon in dynamic icons, built-in icons, or use provided iconData
    let iconToTrash: DynamicDesktopIcon | undefined = dynamicIcons.find((icon) => icon.id === iconId);

    if (!iconToTrash && BUILT_IN_ICONS[iconId]) {
      // Built-in icon being trashed
      iconToTrash = BUILT_IN_ICONS[iconId];
    }

    if (!iconToTrash && iconData) {
      // External icon data provided
      iconToTrash = iconData;
    }

    if (!iconToTrash) {
      console.warn(`Cannot find icon to trash: ${iconId}`);
      return;
    }

    // Play trash sound
    playSound('moveToTrash');

    // Create trashed icon with metadata
    const trashedIcon: TrashedIcon = {
      ...iconToTrash,
      originalPosition: iconPositions[iconId],
      trashedAt: Date.now(),
    };

    // Remove from dynamic icons if present, add to trash
    set((state) => ({
      dynamicIcons: state.dynamicIcons.filter((icon) => icon.id !== iconId),
      trashedIcons: [...state.trashedIcons, trashedIcon],
      // Remove from icon positions
      iconPositions: Object.fromEntries(
        Object.entries(state.iconPositions).filter(([id]) => id !== iconId)
      ),
    }));

    // Persist to localStorage
    const updatedTrash = [...trashedIcons, trashedIcon];
    try {
      localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(updatedTrash));
    } catch {
      console.warn('Failed to persist trash to localStorage');
    }
  },

  emptyTrash: () => {
    const { trashedIcons } = get();

    // Only play sound if there are items to delete
    if (trashedIcons.length > 0) {
      playSound('emptyTrash');
    }

    // Delete document content for any document icons
    for (const icon of trashedIcons) {
      if (icon.type === 'document' && icon.documentId) {
        // Clean up document from localStorage
        localStorage.removeItem(`textedit:doc:${icon.documentId}`);
        localStorage.removeItem(`textedit:title:${icon.documentId}`);

        // Update saved-ids list
        try {
          const savedIdsJson = localStorage.getItem('textedit:saved-ids');
          if (savedIdsJson) {
            const savedIds: string[] = JSON.parse(savedIdsJson);
            const updatedIds = savedIds.filter((id) => id !== icon.documentId);
            localStorage.setItem('textedit:saved-ids', JSON.stringify(updatedIds));
          }
        } catch {
          console.warn('Failed to update saved-ids');
        }
      }
    }

    // Clear trash
    set({ trashedIcons: [] });
    localStorage.removeItem(TRASH_STORAGE_KEY);
  },

  restoreFromTrash: (iconId) => {
    const { trashedIcons } = get();
    const iconToRestore = trashedIcons.find((icon) => icon.id === iconId);

    if (!iconToRestore) {
      console.warn(`Cannot find icon to restore: ${iconId}`);
      return;
    }

    // Create dynamic icon from trashed icon (remove trash metadata)
    const restoredIcon: DynamicDesktopIcon = {
      id: iconToRestore.id,
      label: iconToRestore.label,
      icon: iconToRestore.icon,
      type: iconToRestore.type,
      documentId: iconToRestore.documentId,
    };

    // Remove from trash, add back to dynamic icons
    set((state) => {
      const updatedTrash = state.trashedIcons.filter((icon) => icon.id !== iconId);

      // Restore original position if available
      const newPositions = { ...state.iconPositions };
      if (iconToRestore.originalPosition) {
        newPositions[iconId] = iconToRestore.originalPosition;
      }

      return {
        dynamicIcons: [...state.dynamicIcons, restoredIcon],
        trashedIcons: updatedTrash,
        iconPositions: newPositions,
      };
    });

    // Update localStorage
    const updatedTrash = trashedIcons.filter((icon) => icon.id !== iconId);
    try {
      if (updatedTrash.length > 0) {
        localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(updatedTrash));
      } else {
        localStorage.removeItem(TRASH_STORAGE_KEY);
      }
    } catch {
      console.warn('Failed to update trash in localStorage');
    }
  },

  loadTrashFromStorage: () => {
    try {
      const trashJson = localStorage.getItem(TRASH_STORAGE_KEY);
      if (trashJson) {
        const trashedIcons: TrashedIcon[] = JSON.parse(trashJson);
        // Filter out any built-in icons that should restore on reload
        const builtInIds = ['about', 'projects', 'resume', 'contact', 'terminal'];
        const filteredTrash = trashedIcons.filter(
          (icon) => !builtInIds.includes(icon.id)
        );
        set({ trashedIcons: filteredTrash });

        // If we filtered out built-in icons, update localStorage
        if (filteredTrash.length !== trashedIcons.length) {
          if (filteredTrash.length > 0) {
            localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(filteredTrash));
          } else {
            localStorage.removeItem(TRASH_STORAGE_KEY);
          }
        }
      }
    } catch {
      console.warn('Failed to load trash from localStorage');
    }
  },

  setDraggingMacintoshHD: (isDragging) => {
    set({ isDraggingMacintoshHD: isDragging });
  },

  setHoveringOverTrash: (isHovering) => {
    set({ isHoveringOverTrash: isHovering });
  },

  setDraggingIcon: (isDragging) => {
    set({ isDraggingIcon: isDragging });
  },

  triggerRestart: () => {
    set({ isRestarting: true });
  },

  showAlert: (config) => {
    // Play alert sound unless explicitly disabled
    if (config.playSound !== false) {
      playSound('alert');
    }
    set({ alertOpen: true, alertConfig: config });
  },
  hideAlert: () => {
    // Just close the alert - don't call any callbacks
    // Use confirmAlert or cancelAlert for callback behavior
    set({ alertOpen: false, alertConfig: null });
  },
  confirmAlert: () => {
    const { alertConfig } = get();
    alertConfig?.onOk?.();
    set({ alertOpen: false, alertConfig: null });
  },
  cancelAlert: () => {
    const { alertConfig } = get();
    alertConfig?.onCancel?.();
    set({ alertOpen: false, alertConfig: null });
  },
}));
