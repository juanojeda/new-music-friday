export async function fetchNewMusicFridayPlaylists(fetcher: () => Promise<{ id: string; name: string }[]>): Promise<{ id: string; name: string }[]> {
  const playlists = await fetcher();
  return playlists.filter(p => p.name.startsWith('New Music Friday'));
} 