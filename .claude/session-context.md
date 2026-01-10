# Session Context - January 9, 2026

## Project Status
Mac OS X Tiger portfolio website - All 13 planned epics COMPLETE (Phases 1-4).

## Recent Changes This Session
- Updated LinkedIn links to linkedin.com/in/nps90
- Updated location to Charleston, SC
- Updated About Me bio with personal content + link to open Projects window
- Updated Resume with real employment history (MongoDB, Cisco, Handsome, Dreamline)
- Added lance-context mention to About Me
- Set window sizes: Projects 625x595, Contact 390x440, Resume minWidth 700
- Added pointing hand cursor (`cursor_11.png`) for links in TextEdit windows
- Added ASCII art console greeting with "nicksmith.software" + mailto link
- Removed Reference folder from git (added to .gitignore)

## Key Technical Patterns
- Custom cursors: `/icons/cursors/cursor_11.png` for links, `/icons/cursor.png` for default
- Data attributes for cross-component styling: `data-textedit-window`
- Window sizes configured in `windowStore.ts` → `WINDOW_SIZE_CONFIGS`
- Window titles in `windowStore.ts` → `WINDOW_TITLES`
- TextEdit documents grouped under `parentApp: 'textEdit'`

## Next Feature: System Preferences
User wants to implement System Preferences window with Tiger-styled preference panes.

Potential panes to include:
- Appearance - visual options
- Desktop & Screen Saver - wallpaper
- Sound - toggle startup chime, system sounds
- Displays - viewport info
- Custom "About This Portfolio" pane

## Stretch Goals (User Prioritized)
1. System Preferences ← NEXT
2. Safari window (mini browser for project links)
3. More Terminal commands (`open resume`, `whoami`, `date`, matrix rain)
4. Dock magnification (complex, later)

## Files to Reference
- `src/stores/windowStore.ts` - window management
- `src/features/apps/` - app content components
- `src/features/tiger/components/` - Tiger UI components
- `src/styles/global.css` - cursor rules, global styles
- `_bmad-output/planning-artifacts/epics.md` - full epic breakdown
