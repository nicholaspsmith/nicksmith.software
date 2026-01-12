---
title: 'Editable TextEdit Documents'
slug: 'editable-textedit-documents'
created: '2026-01-11'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
reviewNotes: |
  - Adversarial review completed
  - Findings: 10 total, 6 fixed, 4 skipped
  - Resolution approach: walk-through
tech_stack: ['React 18', 'TypeScript 5', 'Zustand 5', 'localStorage', 'CSS Modules', 'motion']
files_to_modify: ['MenuBar.tsx', 'AboutMe.tsx', 'Projects.tsx', 'Resume.tsx', 'Contact.tsx', 'appStore.ts', 'Desktop.tsx', 'WindowContent.tsx', 'windowStore.ts']
code_patterns: ['named-exports', 'zustand-domain-stores', 'css-modules-aqua-prefix', 'path-alias-@']
test_patterns: ['__tests__-folder', 'ComponentName.test.tsx', 'describe-should-pattern']
---

# Tech-Spec: Editable TextEdit Documents

**Created:** 2026-01-11

## Overview

### Problem Statement

TextEdit documents (About Me, Projects, Resume, Contact) are currently static React components that users cannot edit. Only the Untitled document supports text input. Users expect a document editor to allow editing, and there's no way to personalize or modify content.

### Solution

Convert all TextEdit documents to be editable with:
- Default content from current static pages (rich text format)
- User edits saved to localStorage
- "File > Show Original" menu option to reset to defaults
- "File > Save" to persist changes (otherwise reverts on close/reopen)
- "File > Close" to close active window
- "Window > Minimize" to minimize (same as yellow traffic light)
- New Untitled documents save to desktop as icons for persistence
- Single-instance enforcement: each document can only be open once

### Scope

**In Scope:**
- Make 4 document types editable (About Me, Projects, Resume, Contact)
- localStorage persistence per document
- Default content = current static content (rich text format)
- User edits = plain text input in textarea
- File menu functionality:
  - Close - closes active TextEdit window
  - Save - persists user content to localStorage
  - Show Original - resets to default content
- New Untitled documents:
  - Save creates desktop icon for reopening with persisted content
  - Already have "Untitled 2, 3..." numbering (windowStore)
- Window > Minimize - minimizes window (same as yellow traffic light)
- Delete saved documents by dragging icon to Trash
- Single-instance per document (reopening focuses existing window)

**Out of Scope:**
- Rich text formatting toolbar functionality (buttons are decorative)
- Backend/cloud persistence
- Dirty state indicator (unsaved changes dot in title bar)
- File > Open dialog
- Drag-and-drop document opening

## Context for Development

### Codebase Patterns

- **Named exports only** - no default exports anywhere
- **CSS Modules** with `--aqua-` prefixed variables for Tiger styling
- **Zustand domain stores** - separate stores per domain (windowStore, appStore, soundStore)
- **Path alias** `@/` maps to `src/`
- **Tiger authenticity** - match OS X 10.4 look and feel exactly
- **Component naming** - PascalCase, prefixed for context (AquaButton, not Button)

### Files to Reference

| File | Purpose | Investigation Notes |
| ---- | ------- | ------------------- |
| `src/features/apps/TextEditChrome/TextEditChrome.tsx` | Wrapper with toolbar/ruler | Takes children, provides chrome |
| `src/features/apps/UntitledDocument/UntitledDocument.tsx` | Editable blank doc | Uses textarea, has own toolbar (duplicate) |
| `src/features/apps/AboutMe/AboutMe.tsx` | Static document | Rich JSX content, needs conversion |
| `src/features/apps/Projects/Projects.tsx` | Static document | Card-based layout |
| `src/features/apps/Resume/Resume.tsx` | Static document | Sectioned resume content |
| `src/features/apps/Contact/Contact.tsx` | Static document | Contact info |
| `src/stores/windowStore.ts` | Window state | Has closeWindow, minimizeWindow actions |
| `src/stores/appStore.ts` | App/desktop state | Has DynamicDesktopIcon, dynamicIcons array |
| `src/features/tiger/components/MenuBar/MenuBar.tsx` | Menu bar | TEXTEDIT_MENUS config, handleMenuItemClick |
| `src/features/tiger/components/Window/Window.tsx` | Window container | Listens for window-close-request events |
| `src/features/tiger/components/Desktop/Desktop.tsx` | Desktop | Renders icons from appStore |
| `src/features/tiger/components/WindowContent/WindowContent.tsx` | Maps app IDs to components | Needs dynamic document support |

