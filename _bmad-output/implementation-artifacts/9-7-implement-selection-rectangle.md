---
type: story
id: 9-7
epic: epic-9-interaction-fundamentals
title: Implement Selection Rectangle (Marquee Select)
status: complete
priority: p1
story_points: 3
assigned_to: dev
created: '2026-01-09'
completed: '2026-01-09'
---

# Story 9.7: Implement Selection Rectangle (Marquee Select)

## User Story

**As a** visitor,
**I want** clicking and dragging on the desktop to draw a selection rectangle,
**So that** I can select multiple icons at once.

## Acceptance Criteria

- [x] Given I am viewing the desktop (not clicking on an icon)
- [x] When I click and drag on empty desktop space
- [x] Then a semi-transparent blue selection rectangle appears
- [x] And rectangle follows my drag, showing selected area
- [x] And any icons within the rectangle become selected
- [x] When I release the mouse
- [x] Then the rectangle disappears
- [x] And all icons within the rectangle remain selected

## Technical Implementation

### Components Created

1. **SelectionRectangle** (`src/features/tiger/components/SelectionRectangle/`)
   - `SelectionRectangle.tsx` - Renders the marquee selection box
   - `SelectionRectangle.module.css` - Tiger-style styling (blue fill, border)
   - Exports `calculateBounds` utility for rectangle calculation

### State Changes

1. **appStore.ts**
   - Changed `selectedIconId: string | null` to `selectedIconIds: string[]` for multi-select support
   - Added `selectMultipleIcons(iconIds: string[])` action
   - Updated `selectIcon` to use array format
   - Updated `clearSelection` to empty array

### Desktop Component Updates

1. Added `SelectionState` interface for tracking selection rectangle
2. Implemented `rectanglesIntersect` utility for bounding box collision
3. Added mouse event handlers:
   - `handleMouseDown` - Starts selection on left-click on desktop background
   - Window-level `mousemove` listener - Updates rectangle and performs real-time intersection detection
   - Window-level `mouseup` listener - Ends selection
4. Added new props:
   - `iconPositions` - For intersection detection
   - `onIconsSelected` - Callback when icons are selected via marquee

### App Component Updates

1. Added `selectMultipleIcons` from appStore
2. Added `handleIconsSelected` callback
3. Passed `iconPositions` and `onIconsSelected` to Desktop

## Styling

Selection rectangle follows Tiger specifications:
- Background: `rgba(56, 117, 215, 0.3)` (~30% opacity blue)
- Border: `1px solid #3875d7`
- No border radius (crisp rectangle)
- Fixed positioning with pointer-events: none
- z-index: 50 (above icons, below windows)

## Testing

All existing tests updated to use new `selectedIconIds` array format:
- `appStore.test.ts` - Updated selection tests
- `aqua.test.ts` - Updated icon animation test

All 410 tests passing.

## Files Modified

- `src/stores/appStore.ts`
- `src/stores/__tests__/appStore.test.ts`
- `src/App.tsx`
- `src/features/tiger/components/Desktop/Desktop.tsx`
- `src/animations/__tests__/aqua.test.ts`

## Files Created

- `src/features/tiger/components/SelectionRectangle/SelectionRectangle.tsx`
- `src/features/tiger/components/SelectionRectangle/SelectionRectangle.module.css`
- `src/features/tiger/components/SelectionRectangle/index.ts`
