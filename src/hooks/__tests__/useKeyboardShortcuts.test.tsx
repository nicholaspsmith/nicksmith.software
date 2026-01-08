import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';
import { useWindowStore } from '@/stores/windowStore';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    // Reset store state
    useWindowStore.setState({
      windows: [],
      activeWindowId: null,
      maxZIndex: 0,
    });
  });

  it('closes active window on Cmd+W', () => {
    // Open a window first
    const windowId = useWindowStore.getState().openWindow('test');

    renderHook(() => useKeyboardShortcuts());

    // Simulate Cmd+W
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'w',
        metaKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    // Window should be removed
    const windows = useWindowStore.getState().windows;
    expect(windows.find((w) => w.id === windowId)).toBeUndefined();
  });

  it('minimizes active window on Cmd+M', () => {
    // Open a window first
    const windowId = useWindowStore.getState().openWindow('test');

    renderHook(() => useKeyboardShortcuts());

    // Simulate Cmd+M
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'm',
        metaKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    // Window should be minimized
    const targetWindow = useWindowStore.getState().windows.find((w) => w.id === windowId);
    expect(targetWindow?.state).toBe('minimized');
  });

  it('does nothing when no window is focused', () => {
    const closeWindow = vi.spyOn(useWindowStore.getState(), 'closeWindow');

    renderHook(() => useKeyboardShortcuts());

    // Simulate Cmd+W with no active window
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'w',
        metaKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(closeWindow).not.toHaveBeenCalled();
  });

  it('prevents default browser behavior', () => {
    useWindowStore.getState().openWindow('test');

    renderHook(() => useKeyboardShortcuts());

    // Simulate Cmd+W and check preventDefault was called
    let defaultPrevented = false;
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'w',
        metaKey: true,
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'preventDefault', {
        value: () => { defaultPrevented = true; },
      });
      window.dispatchEvent(event);
    });

    expect(defaultPrevented).toBe(true);
  });

  it('works with Ctrl key for Windows/Linux', () => {
    const windowId = useWindowStore.getState().openWindow('test');

    renderHook(() => useKeyboardShortcuts());

    // Simulate Ctrl+W (Windows/Linux)
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'w',
        ctrlKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    const windows = useWindowStore.getState().windows;
    expect(windows.find((w) => w.id === windowId)).toBeUndefined();
  });

  it('ignores shortcuts without meta/ctrl key', () => {
    useWindowStore.getState().openWindow('test');
    const initialWindowCount = useWindowStore.getState().windows.length;

    renderHook(() => useKeyboardShortcuts());

    // Simulate W without modifier
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'w',
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(useWindowStore.getState().windows.length).toBe(initialWindowCount);
  });
});
