import { useEffect, useRef, useState } from 'react';
import { Playlist } from '../libs/types';
import { YTPlayer, YTPlayerOptions, YTPlayerConstructor } from '../libs/yt-types';

function hasYT(win: Window): win is Window & { YT: { Player: YTPlayerConstructor } } {
  return 'YT' in win && typeof win.YT !== 'undefined';
}

function ensureYouTubeIframeAPILoaded() {
  if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
}

type PlayerState = 'playing' | 'paused' | null;

function mapYTPlayerState(data: number): PlayerState {
  if (data === 1) return 'playing';
  if (data === 2) return 'paused';
  return null;
}

function createPlayer(
  playerRef: React.MutableRefObject<YTPlayer | null>,
  playerDivId: React.RefObject<string>,
  playlist: Playlist,
  setPlayerReady: (ready: boolean) => void,
  setPlayerState: (state: PlayerState) => void,
) {
  playerRef.current = new (window as Window & typeof globalThis).YT!.Player(playerDivId.current!, {
    height: '0',
    width: '0',
    playerVars: { listType: 'playlist', list: playlist.id },
    events: {
      onReady: () => setPlayerReady(true),
      onStateChange: (event: { data: number }) => {
        setPlayerState(mapYTPlayerState(event.data));
      },
    },
  } as YTPlayerOptions);
}

export type { PlayerState };
export function useYouTubePlayer(playlist: Playlist | null) {
  const playerDivId = useRef(`yt-player-${Math.random().toString(36).slice(2)}`);
  const playerRef = useRef<YTPlayer | null>(null);
  const latestPlaylistRef = useRef<Playlist | null>(playlist);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>(null);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [totalTracks, setTotalTracks] = useState(0);
  const [currentTrack, setCurrentTrack] = useState({ artist: '', title: '', length: 0 });
  const [duration, setDuration] = useState(0);
  const [playhead, setPlayhead] = useState(0);

  useEffect(() => {
    latestPlaylistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    if (playlist && typeof window !== 'undefined' && !hasYT(window)) {
      ensureYouTubeIframeAPILoaded();
    }
  }, [playlist]);

  useEffect(() => {
    if (!playlist || typeof window === 'undefined') return;
    function createPlayerForCurrentPlaylist() {
      if (playerRef.current) return;
      const current = latestPlaylistRef.current;
      if (!current) return;
      createPlayer(playerRef, playerDivId, current, setPlayerReady, setPlayerState);
    }
    if (!(window as Window & typeof globalThis).onYouTubeIframeAPIReady) {
      (window as Window & typeof globalThis).onYouTubeIframeAPIReady = () => {
        createPlayerForCurrentPlaylist();
      };
    }
    if (hasYT(window)) {
      createPlayerForCurrentPlaylist();
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy?.();
        playerRef.current = null;
      }
      setPlayerReady(false);
      setPlayerState(null);
      setCurrentTrackIndex(0);
      setTotalTracks(0);
      setCurrentTrack({ artist: '', title: '', length: 0 });
      setPlayhead(0);
    };
  }, [playlist]);

  useEffect(() => {
    if (!playerReady || !playerRef.current) return;
    function updateTrackData() {
      const idx = playerRef.current?.getPlaylistIndex?.() ?? 0;
      setCurrentTrackIndex(idx);
      const playlistArray = playerRef.current?.getPlaylist?.() ?? [];
      setTotalTracks(Array.isArray(playlistArray) ? playlistArray.length : 0);
      const videoData = playerRef.current?.getVideoData?.() ?? {};
      setCurrentTrack({
        artist: videoData.author ?? '',
        title: videoData.title ?? '',
        length: playerRef.current?.getDuration?.() ?? 0,
      });
      setDuration(playerRef.current?.getDuration?.() ?? 0);
      setPlayhead(playerRef.current?.getCurrentTime?.() ?? 0);
    }
    updateTrackData();
    // Optionally, set up an interval to update playhead
    const interval = setInterval(updateTrackData, 1000);
    return () => clearInterval(interval);
  }, [playerReady, playerState]);

  return {
    playerRef,
    playerReady,
    playerDivId,
    playerState,
    currentTrackIndex,
    totalTracks,
    currentTrack,
    playhead,
    duration,
  };
}

// Test skeleton for the hook
// useYouTubePlayer.test.ts
// import { renderHook } from '@testing-library/react';
// describe('useYouTubePlayer', () => {
//   it('should ...', () => {
//     // TODO: implement tests
//   });
// });
