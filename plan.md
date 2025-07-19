# Project Plan

## Project Overview
A web app that fetches, displays, and allows playback of public YouTube Music playlists named "New Music Friday". The app updates weekly, requires no login, and sorts playlists by recency.

## Work Items

### Core Features - Essential functionality for the MVP
- [ ] **CF-001**: Implement weekly playlist fetching and static site generation
  - Priority: Critical
  - Dependencies: None
  - Status: Not Started
  - Requirements File: [REQ-001-weekly-playlist-fetching.md](docs/requirements/REQ-001-weekly-playlist-fetching.md)

- [ ] **CF-002**: Display playlists sorted by most recent
  - Priority: High
  - Dependencies: CF-001
  - Status: Not Started
  - Requirements File: [REQ-002-playlist-display-sorting.md](docs/requirements/REQ-002-playlist-display-sorting.md)

- [ ] **CF-003**: Allow public playback of playlists (no login required)
  - Priority: High
  - Dependencies: CF-001
  - Status: Not Started
  - Requirements File: [REQ-003-public-playback.md](docs/requirements/REQ-003-public-playback.md)

## Completed Items


## Notes & Decisions
- Playlists are public; no authentication required.
- Site updates once per week to minimize API calls. 