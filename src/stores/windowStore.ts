import { create } from 'zustand';

/**
 * App groups - maps document types to their parent application
 * About, Projects, Resume, Contact are "documents" opened in TextEdit
 * Untitled is a blank TextEdit document
 * Finder windows (home, hd, trash) are grouped under Finder
 */
export const APP_GROUPS: Record<string, string> = {
  about: 'textEdit',
  projects: 'textEdit',
  resume: 'textEdit',
  contact: 'textEdit',
  untitled: 'textEdit',
  // Finder locations
  'finder-home': 'finder',
  'finder-hd': 'finder',
  'finder-trash': 'finder',
  'finder-search': 'finder',
  // About This Mac is a Finder/system dialog
  'about-this-mac': 'finder',
  // Terminal is its own app (not grouped)
  // iTunes and QuickTime are their own apps
  itunes: 'itunes',
  quicktime: 'quicktime',
};

/**
 * Get the parent app for a given app/document ID
 * Returns the parentApp if grouped, otherwise returns the app itself
 */
export function getParentApp(app: string): string {
  return APP_GROUPS[app] || app;
}

/**
 * Custom window titles for specific apps
 * Falls back to capitalized app name if not specified
 */
const WINDOW_TITLES: Record<string, string> = {
  'finder-home': 'Home',
  'finder-hd': 'Macintosh HD',
  'finder-trash': 'Trash',
  'finder-search': 'Search Results',
  untitled: 'Untitled',
  'about-this-mac': 'About This Mac',
  about: 'About Me',
  itunes: 'iTunes',
  quicktime: 'QuickTime Player',
};

/**
 * Get display title for a window
 */
export function getWindowTitle(app: string): string {
  return WINDOW_TITLES[app] || app.charAt(0).toUpperCase() + app.slice(1);
}

/**
 * App-specific window size configurations
 * Includes initial size and minimum size constraints
 */
interface WindowSizeConfig {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
}

const WINDOW_SIZE_CONFIGS: Record<string, WindowSizeConfig> = {
  // Finder windows - opens at 650x380, min size 650x400
  'finder-home': { width: 650, height: 380, minWidth: 650, minHeight: 400 },
  'finder-hd': { width: 650, height: 380, minWidth: 650, minHeight: 400 },
  'finder-trash': { width: 650, height: 380, minWidth: 650, minHeight: 400 },
  'finder-search': { width: 650, height: 380, minWidth: 650, minHeight: 400 },
  // About This Mac - small panel window (not resizable)
  'about-this-mac': { width: 280, height: 340, minWidth: 280, minHeight: 340 },
  // About Me - bio and highlights
  about: { width: 500, height: 400, minWidth: 345, minHeight: 300 },
  // Projects - sized for project cards
  projects: { width: 625, height: 595, minWidth: 400, minHeight: 300 },
  // Contact - compact contact info
  contact: { width: 390, height: 440, minWidth: 300, minHeight: 300 },
  // Resume - needs width for content
  resume: { width: 700, height: 500, minWidth: 700, minHeight: 300 },
  // iTunes - music player
  itunes: { width: 500, height: 400, minWidth: 400, minHeight: 300 },
  // QuickTime - video player
  quicktime: { width: 640, height: 480, minWidth: 320, minHeight: 240 },
};

/**
 * Get window size configuration for an app
 * Falls back to default size if not specified
 */
function getWindowSizeConfig(app: string): WindowSizeConfig {
  return WINDOW_SIZE_CONFIGS[app] || { width: 400, height: 300, minWidth: 200, minHeight: 100 };
}

/**
 * Apps that should open centered on screen
 */
const CENTERED_WINDOWS = new Set(['about-this-mac', 'about']);

/**
 * Calculate centered position for a window
 */
