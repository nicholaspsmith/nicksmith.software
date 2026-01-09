---
stepsCompleted: [1]
workflowComplete: false
inputDocuments:
  - '_bmad-output/analysis/brainstorming-session-2026-01-09.md'
  - '_bmad-output/planning-artifacts/epics.md'
date: '2026-01-09'
author: 'Nick'
project_name: 'nicksmith.software'
phase: 'UI Polish'
---

# nicksmith.software - UI Polish Epic Breakdown

## Overview

This document provides epic and story breakdown for the UI Polish phase, focusing on achieving authentic Mac OS X Tiger fidelity. These epics build upon the completed Epics 1-8 and address gaps identified in the brainstorming session of 2026-01-09.

## Key Behavioral Changes (Apply Across All Epics)

### TextEdit App Model
- About, Projects, Resume, Contact are **documents opened in TextEdit**
- Only ONE TextEdit icon appears in dock (even with multiple documents)
- Each minimized document shows as individual thumbnail (left of Trash)
- Menu bar app name shows "TextEdit" (capitalized app name, NOT file name)

### Removed Features
- ~~Keyboard shortcuts (⌘W, ⌘M, ⌘Q)~~ - Host OS conflicts
- ~~Loading screen~~ - Removing entirely

---

## Epic 9: Interaction Fundamentals

Implement core interactions that users expect from a desktop environment - context menus, full menu system, desktop icon manipulation, and cursor accuracy.

**User Outcome:** The desktop feels interactive and responsive. Right-clicking produces menus, all menu bar items work, and icons can be dragged and selected.

**Priority:** Tier 1 (Do First)

**Key Deliverables:**
- Right-click context menus with Tiger styling
- Full menu bar dropdown system
- Desktop icon dragging
- Selection rectangle for multi-select
- Accurate Tiger cursor

---

### Story 9.1: Implement Right-Click Context Menu

As a **visitor**,
I want **right-clicking on the desktop to show a Tiger-style context menu**,
So that **I can access desktop actions like a real operating system**.

**Acceptance Criteria:**

**Given** I am viewing the Tiger desktop
**When** I right-click (or Ctrl+click) on the desktop background
**Then** a context menu appears at the cursor position
**And** menu has Tiger pinstripe texture (subtle horizontal lines)
**And** menu has ~6px border radius and drop shadow
**And** menu items include: New Folder, Get Info, Change Desktop Background, Clean Up, Arrange By (submenu)
**And** clicking outside the menu closes it
**And** Escape key closes the menu

**Technical Notes:**
- Use CSS repeating-linear-gradient for pinstripe texture
- Menu should prevent default browser context menu
- Menu position should stay within viewport bounds

---

### Story 9.2: Implement Menu Bar Dropdowns for All Items

As a **visitor**,
I want **all menu bar items to open dropdown menus when clicked**,
So that **the menu bar feels fully functional**.

**Acceptance Criteria:**

**Given** I am viewing the menu bar
**When** I click on any menu item (File, Edit, View, Go, Window, Help)
**Then** a dropdown menu appears below that item
**And** the clicked menu item shows blue highlight background
**And** dropdown has Tiger pinstripe texture
**And** menu items are actionable or show keyboard shortcuts
**When** I move mouse to another menu item while a dropdown is open
**Then** the previous dropdown closes and new one opens
**And** clicking outside any menu closes all dropdowns

**Technical Notes:**
- Implement menu bar "tracking" mode (hover to switch menus when one is open)
- Menu content will be populated in Epic 13

---

### Story 9.3: Remove Menu Bar Hover Effects

As a **visitor**,
I want **menu bar items to have no hover background effect**,
So that **the menu bar matches authentic Tiger behavior**.

**Acceptance Criteria:**

**Given** I am viewing the menu bar
**When** I hover over menu items without clicking
**Then** no background color change occurs
**And** cursor remains as default Tiger arrow
**When** I click a menu item
**Then** blue selection background appears only on click

**Technical Notes:**
- Remove existing `.menuItem:hover` CSS rule
- Tiger menu bar only shows selection on click, not hover

---

