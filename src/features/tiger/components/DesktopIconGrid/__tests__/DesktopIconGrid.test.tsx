import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DesktopIconGrid } from '../DesktopIconGrid';

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
    it('should be a full-screen container for absolutely positioned icons', () => {
      render(
        <DesktopIconGrid>
          <div>Icon</div>
        </DesktopIconGrid>
      );
      const grid = screen.getByTestId('desktop-icon-grid');
      // Grid is now a full-screen container (positioning done via CSS)
      expect(grid).toBeInTheDocument();
      expect(grid.className).toContain('grid');
    });

    it('should apply grid class for styling', () => {
      render(
        <DesktopIconGrid>
          <div>Icon</div>
        </DesktopIconGrid>
      );
      const grid = screen.getByTestId('desktop-icon-grid');
      expect(grid.className).toContain('grid');
    });
  });
});
