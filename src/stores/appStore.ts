import { create } from 'zustand';
import { playSound } from '@/utils/sounds';
import { useWindowStore } from './windowStore';

export type AppMode = 'tiger' | 'ios';
export type AlertType = 'caution' | 'stop' | 'note';

/** Icon position on desktop (absolute coordinates) */
export interface IconPosition {
  x: number;
  y: number;
}

/** Icon kind for sorting purposes */
export type IconKind = 'drive' | 'file' | 'folder' | 'application';

/** Dynamic desktop icon (created via File > New Folder, etc.) */
export interface DynamicDesktopIcon {
  id: string;
  label: string;
  icon: string; // Icon path or type
  type: 'folder' | 'smart-folder' | 'burn-folder' | 'document' | 'image' | 'link';
  /** Document ID for document icons (links to documentStore) */
  documentId?: string;
  /** External URL for link icons */
  url?: string;
  /** Date created timestamp */
  dateCreated?: number;
  /** Date modified timestamp */
  dateModified?: number;
  /** Icon kind for sorting */
  kind?: IconKind;
}

/** Clipboard state for copy/paste */
export interface ClipboardItem {
  iconId: string;
  label: string;
  type: DynamicDesktopIcon['type'];
  icon: string;
  documentId?: string;
  sourceContext: 'desktop' | 'finder';
}

