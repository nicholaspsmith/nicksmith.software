import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavigationBar } from '../NavigationBar';

describe('NavigationBar', () => {
  it('renders with title', () => {
    render(<NavigationBar title="Test Title" onBack={() => {}} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders back button with default label', () => {
    render(<NavigationBar title="Test" onBack={() => {}} />);

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('renders back button with custom label', () => {
    render(<NavigationBar title="Test" backLabel="Home" onBack={() => {}} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const handleBack = vi.fn();
    render(<NavigationBar title="Test" onBack={handleBack} />);

    fireEvent.click(screen.getByTestId('ios-nav-back'));

    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('renders right action button when provided', () => {
    const handleRightAction = vi.fn();
    render(
      <NavigationBar
        title="Test"
        onBack={() => {}}
        rightLabel="Send"
        onRightAction={handleRightAction}
      />
    );

    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('calls onRightAction when right button is clicked', () => {
    const handleRightAction = vi.fn();
    render(
      <NavigationBar
        title="Test"
        onBack={() => {}}
        rightLabel="Done"
        onRightAction={handleRightAction}
      />
    );

    fireEvent.click(screen.getByTestId('ios-nav-right'));

    expect(handleRightAction).toHaveBeenCalledTimes(1);
  });

  it('does not render right button when no rightLabel provided', () => {
    render(<NavigationBar title="Test" onBack={() => {}} />);

    expect(screen.queryByTestId('ios-nav-right')).not.toBeInTheDocument();
  });

  it('applies blue variant by default', () => {
    render(<NavigationBar title="Test" onBack={() => {}} />);

    const navBar = screen.getByTestId('ios-nav-bar');
    expect(navBar).toHaveAttribute('data-variant', 'blue');
  });

  it('applies wood variant', () => {
    render(<NavigationBar title="Test" onBack={() => {}} variant="wood" />);

    const navBar = screen.getByTestId('ios-nav-bar');
    expect(navBar).toHaveAttribute('data-variant', 'wood');
  });

  it('applies gray variant', () => {
    render(<NavigationBar title="Test" onBack={() => {}} variant="gray" />);

    const navBar = screen.getByTestId('ios-nav-bar');
    expect(navBar).toHaveAttribute('data-variant', 'gray');
  });

  it('has correct accessibility structure', () => {
    render(<NavigationBar title="Test Title" onBack={() => {}} />);

    // Title should be an h1
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Title');
    // Back button should be accessible
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });
});
