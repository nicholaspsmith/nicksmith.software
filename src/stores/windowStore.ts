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
  // Terminal is its own app (not grouped)
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
  untitled: 'Untitled',
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
  // Finder windows - opens at 650x380, min size 365x365
  'finder-home': { width: 650, height: 380, minWidth: 365, minHeight: 365 },
  'finder-hd': { width: 650, height: 380, minWidth: 365, minHeight: 365 },
  'finder-trash': { width: 650, height: 380, minWidth: 365, minHeight: 365 },
};

/**
 * Get window size configuration for an app
 * Falls back to default size if not specified
 */
function getWindowSizeConfig(app: string): WindowSizeConfig {
  return WINDOW_SIZE_CONFIGS[app] || { width: 400, height: 300, minWidth: 200, minHeight: 100 };
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
}

interface WindowStore {
  // State
  windows: WindowState[];
  activeWindowId: string | null;
  maxZIndex: number;

  // Actions (verb prefix)
  openWindow: (app: string) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  clearActiveWindow: () => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  clearRestoredFlag: (id: string) => void;
  zoomWindow: (id: string) => void;
  shadeWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  // Initial state
  windows: [],
  activeWindowId: null,
  // Start at 100 to match --aqua-z-windows and stay above desktop icons
  maxZIndex: 100,

  // Actions
  openWindow: (app) => {
    const { windows, maxZIndex } = get();

    // Check if window for this app already exists
    const existingWindow = windows.find((w) => w.app === app);
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

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
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
}));