### Technical Decisions

1. **New documentStore.ts** - Zustand store for document content management
   - `documents: Record<string, string>` - user-edited content per document
   - `savedDocumentIds: string[]` - tracks which Untitled docs have been saved (for desktop icons)
   - `getContent(docId)` - returns documents[docId] or DEFAULT_CONTENT[docId]
   - `setContent(docId, content)` - updates in-memory
   - `saveDocument(docId)` - persists to localStorage, adds to savedDocumentIds if Untitled
   - `resetToDefault(docId)` - removes from documents, clears localStorage
   - `deleteDocument(docId)` - removes from documents, savedDocumentIds, localStorage, and desktop icon
   - `loadFromStorage()` - hydrate documents AND savedDocumentIds on startup

2. **Default content constants** - `src/constants/defaultContent.ts`
   - Export rich text strings (with line breaks, basic formatting) for each document type
   - Used when no user content exists
   - Keys: 'about', 'projects', 'resume', 'contact'

3. **localStorage key patterns:**
   - Document content: `textedit:doc:{documentId}`
   - Saved document IDs list: `textedit:saved-ids`
   - documentId = 'about', 'projects', 'resume', 'contact' for built-in docs
   - For saved Untitled: documentId = UUID generated at window creation and stored in window state

4. **Desktop icon for saved documents**
   - Extend `DynamicDesktopIcon` type: add `type: 'document'`
   - Add `documentId: string` field for content lookup
   - New action: `createDocumentIcon(documentId: string, label: string): void`
   - New action: `deleteDocumentIcon(documentId: string): void`
   - Icons persist via savedDocumentIds in localStorage, hydrated on load

5. **Menu wiring approach**
   - Close: dispatch `window-close-request` CustomEvent
   - Save: call `documentStore.saveDocument(windowState.documentId)`, create icon if Untitled
   - Show Original: call `documentStore.resetToDefault(windowState.documentId)`
   - Minimize: dispatch `window-minimize-request` CustomEvent

6. **Edit mode implementation**
   - Documents render as editable textarea (styled to match)
   - Default content shown as initial value
   - On change → update documentStore (in-memory)
   - On Save → persist to localStorage

7. **Window state extension for documents**
   - Add `documentId: string` to WindowState interface
   - Built-in docs: documentId = app name ('about', 'projects', 'resume', 'contact')
   - Untitled docs: documentId = UUID generated at creation time
   - This documentId is passed to EditableDocument component

8. **Single-instance enforcement**
   - Before opening any TextEdit document, check if window with that documentId already exists
   - If exists: focus that window instead of opening new one
   - Applies to built-in docs (about, projects, etc.) and saved Untitled docs

9. **WindowContent dynamic document support**
   - Add check: if `window.documentId` exists and is a saved document UUID, render EditableDocument
   - Pass `documentId` prop from window state to component
   - Built-in docs continue using their dedicated components (which now use EditableDocument internally)

10. **Desktop icon positioning for saved documents**
    - Calculate next available grid position using existing `calculateNextIconPosition()` logic
    - New icons appear in first empty slot scanning top-to-bottom, right-to-left (Tiger convention)
    - Store position in DynamicDesktopIcon; reuse appStore.iconPositions pattern

## Implementation Plan

### Tasks

#### Phase 1: Foundation (stores and constants)

