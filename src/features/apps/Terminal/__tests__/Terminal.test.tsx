import { describe, it, expect, vi } from 'vitest';

// Mock ResizeObserver globally before any component imports
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
(globalThis as typeof globalThis & { ResizeObserver: typeof ResizeObserver }).ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// Mock xterm.js before importing Terminal
vi.mock('@xterm/xterm', () => {
  class MockTerminal {
    loadAddon = vi.fn();
    open = vi.fn();
    write = vi.fn();
    onData = vi.fn(() => ({ dispose: vi.fn() }));
    dispose = vi.fn();
    clear = vi.fn();
  }
  return { Terminal: MockTerminal };
});

vi.mock('@xterm/addon-fit', () => {
  class MockFitAddon {
    fit = vi.fn();
    dispose = vi.fn();
  }
  return { FitAddon: MockFitAddon };
});

// Import Terminal after mocks are set up (vitest hoists vi.mock calls)
import { render, screen } from '@testing-library/react';
import { Terminal } from '../Terminal';

describe('Terminal', () => {
  it('renders terminal container', () => {
    render(<Terminal />);
    expect(screen.getByTestId('terminal-content')).toBeInTheDocument();
  });

  it('has terminal element for xterm', () => {
    render(<Terminal />);
    const container = screen.getByTestId('terminal-content');
    const terminalEl = container.querySelector('div:last-child');
    expect(terminalEl).toBeInTheDocument();
  });

  it('has correct styling class', () => {
    render(<Terminal />);
    const container = screen.getByTestId('terminal-content');
    expect(container.className).toContain('container');
  });
});
