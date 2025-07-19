# REQ-006-migrate-static-site-generation-to-react.md

## User Story

As a developer, I want the build process to generate a static site using Vite + React, so that the site can be deployed to any static hosting provider.

## Functional Requirements

- FR-006-001: The build process must output a static site using Vite + React
  - Description: The project must be configured so that running the build process (e.g., `npm run build`) produces a static site (HTML, JS, CSS, assets) that can be deployed to any static hosting provider.
  - Pre-conditions: React app is set up at the project root (see INF-001).
  - Post-conditions: The build output is a static site in the `dist/` directory.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Static site is generated at build time
      Given the React app is set up
      When the build process runs
      Then the output directory contains a static site (HTML, JS, CSS, assets)
      And the site can be deployed to any static hosting provider
    ```
  - Dependencies: INF-001, ADR-003

## Non-Functional Requirements

- NFR-006-001: The generated site must be deployable to any static hosting provider (e.g., Netlify, Vercel, S3).
- NFR-006-002: The build process must complete in under 5 minutes for the current site.
- NFR-006-003: The site must not require a server or backend to serve content.

## Technical Guidance

- Reference ADR-003 for the decision to use Vite + React for SSG.
- Use Vite's standard build process (`npm run build`).
- Ensure the output is a static site (no server-side code required at runtime).
- Additional SSG features (e.g., playlist data fetching, scheduled updates) will be addressed in future requirements.
