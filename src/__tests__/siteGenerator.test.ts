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

  it('should include a custom audio player container and YouTube IFrame API script for each playlist', () => {
    const playlists: Playlist[] = [
      { id: 'PL123', name: 'New Music Friday - 2024-06-07', publishedAt: '2024-06-07T12:00:00Z' },
    ];
    const html = generatePlaylistHtml(playlists);
    // Check for the YouTube IFrame API script
    expect(html).toContain('https://www.youtube.com/iframe_api');
    // Check for a custom player container
    expect(html).toContain('class="audio-player"');
    // Should not contain a visible <iframe> with width/height > 0
    expect(html).not.toMatch(/<iframe[^>]+width\s*=\s*"?\d{2,}"?/);
  });
}); 