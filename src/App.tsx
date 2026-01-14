import { useCallback, useMemo, useEffect, useRef, lazy, Suspense, useState } from 'react';
import { MotionConfig, AnimatePresence } from 'motion/react';
import { useAppStore, type IconPosition } from '@/stores/appStore';
import { useWindowStore } from '@/stores/windowStore';
import {
  useKeyboardShortcuts,
  useReducedMotion,
  useViewport,
} from '@/hooks';
import { Desktop } from '@/features/tiger/components/Desktop';
import { DesktopIconGrid } from '@/features/tiger/components/DesktopIconGrid';
import { DesktopIcon, type IconContextMenuEvent, type DesktopIconType } from '@/features/tiger/components/DesktopIcon';
import { ContextMenu, type ContextMenuEntry } from '@/features/tiger/components/ContextMenu';
import { Window } from '@/features/tiger/components/Window';
import { AlertDialog } from '@/features/tiger/components/AlertDialog';
import { IOS, IOS_BREAKPOINT } from '@/features/ios-modern';
import { RebootTransition } from '@/components/RebootTransition';
import { RestartScreen } from '@/components/RestartScreen';
import { CrashScreen } from '@/components/CrashScreen';
import { KonamiEasterEgg } from '@/components/KonamiEasterEgg';
import { SACRED } from '@/features/tiger/constants/sacred';
import { playSound } from '@/utils/sounds';
import { Finder } from '@/features/apps/Finder';
import { AboutThisMac } from '@/features/apps/AboutThisMac';
import { TextEditChrome } from '@/features/apps/TextEditChrome';
import { EditableDocument } from '@/features/apps/EditableDocument';
import { useDocumentStore } from '@/stores/documentStore';
// Original styled document components (shown when not editing)
import { AboutMe } from '@/features/apps/AboutMe';
import { Projects } from '@/features/apps/Projects';
import { Resume } from '@/features/apps/Resume';
import { Contact } from '@/features/apps/Contact';
// Media players
import { ITunesApp } from '@/features/apps/iTunes';
import { QuickTime } from '@/features/apps/QuickTime';
import { Preview } from '@/features/apps/Preview';

// Lazy load Terminal to reduce initial bundle size (xterm.js is ~300KB)
const TerminalApp = lazy(() =>
  import('@/features/apps/Terminal').then((m) => ({ default: m.Terminal }))
);

/** Viewport mode type */
type ViewportMode = 'ios' | 'desktop';

/**
 * Determines the viewport mode based on width
 * iOS for screens < 1024px, desktop for >= 1024px
 */
function getViewportMode(width: number): ViewportMode {
  if (width < IOS_BREAKPOINT) return 'ios';
  return 'desktop';
}

/**
 * Desktop icons configuration
 * Vertical column: Macintosh HD at top, then apps below
 * Using official Tiger icons from /icons/
 */
const DESKTOP_ICONS = [
  { id: 'macintosh-hd', label: 'Macintosh HD', icon: '/icons/macintosh-hd.png', opensWindow: false },
  { id: 'about', label: 'About Me', icon: '/icons/AlertNoteIcon.png', opensWindow: true },
  { id: 'projects', label: 'Projects', icon: '/icons/ADCReferenceLibraryIcon.png', opensWindow: true },
  { id: 'resume', label: 'Resume', icon: '/icons/pdf.png', opensWindow: true },
  { id: 'contact', label: 'Contact', icon: '/icons/AddressBook.png', opensWindow: true },
  { id: 'terminal', label: 'Terminal', icon: '/icons/terminal.png', opensWindow: true },
] as const;

type IconConfig = (typeof DESKTOP_ICONS)[number];

/**
 * Calculate initial icon positions for right-side column layout
 * Tiger desktop traditionally has icons in a column on the right
 */
function calculateInitialPositions(): Record<string, IconPosition> {
  const positions: Record<string, IconPosition> = {};
  const gap = 4; // Gap between icons

  DESKTOP_ICONS.forEach((icon, index) => {
    // Right-aligned column: x = viewport width - cell width - margin
    const x = window.innerWidth - SACRED.iconGridCellWidth - SACRED.iconGridRightMargin;
    // Stack vertically from top
    const y = SACRED.iconGridTopMargin + index * (SACRED.iconGridCellHeight + gap);
    positions[icon.id] = { x, y };
  });

  return positions;
}

