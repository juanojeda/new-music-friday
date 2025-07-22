# REQ-009: Dynamic Material UI Theme from Playlist Artwork

## User Story

As a user, I want the app's theme to dynamically reflect the unique artwork of each playlist, so that the UI feels personalized and visually cohesive with the selected playlist.

## Functional Requirements

- FR-009-001: Generate unique SVG artwork for each playlist using jdenticon
  - Description: When playlists are fetched (as part of the fetch-playlists task), generate a unique SVG artwork for each playlist using its ID as the seed with the jdenticon library. The generated SVG must be included in the playlists.nmf.json payload.
  - Pre-conditions: Playlist data is available with unique IDs.
  - Post-conditions: Each playlist in playlists.nmf.json has a corresponding SVG artwork.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Generate SVG artwork for playlist during fetch-playlists
      Given a playlist with a unique ID
      When the fetch-playlists task runs
      Then an SVG artwork is generated for each playlist using jdenticon
      And the SVG is included in the playlists.nmf.json payload
    ```
  - Dependencies: Playlist fetching logic

- FR-009-002: Extract dominant color from SVG artwork
  - Description: For each generated SVG, extract the dominant color by analyzing the SVG markup directly. Determine the color of the `<path>` element with the most vector points (i.e., the path with the largest number of coordinate commands). This must occur during the fetch-playlists task, and the dominant color must be included in the playlists.nmf.json payload. **Do not render the SVG to a canvas or use pixel-based color extraction.**
  - Pre-conditions: SVG artwork is generated for each playlist.
  - Post-conditions: Each playlist in playlists.nmf.json has a dominant color value stored in its data.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Extract dominant color from SVG during fetch-playlists
      Given a playlist with generated SVG artwork
      When the fetch-playlists task runs
      Then the dominant color is determined by the color of the SVG path with the most vector points
      And the dominant color is stored with the playlist data in playlists.nmf.json
    ```
  - Dependencies: FR-009-001

- FR-009-003: Generate Material UI theme palette from dominant color
  - Description: Use the extracted dominant color as the seed to generate a Material UI theme palette, either via a utility library (e.g., material-you-color) or custom logic, and store the palette for each playlist.
  - Pre-conditions: Dominant color is available for each playlist.
  - Post-conditions: Each playlist has an associated theme palette.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Generate theme palette from dominant color
      Given a playlist with a dominant color
      When a theme palette is generated
      Then the palette is stored and ready for use with Material UI
    ```
  - Dependencies: FR-009-002

- FR-009-004: Dynamically update app theme on playlist selection
  - Description: When a user selects a playlist, update the Material UI theme in the app to use the selected playlist's palette, applying it via ThemeProvider.
  - Pre-conditions: Theme palettes are available for all playlists.
  - Post-conditions: The app's theme updates to match the selected playlist.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Dynamic theme update on playlist selection
      Given multiple playlists with theme palettes
      When a user selects a playlist
      Then the app's theme updates to use the selected playlist's palette
    ```
  - Dependencies: FR-009-003

- FR-009-005: Smoothly transition between themes
  - Description: Implement smooth visual transitions (e.g., using CSS transitions or framer-motion) when switching between themes to enhance user experience.
  - Pre-conditions: The app theme updates on playlist selection.
  - Post-conditions: Theme changes are visually smooth and not abrupt.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Smooth theme transition
      Given the app theme changes on playlist selection
      When a new playlist is selected
      Then the theme transition is visually smooth
    ```
  - Dependencies: FR-009-004

## Non-Functional Requirements

- NFR-009-001: All UI must use Material UI components and theming.
- NFR-009-002: Theme transitions must complete in under 500ms.
- NFR-009-003: The solution must work on modern browsers (latest Chrome, Firefox, Safari, Edge).

## Technical Specifications & Guidance

- Use jdenticon to generate SVGs for playlist artwork as part of the fetch-playlists task.
- **To extract the dominant color, parse the SVG markup and identify the `<path>` element with the most vector points (i.e., the most coordinate commands in its `d` attribute). Use the color (e.g., `fill` attribute) of this path as the dominant color. Do not render the SVG or use pixel-based color extraction.**
- Use a palette generation utility (e.g., material-you-color) to create a Material UI theme palette from the dominant color.
- Store the palette with each playlist's data for quick access.
- Update the Material UI theme via ThemeProvider when a playlist is selected.
- Use CSS transitions or framer-motion for smooth theme changes.
- Ensure all UI components use Material UI and respect the current theme.
