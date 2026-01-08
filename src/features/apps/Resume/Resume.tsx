import styles from './Resume.module.css';

/**
 * Resume - Portfolio resume/CV content
 *
 * Styled HTML resume optimized for scanning (Rachel's 30-second path).
 * Includes experience, skills, and education sections.
 * Window default: 600x500px.
 */
export function Resume() {
  return (
    <div className={styles.container} data-testid="resume-content">
      <header className={styles.header}>
        <h1 className={styles.name}>Nick Smith</h1>
        <p className={styles.contact}>
          nick@example.com • San Francisco, CA • github.com/nicksmith
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Experience</h2>

        <div className={styles.job}>
          <div className={styles.jobHeader}>
            <strong>Senior Software Engineer</strong>
            <span className={styles.date}>2022 - Present</span>
          </div>
          <div className={styles.company}>Tech Company Inc.</div>
          <ul className={styles.achievements}>
            <li>Led development of core platform features using React and TypeScript</li>
            <li>Improved application performance by 40% through optimization</li>
            <li>Mentored junior developers and established best practices</li>
          </ul>
        </div>

        <div className={styles.job}>
          <div className={styles.jobHeader}>
            <strong>Software Engineer</strong>
            <span className={styles.date}>2019 - 2022</span>
          </div>
          <div className={styles.company}>Startup Co.</div>
          <ul className={styles.achievements}>
            <li>Built full-stack features from concept to deployment</li>
            <li>Implemented CI/CD pipelines reducing deployment time by 60%</li>
            <li>Collaborated with design team on user experience improvements</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        <div className={styles.skills}>
          <div className={styles.skillCategory}>
            <strong>Languages:</strong> TypeScript, JavaScript, Python, Go
          </div>
          <div className={styles.skillCategory}>
            <strong>Frontend:</strong> React, Next.js, CSS, Tailwind
          </div>
          <div className={styles.skillCategory}>
            <strong>Backend:</strong> Node.js, PostgreSQL, Redis, GraphQL
          </div>
          <div className={styles.skillCategory}>
            <strong>Tools:</strong> Git, Docker, AWS, GitHub Actions
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Education</h2>
        <div className={styles.education}>
          <strong>B.S. Computer Science</strong>
          <span className={styles.date}>2019</span>
          <div className={styles.school}>University of Technology</div>
        </div>
      </section>
    </div>
  );
}
