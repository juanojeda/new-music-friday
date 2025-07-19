# REQ-002: Playlist Display Sorting

## User Story
As a visitor, I want to see the most recently created "New Music Friday" playlists at the top of the page, so that I can easily access the latest music.

## Functional Requirements

- FR-002.1: Sort Playlists by Creation Date
  - Description: The system must display playlists sorted by their creation date, with the most recent at the top.
  - Pre-conditions: Playlists have been fetched and their creation dates are available.
  - Post-conditions: The playlist list is ordered from newest to oldest.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Display playlists sorted by most recent
      Given a list of playlists with creation dates
      When the page is rendered
      Then playlists are displayed in descending order of creation date
    ```
  - Dependencies: REQ-001 (playlist fetching)

## Non-Functional Requirements

- NFR-002.1: Usability
  - Category: Usability
  - Description: Sorting should be visually clear and intuitive for users.
  - Metrics/Thresholds: Users can identify the newest playlist at a glance.

## Technical Specifications & Guidance
- Ensure playlist data includes creation date metadata.
- Use a stable sorting algorithm to order playlists.
- Clearly indicate the order (e.g., label, visual cue). 