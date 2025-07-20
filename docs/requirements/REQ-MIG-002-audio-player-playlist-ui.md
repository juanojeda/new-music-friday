# REQ-MIG-002-audio-player-playlist-ui.md

## User Story

As a user, I want to browse and play "New Music Friday" playlists in a modern, accessible React UI, so that I can easily discover and listen to new music each week.

## Functional Requirements

- FR-MIG-002-001: Display a list of available playlists fetched from the API
  - Description: The UI must fetch and display a list of all available "New Music Friday" playlists from the API (e.g., YouTube Music API), sorted by recency.
  - Pre-conditions: API endpoint and credentials are available.
  - Post-conditions: Users can see and select playlists from the list, which is populated with real data.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Playlist list is displayed with real data
      Given the API is available and returns playlist data
      When the user visits the main page
      Then a list of playlists is fetched from the API and shown, sorted by most recent
    ```
  - Dependencies: MIG-001, INF-002

- FR-MIG-002-002: Render a unified audio player using Material UI
  - Description: The UI must include a single audio player component, styled with Material UI, that can play tracks from the selected playlist.
  - Pre-conditions: At least one playlist is available.
  - Post-conditions: Users can play, pause, and seek within tracks.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Audio player is rendered and functional
      Given a playlist is selected
      When the user interacts with the audio player
      Then they can play, pause, and seek within tracks
      And the player uses Material UI components
    ```
  - Dependencies: FR-MIG-002-001

- FR-MIG-002-003: Integrate with YouTube IFrame Player API
  - Description: The audio player must use the YouTube IFrame Player API to play tracks from YouTube Music playlists.
  - Pre-conditions: Audio player component is implemented.
  - Post-conditions: Tracks play via the YouTube IFrame Player API, with custom controls.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Tracks play via YouTube IFrame Player API
      Given a playlist and track are selected
      When the user presses play
      Then the track plays using the YouTube IFrame Player API
      And the video area is hidden
    ```
  - Dependencies: FR-MIG-002-002

## Non-Functional Requirements

- NFR-MIG-002-001: The UI must be fully accessible (keyboard navigation, ARIA labels, etc.).
- NFR-MIG-002-002: The UI must be responsive and work on mobile and desktop.
- NFR-MIG-002-003: Only Material UI components may be used for UI (no custom or third-party UI libraries).

## Technical Guidance

- Use Material UI components for all UI elements (lists, buttons, player controls, etc.).
- Use React state to manage playlist selection and playback.
- Fetch playlist data from the API (e.g., YouTube Music API) at runtime; do not use mock data.
- Integrate the YouTube IFrame Player API for audio playback, with the video area hidden.
- Ensure all UI is accessible and responsive.
- Handle API errors gracefully and provide user feedback if playlists cannot be loaded.
