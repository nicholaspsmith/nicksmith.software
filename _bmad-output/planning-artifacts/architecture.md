---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowComplete: true
completedAt: '2026-01-07'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/product-brief-nicksmith.software-2026-01-07.md'
  - '_bmad-output/planning-artifacts/research/technical-tiger-ios6-implementation-research-2026-01-07.md'
workflowType: 'architecture'
project_name: 'nicksmith.software'
user_name: 'Nick'
date: '2026-01-07'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
45 requirements across 8 capability areas. MVP focuses on 36 requirements (FR1-FR36), with Terminal (FR37-FR41) and iOS (FR42-FR45) deferred to later phases.

| Capability Area | MVP FRs | Post-MVP FRs | Architectural Impact |
|-----------------|---------|--------------|---------------------|
| Desktop Environment | FR1-FR6 | - | Base layout, cursor, icons |
| Window Management | FR7-FR15 | FR16 (genie) | **High complexity subsystem** |
| Portfolio Content | FR17-FR23 | - | Content rendering |
| Navigation & Interaction | FR24-FR27 | FR28-FR29 | Keyboard/input handling |
| Audio & Feedback | FR30 | FR31-FR32 | Sound manager singleton |
| Terminal | - | FR37-FR41 | Lazy-loaded feature |
| iOS Mobile | - | FR42-FR45 | Separate feature branch |

**Non-Functional Requirements:**
- Performance: 60fps animations, FCP < 1.5s, bundle < 500KB
- Browser Support: Chrome/Safari/Firefox/Edge (latest 2 versions)
- Code Quality: TypeScript strict mode, zero console errors
- **Fidelity Priority:** Authenticity to Tiger > all other concerns

**Scale & Complexity:**
- Primary domain: Frontend SPA (Single Page Application)
- Complexity level: Medium (Window Management subsystem = High)
- Estimated architectural components: ~25 React components
- State stores: 3 (WindowStore, SoundStore, AppStore)

### Technical Constraints & Dependencies

| Constraint | Source | Impact |
|------------|--------|--------|
| No backend | PRD | Static hosting, no auth |
| Desktop-first | UX Spec | Mobile gets fallback message |
| 60fps quality gate | PRD/UX | GPU-only animations |
| Browser autoplay policy | Technical | Sound init after user gesture |
| Bundle size < 500KB | PRD | Lazy load Terminal, games |
| Single-threaded JS | Platform | Animation + sound + state must not block |
| React reconciliation | Framework | Frequent drag updates could cause jank |
| CSS stacking contexts | Platform | z-index management complexity with nested elements |

**Pre-validated Technology Stack (from Research):**
- React 18 + TypeScript + Vite
- Zustand for state management
- react-rnd for window interactions
- Framer Motion for animations
- xterm.js for Terminal (Phase 2)

### Implementation Decision Framework

**Guiding Principle:** If Tiger had it → Replicate exactly. If Tiger didn't have it → Don't add it.

| Decision Type | Rule | Example |
|---------------|------|---------|
| **Sacred** | Pixel-perfect to Tiger specs | Traffic light = 12px diameter, exact colors |
| **Adaptive** | Web-appropriate behavior | React event handlers instead of OS events |
| **Modern** | Only what's technically required | CSS units, bundler config |

**Authenticity Decision Registry:**
Sacred values will be defined as TypeScript constants to prevent accidental modification:
```typescript
const SACRED = {
  trafficLightDiameter: 12,
  titleBarHeight: 22,
  windowCornerRadius: 5,
  menuBarHeight: 22,
} as const;
```

### Cross-Cutting Concerns Identified

| Concern | Affected Components | Strategy |
|---------|---------------------|----------|
| Animation Performance | All windows, minimize, transitions | transform/opacity only, will-change hints |
| Focus Management | Windows, MenuBar, shortcuts | Zustand activeWindowId, click-to-focus |
| Aqua Constants | All UI components | CSS custom properties (--aqua-*) as fixed values |
| Window Lifecycle | Window, Dock, WindowStore | State machine for animation sequencing |
| Lazy Loading | Terminal, Marble Blast, Flappy Bird | React.lazy + Suspense |
| Error Boundaries | Window content, embedded games | Per-feature error handling |

