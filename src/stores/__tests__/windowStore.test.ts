import { describe, it, expect, beforeEach } from 'vitest';
import { useWindowStore } from '../windowStore';

describe('windowStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useWindowStore.setState({
      windows: [],
      activeWindowId: null,
      maxZIndex: 0,
    });
  });

  describe('initial state', () => {
    it('should have empty windows array', () => {
      expect(useWindowStore.getState().windows).toHaveLength(0);
    });

    it('should have null activeWindowId', () => {
      expect(useWindowStore.getState().activeWindowId).toBeNull();
    });

    it('should have maxZIndex of 0', () => {
      expect(useWindowStore.getState().maxZIndex).toBe(0);
    });
  });

  describe('openWindow', () => {
    it('should open a new window and return its id', () => {
      const id = useWindowStore.getState().openWindow('About');
      const state = useWindowStore.getState();

      expect(state.windows).toHaveLength(1);
      expect(state.windows[0].app).toBe('About');
      expect(state.windows[0].id).toBe(id);
      expect(state.windows[0].state).toBe('open');
    });

    it('should set activeWindowId to new window', () => {
      const id = useWindowStore.getState().openWindow('About');
      expect(useWindowStore.getState().activeWindowId).toBe(id);
    });

    it('should increment maxZIndex', () => {
      useWindowStore.getState().openWindow('About');
      expect(useWindowStore.getState().maxZIndex).toBe(1);

      useWindowStore.getState().openWindow('Projects');
      expect(useWindowStore.getState().maxZIndex).toBe(2);
    });

    it('should cascade window positions', () => {
      useWindowStore.getState().openWindow('About');
      useWindowStore.getState().openWindow('Projects');
      const state = useWindowStore.getState();

      expect(state.windows[0].x).toBe(100);
      expect(state.windows[0].y).toBe(100);
      expect(state.windows[1].x).toBe(130);
      expect(state.windows[1].y).toBe(130);
    });

    it('should use app name as default title', () => {
      useWindowStore.getState().openWindow('About');
      expect(useWindowStore.getState().windows[0].title).toBe('About');
    });
  });

  describe('closeWindow', () => {
    it('should remove window from array', () => {
      const id = useWindowStore.getState().openWindow('About');
      useWindowStore.getState().closeWindow(id);

      expect(useWindowStore.getState().windows).toHaveLength(0);
    });

    it('should clear activeWindowId if closing active window', () => {
      const id = useWindowStore.getState().openWindow('About');
      useWindowStore.getState().closeWindow(id);

      expect(useWindowStore.getState().activeWindowId).toBeNull();
    });

    it('should preserve activeWindowId if closing different window', () => {
      const id1 = useWindowStore.getState().openWindow('About');
      const id2 = useWindowStore.getState().openWindow('Projects');
      useWindowStore.getState().closeWindow(id1);

      expect(useWindowStore.getState().activeWindowId).toBe(id2);
    });
  });

  describe('focusWindow', () => {
    it('should set activeWindowId', () => {
      const id1 = useWindowStore.getState().openWindow('About');
      useWindowStore.getState().openWindow('Projects');
      useWindowStore.getState().focusWindow(id1);

      expect(useWindowStore.getState().activeWindowId).toBe(id1);
    });

    it('should bump window zIndex', () => {
      const id1 = useWindowStore.getState().openWindow('About');
      useWindowStore.getState().openWindow('Projects');
      useWindowStore.getState().focusWindow(id1);

      const state = useWindowStore.getState();
      const window1 = state.windows.find(w => w.id === id1);
      expect(window1?.zIndex).toBe(3);
    });

    it('should increment maxZIndex', () => {
      useWindowStore.getState().openWindow('About');
      useWindowStore.getState().openWindow('Projects');
      const id1 = useWindowStore.getState().windows[0].id;
      useWindowStore.getState().focusWindow(id1);

      expect(useWindowStore.getState().maxZIndex).toBe(3);
    });
  });

  describe('minimizeWindow', () => {
    it('should set window state to minimized', () => {
      const id = useWindowStore.getState().openWindow('About');
      useWindowStore.getState().minimizeWindow(id);

      const window = useWindowStore.getState().windows.find(w => w.id === id);
      expect(window?.state).toBe('minimized');
    });

    it('should clear activeWindowId if minimizing active window', () => {
      const id = useWindowStore.getState().openWindow('About');
      useWindowStore.getState().minimizeWindow(id);

      expect(useWindowStore.getState().activeWindowId).toBeNull();
    });
  });

  describe('restoreWindow', () => {
    it('should set window state to open', () => {
      const id = useWindowStore.getState().openWindow('About');
      useWindowStore.getState().minimizeWindow(id);
      useWindowStore.getState().restoreWindow(id);

      const window = useWindowStore.getState().windows.find(w => w.id === id);
      expect(window?.state).toBe('open');
    });

    it('should set activeWindowId to restored window', () => {
      const id = useWindowStore.getState().openWindow('About');
      useWindowStore.getState().minimizeWindow(id);
      useWindowStore.getState().restoreWindow(id);

      expect(useWindowStore.getState().activeWindowId).toBe(id);
    });

    it('should bump zIndex on restore', () => {
      const id = useWindowStore.getState().openWindow('About');
      useWindowStore.getState().minimizeWindow(id);
      useWindowStore.getState().restoreWindow(id);

      const window = useWindowStore.getState().windows.find(w => w.id === id);
      expect(window?.zIndex).toBe(2);
    });
  });

  describe('updatePosition', () => {
    it('should update window x and y coordinates', () => {
      const id = useWindowStore.getState().openWindow('About');
      useWindowStore.getState().updatePosition(id, 200, 300);

      const window = useWindowStore.getState().windows.find(w => w.id === id);
      expect(window?.x).toBe(200);
      expect(window?.y).toBe(300);
    });
  });

  describe('updateSize', () => {
    it('should update window width and height', () => {
      const id = useWindowStore.getState().openWindow('About');
      useWindowStore.getState().updateSize(id, 800, 600);

      const window = useWindowStore.getState().windows.find(w => w.id === id);
      expect(window?.width).toBe(800);
      expect(window?.height).toBe(600);
    });
  });
});
