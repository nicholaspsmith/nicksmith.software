import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { StatusBar } from '../StatusBar';

describe('StatusBar', () => {
  beforeEach(() => {
    // Mock the date for consistent time display
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-08T14:30:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the status bar', () => {
    render(<StatusBar />);

    expect(screen.getByTestId('ios-status-bar')).toBeInTheDocument();
  });

  it('displays carrier name', () => {
    render(<StatusBar />);

    expect(screen.getByText('Carrier')).toBeInTheDocument();
  });

  it('displays current time', () => {
    render(<StatusBar />);

    // Time should be formatted as 12-hour with AM/PM
    expect(screen.getByText('2:30 PM')).toBeInTheDocument();
  });

  it('displays battery percentage', () => {
    render(<StatusBar />);

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders signal bars icon', () => {
    render(<StatusBar />);

    expect(screen.getByLabelText('Full signal')).toBeInTheDocument();
  });

  it('renders battery icon', () => {
    render(<StatusBar />);

    expect(screen.getByLabelText('Battery full')).toBeInTheDocument();
  });

  it('updates time every second', async () => {
    render(<StatusBar />);

    expect(screen.getByText('2:30 PM')).toBeInTheDocument();

    // Advance time by 1 minute and flush timers
    await act(async () => {
      vi.advanceTimersByTime(60000);
    });

    expect(screen.getByText('2:31 PM')).toBeInTheDocument();
  });
});
