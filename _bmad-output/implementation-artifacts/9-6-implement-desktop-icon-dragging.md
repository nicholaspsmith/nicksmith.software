# Story 9.6: Implement Desktop Icon Dragging

Status: done

## Story

As a **visitor**,
I want **to drag desktop icons to rearrange them**,
So that **I can customize the desktop layout**.

## Acceptance Criteria

1. **Given** I am viewing the desktop
   **When** I click and drag a desktop icon
   **Then** the icon follows my cursor

2. **And** a drag preview/ghost shows the icon being dragged

3. **When** I release the icon
   **Then** it snaps to the nearest grid cell position

4. **And** the icon position persists for the session

5. **And** icons cannot be dragged off-screen

6. **And** icons cannot overlap (snap to next available cell)

## Tasks / Subtasks

- [x] Task 1: Create story file
  - [x] 1.1 Create story file with acceptance criteria

- [x] Task 2: Add icon positions to appStore
  - [x] 2.1 Add iconPositions state (Record<string, {x, y}>)
  - [x] 2.2 Add setIconPosition action
  - [x] 2.3 Add initializeIconPositions action

- [x] Task 3: Update DesktopIconGrid for absolute positioning
  - [x] 3.1 Change grid from flexbox to full-screen fixed container
  - [x] 3.2 Icons positioned absolutely within container

- [x] Task 4: Make DesktopIcon draggable
  - [x] 4.1 Add framer-motion drag prop
  - [x] 4.2 Handle onDragEnd to update position
  - [x] 4.3 Implement grid snapping on drop (80x90px cells)

- [x] Task 5: Add drag preview styling
  - [x] 5.1 Style icon during drag (scale: 1.05, shadow, zIndex: 100)

- [x] Task 6: Implement boundary constraints
  - [x] 6.1 Prevent dragging outside desktop bounds
  - [x] 6.2 Account for menu bar (top) and dock (bottom) areas

- [x] Task 7: Write tests
  - [x] 7.1 Updated DesktopIcon tests with x, y props
  - [x] 7.2 Updated DesktopIconGrid tests for new container behavior
  - [x] 7.3 All 407 tests pass

## Dev Notes

### Current Implementation

- Icons rendered in `DesktopIconGrid` using flexbox (vertical column)
- Grid starts at top: 40px, right: 20px (SACRED values)
- Icon cell size: 80x90px (width x height)
- 6 icons: Macintosh HD, Terminal, About Me, Projects, Resume, Contact

### Architecture Approach

1. **Position State**: Store `iconPositions: Record<string, {x: number, y: number}>` in appStore
2. **Initial Positions**: Calculate from current column layout on first render
3. **Absolute Layout**: Change grid to relative container, icons positioned absolutely
4. **Framer Motion Drag**: Use existing motion/react drag feature
5. **Grid Snap**: Snap to nearest 80x90px cell on drag end

### Grid Snap Algorithm

```typescript
const snapToGrid = (x: number, y: number) => {
  const cellWidth = SACRED.iconGridCellWidth;  // 80px
  const cellHeight = SACRED.iconGridCellHeight; // 90px

  return {
    x: Math.round(x / cellWidth) * cellWidth,
    y: Math.round(y / cellHeight) * cellHeight,
  };
};
```

### References

- [Source: epics-ui-polish.md#Story-9.6]
- [Reference: Mac OS X Tiger desktop behavior]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- All 407 tests pass
- Build successful with no TypeScript errors

### Completion Notes List

- Added `IconPosition` interface and `iconPositions` state to appStore
- Added `initializeIconPositions` and `setIconPosition` actions
- Changed DesktopIconGrid from flexbox column to full-screen fixed container
- Updated DesktopIcon to accept x, y position props and render absolutely positioned
- Implemented framer-motion drag with `dragMomentum={false}` and `dragElastic={0}` for precise control
- Grid snapping on drop: rounds to nearest 80x90px cell
- Boundary constraints: respects menu bar height (top) and dock height (bottom)
- Drag visual feedback: scale: 1.05, zIndex: 100, box-shadow
- Initial positions calculated in TigerDesktop and stored in appStore
- Updated all DesktopIcon tests to include required x, y props
- Updated DesktopIconGrid tests for new container behavior

### Change Log

- **2026-01-09:** Story created, implementation started
- **2026-01-09:** Story implementation complete - Desktop icons are now draggable with grid snapping

### File List

- [x] `src/stores/appStore.ts` (modified - added IconPosition, iconPositions state, actions)
- [x] `src/features/tiger/components/DesktopIconGrid/DesktopIconGrid.tsx` (modified - full-screen container)
- [x] `src/features/tiger/components/DesktopIconGrid/DesktopIconGrid.module.css` (modified - fixed positioning)
- [x] `src/features/tiger/components/DesktopIcon/DesktopIcon.tsx` (modified - drag functionality, absolute positioning)
- [x] `src/features/tiger/components/DesktopIcon/__tests__/DesktopIcon.test.tsx` (modified - added x,y props)
- [x] `src/features/tiger/components/DesktopIconGrid/__tests__/DesktopIconGrid.test.tsx` (modified - new container tests)
- [x] `src/App.tsx` (modified - initialize positions, wire callbacks)
