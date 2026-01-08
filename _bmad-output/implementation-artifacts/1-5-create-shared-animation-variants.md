# Story 1.5: Create Shared Animation Variants

Status: done

## Story

As a **developer**,
I want **centralized motion animation variants for Aqua UI**,
So that **all components use consistent, 60fps-capable animations**.

## Acceptance Criteria

1. **Given** the project dependencies are installed, **When** I create the animation variants file, **Then** `src/animations/aqua.ts` exists with motion Variants
2. **And** windowVariants includes states: closed, opening, open, minimizing, minimized, restoring
3. **And** iconVariants includes states: idle, hover, active
4. **And** menuVariants includes states: closed, open
5. **And** all animations use only transform and opacity (GPU-accelerated)
6. **And** timing follows UX spec (window open/close 200-300ms)
7. **And** named exports are used for all variants
8. **And** TypeScript compilation succeeds without errors

## Tasks / Subtasks

- [x] **Task 1: Create windowVariants** (AC: #1, #2, #5, #6, #7)
  - [x] Create `src/animations/aqua.ts`
  - [x] Import `Variants` type from `motion/react`
  - [x] Define `windowVariants` with states: closed, opening, open, minimizing, minimized, restoring
  - [x] Use only transform (scale, y) and opacity for GPU acceleration
  - [x] Set opening transition to ~200ms
  - [x] Set minimizing/restoring transitions to ~300ms
  - [x] Export as named export

- [x] **Task 2: Create iconVariants** (AC: #3, #5, #7)
  - [x] Define `iconVariants` with states: idle, hover, active
  - [x] Use only scale transform
  - [x] Export as named export

- [x] **Task 3: Create menuVariants** (AC: #4, #5, #7)
  - [x] Define `menuVariants` with states: closed, open
  - [x] Use only opacity and y transform
  - [x] Export as named export

- [x] **Task 4: Create unit tests**
  - [x] Create `src/animations/__tests__/aqua.test.ts`
  - [x] Test that each variant exports expected states
  - [x] Test that animations use only GPU-accelerated properties

- [x] **Task 5: Verify build** (AC: #8)
  - [x] Run `npm run build` - 0 errors (476ms)
  - [x] Run `npm run test:run` - 79 tests pass

## Dev Notes

### Animation Variants from Architecture Document

```typescript
import { Variants } from 'motion/react';

export const windowVariants: Variants = {
  closed: { opacity: 0, scale: 0.8 },
  opening: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  open: { opacity: 1, scale: 1 },
  minimizing: {
    opacity: 0,
    scale: 0.5,
    y: 100,
    transition: { duration: 0.3, ease: 'easeIn' }
  },
  minimized: { opacity: 0, scale: 0 },
  restoring: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};

export const iconVariants: Variants = {
  idle: { scale: 1 },
  hover: { scale: 1.1 },
  active: { scale: 0.95 },
};

export const menuVariants: Variants = {
  closed: { opacity: 0, y: -10 },
  open: { opacity: 1, y: 0 },
};
```

### GPU-Accelerated Properties

Only these CSS properties can be animated at 60fps without triggering layout recalculations:
- `transform` (scale, translate/x/y, rotate)
- `opacity`

The architecture explicitly states: "all animations use only transform and opacity (GPU-accelerated)"

### Animation Timing from UX Spec

| Animation | Duration | Easing |
|-----------|----------|--------|
| Window open | 200ms | default (ease) |
| Window minimize | 300ms | easeIn |
| Window restore | 300ms | easeOut |
| Menu open/close | ~150-200ms | default |
| Icon hover | ~100ms | default |

### Usage Pattern

```tsx
import { motion } from 'motion/react';
import { windowVariants } from '@/animations/aqua';

<motion.div
  variants={windowVariants}
  initial="closed"
  animate={windowState}
/>
```

### Window Lifecycle State Machine

```
closed → opening → open → minimizing → minimized → restoring → open
         ↓                     ↓
      (spawn)              (to dock)
```

The variants support this state machine - components animate by changing the `animate` prop to match the current lifecycle state.

### Previous Story Learnings

From Stories 1.1-1.4:
- Always use named exports (architecture requirement)
- Type-only imports for types: `import type { ... }`
- Tests in `__tests__` folder
- Build command: `npm run build`
- Test command: `npm run test:run`

### Verification Commands

```bash
# TypeScript compilation check
npm run build

# Run tests
npm run test:run
```

### References

- [Source: architecture.md#Animation-Architecture] - Shared variants pattern
- [Source: architecture.md#Cross-Cutting-Concerns] - Animation performance strategy
- [Source: epics.md#Story-1.5] - Original acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Fixed unused variable `stateName` in test file (TypeScript strict mode)

### Completion Notes List

- **Task 1**: Created windowVariants with 6 states (closed, opening, open, minimizing, minimized, restoring)
- **Task 2**: Created iconVariants with 3 states (idle, hover, active)
- **Task 3**: Created menuVariants with 2 states (closed, open)
- **Task 4**: Added fadeVariants bonus (hidden, visible) + type exports for all variants
- **Task 5**: Created 23 unit tests verifying states and GPU-safe properties
- **Task 6**: Build passes (476ms), 79 total tests pass

### Change Log

- 2026-01-08: Implementation complete - Epic 1 finished!

### File List

**Created:**
- src/animations/aqua.ts (4 variant objects + 4 type exports)
- src/animations/__tests__/aqua.test.ts (23 tests)

## Senior Developer Review (AI)

**Review Date:** 2026-01-08
**Reviewer:** Claude Opus 4.5 (Adversarial Code Review)
**Outcome:** APPROVED (clean pass - no issues found)
