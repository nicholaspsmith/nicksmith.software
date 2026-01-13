import styles from './Preview.module.css';

export interface PreviewProps {
  /** Image data URL to display */
  imageDataUrl: string;
}

/**
 * Preview - Simple image viewer
 *
 * Displays an image with no decorations except the window chrome title bar
 */
export function Preview({ imageDataUrl }: PreviewProps) {
  return (
    <div className={styles.preview}>
      <img
        src={imageDataUrl}
        alt="Preview"
        className={styles.image}
        draggable={false}
      />
    </div>
  );
}
