import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Dock } from '../Dock';
import { useWindowStore } from '@/stores/windowStore';

// Mock motion to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    button: ({ children, onClick, ...props }: React.ComponentProps<'button'>) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Dock', () => {
  beforeEach(() => {
    // Reset the store before each test
    useWindowStore.setState({
      windows: [],
      activeWindowId: null,
      maxZIndex: 0,
    });
    // Mock alert
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('always renders the dock (visible at all times)', () => {
    render(<Dock />);
    expect(screen.getByTestId('dock')).toBeInTheDocument();
  });

  it('displays default icons (Finder, System Preferences, Trash)', () => {
    render(<Dock />);
    expect(screen.getByTestId('dock-icon-finder')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-system-preferences')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-trash')).toBeInTheDocument();
  });

  it('displays minimized window icons', () => {
    useWindowStore.setState({
      windows: [
        {
          id: 'test-1',
          app: 'about',
          title: 'About Me',
          x: 100,
          y: 100,
          width: 400,
          height: 300,
          zIndex: 1,
          state: 'minimized',
          isZoomed: false,
          previousBounds: null,
          restoredFromMinimized: false,
          isShaded: false,
        },
        {
          id: 'test-2',
          app: 'projects',
          title: 'Projects',
          x: 150,
          y: 150,
          width: 400,
          height: 300,
          zIndex: 2,
          state: 'minimized',
          isZoomed: false,
          previousBounds: null,
          restoredFromMinimized: false,
          isShaded: false,
        },
      ],
      activeWindowId: null,
      maxZIndex: 2,
    });

    render(<Dock />);
    expect(screen.getByTestId('dock-icon-test-1')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-test-2')).toBeInTheDocument();
  });

  it('does not display open windows in minimized section', () => {
    useWindowStore.setState({
      windows: [
        {
          id: 'minimized-1',
          app: 'about',
          title: 'About Me',
          x: 100,
          y: 100,
          width: 400,
          height: 300,
          zIndex: 1,
          state: 'minimized',
          isZoomed: false,
          previousBounds: null,
          restoredFromMinimized: false,
          isShaded: false,
        },
        {
          id: 'open-1',
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
          isShaded: false,
        },
      ],
      activeWindowId: 'open-1',
      maxZIndex: 2,
    });

    render(<Dock />);
    expect(screen.getByTestId('dock-icon-minimized-1')).toBeInTheDocument();
    expect(screen.queryByTestId('dock-icon-open-1')).not.toBeInTheDocument();
  });

  it('restores window when minimized icon is clicked', () => {
    useWindowStore.setState({
      windows: [
        {
          id: 'test-1',
          app: 'about',
          title: 'About Me',
          x: 100,
          y: 100,
          width: 400,
          height: 300,
          zIndex: 1,
          state: 'minimized',
          isZoomed: false,
          previousBounds: null,
          restoredFromMinimized: false,
          isShaded: false,
        },
      ],
      activeWindowId: null,
      maxZIndex: 1,
    });

    render(<Dock />);

    fireEvent.click(screen.getByTestId('dock-icon-test-1'));

    const state = useWindowStore.getState();
    const window = state.windows.find((w) => w.id === 'test-1');
    expect(window?.state).toBe('open');
    expect(window?.restoredFromMinimized).toBe(true);
    expect(state.activeWindowId).toBe('test-1');
  });

  it('has accessible labels on icons', () => {
    useWindowStore.setState({
      windows: [
        {
          id: 'test-1',
          app: 'resume',
          title: 'Resume',
          x: 100,
          y: 100,
          width: 400,
          height: 300,
          zIndex: 1,
          state: 'minimized',
          isZoomed: false,
          previousBounds: null,
          restoredFromMinimized: false,
          isShaded: false,
        },
      ],
      activeWindowId: null,
      maxZIndex: 1,
    });

    render(<Dock />);
    expect(screen.getByLabelText('Restore Resume')).toBeInTheDocument();
    expect(screen.getByLabelText('Finder')).toBeInTheDocument();
    expect(screen.getByLabelText('System Preferences')).toBeInTheDocument();
    expect(screen.getByLabelText('Trash')).toBeInTheDocument();
  });
});
