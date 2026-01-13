/**
 * Sacred Values Registry for iOS 15+ Modern Interface
 *
 * Pixel-perfect measurements that ensure authentic iOS 15+ recreation.
 */
export const IOS_MODERN_SACRED = {
  // iPhone frame (bezel)
  bezelBorderWidth: 16,
  bezelBorderRadius: 64,
  notchWidth: '50%',
  notchHeight: 30,
  notchBorderRadius: 22,

  // Status bar
  statusBarHeight: 44,

  // App icons
  iconSize: 60,
  iconCornerRadius: 13.4, // iOS 15+ uses more rounded corners
  iconLabelFontSize: 12,
  iconLabelMarginTop: 6,

  // Home screen layout
  homeScreenPaddingTop: 60,
  homeScreenGridGap: 24,
  iconColumns: 3,
  iconRowsMain: 2, // 2x3 grid = 6 icons

  // Dock
  dockHeight: 96,
  dockIconCount: 4,
  dockIconGap: 24,
  dockPaddingX: 16,
  dockBackdropBlur: 20,
  dockBorderRadius: 32,
  dockMarginBottom: 8,

  // Navigation bar
  navBarHeight: 44,
  backButtonSize: 44,

  // Animations
  bootDuration: 2000,
  appOpenDuration: 300,
  appCloseDuration: 250,

  // Colors
  colors: {
    bezelBackground: 'rgb(8, 8, 8)',
    iconLabelText: '#FFFFFF',
    iconLabelShadow: '2px 2px 12px rgba(0, 0, 0, 0.8)',
    dockBackground: 'rgba(255, 255, 255, 0.2)',
    statusBarText: '#FFFFFF',
  },
} as const;

/**
 * iOS breakpoint - below this we show iOS experience
 * Shows iOS interface on mobile and tablet screens (< 1024px)
 */
export const IOS_BREAKPOINT = 1024;
