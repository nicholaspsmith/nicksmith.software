import { NavigationBar } from '../NavigationBar';
import styles from './IBooksApp.module.css';

export interface IBooksAppProps {
  /** Handler to go back to home screen */
  onBack: () => void;
}

/**
 * iBooks App - iOS 6 style
 *
 * Displays Resume content with:
 * - Wooden bookshelf navigation bar
 * - Paper-textured content area
 * - Book page styling
 */
export function IBooksApp({ onBack }: IBooksAppProps) {
  return (
    <div className={styles.app} data-testid="ios-ibooks-app">
      <NavigationBar
        title="Resume"
        backLabel="Home"
        onBack={onBack}
        variant="wood"
      />

      <div className={styles.bookContent}>
        <div className={styles.page}>
          {/* Header */}
          <header className={styles.header}>
            <h1 className={styles.name}>Nick Smith</h1>
            <p className={styles.title}>Senior Frontend Engineer</p>
          </header>

          {/* Summary */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Summary</h2>
            <p className={styles.text}>
              Passionate frontend engineer with 8+ years of experience building
              performant, accessible web applications. Specialized in React,
              TypeScript, and creating delightful user experiences with
              attention to detail.
            </p>
          </section>

          {/* Experience */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>

            <div className={styles.job}>
              <div className={styles.jobHeader}>
                <h3 className={styles.jobTitle}>Senior Frontend Engineer</h3>
                <span className={styles.jobDate}>2021 - Present</span>
              </div>
              <p className={styles.company}>Tech Company Inc.</p>
              <ul className={styles.achievements}>
                <li>Led frontend architecture for flagship product</li>
                <li>Improved performance by 40% through optimization</li>
                <li>Mentored team of 5 junior developers</li>
              </ul>
            </div>

            <div className={styles.job}>
              <div className={styles.jobHeader}>
                <h3 className={styles.jobTitle}>Frontend Developer</h3>
                <span className={styles.jobDate}>2018 - 2021</span>
              </div>
              <p className={styles.company}>Startup Co.</p>
              <ul className={styles.achievements}>
                <li>Built component library used across 3 products</li>
                <li>Implemented design system from scratch</li>
                <li>Reduced bundle size by 60%</li>
              </ul>
            </div>
          </section>

          {/* Skills */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className={styles.skills}>
              <span className={styles.skill}>React</span>
              <span className={styles.skill}>TypeScript</span>
              <span className={styles.skill}>JavaScript</span>
              <span className={styles.skill}>CSS/Sass</span>
              <span className={styles.skill}>Node.js</span>
              <span className={styles.skill}>GraphQL</span>
              <span className={styles.skill}>Testing</span>
              <span className={styles.skill}>Performance</span>
            </div>
          </section>

          {/* Education */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            <div className={styles.education}>
              <h3 className={styles.degree}>B.S. Computer Science</h3>
              <p className={styles.school}>University of Technology</p>
              <p className={styles.eduDate}>2014 - 2018</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