### Story 9.4: Implement Menu Pinstripe Texture

As a **visitor**,
I want **all dropdown menus to have the subtle Tiger pinstripe texture**,
So that **menus look authentically Tiger-styled**.

**Acceptance Criteria:**

**Given** any dropdown menu is open
**When** I examine the menu background
**Then** subtle horizontal lines (pinstripes) are visible
**And** lines are ~1px apart, alternating white and slightly-darker-white
**And** texture is subtle, not overwhelming
**And** texture applies to: Apple menu, app menus, context menus, Spotlight dropdown

**Technical Notes:**
- CSS: `background: repeating-linear-gradient(0deg, #fff 0px, #fff 1px, #f8f8f8 1px, #f8f8f8 2px);`
- Test for visual subtlety - should be barely noticeable

---

### Story 9.5: Fix Cursor to Match Tiger Reference

As a **visitor**,
I want **the cursor to exactly match the Tiger reference images**,
So that **the cursor feels authentic**.

**Acceptance Criteria:**

**Given** I am viewing the desktop
**When** I move my mouse
**Then** the cursor matches the reference image at `/Reference/Tiger_Icons/Cursor/cursor-lg.png`
**And** cursor is black arrow with white outline and subtle drop shadow
**And** cursor hotspot is at tip of arrow (1,1 or similar)
**And** cursor appears correctly at all zoom levels

**Technical Notes:**
- Use the reference images from the Reference folder
- May need to create @2x version for retina displays
- Test hotspot positioning carefully

---

### Story 9.6: Implement Desktop Icon Dragging

As a **visitor**,
I want **to drag desktop icons to new positions**,
So that **I can arrange the desktop like a real operating system**.

**Acceptance Criteria:**

**Given** I am viewing desktop icons
**When** I click and drag an icon
**Then** the icon follows my cursor
**And** a semi-transparent "ghost" of the icon shows during drag
**When** I release the mouse
**Then** the icon snaps to the nearest grid position
**And** icon position persists (stored in state)

**Technical Notes:**
- Use HTML5 drag and drop or pointer events
- Grid snap: 80x90px cells
- Store positions in appStore

---

### Story 9.7: Implement Selection Rectangle (Marquee Select)

As a **visitor**,
I want **clicking and dragging on the desktop to draw a selection rectangle**,
So that **I can select multiple icons at once**.

**Acceptance Criteria:**

**Given** I am viewing the desktop (not clicking on an icon)
**When** I click and drag on empty desktop space
**Then** a semi-transparent blue selection rectangle appears
**And** rectangle follows my drag, showing selected area
**And** any icons within the rectangle become selected
**When** I release the mouse
**Then** the rectangle disappears
**And** all icons within the rectangle remain selected
**And** I can then drag all selected icons together

