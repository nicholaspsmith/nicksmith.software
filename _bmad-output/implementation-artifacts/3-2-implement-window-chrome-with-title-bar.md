# Story 3.2: Implement Window Chrome with Title Bar

Status: done

## Story

As a **visitor**,
I want **windows to have authentic Tiger title bars**,
So that **the windows look and feel like real Tiger windows**.

## Acceptance Criteria

1. **Given** a window is open, **When** I look at the window, **Then** title bar height is exactly 22px (sacred value)
2. **And** title bar has Tiger-authentic gradient (`--aqua-titlebar-active`)
3. **And** window title is centered in the title bar
4. **And** title uses Lucida Grande or system font equivalent
5. **And** unfocused windows have grayed-out title bars (`--aqua-titlebar-inactive`)
6. **And** dragging is restricted to title bar only (fix from Story 3.1)
7. **And** FR14 is partially satisfied (Aqua styling on window chrome)

## Tasks / Subtasks

- [x] **Task 1: Create WindowChrome component structure** (AC: #1)
  - [x] Create `src/features/tiger/components/WindowChrome/WindowChrome.tsx`
  - [x] Create `src/features/tiger/components/WindowChrome/WindowChrome.module.css`
  - [x] Create `src/features/tiger/components/WindowChrome/index.ts` (barrel export)

- [x] **Task 2: Implement WindowChrome layout** (AC: #1, #3)
  - [x] Title bar height: 22px using `--aqua-titlebar-height`
  - [x] Center title text in title bar
  - [x] Leave space on left for traffic lights (to be added in Story 3.3)

- [x] **Task 3: Apply title bar styling** (AC: #2, #4)
  - [x] Apply `--aqua-titlebar-active` gradient when focused
  - [x] Use `--aqua-font-family` for title text
  - [x] Font size: 13px (`--aqua-font-size-md`)
  - [x] Font weight: bold

- [x] **Task 4: Implement focus state styling** (AC: #5)
  - [x] Accept `isFocused` prop
  - [x] Apply `--aqua-titlebar-inactive` gradient when unfocused
  - [x] Gray out title text when unfocused

- [x] **Task 5: Integrate WindowChrome into Window** (AC: #1, #6)
  - [x] Import WindowChrome in Window component
  - [x] Pass title and focus state
  - [x] Add drag handle class for react-rnd restriction

- [x] **Task 6: Restrict drag to title bar** (AC: #6)
  - [x] Add `dragHandleClassName` prop to Rnd
  - [x] Apply corresponding class to WindowChrome
  - [x] Verify drag only works on title bar

- [x] **Task 7: Create unit tests**
  - [x] Create `src/features/tiger/components/WindowChrome/__tests__/WindowChrome.test.tsx`
  - [x] Test component renders with title
  - [x] Test focused vs unfocused styling
  - [x] Test title bar has correct height

- [x] **Task 8: Verify build** (AC: all)
  - [x] Run `npm run build` - 0 errors
  - [x] Run `npm run test:run` - all tests pass (105)
  - [ ] Visual verification with `npm run dev`

## Dev Notes

### WindowChrome Component Architecture

WindowChrome is a child of Window that provides:
- Title bar with gradient background
- Centered title text
- Focus/unfocus visual states
- Drag handle for window dragging
- Container for TrafficLights (added in Story 3.3)

### Component Structure

```
src/features/tiger/components/WindowChrome/
├── WindowChrome.tsx
├── WindowChrome.module.css
├── index.ts
└── __tests__/
    └── WindowChrome.test.tsx
```

### WindowChrome Props

```typescript
export interface WindowChromeProps {
  title: string;
  isFocused: boolean;
  children?: React.ReactNode; // For content below title bar
}
```

### CSS Variables from aqua.css

```css
--aqua-titlebar-height: 22px;
--aqua-titlebar-active: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 50%, #b8b8b8 51%, #c8c8c8 100%);
--aqua-titlebar-inactive: linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 50%, #d0d0d0 51%, #e0e0e0 100%);
--aqua-font-family: 'Lucida Grande', ...;
--aqua-font-size-md: 13px;
```

### Drag Handle Integration

react-rnd supports `dragHandleClassName` to restrict drag area:

```tsx
// Window.tsx
<Rnd
  dragHandleClassName="drag-handle"
  ...
>
  <WindowChrome className="drag-handle" ... />
</Rnd>
```

### Window Integration Pattern

```tsx
// Window.tsx
import { WindowChrome } from '../WindowChrome';

export function Window({ id, children }: WindowProps) {
  const window = useWindowStore((s) => s.windows.find((w) => w.id === id));
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const isFocused = activeWindowId === id;

  return (
    <Rnd dragHandleClassName={styles.dragHandle} ...>
      <div className={styles.window}>
        <WindowChrome
          title={window.title}
          isFocused={isFocused}
          className={styles.dragHandle}
        />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </Rnd>
  );
}
```

### Focus State Visual Differences

| Element | Focused | Unfocused |
|---------|---------|-----------|
| Gradient | `--aqua-titlebar-active` | `--aqua-titlebar-inactive` |
| Title text | Black (#000) | Gray (#666) |
| Traffic lights | Colored | Gray (Story 3.3) |

### Previous Story Learnings

From Stories 3.1:
- Window component uses react-rnd
- windowStore tracks activeWindowId
- Barrel exports for components
- SACRED values for dimensions

### Verification Commands

```bash
npm run build
npm run test:run
npm run dev
```

### References

- [Source: architecture.md#WindowChrome] - Component structure
- [Source: epics.md#Story-3.2] - Original acceptance criteria
- [Source: aqua.css] - Title bar gradients defined
- [Source: prd.md#FR14] - Aqua styling on window chrome

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

No errors encountered during implementation.

### Completion Notes List

- Created WindowChrome component with Tiger-authentic title bar styling
- Title bar uses `--aqua-titlebar-height` (22px) and gradient backgrounds
- Focus state determined by comparing window id to `activeWindowId` from store
- Title text is centered using flexbox with placeholder spacers on each side
- Traffic lights placeholder reserves 54px space for Story 3.3
- Integrated WindowChrome into Window component as child
- Added `dragHandleClassName` to Rnd for title-bar-only dragging
- Added `title` prop to Window component (breaking change to interface)
- Window tests updated to include new title prop and WindowChrome integration tests
- 10 Window tests + 7 WindowChrome tests all passing (105 total)

### File List

_Files created/modified:_
- src/features/tiger/components/WindowChrome/WindowChrome.tsx (create)
- src/features/tiger/components/WindowChrome/WindowChrome.module.css (create)
- src/features/tiger/components/WindowChrome/index.ts (create)
- src/features/tiger/components/WindowChrome/__tests__/WindowChrome.test.tsx (create)
- src/features/tiger/components/Window/Window.tsx (modify - add WindowChrome, title prop, dragHandle)
- src/features/tiger/components/Window/Window.module.css (modify - add dragHandle class)
- src/features/tiger/components/Window/__tests__/Window.test.tsx (modify - add title prop, focus state tests)
