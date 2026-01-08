# Story 2.3: Create Static Menu Bar

Status: done

## Story

As a **visitor**,
I want **to see the Tiger menu bar at the top of the screen**,
So that **the desktop feels authentic and complete**.

## Acceptance Criteria

1. **Given** I am viewing the Tiger desktop, **When** the page loads, **Then** a menu bar appears fixed at the top of the viewport
2. **And** menu bar height is exactly 22px (sacred value `--aqua-menubar-height`)
3. **And** Apple logo appears on the left side
4. **And** "Finder" text appears next to Apple logo (default app)
5. **And** clock displays current time on the right side
6. **And** menu bar has Tiger-authentic gradient background
7. **And** menu bar remains fixed during scroll (if any)
8. **And** FR5 is partially satisfied (static version)

## Tasks / Subtasks

- [x] **Task 1: Create MenuBar component structure** (AC: #1)
  - [x] Create `src/features/tiger/components/MenuBar/MenuBar.tsx`
  - [x] Create `src/features/tiger/components/MenuBar/MenuBar.module.css`
  - [x] Create `src/features/tiger/components/MenuBar/index.ts` (barrel export)
  - [x] Use named export for component

- [x] **Task 2: Implement MenuBar layout** (AC: #1, #2, #7)
  - [x] Position fixed at top
  - [x] Full width (100vw)
  - [x] Height: 22px using `--aqua-menubar-height`
  - [x] z-index using `--aqua-z-menubar`

- [x] **Task 3: Add Apple logo** (AC: #3)
  - [x] Position on left side with appropriate padding
  - [x] Use inline SVG Apple logo
  - [x] Size: 14x14px for 22px height

- [x] **Task 4: Add app name text** (AC: #4)
  - [x] Display "Finder" as bold text (default via prop)
  - [x] Use Aqua font family
  - [x] Position with spacing from Apple logo

- [x] **Task 5: Add clock display** (AC: #5)
  - [x] Clock inline in MenuBar
  - [x] Display format: "Thu 10:30 AM"
  - [x] Position on right side
  - [x] Update time every minute with useEffect/setInterval + cleanup

- [x] **Task 6: Apply Tiger-authentic styling** (AC: #2, #6)
  - [x] Gradient background (white to light gray)
  - [x] Subtle border-bottom (#a0a0a0)
  - [x] Lucida Grande font family, 11px

- [x] **Task 7: Integrate MenuBar into Desktop** (AC: #1, #7)
  - [x] Import MenuBar in Desktop component
  - [x] Renders above children
  - [x] Fixed positioning verified

- [x] **Task 8: Create unit tests**
  - [x] 6 tests: render, Apple logo, Finder text, custom app name, clock, CSS class
  - [x] Uses vi.useFakeTimers() for clock testing

- [x] **Task 9: Verify build** (AC: all)
  - [x] Run `npm run build` - 0 errors (540ms)
  - [x] Run `npm run test:run` - 88 tests pass
  - [x] Ready for visual verification with `npm run dev`

## Dev Notes

### MenuBar Component Structure

```
src/features/tiger/components/MenuBar/
├── MenuBar.tsx           # Main component
├── MenuBar.module.css    # Styles
├── index.ts              # Barrel export
└── __tests__/
    └── MenuBar.test.tsx  # Tests
```

### MenuBar Layout Pattern

```tsx
export function MenuBar() {
  return (
    <div className={styles.menuBar}>
      <div className={styles.left}>
        <AppleLogo />
        <span className={styles.appName}>Finder</span>
      </div>
      <div className={styles.right}>
        <Clock />
      </div>
    </div>
  );
}
```

### CSS Variables to Use

```css
.menuBar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: var(--aqua-menubar-height); /* 22px */
  z-index: var(--aqua-z-menubar); /* 1000 */
  background: linear-gradient(...); /* Tiger gradient */
}
```

### Tiger Menu Bar Gradient

The authentic Tiger menu bar has a subtle gray gradient:
```css
background: linear-gradient(180deg,
  #ffffff 0%,
  #e8e8e8 50%,
  #d0d0d0 100%
);
```

### Apple Logo SVG

Classic Apple logo (can use simplified version):
```svg
<svg viewBox="0 0 24 24" width="14" height="14">
  <!-- Apple logo path -->
</svg>
```

### Clock Format

Tiger-era clock format: `Thu 10:30 AM`
- Day abbreviation (3 letters)
- Time in 12-hour format
- AM/PM indicator

```tsx
const formatClock = (date: Date) => {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};
```

### Desktop Integration

```tsx
// Desktop.tsx
import { MenuBar } from '../MenuBar';

export function Desktop({ children }: DesktopProps) {
  return (
    <div className={styles.desktop}>
      <MenuBar />
      {children}
    </div>
  );
}
```

### Previous Story Learnings

From Stories 2.1-2.2:
- Use CSS variables from aqua.css
- Barrel exports (index.ts) for components
- SVG data URIs for icons work well
- Named exports only

### Verification Commands

```bash
npm run build
npm run test:run
npm run dev
```

### References

- [Source: architecture.md#MenuBar] - Component structure
- [Source: epics.md#Story-2.3] - Original acceptance criteria
- [Source: prd.md#FR5] - Menu bar with Apple menu

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- No issues encountered during implementation

### Completion Notes List

- **Task 1-2**: Created MenuBar with fixed positioning, 22px height, flexbox layout
- **Task 3**: Added inline SVG Apple logo (14x14px) with hover state
- **Task 4**: appName prop defaults to "Finder", bold weight
- **Task 5**: Clock with toLocaleString formatting, 60s interval with cleanup
- **Task 6**: Tiger gradient, border-bottom, Aqua typography
- **Task 7**: Integrated into Desktop component
- **Task 8-9**: 6 tests pass, build 540ms, 88 total tests

### Change Log

- 2026-01-08: Implementation complete

### File List

**Created:**
- src/features/tiger/components/MenuBar/MenuBar.tsx
- src/features/tiger/components/MenuBar/MenuBar.module.css
- src/features/tiger/components/MenuBar/index.ts
- src/features/tiger/components/MenuBar/__tests__/MenuBar.test.tsx

**Modified:**
- src/features/tiger/components/Desktop/Desktop.tsx (added MenuBar import and render)

## Senior Developer Review (AI)

**Review Date:** 2026-01-08
**Reviewer:** Claude Opus 4.5 (Adversarial Code Review)
**Outcome:** APPROVED (clean pass - 1 LOW acceptable issue)