- [ ] **Task 1: Create default content constants**
  - File: `src/constants/defaultContent.ts` (NEW)
  - Action: Create file exporting DEFAULT_CONTENT object with rich text defaults for 'about', 'projects', 'resume', 'contact'
  - Notes: Extract meaningful text from current static components; preserve line breaks and structure

- [ ] **Task 2: Create documentStore**
  - File: `src/stores/documentStore.ts` (NEW)
  - Action: Create Zustand store with:
    - State: `documents: Record<string, string>` (docId → content)
    - State: `savedDocumentIds: string[]` (UUIDs of saved Untitled docs)
    - Action: `getContent(docId: string): string` - returns documents[docId] or DEFAULT_CONTENT[docId] or ''
    - Action: `setContent(docId: string, content: string): void` - updates in-memory
    - Action: `saveDocument(docId: string): void` - writes to localStorage, adds to savedDocumentIds if UUID
    - Action: `resetToDefault(docId: string): void` - removes from documents, clears localStorage for that key
    - Action: `deleteDocument(docId: string): void` - full cleanup: documents, savedDocumentIds, localStorage, calls appStore.deleteDocumentIcon
    - Action: `loadFromStorage(): void` - hydrate documents from localStorage using savedDocumentIds list
    - Action: `isDocumentOpen(docId: string): string | null` - returns windowId if document is open, null otherwise
  - Notes: Follow existing store patterns (named export, zustand v5 syntax)

- [ ] **Task 3: Extend windowStore for document support**
  - File: `src/stores/windowStore.ts`
  - Action:
    - Add `documentId?: string` to WindowState interface
    - Modify `openWindow` to accept optional documentId parameter
    - Add single-instance check: if window with documentId exists, call focusWindow instead
    - Modify `openNewTextEditDocument` to generate UUID and store as documentId
    - Add `getWindowByDocumentId(docId: string): WindowState | undefined` selector
  - Notes: documentId links window to document content in documentStore

#### Phase 2: Document components conversion

- [ ] **Task 4: Create EditableDocument component**
  - File: `src/features/apps/EditableDocument/EditableDocument.tsx` (NEW)
  - File: `src/features/apps/EditableDocument/EditableDocument.module.css` (NEW)
  - File: `src/features/apps/EditableDocument/index.ts` (NEW)
  - Action: Create reusable editable document component:
    - Props: `documentId: string`
    - Uses `useDocumentStore` to get/set content
    - Renders textarea styled to match Tiger TextEdit (white background, Lucida Grande font)
    - Calls `setContent(documentId, value)` on change
    - Initialize with `getContent(documentId)` - shows default if no saved content
  - Notes: Textarea fills available space, no border (chrome provides frame)

- [ ] **Task 5: Convert AboutMe to use EditableDocument**
  - File: `src/features/apps/AboutMe/AboutMe.tsx`
  - Action: Replace static JSX with `<EditableDocument documentId="about" />`
  - Notes: Remove all static content, component becomes thin wrapper. documentId is hardcoded since this is a built-in doc.

- [ ] **Task 6: Convert Projects to use EditableDocument**
  - File: `src/features/apps/Projects/Projects.tsx`
  - Action: Replace static JSX with `<EditableDocument documentId="projects" />`
  - Notes: Same pattern as AboutMe

- [ ] **Task 7: Convert Resume to use EditableDocument**
  - File: `src/features/apps/Resume/Resume.tsx`
  - Action: Replace static JSX with `<EditableDocument documentId="resume" />`
  - Notes: Same pattern as AboutMe

- [ ] **Task 8: Convert Contact to use EditableDocument**
  - File: `src/features/apps/Contact/Contact.tsx`
  - Action: Replace static JSX with `<EditableDocument documentId="contact" />`
  - Notes: Same pattern as AboutMe

