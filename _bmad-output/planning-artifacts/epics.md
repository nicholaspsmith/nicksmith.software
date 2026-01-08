---
stepsCompleted: [1, 2, 3, 4]
workflowComplete: true
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
date: '2026-01-07'
author: 'Nick'
project_name: 'nicksmith.software'
---

# nicksmith.software - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for nicksmith.software, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**Capability Area 1: Desktop Environment**
| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR1 | Display Tiger desktop with authentic Aqua wallpaper at full viewport | Critical | MVP |
| FR2 | Render custom Tiger-era cursor replacing system cursor | Critical | MVP |
| FR3 | Display desktop icons in grid layout with snap-to-grid positioning | Critical | MVP |
| FR4 | Support icon double-click to open corresponding window | Critical | MVP |
| FR5 | Display menu bar with Apple menu and application-specific menus | High | MVP |
| FR6 | Update menu bar to reflect currently focused window's application | High | MVP |

**Capability Area 2: Window Management**
| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR7 | Enable window dragging via title bar with react-rnd | Critical | MVP |
| FR8 | Enable window resizing from all edges and corners | Critical | MVP |
| FR9 | Render window chrome with traffic light buttons (close, minimize, zoom) | Critical | MVP |
| FR10 | Implement close button to remove window from DOM | Critical | MVP |
| FR11 | Implement minimize button with fade animation (MVP) | High | MVP |
| FR12 | Implement zoom button with authentic Tiger behavior (fit-to-content) | Medium | MVP |
| FR13 | Manage z-index so clicked window becomes topmost | Critical | MVP |
| FR14 | Apply Aqua styling to all window chrome (glossy buttons, pinstripes) | High | MVP |
| FR15 | Constrain windows to remain within viewport bounds | Medium | MVP |
| FR16 | Implement genie effect minimize animation | High | Phase 2 |

**Capability Area 3: Portfolio Content**
| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR17 | Display About Me content in Tiger-styled window | Critical | MVP |
| FR18 | Display Projects content with project cards/grid | Critical | MVP |
| FR19 | Display Resume content (embedded PDF or styled HTML) | Critical | MVP |
| FR20 | Display Contact form with working submission | Critical | MVP |
| FR21 | Apply consistent Aqua styling to all content windows | High | MVP |
| FR22 | Ensure content is readable and scannable (supports 30-second path) | Critical | MVP |
| FR23 | Include sufficient technical depth (supports 10-minute path) | High | MVP |

**Capability Area 4: Navigation & Interaction**
| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR24 | Support ⌘W keyboard shortcut to close focused window | High | MVP |
| FR25 | Support ⌘M keyboard shortcut to minimize focused window | High | MVP |
| FR26 | Support Tab key navigation between interactive elements | High | MVP |
| FR27 | Provide Apple menu dropdown with About, Restart options | Medium | MVP |
| FR28 | Display Dock with application icons | High | Phase 2 |
| FR29 | Support window shade via double-click title bar | Medium | Phase 2 |

**Capability Area 5: Audio & Feedback**
| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR30 | Play startup chime on initial page load | High | MVP |
| FR31 | Play Sosumi sound on error conditions | Medium | Phase 2 |
| FR32 | Display Tiger-authentic error dialogs for invalid actions | Medium | Phase 2 |

**Capability Area 6: Accessibility & Fallbacks**
| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR33 | Provide visible focus indicators on all interactive elements | High | MVP |
| FR34 | Include ARIA labels on windows, buttons, and icons | High | MVP |
| FR35 | Respect prefers-reduced-motion media query | High | MVP |
| FR36 | Display "best on desktop" message for mobile visitors (< 768px) | High | MVP |

**Capability Area 7: Terminal (Phase 2)**
| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR37 | Display Terminal icon on desktop | High | Phase 2 |
| FR38 | Render xterm.js terminal emulator in Tiger-styled window | High | Phase 2 |
| FR39 | Support basic commands: help, ls, cat, clear | High | Phase 2 |
| FR40 | Include Easter egg commands (sl, games) | Medium | Phase 2 |
| FR41 | Display nick@tiger ~ $ prompt | High | Phase 2 |

**Capability Area 8: iOS Mobile (Phase 3)**
| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR42 | Display iOS 6 home screen for viewports < 768px | High | Phase 3 |
| FR43 | Render portfolio content as iOS apps (Notes, Photos, iBooks, Mail) | High | Phase 3 |
| FR44 | Implement "reboot" transition when crossing breakpoint | Medium | Phase 3 |
| FR45 | Support touch interactions for iOS experience | High | Phase 3 |

### NonFunctional Requirements

**Performance**
| ID | Requirement | Target | Measurement |
|----|-------------|--------|-------------|
| NFR1 | First Contentful Paint | < 1.5 seconds | Lighthouse |
| NFR2 | Largest Contentful Paint | < 2.5 seconds | Lighthouse |
| NFR3 | Time to Interactive | < 3.0 seconds | Lighthouse |
| NFR4 | Cumulative Layout Shift | < 0.1 | Lighthouse |
| NFR5 | Total Bundle Size | < 500KB gzipped | Build analysis |
| NFR6 | Animation Frame Rate | 60fps sustained | Chrome DevTools |
| NFR7 | Window Drag Latency | < 16ms (single frame) | DevTools |
| NFR8 | Lighthouse Performance Score | > 90 | Lighthouse |

