---
project_name: 'nicksmith.software'
user_name: 'Nick'
date: '2026-01-07'
sections_completed: ['technology-stack', 'authenticity-framework', 'naming-conventions', 'export-rules', 'css-variables', 'animation-rules', 'state-management', 'testing-rules', 'error-handling', 'anti-patterns']
existing_patterns_found: 26
workflow_complete: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Technology | Version | Notes |
|------------|---------|-------|
| React | 18.x | Strict Mode enabled |
| TypeScript | 5.x | `strict: true`, `noUncheckedIndexedAccess: true` |
| Vite | 6.x/7.x | `create-vite react-ts` template |
| Zustand | ^5.0.9 | Domain stores pattern |
| motion | ^12.24 | Rebranded from framer-motion |
| react-rnd | ^10.5.2 | Window drag/resize |
| CSS Modules | - | Component-scoped styles |

---

## Authenticity Framework

This project recreates Mac OS X Tiger (10.4) Aqua UI. Every decision must respect authenticity tiers:

### Sacred (Never Change)
Pixel-exact values from Tiger. Use Sacred Values Registry constants.

```typescript
// src/constants/sacred.ts
export const SACRED = {
  trafficLightDiameter: 12,
  titleBarHeight: 22,
  windowCornerRadius: 5,
  menuBarHeight: 22,
  iconGridSize: 75,
  dockIconSize: 48,
} as const;
```

### Adaptive (Match Feel)
Behaviors that must feel authentic but can adapt to web:
- Window drag physics
- Animation timing curves
- Genie effect (approximation acceptable)

### Modern (Implementation Only)
Hidden from users, modern patterns allowed:
- React component architecture
- TypeScript types
- Zustand state management
- CSS Modules

---

## Component & File Naming

### Files
- Components: `PascalCase.tsx` (e.g., `WindowChrome.tsx`)
- Styles: `PascalCase.module.css` (e.g., `WindowChrome.module.css`)
- Stores: `camelCaseStore.ts` (e.g., `windowStore.ts`)
- Types: `camelCase.types.ts` or `index.ts` in types folder
- Tests: `PascalCase.test.tsx` in `__tests__/` folder

### Components
- Use `PascalCase` for component names
- Suffix with context when needed: `WindowChrome`, `TrafficLights`
- No generic names like `Button` - use `AquaButton`, `MenuBarItem`

### Props & Types
- Props interfaces: `ComponentNameProps` (e.g., `WindowChromeProps`)
- State types: `ComponentNameState` (e.g., `WindowState`)
- Event handlers: `onEventName` (e.g., `onClose`, `onMinimize`)

---

## Export & Import Rules

### Named Exports Only
```typescript
// ✅ CORRECT
export function WindowChrome(props: WindowChromeProps) { }
export const SACRED = { } as const;

// ❌ WRONG - No default exports
export default function WindowChrome() { }
```

### Import Style
```typescript
// ✅ CORRECT - Named imports
import { WindowChrome } from '@/features/tiger/components/WindowChrome';
import { useWindowStore } from '@/stores/windowStore';

// ❌ WRONG - Default imports
import WindowChrome from '@/features/tiger/components/WindowChrome';
```

### Path Aliases
Use `@/` for src directory imports:
```typescript
import { SACRED } from '@/constants/sacred';
import { aquaVariants } from '@/animations/aqua';
```

---

## CSS Variable Naming

All CSS variables use `--aqua-` namespace:

```css
/* Colors */
--aqua-title-bar-active: linear-gradient(180deg, #D6D6D6 0%, #B8B8B8 100%);
--aqua-title-bar-inactive: #E8E8E8;
--aqua-traffic-red: #FF5F57;
--aqua-traffic-yellow: #FFBD2E;
--aqua-traffic-green: #28C840;

/* Dimensions - Reference SACRED constants */
--aqua-title-bar-height: 22px;
--aqua-traffic-light-diameter: 12px;
--aqua-window-corner-radius: 5px;

/* Shadows */
--aqua-window-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
--aqua-button-inset: inset 0 1px 0 rgba(255, 255, 255, 0.4);
```

