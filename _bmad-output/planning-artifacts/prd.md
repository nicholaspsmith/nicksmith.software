---
stepsCompleted: [1, 2, 3, 4, 5-skipped, 6-skipped, 7, 8, 9, 10, 11]
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-nicksmith.software-2026-01-07.md'
  - '_bmad-output/planning-artifacts/research/technical-tiger-ios6-implementation-research-2026-01-07.md'
  - '_bmad-output/analysis/brainstorming-session-2026-01-07.md'
  - '_bmad-output/planning-artifacts/portfolio-project-context.md'
workflowType: 'prd'
lastStep: 2
date: '2026-01-07'
author: 'Nick'
project_name: 'nicksmith.software'
documentCounts:
  briefs: 1
  research: 1
  brainstorming: 1
  projectDocs: 1
---

# Product Requirements Document - nicksmith.software

**Author:** Nick
**Date:** 2026-01-07

---

## Executive Summary

nicksmith.software is a portfolio website that replaces conventional static portfolios with an interactive recreation of Mac OS X Tiger (10.4) for desktop visitors and iOS 6 for mobile visitors. The site demonstrates senior-level frontend engineering competence through its implementation - the portfolio IS the proof of skill.

Visitors experience authentic Apple UI paradigms from 2005 and 2012 respectively, with portfolio content (About Me, Projects, Resume, Contact) presented as native applications within each environment. The desktop metaphor provides universal intuitive navigation regardless of whether visitors recognize the specific OS being emulated.

**Core Value Proposition:**
- **For recruiters (30 seconds):** Instantly memorable, easy navigation to resume/contact via familiar desktop icons
- **For engineering managers (10+ minutes):** Progressive depth reveals craftsmanship - smooth animations, working Terminal, Easter eggs demonstrate attention to detail
- **For the candidate:** The implementation itself serves as the strongest proof of frontend engineering capability

### What Makes This Special

**Demonstrated Craftsmanship Over Claims:** Unlike traditional portfolios that list skills, this site proves them. The authentic genie effect, 60fps animations, keyboard shortcuts, and attention to timing all signal "this person builds with care" - regardless of whether the viewer has nostalgia for Tiger.

**Dual-Audience Optimization:** The same interface serves two completely different evaluation modes:
- Surface clarity enables the 30-second recruiter scan
- Discoverable depth rewards the 10-minute engineering deep-dive

**Progressive Disclosure:** Easter eggs (Terminal games, Flappy Bird), hidden commands, and authentic OS behaviors reward curiosity while keeping the primary navigation path clean and obvious.

**Memorable Differentiation:** In a sea of identical portfolio templates, "the Mac OS Tiger portfolio guy" is impossible to forget.

---

## Project Classification

**Technical Type:** Web Application (SPA)
**Domain:** General (Personal Portfolio)
**Complexity:** Low (standard web development, no regulatory requirements)
**Project Context:** Greenfield - new project with comprehensive planning artifacts

**Technology Stack:**
- React 18+ with TypeScript
- Vite for build tooling
- Zustand for state management
- react-rnd for window interactions
- Framer Motion for animations
- CSS Custom Properties for Aqua theming

---

## Success Criteria

### User Success

**Rachel (Recruiter) - 30-Second Path:**
| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to find Resume | < 15 seconds | Click path analytics |
| Time to find Contact | < 20 seconds | Click path analytics |
| Candidate recall | Remembered in discussion | Interview feedback |
| Forward rate | Forwards to hiring manager | Exit behavior |

**Marcus (Engineering Manager) - 10+ Minute Path:**
| Metric | Target | Measurement |
|--------|--------|-------------|
| Session duration | > 5 minutes | Time on site |
| Interaction depth | 3+ windows opened | Event tracking |
| Terminal exploration | Opens Terminal | Event tracking |
| Easter egg discovery | Finds at least 1 | Hidden event triggers |
| Craft impression | "This person builds with care" | Interview feedback |

### Business Success

**Primary Goal:** Secure a senior frontend engineering position at a company that values craft.

| Metric | Target | Timeframe |
|--------|--------|-----------|
| Interview conversion | Portfolio link → Interview request | Within 2 weeks of application |
| Positive mention | HM references portfolio in interview | During interview process |
| Differentiation | Candidate remembered vs. others | End of hiring cycle |
| Offer rate | Interviews → Offers | Job search period |

