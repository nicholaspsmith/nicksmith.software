import { motion } from 'motion/react';
import styles from './AppIcon.module.css';

export interface AppIconProps {
  /** Unique app identifier */
  id: string;
  /** Display label below icon */
  label: string;
  /** Icon image source or color for placeholder */
  icon: string | React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Whether this is a dock icon (slightly different styling) */
  isDockIcon?: boolean;
}

/**
 * iOS 6 App Icon
 *
 * Renders an app icon with the characteristic iOS 6 styling:
 * - Rounded square shape (12px radius)
 * - Glossy highlight overlay
 * - White label with drop shadow
 * - Touch feedback animation
 */
export function AppIcon({
  id,
  label,
  icon,
  onClick,
  isDockIcon = false,
}: AppIconProps) {
  return (
    <motion.button
      className={`${styles.appIcon} ${isDockIcon ? styles.dockIcon : ''}`}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      data-testid={`ios-app-${id}`}
      aria-label={label}
    >
      <div className={styles.iconContainer}>
        {typeof icon === 'string' ? (
          <img
            src={icon}
            alt=""
            className={styles.iconImage}
            draggable={false}
          />
        ) : (
          <div className={styles.iconPlaceholder}>{icon}</div>
        )}
        {/* iOS 6 glossy highlight overlay */}
        <div className={styles.glossOverlay} aria-hidden="true" />
      </div>
      {!isDockIcon && <span className={styles.label}>{label}</span>}
    </motion.button>
  );
}

/**
 * Placeholder icons for portfolio apps
 * Each uses iOS 6 era styling with skeuomorphic design
 */
export function NotesIcon() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <defs>
        <linearGradient id="notes-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF9E6" />
          <stop offset="100%" stopColor="#F5E6B8" />
        </linearGradient>
      </defs>
      {/* Yellow notepad background */}
      <rect width="60" height="60" rx="12" fill="url(#notes-gradient)" />
      {/* Red lines at top (binding) */}
      <rect x="0" y="10" width="60" height="2" fill="#E8C86C" />
      {/* Blue lines */}
      <line x1="10" y1="22" x2="50" y2="22" stroke="#9CB4CC" strokeWidth="1" />
      <line x1="10" y1="30" x2="50" y2="30" stroke="#9CB4CC" strokeWidth="1" />
      <line x1="10" y1="38" x2="50" y2="38" stroke="#9CB4CC" strokeWidth="1" />
      <line x1="10" y1="46" x2="50" y2="46" stroke="#9CB4CC" strokeWidth="1" />
      {/* Red margin line */}
      <line x1="15" y1="14" x2="15" y2="56" stroke="#E88B8B" strokeWidth="1" />
    </svg>
  );
}

export function PhotosIcon() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <defs>
        <linearGradient id="photos-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF9500" />
          <stop offset="100%" stopColor="#FF5E3A" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="12" fill="url(#photos-gradient)" />
      {/* Sunflower icon */}
      <circle cx="30" cy="30" r="10" fill="#FFE600" />
      <circle cx="30" cy="30" r="5" fill="#8B4513" />
      {/* Petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse
          key={angle}
          cx="30"
          cy="16"
          rx="4"
          ry="8"
          fill="#FFE600"
          transform={`rotate(${angle} 30 30)`}
        />
      ))}
    </svg>
  );
}

export function IBooksIcon() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <defs>
        <linearGradient id="ibooks-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#5D2E0C" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="12" fill="url(#ibooks-gradient)" />
      {/* Bookshelf */}
      <rect x="8" y="12" width="10" height="36" rx="1" fill="#C41E3A" />
      <rect x="20" y="16" width="10" height="32" rx="1" fill="#2E8B57" />
      <rect x="32" y="14" width="10" height="34" rx="1" fill="#4169E1" />
      <rect x="44" y="18" width="8" height="30" rx="1" fill="#DAA520" />
      {/* Wood grain shelf bottom */}
      <rect x="4" y="50" width="52" height="4" fill="#3D1F0D" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <defs>
        <linearGradient id="mail-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5AC8FA" />
          <stop offset="100%" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="12" fill="url(#mail-gradient)" />
      {/* Envelope */}
      <rect x="10" y="18" width="40" height="26" rx="2" fill="white" />
      {/* Envelope flap (open style) */}
      <path
        d="M10 20 L30 34 L50 20"
        fill="none"
        stroke="#DDD"
        strokeWidth="2"
      />
      <path d="M10 18 L30 32 L50 18" fill="#F5F5F5" />
    </svg>
  );
}

export function SafariIcon() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <defs>
        <linearGradient id="safari-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5AC8FA" />
          <stop offset="100%" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="12" fill="url(#safari-gradient)" />
      {/* Compass */}
      <circle cx="30" cy="30" r="18" fill="white" stroke="#DDD" strokeWidth="1" />
      {/* Compass needle */}
      <path d="M30 14 L34 30 L30 46 L26 30 Z" fill="#FF3B30" />
      <path d="M14 30 L30 26 L46 30 L30 34 Z" fill="#CCC" />
      {/* Center dot */}
      <circle cx="30" cy="30" r="3" fill="#333" />
    </svg>
  );
}

export function TerminalIOSIcon() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <defs>
        <linearGradient id="term-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4A4A4A" />
          <stop offset="100%" stopColor="#1A1A1A" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="12" fill="url(#term-gradient)" />
      {/* Terminal prompt */}
      <text x="10" y="36" fontSize="18" fill="#33FF33" fontFamily="monospace">
        &gt;_
      </text>
    </svg>
  );
}
