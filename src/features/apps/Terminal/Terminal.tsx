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
  Email:    nick@example.com
  GitHub:   github.com/nicksmith
  LinkedIn: linkedin.com/in/nicksmith
`,
  date: () => new Date().toString(),
  whoami: () => 'guest',
  pwd: () => '/Users/guest',
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
      xtermRef.current.write('\r\n\x1b[36mguest@macbook\x1b[0m:\x1b[33m~\x1b[0m$ ');
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
      xtermRef.current?.write('\r\n' + output);
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
    term.write('\x1b[36mguest@macbook\x1b[0m:\x1b[33m~\x1b[0m$ ');

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
            term.write('\x1b[36mguest@macbook\x1b[0m:\x1b[33m~\x1b[0m$ ');
            term.write(cmd);
            commandBufferRef.current = cmd;
          }
        } else if (data === '\x1b[B') {
          // Down arrow - history
          if (historyIndexRef.current < historyRef.current.length - 1) {
            historyIndexRef.current++;
            const cmd = historyRef.current[historyIndexRef.current] || '';
            term.write('\r\x1b[K');
            term.write('\x1b[36mguest@macbook\x1b[0m:\x1b[33m~\x1b[0m$ ');
            term.write(cmd);
            commandBufferRef.current = cmd;
          } else if (historyIndexRef.current === historyRef.current.length - 1) {
            historyIndexRef.current = historyRef.current.length;
            term.write('\r\x1b[K');
            term.write('\x1b[36mguest@macbook\x1b[0m:\x1b[33m~\x1b[0m$ ');
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
