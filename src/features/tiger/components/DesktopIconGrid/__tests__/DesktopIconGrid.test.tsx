import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DesktopIconGrid } from '../DesktopIconGrid';
import { SACRED } from '../../../constants/sacred';

describe('DesktopIconGrid', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(
        <DesktopIconGrid>
          <div data-testid="child-1">Icon 1</div>
          <div data-testid="child-2">Icon 2</div>
        </DesktopIconGrid>
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should have correct test id', () => {
      render(
        <DesktopIconGrid>
          <div>Icon</div>
        </DesktopIconGrid>
      );
      expect(screen.getByTestId('desktop-icon-grid')).toBeInTheDocument();
    });
  });

  describe('positioning', () => {
    it('should be positioned from top-right', () => {
      render(
        <DesktopIconGrid>
          <div>Icon</div>
        </DesktopIconGrid>
      );
      const grid = screen.getByTestId('desktop-icon-grid');
      expect(grid.style.top).toBe(`${SACRED.iconGridTopMargin}px`);
      expect(grid.style.right).toBe(`${SACRED.iconGridRightMargin}px`);
    });

    it('should have correct grid row height', () => {
      render(
        <DesktopIconGrid>
          <div>Icon</div>
        </DesktopIconGrid>
      );
      const grid = screen.getByTestId('desktop-icon-grid');
      expect(grid.style.gridAutoRows).toBe(`${SACRED.iconGridCellHeight}px`);
    });

    it('should have correct column width', () => {
      render(
        <DesktopIconGrid>
          <div>Icon</div>
        </DesktopIconGrid>
      );
      const grid = screen.getByTestId('desktop-icon-grid');
      expect(grid.style.gridTemplateColumns).toContain(
        `${SACRED.iconGridCellWidth}px`
      );
    });
  });
});
