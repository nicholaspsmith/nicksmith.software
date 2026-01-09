import { useState } from 'react';
import styles from './Finder.module.css';

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
];

/**
 * Home folder contents
 */
const HOME_CONTENTS: ContentItem[] = [
  { id: 'desktop', name: 'Desktop', icon: 'folder', type: 'folder' },
  { id: 'documents', name: 'Documents', icon: 'folder', type: 'folder' },
  { id: 'library', name: 'Library', icon: 'folder', type: 'folder' },
  { id: 'movies', name: 'Movies', icon: 'folder', type: 'folder' },
  { id: 'music', name: 'Music', icon: 'folder', type: 'folder' },
  { id: 'pictures', name: 'Pictures', icon: 'folder', type: 'folder' },
  { id: 'public', name: 'Public', icon: 'folder', type: 'folder' },
  { id: 'sites', name: 'Sites', icon: 'folder', type: 'folder' },
];

/**
 * Macintosh HD contents (matches Tiger reference)
 */
const HD_CONTENTS: ContentItem[] = [
  { id: 'applications', name: 'Applications', icon: 'folder', type: 'folder' },
  { id: 'developer', name: 'Developer', icon: 'folder', type: 'folder' },
  { id: 'library', name: 'Library', icon: 'folder', type: 'folder' },
  { id: 'system', name: 'System', icon: 'folder', type: 'folder' },
  { id: 'users', name: 'Users', icon: 'folder', type: 'folder' },
];

/** View mode types */
type ViewMode = 'icon' | 'list' | 'column';

export interface FinderProps {
  /** Initial location to display */
  location?: 'home' | 'hd';
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
export function Finder({ location = 'home' }: FinderProps) {
  const [selectedSidebarItem, setSelectedSidebarItem] = useState(
    location === 'hd' ? 'macintosh-hd' : 'user'
  );
  const [selectedContentItem, setSelectedContentItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('icon');

  // Get view config based on selected sidebar item
  const getViewConfig = (): FinderViewConfig => {
    switch (selectedSidebarItem) {
      case 'macintosh-hd':
        return {
          title: 'Macintosh HD',
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: HD_CONTENTS,
          statusText: '5 items, 1.91 GB available',
        };
      case 'user':
        return {
          title: 'nick',
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: HOME_CONTENTS,
          statusText: '8 items, 1.91 GB available',
        };
      case 'desktop':
        return {
          title: 'Desktop',
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: [],
          statusText: '0 items, 1.91 GB available',
        };
      case 'applications':
      case 'documents':
      case 'movies':
      case 'music':
      case 'pictures':
        // These folders show empty state for now
        return {
          title: SIDEBAR_ITEMS.find(i => i.id === selectedSidebarItem)?.label || selectedSidebarItem,
          sidebarItems: SIDEBAR_ITEMS,
          contentItems: [],
          statusText: '0 items',
        };
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
    setSelectedContentItem(null);
  };

  const handleContentClick = (itemId: string) => {
    setSelectedContentItem(itemId);
  };

  return (
    <div className={styles.finder} data-testid="finder">
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          {/* Navigation buttons */}
          <div className={styles.navButtons}>
            <button className={styles.navButton} aria-label="Back" disabled>
              <NavArrowIcon direction="left" />
            </button>
            <button className={styles.navButton} aria-label="Forward" disabled>
              <NavArrowIcon direction="right" />
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

          {/* Action menu */}
          <button className={styles.actionButton} aria-label="Actions">
            <GearIcon />
          </button>
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
            />
          </div>
        </div>
      </div>

      {/* Content wrapper with brushed metal borders */}
      <div className={styles.contentWrapper}>
        {/* Main content area */}
        <div className={styles.main}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
          {config.sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.sidebarItem} ${selectedSidebarItem === item.id ? styles.sidebarItemSelected : ''}`}
              onClick={() => handleSidebarClick(item.id)}
            >
              <SidebarIcon type={item.icon} />
              <span className={styles.sidebarLabel}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className={styles.content}>
          {config.contentItems.length === 0 ? (
            <div className={styles.emptyState}>
              {selectedSidebarItem === 'trash' ? 'Trash is empty' : 'This folder is empty'}
            </div>
          ) : viewMode === 'icon' ? (
            <div className={styles.iconGrid}>
              {config.contentItems.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.contentItem} ${selectedContentItem === item.id ? styles.contentItemSelected : ''}`}
                  onClick={() => handleContentClick(item.id)}
                >
                  <ContentIcon type={item.icon} />
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
                  className={`${styles.listRow} ${selectedContentItem === item.id ? styles.listRowSelected : ''}`}
                  onClick={() => handleContentClick(item.id)}
                >
                  <span className={styles.listDisclosure}>▶</span>
                  <SmallFolderIcon />
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
                    className={`${styles.columnItem} ${selectedContentItem === item.id ? styles.columnItemSelected : ''}`}
                    onClick={() => handleContentClick(item.id)}
                  >
                    <SmallFolderIcon />
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
        </div>
        </div>
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        {config.statusText}
        <div className={styles.resizeGrip} />
      </div>
    </div>
  );
}

// ============================================
// Icon Components
// ============================================

function NavArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path
        d={direction === 'left'
          ? 'M10 3L5 8l5 5'
          : 'M6 3l5 5-5 5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function GearIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="M8 10a2 2 0 100-4 2 2 0 000 4z"
        fill="currentColor"
      />
      <path
        d="M14 8.5v-1l-1.5-.5-.3-.7.7-1.3-.7-.7-1.3.7-.7-.3L9.5 3h-1l-.5 1.5-.7.3-1.3-.7-.7.7.7 1.3-.3.7L4 7.5v1l1.5.5.3.7-.7 1.3.7.7 1.3-.7.7.3.5 1.5h1l.5-1.5.7-.3 1.3.7.7-.7-.7-1.3.3-.7L14 8.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
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

function ContentIcon({ type: _type }: { type: string }) {
  // Larger folder icon for content area
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
      <defs>
        <linearGradient id="folderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <path
        d="M4 16a4 4 0 014-4h16l4 4h28a4 4 0 014 4v32a4 4 0 01-4 4H8a4 4 0 01-4-4V16z"
        fill="url(#folderGradient)"
      />
      <path
        d="M4 20h56v32a4 4 0 01-4 4H8a4 4 0 01-4-4V20z"
        fill="#60A5FA"
      />
    </svg>
  );
}

function SmallFolderIcon() {
  // Small folder icon for list and column views
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <defs>
        <linearGradient id="smallFolderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <path
        d="M1 4a1 1 0 011-1h4l1 1h7a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4z"
        fill="url(#smallFolderGradient)"
      />
      <path
        d="M1 5h14v8a1 1 0 01-1 1H2a1 1 0 01-1-1V5z"
        fill="#60A5FA"
      />
    </svg>
  );
}
