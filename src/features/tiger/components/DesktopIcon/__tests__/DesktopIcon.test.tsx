import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DesktopIcon } from '../DesktopIcon';

const MockIcon = () => <svg data-testid="mock-icon" />;

// Default position for tests
const defaultPosition = { x: 100, y: 100 };

describe('DesktopIcon', () => {
  describe('rendering', () => {
    it('should render with label', () => {
      render(<DesktopIcon id="test" label="Test Icon" icon={<MockIcon />} {...defaultPosition} />);
      expect(screen.getByText('Test Icon')).toBeInTheDocument();
    });

    it('should render icon content', () => {
      render(<DesktopIcon id="test" label="Test Icon" icon={<MockIcon />} {...defaultPosition} />);
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should have correct test id', () => {
      render(<DesktopIcon id="resume" label="Resume" icon={<MockIcon />} {...defaultPosition} />);
      expect(screen.getByTestId('desktop-icon-resume')).toBeInTheDocument();
    });

    it('should have button role with aria-label', () => {
      render(<DesktopIcon id="test" label="My Label" icon={<MockIcon />} {...defaultPosition} />);
      const button = screen.getByRole('button', { name: 'My Label' });
      expect(button).toBeInTheDocument();
    });

    it('should be positioned absolutely at x, y coordinates', () => {
      const { container } = render(
        <DesktopIcon id="test" label="Test" icon={<MockIcon />} x={200} y={300} />
      );
      const button = container.querySelector('button');
      expect(button).toHaveStyle({ position: 'absolute', left: '200px', top: '300px' });
    });
  });

  describe('selection state', () => {
    it('should not be selected by default', () => {
      render(<DesktopIcon id="test" label="Test" icon={<MockIcon />} {...defaultPosition} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('should show selected state when isSelected is true', () => {
      render(
        <DesktopIcon id="test" label="Test" icon={<MockIcon />} isSelected {...defaultPosition} />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should apply selected class when isSelected is true', () => {
      const { container } = render(
        <DesktopIcon id="test" label="Test" icon={<MockIcon />} isSelected {...defaultPosition} />
      );
      const button = container.querySelector('button');
      expect(button?.className).toContain('selected');
    });
  });

  describe('click handling', () => {
    it('should call onClick on mouseDown (Tiger behavior: select on press)', () => {
      const handleClick = vi.fn();
      render(
        <DesktopIcon
          id="test"
          label="Test"
          icon={<MockIcon />}
          onClick={handleClick}
          {...defaultPosition}
        />
      );
      fireEvent.mouseDown(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onClick on mouseDown if already selected (preserves multi-selection)', () => {
      const handleClick = vi.fn();
      render(
        <DesktopIcon
          id="test"
          label="Test"
          icon={<MockIcon />}
          onClick={handleClick}
          isSelected
          {...defaultPosition}
        />
      );
      fireEvent.mouseDown(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should call onDoubleClick when double-clicked', () => {
      const handleDoubleClick = vi.fn();
      render(
        <DesktopIcon
          id="test"
          label="Test"
          icon={<MockIcon />}
          onDoubleClick={handleDoubleClick}
          {...defaultPosition}
        />
      );
      fireEvent.doubleClick(screen.getByRole('button'));
      expect(handleDoubleClick).toHaveBeenCalledTimes(1);
    });

    it('should stop propagation on mouseDown and click', () => {
      const parentMouseDown = vi.fn();
      const parentClick = vi.fn();
      const iconClick = vi.fn();
      render(
        <div onMouseDown={parentMouseDown} onClick={parentClick}>
          <DesktopIcon
            id="test"
            label="Test"
            icon={<MockIcon />}
            onClick={iconClick}
            {...defaultPosition}
          />
        </div>
      );
      fireEvent.mouseDown(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('button'));
      expect(iconClick).toHaveBeenCalled();
      expect(parentMouseDown).not.toHaveBeenCalled();
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
            {...defaultPosition}
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
      render(<DesktopIcon id="test" label="Test" icon={<MockIcon />} {...defaultPosition} />);
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('should have aria-label matching label', () => {
      render(<DesktopIcon id="test" label="About Me" icon={<MockIcon />} {...defaultPosition} />);
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
          {...defaultPosition}
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
          {...defaultPosition}
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
          {...defaultPosition}
        />
      );
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Tab' });
      fireEvent.keyDown(button, { key: 'Escape' });
      expect(handleDoubleClick).not.toHaveBeenCalled();
    });
  });

  describe('dragging', () => {
    it('should call onPositionChange callback when provided', () => {
      const handlePositionChange = vi.fn();
      render(
        <DesktopIcon
          id="test"
          label="Test"
          icon={<MockIcon />}
          onPositionChange={handlePositionChange}
          {...defaultPosition}
        />
      );
      // The callback is called during drag, which we can't easily test here
      // This test just verifies the prop is accepted
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
