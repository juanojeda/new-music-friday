# ADR-006: Deploying the Published Site

## Status

Accepted

## Date Log

2025-02-22 - Proposed
2025-02-22 - Accepted, updated to select GitHub Pages as deployment target

## Context & Problem Statement

The project requires a reliable, maintainable, and cost-effective way to deploy the static site after it is built. The user is familiar with Netlify, GitHub Pages, and AWS, and has accounts for each. The deployment solution should support static site hosting, custom domains, SSL, and continuous deployment from the repository.

## Considered Options

1. Netlify
2. GitHub Pages
3. AWS (S3 + CloudFront)

## Decision

Chosen option: "GitHub Pages", because it is completely free for public repositories, keeps the deployment workflow within the GitHub ecosystem, and supports custom domains and SSL. The user is already familiar with this workflow, and it reduces the need for third-party services. Other options remain viable for future needs if requirements change.

## Consequences

- Good, because deployment is free for public repositories and tightly integrated with GitHub.
- Good, because GitHub Pages supports custom domains, SSL, and automated deployment via GitHub Actions.
- Good, because the workflow is simple and keeps all project assets and automation within the same ecosystem.
- Bad, because some advanced features (e.g., deploy previews, instant rollbacks) require additional setup or are less seamless than Netlify.
- Bad, because more complex build or preview workflows may require custom GitHub Actions configuration.

## Details

### Considered options

#### Netlify

- Connects directly to GitHub repository.
- Automatically builds and deploys the site on push to the main branch.
- Provides built-in SSL, CDN, custom domain management, and deploy previews.
- Minimal configuration required; supports environment variables and build hooks.
- Free tier is generous for most static sites.
- Familiar workflow for the user.

#### GitHub Pages

- Deploys static site from a branch (e.g., `gh-pages`).
- Integrates with GitHub Actions for automated builds and deploys.
- Supports custom domains and SSL via Let's Encrypt.
- Free for public repositories.
- Slightly more manual setup for custom build steps and previews.
- User is familiar with this workflow.

#### AWS (S3 + CloudFront)

- Host static site in an S3 bucket, serve via CloudFront CDN.
- Supports custom domains, SSL (via ACM), and advanced CDN configuration.
- Requires manual setup of S3, CloudFront, SSL certificates, and deployment automation (e.g., via GitHub Actions or CI/CD pipeline).
- Scalable and highly configurable, but more complex to maintain.
- May incur costs depending on usage.
- User has AWS account and experience.
