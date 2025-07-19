import { fetchYouTubeMusicPlaylists, generatePlaylistHtml } from '../src/playlistFetcher';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

async function main() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!apiKey || !channelId) {
    throw new Error('Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID in .env');
  }

  const playlists = await fetchYouTubeMusicPlaylists({
    apiKey,
    channelId,
    namePrefix: 'New Music Friday',
  });
  const html = generatePlaylistHtml(playlists);
  fs.writeFileSync('output.html', html);
  console.log('Generated output.html');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 