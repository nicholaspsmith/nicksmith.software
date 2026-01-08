import { useState, useEffect } from 'react';

interface ViewportSize {
  width: number;
  height: number;
}

/**
 * useViewport - Track viewport dimensions
 *
 * Returns current viewport width and height, updating on resize.
 * Used to conditionally render mobile fallback.
 */
export function useViewport(): ViewportSize {
  const [viewport, setViewport] = useState<ViewportSize>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}

/**
 * Breakpoint for mobile fallback (matches epics requirement of < 1024px)
 */
export const MOBILE_BREAKPOINT = 1024;
