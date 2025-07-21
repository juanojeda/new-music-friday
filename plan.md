# Project Plan

## Project Overview

A web app that fetches, displays, and allows playback of public YouTube Music playlists named "New Music Friday". The app updates weekly, requires no login, and sorts playlists by recency.

## Work Items

### Core Features - Essential functionality for the MVP

- [ ] **ENH-003**: Audio Player Controls and Track Data Improvements
  - Priority: Critical
  - Dependencies: ENH-002, MIG-002
  - Status: Not Started
  - Requirements File: [REQ-007-audio-player-controls-and-track-data.md](docs/requirements/REQ-007-audio-player-controls-and-track-data.md)
  - Atomic Tasks:
    - [x] FR-007.1: Next/Prev Controls
    - [x] FR-007.2: Play/Pause Toggle
    - [x] FR-007.3: Playlist Track Data Display

## Migration Plan - React, Material UI, and Standard Tooling

### Core Features Migration

- [ ] **REQ-008**: Migrate playlist fetching logic to React/Vite infrastructure
  - Priority: High
  - Dependencies: MIG-001, INF-002
  - Status: Not Started
  - Requirements File: [REQ-008-migrate-playlist-fetching-to-react.md](docs/requirements/REQ-008-migrate-playlist-fetching-to-react.md)
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

## Completed Items

- CF-001: Implement weekly playlist fetching and static site generation
- CF-002: Display playlists sorted by most recent
- CF-003: Allow public playback of playlists (no login required)
- ENH-001: Improved audio player experience using YouTube IFrame Player API
- ENH-002: Unified audio player UX v2 (single player, playlist selection, track display)
- ENH-003: Audio Player Controls and Track Data Improvements — 2024-07-19
  - Priority: Critical
  - Dependencies: ENH-002, MIG-002
  - Status: Completed
  - Requirements File: [REQ-007-audio-player-controls-and-track-data.md](docs/requirements/REQ-007-audio-player-controls-and-track-data.md)
  - Atomic Tasks:
    - [x] FR-007.1: Next/Prev Controls
    - [x] FR-007.2: Play/Pause Toggle
    - [x] FR-007.3: Playlist Track Data Display
- MIG-001: Migrate static site generation logic to React (consider Next.js for SSR/SSG)
- MIG-002: Rebuild audio player and playlist UI as React components using Material UI
- INF-001: Set up new React project with Vite (or Create React App) — 2025-07-19
- INF-003: Set up ESLint, Prettier, and TypeScript config for React — 2025-07-19
- INF-002: Integrate Material UI and configure theme — 2025-07-19
- DOC-002: ADR for improved architecture and tech stack (React, Material UI, standard tooling)

## Notes & Decisions

- Playlists are public; no authentication required.
- Site updates once per week to minimize API calls.
- Improved player experience will use the YouTube IFrame Player API with custom controls and hidden video area.
- Unified audio player UX v2 will provide a single player, playlist selection, and track display.
- The previously referenced architecture-adr.md does not exist; see REQ-006-architecture-adr.md for the current ADR.
- New ADR (ADR-002) for React, Material UI, and standard tooling is now **accepted**. Migration to this stack is approved and will proceed as planned.
- All audio player controls (play, pause, seek) are now fully keyboard accessible and have ARIA labels. The media seeker supports jumping ±5s with arrow keys for improved accessibility.
