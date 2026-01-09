export interface HardDriveIconProps {
  /** Optional size multiplier */
  size?: number;
}

/**
 * Macintosh HD icon - Classic Tiger-era hard drive icon
 *
 * Features the iconic silver/white hard drive design
 * with the macOS logo.
 */
export function HardDriveIcon({ size = 1 }: HardDriveIconProps) {
  const width = 48 * size;
  const height = 48 * size;

  return (
    <svg
      viewBox="0 0 48 48"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Hard drive body - 3D box shape */}
      <defs>
        <linearGradient id="hdBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="50%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#d0d0d0" />
        </linearGradient>
        <linearGradient id="hdTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8e8e8" />
        </linearGradient>
        <linearGradient id="hdSide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#a0a0a0" />
        </linearGradient>
      </defs>

      {/* Top face - angled */}
      <path
        d="M4 12 L24 6 L44 12 L44 16 L24 10 L4 16 Z"
        fill="url(#hdTop)"
        stroke="#888"
        strokeWidth="0.5"
      />

      {/* Front face */}
      <rect
        x="4"
        y="16"
        width="40"
        height="26"
        rx="2"
        fill="url(#hdBody)"
        stroke="#888"
        strokeWidth="0.5"
      />

      {/* Apple logo area - subtle inset */}
      <rect
        x="18"
        y="20"
        width="12"
        height="12"
        rx="1"
        fill="#e0e0e0"
        stroke="#ccc"
        strokeWidth="0.5"
      />

      {/* Simplified Apple logo */}
      <path
        d="M24 22.5 C24 22.5 25 21 26 21.5 C26 21.5 25.5 22.5 24 22.5Z"
        fill="#666"
      />
      <path
        d="M21 26 C21 24 22.5 23 24 23 C25.5 23 27 24 27 26 C27 28.5 25 30 24 30 C23 30 21 28.5 21 26Z"
        fill="#666"
      />

      {/* Status light */}
      <circle cx="38" cy="36" r="2" fill="#28c940" />

      {/* Ventilation lines */}
      <line x1="8" y1="38" x2="14" y2="38" stroke="#bbb" strokeWidth="1" />
      <line x1="8" y1="40" x2="14" y2="40" stroke="#bbb" strokeWidth="1" />
    </svg>
  );
}
