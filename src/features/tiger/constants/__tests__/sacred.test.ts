import { describe, it, expect } from 'vitest';
import { SACRED } from '../sacred';
import type { SacredKey } from '../sacred';

describe('SACRED values registry', () => {
  describe('traffic light values', () => {
    it('should have correct trafficLightDiameter', () => {
      expect(SACRED.trafficLightDiameter).toBe(12);
    });

    it('should have correct trafficLightSpacing', () => {
      expect(SACRED.trafficLightSpacing).toBe(8);
    });

    it('should have correct trafficLightMargin', () => {
      expect(SACRED.trafficLightMargin).toBe(8);
    });
  });

  describe('window chrome values', () => {
    it('should have correct titleBarHeight', () => {
      expect(SACRED.titleBarHeight).toBe(22);
    });

    it('should have correct windowCornerRadius', () => {
      expect(SACRED.windowCornerRadius).toBe(5);
    });

    it('should have correct menuBarHeight', () => {
      expect(SACRED.menuBarHeight).toBe(22);
    });
  });

  describe('window default values', () => {
    it('should have correct windowMinWidth', () => {
      expect(SACRED.windowMinWidth).toBe(200);
    });

    it('should have correct windowMinHeight', () => {
      expect(SACRED.windowMinHeight).toBe(100);
    });

    it('should have correct windowDefaultWidth', () => {
      expect(SACRED.windowDefaultWidth).toBe(400);
    });

    it('should have correct windowDefaultHeight', () => {
      expect(SACRED.windowDefaultHeight).toBe(300);
    });

    it('should have correct windowCascadeOffset', () => {
      expect(SACRED.windowCascadeOffset).toBe(30);
    });

    it('should have correct windowViewportMargin', () => {
      expect(SACRED.windowViewportMargin).toBe(50);
    });
  });

  describe('desktop icon values', () => {
    it('should have correct iconGridSize', () => {
      expect(SACRED.iconGridSize).toBe(75);
    });

    it('should have correct iconSize', () => {
      expect(SACRED.iconSize).toBe(48);
    });

    it('should have correct iconLabelMaxWidth', () => {
      expect(SACRED.iconLabelMaxWidth).toBe(72);
    });
  });

  describe('dock values', () => {
    it('should have correct dockIconSize', () => {
      expect(SACRED.dockIconSize).toBe(48);
    });

    it('should have correct dockMagnification', () => {
      expect(SACRED.dockMagnification).toBe(128);
    });

    it('should have correct dockHeight', () => {
      expect(SACRED.dockHeight).toBe(64);
    });
  });

  describe('type safety', () => {
    it('should export SACRED as readonly object', () => {
      // TypeScript ensures this at compile time via 'as const'
      // At runtime, we verify the object exists and has expected shape
      expect(typeof SACRED).toBe('object');
      expect(SACRED).not.toBeNull();
    });

    it('should have SacredKey type available', () => {
      // Verify the type can be used
      const key: SacredKey = 'trafficLightDiameter';
      expect(SACRED[key]).toBe(12);
    });

    it('should have all expected keys', () => {
      const expectedKeys = [
        'trafficLightDiameter',
        'trafficLightSpacing',
        'trafficLightMargin',
        'titleBarHeight',
        'windowCornerRadius',
        'menuBarHeight',
        'windowMinWidth',
        'windowMinHeight',
        'windowDefaultWidth',
        'windowDefaultHeight',
        'windowCascadeOffset',
        'windowViewportMargin',
        'iconGridSize',
        'iconSize',
        'iconLabelMaxWidth',
        'dockIconSize',
        'dockMagnification',
        'dockHeight',
      ];

      const actualKeys = Object.keys(SACRED);
      expect(actualKeys).toEqual(expect.arrayContaining(expectedKeys));
      expect(actualKeys.length).toBe(expectedKeys.length);
    });
  });
});
