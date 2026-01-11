import { useState, useEffect, useRef } from 'react';

interface ViewportSize {
  width: number;
  height: number;
}

/**
 * useViewport - Track viewport dimensions
 *
 * Returns current viewport width and height, updating on resize.
 * Uses throttling to prevent excessive re-renders during resize.
 * Used to conditionally render mobile fallback.
 */
export function useViewport(): ViewportSize {
  const [viewport, setViewport] = useState<ViewportSize>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  const throttleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleResize = () => {
      // Throttle resize events to max once per 100ms
      if (throttleTimeout.current) return;

      throttleTimeout.current = setTimeout(() => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        throttleTimeout.current = null;
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, []);

  return viewport;
}

/**
 * Breakpoint for mobile fallback (matches epics requirement of < 1024px)
 */
export const MOBILE_BREAKPOINT = 1024;
