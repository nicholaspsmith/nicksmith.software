import { useEffect, useRef, useCallback } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import styles from './Terminal.module.css';

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
\x1b[32m                    'c.         \x1b[36mnick\x1b[0m@\x1b[36mmacbook\x1b[0m
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
    if (args.includes('-rf') && args.includes('/')) {
      return `Nice try! 😈
But this is a sandboxed web terminal.
No filesystems were harmed in the making of this portfolio.`;
    }
    return `rm: cannot remove '${args[0] || ''}': This is a virtual filesystem`;
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
      xtermRef.current.write('\r\n\x1b[36mnick@macbook\x1b[0m:\x1b[33m~\x1b[0m$ ');
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
        background: '#0a0a0a',
        foreground: '#33ff33',
        cursor: '#33ff33',
        cursorAccent: '#0a0a0a',
        selectionBackground: '#33ff3350',
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
    term.write('\x1b[36mnick@macbook\x1b[0m:\x1b[33m~\x1b[0m$ ');

    // Handle input
    term.onData((data) => {
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
            term.write('\x1b[36mnick@macbook\x1b[0m:\x1b[33m~\x1b[0m$ ');
            term.write(cmd);
            commandBufferRef.current = cmd;
          }
        } else if (data === '\x1b[B') {
          // Down arrow - history
          if (historyIndexRef.current < historyRef.current.length - 1) {
            historyIndexRef.current++;
            const cmd = historyRef.current[historyIndexRef.current] || '';
            term.write('\r\x1b[K');
            term.write('\x1b[36mnick@macbook\x1b[0m:\x1b[33m~\x1b[0m$ ');
            term.write(cmd);
            commandBufferRef.current = cmd;
          } else if (historyIndexRef.current === historyRef.current.length - 1) {
            historyIndexRef.current = historyRef.current.length;
            term.write('\r\x1b[K');
            term.write('\x1b[36mnick@macbook\x1b[0m:\x1b[33m~\x1b[0m$ ');
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

    return () => {
      resizeObserver.disconnect();
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
