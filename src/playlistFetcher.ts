import fetch from 'node-fetch';

export interface Playlist {
  id: string;
  name: string;
  publishedAt: string; // ISO date string
}

function filterByNamePrefix(playlists: Playlist[], prefix: string): Playlist[] {
  return playlists.filter(p => p.name.startsWith(prefix));
}

/**
 * Fetches all playlists and filters to those whose names start with 'New Music Friday'.
 * @param fetcher - A function that returns a Promise resolving to an array of Playlist objects.
 */
export async function fetchNewMusicFridayPlaylists(fetcher: () => Promise<Playlist[]>): Promise<Playlist[]> {
  const playlists = await fetcher();
  return filterByNamePrefix(playlists, 'New Music Friday');
}

export async function fetchYouTubeMusicPlaylists(opts: { apiKey: string; channelId: string; namePrefix: string }): Promise<Playlist[]> {
  const { apiKey, channelId, namePrefix } = opts;
  let playlists: Playlist[] = [];
  let nextPageToken: string | undefined = undefined;

  do {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlists');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('channelId', channelId);
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('key', apiKey);
    if (nextPageToken) url.searchParams.set('pageToken', nextPageToken);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`YouTube API error: ${res.status} ${res.statusText}`);
    const data = await res.json();

    const fetched = (data.items || []).map((item: any) => ({
      id: item.id,
      name: item.snippet.title,
      publishedAt: item.snippet.publishedAt,
    }));
    playlists = playlists.concat(fetched);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return filterByNamePrefix(playlists, namePrefix);
}

function renderPlaylistListItems(playlists: Playlist[]): string {
  return playlists.map((p, i) => `
    <li id="${p.id}">
      <div>${p.name}</div>
      <div class="audio-player" id="audio-player-${i}">
        <button class="play" aria-label="Play/Pause">Play</button>
        <button class="prev" aria-label="Previous">Prev</button>
        <button class="next" aria-label="Next">Next</button>
        <input type="range" class="seek" min="0" max="100" value="0" aria-label="Seek" />
      </div>
      <div class="yt-player" id="yt-player-${i}" style="width:0;height:0;overflow:hidden;"></div>
    </li>
  `).join('\n      ');
}

export function generatePlaylistHtml(playlists: Playlist[]): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>New Music Friday Playlists</title>
    <script src="https://www.youtube.com/iframe_api"></script>
    <script>
      // This script will be filled in with player setup logic in a real implementation
      // For now, it is a placeholder for the YouTube IFrame Player API usage
    </script>
  </head>
  <body>
    <h1>New Music Friday Playlists</h1>
    <ul>
      ${renderPlaylistListItems(playlists)}
    </ul>
  </body>
</html>`;
} 