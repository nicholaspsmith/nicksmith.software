import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../appStore';

describe('appStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      mode: 'tiger',
      startupComplete: false,
    });
  });

  describe('initial state', () => {
    it('should have mode set to tiger', () => {
      expect(useAppStore.getState().mode).toBe('tiger');
    });

    it('should have startupComplete as false', () => {
      expect(useAppStore.getState().startupComplete).toBe(false);
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
});
