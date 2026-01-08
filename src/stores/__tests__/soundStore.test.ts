import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSoundStore } from '../soundStore';

// Mock AudioContext as a proper constructor class
class MockAudioContext {
  destination = {};
  createBufferSource = vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
  }));
}

vi.stubGlobal('AudioContext', MockAudioContext);

describe('soundStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useSoundStore.setState({
      audioContext: null,
      buffers: new Map(),
      initialized: false,
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have null audioContext', () => {
      expect(useSoundStore.getState().audioContext).toBeNull();
    });

    it('should have empty buffers map', () => {
      expect(useSoundStore.getState().buffers.size).toBe(0);
    });

    it('should have initialized as false', () => {
      expect(useSoundStore.getState().initialized).toBe(false);
    });
  });

  describe('initialize', () => {
    it('should create AudioContext', async () => {
      await useSoundStore.getState().initialize();

      expect(useSoundStore.getState().audioContext).toBeInstanceOf(MockAudioContext);
    });

    it('should set initialized to true', async () => {
      await useSoundStore.getState().initialize();

      expect(useSoundStore.getState().initialized).toBe(true);
    });
  });

  describe('play', () => {
    it('should not play if audioContext is null', () => {
      useSoundStore.getState().play('startup');

      // No way to verify since audioContext is null
      expect(useSoundStore.getState().audioContext).toBeNull();
    });

    it('should not play if buffer does not exist', async () => {
      await useSoundStore.getState().initialize();
      const ctx = useSoundStore.getState().audioContext as unknown as MockAudioContext;

      useSoundStore.getState().play('nonexistent');

      expect(ctx.createBufferSource).not.toHaveBeenCalled();
    });

    it('should play sound from buffer', async () => {
      await useSoundStore.getState().initialize();
      const ctx = useSoundStore.getState().audioContext as unknown as MockAudioContext;

      // Manually add a buffer for testing
      const mockBuffer = {} as AudioBuffer;
      useSoundStore.getState().buffers.set('startup', mockBuffer);

      useSoundStore.getState().play('startup');

      expect(ctx.createBufferSource).toHaveBeenCalled();
    });
  });
});
