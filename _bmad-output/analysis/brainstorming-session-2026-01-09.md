---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ['_bmad-output/analysis/brainstorming-session-2026-01-07.md']
session_topic: 'Tiger UI Polish & Authenticity - Closing the Gap to True Fidelity'
session_goals: 'UI element accuracy, pixel-level authenticity, implement deferred features, create genuinely usable Tiger simulation'
selected_approach: 'ai-recommended'
techniques_used: ['morphological-analysis', 'five-whys', 'constraint-mapping', 'cross-pollination']
ideas_generated: 27
context_file: '_bmad-output/analysis/brainstorming-session-2026-01-07.md'
current_phase: complete
session_status: complete
output_document: '_bmad-output/planning-artifacts/epics-ui-polish.md'
---

# Brainstorming Session: Tiger UI Polish & Authenticity

**Facilitator:** Nick
**Date:** 2026-01-09

## Session Overview

**Topic:** Closing the gap between current implementation and authentic Mac OS X Tiger experience - heavy emphasis on UI element accuracy and visual fidelity.

**Goals:**
- Identify specific UI elements that need refinement
- Achieve pixel-level authenticity where possible
- Implement deferred features from original brainstorming session
- Create a genuinely usable Tiger simulation, not just a themed portfolio site

### Context: Original Session Reference

This session builds on brainstorming-session-2026-01-07.md which defined:
- 8 implementation epics (all completed to MVP level)
- 47+ ideas across Tiger desktop and iOS 6 mobile
- Key decisions around authenticity vs. compromise

### Current State Assessment

The implementation exists but falls short of the original vision in several areas:
- UI elements are "moving in the right direction but need a lot of work"
- Compromises were made during initial implementation
- Goal is to remove those compromises and achieve true fidelity

---

## Phase 1: Morphological Analysis - Gap Identification

### User-Identified Critical Gaps

#### DOCK BEHAVIOR
| Issue | Current | Authentic Tiger |
|-------|---------|-----------------|
| Magnification | Individual icon hover only | Fisheye magnification on nearby icons |
| Minimize target | Minimizes to bottom of screen | Should minimize TO the dock icon position |
| Icon click | No feedback | Icons BOUNCE when clicked until window opens |
| Hover label | None | White text label appears ABOVE dock on hover |
| Content | Has minimized window thumbnails | Should be ICONS ONLY |
| Running indicator | Black dot | Small TRIANGLE pointing up |

#### DESKTOP BEHAVIOR
| Issue | Current | Authentic Tiger |
|-------|---------|-----------------|
| Icon dragging | Not implemented | Should be able to drag icons anywhere |
| Selection rectangle | Not implemented | Click+drag on desktop draws selection box |
| Multi-select | Not implemented | Selection box selects multiple icons |
| Move multiple | Not implemented | Drag multiple selected icons together |
| Open multiple | Not implemented | Return key opens all selected icons |

#### MENU BAR / TOP BAR
| Issue | Current | Authentic Tiger |
|-------|---------|-----------------|
| Background | Frosted glass blur | OPAQUE white/gray gradient |
| Corners | 5px rounded top | NO rounded corners - edge to edge |
| All items | Only Apple opens dropdown | ALL items should open dropdowns |
| Hover effect | Has hover background | NO hover effect |
| Spotlight | Not correct | Blue circle with white magnifying glass |
| Spotlight click | Nothing | Opens dropdown with search bar |
| Time click | Nothing | Opens dropdown menu |
| Menu texture | Smooth | Horizontal PINSTRIPE lines |

#### CONTEXT MENUS
| Issue | Current | Authentic Tiger |
|-------|---------|-----------------|
| Right-click | Nothing happens | Tiger-style context menu appears |
| Menu texture | N/A | Horizontal pinstripe lines |

#### LOADING SCREEN
| Issue | Current | Authentic Tiger |
|-------|---------|-----------------|
| Background | Unknown | GRAY background |
| Logo | Unknown | Darker gray Apple icon centered |
| Spinner | Unknown | Rotating spinner beneath logo |

#### WINDOWS
| Issue | Current | Authentic Tiger |
|-------|---------|-----------------|
| Background | Smooth gradient | BRUSHED METAL horizontal texture |

#### CURSOR
| Issue | Current | Authentic Tiger |
|-------|---------|-----------------|
| Appearance | Still incorrect | Black arrow, white outline, drop shadow |

### Reference Image Analysis

From Tiger screenshots, confirmed visual specifications:

**Menu Bar:**
- Opaque white/light gray (NOT frosted glass)
- Full-width, no rounded corners
- Apple logo appears solid colored
- Spotlight is blue circle icon

