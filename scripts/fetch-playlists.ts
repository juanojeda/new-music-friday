import * as fs from 'fs';
import path from 'path';

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

const mapToPlaylist = (item: YouTubePlaylistItem): Playlist => ({
  id: item.id,
  name: item.snippet.title,
  publishedAt: item.snippet.publishedAt,
  thumbnail: item.snippet.thumbnails?.default?.url || '',
});

const filterByPrefix = (prefix: string) => (item: YouTubePlaylistItem) =>
  item.snippet.title.startsWith(prefix);

const writePlaylistsJson = (playlists: Playlist[]) => {
  const outPath = path.resolve(__dirname, '../public/playlists.nmf.json');
  fs.writeFileSync(outPath, JSON.stringify(playlists, null, 2));
};

export async function fetchPlaylists(opts: FetchPlaylistsOptions): Promise<void> {
  const url = buildYouTubeApiUrl(opts);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const playlists = (data.items || [])
    .filter(filterByPrefix(opts.namePrefix))
    .map(mapToPlaylist);
  writePlaylistsJson(playlists);
} 