**Window Lifecycle State Machine:**
```
closed → opening → open → minimizing → minimized → restoring → open
         ↓                     ↓
      (spawn)              (to dock)
```

### Testability Strategy

| What | Risk | Mitigation |
|------|------|------------|
| Animation performance | Can't unit test FPS | Playwright visual regression + DevTools profiling |
| Window z-index ordering | Edge cases multiply | Property-based testing with fast-check |
| Keyboard shortcuts | Browser capture conflicts | E2E tests in headless Chrome |
| Sound playback | AudioContext mocking | Integration tests with Web Audio API stubs |

**CI Quality Gate:** Lighthouse Performance ≥ 85 (build fails below threshold)

## Starter Template Evaluation

### Primary Technology Domain

**Frontend SPA** - React 18+ with TypeScript, Vite build tooling

Pre-validated stack from research phase provides clear direction. We need a minimal foundation that doesn't add unwanted complexity.

### Starter Options Considered

| Starter | What It Provides | Fit Assessment |
|---------|------------------|----------------|
| **`create-vite react-ts`** | Minimal React + TS + Vite | ✅ Perfect - clean slate |
| Modern React Template 2026 | React 19, TanStack Router, TanStack Query | ❌ Over-engineered for portfolio |
| R35007/vite-react-typescript | Kitchen sink (MUI, Redux, Saga, Cypress) | ❌ Too opinionated, wrong libraries |
| simerlec/vite-react-ts-starter | Tailwind JIT, Vitest | ⚠️ Close, but adds opinions |

### Selected Starter: Official `create-vite` with `react-ts` template

**Rationale:**
1. **Minimal foundation** - Doesn't add things Tiger didn't have
2. **Official & maintained** - create-vite 8.2.0 is actively updated
3. **Clean composition** - We add exactly what we need, nothing more
4. **Vite 6.x/7.x compatible** - Security patches actively backported

**Initialization Command:**
```bash
npm create vite@latest nicksmith-portfolio -- --template react-ts
cd nicksmith-portfolio
npm install

# Add pre-validated dependencies
npm install zustand@^5.0 react-rnd@^10.5 motion@^12
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript 5.x with strict mode ready
- React 18.x with JSX transform
- ES2020+ target

**Build Tooling:**
- Vite with esbuild (20-30x faster than tsc)
- HMR updates < 50ms
- Optimized production builds with Rollup

**Styling Solution:**
- CSS imports supported out of box
- We add: Tailwind CSS + CSS custom properties for Aqua constants

**Testing Framework:**
- Not included (we add Vitest + RTL)

**Code Organization:**
- Minimal: `src/`, `public/`, config files
- We define our feature-based structure

### Dependencies to Add Post-Scaffold

| Package | Version | Purpose |
|---------|---------|---------|
| zustand | ^5.0.9 | Window/App/Sound stores |
| react-rnd | ^10.5.2 | Draggable/resizable windows |
| motion | ^12.24 | Animations (rebranded from framer-motion) |
| tailwindcss | latest | Utility classes |
| vitest | latest | Unit testing |
| @testing-library/react | latest | Component testing |
| playwright | latest | E2E & visual regression |

**Note:** `framer-motion` has been rebranded to `motion` - use `npm install motion` for the latest.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Project structure pattern
- State management design
- Animation architecture for 60fps

**Important Decisions (Shape Architecture):**
- CSS organization approach
- Shared variant definitions

**Deferred Decisions (Post-MVP):**
- iOS 6 feature structure (Phase 3)
- Terminal integration pattern (Phase 2)
- Game embedding strategy (Phase 4)

### Frontend Architecture

#### Project Structure: Feature-Based

```
src/
├── features/
│   ├── tiger/              # Desktop environment
│   │   ├── components/
│   │   │   ├── Desktop/
│   │   │   ├── Window/
│   │   │   ├── WindowChrome/
│   │   │   ├── MenuBar/
│   │   │   ├── DesktopIcon/
│   │   │   └── Dock/
│   │   ├── hooks/
│   │   └── constants/
│   │
│   └── apps/               # Portfolio content apps
│       ├── AboutMe/
│       ├── Projects/
│       ├── Resume/
│       └── Contact/
│
├── stores/
│   ├── windowStore.ts
│   ├── soundStore.ts
│   └── appStore.ts
│
├── animations/
│   └── aqua.ts             # Shared motion variants
│
├── styles/
│   └── aqua.css            # --aqua-* custom properties
│
├── assets/
│   ├── sounds/
│   ├── icons/
│   ├── wallpapers/
│   └── cursors/
│
└── types/
    └── index.ts