**Browser Compatibility**
| ID | Requirement | Target |
|----|-------------|--------|
| NFR9 | Chrome support | Latest 2 versions - Full |
| NFR10 | Safari support | Latest 2 versions - Full |
| NFR11 | Firefox support | Latest 2 versions - Full |
| NFR12 | Edge support | Latest 2 versions - Full |
| NFR13 | Mobile Safari | iOS 14+ - Basic fallback |
| NFR14 | Chrome Mobile | Android 10+ - Basic fallback |

**Code Quality**
| ID | Requirement | Target |
|----|-------------|--------|
| NFR15 | TypeScript Strict Mode | Enabled |
| NFR16 | Console Errors | 0 in production |
| NFR17 | ESLint Violations | 0 |
| NFR18 | Build Warnings | 0 |

### Additional Requirements

**From Architecture Document:**
- **Starter Template:** `npm create vite@latest -- --template react-ts`
- **Technology Stack:** React 18 + TypeScript 5.x (strict) + Vite 6.x/7.x
- **State Management:** Zustand ^5.0.9 with domain stores (windowStore, soundStore, appStore)
- **Animation Library:** motion ^12.24 (rebranded from framer-motion)
- **Window Library:** react-rnd ^10.5.2 for drag/resize
- **CSS Architecture:** CSS Modules with `--aqua-*` custom properties namespace
- **Project Structure:** Feature-based (`features/tiger/`, `features/apps/`)
- **Sacred Values Registry:** TypeScript constants for Tiger-exact measurements
- **Window Lifecycle:** State machine (closed → opening → open → minimizing → minimized → restoring)
- **Export Style:** Named exports only (no default exports)
- **Test Location:** `__tests__/` folder within component directories

**From UX Design Document:**
- **Animation Tiers:** Tier A (ideal 60fps), Tier B (fallback), Tier C (reduced motion instant)
- **60fps Quality Gate:** No animation ships without 60fps validation on Chrome/Safari/Firefox
- **Window Constraints:** Min 200×100px, Max viewport - 50px margin
- **Traffic Lights:** 12px diameter, 8px spacing, 8px from left edge
- **Title Bar:** 22px height, gradient background
- **Menu Bar:** 22px height, fixed top
- **Desktop Icons:** 48×48px, grid cell 80×90px, top-right column-first layout
- **Window Cascade:** New windows offset 20px down and 20px right
- **Double-click Timing:** Generous for web context
- **Mobile Fallback:** "Best on Desktop" message with email, LinkedIn, Resume PDF links

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 2 | Tiger desktop with Aqua wallpaper |
| FR2 | Epic 2 | Custom Tiger-era cursor |
| FR3 | Epic 4 | Desktop icons in grid layout |
| FR4 | Epic 4 | Icon double-click to open window |
| FR5 | Epic 2 | Menu bar with Apple menu |
| FR6 | Epic 4 | Menu bar updates for focused window |
| FR7 | Epic 3 | Window dragging via title bar |
| FR8 | Epic 3 | Window resizing from edges/corners |
| FR9 | Epic 3 | Window chrome with traffic lights |
| FR10 | Epic 3 | Close button removes window |
| FR11 | Epic 3 | Minimize button with fade |
| FR12 | Epic 3 | Zoom button (fit-to-content) |
| FR13 | Epic 3 | Z-index focus management |
| FR14 | Epic 3 | Aqua styling on window chrome |
| FR15 | Epic 3 | Windows constrained to viewport |
| FR16 | Epic 7 | Genie effect minimize (Phase 2) |
| FR17 | Epic 5 | About Me content window |
| FR18 | Epic 5 | Projects content with cards |
| FR19 | Epic 5 | Resume content window |
| FR20 | Epic 5 | Contact form window |
| FR21 | Epic 5 | Consistent Aqua styling |
| FR22 | Epic 5 | Readable/scannable content |
| FR23 | Epic 5 | Technical depth for 10-min path |
| FR24 | Epic 6 | ⌘W keyboard shortcut |
| FR25 | Epic 6 | ⌘M keyboard shortcut |
| FR26 | Epic 6 | Tab key navigation |
| FR27 | Epic 6 | Apple menu dropdown |
| FR28 | Epic 7 | Dock with icons (Phase 2) |
| FR29 | Epic 7 | Window shade (Phase 2) |
| FR30 | Epic 6 | Startup chime on load |
| FR31 | Epic 7 | Sosumi error sound (Phase 2) |
| FR32 | Epic 7 | Tiger error dialogs (Phase 2) |
| FR33 | Epic 6 | Visible focus indicators |
| FR34 | Epic 6 | ARIA labels |
| FR35 | Epic 6 | Reduced motion support |
| FR36 | Epic 6 | Mobile fallback message |
| FR37 | Epic 7 | Terminal icon (Phase 2) |
| FR38 | Epic 7 | xterm.js Terminal (Phase 2) |
| FR39 | Epic 7 | Terminal commands (Phase 2) |
| FR40 | Epic 7 | Easter egg commands (Phase 2) |
| FR41 | Epic 7 | Terminal prompt (Phase 2) |
| FR42 | Epic 8 | iOS 6 home screen (Phase 3) |
| FR43 | Epic 8 | Portfolio as iOS apps (Phase 3) |
| FR44 | Epic 8 | Reboot transition (Phase 3) |
| FR45 | Epic 8 | Touch interactions (Phase 3) |

