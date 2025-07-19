export interface Playlist {
  id: string;
  name: string;
}

/**
 * Fetches all playlists and filters to those whose names start with 'New Music Friday'.
 * @param fetcher - A function that returns a Promise resolving to an array of Playlist objects.
 */
export async function fetchNewMusicFridayPlaylists(fetcher: () => Promise<Playlist[]>): Promise<Playlist[]> {
  const playlists = await fetcher();
  return playlists.filter(p => p.name.startsWith('New Music Friday'));
}

function renderPlaylistListItems(playlists: Playlist[]): string {
  return playlists.map(p => `<li id="${p.id}">${p.name}</li>`).join('\n      ');
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