---

## Animation Rules

### 60fps Quality Gate
All animations must use GPU-only properties:
- ✅ `transform` (translate, scale, rotate)
- ✅ `opacity`
- ❌ `width`, `height`, `top`, `left`, `margin`, `padding`

### Motion Variants Pattern
```typescript
// src/animations/aqua.ts
export const aquaVariants = {
  window: {
    open: { scale: [0.8, 1.02, 1], opacity: [0, 1, 1] },
    close: { scale: [1, 0.95, 0.8], opacity: [1, 0.8, 0] },
    minimize: { scale: 0.1, opacity: 0, y: 500 },
  },
  fade: {
    in: { opacity: 1 },
    out: { opacity: 0 },
  },
} as const;
```

### Timing
- Window open/close: 200-300ms
- Genie effect: 400-500ms
- Hover states: 150ms
- Use `ease-out` for enters, `ease-in` for exits

---

## State Management

### Zustand Domain Stores

```typescript
// src/stores/windowStore.ts
interface WindowState {
  windows: Map<string, Window>;
  activeWindowId: string | null;
  zIndexCounter: number;
}

interface WindowActions {
  openWindow: (appId: string) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
}

export const useWindowStore = create<WindowState & WindowActions>((set, get) => ({
  // implementation
}));
```

### Window Lifecycle States
```
closed → opening → open → minimizing → minimized → restoring → open
         ↘ closing → closed
```

### Store Organization
- `windowStore.ts` - Window state, z-index, focus
- `soundStore.ts` - Audio playback state
- `appStore.ts` - App registry, launch state

---

## Testing Rules

### Test Location
Tests live in `__tests__/` folder within component directories:
```
features/tiger/components/Window/
├── Window.tsx
├── Window.module.css
└── __tests__/
    └── Window.test.tsx
```

### Test Naming
- Test files: `ComponentName.test.tsx`
- Describe blocks: `describe('ComponentName', () => {})`
- Test names: Start with "should" - `it('should open window on double-click')`

### Required Coverage
- All user interactions (click, drag, keyboard)
- State transitions
- Edge cases (rapid clicks, boundary conditions)

---

## Error Handling

### Window Operations
```typescript
// Always validate window exists before operations
const window = get().windows.get(windowId);
if (!window) {
  console.warn(`Window ${windowId} not found`);
  return;
}
```

### Audio
```typescript
// Audio may fail silently (autoplay restrictions)
try {
  await audio.play();
} catch (e) {
  // User hasn't interacted yet - fail silently
}
```

---

## Critical Anti-Patterns

### ❌ DO NOT
- Add accessibility features not present in Tiger (no ARIA, no reduced motion)
- Add theming or dark mode (Tiger had one look)
- Use default exports
- Animate layout properties (width, height, top, left)
- Create generic component names
- Put tests outside `__tests__/` folders
- Use inline styles for anything except dynamic values
- Import from relative paths when `@/` alias works

### ✅ DO
- Reference Sacred Values Registry for all Tiger-specific measurements
- Use CSS variables with `--aqua-` prefix
- Match Tiger's exact visual appearance
- Use motion library for all animations
- Use Zustand subscriptions for cross-component state
- Write tests for all user interactions

---

## Project Structure Reference

```
src/
├── features/
│   ├── tiger/
│   │   └── components/
│   │       ├── Desktop/
│   │       ├── Window/
│   │       ├── WindowChrome/
│   │       ├── TrafficLights/
│   │       ├── MenuBar/
│   │       ├── DesktopIcon/
│   │       └── Dock/
│   └── apps/
│       ├── AboutMe/
│       ├── Projects/
│       ├── Resume/
│       └── Contact/
├── stores/
│   ├── windowStore.ts
│   ├── soundStore.ts
│   └── appStore.ts
├── animations/
│   └── aqua.ts
├── constants/
│   └── sacred.ts
├── styles/
│   └── aqua.css
└── types/
    └── index.ts
```
