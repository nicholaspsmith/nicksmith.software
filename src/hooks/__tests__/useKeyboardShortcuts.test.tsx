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

  it('dispatches window-close-request event on Cmd+W', () => {
    // Open a window first
    const windowId = useWindowStore.getState().openWindow('test');

    const eventHandler = vi.fn();
    window.addEventListener('window-close-request', eventHandler);

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

    // Event should be dispatched with correct windowId
    expect(eventHandler).toHaveBeenCalledTimes(1);
    const detail = (eventHandler.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.windowId).toBe(windowId);

    window.removeEventListener('window-close-request', eventHandler);
  });

  it('dispatches window-minimize-request event on Cmd+M', () => {
    // Open a window first
    const windowId = useWindowStore.getState().openWindow('test');

    const eventHandler = vi.fn();
    window.addEventListener('window-minimize-request', eventHandler);

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

    // Event should be dispatched with correct windowId
    expect(eventHandler).toHaveBeenCalledTimes(1);
    const detail = (eventHandler.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.windowId).toBe(windowId);

    window.removeEventListener('window-minimize-request', eventHandler);
  });

  it('does nothing when no window is focused', () => {
    const closeHandler = vi.fn();
    const minimizeHandler = vi.fn();
    window.addEventListener('window-close-request', closeHandler);
    window.addEventListener('window-minimize-request', minimizeHandler);

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

    expect(closeHandler).not.toHaveBeenCalled();
    expect(minimizeHandler).not.toHaveBeenCalled();

    window.removeEventListener('window-close-request', closeHandler);
    window.removeEventListener('window-minimize-request', minimizeHandler);
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

    const eventHandler = vi.fn();
    window.addEventListener('window-close-request', eventHandler);

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

    expect(eventHandler).toHaveBeenCalledTimes(1);
    const detail = (eventHandler.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.windowId).toBe(windowId);

    window.removeEventListener('window-close-request', eventHandler);
  });

  it('ignores shortcuts without meta/ctrl key', () => {
    useWindowStore.getState().openWindow('test');

    const eventHandler = vi.fn();
    window.addEventListener('window-close-request', eventHandler);

    renderHook(() => useKeyboardShortcuts());

    // Simulate W without modifier
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'w',
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(eventHandler).not.toHaveBeenCalled();

    window.removeEventListener('window-close-request', eventHandler);
  });
});
