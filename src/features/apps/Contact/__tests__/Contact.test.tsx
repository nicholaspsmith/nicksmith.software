import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Contact } from '../Contact';

describe('Contact', () => {
  it('renders without crashing', () => {
    render(<Contact />);
    expect(screen.getByTestId('contact-content')).toBeInTheDocument();
  });

  it('displays the title', () => {
    render(<Contact />);
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
  });

  it('displays email link', () => {
    render(<Contact />);
    const emailLink = screen.getByRole('link', { name: /email/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:me@nicksmith.software');
  });

  it('displays LinkedIn link', () => {
    render(<Contact />);
    const linkedInLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedInLink).toHaveAttribute(
      'href',
      'https://linkedin.com/in/nicksmith'
    );
  });

  it('displays GitHub link', () => {
    render(<Contact />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/nicholaspsmith');
  });

  it('links open in new tab', () => {
    render(<Contact />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
