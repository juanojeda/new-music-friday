import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { toSvg } from 'jdenticon';

export interface FetchPlaylistsOptions {
  apiKey: string;
  channelId: string;
  namePrefix: string;
}

export interface Playlist {
  id: string;
  name: string;
  publishedAt: string;
  thumbnail: string;
}

interface YouTubePlaylistItem {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails?: { default?: { url?: string } };
  };
}

const buildYouTubeApiUrl = ({ apiKey, channelId }: FetchPlaylistsOptions): string => {
  const url = new URL('https://www.googleapis.com/youtube/v3/playlists');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('channelId', channelId);
  url.searchParams.set('maxResults', '50');
  url.searchParams.set('key', apiKey);
  return url.toString();
};

const mapToPlaylist = (item: YouTubePlaylistItem): Playlist & { artworkSvg?: string } => ({
  id: item.id,
  name: item.snippet.title,
  publishedAt: item.snippet.publishedAt,
  thumbnail: item.snippet.thumbnails?.default?.url || '',
});

const filterByPrefix = (prefix: string) => (item: YouTubePlaylistItem) =>
  item.snippet.title.startsWith(prefix);

const getPublicJsonPath = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, '../public/playlists.nmf.json');
};

const writePlaylistsJson = (playlists: Playlist[]) => {
  const outPath = getPublicJsonPath();
  fs.writeFileSync(outPath, JSON.stringify(playlists, null, 2));
};

const redactKey = (key: string) => key.length > 8 ? key.slice(0, 4) + '***' + key.slice(-2) : '***';

export async function fetchPlaylists(opts: FetchPlaylistsOptions): Promise<void> {
  const url = buildYouTubeApiUrl(opts);
  console.log('[fetch-playlists] Fetching playlists');
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[fetch-playlists] YouTube API error:', res.status, res.statusText, text);
    throw new Error(`YouTube API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const playlists = (data.items || [])
    .filter(filterByPrefix(opts.namePrefix))
    .map(mapToPlaylist)
    .map((playlist) => ({
      ...playlist,
      artworkSvg: toSvg(playlist.id, 64),
    }));
  console.log(`[fetch-playlists] Writing ${playlists.length} playlists to public/playlists.nmf.json`);
  writePlaylistsJson(playlists);
}

// Load .env for local development
if (!process.env.CI) {
  try {
    const dotenv = await import('dotenv');
    dotenv.config();
    console.log('[fetch-playlists] Loaded .env file for local development');
  } catch (err) {
    console.warn('[fetch-playlists] dotenv not installed or failed to load');
  }
}

// ESM-compatible runner
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('[fetch-playlists] Starting playlist fetch script...');
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!apiKey || !channelId) {
    console.error('[fetch-playlists] Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID in environment.');
    process.exit(1);
  }
  console.log('[fetch-playlists] Using channelId:', channelId);
  console.log('[fetch-playlists] Using apiKey:', redactKey(apiKey));
  fetchPlaylists({
    apiKey,
    channelId,
    namePrefix: 'New Music Friday',
  })
    .then(() => {
      console.log('[fetch-playlists] Playlist fetch and write completed successfully.');
    })
    .catch((err) => {
      console.error('[fetch-playlists] Error during playlist fetch:', err);
      process.exit(1);
    });
} 