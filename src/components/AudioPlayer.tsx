import React, { useEffect } from 'react';
import { Playlist } from '../libs/types';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Slider from '@mui/material/Slider';

interface AudioPlayerProps {
  playlist: Playlist | null;
}

function hasYT(win: Window): boolean {
  return 'YT' in win && typeof ((win as unknown) as Record<string, unknown>).YT !== 'undefined';
}

function ensureYouTubeIframeAPILoaded() {
  if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ playlist }) => {
  useEffect(() => {
    if (playlist && typeof window !== 'undefined' && !hasYT(window)) {
      ensureYouTubeIframeAPILoaded();
    }
  }, [playlist]);

  if (!playlist) return null;
  return (
    <div>
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
