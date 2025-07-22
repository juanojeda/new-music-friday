# New Music Friday

Check it out: https://juanojeda.github.io/new-music-friday/

A minimal web app that fetches, displays, and lets you play public "New Music Friday" YouTube Music playlists. No login required. Playlists update weekly.

## Run Locally

1. Clone the repo and install dependencies:
   ```sh
   git clone <repo-url>
   cd new-music-friday
   npm install
   ```
2. Add a `.env` file with your YouTube API key and channel ID:
   ```env
   YOUTUBE_API_KEY=your-key
   YOUTUBE_CHANNEL_ID=your-channel-id
   ```
3. Fetch the latest playlists:
   ```sh
   npm run fetch-playlists
   ```
4. Start the app:
   ```sh
   npm run dev
   ```

Visit [http://localhost:5173](http://localhost:5173) to use the app.

## Deployment & GitHub Pages

The site is automatically deployed to GitHub Pages using GitHub Actions:

- On every push to the `main` branch, a GitHub Actions workflow builds the site and deploys the contents of the `dist/` directory to the `gh-pages` branch.
- GitHub Pages is configured to serve from the `gh-pages` branch in repository settings.
- No manual deployment steps are required for standard updates—just push to `main`.
- For details on the deployment workflow, see [REQ-010-github-pages-deployment.md](docs/requirements/REQ-010-github-pages-deployment.md).