```

**Rationale:** Feature colocation keeps Tiger-specific code together. Apps are separate features that render inside Window components.

#### State Management: Domain Stores (Zustand)

**WindowStore** - Window lifecycle and positioning:
```typescript
interface WindowStore {
  windows: WindowState[];
  activeWindowId: string | null;
  maxZIndex: number;

  openWindow: (app: string) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
}
```

**SoundStore** - Audio management:
```typescript
interface SoundStore {
  audioContext: AudioContext | null;
  buffers: Map<string, AudioBuffer>;
  initialized: boolean;

  initialize: () => Promise<void>;
  play: (soundName: string) => void;
}
```

**AppStore** - Application-level state:
```typescript
interface AppStore {
  mode: 'tiger' | 'ios';
  startupComplete: boolean;

  setMode: (mode: 'tiger' | 'ios') => void;
  completeStartup: () => void;
}
```

**Rationale:** Three distinct domains with clear boundaries. No cross-store dependencies in MVP.

#### CSS Architecture: CSS Modules

Each component gets scoped styles:
```
src/features/tiger/components/Window/
├── Window.tsx
├── Window.module.css
└── index.ts
```

**Global Aqua constants** in `src/styles/aqua.css`:
```css
:root {
  /* Sacred values - do not modify */
  --aqua-traffic-light-diameter: 12px;
  --aqua-titlebar-height: 22px;
  --aqua-menubar-height: 22px;
  --aqua-window-radius: 5px;

  /* Aqua colors */
  --aqua-blue-primary: #4ca1e4;
  --aqua-blue-dark: #1872c9;
  --aqua-close: #ff5f57;
  --aqua-minimize: #ffbd2e;
  --aqua-zoom: #28c940;

  /* Typography */
  --aqua-font-family: 'Lucida Grande', 'Lucida Sans Unicode', sans-serif;
  --aqua-font-size-sm: 11px;
  --aqua-font-size-md: 13px;
}
```

**Rationale:** CSS Modules provide component scoping. Global constants are imported where needed.

#### Animation Architecture: Shared Variants

Centralized animation definitions in `src/animations/aqua.ts`:
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

**Usage in components:**
```tsx
<motion.div
  variants={windowVariants}
  initial="closed"
  animate={windowState}
/>
```

**Rationale:** Consistent animations across all windows. Easy to tune timing in one place. Supports the window lifecycle state machine.

### Decision Impact Analysis

**Implementation Sequence:**
1. Project scaffold with feature structure
2. Aqua constants CSS file
3. Zustand stores (App → Sound → Window)
4. Shared animation variants
5. Window component with CSS Module
6. Desktop environment
7. Portfolio app components

**Cross-Component Dependencies:**
- Window component depends on: windowStore, windowVariants, aqua.css
- Desktop depends on: appStore, Window, DesktopIcon
- MenuBar depends on: windowStore (active window), appStore
- All components import from aqua.css for sacred values

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 6 areas where AI agents could make different choices

These patterns ensure all AI agents write compatible code for the Tiger portfolio.

### Naming Patterns

**Component & File Naming:**
| Element | Convention | Example |
|---------|------------|---------|
| React components | PascalCase | `Window`, `WindowChrome`, `TrafficLights` |
| Component files | PascalCase.tsx | `Window.tsx`, `DesktopIcon.tsx` |
| CSS Modules | Component.module.css | `Window.module.css` |
| Hooks | camelCase with `use` prefix | `useWindowStore.ts`, `useSounds.ts` |
| Utilities | camelCase | `formatDate.ts`, `generateId.ts` |
| Constants | SCREAMING_SNAKE_CASE | `SACRED_VALUES`, `WINDOW_DEFAULTS` |

**Props & Type Naming:**
| Element | Convention | Example |
|---------|------------|---------|
| Props interface | `{Component}Props` | `WindowProps`, `IconProps`, `MenuBarProps` |
| State interface | `{Domain}State` | `WindowState`, `AppState` |
| Store interface | `{Domain}Store` | `WindowStore`, `SoundStore` |
| Event props | `on{Action}` | `onClose`, `onMinimize`, `onFocus` |
| Internal handlers | `handle{Action}` | `handleClose`, `handleDragEnd` |

**CSS Variable Naming:**
| Element | Convention | Example |
|---------|------------|---------|
| Namespace | `--aqua-` prefix | All Tiger-related variables |
| Colors | `--aqua-{name}` | `--aqua-close`, `--aqua-blue-primary` |
| Dimensions | `--aqua-{element}-{property}` | `--aqua-titlebar-height` |
| Typography | `--aqua-font-{property}` | `--aqua-font-family`, `--aqua-font-size-sm` |
| Sacred values | Comment marker | `/* Sacred - do not modify */` |

### Structure Patterns

**Component File Structure:**
```
src/features/tiger/components/Window/
├── Window.tsx           # Component implementation
├── Window.module.css    # Scoped styles
├── Window.types.ts      # Types (if complex)
└── __tests__/
    └── Window.test.tsx  # Tests in __tests__ folder
