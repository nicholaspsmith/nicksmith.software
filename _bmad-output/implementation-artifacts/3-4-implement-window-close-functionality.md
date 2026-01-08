# Story 3.4: Implement Window Close Functionality

Status: in-progress

## Story

As a **visitor**,
I want **clicking the red traffic light to close the window**,
So that **I can dismiss windows I'm done with**.

## Acceptance Criteria

1. **Given** a window is open, **When** I click the red traffic light (close button), **Then** the window plays a close animation (fade/scale)
2. **And** the window is removed from the DOM after animation
3. **And** windowStore.closeWindow is called
4. **And** if other windows exist, the next window receives focus
5. **And** FR10 is satisfied

## Tasks / Subtasks

- [ ] **Task 1: Wire up onClose handler in Window component**
- [ ] **Task 2: Implement close animation using motion**
- [ ] **Task 3: Update Window tests for close functionality**
- [ ] **Task 4: Verify build and tests**

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5 (claude-opus-4-5-20251101)

### File List
- src/features/tiger/components/Window/Window.tsx (modify)
- src/features/tiger/components/Window/__tests__/Window.test.tsx (modify)
