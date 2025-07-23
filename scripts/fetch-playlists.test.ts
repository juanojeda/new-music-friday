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

const _TEST_JSON_FILE = 'playlists.test.nmf.json';
const _TEST_JSON_PATH = path.resolve(__dirname, `../public/${_TEST_JSON_FILE}`);

describe('fetch-playlists script', () => {
  beforeEach(async () => {
    const _filePath = _TEST_JSON_PATH;
    if (fs.existsSync(_filePath)) {
      fs.unlinkSync(_filePath);
    }
  });

  it('writes an array of playlists with id, name, publishedAt, and thumbnail to public/playlists.test.nmf.json', async () => {
    // Arrange: mock YouTube API response and fs
    const _mockPlaylists = [
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
    // Mock fetch to return these in YouTube API format
    const mockApiResponse = {
      items: [
        {
          id: 'PL123',
          snippet: {
            title: 'New Music Friday 2025 July 18',
            publishedAt: '2025-07-15T04:03:29.241254Z',
            thumbnails: { default: { url: 'https://i.ytimg.com/vi/IKy-thh3fyE/default.jpg' } },
          },
        },
        {
          id: 'PL456',
          snippet: {
            title: 'New Music Friday - 2025 Jul 4',
            publishedAt: '2025-07-04T01:36:51.142934Z',
            thumbnails: { default: { url: 'https://i.ytimg.com/vi/NYQc2Q2omAQ/default.jpg' } },
          },
        },
      ],
      nextPageToken: undefined,
    };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });
    // Act: call the (not yet implemented) fetchPlaylists
    await fetchPlaylists({ apiKey: '', channelId: '', namePrefix: '' });
    // Assert: check that writeFileSync was called
    expect(fs.writeFileSync).toHaveBeenCalled();
    const [_filePath, data] = (
      fs.writeFileSync as unknown as { mock: { calls: [unknown, string][] } }
    ).mock.calls[0];
    const playlists = JSON.parse(data);
    expect(playlists).toEqual([
      expect.objectContaining(_mockPlaylists[0]),
      expect.objectContaining(_mockPlaylists[1]),
    ]);
  });

  it('fetches playlists from the YouTube API, filters by name prefix, and writes correct data to JSON', async () => {
    // Arrange: mock global fetch
    const mockApiResponse = {
      items: [
        {
          id: 'PL123',
          snippet: {
            title: 'New Music Friday 2025 July 18',
            publishedAt: '2025-07-15T04:03:29.241254Z',
            thumbnails: { default: { url: 'https://i.ytimg.com/vi/IKy-thh3fyE/default.jpg' } },
          },
        },
        {
          id: 'PL999',
          snippet: {
            title: 'Old Playlist',
            publishedAt: '2025-01-01T00:00:00Z',
            thumbnails: { default: { url: 'https://i.ytimg.com/vi/OLD/default.jpg' } },
          },
        },
        {
          id: 'PL456',
          snippet: {
            title: 'New Music Friday - 2025 Jul 4',
            publishedAt: '2025-07-04T01:36:51.142934Z',
            thumbnails: { default: { url: 'https://i.ytimg.com/vi/NYQc2Q2omAQ/default.jpg' } },
          },
        },
      ],
      nextPageToken: undefined,
    };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });
    // Act: call fetchPlaylists with test config (to be implemented)
    await fetchPlaylists({
      apiKey: 'FAKE_KEY',
      channelId: 'FAKE_CHANNEL',
      namePrefix: 'New Music Friday',
      fileName: _TEST_JSON_FILE,
    });
    // Assert: only playlists with the prefix are written
    const [_filePath, data] = (
      fs.writeFileSync as unknown as { mock: { calls: [unknown, string][] } }
    ).mock.calls[0];
    const playlists = JSON.parse(data);
    expect(playlists).toEqual([
      expect.objectContaining({
        id: 'PL123',
        name: 'New Music Friday 2025 July 18',
        publishedAt: '2025-07-15T04:03:29.241254Z',
        thumbnail: 'https://i.ytimg.com/vi/IKy-thh3fyE/default.jpg',
      }),
      expect.objectContaining({
        id: 'PL456',
        name: 'New Music Friday - 2025 Jul 4',
        publishedAt: '2025-07-04T01:36:51.142934Z',
        thumbnail: 'https://i.ytimg.com/vi/NYQc2Q2omAQ/default.jpg',
      }),
    ]);
  });

  it('includes a unique SVG artwork for each playlist in playlists.nmf.json', async () => {
    const mockApiResponse = {
      items: [
        {
          id: 'PL123',
          snippet: {
            title: 'New Music Friday 2025 July 18',
            publishedAt: '2025-07-15T04:03:29.241254Z',
            thumbnails: { default: { url: 'https://i.ytimg.com/vi/IKy-thh3fyE/default.jpg' } },
          },
        },
        {
          id: 'PL456',
          snippet: {
            title: 'New Music Friday - 2025 Jul 4',
            publishedAt: '2025-07-04T01:36:51.142934Z',
            thumbnails: { default: { url: 'https://i.ytimg.com/vi/NYQc2Q2omAQ/default.jpg' } },
          },
        },
      ],
      nextPageToken: undefined,
    };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });
    await fetchPlaylists({ apiKey: '', channelId: '', namePrefix: '', fileName: _TEST_JSON_FILE });
    // Get the written data
    expect(fs.writeFileSync).toHaveBeenCalled();
    const [_filePath, data] = (
      fs.writeFileSync as unknown as { mock: { calls: [unknown, string][] } }
    ).mock.calls[0];
    const playlists = JSON.parse(data);
    for (const playlist of playlists) {
      expect(typeof playlist.artworkSvg).toBe('string');
      expect(playlist.artworkSvg.length).toBeGreaterThan(0);
    }
    // Ensure SVGs are unique per playlist ID
    const svgSet = new Set(playlists.map((p: unknown) => (p as { artworkSvg: string }).artworkSvg));
    expect(svgSet.size).toBe(playlists.length);
  });

  it('includes a dominantColor for each playlist in playlists.nmf.json', async () => {
    const mockApiResponse = {
      items: [
        {
          id: 'PL123',
          snippet: {
            title: 'New Music Friday 2025 July 18',
            publishedAt: '2025-07-15T04:03:29.241254Z',
            thumbnails: { default: { url: 'https://i.ytimg.com/vi/IKy-thh3fyE/default.jpg' } },
          },
        },
        {
          id: 'PL456',
          snippet: {
            title: 'New Music Friday - 2025 Jul 4',
            publishedAt: '2025-07-04T01:36:51.142934Z',
            thumbnails: { default: { url: 'https://i.ytimg.com/vi/NYQc2Q2omAQ/default.jpg' } },
          },
        },
      ],
      nextPageToken: undefined,
    };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });
    await fetchPlaylists({ apiKey: '', channelId: '', namePrefix: '', fileName: _TEST_JSON_FILE });
    expect(fs.writeFileSync).toHaveBeenCalled();
    const [_filePath, data] = (
      fs.writeFileSync as unknown as { mock: { calls: [unknown, string][] } }
    ).mock.calls[0];
    const playlists = JSON.parse(data);
    for (const playlist of playlists) {
      expect(typeof playlist.dominantColor).toBe('string');
      expect(playlist.dominantColor.length).toBeGreaterThan(0);
    }
  });
});