```

**Export Style: Named Exports**
```typescript
// Window.tsx
export function Window({ id, title, children }: WindowProps) {
  // ...
}

export interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

// Usage in other files:
import { Window, WindowProps } from '@/features/tiger/components/Window/Window';
```

**Import Order Convention:**
```typescript
// 1. React/external libraries
import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Rnd } from 'react-rnd';

// 2. Internal stores/hooks
import { useWindowStore } from '@/stores/windowStore';

// 3. Internal components
import { WindowChrome } from '../WindowChrome/WindowChrome';

// 4. Styles/assets
import styles from './Window.module.css';

// 5. Types (if separate file)
import type { WindowProps } from './Window.types';
```

### Code Patterns

**Component Structure Template:**
```typescript
// 1. Imports (ordered as above)
import { useCallback } from 'react';
import { motion } from 'motion/react';
import { useWindowStore } from '@/stores/windowStore';
import { windowVariants } from '@/animations/aqua';
import styles from './Window.module.css';

// 2. Types
export interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}

// 3. Component
export function Window({ id, title, children, onClose }: WindowProps) {
  // 3a. Store hooks
  const focusWindow = useWindowStore((s) => s.focusWindow);

  // 3b. Local state (if any)

  // 3c. Callbacks
  const handleFocus = useCallback(() => {
    focusWindow(id);
  }, [focusWindow, id]);

  // 3d. Effects (if any)

  // 3e. Render
  return (
    <motion.div
      className={styles.window}
      variants={windowVariants}
      onClick={handleFocus}
    >
      {children}
    </motion.div>
  );
}
```

**Zustand Store Pattern:**
```typescript
import { create } from 'zustand';

interface WindowState {
  id: string;
  // ... other fields
}

interface WindowStore {
  // State
  windows: WindowState[];
  activeWindowId: string | null;

  // Actions (verb prefix)
  openWindow: (app: string) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  // Initial state
  windows: [],
  activeWindowId: null,

  // Actions
  openWindow: (app) => {
    const id = crypto.randomUUID();
    set((state) => ({
      windows: [...state.windows, { id, app /* ... */ }],
      activeWindowId: id,
    }));
    return id;
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    }));
  },

  focusWindow: (id) => {
    set({ activeWindowId: id });
  },
}));
```

### Process Patterns

**Error Handling:**
- Use Error Boundaries at feature level (wrap each app content)
- Console errors for development debugging
- Silent fail for non-critical features (sounds)
- No user-facing error modals (not authentic to Tiger)

**Loading States:**
- No loading spinners (Tiger didn't have them for local operations)
- Window opens immediately, content renders when ready
- Lazy-loaded features (Terminal) show empty window until loaded

### Enforcement Guidelines

**All AI Agents MUST:**
1. Follow naming conventions exactly (PascalCase components, camelCase hooks)
2. Use `--aqua-` prefix for all CSS custom properties
3. Place tests in `__tests__` folder within component directory
4. Use named exports (no default exports)
5. Follow component structure template order
6. Use `on` prefix for event props, `handle` prefix for internal handlers

**Anti-Patterns to Avoid:**
```typescript
// ❌ WRONG: Default export
export default function Window() {}

