import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSwipe } from '../useSwipe';

/**
 * Test component that uses the useSwipe hook
 */
function SwipeTestComponent({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}) {
  const swipeHandlers = useSwipe(
    { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown },
    { threshold }
  );

  return (
    <div data-testid="swipe-target" {...swipeHandlers}>
      Swipe here
    </div>
  );
}

/**
 * Creates touch event objects for testing
 */
function createTouchEvent(clientX: number, clientY: number) {
  return {
    touches: [{ clientX, clientY }],
    changedTouches: [{ clientX, clientY }],
  };
}

describe('useSwipe', () => {
  it('calls onSwipeLeft when swiping left', () => {
    const onSwipeLeft = vi.fn();
    render(<SwipeTestComponent onSwipeLeft={onSwipeLeft} />);

    const target = screen.getByTestId('swipe-target');

    // Start touch at x=200
    fireEvent.touchStart(target, createTouchEvent(200, 100));
    // End touch at x=100 (moved left 100px)
    fireEvent.touchEnd(target, createTouchEvent(100, 100));

    expect(onSwipeLeft).toHaveBeenCalledOnce();
  });

  it('calls onSwipeRight when swiping right', () => {
    const onSwipeRight = vi.fn();
    render(<SwipeTestComponent onSwipeRight={onSwipeRight} />);

    const target = screen.getByTestId('swipe-target');

    // Start touch at x=100
    fireEvent.touchStart(target, createTouchEvent(100, 100));
    // End touch at x=200 (moved right 100px)
    fireEvent.touchEnd(target, createTouchEvent(200, 100));

    expect(onSwipeRight).toHaveBeenCalledOnce();
  });

  it('calls onSwipeUp when swiping up', () => {
    const onSwipeUp = vi.fn();
    render(<SwipeTestComponent onSwipeUp={onSwipeUp} />);

    const target = screen.getByTestId('swipe-target');

    // Start touch at y=200
    fireEvent.touchStart(target, createTouchEvent(100, 200));
    // End touch at y=100 (moved up 100px)
    fireEvent.touchEnd(target, createTouchEvent(100, 100));

    expect(onSwipeUp).toHaveBeenCalledOnce();
  });

  it('calls onSwipeDown when swiping down', () => {
    const onSwipeDown = vi.fn();
    render(<SwipeTestComponent onSwipeDown={onSwipeDown} />);

    const target = screen.getByTestId('swipe-target');

    // Start touch at y=100
    fireEvent.touchStart(target, createTouchEvent(100, 100));
    // End touch at y=200 (moved down 100px)
    fireEvent.touchEnd(target, createTouchEvent(100, 200));

    expect(onSwipeDown).toHaveBeenCalledOnce();
  });

  it('does not trigger swipe if below threshold', () => {
    const onSwipeLeft = vi.fn();
    render(<SwipeTestComponent onSwipeLeft={onSwipeLeft} threshold={50} />);

    const target = screen.getByTestId('swipe-target');

    // Start touch at x=200
    fireEvent.touchStart(target, createTouchEvent(200, 100));
    // End touch at x=170 (only moved 30px, below 50px threshold)
    fireEvent.touchEnd(target, createTouchEvent(170, 100));

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('triggers swipe when exactly at threshold', () => {
    const onSwipeLeft = vi.fn();
    render(<SwipeTestComponent onSwipeLeft={onSwipeLeft} threshold={50} />);

    const target = screen.getByTestId('swipe-target');

    // Start touch at x=200
    fireEvent.touchStart(target, createTouchEvent(200, 100));
    // End touch at x=150 (moved exactly 50px)
    fireEvent.touchEnd(target, createTouchEvent(150, 100));

    expect(onSwipeLeft).toHaveBeenCalledOnce();
  });

  it('prioritizes horizontal swipe when horizontal delta is greater', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeDown = vi.fn();
    render(
      <SwipeTestComponent onSwipeLeft={onSwipeLeft} onSwipeDown={onSwipeDown} />
    );

    const target = screen.getByTestId('swipe-target');

    // Start touch
    fireEvent.touchStart(target, createTouchEvent(200, 100));
    // End touch with more horizontal movement (100px left, 50px down)
    fireEvent.touchEnd(target, createTouchEvent(100, 150));

    expect(onSwipeLeft).toHaveBeenCalledOnce();
    expect(onSwipeDown).not.toHaveBeenCalled();
  });

  it('prioritizes vertical swipe when vertical delta is greater', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeDown = vi.fn();
    render(
      <SwipeTestComponent onSwipeLeft={onSwipeLeft} onSwipeDown={onSwipeDown} />
    );

    const target = screen.getByTestId('swipe-target');

    // Start touch
    fireEvent.touchStart(target, createTouchEvent(200, 100));
    // End touch with more vertical movement (50px left, 100px down)
    fireEvent.touchEnd(target, createTouchEvent(150, 200));

    expect(onSwipeDown).toHaveBeenCalledOnce();
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('does not trigger if touchEnd happens without touchStart', () => {
    const onSwipeLeft = vi.fn();
    render(<SwipeTestComponent onSwipeLeft={onSwipeLeft} />);

    const target = screen.getByTestId('swipe-target');

    // Only fire touchEnd without touchStart
    fireEvent.touchEnd(target, createTouchEvent(100, 100));

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('handles multiple sequential swipes correctly', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    render(
      <SwipeTestComponent onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} />
    );

    const target = screen.getByTestId('swipe-target');

    // First swipe: left
    fireEvent.touchStart(target, createTouchEvent(200, 100));
    fireEvent.touchEnd(target, createTouchEvent(100, 100));

    // Second swipe: right
    fireEvent.touchStart(target, createTouchEvent(100, 100));
    fireEvent.touchEnd(target, createTouchEvent(200, 100));

    // Third swipe: left again
    fireEvent.touchStart(target, createTouchEvent(200, 100));
    fireEvent.touchEnd(target, createTouchEvent(100, 100));

    expect(onSwipeLeft).toHaveBeenCalledTimes(2);
    expect(onSwipeRight).toHaveBeenCalledTimes(1);
  });

  it('works with custom threshold', () => {
    const onSwipeLeft = vi.fn();
    render(<SwipeTestComponent onSwipeLeft={onSwipeLeft} threshold={100} />);

    const target = screen.getByTestId('swipe-target');

    // Swipe 80px (below 100px threshold)
    fireEvent.touchStart(target, createTouchEvent(200, 100));
    fireEvent.touchEnd(target, createTouchEvent(120, 100));
    expect(onSwipeLeft).not.toHaveBeenCalled();

    // Swipe 100px (at threshold)
    fireEvent.touchStart(target, createTouchEvent(200, 100));
    fireEvent.touchEnd(target, createTouchEvent(100, 100));
    expect(onSwipeLeft).toHaveBeenCalledOnce();
  });
});
