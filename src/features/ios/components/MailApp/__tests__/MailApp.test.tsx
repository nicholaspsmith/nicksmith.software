import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MailApp } from '../MailApp';

describe('MailApp', () => {
  it('renders the mail app container', () => {
    render(<MailApp onBack={() => {}} />);

    expect(screen.getByTestId('ios-mail-app')).toBeInTheDocument();
  });

  it('renders navigation bar with Contact title', () => {
    render(<MailApp onBack={() => {}} />);

    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders email field', () => {
    render(<MailApp onBack={() => {}} />);

    expect(screen.getByText('To:')).toBeInTheDocument();
    expect(screen.getByText('nick@example.com')).toBeInTheDocument();
  });

  it('renders LinkedIn field', () => {
    render(<MailApp onBack={() => {}} />);

    expect(screen.getByText('Cc:')).toBeInTheDocument();
    expect(screen.getByText('linkedin.com/in/nicksmith')).toBeInTheDocument();
  });

  it('renders GitHub field', () => {
    render(<MailApp onBack={() => {}} />);

    expect(screen.getByText('Bcc:')).toBeInTheDocument();
    expect(screen.getByText('github.com/nicksmith')).toBeInTheDocument();
  });

  it('renders subject field', () => {
    render(<MailApp onBack={() => {}} />);

    expect(screen.getByText('Subject:')).toBeInTheDocument();
    expect(screen.getByText("Let's Connect!")).toBeInTheDocument();
  });

  it('renders message body content', () => {
    render(<MailApp onBack={() => {}} />);

    expect(screen.getByText(/Thanks for visiting/)).toBeInTheDocument();
    expect(screen.getByText(/respond within 24-48 hours/)).toBeInTheDocument();
  });

  it('renders quick links section', () => {
    render(<MailApp onBack={() => {}} />);

    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText(/Send Email/)).toBeInTheDocument();
    expect(screen.getByText(/LinkedIn Profile/)).toBeInTheDocument();
    expect(screen.getByText(/GitHub Profile/)).toBeInTheDocument();
    expect(screen.getByText(/Download Resume/)).toBeInTheDocument();
  });

  it('renders email link with correct href', () => {
    render(<MailApp onBack={() => {}} />);

    const emailLinks = screen.getAllByRole('link', { name: /email|nick@example/i });
    expect(emailLinks.some(link => link.getAttribute('href') === 'mailto:nick@example.com')).toBe(true);
  });

  it('renders LinkedIn link with correct href', () => {
    render(<MailApp onBack={() => {}} />);

    const linkedInLinks = screen.getAllByRole('link', { name: /linkedin/i });
    expect(linkedInLinks.some(link => link.getAttribute('href') === 'https://linkedin.com/in/nicksmith')).toBe(true);
  });

  it('renders GitHub link with correct href', () => {
    render(<MailApp onBack={() => {}} />);

    const githubLinks = screen.getAllByRole('link', { name: /github/i });
    expect(githubLinks.some(link => link.getAttribute('href') === 'https://github.com/nicksmith')).toBe(true);
  });

  it('renders signature', () => {
    render(<MailApp onBack={() => {}} />);

    expect(screen.getByText(/Best regards/)).toBeInTheDocument();
    expect(screen.getByText('Nick Smith')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const handleBack = vi.fn();
    render(<MailApp onBack={handleBack} />);

    fireEvent.click(screen.getByTestId('ios-nav-back'));

    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('renders Send button in navigation', () => {
    render(<MailApp onBack={() => {}} />);

    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('renders navigation bar', () => {
    render(<MailApp onBack={() => {}} />);

    expect(screen.getByTestId('ios-nav-bar')).toBeInTheDocument();
  });
});
