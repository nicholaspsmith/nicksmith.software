import { create } from 'zustand';

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  app: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  state: 'open' | 'minimized' | 'closed';
  isZoomed: boolean;
  previousBounds: WindowBounds | null;
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
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  zoomWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  // Initial state
  windows: [],
  activeWindowId: null,
  maxZIndex: 0,

  // Actions
  openWindow: (app) => {
    const id = crypto.randomUUID();
    const { maxZIndex } = get();
    const newZIndex = maxZIndex + 1;
    set((state) => ({
      windows: [...state.windows, {
        id,
        app,
        title: app, // Default title to app name
        x: 100 + (state.windows.length * 30), // Cascade positioning
        y: 100 + (state.windows.length * 30),
        width: 400,
        height: 300,
        zIndex: newZIndex,
        state: 'open',
        isZoomed: false,
        previousBounds: null,
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
        w.id === id ? { ...w, state: 'open' as const, zIndex: newZIndex } : w
      ),
      activeWindowId: id,
      maxZIndex: newZIndex,
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
}));