---

## Epic List

### Epic 1: Project Foundation & App Shell

Establish the development environment with all architecture decisions implemented - Vite scaffold, Zustand stores, CSS Modules, and project structure that enables all subsequent development.

**User Outcome:** Development foundation ready with type-safe stores, styling system, and feature-based structure per architecture document.

**FRs Covered:** Architecture requirements (enables all FRs)

**Key Deliverables:**
- Vite + React 18 + TypeScript scaffold
- Zustand stores (windowStore, soundStore, appStore)
- CSS Modules with `--aqua-*` custom properties
- Sacred Values Registry constants
- Feature-based project structure

---

### Epic 2: Tiger Desktop Environment

Create the authentic Mac OS X Tiger desktop that delivers the "wow" first impression - wallpaper, cursor, and menu bar that immediately signals this is something special.

**User Outcome:** Visitors see an authentic Tiger desktop with Aqua wallpaper, custom cursor, and menu bar - the memorable first impression that sets this portfolio apart.

**FRs Covered:** FR1, FR2, FR5

**Key Deliverables:**
- Desktop component with Aqua wallpaper
- Custom Tiger-era cursor
- Static menu bar with Apple logo and clock

---

### Epic 3: Window System

Build the core window management system - draggable, resizable windows with authentic Tiger chrome that respond at 60fps. This is the defining interaction that proves engineering craft.

**User Outcome:** Visitors can open, drag, resize, close, and minimize windows with smooth animations - windows feel like real Tiger windows.

**FRs Covered:** FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15

**Key Deliverables:**
- Window component with react-rnd integration
- WindowChrome with title bar
- TrafficLights (close, minimize, zoom)
- Z-index focus management
- Viewport constraints
- Window lifecycle state machine
- 60fps drag/resize performance

---

### Epic 4: Desktop Navigation

Add desktop icons and app launch capability - the primary navigation that enables Rachel's 30-second path to content.

**User Outcome:** Visitors can see labeled desktop icons and double-click to open corresponding windows. Menu bar updates to show focused app.

**FRs Covered:** FR3, FR4, FR6

**Key Deliverables:**
- DesktopIcon component with grid layout
- Double-click to open window
- Icon selection state
- Menu bar app name updates

---

### Epic 5: Portfolio Content

Create the portfolio content windows - Resume, Projects, About, and Contact with Tiger-styled presentation. Rachel can complete her journey.

**User Outcome:** Visitors can view all portfolio content in authentic Tiger-styled windows. Resume and Contact are immediately accessible for recruiters.

**FRs Covered:** FR17, FR18, FR19, FR20, FR21, FR22, FR23

**Key Deliverables:**
- About Me window with photo and bio
- Projects window with project cards
- Resume window (styled HTML)
- Contact window with info/form
- Consistent Aqua styling
- Readable, scannable content

---

### Epic 6: Interaction Polish & Accessibility

Add keyboard shortcuts, startup chime, accessibility basics, and mobile fallback - the polish that completes the MVP experience.

**User Outcome:** Power users can use ⌘W/⌘M shortcuts, visitors hear the iconic startup chime, keyboard users can navigate, and mobile visitors get useful fallback.

**FRs Covered:** FR24, FR25, FR26, FR27, FR30, FR33, FR34, FR35, FR36

**Key Deliverables:**
- ⌘W close, ⌘M minimize shortcuts
- Tab key navigation
- Apple menu dropdown
- Startup chime (after user gesture)
- Focus indicators
- ARIA labels
- Reduced motion support
- Mobile "best on desktop" fallback

---

### Epic 7: Terminal & Dock (Phase 2)

Add Terminal with xterm.js and Easter eggs, Dock with minimized windows, genie effect - the hidden depth that rewards Marcus's exploration.

**User Outcome:** Engineers discover Terminal with working commands and Easter eggs. Minimized windows appear in Dock with genie animation.

**FRs Covered:** FR16, FR28, FR29, FR31, FR32, FR37, FR38, FR39, FR40, FR41

**Key Deliverables:**
- Terminal window with xterm.js
- Basic commands (help, ls, cat, clear)
- Easter egg commands (sl, games)
- Dock component
- Genie effect minimize
- Window shade
- Sosumi sound and error dialogs

---

### Epic 8: iOS 6 Mobile Experience (Phase 3)

Replace mobile fallback with full iOS 6 recreation - skeuomorphic home screen with portfolio content as iOS apps.

**User Outcome:** Mobile visitors get an authentic iOS 6 experience with portfolio content presented as native iOS apps.

**FRs Covered:** FR42, FR43, FR44, FR45

**Key Deliverables:**
- iOS 6 home screen
- Portfolio as iOS apps (Notes, Photos, iBooks, Mail)
- Reboot transition between desktop/mobile
- Touch-optimized interactions

---

## Epic 1: Project Foundation & App Shell

Establish the development environment with all architecture decisions implemented.

### Story 1.1: Initialize Vite React TypeScript Project

As a **developer**,
I want **a properly scaffolded Vite + React + TypeScript project with all dependencies installed**,
So that **I have a working development environment that follows the architecture decisions**.

