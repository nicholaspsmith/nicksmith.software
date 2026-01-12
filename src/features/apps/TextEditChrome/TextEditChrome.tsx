import { useState, type ReactNode } from 'react';
import { AquaScrollbar } from '@/features/tiger/components/AquaScrollbar';
import { ContextMenu, type ContextMenuEntry } from '@/features/tiger/components/ContextMenu';
import styles from './TextEditChrome.module.css';
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

interface TextEditChromeProps {
  children: ReactNode;
  /** Handler for New document action */
  onNew?: () => void;
  /** Handler for Close window action */
  onClose?: () => void;
  /** Handler for Save action */
  onSave?: () => void;
  /** Handler for Save As action */
  onSaveAs?: () => void;
  /** Handler for Edit Document action (for non-editable documents) */
  onEditDocument?: () => void;
  /** Handler for Show Original action (for editable documents) */
  onShowOriginal?: () => void;
  /** Whether the document is editable (affects which menu items are shown) */
  isEditable?: boolean;
}

/**
 * TextEditChrome - Tiger TextEdit toolbar and ruler wrapper
 *
 * Provides the consistent TextEdit UI (toolbar with formatting controls
 * and ruler) while allowing different content to be displayed.
 */
export function TextEditChrome({
  children,
  onNew,
  onClose,
  onSave,
  onSaveAs,
  onEditDocument,
  onShowOriginal,
  isEditable = false,
}: TextEditChromeProps) {
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Build context menu items (matching TextEdit File menu)
  const contextMenuItems: ContextMenuEntry[] = [
    { type: 'item', label: 'New', onClick: onNew, disabled: !onNew },
    { type: 'item', label: 'Open...', disabled: true },
    { type: 'item', label: 'Open Recent', hasSubmenu: true, disabled: true },
    { type: 'divider' },
    { type: 'item', label: 'Close', onClick: onClose, disabled: !onClose },
    { type: 'item', label: 'Save', onClick: onSave, disabled: !onSave },
    { type: 'item', label: 'Save As...', onClick: onSaveAs, disabled: !onSaveAs },
    { type: 'divider' },
    { type: 'item', label: 'Show Properties', disabled: true },
    { type: 'divider' },
    // Show Edit Document or Show Original depending on editable state
    isEditable
      ? { type: 'item' as const, label: 'Show Original', onClick: onShowOriginal, disabled: !onShowOriginal }
      : { type: 'item' as const, label: 'Edit Document', onClick: onEditDocument, disabled: !onEditDocument },
    { type: 'divider' },
    { type: 'item', label: 'Page Setup...', disabled: true },
    { type: 'item', label: 'Print...', disabled: true },
  ];

  // Handle right-click to show context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className={styles.container} data-textedit-window onContextMenu={handleContextMenu}>
      {/* Toolbar - matches Tiger TextEdit */}
      <div className={`${styles.toolbar} window-drag-handle`}>
        {/* Styles dropdown (disabled - decorative only) */}
        <div className={styles.toolbarGroup}>
          <select className={styles.dropdown} aria-label="Styles" disabled>
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

        {/* Spacing dropdown (disabled - decorative only) */}
        <div className={styles.toolbarGroup}>
          <select className={styles.dropdown} aria-label="Spacing" disabled>
            <option>Spacing</option>
          </select>
        </div>

        {/* Lists dropdown (disabled - decorative only) */}
        <div className={styles.toolbarGroup}>
          <select className={styles.dropdown} aria-label="Lists" disabled>
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
      <AquaScrollbar className={styles.content}>
        {children}
      </AquaScrollbar>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

export default TextEditChrome;
