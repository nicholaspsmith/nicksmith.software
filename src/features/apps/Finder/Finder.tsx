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

      {/* Status bar */}
      <div className={styles.statusBar}>
        {config.statusText}
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

function SidebarIcon({ type }: { type: string }) {
  // Tiger Finder uses 32x32 sidebar icons with detailed styling
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
      {/* Hard Drive - silver/gray metallic drive */}
      {type === 'hd' && (
        <>
          <defs>
            <linearGradient id="hdBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f0f0f0" />
              <stop offset="30%" stopColor="#d8d8d8" />
              <stop offset="70%" stopColor="#c0c0c0" />
              <stop offset="100%" stopColor="#a8a8a8" />
            </linearGradient>
          </defs>
          <rect x="2" y="8" width="28" height="16" rx="3" fill="url(#hdBodyGrad)" stroke="#808080" strokeWidth="1" />
          <rect x="4" y="10" width="18" height="6" rx="1" fill="#e8e8e8" stroke="#999" strokeWidth="0.5" />
          <circle cx="26" cy="16" r="2" fill="#4ADE80" />
          <rect x="4" y="18" width="14" height="2" rx="0.5" fill="#d0d0d0" />
        </>
      )}

      {/* Desktop - blue monitor with desktop image */}
      {type === 'desktop' && (
        <>
          <defs>
            <linearGradient id="monitorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="26" height="18" rx="2" fill="url(#monitorGrad)" stroke="#1E40AF" strokeWidth="1" />
          <rect x="5" y="5" width="22" height="14" fill="#1E3A5F" />
          {/* Desktop pattern - mini icons */}
          <rect x="7" y="7" width="3" height="3" fill="#60A5FA" />
          <rect x="7" y="12" width="3" height="3" fill="#F472B6" />
          <rect x="12" y="15" width="5" height="2" fill="#94A3B8" />
          {/* Stand */}
          <rect x="12" y="22" width="8" height="3" fill="#6B7280" />
          <rect x="9" y="26" width="14" height="2" rx="1" fill="#9CA3AF" />
        </>
      )}

      {/* User Home - red house icon (Tiger style) */}
      {type === 'user' && (
        <>
          <defs>
            <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
            <linearGradient id="houseBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEE2E2" />
              <stop offset="100%" stopColor="#FECACA" />
            </linearGradient>
          </defs>
          {/* Roof */}
          <path d="M16 2L2 14h4v14h20V14h4L16 2z" fill="url(#roofGrad)" />
          {/* House body */}
          <rect x="6" y="14" width="20" height="14" fill="url(#houseBodyGrad)" />
          {/* Chimney */}
          <rect x="22" y="6" width="4" height="8" fill="#7F1D1D" />
          {/* Door */}
          <rect x="13" y="18" width="6" height="10" fill="#7F1D1D" rx="0.5" />
          <circle cx="17" cy="23" r="0.8" fill="#FCD34D" />
        </>
      )}

      {/* Applications - compass/ruler A icon (Tiger yellow-orange) */}
      {type === 'applications' && (
        <>
          <defs>
            <linearGradient id="appBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          {/* Triangle/A shape */}
          <path d="M16 2L4 28h8l2-6h4l2 6h8L16 2z" fill="url(#appBgGrad)" stroke="#D97706" strokeWidth="1" />
          {/* Inner triangle cutout */}
          <path d="M16 10l-3 10h6l-3-10z" fill="#FEF3C7" />
          {/* Ruler marks */}
          <path d="M6 26l2-4M10 26l1-3" stroke="#92400E" strokeWidth="1" />
          {/* Pencil across */}
          <line x1="8" y1="12" x2="24" y2="20" stroke="#EF4444" strokeWidth="2" />
          <polygon points="24,20 28,18 26,22" fill="#F87171" />
        </>
      )}

      {/* Documents - paper/document icon */}
      {type === 'documents' && (
        <>
          <defs>
            <linearGradient id="docPaperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          {/* Paper with folded corner */}
          <path d="M6 2h14l6 6v20a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" fill="url(#docPaperGrad)" stroke="#9CA3AF" strokeWidth="1" />
          {/* Folded corner */}
          <path d="M20 2v6h6" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1" />
          {/* Text lines */}
          <line x1="8" y1="14" x2="18" y2="14" stroke="#9CA3AF" strokeWidth="1.5" />
          <line x1="8" y1="18" x2="22" y2="18" stroke="#9CA3AF" strokeWidth="1.5" />
          <line x1="8" y1="22" x2="20" y2="22" stroke="#9CA3AF" strokeWidth="1.5" />
        </>
      )}

      {/* Movies - film clapperboard (dark green) */}
      {type === 'movies' && (
        <>
          <defs>
            <linearGradient id="clapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1F2937" />
            </linearGradient>
          </defs>
          {/* Clapper top */}
          <rect x="2" y="4" width="28" height="8" rx="1" fill="#1F2937" />
          {/* Diagonal stripes */}
          <path d="M4 4l6 8M10 4l6 8M16 4l6 8M22 4l6 8" stroke="#F9FAFB" strokeWidth="2" />
          {/* Body */}
          <rect x="2" y="12" width="28" height="16" rx="1" fill="url(#clapGrad)" />
          {/* Film strip */}
          <rect x="6" y="16" width="20" height="8" fill="#059669" rx="1" />
          <rect x="8" y="18" width="4" height="4" fill="#10B981" />
          <rect x="14" y="18" width="4" height="4" fill="#10B981" />
          <rect x="20" y="18" width="4" height="4" fill="#10B981" />
        </>
      )}

      {/* Music - music note (gray/blue iTunes style) */}
      {type === 'music' && (
        <>
          <defs>
            <linearGradient id="noteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          {/* Note head (bottom circle) */}
          <ellipse cx="10" cy="24" rx="6" ry="4" fill="url(#noteGrad)" />
          {/* Stem */}
          <rect x="14" y="6" width="3" height="18" fill="url(#noteGrad)" />
          {/* Flag */}
          <path d="M17 6c0 0 8-2 10 2v8c-2-4-10-2-10-2" fill="url(#noteGrad)" />
        </>
      )}

      {/* Pictures - photo/image icon (light blue polaroid) */}
      {type === 'pictures' && (
        <>
          <defs>
            <linearGradient id="photoFrameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>
          {/* Frame */}
          <rect x="2" y="2" width="28" height="28" rx="2" fill="url(#photoFrameGrad)" stroke="#7DD3FC" strokeWidth="1" />
          {/* Photo area */}
          <rect x="4" y="4" width="24" height="18" fill="#0EA5E9" />
          {/* Sun */}
          <circle cx="10" cy="10" r="3" fill="#FDE047" />
          {/* Mountains */}
          <path d="M4 22l8-8 6 6 6-4v6H4z" fill="#059669" />
          <path d="M14 22l6-6 8 6H14z" fill="#047857" />
        </>
      )}

      {/* Generic folder - gray */}
      {type === 'folder' && (
        <>
          <defs>
            <linearGradient id="folderGray" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D1D5DB" />
              <stop offset="100%" stopColor="#9CA3AF" />
            </linearGradient>
          </defs>
          <path d="M2 8a2 2 0 012-2h8l2 2h14a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" fill="url(#folderGray)" />
        </>
      )}
    </svg>
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
