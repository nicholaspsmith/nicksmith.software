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

  // Animation state: starts as 'opening' to trigger the open animation
  const [animationState, setAnimationState] = useState<'opening' | 'open' | 'closing' | 'minimizing'>('opening');

  const isFocused = activeWindowId === id;

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

  const handleClose = useCallback(() => {
    setAnimationState('closing');
  }, []);

  const handleMinimize = useCallback(() => {
    setAnimationState('minimizing');
  }, []);

  const handleZoom = useCallback(() => {
    zoomWindow(id);
  }, [id, zoomWindow]);

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
    } else if (animationState === 'closing') {
      closeWindow(id);
    } else if (animationState === 'minimizing') {
      minimizeWindow(id);
      setAnimationState('opening'); // Reset for when restored (will re-animate in)
    }
  }, [animationState, id, closeWindow, minimizeWindow]);

  // Don't render if window not found or minimized
  if (!windowState || windowState.state === 'minimized') {
    return null;
  }

  const titleId = `window-title-${id}`;

  return (
    <Rnd
      position={{ x: windowState.x, y: windowState.y }}
      size={{ width: windowState.width, height: windowState.height }}
      minWidth={SACRED.windowMinWidth}
      minHeight={SACRED.windowMinHeight}
      style={{ zIndex: windowState.zIndex }}
      dragHandleClassName={styles.dragHandle}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onMouseDown={handleMouseDown}
      data-testid={`window-${id}`}
    >
      <motion.div
        className={styles.window}
        data-testid="window-content"
        role="dialog"
        aria-labelledby={titleId}
        aria-modal="false"
        variants={windowVariants}
        initial="closed"
        animate={animationState}
        onAnimationComplete={handleAnimationComplete}
      >
        <WindowChrome
          title={title}
          titleId={titleId}
          isFocused={isFocused}
          className={styles.dragHandle}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onZoom={handleZoom}
        >
          {children}
        </WindowChrome>
      </motion.div>
    </Rnd>
  );
}
