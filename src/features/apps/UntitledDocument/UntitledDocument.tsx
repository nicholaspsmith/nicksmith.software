import { useState, useCallback } from 'react';
import styles from './UntitledDocument.module.css';

/**
 * UntitledDocument - Blank TextEdit document
 *
 * A simple editable text area that mimics Tiger's TextEdit behavior.
 * Stores text locally in component state (not persisted).
 */
export function UntitledDocument() {
  const [content, setContent] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  return (
    <div className={styles.container} data-testid="untitled-document">
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
