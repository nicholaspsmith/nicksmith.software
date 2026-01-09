import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomeScreen } from '../HomeScreen';

// Mock motion to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    button: ({ children, ...props }: React.ComponentProps<'button'>) => (
      <button {...props}>{children}</button>
    ),
  },
}));

describe('HomeScreen', () => {
  it('renders the home screen container', () => {
    render(<HomeScreen />);

    expect(screen.getByTestId('ios-home-screen')).toBeInTheDocument();
  });

  it('renders the status bar', () => {
    render(<HomeScreen />);

    expect(screen.getByTestId('ios-status-bar')).toBeInTheDocument();
  });

  it('renders the dock', () => {
    render(<HomeScreen />);

    expect(screen.getByTestId('ios-dock')).toBeInTheDocument();
  });

  it('renders app icons on the home screen', () => {
    render(<HomeScreen />);

    // Check for main app icons (grid)
    expect(screen.getByTestId('ios-app-about')).toBeInTheDocument();
    expect(screen.getByTestId('ios-app-projects')).toBeInTheDocument();
    expect(screen.getByTestId('ios-app-resume')).toBeInTheDocument();
    expect(screen.getByTestId('ios-app-contact')).toBeInTheDocument();
    expect(screen.getByTestId('ios-app-safari')).toBeInTheDocument();
    expect(screen.getByTestId('ios-app-terminal')).toBeInTheDocument();
  });

  it('renders dock app icons separately', () => {
    render(<HomeScreen />);

    // Check for dock app icons (have dock- prefix)
    expect(screen.getByTestId('ios-app-dock-about')).toBeInTheDocument();
    expect(screen.getByTestId('ios-app-dock-resume')).toBeInTheDocument();
    expect(screen.getByTestId('ios-app-dock-contact')).toBeInTheDocument();
    expect(screen.getByTestId('ios-app-dock-safari')).toBeInTheDocument();
  });

  it('renders page indicator dot', () => {
    render(<HomeScreen />);

    expect(screen.getByLabelText('Page 1 of 1')).toBeInTheDocument();
  });

  it('calls onAppTap when an app icon is clicked', () => {
    const handleAppTap = vi.fn();
    render(<HomeScreen onAppTap={handleAppTap} />);

    fireEvent.click(screen.getByTestId('ios-app-about'));

    expect(handleAppTap).toHaveBeenCalledWith('about');
  });

  it('calls onAppTap with correct app id for each app', () => {
    const handleAppTap = vi.fn();
    render(<HomeScreen onAppTap={handleAppTap} />);

    // Click projects
    fireEvent.click(screen.getByTestId('ios-app-projects'));
    expect(handleAppTap).toHaveBeenCalledWith('projects');

    // Click resume (grid icon)
    fireEvent.click(screen.getByTestId('ios-app-resume'));
    expect(handleAppTap).toHaveBeenCalledWith('resume');

    // Click contact (grid icon)
    fireEvent.click(screen.getByTestId('ios-app-contact'));
    expect(handleAppTap).toHaveBeenCalledWith('contact');
  });

  it('calls onAppTap from dock icons too', () => {
    const handleAppTap = vi.fn();
    render(<HomeScreen onAppTap={handleAppTap} />);

    // Click dock resume
    fireEvent.click(screen.getByTestId('ios-app-dock-resume'));
    expect(handleAppTap).toHaveBeenCalledWith('resume');
  });

  it('renders app labels in grid', () => {
    render(<HomeScreen />);

    // Grid icons have labels
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Safari')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
  });

  it('has correct accessibility attributes on app icons', () => {
    render(<HomeScreen />);

    const aboutIcon = screen.getByTestId('ios-app-about');
    expect(aboutIcon).toHaveAttribute('aria-label', 'About');
  });
});
