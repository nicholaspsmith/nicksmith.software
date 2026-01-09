import { NavigationBar } from '../NavigationBar';
import { CONTACT, MAILTO } from '@/constants';
import styles from './MailApp.module.css';

export interface MailAppProps {
  /** Handler to go back to home screen */
  onBack: () => void;
}

/**
 * Mail App - iOS 6 style
 *
 * Displays Contact information with:
 * - Mail compose view styling
 * - Contact methods as "recipient" fields
 * - Message body area
 */
export function MailApp({ onBack }: MailAppProps) {
  return (
    <div className={styles.app} data-testid="ios-mail-app">
      <NavigationBar
        title="Contact"
        backLabel="Home"
        onBack={onBack}
        rightLabel="Send"
        onRightAction={() => window.location.href = MAILTO}
      />

      <div className={styles.composeView}>
        {/* To field */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>To:</label>
          <span className={styles.fieldValue}>
            <a
              href={MAILTO}
              className={styles.link}
            >
              {CONTACT.email}
            </a>
          </span>
        </div>

        {/* Cc field - LinkedIn */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Cc:</label>
          <span className={styles.fieldValue}>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {CONTACT.linkedin.replace('https://', '')}
            </a>
          </span>
        </div>

        {/* Bcc field - GitHub */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Bcc:</label>
          <span className={styles.fieldValue}>
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {CONTACT.github.replace('https://', '')}
            </a>
          </span>
        </div>

        {/* Subject field */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Subject:</label>
          <span className={styles.subjectValue}>Let's Connect!</span>
        </div>

        {/* Message body */}
        <div className={styles.messageBody}>
          <p className={styles.greeting}>Hi there! 👋</p>

          <p className={styles.bodyText}>
            Thanks for visiting my portfolio. I'm always excited to connect
            with fellow developers, recruiters, and anyone interested in
            frontend engineering.
          </p>

          <p className={styles.bodyText}>
            Feel free to reach out via any of the channels above. I typically
            respond within 24-48 hours.
          </p>

          <div className={styles.contactOptions}>
            <h3 className={styles.contactTitle}>Quick Links</h3>

            <a
              href={MAILTO}
              className={styles.contactButton}
            >
              📧 Send Email
            </a>

            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactButton}
            >
              💼 LinkedIn Profile
            </a>

            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactButton}
            >
              🐙 GitHub Profile
            </a>

            <button
              type="button"
              onClick={onBack}
              className={styles.contactButton}
              aria-label="View Resume in iBooks app"
            >
              📄 View Resume
            </button>
          </div>

          <p className={styles.signature}>
            Best regards,
            <br />
            <strong>{CONTACT.name}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
