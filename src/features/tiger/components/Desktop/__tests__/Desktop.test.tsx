import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Desktop } from '../Desktop';

describe('Desktop', () => {
  it('renders without crashing', () => {
    render(<Desktop />);
    expect(screen.getByTestId('desktop')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <Desktop>
        <span data-testid="child">Test Child</span>
      </Desktop>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('has the desktop CSS class applied', () => {
    render(<Desktop />);
    const desktop = screen.getByTestId('desktop');
    // CSS Modules generates a unique class name containing 'desktop'
    expect(desktop.className).toContain('desktop');
  });
});
