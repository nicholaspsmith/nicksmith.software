# Story 1.2: Create Zustand State Management Stores

Status: done

## Story

As a **developer**,
I want **domain-specific Zustand stores for window, sound, and app state**,
So that **state management follows the architecture patterns and enables all window interactions**.

## Acceptance Criteria

1. **Given** the project is scaffolded, **When** I create the three domain stores, **Then** `windowStore.ts` exists with WindowState interface and actions (openWindow, closeWindow, focusWindow, minimizeWindow, restoreWindow, updatePosition, updateSize)
2. **And** `soundStore.ts` exists with audio context management and play action
3. **And** `appStore.ts` exists with mode ('tiger' | 'ios') and startupComplete state
4. **And** all stores use named exports (no default exports)
5. **And** all stores compile without TypeScript errors
6. **And** stores are located in `src/stores/` directory
7. **And** unit tests exist for each store

## Tasks / Subtasks

- [x] **Task 1: Create WindowStore** (AC: #1, #4, #5, #6)
  - [x] Create `src/stores/windowStore.ts`
  - [x] Define `WindowState` interface with id, app, title, x, y, width, height, zIndex, state (open/minimized/closed)
  - [x] Define `WindowStore` interface with state and actions
  - [x] Implement `openWindow(app: string)` - creates window, assigns UUID, sets active, returns id
  - [x] Implement `closeWindow(id: string)` - removes window from array
  - [x] Implement `focusWindow(id: string)` - sets activeWindowId, bumps zIndex
  - [x] Implement `minimizeWindow(id: string)` - sets window state to 'minimized'
  - [x] Implement `restoreWindow(id: string)` - sets window state to 'open'
  - [x] Implement `updatePosition(id: string, x: number, y: number)` - updates x, y
  - [x] Implement `updateSize(id: string, width: number, height: number)` - updates width, height
  - [x] Export as named export `useWindowStore`

- [x] **Task 2: Create SoundStore** (AC: #2, #4, #5, #6)
  - [x] Create `src/stores/soundStore.ts`
  - [x] Define `SoundStore` interface with audioContext, buffers Map, initialized flag
  - [x] Implement `initialize()` - creates AudioContext, loads sound buffers
  - [x] Implement `play(soundName: string)` - plays sound from buffer
  - [x] Export as named export `useSoundStore`

- [x] **Task 3: Create AppStore** (AC: #3, #4, #5, #6)
  - [x] Create `src/stores/appStore.ts`
  - [x] Define `AppStore` interface with mode ('tiger' | 'ios'), startupComplete flag
  - [x] Implement `setMode(mode: 'tiger' | 'ios')` - changes application mode
  - [x] Implement `completeStartup()` - marks startup as complete
  - [x] Export as named export `useAppStore`

- [x] **Task 4: Create unit tests for stores** (AC: #7)
  - [x] Create `src/stores/__tests__/windowStore.test.ts`
  - [x] Create `src/stores/__tests__/soundStore.test.ts`
  - [x] Create `src/stores/__tests__/appStore.test.ts`
  - [x] Test all actions modify state correctly
  - [x] Test initial state values

- [x] **Task 5: Verify TypeScript compilation and tests** (AC: #5, #7)
  - [x] Run `npm run build` - confirm 0 TypeScript errors
  - [x] Run `npm run test` - confirm all tests pass

## Dev Notes

### Critical Architecture Requirements

**IMPORTANT: Named Exports Only**
The architecture explicitly forbids default exports. All stores must use:
```typescript
// CORRECT
export const useWindowStore = create<WindowStore>(...)

// WRONG - DO NOT USE
export default create<WindowStore>(...)
```

### Zustand Store Pattern (from Architecture)

```typescript
import { create } from 'zustand';

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

interface WindowStore {
  // State
  windows: WindowState[];
  activeWindowId: string | null;
  maxZIndex: number;

  // Actions (verb prefix)
  openWindow: (app: string) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  // Initial state
  windows: [],
  activeWindowId: null,
  maxZIndex: 0,

  // Actions
  openWindow: (app) => {
    const id = crypto.randomUUID();
    const { maxZIndex } = get();
    const newZIndex = maxZIndex + 1;
    set((state) => ({
      windows: [...state.windows, {
        id,
        app,
        title: app, // Default title to app name
        x: 100 + (state.windows.length * 30), // Cascade positioning
        y: 100 + (state.windows.length * 30),
        width: 400,
        height: 300,
        zIndex: newZIndex,
        state: 'open'
      }],
      activeWindowId: id,
      maxZIndex: newZIndex,
    }));
    return id;
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  focusWindow: (id) => {
    const { maxZIndex } = get();
    const newZIndex = maxZIndex + 1;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: newZIndex } : w
      ),
      activeWindowId: id,
      maxZIndex: newZIndex,
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, state: 'minimized' as const } : w
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  restoreWindow: (id) => {
    const { maxZIndex } = get();
    const newZIndex = maxZIndex + 1;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, state: 'open' as const, zIndex: newZIndex } : w
      ),
      activeWindowId: id,
      maxZIndex: newZIndex,
    }));
  },

  updatePosition: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, x, y } : w
      ),
    }));
  },

  updateSize: (id, width, height) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, width, height } : w
      ),
    }));
  },
}));
```

### SoundStore Pattern

```typescript
import { create } from 'zustand';

interface SoundStore {
  audioContext: AudioContext | null;
  buffers: Map<string, AudioBuffer>;
  initialized: boolean;

  initialize: () => Promise<void>;
  play: (soundName: string) => void;
}

export const useSoundStore = create<SoundStore>((set, get) => ({
  audioContext: null,
  buffers: new Map(),
  initialized: false,

  initialize: async () => {
    // Browser requires user gesture before AudioContext
    const audioContext = new AudioContext();
    set({ audioContext, initialized: true });

    // Preload sounds would go here
    // const response = await fetch('/sounds/startup.mp3');
    // const arrayBuffer = await response.arrayBuffer();
    // const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    // get().buffers.set('startup', audioBuffer);
  },

  play: (soundName) => {
    const { audioContext, buffers } = get();
    if (!audioContext) return;

    const buffer = buffers.get(soundName);
    if (!buffer) return;

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
  },
}));
```

### AppStore Pattern

```typescript
import { create } from 'zustand';

type AppMode = 'tiger' | 'ios';

interface AppStore {
  mode: AppMode;
  startupComplete: boolean;

  setMode: (mode: AppMode) => void;
  completeStartup: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  mode: 'tiger',
  startupComplete: false,

  setMode: (mode) => set({ mode }),
  completeStartup: () => set({ startupComplete: true }),
}));
```

### Testing Pattern for Zustand Stores

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useWindowStore } from '../windowStore';

describe('windowStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useWindowStore.setState({
      windows: [],
      activeWindowId: null,
      maxZIndex: 0,
    });
  });

  it('should open a new window', () => {
    const id = useWindowStore.getState().openWindow('About');
    const state = useWindowStore.getState();

    expect(state.windows).toHaveLength(1);
    expect(state.windows[0].app).toBe('About');
    expect(state.activeWindowId).toBe(id);
  });

  it('should close a window', () => {
    const id = useWindowStore.getState().openWindow('About');
    useWindowStore.getState().closeWindow(id);

    expect(useWindowStore.getState().windows).toHaveLength(0);
  });

  // ... more tests
});
```

### Previous Story Learnings

From Story 1.1:
- Always use named exports (architecture requirement enforced in code review)
- Test scripts added: `npm run test` and `npm run test:run`
- Vitest configured with jsdom environment
- Test setup file at `src/test/setup.ts`

### File Structure

```
src/stores/
├── windowStore.ts
├── soundStore.ts
├── appStore.ts
└── __tests__/
    ├── windowStore.test.ts
    ├── soundStore.test.ts
    └── appStore.test.ts
