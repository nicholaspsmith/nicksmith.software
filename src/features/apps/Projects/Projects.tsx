import styles from './Projects.module.css';

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

const PROJECTS: Project[] = [
  {
    id: 'tiger-portfolio',
    name: 'Tiger Portfolio',
    description:
      'This very website! A faithful recreation of Mac OS X Tiger as a portfolio site, built with React, TypeScript, and Zustand.',
    technologies: ['React', 'TypeScript', 'Zustand', 'CSS Modules'],
  },
  {
    id: 'project-2',
    name: 'Project Two',
    description:
      'A full-stack application demonstrating modern development practices with comprehensive testing and CI/CD.',
    technologies: ['Node.js', 'PostgreSQL', 'Docker', 'GitHub Actions'],
  },
  {
    id: 'project-3',
    name: 'Project Three',
    description:
      'An open-source library that simplifies complex operations with an intuitive API and thorough documentation.',
    technologies: ['TypeScript', 'Jest', 'npm', 'Rollup'],
  },
];

/**
 * Projects - Portfolio projects showcase
 *
 * Displays project cards with name, description, and technologies.
 * Scrollable for many projects. Window default: 700x500px.
 */
export function Projects() {
  return (
    <div className={styles.container} data-testid="projects-content">
      <h1 className={styles.title}>Projects</h1>
      <p className={styles.subtitle}>
        A selection of work I'm proud of. Click a project to learn more.
      </p>

      <div className={styles.grid}>
        {PROJECTS.map((project) => (
          <article
            key={project.id}
            className={styles.card}
            data-testid={`project-card-${project.id}`}
          >
            <h2 className={styles.cardTitle}>{project.name}</h2>
            <p className={styles.cardDescription}>{project.description}</p>
            <div className={styles.technologies}>
              {project.technologies.map((tech) => (
                <span key={tech} className={styles.tech}>
                  {tech}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
