import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from '../appStore';

describe('appStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      mode: 'tiger',
      startupComplete: false,
      selectedIconId: null,
      alertOpen: false,
      alertConfig: null,
    });
  });

  describe('initial state', () => {
    it('should have mode set to tiger', () => {
      expect(useAppStore.getState().mode).toBe('tiger');
    });

    it('should have startupComplete as false', () => {
      expect(useAppStore.getState().startupComplete).toBe(false);
    });

    it('should have no icon selected', () => {
      expect(useAppStore.getState().selectedIconId).toBeNull();
    });
  });

  describe('setMode', () => {
    it('should change mode to ios', () => {
      useAppStore.getState().setMode('ios');
      expect(useAppStore.getState().mode).toBe('ios');
    });

    it('should change mode back to tiger', () => {
      useAppStore.getState().setMode('ios');
      useAppStore.getState().setMode('tiger');
      expect(useAppStore.getState().mode).toBe('tiger');
    });
  });

  describe('completeStartup', () => {
    it('should set startupComplete to true', () => {
      useAppStore.getState().completeStartup();
      expect(useAppStore.getState().startupComplete).toBe(true);
    });

    it('should remain true after multiple calls', () => {
      useAppStore.getState().completeStartup();
      useAppStore.getState().completeStartup();
      expect(useAppStore.getState().startupComplete).toBe(true);
    });
  });

  describe('selectIcon', () => {
    it('should select an icon by id', () => {
      useAppStore.getState().selectIcon('resume');
      expect(useAppStore.getState().selectedIconId).toBe('resume');
    });

    it('should change selection when selecting a different icon', () => {
      useAppStore.getState().selectIcon('resume');
      useAppStore.getState().selectIcon('projects');
      expect(useAppStore.getState().selectedIconId).toBe('projects');
    });
  });

  describe('clearSelection', () => {
    it('should clear the selected icon', () => {
      useAppStore.getState().selectIcon('resume');
      useAppStore.getState().clearSelection();
      expect(useAppStore.getState().selectedIconId).toBeNull();
    });

    it('should be safe to call when nothing is selected', () => {
      useAppStore.getState().clearSelection();
      expect(useAppStore.getState().selectedIconId).toBeNull();
    });
  });

  describe('alert dialog state', () => {
    it('should have alertOpen as false initially', () => {
      expect(useAppStore.getState().alertOpen).toBe(false);
    });

    it('should have alertConfig as null initially', () => {
      expect(useAppStore.getState().alertConfig).toBeNull();
    });
  });

  describe('showAlert', () => {
    it('should set alertOpen to true', () => {
      useAppStore.getState().showAlert({
        title: 'Test',
        message: 'Test message',
      });
      expect(useAppStore.getState().alertOpen).toBe(true);
    });

    it('should set alertConfig with provided values', () => {
      const config = {
        title: 'Test Title',
        message: 'Test message',
        type: 'caution' as const,
      };
      useAppStore.getState().showAlert(config);
      expect(useAppStore.getState().alertConfig).toEqual(config);
    });

    it('should store onOk callback', () => {
      const onOk = vi.fn();
      useAppStore.getState().showAlert({
        title: 'Test',
        message: 'Test',
        onOk,
      });
      expect(useAppStore.getState().alertConfig?.onOk).toBe(onOk);
    });
  });

  describe('hideAlert', () => {
    it('should set alertOpen to false', () => {
      useAppStore.getState().showAlert({
        title: 'Test',
        message: 'Test',
      });
      useAppStore.getState().hideAlert();
      expect(useAppStore.getState().alertOpen).toBe(false);
    });

    it('should set alertConfig to null', () => {
      useAppStore.getState().showAlert({
        title: 'Test',
        message: 'Test',
      });
      useAppStore.getState().hideAlert();
      expect(useAppStore.getState().alertConfig).toBeNull();
    });

    it('should call onOk callback when hiding', () => {
      const onOk = vi.fn();
      useAppStore.getState().showAlert({
        title: 'Test',
        message: 'Test',
        onOk,
      });
      useAppStore.getState().hideAlert();
      expect(onOk).toHaveBeenCalledTimes(1);
    });

    it('should be safe to call when no alert is shown', () => {
      useAppStore.getState().hideAlert();
      expect(useAppStore.getState().alertOpen).toBe(false);
    });
  });
});
