import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutMe } from '../AboutMe';

describe('AboutMe', () => {
  it('renders without crashing', () => {
    render(<AboutMe />);
    expect(screen.getByTestId('about-me-content')).toBeInTheDocument();
  });

  it('displays the name', () => {
    render(<AboutMe />);
    expect(screen.getByText('Nick Smith')).toBeInTheDocument();
  });

  it('displays the title', () => {
    render(<AboutMe />);
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
  });

  it('displays bio paragraphs', () => {
    render(<AboutMe />);
    expect(screen.getByText(/frontend-focused engineer/i)).toBeInTheDocument();
  });

  it('displays highlights section', () => {
    render(<AboutMe />);
    expect(screen.getByText('Highlights')).toBeInTheDocument();
    expect(screen.getAllByText(/12\+ years/i).length).toBeGreaterThan(0);
  });

  it('has profile photo', () => {
    render(<AboutMe />);
    expect(screen.getByAltText('Nick Smith')).toBeInTheDocument();
  });
});
