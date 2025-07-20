# REQ-MIG-005: YouTube AudioPlayer Integration and Controlled Playlist Selection

## User Story

As a user, I want to select a playlist and have it play in a unified audio player, so that I can listen to any New Music Friday playlist without reloading the page or losing my place.

## Functional Requirements

- **FR-MIG-005-1: Controlled AudioPlayer**
  - Description: The App component must track the selected playlist and pass it as a prop to the AudioPlayer. The AudioPlayer must not manage selection state internally.
  - Pre-conditions: The App renders both PlaylistList and AudioPlayer.
  - Post-conditions: The selected playlist is always reflected in the AudioPlayer.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Selecting a playlist updates the AudioPlayer
      Given the user sees a list of playlists
      When the user clicks a playlist
      Then the AudioPlayer receives the selected playlist as a prop
      And the player updates to reflect the new selection
    ```
  - Dependencies: MIG-002

- **FR-MIG-005-2: YouTube IFrame Player API Integration**
  - Description: The AudioPlayer must load the YouTube IFrame API and create a player instance if one does not exist. Controls are only rendered when the player is ready.
  - Pre-conditions: AudioPlayer receives a playlist prop.
  - Post-conditions: The YouTube player is loaded and ready, and controls are visible.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: AudioPlayer loads YouTube API and renders controls
      Given the AudioPlayer receives a playlist
      When the player is not yet loaded
      Then the YouTube IFrame API script is injected
      And controls are only rendered after the player is ready
    ```
  - Dependencies: FR-MIG-005-1

- **FR-MIG-005-3: Playlist Switching and Player Reuse**
  - Description: If the YouTube player is already loaded, the AudioPlayer must call loadPlaylist on the player when the playlist prop changes, without recreating the player.
  - Pre-conditions: The player is ready and a playlist is already loaded.
  - Post-conditions: The new playlist is loaded in the existing player instance.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Switching playlists reuses the player
      Given the AudioPlayer is ready and a playlist is loaded
      When the user selects a different playlist
      Then the AudioPlayer calls loadPlaylist on the existing player
      And the new playlist is loaded without recreating the player
    ```
  - Dependencies: FR-MIG-005-2

## Non-Functional Requirements

- NFR-MIG-005-1: The AudioPlayer must not cause memory leaks or duplicate YouTube player instances.
- NFR-MIG-005-2: The UI must remain responsive and accessible during player loading and playlist switching.

## Atomic Steps

1. Implement controlled AudioPlayer: App tracks selection, passes playlist as prop.
2. AudioPlayer loads YouTube IFrame API and creates player if not present.
3. Render controls only when player is ready.
4. On playlist change, call loadPlaylist on existing player (do not recreate).
5. Ensure no memory leaks or duplicate players.
6. Add tests for all above behaviors.
