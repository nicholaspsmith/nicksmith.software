---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: ['_bmad-output/analysis/brainstorming-session-2026-01-07.md']
workflowType: 'research'
lastStep: 1
research_type: 'technical'
research_topic: 'Mac OS X Tiger & iOS 6 Implementation Details'
research_goals: 'Verify authentic UI behaviors, find embeddable web implementations, gather visual/audio references, identify era-specific details'
user_name: 'Nick'
date: '2026-01-07'
web_research_enabled: true
source_verification: true
---

# Research Report: Technical

**Date:** 2026-01-07
**Author:** Nick
**Research Type:** Technical

---

## Research Overview

Technical research for implementing a high-fidelity Mac OS X Tiger (10.4) desktop environment in the browser, with adaptive iOS 6 mobile experience. This research will verify authentic behaviors, find existing implementations, and gather reference materials.

---

<!-- Content will be appended sequentially through research workflow steps -->

## Technical Research Scope Confirmation

**Research Topic:** Mac OS X Tiger & iOS 6 Implementation Details
**Research Goals:** Verify authentic UI behaviors, find embeddable web implementations, gather visual/audio references, identify era-specific details

**Technical Research Scope:**

- Architecture Analysis - Tiger window management, Aqua UI patterns, iOS 6 app architecture
- Implementation Approaches - CSS techniques for Aqua styling, animation implementations
- Technology Stack - xterm.js, MBHaxe, Flappy Bird clones, audio APIs
- Integration Patterns - Embedding external content, terminal handling, state management
- Performance Considerations - 60fps animations, GPU acceleration, responsive transitions

**Research Methodology:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights

**Scope Confirmed:** 2026-01-07

---

## Technology Stack Analysis

### Terminal Emulator Integration

**xterm.js** is the industry-standard terminal emulator for web applications. Multiple React integration options are available:

| Library | Status | Notes |
|---------|--------|-------|
| **[@pablo-lion/xterm-react](https://github.com/PabloLION/xterm-react)** | Active | Uses latest @xterm/xterm, fixes resize issues, Node 20 LTS support |
| **[react-xtermjs (Qovery)](https://github.com/Qovery/react-xtermjs)** | Active (Sep 2025) | Simple XTerm component + useXTerm hook for flexibility |
| **[xterm-for-react](https://github.com/robert-harbison/xterm-for-react)** | Legacy | Last updated 5 years ago - not recommended |

**Recommendation:** Use `@pablo-lion/xterm-react` or `react-xtermjs` for active maintenance and modern xterm.js features.

_Sources: [xterm.js Official](https://xtermjs.org/), [GitHub - xterm.js](https://github.com/xtermjs/xterm.js)_

---

### Embeddable Games

#### Marble Blast Gold

Two excellent web implementations exist:

**[MBHaxe](https://github.com/RandomityGuy/MBHaxe)** (Primary Recommendation)
- Haxe port with **99% identical physics** to original
- Runs on Windows, Mac, **Web**, and Android
- Touch controls supported (mobile playable)
- Cross-platform multiplayer available
- Branches: `mbg` for Gold, `master` for Platinum, `mbu-port` for Ultra

**[Vanilagy's Marble Blast Web](https://github.com/Vanilagy/MarbleBlast)** (Alternative)
- Pure TypeScript implementation with custom physics engine
- ~4000 levels including 220 original MBG/MBP/MBU levels
- Hosted version: [marbleblast.vaniverse.io](https://marbleblast.vaniverse.io/)

_Sources: [MBHaxe GitHub](https://github.com/RandomityGuy/MBHaxe), [Marble Blast Forums](https://marbleblast.com/index.php/forum/general-mb-discussion/10724-i-made-a-complete-web-port-of-marble-blast-gold)_

#### Flappy Bird Clones

Multiple open-source HTML5 Canvas implementations available:

| Repository | Description | Notes |
|------------|-------------|-------|
| **[nebez/floppybird](https://github.com/nebez/floppybird)** | Popular clone | Uses divs (easier to style) |
| **[ljfio/Tiny-Flap](https://github.com/ljfio/Tiny-Flap)** | Self-contained | Single JS file, MIT license |
| **[varunpant/CrappyBird](https://github.com/varunpant/CrappyBird)** | Canvas 2D | Performance-focused |
| **[locotoki/flappy-bird-clone](https://github.com/locotoki/flappy-bird-clone)** | Modern clone | MIT licensed |

**GitHub Topics:** 263+ flappy-bird-clone repos, 52 in JavaScript

_Sources: [GitHub Flappy Bird Topic](https://github.com/topics/flappy-bird-clone)_

#### Chess

For authentic Tiger Chess.app replication:

- **[chess.js](https://github.com/jhlywa/chess.js)** - Move generation, validation, game state (logic only)
- **[chessboard.js](https://github.com/oakmac/chessboardjs)** - Visual board component
- **[Stockfish.js](https://github.com/nmrugg/stockfish.js)** - Full chess engine compiled to JavaScript

**Combined approach:** chess.js + chessboard.js provides logic + visuals with minimal overhead.

---

### Animation & Effects

#### Genie Effect (Window Minimize)

The Mac OS X genie minimize animation is complex. Key implementation approaches:

1. **SVG Morphing + GSAP** - [CodePen Example](https://codepen.io/pasaribu/pen/obpLeJ)
   - Uses TimelineMax with SVG path morphing
   - Inspired by Mac OS X minimize interaction

2. **BCGenieEffect Technique** - [Harshil's Blog](https://harshil.net/blog/recreating-the-mac-genie-effect/)
   - Image slicing with CATransform3D-style transforms
   - "Almost like liquid flowing through a funnel"
   - Split window snapshot into strips, transform each with perspective

3. **Canvas 2D Implementation**
   - Capture window as image
   - Apply mesh distortion during animation
   - More performant than DOM-based approaches

**macOS also has:** `genie`, `scale`, and hidden `suck` effect options.

_Sources: [Harshil's Blog](https://harshil.net/blog/recreating-the-mac-genie-effect/), [macOS Defaults](https://macos-defaults.com/dock/mineffect.html)_

#### CSS Aqua UI Techniques

Key CSS properties for replicating Tiger's Aqua interface:

```css
/* Glossy Aqua Button */
.aqua-button {
  background: linear-gradient(to bottom,
    #7dc5ee 0%, #4ca1e4 50%,
    #1872c9 51%, #3fa0e4 100%);
  border-radius: 12px;
  border: 1px solid #1a5a8a;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.5),
    0 2px 3px rgba(0,0,0,0.3);
}

/* Pinstripe Background */
.pinstripe {
  background: repeating-linear-gradient(
    0deg, #fff, #fff 1px, #e8e8e8 1px, #e8e8e8 2px
  );
}
```

**Key Properties:** `linear-gradient`, `box-shadow` (inset), `border-radius`, `rgba()` transparency

---

### Audio Resources

#### Mac Startup Chime

Multiple sources for authentic Tiger-era startup chime:

| Source | Format | Notes |
|--------|--------|-------|
| **[Internet Archive](https://archive.org/details/AppleMacBootUpSound)** | Various | Free download, multiple versions |
| **[Sample Focus](https://samplefocus.com/samples/macos-sound-fx-startup-chime)** | WAV | Royalty-free |
| **[MacTracker App](https://mactracker.ca/)** | AIFF | Extract from Resources/Chimes folder |
| **[Soundboard.com](https://www.soundboard.com/sb/Computer2)** | MP3 | Multiple Mac sounds |

**Note:** Startup chime is hardcoded in boot ROM on real Macs - these are extracted copies.

#### Sosumi Alert Sound

[Sosumi](https://en.wikipedia.org/wiki/Sosumi) - the iconic Mac alert sound (xylophone sample):

- **Name origin:** "So sue me" - response to Apple Corps lawsuit
- **Created:** 1991 by Jim Reekes for System 7
- **Location:** `/System/Library/Sounds/Sosumi.aiff`
- **Downloads:** [MyInstants](https://www.myinstants.com/en/instant/macos-sosumi-52416/), [Internet Archive](https://archive.org/details/macos8_error_sounds)

_Sources: [Wikipedia - Sosumi](https://en.wikipedia.org/wiki/Sosumi), [Apple Wiki](https://apple.fandom.com/wiki/Sosumi)_

#### Web Audio API Implementation

```javascript
// Create audio context (after user interaction)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

async function playSound(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}
```

**Tips:** Pre-load sounds, create AudioContext after user gesture (browser policy), reuse context.

---

### Window Management

**[react-rnd](https://github.com/bokuweb/react-rnd)** - Draggable + Resizable React component

```jsx
import { Rnd } from 'react-rnd';

<Rnd
  default={{ x: 0, y: 0, width: 320, height: 200 }}
  minWidth={100}
  minHeight={100}
  bounds="parent"
>
  Window content
</Rnd>
```

**Features:** Drag, resize from edges/corners, bounds constraints, grid snapping, customizable handles

_Source: [npm - react-rnd](https://www.npmjs.com/package/react-rnd)_

---

### iOS 6 Skeuomorphic Design Elements

iOS 6 (2012) used heavy skeuomorphism - digital interfaces mimicking real materials:

| App | Texture/Material |
|-----|------------------|
| Notification Center | Linen fabric background |
| Calendar/Contacts | Stitched leather |
| Game Center | Green felt (casino table) |
| Newsstand | Wooden bookshelf |
| Notes | Yellow legal pad with torn edges |
| iBooks | Wood shelves, paper page curl |

**Design Lead Change:** Scott Forstall → Jony Ive (2012) resulted in iOS 7's flat design.

---

### Mac OS X Tiger System Preferences

Tiger (10.4) System Preferences panes organized by category:

**Personal:** Appearance, Dashboard & Exposé, Desktop & Screen Saver, Dock, International, Security, Spotlight

**Hardware:** Bluetooth, CDs & DVDs, Displays, Energy Saver, Keyboard & Mouse, Print & Fax, Sound

**Internet & Network:** .Mac, Network, QuickTime, Sharing

**System:** Accounts, Classic, Date & Time, Software Update, Speech, Startup Disk, Universal Access

---

### Tiger Keyboard Shortcuts (Core Set)

| Shortcut | Action |
|----------|--------|
| ⌘+Q | Quit Application |
| ⌘+W | Close Window |
| ⌘+H | Hide Application |
| ⌘+M | Minimize Window |
| ⌘+Tab | Switch Applications |
| ⌘+Space | Spotlight Search |
| ⌘+Shift+3 | Full Screenshot |
| ⌘+Shift+4 | Selection Screenshot |
| ⌘+Option+Esc | Force Quit |
| ⌘+Delete | Move to Trash |

---

### Technology Adoption Summary

| Component | Recommended Solution | Confidence |
|-----------|---------------------|------------|
| Terminal | xterm.js + react-xtermjs | High |
| Window Management | react-rnd | High |
| Marble Blast | MBHaxe (mbg branch) | High |
| Flappy Bird | nebez/floppybird or Tiny-Flap | High |
| Chess | chess.js + chessboard.js | High |
| Genie Effect | SVG morphing + GSAP | Medium |
| Audio | Web Audio API + pre-loaded buffers | High |
| Aqua Styling | CSS gradients, box-shadow, border-radius | High |

---

## Integration Patterns Analysis

### Embedding External Games via iframe

For embedding MBHaxe (Marble Blast) and Flappy Bird clones, iframe sandboxing is essential:

**Security Best Practices** ([LogRocket Blog](https://blog.logrocket.com/best-practices-react-iframes/)):

```jsx
<iframe
  src="https://marbleblast.vaniverse.io/"
  sandbox="allow-scripts allow-same-origin"
  title="Marble Blast Gold"
  width="800"
  height="600"
/>
```

**Sandbox Attribute Values:**
- `allow-scripts` - Enable JavaScript execution
- `allow-same-origin` - Needed for postMessage communication
- `allow-pointer-lock` - For game mouse capture

**Warning:** Never use both `allow-scripts` and `allow-same-origin` with same-origin content - it can remove sandbox protections.

**React iframe Component:**
```jsx
// react-iframe package or custom component
import Iframe from 'react-iframe';

<Iframe
  url="game-url"
  sandbox={["allow-scripts", "allow-pointer-lock"]}
  className="game-embed"
/>
```

**Parent-Child Communication** ([Medium - Secure Sandbox](https://medium.com/@muyiwamighty/building-a-secure-code-sandbox-what-i-learned-about-iframe-isolation-and-postmessage-a6e1c45966df)):
- Use `postMessage` API for communication
- Parent cannot directly access iframe DOM (security)
- Handle game state (pause/resume) via message passing

_Sources: [react-iframe npm](https://www.npmjs.com/package/react-iframe), [MDN iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)_

---

### Zustand State Management for Windows

[Zustand](https://github.com/pmndrs/zustand) is ideal for managing Tiger's window state - compact, fast, no provider needed.

**Window Manager Store Pattern:**

```typescript
import { create } from 'zustand';

interface WindowState {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  app: string;
}

interface WindowStore {
  windows: WindowState[];
  activeWindowId: string | null;
  maxZIndex: number;

  // Actions
  openWindow: (app: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
}

const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  maxZIndex: 0,

  focusWindow: (id) => set((state) => ({
    activeWindowId: id,
    maxZIndex: state.maxZIndex + 1,
    windows: state.windows.map(w =>
      w.id === id ? { ...w, zIndex: state.maxZIndex + 1 } : w
    )
  })),

  // ... other actions
}));
```

**Key Zustand Benefits** ([TkDodo's Blog](https://tkdodo.eu/blog/working-with-zustand/)):
- No Redux boilerplate (no action creators, dispatchers, reducers)
- Works based on simplified Flux principles
- Uses hooks natively
- Handles React concurrency correctly
- Avoids zombie child problem

**Best Practice:** Separate actions from state in store object for performance.

_Sources: [Zustand GitHub](https://github.com/pmndrs/zustand), [Zustand Docs](https://zustand.docs.pmnd.rs/)_

---

### Responsive Breakpoint Detection (Tiger ↔ iOS Transition)

For detecting viewport changes and triggering the "reboot" transition:

**Option 1: react-responsive** ([npm](https://www.npmjs.com/package/react-responsive))
```jsx
import { useMediaQuery } from 'react-responsive';

const TigerOrIOS = () => {
  const isDesktop = useMediaQuery({ minWidth: 768 }); // Tailwind md breakpoint

  return isDesktop ? <TigerDesktop /> : <IOSMobile />;
};
```

**Option 2: MUI useMediaQuery** ([Material UI](https://mui.com/material-ui/react-use-media-query/))
- Only 1.1 kB gzipped
- Uses `window.matchMedia` (performant)
- SSR support

**Option 3: Custom Hook with use-breakpoint** ([GitHub](https://github.com/iiroj/use-breakpoint))
```jsx
import useBreakpoint from 'use-breakpoint';

const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024
};

const { breakpoint } = useBreakpoint(BREAKPOINTS);
```

**Tailwind Default Breakpoints:**
| Breakpoint | Min-Width |
|------------|-----------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

**Recommendation:** Use `md` (768px) as Tiger ↔ iOS transition point.

_Sources: [usehooks-ts](https://usehooks-ts.com/react-hook/use-media-query), [react-responsive npm](https://www.npmjs.com/package/react-responsive)_

---

### xterm.js Custom Command Handler

For the Tiger Terminal with Easter eggs, implement a custom shell emulator:

**Basic Command Handler Pattern:**

```typescript
import { Terminal } from 'xterm';

interface Command {
  description: string;
  execute: (args: string[], terminal: Terminal) => void;
}

const commands: Record<string, Command> = {
  help: {
    description: 'Show available commands',
    execute: (args, term) => {
      term.writeln('Available commands:');
      Object.entries(commands).forEach(([name, cmd]) => {
        term.writeln(`  ${name.padEnd(15)} - ${cmd.description}`);
      });
    }
  },
  clear: {
    description: 'Clear terminal',
    execute: (_, term) => term.clear()
  },
  whoami: {
    description: 'Display current user',
    execute: (_, term) => term.writeln('nick')
  },
  // Easter eggs
  snake: {
    description: 'Play Snake game',
    execute: (_, term) => startSnakeGame(term)
  },
  eliza: {
    description: 'Talk to the psychotherapist',
    execute: (_, term) => startElizaSession(term)
  }
};

// Input handler
let inputBuffer = '';

terminal.onData((data) => {
  if (data === '\r') { // Enter pressed
    terminal.writeln('');
    processCommand(inputBuffer.trim());
    inputBuffer = '';
    showPrompt();
  } else if (data === '\x7F') { // Backspace
    if (inputBuffer.length > 0) {
      inputBuffer = inputBuffer.slice(0, -1);
      terminal.write('\b \b');
    }
  } else {
    inputBuffer += data;
    terminal.write(data);
  }
});

const showPrompt = () => terminal.write('nick@tiger:~$ ');
```

**Terminal Prompt Style:** `nick@tiger:~$` (authentic Tiger look)

---

### Audio Manager Integration

Sound manager pattern for startup chime, Sosumi, and other effects:

**Singleton Sound Manager:**

```typescript
class TigerSoundManager {
  private static instance: TigerSoundManager;
  private audioContext: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private initialized = false;

  static getInstance(): TigerSoundManager {
    if (!TigerSoundManager.instance) {
      TigerSoundManager.instance = new TigerSoundManager();
    }
    return TigerSoundManager.instance;
  }

  // Must be called after user interaction (browser policy)
  async initialize() {
    if (this.initialized) return;

    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    // Preload all sounds
    await Promise.all([
      this.preload('startup', '/sounds/startup-chime.mp3'),
      this.preload('sosumi', '/sounds/sosumi.mp3'),
      this.preload('click', '/sounds/click.mp3'),
    ]);

    this.initialized = true;
  }

  private async preload(name: string, url: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext!.decodeAudioData(buffer);
    this.buffers.set(name, audioBuffer);
  }

  play(name: string) {
    const buffer = this.buffers.get(name);
    if (!buffer || !this.audioContext) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(0);
  }
}

// React hook
const useTigerSounds = () => {
  const soundManager = TigerSoundManager.getInstance();

  const initSounds = useCallback(async () => {
    await soundManager.initialize();
  }, []);

  return { initSounds, play: soundManager.play.bind(soundManager) };
};
```

**Key Requirements:**
- Initialize AudioContext after user gesture (click/tap)
- Preload all sounds during startup sequence
- Use singleton to avoid multiple AudioContext instances

---

### Reboot Transition Animation

For the Tiger ↔ iOS breakpoint transition with fade-to-black effect:

**Framer Motion Approach** ([DEV Community](https://dev.to/joserfelix/page-transitions-in-react-1c8g)):

```jsx
import { AnimatePresence, motion } from 'framer-motion';

const RebootTransition = ({ mode, children }) => {
  const [transitioning, setTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    // Trigger on mode change
    setShowContent(false);
    setTransitioning(true);

    // Play appropriate sound
    if (mode === 'ios') {
      soundManager.play('sosumi');
    } else {
      soundManager.play('startup');
    }

    // Fade in new content after delay
    setTimeout(() => {
      setShowContent(true);
      setTransitioning(false);
    }, 2000);
  }, [mode]);

  return (
    <>
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {mode === 'ios' ? (
              <AppleLogo color="silver" /> // iOS startup
            ) : (
              <TigerStartupScreen /> // Progress bar
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {showContent && children}
    </>
  );
};
```

**Transition Sequence:**
1. **Desktop → Mobile (< 768px):**
   - Play Sosumi sound
   - Fade to black
   - Show silver Apple logo (iOS style)
   - Fade in iOS 6 home screen

2. **Mobile → Desktop (≥ 768px):**
   - Fade to black
   - Show grey Apple logo + progress bar (Tiger style)
   - Play startup chime
   - Fade in Tiger desktop

_Sources: [Framer Motion](https://www.framer.com/motion/), [React Transition Group](https://reactcommunity.org/react-transition-group/css-transition/)_

---

### Integration Summary Table

| Integration | Pattern | Libraries |
|-------------|---------|-----------|
| Game Embedding | Sandboxed iframe + postMessage | react-iframe |
| Window State | Zustand store with actions | zustand |
| Breakpoint Detection | useMediaQuery hook | react-responsive / MUI |
| Terminal Commands | Event-based command parser | xterm.js |
| Audio Playback | Singleton AudioContext manager | Web Audio API |
| Transitions | AnimatePresence with overlays | framer-motion |

---

## Architectural Patterns and Design

### Project Folder Structure

For a Tiger desktop environment, a **feature-based architecture** is recommended ([Robin Wieruch 2025](https://www.robinwieruch.de/react-folder-structure/)):

```
src/
├── assets/
│   ├── sounds/           # startup-chime.mp3, sosumi.mp3
│   ├── icons/            # Tiger app icons, iOS app icons
│   ├── wallpapers/       # Tiger default wallpapers
│   └── cursors/          # Custom Tiger cursor
│
├── components/
│   ├── ui/               # Shared UI primitives
│   │   ├── AquaButton/
│   │   ├── TrafficLights/
│   │   └── ScrollBar/
│   └── layout/
│       ├── Desktop/
│       └── MenuBar/
│
├── features/
│   ├── tiger/            # Desktop environment
│   │   ├── components/
│   │   │   ├── Window/
│   │   │   ├── WindowChrome/
│   │   │   ├── Dock/
│   │   │   ├── DesktopIcon/
│   │   │   └── Finder/
│   │   ├── hooks/
│   │   │   └── useWindowManager.ts
│   │   └── stores/
│   │       └── windowStore.ts
│   │
│   ├── ios/              # iOS 6 mobile
│   │   ├── components/
│   │   │   ├── HomeScreen/
│   │   │   ├── AppIcon/
│   │   │   ├── StatusBar/
│   │   │   └── apps/
│   │   └── stores/
│   │       └── iosStore.ts
│   │
│   └── apps/             # Shared app content
│       ├── AboutMe/
│       ├── Projects/
│       ├── Resume/
│       ├── Contact/
│       ├── Terminal/
│       ├── SystemPrefs/
│       └── games/
│           ├── MarbleBlast/
│           └── FlappyBird/
│
├── hooks/
│   ├── useMediaQuery.ts
│   ├── useSounds.ts
│   └── useKeyboardShortcuts.ts
│
├── stores/
│   ├── appStore.ts       # Global app state
│   └── soundStore.ts     # Audio manager
│
├── styles/
│   ├── tokens/           # CSS custom properties
│   │   ├── aqua.css      # Tiger Aqua theme
│   │   └── ios6.css      # iOS 6 skeuomorphic
│   └── globals.css
│
├── types/
│   └── index.ts
│
└── utils/
    ├── terminal/
    │   ├── commands.ts
    │   └── eliza.ts
    └── animations/
        └── genie.ts
```

**Key Principles** ([GeeksforGeeks](https://www.geeksforgeeks.org/reactjs/react-architecture-pattern-and-best-practices/)):
- Feature colocation: Keep related files together
- Max 2-3 levels of nesting
- Shared components in `/components/ui/`
- Feature-specific components in `/features/{feature}/components/`

_Sources: [DEV Community](https://dev.to/pramod_boda/recommended-folder-structure-for-react-2025-48mc), [Profy.dev](https://profy.dev/article/react-folder-structure)_

---

### Window Manager Architecture

Based on browser desktop environment patterns ([DEV - Desktop Environment](https://dev.to/dustinbrett/how-i-made-a-desktop-environment-in-the-browser-part-1-window-manager-197k)):

**Context-Based Window Management** ([DEV - Window Manager](https://dev.to/jbdemonte/create-a-window-manager-with-react-3mak)):

```typescript
// Window descriptor interface
interface WindowDescriptor {
  id: string;
  zIndex: number;
  app: string;
  payload?: unknown;
  options: {
    title: string;
    icon: string;
    minWidth: number;
    minHeight: number;
    resizable: boolean;
  };
  state: {
    x: number;
    y: number;
    width: number;
    height: number;
    isMinimized: boolean;
    isMaximized: boolean;
  };
}

// Window Manager Context
interface WindowManagerContext {
  windows: WindowDescriptor[];
  activeWindowId: string | null;
  openWindow: (app: string, payload?: unknown) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updateWindowState: (id: string, state: Partial<WindowDescriptor['state']>) => void;
}
```

**Component Hierarchy:**

```
<Desktop>
  <MenuBar activeApp={activeWindow?.app} />
  <DesktopIcons />
  <WindowManager>
    {windows.map(window => (
      <Window key={window.id} descriptor={window}>
        <WindowChrome>
          <TrafficLights />
          <TitleBar />
        </WindowChrome>
        <WindowContent>
          <AppComponent app={window.app} />
        </WindowContent>
      </Window>
    ))}
  </WindowManager>
  <Dock minimizedWindows={minimizedWindows} />
</Desktop>
```

_Sources: [react-window-manager](https://github.com/brand-identity-brand/react-window-manager), [react-mosaic](https://github.com/nomcopter/react-mosaic)_

---

### Compound Component Pattern

For Window and iOS App components, use compound components for flexibility:

```tsx
// Compound Window Component
<Window>
  <Window.Chrome>
    <Window.TrafficLights onClose={...} onMinimize={...} onZoom={...} />
    <Window.Title>About Me</Window.Title>
  </Window.Chrome>
  <Window.Content>
    <AboutMeApp />
  </Window.Content>
  <Window.ResizeHandle />
</Window>

// Compound iOS App Component
<IOSApp>
  <IOSApp.StatusBar />
  <IOSApp.NavigationBar title="Notes" />
  <IOSApp.Content>
    <NotesContent />
  </IOSApp.Content>
  <IOSApp.TabBar />
</IOSApp>
```

**Benefits:**
- Clean, declarative API
- Shared state via React Context internally
- Flexible composition for different app types
- Separation of chrome from content

---

### CSS Design Tokens for Theming

Use CSS custom properties for Aqua and iOS 6 themes ([react-design-tokens](https://github.com/mimshins/react-design-tokens)):

**Aqua Theme Tokens (`aqua.css`):**

```css
:root {
  /* Colors */
  --aqua-blue-primary: #4ca1e4;
  --aqua-blue-dark: #1872c9;
  --aqua-gray-100: #f5f5f5;
  --aqua-gray-200: #e8e8e8;
  --aqua-gray-border: #888888;

  /* Traffic Lights */
  --aqua-close: #ff5f57;
  --aqua-minimize: #ffbd2e;
  --aqua-zoom: #28c940;

  /* Typography */
  --aqua-font-family: 'Lucida Grande', 'Lucida Sans Unicode', sans-serif;
  --aqua-font-size-sm: 11px;
  --aqua-font-size-md: 13px;

  /* Spacing */
  --aqua-window-padding: 1px;
  --aqua-titlebar-height: 22px;

  /* Effects */
  --aqua-shadow-window: 0 10px 30px rgba(0, 0, 0, 0.3);
  --aqua-border-radius: 5px;

  /* Gradients */
  --aqua-button-gradient: linear-gradient(
    to bottom,
    #7dc5ee 0%, #4ca1e4 50%,
    #1872c9 51%, #3fa0e4 100%
  );
  --aqua-titlebar-active: linear-gradient(
    to bottom,
    #e8e8e8 0%, #d0d0d0 100%
  );
  --aqua-titlebar-inactive: linear-gradient(
    to bottom,
    #f5f5f5 0%, #e8e8e8 100%
  );
}
```

**iOS 6 Theme Tokens (`ios6.css`):**

```css
:root {
  /* iOS 6 Colors */
  --ios6-blue: #007aff;
  --ios6-gray: #8e8e93;
  --ios6-linen: #c5baa7;
  --ios6-felt: #2e7d32;

  /* Textures (as background-image references) */
  --ios6-texture-linen: url('/textures/linen.png');
  --ios6-texture-felt: url('/textures/felt.png');
  --ios6-texture-leather: url('/textures/leather.png');

  /* Typography */
  --ios6-font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;

  /* Status Bar */
  --ios6-statusbar-height: 20px;

  /* App Icon */
  --ios6-icon-size: 60px;
  --ios6-icon-radius: 12px;
  --ios6-icon-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

**Runtime Theme Switching:**
CSS custom properties enable runtime theming without recompilation - perfect for the Tiger ↔ iOS transition.

_Sources: [UXPin](https://www.uxpin.com/studio/blog/managing-global-styles-in-react-with-design-tokens/), [Backlight.dev](https://backlight.dev/docs/design-tokens-using-css-custom-properties)_

---

### Animation Performance Architecture

For 60fps animations ([Callstack](https://www.callstack.com/blog/60fps-animations-in-react-native), [Motion.dev](https://motion.dev/docs/performance)):

**GPU-Accelerated Properties Only:**
```css
/* GOOD - GPU accelerated, compositor-only */
.animate-good {
  transform: translateX(100px);
  opacity: 0.5;
  filter: blur(5px);
}

/* BAD - triggers layout/paint */
.animate-bad {
  left: 100px;      /* Layout */
  width: 200px;     /* Layout */
  background: red;  /* Paint */
}
```

**Force Hardware Acceleration:**
```css
.window {
  transform: translateZ(0); /* Creates compositor layer */
  will-change: transform;   /* Hint to browser */
}
```

**React Performance Patterns:**

```tsx
// Use refs for mutable animation state (avoids re-renders)
const positionRef = useRef({ x: 0, y: 0 });

// Wrap with React.memo to prevent unnecessary re-renders
const Window = React.memo(({ id, children }) => {
  // ...
});

// Use requestAnimationFrame for batched updates
const animateGenie = useCallback(() => {
  requestAnimationFrame((timestamp) => {
    // Batch all DOM reads
    const rect = element.getBoundingClientRect();

    // Then batch all DOM writes
    element.style.transform = `...`;
  });
}, []);
```

**Key Rules:**
- Animate only `transform`, `opacity`, `filter`, `clipPath`
- Keep animations 200-500ms
- Use `will-change` sparingly (memory cost)
- Test on low-end devices
- Profile with Chrome DevTools Performance tab

_Sources: [Steve Kinney](https://stevekinney.com/courses/react-performance/animation-performance), [Angular Minds](https://www.angularminds.com/blog/must-know-tips-and-tricks-to-optimize-performance-in-react-animations)_

---

### State Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      App Root                            │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ AppStore    │  │ SoundStore  │  │ WindowStore │     │
│  │ (Zustand)   │  │ (Zustand)   │  │ (Zustand)   │     │
│  │             │  │             │  │             │     │
│  │ - mode      │  │ - buffers   │  │ - windows[] │     │
│  │ - theme     │  │ - context   │  │ - activeId  │     │
│  │ - user      │  │ - play()    │  │ - maxZ      │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├─────────────────────────────────────────────────────────┤
│                   useMediaQuery                          │
│            (768px breakpoint detection)                  │
├─────────────────────────────────────────────────────────┤
│     mode === 'tiger'        │      mode === 'ios'       │
│  ┌───────────────────┐      │   ┌───────────────────┐   │
│  │   TigerDesktop    │      │   │    IOSHomeScreen  │   │
│  │  ┌─────────────┐  │      │   │  ┌─────────────┐  │   │
│  │  │ WindowMgr   │  │      │   │  │ AppGrid     │  │   │
│  │  │ MenuBar     │  │      │   │  │ StatusBar   │  │   │
│  │  │ Dock        │  │      │   │  │ PageDots    │  │   │
│  │  └─────────────┘  │      │   │  └─────────────┘  │   │
│  └───────────────────┘      │   └───────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

### Architecture Summary Table

| Layer | Pattern | Technology |
|-------|---------|------------|
| Folder Structure | Feature-based | Colocation |
| Window Management | Context + Compound | React Context |
| State Management | Store per domain | Zustand |
| Theming | CSS Custom Properties | Design Tokens |
| Animation | GPU-only properties | transform, opacity |
| Component API | Compound Components | Shared context |

---

## Implementation Approaches and Technology Adoption

### Project Setup (Vite + React + TypeScript)

**Quick Start:**
```bash
npm create vite@latest nicksmith-portfolio -- --template react-ts
cd nicksmith-portfolio
npm install

# Core dependencies
npm install zustand react-rnd framer-motion

# Terminal emulator
npm install xterm @xterm/xterm @pablo-lion/xterm-react

# Responsive detection
npm install react-responsive

# Development
npm install -D tailwindcss postcss autoprefixer
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D eslint @typescript-eslint/eslint-plugin prettier
```

**Vite Configuration (`vite.config.ts`):**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@stores': path.resolve(__dirname, './src/stores'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-animation': ['framer-motion'],
          'vendor-terminal': ['xterm', '@xterm/xterm'],
        },
      },
    },
  },
});
```

**TypeScript Configuration (`tsconfig.json`):**
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@features/*": ["src/features/*"]
    }
  }
}
```

---

### Deployment Strategy

**Recommended: Netlify** ([Northflank Comparison](https://northflank.com/blog/vercel-vs-netlify-choosing-the-deployment-platform-in-2025))

For a static portfolio site, Netlify is ideal:
- Free tier covers portfolio needs
- Automatic HTTPS & custom domains
- Git-based continuous deployment
- Preview deployments for PRs
- Form handling (for Contact form)

**Deployment Steps:**
1. Connect GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Auto-deploy on push to `main`

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Alternative: Vercel** ([Vercel Deploy Guide](https://vercel.com/kb/guide/deploying-react-with-vercel))
- Zero-config React deployment
- Automatic HTTPS & CDN
- Better for Next.js if you migrate later

_Sources: [Codecademy Comparison](https://www.codecademy.com/article/vercel-vs-netlify-which-one-should-you-choose), [DEV Community](https://dev.to/alex_aslam/how-to-deploy-react-vue-and-angular-apps-on-vercel-netlify-github-pages-i3c)_

---

### Testing Strategy

**Vitest + React Testing Library** ([Robin Wieruch Guide](https://www.robinwieruch.de/vitest-react-testing-library/), [Vitest Docs](https://vitest.dev/guide/browser/component-testing)):

**Setup (`vitest.config.ts`):**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

**Test Setup (`src/test/setup.ts`):**
```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Audio API
vi.mock('../../stores/soundStore', () => ({
  useSoundStore: () => ({
    play: vi.fn(),
    initialize: vi.fn(),
  }),
}));
```

**Example Component Test:**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Window } from '@features/tiger/components/Window';

describe('Window', () => {
  it('focuses on click', async () => {
    const onFocus = vi.fn();
    render(<Window id="test" title="Test" onFocus={onFocus} />);

    await userEvent.click(screen.getByRole('dialog'));
    expect(onFocus).toHaveBeenCalledWith('test');
  });

  it('closes when traffic light clicked', async () => {
    const onClose = vi.fn();
    render(<Window id="test" title="Test" onClose={onClose} />);

    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
```

**Best Practices** ([Makers Den Guide](https://makersden.io/blog/guide-to-react-testing-library-vitest)):
- Focus on user behavior, not implementation
- Use `getByRole` over `getByTestId`
- Handle async with `findBy` and `waitFor`
- Clean up mocks with `vi.clearAllMocks()`

---

### Development Workflow

**Git Branching:**
```
main (production)
├── develop (integration)
│   ├── feature/window-system
│   ├── feature/terminal
│   ├── feature/ios-home
│   └── fix/genie-animation
```

**Pre-commit Hooks (with Husky + lint-staged):**
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.css": ["prettier --write"]
  }
}
```

**CI/CD (GitHub Actions):**
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

---

### Accessibility Considerations

For an authentic Tiger experience while remaining accessible:

**Keyboard Navigation:**
- ⌘+Tab switches windows (capture and handle)
- ⌘+W closes active window
- Tab moves between interactive elements
- Escape closes dialogs/menus

**ARIA Labels:**
```tsx
<div
  role="dialog"
  aria-labelledby={`window-title-${id}`}
  aria-describedby={`window-content-${id}`}
>
  <div id={`window-title-${id}`}>{title}</div>
  <div id={`window-content-${id}`}>{children}</div>
</div>
```

**Focus Management:**
- Trap focus within open windows
- Return focus when window closes
- Visible focus indicators on all interactive elements

**Reduced Motion:**
```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Skip genie effect if reduced motion preferred
const minimizeAnimation = prefersReducedMotion ? 'fade' : 'genie';
```

---

### Performance Optimization

**Bundle Splitting:**
- Core bundle: React, Zustand, routing
- Animation bundle: Framer Motion
- Terminal bundle: xterm.js (lazy loaded)
- Game bundles: Marble Blast, Flappy Bird (lazy loaded on open)

**Lazy Loading Apps:**
```typescript
const Terminal = lazy(() => import('@features/apps/Terminal'));
const MarbleBlast = lazy(() => import('@features/apps/games/MarbleBlast'));

// In window content
<Suspense fallback={<AppLoadingSpinner />}>
  {app === 'terminal' && <Terminal />}
  {app === 'marble-blast' && <MarbleBlast />}
</Suspense>
```

**Image Optimization:**
- Use WebP format for wallpapers/icons
- Provide fallback PNG for older browsers
- Lazy load wallpaper images
- Use CSS for simple graphics (gradients, traffic lights)

**Lighthouse Targets:**
| Metric | Target |
|--------|--------|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 90+ |

---

### Risk Assessment and Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Genie effect performance | Medium | Medium | Fall back to scale animation if <30fps |
| MBHaxe embed issues | Low | Low | Self-host or use Vanilagy alternative |
| xterm.js bundle size | Medium | Low | Lazy load, only include needed addons |
| iOS breakpoint flicker | Medium | Medium | Debounce media query listener |
| Audio autoplay blocked | High | Low | Initialize on first user interaction |
| Browser compatibility | Low | Medium | Test on Chrome, Firefox, Safari, Edge |

---

## Technical Research Recommendations

### Implementation Roadmap

**Phase 1: Foundation (MVP)**
1. Project setup (Vite + React + TS + Tailwind)
2. CSS Aqua tokens and base styling
3. Window component with react-rnd
4. Desktop with icons and basic menu bar
5. Portfolio content apps (About, Projects, Resume, Contact)

**Phase 2: Core Polish**
1. Genie minimize animation
2. Startup chime and Sosumi sounds
3. Keyboard shortcuts
4. Dock with minimized windows
5. Window focus management

**Phase 3: Interactive Depth**
1. Terminal with xterm.js
2. Terminal Easter eggs (snake, eliza)
3. Window shade (double-click title bar)
4. Desktop context menu

**Phase 4: iOS Mobile**
1. Breakpoint detection
2. iOS 6 home screen
3. iOS apps (Notes, Photos, iBooks, Mail)
4. Reboot transition animation

**Phase 5: Delight**
1. Marble Blast Gold embed
2. Flappy Bird Easter egg
3. System Preferences (subset)
4. Additional Easter eggs

### Technology Stack Summary

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Build Tool | Vite | 5.x |
| Styling | Tailwind CSS | 3.x |
| State | Zustand | 4.x |
| Window Drag | react-rnd | 10.x |
| Animation | Framer Motion | 11.x |
| Terminal | xterm.js | 5.x |
| Testing | Vitest + RTL | Latest |
| Deployment | Netlify | - |

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lighthouse Performance | 90+ | Chrome DevTools |
| Animation FPS | 60fps | DevTools Performance |
| Time to Interactive | <3s | Lighthouse |
| Bundle Size (initial) | <200KB | Build output |
| Recruiter Path | <30s to content | User testing |
| Engineer Path | 10+ min exploration | User testing |

---

## Research Conclusion

This technical research has produced a comprehensive implementation guide for the Mac OS X Tiger portfolio site, covering:

✅ **Technology Stack** - xterm.js, MBHaxe, react-rnd, Web Audio API, framer-motion
✅ **Integration Patterns** - iframe sandboxing, Zustand stores, breakpoint detection, command handlers
✅ **Architecture** - Feature-based folders, compound components, CSS design tokens, 60fps animations
✅ **Implementation** - Vite setup, Netlify deployment, Vitest testing, accessibility, performance

**Ready for PRD development with validated technical approach.**