**Secondary Goals:**
- Professional network growth through social sharing
- Personal brand: "craft-focused frontend engineer"
- Viral potential on Twitter/HN/Reddit

### Technical Success

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| First Contentful Paint | < 1.5s | Fast load = professional impression |
| Largest Contentful Paint | < 2.5s | Core Web Vitals compliance |
| Animation frame rate | 60fps sustained | Smooth = demonstrates performance skill |
| Lighthouse Performance | > 90 | Validates technical quality |
| Lighthouse Accessibility | > 90 | Inclusive design |
| Browser support | Chrome, Safari, Firefox (latest) | Cross-browser competence |
| Zero console errors | 0 errors in production | Professional polish |

### Measurable Outcomes

**MVP Launch Criteria:**
- [ ] All core features functional (window system, desktop, icons, menu bar)
- [ ] Portfolio content complete (About, Projects, Resume, Contact)
- [ ] 60fps animations on desktop browsers
- [ ] FCP < 2 seconds on 3G connection
- [ ] Works on Chrome/Safari/Firefox latest

**Success Validation:**
- At least one "I loved your portfolio" comment in interview
- Portfolio mentioned positively by hiring manager
- Social share or HN/Reddit discussion

---

## Product Scope

### MVP - Minimum Viable Product

**Desktop Environment (Must Have):**
- Tiger desktop with Aqua wallpaper
- Custom Tiger-era cursor
- Desktop icons: Resume, Projects, About Me, Contact
- Icon grid snapping
- Menu bar with Apple menu

**Window System (Must Have):**
- Draggable, resizable windows (react-rnd)
- Window chrome with traffic light buttons
- Focus management (z-index)
- Basic minimize (fade animation)
- Authentic Aqua styling

**Portfolio Content (Must Have):**
- About Me window
- Projects window with project cards
- Resume window (PDF or styled content)
- Contact form window
- Startup chime on load

**Polish (Must Have):**
- Basic keyboard shortcuts (⌘W, ⌘M)
- Responsive at desktop breakpoints (>1024px)

### Growth Features (Post-MVP)

**Phase 2 - Core Polish:**
- Genie effect minimize animation
- Dock with application icons
- Terminal with xterm.js (basic commands)
- Sosumi error sound
- Window shade (double-click title bar)

**Phase 3 - iOS 6 Mobile:**
- iOS 6 home screen for mobile breakpoints
- iOS apps: Notes, Photos, iBooks, Mail
- "Reboot" transition between desktop/mobile
- Touch-optimized interactions

### Vision (Future)

**Phase 4 - Delight:**
- Marble Blast Gold playable embed
- Terminal Easter eggs (Snake, ELIZA psychotherapist)
- Flappy Bird hidden in iOS folder
- System Preferences with working options

**Phase 5 - Full Experience:**
- Dock magnification on hover
- Full Tiger keyboard shortcuts
- Shutdown/restart sequences
- Chess game (if web implementation found)
- Context menus (right-click desktop)

---

## User Journeys

### Journey 1: Rachel Chen - The 30-Second Decision

Rachel is a technical recruiter at Stripe who reviews 80+ candidate profiles every day. It's 4:47 PM on a Thursday, and she has 23 more portfolios to review before her 5:30 call with the hiring manager. Most portfolios blur together - the same Bootstrap templates, the same "passionate developer" taglines, the same forgettable project cards.

She clicks Nick's portfolio link expecting more of the same. Instead, her screen transforms into something that makes her pause mid-sip of her cold coffee. "Wait... is this Mac OS?" She recognizes the interface immediately - it looks like her first computer from college. There's a familiar desktop with icons clearly labeled: Resume, Projects, About Me, Contact.

Without thinking, she double-clicks the Resume icon. A window opens with that satisfying animation, and there's the resume - clean, readable, exactly where she expected it to be. She scans the experience section: 12 years, React, TypeScript, the companies check out. She clicks the Contact icon, and a window opens with a simple form.

She minimizes both windows and notices the smooth animation. She tries dragging a window around - it's responsive, polished. This isn't a template. Someone *built* this.