function getCenteredPosition(width: number, height: number): { x: number; y: number } {
  // Account for menu bar (22px) and dock area (~70px)
  const menuBarHeight = 22;
  const dockHeight = 70;
  const availableWidth = window.innerWidth;
  const availableHeight = window.innerHeight - menuBarHeight - dockHeight;

  return {
    x: Math.max(0, (availableWidth - width) / 2),
    y: Math.max(menuBarHeight, menuBarHeight + (availableHeight - height) / 2),
  };
}

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  /** The document/app ID (e.g., 'about', 'projects', 'terminal') */
  app: string;
  /** The parent application (e.g., 'textEdit' for documents, or same as app if not grouped) */
  parentApp: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Minimum width - window cannot be resized smaller than this */
  minWidth?: number;
  /** Minimum height - window cannot be resized smaller than this */
  minHeight?: number;
  zIndex: number;
  state: 'open' | 'minimized' | 'closed';
  isZoomed: boolean;
  /** Window is "shaded" - collapsed to just title bar */
  isShaded: boolean;
  previousBounds: WindowBounds | null;
  /** True when window was just restored from minimized - triggers reverse genie animation */
  restoredFromMinimized: boolean;
  /** Document ID for TextEdit documents (links to documentStore content) */
  documentId?: string;
  /** True when user is editing document content (switches from styled to textarea view) */
  isEditing?: boolean;
  /** Media filename for iTunes/QuickTime windows */
  mediaFile?: string;
}

interface WindowStore {
  // State
  windows: WindowState[];
  activeWindowId: string | null;
  maxZIndex: number;
  /** Search query for Finder search window (cleared after use) */
  finderSearchQuery: string | null;

  // Actions (verb prefix)
  openWindow: (app: string) => string;
  /** Opens a new Finder window (always creates new, never reuses existing) */
  openNewFinderWindow: (location?: 'home' | 'hd') => string;
  /** Opens a new Finder window with search query pre-filled */
  openFinderWithSearch: (query: string) => string;
  /** Opens a new TextEdit document (always creates new, never reuses existing) */
  openNewTextEditDocument: () => string;
  /** Opens a saved document by documentId (focuses existing window if already open) */
  openSavedDocument: (documentId: string, title: string) => string;
  closeWindow: (id: string) => void;
  closeAllWindowsOfApp: (parentApp: string) => void;
  focusWindow: (id: string) => void;
  clearActiveWindow: () => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  clearRestoredFlag: (id: string) => void;
  zoomWindow: (id: string) => void;
  shadeWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
  /** Get window by documentId (for single-instance check) */
  getWindowByDocumentId: (documentId: string) => WindowState | undefined;
  /** Set edit mode for a window (switches from styled to textarea view) */
  setEditMode: (id: string, isEditing: boolean) => void;
  /** Update a window's title */
  setWindowTitle: (id: string, title: string) => void;
  /** Open iTunes with optional initial track */
  openITunes: (mediaFile?: string) => string;
  /** Open QuickTime with optional initial video */
  openQuickTime: (mediaFile?: string) => string;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  // Initial state
  windows: [],
  activeWindowId: null,
  // Start at 100 to match --aqua-z-windows and stay above desktop icons
  maxZIndex: 100,
  finderSearchQuery: null,

