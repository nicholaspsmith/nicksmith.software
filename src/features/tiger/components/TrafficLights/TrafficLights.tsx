import styles from './TrafficLights.module.css';

export interface TrafficLightsProps {
  isFocused: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onZoom?: () => void;
}

/**
 * TrafficLights component - Tiger-style window control buttons
 *
 * Renders the iconic red/yellow/green buttons for close, minimize, zoom.
 * Shows symbols on hover (group hover behavior) and grays out when unfocused.
 */
export function TrafficLights({
  isFocused,
  onClose,
  onMinimize,
  onZoom,
}: TrafficLightsProps) {
  const containerClass = `${styles.container} ${isFocused ? styles.focused : styles.unfocused}`;

  const handleClick = (
    e: React.MouseEvent,
    handler?: () => void
  ) => {
    e.stopPropagation(); // Prevent window drag
    handler?.();
  };

  return (
    <div className={containerClass} data-testid="traffic-lights">
      <button
        type="button"
        className={`${styles.button} ${styles.close}`}
        onClick={(e) => handleClick(e, onClose)}
        aria-label="Close window"
        data-testid="traffic-light-close"
      />
      <button
        type="button"
        className={`${styles.button} ${styles.minimize}`}
        onClick={(e) => handleClick(e, onMinimize)}
        aria-label="Minimize window"
        data-testid="traffic-light-minimize"
      />
      <button
        type="button"
        className={`${styles.button} ${styles.zoom}`}
        onClick={(e) => handleClick(e, onZoom)}
        aria-label="Zoom window"
        data-testid="traffic-light-zoom"
      />
    </div>
  );
}
