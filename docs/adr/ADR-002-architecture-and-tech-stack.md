# 002 - Adopt React, Material UI, and Standard Tooling for Maintainable, Testable Architecture

## Status

Accepted

## Date Log

2025-07-19 - Proposed
2025-07-19 - Accepted

## Context & Problem Statement

The current application uses string-based HTML generation and vanilla JavaScript for UI, resulting in flakey, hard-to-test, and hard-to-maintain components. The setup is not standard, making debugging and onboarding difficult. There is no use of a modern UI framework, and the tech stack is minimal (TypeScript, Node, Jest, node-fetch).

## Considered Options

1. Continue with current approach (string templates, vanilla JS)
2. Adopt React with Material UI and standard project structure (recommended)
3. Use another modern framework (Vue, Svelte, etc.)

## Decision

Chosen option: "Adopt React with Material UI and standard project structure", because it is idiomatic for TypeScript, improves maintainability, testability, and onboarding, and aligns with industry standards. Material UI ensures accessible, consistent UI components. React's component model and ecosystem support robust testing and maintainability.

## Consequences

- Good, because:
  - UI components become modular, reusable, and testable
  - Standard project structure (src/components, src/pages, etc.)
  - Easier onboarding for new developers
  - Leverage React/Material UI ecosystem (testing, accessibility, docs)
  - Improved debugging and dev tooling (React DevTools, etc.)
- Bad, because:
  - Requires migration effort
  - Increases bundle size compared to vanilla JS
  - Adds build complexity (webpack, Vite, etc.)

## Details

### Considered options

#### 1. Continue with current approach

- Minimal dependencies, but poor maintainability and testability. Not idiomatic for modern TypeScript web apps.

#### 2. Adopt React with Material UI and standard tooling (Recommended)

- Use React for all UI components
- Use Material UI for accessible, consistent UI
- Organize code into src/components, src/pages, etc.
- Use Vite or Create React App for standard setup
- Use React Testing Library and Jest for tests
- Use TypeScript throughout
- Use environment variables for config
- Use Prettier/ESLint for code quality

#### 3. Use another modern framework (Vue, Svelte, etc.)

- Similar benefits to React, but React is more widely adopted and aligns with team skills/industry standards.

### Migration Plan (if adopted)

- Set up new React project with Vite or CRA
- Migrate static site generation logic to React (consider Next.js for SSR/SSG)
- Rebuild audio player and playlist UI as React components using Material UI
- Write tests for all components
- Gradually phase out old string-template code

---
