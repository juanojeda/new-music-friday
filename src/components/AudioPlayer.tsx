import React from 'react';
import { Playlist } from '../libs/types';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Slider from '@mui/material/Slider';

interface AudioPlayerProps {
  playlist: Playlist | null;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ playlist }) => {
  if (!playlist) return null;
  return (
    <div>
      <iframe
        title="YouTube Player"
        src={`https://www.youtube.com/embed/${playlist.id}`}
        style={{ display: 'none' }}
        allow="autoplay"
        data-testid="youtube-iframe"
      />
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
