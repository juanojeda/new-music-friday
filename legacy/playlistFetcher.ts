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

function renderUnifiedAudioPlayer(): string {
  return `
    <div class="audio-player">
      <div id="current-playlist"></div>
      <div id="current-track"></div>
      <button class="play" aria-label="Play/Pause">Play</button>
      <button class="prev" aria-label="Previous">Prev</button>
      <button class="next" aria-label="Next">Next</button>
      <input type="range" class="seek" min="0" max="100" value="0" aria-label="Seek" />
      <div class="yt-player" id="yt-player" style="width:0;height:0;overflow:hidden;"></div>
    </div>
  `;
}

function renderPlaylistList(playlists: Playlist[]): string {
  return `
    <ul class="playlist-list">
      ${playlists.map(p => `<li><button data-playlist-id="${p.id}">${p.name}</button></li>`).join('')}
    </ul>
  `;
}

export function generatePlaylistHtml(playlists: Playlist[]): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>New Music Friday Playlists</title>
    <script src="https://www.youtube.com/iframe_api"></script>
    <script src="player-setup.js"></script>
    <style>
      .yt-player { width: 0 !important; height: 0 !important; overflow: hidden !important; }
      .audio-player { display: flex; align-items: center; gap: 0.5em; margin-bottom: 1em; }
      .audio-player button, .audio-player input[type=range] { font-size: 1em; }
      .playlist-list { margin-bottom: 2em; }
      .playlist-list button { font-size: 1em; }
    </style>
  </head>
  <body>
    <h1>New Music Friday Playlists</h1>
    ${renderPlaylistList(playlists)}
    ${renderUnifiedAudioPlayer()}
  </body>
</html>`;
} 