/**
 * Renders the appropriate icon based on config
 * Uses official Tiger PNG icons where available
 */
function DesktopIconImage({ icon, isSelected: _isSelected }: { icon: IconConfig; isSelected?: boolean }) {
  // Macintosh HD - always use the same icon (no selection change)
  if (icon.id === 'macintosh-hd') {
    return <img src="/icons/macintosh-hd.png" alt="" width={48} height={48} draggable={false} />;
  }

  // PNG icons for all items
  return <img src={icon.icon} alt="" width={48} height={48} draggable={false} />;
}

/**
 * Burn Folder icon - GenericFolderIcon with BurningIcon overlay
 */
function BurnFolderIcon() {
  return (
    <div style={{ position: 'relative' }}>
      <img src="/icons/GenericFolderIcon.png" alt="" draggable={false} />
      <img
        src="/icons/BurningIcon.png"
        alt=""
        draggable={false}
        style={{
          position: 'absolute',
          bottom: 16,
          right: 14,
          height: '45%',
          width: '45%',
          transform: 'rotateX(-20deg) rotateY(20deg)',
          opacity: 0.8,
        }}
      />
    </div>
  );
}

/**
 * Renders the icon for a dynamic desktop icon based on its type
 */
function DynamicIconImage({ icon }: { icon: { type: string; icon: string } }) {
  if (icon.type === 'burn-folder') {
    return <BurnFolderIcon />;
  }
  if (icon.type === 'document') {
    return <img src="/icons/document.png" alt="" width={48} height={48} draggable={false} />;
  }
  return <img src={icon.icon} alt="" width={48} height={48} draggable={false} />;
}

/**
 * Loading fallback for lazy-loaded components
 */
function TerminalLoading() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      background: '#0a0a0a',
      color: '#33ff33',
      fontFamily: 'Monaco, "Courier New", monospace',
      fontSize: 13,
    }}>
      Loading Terminal...
    </div>
  );
}

/**
 * Styled document component mapping
 */
const STYLED_COMPONENTS: Record<string, React.ComponentType> = {
  about: AboutMe,
  projects: Projects,
  resume: Resume,
  contact: Contact,
};

/**
 * Renders the appropriate content for a window based on its app type
 * For built-in documents: shows styled component by default, EditableDocument when editing
 */
function WindowContent({ app, documentId, isEditing, windowId, mediaFile, imageDataUrl }: { app: string; documentId?: string; isEditing?: boolean; windowId: string; mediaFile?: string; imageDataUrl?: string }) {
  // Get and clear the search query for Finder search windows
  const finderSearchQuery = useWindowStore((s) => s.finderSearchQuery);
  // Window actions for context menu
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const openWindow = useWindowStore((s) => s.openWindow);
  const setEditMode = useWindowStore((s) => s.setEditMode);
  // Check if this document has saved edits
  const documents = useDocumentStore((s) => s.documents);
  const saveDocument = useDocumentStore((s) => s.saveDocument);
  const docId = documentId || app;
  const hasSavedEdits = docId in documents;

  // Context menu handlers for TextEdit documents
  const handleNew = () => {
    openWindow('untitled');
  };
  const handleClose = () => {
    closeWindow(windowId);
  };
  const handleSave = () => {
    // Save current document content to localStorage
    saveDocument(docId);
  };
  const handleSaveAs = () => {
    // Save As creates a copy - for now just save current
    handleSave();
  };
  const handleEditDocument = () => {
    setEditMode(windowId, true);
  };
  const handleShowOriginal = () => {
    setEditMode(windowId, false);
  };

  // Built-in documents: show styled by default, editable when editing or has saved edits
  switch (app) {
    case 'about':
    case 'projects':
    case 'resume':
    case 'contact': {
      const shouldShowEditor = isEditing || hasSavedEdits;
      if (shouldShowEditor) {
        return (
          <TextEditChrome
            onNew={handleNew}
            onClose={handleClose}
            onSave={handleSave}
            onSaveAs={handleSaveAs}
            onShowOriginal={handleShowOriginal}
            isEditable={true}
          >
            <EditableDocument documentId={docId} />
          </TextEditChrome>
        );
      }
      // Show original styled component
      const StyledComponent = STYLED_COMPONENTS[app];
      return (
        <TextEditChrome
          onNew={handleNew}
          onClose={handleClose}
          onEditDocument={handleEditDocument}
          isEditable={false}
        >
          <StyledComponent />
        </TextEditChrome>
      );
    }
    case 'terminal':
      return (
        <Suspense fallback={<TerminalLoading />}>
          <TerminalApp />
        </Suspense>
      );
    case 'untitled':
      // Untitled documents always use EditableDocument (no styled version)
      return (
        <TextEditChrome
          onNew={handleNew}
          onClose={handleClose}
          onSave={handleSave}
          onSaveAs={handleSaveAs}
          isEditable={true}
        >
          <EditableDocument documentId={documentId || ''} />
        </TextEditChrome>
      );
    case 'finder-home':
      return <Finder location="home" />;
    case 'finder-hd':
      return <Finder location="hd" />;
    case 'finder-trash':
      return <Finder location="trash" />;
    case 'finder-search':
      return <Finder location="home" initialSearch={finderSearchQuery || ''} />;
    case 'about-this-mac':
      return <AboutThisMac />;
    case 'itunes':
      return <ITunesApp initialTrack={mediaFile} />;
    case 'quicktime':
      return <QuickTime initialVideo={mediaFile} />;
    case 'preview':
      return imageDataUrl ? <Preview imageDataUrl={imageDataUrl} /> : null;
    default:
      return null;
  }
}

