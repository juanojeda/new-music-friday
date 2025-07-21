import * as fs from 'fs';
import path from 'path';

export interface FetchPlaylistsOptions {
  apiKey: string;
  channelId: string;
  namePrefix: string;
}

export async function fetchPlaylists(opts: FetchPlaylistsOptions): Promise<void> {
  const { apiKey, channelId, namePrefix } = opts;
  const url = new URL('https://www.googleapis.com/youtube/v3/playlists');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('channelId', channelId);
  url.searchParams.set('maxResults', '50');
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`YouTube API error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const playlists = (data.items || [])
    .filter((item: any) => item.snippet.title.startsWith(namePrefix))
    .map((item: any) => ({
      id: item.id,
      name: item.snippet.title,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails?.default?.url || '',
    }));
  const outPath = path.resolve(__dirname, '../public/playlists.nmf.json');
  fs.writeFileSync(outPath, JSON.stringify(playlists, null, 2));
} 