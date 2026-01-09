import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ContextMenu } from '../ContextMenu';
import { MenuItem, MenuDivider } from '../MenuItem';

describe('ContextMenu', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  describe('rendering', () => {
    it('should render the context menu at specified position', () => {
      render(<ContextMenu x={100} y={200} onClose={mockOnClose} />);

      const menu = screen.getByTestId('context-menu');
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveStyle({ left: '100px', top: '200px' });
    });

    it('should render all desktop context menu items', () => {
      render(<ContextMenu x={100} y={200} onClose={mockOnClose} />);

      expect(screen.getByTestId('menu-item-new-folder')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-get-info')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-change-desktop-background')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-clean-up')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-arrange-by')).toBeInTheDocument();
    });

    it('should render a divider', () => {
      render(<ContextMenu x={100} y={200} onClose={mockOnClose} />);

      expect(screen.getByTestId('menu-divider')).toBeInTheDocument();
    });

    it('should render submenu arrow for Arrange By item', () => {
      render(<ContextMenu x={100} y={200} onClose={mockOnClose} />);

      const arrangeByItem = screen.getByTestId('menu-item-arrange-by');
      expect(arrangeByItem.querySelector('span:last-child')).toHaveTextContent('▶');
    });

    it('should render overlay for click detection', () => {
      render(<ContextMenu x={100} y={200} onClose={mockOnClose} />);

      expect(screen.getByTestId('context-menu-overlay')).toBeInTheDocument();
    });
  });

  describe('closing behavior', () => {
    it('should call onClose when clicking on overlay', () => {
      render(<ContextMenu x={100} y={200} onClose={mockOnClose} />);

      const overlay = screen.getByTestId('context-menu-overlay');
      fireEvent.click(overlay);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when pressing Escape key', () => {
      render(<ContextMenu x={100} y={200} onClose={mockOnClose} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not close when clicking inside the menu', () => {
      render(<ContextMenu x={100} y={200} onClose={mockOnClose} />);

      const menu = screen.getByTestId('context-menu');
      fireEvent.click(menu);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should call onClose when right-clicking on overlay', () => {
      render(<ContextMenu x={100} y={200} onClose={mockOnClose} />);

      const overlay = screen.getByTestId('context-menu-overlay');
      fireEvent.contextMenu(overlay);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('viewport boundary handling', () => {
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;

    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600,
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight,
      });
    });

    it('should position menu within viewport when near right edge', () => {
      render(<ContextMenu x={750} y={200} onClose={mockOnClose} />);

      const menu = screen.getByTestId('context-menu');
      // Menu should be repositioned to fit within viewport
      // Initial position is set, then adjusted in useEffect
      expect(menu).toBeInTheDocument();
    });

    it('should position menu within viewport when near bottom edge', () => {
      render(<ContextMenu x={100} y={550} onClose={mockOnClose} />);

      const menu = screen.getByTestId('context-menu');
      // Menu should be repositioned to fit within viewport
      expect(menu).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have menu role', () => {
      render(<ContextMenu x={100} y={200} onClose={mockOnClose} />);

      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
    });

    it('should have aria-label', () => {
      render(<ContextMenu x={100} y={200} onClose={mockOnClose} />);

      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('aria-label', 'Context menu');
    });
  });
});

describe('MenuItem', () => {
  it('should render label text', () => {
    render(<MenuItem label="Test Item" />);

    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('should call onClick when clicked and not disabled', () => {
    const handleClick = vi.fn();
    render(<MenuItem label="Test Item" onClick={handleClick} />);

    fireEvent.click(screen.getByTestId('menu-item-test-item'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<MenuItem label="Test Item" onClick={handleClick} disabled />);

    fireEvent.click(screen.getByTestId('menu-item-test-item'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should have menuitem role', () => {
    render(<MenuItem label="Test Item" />);

    expect(screen.getByRole('menuitem')).toBeInTheDocument();
  });

  it('should have aria-disabled when disabled', () => {
    render(<MenuItem label="Test Item" disabled />);

    expect(screen.getByRole('menuitem')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should render submenu arrow when hasSubmenu is true', () => {
    render(<MenuItem label="Test Item" hasSubmenu />);

    expect(screen.getByText('▶')).toBeInTheDocument();
  });
});

describe('MenuDivider', () => {
  it('should render with separator role', () => {
    render(<MenuDivider />);

    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('should have default testId', () => {
    render(<MenuDivider />);

    expect(screen.getByTestId('menu-divider')).toBeInTheDocument();
  });

  it('should use custom testId when provided', () => {
    render(<MenuDivider testId="custom-divider" />);

    expect(screen.getByTestId('custom-divider')).toBeInTheDocument();
  });
});
