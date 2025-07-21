# REQ-008: Migrate Playlist Fetching Logic to React/Vite Infrastructure

## User Story

As a developer, I want the weekly playlist fetching logic (originally implemented for static site generation) to be migrated and integrated with the new React/Vite infrastructure, so that the site continues to update with the latest "New Music Friday" playlists automatically and efficiently.

## Functional Requirements

- FR-008-001: Migrate Scheduled Playlist Fetch
  - Description: The system must fetch all public YouTube Music playlists named "New Music Friday" once per week, using a process compatible with the new React/Vite static site generation workflow.
  - Pre-conditions: The new React/Vite infrastructure is in place.
  - Post-conditions: The latest playlists are available for display and playback in the React app.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Weekly playlist fetch with React/Vite
      Given the React/Vite infrastructure is set up
      When the scheduled fetch runs (once per week)
      Then the system retrieves all playlists whose names start with "New Music Friday"
      And stores them in a format consumable by the React app
    ```
  - Dependencies: MIG-001, INF-002

- FR-008-002: Store Playlists for Static Site Generation
  - Description: The fetched playlists must be stored in a format (e.g., JSON) that can be consumed by the React app during build time.
  - Pre-conditions: Playlists have been fetched and filtered.
  - Post-conditions: The React app can access the latest playlists at build time.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Playlists available for SSG
      Given playlists have been fetched and filtered
      When the site build process runs
      Then the React app loads the latest playlists from the stored data
    ```
  - Dependencies: FR-008-001

## Non-Functional Requirements

- NFR-008-001: API Usage
  - Category: Performance
  - Description: The system must minimize API calls by fetching playlists only once per week.
  - Metrics/Thresholds: No more than one fetch per week.

- NFR-008-002: Compatibility
  - Category: Maintainability
  - Description: The playlist fetching and storage process must be compatible with the React/Vite SSG workflow and not require a backend server at runtime.

## Technical Guidance

- Use a scheduled job (e.g., GitHub Actions, serverless function, or local cron) to trigger the weekly fetch and update the playlist data file.
- Store playlist data in a JSON file (e.g., `public/playlists.nmf.json`) for the React app to consume at build time.
- Ensure error handling for failed fetches (retry, alert, etc.).
- Trigger a site rebuild/deploy after a successful fetch to update the static site with the latest playlists. 