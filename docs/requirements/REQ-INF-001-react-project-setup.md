# REQ-INF-001-react-project-setup.md

## User Story

As a developer, I want the project to use a standard React setup with Vite (or Create React App) so that the codebase is maintainable, testable, and easy to onboard new contributors.

## Functional Requirements

- FR-INF-001: Initialize a new React project using Vite (preferred) or Create React App with TypeScript template.
  - Description: The project must be bootstrapped using Vite (preferred) or CRA, configured for TypeScript.
  - Pre-conditions: None.
  - Post-conditions: A new React project structure exists in the repository, ready for further development.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Project is initialized with React and TypeScript
      Given a clean repository
      When the React project is initialized
      Then the codebase contains a src/ directory with React entry point
      And the project can be started with a single command (e.g., npm run dev)
      And TypeScript is configured and working
    ```
  - Dependencies: None
- FR-INF-002: The new React architecture and structure must replace the current one, not be put within a subdirectory.
  - Description: The migration must result in the new React app and supporting files being at the project root, replacing the old architecture.
  - Pre-conditions: Existing project structure is present.
  - Post-conditions: The old string-template/vanilla JS structure is removed or replaced; React app is at the root of the repository.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: New React architecture replaces old structure
      Given the existing project structure
      When the migration is performed
      Then the React app and supporting files are at the project root
      And the old architecture is removed or replaced
    ```
  - Dependencies: FR-INF-001
- FR-INF-003: Legacy code must be preserved in a temporary directory during migration.
  - Description: All legacy code (e.g., vanilla JS, string-template files) should be moved to a `legacy/` directory at the project root during migration, not deleted until the migration is complete and verified.
  - Pre-conditions: Existing project structure is present.
  - Post-conditions: Legacy code is available for reference in `legacy/` until all features are migrated and tested.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Legacy code is preserved during migration
      Given the existing project structure
      When the React migration begins
      Then all legacy code is moved to a legacy/ directory at the project root
      And legacy code is only deleted after successful migration and verification
    ```
  - Dependencies: FR-INF-001, FR-INF-002

## Non-Functional Requirements

- NFR-INF-001: The setup must use the latest stable versions of React, Vite (or CRA), and TypeScript.
- NFR-INF-002: The project must be able to run locally on macOS and Linux.

## Technical Guidance

- Use Vite with the React + TypeScript template: `npm create vite@latest . -- --template react-ts` (note the use of `.` to scaffold in the root directory)
- If Vite is not feasible, use Create React App: `npx create-react-app . --template typescript`
- Do not place the new React app in a subdirectory; it must be at the project root.
- Move all legacy code to a `legacy/` directory at the root during migration. Do not delete legacy code until all features are migrated and tested.
- Remove or migrate any legacy code as part of the migration process, only after successful verification.
- Ensure the project can be started with `npm run dev` or equivalent
- Do not include unnecessary boilerplate code