Rachel screenshots the desktop and pastes it into Slack: "Marcus - you need to see this one. The Mac OS portfolio guy. Forwarding his resume now."

**The breakthrough:** In a sea of 80 identical portfolios, Rachel not only remembers Nick - she actively advocates for him. The portfolio did something no resume bullet point could: it proved competence through demonstration.

---

### Journey 2: Marcus Williams - The 10-Minute Deep Dive

Marcus is a senior engineering manager at Stripe, and Rachel just pinged him about "the Mac OS portfolio guy." He's skeptical - he's seen clever portfolios before that fall apart under scrutiny. But Rachel rarely gets excited about candidates, so he clicks the link.

The Tiger desktop loads, and Marcus grins. He actually used this OS in his first dev job. But nostalgia isn't what he's evaluating - he's looking for evidence of real engineering skill.

He starts testing. He drags a window - smooth, no jank. He tries resizing from different corners - handles correctly. He opens multiple windows and clicks between them - z-index management works. He tries ⌘W - the window closes. ⌘M - it minimizes with a clean animation. "Okay, this person knows their keyboard shortcuts."

Marcus opens the Projects window and scans the work history. Solid experience, but he's seen solid experience before. What he hasn't seen is someone who would build their portfolio as a functioning operating system recreation.

He notices a Terminal icon and double-clicks it. A command prompt appears: `nick@tiger ~ $`. He types `help` and sees a list of commands. He types `ls` and sees files. He tries `cat resume.txt` and it works. He types `sl` (a common typo for `ls`) and... a steam locomotive animation crosses the screen. Marcus laughs out loud.

He spends the next 8 minutes exploring. He finds a hidden game in the Terminal. He discovers that the System Preferences actually has working options. He tries to break things and can't.

Marcus messages Rachel: "Get him on the phone tomorrow. This is exactly the kind of engineer we need - someone who obsesses over details and actually ships polish."

**The breakthrough:** The portfolio didn't just list "attention to detail" as a skill - it demonstrated it hundreds of times across interactions Marcus didn't even know he was testing.

---

### Journey 3: Sarah Park - The Social Discovery

Sarah is a senior frontend developer at a fintech startup, doom-scrolling Twitter at 11 PM when she should be sleeping. A tweet catches her eye: "Just found the wildest dev portfolio - someone recreated Mac OS Tiger in React and it actually works."

The quote-tweet has 847 likes. Sarah clicks through, half-expecting disappointment.

Her developer brain immediately kicks in. She right-clicks and opens DevTools. React DevTools confirms it - this is a real React app. She inspects the window component and sees clean, semantic markup. She watches the Network tab while opening windows - no unnecessary requests, efficient bundling.

She opens the Performance tab and drags a window around. Solid 60fps. She tries the minimize animation and watches the flame chart - GPU-accelerated, no main thread jank. "Okay, this person actually knows what they're doing."

Sarah digs into the source. She finds the Zustand store managing window state - clean patterns, good separation of concerns. The CSS uses custom properties for theming - exactly how she'd do it. The animation code uses Framer Motion with proper layout animations.

She tweets: "Spent 20 minutes in DevTools on this Mac OS Tiger portfolio and I'm genuinely impressed. The window management, the state architecture, the animation performance - this is senior-level work disguised as a fun project. Whoever built this, we should talk."

Her tweet gets 234 likes and 12 quote-tweets from other engineers saying they had the same experience.

**The breakthrough:** The portfolio didn't just impress recruiters - it sparked peer recognition. Sarah's tweet reaches three hiring managers who weren't even looking at Nick's resume.

---

### Journey Requirements Summary

These journeys reveal the following capability requirements:

**From Rachel's Journey (30-Second Path):**
- Instant visual recognition and intrigue
- Clear, obvious navigation via desktop icons
- Fast window opening with satisfying feedback
- Resume content immediately readable
- Contact form easily accessible
- Screenshot-worthy visual design

**From Marcus's Journey (10-Minute Path):**
- Smooth window drag/resize (60fps)
- Correct z-index/focus management
- Working keyboard shortcuts (⌘W, ⌘M)
- Interactive Terminal with real commands
- Easter eggs that reward exploration
- No broken interactions or console errors
- System Preferences with functional options

