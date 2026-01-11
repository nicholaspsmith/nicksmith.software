/**
 * Default content for TextEdit documents
 *
 * These are the initial contents shown when documents are opened.
 * Users can edit and save their own versions to localStorage.
 */

export const DEFAULT_CONTENT: Record<string, string> = {
  about: `Nick Smith
Senior Software Engineer

Hey there! I'm a frontend-focused engineer with 12+ years of experience building web platforms at companies like MongoDB and Cisco. I love turning complex problems into clean, intuitive interfaces: whether that's threat intelligence dashboards or large-scale CMS migrations.

This portfolio is my tribute to Mac OS X Tiger, an OS that shaped my appreciation for thoughtful design. I'm currently exploring AI-assisted development and working on several projects, including Loopi, an open-source spaced repetition learning app, and lance-context, a semantic code search tool for AI coding agents. When I'm not coding, I volunteer as an ESL instructor and practice my Mandarin.

HIGHLIGHTS
• 12+ years building scalable web platforms
• Tech Lead at MongoDB, led CMS migration for mongodb.com
• Expert in React, Next.js, TypeScript, and data visualization
• Hack Reactor alum, University of Arizona BSBA`,

  projects: `Projects
A selection of work I'm proud of.

TIGER PORTFOLIO
This very website! A faithful recreation of Mac OS X Tiger as a portfolio site, built with React, TypeScript, and Zustand.
Technologies: React, TypeScript, Zustand, CSS Modules
https://github.com/nicholaspsmith/nicksmith.software

LANCE-CONTEXT
An MCP plugin enabling semantic code search for Claude Code and compatible AI agents. Provides deep context from your entire codebase through natural language queries using LanceDB vector storage.
Technologies: TypeScript, LanceDB, MCP SDK, Jina AI
https://github.com/nicholaspsmith/lance-context

LOOPI
Learn through conversation with Claude and convert those conversations into flashcards for spaced repetition practice. Features FSRS-based scheduling and progress tracking.
Technologies: Next.js, React, TypeScript, PostgreSQL, LanceDB, Claude API
https://github.com/nicholaspsmith/Loopi

VIDSNATCH
A macOS application for downloading videos from numerous platforms. Integrates a Chrome extension with a native menu bar app for one-click video downloads with real-time progress tracking.
Technologies: Python, JavaScript, yt-dlp, Chrome Extension
https://github.com/nicholaspsmith/VidSnatch

CENTRIFUGUE
A Firefox/Zen Browser extension that extracts audio stems from YouTube videos using Demucs, Meta's AI audio separation model. Supports one-click MP3 downloads with AI-powered stem separation into vocals, drums, bass, and other components.
Technologies: JavaScript, Python, Demucs, yt-dlp, FFmpeg
https://github.com/nicholaspsmith/Centrifugue`,

  resume: `NICHOLAS SMITH
Senior Software Engineer
Charleston, SC • me@nicksmith.software • github.com/nicholaspsmith

EXPERIENCE

Senior Software Engineer (Tech Lead)
MongoDB, Remote
Nov 2022 - Jul 2025
• Led migration of mongodb.com from in-house CMS to Contentstack, managing 6+ engineers globally
• Enabled 5x faster page publishing (150 vs 30 per batch) via Next.js/React/TypeScript architecture
• Cut production deployment time 50% via CI/CD optimization and Next.js ISR implementation
• Reduced CSS bundle sizes 40%+ through optimized Tailwind/Next.js integration

Senior Software Engineer UI
Cisco Systems, Remote
Oct 2019 - Dec 2022
• Built threat correlation dashboard aggregating data from Duo, Meraki, Umbrella, and more
• Created modular threat visualization widgets using React, D3, and Recharts
• Developed POC for Threat Context feature, leading to its adoption as standalone product

Senior Technologist
Handsome, Austin, TX
Jun 2018 - Jan 2019
• Developed mobile/web applications for startups and Fortune 50 companies across 4 continents

Founder / Principal Engineer
Dreamline Studios, LLC, Austin, TX
Jan 2015 - Jan 2019
• Built real-time inventory platform saving $60,000+/year, reducing count time from 8hrs to 3hrs

SKILLS

Frontend: React, Next.js, TypeScript, JavaScript, Vue.js, Angular, Tailwind, SCSS
Backend: Node.js, Python, GraphQL, MongoDB, MySQL
Tools: AWS, Docker, Cypress, Jest, D3, Recharts, Figma, Contentstack

EDUCATION

BSBA Management Information Systems - 2013
University of Arizona

Full Stack Developer Certification - 2013
Hack Reactor`,

  contact: `Get in Touch

I'd love to hear from you! Feel free to reach out through any of these channels.

Email: me@nicksmith.software
LinkedIn: linkedin.com/in/nps90
GitHub: github.com/nicholaspsmith

Based in Charleston, SC. Open to remote opportunities.`,
};

/**
 * Check if a document ID is a built-in document
 */
export function isBuiltInDocument(documentId: string): boolean {
  return documentId in DEFAULT_CONTENT;
}
