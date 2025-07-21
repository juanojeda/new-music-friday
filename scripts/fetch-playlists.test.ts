import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import path from 'path';

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof fs>('fs');
  return {
    ...actual,
    writeFileSync: vi.fn(),
  };
});

// Import the stubbed fetchPlaylists function
import { fetchPlaylists } from './fetch-playlists';

const TEST_JSON_PATH = path.resolve(__dirname, '../public/playlists.nmf.json');

describe('fetch-playlists script', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('writes an array of playlists with id, name, publishedAt, and thumbnail to public/playlists.nmf.json', async () => {
    // Arrange: mock YouTube API response and fs
    const mockPlaylists = [
      {
        id: 'PL123',
        name: 'New Music Friday 2025 July 18',
        publishedAt: '2025-07-15T04:03:29.241254Z',
        thumbnail: 'https://i.ytimg.com/vi/IKy-thh3fyE/default.jpg',
      },
      {
        id: 'PL456',
        name: 'New Music Friday - 2025 Jul 4',
        publishedAt: '2025-07-04T01:36:51.142934Z',
        thumbnail: 'https://i.ytimg.com/vi/NYQc2Q2omAQ/default.jpg',
      },
    ];
    // Act: call the (not yet implemented) fetchPlaylists
    await fetchPlaylists();
    // Assert: check that writeFileSync was called with the correct path and data
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      TEST_JSON_PATH,
      JSON.stringify(mockPlaylists, null, 2)
    );
  });
}); 