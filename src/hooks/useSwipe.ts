import { useRef, useCallback } from 'react';

export interface SwipeCallbacks {
  /** Called when user swipes left */
  onSwipeLeft?: () => void;
  /** Called when user swipes right */
  onSwipeRight?: () => void;
  /** Called when user swipes up */
  onSwipeUp?: () => void;
  /** Called when user swipes down */
  onSwipeDown?: () => void;
}

export interface SwipeConfig {
  /** Minimum distance in pixels to trigger a swipe (default: 50) */
  threshold?: number;
  /** Whether to prevent default touch behavior (default: false) */
  preventDefault?: boolean;
}

export interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

/**
 * useSwipe - Hook for detecting swipe gestures
 *
 * Returns touch event handlers that detect swipe direction.
 * Useful for implementing iOS-style page navigation.
 *
 * @example
 * const swipeHandlers = useSwipe({
 *   onSwipeLeft: () => setPage(p => p + 1),
 *   onSwipeRight: () => setPage(p => p - 1),
 * });
 *
 * return <div {...swipeHandlers}>Content</div>;
 */
export function useSwipe(
  callbacks: SwipeCallbacks,
  config: SwipeConfig = {}
): SwipeHandlers {
  const { threshold = 50, preventDefault = false } = config;

  // Store touch start position
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 1) return; // Single touch only

      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };

      if (preventDefault) {
        e.preventDefault();
      }
    },
    [preventDefault]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      if (e.changedTouches.length !== 1) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // Reset touch start
      touchStartRef.current = null;

      // Determine if this was a horizontal or vertical swipe
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Must exceed threshold and be predominantly in one direction
      if (absX > absY && absX >= threshold) {
        // Horizontal swipe
        if (deltaX > 0) {
          callbacks.onSwipeRight?.();
        } else {
          callbacks.onSwipeLeft?.();
        }
      } else if (absY > absX && absY >= threshold) {
        // Vertical swipe
        if (deltaY > 0) {
          callbacks.onSwipeDown?.();
        } else {
          callbacks.onSwipeUp?.();
        }
      }
    },
    [callbacks, threshold]
  );

  return { onTouchStart, onTouchEnd };
}
