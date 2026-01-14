import styles from './Doom.module.css';

/**
 * Doom - JavaScript Doom renderer
 *
 * Embeds the doom-js engine in an iframe.
 * Requires user to upload a DOOM.WAD or DOOM1.WAD file.
 *
 * Controls: WASD for movement, arrow keys for rotation.
 */
export function Doom() {
  return (
    <div className={styles.container}>
      <iframe
        src="/doom/index.html"
        className={styles.iframe}
        title="DOOM"
        allow="autoplay"
      />
    </div>
  );
}
