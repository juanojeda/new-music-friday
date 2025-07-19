import { fetchYouTubeMusicPlaylists, Playlist } from '../playlistFetcher';
import dotenv from 'dotenv';
dotenv.config();

describe('fetchYouTubeMusicPlaylists (integration)', () => {
  it('should fetch public playlists for a given channel ID and filter by name prefix', async () => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;
    if (!apiKey || !channelId) throw new Error('Missing API key or channel ID in .env');

    const playlists: Playlist[] = await fetchYouTubeMusicPlaylists({ apiKey, channelId, namePrefix: 'New Music Friday' });

    expect(Array.isArray(playlists)).toBe(true);
    expect(playlists.length).toBeGreaterThan(0);
    for (const playlist of playlists) {
      expect(playlist.name.startsWith('New Music Friday')).toBe(true);
      expect(typeof playlist.id).toBe('string');
    }
  });
}); 