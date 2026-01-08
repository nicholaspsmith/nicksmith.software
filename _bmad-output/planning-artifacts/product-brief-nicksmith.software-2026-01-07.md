---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - '_bmad-output/analysis/brainstorming-session-2026-01-07.md'
  - '_bmad-output/planning-artifacts/research/technical-tiger-ios6-implementation-research-2026-01-07.md'
  - '_bmad-output/planning-artifacts/portfolio-project-context.md'
date: '2026-01-07'
author: 'Nick'
project_name: 'nicksmith.software'
---

# Product Brief: nicksmith.software

## Executive Summary

nicksmith.software is a portfolio website that replaces conventional static portfolios with an interactive recreation of Mac OS X Tiger (10.4) for desktop visitors and iOS 6 for mobile visitors. The site demonstrates senior-level frontend engineering competence through its implementation - the portfolio IS the proof of skill. Visitors experience authentic Apple UI paradigms from 2005 and 2012 respectively, with portfolio content (About, Projects, Resume, Contact) presented as native applications within each environment.

---

## Core Vision

### Problem Statement

Software engineering portfolios face a fundamental challenge: they must simultaneously appeal to recruiters scanning for 30 seconds and engineers evaluating technical depth over 10+ minutes. Traditional portfolios fail this dual requirement - they're either forgettable templates or technical showcases that alienate non-technical viewers. The implementation itself rarely demonstrates the engineering skills being claimed.

### Problem Impact

- Talented engineers blend into a sea of identical portfolio templates
- Technical competence claims go unverified until interview stages
- Recruiters struggle to differentiate candidates quickly
- Engineers lose opportunities to demonstrate attention to detail and craft
- The portfolio becomes a checkbox rather than a differentiator

### Why Existing Solutions Fall Short

- **Template portfolios**: Generic, forgettable, don't demonstrate implementation skills
- **Over-designed portfolios**: Prioritize visual novelty over usability and substance
- **Blog-style portfolios**: Text-heavy, require commitment to evaluate
- **GitHub profiles**: Technical but lack narrative and personality
- **LinkedIn**: Standardized format prevents differentiation

None demonstrate mastery through the implementation itself.

### Proposed Solution

A portfolio website that presents two authentic Apple experiences:

**Desktop (Mac OS X Tiger 10.4)**:
- Pixel-perfect Aqua UI with window management
- Interactive Terminal with Easter eggs
- Portfolio content as native Tiger applications
- Authentic interactions: Genie minimize, window shade, traffic lights

**Mobile (iOS 6)**:
- Skeuomorphic iOS 6 experience on mobile breakpoints
- Portfolio content as iOS apps (Notes, Photos, iBooks, Mail)
- "Reboot" transition between desktop and mobile contexts
- Easter eggs reward curious explorers (Flappy Bird, terminal games)

### Key Differentiators

1. **Implementation IS the portfolio** - The site's technical execution demonstrates the claimed skills
2. **Dual audience optimization** - 30-second recruiter path via desktop icons; 10+ minute engineer path via deep interactions
3. **Nostalgic fidelity** - Authentic recreation appeals emotionally while demonstrating attention to detail
4. **Progressive disclosure** - Surface simplicity with discoverable depth (Easter eggs, Terminal games, Marble Blast Gold)
5. **Memorable in seconds** - No one forgets "the guy with the Mac OS Tiger portfolio"

---

## Target Users

### Primary Users

#### Persona 1: Rachel the Recruiter

**Context:**
Rachel is a technical recruiter at a mid-size SaaS company. She reviews 50-100 candidate profiles daily, spending an average of 30-90 seconds on each portfolio link before deciding whether to forward to the hiring manager.

**Problem Experience:**
- Overwhelmed by identical portfolio templates
- Can't verify technical claims just by looking at a site
- Struggles to remember candidates after reviewing dozens
- Needs quick access to resume, projects, and contact info
- Often skips portfolios that require "figuring out"

**Success Vision:**
Opens the portfolio, immediately understands the desktop interface (folders, icons, windows are universally intuitive), finds resume/contact via clearly-labeled desktop icons, and remembers "the desktop portfolio guy" when discussing candidates with the hiring team.

**Key Insight:** Rachel doesn't need to recognize Tiger specifically - the desktop metaphor (folders, windows, icons) is universally understood. Clarity enables the experience; nostalgia is bonus.

**Key Quote:** *"I need to know if this person is worth the hiring manager's time - in under a minute."*

---

#### Persona 2: Marcus the Engineering Manager

