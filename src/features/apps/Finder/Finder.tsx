import { useState, useCallback, useRef, useEffect } from 'react';
import { useWindowStore } from '@/stores/windowStore';
import { useAppStore } from '@/stores/appStore';
import { usePhotoStore } from '@/features/ios-modern/stores/photoStore';
import { AquaScrollbar, type AquaScrollbarHandle } from '@/features/tiger/components/AquaScrollbar';
import { ContextMenu, type ContextMenuEntry } from '@/features/tiger/components/ContextMenu';
import styles from './Finder.module.css';
import { TerminalIcon } from '@/features/tiger/components/icons';
import musicManifest from '@/generated/music-manifest.json';
import videoManifest from '@/generated/video-manifest.json';

/**
 * Music files loaded from generated manifest (scanned from public/music)
 */
const MUSIC_FILES: ContentItem[] = musicManifest.map(track => ({
  id: track.id,
  name: track.filename,
  icon: 'music-file',
  type: 'file' as const,
}));

/**
 * Video files loaded from generated manifest (scanned from public/videos)
 */
const VIDEO_FILES: ContentItem[] = videoManifest.map(video => ({
  id: video.id,
  name: video.filename,
  icon: 'video-file',
  type: 'file' as const,
}));

/**
 * Sidebar location item
 */
interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

/**
 * Folder content item
 */
interface ContentItem {
  id: string;
  name: string;
  icon: string;
  type: 'folder' | 'file';
  /** Optional data URL for dynamically loaded images (e.g., camera photos) */
  dataUrl?: string;
  /** Optional document ID for opening in TextEdit */
  documentId?: string;
  /** If true, item is greyed out and non-interactive */
  disabled?: boolean;
}

/**
 * Finder view configuration for different locations
 */
interface FinderViewConfig {
  title: string;
  sidebarItems: SidebarItem[];
  contentItems: ContentItem[];
  statusText: string;
}

/**
 * Default sidebar items for Tiger Finder
 * Organized exactly like the real Tiger Finder reference image
 */
const SIDEBAR_ITEMS: SidebarItem[] = [
  // Devices section
  { id: 'macintosh-hd', label: 'Macintosh HD', icon: 'hd' },
  // Places section
  { id: 'desktop', label: 'Desktop', icon: 'desktop' },
  { id: 'user', label: 'nick', icon: 'user' },
  { id: 'applications', label: 'Applications', icon: 'applications' },
  { id: 'documents', label: 'Documents', icon: 'documents' },
  { id: 'movies', label: 'Movies', icon: 'movies' },
  { id: 'music', label: 'Music', icon: 'music' },
  { id: 'pictures', label: 'Pictures', icon: 'pictures' },
  { id: 'trash', label: 'Trash', icon: 'trash' },
];

/**
 * Desktop icons - matches App.tsx DESKTOP_ICONS
 */
const DESKTOP_CONTENTS: ContentItem[] = [
  { id: 'macintosh-hd', name: 'Macintosh HD', icon: 'macintosh-hd', type: 'folder' },
  { id: 'terminal', name: 'Terminal', icon: 'terminal', type: 'file' },
  { id: 'about', name: 'About Me', icon: 'about-doc', type: 'file' },
  { id: 'projects', name: 'Projects', icon: 'projects-doc', type: 'file' },
  { id: 'resume', name: 'Resume', icon: 'resume-doc', type: 'file' },
  { id: 'contact', name: 'Contact', icon: 'contact-doc', type: 'file' },
];

/**
 * Home folder contents
 */
const HOME_CONTENTS: ContentItem[] = [
  { id: 'desktop', name: 'Desktop', icon: 'desktop-folder', type: 'folder' },
  { id: 'documents', name: 'Documents', icon: 'documents-folder', type: 'folder' },
  { id: 'library', name: 'Library', icon: 'library-folder', type: 'folder' },
  { id: 'movies', name: 'Movies', icon: 'movies-folder', type: 'folder' },
  { id: 'music', name: 'Music', icon: 'music-folder', type: 'folder' },
  { id: 'pictures', name: 'Pictures', icon: 'pictures-folder', type: 'folder' },
  { id: 'public', name: 'Public', icon: 'public-folder', type: 'folder' },
  { id: 'sites', name: 'Sites', icon: 'sites-folder', type: 'folder' },
];

/**
 * Macintosh HD contents (matches Tiger reference)
 */
const HD_CONTENTS: ContentItem[] = [
  { id: 'applications', name: 'Applications', icon: 'applications-folder', type: 'folder' },
  { id: 'developer', name: 'Developer', icon: 'developer-folder', type: 'folder' },
  { id: 'library', name: 'Library', icon: 'library-folder', type: 'folder' },
  { id: 'system', name: 'System', icon: 'system-folder', type: 'folder' },
  { id: 'users', name: 'Users', icon: 'users-folder', type: 'folder' },
];

/**
 * Applications folder contents
 * These are displayed greyed out and non-interactive (placeholder apps)
 */
const APPLICATION_ITEMS: ContentItem[] = [
  { id: 'safari', name: 'Safari', icon: 'app-safari', type: 'file', disabled: true },
  { id: 'address-book', name: 'Address Book', icon: 'app-addressbook', type: 'file', disabled: true },
  { id: 'preview', name: 'Preview', icon: 'app-preview', type: 'file', disabled: true },
  { id: 'disk-utility', name: 'Disk Utility', icon: 'app-diskutility', type: 'file', disabled: true },
  { id: 'network-utility', name: 'Network Utility', icon: 'app-networkutility', type: 'file', disabled: true },
  { id: 'installer', name: 'Installer', icon: 'app-installer', type: 'file', disabled: true },
  { id: 'internet-connect', name: 'Internet Connect', icon: 'app-internetconnect', type: 'file', disabled: true },
  { id: 'filevault', name: 'FileVault', icon: 'app-filevault', type: 'file', disabled: true },
  { id: 'doom', name: 'DOOM', icon: 'app-doom', type: 'file', disabled: true },
];

