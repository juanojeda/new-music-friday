# Project Plan

## Project Overview

A web app that fetches, displays, and allows playback of public YouTube Music playlists named "New Music Friday". The app updates weekly, requires no login, and sorts playlists by recency.

## Work Items

## Migration Plan - React, Material UI, and Standard Tooling

### Core Features Migration

- [ ] **REQ-009**: Dynamic Material UI theme from playlist artwork
  - Priority: High
  - Dependencies: REQ-008
  - Status: Not Started
  - Requirements File: [REQ-009-dynamic-theme-from-artwork.md](docs/requirements/REQ-009-dynamic-theme-from-artwork.md)

## Completed Items

- REQ-010: Deploy static site to GitHub Pages via GitHub Actions and gh-pages branch
- REQ-008: Migrated playlist fetching logic to React/Vite infrastructure
- CF-001: Implement weekly playlist fetching and static site generation
- CF-002: Display playlists sorted by most recent
- CF-003: Allow public playback of playlists (no login required)
- ENH-001: Improved audio player experience using YouTube IFrame Player API
- ENH-002: Unified audio player UX v2 (single player, playlist selection, track display)
- ENH-003: Audio Player Controls and Track Data Improvements — 2024-07-19
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
