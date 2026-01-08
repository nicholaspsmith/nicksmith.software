import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Resume } from '../Resume';

describe('Resume', () => {
  it('renders without crashing', () => {
    render(<Resume />);
    expect(screen.getByTestId('resume-content')).toBeInTheDocument();
  });

  it('displays the name', () => {
    render(<Resume />);
    expect(screen.getByText('Nick Smith')).toBeInTheDocument();
  });

  it('displays experience section', () => {
    render(<Resume />);
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
  });

  it('displays skills section', () => {
    render(<Resume />);
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText(/TypeScript, JavaScript/)).toBeInTheDocument();
  });

  it('displays education section', () => {
    render(<Resume />);
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('B.S. Computer Science')).toBeInTheDocument();
  });

  it('is scannable with clear section headers', () => {
    render(<Resume />);
    const headers = screen.getAllByRole('heading', { level: 2 });
    expect(headers.length).toBeGreaterThanOrEqual(3);
  });
});