// ✅ CORRECT: Named export
export function Window() {}

// ❌ WRONG: Generic CSS variable
--primary-color: blue;

// ✅ CORRECT: Namespaced CSS variable
--aqua-blue-primary: #4ca1e4;

// ❌ WRONG: Inconsistent handler naming
const click = () => {};
const onHandleClose = () => {};

// ✅ CORRECT: Consistent handler naming
const handleClick = () => {};  // internal
onClose?: () => void;          // prop
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
nicksmith-portfolio/
├── README.md
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── postcss.config.js
├── .gitignore
├── .env.example
├── netlify.toml
├── index.html
│
├── .github/
│   └── workflows/
│       └── ci.yml                    # Lighthouse CI, build check
│
├── public/
│   ├── favicon.ico                   # Apple rainbow favicon
│   └── fonts/
│       ├── LucidaGrande.woff2
│       └── Chicago.woff2
│
├── src/
│   ├── main.tsx                      # App entry point
│   ├── App.tsx                       # Root component
│   ├── vite-env.d.ts
│   │
│   ├── animations/
│   │   └── aqua.ts                   # Shared motion variants
│   │
│   ├── assets/
│   │   ├── sounds/
│   │   │   ├── startup.mp3           # Mac startup chime
│   │   │   └── sosumi.mp3            # Error beep
│   │   ├── icons/
│   │   │   ├── about.png
│   │   │   ├── projects.png
│   │   │   ├── resume.png
│   │   │   └── contact.png
│   │   ├── wallpapers/
│   │   │   └── aqua-blue.jpg         # Tiger default wallpaper
│   │   └── cursors/
│   │       └── default.cur           # Tiger cursor
│   │
│   ├── features/
│   │   ├── tiger/
│   │   │   ├── components/
│   │   │   │   ├── Desktop/
│   │   │   │   │   ├── Desktop.tsx
│   │   │   │   │   ├── Desktop.module.css
│   │   │   │   │   └── __tests__/
│   │   │   │   │       └── Desktop.test.tsx
│   │   │   │   │
│   │   │   │   ├── Window/
│   │   │   │   │   ├── Window.tsx
│   │   │   │   │   ├── Window.module.css
│   │   │   │   │   └── __tests__/
│   │   │   │   │       └── Window.test.tsx
│   │   │   │   │
│   │   │   │   ├── WindowChrome/
│   │   │   │   │   ├── WindowChrome.tsx
│   │   │   │   │   ├── WindowChrome.module.css
│   │   │   │   │   └── __tests__/
│   │   │   │   │       └── WindowChrome.test.tsx
│   │   │   │   │
│   │   │   │   ├── TrafficLights/
│   │   │   │   │   ├── TrafficLights.tsx
│   │   │   │   │   ├── TrafficLights.module.css
│   │   │   │   │   └── __tests__/
│   │   │   │   │       └── TrafficLights.test.tsx
│   │   │   │   │
│   │   │   │   ├── MenuBar/
│   │   │   │   │   ├── MenuBar.tsx
│   │   │   │   │   ├── MenuBar.module.css
│   │   │   │   │   ├── AppleMenu.tsx
│   │   │   │   │   └── __tests__/
│   │   │   │   │       └── MenuBar.test.tsx
│   │   │   │   │
│   │   │   │   ├── DesktopIcon/
│   │   │   │   │   ├── DesktopIcon.tsx
│   │   │   │   │   ├── DesktopIcon.module.css
│   │   │   │   │   └── __tests__/
│   │   │   │   │       └── DesktopIcon.test.tsx
│   │   │   │   │
│   │   │   │   └── Dock/
│   │   │   │       ├── Dock.tsx
│   │   │   │       ├── Dock.module.css
│   │   │   │       └── __tests__/
│   │   │   │           └── Dock.test.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useKeyboardShortcuts.ts
│   │   │   │
│   │   │   └── constants/
│   │   │       └── sacred.ts         # SACRED values registry
│   │   │
│   │   └── apps/
│   │       ├── AboutMe/
│   │       │   ├── AboutMe.tsx
│   │       │   ├── AboutMe.module.css
│   │       │   └── __tests__/
│   │       │       └── AboutMe.test.tsx
│   │       │
│   │       ├── Projects/
│   │       │   ├── Projects.tsx
│   │       │   ├── Projects.module.css
│   │       │   ├── ProjectCard.tsx
│   │       │   └── __tests__/
│   │       │       └── Projects.test.tsx
│   │       │
│   │       ├── Resume/
│   │       │   ├── Resume.tsx
│   │       │   ├── Resume.module.css
│   │       │   └── __tests__/
│   │       │       └── Resume.test.tsx
│   │       │
│   │       └── Contact/
│   │           ├── Contact.tsx
│   │           ├── Contact.module.css
│   │           └── __tests__/
│   │               └── Contact.test.tsx
│   │
│   ├── stores/
│   │   ├── windowStore.ts
│   │   ├── soundStore.ts
│   │   └── appStore.ts
│   │
│   ├── styles/
│   │   ├── aqua.css                  # --aqua-* custom properties
│   │   ├── reset.css                 # CSS reset
│   │   └── global.css                # Global styles
│   │
│   └── types/
│       └── index.ts                  # Shared type definitions
│
├── e2e/
│   ├── playwright.config.ts
│   └── specs/
│       ├── window-management.spec.ts
│       └── navigation.spec.ts
│
└── vitest.config.ts
```

### Requirements to Structure Mapping

| FR Category | Primary Location | Files |
|-------------|------------------|-------|
| **Desktop Environment** (FR1-FR6) | `features/tiger/components/Desktop/` | Desktop.tsx, DesktopIcon.tsx |
| **Window Management** (FR7-FR16) | `features/tiger/components/Window/` | Window.tsx, WindowChrome.tsx, TrafficLights.tsx |
| **Portfolio Content** (FR17-FR23) | `features/apps/` | AboutMe/, Projects/, Resume/, Contact/ |
| **Navigation** (FR24-FR29) | `features/tiger/components/MenuBar/` | MenuBar.tsx, AppleMenu.tsx |
| **Audio** (FR30-FR32) | `stores/soundStore.ts` | + `assets/sounds/` |

### Component Communication Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Desktop                           │    │
│  │  ┌──────────┐  ┌──────────────────────────────────┐ │    │
│  │  │ MenuBar  │  │        Window (per app)          │ │    │
│  │  │          │  │  ┌────────────────────────────┐  │ │    │
│  │  │ reads:   │  │  │      WindowChrome          │  │ │    │
│  │  │ appStore │  │  │  ┌──────────────────────┐  │  │ │    │
│  │  │ window   │  │  │  │   TrafficLights      │  │  │ │    │
│  │  │ Store    │  │  │  │   calls: closeWindow │  │  │ │    │
│  │  └──────────┘  │  │  │          minimize    │  │  │ │    │
│  │                │  │  └──────────────────────┘  │  │ │    │
│  │  ┌──────────┐  │  │                            │  │ │    │
│  │  │ Desktop  │  │  │  ┌──────────────────────┐  │  │ │    │
│  │  │ Icons    │  │  │  │   App Content        │  │  │ │    │
│  │  │ calls:   │  │  │  │   (AboutMe, etc.)    │  │  │ │    │
│  │  │ openWin  │  │  │  └──────────────────────┘  │  │ │    │
│  │  └──────────┘  │  └────────────────────────────┘  │ │    │
│  │                │                                   │ │    │
│  │  ┌────────────────────────────────────────────┐   │ │    │
│  │  │              Dock (Phase 2)                │   │ │    │
│  │  │              reads: windowStore            │   │ │    │
│  │  └────────────────────────────────────────────┘   │ │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

Store Communication:
━━━━━━━━━━━━━━━━━━━━
windowStore ←── Window, Desktop, MenuBar, Dock
soundStore  ←── Desktop (startup), TrafficLights (error)
appStore    ←── App, MenuBar
```