- [ ] **Task 9: Update UntitledDocument to use documentStore**
  - File: `src/features/apps/UntitledDocument/UntitledDocument.tsx`
  - Action:
    - Accept `documentId: string` prop (required - passed from WindowContent)
    - Replace local useState with documentStore: `useDocumentStore(s => s.getContent(documentId))`
    - Remove toolbar/ruler (will be wrapped in TextEditChrome)
    - Component now just renders EditableDocument with the documentId prop
  - Notes: Simplified to thin wrapper since TextEditChrome provides chrome

- [ ] **Task 10: Wrap UntitledDocument in TextEditChrome**
  - File: `src/features/tiger/components/WindowContent/WindowContent.tsx`
  - Action:
    - Find UntitledDocument case in component mapping
    - Wrap in TextEditChrome: `<TextEditChrome><UntitledDocument documentId={window.documentId} /></TextEditChrome>`
    - Pass `window.documentId` as prop to UntitledDocument
  - Notes: Ensures consistent chrome across all TextEdit documents

- [ ] **Task 11: Add dynamic document support to WindowContent**
  - File: `src/features/tiger/components/WindowContent/WindowContent.tsx`
  - Action:
    - Import documentStore
    - Before static app mapping, check if `window.documentId` is in `savedDocumentIds`
    - If so, render: `<TextEditChrome><EditableDocument documentId={window.documentId} /></TextEditChrome>`
    - This handles reopened saved Untitled documents
  - Notes: Dynamic docs take precedence over static mapping

#### Phase 3: Menu bar handlers

- [ ] **Task 12: Add "Show Original" to TextEdit File menu**
  - File: `src/features/tiger/components/MenuBar/MenuBar.tsx`
  - Action: Add menu item to TEXTEDIT_MENUS File section after "Revert to Saved":
    ```typescript
    { label: 'Show Original', shortcut: '⌘R' },
    ```
  - Notes: Position after "Revert to Saved" for logical grouping

- [ ] **Task 13: Wire up File > Close handler**
  - File: `src/features/tiger/components/MenuBar/MenuBar.tsx`
  - Action: In handleMenuItemClick, add case:
    ```typescript
    else if (label === 'Close') {
      if (activeWindow) {
        window.dispatchEvent(new CustomEvent('window-close-request', { detail: { windowId: activeWindow.id } }));
      }
    }
    ```
  - Notes: Uses existing CustomEvent pattern from Window.tsx

- [ ] **Task 14: Wire up File > Save handler for localStorage**
  - File: `src/features/tiger/components/MenuBar/MenuBar.tsx`
  - Action:
    - Import useDocumentStore
    - In handleMenuItemClick, modify 'Save' case:
    ```typescript
    else if (label === 'Save') {
      if (activeWindow?.parentApp === 'textEdit' && activeWindow.documentId) {
        const docStore = useDocumentStore.getState();
        docStore.saveDocument(activeWindow.documentId);
        // If this is an Untitled doc (UUID format), create desktop icon
        if (activeWindow.documentId.includes('-')) { // UUIDs have dashes
          useAppStore.getState().createDocumentIcon(activeWindow.documentId, activeWindow.title);
        }
      }
    }
    ```
  - Notes: Detect Untitled by UUID format (has dashes); built-in doc IDs are simple strings

- [ ] **Task 15: Wire up File > Show Original handler**
  - File: `src/features/tiger/components/MenuBar/MenuBar.tsx`
  - Action: In handleMenuItemClick, add case:
    ```typescript
    else if (label === 'Show Original') {
      if (activeWindow?.parentApp === 'textEdit' && activeWindow.documentId) {
        useDocumentStore.getState().resetToDefault(activeWindow.documentId);
      }
    }
    ```
  - Notes: Clears localStorage and in-memory state; component re-renders with default content

