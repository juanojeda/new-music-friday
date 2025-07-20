# Project Plan

## Project Overview

A web app that fetches, displays, and allows playback of public YouTube Music playlists named "New Music Friday". The app updates weekly, requires no login, and sorts playlists by recency.

## Work Items

### Core Features - Essential functionality for the MVP

- [ ] **CF-001**: Implement weekly playlist fetching and static site generation
  - Priority: Critical
  - Dependencies: None
  - Status: Completed
  - Requirements File: [REQ-001-weekly-playlist-fetching.md](docs/requirements/REQ-001-weekly-playlist-fetching.md)

- [ ] **CF-002**: Display playlists sorted by most recent
  - Priority: High
  - Dependencies: CF-001
  - Status: Completed
  - Requirements File: [REQ-002-playlist-display-sorting.md](docs/requirements/REQ-002-playlist-display-sorting.md)

- [ ] **CF-003**: Allow public playback of playlists (no login required)
  - Priority: High
  - Dependencies: CF-001
  - Status: Completed
  - Requirements File: [REQ-003-public-playback.md](docs/requirements/REQ-003-public-playback.md)

### Enhancements - Improved User Experience

- [ ] **ENH-001**: Improved audio player experience using YouTube IFrame Player API
  - Priority: High
  - Dependencies: CF-003
  - Status: Completed
  - Requirements File: [REQ-004-improved-audio-player.md](docs/requirements/REQ-004-improved-audio-player.md)

- [ ] **ENH-002**: Unified audio player UX v2 (single player, playlist selection, track display)
  - Priority: High
  - Dependencies: ENH-001
  - Status: Not Started
  - Requirements File: [REQ-005-unified-audio-player-ux-v2.md](docs/requirements/REQ-005-unified-audio-player-ux-v2.md)

### Documentation - Project Documentation and Decisions

- [ ] **DOC-002**: ADR for improved architecture and tech stack (React, Material UI, standard tooling)
  - Priority: High
  - Dependencies: None
  - Status: Accepted
  - Requirements File: [ADR-002-architecture-and-tech-stack.md](docs/adr/ADR-002-architecture-and-tech-stack.md)

## Completed Items

- INF-001: Set up new React project with Vite (or Create React App) — 2025-07-19
- INF-003: Set up ESLint, Prettier, and TypeScript config for React — 2025-07-19
- INF-002: Integrate Material UI and configure theme — 2025-07-19

## Notes & Decisions

- Playlists are public; no authentication required.
- Site updates once per week to minimize API calls.
- Improved player experience will use the YouTube IFrame Player API with custom controls and hidden video area.
- Unified audio player UX v2 will provide a single player, playlist selection, and track display.
- The previously referenced architecture-adr.md does not exist; see REQ-006-architecture-adr.md for the current ADR.
- New ADR (ADR-002) for React, Material UI, and standard tooling is now **accepted**. Migration to this stack is approved and will proceed as planned.
- All audio player controls (play, pause, seek) are now fully keyboard accessible and have ARIA labels. The media seeker supports jumping ±5s with arrow keys for improved accessibility.

## Migration Plan - React, Material UI, and Standard Tooling

### Infrastructure

- [x] **INF-001**: Set up new React project with Vite (or Create React App)
  - Priority: Critical
  - Dependencies: None
  - Status: Completed
  - Requirements File: [REQ-INF-001-react-project-setup.md](docs/requirements/REQ-INF-001-react-project-setup.md)
- [x] **INF-002**: Integrate Material UI and configure theme
  - Priority: High
  - Dependencies: INF-001
  - Status: Completed
  - Requirements File: [REQ-INF-002-material-ui-theme.md](docs/requirements/REQ-INF-002-material-ui-theme.md)
- [x] **INF-003**: Set up ESLint, Prettier, and TypeScript config for React
  - Priority: High
  - Dependencies: INF-001
  - Status: Completed
  - Requirements File: [REQ-INF-003-eslint-prettier-tsconfig.md](docs/requirements/REQ-INF-003-eslint-prettier-tsconfig.md)

### Core Features Migration

- [x] **MIG-001**: Migrate static site generation logic to React (consider Next.js for SSR/SSG)
  - Priority: High
  - Dependencies: INF-001
  - Status: Completed
  - Requirements File: [REQ-006-migrate-static-site-generation-to-react.md](docs/requirements/REQ-006-migrate-static-site-generation-to-react.md)
- [ ] **MIG-002**: Rebuild audio player and playlist UI as React components using Material UI
  - Priority: High
  - Dependencies: MIG-001, INF-002
  - Status: In Progress
  - Requirements File: [REQ-MIG-002-audio-player-playlist-ui.md](docs/requirements/REQ-MIG-002-audio-player-playlist-ui.md)
  - Atomic Tasks:
    - [x] Display a list of available playlists fetched from the API (static JSON for now)
    - [x] Allow user to select a playlist and highlight selection
    - [x] Pass selected playlist to parent component (App) via callback
    - [x] Render a unified audio player using Material UI (integrated and tested in App)
    - [x] Integrate with YouTube IFrame Player API for playback
    - [x] Play, pause, and seek controls for audio player
    - [x] Hide video area of YouTube player
    - [x] Ensure full accessibility (keyboard navigation, ARIA labels)
    - [x] Ensure responsive design for mobile and desktop
    - [ ] Display playlist thumbnails in the list
    - [ ] Handle API errors gracefully and provide user feedback
- [ ] **MIG-003**: Write tests for all new React components (React Testing Library, Jest)
  - Priority: High
  - Dependencies: MIG-002
  - Status: Not Started
  - Requirements File: (to be created)
- [ ] **MIG-004**: Gradually phase out old string-template code
  - Priority: Medium
  - Dependencies: MIG-002
  - Status: Not Started
  - Requirements File: (to be created)
