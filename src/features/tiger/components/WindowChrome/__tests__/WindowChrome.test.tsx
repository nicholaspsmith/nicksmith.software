import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WindowChrome } from '../WindowChrome';

describe('WindowChrome', () => {
  it('renders without crashing', () => {
    render(<WindowChrome title="Test Window" isFocused={true} />);
    expect(screen.getByTestId('window-chrome')).toBeInTheDocument();
  });

  it('displays the window title', () => {
    render(<WindowChrome title="My App" isFocused={true} />);
    expect(screen.getByTestId('window-title')).toHaveTextContent('My App');
  });

  it('applies focused class when isFocused is true', () => {
    render(<WindowChrome title="Test" isFocused={true} />);
    const titleBar = screen.getByTestId('title-bar');
    expect(titleBar.className).toContain('focused');
    expect(titleBar.className).not.toContain('unfocused');
  });

  it('applies unfocused class when isFocused is false', () => {
    render(<WindowChrome title="Test" isFocused={false} />);
    const titleBar = screen.getByTestId('title-bar');
    expect(titleBar.className).toContain('unfocused');
  });

  it('renders children when provided', () => {
    render(
      <WindowChrome title="Test" isFocused={true}>
        <span data-testid="child-content">Content</span>
      </WindowChrome>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('applies custom className to title bar', () => {
    render(
      <WindowChrome title="Test" isFocused={true} className="custom-drag" />
    );
    const titleBar = screen.getByTestId('title-bar');
    expect(titleBar.className).toContain('custom-drag');
  });

  it('has the titleBar class applied', () => {
    render(<WindowChrome title="Test" isFocused={true} />);
    const titleBar = screen.getByTestId('title-bar');
    expect(titleBar.className).toContain('titleBar');
  });
});
