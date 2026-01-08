import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MenuBar } from '../MenuBar';

describe('MenuBar', () => {
  beforeEach(() => {
    // Mock date for consistent clock testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-08T10:30:00'));
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

  it('displays default app name as Finder', () => {
    render(<MenuBar />);
    expect(screen.getByTestId('app-name')).toHaveTextContent('Finder');
  });

  it('displays custom app name when provided', () => {
    render(<MenuBar appName="Safari" />);
    expect(screen.getByTestId('app-name')).toHaveTextContent('Safari');
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
});
