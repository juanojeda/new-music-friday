import React, { useEffect, useRef } from 'react';
import { Playlist } from '../libs/types';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Slider from '@mui/material/Slider';

// Minimal YouTube IFrame API types for local use
interface YTPlayer {
  destroy?: () => void;
}
interface YTPlayerOptions {
  height: string;
  width: string;
  playerVars: { listType: string; list: string };
  events: { onReady: () => void };
}
type YTPlayerConstructor = new (elementId: string, options: YTPlayerOptions) => YTPlayer;
declare global {
  interface Window {
    YT?: { Player: YTPlayerConstructor };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface AudioPlayerProps {
  playlist: Playlist | null;
}

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

const AudioPlayer: React.FC<AudioPlayerProps> = ({ playlist }) => {
  const playerDivId = useRef(`yt-player-${Math.random().toString(36).slice(2)}`);
  const playerRef = useRef<YTPlayer | null>(null);
  const latestPlaylistRef = useRef<Playlist | null>(playlist);

  // Always keep latest playlist in ref
  useEffect(() => {
    latestPlaylistRef.current = playlist;
  }, [playlist]);

  // Ensure script is loaded
  useEffect(() => {
    if (playlist && typeof window !== 'undefined' && !hasYT(window)) {
      ensureYouTubeIframeAPILoaded();
    }
  }, [playlist]);

  // Create player when API is ready
  useEffect(() => {
    if (!playlist || typeof window === 'undefined') return;
    function createPlayerForCurrentPlaylist() {
      if (playerRef.current) return;
      const current = latestPlaylistRef.current;
      if (!current) return;
      playerRef.current = new window.YT!.Player(playerDivId.current, {
        height: '0',
        width: '0',
        playerVars: { listType: 'playlist', list: current.id },
        events: {
          onReady: () => {},
        },
      });
    }
    // Set up the callback only once
    if (!window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady = () => {
        createPlayerForCurrentPlaylist();
      };
    }
    // If API is already loaded, create player immediately
    if (hasYT(window)) {
      createPlayerForCurrentPlaylist();
    }
    // Cleanup: destroy player on unmount or playlist change
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy?.();
        playerRef.current = null;
      }
    };
  }, [playlist]);

  if (!playlist) return null;
  return (
    <div>
      <div id={playerDivId.current} />
      <IconButton aria-label="play">
        <PlayArrowIcon />
      </IconButton>
      <IconButton aria-label="pause">
        <PauseIcon />
      </IconButton>
      <Slider aria-label="seek" />
    </div>
  );
};

export default AudioPlayer;
