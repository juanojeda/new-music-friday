# REQ-005: Unified Audio Player UX v2 (Single Player, Playlist Selection, Track Display)

## User Story

As a visitor, I want to control all playlists from a single, unified audio player, so that I have a consistent and clear listening experience and can easily switch between playlists and tracks.

## Functional Requirements

- FR-005.1: Single Unified Audio Player
  - Description: Only one audio player is visible on the page at any time.
  - Pre-conditions: Playlists are available for playback.
  - Post-conditions: The user sees a single audio player UI.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Single audio player
      Given multiple playlists are available
      When the page is rendered
      Then only one audio player is visible
    ```
  - Dependencies: YouTube IFrame Player API

- FR-005.2: Playlist Selection
  - Description: The user can select a playlist from the list, and the audio player loads and controls that playlist.
  - Pre-conditions: The unified player is visible and playlists are listed.
  - Post-conditions: The player controls the selected playlist.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Playlist selection
      Given the user sees a list of playlists
      When the user selects a playlist
      Then the audio player loads and controls that playlist
      And the player UI displays the selected playlist name
    ```
  - Dependencies: FR-005.1

- FR-005.3: Track Display
  - Description: The audio player displays the name of the currently playing track.
  - Pre-conditions: A playlist is loaded and playing.
  - Post-conditions: The player UI shows the current track name.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Track name display
      Given a playlist is playing
      When a track is playing
      Then the audio player UI displays the name of the current track
    ```
  - Dependencies: FR-005.2

## Non-Functional Requirements

- NFR-005.1: Accessibility
  - Category: Usability
  - Description: All controls must be keyboard accessible and have appropriate ARIA labels.
  - Metrics/Thresholds: Controls meet WCAG 2.1 AA standards.

- NFR-005.2: Visual Clarity
  - Category: Usability
  - Description: The player UI must clearly indicate the selected playlist and current track.

## Technical Specifications & Guidance

- Use the YouTube IFrame Player API to embed and control the playlist.
- Only one player instance should be active at a time.
- When a playlist is selected, update the player to load the new playlist and update the UI.
- Use the YouTube Player API to get the current track title (via `getVideoData().title`).
- Ensure the player works on both desktop and mobile browsers.
