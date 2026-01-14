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

  // Homework documents (Nick as a sophomore in 2005)
  'history-essay': `The Causes and Effects of the American Civil War
By Nick Smith
Period 3 - Mrs. Overley
October 17, 2005

The American Civil War (1861-1865) was one of the bloodiest conflicts in United States history. It was fought between the Northern states (the Union) and the Southern states (the Confederacy). There were many causes that led to this war, but the main ones were slavery, states rights, and economic differences.

CAUSES OF THE CIVIL WAR

The biggest cause of the Civil War was slavery. The Southern economy depended on slavery for their cotton plantations. The North wanted to abolish slavery because they thought it was wrong. When Abraham Lincoln was elected president in 1860, the Southern states were afraid he would end slavery, so they seceded from the Union.

States rights was another big issue. The South believed that states should have more power than the federal government. They thought each state should be able to decide whether to allow slavery or not. The North believed the federal government should have the power to regulate slavery.

The economies of the North and South were very different. The North had more factories and industry. The South was mostly agricultural and relied on slave labor to grow cotton and tobacco. These economic differences caused tension between the two regions.

EFFECTS OF THE CIVIL WAR

The Civil War had many lasting effects on America. The most important was the end of slavery. The 13th Amendment abolished slavery in 1865. This was a huge change for the country, even though it took a long time for African Americans to get equal rights.

The war also caused a lot of destruction, especially in the South. Many cities were destroyed and the economy was ruined. It took decades for the South to rebuild during a period called Reconstruction.

Over 620,000 soldiers died in the Civil War, making it the deadliest war in American history. This is more than all other American wars combined up to that point.

CONCLUSION

The Civil War was a turning point in American history. It ended slavery and preserved the Union, but it came at a terrible cost. The effects of the war can still be felt today in how we think about race and federal vs state power.

Sources:
- American History Textbook, Chapter 16
- www.civilwar.com
- Encyclopedia Britannica`,

  'english-vocab': `English II Vocabulary List - Unit 4
Mr. Keen
Due: Friday, October 21, 2005

Remember: Quiz on Friday! Know definitions AND be able to use in a sentence!

1. AMBIGUOUS (adj.) - having more than one possible meaning; unclear
   Sentence: The ending of the movie was ambiguous so nobody knew if the hero survived.

2. BENEVOLENT (adj.) - kind, generous, charitable
   Sentence: The benevolent old man donated money to build a new library.

3. CANDID (adj.) - honest, straightforward, frank
   Sentence: My mom gave me her candid opinion about my haircut and said it looked bad.

4. DILIGENT (adj.) - hardworking, showing care and effort
   Sentence: The diligent student always finished her homework on time.

5. ELOQUENT (adj.) - fluent and persuasive in speaking or writing
   Sentence: Martin Luther King Jr. was an eloquent speaker who inspired millions.

6. FRUGAL (adj.) - careful with money, not wasteful
   Sentence: My dad is frugal and never buys anything that's not on sale.

7. GREGARIOUS (adj.) - sociable, enjoys being with others
   Sentence: My gregarious friend knows everyone at school.

8. HYPOTHESIS (n.) - a proposed explanation that can be tested
   Sentence: Our hypothesis was that plants grow faster with more sunlight.

9. INEVITABLE (adj.) - certain to happen, unavoidable
   Sentence: Getting homework in high school is inevitable.

10. JUBILANT (adj.) - feeling or expressing great joy
    Sentence: The team was jubilant after winning the championship game.

BONUS WORDS (extra credit):

11. METICULOUS (adj.) - very careful and precise
    Sentence: She was meticulous about organizing her CD collection alphabetically.

12. NOSTALGIA (n.) - sentimental longing for the past
    Sentence: Looking at old photos filled him with nostalgia.

---
Note to self: Ask Mike if I can borrow his notes from Tuesday. I was at the orthodontist getting my braces tightened. Also need to finish reading Chapter 7 of To Kill a Mockingbird by Monday.

AIM me if you want to study together - sn: xXnick2005Xx`,

  'math-homework': `Algebra II - Chapter 5 Homework
Mrs. Ramos
Due: Wednesday, October 19, 2005

Name: Nick Smith
Period: 5

SECTION 5.1 - Solving Quadratic Equations

1) x² + 5x + 6 = 0
   (x + 2)(x + 3) = 0
   x = -2 or x = -3  ✓

2) x² - 9 = 0
   (x + 3)(x - 3) = 0
   x = 3 or x = -3  ✓

3) 2x² + 7x + 3 = 0
   (2x + 1)(x + 3) = 0
   x = -1/2 or x = -3  ✓

4) x² - 4x - 12 = 0
   (x - 6)(x + 2) = 0
   x = 6 or x = -2  ✓

5) 3x² - 12 = 0
   3x² = 12
   x² = 4
   x = 2 or x = -2  ✓

SECTION 5.2 - The Quadratic Formula

For problems 6-10, use the quadratic formula: x = (-b ± √(b²-4ac)) / 2a

6) x² + 2x - 8 = 0
   a=1, b=2, c=-8
   x = (-2 ± √(4+32)) / 2
   x = (-2 ± √36) / 2
   x = (-2 ± 6) / 2
   x = 2 or x = -4  ✓

7) 2x² - 5x + 2 = 0
   a=2, b=-5, c=2
   x = (5 ± √(25-16)) / 4
   x = (5 ± √9) / 4
   x = (5 ± 3) / 4
   x = 2 or x = 1/2  ✓

8) x² + 4x + 1 = 0
   a=1, b=4, c=1
   x = (-4 ± √(16-4)) / 2
   x = (-4 ± √12) / 2
   x = (-4 ± 2√3) / 2
   x = -2 ± √3  ✓

9) SKIPPED - will ask mr thompson tomorrow

10) x² - 6x + 9 = 0
    a=1, b=-6, c=9
    x = (6 ± √(36-36)) / 2
    x = (6 ± 0) / 2
    x = 3  (one solution - perfect square!)  ✓

WORD PROBLEMS

11) A ball is thrown upward with initial velocity of 48 ft/s from a height of 4 ft.
    The height h after t seconds is: h = -16t² + 48t + 4
    When does the ball hit the ground? (h = 0)

    0 = -16t² + 48t + 4
    Using quadratic formula:
    t = (-48 ± √(2304 + 256)) / -32
    t = (-48 ± √2560) / -32
    t ≈ (-48 ± 50.6) / -32
    t ≈ 3.08 seconds (ignore negative answer)

    The ball hits the ground after about 3.08 seconds.

---
NOTES: Remember to bring calculator tomorrow. Also need to study for quiz on Friday. This stuff is actually kinda fun once you get the hang of it.

Practice problems from textbook: pg 287 #1-15 odd`,
};

/**
 * Check if a document ID is a built-in document
 */
export function isBuiltInDocument(documentId: string): boolean {
  return documentId in DEFAULT_CONTENT;
}
