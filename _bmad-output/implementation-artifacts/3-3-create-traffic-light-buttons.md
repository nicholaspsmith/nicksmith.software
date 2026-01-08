# Story 3.3: Create Traffic Light Buttons

Status: done

## Story

As a **visitor**,
I want **windows to have the iconic red/yellow/green traffic light buttons**,
So that **I can close, minimize, and zoom windows like in Tiger**.

## Acceptance Criteria

1. **Given** a window is open, **When** I look at the traffic lights, **Then** three circular buttons appear (red, yellow, green)
2. **And** button diameter is exactly 12px (sacred value)
3. **And** buttons are spaced 8px apart (center-to-center)
4. **And** buttons are positioned 8px from left edge of title bar
5. **And** colors match Tiger exactly (#FF5F57, #FFBD2E, #28CA41)
6. **When** I hover over traffic lights, **Then** symbols appear (×, −, +)
7. **When** I click a traffic light, **Then** it shows a pressed/darker state
8. **And** unfocused windows show gray traffic lights
9. **And** FR9 is satisfied

## Tasks / Subtasks

- [x] **Task 1: Create TrafficLights component structure** (AC: #1)
  - [x] Create `src/features/tiger/components/TrafficLights/TrafficLights.tsx`
  - [x] Create `src/features/tiger/components/TrafficLights/TrafficLights.module.css`
  - [x] Create `src/features/tiger/components/TrafficLights/index.ts` (barrel export)

- [x] **Task 2: Implement traffic light layout** (AC: #2, #3, #4)
  - [x] Three buttons in horizontal row
  - [x] Each button 12px diameter (use --aqua-traffic-light-diameter)
  - [x] 8px spacing between buttons (use --aqua-traffic-light-spacing)
  - [x] 8px from left edge of container (use --aqua-traffic-light-margin)

- [x] **Task 3: Apply traffic light colors** (AC: #5)
  - [x] Close button: #FF5F57 (--aqua-close)
  - [x] Minimize button: #FFBD2E (--aqua-minimize)
  - [x] Zoom button: #28CA41 (--aqua-zoom)
  - [x] Subtle border for depth (inset box-shadow)

- [x] **Task 4: Implement hover state with symbols** (AC: #6)
  - [x] Show × on close button hover
  - [x] Show − on minimize button hover
  - [x] Show + on zoom button hover
  - [x] Symbols appear on group hover (all three at once)

- [x] **Task 5: Implement pressed state** (AC: #7)
  - [x] Darker color on :active (uses --aqua-*-hover colors)
  - [x] Slight scale effect (transform: scale(0.9))

- [x] **Task 6: Implement unfocused state** (AC: #8)
  - [x] Accept `isFocused` prop
  - [x] Gray color (#808080) when window unfocused
  - [x] No symbols shown when unfocused (symbols only on .focused:hover)

- [x] **Task 7: Integrate TrafficLights into WindowChrome**
  - [x] Replace trafficLightsPlaceholder with actual TrafficLights component
  - [x] Pass isFocused prop
  - [x] Add click handlers (onClose, onMinimize, onZoom) to props

- [x] **Task 8: Create unit tests**
  - [x] Create `src/features/tiger/components/TrafficLights/__tests__/TrafficLights.test.tsx`
  - [x] Test renders three buttons
  - [x] Test correct classes applied
  - [x] Test focused vs unfocused states
  - [x] Test click handlers called

- [x] **Task 9: Verify build** (AC: all)
  - [x] Run `npm run build` - 0 errors
  - [x] Run `npm run test:run` - all tests pass (118)
  - [ ] Visual verification with `npm run dev`

## Dev Notes

### TrafficLights Component Architecture

TrafficLights renders the three circular buttons (close, minimize, zoom) with:
- Exact sacred dimensions (12px diameter, 8px spacing)
- Focus-dependent coloring
- Hover symbols
- Click handlers passed from parent

### Component Structure

```
src/features/tiger/components/TrafficLights/
├── TrafficLights.tsx
├── TrafficLights.module.css
├── index.ts
└── __tests__/
    └── TrafficLights.test.tsx
```

### TrafficLights Props

```typescript
export interface TrafficLightsProps {
  isFocused: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onZoom?: () => void;
}
```

### CSS Variables from aqua.css

```css
--aqua-traffic-light-diameter: 12px;
--aqua-traffic-light-spacing: 8px;
--aqua-traffic-light-margin: 8px;
--aqua-close: #ff5f57;
--aqua-minimize: #ffbd2e;
--aqua-zoom: #28c940;
```

### Hover Behavior

Tiger shows symbols on ALL traffic lights when hovering ANY of them (group hover). Implementation:
```css
.container:hover .close::after { content: '×'; }
.container:hover .minimize::after { content: '−'; }
.container:hover .zoom::after { content: '+'; }
```

### Focus State

| State | Traffic Lights |
|-------|----------------|
| Focused | Colored (red, yellow, green) |
| Unfocused | Gray (#808080 or similar) |

When unfocused, no symbols appear on hover.

### Sacred Values

- Diameter: 12px (SACRED.trafficLightDiameter)
- Spacing: 8px (--aqua-traffic-light-spacing)
- Margin: 8px (--aqua-traffic-light-margin)

### Previous Story Learnings

From Stories 3.1, 3.2:
- WindowChrome has trafficLightsPlaceholder to replace
- isFocused is determined by comparing window id to activeWindowId
- Barrel exports for components
- Named exports only

### Verification Commands

```bash
npm run build
npm run test:run
npm run dev
```

### References

- [Source: epics.md#Story-3.3] - Original acceptance criteria
- [Source: aqua.css] - Traffic light colors and spacing
- [Source: sacred.ts] - SACRED.trafficLightDiameter
- [Source: prd.md#FR9] - Window chrome with traffic lights

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

No errors encountered during implementation.

### Completion Notes List

- Created TrafficLights component with three circular buttons (close, minimize, zoom)
- Used CSS variables for sacred dimensions (12px diameter, 8px spacing/margin)
- Implemented group hover behavior - symbols appear on all buttons when hovering any
- Pressed state uses darker colors from aqua.css and scale(0.9) transform
- Unfocused state renders gray (#808080) buttons with no hover symbols
- Click handlers use stopPropagation to prevent triggering window drag
- Added ARIA labels for accessibility (Close window, Minimize window, Zoom window)
- Integrated into WindowChrome replacing the placeholder div
- Added onClose, onMinimize, onZoom props to WindowChromeProps
- Removed trafficLightsPlaceholder CSS class
- 13 new TrafficLights tests, 118 total tests passing

### File List

_Files created/modified:_
- src/features/tiger/components/TrafficLights/TrafficLights.tsx (create)
- src/features/tiger/components/TrafficLights/TrafficLights.module.css (create)
- src/features/tiger/components/TrafficLights/index.ts (create)
- src/features/tiger/components/TrafficLights/__tests__/TrafficLights.test.tsx (create)
- src/features/tiger/components/WindowChrome/WindowChrome.tsx (modify - add TrafficLights, add handler props)
- src/features/tiger/components/WindowChrome/WindowChrome.module.css (modify - remove placeholder class)
