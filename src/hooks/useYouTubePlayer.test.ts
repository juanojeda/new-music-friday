import { renderHook, act } from '@testing-library/react';
import { useYouTubePlayer } from './useYouTubePlayer';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Playlist } from '../libs/types';
import { YTPlayerConstructor } from '../libs/yt-types';

const mockPlaylist: Playlist = {
  id: '1',
  name: 'Test Playlist',
  publishedAt: '2024-01-01T00:00:00Z',
  thumbnail: '',
};

declare global {
  interface Window {
    YT?: { Player: YTPlayerConstructor };
    onYouTubeIframeAPIReady?: () => void;
  }
}

describe('useYouTubePlayer', () => {
  let originalYT: any;
  let originalOnYouTubeIframeAPIReady: any;
  beforeEach(() => {
    originalYT = window.YT;
    originalOnYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;
    delete window.YT;
    delete window.onYouTubeIframeAPIReady;
    document.querySelectorAll('script[src="https://www.youtube.com/iframe_api"]').forEach(s => s.remove());
  });
  afterEach(() => {
    window.YT = originalYT;
    window.onYouTubeIframeAPIReady = originalOnYouTubeIframeAPIReady;
    document.querySelectorAll('script[src="https://www.youtube.com/iframe_api"]').forEach(s => s.remove());
  });

  it('injects the YouTube IFrame API script if not present', () => {
    expect(document.querySelector('script[src="https://www.youtube.com/iframe_api"]')).toBeNull();
    renderHook(() => useYouTubePlayer(mockPlaylist));
    expect(document.querySelector('script[src="https://www.youtube.com/iframe_api"]')).toBeInTheDocument();
  });

  it('sets up playerRef and playerReady when window.YT is present and playlist is set', () => {
    const playMock = vi.fn();
    window.YT = {
      Player: vi.fn((_id, opts) => {
        // Simulate onReady callback
        setTimeout(() => opts.events.onReady(), 0);
        return { destroy: vi.fn(), playVideo: playMock };
      }),
    };
    const { result } = renderHook(() => useYouTubePlayer(mockPlaylist));
    // Simulate onReady
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(result.current.playerRef.current).toBeTruthy();
        expect(result.current.playerReady).toBe(true);
        resolve();
      }, 10);
    });
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
}); 