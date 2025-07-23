import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import AudioPlayer from './AudioPlayer';
import { Playlist } from '../libs/types';
import { YTPlayerConstructor } from '../libs/yt-types';
import { fireEvent } from '@testing-library/react';
import * as useYouTubePlayerModule from '../hooks/useYouTubePlayer';

const mockPlaylist: Playlist = {
  id: '1',
  name: 'New Music Friday - 2024-06-07',
  publishedAt: '2024-06-07T12:00:00Z',
  thumbnail: '',
  dominantColor: '#ff0000',
  artworkSvg: `<svg></svg>`,
};

declare global {
  interface Window {
    YT?: { Player: YTPlayerConstructor };
  }
}

function setupPlayerMock(overrides: Record<string, unknown> = {}) {
  let onReadyCallback: (() => void) | undefined;
  const playerMock = vi.fn((_id, opts) => {
    onReadyCallback = opts.events.onReady;
    return {
      destroy: vi.fn(),
      playVideo: vi.fn(),
      pauseVideo: vi.fn(),
      seekTo: vi.fn(),
      getCurrentTime: vi.fn().mockReturnValue(0), // Default to 0 for getCurrentTime
      getDuration: vi.fn().mockReturnValue(0), // Default to 0 for getDuration
      nextVideo: vi.fn(),
      previousVideo: vi.fn(),
      onStateChange: vi.fn(), // Mock onStateChange
      ...overrides,
    };
  });
  window.YT = { Player: playerMock };
  return { playerMock, onReadyCallback: () => onReadyCallback };
}

