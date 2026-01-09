# Story 9.2: Implement Menu Bar Dropdowns for All Items

Status: done

## Story

As a **visitor**,
I want **all menu bar items to open dropdown menus when clicked**,
So that **the menu bar feels fully functional**.

## Acceptance Criteria

1. **Given** I am viewing the menu bar
   **When** I click on any menu item (File, Edit, View, Go, Window, Help)
   **Then** a dropdown menu appears below that item

2. **And** the clicked menu item shows blue highlight background

3. **And** dropdown has Tiger pinstripe texture

4. **And** menu items are actionable or show keyboard shortcuts

5. **When** I move mouse to another menu item while a dropdown is open
   **Then** the previous dropdown closes and new one opens (tracking mode)

6. **And** clicking outside any menu closes all dropdowns

7. **And** Escape key closes all dropdowns

## Tasks / Subtasks

- [x] Task 1: Create story file
  - [x] 1.1 Create story file with acceptance criteria

- [ ] Task 2: Refactor menu items to be interactive
  - [ ] 2.1 Convert `<span>` menu items to `<button>` elements
  - [ ] 2.2 Add click handlers for each menu item
  - [ ] 2.3 Track which menu is currently open (state)

- [ ] Task 3: Implement dropdown components
  - [ ] 3.1 Create dropdown container for each menu
  - [ ] 3.2 Position dropdowns below their parent menu item
  - [ ] 3.3 Add placeholder menu content (actual content in Epic 13)

- [ ] Task 4: Implement menu tracking mode (AC: 5)
  - [ ] 4.1 When a dropdown is open, hovering another menu opens that one
  - [ ] 4.2 Previous dropdown closes automatically
  - [ ] 4.3 Tracking only active when a menu is already open

- [ ] Task 5: Style active menu item (AC: 2)
  - [ ] 5.1 Add blue highlight to clicked/active menu item
  - [ ] 5.2 Same style as Apple menu when active

- [ ] Task 6: Add pinstripe texture to dropdowns (AC: 3)
  - [ ] 6.1 Apply pinstripe CSS to all dropdown menus
  - [ ] 6.2 Update existing Apple menu dropdown too

- [ ] Task 7: Close behavior (AC: 6, 7)
  - [ ] 7.1 Click outside closes all dropdowns
  - [ ] 7.2 Escape key closes all dropdowns
  - [ ] 7.3 Clicking a menu item action closes dropdown

- [ ] Task 8: Write tests
  - [ ] 8.1 Test dropdown opens on click
  - [ ] 8.2 Test menu tracking behavior
  - [ ] 8.3 Test close on click-outside
  - [ ] 8.4 Test close on Escape

## Dev Notes

### Current Implementation

The MenuBar currently has:
- Apple menu with functional dropdown
- Menu items (File, Edit, View, Go, Window, Help) as non-interactive `<span>` elements
- Hover effect on menu items (to be removed in Story 9.3)

### Architecture Approach

1. **State Management**: Track `openMenuId: string | null` for which menu is open
2. **Menu Tracking**: Use `onMouseEnter` to switch menus when one is already open
3. **Unified Close Handler**: Single effect to handle click-outside and Escape for all menus

### CSS Pinstripe Pattern

```css
.dropdown {
  background: repeating-linear-gradient(
    0deg,
    #ffffff 0px,
    #ffffff 1px,
    #f8f8f8 1px,
    #f8f8f8 2px
  );
}
```

### Menu Content (Placeholder)

For this story, dropdown content will be minimal placeholders:
- File: New, Open, Close, Save, Print
- Edit: Undo, Redo, Cut, Copy, Paste
- View: as Icons, as List, as Columns
- Go: Back, Forward, Computer, Home
- Window: Minimize, Zoom, Bring All to Front
- Help: TextEdit Help, Search

Full content will be populated in Epic 13.

### References

- [Source: epics-ui-polish.md#Story-9.2]
- [Reference Image: /Reference/Tiger_Reference_Images/Tiger Screenshots/10-4-Tiger-Finder-Menu.png]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- All 29 MenuBar tests pass (15 new tests added)
- Full test suite: 405 tests pass (no regressions)
- Build succeeds with no TypeScript errors

### Completion Notes List

- Refactored MenuBar to use unified `openMenuId` state for all menus
- Converted all menu items (File, Edit, View, Go, Window, Help) from `<span>` to `<button>` elements with dropdowns
- Implemented menu tracking behavior (hovering switches menus when one is already open)
- Added blue highlight to active menu items using `.menuActive` class
- Added Tiger pinstripe texture to all dropdown menus via CSS `repeating-linear-gradient`
- Added keyboard shortcuts display in dropdown items (right-aligned)
- Click-outside closes all dropdowns
- Escape key closes all dropdowns
- Removed hover effects from menu items (Tiger only shows highlight on click)
- 15 new tests covering application menus, tracking behavior, and active styling

### Change Log

- **2026-01-09:** Story implementation complete - All menu bar items now have functional dropdowns with Tiger styling

### File List

- [x] `src/features/tiger/components/MenuBar/MenuBar.tsx` (modified - major refactor)
- [x] `src/features/tiger/components/MenuBar/MenuBar.module.css` (modified - added pinstripe, active states)
- [x] `src/features/tiger/components/MenuBar/__tests__/MenuBar.test.tsx` (modified - 15 new tests)
