import { useState, useEffect } from 'react';

/**
 * useReducedMotion - Detects user's reduced motion preference
 *
 * Returns true if the user has requested reduced motion via their OS settings.
 * This should be used to disable or simplify animations for accessibility.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Check initial value
    if (typeof window === 'undefined') return false;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    return query.matches;
  });

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Listen for changes
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
