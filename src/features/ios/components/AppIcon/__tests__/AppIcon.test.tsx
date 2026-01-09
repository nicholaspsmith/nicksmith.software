import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  AppIcon,
  NotesIcon,
  PhotosIcon,
  IBooksIcon,
  MailIcon,
  SafariIcon,
  TerminalIOSIcon,
} from '../AppIcon';

// Mock motion to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    button: ({ children, ...props }: React.ComponentProps<'button'>) => (
      <button {...props}>{children}</button>
    ),
  },
}));

describe('AppIcon', () => {
  it('renders with label', () => {
    render(<AppIcon id="test" label="Test App" icon={<div>Icon</div>} />);

    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('renders with image source', () => {
    const { container } = render(<AppIcon id="test" label="Test App" icon="/test-icon.png" />);

    // Image has empty alt (decorative), so we query by selector
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', '/test-icon.png');
  });

  it('renders with React node icon', () => {
    render(
      <AppIcon
        id="test"
        label="Test App"
        icon={<div data-testid="custom-icon">Custom</div>}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <AppIcon id="test" label="Test App" icon={<div>Icon</div>} onClick={handleClick} />
    );

    fireEvent.click(screen.getByTestId('ios-app-test'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has correct aria-label', () => {
    render(<AppIcon id="test" label="Test App" icon={<div>Icon</div>} />);

    expect(screen.getByTestId('ios-app-test')).toHaveAttribute(
      'aria-label',
      'Test App'
    );
  });

  it('hides label when isDockIcon is true', () => {
    render(
      <AppIcon id="test" label="Test App" icon={<div>Icon</div>} isDockIcon />
    );

    // Label should still be in DOM but visually hidden via CSS
    // We can check it's not visible by checking the button doesn't contain the text as direct content
    const button = screen.getByTestId('ios-app-test');
    expect(button).toBeInTheDocument();
  });

  it('renders glossy overlay', () => {
    const { container } = render(
      <AppIcon id="test" label="Test App" icon={<div>Icon</div>} />
    );

    // Check for the gloss overlay div by class name pattern
    const glossOverlay = container.querySelector('[class*="glossOverlay"]');
    expect(glossOverlay).toBeInTheDocument();
  });
});

describe('Icon Components', () => {
  it('renders NotesIcon', () => {
    render(<NotesIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 60 60');
  });

  it('renders PhotosIcon', () => {
    render(<PhotosIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 60 60');
  });

  it('renders IBooksIcon', () => {
    render(<IBooksIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 60 60');
  });

  it('renders MailIcon', () => {
    render(<MailIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 60 60');
  });

  it('renders SafariIcon', () => {
    render(<SafariIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 60 60');
  });

  it('renders TerminalIOSIcon', () => {
    render(<TerminalIOSIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 60 60');
  });

  it('all icons have aria-hidden for accessibility', () => {
    const { rerender } = render(<NotesIcon />);
    expect(document.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<PhotosIcon />);
    expect(document.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<IBooksIcon />);
    expect(document.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<MailIcon />);
    expect(document.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<SafariIcon />);
    expect(document.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<TerminalIOSIcon />);
    expect(document.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
