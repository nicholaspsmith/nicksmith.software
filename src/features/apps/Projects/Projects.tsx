import styles from './Projects.module.css';

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  logo?: string;
}

const PROJECTS: Project[] = [
  {
    id: 'tiger-portfolio',
    name: 'Retro Portfolio',
    description:
      'This very website! Features a Mac OS X Tiger desktop interface and an iOS 15+ mobile interface, both fully interactive with functional apps.',
    technologies: ['React', 'TypeScript', 'Zustand', 'Framer Motion', 'CSS Modules'],
    link: 'https://github.com/nicholaspsmith/nicksmith.software',
    logo: '/icons/finder.png',
  },
  {
    id: 'lance-context',
    name: 'lance-context',
    description:
      'An MCP plugin enabling semantic code search for Claude Code and compatible AI agents. Provides deep context from your entire codebase through natural language queries using LanceDB vector storage.',
    technologies: ['TypeScript', 'LanceDB', 'MCP SDK', 'Jina AI'],
    link: 'https://github.com/nicholaspsmith/lance-context',
    logo: '/icons/lance-context-logo.svg',
  },
  {
    id: 'loopi',
    name: 'Loopi',
    description:
      'Learn through conversation with Claude and convert those conversations into flashcards for spaced repetition practice. Features FSRS-based scheduling and progress tracking.',
    technologies: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'LanceDB', 'Claude API'],
    link: 'https://github.com/nicholaspsmith/Loopi',
    logo: '/icons/loopi-logo.svg',
  },
  {
    id: 'vidsnatch',
    name: 'VidSnatch',
    description:
      'A macOS application for downloading videos from numerous platforms. Integrates a Chrome extension with a native menu bar app for one-click video downloads with real-time progress tracking.',
    technologies: ['Python', 'JavaScript', 'yt-dlp', 'Chrome Extension'],
    link: 'https://github.com/nicholaspsmith/VidSnatch',
    logo: '/icons/vidsnatch-logo.png',
  },
  {
    id: 'centrifugue',
    name: 'Centrifugue',
    description:
      'A Firefox/Zen Browser extension that extracts audio stems from YouTube videos using Demucs, Meta\'s AI audio separation model. Supports one-click MP3 downloads with AI-powered stem separation into vocals, drums, bass, and other components.',
    technologies: ['JavaScript', 'Python', 'Demucs', 'yt-dlp', 'FFmpeg'],
    link: 'https://github.com/nicholaspsmith/Centrifugue',
    logo: '/icons/centrifugue-logo.svg',
  },
  {
    id: 'obsidian-c-scribe',
    name: 'Obsidian C-Scribe',
    description:
      'An AI-enhanced voice transcription plugin for Obsidian. Record voice notes, transcribe via AssemblyAI with multi-speaker detection, and generate structured summaries using Claude.',
    technologies: ['TypeScript', 'Obsidian API', 'AssemblyAI', 'Claude API'],
    link: 'https://github.com/nicholaspsmith/Obsidian-C-Scribe',
    logo: '/icons/c-scribe.png',
  },
];

/**
 * Projects - Portfolio projects showcase
 *
 * Displays project cards with name, description, and technologies.
 * Scrollable for many projects. Window default: 625x595px.
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
          <a
            key={project.id}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cardLink}
            data-testid={`project-card-${project.id}`}
          >
            <article className={styles.card}>
              {project.logo && (
                <img
                  src={project.logo}
                  alt=""
                  className={styles.logo}
                  draggable={false}
                />
              )}
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{project.name}</h2>
                <p className={styles.cardDescription}>{project.description}</p>
                <div className={styles.technologies}>
                  {project.technologies.map((tech) => (
                    <span key={tech} className={styles.tech}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </a>
        ))}
      </div>
    </div>
  );
}
