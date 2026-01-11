import { useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import { useAppStore, type IconPosition } from '@/stores/appStore';
import { useWindowStore } from '@/stores/windowStore';
import {
  useKeyboardShortcuts,
  useReducedMotion,
  useViewport,
  MOBILE_BREAKPOINT,
} from '@/hooks';
import { Desktop } from '@/features/tiger/components/Desktop';
import { DesktopIconGrid } from '@/features/tiger/components/DesktopIconGrid';
import { DesktopIcon } from '@/features/tiger/components/DesktopIcon';
import { Window } from '@/features/tiger/components/Window';
import { MobileFallback } from '@/features/tiger/components/MobileFallback';
import { AlertDialog } from '@/features/tiger/components/AlertDialog';
import { TerminalIcon } from '@/features/tiger/components/icons';
import { HomeScreen, IOS_BREAKPOINT } from '@/features/ios';
import { RebootTransition } from '@/components/RebootTransition';
import { SACRED } from '@/features/tiger/constants/sacred';
import { Finder } from '@/features/apps/Finder';
import { AboutThisMac } from '@/features/apps/AboutThisMac';
import { TextEditChrome } from '@/features/apps/TextEditChrome';
import { EditableDocument } from '@/features/apps/EditableDocument';
import { useDocumentStore } from '@/stores/documentStore';

// Lazy load Terminal to reduce initial bundle size (xterm.js is ~300KB)
const TerminalApp = lazy(() =>
  import('@/features/apps/Terminal').then((m) => ({ default: m.Terminal }))
);

/** Viewport mode type */
type ViewportMode = 'ios' | 'fallback' | 'desktop';

/**
 * Determines the viewport mode based on width
 */
function getViewportMode(width: number): ViewportMode {
  if (width < IOS_BREAKPOINT) return 'ios';
  if (width < MOBILE_BREAKPOINT) return 'fallback';
  return 'desktop';
}

/**
 * Desktop icons configuration
 * Vertical column: Macintosh HD at top, then apps below
 * Using official Tiger icons from /icons/
 */
const DESKTOP_ICONS = [
  { id: 'macintosh-hd', label: 'Macintosh HD', icon: '/icons/macintosh-hd.png', opensWindow: false },
  { id: 'terminal', label: 'Terminal', icon: 'terminal', opensWindow: true },
  { id: 'about', label: 'About Me', icon: '/icons/document.png', opensWindow: true },
  { id: 'projects', label: 'Projects', icon: '/icons/document.png', opensWindow: true },
  { id: 'resume', label: 'Resume', icon: '/icons/document.png', opensWindow: true },
  { id: 'contact', label: 'Contact', icon: '/icons/document.png', opensWindow: true },
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

  // Terminal uses custom SVG (no official icon available)
  if (icon.icon === 'terminal') {
    return <TerminalIcon />;
  }

  // PNG icons for documents and other items
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
 * Renders the appropriate content for a window based on its app type
 */
function WindowContent({ app, documentId }: { app: string; documentId?: string }) {
  // Get and clear the search query for Finder search windows
  const finderSearchQuery = useWindowStore((s) => s.finderSearchQuery);

  // All TextEdit documents (built-in and saved) use EditableDocument
  // Built-in docs: documentId = 'about', 'projects', 'resume', 'contact'
  // Untitled/saved docs: documentId = UUID
  switch (app) {
    case 'about':
    case 'projects':
    case 'resume':
    case 'contact':
      return (
        <TextEditChrome>
          <EditableDocument documentId={documentId || app} />
        </TextEditChrome>
      );
    case 'terminal':
      return (
        <Suspense fallback={<TerminalLoading />}>
          <TerminalApp />
        </Suspense>
      );
    case 'untitled':
      // Untitled documents use documentId (UUID) for content storage
      return (
        <TextEditChrome>
          <EditableDocument documentId={documentId || ''} />
        </TextEditChrome>
      );
    case 'finder-home':
      return <Finder location="home" />;
    case 'finder-hd':
      return <Finder location="hd" />;
    case 'finder-search':
      return <Finder location="home" initialSearch={finderSearchQuery || ''} />;
    case 'about-this-mac':
      return <AboutThisMac />;
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
  const alertConfig = useAppStore((s) => s.alertConfig);
  const hideAlert = useAppStore((s) => s.hideAlert);
  const dynamicIcons = useAppStore((s) => s.dynamicIcons);
  const setDraggingMacintoshHD = useAppStore((s) => s.setDraggingMacintoshHD);
  const windows = useWindowStore((s) => s.windows);
  const openWindow = useWindowStore((s) => s.openWindow);
  const openSavedDocument = useWindowStore((s) => s.openSavedDocument);

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

  return (
    <>
      <Desktop iconPositions={iconPositions} onIconsSelected={handleIconsSelected}>
        <DesktopIconGrid>
          {DESKTOP_ICONS.map((icon, index) => {
            const position = getIconPosition(icon.id, index);
            const isMacHD = icon.id === 'macintosh-hd';
            return (
              <DesktopIcon
                key={icon.id}
                id={icon.id}
                label={icon.label}
                icon={<DesktopIconImage icon={icon} isSelected={selectedIconIds.includes(icon.id)} />}
                isSelected={selectedIconIds.includes(icon.id)}
                x={position.x}
                y={position.y}
                onClick={() => selectIcon(icon.id)}
                onDoubleClick={() => handleDoubleClick(icon)}
                onPositionChange={(x, y) => handlePositionChange(icon.id, x, y)}
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
            return (
              <DesktopIcon
                key={icon.id}
                id={icon.id}
                label={icon.label}
                icon={<DynamicIconImage icon={icon} />}
                isSelected={selectedIconIds.includes(icon.id)}
                x={position.x}
                y={position.y}
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
            <Window key={w.id} id={w.id} title={w.title}>
              <WindowContent app={w.app} documentId={w.documentId} />
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
    </>
  );
}

/**
 * App - Root application component
 *
 * Determines viewport mode and renders the appropriate experience:
 * - iOS 6 home screen for mobile (< 768px)
 * - MobileFallback for tablets (768px - 1024px)
 * - Tiger desktop for large screens (>= 1024px)
 *
 * Transitions between iOS and Desktop/Fallback are animated
 * with a "reboot" effect for a polished context switch.
 */
export function App() {
  // Enable Tiger keyboard shortcuts (⌘W, ⌘M)
  useKeyboardShortcuts();
  // Detect reduced motion preference
  const prefersReducedMotion = useReducedMotion();
  // Track viewport for responsive experience
  const viewport = useViewport();

  // Determine current viewport mode
  const mode = useMemo(() => getViewportMode(viewport.width), [viewport.width]);

  // Render content based on mode
  const content = useMemo(() => {
    switch (mode) {
      case 'ios':
        return <HomeScreen />;
      case 'fallback':
        return <MobileFallback />;
      case 'desktop':
        return <TigerDesktop />;
    }
  }, [mode]);

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
      <RebootTransition mode={mode} skipInitial={false}>
        {content}
      </RebootTransition>
    </MotionConfig>
  );
}
