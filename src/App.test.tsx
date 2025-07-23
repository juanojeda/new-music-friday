import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import { Playlist } from './libs/types';
import * as useYouTubePlayerModule from './hooks/useYouTubePlayer';

const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'New Music Friday - 2024-06-07',
    publishedAt: '2024-06-07T12:00:00Z',
    thumbnail: '',
    dominantColor: '#ff0000',
    artworkSvg: `<svg></svg>`,
  },
  {
    id: '2',
    name: 'New Music Friday - 2024-05-31',
    publishedAt: '2024-05-31T12:00:00Z',
    thumbnail: '',
    dominantColor: '#ff0000',
    artworkSvg: `<svg></svg>`,
  },
];

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockPlaylists),
  }),
) as unknown as typeof fetch;

describe('App', () => {
  it('renders PlaylistList and displays playlists', async () => {
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('New Music Friday - 2024-06-07')).toBeInTheDocument();
      expect(screen.getByText('New Music Friday - 2024-05-31')).toBeInTheDocument();
    });
  });

  it('renders AudioPlayer when a playlist is selected', async () => {
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
      playerRef: {
        current: {
          playVideo: vi.fn(),
          pauseVideo: vi.fn(),
          seekTo: vi.fn(),
          nextVideo: vi.fn(),
          previousVideo: vi.fn(),
        },
      },
      playerReady: true,
      playerDivId: { current: 'yt-player-mock' },
      playerState: 'paused',
      currentTrackIndex: 0,
      totalTracks: 1,
      currentTrack: { artist: '', title: '', length: 0 },
      playhead: 0,
      duration: 245,
    });
    // Mock window.YT.Player to capture onReady
    let onReadyCallback: (() => void) | undefined;
    window.YT = {
      Player: vi.fn((_id, opts) => {
        onReadyCallback = opts.events.onReady;
        return { destroy: vi.fn() };
      }),
    };

    render(<App />);
    // Wait for playlists to load
    await waitFor(() =>
      expect(screen.getByText(/New Music Friday - 2024-06-07/)).toBeInTheDocument(),
    );
    // Click the first playlist
    const firstPlaylistButton = screen.getAllByRole('button', { name: /New Music Friday/ })[0];
    fireEvent.click(firstPlaylistButton);
    // Simulate player ready
    onReadyCallback && onReadyCallback();
    // Controls should now be rendered
    expect(await screen.findByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(await screen.findByRole('slider', { name: /seek/i })).toBeInTheDocument();
  });

  it('sets the most recent playlist after a delay', async () => {
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
      playerRef: {
        current: {
          playVideo: vi.fn(),
          pauseVideo: vi.fn(),
          seekTo: vi.fn(),
          nextVideo: vi.fn(),
          previousVideo: vi.fn(),
        },
      },
      playerReady: true,
      playerDivId: { current: 'yt-player-mock' },
      playerState: 'paused',
      currentTrackIndex: 0,
      totalTracks: 1,
      currentTrack: { artist: '', title: '', length: 0 },
      playhead: 0,
      duration: 245,
    });
    // Mock window.YT.Player to capture onReady
    let onReadyCallback: (() => void) | undefined;
    window.YT = {
      Player: vi.fn((_id, opts) => {
        onReadyCallback = opts.events.onReady;
        return { destroy: vi.fn() };
      }),
    };

    render(<App />);

    await waitFor(() =>
      expect(screen.getByText(/New Music Friday - 2024-06-07/)).toBeInTheDocument(),
    );

    vi.useFakeTimers();
    vi.advanceTimersByTime(1000);
    vi.useRealTimers();

    onReadyCallback && onReadyCallback();

    expect(await screen.findByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(await screen.findByRole('slider', { name: /seek/i })).toBeInTheDocument();
  });

  it('does not render AudioPlayer when no playlist is selected', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('New Music Friday - 2024-06-07')).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
  });

  it('passes the dominant color to ThemeSwitcher', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('New Music Friday - 2024-06-07')).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: /New Music Friday/ })).toHaveStyle({
      color: '#465adb',
    });

    const firstPlaylistButton = screen.getAllByRole('button', { name: /New Music Friday/ })[0];
    fireEvent.click(firstPlaylistButton);

    expect(document.body).not.toHaveStyle({
      backgroundColor: '#ffffff',
    });
    expect(screen.getByRole('heading', { name: /New Music Friday/ })).not.toHaveStyle({
      color: '#465adb',
    });
  });
});
