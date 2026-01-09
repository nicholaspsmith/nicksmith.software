export interface TerminalIconProps {
  size?: number;
}

/**
 * Terminal icon styled after Mac OS X Tiger's Terminal.app
 * Features a black terminal window with green command prompt
 */
export function TerminalIcon({ size = 48 }: TerminalIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Terminal window frame */}
      <rect
        x="4"
        y="6"
        width="40"
        height="36"
        rx="3"
        fill="#1a1a1a"
        stroke="#333"
        strokeWidth="1"
      />
      {/* Title bar */}
      <rect x="4" y="6" width="40" height="10" rx="3" fill="#3a3a3a" />
      <rect x="4" y="13" width="40" height="3" fill="#3a3a3a" />
      {/* Traffic light buttons */}
      <circle cx="11" cy="11" r="2.5" fill="#ff5f57" />
      <circle cx="19" cy="11" r="2.5" fill="#ffbd2e" />
      <circle cx="27" cy="11" r="2.5" fill="#28c940" />
      {/* Terminal content area */}
      <rect x="6" y="18" width="36" height="22" fill="#0a0a0a" />
      {/* Command prompt */}
      <text
        x="10"
        y="28"
        fontSize="7"
        fontFamily="Monaco, monospace"
        fill="#33ff33"
      >
        $
      </text>
      {/* Blinking cursor */}
      <rect x="18" y="22" width="4" height="8" fill="#33ff33" opacity="0.9" />
      {/* Previous command line */}
      <text
        x="10"
        y="38"
        fontSize="5"
        fontFamily="Monaco, monospace"
        fill="#888"
      >
        ~ %
      </text>
    </svg>
  );
}
