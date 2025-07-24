# 004 - Fetch Playlist Data at Build Time for Static Site Generation

## Status

Accepted

## Date Log

- 2025-07-19 - Proposed
- 2025-07-19 - Accepted

## Context & Problem Statement

The "New Music Friday" site needs to display up-to-date playlists from YouTube Music. The goal is to avoid exposing API keys in the client, minimize runtime dependencies, and ensure the site can be hosted as a static site with no backend. The question is: **When and how should playlist data be fetched and made available to the React app?**

## Considered Options

1. Fetch playlist data from the API at runtime (client-side or server-side)
2. Fetch playlist data from the API at build time and include it as a static JSON file in the site output

## Decision

Chosen option: **Fetch playlist data from the API at build time and include it as a static JSON file in the site output**. This approach ensures API keys are never exposed to the client, the site remains fully static, and data is always up-to-date at deploy time.

## Consequences

- Good, because:
  - No API keys are exposed to users
  - No backend/server is required at runtime
  - The site can be hosted on any static hosting provider
  - Fast page loads (data is pre-fetched)
  - Simple, secure, and scalable
- Bad, because:
  - Data is only as fresh as the last build (not real-time)
  - Requires a build/deploy step to update playlists
  - More complex build pipeline (requires a data-fetching script)

## Details

### Considered options

#### 1. Fetch playlist data from the API at runtime

- Would require exposing API keys to the client (not secure), or running a backend server (not static hosting)
- More complex, less secure, and less portable

#### 2. Fetch playlist data from the API at build time (Recommended)

- Write a Node.js script to fetch playlists from the YouTube API and save as `public/playlists.json`
- Run this script as part of the build process (e.g., `prebuild` npm script)
- React app loads playlists from `/playlists.json` at runtime (no API calls needed)
- Site is fully static and can be hosted anywhere

---