/**
 * TigerDesktop - The Mac OS X Tiger desktop experience
 *
 * Renders the desktop with portfolio icons arranged in
 * the top-right corner following Tiger's column-first layout.
 */
function TigerDesktop() {
  const selectedIconIds = useAppStore((s) => s.selectedIconIds);
  const selectIcon = useAppStore((s) => s.selectIcon);
  const selectMultipleIcons = useAppStore((s) => s.selectMultipleIcons);
  const iconPositions = useAppStore((s) => s.iconPositions);
  const iconPositionsInitialized = useAppStore((s) => s.iconPositionsInitialized);
  const initializeIconPositions = useAppStore((s) => s.initializeIconPositions);
  const recalculateIconPositions = useAppStore((s) => s.recalculateIconPositions);
  const setIconPosition = useAppStore((s) => s.setIconPosition);
  const setMultipleIconPositions = useAppStore((s) => s.setMultipleIconPositions);
  const alertOpen = useAppStore((s) => s.alertOpen);

  // Track initial startup for slow fade-in of About Me window
  const isInitialStartup = useRef(true);
  useEffect(() => {
    // Mark startup as complete after first render
    const timer = setTimeout(() => {
      isInitialStartup.current = false;
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const alertConfig = useAppStore((s) => s.alertConfig);
  const hideAlert = useAppStore((s) => s.hideAlert);
  const dynamicIcons = useAppStore((s) => s.dynamicIcons);
  const trashedIcons = useAppStore((s) => s.trashedIcons);
  const setDraggingMacintoshHD = useAppStore((s) => s.setDraggingMacintoshHD);
  const moveToTrash = useAppStore((s) => s.moveToTrash);
  const copyToClipboard = useAppStore((s) => s.copyToClipboard);
  const renameIcon = useAppStore((s) => s.renameIcon);
  const windows = useWindowStore((s) => s.windows);
  const openWindow = useWindowStore((s) => s.openWindow);
  const openSavedDocument = useWindowStore((s) => s.openSavedDocument);

  // Icon context menu state
  const [iconContextMenu, setIconContextMenu] = useState<{
    x: number;
    y: number;
    iconId: string;
    iconLabel: string;
    iconType: DesktopIconType;
  } | null>(null);

  // Rename dialog state
  const [renameDialog, setRenameDialog] = useState<{
    iconId: string;
    currentName: string;
    newName: string;
  } | null>(null);

  // Window title bar context menu state
  const [windowContextMenu, setWindowContextMenu] = useState<{
    x: number;
    y: number;
    windowId: string;
    app: string;
  } | null>(null);

  // Initialize icon positions on mount
  useEffect(() => {
    if (!iconPositionsInitialized) {
      initializeIconPositions(calculateInitialPositions());
    }
  }, [iconPositionsInitialized, initializeIconPositions]);

  // Initialize documentStore on mount (hydrate from localStorage)
  useEffect(() => {
    useDocumentStore.getState().loadFromStorage();
  }, []);

  // Load trash from localStorage on mount
  useEffect(() => {
    useAppStore.getState().loadTrashFromStorage();
  }, []);

  // Prevent native context menu globally - we use custom context menus
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Open About Me window on first load (centered on screen)
  useEffect(() => {
    openWindow('about');
  }, [openWindow]);

  // Recalculate icon positions when window resize completes
  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      // Debounce: wait 300ms after last resize event before recalculating
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        recalculateIconPositions(calculateInitialPositions());
      }, 300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [recalculateIconPositions]);

  // Ensure dynamic icons have positions stored (for marquee selection)
  // Icons flow down columns, wrapping to a new column LEFT when within 200px of dock
  useEffect(() => {
    const gap = 4;
    const columnGap = 8; // Horizontal gap between columns
    const dockTopY = window.innerHeight - SACRED.dockHeight;
    const dockProximityThreshold = 200;
    const maxY = dockTopY - dockProximityThreshold;

    // Calculate column X positions (rightmost is column 0)
    const getColumnX = (columnIndex: number) =>
      window.innerWidth - SACRED.iconGridCellWidth - SACRED.iconGridRightMargin -
      columnIndex * (SACRED.iconGridCellWidth + columnGap);

    // Count icons per column based on their X positions
    const getIconColumn = (x: number) => {
      const col0X = getColumnX(0);
      // Determine column by how far left of col0 this icon is
      const offset = col0X - x;
      if (offset < SACRED.iconGridCellWidth / 2) return 0;
      return Math.round(offset / (SACRED.iconGridCellWidth + columnGap));
    };

    // Count existing icons in each column (static + already-positioned dynamic)
    const columnCounts: Record<number, number> = { 0: DESKTOP_ICONS.length };

    // Count dynamic icons that already have positions
    dynamicIcons.forEach((icon) => {
      const pos = iconPositions[icon.id];
      if (pos) {
        const col = getIconColumn(pos.x);
        columnCounts[col] = (columnCounts[col] || 0) + 1;
      }
    });

    const newPositions: Record<string, IconPosition> = {};

    dynamicIcons.forEach((icon) => {
      // Only add position if it doesn't exist yet
      if (!iconPositions[icon.id]) {
        // Find the first column with room (Y won't exceed maxY)
        let targetColumn = 0;
        let iconsInColumn = columnCounts[targetColumn] || 0;
        let y = SACRED.iconGridTopMargin + iconsInColumn * (SACRED.iconGridCellHeight + gap);

        // If this position would be too close to dock, move to next column (left)
        while (y > maxY) {
          targetColumn++;
          iconsInColumn = columnCounts[targetColumn] || 0;
          y = SACRED.iconGridTopMargin + iconsInColumn * (SACRED.iconGridCellHeight + gap);
        }

        const x = getColumnX(targetColumn);
        newPositions[icon.id] = { x, y };

        // Update count for this column so next icon in this batch knows
        columnCounts[targetColumn] = iconsInColumn + 1;
      }
    });

    // Store any new positions
    if (Object.keys(newPositions).length > 0) {
      setMultipleIconPositions(newPositions);
    }
  }, [dynamicIcons, iconPositions, setMultipleIconPositions]);

  // Handle alert OK button
  const handleAlertOk = useCallback(() => {
    alertConfig?.onOk?.();
    hideAlert();
  }, [alertConfig, hideAlert]);

  // Handle alert Cancel button
  const handleAlertCancel = useCallback(() => {
    alertConfig?.onCancel?.();
    hideAlert();
  }, [alertConfig, hideAlert]);

  const handleDoubleClick = (icon: IconConfig) => {
    // Special case: Macintosh HD opens Finder with HD view
    if (icon.id === 'macintosh-hd') {
      openWindow('finder-hd');
      useAppStore.getState().clearSelection();
      return;
    }

    if (icon.opensWindow) {
      openWindow(icon.id);
      // Clear selection after opening window (Tiger behavior)
      useAppStore.getState().clearSelection();
    }
  };

  const handlePositionChange = useCallback(
    (iconId: string, x: number, y: number) => {
      setIconPosition(iconId, x, y);
    },
    [setIconPosition]
  );

  // Handle marquee selection of icons
  const handleIconsSelected = useCallback(
    (iconIds: string[]) => {
      selectMultipleIcons(iconIds);
    },
    [selectMultipleIcons]
  );

  // Handle multi-icon drag (when dragging multiple selected icons)
  const handleMultiPositionChange = useCallback(
    (positions: Record<string, { x: number; y: number }>) => {
      setMultipleIconPositions(positions);
    },
    [setMultipleIconPositions]
  );

  // Handle icon context menu
  const handleIconContextMenu = useCallback((event: IconContextMenuEvent) => {
    setIconContextMenu({
      x: event.x,
      y: event.y,
      iconId: event.iconId,
      iconLabel: event.iconLabel,
      iconType: event.iconType,
    });
  }, []);

  // Close icon context menu
  const closeIconContextMenu = useCallback(() => {
    setIconContextMenu(null);
  }, []);

  // Get context menu items for an icon based on its type
  const getIconContextMenuItems = useCallback((
    iconId: string,
    iconLabel: string,
    iconType: DesktopIconType
  ): ContextMenuEntry[] => {
    // Find the icon to get its details for copying
    const staticIcon = DESKTOP_ICONS.find(i => i.id === iconId);
    const dynamicIcon = dynamicIcons.find(i => i.id === iconId);

    // Common action handlers
    const handleOpen = () => {
      if (iconId === 'macintosh-hd') {
        openWindow('finder-hd');
      } else if (staticIcon?.opensWindow) {
        openWindow(iconId);
      } else if (dynamicIcon?.type === 'document' && dynamicIcon.documentId) {
        openSavedDocument(dynamicIcon.documentId, dynamicIcon.label);
      }
      useAppStore.getState().clearSelection();
    };

    const handleCopy = () => {
      if (dynamicIcon) {
        copyToClipboard({
          iconId: dynamicIcon.id,
          label: dynamicIcon.label,
          type: dynamicIcon.type,
          icon: dynamicIcon.icon,
          documentId: dynamicIcon.documentId,
          sourceContext: 'desktop',
        });
      } else if (staticIcon) {
        // For built-in icons, create a clipboard item
        copyToClipboard({
          iconId: staticIcon.id,
          label: staticIcon.label,
          type: 'document',
          icon: staticIcon.icon,
          sourceContext: 'desktop',
        });
      }
    };

    const handleRename = () => {
      setRenameDialog({
        iconId,
        currentName: iconLabel,
        newName: iconLabel,
      });
    };

    const handleMoveToTrash = () => {
      moveToTrash(iconId);
    };

    // Macintosh HD context menu
    if (iconId === 'macintosh-hd') {
      return [
        { type: 'item', label: 'Open', onClick: handleOpen },
        { type: 'item', label: 'Get Info', disabled: true },
        { type: 'item', label: 'Manage Storage...', disabled: true },
      ];
    }

    // Terminal context menu
    if (iconId === 'terminal') {
      return [
        { type: 'item', label: 'Open', onClick: handleOpen },
        { type: 'item', label: 'Copy', onClick: handleCopy },
        { type: 'item', label: 'Move to Trash', onClick: handleMoveToTrash },
      ];
    }

    // Folder context menu
    if (iconType === 'folder' || iconType === 'smart-folder' || iconType === 'burn-folder') {
      return [
        { type: 'item', label: 'Open', onClick: handleOpen },
        { type: 'item', label: 'Copy', onClick: handleCopy },
        { type: 'item', label: 'Compress', disabled: true },
        { type: 'item', label: 'Move to Trash', onClick: handleMoveToTrash },
      ];
    }

    // Document/default context menu
    return [
      { type: 'item', label: 'Open', onClick: handleOpen },
      { type: 'item', label: 'Rename', onClick: handleRename },
      { type: 'item', label: 'Copy', onClick: handleCopy },
      { type: 'item', label: 'Compress', disabled: true },
      { type: 'item', label: 'Move to Trash', onClick: handleMoveToTrash },
    ];
  }, [dynamicIcons, openWindow, openSavedDocument, copyToClipboard, moveToTrash]);

  // Handle rename confirmation
  const handleRenameConfirm = useCallback(() => {
    if (renameDialog && renameDialog.newName.trim()) {
      renameIcon(renameDialog.iconId, renameDialog.newName.trim());
    }
    setRenameDialog(null);
  }, [renameDialog, renameIcon]);

  // Handle rename cancel
  const handleRenameCancel = useCallback(() => {
    setRenameDialog(null);
  }, []);

  // Handle window title bar context menu
  const handleWindowContextMenu = useCallback((windowId: string, app: string) => (e: React.MouseEvent) => {
    setWindowContextMenu({
      x: e.clientX,
      y: e.clientY,
      windowId,
      app,
    });
  }, []);

  // Close window context menu
  const closeWindowContextMenu = useCallback(() => {
    setWindowContextMenu(null);
  }, []);

  // Get context menu items for window based on app type
  const getWindowContextMenuItems = useCallback((windowId: string, app: string): ContextMenuEntry[] => {
    const closeWindowAction = useWindowStore.getState().closeWindow;

    // TextEdit documents
    if (app === 'about' || app === 'projects' || app === 'resume' || app === 'contact' || app === 'untitled') {
      return [
        { type: 'item', label: 'New', onClick: () => openWindow('untitled') },
        { type: 'item', label: 'Open...', disabled: true },
        { type: 'divider' },
        { type: 'item', label: 'Close', onClick: () => closeWindowAction(windowId) },
        { type: 'item', label: 'Save', disabled: true },
        { type: 'item', label: 'Save As...', disabled: true },
        { type: 'divider' },
        { type: 'item', label: 'Page Setup...', disabled: true },
        { type: 'item', label: 'Print...', disabled: true },
      ];
    }

    // Finder windows
    if (app.startsWith('finder')) {
      return [
        { type: 'item', label: 'New Finder Window', onClick: () => openWindow('finder-home') },
        { type: 'item', label: 'New Folder', disabled: true },
        { type: 'divider' },
        { type: 'item', label: 'Close Window', onClick: () => closeWindowAction(windowId) },
        { type: 'divider' },
        { type: 'item', label: 'Get Info', disabled: true },
        { type: 'item', label: 'Find...', disabled: true },
      ];
    }

    // Terminal
    if (app === 'terminal') {
      return [
        { type: 'item', label: 'New Shell', disabled: true },
        { type: 'divider' },
        { type: 'item', label: 'Close', onClick: () => closeWindowAction(windowId) },
      ];
    }

    // Default (generic)
    return [
      { type: 'item', label: 'Close', onClick: () => closeWindowAction(windowId) },
    ];
  }, [openWindow]);

  // Get icon position (fallback to calculated position if not yet initialized)
  const getIconPosition = (iconId: string, index: number) => {
    if (iconPositions[iconId]) {
      return iconPositions[iconId];
    }
    // Fallback while initializing
    const gap = 4;
    return {
      x: window.innerWidth - SACRED.iconGridCellWidth - SACRED.iconGridRightMargin,
      y: SACRED.iconGridTopMargin + index * (SACRED.iconGridCellHeight + gap),
    };
  };

  // Handle Macintosh HD drag start/end (for eject icon in Dock)
  const handleMacHDDragStart = useCallback(() => {
    // Only show eject icon when dragging Macintosh HD alone (not multi-select)
    if (selectedIconIds.length <= 1) {
      setDraggingMacintoshHD(true);
    }
  }, [selectedIconIds, setDraggingMacintoshHD]);

  const handleMacHDDragEnd = useCallback(() => {
    setDraggingMacintoshHD(false);
  }, [setDraggingMacintoshHD]);

  // Create set of trashed icon IDs for efficient filtering
  const trashedIconIds = useMemo(() => new Set(trashedIcons.map((icon) => icon.id)), [trashedIcons]);

  // Filter DESKTOP_ICONS to exclude trashed icons
  const visibleDesktopIcons = useMemo(
    () => DESKTOP_ICONS.filter((icon) => !trashedIconIds.has(icon.id)),
    [trashedIconIds]
  );

  return (
    <>
      <Desktop iconPositions={iconPositions} onIconsSelected={handleIconsSelected}>
        <DesktopIconGrid>
          {visibleDesktopIcons.map((icon, index) => {
            const position = getIconPosition(icon.id, index);
            const isMacHD = icon.id === 'macintosh-hd';
            // Determine icon type for context menu
            const iconType: DesktopIconType = isMacHD ? 'drive' : icon.id === 'terminal' ? 'application' : 'document';
            return (
              <DesktopIcon
                key={icon.id}
                id={icon.id}
                label={icon.label}
                icon={<DesktopIconImage icon={icon} isSelected={selectedIconIds.includes(icon.id)} />}
                isSelected={selectedIconIds.includes(icon.id)}
                x={position.x}
                y={position.y}
                iconType={iconType}
                onClick={() => selectIcon(icon.id)}
                onDoubleClick={() => handleDoubleClick(icon)}
                onPositionChange={(x, y) => handlePositionChange(icon.id, x, y)}
                onContextMenu={handleIconContextMenu}
                selectedIconIds={selectedIconIds}
                allIconPositions={iconPositions}
                onMultiPositionChange={handleMultiPositionChange}
                onDragStart={isMacHD ? handleMacHDDragStart : undefined}
                onDragEnd={isMacHD ? handleMacHDDragEnd : undefined}
              />
            );
          })}
          {/* Dynamic icons (created via File > New Folder, etc.) */}
          {dynamicIcons.map((icon, index) => {
            const totalStaticIcons = DESKTOP_ICONS.length;
            const position = getIconPosition(icon.id, totalStaticIcons + index);
            // Map dynamic icon type to DesktopIconType
            const iconType: DesktopIconType = icon.type === 'folder' ? 'folder'
              : icon.type === 'smart-folder' ? 'smart-folder'
              : icon.type === 'burn-folder' ? 'burn-folder'
              : 'document';
            return (
              <DesktopIcon
                key={icon.id}
                id={icon.id}
                label={icon.label}
                icon={<DynamicIconImage icon={icon} />}
                isSelected={selectedIconIds.includes(icon.id)}
                x={position.x}
                y={position.y}
                iconType={iconType}
                onClick={() => selectIcon(icon.id)}
                onDoubleClick={() => {
                  // Document icons open their saved document
                  if (icon.type === 'document' && icon.documentId) {
                    openSavedDocument(icon.documentId, icon.label);
                    useAppStore.getState().clearSelection();
                  }
                  // Folders don't open windows
                }}
                onPositionChange={(x, y) => handlePositionChange(icon.id, x, y)}
                onContextMenu={handleIconContextMenu}
                selectedIconIds={selectedIconIds}
                allIconPositions={iconPositions}
                onMultiPositionChange={handleMultiPositionChange}
              />
            );
          })}
        </DesktopIconGrid>
        {windows
          .filter((w) => w.state !== 'closed')
          .map((w) => (
            <Window
              key={w.id}
              id={w.id}
              title={w.title}
              isStartupWindow={isInitialStartup.current && w.app === 'about'}
              onTitleBarContextMenu={handleWindowContextMenu(w.id, w.app)}
            >
              <WindowContent app={w.app} documentId={w.documentId} isEditing={w.isEditing} windowId={w.id} mediaFile={w.mediaFile} imageDataUrl={w.imageDataUrl} />
            </Window>
          ))}
      </Desktop>
      {/* Global alert dialog */}
      <AlertDialog
        isOpen={alertOpen}
        title={alertConfig?.title ?? ''}
        message={alertConfig?.message ?? ''}
        type={alertConfig?.type}
        okText={alertConfig?.okText}
        cancelText={alertConfig?.cancelText}
        showCancel={alertConfig?.showCancel}
        onOk={handleAlertOk}
        onCancel={handleAlertCancel}
        playSound={alertConfig?.playSound}
      />

      {/* Icon context menu */}
      {iconContextMenu && (
        <ContextMenu
          x={iconContextMenu.x}
          y={iconContextMenu.y}
          onClose={closeIconContextMenu}
          items={getIconContextMenuItems(
            iconContextMenu.iconId,
            iconContextMenu.iconLabel,
            iconContextMenu.iconType
          )}
        />
      )}

      {/* Rename dialog */}
      <AlertDialog
        isOpen={renameDialog !== null}
        title="Rename"
        message={`Enter a new name for "${renameDialog?.currentName ?? ''}"`}
        type="note"
        okText="Rename"
        cancelText="Cancel"
        showCancel
        onOk={handleRenameConfirm}
        onCancel={handleRenameCancel}
        inputMode
        inputValue={renameDialog?.newName ?? ''}
        inputPlaceholder="New name"
        onInputChange={(value) => setRenameDialog(prev => prev ? { ...prev, newName: value } : null)}
      />

      {/* Window title bar context menu */}
      {windowContextMenu && (
        <ContextMenu
          x={windowContextMenu.x}
          y={windowContextMenu.y}
          onClose={closeWindowContextMenu}
          items={getWindowContextMenuItems(
            windowContextMenu.windowId,
            windowContextMenu.app
          )}
        />
      )}
    </>
  );
}

/**
 * App - Root application component
 *
 * Determines viewport mode and renders the appropriate experience:
 * - iOS 15+ home screen for mobile/tablet (< 1024px)
 * - Tiger desktop for large screens (>= 1024px)
 *
 * iOS has its own boot screen. Tiger desktop shows a restart
 * screen during startup. Transitions between modes use a
 * "reboot" animation for a polished context switch.
 */
export function App() {
  // Enable Tiger keyboard shortcuts (⌘W, ⌘M)
  useKeyboardShortcuts();
  // Detect reduced motion preference
  const prefersReducedMotion = useReducedMotion();
  // Track viewport for responsive experience
  const viewport = useViewport();
  // Startup, restart, and crash state
  const startupComplete = useAppStore((s) => s.startupComplete);
  const completeStartup = useAppStore((s) => s.completeStartup);
  const isRestarting = useAppStore((s) => s.isRestarting);
  const isCrashing = useAppStore((s) => s.isCrashing);
  const completeCrash = useAppStore((s) => s.completeCrash);

  // Track if startup sound has played to avoid replay on re-renders
  const hasPlayedStartupSound = useRef(false);

  // Play startup chime when app first loads
  useEffect(() => {
    if (!hasPlayedStartupSound.current) {
      hasPlayedStartupSound.current = true;
      playSound('startup');
    }
  }, []);

  // Handle boot screen completion (initial load)
  const handleBootComplete = useCallback(() => {
    completeStartup();
  }, [completeStartup]);

  // Handle restart completion - clear localStorage and reload
  const handleRestartComplete = useCallback(() => {
    // Clear all localStorage to reset to default state
    localStorage.clear();
    // Reload the page
    window.location.reload();
  }, []);

  // Determine current viewport mode
  const mode = useMemo(() => getViewportMode(viewport.width), [viewport.width]);

  // Render content based on mode
  const content = useMemo(() => {
    switch (mode) {
      case 'ios':
        return <IOS />;
      case 'desktop':
        return <TigerDesktop />;
    }
  }, [mode]);

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
      {/* iOS mode renders immediately (has its own boot screen) */}
      {mode === 'ios' && (
        <RebootTransition mode={mode} skipInitial={false}>
          {content}
        </RebootTransition>
      )}

      {/* Desktop mode waits for startup and shows Tiger restart screen */}
      {mode === 'desktop' && startupComplete && (
        <RebootTransition mode={mode} skipInitial={false}>
          {content}
        </RebootTransition>
      )}

      {/* Tiger boot/restart screen - only for desktop mode */}
      <AnimatePresence>
        {mode === 'desktop' && !startupComplete && !isCrashing && (
          <RestartScreen key="boot" onComplete={handleBootComplete} duration={2000} />
        )}
        {mode === 'desktop' && isRestarting && (
          <RestartScreen key="restart" onComplete={handleRestartComplete} duration={2000} />
        )}
        {isCrashing && (
          <CrashScreen key="crash" onComplete={completeCrash} />
        )}
      </AnimatePresence>

      {/* Konami code easter egg */}
      <KonamiEasterEgg />
    </MotionConfig>
  );
}
