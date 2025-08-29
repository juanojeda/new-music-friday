# REQ-011-analytics.md

## User Story

As a product owner, I want to integrate Google Analytics into the web app (a React-based audio player built with Vite), so that I can track user behavior, understand engagement patterns, and gather data to make informed decisions about feature development and content optimization, specifically related to playlist and track interactions.
Functional Requirements

- FR-GA-001: Integrate Google Analytics Tracking Code

  - **Description**: The Google Analytics gtag.js tracking code snippet must be embedded into the web application.
  - **Pre-conditions**: A Google Analytics 4 (GA4) property and data stream are configured, providing a Measurement ID (e.g., G-XXXXXXXXXX).
  - **Post-conditions**: The GA4 tracking script is loaded on page load, ready to send data.
  - **Acceptance Criteria**:

    ```Gherkin
    Scenario: Google Analytics script inclusion
      Given the web app loads
      When the initial page content is rendered
      Then the Google Analytics gtag.js script is present in the page's HTML
      And the script initializes with the configured Measurement ID
  ```

  - Dependencies: None (initial setup)

- FR-GA-002: Track Page Views (Initial Load)

  - Description: The initial landing on the site (the single route) must be automatically tracked as a page view and sent to Google Analytics.

  - Pre-conditions: FR-GA-001 is implemented and active.

  - Post-conditions: Page view data (e.g., page path, page title) is sent to Google Analytics upon the application's initial load.

  - Acceptance Criteria:

  ```Gherkin
  Scenario: Initial page view tracking
      Given a user lands on the audio player site
      When the application finishes loading
      Then a 'page_view' event is sent to Google Analytics
      And the event includes the correct page path and page title for the main route
  ```

  - Dependencies: FR-GA-001

FR-GA-003: Track Custom Audio Player Interactions (Events)

  - Description: Specific user interactions within the audio player, such as playlist selection, track playback, and track navigation, must be tracked as custom events in Google Analytics.

  - Pre-conditions: FR-GA-001 is implemented and active.

  - Post-conditions: Defined custom events, along with relevant parameters (e.g., playlist name, track name), are sent to Google Analytics when the corresponding user interaction occurs.

  - Acceptance Criteria:

    ```Gherkin
  Scenario: Tracking a playlist load
      Given a user is on the audio player
      When the user selects and loads a specific playlist
      Then a 'playlist_loaded' custom event is sent to Google Analytics
      And the event includes a 'playlist_name' parameter (e.g., 'Rock Classics', 'Workout Mix')
    ```

  ```Gherkin
  Scenario: Tracking a track start
      Given a playlist is loaded and a track begins playing
      When the track playback starts
      Then a 'track_started' custom event is sent to Google Analytics
      And the event includes 'playlist_name' and 'track_name' parameters
    ```

    ```Gherkin
    Scenario: Tracking a track finish
      Given a track is playing
      When the track reaches its end
      Then a 'track_finished' custom event is sent to Google Analytics
      And the event includes 'playlist_name' and 'track_name' parameters
    ```
    ```Gherkin
    Scenario: Tracking a track skip
      Given a track is playing
      When the user skips to the next track or previous track
      Then a 'track_skipped' custom event is sent to Google Analytics
      And the event includes 'playlist_name', 'track_name', and 'skip_direction' (e.g., 'forward', 'backward') parameters
    ```
    ```Gherkin
    Scenario: Tracking play/pause actions
      Given a track is playing or paused
      When the user clicks the play or pause button
      Then a 'playback_control' custom event is sent to Google Analytics
      And the event includes 'playlist_name', 'track_name', and 'action' (e.g., 'play', 'pause') parameters
    ```
    ```Gherkin
    Scenario: Tracking volume changes
      Given a track is playing
      When the user adjusts the volume
      Then a 'volume_change' custom event is sent to Google Analytics
      And the event includes 'playlist_name', 'track_name', and 'new_volume_level' parameters
    ```Gherkin
    Scenario: Tracking search for playlists/tracks
      Given the user uses a search function
      When the user performs a search query
      Then a 'search_performed' custom event is sent to Google Analytics
      And the event includes a 'search_term' parameter
    ```Gherkin
    Scenario: Tracking favorite/like actions
      Given a user is listening to a track
      When the user marks a track as a favorite or likes it
      Then a 'track_favorited' custom event is sent to Google Analytics
      And the event includes 'playlist_name' and 'track_name' parameters
    ```Gherkin
    Scenario: Tracking sharing actions
      Given a user is listening to a track or playlist
      When the user initiates a share action (e.g., share button click)
      Then a 'share_initiated' custom event is sent to Google Analytics
      And the event includes 'content_type' (e.g., 'track', 'playlist'), 'content_name', and 'share_method' (e.g., 'twitter', 'copy_link') parameters
    ```

  - Dependencies: FR-GA-001

FR-GA-004: Anonymize User IP Addresses

  - Description: User IP addresses must be anonymized before being sent to Google Analytics to enhance user privacy.

  - Pre-conditions: FR-GA-001 is implemented and active.

  - Post-conditions: IP addresses are truncated or hashed by Google Analytics before storage, ensuring no full IP addresses are collected.

  - Acceptance Criteria:

    ```Gherkin
    Scenario: IP address anonymization
      Given Google Analytics tracking is active
      When any event or page view is sent
      Then the IP address information is anonymized according to GA4 best practices
    ```

  - Dependencies: FR-GA-001

## Non-Functional Requirements

  - NFR-GA-001: Performance Impact: The integration of Google Analytics must have a negligible impact on the web app's loading performance (e.g., less than 50ms increase in page load time).

  - NFR-GA-002: Data Privacy Compliance: The Google Analytics implementation must comply with relevant data privacy regulations (e.g., GDPR, CCPA) by enabling IP anonymization and respecting user consent preferences (if a consent management platform is used).

  - NFR-GA-003: Data Accuracy: The collected data must be accurate and consistent, reflecting actual user behavior without significant discrepancies.

  - NFR-GA-004: Maintainability: The Google Analytics implementation should be easily maintainable, allowing for future additions of tracking events or configuration changes with minimal code modifications.

## Technical Guidance

  - Tracking Code Placement: Embed the gtag.js snippet directly into the <head> section of the main index.html file or the root component of your React application.

  - React/Vite Specifics: For a React app built with Vite, ensure the gtag.js script is loaded once. Event tracking (e.g., gtag('event', ...)) should be implemented within React components using useEffect hooks or event handlers for specific user interactions.

  - SPA Page View Tracking: Since it's a single-route SPA, the page_view event will primarily fire on the initial load. No specific manual page_view calls are needed for route changes as there are none.

    Event Naming Convention: Adopt a consistent naming convention for custom events and their parameters (e.g., verb_noun for events, snake_case for parameters).

    Testing: Utilize Google Analytics DebugView and browser developer tools (Network tab) to verify that events are being sent correctly and with the expected parameters.

    Consent Management: If user consent is required (e.g., for GDPR), integrate with a Consent Management Platform (CMP) to load Google Analytics only after explicit user consent.