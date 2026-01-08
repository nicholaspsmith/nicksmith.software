/**
 * Sacred Values Registry
 *
 * Authentic Mac OS X Tiger (10.4) UI measurements.
 * These values are pixel-perfect specifications that maintain visual authenticity.
 *
 * DO NOT MODIFY - These are sacred values from the original Tiger UI.
 */

/**
 * Core UI measurements from Mac OS X Tiger
 * All values in pixels unless otherwise noted
 */
export const SACRED = {
  // ========================================
  // TRAFFIC LIGHT BUTTONS
  // Close, Minimize, Zoom button specs
  // ========================================
  trafficLightDiameter: 12,
  trafficLightSpacing: 8,
  trafficLightMargin: 8,

  // ========================================
  // WINDOW CHROME
  // Title bar and window frame specs
  // ========================================
  titleBarHeight: 22,
  windowCornerRadius: 5,
  menuBarHeight: 22,

  // ========================================
  // WINDOW DEFAULTS
  // Default window dimensions and behavior
  // ========================================
  windowMinWidth: 200,
  windowMinHeight: 100,
  windowDefaultWidth: 400,
  windowDefaultHeight: 300,
  windowCascadeOffset: 30,
  windowViewportMargin: 50,

  // ========================================
  // DESKTOP ICONS
  // Icon grid and sizing specs
  // ========================================
  iconSize: 48,
  iconGridCellWidth: 80,
  iconGridCellHeight: 90,
  iconGridRightMargin: 20,
  iconGridTopMargin: 40,
  iconLabelMaxWidth: 72,

  // ========================================
  // DOCK
  // Dock sizing specs (Phase 2)
  // ========================================
  dockIconSize: 48,
  dockMagnification: 128,
  dockHeight: 64,
} as const;

/**
 * Type representing a single sacred value
 */
export type SacredValue = typeof SACRED[keyof typeof SACRED];

/**
 * Type representing all sacred value keys
 */
export type SacredKey = keyof typeof SACRED;