- [ ] **Task 16: Wire up Window > Minimize handler**
  - File: `src/features/tiger/components/MenuBar/MenuBar.tsx`
  - Action: In handleMenuItemClick, add case:
    ```typescript
    else if (label === 'Minimize') {
      if (activeWindow) {
        window.dispatchEvent(new CustomEvent('window-minimize-request', { detail: { windowId: activeWindow.id } }));
      }
    }
    ```
  - Notes: Uses existing CustomEvent pattern, already listened in Window.tsx

#### Phase 4: Desktop icons for saved documents

- [ ] **Task 17: Extend DynamicDesktopIcon type for documents**
  - File: `src/stores/appStore.ts`
  - Action:
    - Update DynamicDesktopIcon type: `type: 'folder' | 'smart-folder' | 'burn-folder' | 'document'`
    - Add optional `documentId?: string` field
    - Add `createDocumentIcon(documentId: string, label: string): void` action:
      - Calculate next grid position using existing pattern
      - Create icon with type: 'document', documentId, icon: '/icons/TextEditIcon.png'
    - Add `deleteDocumentIcon(documentId: string): void` action:
      - Remove from dynamicIcons array by documentId
  - Notes: Documents use TextEdit icon image

- [ ] **Task 18: Render document icons on Desktop**
  - File: `src/features/tiger/components/Desktop/Desktop.tsx`
  - Action:
    - Document icons already render via dynamicIcons (same as folders)
    - Update double-click handler to check icon type
    - If `type === 'document'`: call `windowStore.openSavedDocument(icon.documentId, icon.label)`
  - Notes: Existing grid rendering handles positioning

- [ ] **Task 19: Add openSavedDocument to windowStore**
  - File: `src/stores/windowStore.ts`
  - Action: Add action `openSavedDocument(documentId: string, title: string): string`:
    - Check if window with documentId already exists → focus it and return
    - Create new window with parentApp: 'textEdit', documentId, title
    - Return window ID
  - Notes: Single-instance check prevents duplicate windows for same document

- [ ] **Task 20: Handle document icon drag to Trash**
  - File: `src/features/tiger/components/Desktop/Desktop.tsx` (or DesktopIcon)
  - Action:
    - On drag end, check if icon dropped on Trash icon bounds
    - If document icon dropped on Trash: call `documentStore.deleteDocument(documentId)`
    - deleteDocument handles: localStorage cleanup, savedDocumentIds update, appStore.deleteDocumentIcon
  - Notes: May need to track Trash icon position for hit detection

#### Phase 5: Integration and polish

- [ ] **Task 21: Initialize documentStore on app mount**
  - File: `src/App.tsx` (or appropriate entry point)
  - Action:
    - Import useDocumentStore
    - In useEffect on mount: `useDocumentStore.getState().loadFromStorage()`
  - Notes: Ensures persisted content and savedDocumentIds available before windows open

- [ ] **Task 22: Hydrate desktop icons on app mount**
  - File: `src/App.tsx` (or Desktop.tsx)
  - Action:
    - After documentStore.loadFromStorage(), iterate savedDocumentIds
    - For each, ensure corresponding desktop icon exists via createDocumentIcon
    - Or: move this logic into documentStore.loadFromStorage() which calls appStore
  - Notes: Restores desktop icons for saved documents after page refresh

- [ ] **Task 23: Clean up unused CSS**
  - Files: `AboutMe.module.css`, `Projects.module.css`, `Resume.module.css`, `Contact.module.css`
  - Action: Remove styles no longer used after component conversion
  - Notes: May be able to delete entire files if components are now thin wrappers

### Acceptance Criteria

#### Core Editing
- [ ] **AC1:** Given the About Me window is open, when I type in the document area, then my text appears in the textarea
- [ ] **AC2:** Given I have edited the About Me document, when I close and reopen the window without saving, then I see the default content (edits not persisted)
- [ ] **AC3:** Given I have edited the About Me document, when I click File > Save, then my edits are persisted to localStorage
- [ ] **AC4:** Given I have saved edits to About Me, when I close and reopen the window, then I see my saved edits
- [ ] **AC5:** Given I have saved edits to About Me, when I click File > Show Original, then the textarea immediately displays default content and localStorage is cleared

