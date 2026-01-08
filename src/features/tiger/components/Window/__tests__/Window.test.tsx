import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Window } from '../Window';
import { useWindowStore } from '@/stores/windowStore';

// Mock react-rnd since it requires DOM measurements
vi.mock('react-rnd', () => ({
  Rnd: ({
    children,
    style,
    'data-testid': testId,
    dragHandleClassName,
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
    'data-testid'?: string;
    dragHandleClassName?: string;
  }) => (
    <div data-testid={testId} style={style} data-drag-handle={dragHandleClassName}>
      {children}
    </div>
  ),
}));

describe('Window', () => {
  beforeEach(() => {
    // Reset store before each test
    useWindowStore.setState({
      windows: [],
      activeWindowId: null,
      maxZIndex: 0,
    });
  });

  it('renders nothing when window not found', () => {
    render(<Window id="nonexistent" title="Test" />);
    expect(screen.queryByTestId('window-content')).not.toBeInTheDocument();
  });

  it('renders window when found in store', () => {
    useWindowStore.getState().openWindow('TestApp');
    const windows = useWindowStore.getState().windows;
    const windowId = windows[0].id;

    render(<Window id={windowId} title="Test App" />);
    expect(screen.getByTestId('window-content')).toBeInTheDocument();
  });

  it('renders children inside window', () => {
    useWindowStore.getState().openWindow('TestApp');
    const windows = useWindowStore.getState().windows;
    const windowId = windows[0].id;

    render(
      <Window id={windowId} title="Test App">
        <span data-testid="child">Child Content</span>
      </Window>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies correct z-index from store', () => {
    useWindowStore.getState().openWindow('TestApp');
    const windows = useWindowStore.getState().windows;
    const windowId = windows[0].id;
    const zIndex = windows[0].zIndex;

    render(<Window id={windowId} title="Test App" />);
    const rndWrapper = screen.getByTestId(`window-${windowId}`);
    expect(rndWrapper.style.zIndex).toBe(String(zIndex));
  });

  it('does not render minimized windows', () => {
    useWindowStore.getState().openWindow('TestApp');
    const windows = useWindowStore.getState().windows;
    const windowId = windows[0].id;

    // Minimize the window
    useWindowStore.getState().minimizeWindow(windowId);

    render(<Window id={windowId} title="Test App" />);
    expect(screen.queryByTestId('window-content')).not.toBeInTheDocument();
  });

  it('has window CSS class applied', () => {
    useWindowStore.getState().openWindow('TestApp');
    const windows = useWindowStore.getState().windows;
    const windowId = windows[0].id;

    render(<Window id={windowId} title="Test App" />);
    const windowContent = screen.getByTestId('window-content');
    expect(windowContent.className).toContain('window');
  });

  it('renders WindowChrome with correct title', () => {
    useWindowStore.getState().openWindow('TestApp');
    const windows = useWindowStore.getState().windows;
    const windowId = windows[0].id;

    render(<Window id={windowId} title="My Application" />);
    expect(screen.getByTestId('window-title')).toHaveTextContent('My Application');
  });

  it('shows focused state when window is active', () => {
    useWindowStore.getState().openWindow('TestApp');
    const windows = useWindowStore.getState().windows;
    const windowId = windows[0].id;
    // openWindow sets activeWindowId, so it's already focused

    render(<Window id={windowId} title="Test App" />);
    const titleBar = screen.getByTestId('title-bar');
    expect(titleBar.className).toContain('focused');
  });

  it('shows unfocused state when window is not active', () => {
    // Open two windows
    useWindowStore.getState().openWindow('App1');
    useWindowStore.getState().openWindow('App2');
    const windows = useWindowStore.getState().windows;
    const firstWindowId = windows[0].id;
    // Second window is now active, first is not

    render(<Window id={firstWindowId} title="App 1" />);
    const titleBar = screen.getByTestId('title-bar');
    expect(titleBar.className).toContain('unfocused');
  });

  it('has dragHandleClassName set for title-bar-only dragging', () => {
    useWindowStore.getState().openWindow('TestApp');
    const windows = useWindowStore.getState().windows;
    const windowId = windows[0].id;

    render(<Window id={windowId} title="Test App" />);
    const rndWrapper = screen.getByTestId(`window-${windowId}`);
    // dragHandleClassName is stored in data-drag-handle by our mock
    expect(rndWrapper.dataset.dragHandle).toBeDefined();
    expect(rndWrapper.dataset.dragHandle).toContain('dragHandle');
  });

  describe('accessibility', () => {
    it('has role="dialog" on window content', () => {
      useWindowStore.getState().openWindow('TestApp');
      const windows = useWindowStore.getState().windows;
      const windowId = windows[0].id;

      render(<Window id={windowId} title="Test App" />);
      const windowContent = screen.getByTestId('window-content');
      expect(windowContent).toHaveAttribute('role', 'dialog');
    });

    it('has aria-labelledby pointing to title', () => {
      useWindowStore.getState().openWindow('TestApp');
      const windows = useWindowStore.getState().windows;
      const windowId = windows[0].id;

      render(<Window id={windowId} title="Test App" />);
      const windowContent = screen.getByTestId('window-content');
      const titleId = windowContent.getAttribute('aria-labelledby');

      expect(titleId).toBe(`window-title-${windowId}`);
      expect(screen.getByTestId('window-title')).toHaveAttribute('id', titleId);
    });

    it('has aria-modal="false" for non-blocking windows', () => {
      useWindowStore.getState().openWindow('TestApp');
      const windows = useWindowStore.getState().windows;
      const windowId = windows[0].id;

      render(<Window id={windowId} title="Test App" />);
      const windowContent = screen.getByTestId('window-content');
      expect(windowContent).toHaveAttribute('aria-modal', 'false');
    });
  });
});
