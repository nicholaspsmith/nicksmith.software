import { create } from 'zustand';
import { useAppStore, type DynamicDesktopIcon } from './appStore';

/**
 * File system entry types
 */
export type FileSystemEntryType = 'directory' | 'file' | 'application' | 'link';

/**
 * A file system entry (file or directory)
 */
export interface FileSystemEntry {
  name: string;
  type: FileSystemEntryType;
  /** Icon path or icon type identifier */
  icon?: string;
  /** For files: optional content or document reference */
  documentId?: string;
  /** For links: external URL */
  url?: string;
  /** For directories: child entries (static only - dynamic content comes from appStore) */
  children?: Record<string, FileSystemEntry>;
  /** Whether this is a system directory that can't be deleted */
  isSystem?: boolean;
  /** Whether to include dynamic content from appStore.folderContents */
  hasDynamicContent?: boolean;
  /** The folder ID to use when looking up dynamic content */
  dynamicFolderId?: string;
}

/**
 * Static file system structure
 * This defines the base filesystem that both Finder and Terminal use
 */
export const FILE_SYSTEM: Record<string, FileSystemEntry> = {
  '/': {
    name: '/',
    type: 'directory',
    isSystem: true,
    children: {
      'Applications': {
        name: 'Applications',
        type: 'directory',
        icon: 'applications-folder',
        isSystem: true,
        hasDynamicContent: true,
        dynamicFolderId: 'applications',
        children: {
          'Safari.app': { name: 'Safari.app', type: 'application', icon: 'app-safari' },
          'Address Book.app': { name: 'Address Book.app', type: 'application', icon: 'app-addressbook' },
          'Preview.app': { name: 'Preview.app', type: 'application', icon: 'app-preview' },
          'Disk Utility.app': { name: 'Disk Utility.app', type: 'application', icon: 'app-diskutility' },
          'Network Utility.app': { name: 'Network Utility.app', type: 'application', icon: 'app-networkutility' },
          'Installer.app': { name: 'Installer.app', type: 'application', icon: 'app-installer' },
          'Internet Connect.app': { name: 'Internet Connect.app', type: 'application', icon: 'app-internetconnect' },
          'FileVault.app': { name: 'FileVault.app', type: 'application', icon: 'app-filevault' },
          'DOOM.app': { name: 'DOOM.app', type: 'application', icon: 'app-doom' },
        },
      },
      'Developer': {
        name: 'Developer',
        type: 'directory',
        icon: 'developer-folder',
        isSystem: true,
        hasDynamicContent: true,
        dynamicFolderId: 'developer',
      },
      'Library': {
        name: 'Library',
        type: 'directory',
        icon: 'library-folder',
        isSystem: true,
      },
      'System': {
        name: 'System',
        type: 'directory',
        icon: 'system-folder',
        isSystem: true,
      },
      'Users': {
        name: 'Users',
        type: 'directory',
        icon: 'users-folder',
        isSystem: true,
        children: {
          'nick': {
            name: 'nick',
            type: 'directory',
            icon: 'home-folder',
            isSystem: true,
            hasDynamicContent: true,
            dynamicFolderId: 'user',
            children: {
              'Desktop': {
                name: 'Desktop',
                type: 'directory',
                icon: 'desktop-folder',
                isSystem: true,
                hasDynamicContent: true,
                dynamicFolderId: 'desktop',
                children: {
                  'Macintosh HD': { name: 'Macintosh HD', type: 'directory', icon: 'macintosh-hd' },
                  'Terminal': { name: 'Terminal', type: 'application', icon: 'terminal' },
                  'About Me': { name: 'About Me', type: 'file', icon: 'about-doc', documentId: 'about' },
                  'Projects': { name: 'Projects', type: 'file', icon: 'projects-doc', documentId: 'projects' },
                  'Resume': { name: 'Resume', type: 'file', icon: 'resume-doc', documentId: 'resume' },
                  'Contact': { name: 'Contact', type: 'file', icon: 'contact-doc', documentId: 'contact' },
                },
              },
              'Documents': {
                name: 'Documents',
                type: 'directory',
                icon: 'documents-folder',
                isSystem: true,
                hasDynamicContent: true,
                dynamicFolderId: 'documents',
              },
              'Downloads': {
                name: 'Downloads',
                type: 'directory',
                icon: 'downloads-folder',
                isSystem: true,
              },
              'Library': {
                name: 'Library',
                type: 'directory',
                icon: 'library-folder',
                isSystem: true,
              },
              'Movies': {
                name: 'Movies',
                type: 'directory',
                icon: 'movies-folder',
                isSystem: true,
                hasDynamicContent: true,
                dynamicFolderId: 'movies',
              },
              'Music': {
                name: 'Music',
                type: 'directory',
                icon: 'music-folder',
                isSystem: true,
                hasDynamicContent: true,
                dynamicFolderId: 'music',
              },
              'Pictures': {
                name: 'Pictures',
                type: 'directory',
                icon: 'pictures-folder',
                isSystem: true,
                hasDynamicContent: true,
                dynamicFolderId: 'pictures',
              },
              'Public': {
                name: 'Public',
                type: 'directory',
                icon: 'public-folder',
                isSystem: true,
              },
              'Sites': {
                name: 'Sites',
                type: 'directory',
                icon: 'sites-folder',
                isSystem: true,
              },
            },
          },
        },
      },
    },
  },
};