  // Actions
  openWindow: (app) => {
    const { windows, maxZIndex } = get();

    // For TextEdit documents, check by documentId (single-instance)
    const parentApp = getParentApp(app);
    const isTextEditDocument = parentApp === 'textEdit' && app !== 'untitled';
    const documentId = isTextEditDocument ? app : undefined;

    // Check if window for this app already exists (or documentId for TextEdit docs)
    const existingWindow = isTextEditDocument
      ? windows.find((w) => w.documentId === documentId)
      : windows.find((w) => w.app === app);
    if (existingWindow) {
      // Focus existing window instead of creating new one
      get().focusWindow(existingWindow.id);
      // If minimized, restore it
      if (existingWindow.state === 'minimized') {
        get().restoreWindow(existingWindow.id);
      }
      return existingWindow.id;
    }

    const id = crypto.randomUUID();
    const newZIndex = maxZIndex + 1;
    const sizeConfig = getWindowSizeConfig(app);

    // Calculate position: centered for specific windows, cascade for others
    let position: { x: number; y: number };
    if (CENTERED_WINDOWS.has(app)) {
      position = getCenteredPosition(sizeConfig.width, sizeConfig.height);
    } else {
      position = {
        x: 100 + (windows.length * 30),
        y: 100 + (windows.length * 30),
      };
    }

    set((state) => ({
      windows: [...state.windows, {
        id,
        app,
        parentApp,
        title: getWindowTitle(app),
        x: position.x,
        y: position.y,
        width: sizeConfig.width,
        height: sizeConfig.height,
        minWidth: sizeConfig.minWidth,
        minHeight: sizeConfig.minHeight,
        zIndex: newZIndex,
        state: 'open',
        isZoomed: false,
        isShaded: false,
        previousBounds: null,
        restoredFromMinimized: false,
        documentId,
      }],
      activeWindowId: id,
      maxZIndex: newZIndex,
    }));
    return id;
  },

  openNewFinderWindow: (location = 'home') => {
    // Always create a new Finder window (never reuse existing)
    const app = location === 'hd' ? 'finder-hd' : 'finder-home';
    const { maxZIndex } = get();
    const id = crypto.randomUUID();
    const newZIndex = maxZIndex + 1;
    const parentApp = getParentApp(app);
    const sizeConfig = getWindowSizeConfig(app);

    set((state) => ({
      windows: [...state.windows, {
        id,
        app,
        parentApp,
        title: getWindowTitle(app),
        x: 100 + (state.windows.length * 30), // Cascade positioning
        y: 100 + (state.windows.length * 30),
        width: sizeConfig.width,
        height: sizeConfig.height,
        minWidth: sizeConfig.minWidth,
        minHeight: sizeConfig.minHeight,
        zIndex: newZIndex,
        state: 'open',
        isZoomed: false,
        isShaded: false,
        previousBounds: null,
        restoredFromMinimized: false,
      }],
      activeWindowId: id,
      maxZIndex: newZIndex,
    }));
    return id;
  },

  openFinderWithSearch: (query) => {
    // Store the search query for Finder to use, then create a NEW window
    const { maxZIndex } = get();
    const id = crypto.randomUUID();
    const newZIndex = maxZIndex + 1;
    const app = 'finder-search';
    const parentApp = getParentApp(app);
    const sizeConfig = getWindowSizeConfig(app);

    set((state) => ({
      finderSearchQuery: query,
      windows: [...state.windows, {
        id,
        app,
        parentApp,
        title: getWindowTitle(app),
        x: 100 + (state.windows.length * 30),
        y: 100 + (state.windows.length * 30),
        width: sizeConfig.width,
        height: sizeConfig.height,
        minWidth: sizeConfig.minWidth,
        minHeight: sizeConfig.minHeight,
        zIndex: newZIndex,
        state: 'open',
        isZoomed: false,
        isShaded: false,
        previousBounds: null,
        restoredFromMinimized: false,
      }],
      activeWindowId: id,
      maxZIndex: newZIndex,
    }));
    return id;
  },

  openNewTextEditDocument: () => {
    // Always create a new untitled document (never reuse existing)
    const { windows, maxZIndex } = get();
    const id = crypto.randomUUID();
    const documentId = crypto.randomUUID(); // Unique ID for document content
    const newZIndex = maxZIndex + 1;
    const app = 'untitled';
    const parentApp = getParentApp(app);
    const sizeConfig = getWindowSizeConfig(app);

    // Count existing untitled documents for numbering
    const untitledCount = windows.filter((w) => w.app === 'untitled').length;
    const title = untitledCount === 0 ? 'Untitled' : `Untitled ${untitledCount + 1}`;

    set((state) => ({
      windows: [...state.windows, {
        id,
        app,
        parentApp,
        title,
        x: 100 + (state.windows.length * 30),
        y: 100 + (state.windows.length * 30),
        width: sizeConfig.width,
        height: sizeConfig.height,
        minWidth: sizeConfig.minWidth,
        minHeight: sizeConfig.minHeight,
        zIndex: newZIndex,
        state: 'open',
        isZoomed: false,
        isShaded: false,
        previousBounds: null,
        restoredFromMinimized: false,
        documentId,
      }],
      activeWindowId: id,
      maxZIndex: newZIndex,
    }));
    return id;
  },

