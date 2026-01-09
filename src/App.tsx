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
import { AboutMe } from '@/features/apps/AboutMe';
import { Projects } from '@/features/apps/Projects';
import { Resume } from '@/features/apps/Resume';
import { Contact } from '@/features/apps/Contact';

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
function DesktopIconImage({ icon, isSelected }: { icon: IconConfig; isSelected?: boolean }) {
  // Special case for Macintosh HD - changes when selected
  if (icon.id === 'macintosh-hd') {
    const src = isSelected ? '/icons/macintosh-hd-selected.png' : '/icons/macintosh-hd.png';
    return <img src={src} alt="" width={48} height={48} draggable={false} />;
  }

  // Terminal uses custom SVG (no official icon available)
  if (icon.icon === 'terminal') {
    return <TerminalIcon />;
  }

  // PNG icons for documents and other items
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
function WindowContent({ app }: { app: string }) {
  switch (app) {
    case 'about':
      return <AboutMe />;
    case 'projects':
      return <Projects />;
    case 'resume':
      return <Resume />;
    case 'contact':
      return <Contact />;
    case 'terminal':
      return (
        <Suspense fallback={<TerminalLoading />}>
          <TerminalApp />
        </Suspense>
      );
    default:
      return <div style={{ padding: 16 }}>{app} content</div>;
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
  const setIconPosition = useAppStore((s) => s.setIconPosition);
  const setMultipleIconPositions = useAppStore((s) => s.setMultipleIconPositions);
  const alertOpen = useAppStore((s) => s.alertOpen);
  const alertConfig = useAppStore((s) => s.alertConfig);
  const hideAlert = useAppStore((s) => s.hideAlert);
  const windows = useWindowStore((s) => s.windows);
  const openWindow = useWindowStore((s) => s.openWindow);

  // Initialize icon positions on mount
  useEffect(() => {
    if (!iconPositionsInitialized) {
      initializeIconPositions(calculateInitialPositions());
    }
  }, [iconPositionsInitialized, initializeIconPositions]);

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

  return (
    <>
      <Desktop iconPositions={iconPositions} onIconsSelected={handleIconsSelected}>
        <DesktopIconGrid>
          {DESKTOP_ICONS.map((icon, index) => {
            const position = getIconPosition(icon.id, index);
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
              />
            );
          })}
        </DesktopIconGrid>
        {windows
          .filter((w) => w.state !== 'closed')
          .map((w) => (
            <Window key={w.id} id={w.id} title={w.title}>
              <WindowContent app={w.app} />
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
