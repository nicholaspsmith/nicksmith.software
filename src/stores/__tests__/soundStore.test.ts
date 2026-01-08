import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSoundStore } from '../soundStore';

// Mock AudioContext as a proper constructor class
class MockAudioContext {
  destination = {};
  currentTime = 0;
  createBufferSource = vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
  }));
  createOscillator = vi.fn(() => ({
    type: 'sine',
    frequency: {
      setValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }));
  createGain = vi.fn(() => ({
    gain: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
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
      startupChimePlayed: false,
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

  describe('playStartupChime', () => {
    it('should have startupChimePlayed as false initially', () => {
      expect(useSoundStore.getState().startupChimePlayed).toBe(false);
    });

    it('should play chime and set startupChimePlayed to true', () => {
      useSoundStore.getState().playStartupChime();

      expect(useSoundStore.getState().startupChimePlayed).toBe(true);
    });

    it('should create AudioContext if not initialized', () => {
      useSoundStore.getState().playStartupChime();

      expect(useSoundStore.getState().audioContext).toBeInstanceOf(MockAudioContext);
      expect(useSoundStore.getState().initialized).toBe(true);
    });

    it('should only play once per session', () => {
      useSoundStore.getState().playStartupChime();
      expect(useSoundStore.getState().startupChimePlayed).toBe(true);

      // Reset the mock to track new calls
      vi.clearAllMocks();

      // Try to play again
      useSoundStore.getState().playStartupChime();

      // AudioContext should not be created again (no new oscillators)
      const ctx = useSoundStore.getState().audioContext as unknown as MockAudioContext;
      expect(ctx.createOscillator).not.toHaveBeenCalled();
    });

    it('should create oscillators for chord notes', () => {
      useSoundStore.getState().playStartupChime();

      const ctx = useSoundStore.getState().audioContext as unknown as MockAudioContext;
      // 4 notes in the F# major chord
      expect(ctx.createOscillator).toHaveBeenCalledTimes(4);
      expect(ctx.createGain).toHaveBeenCalledTimes(4);
    });
  });
});
