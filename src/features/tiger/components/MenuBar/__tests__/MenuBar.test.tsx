import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MenuBar } from '../MenuBar';
import { useWindowStore } from '@/stores/windowStore';

describe('MenuBar', () => {
  beforeEach(() => {
    // Mock date for consistent clock testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-08T10:30:00'));
    // Reset window store
    useWindowStore.setState({
      windows: [],
      activeWindowId: null,
      maxZIndex: 0,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<MenuBar />);
    expect(screen.getByTestId('menu-bar')).toBeInTheDocument();
  });

  it('displays Apple logo', () => {
    render(<MenuBar />);
    expect(screen.getByLabelText('Apple menu')).toBeInTheDocument();
  });

  it('displays Finder when no windows are focused', () => {
    render(<MenuBar />);
    expect(screen.getByTestId('app-name')).toHaveTextContent('Finder');
  });

  it('displays focused window parent app name (TextEdit for documents)', () => {
    // Add a window and set it as active
    useWindowStore.setState({
      windows: [
        {
          id: 'test-123',
          app: 'resume',
          parentApp: 'textEdit',
          title: 'Resume',
          x: 100,
          y: 100,
          width: 400,
          height: 300,
          zIndex: 1,
          state: 'open',
          isZoomed: false,
          previousBounds: null,
          restoredFromMinimized: false,
          isShaded: false,
        },
      ],
      activeWindowId: 'test-123',
    });
    render(<MenuBar />);
    // Should show TextEdit (parent app), not Resume (document name)
    expect(screen.getByTestId('app-name')).toHaveTextContent('TextEdit');
  });

  it('updates app name when focus changes', () => {
    // Start with two windows - one TextEdit doc, one Terminal
    useWindowStore.setState({
      windows: [
        {
          id: 'win-1',
          app: 'resume',
          parentApp: 'textEdit',
          title: 'Resume',
          x: 100,
          y: 100,
          width: 400,
          height: 300,
          zIndex: 1,
          state: 'open',
          isZoomed: false,
          previousBounds: null,
          restoredFromMinimized: false,
          isShaded: false,
        },
        {
          id: 'win-2',
          app: 'terminal',
          parentApp: 'terminal',
          title: 'Terminal',
          x: 150,
          y: 150,
          width: 400,
          height: 300,
          zIndex: 2,
          state: 'open',
          isZoomed: false,
          previousBounds: null,
          restoredFromMinimized: false,
          isShaded: false,
        },
      ],
      activeWindowId: 'win-2',
    });

    const { rerender } = render(<MenuBar />);
    // win-2 is Terminal, so should show Terminal
    expect(screen.getByTestId('app-name')).toHaveTextContent('Terminal');

    // Change focus to win-1 (Resume document in TextEdit)
    useWindowStore.setState({ activeWindowId: 'win-1' });
    rerender(<MenuBar />);
    // Should show TextEdit (parent app), not Resume (document name)
    expect(screen.getByTestId('app-name')).toHaveTextContent('TextEdit');
  });

  it('displays clock', () => {
    render(<MenuBar />);
    const clock = screen.getByTestId('clock');
    expect(clock).toBeInTheDocument();
    // Clock should contain time-like format
    expect(clock.textContent).toMatch(/\d{1,2}:\d{2}/);
  });

  it('has the menuBar CSS class applied', () => {
    render(<MenuBar />);
    const menuBar = screen.getByTestId('menu-bar');
    expect(menuBar.className).toContain('menuBar');
  });

  describe('Apple Menu Dropdown', () => {
    it('opens dropdown when Apple logo is clicked', () => {
      render(<MenuBar />);
      const appleButton = screen.getByTestId('apple-menu-button');

      expect(screen.queryByTestId('apple-menu-dropdown')).not.toBeInTheDocument();

      fireEvent.click(appleButton);

      expect(screen.getByTestId('apple-menu-dropdown')).toBeInTheDocument();
    });

    it('closes dropdown when clicked again', () => {
      render(<MenuBar />);
      const appleButton = screen.getByTestId('apple-menu-button');

      fireEvent.click(appleButton);
      expect(screen.getByTestId('apple-menu-dropdown')).toBeInTheDocument();

      fireEvent.click(appleButton);
      expect(screen.queryByTestId('apple-menu-dropdown')).not.toBeInTheDocument();
    });

    it('displays About This Mac menu item', () => {
      render(<MenuBar />);
      fireEvent.click(screen.getByTestId('apple-menu-button'));

      expect(screen.getByRole('menuitem', { name: 'About This Mac' })).toBeInTheDocument();
    });

    it('displays Restart menu item', () => {
      render(<MenuBar />);
      fireEvent.click(screen.getByTestId('apple-menu-button'));

      expect(screen.getByRole('menuitem', { name: /Restart/ })).toBeInTheDocument();
    });

    it('closes dropdown when Escape is pressed', () => {
      render(<MenuBar />);
      fireEvent.click(screen.getByTestId('apple-menu-button'));
      expect(screen.getByTestId('apple-menu-dropdown')).toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      expect(screen.queryByTestId('apple-menu-dropdown')).not.toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', () => {
      render(<MenuBar />);
      fireEvent.click(screen.getByTestId('apple-menu-button'));
      expect(screen.getByTestId('apple-menu-dropdown')).toBeInTheDocument();

      // Click outside the dropdown
      act(() => {
        fireEvent.mouseDown(document.body);
      });

      expect(screen.queryByTestId('apple-menu-dropdown')).not.toBeInTheDocument();
    });

    it('has correct aria attributes', () => {
      render(<MenuBar />);
      const appleButton = screen.getByTestId('apple-menu-button');

      expect(appleButton).toHaveAttribute('aria-haspopup', 'menu');
      expect(appleButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(appleButton);
      expect(appleButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Application Menu Dropdowns', () => {
    it('opens File menu dropdown when clicked', () => {
      render(<MenuBar />);
      const fileMenu = screen.getByTestId('menu-file');

      expect(screen.queryByTestId('file-menu-dropdown')).not.toBeInTheDocument();

      fireEvent.click(fileMenu);

      expect(screen.getByTestId('file-menu-dropdown')).toBeInTheDocument();
    });

    it('opens Edit menu dropdown when clicked', () => {
      render(<MenuBar />);
      fireEvent.click(screen.getByTestId('menu-edit'));

      expect(screen.getByTestId('edit-menu-dropdown')).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /Undo/ })).toBeInTheDocument();
    });

    it('opens View menu dropdown when clicked', () => {
      render(<MenuBar />);
      fireEvent.click(screen.getByTestId('menu-view'));

      expect(screen.getByTestId('view-menu-dropdown')).toBeInTheDocument();
    });

    it('opens Go menu dropdown when clicked', () => {
      render(<MenuBar />);
      fireEvent.click(screen.getByTestId('menu-go'));

      expect(screen.getByTestId('go-menu-dropdown')).toBeInTheDocument();
    });

    it('opens Window menu dropdown when clicked', () => {
      render(<MenuBar />);
      fireEvent.click(screen.getByTestId('menu-window'));

      expect(screen.getByTestId('window-menu-dropdown')).toBeInTheDocument();
    });

    it('opens Help menu dropdown when clicked', () => {
      render(<MenuBar />);
      fireEvent.click(screen.getByTestId('menu-help'));

      expect(screen.getByTestId('help-menu-dropdown')).toBeInTheDocument();
    });

    it('displays keyboard shortcuts in dropdown items', () => {
      render(<MenuBar />);
      fireEvent.click(screen.getByTestId('menu-file'));

      // Check for keyboard shortcut display
      const newItem = screen.getByTestId('menu-item-new');
      expect(newItem).toHaveTextContent('⌘N');
    });

    it('closes dropdown when Escape is pressed', () => {
      render(<MenuBar />);
      fireEvent.click(screen.getByTestId('menu-file'));
      expect(screen.getByTestId('file-menu-dropdown')).toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      expect(screen.queryByTestId('file-menu-dropdown')).not.toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', () => {
      render(<MenuBar />);
      fireEvent.click(screen.getByTestId('menu-file'));
      expect(screen.getByTestId('file-menu-dropdown')).toBeInTheDocument();

      act(() => {
        fireEvent.mouseDown(document.body);
      });

      expect(screen.queryByTestId('file-menu-dropdown')).not.toBeInTheDocument();
    });
  });

  describe('Menu Tracking Behavior', () => {
    it('switches dropdown when hovering another menu while one is open', () => {
      render(<MenuBar />);

      // Open File menu
      fireEvent.click(screen.getByTestId('menu-file'));
      expect(screen.getByTestId('file-menu-dropdown')).toBeInTheDocument();

      // Hover over Edit menu - should switch
      fireEvent.mouseEnter(screen.getByTestId('menu-edit'));

      expect(screen.queryByTestId('file-menu-dropdown')).not.toBeInTheDocument();
      expect(screen.getByTestId('edit-menu-dropdown')).toBeInTheDocument();
    });

    it('does not open dropdown on hover when no menu is open', () => {
      render(<MenuBar />);

      // Hover over File menu without clicking first
      fireEvent.mouseEnter(screen.getByTestId('menu-file'));

      // Should not open dropdown
      expect(screen.queryByTestId('file-menu-dropdown')).not.toBeInTheDocument();
    });

    it('switches from Apple menu to app menu via hover', () => {
      render(<MenuBar />);

      // Open Apple menu
      fireEvent.click(screen.getByTestId('apple-menu-button'));
      expect(screen.getByTestId('apple-menu-dropdown')).toBeInTheDocument();

      // Hover over File menu
      fireEvent.mouseEnter(screen.getByTestId('menu-file'));

      expect(screen.queryByTestId('apple-menu-dropdown')).not.toBeInTheDocument();
      expect(screen.getByTestId('file-menu-dropdown')).toBeInTheDocument();
    });

    it('switches back to Apple menu via hover', () => {
      render(<MenuBar />);

      // Open File menu
      fireEvent.click(screen.getByTestId('menu-file'));
      expect(screen.getByTestId('file-menu-dropdown')).toBeInTheDocument();

      // Hover over Apple menu
      fireEvent.mouseEnter(screen.getByTestId('apple-menu-button'));

      expect(screen.queryByTestId('file-menu-dropdown')).not.toBeInTheDocument();
      expect(screen.getByTestId('apple-menu-dropdown')).toBeInTheDocument();
    });
  });

  describe('Active Menu Styling', () => {
    it('applies active class to menu item when dropdown is open', () => {
      render(<MenuBar />);
      const fileMenu = screen.getByTestId('menu-file');

      expect(fileMenu.className).not.toContain('menuActive');

      fireEvent.click(fileMenu);

      expect(fileMenu.className).toContain('menuActive');
    });

    it('applies active class to Apple menu when dropdown is open', () => {
      render(<MenuBar />);
      const appleMenu = screen.getByTestId('apple-menu-button');

      expect(appleMenu.className).not.toContain('menuActive');

      fireEvent.click(appleMenu);

      expect(appleMenu.className).toContain('menuActive');
    });
  });
});
