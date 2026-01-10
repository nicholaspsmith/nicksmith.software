import styles from './AboutThisMac.module.css';

/**
 * AboutThisMac - Tiger-era "About This Mac" panel
 *
 * A special dialog window showing system information:
 * - Apple logo
 * - Mac OS X version
 * - Processor and memory info
 * - Software Update and More Info buttons
 */
export function AboutThisMac() {
  return (
    <div className={styles.content}>
      {/* Apple Logo */}
      <div className={styles.appleLogo}>
        <AppleLogo />
      </div>

      {/* Mac OS X Title */}
      <h1 className={styles.title}>Mac OS X</h1>
      <p className={styles.version}>Version 10.4</p>

      {/* Software Update Button */}
      <button className={styles.button}>
        Software Update...
      </button>

      {/* System Info */}
      <div className={styles.systemInfo}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Processor</span>
          <span className={styles.infoValue}>
            Apple M-series (Simulated)<br />
            <span className={styles.infoSubtext}>Running in browser</span>
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Memory</span>
          <span className={styles.infoValue}>Unlimited VRAM</span>
        </div>
      </div>

      {/* More Info Button */}
      <button className={styles.button}>
        More Info...
      </button>

      {/* Copyright */}
      <p className={styles.copyright}>
        TM &amp; &copy; 1983-2005 Apple Computer, Inc.<br />
        All Rights Reserved.
      </p>
    </div>
  );
}

/**
 * Apple Logo SVG - Grayscale version matching Tiger style
 */
function AppleLogo() {
  return (
    <svg
      viewBox="0 0 170 170"
      width="64"
      height="64"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="appleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B8B8B8" />
          <stop offset="50%" stopColor="#8E8E8E" />
          <stop offset="100%" stopColor="#6A6A6A" />
        </linearGradient>
      </defs>
      <path
        fill="url(#appleGradient)"
        d="M150.4 130.3c-2.4 5.2-5.1 10-8.2 14.4-4.2 6-7.7 10.1-10.4 12.4-4.1 3.8-8.6 5.7-13.3 5.9-3.4 0-7.5-1-12.2-2.9-4.8-1.9-9.1-2.9-13.1-2.9-4.2 0-8.7 1-13.5 2.9-4.8 2-8.7 3-11.7 3.1-4.5.2-9.1-1.8-13.7-5.9-2.9-2.5-6.5-6.8-10.9-12.9-4.7-6.5-8.5-14.1-11.6-22.7-3.3-9.3-4.9-18.4-4.9-27.1 0-10 2.2-18.7 6.5-25.9 3.4-5.8 8-10.3 13.6-13.7 5.6-3.4 11.7-5.1 18.2-5.3 3.6 0 8.3 1.1 14.2 3.3 5.8 2.2 9.6 3.3 11.2 3.3 1.2 0 5.4-1.3 12.4-3.9 6.6-2.4 12.2-3.4 16.8-3 12.4 1 21.7 5.9 27.9 14.7-11.1 6.7-16.6 16.1-16.4 28.2.2 9.4 3.5 17.2 9.9 23.4 2.9 2.8 6.2 5 9.8 6.5-.8 2.3-1.6 4.4-2.5 6.5zM119.1 7c0 7.4-2.7 14.3-8 20.6-6.4 7.5-14.2 11.9-22.6 11.2-.1-.9-.2-1.8-.2-2.8 0-7.1 3.1-14.6 8.5-20.8 2.7-3.1 6.2-5.7 10.3-7.7 4.1-2 8-3.1 11.6-3.4.1 1 .2 2 .2 2.9h.2z"
      />
    </svg>
  );
}

export default AboutThisMac;
