import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import styles from './AppIcon.module.css';

interface AppIconProps {
  /** App icon image URL or React node */
  icon: string | ReactNode;
  /** App label text */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Whether this is a dock icon (no label) */
  isDock?: boolean;
}

/**
 * AppIcon - iOS 15+ app icon button
 *
 * Displays an app icon with label below.
 * Includes tap animation for authentic feel.
 */
export function AppIcon({ icon, label, onClick, isDock = false }: AppIconProps) {
  return (
    <motion.button
      className={`${styles.appButton} ${isDock ? styles.dockVariant : ''}`}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.1 }}
    >
      <div className={styles.iconWrapper}>
        {typeof icon === 'string' ? (
          <img src={icon} alt={label} className={styles.iconImage} draggable={false} />
        ) : (
          icon
        )}
      </div>
      <span className={styles.label}>{label}</span>
    </motion.button>
  );
}
