# Story 3.1: Create Window Component with React-Rnd

Status: done

## Story

As a **visitor**,
I want **to see windows that can be dragged and resized**,
So that **I can interact with the desktop like a real operating system**.

## Acceptance Criteria

1. **Given** a window is open on the desktop, **When** I drag the window, **Then** the window follows my cursor smoothly at 60fps
2. **And** window position updates in windowStore via `updatePosition`
3. **When** I drag a window corner or edge, **Then** the window resizes smoothly at 60fps
4. **And** window size updates in windowStore via `updateSize`
5. **And** react-rnd library handles drag/resize interactions
6. **And** clicking a window calls `focusWindow` to bring it to front
7. **And** window respects minimum size (200x100 from sacred values)
8. **And** FR7, FR8 are satisfied (drag via title bar, resize from edges/corners)

## Tasks / Subtasks

- [x] **Task 1: Create Window component structure** (AC: #1)
  - [x] Create `src/features/tiger/components/Window/Window.tsx`
  - [x] Create `src/features/tiger/components/Window/Window.module.css`
  - [x] Create `src/features/tiger/components/Window/index.ts` (barrel export)
  - [x] Use named export for component

- [x] **Task 2: Install and configure react-rnd** (AC: #5)
  - [x] react-rnd ^10.5.2 already installed
  - [x] Import Rnd component
  - [x] Configure drag and resize handlers with callbacks

- [x] **Task 3: Implement Window component with Rnd** (AC: #1, #3, #5)
  - [x] Wrap content in Rnd component
  - [x] Set default position from WindowState (x, y)
  - [x] Set default size from WindowState (width, height)
  - [x] Enable drag and resize on all edges/corners
  - [x] Apply z-index from WindowState via style prop

- [x] **Task 4: Connect to windowStore** (AC: #2, #4, #6)
  - [x] Import useWindowStore hook with selectors
  - [x] Call `updatePosition` on drag end
  - [x] Call `updateSize` + `updatePosition` on resize end
  - [x] Call `focusWindow` on mouse down

- [x] **Task 5: Apply minimum size constraints** (AC: #7)
  - [x] Set minWidth: 200 (from SACRED.windowMinWidth)
  - [x] Set minHeight: 100 (from SACRED.windowMinHeight)

- [x] **Task 6: Style Window component** (AC: #1)
  - [x] Apply white background
  - [x] Use `--aqua-window-border`, `--aqua-window-shadow`
  - [x] Apply `--aqua-window-radius` border radius

- [x] **Task 7: Create unit tests**
  - [x] 6 tests with mocked react-rnd
  - [x] Test render, z-index, children, minimized state, CSS class

- [x] **Task 8: Verify build and integration** (AC: all)
  - [x] Run `npm run build` - 0 errors (548ms)
  - [x] Run `npm run test:run` - 94 tests pass
  - [x] Ready for visual verification with `npm run dev`

## Dev Notes

### Window Component Architecture

The Window component wraps react-rnd to provide:
- Draggable positioning (title bar only in Story 3.2)
- Resizable edges and corners
- Z-index management via windowStore
- Position/size persistence in store

### react-rnd Integration Pattern

```tsx
import { Rnd } from 'react-rnd';
import { useWindowStore } from '@/stores/windowStore';

export function Window({ id, children }: WindowProps) {
  const window = useWindowStore((s) => s.windows.find(w => w.id === id));
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const updateSize = useWindowStore((s) => s.updateSize);
  const focusWindow = useWindowStore((s) => s.focusWindow);

  if (!window) return null;

  return (
    <Rnd
      default={{
        x: window.x,
        y: window.y,
        width: window.width,
        height: window.height,
      }}
      minWidth={200}
      minHeight={100}
      style={{ zIndex: window.zIndex }}
      onDragStop={(e, d) => updatePosition(id, d.x, d.y)}
      onResizeStop={(e, dir, ref, delta, position) => {
        updateSize(id, parseInt(ref.style.width), parseInt(ref.style.height));
        updatePosition(id, position.x, position.y);
      }}
      onMouseDown={() => focusWindow(id)}
    >
      <div className={styles.window}>
        {children}
      </div>
    </Rnd>
  );
}
```

### CSS Variables to Use

```css
.window {
  background: #fff;
  border: 1px solid var(--aqua-window-border);
  border-radius: var(--aqua-window-radius);
  box-shadow: var(--aqua-window-shadow);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}
```

### Sacred Values from Architecture

- `windowMinWidth`: 200px
- `windowMinHeight`: 100px
- `windowDefaultWidth`: 400px
- `windowDefaultHeight`: 300px
- `windowCornerRadius`: 5px

### WindowState Interface (from windowStore)

```typescript
interface WindowState {
  id: string;
  app: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  state: 'open' | 'minimized' | 'closed';
}
```

### Performance Notes

- react-rnd uses transform for smooth 60fps dragging
- Avoid re-renders during drag - only update store on drag/resize END
- Z-index updates happen on mouseDown (before visual feedback needed)

### Testing Strategy

For unit tests, mock react-rnd's Rnd component since it requires DOM measurements.
Integration testing via visual verification with `npm run dev`.

### Previous Story Learnings

From Epic 2:
- Barrel exports (index.ts) for cleaner imports
- CSS variables for sacred values
- Named exports only
- Test files in `__tests__` folder

### Verification Commands

```bash
npm run build
npm run test:run
npm run dev
```

### References

- [Source: architecture.md#Window-component] - Component pattern
- [Source: architecture.md#react-rnd] - Library integration
- [Source: epics.md#Story-3.1] - Original acceptance criteria
- [Source: prd.md#FR7-FR8] - Drag and resize requirements

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- No issues encountered during implementation

### Completion Notes List

- **Task 1-3**: Created Window component with react-rnd Rnd wrapper
- **Task 4**: Connected to windowStore with useCallback handlers
- **Task 5**: Applied SACRED min dimensions
- **Task 6**: Aqua styling with CSS variables
- **Task 7-8**: 6 tests pass, build 548ms, 94 total tests

### Change Log

- 2026-01-08: Implementation complete

### File List

**Created:**
- src/features/tiger/components/Window/Window.tsx
- src/features/tiger/components/Window/Window.module.css
- src/features/tiger/components/Window/index.ts
- src/features/tiger/components/Window/__tests__/Window.test.tsx

## Senior Developer Review (AI)

**Review Date:** 2026-01-08
**Reviewer:** Claude Opus 4.5 (Adversarial Code Review)
**Outcome:** APPROVED (1 MEDIUM deferred to Story 3.2 - drag handle restriction)

**Note:** Drag restricted to title bar will be implemented in Story 3.2 (WindowChrome) via `dragHandleClassName` prop.
