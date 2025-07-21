# New Music Friday

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
