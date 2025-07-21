import * as fs from 'fs';
import path from 'path';

export async function fetchPlaylists(): Promise<void> {
  const playlists = [
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
  const outPath = path.resolve(__dirname, '../public/playlists.nmf.json');
  fs.writeFileSync(outPath, JSON.stringify(playlists, null, 2));
} 