import html2canvas from 'html2canvas';

// Calculate sine-wave distortion for genie curve
// Exact copy from genie.js
function calculateSinPosition(
  index: number,
  stepCount: number,
  startCounter: number,
  multiplier: number,
  offset: number,
  subtract: boolean
): number {
  const increase = Math.PI / stepCount;
  const counter = startCounter + index * increase;
  const value = Math.sin(counter) * multiplier;
  return Math.ceil(subtract ? value - offset : value + offset);
}

export interface GenieAnimationConfig {
  /** X position of dock thumbnail center */
  thumbX: number;
  /** Y position (top) of dock thumbnail */
  thumbY: number;
  /** Width of dock thumbnail */
  thumbWidth: number;
  /** Speed multiplier (1 = normal, 0.25 = slow motion for shift key) */
  speedMultiplier?: number;
  /** Callback when animation completes */
  onComplete: (thumbnailDataUrl: string) => void;
}

export interface GenieExpandConfig {
  /** X position of dock thumbnail center (where animation starts) */
  thumbX: number;
  /** Y position (top) of dock thumbnail */
  thumbY: number;
  /** Width of dock thumbnail */
  thumbWidth: number;
  /** Stored thumbnail image from minimize */
  thumbnailDataUrl: string;
  /** Explicit target width (use this instead of getBoundingClientRect for reliability) */
  targetWidth: number;
  /** Explicit target height (use this instead of getBoundingClientRect for reliability) */
  targetHeight: number;
  /** Speed multiplier (1 = normal, 0.25 = slow motion for shift key) */
  speedMultiplier?: number;
  /** Callback when animation completes */
  onComplete: () => void;
}

/**
 * Applies genie effect exactly like genie.js collapse()
 *
 * Key insight from genie.js:
 * - stepCount = vertical distance from window to dock (NOT window height)
 * - Slices extend from window position down toward dock
 * - Container stays in place, doesn't move
 * - Slices curve via sine wave, then height collapses to 0
 */
