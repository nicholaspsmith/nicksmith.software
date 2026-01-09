import { describe, it, expect } from 'vitest';
import {
  windowVariants,
  iconVariants,
  menuVariants,
  fadeVariants,
} from '../aqua';
import type {
  WindowAnimationState,
  IconAnimationState,
  MenuAnimationState,
  FadeAnimationState,
} from '../aqua';

describe('Animation Variants', () => {
  describe('windowVariants', () => {
    it('should have all required states', () => {
      const expectedStates: WindowAnimationState[] = [
        'closed',
        'opening',
        'open',
        'minimizing',
        'minimized',
        'restoring',
      ];

      expectedStates.forEach((state) => {
        expect(windowVariants[state]).toBeDefined();
      });
    });

    it('should use only GPU-accelerated properties', () => {
      // All transform properties are GPU-accelerated: scale, scaleX, scaleY, x, y, rotate
      const gpuSafeProps = ['opacity', 'scale', 'scaleX', 'scaleY', 'x', 'y', 'rotate', 'transition'];

      Object.entries(windowVariants).forEach(([, variant]) => {
        if (typeof variant === 'object' && variant !== null) {
          Object.keys(variant).forEach((prop) => {
            expect(gpuSafeProps).toContain(prop);
          });
        }
      });
    });

    it('should have correct closed state', () => {
      expect(windowVariants.closed).toEqual({
        opacity: 0,
        scale: 0.8,
      });
    });

    it('should have correct open state', () => {
      expect(windowVariants.open).toEqual({
        opacity: 1,
        scale: 1,
      });
    });

    it('should have opening transition around 200ms', () => {
      const opening = windowVariants.opening as Record<string, unknown>;
      const transition = opening.transition as { duration: number };
      expect(transition.duration).toBeCloseTo(0.2, 1);
    });

    it('should have minimizing transition around 400ms', () => {
      // Genie effect needs a longer duration for the "suction" feel
      const minimizing = windowVariants.minimizing as Record<string, unknown>;
      const transition = minimizing.transition as { duration: number };
      expect(transition.duration).toBeCloseTo(0.4, 1);
    });

    it('should have restoring transition around 350ms', () => {
      // Reverse genie effect - snappy restore
      const restoring = windowVariants.restoring as Record<string, unknown>;
      const transition = restoring.transition as { duration: number };
      expect(transition.duration).toBeCloseTo(0.35, 2);
    });
  });

  describe('iconVariants', () => {
    it('should have all required states', () => {
      const expectedStates: IconAnimationState[] = ['idle', 'hover', 'active'];

      expectedStates.forEach((state) => {
        expect(iconVariants[state]).toBeDefined();
      });
    });

    it('should use only GPU-accelerated properties', () => {
      const gpuSafeProps = ['opacity', 'scale', 'x', 'y', 'rotate', 'transition'];

      Object.entries(iconVariants).forEach(([, variant]) => {
        if (typeof variant === 'object' && variant !== null) {
          Object.keys(variant).forEach((prop) => {
            expect(gpuSafeProps).toContain(prop);
          });
        }
      });
    });

    it('should have idle at scale 1', () => {
      expect(iconVariants.idle).toEqual({ scale: 1 });
    });

    it('should have hover scale equal to 1 (no zoom - Tiger behavior)', () => {
      const hover = iconVariants.hover as { scale: number };
      expect(hover.scale).toBe(1);
    });

    it('should have active scale equal to 1 (no shrink - Tiger behavior)', () => {
      const active = iconVariants.active as { scale: number };
      expect(active.scale).toBe(1);
    });
  });

  describe('menuVariants', () => {
    it('should have all required states', () => {
      const expectedStates: MenuAnimationState[] = ['closed', 'open'];

      expectedStates.forEach((state) => {
        expect(menuVariants[state]).toBeDefined();
      });
    });

    it('should use only GPU-accelerated properties', () => {
      const gpuSafeProps = ['opacity', 'scale', 'x', 'y', 'rotate', 'transition'];

      Object.entries(menuVariants).forEach(([, variant]) => {
        if (typeof variant === 'object' && variant !== null) {
          Object.keys(variant).forEach((prop) => {
            expect(gpuSafeProps).toContain(prop);
          });
        }
      });
    });

    it('should have closed state with opacity 0', () => {
      const closed = menuVariants.closed as { opacity: number };
      expect(closed.opacity).toBe(0);
    });

    it('should have open state with opacity 1', () => {
      const open = menuVariants.open as { opacity: number };
      expect(open.opacity).toBe(1);
    });
  });

  describe('fadeVariants', () => {
    it('should have all required states', () => {
      const expectedStates: FadeAnimationState[] = ['hidden', 'visible'];

      expectedStates.forEach((state) => {
        expect(fadeVariants[state]).toBeDefined();
      });
    });

    it('should have hidden state with opacity 0', () => {
      const hidden = fadeVariants.hidden as { opacity: number };
      expect(hidden.opacity).toBe(0);
    });

    it('should have visible state with opacity 1', () => {
      const visible = fadeVariants.visible as { opacity: number };
      expect(visible.opacity).toBe(1);
    });
  });

  describe('type exports', () => {
    it('should have WindowAnimationState type available', () => {
      const state: WindowAnimationState = 'open';
      expect(windowVariants[state]).toBeDefined();
    });

    it('should have IconAnimationState type available', () => {
      const state: IconAnimationState = 'hover';
      expect(iconVariants[state]).toBeDefined();
    });

    it('should have MenuAnimationState type available', () => {
      const state: MenuAnimationState = 'open';
      expect(menuVariants[state]).toBeDefined();
    });

    it('should have FadeAnimationState type available', () => {
      const state: FadeAnimationState = 'visible';
      expect(fadeVariants[state]).toBeDefined();
    });
  });
});
