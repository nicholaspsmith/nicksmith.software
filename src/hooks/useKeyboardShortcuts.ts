import { useEffect } from 'react';
import { useWindowStore } from '@/stores/windowStore';

/**
 * useKeyboardShortcuts - Tiger keyboard shortcuts hook
 *
 * Implements Mac-native shortcuts:
 * - ⌘W (Cmd+W): Close focused window
 * - ⌘M (Cmd+M): Minimize focused window
 *
 * Shortcuts only activate when a window is focused.
 * Browser defaults are prevented to avoid closing browser tabs.
 */
export function useKeyboardShortcuts(): void {
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const windows = useWindowStore((s) => s.windows);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Only handle if a window is focused
      if (!activeWindowId) return;

      // Check for Cmd (Mac) or Ctrl (Windows/Linux)
      const isMeta = e.metaKey || e.ctrlKey;
      if (!isMeta) return;

      // Find the active window
      const activeWindow = windows.find((w) => w.id === activeWindowId);
      if (!activeWindow || activeWindow.state !== 'open') return;

      const key = e.key.toLowerCase();

      if (key === 'w') {
        // ⌘W - Close window
        e.preventDefault();
        // Get fresh reference to avoid stale closure
        useWindowStore.getState().closeWindow(activeWindowId);
      } else if (key === 'm') {
        // ⌘M - Minimize window
        e.preventDefault();
        useWindowStore.getState().minimizeWindow(activeWindowId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindowId, windows]);
}