### Data Flow

```
User Click (DesktopIcon)
    │
    ▼
openWindow(app) ─────────► windowStore
    │                           │
    │                           ▼
    │                    windows: [..., newWindow]
    │                    activeWindowId: newId
    │                           │
    └───────────────────────────┤
                                ▼
                         Desktop re-renders
                                │
                                ▼
                    Window components rendered
                                │
                                ▼
                    App content (AboutMe, etc.)
```

## Architecture Validation Results

### Coherence Validation ✅

| Check | Status | Details |
|-------|--------|---------|
| **Technology Compatibility** | ✅ Pass | React 18 + Vite + Zustand + motion + react-rnd all work together |
| **Version Compatibility** | ✅ Pass | All versions verified current (Zustand 5.0.9, motion 12.24, react-rnd 10.5.2) |
| **Pattern Alignment** | ✅ Pass | CSS Modules + named exports + domain stores align with React/TS patterns |
| **No Contradictions** | ✅ Pass | All decisions consistent (feature-based structure + domain stores + CSS Modules) |

### Requirements Coverage Validation ✅

| FR Category | Architectural Support | Status |
|-------------|----------------------|--------|
| **Desktop Environment** (FR1-FR6) | Desktop, DesktopIcon, custom cursor, wallpaper | ✅ Covered |
| **Window Management** (FR7-FR16) | Window, WindowChrome, TrafficLights, windowStore, windowVariants | ✅ Covered |
| **Portfolio Content** (FR17-FR23) | AboutMe, Projects, Resume, Contact app components | ✅ Covered |
| **Navigation** (FR24-FR29) | MenuBar, useKeyboardShortcuts hook | ✅ Covered |
| **Audio** (FR30-FR32) | soundStore + assets/sounds/ | ✅ Covered |
| **Terminal** (FR37-FR41) | Deferred to Phase 2 (lazy loading pattern ready) | ✅ Planned |
| **iOS** (FR42-FR45) | Deferred to Phase 3 (feature structure ready) | ✅ Planned |