**From Sarah's Journey (Technical Validation):**
- Clean React component architecture
- Efficient state management (Zustand)
- GPU-accelerated animations
- No performance bottlenecks
- Semantic, accessible markup
- Professional code organization
- Source code that impresses peers

---

## Web Application Requirements

### Technical Architecture

**Application Type:** Single Page Application (SPA)
**Framework:** React 18+ with TypeScript
**Build Tool:** Vite
**State Management:** Zustand
**Styling:** CSS Custom Properties + Tailwind CSS

### Browser Support Matrix

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | Latest 2 versions | Full support |
| Safari | Latest 2 versions | Full support |
| Firefox | Latest 2 versions | Full support |
| Edge | Latest 2 versions | Full support |
| Mobile Safari | iOS 14+ | Basic (MVP shows simplified view) |
| Chrome Mobile | Android 10+ | Basic (MVP shows simplified view) |

### Responsive Design Strategy

| Breakpoint | Experience | Priority |
|------------|------------|----------|
| ≥1024px | Full Tiger desktop | MVP |
| 768-1023px | Scaled Tiger desktop | Post-MVP |
| <768px | iOS 6 mobile (Phase 3) | Future |

**MVP Approach:** Desktop-first. Mobile visitors see a message directing them to desktop, with iOS 6 experience coming in Phase 3.

### Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Time to Interactive | < 3.0s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Total Bundle Size | < 500KB gzipped | Build analysis |
| Animation Frame Rate | 60fps sustained | Chrome DevTools |

### SEO Strategy

**Approach:** Minimal SEO - portfolio is linked directly from resumes and applications, not discovered via search.

**Implemented:**
- Semantic HTML structure
- Meta description and title
- Open Graph tags for social sharing (screenshot preview)
- Structured data for person/portfolio

**Not Needed:**
- Server-side rendering
- Dynamic meta tags
- Sitemap
- Blog/content SEO

### Accessibility Requirements

**Target:** WCAG 2.1 AA compliance where applicable to OS recreation context

| Requirement | Implementation |
|-------------|----------------|
| Keyboard navigation | Full keyboard support (Tab, Enter, Escape, ⌘ shortcuts) |
| Screen reader | ARIA labels on interactive elements |
| Focus indicators | Visible focus states on all interactive elements |
| Color contrast | 4.5:1 minimum for text |
| Reduced motion | Respect prefers-reduced-motion media query |

**Note:** Some OS recreation elements (drag/drop, window management) may have accessibility limitations. Alternative navigation paths will be provided.

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP - Deliver the authentic Tiger desktop experience with core portfolio functionality. The "wow factor" of the OS recreation is the product itself.

**Why This Approach:**
- The experience IS the differentiator - a stripped-down version loses the point
- Rachel's 30-second path requires polished visuals to be memorable
- Marcus's 10-minute path needs enough depth to explore
- Sarah's technical validation needs real engineering to inspect

**Resource Requirements:**
- Solo developer (Nick)
- Estimated MVP: 2-3 weeks focused development
- Technologies: All have been researched and validated

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- ✅ Rachel's Journey: Desktop icons → Resume/Contact → Forward to HM
- ✅ Marcus's Journey (partial): Window interactions, keyboard shortcuts, basic polish
- ✅ Sarah's Journey (partial): React architecture, state management, animations

**Must-Have Capabilities:**

| Feature | Journey Support | Priority |
|---------|-----------------|----------|
| Tiger desktop with Aqua wallpaper | All | Critical |
| Custom Tiger cursor | All | Critical |
| Desktop icons (Resume, Projects, About, Contact) | Rachel | Critical |
| Draggable, resizable windows | Marcus, Sarah | Critical |
| Window chrome (traffic lights) | Marcus | Critical |
| Focus management (z-index) | Marcus | Critical |
| Basic minimize (fade) | Marcus | High |
| Menu bar with Apple menu | Marcus | High |
| Startup chime | Rachel, Marcus | High |
| Basic shortcuts (⌘W, ⌘M) | Marcus | High |
| Portfolio content windows | Rachel | Critical |

### Post-MVP Features

