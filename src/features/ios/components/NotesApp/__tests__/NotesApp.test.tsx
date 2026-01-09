import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotesApp } from '../NotesApp';

describe('NotesApp', () => {
  it('renders the notes app container', () => {
    render(<NotesApp onBack={() => {}} />);

    expect(screen.getByTestId('ios-notes-app')).toBeInTheDocument();
  });

  it('renders navigation bar with About Me title', () => {
    render(<NotesApp onBack={() => {}} />);

    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  it('renders the greeting heading', () => {
    render(<NotesApp onBack={() => {}} />);

    expect(screen.getByRole('heading', { name: /Hello/i })).toBeInTheDocument();
  });

  it('renders the title/role', () => {
    render(<NotesApp onBack={() => {}} />);

    expect(screen.getByText(/frontend engineer/i)).toBeInTheDocument();
  });

  it('renders about me content', () => {
    render(<NotesApp onBack={() => {}} />);

    expect(screen.getByText(/passionate about/i)).toBeInTheDocument();
  });

  it('renders What I Do section', () => {
    render(<NotesApp onBack={() => {}} />);

    expect(screen.getByText('What I Do')).toBeInTheDocument();
    expect(screen.getByText(/React & TypeScript/)).toBeInTheDocument();
    expect(screen.getByText(/Frontend Architecture/)).toBeInTheDocument();
  });

  it('renders list items', () => {
    render(<NotesApp onBack={() => {}} />);

    expect(screen.getByText('Performance Optimization')).toBeInTheDocument();
    expect(screen.getByText('Design Systems')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const handleBack = vi.fn();
    render(<NotesApp onBack={handleBack} />);

    fireEvent.click(screen.getByTestId('ios-nav-back'));

    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('renders navigation bar', () => {
    render(<NotesApp onBack={() => {}} />);

    expect(screen.getByTestId('ios-nav-bar')).toBeInTheDocument();
  });
});
