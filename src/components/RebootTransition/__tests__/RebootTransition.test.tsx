import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { RebootTransition } from '../RebootTransition';

// Mock motion/react to avoid animation timing issues
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('RebootTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders children immediately on initial load', () => {
    render(
      <RebootTransition mode="desktop">
        <div data-testid="child-content">Desktop Content</div>
      </RebootTransition>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Desktop Content')).toBeInTheDocument();
  });

  it('sets data-mode attribute on content wrapper', () => {
    render(
      <RebootTransition mode="ios">
        <div>iOS Content</div>
      </RebootTransition>
    );

    expect(screen.getByTestId('reboot-content')).toHaveAttribute('data-mode', 'ios');
  });

  it('does not show overlay on initial render with skipInitial true', () => {
    render(
      <RebootTransition mode="desktop" skipInitial={true}>
        <div>Content</div>
      </RebootTransition>
    );

    expect(screen.queryByTestId('reboot-overlay')).not.toBeInTheDocument();
  });

  it('does not show overlay on initial render with skipInitial false', () => {
    // Initial render should never show overlay, even with skipInitial=false
    render(
      <RebootTransition mode="desktop" skipInitial={false}>
        <div>Content</div>
      </RebootTransition>
    );

    expect(screen.queryByTestId('reboot-overlay')).not.toBeInTheDocument();
  });

  it('shows overlay when crossing iOS threshold with skipInitial false', async () => {
    const { rerender } = render(
      <RebootTransition mode="desktop" skipInitial={false}>
        <div>Desktop Content</div>
      </RebootTransition>
    );

    // Change to iOS mode
    await act(async () => {
      rerender(
        <RebootTransition mode="ios" skipInitial={false}>
          <div>iOS Content</div>
        </RebootTransition>
      );
    });

    expect(screen.getByTestId('reboot-overlay')).toBeInTheDocument();
  });

  it('does not show overlay when changing between desktop and fallback', async () => {
    const { rerender } = render(
      <RebootTransition mode="desktop" skipInitial={false}>
        <div>Desktop Content</div>
      </RebootTransition>
    );

    // Change to fallback mode (no iOS threshold crossing)
    await act(async () => {
      rerender(
        <RebootTransition mode="fallback" skipInitial={false}>
          <div>Fallback Content</div>
        </RebootTransition>
      );
    });

    expect(screen.queryByTestId('reboot-overlay')).not.toBeInTheDocument();
  });

  it('updates content after transition completes', async () => {
    const fadeOutDuration = 300;
    const holdDuration = 400;
    const fadeInDuration = 500;

    const { rerender } = render(
      <RebootTransition
        mode="desktop"
        skipInitial={false}
        fadeOutDuration={fadeOutDuration}
        holdDuration={holdDuration}
        fadeInDuration={fadeInDuration}
      >
        <div data-testid="child-content">Desktop Content</div>
      </RebootTransition>
    );

    // Change to iOS mode
    await act(async () => {
      rerender(
        <RebootTransition
          mode="ios"
          skipInitial={false}
          fadeOutDuration={fadeOutDuration}
          holdDuration={holdDuration}
          fadeInDuration={fadeInDuration}
        >
          <div data-testid="child-content">iOS Content</div>
        </RebootTransition>
      );
    });

    // Content should update after fadeOut + half of hold
    await act(async () => {
      vi.advanceTimersByTime(fadeOutDuration + holdDuration / 2 + 1);
    });

    // Data-mode should be updated to 'ios'
    expect(screen.getByTestId('reboot-content')).toHaveAttribute('data-mode', 'ios');
  });

  it('removes overlay after full transition', async () => {
    const fadeOutDuration = 300;
    const holdDuration = 400;
    const fadeInDuration = 500;
    const totalDuration = fadeOutDuration + holdDuration + fadeInDuration;

    const { rerender } = render(
      <RebootTransition
        mode="desktop"
        skipInitial={false}
        fadeOutDuration={fadeOutDuration}
        holdDuration={holdDuration}
        fadeInDuration={fadeInDuration}
      >
        <div>Desktop Content</div>
      </RebootTransition>
    );

    // Change to iOS mode
    await act(async () => {
      rerender(
        <RebootTransition
          mode="ios"
          skipInitial={false}
          fadeOutDuration={fadeOutDuration}
          holdDuration={holdDuration}
          fadeInDuration={fadeInDuration}
        >
          <div>iOS Content</div>
        </RebootTransition>
      );
    });

    // Overlay should be visible
    expect(screen.getByTestId('reboot-overlay')).toBeInTheDocument();

    // Complete the transition
    await act(async () => {
      vi.advanceTimersByTime(totalDuration + 1);
    });

    // Overlay should be gone
    expect(screen.queryByTestId('reboot-overlay')).not.toBeInTheDocument();
  });

  it('shows gray overlay during transition', async () => {
    const { rerender } = render(
      <RebootTransition mode="desktop" skipInitial={false}>
        <div>Desktop Content</div>
      </RebootTransition>
    );

    await act(async () => {
      rerender(
        <RebootTransition mode="ios" skipInitial={false}>
          <div>iOS Content</div>
        </RebootTransition>
      );
    });

    // The overlay appears during transition (Tiger-style gray boot screen)
    const overlay = screen.getByTestId('reboot-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('triggers transition when going from iOS to desktop', async () => {
    const { rerender } = render(
      <RebootTransition mode="ios" skipInitial={false}>
        <div>iOS Content</div>
      </RebootTransition>
    );

    // Change to desktop mode
    await act(async () => {
      rerender(
        <RebootTransition mode="desktop" skipInitial={false}>
          <div>Desktop Content</div>
        </RebootTransition>
      );
    });

    expect(screen.getByTestId('reboot-overlay')).toBeInTheDocument();
  });
});
