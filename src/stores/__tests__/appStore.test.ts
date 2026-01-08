import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../appStore';

describe('appStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      mode: 'tiger',
      startupComplete: false,
      selectedIconId: null,
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
});
