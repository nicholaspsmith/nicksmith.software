import type { ReactNode } from 'react';
import styles from './TextEditChrome.module.css';

interface TextEditChromeProps {
  children: ReactNode;
}

/**
 * TextEditChrome - Tiger TextEdit toolbar and ruler wrapper
 *
 * Provides the consistent TextEdit UI (toolbar with formatting controls
 * and ruler) while allowing different content to be displayed.
 */
export function TextEditChrome({ children }: TextEditChromeProps) {
  return (
    <div className={styles.container} data-textedit-window>
      {/* Toolbar - matches Tiger TextEdit */}
      <div className={`${styles.toolbar} window-drag-handle`}>
        {/* Styles dropdown */}
        <div className={styles.toolbarGroup}>
          <select className={styles.dropdown} aria-label="Styles">
            <option>Styles</option>
          </select>
        </div>

        {/* Alignment buttons */}
        <div className={styles.alignmentButtons}>
          <button className={styles.alignButton} aria-label="Align left" title="Align Left">
            <AlignLeftIcon />
          </button>
          <button className={styles.alignButton} aria-label="Center" title="Center">
            <AlignCenterIcon />
          </button>
          <button className={styles.alignButton} aria-label="Justify" title="Justify">
            <AlignJustifyIcon />
          </button>
          <button className={styles.alignButton} aria-label="Align right" title="Align Right">
            <AlignRightIcon />
          </button>
        </div>

        {/* Spacing dropdown */}
        <div className={styles.toolbarGroup}>
          <select className={styles.dropdown} aria-label="Spacing">
            <option>Spacing</option>
          </select>
        </div>

        {/* Lists dropdown */}
        <div className={styles.toolbarGroup}>
          <select className={styles.dropdown} aria-label="Lists">
            <option>Lists</option>
          </select>
        </div>

        {/* Media controls */}
        <div className={styles.mediaButtons}>
          <button className={styles.mediaButton} aria-label="Speak" title="Speak">
            <PlayIcon />
          </button>
          <button className={styles.mediaButton} aria-label="Pause" title="Pause">
            <DiamondIcon />
          </button>
          <button className={styles.mediaButton} aria-label="Previous" title="Previous">
            <ArrowLeftIcon />
          </button>
          <button className={styles.mediaButton} aria-label="Stop" title="Stop">
            <CircleIcon />
          </button>
        </div>
      </div>

      {/* Ruler */}
      <div className={styles.ruler}>
        <div className={styles.rulerIndent}>
          <div className={styles.rulerTab} />
        </div>
        <div className={styles.rulerMarks}>
          {/* Generate ruler marks */}
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className={styles.rulerSection}>
              <span className={styles.rulerNumber}>{i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}

// ============================================
// Icon Components (matching Tiger TextEdit)
// ============================================

function AlignLeftIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect x="1" y="2" width="14" height="2" fill="currentColor" />
      <rect x="1" y="6" width="10" height="2" fill="currentColor" />
      <rect x="1" y="10" width="14" height="2" fill="currentColor" />
      <rect x="1" y="14" width="8" height="2" fill="currentColor" />
    </svg>
  );
}

function AlignCenterIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect x="1" y="2" width="14" height="2" fill="currentColor" />
      <rect x="3" y="6" width="10" height="2" fill="currentColor" />
      <rect x="1" y="10" width="14" height="2" fill="currentColor" />
      <rect x="4" y="14" width="8" height="2" fill="currentColor" />
    </svg>
  );
}

function AlignJustifyIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect x="1" y="2" width="14" height="2" fill="currentColor" />
      <rect x="1" y="6" width="14" height="2" fill="currentColor" />
      <rect x="1" y="10" width="14" height="2" fill="currentColor" />
      <rect x="1" y="14" width="14" height="2" fill="currentColor" />
    </svg>
  );
}

function AlignRightIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect x="1" y="2" width="14" height="2" fill="currentColor" />
      <rect x="5" y="6" width="10" height="2" fill="currentColor" />
      <rect x="1" y="10" width="14" height="2" fill="currentColor" />
      <rect x="7" y="14" width="8" height="2" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d="M4 2l10 6-10 6V2z" fill="currentColor" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d="M8 1l7 7-7 7-7-7 7-7z" fill="currentColor" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d="M10 2L4 8l6 6V2z" fill="currentColor" />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <circle cx="8" cy="8" r="6" fill="currentColor" />
    </svg>
  );
}

export default TextEditChrome;
