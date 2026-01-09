import { describe, it, expect } from 'vitest';
import { IOS_SACRED, IOS_BREAKPOINT } from '../sacred';

describe('IOS_SACRED', () => {
  describe('status bar', () => {
    it('has correct status bar height', () => {
      expect(IOS_SACRED.statusBarHeight).toBe(20);
    });
  });

  describe('app icons', () => {
    it('has correct icon size', () => {
      expect(IOS_SACRED.iconSize).toBe(60);
    });

    it('has correct icon corner radius', () => {
      expect(IOS_SACRED.iconCornerRadius).toBe(12);
    });

    it('has correct icon grid gap', () => {
      expect(IOS_SACRED.iconGridGap).toBe(20);
    });

    it('has correct icon label font size', () => {
      expect(IOS_SACRED.iconLabelFontSize).toBe(11);
    });
  });

  describe('home screen layout', () => {
    it('has 4 columns', () => {
      expect(IOS_SACRED.iconColumns).toBe(4);
    });

    it('has 5 rows', () => {
      expect(IOS_SACRED.iconRows).toBe(5);
    });

    it('has 4 dock icons', () => {
      expect(IOS_SACRED.dockIconCount).toBe(4);
    });

    it('has correct dock height', () => {
      expect(IOS_SACRED.dockHeight).toBe(96);
    });
  });

  describe('dock', () => {
    it('has correct dock padding', () => {
      expect(IOS_SACRED.dockPaddingX).toBe(4);
    });

    it('has correct dock icon gap', () => {
      expect(IOS_SACRED.dockIconGap).toBe(16);
    });
  });

  describe('page dots', () => {
    it('has correct page dot size', () => {
      expect(IOS_SACRED.pageDotSize).toBe(7);
    });

    it('has correct page dot gap', () => {
      expect(IOS_SACRED.pageDotGap).toBe(10);
    });
  });

  describe('touch targets', () => {
    it('has minimum touch target of 44px (iOS guidelines)', () => {
      expect(IOS_SACRED.minTouchTarget).toBe(44);
    });
  });

  describe('colors', () => {
    it('has white status bar text', () => {
      expect(IOS_SACRED.colors.statusBarText).toBe('#FFFFFF');
    });

    it('has white icon label text', () => {
      expect(IOS_SACRED.colors.iconLabelText).toBe('#FFFFFF');
    });

    it('has dark icon label shadow', () => {
      expect(IOS_SACRED.colors.iconLabelShadow).toBe('rgba(0, 0, 0, 0.75)');
    });

    it('has semi-transparent dock background', () => {
      expect(IOS_SACRED.colors.dockBackground).toBe('rgba(0, 0, 0, 0.4)');
    });

    it('has white active page dot', () => {
      expect(IOS_SACRED.colors.pageDotActive).toBe('#FFFFFF');
    });

    it('has semi-transparent inactive page dot', () => {
      expect(IOS_SACRED.colors.pageDotInactive).toBe('rgba(255, 255, 255, 0.4)');
    });
  });

  describe('immutability', () => {
    it('values are readonly (enforced at compile time)', () => {
      // The 'as const' assertion provides compile-time immutability
      // At runtime, we can only verify the values haven't been tampered with
      expect(IOS_SACRED.statusBarHeight).toBe(20);
      expect(typeof IOS_SACRED).toBe('object');
    });
  });
});

describe('IOS_BREAKPOINT', () => {
  it('is set to 768px', () => {
    expect(IOS_BREAKPOINT).toBe(768);
  });
});
