import { renderHook } from '@testing-library/react';
import { useYouTubePlayer } from './useYouTubePlayer';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Playlist } from '../libs/types';
import { YTPlayerConstructor } from '../libs/yt-types';
import { waitFor } from '@testing-library/react';

const mockPlaylist: Playlist = {
  id: '1',
  name: 'Test Playlist',
  publishedAt: '2024-01-01T00:00:00Z',
  thumbnail: '',
  artworkSvg: `<svg></svg>`,
  dominantColor: '#ff0000',
};

declare global {
  interface Window {
    YT?: { Player: YTPlayerConstructor };
    onYouTubeIframeAPIReady?: () => void;
  }
}

describe('useYouTubePlayer', () => {
  let originalYT: { Player: YTPlayerConstructor } | undefined;
  let originalOnYouTubeIframeAPIReady: (() => void) | undefined;
  beforeEach(() => {
    vi.useFakeTimers();
    originalYT = window.YT;
    originalOnYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;
    delete window.YT;
    delete window.onYouTubeIframeAPIReady;
    document
      .querySelectorAll('script[src="https://www.youtube.com/iframe_api"]')
      .forEach((s) => s.remove());
  });
  afterEach(() => {
    vi.useRealTimers();
    window.YT = originalYT;
    window.onYouTubeIframeAPIReady = originalOnYouTubeIframeAPIReady;
    document
      .querySelectorAll('script[src="https://www.youtube.com/iframe_api"]')
      .forEach((s) => s.remove());
  });

  it('injects the YouTube IFrame API script if not present', () => {
    expect(document.querySelector('script[src="https://www.youtube.com/iframe_api"]')).toBeNull();
    renderHook(() => useYouTubePlayer(mockPlaylist));
    expect(
      document.querySelector('script[src="https://www.youtube.com/iframe_api"]'),
    ).toBeInTheDocument();
  });

  it('sets up playerRef and playerReady when window.YT is present and playlist is set', async () => {
    vi.useRealTimers();
    const playMock = vi.fn();
    window.YT = {
      Player: vi.fn((_id, opts) => {
        setTimeout(() => opts.events.onReady(), 0);
        return { destroy: vi.fn(), playVideo: playMock };
      }),
    };
    const { result } = renderHook(() => useYouTubePlayer(mockPlaylist));
    await waitFor(() => {
      expect(result.current.playerRef.current).toBeTruthy();
      expect(result.current.playerReady).toBe(true);
    });
    vi.useFakeTimers();
  });

  it('playerReady is false when no playlist', () => {
    const { result } = renderHook(() => useYouTubePlayer(null));
    expect(result.current.playerReady).toBe(false);
    expect(result.current.playerRef.current).toBeNull();
  });

  it('destroys player on unmount', () => {
    const destroyMock = vi.fn();
    window.YT = {
      Player: vi.fn((_id, opts) => {
        setTimeout(() => opts.events.onReady(), 0);
        return { destroy: destroyMock };
      }),
    };
    const { unmount } = renderHook(() => useYouTubePlayer(mockPlaylist));
    unmount();
    expect(destroyMock).toHaveBeenCalled();
  });

  it('sets window.onYouTubeIframeAPIReady if not present', () => {
    expect(window.onYouTubeIframeAPIReady).toBeUndefined();
    renderHook(() => useYouTubePlayer(mockPlaylist));
    expect(typeof window.onYouTubeIframeAPIReady).toBe('function');
  });

  it('exposes playerState as "playing" or "paused" when the player state changes', async () => {
    vi.useRealTimers();
    let onStateChangeHandler: ((event: { data: number }) => void) | undefined;
    window.YT = {
      Player: vi.fn((_id, opts) => {
        onStateChangeHandler = opts.events.onStateChange;
        setTimeout(() => opts.events.onReady(), 0);
        return { destroy: vi.fn() };
      }),
    };
    const { result } = renderHook(() => useYouTubePlayer(mockPlaylist));
    await waitFor(() => result.current.playerRef.current);
    onStateChangeHandler && onStateChangeHandler({ data: 1 });
    await waitFor(() => expect(result.current.playerState).toBe<'playing' | 'paused'>('playing'));
    onStateChangeHandler && onStateChangeHandler({ data: 2 });
    await waitFor(() => expect(result.current.playerState).toBe<'playing' | 'paused'>('paused'));
    vi.useFakeTimers();
  });

  it('exposes currentTrackIndex, totalTracks, currentTrack (artist, title, length), and playhead', async () => {
    vi.useRealTimers();
    const getPlaylist = () => ({
      getPlaylist: vi.fn().mockReturnValue(['id1', 'id2', 'id3']),
      getPlaylistIndex: vi.fn().mockReturnValue(1),
      getVideoData: vi.fn().mockReturnValue({
        author: 'Test Artist',
        title: 'Test Title',
        lengthSeconds: 245,
      }),
      getCurrentTime: vi.fn().mockReturnValue(123),
      getDuration: vi.fn().mockReturnValue(245),
    });
    window.YT = {
      Player: vi.fn((_id, opts) => {
        setTimeout(() => opts.events.onReady(), 0);
        return {
          destroy: vi.fn(),
          ...getPlaylist(),
        };
      }),
    };
    const { result } = renderHook(() => useYouTubePlayer(mockPlaylist));
    await waitFor(() => result.current.playerRef.current);
    await waitFor(() => expect(result.current.currentTrackIndex).toBe(1));
    await waitFor(() => expect(result.current.totalTracks).toBe(3));
    await waitFor(() =>
      expect(result.current.currentTrack).toEqual({
        artist: 'Test Artist',
        title: 'Test Title',
        length: 245,
      }),
    );
    await waitFor(() => expect(result.current.playhead).toBe(123));
    await waitFor(() => expect(result.current.duration).toBe(245));
    vi.useFakeTimers();
  });
});
