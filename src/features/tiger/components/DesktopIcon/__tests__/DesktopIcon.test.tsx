import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DesktopIcon } from '../DesktopIcon';

const MockIcon = () => <svg data-testid="mock-icon" />;

describe('DesktopIcon', () => {
  describe('rendering', () => {
    it('should render with label', () => {
      render(<DesktopIcon id="test" label="Test Icon" icon={<MockIcon />} />);
      expect(screen.getByText('Test Icon')).toBeInTheDocument();
    });

    it('should render icon content', () => {
      render(<DesktopIcon id="test" label="Test Icon" icon={<MockIcon />} />);
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should have correct test id', () => {
      render(<DesktopIcon id="resume" label="Resume" icon={<MockIcon />} />);
      expect(screen.getByTestId('desktop-icon-resume')).toBeInTheDocument();
    });

    it('should have button role with aria-label', () => {
      render(<DesktopIcon id="test" label="My Label" icon={<MockIcon />} />);
      const button = screen.getByRole('button', { name: 'My Label' });
      expect(button).toBeInTheDocument();
    });
  });

  describe('selection state', () => {
    it('should not be selected by default', () => {
      render(<DesktopIcon id="test" label="Test" icon={<MockIcon />} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('should show selected state when isSelected is true', () => {
      render(
        <DesktopIcon id="test" label="Test" icon={<MockIcon />} isSelected />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should apply selected class when isSelected is true', () => {
      const { container } = render(
        <DesktopIcon id="test" label="Test" icon={<MockIcon />} isSelected />
      );
      const button = container.querySelector('button');
      expect(button?.className).toContain('selected');
    });
  });

  describe('click handling', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(
        <DesktopIcon
          id="test"
          label="Test"
          icon={<MockIcon />}
          onClick={handleClick}
        />
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onDoubleClick when double-clicked', () => {
      const handleDoubleClick = vi.fn();
      render(
        <DesktopIcon
          id="test"
          label="Test"
          icon={<MockIcon />}
          onDoubleClick={handleDoubleClick}
        />
      );
      fireEvent.doubleClick(screen.getByRole('button'));
      expect(handleDoubleClick).toHaveBeenCalledTimes(1);
    });

    it('should stop propagation on click', () => {
      const parentClick = vi.fn();
      const iconClick = vi.fn();
      render(
        <div onClick={parentClick}>
          <DesktopIcon
            id="test"
            label="Test"
            icon={<MockIcon />}
            onClick={iconClick}
          />
        </div>
      );
      fireEvent.click(screen.getByRole('button'));
      expect(iconClick).toHaveBeenCalled();
      expect(parentClick).not.toHaveBeenCalled();
    });

    it('should stop propagation on double-click', () => {
      const parentClick = vi.fn();
      const iconDoubleClick = vi.fn();
      render(
        <div onDoubleClick={parentClick}>
          <DesktopIcon
            id="test"
            label="Test"
            icon={<MockIcon />}
            onDoubleClick={iconDoubleClick}
          />
        </div>
      );
      fireEvent.doubleClick(screen.getByRole('button'));
      expect(iconDoubleClick).toHaveBeenCalled();
      expect(parentClick).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should be focusable', () => {
      render(<DesktopIcon id="test" label="Test" icon={<MockIcon />} />);
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('should have aria-label matching label', () => {
      render(<DesktopIcon id="test" label="About Me" icon={<MockIcon />} />);
      expect(screen.getByLabelText('About Me')).toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('should trigger onDoubleClick when Enter is pressed', () => {
      const handleDoubleClick = vi.fn();
      render(
        <DesktopIcon
          id="test"
          label="Test"
          icon={<MockIcon />}
          onDoubleClick={handleDoubleClick}
        />
      );
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(handleDoubleClick).toHaveBeenCalledTimes(1);
    });

    it('should NOT trigger onDoubleClick when Space is pressed (Tiger behavior)', () => {
      const handleDoubleClick = vi.fn();
      render(
        <DesktopIcon
          id="test"
          label="Test"
          icon={<MockIcon />}
          onDoubleClick={handleDoubleClick}
        />
      );
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: ' ' });
      expect(handleDoubleClick).not.toHaveBeenCalled();
    });

    it('should not trigger onDoubleClick for other keys', () => {
      const handleDoubleClick = vi.fn();
      render(
        <DesktopIcon
          id="test"
          label="Test"
          icon={<MockIcon />}
          onDoubleClick={handleDoubleClick}
        />
      );
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Tab' });
      fireEvent.keyDown(button, { key: 'Escape' });
      expect(handleDoubleClick).not.toHaveBeenCalled();
    });
  });
});