**Technical Notes:**
- Selection rectangle: semi-transparent blue (#3875D7 at ~30% opacity)
- Rectangle should have 1px solid blue border
- Use intersection detection for icon selection

---

## Epic 10: Dock & Window Polish

Refine dock behavior and window animations to match authentic Tiger interactions.

**User Outcome:** Minimized windows animate correctly to the dock, icons bounce when clicked, and the dock provides proper feedback.

**Priority:** Tier 2

**Key Deliverables:**
- Genie effect minimize animation
- Minimize animation targets dock position
- Dock icon bounce on click
- Hover labels above dock
- Running indicator triangles
- TextEdit app grouping

---

### Story 10.1: Implement Minimize to Dock Position

As a **visitor**,
I want **windows to minimize TO the actual dock thumbnail position**,
So that **the animation target matches where the minimized window appears**.

**Acceptance Criteria:**

**Given** a window is open
**When** I click the minimize button
**Then** the window animates toward the dock
**And** the animation end point is the exact position where the thumbnail will appear
**And** the thumbnail appears in the dock after animation completes

**Technical Notes:**
- Calculate dock thumbnail position before starting animation
- Animation needs x,y target coordinates from dock component

---

### Story 10.2: Implement Genie Effect Minimize Animation

As a **visitor**,
I want **the minimize animation to use the iconic Tiger genie effect**,
So that **the animation matches the memorable Tiger experience**.

**Acceptance Criteria:**

**Given** a window is open
**When** I click minimize
**Then** the window warps/stretches toward the dock (genie effect)
**And** the bottom of the window reaches the dock first
**And** animation duration is 300-400ms
**And** animation runs at 60fps
**And** animation target is the dock thumbnail position

**Technical Notes:**
- SVG filter distortion or canvas-based approach
- Fall back to scale+opacity if genie can't achieve 60fps
- Reference: CSS mesh distortion or canvas 2D

---

### Story 10.3: Change Running Indicator to Triangles

As a **visitor**,
I want **running app indicators in the dock to be small triangles**,
So that **the dock matches authentic Tiger styling**.

**Acceptance Criteria:**

**Given** an app is running (has open window)
**When** I look at the dock
**Then** a small upward-pointing triangle appears below the app icon
**And** triangle is subtle (dark gray or black, small)
**And** triangle replaces the current dot indicator

**Technical Notes:**
- CSS triangle using border trick or small SVG
- Approximately 4-6px wide, pointing up

---

### Story 10.4: Implement Dock Icon Hover Labels

As a **visitor**,
I want **hovering over a dock icon to show its name above the dock**,
So that **I know what each icon represents**.

**Acceptance Criteria:**

**Given** I am viewing the dock
**When** I hover over a dock icon
**Then** a white text label appears above the dock
**And** label shows the app/window name
**And** label has dark background pill (for readability)
**And** label appears with subtle fade-in
**When** I move mouse away
**Then** label fades out

**Technical Notes:**
- Position label above icon, centered
- Use CSS tooltip pattern or absolute positioned element
- Background: rounded pill with dark gray/black bg

---

### Story 10.5: Implement Dock Icon Bounce on Click

As a **visitor**,
I want **dock icons to bounce when clicked**,
So that **I get feedback that my click was registered**.

**Acceptance Criteria:**

**Given** I click a dock icon to launch an app
**When** the icon is clicked
**Then** the icon bounces up and down repeatedly
**And** bouncing continues until the window opens
**When** the window finishes opening
**Then** the bouncing stops

**Technical Notes:**
- Use CSS animation or motion library
- Bounce height: approximately 20-30px
- Bounce timing: ~0.3s per bounce cycle

---

### Story 10.6: Implement TextEdit App Grouping

As a **visitor**,
I want **About, Projects, Resume, and Contact to behave as TextEdit documents**,
So that **only one TextEdit icon appears in the dock**.

**Acceptance Criteria:**

**Given** I open About, Projects, Resume, or Contact
**When** I look at the dock
**Then** only ONE TextEdit icon appears (not four separate icons)
**And** TextEdit icon shows running indicator if any document is open
**When** I minimize any of these windows
**Then** each becomes its own thumbnail in the document area (left of Trash)
**And** clicking a thumbnail restores that specific document
**When** I look at the menu bar
**Then** it shows "TextEdit" as the app name (not the document name)

**Technical Notes:**
- Refactor window/dock relationship
- Documents share one dock icon, but have individual thumbnails when minimized
- Menu bar shows app name, window title bar shows document name

---

## Epic 11: Visual Polish

Refine visual styling to achieve pixel-accurate Tiger appearance.

**User Outcome:** Windows, dialogs, and buttons look authentically Tiger-styled with brushed metal textures and proper Aqua gel buttons.

**Priority:** Tier 3

**Key Deliverables:**
- Window brushed metal texture
- Alert dialog styling with capsule buttons
- Aqua gel button styling with pulse
- Spotlight button styling

---

### Story 11.1: Implement Window Brushed Metal Texture

As a **visitor**,
I want **windows to have the Tiger brushed metal texture**,
So that **windows look authentically Tiger-styled**.

**Acceptance Criteria:**

**Given** a window is open
**When** I examine the window chrome and background
**Then** subtle horizontal brushed metal lines are visible
**And** texture is similar to pinstripes but slightly different pattern
**And** texture appears on title bar and window background

**Technical Notes:**
- CSS: subtle repeating horizontal gradient
- Reference Tiger screenshots for exact appearance
- May need different texture for title bar vs content area

---

### Story 11.2: Style Alert Dialogs with Tiger Aesthetics

As a **visitor**,
I want **alert dialogs to have authentic Tiger styling**,
So that **error messages and confirmations feel period-accurate**.

**Acceptance Criteria:**

**Given** an alert dialog appears
**When** I examine the dialog
**Then** background has brushed metal texture with pinstripes
**And** border radius is ~6px (not 10px)
**And** dialog icon appears on left side
**And** title and message use Tiger typography

**Technical Notes:**
- Update AlertDialog.module.css
- Reference: `/Reference/Tiger_Reference_Images/Tiger Screenshots/10-4-Tiger-Empty-Trash.png`

---

### Story 11.3: Implement Aqua Capsule Button Styling

As a **visitor**,
I want **buttons to have the iconic Aqua gel/capsule appearance**,
So that **buttons look authentically Tiger-styled**.

**Acceptance Criteria:**

**Given** a button appears (in dialogs, forms, etc.)
**When** I examine the button
**Then** button has pill/capsule shape (fully rounded ends)
**And** button has complex gradient creating gel/3D effect
**And** button has specular highlight near top
**And** secondary buttons are gray, primary buttons are blue

**Technical Notes:**
- border-radius: 9999px (or height/2)
- Multi-stop gradient for gel effect
- Reference authentic Aqua button images

---

### Story 11.4: Implement Primary Button Pulse Animation

As a **visitor**,
I want **the primary/default button to pulse gently**,
So that **I know which button is the default action**.

**Acceptance Criteria:**

**Given** a dialog with primary button appears (e.g., OK button)
**When** I look at the primary button
**Then** it has a subtle pulsing glow animation
**And** pulse is gentle, not distracting
**And** pulse continues until button is clicked or dialog is dismissed

**Technical Notes:**
- CSS animation: box-shadow or opacity pulse
- Approximately 1.5-2 second cycle
- Subtle - should not be visually jarring

---

### Story 11.5: Style Spotlight Button

As a **visitor**,
I want **the Spotlight icon in the menu bar to be a blue circle with magnifying glass**,
So that **it matches authentic Tiger styling**.

**Acceptance Criteria:**

**Given** I am viewing the menu bar
**When** I look at the Spotlight icon
**Then** it appears as a blue circular button
**And** white magnifying glass icon is centered inside
**And** clicking it opens the Spotlight dropdown

**Technical Notes:**
- Reference Tiger screenshots for exact styling
- Blue background with white icon

---

## Epic 12: Finder & Navigation

Implement Finder windows for Trash, HD, and Finder icon navigation.

**User Outcome:** Clicking Trash, Finder, or Macintosh HD opens appropriate Finder-style windows.

**Priority:** Tier 4

**Key Deliverables:**
- Finder window component
- Trash folder view
- Macintosh HD folder view
- Finder default view

---

### Story 12.1: Create Finder Window Component

As a **visitor**,
I want **a Tiger-styled Finder window component**,
So that **folder navigation looks authentic**.

**Acceptance Criteria:**

**Given** I need to view folder contents
**When** a Finder window opens
**Then** window has Tiger Finder styling (toolbar, sidebar, content area)
**And** toolbar has navigation buttons (back, forward, view options)
**And** sidebar shows common locations
**And** content area shows folder contents

**Technical Notes:**
- This is a significant new component
- Reference: `/Reference/Tiger_Reference_Images/Tiger Screenshots/10-4-Tiger-Finder-Home.png`
- Content can be static/mock for portfolio purposes

---

### Story 12.2: Implement Trash Folder View

As a **visitor**,
I want **clicking the Trash icon to open a Finder window showing Trash contents**,
So that **Trash behaves like a real folder**.

**Acceptance Criteria:**

**Given** I click the Trash icon in the dock
**When** the window opens
**Then** Finder window appears titled "Trash"
**And** content shows "Trash is empty" or mock items
**And** window has Trash-specific context (empty trash option)

---

### Story 12.3: Implement Macintosh HD View

As a **visitor**,
I want **clicking Macintosh HD icon to open Finder window showing root directory**,
So that **the HD icon behaves like a real drive**.

**Acceptance Criteria:**

**Given** I double-click the Macintosh HD desktop icon
**When** the window opens
**Then** Finder window appears titled "Macintosh HD"
**And** content shows mock folder structure (Applications, Library, System, Users)

---

### Story 12.4: Implement Finder Icon Behavior

As a **visitor**,
I want **clicking the Finder dock icon to open a Finder window**,
So that **Finder behaves like a real application**.

**Acceptance Criteria:**

**Given** I click the Finder icon in the dock
**When** no Finder windows are open
**Then** a new Finder window opens to home directory
**When** Finder windows are already open
**Then** the most recent Finder window comes to focus

---

## Epic 13: Menu Content

Populate all menu dropdowns with appropriate content.

**User Outcome:** All menus contain relevant items, making the menu bar fully functional.

**Priority:** Tier 5

**Key Deliverables:**
- Apple menu content
- File, Edit, View, Go, Window, Help menu content
- Spotlight search dropdown
- Time/date dropdown

---

### Story 13.1: Populate Apple Menu

As a **visitor**,
I want **the Apple menu to contain standard Tiger items**,
So that **the menu feels complete and authentic**.

**Acceptance Criteria:**

**Given** I click the Apple logo
**When** the dropdown opens
**Then** menu contains: About This Mac, (divider), System Preferences, Dock (submenu), Location (submenu), Recent Items (submenu), (divider), Force Quit TextEdit, (divider), Sleep, Restart, Shut Down, (divider), Log Out

**Technical Notes:**
- Some items can show Tiger-style "not available" behavior
- Reference: `/Reference/Tiger_Reference_Images/Tiger Screenshots/10-4-Tiger-Apple-Menu.png`

---

### Story 13.2: Populate Application Menus (File, Edit, View, Go, Window, Help)

As a **visitor**,
I want **application menus to contain appropriate items**,
So that **the menu bar feels complete**.

**Acceptance Criteria:**

**Given** I click any application menu
**When** the dropdown opens
**Then** menu contains relevant items for that menu category
**And** keyboard shortcuts are shown where applicable
**And** items that can't function show disabled state

**Technical Notes:**
- Content varies by focused app (TextEdit vs Finder)
- User to provide specific menu items as needed

---

### Story 13.3: Implement Spotlight Search Dropdown

As a **visitor**,
I want **clicking Spotlight to open a search dropdown**,
So that **Spotlight appears functional**.

**Acceptance Criteria:**

**Given** I click the Spotlight icon
**When** the dropdown opens
**Then** a search input field appears at top
**And** dropdown is styled with Tiger aesthetics
**And** typing in search shows "No results" or mock results
**And** pressing Escape closes the dropdown

---

### Story 13.4: Implement Time/Date Dropdown

As a **visitor**,
I want **clicking the time to show a dropdown with date information**,
So that **the time display is interactive**.

**Acceptance Criteria:**

**Given** I click the time in the menu bar
**When** the dropdown opens
**Then** current date is displayed
**And** dropdown may show mini calendar (optional)
**And** "Open Date & Time Preferences" option appears

---

## Implementation Order Summary

| Priority | Epic | Focus |
|----------|------|-------|
| **1st** | Epic 9 | Interaction Fundamentals |
| **2nd** | Epic 10 | Dock & Window Polish |
| **3rd** | Epic 11 | Visual Polish |
| **4th** | Epic 12 | Finder & Navigation |
| **5th** | Epic 13 | Menu Content |

## Dependencies

- Epic 10 depends on Epic 9 (menu system for TextEdit grouping)
- Epic 12 requires new Finder component (significant effort)
- Epic 13 requires Epic 9 (menu dropdown infrastructure)

---

## Reference Materials

- **Tiger Screenshots:** `/Reference/Tiger_Reference_Images/Tiger Screenshots/`
- **Official Icons:** `/Reference/Tiger_Icons/Official Icon Files/`
- **Cursor References:** `/Reference/Tiger_Icons/Cursor/`
- **Tiger VM:** Available for live comparison
