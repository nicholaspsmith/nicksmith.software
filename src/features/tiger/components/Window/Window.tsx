import { useCallback, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Rnd } from 'react-rnd';
import { motion } from 'motion/react';
import { useWindowStore } from '@/stores/windowStore';
import { SACRED } from '../../constants/sacred';
import { WindowChrome } from '../WindowChrome';
import { windowVariants } from '@/animations/aqua';
import { applyGenieEffect, applyGenieExpandEffect } from '@/components/GenieEffect';
import styles from './Window.module.css';

/** Dock thumbnail size for scaling */
const DOCK_THUMBNAIL_SIZE = 48;

/**
 * Get the actual position of a dock slot by querying the DOM
 * Returns the center position of the slot (both X and Y), or null if not found
 */
function getDockSlotPosition(windowId: string): { x: number; y: number } | null {
  const slot = document.querySelector(`[data-testid="dock-slot-${windowId}"]`);
  if (!slot) return null;

  const rect = slot.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export interface WindowProps {
  id: string;
  title: string;
  children?: React.ReactNode;
  /** Use slow fade-in animation for startup window */
  isStartupWindow?: boolean;
  /** Right-click handler for title bar context menu */
  onTitleBarContextMenu?: (e: React.MouseEvent) => void;
}

/**
 * Window component - Draggable, resizable window container
 *
 * Uses react-rnd for smooth 60fps drag and resize interactions.
 * Connects to windowStore for position/size persistence and z-index management.
 * Uses motion for open/close animations.
 * Uses applyGenieEffect for minimize animation (transforms actual window element).
 */
export function Window({ id, title, children, isStartupWindow = false, onTitleBarContextMenu }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  const windowState = useWindowStore((s) => s.windows.find((w) => w.id === id));
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const updateSize = useWindowStore((s) => s.updateSize);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const startMinimizing = useWindowStore((s) => s.startMinimizing);
  const minimizeWindowAction = useWindowStore((s) => s.minimizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const setThumbnail = useWindowStore((s) => s.setThumbnail);
  const zoomWindow = useWindowStore((s) => s.zoomWindow);
  const shadeWindow = useWindowStore((s) => s.shadeWindow);
  const completeRestore = useWindowStore((s) => s.completeRestore);

  // Animation state for open/close (minimize/restore use direct DOM manipulation via genie effect)
  const [animationState, setAnimationState] = useState<'opening' | 'startupOpening' | 'open' | 'closing'>(
    isStartupWindow ? 'startupOpening' : 'opening'
  );

  // Track if genie restore animation is in progress (local state for restore animation)
  const [genieRestoreRunning, setGenieRestoreRunning] = useState(false);

  // Use store state for isMinimizing to ensure atomic updates with state changes
  // This prevents brief flash when transitioning from minimizing to minimized
  const isMinimizingFromStore = windowState?.isMinimizing ?? false;

  // Track the dock slot element for portal rendering
  const [dockSlotElement, setDockSlotElement] = useState<HTMLElement | null>(null);
  // Store position captured at restore trigger (before dock slot exits)
  const restoreFromPositionRef = useRef<{ x: number; y: number } | null>(null);
  // Store shift key state captured at restore trigger (for slow motion)
  const restoreShiftKeyRef = useRef<boolean>(false);

  // Find dock slot element when minimized (for portal rendering)
  useEffect(() => {
    if (windowState?.state === 'minimized' || windowState?.isMinimizing) {
      // Poll for the dock slot element (it may not exist immediately during minimize animation)
      const findSlot = () => {
        const slot = document.getElementById(`dock-slot-${id}`);
        if (slot && slot !== dockSlotElement) {
          setDockSlotElement(slot);
        }
      };
      findSlot();
      // Use MutationObserver to detect when dock slot is added/removed
      const observer = new MutationObserver(findSlot);
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    } else if (!windowState?.isRestoring) {
      setDockSlotElement(null);
    }
  }, [windowState?.state, windowState?.isMinimizing, windowState?.isRestoring, id, dockSlotElement]);

  const isFocused = activeWindowId === id;
  const isMinimized = windowState?.state === 'minimized';
  const isRestoring = windowState?.isRestoring ?? false;

  // Detect when window is restored from minimized and trigger genie expand animation
  useEffect(() => {
    if (windowState?.restoredFromMinimized && windowRef.current && !genieRestoreRunning) {
      setGenieRestoreRunning(true);

      // Use the position captured when user clicked (before dock slot exited)
      const slotPos = restoreFromPositionRef.current;
      if (!slotPos) {
        // Fallback - just complete restore without animation
        setGenieRestoreRunning(false);
        completeRestore(id);
        return;
      }

      // Capture current window content for animation (if we have a stored thumbnail, use it)
      const thumbnailDataUrl = windowState.thumbnail || '';

      // Get shift key state captured at click time (for slow motion)
      const speedMultiplier = restoreShiftKeyRef.current ? 0.25 : 1;

      // Wait for DOM layout to settle before starting animation
      // This ensures getBoundingClientRect() returns correct values in genie effect
      requestAnimationFrame(() => {
        if (!windowRef.current) {
          setGenieRestoreRunning(false);
          completeRestore(id);
          return;
        }

        // Run genie expand animation (with shift key slow motion support)
        // Pass explicit target dimensions to ensure animation goes to correct size
        // Offset thumbX by ~50px to compensate for dock shift during exit animation
        // (dock is centered and shifts right as the slot shrinks during exit)
        applyGenieExpandEffect(windowRef.current, {
          thumbX: slotPos.x + 50,
          thumbY: slotPos.y,
          thumbWidth: DOCK_THUMBNAIL_SIZE,
          thumbnailDataUrl,
          targetWidth: windowState.width,
          targetHeight: windowState.height,
          speedMultiplier,
          onComplete: () => {
            setGenieRestoreRunning(false);
            restoreFromPositionRef.current = null;
            restoreShiftKeyRef.current = false;
            completeRestore(id);
          },
        });
      });
    }
  }, [windowState?.restoredFromMinimized, windowState?.thumbnail, id, completeRestore, genieRestoreRunning]);

  const handleDragStop = useCallback(
    (_e: unknown, d: { x: number; y: number }) => {
      const clampedY = Math.max(d.y, SACRED.menuBarHeight);
      updatePosition(id, d.x, clampedY);
    },
    [id, updatePosition]
  );

  const handleResizeStop = useCallback(
    (
      _e: unknown,
      _dir: unknown,
      ref: HTMLElement,
      _delta: unknown,
      position: { x: number; y: number }
    ) => {
      const width = parseInt(ref.style.width, 10);
      const height = parseInt(ref.style.height, 10);
      updateSize(id, width, height);
      updatePosition(id, position.x, position.y);
    },
    [id, updatePosition, updateSize]
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const style = window.getComputedStyle(target);
    if (style.cursor.includes('resize') && style.zIndex === '9999') {
      return;
    }
    focusWindow(id);
  }, [id, focusWindow]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleClose = useCallback(() => {
    setAnimationState('closing');
  }, []);

  const handleMinimize = useCallback((event?: { shiftKey?: boolean }) => {
    // Use store state to prevent double-click during animation
    if (!windowState || !windowRef.current || isMinimizingFromStore) return;

    // Reserve dock slot immediately (dock grows with animation)
    // This also sets windowState.isMinimizing = true in the store
    startMinimizing(id);

    // Wait a frame for the dock slot to be created, then query its position
    requestAnimationFrame(() => {
      const slotPos = getDockSlotPosition(id);
      if (!slotPos || !windowRef.current) {
        // Fallback if slot not found - clear minimizing state
        minimizeWindowAction(id);
        return;
      }

      // Slow motion if shift key is held (25% speed)
      const speedMultiplier = event?.shiftKey ? 0.25 : 1;

      // Apply genie effect to the ACTUAL window element
      // Offset thumbX by -35px to compensate for dock shift during enter animation
      // (dock is centered and shifts left as the slot grows during enter)
      applyGenieEffect(windowRef.current, {
        thumbX: slotPos.x - 35,
        thumbY: slotPos.y,
        thumbWidth: DOCK_THUMBNAIL_SIZE,
        speedMultiplier,
        onComplete: (thumbnailDataUrl) => {
          // Store the thumbnail and mark window as minimized
          if (thumbnailDataUrl) {
            setThumbnail(id, thumbnailDataUrl);
          }
          // Hide the element to prevent flash before state updates
          // The genie effect restores the element's appearance, so we need to hide it again
          if (windowRef.current) {
            windowRef.current.style.visibility = 'hidden';
          }
          // minimizeWindowAction atomically sets state='minimized' and isMinimizing=false
          minimizeWindowAction(id);
        },
      });
    });
  }, [windowState, minimizeWindowAction, id, setThumbnail, isMinimizingFromStore, startMinimizing]);

  const handleZoom = useCallback(() => {
    zoomWindow(id);
  }, [id, zoomWindow]);

  const handleShade = useCallback(() => {
    shadeWindow(id);
  }, [id, shadeWindow]);

  const handleAnimationComplete = useCallback(() => {
    if (animationState === 'opening' || animationState === 'startupOpening') {
      setAnimationState('open');
    } else if (animationState === 'closing') {
      closeWindow(id);
    }
  }, [animationState, id, closeWindow]);

  // Listen for keyboard shortcut events
  useEffect(() => {
    if (typeof window === 'undefined' || !window.addEventListener) return;

    const handleCloseRequest = (e: CustomEvent<{ windowId: string }>) => {
      if (e.detail.windowId === id) {
        handleClose();
      }
    };

    const handleMinimizeRequest = (e: CustomEvent<{ windowId: string }>) => {
      if (e.detail.windowId === id) {
        handleMinimize();
      }
    };

    window.addEventListener('window-close-request', handleCloseRequest as EventListener);
    window.addEventListener('window-minimize-request', handleMinimizeRequest as EventListener);

    return () => {
      window.removeEventListener('window-close-request', handleCloseRequest as EventListener);
      window.removeEventListener('window-minimize-request', handleMinimizeRequest as EventListener);
    };
  }, [id, handleClose, handleMinimize]);

  // Don't render if window not found
  if (!windowState) {
    return null;
  }

  // When minimized but dock slot element not yet found, don't render anything
  // This prevents a brief flash at the wrong position
  if (isMinimized && !dockSlotElement && !isRestoring) {
    return null;
  }

  const titleId = `window-title-${id}`;
  const isShaded = windowState.isShaded;
  const displayHeight = isShaded ? SACRED.titleBarHeight : windowState.height;

  // Resize handle styles
  const isFinderWindow = windowState.parentApp === 'finder';
  const bottomRightStyle = isFinderWindow
    ? { cursor: 'var(--aqua-cursor-resize-se)', zIndex: 9999, width: '22px', height: '22px', right: '-1px', bottom: '-1px' }
    : { cursor: 'var(--aqua-cursor-resize-se)', zIndex: 9999, width: '14px', height: '14px' };
  const resizeHandleStyles = {
    top: { cursor: 'var(--aqua-cursor-resize-n)', zIndex: 9999, height: '8px', top: '-5px' },
    right: { cursor: 'var(--aqua-cursor-resize-e)', zIndex: 9999, width: '5px', right: '-5px' },
    bottom: { cursor: 'var(--aqua-cursor-resize-s)', zIndex: 9999, height: '4px', left: '0px', bottom: '-1px' },
    left: { cursor: 'var(--aqua-cursor-resize-w)', zIndex: 9999, width: '5px', left: '-4px' },
    topRight: { cursor: 'var(--aqua-cursor-resize-ne)', zIndex: 9999, width: '14px', height: '14px' },
    bottomRight: bottomRightStyle,
    bottomLeft: { cursor: 'var(--aqua-cursor-resize-sw)', zIndex: 9999, width: '14px', height: '14px', left: '-5px', bottom: '-5px' },
    topLeft: { cursor: 'var(--aqua-cursor-resize-nw)', zIndex: 9999, width: '14px', height: '14px', left: '-5px', top: '-5px' },
  };

  // Use store state (isMinimizingFromStore) for atomic check - prevents flash on state transition
  const showMinimizedInDock = isMinimized && dockSlotElement && !isMinimizingFromStore;

  // Calculate scale factor for the minimized window (scales to fit in 48px base size)
  const baseScale = DOCK_THUMBNAIL_SIZE / Math.max(windowState.width, windowState.height);

  // Minimized window content to render in dock slot (via portal)
  const minimizedContent = (
    <div
      className={styles.minimizedWindow}
      data-minimized-window
      style={{
        // Set base scale as CSS variable for hover magnification in Dock.module.css
        '--base-scale': baseScale,
        width: windowState.width,
        height: windowState.height,
        // Center in container and scale down to fit
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(${baseScale})`,
        transformOrigin: 'center',
        cursor: isRestoring ? 'default' : 'pointer',
        pointerEvents: isRestoring ? 'none' : 'auto',
        // Hide once genie animation starts (genie slices provide the visual)
        opacity: genieRestoreRunning ? 0 : 1,
        // Smooth transition for magnification scaling
        transition: 'transform 100ms cubic-bezier(0.25, 1, 0.5, 1), opacity 0.05s',
      } as React.CSSProperties}
      onClick={(e) => {
        e.stopPropagation();
        if (!isRestoring) {
          // Capture dock position BEFORE triggering restore (dock slot will exit)
          const currentPos = getDockSlotPosition(id);
          if (currentPos) {
            restoreFromPositionRef.current = currentPos;
          }
          // Capture shift key state for slow motion animation
          restoreShiftKeyRef.current = e.shiftKey;
          restoreWindow(id);
        }
      }}
      data-testid={`minimized-window-${id}`}
      title={title}
    >
      {/* Inner content has pointer-events: none to block interaction with window elements */}
      {/* The outer container handles clicks for restore functionality */}
      <div className={styles.window} style={{ pointerEvents: 'none' }}>
        <WindowChrome
          title={title}
          titleId={titleId}
          isFocused={false}
          isShaded={isShaded}
          compact={windowState.app === 'about-this-mac'}
          isPanel={windowState.app === 'about-this-mac'}
          onClose={() => {}}
          onMinimize={() => {}}
          onZoom={() => {}}
          onShade={() => {}}
        >
          {children}
        </WindowChrome>
      </div>
    </div>
  );

  // Portal the minimized window into the dock slot element
  const minimizedWindowElement = (showMinimizedInDock || isRestoring) && dockSlotElement
    ? createPortal(minimizedContent, dockSlotElement)
    : null;

  // If minimized (not restoring), only render the minimized element
  if (showMinimizedInDock && !isRestoring) {
    return minimizedWindowElement;
  }

  // During restore, render both minimized element (visible at dock) and Rnd (for genie animation)
  return (
    <>
      {/* During restore, show minimized window at dock position until genie takes over */}
      {isRestoring && minimizedWindowElement}
      <Rnd
        position={{ x: windowState.x, y: windowState.y }}
        size={{ width: windowState.width, height: displayHeight }}
        minWidth={windowState.minWidth ?? SACRED.windowMinWidth}
        minHeight={isShaded ? SACRED.titleBarHeight : (windowState.minHeight ?? SACRED.windowMinHeight)}
        style={{ zIndex: windowState.zIndex }}
        dragHandleClassName="window-drag-handle"
        bounds="#window-bounds"
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        onMouseDown={handleMouseDown}
        enableResizing={!isShaded && windowState.app !== 'about-this-mac' && !isMinimizingFromStore && !isRestoring}
        disableDragging={isMinimizingFromStore || isRestoring}
        resizeHandleStyles={resizeHandleStyles}
        data-testid={`window-${id}`}
      >
        <motion.div
          ref={windowRef}
          className={`${styles.window} ${isShaded ? styles.shaded : ''}`}
          data-testid="window-content"
          role="dialog"
          aria-labelledby={titleId}
          aria-modal="false"
          variants={windowVariants}
          initial="closed"
          animate={animationState}
          onAnimationComplete={handleAnimationComplete}
          onClick={handleClick}
          style={isRestoring ? {
            pointerEvents: 'none',
            // Hide window content until genie animation starts (genie creates overlay for visual)
            // This prevents flash of full window before genie takes over
            visibility: genieRestoreRunning ? 'visible' : 'hidden',
          } : undefined}
        >
          <WindowChrome
            title={title}
            titleId={titleId}
            isFocused={isFocused}
            isShaded={isShaded}
            compact={windowState.app === 'about-this-mac'}
            isPanel={windowState.app === 'about-this-mac'}
            className="window-drag-handle"
            onClose={handleClose}
            onMinimize={handleMinimize}
            onZoom={handleZoom}
            onShade={handleShade}
            onContextMenu={onTitleBarContextMenu}
          >
            {children}
          </WindowChrome>
        </motion.div>
      </Rnd>
    </>
  );
}