**Acceptance Criteria:**

**Given** the project directory is empty
**When** I run the Vite scaffold command and install dependencies
**Then** the project structure matches the architecture specification
**And** React 18, TypeScript 5.x (strict mode), Vite 6.x/7.x are installed
**And** zustand ^5.0.9, motion ^12.24, react-rnd ^10.5.2 are installed
**And** `npm run dev` starts the development server without errors
**And** `npm run build` completes without TypeScript errors or warnings
**And** path alias `@/` is configured for src directory imports

---

### Story 1.2: Create Zustand State Management Stores

As a **developer**,
I want **domain-specific Zustand stores for window, sound, and app state**,
So that **state management follows the architecture patterns and enables all window interactions**.

**Acceptance Criteria:**

**Given** the project is scaffolded
**When** I create the three domain stores
**Then** `windowStore.ts` exists with WindowState interface and actions (openWindow, closeWindow, focusWindow, minimizeWindow, restoreWindow, updatePosition, updateSize)
**And** `soundStore.ts` exists with audio context management and play action
**And** `appStore.ts` exists with mode ('tiger' | 'ios') and startupComplete state
**And** all stores use named exports (no default exports)
**And** all stores compile without TypeScript errors
**And** stores are located in `src/stores/` directory

---

### Story 1.3: Establish CSS Architecture

As a **developer**,
I want **CSS Modules configured with Aqua custom properties**,
So that **all components can use consistent Tiger-authentic styling**.

**Acceptance Criteria:**