  openSavedDocument: (documentId, title) => {
    const { windows, maxZIndex } = get();

    // Check if window with this documentId already exists (single-instance)
    const existingWindow = windows.find((w) => w.documentId === documentId);
    if (existingWindow) {
      get().focusWindow(existingWindow.id);
      if (existingWindow.state === 'minimized') {
        get().restoreWindow(existingWindow.id);
      }
      return existingWindow.id;
    }

    const id = crypto.randomUUID();
    const newZIndex = maxZIndex + 1;
    const app = 'untitled'; // Saved documents use untitled app type
    const parentApp = getParentApp(app);
    const sizeConfig = getWindowSizeConfig(app);

    set((state) => ({
      windows: [...state.windows, {
        id,
        app,
        parentApp,
        title,
        x: 100 + (state.windows.length * 30),
        y: 100 + (state.windows.length * 30),
        width: sizeConfig.width,
        height: sizeConfig.height,
        minWidth: sizeConfig.minWidth,
        minHeight: sizeConfig.minHeight,
        zIndex: newZIndex,
        state: 'open',
        isZoomed: false,
        isShaded: false,
        previousBounds: null,
        restoredFromMinimized: false,
        documentId,
      }],
      activeWindowId: id,
      maxZIndex: newZIndex,
    }));
    return id;
  },

  closeWindow: (id) => {
    set((state) => {
      const remainingWindows = state.windows.filter((w) => w.id !== id);
      // Normalize zIndex when all windows are closed to prevent unbounded growth
      const newMaxZIndex = remainingWindows.length === 0 ? 100 : state.maxZIndex;
      return {
        windows: remainingWindows,
        activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        maxZIndex: newMaxZIndex,
      };
    });
  },

  closeAllWindowsOfApp: (parentApp) => {
    set((state) => {
      const windowsToClose = state.windows.filter((w) => w.parentApp === parentApp);
      const remainingWindows = state.windows.filter((w) => w.parentApp !== parentApp);
      // Clear activeWindowId if it belonged to the closed app
      const closedIds = windowsToClose.map((w) => w.id);
      const newActiveId = closedIds.includes(state.activeWindowId ?? '') ? null : state.activeWindowId;
      // Normalize zIndex when all windows are closed
      const newMaxZIndex = remainingWindows.length === 0 ? 100 : state.maxZIndex;
      return {
        windows: remainingWindows,
        activeWindowId: newActiveId,
        maxZIndex: newMaxZIndex,
      };
    });
  },

