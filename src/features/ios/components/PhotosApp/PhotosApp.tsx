import { NavigationBar } from '../NavigationBar';
import styles from './PhotosApp.module.css';

export interface PhotosAppProps {
  /** Handler to go back to home screen */
  onBack: () => void;
}

/**
 * Project data for display
 */
const PROJECTS = [
  {
    id: 'portfolio',
    title: 'This Portfolio',
    description: 'Mac OS X Tiger & iOS 6 recreation',
    tech: ['React', 'TypeScript', 'Framer Motion'],
    color: '#FF9500',
  },
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    description: 'Real-time data visualization platform',
    tech: ['React', 'D3.js', 'WebSocket'],
    color: '#5AC8FA',
  },
  {
    id: 'mobile-app',
    title: 'Mobile App',
    description: 'Cross-platform fitness tracker',
    tech: ['React Native', 'Node.js', 'MongoDB'],
    color: '#4CD964',
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Platform',
    description: 'Full-stack shopping experience',
    tech: ['Next.js', 'Stripe', 'PostgreSQL'],
    color: '#FF3B30',
  },
  {
    id: 'design-system',
    title: 'Design System',
    description: 'Component library with Storybook',
    tech: ['React', 'Storybook', 'Styled Components'],
    color: '#AF52DE',
  },
  {
    id: 'api-platform',
    title: 'API Platform',
    description: 'RESTful API with GraphQL layer',
    tech: ['Node.js', 'GraphQL', 'Redis'],
    color: '#007AFF',
  },
];

/**
 * Photos App - iOS 6 style
 *
 * Displays Projects as a photo grid with:
 * - Thumbnail grid layout
 * - Photo-style cards with polaroid effect
 * - Project info overlay
 */
export function PhotosApp({ onBack }: PhotosAppProps) {
  return (
    <div className={styles.app} data-testid="ios-photos-app">
      <NavigationBar title="Projects" backLabel="Home" onBack={onBack} />

      <div className={styles.content}>
        <div className={styles.grid}>
          {PROJECTS.map((project) => (
            <div key={project.id} className={styles.photoCard}>
              {/* Project thumbnail */}
              <div
                className={styles.thumbnail}
                style={{ backgroundColor: project.color }}
              >
                <span className={styles.projectIcon}>
                  {project.title.charAt(0)}
                </span>
              </div>

              {/* Project info */}
              <div className={styles.info}>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>
                <div className={styles.techStack}>
                  {project.tech.map((t) => (
                    <span key={t} className={styles.techTag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
