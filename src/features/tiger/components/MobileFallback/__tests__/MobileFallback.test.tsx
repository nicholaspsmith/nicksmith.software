import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MobileFallback } from '../MobileFallback';

describe('MobileFallback', () => {
  it('renders without crashing', () => {
    render(<MobileFallback />);
    expect(screen.getByTestId('mobile-fallback')).toBeInTheDocument();
  });

  it('displays the title', () => {
    render(<MobileFallback />);
    expect(screen.getByText('Best on Desktop')).toBeInTheDocument();
  });

  it('has dialog role with aria-labelledby', () => {
    render(<MobileFallback />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'mobile-fallback-title');
  });

  it('displays email link', () => {
    render(<MobileFallback />);
    const emailLink = screen.getByTestId('fallback-email');
    expect(emailLink).toHaveAttribute('href', 'mailto:me@nicksmith.software');
  });

  it('displays LinkedIn link with target="_blank"', () => {
    render(<MobileFallback />);
    const linkedInLink = screen.getByTestId('fallback-linkedin');
    expect(linkedInLink).toHaveAttribute('href', 'https://linkedin.com/in/nps90');
    expect(linkedInLink).toHaveAttribute('target', '_blank');
    expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays resume download link', () => {
    render(<MobileFallback />);
    const resumeLink = screen.getByTestId('fallback-resume');
    expect(resumeLink).toHaveAttribute('href', '/resume.pdf');
    expect(resumeLink).toHaveAttribute('download');
  });

  it('displays hint message', () => {
    render(<MobileFallback />);
    expect(screen.getByText(/Visit on a desktop/i)).toBeInTheDocument();
  });
});
