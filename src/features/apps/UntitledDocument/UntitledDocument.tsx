import { useState, useCallback } from 'react';
import styles from './UntitledDocument.module.css';
import {
  AlignLeftIcon,
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignRightIcon,
  PlayIcon,
  DiamondIcon,
  ArrowLeftIcon,
  CircleIcon,
} from '../shared';

/**
 * UntitledDocument - Blank TextEdit document
 *
 * A simple editable text area that mimics Tiger's TextEdit behavior.
 * Includes toolbar with formatting controls and ruler like the original.
 * Text is stored locally in component state (not persisted).
 */
export function UntitledDocument() {
  const [content, setContent] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  return (
    <div className={styles.container} data-testid="untitled-document">
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

      {/* Editor area */}
      <textarea
        className={styles.editor}
        value={content}
        onChange={handleChange}
        aria-label="Document content"
        autoFocus
      />
    </div>
  );
}