**Context:**
Marcus is a senior engineering manager evaluating candidates for a frontend-heavy role. He has 10+ years of experience and values attention to detail and craft over buzzword compliance.

**Problem Experience:**
- Sees the same React/Vue/Angular buzzwords on every portfolio
- Can't tell if candidates actually understand what they claim
- Wishes he could see attention to detail and problem-solving approach
- Frustrated by portfolios that don't demonstrate real engineering
- Values craft and polish, not just functionality

**Success Vision:**
Spends 10+ minutes exploring the site, discovering progressively more impressive details - smooth animations, working Terminal with Easter eggs, keyboard shortcuts. Thinks "this person obsesses over the same details we care about."

**Key Insight:** Marcus isn't impressed by nostalgia recognition - he's impressed by **demonstrated craftsmanship**. The authentic genie effect, the attention to timing, the Easter eggs all signal "this person builds with care." This works regardless of whether he personally used Tiger.

**Key Quote:** *"Show me you can build something that delights users - that tells me more than any resume."*

---

### Secondary Users

#### Sarah the Fellow Engineer

A peer frontend developer who discovers the portfolio on social media. Views source, explores DevTools, tries to break things. May not have nostalgia for Tiger but appreciates the technical execution - animation performance, state management, component architecture.

**Value:** Word-of-mouth amplification, professional network expansion, potential referrals.

---

### User Journey

**Rachel's Journey (30 seconds):**
Discovery → Intuitive Recognition (desktop metaphor is universal) → Navigation (clicks Resume icon) → Evaluation (scans content in window) → Decision (forwards to hiring manager) → Memory ("the desktop portfolio guy")

**Marcus's Journey (10+ minutes):**
Discovery → Curiosity (unusual portfolio approach) → Exploration (tests interactions, sees polish) → Deep Dive (Terminal, Easter eggs, keyboard shortcuts) → Validation ("This person builds with craft") → Advocacy (shows team)

---

## Success Metrics

### User Success Metrics

**Rachel (Recruiter) Success:**
- Time to find resume: < 15 seconds
- Time to find contact: < 20 seconds
- Portfolio forwarded to hiring manager
- Candidate recalled as "the desktop portfolio guy"

**Marcus (Engineer) Success:**
- Session duration: > 5 minutes
- Interaction depth: 3+ windows opened, Terminal explored
- Easter egg discovered
- Impression: "This person builds with care"

---

### Business Objectives

**Primary Objective:** Secure a senior frontend engineering position at a company that values craft and attention to detail.

**Success Indicators:**
- Portfolio link → Interview request within 2 weeks
- Hiring manager mentions portfolio positively in interview
- Candidate differentiated and remembered vs. competitors
- Interview → Offer conversion

**Secondary Objectives:**
- Professional network growth through portfolio virality
- Personal brand: "craft-focused frontend engineer"
- Shareable artifact for social media presence

---

### Key Performance Indicators

**Leading Indicators:**
- Bounce rate < 20%
- Average session duration > 2 minutes
- Terminal opened in > 10% of sessions

**Technical Performance:**
- First Contentful Paint < 1.5s
- Animation frame rate: 60fps sustained
- Lighthouse score > 90

---

## MVP Scope

### Core Features

**Desktop Environment:**
- Tiger desktop with authentic Aqua wallpaper
- Custom Tiger-era cursor
- Desktop icons (Resume, Projects, About Me, Contact)
- Icon grid snapping and arrangement
- Menu bar with Apple menu and app menus

**Window System:**
- Draggable, resizable windows (react-rnd)
- Window chrome with traffic light buttons (close, minimize, zoom)
- Focus management (click to bring forward)
- Basic minimize (fade, genie effect deferred)
- Authentic Aqua styling (glossy buttons, pinstripes)

**Portfolio Content:**
- About Me, Projects, Resume, Contact windows
- Startup chime on initial load
- Basic keyboard shortcuts (⌘W, ⌘M)

---

### Out of Scope for MVP

**Deferred:** Genie effect, Terminal, Dock, iOS 6 mobile, reboot transition, Easter eggs, Marble Blast, System Preferences, window shade, context menus

**Explicit No:** No filesystem, no auth, no backend, no dark mode

---

### MVP Success Criteria

- Rachel finds Resume in < 15 seconds
- Marcus explores > 2 minutes
- 60fps animations, FCP < 2s
- Works on Chrome/Safari/Firefox
- Positive interview feedback

---

### Future Vision

**Phase 2:** Terminal, Dock, genie effect, iOS 6 mobile
**Phase 3:** Marble Blast, Easter eggs, Flappy Bird
**Phase 4:** System Preferences, dock magnification, full shortcuts
