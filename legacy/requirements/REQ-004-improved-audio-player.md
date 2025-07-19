# REQ-004: Improved Audio Player Experience (YouTube IFrame Player API)

## User Story

As a visitor, I want the playlist player to look and behave like an audio player (not a video player), so that the experience matches the audio-only content and provides intuitive controls.

## Functional Requirements

- FR-004.1: Audio-Only Player UI
  - Description: The player must visually resemble an audio player, not a video player. The video portion of the YouTube embed must be hidden or minimized.
  - Pre-conditions: Playlists are available and playable via YouTube Music.
  - Post-conditions: The user sees an audio-style player for each playlist.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Audio-only player UI
      Given a playlist is available for playback
      When the page is rendered
      Then the player does not show the video area
      And the player visually resembles an audio player
    ```
  - Dependencies: YouTube IFrame Player API

- FR-004.2: Custom Media Controls
  - Description: The player must provide custom controls for play/pause, next/prev track, and a seek bar (track head control).
  - Pre-conditions: The player is loaded and ready.
  - Post-conditions: The user can control playback using the custom controls.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Custom media controls
      Given the player is loaded
      When the user interacts with play, pause, next, prev, or seek controls
      Then the corresponding action is performed on the playlist
    ```
  - Dependencies: FR-004.1, YouTube IFrame Player API

## Non-Functional Requirements

- NFR-004.1: Accessibility
  - Category: Usability
  - Description: All controls must be keyboard accessible and have appropriate ARIA labels.
  - Metrics/Thresholds: Controls meet WCAG 2.1 AA standards.

- NFR-004.2: Visual Clarity
  - Category: Usability
  - Description: The player UI must be visually clear and intuitive, with no visible video area.

## Technical Specifications & Guidance

- Use the YouTube IFrame Player API to embed and control the playlist.
- Hide the video area using CSS (e.g., set height to 0, overflow hidden, or overlay a static image).
- Implement custom controls in HTML/JS and wire them to the YouTube API methods.
- Ensure the player works on both desktop and mobile browsers.