**Phase 2 - Core Polish (Week 4-5):**
- Genie effect minimize animation
- Dock with application icons
- Terminal with xterm.js (basic commands)
- Sosumi error sound
- Window shade (double-click title bar)

**Phase 3 - iOS 6 Mobile (Week 6-8):**
- iOS 6 home screen for mobile breakpoints
- iOS apps: Notes, Photos, iBooks, Mail
- "Reboot" transition between desktop/mobile
- Touch-optimized interactions

**Phase 4 - Delight (Ongoing):**
- Marble Blast Gold embed
- Terminal Easter eggs (Snake, ELIZA)
- Flappy Bird hidden in iOS folder
- System Preferences with options

### Risk Mitigation Strategy

**Technical Risks:**
| Risk | Mitigation |
|------|------------|
| Genie effect complexity | Defer to Phase 2; use fade for MVP |
| xterm.js integration | Defer to Phase 2; Terminal not in MVP |
| Animation performance | GPU-accelerated transforms only; test early |
| react-rnd edge cases | Well-documented library; fallback to basic drag |

**Market Risks:**
| Risk | Mitigation |
|------|------------|
| Recruiters confused by UI | Clear desktop icons with familiar metaphor |
| Engineers unimpressed | Progressive depth via Easter eggs and code quality |
| Mobile visitors | Show "best on desktop" message; iOS 6 in Phase 3 |

**Resource Risks:**
| Risk | Mitigation |
|------|------------|
| Scope creep | Strict MVP definition; defer "nice to haves" |
| Time pressure | MVP-first; polish can come later |
| Burnout | Phased approach allows breaks between phases |

---

## Functional Requirements

### Capability Area 1: Desktop Environment

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR1 | Display Tiger desktop with authentic Aqua wallpaper at full viewport | Critical | MVP |
| FR2 | Render custom Tiger-era cursor replacing system cursor | Critical | MVP |
| FR3 | Display desktop icons in grid layout with snap-to-grid positioning | Critical | MVP |
| FR4 | Support icon double-click to open corresponding window | Critical | MVP |
| FR5 | Display menu bar with Apple menu and application-specific menus | High | MVP |
| FR6 | Update menu bar to reflect currently focused window's application | High | MVP |

### Capability Area 2: Window Management

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR7 | Enable window dragging via title bar with react-rnd | Critical | MVP |
| FR8 | Enable window resizing from all edges and corners | Critical | MVP |
| FR9 | Render window chrome with traffic light buttons (close, minimize, zoom) | Critical | MVP |
| FR10 | Implement close button to remove window from DOM | Critical | MVP |
| FR11 | Implement minimize button with fade animation (MVP) | High | MVP |
| FR12 | Implement zoom button with authentic Tiger behavior (fit-to-content, not maximize) | Medium | MVP |
| FR13 | Manage z-index so clicked window becomes topmost | Critical | MVP |
| FR14 | Apply Aqua styling to all window chrome (glossy buttons, pinstripes) | High | MVP |
| FR15 | Constrain windows to remain within viewport bounds | Medium | MVP |
| FR16 | Implement genie effect minimize animation | High | Phase 2 |

### Capability Area 3: Portfolio Content

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR17 | Display About Me content in Tiger-styled window | Critical | MVP |
| FR18 | Display Projects content with project cards/grid | Critical | MVP |
| FR19 | Display Resume content (embedded PDF or styled HTML) | Critical | MVP |
| FR20 | Display Contact form with working submission | Critical | MVP |
| FR21 | Apply consistent Aqua styling to all content windows | High | MVP |
| FR22 | Ensure content is readable and scannable (supports 30-second path) | Critical | MVP |
| FR23 | Include sufficient technical depth (supports 10-minute path) | High | MVP |

### Capability Area 4: Navigation & Interaction

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR24 | Support ⌘W keyboard shortcut to close focused window | High | MVP |
| FR25 | Support ⌘M keyboard shortcut to minimize focused window | High | MVP |
| FR26 | Support Tab key navigation between interactive elements | High | MVP |
| FR27 | Provide Apple menu dropdown with About, Restart options | Medium | MVP |
| FR28 | Display Dock with application icons | High | Phase 2 |
| FR29 | Support window shade via double-click title bar | Medium | Phase 2 |

