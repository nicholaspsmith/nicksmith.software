# Story 9.1: Implement Right-Click Context Menu

Status: done

## Story

As a **visitor**,
I want **right-clicking on the desktop to show a Tiger-style context menu**,
So that **I can access desktop actions like a real operating system**.

## Acceptance Criteria

1. **Given** I am viewing the Tiger desktop
   **When** I right-click (or Ctrl+click) on the desktop background
   **Then** a context menu appears at the cursor position

2. **And** menu has Tiger pinstripe texture (subtle horizontal lines)

3. **And** menu has ~6px border radius and drop shadow

4. **And** menu items include: New Folder, Get Info, Change Desktop Background, Clean Up, Arrange By (submenu arrow)

5. **And** clicking outside the menu closes it

6. **And** Escape key closes the menu

7. **And** menu position should stay within viewport bounds (reposition if near edge)

## Tasks / Subtasks

- [x] Task 1: Create ContextMenu component (AC: 1, 2, 3)
  - [x] 1.1 Create `ContextMenu/` folder in `src/features/tiger/components/`
  - [x] 1.2 Create `ContextMenu.tsx` with basic structure
  - [x] 1.3 Create `ContextMenu.module.css` with pinstripe texture
  - [x] 1.4 Add props for position, items, onClose
  - [x] 1.5 Export from component index

- [x] Task 2: Implement pinstripe texture (AC: 2)
  - [x] 2.1 Add CSS repeating-linear-gradient for horizontal lines
  - [x] 2.2 Verify texture is subtle (barely visible)
  - [x] 2.3 Reference: `/Reference/Tiger_Reference_Images/Tiger Screenshots/10-4-Tiger-Finder-Menu.png`

- [x] Task 3: Style menu with Tiger aesthetics (AC: 3)
  - [x] 3.1 Add 6px border-radius
  - [x] 3.2 Add drop shadow matching Tiger
  - [x] 3.3 Add 1px border (subtle gray)
  - [x] 3.4 Style menu items with proper padding/hover

- [x] Task 4: Create menu items (AC: 4)
  - [x] 4.1 Create MenuItem sub-component
  - [x] 4.2 Add "New Folder" item (disabled/decorative)
  - [x] 4.3 Add "Get Info" item (disabled/decorative)
  - [x] 4.4 Add "Change Desktop Background..." item (disabled/decorative)
  - [x] 4.5 Add divider line
  - [x] 4.6 Add "Clean Up" item (disabled/decorative)
  - [x] 4.7 Add "Arrange By" with submenu arrow indicator

- [x] Task 5: Integrate with Desktop component (AC: 1, 5, 6)
  - [x] 5.1 Add onContextMenu handler to Desktop.tsx
  - [x] 5.2 Prevent default browser context menu
  - [x] 5.3 Track context menu open/closed state
  - [x] 5.4 Track cursor position for menu placement
  - [x] 5.5 Handle click-outside to close menu
  - [x] 5.6 Handle Escape key to close menu

- [x] Task 6: Viewport boundary handling (AC: 7)
  - [x] 6.1 Calculate menu dimensions
  - [x] 6.2 Reposition if menu would overflow right edge
  - [x] 6.3 Reposition if menu would overflow bottom edge

- [x] Task 7: Write tests
  - [x] 7.1 Create `__tests__/ContextMenu.test.tsx`
  - [x] 7.2 Test menu appears on right-click
  - [x] 7.3 Test menu closes on click-outside
  - [x] 7.4 Test menu closes on Escape key
  - [x] 7.5 Test viewport boundary repositioning

## Dev Notes

### Component Architecture

Create a new `ContextMenu` component that:
- Is a portal-rendered overlay (to escape any parent overflow constraints)
- Receives position via props (x, y coordinates)
- Receives menu items as props
- Handles its own keyboard events (Escape)

### File Structure

```
src/features/tiger/components/ContextMenu/
├── ContextMenu.tsx
├── ContextMenu.module.css
├── MenuItem.tsx
├── index.ts
└── __tests__/
    └── ContextMenu.test.tsx
```

### CSS Pinstripe Texture

```css
.contextMenu {
  /* Tiger pinstripe background */
  background: repeating-linear-gradient(
    0deg,
    #ffffff 0px,
    #ffffff 1px,
    #f8f8f8 1px,
    #f8f8f8 2px
  );

  /* Border and shadow */
  border: 1px solid #b0b0b0;
  border-radius: 6px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);

  /* Prevent text selection */
  user-select: none;
}
```

### Menu Item Styling

