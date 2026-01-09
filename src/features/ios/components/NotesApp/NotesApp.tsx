import { NavigationBar } from '../NavigationBar';
import styles from './NotesApp.module.css';

export interface NotesAppProps {
  /** Handler to go back to home screen */
  onBack: () => void;
}

/**
 * Notes App - iOS 6 style
 *
 * Displays About Me content in the iconic yellow legal pad style:
 * - Torn paper edge at top
 * - Blue lines for text
 * - Red margin line
 * - Marker font for handwritten feel
 */
export function NotesApp({ onBack }: NotesAppProps) {
  return (
    <div className={styles.app} data-testid="ios-notes-app">
      <NavigationBar title="About Me" backLabel="Home" onBack={onBack} />

      <div className={styles.notepad}>
        {/* Torn paper edge */}
        <div className={styles.tornEdge} aria-hidden="true" />

        {/* Note content */}
        <div className={styles.content}>
          <div className={styles.marginLine} aria-hidden="true" />

          <div className={styles.textArea}>
            <h2 className={styles.heading}>Hello! 👋</h2>

            <p className={styles.text}>
              I'm Nick, a senior frontend engineer passionate about creating
              delightful user experiences.
            </p>

            <p className={styles.text}>
              I specialize in React, TypeScript, and building performant web
              applications that users love.
            </p>

            <p className={styles.text}>
              When I'm not coding, you'll find me exploring vintage computing,
              playing retro games, or tinkering with mechanical keyboards.
            </p>

            <h3 className={styles.subheading}>What I Do</h3>

            <ul className={styles.list}>
              <li>Frontend Architecture</li>
              <li>React & TypeScript</li>
              <li>Performance Optimization</li>
              <li>Design Systems</li>
              <li>Animation & Motion</li>
            </ul>

            <p className={styles.text}>
              This portfolio is built to showcase my skills through the lens of
              nostalgic design - proving that attention to detail matters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
