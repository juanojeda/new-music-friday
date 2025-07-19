import fetch from 'node-fetch';

export interface Playlist {
  id: string;
  name: string;
  publishedAt: string; // ISO date string
}

/**
 * Fetches all playlists and filters to those whose names start with 'New Music Friday'.
 * @param fetcher - A function that returns a Promise resolving to an array of Playlist objects.
 */
export async function fetchNewMusicFridayPlaylists(fetcher: () => Promise<Playlist[]>): Promise<Playlist[]> {
  const playlists = await fetcher();
  return playlists.filter(p => p.name.startsWith('New Music Friday'));
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

  return playlists.filter(p => p.name.startsWith(namePrefix));
}

function renderPlaylistListItems(playlists: Playlist[]): string {
  return playlists.map(p => `
    <li id="${p.id}">
      <div>${p.name}</div>
      <iframe
        width="400"
        height="225"
        src="https://www.youtube.com/embed/videoseries?list=${p.id}"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
        title="YouTube Playlist Player"
      ></iframe>
    </li>
  `).join('\n      ');
}

export function generatePlaylistHtml(playlists: Playlist[]): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>New Music Friday Playlists</title>
  </head>
  <body>
    <h1>New Music Friday Playlists</h1>
    <ul>
      ${renderPlaylistListItems(playlists)}
    </ul>
  </body>
</html>`;
} 