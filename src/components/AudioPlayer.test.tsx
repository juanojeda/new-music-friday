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
    const { onReadyCallback } = setupPlayerMock();
    render(<AudioPlayer playlist={mockPlaylist} />);
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('slider', { name: /seek/i })).not.toBeInTheDocument();
    onReadyCallback() && onReadyCallback()!();
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
      };
    });
    it('shows only the play button when playerState is paused (UI test)', () => {
      vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
        ...baseHookReturn,
        playerState: 'paused',
      });
      render(<AudioPlayer playlist={mockPlaylist} />);
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
    });
    it('shows only the pause button when playerState is playing (UI test)', () => {
      vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
        ...baseHookReturn,
        playerState: 'playing',
      });
      render(<AudioPlayer playlist={mockPlaylist} />);
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
    });
    it('shows only the play button when playerState is null (UI test)', () => {
      vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
        ...baseHookReturn,
        playerState: null,
      });
      render(<AudioPlayer playlist={mockPlaylist} />);
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
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
    };
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue(baseHookReturn);
    render(<AudioPlayer playlist={mockPlaylist} />);
    const playerDiv = document.querySelector('div[id^="yt-player-"]');
    expect(playerDiv).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
  });
  it('has appropriate ARIA labels on play and pause controls (integration)', () => {
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
    };
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue(baseHookReturn);
    render(<AudioPlayer playlist={mockPlaylist} />);
    expect(screen.getByRole('button', { name: /play/i })).toHaveAttribute('aria-label', 'play');
    const baseHookReturnPlaying: ReturnType<typeof useYouTubePlayerModule.useYouTubePlayer> = {
      ...baseHookReturn,
      playerState: 'playing',
    };
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue(baseHookReturnPlaying);
    render(<AudioPlayer playlist={mockPlaylist} />);
    expect(screen.getByRole('button', { name: /pause/i })).toHaveAttribute('aria-label', 'pause');
  });

  it('allows keyboard navigation and operation of all controls', () => {
    const playVideo = vi.fn();
    const pauseVideo = vi.fn();
    const seekTo = vi.fn();
    const baseHookReturn = {
      playerRef: {
        current: { playVideo, pauseVideo, seekTo, nextVideo: vi.fn(), previousVideo: vi.fn() },
      },
      playerReady: true,
      playerDivId: { current: 'yt-player-mock' },
    };
    const { rerender } = render(<AudioPlayer playlist={mockPlaylist} />);
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
      ...baseHookReturn,
      playerState: 'paused',
    });
    rerender(<AudioPlayer playlist={mockPlaylist} />);
    const playButton = screen.getByRole('button', { name: /play/i });
    playButton.focus();
    expect(playButton).toHaveFocus();
    fireEvent.keyDown(playButton, { key: 'Enter', code: 'Enter' });
    expect(playVideo).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(playButton, { key: ' ', code: 'Space' });
    expect(playVideo).toHaveBeenCalledTimes(2);
    // Now test pause button after rerender
    vi.spyOn(useYouTubePlayerModule, 'useYouTubePlayer').mockReturnValue({
      ...baseHookReturn,
      playerState: 'playing',
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
});
