import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSoundStore } from '@/stores/soundStore';
import styles from './AlertDialog.module.css';

export interface AlertDialogProps {
  /** Whether the dialog is visible */
  isOpen: boolean;
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string;
  /** Type of alert - affects icon displayed */
  type?: 'caution' | 'stop' | 'note';
  /** Text for OK/primary button */
  okText?: string;
  /** Text for cancel button (if shown) */
  cancelText?: string;
  /** Show cancel button */
  showCancel?: boolean;
  /** Callback when OK is clicked */
  onOk: () => void;
  /** Callback when Cancel is clicked */
  onCancel?: () => void;
  /** Play Sosumi sound on open */
  playSound?: boolean;
}

/**
 * AlertDialog - Tiger-style modal alert dialog
 *
 * Displays a modal dialog with icon, title, message, and action buttons.
 * Plays the Sosumi error sound when opened (can be disabled).
 * Styled to match Mac OS X Tiger's Aqua design language.
 */
export function AlertDialog({
  isOpen,
  title,
  message,
  type = 'caution',
  okText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
  onOk,
  onCancel,
  playSound = true,
}: AlertDialogProps) {
  const playSosumi = useSoundStore((s) => s.playSosumi);
  const okButtonRef = useRef<HTMLButtonElement>(null);

  // Play sound when dialog opens
  useEffect(() => {
    if (isOpen && playSound) {
      playSosumi();
    }
  }, [isOpen, playSound, playSosumi]);

  // Focus OK button when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure dialog is rendered
      const timer = setTimeout(() => {
        okButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCancel && onCancel) {
          onCancel();
        } else {
          onOk();
        }
      } else if (e.key === 'Enter') {
        onOk();
      }
    },
    [onOk, onCancel, showCancel]
  );

  // Prevent clicks on overlay from propagating
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        // Click on overlay - dismiss if no cancel, otherwise do nothing
        if (!showCancel) {
          onOk();
        }
      }
    },
    [onOk, showCancel]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
          role="presentation"
          data-testid="alert-overlay"
        >
          <motion.div
            className={styles.dialog}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="alert-title"
            aria-describedby="alert-message"
            data-testid="alert-dialog"
          >
            <div className={styles.content}>
              <div className={styles.icon}>
                <AlertIcon type={type} />
              </div>
              <div className={styles.textContent}>
                <h2 id="alert-title" className={styles.title}>
                  {title}
                </h2>
                <p id="alert-message" className={styles.message}>
                  {message}
                </p>
              </div>
            </div>
            <div className={styles.buttons}>
              {showCancel && (
                <button
                  className={styles.button}
                  onClick={onCancel}
                  data-testid="alert-cancel"
                >
                  {cancelText}
                </button>
              )}
              <button
                ref={okButtonRef}
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={onOk}
                data-testid="alert-ok"
              >
                {okText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Alert icon component - renders appropriate icon based on type
 */
function AlertIcon({ type }: { type: 'caution' | 'stop' | 'note' }) {
  if (type === 'caution') {
    return (
      <svg
        viewBox="0 0 48 48"
        width="48"
        height="48"
        className={styles.cautionIcon}
        aria-hidden="true"
      >
        {/* Yellow triangle */}
        <path
          d="M24 4 L44 40 H4 Z"
          fill="url(#cautionGradient)"
          stroke="#b8860b"
          strokeWidth="1"
        />
        <defs>
          <linearGradient id="cautionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffed4a" />
            <stop offset="100%" stopColor="#f5c800" />
          </linearGradient>
        </defs>
        {/* Exclamation mark */}
        <rect x="22" y="14" width="4" height="16" rx="1" fill="#333" />
        <circle cx="24" cy="34" r="2.5" fill="#333" />
      </svg>
    );
  }

  if (type === 'stop') {
    return (
      <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
        {/* Red octagon */}
        <path
          d="M16 4 H32 L44 16 V32 L32 44 H16 L4 32 V16 Z"
          fill="url(#stopGradient)"
          stroke="#8b0000"
          strokeWidth="1"
        />
        <defs>
          <linearGradient id="stopGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#dc3545" />
          </linearGradient>
        </defs>
        {/* Hand icon */}
        <path
          d="M24 12 v20 M18 18 v10 M30 18 v10 M14 22 v6 M34 22 v6"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  // Note type - info icon
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
      {/* Blue circle */}
      <circle
        cx="24"
        cy="24"
        r="20"
        fill="url(#noteGradient)"
        stroke="#1a5fb4"
        strokeWidth="1"
      />
      <defs>
        <linearGradient id="noteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6cb3f5" />
          <stop offset="100%" stopColor="#3584e4" />
        </linearGradient>
      </defs>
      {/* "i" icon */}
      <circle cx="24" cy="14" r="3" fill="white" />
      <rect x="21" y="20" width="6" height="16" rx="2" fill="white" />
    </svg>
  );
}

export default AlertDialog;