  focusWindow: (id) => {
    const { maxZIndex } = get();
    const newZIndex = maxZIndex + 1;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: newZIndex } : w
      ),
      activeWindowId: id,
      maxZIndex: newZIndex,
    }));
  },

  clearActiveWindow: () => {
    set({ activeWindowId: null });
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, state: 'minimized' as const } : w
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  restoreWindow: (id) => {
    const { maxZIndex } = get();
    const newZIndex = maxZIndex + 1;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, state: 'open' as const, zIndex: newZIndex, restoredFromMinimized: true }
          : w
      ),
      activeWindowId: id,
      maxZIndex: newZIndex,
    }));
  },

  clearRestoredFlag: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, restoredFromMinimized: false } : w
      ),
    }));
  },

  updatePosition: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, x, y } : w
      ),
    }));
  },

  updateSize: (id, width, height) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, width, height } : w
      ),
    }));
  },

  zoomWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w;

        if (w.isZoomed && w.previousBounds) {
          // Restore to previous bounds
          return {
            ...w,
            x: w.previousBounds.x,
            y: w.previousBounds.y,
            width: w.previousBounds.width,
            height: w.previousBounds.height,
            isZoomed: false,
            previousBounds: null,
          };
        } else {
          // Zoom to "fit content" (Tiger behavior: larger comfortable size)
          const zoomedWidth = 600;
          const zoomedHeight = 450;
          return {
            ...w,
            previousBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
            width: zoomedWidth,
            height: zoomedHeight,
            isZoomed: true,
          };
        }
      }),
    }));
  },

  shadeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isShaded: !w.isShaded } : w
      ),
    }));
  },

  getWindowByDocumentId: (documentId) => {
    const { windows } = get();
    return windows.find((w) => w.documentId === documentId);
  },

  setEditMode: (id, isEditing) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isEditing } : w
      ),
    }));
  },

  setWindowTitle: (id, title) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, title } : w
      ),
    }));
  },

  openITunes: (mediaFile) => {
    const { windows, maxZIndex } = get();

    // iTunes is single-instance - check if already open
    const existingWindow = windows.find((w) => w.app === 'itunes' && w.state !== 'closed');
    if (existingWindow) {
      // If opening with a specific file, update the mediaFile and restore/focus
      if (mediaFile) {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === existingWindow.id ? { ...w, mediaFile } : w
          ),
        }));
      }
      get().focusWindow(existingWindow.id);
      if (existingWindow.state === 'minimized') {
        get().restoreWindow(existingWindow.id);
      }
      return existingWindow.id;
    }

    // Create new iTunes window
    const id = crypto.randomUUID();
    const newZIndex = maxZIndex + 1;
    const app = 'itunes';
    const parentApp = getParentApp(app);
    const sizeConfig = getWindowSizeConfig(app);

    set((state) => ({
      windows: [...state.windows, {
        id,
        app,
        parentApp,
        title: getWindowTitle(app),
        x: 100 + (state.windows.length * 30),
        y: 100 + (state.windows.length * 30),
        width: sizeConfig.width,
        height: sizeConfig.height,
        minWidth: sizeConfig.minWidth,
        minHeight: sizeConfig.minHeight,
        zIndex: newZIndex,
        state: 'open',
        isZoomed: false,
        isShaded: false,
        previousBounds: null,
        restoredFromMinimized: false,
        mediaFile,
      }],
      activeWindowId: id,
      maxZIndex: newZIndex,
    }));
    return id;
  },

  openQuickTime: (mediaFile) => {
    const { windows, maxZIndex } = get();

    // QuickTime is single-instance - check if already open
    const existingWindow = windows.find((w) => w.app === 'quicktime' && w.state !== 'closed');
    if (existingWindow) {
      // If opening with a specific file, update the mediaFile and restore/focus
      if (mediaFile) {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === existingWindow.id ? { ...w, mediaFile } : w
          ),
        }));
      }
      get().focusWindow(existingWindow.id);
      if (existingWindow.state === 'minimized') {
        get().restoreWindow(existingWindow.id);
      }
      return existingWindow.id;
    }

    // Create new QuickTime window
    const id = crypto.randomUUID();
    const newZIndex = maxZIndex + 1;
    const app = 'quicktime';
    const parentApp = getParentApp(app);
    const sizeConfig = getWindowSizeConfig(app);

    set((state) => ({
      windows: [...state.windows, {
        id,
        app,
        parentApp,
        title: getWindowTitle(app),
        x: 100 + (state.windows.length * 30),
        y: 100 + (state.windows.length * 30),
        width: sizeConfig.width,
        height: sizeConfig.height,
        minWidth: sizeConfig.minWidth,
        minHeight: sizeConfig.minHeight,
        zIndex: newZIndex,
        state: 'open',
        isZoomed: false,
        isShaded: false,
        previousBounds: null,
        restoredFromMinimized: false,
        mediaFile,
      }],
      activeWindowId: id,
      maxZIndex: newZIndex,
    }));
    return id;
  },
}));
