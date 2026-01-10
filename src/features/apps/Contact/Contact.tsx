import styles from './Contact.module.css';

/**
 * Contact - Portfolio contact information
 *
 * Displays contact info immediately visible without scrolling.
 * Links open in new tabs. Window default: 400x300px.
 */
export function Contact() {
  return (
    <div className={styles.container} data-testid="contact-content">
      <h1 className={styles.title}>Get in Touch</h1>
      <p className={styles.subtitle}>
        I'd love to hear from you! Feel free to reach out through any of these
        channels.
      </p>

      <div className={styles.links}>
        <a
          href="mailto:me@nicksmith.software"
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.icon}>✉️</span>
          <span className={styles.linkText}>
            <strong>Email</strong>
            <span>me@nicksmith.software</span>
          </span>
        </a>

        <a
          href="https://linkedin.com/in/nps90"
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.icon}>💼</span>
          <span className={styles.linkText}>
            <strong>LinkedIn</strong>
            <span>linkedin.com/in/nps90</span>
          </span>
        </a>

        <a
          href="https://github.com/nicholaspsmith"
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.icon}>🐙</span>
          <span className={styles.linkText}>
            <strong>GitHub</strong>
            <span>github.com/nicholaspsmith</span>
          </span>
        </a>
      </div>

      <p className={styles.footer}>
        Based in Charleston, SC. Open to remote opportunities.
      </p>
    </div>
  );
}