export async function applyGenieEffect(
  element: HTMLElement,
  config: GenieAnimationConfig
): Promise<void> {
  const { thumbX, thumbY, thumbWidth, speedMultiplier = 1, onComplete } = config;
  const STEP_HEIGHT = 1; // Same as genie.js

  // Calculate timing based on speed multiplier
  const curveDelay = 100 / speedMultiplier;
  const curveDuration = 300 / speedMultiplier;
  const curveWait = 350 / speedMultiplier;
  const collapseDuration = 500 / speedMultiplier;
  const collapseWait = 550 / speedMultiplier;

  // Get source bounds (like genie.js sourceBounds)
  const sourceBounds = element.getBoundingClientRect();

  // Get thumb bounds (like genie.js thumbBounds)
  const thumbBounds = {
    t: thumbY,
    l: thumbX - thumbWidth / 2,
    w: thumbWidth,
  };

  // Capture the element as an image at high resolution for crisp display
  // Use devicePixelRatio for retina/high-DPI screens (minimum 2 for quality)
  const captureScale = Math.max(2, window.devicePixelRatio || 1);
  let imageDataUrl: string;
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: captureScale,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });
    imageDataUrl = canvas.toDataURL('image/png');
  } catch (error) {
    console.error('GenieEffect: Failed to capture:', error);
    onComplete('');
    return;
  }

  // stepCount = vertical distance from source top to thumb top
  const stepCount = Math.ceil((thumbBounds.t - sourceBounds.top) / STEP_HEIGHT);

  // Save original styles
  const originalStyles = {
    innerHTML: element.innerHTML,
    overflow: element.style.overflow,
    background: element.style.background,
    backgroundColor: element.style.backgroundColor,
    backgroundImage: element.style.backgroundImage,
    backgroundSize: element.style.backgroundSize,
    backgroundRepeat: element.style.backgroundRepeat,
    backgroundPosition: element.style.backgroundPosition,
    border: element.style.border,
    borderRadius: element.style.borderRadius,
    boxShadow: element.style.boxShadow,
    transition: element.style.transition,
    height: element.style.height,
  };

  // Set up element - hide all visual styling, only show slices
  element.style.overflow = 'visible';
  element.style.background = 'transparent';
  element.style.backgroundColor = 'transparent';
  element.style.border = 'none';
  element.style.borderRadius = '0';
  element.style.boxShadow = 'none';
  element.style.backgroundImage = `url(${imageDataUrl})`;
  element.style.backgroundSize = `${sourceBounds.width}px ${sourceBounds.height}px`;
  element.style.backgroundRepeat = 'no-repeat';
  element.style.backgroundPosition = '0 -9999px'; // Hide main bg, slices show it
  // Use high-quality image rendering for crisp text and graphics
  (element.style as CSSStyleDeclaration & { imageRendering: string }).imageRendering = 'high-quality';

  // Create slices at full width (straight) - exactly like genie.js collapse()
  element.innerHTML = '';

  for (let i = 0; i < stepCount; i++) {
    const top = i * STEP_HEIGHT;

    const slice = document.createElement('div');
    slice.className = 'genie-step';
    slice.style.cssText = `
      position: absolute;
      top: ${top}px;
      left: 0px;
      width: ${sourceBounds.width}px;
      height: ${STEP_HEIGHT + 1}px;
      background-image: inherit;
      background-size: inherit;
      background-repeat: no-repeat;
      background-position: 0px ${-top}px;
      transition: left ${curveDuration}ms ease-out, width ${curveDuration}ms ease-out;
      image-rendering: high-quality;
    `;
    element.appendChild(slice);
  }

  // After brief delay, animate to curved positions
  await new Promise(resolve => setTimeout(resolve, curveDelay));

  // Calculate curve parameters - exactly like genie.js
  const radiansLeft = Math.floor((thumbBounds.l - sourceBounds.left) / 2);
  const radiansWidth = Math.floor((thumbBounds.w - sourceBounds.width) / 2);
  const rwOffset = radiansWidth - thumbBounds.w;

  // Apply curved positions using sine wave
  const slices = Array.from(element.children) as HTMLElement[];
  slices.forEach((slice, i) => {
    const left = calculateSinPosition(i, stepCount, 4.7, radiansLeft, radiansLeft, false);
    const width = calculateSinPosition(i, stepCount, 4.7, radiansWidth, rwOffset, true);
    slice.style.left = `${left}px`;
    slice.style.width = `${width}px`;
  });

  // Wait for curve animation to complete
  await new Promise(resolve => setTimeout(resolve, curveWait));

  // Phase 2: Collapse height to 0
  const diffT = thumbBounds.t + sourceBounds.top - 100;

  slices.forEach((slice, i) => {
    slice.style.transition = `background-position ${collapseDuration}ms ease-in`;
    slice.style.backgroundPosition = `0px ${diffT + i - i * STEP_HEIGHT}px`;
  });

  // Add height transition and collapse
  element.style.transition = `height ${collapseDuration}ms ease-in`;

  // Trigger reflow
  void element.offsetHeight;

  // Collapse!
  element.style.height = '0px';

  // Wait for collapse to complete
  await new Promise(resolve => setTimeout(resolve, collapseWait));

  // Clean up - restore original styles
  // IMPORTANT: Set visibility hidden FIRST to prevent flash before state changes
  element.style.visibility = 'hidden';
  element.innerHTML = originalStyles.innerHTML;
  element.style.overflow = originalStyles.overflow;
  element.style.background = originalStyles.background;
  element.style.backgroundColor = originalStyles.backgroundColor;
  element.style.backgroundImage = originalStyles.backgroundImage;
  element.style.backgroundSize = originalStyles.backgroundSize;
  element.style.backgroundRepeat = originalStyles.backgroundRepeat;
  element.style.backgroundPosition = originalStyles.backgroundPosition;
  element.style.border = originalStyles.border;
  element.style.borderRadius = originalStyles.borderRadius;
  element.style.boxShadow = originalStyles.boxShadow;
  element.style.transition = originalStyles.transition;
  element.style.height = originalStyles.height;

  onComplete(imageDataUrl);
}

/**
 * Applies reverse genie effect exactly like genie.js expand()
 *
 * Key insight from genie.js:
 * - Slices start at curved positions with compressed background
 * - Background positions animate to expand
 * - Slices then straighten (fan out) to full width
 *
 * IMPORTANT: Uses overlay approach to preserve React event handlers.
 * Instead of replacing innerHTML, we:
 * 1. Hide actual content with CSS
 * 2. Create slices in a separate overlay container
 * 3. Animate the overlay
 * 4. Remove overlay and show actual content
 */
