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

  it('renders page indicator with multiple dots', () => {
    render(<HomeScreen />);

    expect(screen.getByLabelText('Page 1 of 2')).toBeInTheDocument();
    // Should have 2 page dots
    const dots = screen.getAllByRole('button', { name: /Go to page/i });
    expect(dots).toHaveLength(2);
  });

  it('navigates between pages when page dots are clicked', () => {
    render(<HomeScreen />);

    const pagesTrack = screen.getByTestId('pages-track');
    expect(pagesTrack).toHaveStyle({ transform: 'translateX(-0%)' });

    // Click second page dot
    const page2Dot = screen.getByRole('button', { name: 'Go to page 2' });
    fireEvent.click(page2Dot);

    expect(pagesTrack).toHaveStyle({ transform: 'translateX(-100%)' });
    expect(screen.getByTestId('info-page')).toBeInTheDocument();
  });

  it('calls onAppTap when an app icon is clicked', () => {
    const handleAppTap = vi.fn();
    render(<HomeScreen onAppTap={handleAppTap} />);

    fireEvent.click(screen.getByTestId('ios-app-about'));

    expect(handleAppTap).toHaveBeenCalledWith('about');
  });

  it('navigates to app view when app icon is clicked', () => {
    render(<HomeScreen />);

    // Click about to navigate to Notes app
    fireEvent.click(screen.getByTestId('ios-app-about'));

    // Home screen should be gone, Notes app should be visible
    expect(screen.queryByTestId('ios-home-screen')).not.toBeInTheDocument();
    expect(screen.getByTestId('ios-notes-app')).toBeInTheDocument();
  });

  it('returns to home screen when back is clicked', () => {
    render(<HomeScreen />);

    // Navigate to an app
    fireEvent.click(screen.getByTestId('ios-app-projects'));
    expect(screen.getByTestId('ios-photos-app')).toBeInTheDocument();

    // Click back button
    const backButton = screen.getByRole('button', { name: /back|home/i });
    fireEvent.click(backButton);

    // Should be back on home screen
    expect(screen.getByTestId('ios-home-screen')).toBeInTheDocument();
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