/** View mode types */
type ViewMode = 'icon' | 'list' | 'column';

/** Selection rectangle state */
interface SelectionState {
  isSelecting: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

/** Icon grid dimensions for intersection detection */
const ICON_CELL_WIDTH = 90;
const ICON_CELL_HEIGHT = 90;

/**
 * Calculate rectangle bounds from two points (relative coordinates)
 * Handles all four drag directions
 */
function calculateBounds(startX: number, startY: number, currentX: number, currentY: number) {
  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);
  return { left, top, width, height };
}

/**
 * Check if two rectangles intersect
 */
function rectanglesIntersect(
  r1: { left: number; top: number; width: number; height: number },
  r2: { left: number; top: number; width: number; height: number }
): boolean {
  return !(
    r1.left + r1.width < r2.left ||
    r2.left + r2.width < r1.left ||
    r1.top + r1.height < r2.top ||
    r2.top + r2.height < r1.top
  );
}

/**
 * Simple fuzzy search - matches if query characters appear in order
 */
function fuzzyMatch(query: string, text: string): boolean {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();

  // Simple substring match for now (most intuitive)
  if (lowerText.includes(lowerQuery)) return true;

  // Also check if characters appear in order (fuzzy)
  let queryIndex = 0;
  for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIndex]) {
      queryIndex++;
    }
  }
  return queryIndex === lowerQuery.length;
}

/**
 * Get all searchable items across all locations
 */
function getAllSearchableItems(): ContentItem[] {
  return [
    ...DESKTOP_CONTENTS,
    ...HOME_CONTENTS,
    ...HD_CONTENTS,
  ].filter((item, index, arr) =>
    // Remove duplicates by id
    arr.findIndex(i => i.id === item.id) === index
  );
}

/**
 * Map folder IDs to sidebar item IDs for navigation
 */
const FOLDER_TO_SIDEBAR_MAP: Record<string, string> = {
  'macintosh-hd': 'macintosh-hd',
  desktop: 'desktop',
  documents: 'documents',
  applications: 'applications',
  movies: 'movies',
  music: 'music',
  pictures: 'pictures',
  users: 'user', // Users folder maps to user home
};

/**
 * Files/apps that can be opened (maps to window IDs)
 */
const OPENABLE_ITEMS: Record<string, string> = {
  terminal: 'terminal',
  about: 'about',
  projects: 'projects',
  resume: 'resume',
  contact: 'contact',
};

export interface FinderProps {
  /** Initial location to display */
  location?: 'home' | 'hd' | 'trash';
  /** Initial search query (from Spotlight) */
  initialSearch?: string;
}

/**
 * Finder - Tiger-style file browser window
 *
 * Displays a Finder-like interface with:
 * - Toolbar with navigation and view controls
 * - Sidebar with common locations
 * - Content area with folder contents (Icon, List, or Column view)
 * - Status bar with item count
 */
