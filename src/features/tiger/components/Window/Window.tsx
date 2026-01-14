import { useCallback, useEffect, useState, useMemo } from 'react';
import { Rnd } from 'react-rnd';
import { motion } from 'motion/react';
import { useWindowStore } from '@/stores/windowStore';
import { SACRED } from '../../constants/sacred';
import { WindowChrome } from '../WindowChrome';
import { windowVariants } from '@/animations/aqua';
import styles from './Window.module.css';

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
 * Uses motion for open/close/minimize animations.
 *
 * Animation lifecycle:
 * - Mount: closed → opening → open
 * - Close: open → closing → (removed from DOM)
 * - Minimize: open → minimizing (genie effect) → (hidden, thumbnail in dock)
 */
export function Window({ id, title, children, isStartupWindow = false, onTitleBarContextMenu }: WindowProps) {
  // ============================================
  // ALL HOOKS MUST BE CALLED BEFORE ANY RETURN
  // ============================================

  const windowState = useWindowStore((s) => s.windows.find((w) => w.id === id));
  const windows = useWindowStore((s) => s.windows);
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const updateSize = useWindowStore((s) => s.updateSize);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindowAction = useWindowStore((s) => s.minimizeWindow);
  const zoomWindow = useWindowStore((s) => s.zoomWindow);
  const shadeWindow = useWindowStore((s) => s.shadeWindow);
  const clearRestoredFlag = useWindowStore((s) => s.clearRestoredFlag);

  // Animation state: starts as 'opening' (or 'startupOpening' for startup window)
  const [animationState, setAnimationState] = useState<'opening' | 'startupOpening' | 'open' | 'closing' | 'minimizing' | 'restoring'>(
    isStartupWindow ? 'startupOpening' : 'opening'
  );

  // Track dock target position for minimize animation
  const [dockTarget, setDockTarget] = useState<{ x: number; y: number } | null>(null);

  // Calculate minimized window index for dock position
  const minimizedCount = useMemo(
    () => windows.filter((w) => w.state === 'minimized').length,
    [windows]
  );

  const isFocused = activeWindowId === id;

  // Detect when window is restored from minimized and trigger restore animation
  useEffect(() => {
    if (windowState?.restoredFromMinimized) {
      setAnimationState('restoring');
    }
  }, [windowState?.restoredFromMinimized]);

  // Calculate animation value for genie effect
  const animateValue = useMemo(() => {
    if (animationState === 'minimizing' && dockTarget && windowState) {
      // Calculate where the window needs to move to reach the dock
      // Window bottom center needs to reach dockTarget
      const windowBottomY = windowState.y + windowState.height;
      const windowCenterX = windowState.x + windowState.width / 2;

      const deltaX = dockTarget.x - windowCenterX;
      const deltaY = dockTarget.y - windowBottomY;

      // Genie effect: scale down while moving to dock
      // The window shrinks horizontally more than vertically for the genie look
      return {
        scaleX: [1, 0.5, 0.15, 0.08],
        scaleY: [1, 0.6, 0.3, 0.08],
        x: [0, deltaX * 0.3, deltaX * 0.7, deltaX],
        y: [0, deltaY * 0.4, deltaY * 0.8, deltaY],
        opacity: [1, 1, 0.8, 0],
        transition: {
          duration: 0.5,
          times: [0, 0.3, 0.7, 1],
          ease: 'easeInOut' as const,
        },
      };
    }

    if (animationState === 'restoring' && dockTarget && windowState) {
      // Restore from dock: expand back to position
      return {
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.4,
          ease: 'easeOut' as const,
        },
      };
    }

    // Use variant name for other states (opening, open, closing)
    return animationState;
  }, [animationState, dockTarget, windowState]);

  // ALL useCallback hooks must be before any conditional return
  const handleDragStop = useCallback(
    (_e: unknown, d: { x: number; y: number }) => {
      // Clamp y position to not go above menu bar (safety net)
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
    // Don't focus window when interacting with resize handles
    // This allows resizing inactive windows without changing focus
    // Resize handles have cursor styles containing 'resize' and very high z-index
    const target = e.target as HTMLElement;
    const style = window.getComputedStyle(target);
    if (style.cursor.includes('resize') && style.zIndex === '9999') {
      return;
    }
    focusWindow(id);
  }, [id, focusWindow]);

  // Stop click propagation to prevent Desktop from clearing focus
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleClose = useCallback(() => {
    setAnimationState('closing');
  }, []);

  const handleMinimize = useCallback(() => {
    // Calculate dock target position for genie effect
    if (windowState) {
      const dockHeight = SACRED.dockHeight;
      // Calculate the dock position (centered dock, thumbnail area)
      const thumbnailWidth = 66;
      const baseOffset = 163;
      const targetX = window.innerWidth / 2 + baseOffset + (minimizedCount * thumbnailWidth);
      const targetY = window.innerHeight - dockHeight / 2;
      setDockTarget({ x: targetX, y: targetY });

      // Update store IMMEDIATELY so dock grows right away
      minimizeWindowAction(id);

      // Start genie animation (window continues rendering during animation)
      setAnimationState('minimizing');
    }
  }, [windowState, minimizedCount, minimizeWindowAction, id]);

  const handleZoom = useCallback(() => {
    zoomWindow(id);
  }, [id, zoomWindow]);

  const handleShade = useCallback(() => {
    shadeWindow(id);
  }, [id, shadeWindow]);

  const handleAnimationComplete = useCallback(() => {
    if (animationState === 'opening' || animationState === 'startupOpening') {
      // Transition to stable 'open' state after opening animation
      setAnimationState('open');
    } else if (animationState === 'restoring') {
      // Transition to stable 'open' state after restore animation, clear the flag
      setAnimationState('open');
      clearRestoredFlag(id);
    } else if (animationState === 'closing') {
      closeWindow(id);
    } else if (animationState === 'minimizing') {
      // Genie animation complete - window is now hidden
      // Reset to 'open' so next time we render it starts fresh
      setAnimationState('open');
      setDockTarget(null);
    }
  }, [animationState, id, closeWindow, clearRestoredFlag]);

  // Listen for keyboard shortcut events to trigger animations
  useEffect(() => {
    // Skip in test environment where window may not have addEventListener
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

  // ============================================
  // EARLY RETURNS MUST COME AFTER ALL HOOKS
  // ============================================

  // Don't render if window not found or minimized (but keep rendering during minimize animation)
  if (!windowState || (windowState.state === 'minimized' && animationState !== 'minimizing')) {
    return null;
  }

  const titleId = `window-title-${id}`;
  const isShaded = windowState.isShaded;

  // When shaded, collapse to just title bar height
  const displayHeight = isShaded ? SACRED.titleBarHeight : windowState.height;

  // Resize handle styles with proper z-index and size for all corners/edges
  // Uses official Tiger resize cursors from CSS variables
  // Finder windows have larger bottom-right to cover the visual resize grip
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

  return (
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
      enableResizing={!isShaded && windowState.app !== 'about-this-mac'}
      resizeHandleStyles={resizeHandleStyles}
      data-testid={`window-${id}`}
    >
      <motion.div
        className={`${styles.window} ${isShaded ? styles.shaded : ''}`}
        data-testid="window-content"
        role="dialog"
        aria-labelledby={titleId}
        aria-modal="false"
        variants={windowVariants}
        initial={animationState === 'restoring' ? 'minimized' : 'closed'}
        animate={animateValue}
        onAnimationComplete={handleAnimationComplete}
        onClick={handleClick}
        style={
          animationState === 'minimizing' || animationState === 'restoring'
            ? { originY: 1, originX: 0.5, pointerEvents: 'none' }
            : undefined
        }
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
  );
}
