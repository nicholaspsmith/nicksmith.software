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
          <img
            src="/profile.jpg"
            alt="Nick Smith"
            className={styles.photo}
          />
        </div>
        <div className={styles.intro}>
          <h1 className={styles.name}>Nick Smith</h1>
          <p className={styles.title}>Senior Software Engineer</p>
        </div>
      </div>

      <div className={styles.bio}>
        <p>
          Hey there! I'm a frontend-focused engineer with 12+ years of experience
          building web platforms at companies like MongoDB and Cisco. I love turning
          complex problems into clean, intuitive interfaces — whether that's threat
          intelligence dashboards or large-scale CMS migrations.
        </p>
        <p>
          This portfolio is my tribute to Mac OS X Tiger, an OS that shaped my
          appreciation for thoughtful design. I'm currently exploring AI-assisted
          development and building Loopi, an open-source spaced repetition learning
          app. When I'm not coding, I volunteer as an ESL instructor and practice
          my Mandarin.
        </p>
      </div>

      <div className={styles.highlights}>
        <h2 className={styles.sectionTitle}>Highlights</h2>
        <ul className={styles.list}>
          <li>12+ years building scalable web platforms</li>
          <li>Tech Lead at MongoDB, led CMS migration for mongodb.com</li>
          <li>Expert in React, Next.js, TypeScript, and data visualization</li>
          <li>Hack Reactor alum, University of Arizona BSBA</li>
        </ul>
      </div>
    </div>
  );
}
