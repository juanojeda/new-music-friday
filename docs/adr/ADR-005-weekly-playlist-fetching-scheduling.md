# ADR-005: Weekly Playlist Fetching Scheduling

## Status
Proposed

## Context

The app requires up-to-date playlist data from YouTube Music, fetched and stored in `public/playlists.nmf.json`. This data must be refreshed weekly to ensure the site displays the latest "New Music Friday" playlists. The playlist fetching script is implemented as a Node.js script and must be run on a schedule, with the results committed to the repository and deployed to the static site.

## Options Considered

### 1. GitHub Actions Scheduled Workflow (**Recommended**)
- **How it works:**
  - Use GitHub Actions to run the script on a cron schedule (e.g., every Friday).
  - The workflow installs dependencies, runs the script, commits the updated JSON, and (optionally) triggers a site rebuild/deploy.
- **Management:**
  - Managed via `.github/workflows/` YAML file in the repo.
  - Credentials (YouTube API key, channel ID) stored as GitHub Secrets.
  - No server or cloud infrastructure to maintain.
- **Costs:**
  - Free for public repositories (generous minutes/month for private repos).
  - No additional hosting or compute costs.
- **Reliability:**
  - High; GitHub Actions is robust and widely used.
- **Process:**
  1. Add workflow YAML to repo.
  2. Add API credentials as GitHub Secrets.
  3. Ensure the script is runnable via `npm run fetch-playlists`.
  4. The workflow runs weekly, commits changes, and triggers deploy.
- **Drawbacks:**
  - Limited to GitHub-hosted repos.
  - Workflow minutes are limited for private repos (but generous for most use cases).

### 2. Serverless Function with Scheduled Trigger
- **How it works:**
  - Deploy the script as a serverless function (AWS Lambda, Vercel/Netlify Scheduled Functions).
  - Use a scheduler (e.g., AWS EventBridge, Vercel/Netlify cron) to invoke weekly.
  - Write output to a storage bucket or push to the repo via API.
- **Management:**
  - Requires cloud account setup and function deployment.
  - Credentials managed in cloud provider's secret manager.
- **Costs:**
  - Free tier covers most use cases (AWS Lambda, Vercel, Netlify), but may incur small costs if usage grows.
  - Possible egress/storage costs if writing to S3 or similar.
- **Reliability:**
  - High, but requires cloud setup and monitoring.
- **Process:**
  1. Deploy function to provider.
  2. Set up schedule and credentials.
  3. Handle output (commit to repo, upload to storage, or trigger deploy).
- **Drawbacks:**
  - More complex setup and maintenance.
  - May require additional permissions for repo writes or storage access.

### 3. Self-Hosted Cron Job
- **How it works:**
  - Run the script on a personal or company server using cron.
  - Commit and push the updated JSON to the repo.
- **Management:**
  - Requires maintaining a server (uptime, security, updates).
  - Credentials managed locally.
- **Costs:**
  - Cost of server (cloud VM, on-prem, or always-on device).
  - Maintenance time and risk.
- **Reliability:**
  - Depends on server uptime and maintenance.
- **Process:**
  1. Set up Node.js and repo on server.
  2. Add cron job to run script weekly.
  3. Store credentials securely.
  4. Commit and push changes.
- **Drawbacks:**
  - Highest maintenance burden.
  - Single point of failure.

## Decision

**Use GitHub Actions scheduled workflow for weekly playlist fetching.**

- It is the simplest, most reliable, and lowest-cost option for static/JAMstack sites.
- No server or cloud account to manage.
- Easy to audit, update, and monitor via GitHub UI.

## Consequences

- The playlist data will be updated weekly via GitHub Actions, with changes committed to the repo and triggering a site rebuild/deploy.
- Credentials must be stored as GitHub Secrets.
- If the repo is ever moved off GitHub, a new scheduling solution will be needed.

## Rough Setup Process

1. **Add workflow YAML:** Create `.github/workflows/fetch-playlists.yml` with a weekly cron schedule and steps to run the script, commit, and push changes.
2. **Store credentials:** Add `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` as GitHub repository secrets.
3. **Ensure script is runnable:** Add an npm script (e.g., `npm run fetch-playlists`) that runs the Node.js script.
4. **Monitor:** Use GitHub Actions UI to monitor runs and troubleshoot failures.
5. **(Optional) Trigger deploy:** If using Netlify, Vercel, etc., add a step to trigger a build hook after committing changes.

## References
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify Scheduled Functions](https://docs.netlify.com/functions/scheduled-functions/)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) 