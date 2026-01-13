import {
  useRef,
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
} from 'react';
import styles from './AquaScrollbar.module.css';

interface AquaScrollbarProps {
  children: ReactNode;
  className?: string;
  /** Whether to auto-hide the scrollbar when not scrolling */
  autoHide?: boolean;
  /** Event handlers to forward to the content element */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
  /** Data-testid for the wrapper element (used for drop detection) */
  'data-testid'?: string;
}

export interface AquaScrollbarHandle {
  /** Access the scrollable content element */
  getContentElement: () => HTMLDivElement | null;
}

/**
 * AquaScrollbar - Custom Mac OS X Tiger-style scrollbar
 *
 * Wraps content with Aqua-styled scrollbars featuring:
 * - Blue gel pill thumb with glossy highlight
 * - Striped track texture
 * - Smooth dragging and scroll sync
 * - Both vertical and horizontal scrollbars
 */
export const AquaScrollbar = forwardRef<AquaScrollbarHandle, AquaScrollbarProps>(function AquaScrollbar({
  children,
  className = '',
  autoHide = false,
  onClick,
  onMouseDown,
  onContextMenu,
  'data-testid': dataTestId,
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const vThumbRef = useRef<HTMLDivElement>(null);
  const hThumbRef = useRef<HTMLDivElement>(null);

  // Vertical scrollbar state
  const [vThumbSize, setVThumbSize] = useState(0);
  const [vThumbPosition, setVThumbPosition] = useState(0);
  const [showVScrollbar, setShowVScrollbar] = useState(false);

  // Horizontal scrollbar state
  const [hThumbSize, setHThumbSize] = useState(0);
  const [hThumbPosition, setHThumbPosition] = useState(0);
  const [showHScrollbar, setShowHScrollbar] = useState(false);

  // Shared state
  const [isDragging, setIsDragging] = useState<'vertical' | 'horizontal' | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const dragStartRef = useRef({ pos: 0, scrollPos: 0 });
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Calculate thumb sizes and positions based on content
  const updateThumbMetrics = useCallback(() => {
    const content = contentRef.current;
    const container = containerRef.current;
    if (!content || !container) return;

    const { scrollHeight, scrollWidth, clientHeight, clientWidth, scrollTop, scrollLeft } = content;

    // Vertical scrollbar metrics
    const hasVScroll = scrollHeight > clientHeight;
    setShowVScrollbar(hasVScroll);
    if (hasVScroll) {
      const trackHeight = container.clientHeight - (scrollWidth > clientWidth ? 15 : 0);
      const vRatio = clientHeight / scrollHeight;
      const newVThumbSize = Math.max(30, trackHeight * vRatio);
      setVThumbSize(newVThumbSize);

      const vScrollRange = scrollHeight - clientHeight;
      const vThumbRange = trackHeight - newVThumbSize;
      const newVPosition = vScrollRange > 0 ? (scrollTop / vScrollRange) * vThumbRange : 0;
      setVThumbPosition(newVPosition);
    }

    // Horizontal scrollbar metrics
    const hasHScroll = scrollWidth > clientWidth;
    setShowHScrollbar(hasHScroll);
    if (hasHScroll) {
      const trackWidth = container.clientWidth - (scrollHeight > clientHeight ? 15 : 0);
      const hRatio = clientWidth / scrollWidth;
      const newHThumbSize = Math.max(30, trackWidth * hRatio);
      setHThumbSize(newHThumbSize);

      const hScrollRange = scrollWidth - clientWidth;
      const hThumbRange = trackWidth - newHThumbSize;
      const newHPosition = hScrollRange > 0 ? (scrollLeft / hScrollRange) * hThumbRange : 0;
      setHThumbPosition(newHPosition);
    }
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    updateThumbMetrics();
    setIsScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [updateThumbMetrics]);

  // Handle vertical thumb drag start
  const handleVThumbMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const content = contentRef.current;
    if (!content) return;

    setIsDragging('vertical');
    dragStartRef.current = {
      pos: e.clientY,
      scrollPos: content.scrollTop,
    };
  }, []);

  // Handle horizontal thumb drag start
  const handleHThumbMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const content = contentRef.current;
    if (!content) return;

    setIsDragging('horizontal');
    dragStartRef.current = {
      pos: e.clientX,
      scrollPos: content.scrollLeft,
    };
  }, []);

  // Handle vertical track click
  const handleVTrackClick = useCallback(
    (e: React.MouseEvent) => {
      const content = contentRef.current;
      const container = containerRef.current;
      const thumb = vThumbRef.current;
      if (!content || !container || !thumb || e.target === thumb) return;

      const rect = container.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const trackHeight = container.clientHeight - (showHScrollbar ? 15 : 0);
      const { scrollHeight, clientHeight } = content;

      const thumbCenter = clickY - vThumbSize / 2;
      const thumbRange = trackHeight - vThumbSize;
      const scrollRange = scrollHeight - clientHeight;
      const newScrollTop = (thumbCenter / thumbRange) * scrollRange;

      content.scrollTop = Math.max(0, Math.min(scrollRange, newScrollTop));
    },
    [vThumbSize, showHScrollbar]
  );

  // Handle horizontal track click
  const handleHTrackClick = useCallback(
    (e: React.MouseEvent) => {
      const content = contentRef.current;
      const container = containerRef.current;
      const thumb = hThumbRef.current;
      if (!content || !container || !thumb || e.target === thumb) return;

      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const trackWidth = container.clientWidth - (showVScrollbar ? 15 : 0);
      const { scrollWidth, clientWidth } = content;

      const thumbCenter = clickX - hThumbSize / 2;
      const thumbRange = trackWidth - hThumbSize;
      const scrollRange = scrollWidth - clientWidth;
      const newScrollLeft = (thumbCenter / thumbRange) * scrollRange;

      content.scrollLeft = Math.max(0, Math.min(scrollRange, newScrollLeft));
    },
    [hThumbSize, showVScrollbar]
  );

  // Handle mouse move during drag
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const content = contentRef.current;
      const container = containerRef.current;
      if (!content || !container) return;

      if (isDragging === 'vertical') {
        const deltaY = e.clientY - dragStartRef.current.pos;
        const trackHeight = container.clientHeight - (showHScrollbar ? 15 : 0);
        const { scrollHeight, clientHeight } = content;

        const thumbRange = trackHeight - vThumbSize;
        const scrollRange = scrollHeight - clientHeight;
        const scrollDelta = (deltaY / thumbRange) * scrollRange;

        content.scrollTop = dragStartRef.current.scrollPos + scrollDelta;
      } else {
        const deltaX = e.clientX - dragStartRef.current.pos;
        const trackWidth = container.clientWidth - (showVScrollbar ? 15 : 0);
        const { scrollWidth, clientWidth } = content;

        const thumbRange = trackWidth - hThumbSize;
        const scrollRange = scrollWidth - clientWidth;
        const scrollDelta = (deltaX / thumbRange) * scrollRange;

        content.scrollLeft = dragStartRef.current.scrollPos + scrollDelta;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, vThumbSize, hThumbSize, showVScrollbar, showHScrollbar]);

  // Initial calculation and resize observer
  useEffect(() => {
    updateThumbMetrics();

    const content = contentRef.current;
    if (!content) return;

    content.addEventListener('scroll', handleScroll);

    const resizeObserver = new ResizeObserver(() => {
      updateThumbMetrics();
    });
    resizeObserver.observe(content);

    // Also observe children for size changes
    const mutationObserver = new MutationObserver(() => {
      updateThumbMetrics();
    });
    mutationObserver.observe(content, { childList: true, subtree: true });

    return () => {
      content.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, updateThumbMetrics]);

  const isVisible = !autoHide || isDragging || isScrolling;

  // Expose content element to parent via ref
  useImperativeHandle(ref, () => ({
    getContentElement: () => contentRef.current,
  }), []);

  return (
    <div ref={containerRef} className={`${styles.wrapper} ${className}`} data-testid={dataTestId}>
      <div
        ref={contentRef}
        className={styles.content}
        style={{
          paddingRight: showVScrollbar ? 15 : 0,
          paddingBottom: showHScrollbar ? 15 : 0,
        }}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onContextMenu={onContextMenu}
        data-aqua-scroll-content
      >
        {children}
      </div>

      {/* Vertical scrollbar */}
      {showVScrollbar && (
        <div
          className={`${styles.vTrack} ${isVisible ? styles.visible : styles.hidden}`}
          style={{ bottom: showHScrollbar ? 15 : 0 }}
          onClick={handleVTrackClick}
        >
          <div
            ref={vThumbRef}
            className={`${styles.vThumb} ${isDragging === 'vertical' ? styles.dragging : ''}`}
            style={{
              height: `${vThumbSize}px`,
              transform: `translateY(${vThumbPosition}px)`,
            }}
            onMouseDown={handleVThumbMouseDown}
          />
        </div>
      )}

      {/* Horizontal scrollbar */}
      {showHScrollbar && (
        <div
          className={`${styles.hTrack} ${isVisible ? styles.visible : styles.hidden}`}
          style={{ right: showVScrollbar ? 15 : 0 }}
          onClick={handleHTrackClick}
        >
          <div
            ref={hThumbRef}
            className={`${styles.hThumb} ${isDragging === 'horizontal' ? styles.dragging : ''}`}
            style={{
              width: `${hThumbSize}px`,
              transform: `translateX(${hThumbPosition}px)`,
            }}
            onMouseDown={handleHThumbMouseDown}
          />
        </div>
      )}

      {/* Corner piece when both scrollbars are visible */}
      {showVScrollbar && showHScrollbar && (
        <div className={styles.corner} />
      )}
    </div>
  );
});
