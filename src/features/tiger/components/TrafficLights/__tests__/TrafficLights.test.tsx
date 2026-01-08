import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TrafficLights } from '../TrafficLights';

describe('TrafficLights', () => {
  it('renders three buttons', () => {
    render(<TrafficLights isFocused={true} />);
    expect(screen.getByTestId('traffic-light-close')).toBeInTheDocument();
    expect(screen.getByTestId('traffic-light-minimize')).toBeInTheDocument();
    expect(screen.getByTestId('traffic-light-zoom')).toBeInTheDocument();
  });

  it('has container with correct test id', () => {
    render(<TrafficLights isFocused={true} />);
    expect(screen.getByTestId('traffic-lights')).toBeInTheDocument();
  });

  it('applies focused class when isFocused is true', () => {
    render(<TrafficLights isFocused={true} />);
    const container = screen.getByTestId('traffic-lights');
    expect(container.className).toContain('focused');
    expect(container.className).not.toContain('unfocused');
  });

  it('applies unfocused class when isFocused is false', () => {
    render(<TrafficLights isFocused={false} />);
    const container = screen.getByTestId('traffic-lights');
    expect(container.className).toContain('unfocused');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<TrafficLights isFocused={true} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('traffic-light-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onMinimize when minimize button is clicked', () => {
    const onMinimize = vi.fn();
    render(<TrafficLights isFocused={true} onMinimize={onMinimize} />);
    fireEvent.click(screen.getByTestId('traffic-light-minimize'));
    expect(onMinimize).toHaveBeenCalledTimes(1);
  });

  it('calls onZoom when zoom button is clicked', () => {
    const onZoom = vi.fn();
    render(<TrafficLights isFocused={true} onZoom={onZoom} />);
    fireEvent.click(screen.getByTestId('traffic-light-zoom'));
    expect(onZoom).toHaveBeenCalledTimes(1);
  });

  it('stops event propagation on click', () => {
    const onClose = vi.fn();
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <TrafficLights isFocused={true} onClose={onClose} />
      </div>
    );
    fireEvent.click(screen.getByTestId('traffic-light-close'));
    expect(onClose).toHaveBeenCalled();
    expect(parentClick).not.toHaveBeenCalled();
  });

  it('has correct aria labels for accessibility', () => {
    render(<TrafficLights isFocused={true} />);
    expect(screen.getByLabelText('Close window')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimize window')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom window')).toBeInTheDocument();
  });

  it('handles missing click handlers gracefully', () => {
    render(<TrafficLights isFocused={true} />);
    // Should not throw when clicking without handlers
    expect(() => {
      fireEvent.click(screen.getByTestId('traffic-light-close'));
      fireEvent.click(screen.getByTestId('traffic-light-minimize'));
      fireEvent.click(screen.getByTestId('traffic-light-zoom'));
    }).not.toThrow();
  });

  it('applies close class to close button', () => {
    render(<TrafficLights isFocused={true} />);
    const closeButton = screen.getByTestId('traffic-light-close');
    expect(closeButton.className).toContain('close');
  });

  it('applies minimize class to minimize button', () => {
    render(<TrafficLights isFocused={true} />);
    const minimizeButton = screen.getByTestId('traffic-light-minimize');
    expect(minimizeButton.className).toContain('minimize');
  });

  it('applies zoom class to zoom button', () => {
    render(<TrafficLights isFocused={true} />);
    const zoomButton = screen.getByTestId('traffic-light-zoom');
    expect(zoomButton.className).toContain('zoom');
  });
});
