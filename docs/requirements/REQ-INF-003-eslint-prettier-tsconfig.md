# REQ-INF-003-eslint-prettier-tsconfig.md

## User Story

As a developer, I want consistent linting, formatting, and type checking in the React codebase, so that code quality is maintained and onboarding is easy.

## Functional Requirements

- FR-INF-003-001: Configure ESLint for React + TypeScript
  - Description: ESLint must be set up using the flat config system, with rules for React, TypeScript, and Prettier integration. The legacy directory must be excluded from linting.
  - Pre-conditions: React app is set up at the project root.
  - Post-conditions: Running `npm run lint` checks all new code for lint and type issues, excluding legacy code.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Linting the codebase
      Given the React app and ESLint config
      When I run `npm run lint`
      Then only new code is checked for lint issues
      And legacy code is ignored
      And Prettier formatting is enforced
    ```
  - Dependencies: INF-001

- FR-INF-003-002: Configure Prettier for code formatting
  - Description: Prettier must be set up with a config file and integrated with ESLint. Running `npm run format` formats all code according to the project style.
  - Pre-conditions: React app is set up at the project root.
  - Post-conditions: Code is consistently formatted.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Formatting the codebase
      Given the React app and Prettier config
      When I run `npm run format`
      Then all code is formatted according to the project style
    ```
  - Dependencies: INF-001

- FR-INF-003-003: Configure TypeScript for strict type checking
  - Description: TypeScript must be set up with strict settings, supporting React and Vite. The config must include only the new code and exclude legacy code.
  - Pre-conditions: React app is set up at the project root.
  - Post-conditions: TypeScript checks all new code for type errors, excluding legacy code.
  - Acceptance Criteria:
    ```Gherkin
    Scenario: Type checking the codebase
      Given the React app and tsconfig.json
      When I run `tsc --noEmit`
      Then only new code is checked for type errors
      And legacy code is ignored
    ```
  - Dependencies: INF-001

## Non-Functional Requirements

- NFR-INF-003-001: Linting, formatting, and type checking must run in under 1 minute for the current codebase.
- NFR-INF-003-002: All tools must work on macOS and Linux.

## Technical Guidance

- Use ESLint flat config (CommonJS) with React, TypeScript, and Prettier plugins.
- Exclude the legacy directory from linting and type checking.
- Use Prettier config file for formatting rules.
- Use strict TypeScript settings in tsconfig.json, including only the new code.
- Provide npm scripts for linting (`npm run lint`), formatting (`npm run format`), and type checking (`tsc --noEmit`).
