import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhotosApp } from '../PhotosApp';

describe('PhotosApp', () => {
  it('renders the photos app container', () => {
    render(<PhotosApp onBack={() => {}} />);

    expect(screen.getByTestId('ios-photos-app')).toBeInTheDocument();
  });

  it('renders navigation bar with Projects title', () => {
    render(<PhotosApp onBack={() => {}} />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('renders project cards', () => {
    render(<PhotosApp onBack={() => {}} />);

    expect(screen.getByText('This Portfolio')).toBeInTheDocument();
    expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
    expect(screen.getByText('Design System')).toBeInTheDocument();
    expect(screen.getByText('API Platform')).toBeInTheDocument();
  });

  it('renders project descriptions', () => {
    render(<PhotosApp onBack={() => {}} />);

    expect(screen.getByText(/Mac OS X Tiger/)).toBeInTheDocument();
    expect(screen.getByText(/Real-time data visualization/)).toBeInTheDocument();
  });

  it('renders tech stack tags', () => {
    render(<PhotosApp onBack={() => {}} />);

    // Check for various tech tags
    expect(screen.getAllByText('React').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0);
  });

  it('calls onBack when back button is clicked', () => {
    const handleBack = vi.fn();
    render(<PhotosApp onBack={handleBack} />);

    fireEvent.click(screen.getByTestId('ios-nav-back'));

    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('renders navigation bar', () => {
    render(<PhotosApp onBack={() => {}} />);

    expect(screen.getByTestId('ios-nav-bar')).toBeInTheDocument();
  });

  it('renders all six projects', () => {
    render(<PhotosApp onBack={() => {}} />);

    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Mobile App')).toBeInTheDocument();
  });
});
