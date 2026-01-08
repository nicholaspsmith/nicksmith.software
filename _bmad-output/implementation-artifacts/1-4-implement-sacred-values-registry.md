# Story 1.4: Implement Sacred Values Registry

Status: done

## Story

As a **developer**,
I want **TypeScript constants for all Tiger-exact measurements**,
So that **no magic numbers exist in components and sacred values cannot be accidentally changed**.

## Acceptance Criteria

1. **Given** the CSS architecture is established, **When** I create the Sacred Values Registry, **Then** `src/features/tiger/constants/sacred.ts` exists
2. **And** SACRED object contains trafficLightDiameter (12), titleBarHeight (22), windowCornerRadius (5), menuBarHeight (22), iconGridSize (75), dockIconSize (48)
3. **And** SACRED is exported as `const` with `as const` assertion
4. **And** values are readonly and cannot be modified
5. **And** named export is used (no default export)
6. **And** TypeScript compilation succeeds without errors

## Tasks / Subtasks

- [x] **Task 1: Create sacred.ts constants file** (AC: #1, #2, #3, #4, #5)
  - [x] Create `src/features/tiger/constants/sacred.ts`
  - [x] Define SACRED object with `as const` assertion
  - [x] Include trafficLightDiameter: 12
  - [x] Include titleBarHeight: 22
  - [x] Include windowCornerRadius: 5
  - [x] Include menuBarHeight: 22
  - [x] Include iconGridSize: 75
  - [x] Include dockIconSize: 48
  - [x] Export as named export

- [x] **Task 2: Add comprehensive sacred values** (Enhancement)
  - [x] Add trafficLightSpacing: 8
  - [x] Add trafficLightMargin: 8
  - [x] Add windowMinWidth: 200
  - [x] Add windowMinHeight: 100
  - [x] Add windowDefaultWidth: 400
  - [x] Add windowDefaultHeight: 300
  - [x] Add windowCascadeOffset: 30
  - [x] Add windowViewportMargin: 50
  - [x] Add iconSize: 48, iconLabelMaxWidth: 72
  - [x] Add dockMagnification: 128, dockHeight: 64

- [x] **Task 3: Create type exports for SACRED values**
  - [x] Export SacredValue type for individual values
  - [x] Export SacredKey type for all keys
  - [x] TypeScript infers literal types from `as const`

- [x] **Task 4: Create unit tests** (AC: #4)
  - [x] Create `src/features/tiger/constants/__tests__/sacred.test.ts`
  - [x] Test that SACRED values match expected numbers (21 tests)
  - [x] Test type safety and key completeness

- [x] **Task 5: Verify build** (AC: #6)
  - [x] Run `npm run build` - 0 errors (524ms)
  - [x] Run `npm run test:run` - 56 tests pass

## Dev Notes

### Sacred Values from Architecture Document

```typescript
const SACRED = {
  trafficLightDiameter: 12,
  titleBarHeight: 22,
  windowCornerRadius: 5,
  menuBarHeight: 22,
} as const;
```

The story acceptance criteria also requires:
- iconGridSize: 75
- dockIconSize: 48

### Why Sacred Values?

These measurements are authentic Mac OS X Tiger UI specifications. They must remain constant to maintain visual authenticity. Using TypeScript's `as const` assertion ensures:

1. Values are typed as literal numbers (12 instead of number)
2. The object is deeply readonly
3. IDE/compiler errors if anyone tries to modify values
4. Better type inference in consuming code

### Naming Convention

From architecture: Constants use SCREAMING_SNAKE_CASE (e.g., `SACRED_VALUES`, `WINDOW_DEFAULTS`)

However, the architecture example shows `SACRED` as the object name, so we'll use that.

### File Location

```
src/features/tiger/constants/
└── sacred.ts         # SACRED values registry
```

### Usage Pattern

```typescript
import { SACRED } from '@/features/tiger/constants/sacred';

// Type-safe access to values
const diameter = SACRED.trafficLightDiameter; // type: 12 (literal)

// Cannot modify
SACRED.trafficLightDiameter = 14; // TypeScript error!
```

### Relationship with CSS Variables

The SACRED TypeScript constants should mirror the CSS custom properties in `aqua.css`:
- `SACRED.trafficLightDiameter` = `--aqua-traffic-light-diameter`
- `SACRED.titleBarHeight` = `--aqua-titlebar-height`
- etc.

CSS variables are used for styling, TypeScript constants are used for JS logic (calculations, conditionals).

### Previous Story Learnings

From Stories 1.1-1.3:
- Always use named exports (architecture requirement)
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

- [Source: architecture.md#Authenticity-Decision-Registry] - SACRED values definition
- [Source: architecture.md#Naming-Patterns] - Constants naming convention
- [Source: epics.md#Story-1.4] - Original acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- TypeScript `verbatimModuleSyntax` required type-only import for `SacredKey` type

### Completion Notes List

- **Task 1**: Created sacred.ts with SACRED object containing all required values
- **Task 2**: Added 18 total sacred values covering traffic lights, window chrome, window defaults, desktop icons, and dock
- **Task 3**: Exported SacredValue and SacredKey types for type-safe usage
- **Task 4**: Created 21 unit tests covering all values and type safety
- **Task 5**: Build passes (524ms), 56 total tests pass

### Change Log

- 2026-01-08: Implementation complete

### File List

**Created:**
- src/features/tiger/constants/sacred.ts (18 sacred values)
- src/features/tiger/constants/__tests__/sacred.test.ts (21 tests)

## Senior Developer Review (AI)

**Review Date:** 2026-01-08
**Reviewer:** Claude Opus 4.5 (Adversarial Code Review)
**Outcome:** APPROVED (clean pass - no issues found)
