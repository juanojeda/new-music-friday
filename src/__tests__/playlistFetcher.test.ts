import { fetchNewMusicFridayPlaylists, Playlist } from '../playlistFetcher';

describe('fetchNewMusicFridayPlaylists', () => {
  it('should return only playlists whose names start with "New Music Friday"', async () => {
    // Mock data simulating playlists from YouTube Music
    const mockPlaylists: Playlist[] = [
      { id: '1', name: 'New Music Friday - 2024-06-07', publishedAt: '2024-06-07T12:00:00Z' },
      { id: '2', name: 'Old Hits', publishedAt: '2024-05-15T12:00:00Z' },
      { id: '3', name: 'New Music Friday - 2024-05-31', publishedAt: '2024-05-31T12:00:00Z' },
      { id: '4', name: 'Workout Mix', publishedAt: '2024-04-20T12:00:00Z' },
    ];

    // Mock the API call inside the fetcher
    const fetcher = jest.fn().mockResolvedValue(mockPlaylists);

    // Call the function under test
    const result = await fetchNewMusicFridayPlaylists(fetcher);

    // Expect only the correct playlists to be returned
    expect(result).toEqual([
      { id: '1', name: 'New Music Friday - 2024-06-07', publishedAt: '2024-06-07T12:00:00Z' },
      { id: '3', name: 'New Music Friday - 2024-05-31', publishedAt: '2024-05-31T12:00:00Z' },
    ]);
  });
}); 