```

### Verification Commands

```bash
# TypeScript compilation check
npm run build

# Run all tests
npm run test

# Run tests once (no watch)
npm run test:run

# Check specific store
npm run test:run -- windowStore
```

### References

- [Source: architecture.md#State-Management-Domain-Stores] - WindowStore, SoundStore, AppStore interfaces
- [Source: architecture.md#Zustand-Store-Pattern] - Complete store implementation pattern
- [Source: architecture.md#Implementation-Patterns] - Named exports, naming conventions
- [Source: epics.md#Story-1.2] - Original acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- AudioContext mock required class syntax instead of vi.fn() - fixed in soundStore.test.ts

### Completion Notes List

- **Task 1**: Created windowStore.ts with WindowState interface and 7 actions (openWindow, closeWindow, focusWindow, minimizeWindow, restoreWindow, updatePosition, updateSize)
- **Task 2**: Created soundStore.ts with AudioContext management and play action
- **Task 3**: Created appStore.ts with mode ('tiger' | 'ios') and startupComplete state
- **Task 4**: Created 35 unit tests across 3 test files, all passing
- **Task 5**: Build passes (417ms, 0 errors), Tests pass (35/35)

### Change Log

- 2026-01-08: Implementation complete, all tests passing
- 2026-01-08: Code review fixes applied (2 issues resolved)

### File List

**Created:**
- src/stores/windowStore.ts
- src/stores/soundStore.ts
- src/stores/appStore.ts
- src/stores/__tests__/windowStore.test.ts (21 tests)
- src/stores/__tests__/soundStore.test.ts (8 tests)
- src/stores/__tests__/appStore.test.ts (6 tests)

**Modified (Code Review):**
- src/stores/appStore.ts (exported AppMode type)
- src/stores/soundStore.ts (exported SoundStore interface)
- src/stores/__tests__/soundStore.test.ts (fixed type assertion)

## Senior Developer Review (AI)

**Review Date:** 2026-01-08
**Reviewer:** Claude Opus 4.5 (Adversarial Code Review)
**Outcome:** APPROVED (after fixes)

### Issues Found: 3 total (1 High, 1 Medium, 1 Low)

### Action Items (All HIGH/MEDIUM Resolved)

- [x] [HIGH] H1: Exported `AppMode` type from appStore.ts
- [x] [MEDIUM] M1: Exported `SoundStore` interface from soundStore.ts
- [ ] [LOW] L1: 'closed' window state unused - deferred (may be for future animations)