/**
 * Path aliases for common locations
 */
export const PATH_ALIASES: Record<string, string> = {
  '~': '/Users/nick',
  '/home/nick': '/Users/nick',
};

/**
 * Normalize a path - resolve aliases, handle . and .., ensure leading /
 */
export function normalizePath(path: string, cwd: string = '/Users/nick'): string {
  // Handle empty path
  if (!path || path === '') {
    return cwd;
  }

  // Handle aliases
  let normalizedPath = path;
  for (const [alias, replacement] of Object.entries(PATH_ALIASES)) {
    if (normalizedPath === alias) {
      normalizedPath = replacement;
    } else if (normalizedPath.startsWith(alias + '/')) {
      normalizedPath = replacement + normalizedPath.slice(alias.length);
    }
  }

  // Handle relative paths
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = cwd + '/' + normalizedPath;
  }

  // Split into parts and resolve . and ..
  const parts = normalizedPath.split('/').filter(Boolean);
  const resolved: string[] = [];

  for (const part of parts) {
    if (part === '.') {
      // Current directory - skip
      continue;
    } else if (part === '..') {
      // Parent directory - pop if possible
      if (resolved.length > 0) {
        resolved.pop();
      }
    } else {
      resolved.push(part);
    }
  }

  return '/' + resolved.join('/');
}

/**
 * Get a file system entry at the given path
 * Returns null if path doesn't exist
 */
export function getEntryAtPath(path: string): FileSystemEntry | null {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === '/') {
    return FILE_SYSTEM['/'];
  }

  const parts = normalizedPath.split('/').filter(Boolean);
  let current: FileSystemEntry | undefined = FILE_SYSTEM['/'];

  for (const part of parts) {
    if (!current || current.type !== 'directory' || !current.children) {
      return null;
    }
    current = current.children[part];
  }

  return current || null;
}

/**
 * Check if a path exists
 */
export function pathExists(path: string): boolean {
  return getEntryAtPath(path) !== null;
}

/**
 * Check if a path is a directory
 */
export function isDirectory(path: string): boolean {
  const entry = getEntryAtPath(path);
  return entry?.type === 'directory';
}

/**
 * Get the parent path
 */
export function getParentPath(path: string): string {
  const normalized = normalizePath(path);
  if (normalized === '/') return '/';
  const parts = normalized.split('/').filter(Boolean);
  parts.pop();
  return '/' + parts.join('/') || '/';
}

/**
 * Get the base name (last component) of a path
 */
export function getBaseName(path: string): string {
  const normalized = normalizePath(path);
  if (normalized === '/') return '/';
  const parts = normalized.split('/').filter(Boolean);
  return parts[parts.length - 1] || '/';
}

/**
 * Convert dynamic icon to file system entry
 */
