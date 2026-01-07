# Mac OS X Tiger Portfolio Site - Project Context

## Project Owner
Nick Smith - Senior Software Engineer with 12+ years experience in full-stack JavaScript, React, TypeScript, and Node.js. Currently job searching.

## Project Overview
Build a custom React-based portfolio website that emulates the Mac OS X Tiger (10.4) "Aqua" desktop environment. Users interact with desktop icons that open windows containing portfolio content.

## Domain
**nicksmith.software** (to be registered on Namecheap)

## Key Decision: Build Custom Implementation

**Decision: Build custom implementation** for:
- Full control over behavior and visual accuracy
- No dependency on unmaintained libraries
- Portfolio piece demonstrating React + CSS skills
- The Aqua UI's gradients, shadows, and effects are great for showcasing CSS expertise
- Interview talking point about attention to detail

## Technical Requirements

### Core Stack
- React 18+ with TypeScript
- State management: Zustand or React Context
- Window dragging/resizing: `react-rnd` or `react-draggable`
- Styling: CSS variables for Platinum theme

### Components to Build

| Component | Priority | Complexity |
|-----------|----------|------------|
| Desktop (icon grid, wallpaper) | High | Easy |
| Window (drag, resize, z-index) | High | Medium |
| Window chrome (title bar, close/minimize/zoom) | High | Easy |
| Menu bar | Medium | Easy-Medium |
| Desktop icons | High | Easy |
| Virtual file system | Low | Medium |

### Desktop "Apps" (Windows)

1. **About Nick.txt** - SimpleText-style window with bio/intro
2. **Projects** - Finder-style window listing projects (could link to GitHub, live demos)
3. **Resume.pdf** - PDF viewer or styled document window
4. **Contact** - Email form in a window
5. **GitHub** - External link (or alias icon)

## Architecture Sketch

```
src/
├── components/
│   ├── Desktop/
│   │   ├── Desktop.tsx          # Main container, wallpaper, icon grid
│   │   ├── DesktopIcon.tsx      # Clickable icon with label
│   │   └── MenuBar.tsx          # Top menu bar
│   ├── Window/
│   │   ├── Window.tsx           # Draggable/resizable window wrapper
│   │   ├── WindowChrome.tsx     # Title bar, control buttons
│   │   └── WindowContent.tsx    # Scrollable content area
│   └── Apps/
│       ├── AboutMe.tsx
│       ├── Projects.tsx
│       ├── Resume.tsx
│       └── Contact.tsx
├── store/
│   └── windowStore.ts           # Zustand store for window state
├── data/
│   └── projects.json            # Project data
├── styles/
│   ├── platinum.css             # Mac OS 8 theme variables
│   └── fonts/                   # Chicago font, etc.
├── hooks/
│   └── useWindowManager.ts      # Window focus, z-index management
└── App.tsx
```

## Window State Shape

```typescript
interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  component: React.ComponentType;
}

interface DesktopStore {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: Position) => void;
  updateWindowSize: (id: string, size: Size) => void;
}
```

## Styling Notes

### Mac OS X Tiger (Aqua) Characteristics
- **Window Chrome**: Brushed metal or unified gray with subtle horizontal lines
- **Traffic Light Controls**: Red (close), Yellow (minimize), Green (zoom) circular buttons with subtle gradients
- **Title Bar**: Gradient from light to slightly darker gray, with centered title text
- **Buttons**: Glossy Aqua-style with blue gradient for default/primary actions
- **Fonts**: Lucida Grande (system), available as web font alternatives
- **Shadows**: Soft drop shadows on windows and menus
- **Dock**: Reflective 3D dock at bottom (optional stretch goal)
- **Desktop**: Classic "Aurora" blue/purple gradient or solid color
- **Scrollbars**: Aqua blue with rounded ends
- **Icons**: Photorealistic, shadowed icons (32x32, 48x48, 128x128)

### Key CSS Variables to Define
```css
:root {
  /* Window Chrome */
  --aqua-window-bg: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%);
  --aqua-window-border: #888888;
  --aqua-title-bar: linear-gradient(180deg, #e8e8e8 0%, #c8c8c8 100%);

  /* Traffic Light Controls */
  --aqua-close: linear-gradient(180deg, #ff6059 0%, #e33e32 100%);
  --aqua-minimize: linear-gradient(180deg, #ffbd2e 0%, #e5a00d 100%);
  --aqua-zoom: linear-gradient(180deg, #28c940 0%, #1aab29 100%);

  /* Aqua Blue Buttons */
  --aqua-button: linear-gradient(180deg, #6cb3fa 0%, #087cff 50%, #005bce 100%);
  --aqua-button-hover: linear-gradient(180deg, #7cc3ff 0%, #198cff 50%, #006bde 100%);

  /* General */
  --aqua-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  --aqua-highlight: rgba(255, 255, 255, 0.5);
  --font-system: 'Lucida Grande', 'Helvetica Neue', sans-serif;

  /* Desktop */
  --aurora-gradient: linear-gradient(180deg, #3a6ea5 0%, #6b3fa0 50%, #1a1a2e 100%);
}
```

### Brushed Metal Effect (CSS)
```css
.brushed-metal {
  background:
    repeating-linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 0px,
      rgba(0,0,0,0.03) 1px,
      rgba(255,255,255,0.03) 2px
    ),
    linear-gradient(180deg, #d4d4d4 0%, #a8a8a8 100%);
}
```

## Estimated Timeline
- Minimal viable: 2-3 days
- Polished: 1 week
- Feature-rich (animations, sounds): 2 weeks

## Resources
- Mac OS X Tiger UI reference: https://guidebookgallery.org/screenshots/macosx104
- Aqua UI Guidelines Archive: https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AppleHIGuidelines/
- `react-rnd` for window interactions: https://github.com/bokuweb/react-rnd
- Tiger icons/wallpapers: https://512pixels.net/projects/default-mac-wallpapers-in-5k/

## Notes
- Keep it simple initially - can add menu bar functionality, sounds, etc. later
- Focus on window management first as it's the core interaction
- Projects data can be hardcoded JSON initially, fetch from GitHub API later
- Consider adding keyboard shortcuts (Cmd+W to close, etc.) as polish
- Tiger-specific polish opportunities:
  - Genie effect for minimize (CSS animation)
  - Window zoom animation
  - Dock magnification on hover
  - Spotlight search bar in menu bar
  - Dashboard-style widgets
