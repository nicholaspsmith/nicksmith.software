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
  });

  it('does not render when no windows are minimized', () => {
    render(<Dock />);
    expect(screen.queryByTestId('dock')).not.toBeInTheDocument();
  });

  it('renders when windows are minimized', () => {
    useWindowStore.setState({
      windows: [
        {
          id: 'test-1',
          app: 'About Me',
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
        },
      ],
      activeWindowId: null,
      maxZIndex: 1,
    });

    render(<Dock />);
    expect(screen.getByTestId('dock')).toBeInTheDocument();
  });

  it('displays minimized window icons', () => {
    useWindowStore.setState({
      windows: [
        {
          id: 'test-1',
          app: 'About Me',
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
        },
        {
          id: 'test-2',
          app: 'Projects',
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
        },
      ],
      activeWindowId: null,
      maxZIndex: 2,
    });

    render(<Dock />);
    expect(screen.getByTestId('dock-icon-test-1')).toBeInTheDocument();
    expect(screen.getByTestId('dock-icon-test-2')).toBeInTheDocument();
  });

  it('does not display open windows', () => {
    useWindowStore.setState({
      windows: [
        {
          id: 'minimized-1',
          app: 'About Me',
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
        },
        {
          id: 'open-1',
          app: 'Projects',
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
      activeWindowId: 'open-1',
      maxZIndex: 2,
    });

    render(<Dock />);
    expect(screen.getByTestId('dock-icon-minimized-1')).toBeInTheDocument();
    expect(screen.queryByTestId('dock-icon-open-1')).not.toBeInTheDocument();
  });

  it('restores window when icon is clicked', () => {
    useWindowStore.setState({
      windows: [
        {
          id: 'test-1',
          app: 'About Me',
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
          app: 'Resume',
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
        },
      ],
      activeWindowId: null,
      maxZIndex: 1,
    });

    render(<Dock />);
    expect(screen.getByLabelText('Restore Resume')).toBeInTheDocument();
  });
});
