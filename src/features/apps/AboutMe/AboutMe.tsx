import styles from './AboutMe.module.css';

/**
 * AboutMe - Portfolio about section content
 *
 * Displays photo and bio in Tiger-styled window.
 * Designed for readability and quick scanning.
 */
export function AboutMe() {
  return (
    <div className={styles.container} data-testid="about-me-content">
      <div className={styles.header}>
        <div className={styles.photoFrame}>
          <div className={styles.photoPlaceholder} aria-label="Profile photo">
            {/* Placeholder until real photo is added */}
            <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <circle cx="50" cy="35" r="20" fill="#a0a0a0" />
              <ellipse cx="50" cy="85" rx="35" ry="25" fill="#a0a0a0" />
            </svg>
          </div>
        </div>
        <div className={styles.intro}>
          <h1 className={styles.name}>Nick Smith</h1>
          <p className={styles.title}>Software Engineer</p>
        </div>
      </div>

      <div className={styles.bio}>
        <p>
          Hi! I'm a software engineer passionate about crafting delightful user
          experiences and building robust systems. This portfolio is a tribute
          to Mac OS X Tiger — one of my favorite operating systems that shaped
          my love for thoughtful design.
        </p>
        <p>
          I specialize in frontend development with React and TypeScript, but I
          enjoy working across the full stack. When I'm not coding, you'll find
          me exploring retro computing, tinkering with side projects, or
          appreciating good UI design.
        </p>
      </div>

      <div className={styles.highlights}>
        <h2 className={styles.sectionTitle}>Highlights</h2>
        <ul className={styles.list}>
          <li>5+ years of professional software development</li>
          <li>Expert in React, TypeScript, and modern web technologies</li>
          <li>Passionate about performance and accessibility</li>
          <li>Strong believer in clean code and testing</li>
        </ul>
      </div>
    </div>
  );
}
