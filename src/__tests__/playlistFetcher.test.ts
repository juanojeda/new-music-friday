import { fetchNewMusicFridayPlaylists, Playlist } from '../playlistFetcher';

describe('fetchNewMusicFridayPlaylists', () => {
  it('should return only playlists whose names start with "New Music Friday"', async () => {
    // Mock data simulating playlists from YouTube Music
    const mockPlaylists: Playlist[] = [
      { id: '1', name: 'New Music Friday - 2024-06-07' },
      { id: '2', name: 'Old Hits' },
      { id: '3', name: 'New Music Friday - 2024-05-31' },
      { id: '4', name: 'Workout Mix' },
    ];

    // Mock the API call inside the fetcher
    const fetcher = jest.fn().mockResolvedValue(mockPlaylists);

    // Call the function under test
    const result = await fetchNewMusicFridayPlaylists(fetcher);

    // Expect only the correct playlists to be returned
    expect(result).toEqual([
      { id: '1', name: 'New Music Friday - 2024-06-07' },
      { id: '3', name: 'New Music Friday - 2024-05-31' },
    ]);
  });
}); 