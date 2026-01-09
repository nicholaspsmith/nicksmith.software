import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IBooksApp } from '../IBooksApp';

describe('IBooksApp', () => {
  it('renders the ibooks app container', () => {
    render(<IBooksApp onBack={() => {}} />);

    expect(screen.getByTestId('ios-ibooks-app')).toBeInTheDocument();
  });

  it('renders navigation bar with Resume title', () => {
    render(<IBooksApp onBack={() => {}} />);

    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('renders name in header', () => {
    render(<IBooksApp onBack={() => {}} />);

    expect(screen.getByRole('heading', { name: /Nick Smith/i })).toBeInTheDocument();
  });

  it('renders job title', () => {
    render(<IBooksApp onBack={() => {}} />);

    // The text appears in both header and experience sections
    const titles = screen.getAllByText('Senior Frontend Engineer');
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it('renders summary section', () => {
    render(<IBooksApp onBack={() => {}} />);

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText(/8\+ years of experience/)).toBeInTheDocument();
  });

  it('renders experience section with jobs', () => {
    render(<IBooksApp onBack={() => {}} />);

    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Tech Company Inc.')).toBeInTheDocument();
    expect(screen.getByText('Startup Co.')).toBeInTheDocument();
  });

  it('renders job achievements', () => {
    render(<IBooksApp onBack={() => {}} />);

    expect(screen.getByText(/Led frontend architecture/)).toBeInTheDocument();
    expect(screen.getByText(/Improved performance by 40%/)).toBeInTheDocument();
  });

  it('renders skills section', () => {
    render(<IBooksApp onBack={() => {}} />);

    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('renders education section', () => {
    render(<IBooksApp onBack={() => {}} />);

    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('B.S. Computer Science')).toBeInTheDocument();
    expect(screen.getByText('University of Technology')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const handleBack = vi.fn();
    render(<IBooksApp onBack={handleBack} />);

    fireEvent.click(screen.getByTestId('ios-nav-back'));

    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('renders navigation bar', () => {
    render(<IBooksApp onBack={() => {}} />);

    expect(screen.getByTestId('ios-nav-bar')).toBeInTheDocument();
  });
});
