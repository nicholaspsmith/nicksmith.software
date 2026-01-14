# js-dos Integration Plan for DOOM

## Overview

The current doom-js implementation is an incomplete WAD renderer that lacks collision detection, AI, and gameplay mechanics. To provide a fully playable DOOM experience, we should integrate **js-dos** - a JavaScript DOSBox emulator that runs the actual DOOM executable.

## What is js-dos?

js-dos is the simplest API to run DOS/Win 9x programs in browser or Node.js. It's a frontend for DOSBox emulators that enables users to execute DOS applications within web browsers.

**Key Features:**
- Full DOSBox emulation (complete game functionality)
- No backend required - runs entirely client-side
- Mobile support
- Multiplayer functionality (optional)
- WebAssembly for performance

**Resources:**
- Official Website: https://v8.js-dos.com/
- GitHub: https://github.com/caiiiycuk/js-dos
- Documentation: https://js-dos.com/dos-api.html
- Game Studio (bundle creator): https://v8.js-dos.com/studio/

## Installation Options

### Option 1: CDN (Simplest)
```html
<link rel="stylesheet" href="https://v8.js-dos.com/latest/js-dos.css">
<script src="https://v8.js-dos.com/latest/js-dos.js"></script>
```

### Option 2: npm
```bash
npm install js-dos
```

## Basic Integration

```html
<div id="dos" style="width: 640px; height: 480px;"></div>

<script>
Dos(document.getElementById("dos"), {
  url: "/path/to/doom.jsdos"
});
</script>
```

## Creating a js-dos Bundle

A `.jsdos` bundle is a zip archive containing:
1. The DOS executable (DOOM.EXE)
2. Game data files (DOOM.WAD)
3. DOSBox configuration (`.jsdos/dosbox.conf`)

### Methods to Create Bundle:

1. **Game Studio (Recommended)**: https://v8.js-dos.com/studio/
   - Upload DOOM files
   - Configure DOSBox settings
   - Download generated .jsdos bundle

2. **Manual Creation**:
   - Create a zip file with:
     ```
     DOOM.EXE
     DOOM.WAD
     .jsdos/
       dosbox.conf
     ```
   - The dosbox.conf should contain:
     ```ini
     [autoexec]
     mount c .
     c:
     DOOM.EXE
     ```

## Implementation Plan for nicksmith.software

### Phase 1: Prepare Bundle
1. Use Game Studio to create a DOOM.jsdos bundle
2. Include DOOM.WAD (shareware or owned copy)
3. Configure DOSBox settings for optimal performance
4. Host bundle in `/public/doom/` directory

### Phase 2: Update Doom Component
```tsx
// src/features/apps/Doom/Doom.tsx
import { useEffect, useRef } from 'react';
import styles from './Doom.module.css';

export function Doom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dosRef = useRef<any>(null);

  useEffect(() => {
    // Load js-dos dynamically
    const loadJsDos = async () => {
      // Add CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://v8.js-dos.com/latest/js-dos.css';
      document.head.appendChild(link);

      // Add JS
      const script = document.createElement('script');
      script.src = 'https://v8.js-dos.com/latest/js-dos.js';
      script.onload = () => {
        if (containerRef.current && window.Dos) {
          dosRef.current = window.Dos(containerRef.current, {
            url: '/doom/doom.jsdos',
          });
        }
      };
      document.body.appendChild(script);
    };

    loadJsDos();

    return () => {
      // Cleanup if needed
      if (dosRef.current?.stop) {
        dosRef.current.stop();
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.dosContainer} />
    </div>
  );
}
```

### Phase 3: Styling
```css
/* Doom.module.css */
.container {
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
}

.dosContainer {
  width: 100%;
  height: 100%;
}

/* Hide js-dos UI elements if needed */
.dosContainer :global(.jsdos-player-button) {
  display: none;
}
```

### Phase 4: Window Store Updates
- Adjust window size for DOOM (640x480 recommended)
- Handle focus/blur for keyboard input
- Consider fullscreen toggle

## Configuration Options

```javascript
Dos(element, {
  url: "/doom/doom.jsdos",        // Bundle URL
  autoStart: true,                 // Start immediately
  pathPrefix: "/js-dos/",          // Path to js-dos assets
  workerThread: true,              // Use web worker

  // Optional callbacks
  onEvent: (event, ci) => {
    // Handle events like 'emu-ready', 'ci-ready'
  }
});
```

## Controls Mapping

DOOM default controls:
- **Arrow keys**: Move forward/back, turn left/right
- **Ctrl**: Fire weapon
- **Space**: Open doors/use
- **Shift**: Run
- **Alt + Arrow**: Strafe
- **1-7**: Select weapon

## Considerations

### Performance
- js-dos uses WebAssembly for good performance
- Can handle DOOM comfortably on modern browsers
- Mobile support available

### Legal
- DOOM shareware WAD is freely distributable
- Full DOOM.WAD requires ownership
- js-dos bundles are not licensed, free to use

### File Size
- js-dos library: ~2MB
- DOOM shareware bundle: ~4MB
- Full DOOM bundle: ~12MB

## Alternative: Pre-built DOOM Bundle

js-dos provides pre-built game bundles via CDN:
```javascript
Dos(element, {
  url: "https://cdn.dos.zone/original/2X/2/24b00b14f118580763440ecaddcc948f8cb94f14.jsdos"
});
```

This uses a hosted DOOM shareware bundle, no local files needed.

## Next Steps

1. [ ] Create DOOM.jsdos bundle using Game Studio
2. [ ] Test bundle locally
3. [ ] Update Doom.tsx to use js-dos instead of doom-js
4. [ ] Add TypeScript types for js-dos (or use `declare global`)
5. [ ] Test keyboard input focus within window
6. [ ] Add fullscreen toggle button
7. [ ] Consider mobile touch controls
8. [ ] Remove old doom-js files from public/doom/
