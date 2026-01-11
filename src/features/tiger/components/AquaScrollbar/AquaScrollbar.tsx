import {
  useRef,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import styles from './AquaScrollbar.module.css';

interface AquaScrollbarProps {
  children: ReactNode;
  className?: string;
  /** Whether to auto-hide the scrollbar when not scrolling */
  autoHide?: boolean;
}

/**
 * AquaScrollbar - Custom Mac OS X Tiger-style scrollbar
 *
 * Wraps content with an Aqua-styled scrollbar featuring:
 * - Blue gel pill thumb with glossy highlight
 * - Striped track texture
 * - Smooth dragging and scroll sync
 */
export function AquaScrollbar({
  children,
  className = '',
  autoHide = false,
}: AquaScrollbarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbSize, setThumbSize] = useState(0);
  const [thumbPosition, setThumbPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(true);
  const dragStartRef = useRef({ y: 0, scrollTop: 0 });
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Calculate thumb size and position based on content
  const updateThumbMetrics = useCallback(() => {
    const content = contentRef.current;
    const container = containerRef.current;
    if (!content || !container) return;

    const { scrollHeight, clientHeight, scrollTop } = content;
    const trackHeight = container.clientHeight;

    // Calculate thumb size (minimum 30px for usability)
    const ratio = clientHeight / scrollHeight;
    const newThumbSize = Math.max(30, trackHeight * ratio);
    setThumbSize(newThumbSize);

    // Calculate thumb position
    const scrollRange = scrollHeight - clientHeight;
    const thumbRange = trackHeight - newThumbSize;
    const newPosition = scrollRange > 0 ? (scrollTop / scrollRange) * thumbRange : 0;
    setThumbPosition(newPosition);

    // Show/hide scrollbar based on whether content is scrollable
    setShowScrollbar(scrollHeight > clientHeight);
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    updateThumbMetrics();
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set timeout to detect scroll end
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [updateThumbMetrics]);

  // Handle thumb drag start
  const handleThumbMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const content = contentRef.current;
      if (!content) return;

      setIsDragging(true);
      dragStartRef.current = {
        y: e.clientY,
        scrollTop: content.scrollTop,
      };
    },
    []
  );

  // Handle track click (jump to position)
  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      const content = contentRef.current;
      const container = containerRef.current;
      const thumb = thumbRef.current;
      if (!content || !container || !thumb) return;

      // Don't process if clicking on thumb
      if (e.target === thumb) return;

      const rect = container.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const trackHeight = container.clientHeight;
      const { scrollHeight, clientHeight } = content;

      // Calculate new scroll position (center thumb at click point)
      const thumbCenter = clickY - thumbSize / 2;
      const thumbRange = trackHeight - thumbSize;
      const scrollRange = scrollHeight - clientHeight;
      const newScrollTop = (thumbCenter / thumbRange) * scrollRange;

      content.scrollTop = Math.max(0, Math.min(scrollRange, newScrollTop));
    },
    [thumbSize]
  );

  // Handle mouse move during drag
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const content = contentRef.current;
      const container = containerRef.current;
      if (!content || !container) return;

      const deltaY = e.clientY - dragStartRef.current.y;
      const trackHeight = container.clientHeight;
      const { scrollHeight, clientHeight } = content;

      const thumbRange = trackHeight - thumbSize;
      const scrollRange = scrollHeight - clientHeight;
      const scrollDelta = (deltaY / thumbRange) * scrollRange;

      content.scrollTop = dragStartRef.current.scrollTop + scrollDelta;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, thumbSize]);

  // Initial calculation and resize observer
  useEffect(() => {
    updateThumbMetrics();

    const content = contentRef.current;
    if (!content) return;

    // Listen for scroll events
    content.addEventListener('scroll', handleScroll);

    // Observe content size changes
    const resizeObserver = new ResizeObserver(() => {
      updateThumbMetrics();
    });
    resizeObserver.observe(content);

    return () => {
      content.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, updateThumbMetrics]);

  const isVisible = showScrollbar && (!autoHide || isDragging || isScrolling);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div
        ref={contentRef}
        className={styles.content}
        data-aqua-scroll-content
      >
        {children}
      </div>
      {showScrollbar && (
        <div
          ref={containerRef}
          className={`${styles.track} ${isVisible ? styles.visible : styles.hidden}`}
          onClick={handleTrackClick}
        >
          <div
            ref={thumbRef}
            className={`${styles.thumb} ${isDragging ? styles.dragging : ''}`}
            style={{
              height: `${thumbSize}px`,
              transform: `translateY(${thumbPosition}px)`,
            }}
            onMouseDown={handleThumbMouseDown}
          />
        </div>
      )}
    </div>
  );
}
