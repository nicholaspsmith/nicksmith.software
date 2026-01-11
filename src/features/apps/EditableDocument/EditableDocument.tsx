import { useCallback, useEffect, useRef, useState } from 'react';
import { useDocumentStore } from '@/stores/documentStore';
import styles from './EditableDocument.module.css';

interface EditableDocumentProps {
  /** Document ID linking to documentStore content */
  documentId: string;
}

/**
 * EditableDocument - Editable textarea for TextEdit documents
 *
 * Displays document content from documentStore and updates it on change.
 * Shows default content if no saved content exists.
 * Used inside TextEditChrome which provides the toolbar/ruler.
 */
export function EditableDocument({ documentId }: EditableDocumentProps) {
  const getContent = useDocumentStore((state) => state.getContent);
  const setContent = useDocumentStore((state) => state.setContent);

  // Local state for immediate feedback (syncs to store on change)
  const [localContent, setLocalContent] = useState(() => getContent(documentId));

  // Track previous content to avoid unnecessary updates
  const prevContentRef = useRef<string>(localContent);

  // Sync from store when documentId changes
  useEffect(() => {
    const content = getContent(documentId);
    setLocalContent(content);
    prevContentRef.current = content;
  }, [documentId, getContent]);

  // Subscribe to store changes (for Show Original reset)
  // Only update when this specific document's content changes
  useEffect(() => {
    const unsubscribe = useDocumentStore.subscribe((state) => {
      const currentContent = state.getContent(documentId);
      // Only update if content actually changed (avoids render storm)
      if (currentContent !== prevContentRef.current) {
        prevContentRef.current = currentContent;
        setLocalContent(currentContent);
      }
    });
    return unsubscribe;
  }, [documentId]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    prevContentRef.current = newContent;
    setContent(documentId, newContent);
  }, [documentId, setContent]);

  return (
    <textarea
      className={styles.editor}
      value={localContent}
      onChange={handleChange}
      aria-label="Document content"
      data-testid="editable-document"
    />
  );
}
