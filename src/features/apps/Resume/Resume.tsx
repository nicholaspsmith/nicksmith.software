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
        <h1 className={styles.name}>Nicholas Smith</h1>
        <p className={styles.title}>Senior Software Engineer</p>
        <p className={styles.contact}>
          Charleston, SC • me@nicksmith.software • github.com/nicholaspsmith
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Experience</h2>

        <div className={styles.job}>
          <div className={styles.jobHeader}>
            <strong>Senior Software Engineer (Tech Lead)</strong>
            <span className={styles.date}>Nov 2022 - Jul 2025</span>
          </div>
          <div className={styles.company}>MongoDB, Remote</div>
          <ul className={styles.achievements}>
            <li>Led migration of mongodb.com from in-house CMS to Contentstack, managing 6+ engineers globally</li>
            <li>Enabled 5x faster page publishing (150 vs 30 per batch) via Next.js/React/TypeScript architecture</li>
            <li>Cut production deployment time 50% via CI/CD optimization and Next.js ISR implementation</li>
            <li>Reduced CSS bundle sizes 40%+ through optimized Tailwind/Next.js integration</li>
          </ul>
        </div>

        <div className={styles.job}>
          <div className={styles.jobHeader}>
            <strong>Senior Software Engineer UI</strong>
            <span className={styles.date}>Oct 2019 - Dec 2022</span>
          </div>
          <div className={styles.company}>Cisco Systems, Remote</div>
          <ul className={styles.achievements}>
            <li>Built threat correlation dashboard aggregating data from Duo, Meraki, Umbrella, and more</li>
            <li>Created modular threat visualization widgets using React, D3, and Recharts</li>
            <li>Developed POC for Threat Context feature, leading to its adoption as standalone product</li>
          </ul>
        </div>

        <div className={styles.job}>
          <div className={styles.jobHeader}>
            <strong>Senior Technologist</strong>
            <span className={styles.date}>Jun 2018 - Jan 2019</span>
          </div>
          <div className={styles.company}>Handsome, Austin, TX</div>
          <ul className={styles.achievements}>
            <li>Developed mobile/web applications for startups and Fortune 50 companies across 4 continents</li>
          </ul>
        </div>

        <div className={styles.job}>
          <div className={styles.jobHeader}>
            <strong>Founder / Principal Engineer</strong>
            <span className={styles.date}>Jan 2015 - Jan 2019</span>
          </div>
          <div className={styles.company}>Dreamline Studios, LLC, Austin, TX</div>
          <ul className={styles.achievements}>
            <li>Built real-time inventory platform saving $60,000+/year, reducing count time from 8hrs to 3hrs</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        <div className={styles.skills}>
          <div className={styles.skillCategory}>
            <strong>Frontend:</strong> React, Next.js, TypeScript, JavaScript, Vue.js, Angular, Tailwind, SCSS
          </div>
          <div className={styles.skillCategory}>
            <strong>Backend:</strong> Node.js, Python, GraphQL, MongoDB, MySQL
          </div>
          <div className={styles.skillCategory}>
            <strong>Tools:</strong> AWS, Docker, Cypress, Jest, D3, Recharts, Figma, Contentstack
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Education</h2>
        <div className={styles.education}>
          <strong>BSBA Management Information Systems</strong>
          <span className={styles.date}>2013</span>
          <div className={styles.school}>University of Arizona</div>
        </div>
        <div className={styles.education}>
          <strong>Full Stack Developer Certification</strong>
          <span className={styles.date}>2013</span>
          <div className={styles.school}>Hack Reactor</div>
        </div>
      </section>
    </div>
  );
}
