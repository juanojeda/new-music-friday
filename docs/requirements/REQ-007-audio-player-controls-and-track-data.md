# REQ-007: Audio Player Controls and Track Data Improvements

## User Story

As a listener, I want to control playback with next/prev, play/pause toggle, and see detailed track and playlist information, so that I have a modern, intuitive, and informative listening experience.

## Functional Requirements

- FR-007.1: Next/Prev Controls
  - Description: The audio player must provide Next and Previous controls to allow the user to skip forward and backward between tracks in the current playlist.
  - Pre-conditions: A playlist with more than one track is loaded and ready for playback.
  - Post-conditions: The user can move to the next or previous track in the playlist.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Next/Prev controls
      Given a playlist with multiple tracks is loaded
      When the user clicks the Next button
      Then the player skips to the next track in the playlist
      And the UI updates to show the new track info
      When the user clicks the Prev button
      Then the player skips to the previous track in the playlist
      And the UI updates to show the new track info
    ```
  - Dependencies: YouTube IFrame Player API

- FR-007.2: Play/Pause Toggle
  - Description: The player must display only one of play or pause at a time, depending on the current playback state (never both simultaneously).
  - Pre-conditions: The player is loaded and ready.
  - Post-conditions: The user sees only the relevant control (play or pause) at any time.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Play/Pause toggle
      Given a track is playing
      Then only the pause button is visible
      When playback is paused
      Then only the play button is visible
    ```
  - Dependencies: FR-007.1

- FR-007.3: Playlist Track Data Display
  - Description: The player must display the total number of tracks in the playlist, the current track number, and detailed track information (artist, title, track length, current playhead value).
  - Pre-conditions: A playlist is loaded and a track is selected/playing.
  - Post-conditions: The user can see the current track number, total tracks, artist, title, track length, and playhead position.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Playlist track data display
      Given a playlist is loaded and a track is playing
      Then the UI shows the current track number and total tracks
      And the UI shows the artist, title, and length of the current track
      And the UI shows the current playhead value (elapsed time)
    ```
  - Dependencies: YouTube IFrame Player API

## Non-Functional Requirements

- NFR-007.1: Accessibility
  - Category: Usability
  - Description: All controls and track data displays must be fully keyboard accessible and have appropriate ARIA labels.
  - Metrics/Thresholds: Controls and displays meet WCAG 2.1 AA standards.

- NFR-007.2: Material UI Compliance
  - Category: UI Consistency
  - Description: All UI elements must use Material UI components.

## Technical Specifications & Guidance

- Use the YouTube IFrame Player API methods for next/prev (e.g., `nextVideo()`, `previousVideo()`), play/pause state, and fetching track data (e.g., `getVideoData()`, `getDuration()`, `getCurrentTime()`).
- Only one of play or pause should be visible at a time, based on the player state.
- Display track data (artist, title, length, playhead) using data from the YouTube API.
- Display the current track number and total tracks (e.g., "Track 3 of 12").
- Ensure all controls and displays are accessible and use ARIA labels.
- Use Material UI components for all UI elements.
- Ensure the player works on both desktop and mobile browsers.

## Dependencies

- YouTube IFrame Player API
- Material UI
- React 