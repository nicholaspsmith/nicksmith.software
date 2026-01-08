import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Projects } from '../Projects';

describe('Projects', () => {
  it('renders without crashing', () => {
    render(<Projects />);
    expect(screen.getByTestId('projects-content')).toBeInTheDocument();
  });

  it('displays the title', () => {
    render(<Projects />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('displays project cards', () => {
    render(<Projects />);
    expect(screen.getByTestId('project-card-tiger-portfolio')).toBeInTheDocument();
  });

  it('displays project technologies', () => {
    render(<Projects />);
    expect(screen.getByText('React')).toBeInTheDocument();
    // TypeScript appears in multiple projects, so use getAllByText
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0);
  });

  it('displays multiple projects', () => {
    render(<Projects />);
    const cards = screen.getAllByRole('article');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });
});
