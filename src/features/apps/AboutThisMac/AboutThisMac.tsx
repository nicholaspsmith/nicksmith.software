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
        <img
          src="/icons/apple-logo-metallic.png"
          alt=""
          height={64}
          aria-hidden="true"
          style={{ width: 'auto' }}
        />
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

export default AboutThisMac;
