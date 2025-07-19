# 003 - Static Site Generation Architecture: Vite SSG vs Next.js SSR/SSG

## Status

Accepted

## Date Log

2025-07-19 - Proposed
2025-07-19 - Accepted

## Context & Problem Statement

The project is migrating from a legacy static site generator to a modern React-based architecture. The next major decision is how to implement static site generation (SSG) for the "New Music Friday" playlist site. The options are to continue with Vite + React (current setup) and use Vite's SSG capabilities, or to migrate to Next.js for built-in SSR/SSG support. This decision will impact developer experience, hosting, build complexity, and future extensibility.

## Considered Options

1. Use Vite + React for SSG (current setup)
2. Migrate to Next.js for SSR/SSG

## Decision

Chosen option: "Use Vite + React for SSG (current setup)", because it aligns with the current stack, minimizes migration effort, and meets the project's requirements for static, public, weekly-updated content. Next.js offers more advanced SSR/SSG features, but would require a significant migration and is not currently needed for the MVP.

## Consequences

- Good, because:
  - Minimal migration effort (continue with current Vite + React setup)
  - Simpler build and deployment (static output)
  - No need to learn or maintain Next.js-specific APIs
  - Fast local development with Vite
  - Lower hosting costs (static hosting)
- Bad, because:
  - Less flexibility for future SSR or dynamic features
  - Some SSG features may require manual setup or plugins
  - If SSR is needed later, migration to Next.js may be required

## Details

### Considered options

#### 1. Use Vite + React for SSG (current setup)
- Use Vite's build process and available plugins for static site generation
- Keep the current project structure and tooling
- Generate static HTML at build time for all playlist pages
- Deploy as a static site (e.g., Netlify, Vercel, S3)
- Add SSG logic as needed (e.g., data fetching at build time)

#### 2. Migrate to Next.js for SSR/SSG
- Migrate the project to Next.js (React framework with built-in SSR/SSG)
- Use Next.js data fetching methods (getStaticProps, getServerSideProps)
- Gain flexibility for future SSR or API routes
- Requires significant migration and learning curve
- More complex build and deployment

--- 