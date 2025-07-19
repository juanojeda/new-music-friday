import { generatePlaylistHtml, Playlist } from '../playlistFetcher';

describe('generatePlaylistHtml', () => {
  it('should generate an HTML page listing playlist names and IDs', () => {
    const playlists: Playlist[] = [
      { id: '1', name: 'New Music Friday - 2024-06-07', publishedAt: '2024-06-07T12:00:00Z' },
      { id: '3', name: 'New Music Friday - 2024-05-31', publishedAt: '2024-05-31T12:00:00Z' },
    ];

    const html = generatePlaylistHtml(playlists);

    expect(html).toContain('<html>');
    expect(html).toContain('New Music Friday - 2024-06-07');
    expect(html).toContain('New Music Friday - 2024-05-31');
    expect(html).toContain('id="1"');
    expect(html).toContain('id="3"');
  });

  it('should include a single unified audio player, a playlist list, and UI for playlist/track display', () => {
    const playlists: Playlist[] = [
      { id: 'PL123', name: 'New Music Friday - 2024-06-07', publishedAt: '2024-06-07T12:00:00Z' },
      { id: 'PL456', name: 'New Music Friday - 2024-05-31', publishedAt: '2024-05-31T12:00:00Z' },
    ];
    const html = generatePlaylistHtml(playlists);
    // Only one audio player container
    expect(html.match(/class="audio-player"/g)?.length).toBe(1);
    // Playlist list is present
    expect(html).toContain('class="playlist-list"');
    // Playlist selection buttons are present
    expect(html).toContain('data-playlist-id="PL123"');
    expect(html).toContain('data-playlist-id="PL456"');
    // UI for displaying current playlist and track
    expect(html).toContain('id="current-playlist"');
    expect(html).toContain('id="current-track"');
  });
}); 