**Menus:**
- White background with subtle horizontal pinstripes
- Blue selection highlight (#3875D7 approximate)
- Divider lines between sections
- ~6px border radius
- Subtle drop shadow

**Dock:**
- 3D trapezoidal shelf (wider top, narrower bottom)
- Glossy reflective floor surface
- Icons reflect on shelf
- Running indicators are small UP-POINTING TRIANGLES
- Thin vertical separator line

**Alert Dialogs:**
- Brushed metal gray gradient with pinstripes
- ~6px border radius (NOT 10px)
- CAPSULE/PILL shaped buttons
- Blue Aqua gel OK button with PULSING animation
- Gray Cancel button

**Buttons (Aqua):**
- Pill/capsule shape (fully rounded ends)
- Complex gel gradient with specular highlight
- Default button pulses blue

### Decisions Made

- **ABANDON keyboard shortcuts** (⌘W, ⌘M, ⌘Q) - host OS conflicts not worth workarounds
- **Focus on visual/interaction fidelity** over features

### Resources Available

- **Reference directory:** `/Reference/Tiger_Reference_Images/Tiger Screenshots/`
- **Official icons:** `/Reference/Tiger_Icons/Official Icon Files/`
- **Cursor references:** `/Reference/Tiger_Icons/Cursor/`
- **Tiger VM available** for live comparison and feedback

---

## Phase 2: Corrections & Revised Prioritization

### CORRECTIONS FROM USER (Critical!)

| My Assumption | ACTUAL Tiger Behavior |
|---------------|----------------------|
| Dock is 3D trapezoidal | Dock is a RECTANGLE |
| Menu bar should be opaque | Menu bar HAS frosted blur ✓ |
| Menu bar has no rounded corners | Menu bar HAS rounded corners ✓ |
| Dock icons have reflections | NO reflections in Tiger |
| Remove minimized thumbnails | KEEP thumbnails - that's correct Tiger behavior |

### NEW REQUIREMENTS IDENTIFIED

**TextEdit App Behavior:**
- About, Projects, Resume, Contact are documents opened in TextEdit
- Only ONE TextEdit icon in dock even with multiple documents open
- Each minimized document shows as individual thumbnail (left of Trash)
- Menu bar app name should show "TextEdit" (capitalized app name, NOT file name)

**Finder Windows:**
- Trash icon → opens Finder window to Trash folder
- Finder icon → opens Finder window
- Macintosh HD icon → opens Finder window to root

**Genie Effect:**
- Need to implement genie minimize animation
- Window minimizes TO the dock thumbnail position

### DROPPED ITEMS
- ~~Gray loading screen~~ - removing loading screen entirely
- ~~Gray Apple logo~~ - not needed
- ~~Spinner animation~~ - not needed

---

## Phase 3: Revised Priority Tiers

### TIER 1: Interaction Fundamentals (Do First)
*Core interactions that users expect*

| Item | Effort | Notes |
|------|--------|-------|
| **Right-click context menu** | Medium | Tiger-style with pinstripes |
| **All menu items open dropdowns** | High | Full menu system |
| **Remove hover effects from menu bar** | Low | CSS change |
| **Menu pinstripe texture** | Medium | Subtle horizontal lines |
| **Cursor fix** | Low | Use reference images |
| **Drag desktop icons** | Medium | Core interaction |
| **Selection rectangle on drag** | Medium | Multi-select support |

### TIER 2: Dock & Window Polish
*Animation and dock refinements*

| Item | Effort | Notes |
|------|--------|-------|
| **Minimize TO dock position** | High | Animation target |
| **Genie minimize effect** | High | Classic Tiger animation |
| **Running indicator triangles** | Low | Replace dots with triangles |
| **Hover label above dock** | Medium | White text on hover |
| **Bounce animation on click** | Medium | Until window opens |
| **Single TextEdit icon for documents** | Medium | App grouping logic |

### TIER 3: Visual Polish
*Styling refinements*

| Item | Effort | Notes |
|------|--------|-------|
| **Window brushed metal texture** | Medium | Horizontal lines |
| **Alert dialog styling** | Medium | Capsule buttons, pinstripes |
| **Aqua button styling** | Medium | Pill shape, gel, pulse |
| **Spotlight button styling** | Low | Blue circle with magnifying glass |

### TIER 4: Finder & Navigation
*Folder/navigation functionality*

| Item | Effort | Notes |
|------|--------|-------|
| **Finder window component** | High | New component needed |
| **Trash icon opens Finder** | Low | Once Finder exists |
| **Finder icon opens Finder** | Low | Once Finder exists |
| **Macintosh HD opens Finder** | Low | Once Finder exists |

### TIER 5: Menu Content
*Populate actual menu items*

| Item | Effort | Notes |
|------|--------|-------|
| **Apple menu content** | Medium | User to provide items |
| **File menu content** | Medium | Standard items |
| **Edit menu content** | Medium | Standard items |
| **View menu content** | Medium | Standard items |
| **Spotlight search dropdown** | Medium | With search input |
| **Time/date dropdown** | Low | Calendar/time display |

---

## Implementation Approach Decision Needed

**Decision:** BMAD Epic/Story format selected.

---

## Session Summary

### What We Accomplished

| Phase | Activity | Output |
|-------|----------|--------|
| **1. Gap Analysis** | Morphological Analysis | 27 items identified across 5 tiers |
| **2. Corrections** | User feedback integration | Critical corrections to assumptions |
| **3. Prioritization** | Tier organization | 5 tiers from interaction fundamentals to menu content |
| **4. Epic Creation** | BMAD documentation | `epics-ui-polish.md` with 5 epics, 21 stories |

### Key Corrections Made

1. **Dock is rectangular** (not 3D trapezoidal)
2. **Menu bar has frosted blur** (keep as-is)
3. **Menu bar has rounded corners** (keep as-is)
4. **No dock icon reflections** in Tiger
5. **Keep minimized thumbnails** (correct Tiger behavior)
6. **TextEdit app model** for documents

### Epic Structure Created

| Epic | Name | Stories | Priority |
|------|------|---------|----------|
| Epic 9 | Interaction Fundamentals | 7 | Tier 1 |
| Epic 10 | Dock & Window Polish | 6 | Tier 2 |
| Epic 11 | Visual Polish | 5 | Tier 3 |
| Epic 12 | Finder & Navigation | 4 | Tier 4 |
| Epic 13 | Menu Content | 4 | Tier 5 |

### Dropped Items
- Loading screen (removed entirely)
- Keyboard shortcuts (host OS conflicts)

### Next Steps
1. Begin implementation with Epic 9 (Interaction Fundamentals)
2. User to provide menu content details for Epic 13
3. Use Tiger VM for visual comparison during implementation

---

**Session Complete: 2026-01-09**
**Output Document:** `_bmad-output/planning-artifacts/epics-ui-polish.md`
