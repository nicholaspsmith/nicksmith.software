import { useState } from 'react';
import { motion } from 'motion/react';
import { useIOSStore } from '../../stores/iosStore';
import { StatusBar } from '../../components/StatusBar';
import styles from './SafariApp.module.css';

const PORTFOLIO_URL = 'https://nicholaspsmith.com';

/**
 * SafariApp - Safari browser with iframe
 *
 * Features:
 * - Safari chrome UI (URL bar, navigation)
 * - Iframe displaying portfolio site
 * - Home button to return to home screen
 */
export function SafariApp() {
  const closeApp = useIOSStore((s) => s.closeApp);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={styles.app}>
      <StatusBar variant="dark" />

      <div className={styles.toolbar}>
        <button className={styles.navButton} disabled>
          <ChevronLeftIcon className={styles.navIcon} />
        </button>
        <button className={styles.navButton} disabled>
          <ChevronRightIcon className={styles.navIcon} />
        </button>
        <div className={styles.urlBar}>
          <LockIcon className={styles.lockIcon} />
          <span className={styles.url}>nicholaspsmith.com</span>
        </div>
        <button className={styles.navButton} disabled>
          <ShareIcon className={styles.navIcon} />
        </button>
      </div>

      <div className={styles.iframeContainer}>
        {isLoading && !hasError && (
          <div className={styles.loading}>Loading...</div>
        )}
        {hasError && (
          <div className={styles.loading}>Failed to load page</div>
        )}
        <iframe
          src={PORTFOLIO_URL}
          className={styles.iframe}
          title="Portfolio"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>

      <div className={styles.bottomBar}>
        <motion.button
          className={styles.homeButton}
          onClick={closeApp}
          whileTap={{ scale: 0.95 }}
        >
          Done
        </motion.button>
      </div>
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 14" fill="currentColor">
      <path d="M10 5V4c0-2.21-1.79-4-4-4S2 1.79 2 4v1c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zM4 4c0-1.1.9-2 2-2s2 .9 2 2v1H4V4z" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