/** Sort criteria for Clean Up By */
export type SortCriteria = 'name' | 'kind' | 'dateModified' | 'dateCreated';

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

  // Folder contents (icons dragged into Finder folders)
  folderContents: Record<string, DynamicDesktopIcon[]>;

  // Macintosh HD drag state (for eject icon in Dock)
  isDraggingMacintoshHD: boolean;

  // Trash hover state (for visual feedback when dragging over trash)
  isHoveringOverTrash: boolean;

  // Icon dragging state (for z-index management)
  isDraggingIcon: boolean;

  // Restart state (for restart screen overlay)
  isRestarting: boolean;

  // Crash state (rm -rf / easter egg)
  isCrashing: boolean;
  isCorrupted: boolean;

  // Alert dialog state
  alertOpen: boolean;
  alertConfig: AlertConfig | null;

  // Clipboard state for copy/paste
  clipboard: ClipboardItem | null;

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
  /** Permanently delete a single item from trash */
  permanentlyDeleteItem: (iconId: string) => void;
  /** Restore an icon from trash to desktop */
  restoreFromTrash: (iconId: string) => void;
  /** Load trashed icons from localStorage (called on startup) */
  loadTrashFromStorage: () => void;

  // Folder actions
  /** Move an icon to a folder (removes from desktop, adds to folder) */
  moveToFolder: (folderId: string, iconId: string) => void;

  // Clipboard actions
  /** Copy an icon to clipboard */
  copyToClipboard: (icon: ClipboardItem) => void;
  /** Paste from clipboard to create new icon */
  pasteFromClipboard: () => void;
  /** Clear the clipboard */
  clearClipboard: () => void;

  // Sorting actions
  /** Sort icons by criteria and rearrange in grid */
  sortIconsBy: (criteria: SortCriteria) => void;
  /** Rename an icon */
  renameIcon: (iconId: string, newLabel: string) => void;

  // Macintosh HD drag actions
  setDraggingMacintoshHD: (isDragging: boolean) => void;

  // Trash hover actions
  setHoveringOverTrash: (isHovering: boolean) => void;

  // Icon dragging actions
  setDraggingIcon: (isDragging: boolean) => void;

  // Restart actions
  triggerRestart: () => void;

  // Crash actions (rm -rf / easter egg)
  triggerCrash: () => void;
  completeCrash: () => void;

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
  folderContents: {
    // Pre-populated homework documents in Documents folder
    documents: [
      { id: 'doc-history-essay', label: 'History Essay - Civil War', icon: '/icons/document.png', type: 'document', documentId: 'history-essay' },
      { id: 'doc-english-vocab', label: 'English Vocab List', icon: '/icons/document.png', type: 'document', documentId: 'english-vocab' },
      { id: 'doc-math-homework', label: 'Math Homework Ch 5', icon: '/icons/document.png', type: 'document', documentId: 'math-homework' },
    ],
    // Pre-populated meme images in Pictures folder (2004-2005 era)
    pictures: [
      { id: 'pic-disaster-girl', label: 'Disaster Girl', icon: '/pictures/Disaster_Girl.jpg', type: 'image' as const },
      { id: 'pic-body-massage', label: 'Body Massage', icon: '/pictures/body-massage-gi-joe.gif', type: 'image' as const },
      { id: 'pic-gi-joe-computer', label: 'GI Joe Computer', icon: '/pictures/gi-joe-psa-computer.gif', type: 'image' as const },
    ],
    // Developer folder contents
    developer: [
      { id: 'link-learn-python', label: 'Learn Python', icon: '/icons/compass.png', type: 'link' as const, url: 'https://web-beta-sooty-25.vercel.app/' },
      { id: 'link-lance-context', label: 'lance-context', icon: '/icons/lance-context-logo.svg', type: 'link' as const, url: 'https://github.com/nicholaspsmith/lance-context' },
      { id: 'link-loopi', label: 'Loopi', icon: '/icons/loopi-logo.svg', type: 'link' as const, url: 'https://loopi.nicholaspsmith.com' },
      { id: 'link-vidsnatch', label: 'VidSnatch', icon: '/icons/vidsnatch-logo.png', type: 'link' as const, url: 'https://github.com/nicholaspsmith/VidSnatch' },
      { id: 'link-centrifugue', label: 'Centrifugue', icon: '/icons/centrifugue-logo.svg', type: 'link' as const, url: 'https://github.com/nicholaspsmith/Centrifugue' },
      { id: 'link-obsidian-c-scribe', label: 'Obsidian C-Scribe', icon: '/icons/c-scribe.png', type: 'link' as const, url: 'https://github.com/nicholaspsmith/Obsidian-C-Scribe' },
    ],
  },
  isDraggingMacintoshHD: false,
  isHoveringOverTrash: false,
  isDraggingIcon: false,
  isRestarting: false,
  isCrashing: false,
  isCorrupted: false,
  alertOpen: false,
  alertConfig: null,
  clipboard: null,

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
      icon: '/icons/document.png',
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

    // Close any windows associated with this icon
    const windowStore = useWindowStore.getState();
    const windows = windowStore.windows;
    for (const window of windows) {
      // Match by app id (for built-in icons like about, projects, etc.)
      if (window.app === iconId) {
        windowStore.closeWindow(window.id);
      }
      // Match by documentId (for dynamic document icons)
      else if (iconToTrash.documentId && window.documentId === iconToTrash.documentId) {
        windowStore.closeWindow(window.id);
      }
    }

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

  permanentlyDeleteItem: (iconId) => {
    const { trashedIcons } = get();
    const iconToDelete = trashedIcons.find((icon) => icon.id === iconId);

    if (!iconToDelete) {
      console.warn(`Cannot find icon to delete: ${iconId}`);
      return;
    }

    // Play empty trash sound
    playSound('emptyTrash');

    // Clean up document content if it's a document icon
    if (iconToDelete.type === 'document' && iconToDelete.documentId) {
      localStorage.removeItem(`textedit:doc:${iconToDelete.documentId}`);
      localStorage.removeItem(`textedit:title:${iconToDelete.documentId}`);

      try {
        const savedIdsJson = localStorage.getItem('textedit:saved-ids');
        if (savedIdsJson) {
          const savedIds: string[] = JSON.parse(savedIdsJson);
          const updatedIds = savedIds.filter((id) => id !== iconToDelete.documentId);
          localStorage.setItem('textedit:saved-ids', JSON.stringify(updatedIds));
        }
      } catch {
        console.warn('Failed to update saved-ids');
      }
    }

    // Remove from trash
    const updatedTrash = trashedIcons.filter((icon) => icon.id !== iconId);
    set({ trashedIcons: updatedTrash });

    // Update localStorage
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

  moveToFolder: (folderId, iconId) => {
    const { dynamicIcons, iconPositions } = get();

    // Built-in desktop icon configurations (for moving built-in icons to folders)
    const BUILT_IN_ICONS: Record<string, DynamicDesktopIcon> = {
      about: { id: 'about', label: 'About Me', icon: '/icons/AlertNoteIcon.png', type: 'document' },
      projects: { id: 'projects', label: 'Projects', icon: '/icons/ADCReferenceLibraryIcon.png', type: 'document' },
      resume: { id: 'resume', label: 'Resume', icon: '/icons/pdf.png', type: 'document' },
      contact: { id: 'contact', label: 'Contact', icon: '/icons/AddressBook.png', type: 'document' },
      terminal: { id: 'terminal', label: 'Terminal', icon: '/icons/terminal.png', type: 'document' },
    };

    // Find the icon (could be dynamic or built-in)
    let iconToMove: DynamicDesktopIcon | undefined = dynamicIcons.find((icon) => icon.id === iconId);
    let isBuiltIn = false;

    // Check if it's a built-in icon
    if (!iconToMove && BUILT_IN_ICONS[iconId]) {
      iconToMove = BUILT_IN_ICONS[iconId];
      isBuiltIn = true;
    }

    // Can't move Macintosh HD to folders
    if (iconId === 'macintosh-hd' || !iconToMove) {
      console.warn(`Cannot move icon to folder: ${iconId}`);
      return;
    }

    // Play a sound effect
    playSound('moveToTrash');

    // Remove from desktop (either from dynamicIcons or add to a "hidden built-in" list)
    // For built-in icons, we'll track them in folderContents and filter them from desktop
    set((state) => {
      const updatedDynamicIcons = isBuiltIn
        ? state.dynamicIcons
        : state.dynamicIcons.filter((icon) => icon.id !== iconId);

      // Add to folder contents
      const currentFolderContents = state.folderContents[folderId] || [];
      const updatedFolderContents = {
        ...state.folderContents,
        [folderId]: [...currentFolderContents, iconToMove!],
      };

      // Remove position (no longer needed on desktop)
      const { [iconId]: _removedPos, ...remainingPositions } = iconPositions;

      return {
        dynamicIcons: updatedDynamicIcons,
        folderContents: updatedFolderContents,
        iconPositions: remainingPositions,
      };
    });

    // Clear selection
    set({ selectedIconIds: [] });
  },

  copyToClipboard: (icon) => {
    set({ clipboard: icon });
  },

  pasteFromClipboard: () => {
    const { clipboard, dynamicIcons } = get();
    if (!clipboard) return;

    // Generate unique copy name
    const baseName = clipboard.label;
    let copyName = `${baseName} copy`;
    let counter = 2;

    // Check if "baseName copy" exists, then try "baseName copy 2", etc.
    const existingLabels = dynamicIcons.map((icon) => icon.label);
    while (existingLabels.includes(copyName)) {
      copyName = `${baseName} copy ${counter}`;
      counter++;
    }

    // Create new icon
    const newId = `${clipboard.type}-${crypto.randomUUID()}`;
    const newIcon: DynamicDesktopIcon = {
      id: newId,
      label: copyName,
      icon: clipboard.icon,
      type: clipboard.type,
      documentId: clipboard.documentId ? `${clipboard.documentId}-copy-${Date.now()}` : undefined,
      dateCreated: Date.now(),
      dateModified: Date.now(),
      kind: clipboard.type === 'folder' || clipboard.type === 'smart-folder' || clipboard.type === 'burn-folder'
        ? 'folder'
        : 'file',
    };

    set((state) => ({
      dynamicIcons: [...state.dynamicIcons, newIcon],
    }));
  },

  clearClipboard: () => {
    set({ clipboard: null });
  },

  sortIconsBy: (criteria) => {
    const { iconPositions } = get();

    // Built-in icon order (for maintaining default positions)
    const builtInOrder = ['macintosh-hd', 'about', 'projects', 'resume', 'contact', 'terminal'];

    // Built-in icon fixed dates (to maintain default order when sorting by date)
    const builtInDates: Record<string, number> = {
      'macintosh-hd': 1,
      'about': 2,
      'projects': 3,
      'resume': 4,
      'contact': 5,
      'terminal': 6,
    };

    // Get all icon IDs that have positions
    const iconIds = Object.keys(iconPositions);

    // Sort the icon IDs based on criteria
    const sortedIds = [...iconIds].sort((a, b) => {
      const aBuiltIn = builtInOrder.includes(a);
      const bBuiltIn = builtInOrder.includes(b);

      // For date sorting, built-in icons always come first in their default order
      if (criteria === 'dateCreated' || criteria === 'dateModified') {
        if (aBuiltIn && bBuiltIn) {
          return builtInDates[a] - builtInDates[b];
        }
        if (aBuiltIn) return -1;
        if (bBuiltIn) return 1;
        // For user-created icons, sort by date (newest first)
        // Since we don't have dates stored for all icons yet, just maintain current order
        return 0;
      }

      // For name sorting
      if (criteria === 'name') {
        const aLabel = a; // Would need to get actual label from somewhere
        const bLabel = b;
        return aLabel.localeCompare(bLabel);
      }

      // For kind sorting
      if (criteria === 'kind') {
        // Built-in "macintosh-hd" is a drive, comes first
        if (a === 'macintosh-hd') return -1;
        if (b === 'macintosh-hd') return 1;
        // Then sort alphabetically by kind (file, folder)
        return 0;
      }

      return 0;
    });

    // Calculate new positions in a vertical grid from top-right
    // Icons are laid out vertically (column by column) like default desktop layout
    const ICON_WIDTH = 75;
    const ICON_HEIGHT = 90;
    const GRID_PADDING = 16;
    const MENU_BAR_HEIGHT = 22;
    const DOCK_HEIGHT = 70;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

    // Calculate how many icons fit vertically (between menu bar and dock)
    const availableHeight = viewportHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT - GRID_PADDING * 2;
    const iconsPerColumn = Math.max(1, Math.floor(availableHeight / ICON_HEIGHT));

    const newPositions: Record<string, IconPosition> = {};
    sortedIds.forEach((iconId, index) => {
      // Vertical layout: fill columns top to bottom, then move left for next column
      const row = index % iconsPerColumn;
      const col = Math.floor(index / iconsPerColumn);

      // Position from top-right
      newPositions[iconId] = {
        x: viewportWidth - GRID_PADDING - ICON_WIDTH - (col * ICON_WIDTH),
        y: MENU_BAR_HEIGHT + GRID_PADDING + (row * ICON_HEIGHT),
      };
    });

    set({ iconPositions: newPositions });
  },

  renameIcon: (iconId, newLabel) => {
    const { dynamicIcons } = get();

    // Check if it's a dynamic icon
    const iconIndex = dynamicIcons.findIndex((icon) => icon.id === iconId);
    if (iconIndex !== -1) {
      const updatedIcons = [...dynamicIcons];
      updatedIcons[iconIndex] = {
        ...updatedIcons[iconIndex],
        label: newLabel,
        dateModified: Date.now(),
      };
      set({ dynamicIcons: updatedIcons });

      // Update localStorage title if it's a document
      const icon = updatedIcons[iconIndex];
      if (icon.documentId) {
        localStorage.setItem(`textedit:title:${icon.documentId}`, newLabel);
      }
    }
    // Note: Built-in icons (about, projects, etc.) cannot be renamed
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

  triggerCrash: () => {
    set({ isCrashing: true });
  },

  completeCrash: () => {
    set({ isCrashing: false, isCorrupted: true, startupComplete: false });
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
