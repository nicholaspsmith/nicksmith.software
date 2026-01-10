import styles from './MobileFallback.module.css';

/**
 * MobileFallback - "Best on Desktop" message for mobile viewports
 *
 * Displays a Tiger-styled dialog with quick links to essential info.
 * Shown for viewports under 1024px where the full desktop experience
 * won't fit properly.
 */
export function MobileFallback() {
  return (
    <div className={styles.container} data-testid="mobile-fallback">
      <div className={styles.dialog} role="dialog" aria-labelledby="mobile-fallback-title">
        {/* Tiger dialog icon */}
        <div className={styles.iconContainer}>
          <svg
            className={styles.icon}
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            {/* Monitor icon */}
            <rect x="4" y="6" width="40" height="28" rx="2" fill="#E0E0E0" stroke="#808080" strokeWidth="2" />
            <rect x="8" y="10" width="32" height="20" fill="#3a6ea5" />
            <rect x="18" y="36" width="12" height="4" fill="#C0C0C0" />
            <rect x="14" y="40" width="20" height="2" fill="#808080" />
          </svg>
        </div>

        <h1 id="mobile-fallback-title" className={styles.title}>
          Best on Desktop
        </h1>

        <p className={styles.message}>
          This portfolio is designed as a Mac OS X Tiger experience
          and works best on larger screens.
        </p>

        <div className={styles.links}>
          <a
            href="mailto:me@nicksmith.software"
            className={styles.link}
            data-testid="fallback-email"
          >
            📧 Email Me
          </a>
          <a
            href="https://linkedin.com/in/nps90"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="fallback-linkedin"
          >
            💼 LinkedIn
          </a>
          <a
            href="/resume.pdf"
            className={styles.link}
            download
            data-testid="fallback-resume"
          >
            📄 Download Resume
          </a>
        </div>

        <p className={styles.hint}>
          Visit on a desktop for the full experience!
        </p>
      </div>
    </div>
  );
}