export function Finder({ location = 'home', initialSearch = '' }: FinderProps) {
  const [selectedSidebarItem, setSelectedSidebarItem] = useState(
    location === 'hd' ? 'macintosh-hd' : location === 'trash' ? 'trash' : 'user'
  );
  const [selectedContentItems, setSelectedContentItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('icon');
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Selection rectangle state
  const [selection, setSelection] = useState<SelectionState>({
    isSelecting: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  // Track if we just finished a marquee selection
  const justFinishedMarquee = useRef(false);

  // Ref for content area to calculate icon positions
  const scrollbarRef = useRef<AquaScrollbarHandle>(null);
  const iconGridRef = useRef<HTMLDivElement>(null);

  // Helper to get the scrollable content element
  const getContentElement = useCallback(() => {
    return scrollbarRef.current?.getContentElement() ?? null;
  }, []);

  // Window store for opening apps
  const openWindow = useWindowStore((s) => s.openWindow);
  const openITunes = useWindowStore((s) => s.openITunes);
  const openQuickTime = useWindowStore((s) => s.openQuickTime);
  const openPreview = useWindowStore((s) => s.openPreview);
  const openSavedDocument = useWindowStore((s) => s.openSavedDocument);
  const clearAppSelection = useAppStore((s) => s.clearSelection);
  const trashedIcons = useAppStore((s) => s.trashedIcons);
  const folderContents = useAppStore((s) => s.folderContents);
  const emptyTrash = useAppStore((s) => s.emptyTrash);
  const restoreFromTrash = useAppStore((s) => s.restoreFromTrash);
  const permanentlyDeleteItem = useAppStore((s) => s.permanentlyDeleteItem);
  const showAlert = useAppStore((s) => s.showAlert);
  const isHoveringOverTrash = useAppStore((s) => s.isHoveringOverTrash);
  const moveToTrash = useAppStore((s) => s.moveToTrash);
  const photos = usePhotoStore((s) => s.photos);

  // Trash item context menu state
  const [trashContextMenu, setTrashContextMenu] = useState<{
    x: number;
    y: number;
    itemId: string;
    itemName: string;
  } | null>(null);

  // Finder background context menu state (same as title bar menu)
  const [finderContextMenu, setFinderContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Icon context menu state (for content and sidebar items)
  const [iconContextMenu, setIconContextMenu] = useState<{
    x: number;
    y: number;
    item: ContentItem | SidebarItem;
    source: 'content' | 'sidebar';
  } | null>(null);

  // Helper to convert dynamic icons to content items
  const dynamicIconsToContentItems = (folderId: string): ContentItem[] => {
    const icons = folderContents[folderId] || [];
    return icons.map((icon) => {
      // Map icon type to content icon type
      let contentIcon = 'document';
      if (icon.type === 'folder') contentIcon = 'folder';
      else if (icon.type === 'smart-folder') contentIcon = 'folder';
      else if (icon.type === 'burn-folder') contentIcon = 'folder';
      else if (icon.id === 'terminal') contentIcon = 'terminal';
      else if (icon.id === 'about') contentIcon = 'about-doc';
      else if (icon.id === 'projects') contentIcon = 'projects-doc';
      else if (icon.id === 'resume') contentIcon = 'resume-doc';
      else if (icon.id === 'contact') contentIcon = 'contact-doc';

      return {
        id: icon.id,
        name: icon.label,
        icon: contentIcon,
        type: icon.type === 'folder' || icon.type === 'smart-folder' || icon.type === 'burn-folder' ? 'folder' as const : 'file' as const,
        documentId: icon.documentId,
      };
    });
  };

  // Get view config based on selected sidebar item
  const getViewConfig = (): FinderViewConfig => {
    // If searching, return search results
    if (searchQuery.trim()) {
      const allItems = getAllSearchableItems();
      const matchingItems = allItems.filter(item =>
        fuzzyMatch(searchQuery, item.name)
      );
      return {
        title: `Search: "${searchQuery}"`,
        sidebarItems: SIDEBAR_ITEMS,
        contentItems: matchingItems,
        statusText: `${matchingItems.length} item${matchingItems.length !== 1 ? 's' : ''} found`,
      };
    }

    switch (selectedSidebarItem) {
      case 'macintosh-hd':
        return {
          title: 'Macintosh HD',
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: HD_CONTENTS,
          statusText: '5 items, 1.91 GB available',
        };
      case 'user': {
        const userDynamicItems = dynamicIconsToContentItems('user');
        const allUserItems = [...HOME_CONTENTS, ...userDynamicItems];
        return {
          title: 'nick',
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: allUserItems,
          statusText: `${allUserItems.length} item${allUserItems.length !== 1 ? 's' : ''}, 1.91 GB available`,
        };
      }
      case 'desktop': {
        const desktopDynamicItems = dynamicIconsToContentItems('desktop');
        const allDesktopItems = [...DESKTOP_CONTENTS, ...desktopDynamicItems];
        return {
          title: 'Desktop',
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: allDesktopItems,
          statusText: `${allDesktopItems.length} item${allDesktopItems.length !== 1 ? 's' : ''}, 1.91 GB available`,
        };
      }
      case 'applications':
        // Applications folder shows greyed-out placeholder apps
        return {
          title: 'Applications',
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: APPLICATION_ITEMS,
          statusText: `${APPLICATION_ITEMS.length} items`,
        };
      case 'documents': {
        // Documents folder shows dynamic contents (dropped icons)
        const docItems = dynamicIconsToContentItems('documents');
        return {
          title: 'Documents',
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: docItems,
          statusText: docItems.length === 0
            ? '0 items'
            : `${docItems.length} item${docItems.length !== 1 ? 's' : ''}`,
        };
      }
      case 'pictures': {
        // Pictures folder shows photos from iOS camera + dropped icons
        const photoItems: ContentItem[] = photos.map((photo) => ({
          id: photo.id,
          name: `Photo ${new Date(photo.timestamp).toLocaleDateString()}`,
          icon: 'picture-file',
          type: 'file' as const,
          dataUrl: photo.dataUrl,
        }));
        const pictureDynamicItems = dynamicIconsToContentItems('pictures');
        const allPictureItems = [...photoItems, ...pictureDynamicItems];
        return {
          title: 'Pictures',
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: allPictureItems,
          statusText: `${allPictureItems.length} item${allPictureItems.length !== 1 ? 's' : ''}`,
        };
      }
      case 'music': {
        const musicDynamicItems = dynamicIconsToContentItems('music');
        const allMusicItems = [...MUSIC_FILES, ...musicDynamicItems];
        return {
          title: 'Music',
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: allMusicItems,
          statusText: `${allMusicItems.length} item${allMusicItems.length !== 1 ? 's' : ''}`,
        };
      }
      case 'movies': {
        const moviesDynamicItems = dynamicIconsToContentItems('movies');
        const allMoviesItems = [...VIDEO_FILES, ...moviesDynamicItems];
        return {
          title: 'Movies',
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: allMoviesItems,
          statusText: `${allMoviesItems.length} item${allMoviesItems.length !== 1 ? 's' : ''}`,
        };
      }
      case 'trash': {
        // Convert trashed icons to content items
        const trashContents: ContentItem[] = trashedIcons.map((icon) => ({
          id: icon.id,
          name: icon.label,
          icon: icon.type === 'document' ? 'document' : icon.type === 'folder' ? 'folder' : 'document',
          type: icon.type === 'folder' || icon.type === 'smart-folder' || icon.type === 'burn-folder' ? 'folder' : 'file',
        }));
        return {
          title: 'Trash',
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: trashContents,
          statusText: trashContents.length === 0
            ? 'Trash is empty'
            : `${trashContents.length} item${trashContents.length !== 1 ? 's' : ''}`,
        };
      }
      default:
        return {
          title: 'nick',
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: HOME_CONTENTS,
          statusText: '8 items, 1.91 GB available',
        };
    }
  };

  const config = getViewConfig();

  const handleSidebarClick = (itemId: string) => {
    setSelectedSidebarItem(itemId);
    setSelectedContentItems([]);
    setSearchQuery(''); // Clear search when navigating
  };

  // Handle double-click on content item
  const handleContentDoubleClick = useCallback((item: ContentItem) => {
    if (item.type === 'folder') {
      // Navigate to folder if it's in sidebar
      const sidebarId = FOLDER_TO_SIDEBAR_MAP[item.id];
      if (sidebarId) {
        setSelectedSidebarItem(sidebarId);
        setSelectedContentItems([]);
        setSearchQuery('');
      } else if (item.id === 'macintosh-hd') {
        // Special case: Macintosh HD opens Finder HD view
        openWindow('finder-hd');
        clearAppSelection();
      }
    } else {
      // Check for music files
      if (item.icon === 'music-file') {
        openITunes(item.name);
        clearAppSelection();
        return;
      }
      // Check for video files
      if (item.icon === 'video-file') {
        openQuickTime(item.name);
        clearAppSelection();
        return;
      }
      // Check for picture files (from camera)
      if (item.icon === 'picture-file' && item.dataUrl) {
        openPreview(item.dataUrl, item.name);
        clearAppSelection();
        return;
      }
      // Check for documents with documentId (opens in TextEdit)
      if (item.documentId) {
        openSavedDocument(item.documentId, item.name);
        clearAppSelection();
        return;
      }
      // Open file/app
      const windowId = OPENABLE_ITEMS[item.id];
      if (windowId) {
        openWindow(windowId);
        clearAppSelection();
      }
    }
  }, [openWindow, openITunes, openQuickTime, openPreview, openSavedDocument, clearAppSelection]);

  const handleContentClick = useCallback((itemId: string, e: React.MouseEvent) => {
    // Skip if we just finished marquee
    if (justFinishedMarquee.current) {
      justFinishedMarquee.current = false;
      return;
    }

    // Multi-select with Cmd (Mac) or Ctrl (Windows)
    if (e.metaKey || e.ctrlKey) {
      setSelectedContentItems((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId) // Toggle off
          : [...prev, itemId] // Add to selection
      );
    } else if (e.shiftKey && selectedContentItems.length > 0) {
      // Range select with Shift
      const items = config.contentItems;
      const lastSelectedIndex = items.findIndex((i) => i.id === selectedContentItems[selectedContentItems.length - 1]);
      const clickedIndex = items.findIndex((i) => i.id === itemId);
      const start = Math.min(lastSelectedIndex, clickedIndex);
      const end = Math.max(lastSelectedIndex, clickedIndex);
      const rangeIds = items.slice(start, end + 1).map((i) => i.id);
      setSelectedContentItems(rangeIds);
    } else {
      // Single select
      setSelectedContentItems([itemId]);
    }
  }, [selectedContentItems, config.contentItems]);

  // Handle mouse down for marquee selection (using relative coordinates)
  const handleContentMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start selection if left click on content area background (not on items)
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    const isItem = target.closest(`.${styles.contentItem}`);
    if (isItem) return;

    // Get content area bounds for relative positioning
    const contentEl = getContentElement();
    if (!contentEl) return;
    const rect = contentEl.getBoundingClientRect();

    // Calculate position relative to content area
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    setSelection({
      isSelecting: true,
      startX: relX,
      startY: relY,
      currentX: relX,
      currentY: relY,
    });

    // Clear selection when starting new marquee (unless Cmd/Ctrl held)
    if (!e.metaKey && !e.ctrlKey) {
      setSelectedContentItems([]);
    }
  }, []);

  // Handle mouse move during selection (constrained to content area)
  useEffect(() => {
    if (!selection.isSelecting) return;

    const handleMouseMove = (e: MouseEvent) => {
      const contentEl = getContentElement();
      if (!contentEl) return;
      const rect = contentEl.getBoundingClientRect();

      // Calculate position relative to content area and constrain to bounds
      const relX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const relY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

      setSelection((prev) => ({
        ...prev,
        currentX: relX,
        currentY: relY,
      }));

      // Real-time selection: find icons within rectangle as we drag
      if (viewMode === 'icon' && iconGridRef.current) {
        const gridRect = iconGridRef.current.getBoundingClientRect();
        const contentRect = contentEl.getBoundingClientRect();

        // Grid offset relative to content area
        const gridOffsetX = gridRect.left - contentRect.left;
        const gridOffsetY = gridRect.top - contentRect.top;

        const selectionBounds = calculateBounds(
          selection.startX,
          selection.startY,
          relX,
          relY
        );

        // Calculate grid layout
        const gridWidth = gridRect.width;
        const itemsPerRow = Math.floor(gridWidth / ICON_CELL_WIDTH) || 1;

        const selectedIds: string[] = [];
        config.contentItems.forEach((item, index) => {
          const row = Math.floor(index / itemsPerRow);
          const col = index % itemsPerRow;

          // Icon position relative to content area
          const iconBounds = {
            left: gridOffsetX + col * ICON_CELL_WIDTH,
            top: gridOffsetY + row * ICON_CELL_HEIGHT,
            width: ICON_CELL_WIDTH,
            height: ICON_CELL_HEIGHT,
          };

          if (rectanglesIntersect(selectionBounds, iconBounds)) {
            selectedIds.push(item.id);
          }
        });

        setSelectedContentItems(selectedIds);
      }
    };

    const handleMouseUp = () => {
      justFinishedMarquee.current = true;
      setSelection((prev) => ({
        ...prev,
        isSelecting: false,
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selection.isSelecting, selection.startX, selection.startY, viewMode, config.contentItems]);

  // Clear selection when clicking on empty content area
  const handleContentAreaClick = useCallback((e: React.MouseEvent) => {
    // Skip if we just finished marquee
    if (justFinishedMarquee.current) {
      justFinishedMarquee.current = false;
      return;
    }

    // Only clear if clicking directly on the content area (not on items)
    if (e.target === e.currentTarget) {
      setSelectedContentItems([]);
    }
  }, []);

  // Handle Enter key to open all selected items
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedContentItems.length > 0) {
        e.preventDefault();
        // Open each selected item
        selectedContentItems.forEach((itemId) => {
          const item = config.contentItems.find((i) => i.id === itemId);
          if (!item) return;

          if (item.type === 'folder') {
            // Navigate to folder if in sidebar
            const sidebarId = FOLDER_TO_SIDEBAR_MAP[item.id];
            if (sidebarId) {
              setSelectedSidebarItem(sidebarId);
              setSelectedContentItems([]);
              setSearchQuery('');
            } else if (item.id === 'macintosh-hd') {
              openWindow('finder-hd');
              clearAppSelection();
            }
          } else {
            // Open file/app
            const windowId = OPENABLE_ITEMS[item.id];
            if (windowId) {
              openWindow(windowId);
              clearAppSelection();
            }
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedContentItems, config.contentItems, openWindow, clearAppSelection]);

  // Handle search input
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedContentItems([]); // Clear selection when searching
  }, []);

  // Handle drag start for trash items (to restore to desktop)
  const handleTrashItemDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('text/plain', itemId);
    e.dataTransfer.setData('application/x-trash-item', itemId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  // Handle right-click on trash item
  const handleTrashItemContextMenu = useCallback((e: React.MouseEvent, itemId: string, itemName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setTrashContextMenu({
      x: e.clientX,
      y: e.clientY,
      itemId,
      itemName,
    });
  }, []);

  // Close trash context menu
  const closeTrashContextMenu = useCallback(() => {
    setTrashContextMenu(null);
  }, []);

  // Get context menu items for trash item
  const getTrashContextMenuItems = useCallback((itemId: string): ContextMenuEntry[] => {
    return [
      {
        type: 'item',
        label: 'Put Back',
        onClick: () => restoreFromTrash(itemId),
      },
      {
        type: 'item',
        label: 'Delete Immediately',
        onClick: () => permanentlyDeleteItem(itemId),
      },
      { type: 'divider' },
      {
        type: 'item',
        label: 'Empty Trash',
        onClick: () => {
          showAlert({
            title: 'Empty Trash',
            message: `Are you sure you want to permanently delete ${trashedIcons.length} item${trashedIcons.length !== 1 ? 's' : ''}?`,
            type: 'caution',
            showCancel: true,
            okText: 'Empty Trash',
            cancelText: 'Cancel',
            onOk: () => emptyTrash(),
            playSound: true,
          });
        },
      },
    ];
  }, [restoreFromTrash, permanentlyDeleteItem, showAlert, trashedIcons.length, emptyTrash]);

  // Handle right-click on Finder background (not on items)
  const handleFinderContextMenu = useCallback((e: React.MouseEvent) => {
    // Only show if clicking on content area background, not on items
    const target = e.target as HTMLElement;
    const isItem = target.closest(`.${styles.contentItem}`) ||
                   target.closest(`.${styles.listRow}`) ||
                   target.closest(`.${styles.columnItem}`) ||
                   target.closest(`.${styles.sidebarItem}`);
    if (!isItem) {
      e.preventDefault();
      setFinderContextMenu({ x: e.clientX, y: e.clientY });
    }
  }, []);

  // Close Finder context menu
  const closeFinderContextMenu = useCallback(() => {
    setFinderContextMenu(null);
  }, []);

  // Get Finder File menu items (same as title bar context menu)
  const getFinderContextMenuItems = useCallback((): ContextMenuEntry[] => {
    return [
      { type: 'item', label: 'New Finder Window', onClick: () => openWindow('finder-home') },
      { type: 'item', label: 'New Folder', disabled: true },
      { type: 'divider' },
      { type: 'item', label: 'Get Info', disabled: true },
      { type: 'item', label: 'Find...', disabled: true },
    ];
  }, [openWindow]);

  // Handle right-click on content item (not in trash)
  const handleContentItemContextMenu = useCallback((e: React.MouseEvent, item: ContentItem) => {
    e.preventDefault();
    e.stopPropagation();
    setIconContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      source: 'content',
    });
  }, []);

  // Handle right-click on sidebar item
  const handleSidebarItemContextMenu = useCallback((e: React.MouseEvent, item: SidebarItem) => {
    e.preventDefault();
    e.stopPropagation();
    setIconContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      source: 'sidebar',
    });
  }, []);

  // Close icon context menu
  const closeIconContextMenu = useCallback(() => {
    setIconContextMenu(null);
  }, []);

  // Get context menu items for an icon (same as desktop icon context menu)
  const getIconContextMenuItems = useCallback((item: ContentItem | SidebarItem, source: 'content' | 'sidebar'): ContextMenuEntry[] => {
    const itemId = item.id;
    const isContentItem = source === 'content';
    const contentItem = isContentItem ? (item as ContentItem) : null;

    // Handle open action
    const handleOpen = () => {
      if (itemId === 'macintosh-hd') {
        openWindow('finder-hd');
      } else if (OPENABLE_ITEMS[itemId]) {
        openWindow(OPENABLE_ITEMS[itemId]);
      } else if (FOLDER_TO_SIDEBAR_MAP[itemId]) {
        // Navigate to folder in current Finder window
        setSelectedSidebarItem(FOLDER_TO_SIDEBAR_MAP[itemId]);
        setSelectedContentItems([]);
        setSearchQuery('');
      }
      clearAppSelection();
    };

    const handleMoveToTrash = () => {
      moveToTrash(itemId);
    };

    // Macintosh HD context menu
    if (itemId === 'macintosh-hd') {
      return [
        { type: 'item', label: 'Open', onClick: handleOpen },
        { type: 'item', label: 'Get Info', disabled: true },
        { type: 'item', label: 'Manage Storage...', disabled: true },
      ];
    }

    // Terminal context menu
    if (itemId === 'terminal') {
      return [
        { type: 'item', label: 'Open', onClick: handleOpen },
        { type: 'item', label: 'Get Info', disabled: true },
        { type: 'item', label: 'Move to Trash', onClick: handleMoveToTrash },
      ];
    }

    // Sidebar items (locations) - can't be trashed
    if (source === 'sidebar') {
      return [
        { type: 'item', label: 'Open', onClick: handleOpen },
        { type: 'item', label: 'Get Info', disabled: true },
      ];
    }

    // Folder context menu
    if (contentItem?.type === 'folder') {
      // System folders can't be trashed
      const isSystemFolder = ['applications', 'developer', 'library', 'system', 'users', 'desktop', 'documents', 'movies', 'music', 'pictures', 'public', 'sites'].includes(itemId);
      return [
        { type: 'item', label: 'Open', onClick: handleOpen },
        { type: 'item', label: 'Get Info', disabled: true },
        { type: 'item', label: 'Compress', disabled: true },
        ...(isSystemFolder ? [] : [{ type: 'item' as const, label: 'Move to Trash', onClick: handleMoveToTrash }]),
      ];
    }

    // Document/file context menu
    return [
      { type: 'item', label: 'Open', onClick: handleOpen },
      { type: 'item', label: 'Get Info', disabled: true },
      { type: 'item', label: 'Compress', disabled: true },
      { type: 'item', label: 'Move to Trash', onClick: handleMoveToTrash },
    ];
  }, [openWindow, clearAppSelection, moveToTrash]);

  return (
    <div className={styles.finder} data-testid="finder">
      {/* Toolbar - also acts as drag handle for window */}
      <div className={`${styles.toolbar} window-drag-handle`} onContextMenu={handleFinderContextMenu}>
        <div className={styles.toolbarLeft}>
          {/* Navigation buttons */}
          <div className={styles.navButtons}>
            <button className={`${styles.navButton} ${styles.backButton}`} aria-label="Back" disabled>
              <img src="/icons/left.png" alt="" width={12} height={12} draggable={false} />
            </button>
            <button className={`${styles.navButton} ${styles.forwardButton}`} aria-label="Forward" disabled>
              <img src="/icons/right.png" alt="" width={12} height={12} draggable={false} />
            </button>
          </div>

          {/* View mode buttons */}
          <div className={styles.viewButtons}>
            <button
              className={`${styles.viewButton} ${viewMode === 'icon' ? styles.viewButtonActive : ''}`}
              aria-label="Icon view"
              aria-pressed={viewMode === 'icon'}
              onClick={() => setViewMode('icon')}
            >
              <IconViewIcon />
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.viewButtonActive : ''}`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <ListViewIcon />
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'column' ? styles.viewButtonActive : ''}`}
              aria-label="Column view"
              aria-pressed={viewMode === 'column'}
              onClick={() => setViewMode('column')}
            >
              <ColumnViewIcon />
            </button>
          </div>
        </div>

        <div className={styles.toolbarRight}>
          {/* Search field */}
          <div className={styles.searchField}>
            <SearchIcon />
            <input
              type="text"
              placeholder=""
              className={styles.searchInput}
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Content wrapper with brushed metal borders */}
      <div className={styles.contentWrapper}>
        {/* Main content area */}
        <div className={styles.main}>
          {/* Sidebar */}
          <AquaScrollbar className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              {config.sidebarItems.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.sidebarItem} ${selectedSidebarItem === item.id ? styles.sidebarItemSelected : ''}`}
                  onClick={() => handleSidebarClick(item.id)}
                  onContextMenu={(e) => handleSidebarItemContextMenu(e, item)}
                >
                  <SidebarIcon type={item.icon} />
                  <span className={styles.sidebarLabel}>{item.label}</span>
                </button>
              ))}
            </div>
          </AquaScrollbar>

        {/* Content column (trash bar + scrollable content) */}
        <div className={styles.contentColumn}>
          {/* Empty Trash bar - only show when viewing trash with items */}
          {selectedSidebarItem === 'trash' && trashedIcons.length > 0 && (
            <div className={styles.trashBar}>
              <button
                className={styles.emptyTrashButton}
                onClick={() => {
                  showAlert({
                    title: 'Empty Trash',
                    message: `Are you sure you want to permanently delete ${trashedIcons.length} item${trashedIcons.length !== 1 ? 's' : ''}?`,
                    type: 'caution',
                    showCancel: true,
                    okText: 'Empty Trash',
                    cancelText: 'Cancel',
                    onOk: () => emptyTrash(),
                    playSound: true,
                  });
                }}
              >
                Empty Trash
              </button>
            </div>
          )}

          {/* Content area */}
          <AquaScrollbar
            ref={scrollbarRef}
            className={`${styles.content} ${viewMode !== 'icon' ? styles.contentNoPadding : ''} ${selectedSidebarItem === 'trash' && isHoveringOverTrash ? styles.contentDragOver : ''}`}
            onClick={handleContentAreaClick}
            onMouseDown={handleContentMouseDown}
            onContextMenu={handleFinderContextMenu}
            data-testid={selectedSidebarItem === 'trash' ? 'finder-trash-content' : 'finder-folder-content'}
            data-folder-id={selectedSidebarItem}
          >
          {config.contentItems.length === 0 ? (
            <div className={styles.emptyState}>
              {selectedSidebarItem === 'trash' ? 'Trash is empty' : searchQuery ? 'No matches found' : 'This folder is empty'}
            </div>
          ) : viewMode === 'icon' ? (
            <div ref={iconGridRef} className={styles.iconGrid} onClick={handleContentAreaClick}>
              {config.contentItems.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.contentItem} ${selectedContentItems.includes(item.id) ? styles.contentItemSelected : ''} ${item.disabled ? styles.contentItemDisabled : ''}`}
                  onClick={(e) => { e.stopPropagation(); if (!item.disabled) handleContentClick(item.id, e); }}
                  onDoubleClick={() => { if (!item.disabled) handleContentDoubleClick(item); }}
                  onContextMenu={selectedSidebarItem === 'trash' ? (e) => handleTrashItemContextMenu(e, item.id, item.name) : (e) => handleContentItemContextMenu(e, item)}
                  draggable={selectedSidebarItem === 'trash' && !item.disabled}
                  onDragStart={selectedSidebarItem === 'trash' ? (e) => handleTrashItemDragStart(e, item.id) : undefined}
                >
                  <ContentIcon type={item.icon} dataUrl={item.dataUrl} />
                  <span className={styles.contentLabel}>{item.name}</span>
                </button>
              ))}
            </div>
          ) : viewMode === 'list' ? (
            <div className={styles.listView}>
              <div className={styles.listHeader}>
                <span className={styles.listHeaderName}>Name</span>
                <span className={styles.listHeaderDate}>Date Modified</span>
              </div>
              {config.contentItems.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.listRow} ${selectedContentItems.includes(item.id) ? styles.listRowSelected : ''} ${item.disabled ? styles.contentItemDisabled : ''}`}
                  onClick={(e) => { e.stopPropagation(); if (!item.disabled) handleContentClick(item.id, e); }}
                  onDoubleClick={() => { if (!item.disabled) handleContentDoubleClick(item); }}
                  onContextMenu={selectedSidebarItem === 'trash' ? (e) => handleTrashItemContextMenu(e, item.id, item.name) : (e) => handleContentItemContextMenu(e, item)}
                  draggable={selectedSidebarItem === 'trash' && !item.disabled}
                  onDragStart={selectedSidebarItem === 'trash' ? (e) => handleTrashItemDragStart(e, item.id) : undefined}
                >
                  <span className={styles.listDisclosure}>▶</span>
                  <SmallIcon type={item.icon} />
                  <span className={styles.listName}>{item.name}</span>
                  <span className={styles.listDate}>Jan 9, 2026, 12:00 PM</span>
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.columnView}>
              <div className={styles.column}>
                {config.contentItems.map((item) => (
                  <button
                    key={item.id}
                    className={`${styles.columnItem} ${selectedContentItems.includes(item.id) ? styles.columnItemSelected : ''} ${item.disabled ? styles.contentItemDisabled : ''}`}
                    onClick={(e) => { e.stopPropagation(); if (!item.disabled) handleContentClick(item.id, e); }}
                    onDoubleClick={() => { if (!item.disabled) handleContentDoubleClick(item); }}
                    onContextMenu={selectedSidebarItem === 'trash' ? (e) => handleTrashItemContextMenu(e, item.id, item.name) : (e) => handleContentItemContextMenu(e, item)}
                    draggable={selectedSidebarItem === 'trash' && !item.disabled}
                    onDragStart={selectedSidebarItem === 'trash' ? (e) => handleTrashItemDragStart(e, item.id) : undefined}
                  >
                    <SmallIcon type={item.icon} />
                    <span className={styles.columnName}>{item.name}</span>
                    {item.type === 'folder' && <span className={styles.columnArrow}>▶</span>}
                  </button>
                ))}
              </div>
              <div className={styles.columnDivider} />
              <div className={styles.column} />
              <div className={styles.columnDivider} />
              <div className={styles.column} />
            </div>
          )}

          {/* Selection rectangle (marquee select) - absolute positioned within content */}
          {selection.isSelecting && (() => {
            const bounds = calculateBounds(
              selection.startX,
              selection.startY,
              selection.currentX,
              selection.currentY
            );
            return (
              <div
                style={{
                  position: 'absolute',
                  left: bounds.left,
                  top: bounds.top,
                  width: bounds.width,
                  height: bounds.height,
                  backgroundColor: 'rgba(0, 112, 215, 0.2)',
                  border: '1px solid rgba(0, 112, 215, 0.6)',
                  pointerEvents: 'none',
                  zIndex: 1000,
                }}
              />
            );
          })()}
        </AquaScrollbar>
        </div>
        </div>
      </div>

      {/* Status bar */}
      <div className={styles.statusBar} onContextMenu={handleFinderContextMenu}>
        {config.statusText}
        <div className={styles.resizeGrip} />
      </div>

      {/* Trash item context menu */}
      {trashContextMenu && (
        <ContextMenu
          x={trashContextMenu.x}
          y={trashContextMenu.y}
          onClose={closeTrashContextMenu}
          items={getTrashContextMenuItems(trashContextMenu.itemId)}
        />
      )}

      {/* Finder background context menu (same as title bar menu) */}
      {finderContextMenu && (
        <ContextMenu
          x={finderContextMenu.x}
          y={finderContextMenu.y}
          onClose={closeFinderContextMenu}
          items={getFinderContextMenuItems()}
        />
      )}

      {/* Icon context menu (for sidebar and content items) */}
      {iconContextMenu && (
        <ContextMenu
          x={iconContextMenu.x}
          y={iconContextMenu.y}
          onClose={closeIconContextMenu}
          items={getIconContextMenuItems(iconContextMenu.item, iconContextMenu.source)}
        />
      )}
    </div>
  );
}

// ============================================
// Icon Components
// ============================================

function IconViewIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}

function ListViewIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect x="1" y="2" width="14" height="3" rx="1" fill="currentColor" />
      <rect x="1" y="7" width="14" height="3" rx="1" fill="currentColor" />
      <rect x="1" y="12" width="14" height="3" rx="1" fill="currentColor" />
    </svg>
  );
}

function ColumnViewIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect x="1" y="1" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="6" y="1" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="11" y="1" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Sidebar icon mapping - uses authentic Tiger icons from Resources folder
 */
const SIDEBAR_ICON_MAP: Record<string, string> = {
  hd: '/icons/sidebar/hd.png',
  desktop: '/icons/sidebar/desktop.png',
  user: '/icons/sidebar/home.png',
  applications: '/icons/sidebar/applications.png',
  documents: '/icons/sidebar/documents.png',
  movies: '/icons/sidebar/movies.png',
  music: '/icons/sidebar/music.png',
  pictures: '/icons/sidebar/pictures.png',
  trash: '/icons/trash-empty.png',
};

function SidebarIcon({ type }: { type: string }) {
  const iconSrc = SIDEBAR_ICON_MAP[type];

  if (!iconSrc) {
    // Fallback to a generic folder icon or empty
    return null;
  }

  return (
    <img
      src={iconSrc}
      alt=""
      width={32}
      height={32}
      draggable={false}
      aria-hidden="true"
      style={{ objectFit: 'contain' }}
    />
  );
}

/**
 * Content icon mapping - maps icon type to image path
 * Special case: 'terminal' uses SVG component
 */
const CONTENT_ICON_MAP: Record<string, string> = {
  folder: '/icons/GenericFolderIcon.png',
  'macintosh-hd': '/icons/macintosh-hd.png',
  document: '/icons/document.png',
  // Document-specific icons (matching desktop icons)
  'about-doc': '/icons/AlertNoteIcon.png',
  'projects-doc': '/icons/ADCReferenceLibraryIcon.png',
  'resume-doc': '/icons/pdf.png',
  'contact-doc': '/icons/AddressBook.png',
  // Folder-specific icons (authentic Tiger folder icons)
  'applications-folder': '/icons/ApplicationsFolderIcon.png',
  'desktop-folder': '/icons/DesktopFolderIcon.png',
  'developer-folder': '/icons/DeveloperFolderIcon.png',
  'documents-folder': '/icons/DocumentsFolderIcon.png',
  'library-folder': '/icons/LibraryFolderIcon.png',
  'movies-folder': '/icons/MovieFolderIcon.png',
  'music-folder': '/icons/MusicFolderIcon.png',
  'pictures-folder': '/icons/PicturesFolderIcon.png',
  'public-folder': '/icons/PublicFolderIcon.png',
  'sites-folder': '/icons/SitesFolderIcon.png',
  'system-folder': '/icons/SystemFolderIcon.png',
  'home-folder': '/icons/HomeFolderIcon.png',
  'users-folder': '/icons/UsersFolderIcon.png',
  // Media files
  'music-file': '/icons/itunes.png',
  'video-file': '/icons/quicktime-logo.png',
  'picture-file': '/icons/PicturesFolderIcon.png',
  // Application icons (greyed out in Applications folder)
  'app-safari': '/icons/compass.png',
  'app-addressbook': '/icons/AddressBook.png',
  'app-preview': '/icons/preview.png',
  'app-diskutility': '/icons/diskcopy.png',
  'app-networkutility': '/icons/NetworkUtility.png',
  'app-installer': '/icons/Installer.png',
  'app-internetconnect': '/icons/GenericNetworkIcon.png',
  'app-filevault': '/icons/FileVaultIcon.png',
  'app-doom': '/icons/Floppy.png',
};

function ContentIcon({ type, dataUrl }: { type: string; dataUrl?: string }) {
  // Terminal uses custom SVG icon
  if (type === 'terminal') {
    return <TerminalIcon size={64} />;
  }

  // Picture files with dataUrl show actual photo thumbnail
  if (type === 'picture-file' && dataUrl) {
    return (
      <img
        src={dataUrl}
        alt=""
        width="64"
        height="64"
        aria-hidden="true"
        draggable={false}
        style={{ objectFit: 'cover', borderRadius: '4px' }}
      />
    );
  }

  // Use mapped icon or fallback to folder
  const iconSrc = CONTENT_ICON_MAP[type] || CONTENT_ICON_MAP.folder;

  return (
    <img
      src={iconSrc}
      alt=""
      width="64"
      height="64"
      aria-hidden="true"
      draggable={false}
    />
  );
}

function SmallIcon({ type }: { type: string }) {
  // Terminal uses custom SVG icon
  if (type === 'terminal') {
    return <TerminalIcon size={16} />;
  }

  // Use mapped icon or fallback to folder
  const iconSrc = CONTENT_ICON_MAP[type] || CONTENT_ICON_MAP.folder;

  return (
    <img
      src={iconSrc}
      alt=""
      width="16"
      height="16"
      aria-hidden="true"
      draggable={false}
    />
  );
}