**Given** the project is scaffolded
**When** I create the CSS architecture files
**Then** `src/styles/aqua.css` exists with all `--aqua-*` custom properties
**And** CSS variables include traffic light colors (#FF5F57, #FFBD2E, #28CA41)
**And** CSS variables include title bar height (22px), menu bar height (22px)
**And** CSS variables include window corner radius (5px), traffic light diameter (12px)
**And** `src/styles/reset.css` exists with CSS reset
**And** `src/styles/global.css` imports aqua.css and applies base styles
**And** CSS Modules work correctly (`.module.css` files compile)

---

### Story 1.4: Implement Sacred Values Registry

As a **developer**,
I want **TypeScript constants for all Tiger-exact measurements**,
So that **no magic numbers exist in components and sacred values cannot be accidentally changed**.

**Acceptance Criteria:**

**Given** the CSS architecture is established
**When** I create the Sacred Values Registry
**Then** `src/features/tiger/constants/sacred.ts` exists
**And** SACRED object contains trafficLightDiameter (12), titleBarHeight (22), windowCornerRadius (5), menuBarHeight (22), iconGridSize (75), dockIconSize (48)
**And** SACRED is exported as `const` with `as const` assertion
**And** values are readonly and cannot be modified
**And** named export is used (no default export)

---

### Story 1.5: Create Shared Animation Variants

As a **developer**,
I want **centralized motion animation variants for Aqua UI**,
So that **all components use consistent, 60fps-capable animations**.

**Acceptance Criteria:**

**Given** the project dependencies are installed
**When** I create the animation variants file
**Then** `src/animations/aqua.ts` exists with motion Variants
**And** windowVariants includes states: closed, opening, open, minimizing, minimized, restoring
**And** iconVariants includes states: idle, hover, active
**And** menuVariants includes states: closed, open
**And** all animations use only transform and opacity (GPU-accelerated)
**And** timing follows UX spec (window open/close 200-300ms)
**And** named exports are used for all variants

---

## Epic 2: Tiger Desktop Environment

Create the authentic Mac OS X Tiger desktop that delivers the "wow" first impression.

### Story 2.1: Create Desktop Component with Aqua Wallpaper

As a **visitor**,
I want **to see an authentic Tiger desktop with Aqua wallpaper filling the viewport**,
So that **I immediately recognize this as something special and memorable**.

**Acceptance Criteria:**

**Given** I navigate to the portfolio website
**When** the page loads
**Then** the viewport displays the Tiger Aqua blue wallpaper as background
**And** the wallpaper covers the full viewport with no white space
**And** the desktop component uses CSS Module for styling
**And** the component renders in less than 1 second (FCP target)
**And** FR1 is satisfied

---

### Story 2.2: Implement Custom Tiger Cursor

As a **visitor**,
I want **to see the authentic Tiger-era cursor instead of the default browser cursor**,
So that **the immersion in the Tiger experience is complete from the first mouse movement**.

**Acceptance Criteria:**

**Given** I am viewing the Tiger desktop
**When** I move my mouse anywhere on the page
**Then** the cursor displays as the Tiger-era arrow cursor
**And** cursor changes appropriately for interactive elements (pointer for clickable)
**And** cursor asset is optimized for fast loading
**And** cursor works on Chrome, Safari, and Firefox
**And** FR2 is satisfied

---

### Story 2.3: Create Static Menu Bar

As a **visitor**,
I want **to see the Tiger menu bar at the top of the screen**,
So that **the desktop feels authentic and complete**.

**Acceptance Criteria:**

**Given** I am viewing the Tiger desktop
**When** the page loads
**Then** a menu bar appears fixed at the top of the viewport
**And** menu bar height is exactly 22px (sacred value)
**And** Apple logo appears on the left side
**And** "Finder" text appears next to Apple logo (default app)
**And** clock displays current time on the right side
**And** menu bar has Tiger-authentic gradient background
**And** menu bar remains fixed during scroll (if any)
**And** FR5 is partially satisfied (static version)

---

## Epic 3: Window System

Build the core window management system with 60fps performance.

### Story 3.1: Create Window Component with React-Rnd

As a **visitor**,
I want **to see windows that can be dragged and resized**,
So that **I can interact with the desktop like a real operating system**.

**Acceptance Criteria:**

**Given** a window is open on the desktop
**When** I drag the window by its title bar
**Then** the window follows my cursor smoothly at 60fps
**And** window position updates in windowStore
**When** I drag a window corner or edge
**Then** the window resizes smoothly at 60fps
**And** window size updates in windowStore
**And** react-rnd library handles drag/resize interactions
**And** FR7, FR8 are satisfied

---

### Story 3.2: Implement Window Chrome with Title Bar

As a **visitor**,
I want **windows to have authentic Tiger title bars**,
So that **the windows look and feel like real Tiger windows**.

**Acceptance Criteria:**

**Given** a window is open
**When** I look at the window
**Then** title bar height is exactly 22px (sacred value)
**And** title bar has Tiger-authentic gradient (lighter to darker gray)
**And** window title is centered in the title bar
**And** title uses Lucida Grande or system font equivalent
**And** unfocused windows have grayed-out title bars
**And** FR14 is partially satisfied

---

### Story 3.3: Create Traffic Light Buttons

As a **visitor**,
I want **windows to have the iconic red/yellow/green traffic light buttons**,
So that **I can close, minimize, and zoom windows like in Tiger**.

**Acceptance Criteria:**

**Given** a window is open
**When** I look at the traffic lights
**Then** three circular buttons appear (red, yellow, green)
**And** button diameter is exactly 12px (sacred value)
**And** buttons are spaced 8px apart (center-to-center)
**And** buttons are positioned 8px from left edge of title bar
**And** colors match Tiger exactly (#FF5F57, #FFBD2E, #28CA41)
**When** I hover over traffic lights
**Then** symbols appear (×, −, +)
**When** I click a traffic light
**Then** it shows a pressed/darker state
**And** unfocused windows show gray traffic lights
**And** FR9 is satisfied

---

### Story 3.4: Implement Window Close Functionality

As a **visitor**,
I want **clicking the red traffic light to close the window**,
So that **I can dismiss windows I'm done with**.

**Acceptance Criteria:**

**Given** a window is open
**When** I click the red traffic light (close button)
**Then** the window plays a close animation (fade/scale)
**And** the window is removed from the DOM after animation
**And** windowStore.closeWindow is called
**And** if other windows exist, the next window receives focus
**And** FR10 is satisfied

---

### Story 3.5: Implement Window Minimize with Fade Animation

As a **visitor**,
I want **clicking the yellow traffic light to minimize the window**,
So that **I can temporarily hide windows without closing them**.

**Acceptance Criteria:**

**Given** a window is open
**When** I click the yellow traffic light (minimize button)
**Then** the window plays a fade animation (opacity 1 to 0, scale down)
**And** animation completes in 200-300ms
**And** window state changes to 'minimized' in windowStore
**And** window is hidden but not removed from DOM
**And** animation runs at 60fps
**And** FR11 is satisfied (MVP fade, genie deferred to Phase 2)

---

### Story 3.6: Implement Window Zoom Functionality

As a **visitor**,
I want **clicking the green traffic light to zoom the window**,
So that **I can resize the window to fit its content (Tiger behavior)**.

**Acceptance Criteria:**

**Given** a window is open
**When** I click the green traffic light (zoom button)
**Then** the window resizes to fit its content (not maximize)
**And** resize animation is smooth
**And** if already zoomed, returns to previous size
**And** FR12 is satisfied

---

### Story 3.7: Implement Z-Index Focus Management

As a **visitor**,
I want **clicking a window to bring it to the front**,
So that **I can easily access any window in a multi-window environment**.

**Acceptance Criteria:**

**Given** multiple windows are open
**When** I click anywhere on a background window
**Then** that window immediately comes to the front (highest z-index)
**And** windowStore.focusWindow is called
**And** the previously focused window moves behind
**And** focused window shows full-color title bar
**And** unfocused windows show grayed title bar
**And** z-index updates happen in less than 16ms
**And** FR13 is satisfied

---

### Story 3.8: Implement Window Viewport Constraints

As a **visitor**,
I want **windows to stay within the viewport bounds**,
So that **I cannot accidentally drag a window off-screen**.

**Acceptance Criteria:**

**Given** a window is being dragged
**When** I drag the window toward a viewport edge
**Then** the window stops at the viewport boundary
**And** at least 50px of the window remains visible
**And** constraint applies to all four edges
**Given** a window is being resized
**When** I resize toward minimum size
**Then** window cannot be smaller than 200×100px
**When** I resize toward maximum size
**Then** window cannot exceed viewport minus 50px margin
**And** FR15 is satisfied

---

### Story 3.9: Implement Window Open Animation

As a **visitor**,
I want **windows to animate smoothly when opening**,
So that **the experience feels polished and delightful**.

**Acceptance Criteria:**

**Given** I trigger a window to open
**When** the window appears
**Then** it plays an opening animation (scale from 0.8 to 1, opacity 0 to 1)
**And** animation duration is 200-300ms
**And** animation uses windowVariants from aqua.ts
**And** animation runs at 60fps
**And** window receives focus after animation completes

---

## Epic 4: Desktop Navigation

Add desktop icons and app launch capability.

### Story 4.1: Create Desktop Icon Component

As a **visitor**,
I want **to see desktop icons for Resume, Projects, About, and Contact**,
So that **I can easily navigate to portfolio content**.

**Acceptance Criteria:**

**Given** I am viewing the Tiger desktop
**When** the page loads
**Then** four desktop icons are visible: Resume, Projects, About Me, Contact
**And** each icon has an image (48×48px) and text label below
**And** icons are arranged in a grid (80×90px cells)
**And** icons are positioned top-right, column-first (Tiger-authentic)
**And** grid starts 20px from right edge, 40px from top
**And** icon labels are white with drop shadow (readable on wallpaper)
**And** FR3 is satisfied

---

### Story 4.2: Implement Icon Selection State

As a **visitor**,
I want **icons to show selection state when clicked**,
So that **I receive visual feedback that my click was registered**.

**Acceptance Criteria:**

**Given** I am viewing desktop icons
**When** I single-click an icon
**Then** the icon shows a selection state (blue rounded rectangle behind)
**And** previously selected icon is deselected
**When** I click on the desktop background
**Then** all icons are deselected
**And** selection state changes in less than 16ms

---

### Story 4.3: Implement Double-Click to Open Window

As a **visitor**,
I want **double-clicking an icon to open its corresponding window**,
So that **I can access portfolio content using the familiar desktop metaphor**.

**Acceptance Criteria:**

**Given** I am viewing a desktop icon
**When** I double-click the icon
**Then** the corresponding window opens with animation
**And** windowStore.openWindow is called with the correct app identifier
**And** double-click timing is generous for web context (400-500ms)
**And** icon shows brief "active" state during double-click
**And** FR4 is satisfied

---

### Story 4.4: Implement Menu Bar App Name Updates

As a **visitor**,
I want **the menu bar to show the name of the focused window's app**,
So that **I know which application is currently active**.

**Acceptance Criteria:**

**Given** a window is focused
**When** I look at the menu bar
**Then** the app name next to the Apple logo shows the focused window's app name
**And** when I focus a different window, the name updates immediately
**And** when no windows are focused, menu bar shows "Finder"
**And** FR6 is satisfied

---

## Epic 5: Portfolio Content

Create the portfolio content windows with Tiger-styled presentation.

### Story 5.1: Create About Me Window Content

As a **visitor**,
I want **to view About Me content in a Tiger-styled window**,
So that **I can learn about Nick in an engaging, memorable way**.

**Acceptance Criteria:**

**Given** I double-click the About Me icon
**When** the window opens
**Then** the window displays a photo and bio text
**And** content is styled with Aqua aesthetic (pinstripes optional)
**And** window has appropriate default size (500×400px)
**And** content is readable and scannable
**And** FR17 is satisfied

---

### Story 5.2: Create Projects Window Content

As a **visitor**,
I want **to view Projects in a Tiger-styled window with project cards**,
So that **I can explore Nick's work and technical experience**.

**Acceptance Criteria:**

**Given** I double-click the Projects icon
**When** the window opens
**Then** the window displays a grid of project cards
**And** each card shows project name, description, and technologies
**And** cards are styled with Aqua aesthetic
**And** window has appropriate default size (700×500px)
**And** content is scrollable if it exceeds window height
**And** sufficient technical depth is present (Marcus's 10-minute path)
**And** FR18, FR23 are satisfied

---

### Story 5.3: Create Resume Window Content

As a **visitor**,
I want **to view Resume content in a Tiger-styled window**,
So that **I can quickly evaluate Nick's qualifications (Rachel's 30-second path)**.

**Acceptance Criteria:**

**Given** I double-click the Resume icon
**When** the window opens
**Then** the window displays styled resume content (HTML, not PDF)
**And** resume includes experience, skills, education sections
**And** content is scannable in under 30 seconds (Rachel's path)
**And** window has appropriate default size (600×500px)
**And** content uses Tiger-era typography (Lucida Grande equivalent)
**And** FR19, FR22 are satisfied

---

### Story 5.4: Create Contact Window Content

As a **visitor**,
I want **to view Contact information in a Tiger-styled window**,
So that **I can easily reach out to Nick**.

**Acceptance Criteria:**

**Given** I double-click the Contact icon
**When** the window opens
**Then** the window displays contact information (email, LinkedIn, GitHub)
**And** contact info is immediately visible without scrolling
**And** links are clickable and open in new tabs
**And** window has appropriate default size (400×300px)
**And** content is styled with Aqua aesthetic
**And** FR20 is satisfied

---

### Story 5.5: Apply Consistent Aqua Styling to Content Windows

As a **visitor**,
I want **all content windows to have consistent Tiger-styled appearance**,
So that **the experience feels cohesive and authentic**.

**Acceptance Criteria:**

**Given** any content window is open
**When** I examine the window content area
**Then** background color is Tiger window gray (#E8E8E8)
**And** typography uses consistent font stack
**And** padding and spacing follow design tokens
**And** scrollbars (if visible) are styled appropriately
**And** FR21 is satisfied

---

## Epic 6: Interaction Polish & Accessibility

Add keyboard shortcuts, audio, and accessibility basics.

### Story 6.1: Implement Keyboard Shortcuts (⌘W, ⌘M)

As a **power user**,
I want **keyboard shortcuts to close and minimize windows**,
So that **I can navigate efficiently using Mac-native shortcuts**.

**Acceptance Criteria:**

**Given** a window is focused
**When** I press ⌘W (Cmd+W)
**Then** the focused window closes
**And** close animation plays
**When** I press ⌘M (Cmd+M)
**Then** the focused window minimizes
**And** minimize animation plays
**And** shortcuts only work when a window is focused
**And** browser default behavior is prevented for these shortcuts
**And** FR24, FR25 are satisfied

---

### Story 6.2: Implement Tab Key Navigation

As a **keyboard user**,
I want **to navigate between interactive elements using Tab**,
So that **I can use the portfolio without a mouse**.

**Acceptance Criteria:**

**Given** I am viewing the desktop
**When** I press Tab repeatedly
**Then** focus moves through interactive elements in logical order
**And** focus indicators are visible on focused elements
**And** Shift+Tab moves focus backwards
**And** FR26 is satisfied

---

### Story 6.3: Implement Apple Menu Dropdown

As a **visitor**,
I want **the Apple menu to open a dropdown with options**,
So that **the menu bar feels functional and authentic**.

**Acceptance Criteria:**

**Given** I am viewing the menu bar
**When** I click the Apple logo
**Then** a dropdown menu appears below it
**And** dropdown includes "About This Mac" and "Restart" options
**And** dropdown is styled with Tiger aesthetic (white bg, shadows)
**And** clicking outside closes the dropdown
**And** Escape key closes the dropdown
**And** FR27 is satisfied

---

### Story 6.4: Implement Startup Chime

As a **visitor**,
I want **to hear the Mac startup chime when the page loads**,
So that **the experience immediately evokes the authentic Mac feeling**.

**Acceptance Criteria:**

**Given** I navigate to the portfolio website
**When** the page loads and I perform my first interaction (click anywhere)
**Then** the Mac startup chime plays
**And** chime only plays once per session
**And** audio respects browser autoplay policies (plays after user gesture)
**And** soundStore manages audio playback
**And** FR30 is satisfied

---

### Story 6.5: Add Focus Indicators

As a **keyboard user**,
I want **visible focus indicators on all interactive elements**,
So that **I can see where my keyboard focus is**.

**Acceptance Criteria:**

**Given** I am navigating with keyboard
**When** an element receives focus
**Then** a visible focus ring appears (2px solid #3B99FC, 2px offset)
**And** focus indicators appear on: icons, traffic lights, menu items, buttons
**And** focus indicators are visible against all backgrounds
**And** FR33 is satisfied

---

### Story 6.6: Add ARIA Labels

As a **screen reader user**,
I want **ARIA labels on all interactive elements**,
So that **I can understand and navigate the interface**.

**Acceptance Criteria:**

**Given** I am using a screen reader
**When** I navigate the interface
**Then** windows have `role="dialog"` and `aria-labelledby` pointing to title
**And** traffic lights have `role="button"` and descriptive `aria-label`
**And** desktop icons have `role="button"` and `aria-label` with full name
**And** menu bar items have appropriate ARIA roles
**And** FR34 is satisfied

---

### Story 6.7: Implement Reduced Motion Support

As a **visitor with motion sensitivity**,
I want **animations to respect my prefers-reduced-motion setting**,
So that **I can use the portfolio without discomfort**.

**Acceptance Criteria:**

**Given** my system has `prefers-reduced-motion: reduce` enabled
**When** any animation would normally play
**Then** animations are instant (0ms duration) instead
**And** this applies to: window open/close, minimize, icon hover
**And** transitions are replaced with instant state changes
**And** FR35 is satisfied

---

### Story 6.8: Create Mobile Fallback Message

As a **mobile visitor**,
I want **to see a useful fallback when visiting on mobile**,
So that **I can still access key information without the full Tiger experience**.

**Acceptance Criteria:**

**Given** I visit the portfolio on a device with viewport < 1024px
**When** the page loads
**Then** I see a "Best on Desktop" message styled as a Tiger dialog
**And** message includes quick links: Email, LinkedIn, Resume PDF download
**And** links are functional and accessible
**And** message is centered and readable on mobile
**And** FR36 is satisfied

---

## Epic 7: Terminal & Dock (Phase 2)

Add Terminal with xterm.js and Dock for minimized windows.

### Story 7.1: Create Dock Component

As a **visitor**,
I want **minimized windows to appear in a Dock at the bottom of the screen**,
So that **I can restore minimized windows**.

**Acceptance Criteria:**

**Given** a window is minimized
**When** the minimize animation completes
**Then** the window appears as an icon in the Dock
**And** Dock appears at bottom center of screen
**And** Dock is styled with Tiger aesthetic
**And** clicking a Dock icon restores the window
**And** FR28 is satisfied

---

### Story 7.2: Implement Genie Effect Minimize

As a **visitor**,
I want **the minimize animation to use the iconic genie effect**,
So that **the experience matches the memorable Tiger animation**.

**Acceptance Criteria:**

**Given** a window is open
**When** I click minimize
**Then** the window animates with genie effect toward the Dock
**And** animation runs at 60fps
**And** animation duration is 300-400ms
**And** if performance target not met, fall back to fade animation
**And** FR16 is satisfied

---

### Story 7.3: Add Terminal Icon to Desktop

As a **visitor**,
I want **a Terminal icon on the desktop**,
So that **I can discover the Terminal feature**.

**Acceptance Criteria:**

**Given** I am viewing the desktop
**When** the page loads
**Then** a Terminal icon is visible among the desktop icons
**And** icon uses Tiger-era Terminal icon
**And** FR37 is satisfied

---

### Story 7.4: Implement Terminal Window with xterm.js

As a **engineer visitor**,
I want **a functional Terminal window with command line interface**,
So that **I can explore Easter eggs and demonstrate technical depth**.

**Acceptance Criteria:**

**Given** I double-click the Terminal icon
**When** the Terminal window opens
**Then** xterm.js terminal emulator is rendered inside
**And** terminal shows prompt: `nick@tiger ~ $`
**And** terminal has Tiger-era styling (white text on black)
**And** FR38, FR41 are satisfied

---

### Story 7.5: Implement Terminal Commands

As a **engineer visitor**,
I want **basic terminal commands to work**,
So that **I can interact with the terminal meaningfully**.

**Acceptance Criteria:**

**Given** I am in the Terminal window
**When** I type `help`
**Then** a list of available commands is displayed
**When** I type `ls`
**Then** a list of "files" is displayed
**When** I type `cat resume.txt`
**Then** resume content is displayed
**When** I type `clear`
**Then** the terminal screen is cleared
**And** FR39 is satisfied

---

### Story 7.6: Add Terminal Easter Eggs

As a **engineer visitor**,
I want **Easter egg commands in the Terminal**,
So that **I'm delighted and want to share the discovery**.

**Acceptance Criteria:**

**Given** I am in the Terminal window
**When** I type `sl` (common typo for ls)
**Then** a steam locomotive animation crosses the screen
**When** I type `games`
**Then** a list of available games is shown
**And** FR40 is satisfied

---

### Story 7.7: Implement Window Shade

As a **visitor**,
I want **double-clicking the title bar to collapse the window**,
So that **I can use the classic Tiger window shade feature**.

**Acceptance Criteria:**

**Given** a window is open
**When** I double-click the title bar (not traffic lights)
**Then** the window collapses to show only the title bar
**When** I double-click again
**Then** the window expands to full size
**And** animation is smooth
**And** FR29 is satisfied

---

### Story 7.8: Add Sosumi Sound and Error Dialogs

As a **visitor**,
I want **Tiger-authentic error feedback**,
So that **error states feel authentic to the Tiger experience**.

**Acceptance Criteria:**

**Given** an error condition occurs
**When** the error is triggered
**Then** the Sosumi sound plays
**And** a Tiger-style alert dialog appears
**And** dialog includes icon, title, message, and OK button
**And** FR31, FR32 are satisfied

---

## Epic 8: iOS 6 Mobile Experience (Phase 3)

Replace mobile fallback with full iOS 6 recreation.

### Story 8.1: Create iOS 6 Home Screen

As a **mobile visitor**,
I want **to see an iOS 6 home screen instead of a fallback message**,
So that **I get a full nostalgic experience on mobile too**.

**Acceptance Criteria:**

**Given** I visit the portfolio on a device with viewport < 768px
**When** the page loads
**Then** I see an iOS 6-style home screen with app icons
**And** home screen has iOS 6 wallpaper and styling
**And** status bar appears at top with time and battery
**And** FR42 is satisfied

---

### Story 8.2: Create iOS Portfolio Apps

As a **mobile visitor**,
I want **portfolio content presented as iOS 6 apps**,
So that **I can explore portfolio content in an iOS-native way**.

**Acceptance Criteria:**

**Given** I am on the iOS 6 home screen
**When** I tap an app icon
**Then** the corresponding app opens with iOS-style animation
**And** About content appears in Notes-style app
**And** Projects content appears in Photos-style app
**And** Resume content appears in iBooks-style app
**And** Contact content appears in Mail-style app
**And** FR43 is satisfied

---

### Story 8.3: Implement Reboot Transition

As a **visitor**,
I want **a "reboot" transition when switching between desktop and mobile**,
So that **the context switch feels intentional and polished**.

**Acceptance Criteria:**

**Given** I resize the browser across the 768px breakpoint
**When** the viewport changes from desktop to mobile (or vice versa)
**Then** a brief "reboot" animation plays
**And** the appropriate experience loads after the animation
**And** FR44 is satisfied

---

### Story 8.4: Implement Touch Interactions

As a **mobile visitor**,
I want **touch-optimized interactions for iOS experience**,
So that **the mobile experience feels native and responsive**.

**Acceptance Criteria:**

**Given** I am using the iOS 6 experience on a touch device
**When** I tap, swipe, or perform gestures
**Then** interactions respond immediately and feel native
**And** swipe to navigate between app pages works
**And** tap targets are appropriately sized for touch
**And** FR45 is satisfied
