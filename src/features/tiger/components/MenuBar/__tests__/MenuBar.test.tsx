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

  it('displays focused window app name', () => {
    // Add a window and set it as active
    useWindowStore.setState({
      windows: [
        {
          id: 'test-123',
          app: 'resume',
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
        },
      ],
      activeWindowId: 'test-123',
    });
    render(<MenuBar />);
    expect(screen.getByTestId('app-name')).toHaveTextContent('Resume');
  });

  it('updates app name when focus changes', () => {
    // Start with two windows
    useWindowStore.setState({
      windows: [
        {
          id: 'win-1',
          app: 'resume',
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
        },
        {
          id: 'win-2',
          app: 'projects',
          title: 'Projects',
          x: 150,
          y: 150,
          width: 400,
          height: 300,
          zIndex: 2,
          state: 'open',
          isZoomed: false,
          previousBounds: null,
          restoredFromMinimized: false,
        },
      ],
      activeWindowId: 'win-2',
    });

    const { rerender } = render(<MenuBar />);
    expect(screen.getByTestId('app-name')).toHaveTextContent('Projects');

    // Change focus
    useWindowStore.setState({ activeWindowId: 'win-1' });
    rerender(<MenuBar />);
    expect(screen.getByTestId('app-name')).toHaveTextContent('Resume');
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
});
