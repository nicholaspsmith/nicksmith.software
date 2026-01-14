import { create } from 'zustand';

/**
 * Available wallpaper options
 */
export const WALLPAPERS = [
  { id: 'charleston01', path: '/ios_wallpapers/charleston01.jpg', label: 'Charleston 1' },
  { id: 'charleston02', path: '/ios_wallpapers/charleston02.jpg', label: 'Charleston 2' },
  { id: 'charleston03', path: '/ios_wallpapers/charleston03.jpg', label: 'Charleston 3' },
] as const;

export type WallpaperId = (typeof WALLPAPERS)[number]['id'];

/**
 * Display Settings State
 */
interface DisplayState {
  /** Currently selected wallpaper ID */
  wallpaperId: WallpaperId;
  /** Screen brightness (0-1) */
  brightness: number;
}

/**
 * Display Settings Actions
 */
interface DisplayActions {
  /** Set the wallpaper */
  setWallpaper: (id: WallpaperId) => void;
  /** Set screen brightness (0-1) */
  setBrightness: (brightness: number) => void;
}

const initialState: DisplayState = {
  wallpaperId: 'charleston01',
  brightness: 1,
};

/**
 * Zustand store for display settings
 */
export const useDisplayStore = create<DisplayState & DisplayActions>((set) => ({
  ...initialState,

  setWallpaper: (id) => {
    set({ wallpaperId: id });
  },

  setBrightness: (brightness) => {
    // Clamp between 0.2 and 1 (don't allow complete darkness)
    const clamped = Math.max(0.2, Math.min(1, brightness));
    set({ brightness: clamped });
  },
}));

/**
 * Get wallpaper path by ID
 */
export function getWallpaperPath(id: WallpaperId): string {
  const wallpaper = WALLPAPERS.find((w) => w.id === id);
  return wallpaper?.path ?? WALLPAPERS[0].path;
}
