import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AlertDialog } from '../AlertDialog';
import { useSoundStore } from '@/stores/soundStore';

// Mock AudioContext
class MockAudioContext {
  destination = {};
  currentTime = 0;
  createOscillator = vi.fn(() => ({
    type: 'sine',
    frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }));
  createGain = vi.fn(() => ({
    gain: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  }));
}
vi.stubGlobal('AudioContext', MockAudioContext);

// Mock motion to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('AlertDialog', () => {
  const mockOnOk = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset sound store
    useSoundStore.setState({
      audioContext: null,
      buffers: new Map(),
      initialized: false,
      startupChimePlayed: false,
    });
  });

  it('renders when isOpen is true', () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onOk={mockOnOk}
      />
    );

    expect(screen.getByTestId('alert-dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <AlertDialog
        isOpen={false}
        title="Test Title"
        message="Test message"
        onOk={mockOnOk}
      />
    );

    expect(screen.queryByTestId('alert-dialog')).not.toBeInTheDocument();
  });

  it('displays OK button by default', () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Test"
        message="Test"
        onOk={mockOnOk}
      />
    );

    expect(screen.getByTestId('alert-ok')).toBeInTheDocument();
    expect(screen.getByTestId('alert-ok')).toHaveTextContent('OK');
  });

  it('displays custom OK text', () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Test"
        message="Test"
        okText="Confirm"
        onOk={mockOnOk}
      />
    );

    expect(screen.getByTestId('alert-ok')).toHaveTextContent('Confirm');
  });

  it('calls onOk when OK button is clicked', () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Test"
        message="Test"
        onOk={mockOnOk}
      />
    );

    fireEvent.click(screen.getByTestId('alert-ok'));
    expect(mockOnOk).toHaveBeenCalledTimes(1);
  });

  it('does not show cancel button by default', () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Test"
        message="Test"
        onOk={mockOnOk}
      />
    );

    expect(screen.queryByTestId('alert-cancel')).not.toBeInTheDocument();
  });

  it('shows cancel button when showCancel is true', () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Test"
        message="Test"
        showCancel={true}
        onOk={mockOnOk}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByTestId('alert-cancel')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Test"
        message="Test"
        showCancel={true}
        onOk={mockOnOk}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByTestId('alert-cancel'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onOk when Enter is pressed', async () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Test"
        message="Test"
        onOk={mockOnOk}
      />
    );

    fireEvent.keyDown(screen.getByTestId('alert-overlay'), { key: 'Enter' });
    expect(mockOnOk).toHaveBeenCalledTimes(1);
  });

  it('calls onOk when Escape is pressed (no cancel button)', () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Test"
        message="Test"
        onOk={mockOnOk}
      />
    );

    fireEvent.keyDown(screen.getByTestId('alert-overlay'), { key: 'Escape' });
    expect(mockOnOk).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Escape is pressed (with cancel button)', () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Test"
        message="Test"
        showCancel={true}
        onOk={mockOnOk}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.keyDown(screen.getByTestId('alert-overlay'), { key: 'Escape' });
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnOk).not.toHaveBeenCalled();
  });

  it('has correct ARIA attributes', () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onOk={mockOnOk}
      />
    );

    const dialog = screen.getByTestId('alert-dialog');
    expect(dialog).toHaveAttribute('role', 'alertdialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'alert-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'alert-message');
  });

  it('renders caution icon by default', () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Test"
        message="Test"
        onOk={mockOnOk}
      />
    );

    // Check for SVG caution icon (yellow triangle)
    const dialog = screen.getByTestId('alert-dialog');
    expect(dialog.querySelector('svg')).toBeInTheDocument();
  });

  it('focuses OK button when dialog opens', async () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Test"
        message="Test"
        onOk={mockOnOk}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('alert-ok')).toHaveFocus();
    });
  });
});
