import { useCallback, useEffect, useState } from 'react';
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
 * - Minimize: open → minimizing → (hidden)
 */
export function Window({ id, title, children }: WindowProps) {
  const windowState = useWindowStore((s) => s.windows.find((w) => w.id === id));
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const updateSize = useWindowStore((s) => s.updateSize);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const zoomWindow = useWindowStore((s) => s.zoomWindow);
  const shadeWindow = useWindowStore((s) => s.shadeWindow);
  const clearRestoredFlag = useWindowStore((s) => s.clearRestoredFlag);

  // Animation state: starts as 'opening' for new windows
  const [animationState, setAnimationState] = useState<'opening' | 'open' | 'closing' | 'minimizing' | 'restoring'>('opening');

  const isFocused = activeWindowId === id;

  // Detect when window is restored from minimized and trigger restore animation
  useEffect(() => {
    if (windowState?.restoredFromMinimized) {
      setAnimationState('restoring');
    }
  }, [windowState?.restoredFromMinimized]);

  const handleDragStop = useCallback(
    (_e: unknown, d: { x: number; y: number }) => {
      updatePosition(id, d.x, d.y);
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

  const handleMouseDown = useCallback(() => {
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
    setAnimationState('minimizing');
  }, []);

  const handleZoom = useCallback(() => {
    zoomWindow(id);
  }, [id, zoomWindow]);

  const handleShade = useCallback(() => {
    shadeWindow(id);
  }, [id, shadeWindow]);

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

  const handleAnimationComplete = useCallback(() => {
    if (animationState === 'opening') {
      // Transition to stable 'open' state after opening animation
      setAnimationState('open');
    } else if (animationState === 'restoring') {
      // Transition to stable 'open' state after restore animation, clear the flag
      setAnimationState('open');
      clearRestoredFlag(id);
    } else if (animationState === 'closing') {
      closeWindow(id);
    } else if (animationState === 'minimizing') {
      minimizeWindow(id);
    }
  }, [animationState, id, closeWindow, minimizeWindow, clearRestoredFlag]);

  // Don't render if window not found or minimized
  if (!windowState || windowState.state === 'minimized') {
    return null;
  }

  const titleId = `window-title-${id}`;
  const isShaded = windowState.isShaded;

  // When shaded, collapse to just title bar height
  const displayHeight = isShaded ? SACRED.titleBarHeight : windowState.height;

  return (
    <Rnd
      position={{ x: windowState.x, y: windowState.y }}
      size={{ width: windowState.width, height: displayHeight }}
      minWidth={SACRED.windowMinWidth}
      minHeight={isShaded ? SACRED.titleBarHeight : SACRED.windowMinHeight}
      style={{ zIndex: windowState.zIndex }}
      dragHandleClassName={styles.dragHandle}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onMouseDown={handleMouseDown}
      enableResizing={!isShaded}
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
        animate={animationState}
        onAnimationComplete={handleAnimationComplete}
        onClick={handleClick}
      >
        <WindowChrome
          title={title}
          titleId={titleId}
          isFocused={isFocused}
          isShaded={isShaded}
          className={styles.dragHandle}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onZoom={handleZoom}
          onShade={handleShade}
        >
          {children}
        </WindowChrome>
      </motion.div>
    </Rnd>
  );
}
