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