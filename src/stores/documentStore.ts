import { create } from 'zustand';
import { DEFAULT_CONTENT, isBuiltInDocument } from '@/constants/defaultContent';
import { useAppStore } from './appStore';
import { useWindowStore } from './windowStore';

/** localStorage key prefix for document content */
const STORAGE_PREFIX = 'textedit:doc:';
/** localStorage key for saved document IDs list */
const SAVED_IDS_KEY = 'textedit:saved-ids';

/** Safe localStorage get - returns null on error */
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // localStorage unavailable (private browsing, quota exceeded, etc.)
    return null;
  }
}

/** Safe localStorage set - returns false on error */
function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    // localStorage unavailable or quota exceeded
    console.warn(`Failed to save to localStorage: ${key}`);
    return false;
  }
}

/** Safe localStorage remove - silent on error */
function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore errors on remove
  }
}

/** Safe JSON parse - returns fallback on error */
function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (json === null) return fallback;
  try {
    const parsed = JSON.parse(json);
    // Validate the parsed result is the expected type
    if (Array.isArray(fallback) && !Array.isArray(parsed)) {
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

/** UUID v4 pattern: 8-4-4-4-12 hex digits */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Check if a string is a valid UUID v4 */
export function isUUID(id: string): boolean {
  return UUID_PATTERN.test(id);
}

/** localStorage key prefix for document titles */
const TITLE_PREFIX = 'textedit:title:';

interface DocumentStore {
  /** In-memory document content (docId -> content) */
  documents: Record<string, string>;
  /** UUIDs of saved Untitled documents (for desktop icons) */
  savedDocumentIds: string[];

  /** Get content for a document (returns saved/edited content, or default, or empty string) */
  getContent: (docId: string) => string;
  /** Update in-memory content (does not persist to localStorage) */
  setContent: (docId: string, content: string) => void;
  /** Persist document to localStorage; adds to savedDocumentIds if UUID */
  saveDocument: (docId: string) => void;
  /** Reset document to default content (clears localStorage and in-memory) */
  resetToDefault: (docId: string) => void;
  /** Delete document completely (localStorage, savedDocumentIds, desktop icon) */
  deleteDocument: (docId: string) => void;
  /** Hydrate documents and savedDocumentIds from localStorage on app startup */
  loadFromStorage: () => void;
  /** Check if a document is currently open in a window; returns windowId or null */
  isDocumentOpen: (docId: string) => string | null;
  /** Generate a unique "Untitled" name that doesn't conflict with existing saved docs */
  getUniqueUntitledName: () => string;
  /** Get the saved title for a document, or null if not saved */
  getDocumentTitle: (docId: string) => string | null;
  /** Save a document's title to localStorage */
  saveDocumentTitle: (docId: string, title: string) => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: {},
  savedDocumentIds: [],

  getContent: (docId) => {
    const { documents } = get();
    // Return in-memory content if exists
    if (docId in documents) {
      return documents[docId];
    }
    // Return default content for built-in documents
    if (isBuiltInDocument(docId)) {
      return DEFAULT_CONTENT[docId];
    }
    // For saved Untitled documents, try localStorage
    const stored = safeGetItem(`${STORAGE_PREFIX}${docId}`);
    if (stored !== null) {
      return stored;
    }
    // Empty string for new documents
    return '';
  },

  setContent: (docId, content) => {
    set((state) => ({
      documents: {
        ...state.documents,
        [docId]: content,
      },
    }));
  },

  saveDocument: (docId) => {
    const { documents, savedDocumentIds } = get();
    const content = documents[docId] ?? '';

    // Persist to localStorage
    safeSetItem(`${STORAGE_PREFIX}${docId}`, content);

    // If this is a UUID (Untitled doc), add to savedDocumentIds
    if (isUUID(docId) && !savedDocumentIds.includes(docId)) {
      const newSavedIds = [...savedDocumentIds, docId];
      set({ savedDocumentIds: newSavedIds });
      safeSetItem(SAVED_IDS_KEY, JSON.stringify(newSavedIds));
    }
  },

  resetToDefault: (docId) => {
    const { savedDocumentIds } = get();

    // Remove from localStorage
    safeRemoveItem(`${STORAGE_PREFIX}${docId}`);

    // Remove from in-memory documents and savedDocumentIds (if UUID)
    const isUuidDoc = isUUID(docId);
    set((state) => {
      const newDocuments = { ...state.documents };
      delete newDocuments[docId];

      if (isUuidDoc) {
        // Remove from savedDocumentIds for UUID docs
        const newSavedIds = savedDocumentIds.filter((id) => id !== docId);
        safeSetItem(SAVED_IDS_KEY, JSON.stringify(newSavedIds));
        return { documents: newDocuments, savedDocumentIds: newSavedIds };
      }

      return { documents: newDocuments };
    });

    // Remove desktop icon for UUID docs
    if (isUuidDoc) {
      useAppStore.getState().deleteDocumentIcon(docId);
    }
  },

  deleteDocument: (docId) => {
    const { savedDocumentIds } = get();

    // Remove from localStorage
    safeRemoveItem(`${STORAGE_PREFIX}${docId}`);

    // Remove from in-memory documents
    set((state) => {
      const newDocuments = { ...state.documents };
      delete newDocuments[docId];

      // Remove from savedDocumentIds
      const newSavedIds = savedDocumentIds.filter((id) => id !== docId);
      safeSetItem(SAVED_IDS_KEY, JSON.stringify(newSavedIds));

      return {
        documents: newDocuments,
        savedDocumentIds: newSavedIds,
      };
    });

    // Remove desktop icon via appStore
    useAppStore.getState().deleteDocumentIcon(docId);
  },

  loadFromStorage: () => {
    // Load saved document IDs (with safe JSON parsing)
    const savedIdsJson = safeGetItem(SAVED_IDS_KEY);
    const savedDocumentIds: string[] = safeJsonParse(savedIdsJson, []);

    // Load content for each saved document
    const documents: Record<string, string> = {};
    for (const docId of savedDocumentIds) {
      const content = safeGetItem(`${STORAGE_PREFIX}${docId}`);
      if (content !== null) {
        documents[docId] = content;
      }
    }

    // Also load any built-in document edits
    for (const docId of Object.keys(DEFAULT_CONTENT)) {
      const content = safeGetItem(`${STORAGE_PREFIX}${docId}`);
      if (content !== null) {
        documents[docId] = content;
      }
    }

    set({ documents, savedDocumentIds });

    // Create desktop icons for saved documents
    const appStore = useAppStore.getState();
    for (const docId of savedDocumentIds) {
      // Get title from localStorage or generate default
      const titleKey = `textedit:title:${docId}`;
      const title = safeGetItem(titleKey) || 'Untitled';
      appStore.createDocumentIcon(docId, title);
    }
  },

  isDocumentOpen: (docId) => {
    const windows = useWindowStore.getState().windows;
    const window = windows.find((w) => w.documentId === docId);
    return window?.id ?? null;
  },

  getUniqueUntitledName: () => {
    const { savedDocumentIds } = get();

    // Collect all existing "Untitled" names from saved documents
    const existingNames = new Set<string>();
    for (const docId of savedDocumentIds) {
      const title = safeGetItem(`${TITLE_PREFIX}${docId}`);
      if (title) {
        existingNames.add(title);
      }
    }

    // Find first available "Untitled" or "Untitled N" name
    if (!existingNames.has('Untitled')) {
      return 'Untitled';
    }

    let counter = 2;
    while (existingNames.has(`Untitled ${counter}`)) {
      counter++;
    }
    return `Untitled ${counter}`;
  },

  getDocumentTitle: (docId) => {
    return safeGetItem(`${TITLE_PREFIX}${docId}`);
  },

  saveDocumentTitle: (docId, title) => {
    safeSetItem(`${TITLE_PREFIX}${docId}`, title);
  },
}));