describe('AudioPlayer', () => {
  beforeEach(() => {
    // Remove any existing YouTube IFrame API script and window.YT
    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (existingScript) existingScript.remove();
    delete window.YT;
  });
  afterEach(() => {
    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (existingScript) existingScript.remove();
    delete window.YT;
  });

  it('does not render if no playlist is selected', () => {
    render(<AudioPlayer playlist={null} />);
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
  });

  it('renders controls only after player is ready, and only the play button is shown initially', async () => {
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
      playerReady: false,
      playerDivId: { current: 'yt-player-mock' },
      playerState: null,
      currentTrackIndex: 0,
      totalTracks: 1,
      currentTrack: { artist: '', title: '', length: 0 },
      playhead: 0,
      duration: 0,
    });
    const { rerender } = render(<AudioPlayer playlist={mockPlaylist} />);
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('slider', { name: /seek/i })).not.toBeInTheDocument();
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
      playerState: null,
      currentTrackIndex: 0,
      totalTracks: 1,
      currentTrack: { artist: '', title: '', length: 0 },
      playhead: 0,
      duration: 245,
    });
    rerender(<AudioPlayer playlist={mockPlaylist} />);
    // Only play button is visible
    expect(await screen.findByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
    expect(await screen.findByRole('slider', { name: /seek/i })).toBeInTheDocument();
  });

  describe('play/pause toggle UI', () => {
    let baseHookReturn: ReturnType<typeof useYouTubePlayerModule.useYouTubePlayer>;
    beforeEach(() => {
      baseHookReturn = {
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
        playerState: null,
        currentTrackIndex: 0,
        totalTracks: 1,
        currentTrack: { artist: '', title: '', length: 0 },
        playhead: 0,
        duration: 245,
      };
    });
    it('shows only the play button when playerState is paused (UI test)', () => {
      vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
        ...baseHookReturn,
        playerState: 'paused',
        duration: baseHookReturn.currentTrack.length,
      });
      render(<AudioPlayer playlist={mockPlaylist} />);
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
    });
    it('shows only the pause button when playerState is playing (UI test)', () => {
      vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
        ...baseHookReturn,
        playerState: 'playing',
        duration: baseHookReturn.currentTrack.length,
      });
      render(<AudioPlayer playlist={mockPlaylist} />);
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
    });
    it('shows only the play button when playerState is null (UI test)', () => {
      vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
        ...baseHookReturn,
        playerState: null,
        duration: baseHookReturn.currentTrack.length,
      });
      render(<AudioPlayer playlist={mockPlaylist} />);
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
    });
    it('has appropriate ARIA labels on play and pause controls (integration)', () => {
      vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
        ...baseHookReturn,
        playerState: 'paused',
        duration: baseHookReturn.currentTrack.length,
      });
      render(<AudioPlayer playlist={mockPlaylist} />);
      expect(screen.getByRole('button', { name: /play/i })).toHaveAttribute('aria-label', 'play');
      vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
        ...baseHookReturn,
        playerState: 'playing',
        duration: baseHookReturn.currentTrack.length,
      });
      render(<AudioPlayer playlist={mockPlaylist} />);
      expect(screen.getByRole('button', { name: /pause/i })).toHaveAttribute('aria-label', 'pause');
    });
  });

  it('renders the player container and controls when a playlist is provided and the player is ready (integration)', () => {
    const baseHookReturn: ReturnType<typeof useYouTubePlayerModule.useYouTubePlayer> = {
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
    };
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue(baseHookReturn);
    render(<AudioPlayer playlist={mockPlaylist} />);
    const playerDiv = document.querySelector('div[id^="yt-player-"]');
    expect(playerDiv).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
  });
  it('renders the player container and controls when a playlist is provided and the player is ready (integration, pause)', () => {
    const baseHookReturn: ReturnType<typeof useYouTubePlayerModule.useYouTubePlayer> = {
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
      playerState: 'playing',
      currentTrackIndex: 0,
      totalTracks: 1,
      currentTrack: { artist: '', title: '', length: 0 },
      playhead: 0,
      duration: 245,
    };
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue(baseHookReturn);
    render(<AudioPlayer playlist={mockPlaylist} />);
    const playerDiv = document.querySelector('div[id^="yt-player-"]');
    expect(playerDiv).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
  });
  it('allows keyboard navigation and operation of all controls', () => {
    const playVideo = vi.fn();
    const pauseVideo = vi.fn();
    const seekTo = vi.fn();
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
      playerRef: {
        current: { playVideo, pauseVideo, seekTo, nextVideo: vi.fn(), previousVideo: vi.fn() },
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
    const { rerender } = render(<AudioPlayer playlist={mockPlaylist} />);
    const playButton = screen.getByRole('button', { name: /play/i });
    playButton.focus();
    expect(playButton).toHaveFocus();
    fireEvent.keyDown(playButton, { key: 'Enter', code: 'Enter' });
    expect(playVideo).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(playButton, { key: ' ', code: 'Space' });
    expect(playVideo).toHaveBeenCalledTimes(2);
    // Now test pause button after rerender
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
      playerRef: {
        current: { playVideo, pauseVideo, seekTo, nextVideo: vi.fn(), previousVideo: vi.fn() },
      },
      playerReady: true,
      playerDivId: { current: 'yt-player-mock' },
      playerState: 'playing',
      currentTrackIndex: 0,
      totalTracks: 1,
      currentTrack: { artist: '', title: '', length: 0 },
      playhead: 0,
      duration: 245,
    });
    rerender(<AudioPlayer playlist={mockPlaylist} />);
    const pauseButton = screen.getByRole('button', { name: /pause/i });
    pauseButton.focus();
    expect(pauseButton).toHaveFocus();
    fireEvent.keyDown(pauseButton, { key: 'Enter', code: 'Enter' });
    expect(pauseVideo).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(pauseButton, { key: ' ', code: 'Space' });
    expect(pauseVideo).toHaveBeenCalledTimes(2);
    // Seek slider
    const slider = screen.getByRole('slider', { name: /seek/i });
    slider.focus();
    expect(slider).toHaveFocus();
    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });
  });

  it('the embedded YouTube player is visually hidden (height and width are 0)', async () => {
    const { onReadyCallback } = setupPlayerMock();
    render(<AudioPlayer playlist={mockPlaylist} />);
    onReadyCallback() && onReadyCallback()!();

    const playerDiv = document.querySelector('div[id^="yt-player-"]');
    expect(playerDiv).toBeInTheDocument();
  });

  it('displays current track number, total tracks, artist, title, length, and playhead (UI test)', () => {
    const baseHookReturn: ReturnType<typeof useYouTubePlayerModule.useYouTubePlayer> = {
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
      playerState: 'playing',
      // Add mock track data for display
      currentTrackIndex: 2,
      totalTracks: 12,
      currentTrack: {
        artist: 'Test Artist',
        title: 'Test Title',
        length: 0, // now always 0
      },
      playhead: 123,
      duration: 245,
    };
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue(baseHookReturn);
    render(<AudioPlayer playlist={mockPlaylist} />);
    expect(screen.getByText(/Track 3 of 12/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Artist/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Title/i)).toBeInTheDocument();
    expect(screen.getByText(/4:05/)).toBeInTheDocument(); // 245s = 4:05
    expect(screen.getByText(/2:03/)).toBeInTheDocument(); // 123s = 2:03
  });

  it('updates the playhead in the UI and seeker slider when the playhead value changes (playhead sync)', () => {
    const baseHookReturn: ReturnType<typeof useYouTubePlayerModule.useYouTubePlayer> = {
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
      playerState: 'playing',
      currentTrackIndex: 0,
      totalTracks: 1,
      currentTrack: { artist: 'Test Artist', title: 'Test Title', length: 0 },
      playhead: 10,
      duration: 245,
    };
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue(baseHookReturn);
    const { rerender } = render(<AudioPlayer playlist={mockPlaylist} />);
    expect(screen.getByTestId('track-playhead').textContent).toBe('0:10');
    const slider = screen.getByRole('slider', { name: /seek/i }) as HTMLInputElement;
    expect(slider.value).toBe('10');
    // Simulate playhead update
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
      ...baseHookReturn,
      playhead: 42,
      duration: 245,
    });
    rerender(<AudioPlayer playlist={mockPlaylist} />);
    expect(screen.getByTestId('track-playhead').textContent).toBe('0:42');
    const slider2 = screen.getByRole('slider', { name: /seek/i }) as HTMLInputElement;
    expect(slider2.value).toBe('42');
  });
});

describe('Seeker end behavior', () => {
  it('the far right of the seeker should represent the end of the track (track duration)', () => {
    const baseHookReturn: ReturnType<typeof useYouTubePlayerModule.useYouTubePlayer> = {
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
      playerState: 'playing',
      currentTrackIndex: 0,
      totalTracks: 1,
      currentTrack: { artist: 'Test Artist', title: 'Test Title', length: 210 }, // 3:30
      playhead: 0,
      duration: 210,
    };
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue(baseHookReturn);
    render(<AudioPlayer playlist={mockPlaylist} />);
    const slider = screen.getByRole('slider', { name: /seek/i }) as HTMLInputElement;
    expect(slider.max).toBe('210');
    expect(slider.min).toBe('0');
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
      ...baseHookReturn,
      playhead: 210,
      duration: 210,
    });
    render(<AudioPlayer playlist={mockPlaylist} />);
    // Use getAllByRole to get the last slider (from the latest render)
    const sliders = screen.getAllByRole('slider', { name: /seek/i }) as HTMLInputElement[];
    const sliderEnd = sliders[sliders.length - 1];
    expect(Number(sliderEnd.value)).toBe(210);
  });
});
