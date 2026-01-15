import { useEffect, useRef, useCallback } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useAppStore } from '@/stores/appStore';
import { useWindowStore } from '@/stores/windowStore';
import styles from './Terminal.module.css';

// Flag to track if crash should be triggered (set by rm command)
let pendingCrash = false;

/**
 * Commands available in the terminal
 * Each command has a handler that receives args and returns output
 */
type CommandHandler = (args: string[]) => string;

const COMMANDS: Record<string, CommandHandler> = {
  help: () => `Available commands:
  help      - Show this help message
  about     - About me
  skills    - List my technical skills
  projects  - View my projects
  contact   - How to reach me
  clear     - Clear the terminal
  date      - Show current date
  whoami    - Display current user
  pwd       - Print working directory
  ls        - List directory contents
  cat       - View file contents
  echo      - Echo text back
  doom      - Play DOOM
`,
  about: () => `
Nick Smith - Software Engineer

Passionate about crafting delightful user experiences
and building robust systems. This portfolio is a tribute
to Mac OS X Tiger.
`,
  skills: () => `Technical Skills:
  Languages:   TypeScript, JavaScript, Python, Go
  Frontend:    React, Vue, CSS-in-JS, Motion
  Backend:     Node.js, Express, PostgreSQL
  Tools:       Git, Docker, AWS, Vite
  Practices:   TDD, CI/CD, Accessibility
`,
  projects: () => `Projects:
  1. Tiger Portfolio  - This very website!
  2. [More projects coming soon...]

Type 'open projects' to view in Projects window.
`,
  contact: () => `Contact:
  Email:    me@nicksmith.software
  GitHub:   github.com/nicholaspsmith
  LinkedIn: linkedin.com/in/nps90
`,
  date: () => new Date().toString(),
  whoami: () => 'nick',
  pwd: () => '/Users/nick',
  ls: (args: string[]) => {
    const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
    const files = ['Documents', 'Downloads', 'Desktop', 'Projects'];
    const hidden = ['.bash_profile', '.gitconfig', '.zshrc'];
    return (showAll ? [...hidden, ...files] : files).join('  ');
  },
  cat: (args: string[]) => {
    const file = args[0];
    if (!file) return 'usage: cat <filename>';
    if (file === '.bash_profile' || file === '.zshrc') {
      return `# Welcome to Nick's Terminal
export PS1="\\u@macbook:\\w\\$ "
alias ll="ls -la"`;
    }
    return `cat: ${file}: No such file or directory`;
  },
  echo: (args: string[]) => args.join(' '),

  // === Easter Egg Commands ===

  sudo: () => `Password: ********
Sorry, user nick does not have sudo privileges.
This incident will be reported.`,

  vim: () => `
 _   ________  ___
| | / /  _/  |/  /  Good choice!
| |/ // // /|_/ /   But this is a portfolio,
|___/___/_/  /_/    not a real shell :)

Hint: Try 'help' for available commands.`,

  emacs: () => `GNU Emacs is great, but...

  M-x butterfly

...this terminal only supports basic commands.
Try 'help' for what's available!`,

  neofetch: () => `
\x1b[32m                    'c.         nick@imacg5
\x1b[32m                 ,xNMM.         \x1b[0m-----------------
\x1b[32m               .OMMMMo          \x1b[33mOS:\x1b[0m Mac OS X Tiger (web)
\x1b[32m               OMMM0,           \x1b[33mHost:\x1b[0m nicksmith.software
\x1b[32m     .;loddo:' loolloddol;.    \x1b[33mKernel:\x1b[0m React 18
\x1b[32m   cKMMMMMMMMMMNWMMMMMMMMMM0:  \x1b[33mShell:\x1b[0m xterm.js
\x1b[33m .KMMMMMMMMMMMMMMMMMMMMMMMWd.  \x1b[33mResolution:\x1b[0m ${window.innerWidth}x${window.innerHeight}
\x1b[31mXMMMMMMMMMMMMMMMMMMMMMMMX.     \x1b[33mTheme:\x1b[0m Aqua
\x1b[31m;MMMMMMMMMMMMMMMMMMMMMMMM:     \x1b[33mTerminal:\x1b[0m Tiger Terminal
\x1b[31m:MMMMMMMMMMMMMMMMMMMMMMMM:     \x1b[33mCPU:\x1b[0m Browser Engine
\x1b[31m.MMMMMMMMMMMMMMMMMMMMMMMMX.    \x1b[33mMemory:\x1b[0m ${Math.round(((performance as Performance & { memory?: { usedJSHeapSize: number } })?.memory?.usedJSHeapSize ?? 0) / 1048576) || '??'}MB
\x1b[31m kMMMMMMMMMMMMMMMMMMMMMMMMWd.
\x1b[33m .XMMMMMMMMMMMMMMMMMMMMMMMMMMk
\x1b[33m  .XMMMMMMMMMMMMMMMMMMMMMMMMK.
\x1b[32m    kMMMMMMMMMMMMMMMMMMMMMMd
\x1b[32m     ;KMMMMMMMWXXWMMMMMMMk.
\x1b[32m       .coeli;,  .,codedc.`,

  matrix: () => `
\x1b[32m01001000 01100101 01101100 01101100 01101111
01010111 01101111 01110010 01101100 01100100

Wake up, Neo...
The Matrix has you...

(Just kidding. Try 'help' for real commands)`,

  coffee: () => `
       ( (
        ) )
      ........
      |      |]
      \\      /
       \`----'

    Here's your coffee!
    Now get back to coding.`,

  hello: () => `Hello! Welcome to Nick's portfolio terminal.
Type 'help' to see available commands.`,

  hi: () => `Hey there! Type 'help' for commands.`,

  fortune: () => {
    const fortunes = [
      'A bug in the code is worth two in the documentation.',
      'In the middle of difficulty lies opportunity. - Einstein',
      'The best time to plant a tree was 20 years ago. The second best time is now.',
      'It works on my machine!',
      'Have you tried turning it off and on again?',
      'There are only 10 types of people: those who understand binary and those who don\'t.',
      'A good programmer looks both ways before crossing a one-way street.',
      'Code never lies, comments sometimes do.',
    ];
    return fortunes[Math.floor(Math.random() * fortunes.length)];
  },

  cowsay: (args: string[]) => {
    const message = args.join(' ') || 'Moo!';
    const border = '-'.repeat(message.length + 2);
    return `
 ${border}
< ${message} >
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
  },

  sl: () => `
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------| [___] |
  | ________|___H__/__|_____/[][]~\\_______|       |
  |/ |   |-----------I_____I [][] []  D   |=======|_

You've been railroaded! (The command is 'ls', not 'sl')`,

  exit: () => `logout
Saving session...
...copying shared history...
...saving history...truncating history files...
...completed.

[Process completed]

(This is a web terminal - you can't really exit!)`,

  rm: (args: string[]) => {
    // Check for rm -rf / (various formats)
    const hasRf = args.includes('-rf') || args.includes('-fr') ||
                  (args.includes('-r') && args.includes('-f'));
    const hasRoot = args.includes('/');

    if (hasRf && hasRoot) {
      // Trigger crash easter egg
      pendingCrash = true;
      return `rm: removing all files in '/'...
rm: cannot remove '/System': Operation not permitted
rm: cannot remove '/Library': Operation not permitted
rm: WARNING: CRITICAL SYSTEM FILES DELETED
rm: KERNEL PANIC - NOT SYNCING
rm: Attempting to halt...`;
    }
    return `rm: cannot remove '${args[0] || ''}': This is a virtual filesystem`;
  },

  doom: () => {
    // Open DOOM game window
    setTimeout(() => {
      useWindowStore.getState().openDoom();
    }, 100);
    return `
\x1b[31m██████╗  ██████╗  ██████╗ ███╗   ███╗\x1b[0m
\x1b[31m██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║\x1b[0m
\x1b[31m██║  ██║██║   ██║██║   ██║██╔████╔██║\x1b[0m
\x1b[31m██║  ██║██║   ██║██║   ██║██║╚██╔╝██║\x1b[0m
\x1b[31m██████╔╝╚██████╔╝╚██████╔╝██║ ╚═╝ ██║\x1b[0m
\x1b[31m╚═════╝  ╚═════╝  ╚═════╝ ╚═╝     ╚═╝\x1b[0m

Launching DOOM...`;
  },
};

/**
 * Terminal - Interactive terminal emulator using xterm.js
 *
 * Provides a Mac OS X Tiger styled terminal with custom commands
 * for exploring portfolio content.
 */
export function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const commandBufferRef = useRef<string>('');
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);

  const writePrompt = useCallback(() => {
    if (xtermRef.current) {
      xtermRef.current.write('\r\nnick@imacg5:~$');
    }
  }, []);

  const executeCommand = useCallback((input: string) => {
    const trimmed = input.trim();
    if (!trimmed) {
      writePrompt();
      return;
    }

    // Add to history
    historyRef.current.push(trimmed);
    historyIndexRef.current = historyRef.current.length;

    const [cmd, ...args] = trimmed.split(' ');
    const command = cmd.toLowerCase();

    if (command === 'clear') {
      xtermRef.current?.clear();
      writePrompt();
      return;
    }

    const handler = COMMANDS[command];
    if (handler) {
      const output = handler(args);
      // Convert \n to \r\n for proper xterm.js line breaks
      const formattedOutput = output.replace(/\n/g, '\r\n');
      xtermRef.current?.write('\r\n' + formattedOutput);

      // Check if crash was triggered (rm -rf / easter egg)
      if (pendingCrash) {
        pendingCrash = false;
        const term = xtermRef.current;
        // After 500ms, fetch IP and show FBI warning
        setTimeout(() => {
          fetch('https://api.ipify.org?format=json')
            .then((res) => res.json())
            .then((data) => {
              const ip = data.ip || 'UNKNOWN';
              term?.write(`\r\n\r\n\x1b[31m*** WARNING ***\x1b[0m\r\nYour IP Address \x1b[33m${ip}\x1b[0m has been reported to the FBI's Internet Crime Complaint Center (IC3)`);
            })
            .catch(() => {
              term?.write(`\r\n\r\n\x1b[31m*** WARNING ***\x1b[0m\r\nYour IP Address has been reported to the FBI's Internet Crime Complaint Center (IC3)`);
            })
            .finally(() => {
              // Trigger crash after 2 seconds so user can read FBI warning
              setTimeout(() => {
                useAppStore.getState().triggerCrash();
              }, 2000);
            });
        }, 500);
        return; // Don't write prompt
      }
    } else {
      xtermRef.current?.write(`\r\nCommand not found: ${cmd}. Type 'help' for available commands.`);
    }

    writePrompt();
  }, [writePrompt]);

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Create terminal with Tiger-style theming
    const term = new XTerm({
      theme: {
        background: '#ffffff',
        foreground: '#000000',
        cursor: '#000000',
        cursorAccent: '#ffffff',
        selectionBackground: '#00000030',
        black: '#000000',
        red: '#ff5f57',
        green: '#33ff33',
        yellow: '#ffbd2e',
        blue: '#4ca1e4',
        magenta: '#ff79c6',
        cyan: '#8be9fd',
        white: '#f8f8f2',
        brightBlack: '#6272a4',
        brightRed: '#ff6e6e',
        brightGreen: '#69ff94',
        brightYellow: '#ffffa5',
        brightBlue: '#d6acff',
        brightMagenta: '#ff92df',
        brightCyan: '#a4ffff',
        brightWhite: '#ffffff',
      },
      fontFamily: 'Monaco, "Courier New", monospace',
      fontSize: 13,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    term.open(terminalRef.current);

    // Initial fit
    requestAnimationFrame(() => {
      fitAddon.fit();
    });

    // Welcome message
    term.write('Last login: ' + new Date().toLocaleString() + ' on ttys000\r\n');
    term.write('nick@imacg5:~$');

    // Handle input - store disposer for cleanup
    const onDataDisposer = term.onData((data) => {
      const code = data.charCodeAt(0);

      if (code === 13) {
        // Enter
        executeCommand(commandBufferRef.current);
        commandBufferRef.current = '';
      } else if (code === 127 || code === 8) {
        // Backspace
        if (commandBufferRef.current.length > 0) {
          commandBufferRef.current = commandBufferRef.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (code === 27) {
        // Escape sequences (arrow keys)
        if (data === '\x1b[A') {
          // Up arrow - history
          if (historyIndexRef.current > 0) {
            historyIndexRef.current--;
            const cmd = historyRef.current[historyIndexRef.current] || '';
            // Clear current line
            term.write('\r\x1b[K');
            term.write('nick@imacg5:~$');
            term.write(cmd);
            commandBufferRef.current = cmd;
          }
        } else if (data === '\x1b[B') {
          // Down arrow - history
          if (historyIndexRef.current < historyRef.current.length - 1) {
            historyIndexRef.current++;
            const cmd = historyRef.current[historyIndexRef.current] || '';
            term.write('\r\x1b[K');
            term.write('nick@imacg5:~$');
            term.write(cmd);
            commandBufferRef.current = cmd;
          } else if (historyIndexRef.current === historyRef.current.length - 1) {
            historyIndexRef.current = historyRef.current.length;
            term.write('\r\x1b[K');
            term.write('nick@imacg5:~$');
            commandBufferRef.current = '';
          }
        }
      } else if (code >= 32) {
        // Printable characters
        commandBufferRef.current += data;
        term.write(data);
      } else if (code === 3) {
        // Ctrl+C
        term.write('^C');
        commandBufferRef.current = '';
        writePrompt();
      }
    });

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        fitAddon.fit();
      });
    });

    resizeObserver.observe(terminalRef.current);

    // Prevent xterm from hiding scrollbar on mouse leave
    // xterm adds "invisible" class to scrollbar when mouse leaves
    const scrollbarObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains('scrollbar') && target.classList.contains('invisible')) {
            target.classList.remove('invisible');
          }
        }
      }
    });

    // Observe the terminal container for scrollbar class changes
    scrollbarObserver.observe(terminalRef.current, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
    });

    return () => {
      onDataDisposer.dispose();
      resizeObserver.disconnect();
      scrollbarObserver.disconnect();
      term.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, [executeCommand, writePrompt]);

  return (
    <div className={styles.container} data-testid="terminal-content">
      <div ref={terminalRef} className={styles.terminal} />
    </div>
  );
}