```css
.menuItem {
  padding: 4px 20px 4px 25px; /* Left padding for checkmark space */
  font-family: 'Lucida Grande', 'Lucida Sans Unicode', sans-serif;
  font-size: 13px;
  color: #000;
  cursor: default;
}

.menuItem:hover {
  background: #3875d7; /* Tiger blue selection */
  color: #fff;
}

.menuItem.disabled {
  color: #999;
}

.menuItem.disabled:hover {
  background: transparent;
  color: #999;
}

.divider {
  height: 1px;
  background: #d0d0d0;
  margin: 4px 0;
}
```

### Integration Pattern

```typescript
// In Desktop.tsx
const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);

const handleContextMenu = (e: React.MouseEvent) => {
  e.preventDefault();
  setContextMenu({ x: e.clientX, y: e.clientY });
};

const handleCloseContextMenu = () => {
  setContextMenu(null);
};

// In render:
<div onContextMenu={handleContextMenu}>
  {/* ... */}
  {contextMenu && (
    <ContextMenu
      x={contextMenu.x}
      y={contextMenu.y}
      onClose={handleCloseContextMenu}
    />
  )}
</div>
```

### Project Structure Notes

- Component follows existing pattern: `features/tiger/components/ComponentName/`
- Use named exports only (no default exports)
- Use CSS Modules with `--aqua-*` variables where applicable
- Tests in `__tests__/` subfolder

### References

- [Source: epics-ui-polish.md#Story-9.1]
- [Source: project-context.md#CSS-Variable-Naming]
- [Reference Image: /Reference/Tiger_Reference_Images/Tiger Screenshots/10-4-Tiger-Finder-Menu.png]
- [Reference Image: /Reference/Tiger_Reference_Images/Tiger Screenshots/10-4-Tiger-Apple-Menu.png]

### Key Technical Decisions

1. **Portal vs Inline**: Use React Portal to render menu outside Desktop DOM tree, ensuring it's not clipped by overflow:hidden

2. **State Location**: Keep context menu state in Desktop.tsx since it's scoped to that component

3. **Menu Items**: Currently decorative (disabled) - actual functionality can be added in later stories

4. **Ctrl+Click**: macOS convention for right-click on single-button mice - important to support

### Existing Code to Leverage

- `Desktop.tsx` already has `handleClick` for deselection - add context menu handler alongside
- `MenuBar` component may have dropdown patterns to reference for styling consistency
- `styles/aqua.css` has CSS variables for colors and shadows

### Testing Approach

```typescript
// Example test structure
describe('ContextMenu', () => {
  it('should appear at cursor position on right-click', () => {
    render(<Desktop />);
    const desktop = screen.getByTestId('desktop');

    fireEvent.contextMenu(desktop, { clientX: 100, clientY: 200 });

    expect(screen.getByTestId('context-menu')).toBeInTheDocument();
  });

  it('should close on Escape key', () => {
    // ...
  });

  it('should close on click outside', () => {
    // ...
  });
});
```

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- All 22 ContextMenu tests pass
- Full test suite: 390 tests pass (no regressions)
- Build succeeds with no TypeScript errors

### Completion Notes List

- Created ContextMenu component with portal rendering
- Implemented Tiger pinstripe texture using repeating-linear-gradient
- Added MenuItem and MenuDivider sub-components
- Integrated with Desktop.tsx using onContextMenu handler
- Context menu appears at cursor position on right-click
- Menu closes on click-outside via invisible overlay
- Menu closes on Escape key press
- Viewport boundary detection repositions menu if near edges
- Added z-index CSS variables for proper layering
- All menu items are decorative/disabled (functionality deferred to later stories)
- 22 comprehensive tests covering rendering, closing behavior, viewport handling, and accessibility

### Change Log

- **2026-01-09:** Story implementation complete - Tiger-style context menu with pinstripe texture, viewport boundary handling, and comprehensive tests

### File List

- [x] `src/features/tiger/components/ContextMenu/ContextMenu.tsx` (new)
- [x] `src/features/tiger/components/ContextMenu/ContextMenu.module.css` (new)
- [x] `src/features/tiger/components/ContextMenu/MenuItem.tsx` (new)
- [x] `src/features/tiger/components/ContextMenu/index.ts` (new)
- [x] `src/features/tiger/components/ContextMenu/__tests__/ContextMenu.test.tsx` (new)
- [x] `src/features/tiger/components/Desktop/Desktop.tsx` (modified)
- [x] `src/styles/aqua.css` (modified - added z-index variables)
