/**
 * Sacred Values Registry for iOS 6
 *
 * Pixel-perfect measurements from iOS 6 that must never be changed.
 * These values ensure authentic iOS 6 recreation.
 */
export const IOS_SACRED = {
  // Status bar
  statusBarHeight: 20,

  // App icons
  iconSize: 60,
  iconCornerRadius: 12,
  iconGridGap: 20,
  iconLabelFontSize: 11,

  // Home screen layout
  iconColumns: 4,
  iconRows: 5,
  dockIconCount: 4,
  dockHeight: 96,

  // Dock
  dockPaddingX: 4,
  dockIconGap: 16,

  // Page dots
  pageDotSize: 7,
  pageDotGap: 10,

  // Touch targets
  minTouchTarget: 44,

  // Colors
  colors: {
    statusBarText: '#FFFFFF',
    iconLabelText: '#FFFFFF',
    iconLabelShadow: 'rgba(0, 0, 0, 0.75)',
    dockBackground: 'rgba(0, 0, 0, 0.4)',
    pageDotActive: '#FFFFFF',
    pageDotInactive: 'rgba(255, 255, 255, 0.4)',
  },
} as const;

/**
 * iOS 6 breakpoint - below this we show iOS experience
 */
export const IOS_BREAKPOINT = 768;