#### Menu Actions
- [ ] **AC6:** Given any TextEdit window is active, when I click File > Close, then the window closes with animation
- [ ] **AC7:** Given any window is active, when I click Window > Minimize, then the window minimizes to dock (same as yellow button)
- [ ] **AC8:** Given File > Show Original is clicked on a document with no edits, then nothing visible changes (graceful no-op)

#### Untitled Documents
- [ ] **AC9:** Given I create a new Untitled document and type content, when I click File > Save, then a document icon appears on the desktop
- [ ] **AC10:** Given a saved Untitled document icon exists on desktop, when I double-click it, then a window opens with my saved content
- [ ] **AC11:** Given multiple Untitled documents are saved, then each has a unique desktop icon with correct title (Untitled, Untitled 2, etc.)

#### All Document Types
- [ ] **AC12:** Given Projects window is open, when I edit and save, then my edits persist across page refresh
- [ ] **AC13:** Given Resume window is open, when I edit and save, then my edits persist across page refresh
- [ ] **AC14:** Given Contact window is open, when I edit and save, then my edits persist across page refresh

#### Edge Cases
- [ ] **AC15:** Given localStorage is cleared externally, when I open a document, then default content is shown (graceful fallback)
- [ ] **AC16:** Given I'm editing a document, when I click File > Save multiple times, then no errors occur and content stays consistent

#### Single Instance
- [ ] **AC17:** Given About Me window is already open, when I try to open About Me again (via Dock or Finder), then the existing window is focused instead of opening a new one
- [ ] **AC18:** Given a saved Untitled document window is open, when I double-click its desktop icon, then the existing window is focused instead of opening a new one

#### Delete Documents
- [ ] **AC19:** Given a saved Untitled document icon on desktop, when I drag it to the Trash, then the icon disappears and the localStorage content is deleted
- [ ] **AC20:** Given a saved document is deleted via Trash, when I refresh the page, then the desktop icon does not reappear

#### Desktop Icon Persistence
- [ ] **AC21:** Given I have saved Untitled documents with desktop icons, when I refresh the page, then all saved document icons reappear in their positions

## Additional Context

### Dependencies

- **Browser localStorage API** - Native, no polyfill needed
- **Zustand v5** - Already installed and used throughout
- **Existing CustomEvent pattern** - `window-close-request`, `window-minimize-request` already handled in Window.tsx
- **UUID generation** - Use `crypto.randomUUID()` (native browser API)

### Testing Strategy

**Unit Tests:**
- `documentStore.test.ts` - Test all store actions (get, set, save, reset, delete, load)
- `windowStore.test.ts` - Test single-instance logic, openSavedDocument
- Mock localStorage for isolation

**Integration Tests:**
- Menu item click → document state change
- Document edit → store update → textarea reflects change
- Save → localStorage write → desktop icon created
- Show Original → textarea updates immediately
- Drag to Trash → document deleted

**Manual Testing:**
- Full workflow: open → edit → save → close → reopen → verify
- Show Original workflow: edit → save → Show Original → verify default shown
- Untitled document → desktop icon → reopen workflow
- Cross-document independence (saving one doesn't affect others)
- Page refresh persistence for both content and desktop icons
- Single-instance: try opening same doc twice
- Delete: drag saved doc icon to Trash

### Notes

**Risk Items:**
- localStorage quota limits (unlikely with text-only content)
- Trash icon hit detection may need tuning

**Future Considerations (out of scope):**
- Rich text editing with formatting toolbar
- Export to actual file system
- Document dirty state indicator
- Undo/redo history
- Keyboard shortcuts (⌘S, ⌘W, etc.)

**Cleanup Opportunities:**
- After Task 9, UntitledDocument becomes very thin - could potentially merge with EditableDocument
- Consider consolidating all document components into single EditableDocument after this feature ships