export async function applyGenieExpandEffect(
  element: HTMLElement,
  config: GenieExpandConfig
): Promise<void> {
  const { thumbX, thumbY, thumbWidth, thumbnailDataUrl, targetWidth, targetHeight, speedMultiplier = 1, onComplete } = config;
  const STEP_HEIGHT = 1;

  // Calculate timing based on speed multiplier (from genie.js CSS)
  const expandDelay = 100 / speedMultiplier;
  const expandDuration = 700 / speedMultiplier;
  const expandWait = 750 / speedMultiplier;
  const fanDuration = 300 / speedMultiplier;
  const fanWait = 350 / speedMultiplier;

  // Get element position from DOM, but use explicit dimensions for reliable sizing
  // (getBoundingClientRect can return wrong size when element has visibility:hidden)
  const elementRect = element.getBoundingClientRect();
  const targetBounds = {
    top: elementRect.top,
    left: elementRect.left,
    width: targetWidth,
    height: targetHeight,
  };

  // Thumb bounds (where animation starts from)
  const thumbBounds = {
    t: thumbY,
    l: thumbX - thumbWidth / 2,
    w: thumbWidth,
  };

  // stepCount = vertical distance from target top to thumb top
  const stepCount = Math.ceil((thumbBounds.t - targetBounds.top) / STEP_HEIGHT);
  const diffT = thumbBounds.t - targetBounds.top;

  // Calculate curve parameters - exactly like genie.js expand()
  const radiansLeft = Math.floor((thumbBounds.l - targetBounds.left) / 2);
  const radiansWidth = Math.floor((thumbBounds.w - targetBounds.width) / 2);
  const rwOffset = radiansWidth - thumbBounds.w;

  // Save original styles
  const originalStyles = {
    overflow: element.style.overflow,
    background: element.style.background,
    backgroundColor: element.style.backgroundColor,
    border: element.style.border,
    borderRadius: element.style.borderRadius,
    boxShadow: element.style.boxShadow,
  };

  // Hide actual content but keep it in DOM (preserves React)
  const children = Array.from(element.children) as HTMLElement[];
  children.forEach(child => {
    child.style.visibility = 'hidden';
  });

  // Set up element for animation - hide window chrome so only slices show
  element.style.overflow = 'visible';
  element.style.background = 'transparent';
  element.style.backgroundColor = 'transparent';
  element.style.border = 'none';
  element.style.borderRadius = '0';
  element.style.boxShadow = 'none';

  // Create overlay container for slices
  const overlay = document.createElement('div');
  overlay.className = 'genie-overlay';
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
    background-image: url(${thumbnailDataUrl});
    background-size: ${targetBounds.width}px ${targetBounds.height}px;
    background-repeat: no-repeat;
    background-position: 0 -9999px;
    image-rendering: high-quality;
  `;

  // Create slices at curved positions with compressed background
  for (let i = 0; i < stepCount; i++) {
    const top = i * STEP_HEIGHT;
    // Curved position using sine wave (startCounter = 4.75 for expand)
    const left = calculateSinPosition(i, stepCount, 4.75, radiansLeft, radiansLeft, false);
    const width = calculateSinPosition(i, stepCount, 4.75, radiansWidth, rwOffset, true);
    // Compressed background position
    const bgY = diffT - top;

    const slice = document.createElement('div');
    slice.className = 'genie-step';
    slice.style.cssText = `
      position: absolute;
      top: ${top}px;
      left: ${left}px;
      width: ${width}px;
      height: ${STEP_HEIGHT + 1}px;
      background-image: inherit;
      background-size: inherit;
      background-repeat: no-repeat;
      background-position: 0px ${bgY}px;
      transition: background-position ${expandDuration}ms ease-out;
      image-rendering: high-quality;
    `;
    overlay.appendChild(slice);
  }

  element.appendChild(overlay);

  // After brief delay, animate background positions to expand
  await new Promise(resolve => setTimeout(resolve, expandDelay));

  const slices = Array.from(overlay.children) as HTMLElement[];
  slices.forEach((slice, i) => {
    // Expanded background position (percentage-based like genie.js)
    const bgY = ((i * STEP_HEIGHT - 2) / (targetBounds.height - STEP_HEIGHT)) * 100;
    slice.style.backgroundPosition = `0% ${bgY}%`;
  });

  // Wait for background expansion to complete
  await new Promise(resolve => setTimeout(resolve, expandWait));

  // Phase 2: Fan out (straighten slices)
  slices.forEach((slice) => {
    slice.style.transition = `left ${fanDuration}ms ease-out, width ${fanDuration}ms ease-out`;
    slice.style.left = '0px';
    slice.style.width = `${targetBounds.width}px`;
  });

  // Wait for fan to complete
  await new Promise(resolve => setTimeout(resolve, fanWait));

  // Clean up - remove overlay, restore styles, and show actual content
  overlay.remove();
  element.style.overflow = originalStyles.overflow;
  element.style.background = originalStyles.background;
  element.style.backgroundColor = originalStyles.backgroundColor;
  element.style.border = originalStyles.border;
  element.style.borderRadius = originalStyles.borderRadius;
  element.style.boxShadow = originalStyles.boxShadow;
  children.forEach(child => {
    child.style.visibility = '';
  });

  onComplete();
}

// Empty component export for backwards compatibility
export function GenieEffect() {
  return null;
}
