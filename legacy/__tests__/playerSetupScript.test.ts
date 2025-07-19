import * as fs from 'fs';
import * as path from 'path';
import { Playlist } from '../playlistFetcher';

// This test checks that the generated player-setup.js includes a call to playVideo() after loadPlaylist()
describe('player-setup.js', () => {
  it('should call playVideo() after loadPlaylist() in playlist selection handler', () => {
    // Simulate a small set of playlists
    const playlists: Playlist[] = [
      { id: 'PL123', name: 'NMF 2025 July 18', publishedAt: '2025-07-18T00:00:00Z' },
      { id: 'PL456', name: 'NMF 2025 July 4', publishedAt: '2025-07-04T00:00:00Z' },
    ];
    // Generate the script as the build would
    const scriptPath = path.resolve(__dirname, '../../dist/player-setup.js');
    const script = fs.readFileSync(scriptPath, 'utf8');
    // Look for the playlist selection handler logic
    const expected =
      /loadPlaylist\(\{\s*list: playlists\[idx\]\.id \}\);[\s\S]{0,100}playVideo\(\)/m;
    expect(script).toMatch(expected);
  });
});