### Capability Area 5: Audio & Feedback

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR30 | Play startup chime on initial page load | High | MVP |
| FR31 | Play Sosumi sound on error conditions | Medium | Phase 2 |
| FR32 | Display Tiger-authentic error dialogs for invalid actions | Medium | Phase 2 |

### Capability Area 6: Accessibility & Fallbacks

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR33 | Provide visible focus indicators on all interactive elements | High | MVP |
| FR34 | Include ARIA labels on windows, buttons, and icons | High | MVP |
| FR35 | Respect prefers-reduced-motion media query | High | MVP |
| FR36 | Display "best on desktop" message for mobile visitors (< 768px) | High | MVP |

### Capability Area 7: Terminal (Phase 2)

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR37 | Display Terminal icon on desktop | High | Phase 2 |
| FR38 | Render xterm.js terminal emulator in Tiger-styled window | High | Phase 2 |
| FR39 | Support basic commands: help, ls, cat, clear | High | Phase 2 |
| FR40 | Include Easter egg commands (sl, games) | Medium | Phase 2 |
| FR41 | Display nick@tiger ~ $ prompt | High | Phase 2 |

### Capability Area 8: iOS Mobile (Phase 3)

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR42 | Display iOS 6 home screen for viewports < 768px | High | Phase 3 |
| FR43 | Render portfolio content as iOS apps (Notes, Photos, iBooks, Mail) | High | Phase 3 |
| FR44 | Implement "reboot" transition when crossing breakpoint | Medium | Phase 3 |
| FR45 | Support touch interactions for iOS experience | High | Phase 3 |

---

## Non-Functional Requirements

### Performance

Performance is critical for this portfolio because the implementation quality **IS** the demonstration of skill. Smooth animations and fast loads prove technical competence.

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| First Contentful Paint | < 1.5 seconds | Lighthouse |
| Largest Contentful Paint | < 2.5 seconds | Lighthouse |
| Time to Interactive | < 3.0 seconds | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Total Bundle Size | < 500KB gzipped | Build analysis |
| Animation Frame Rate | 60fps sustained | Chrome DevTools Performance |
| Window Drag Latency | < 16ms (single frame) | DevTools |
| Lighthouse Performance Score | > 90 | Lighthouse |

**Performance Principles:**
- GPU-accelerated transforms only (transform, opacity)
- No layout thrashing during animations
- Lazy load non-critical assets
- Inline critical CSS for FCP

### Accessibility

Accessibility ensures the portfolio is usable by all visitors, demonstrating inclusive design thinking.

| Requirement | Target | Standard |
|-------------|--------|----------|
| WCAG Compliance | Level AA (where applicable) | WCAG 2.1 |
| Lighthouse Accessibility Score | > 90 | Lighthouse |
| Color Contrast (text) | 4.5:1 minimum | WCAG AA |
| Color Contrast (large text) | 3:1 minimum | WCAG AA |
| Focus Visibility | Visible on all interactive elements | WCAG 2.4.7 |
| Keyboard Navigation | Full support (Tab, Enter, Escape, shortcuts) | WCAG 2.1.1 |
| Screen Reader Support | ARIA labels on interactive elements | WCAG 4.1.2 |
| Motion Preference | Respect prefers-reduced-motion | WCAG 2.3.3 |

**Accessibility Notes:**
- Some OS recreation elements (drag/drop, window management) may have inherent limitations
- Alternative navigation paths provided where needed
- "Skip to content" link for keyboard users

### Browser Compatibility

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | Latest 2 versions | Full support |
| Safari | Latest 2 versions | Full support |
| Firefox | Latest 2 versions | Full support |
| Edge | Latest 2 versions | Full support |
| Mobile Safari | iOS 14+ | Basic (desktop message) |
| Chrome Mobile | Android 10+ | Basic (desktop message) |

### Code Quality

| Requirement | Target | Enforcement |
|-------------|--------|-------------|
| TypeScript Strict Mode | Enabled | tsconfig.json |
| Console Errors | 0 in production | CI/CD check |
| ESLint Violations | 0 | Pre-commit hook |
| Build Warnings | 0 | CI/CD check |