function dynamicIconToEntry(icon: DynamicDesktopIcon): FileSystemEntry {
  return {
    name: icon.label,
    type: icon.type === 'folder' || icon.type === 'smart-folder' || icon.type === 'burn-folder'
      ? 'directory'
      : icon.type === 'link'
        ? 'link'
        : 'file',
    icon: icon.icon,
    documentId: icon.documentId,
    url: icon.url,
  };
}

/**
 * List directory contents (combines static and dynamic entries)
 */
export function listDirectory(path: string, includeHidden: boolean = false): FileSystemEntry[] {
  const entry = getEntryAtPath(path);

  if (!entry || entry.type !== 'directory') {
    return [];
  }

  const entries: FileSystemEntry[] = [];

  // Add static children
  if (entry.children) {
    for (const child of Object.values(entry.children)) {
      entries.push(child);
    }
  }

  // Add dynamic children from appStore if configured
  if (entry.hasDynamicContent && entry.dynamicFolderId) {
    const folderContents = useAppStore.getState().folderContents;
    const dynamicIcons = folderContents[entry.dynamicFolderId] || [];

    for (const icon of dynamicIcons) {
      // Avoid duplicates (dynamic icons override static)
      const existingIndex = entries.findIndex(e => e.name === icon.label);
      if (existingIndex >= 0) {
        entries[existingIndex] = dynamicIconToEntry(icon);
      } else {
        entries.push(dynamicIconToEntry(icon));
      }
    }
  }

  // Filter hidden files if needed
  if (!includeHidden) {
    return entries.filter(e => !e.name.startsWith('.'));
  }

  return entries;
}

/**
 * Abbreviate path for display (e.g., /Users/nick -> ~)
 */
export function abbreviatePath(path: string): string {
  const normalized = normalizePath(path);
  const home = '/Users/nick';

  if (normalized === home) {
    return '~';
  }
  if (normalized.startsWith(home + '/')) {
    return '~' + normalized.slice(home.length);
  }
  return normalized;
}

/**
 * File system store state
 */
interface FileSystemStore {
  /** Current working directory (for terminal) */
  cwd: string;
  /** Previous directory (for cd -) */
  previousCwd: string;

  /** Change directory */
  cd: (path: string) => { success: boolean; error?: string };
  /** Get current working directory */
  pwd: () => string;
  /** List directory contents */
  ls: (path?: string, options?: { all?: boolean }) => FileSystemEntry[];
  /** Check if path exists */
  exists: (path: string) => boolean;
  /** Check if path is a directory */
  isDir: (path: string) => boolean;
  /** Get entry at path */
  getEntry: (path: string) => FileSystemEntry | null;
  /** Get abbreviated cwd for prompt */
  getPromptPath: () => string;
}

/**
 * File system store - manages terminal state and provides file system operations
 */
export const useFileSystemStore = create<FileSystemStore>((set, get) => ({
  cwd: '/Users/nick',
  previousCwd: '/Users/nick',

  cd: (path: string) => {
    const { cwd } = get();

    // Handle cd - (previous directory)
    if (path === '-') {
      const { previousCwd } = get();
      set({ cwd: previousCwd, previousCwd: cwd });
      return { success: true };
    }

    // Handle cd with no args (go home)
    if (!path || path === '') {
      set({ previousCwd: cwd, cwd: '/Users/nick' });
      return { success: true };
    }

    const targetPath = normalizePath(path, cwd);

    // Check if path exists
    if (!pathExists(targetPath)) {
      return { success: false, error: `cd: no such file or directory: ${path}` };
    }

    // Check if path is a directory
    if (!isDirectory(targetPath)) {
      return { success: false, error: `cd: not a directory: ${path}` };
    }

    set({ previousCwd: cwd, cwd: targetPath });
    return { success: true };
  },

  pwd: () => get().cwd,

  ls: (path?: string, options?: { all?: boolean }) => {
    const targetPath = path ? normalizePath(path, get().cwd) : get().cwd;
    return listDirectory(targetPath, options?.all);
  },

  exists: (path: string) => pathExists(normalizePath(path, get().cwd)),

  isDir: (path: string) => isDirectory(normalizePath(path, get().cwd)),

  getEntry: (path: string) => getEntryAtPath(normalizePath(path, get().cwd)),

  getPromptPath: () => abbreviatePath(get().cwd),
}));