**NFR Coverage:**

| Requirement | Architectural Support | Status |
|-------------|----------------------|--------|
| 60fps animations | motion library + GPU transforms + shared variants | ✅ |
| FCP < 1.5s | Vite bundling + no SSR overhead | ✅ |
| Bundle < 500KB | React.lazy for Terminal/games | ✅ |
| TypeScript strict | tsconfig.json strict mode | ✅ |
| Lighthouse ≥ 85 | CI quality gate defined | ✅ |

### Implementation Readiness Validation ✅

| Check | Status | Evidence |
|-------|--------|----------|
| **All critical decisions documented** | ✅ | Starter, structure, stores, patterns all specified |
| **Versions verified** | ✅ | Web search confirmed current NPM versions |
| **Patterns comprehensive** | ✅ | Naming, structure, code, process patterns defined |
| **Examples provided** | ✅ | Component template, store pattern, anti-patterns |
| **Structure complete** | ✅ | Full directory tree with all files |
| **Boundaries defined** | ✅ | Store communication, component hierarchy |

### Gap Analysis Results

| Priority | Gap | Status |
|----------|-----|--------|
| **Critical** | None identified | ✅ |
| **Important** | Animation timing details | Addressed in shared variants |
| **Nice-to-have** | Accessibility escape hatch | Deferred per user priority |

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH - Clear stack, explicit patterns, complete structure

**Key Strengths:**
1. Authenticity-first - "If Tiger had it → replicate exactly" prevents scope creep
2. Sacred values registry - TypeScript constants prevent accidental changes
3. Window lifecycle state machine - Clear animation sequencing
4. Domain stores - Clean separation of concerns
5. Feature-based structure - Tiger and apps are isolated

**Areas for Future Enhancement:**
- iOS 6 feature structure (Phase 3)
- Terminal integration (Phase 2)
- Game embedding patterns (Phase 4)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**
```bash
npm create vite@latest nicksmith-portfolio -- --template react-ts
cd nicksmith-portfolio
npm install zustand@^5.0 react-rnd@^10.5 motion@^12
npm install -D vitest @testing-library/react playwright
```

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-07
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### Final Architecture Deliverables

**Complete Architecture Document**
- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**Implementation Ready Foundation**
- 12+ architectural decisions made
- 6 implementation pattern categories defined
- 25+ architectural components specified
- 45 functional requirements fully supported

**AI Agent Implementation Guide**
- Technology stack with verified versions (Zustand 5.0.9, motion 12.24, react-rnd 10.5.2)
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Quality Assurance Checklist

**✅ Architecture Coherence**
- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**
- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**
- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

