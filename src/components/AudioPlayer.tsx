import React from 'react';
import { Playlist } from '../libs/types';
import { YTPlayer } from '../libs/yt-types';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Slider from '@mui/material/Slider';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import Typography from '@mui/material/Typography';

interface AudioPlayerProps {
  playlist: Playlist | null;
}

const handlePlayerAction =
  (action: (() => void) | undefined) => (e: React.MouseEvent | React.KeyboardEvent) => {
    if (
      (e as React.KeyboardEvent).key === undefined ||
      (e as React.KeyboardEvent).key === 'Enter' ||
      (e as React.KeyboardEvent).key === ' '
    ) {
      e.preventDefault();
      action && action();
    }
  };

const SEEK_STEP_SECONDS = 5;

function handleSeekArrowKey(player: YTPlayer | null, direction: 1 | -1) {
  if (!player?.getCurrentTime || !player.seekTo) return;
  const current = player.getCurrentTime();
  player.seekTo(current + SEEK_STEP_SECONDS * direction, true);
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface PlayerControlButtonProps {
  ariaLabel: string;
  icon: React.ReactNode;
  action: (() => void) | undefined;
}
function PlayerControlButton({ ariaLabel, icon, action }: PlayerControlButtonProps) {
  return (
    <IconButton
      aria-label={ariaLabel}
      onClick={handlePlayerAction(action)}
      onKeyDown={handlePlayerAction(action)}
    >
      {icon}
    </IconButton>
  );
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ playlist }) => {
  const {
    playerRef,
    playerReady,
    playerDivId,
    playerState,
    currentTrackIndex,
    totalTracks,
    currentTrack,
    playhead,
  } = useYouTubePlayer(playlist);

  if (!playlist) return null;
  return (
    <div>
      <div id={playerDivId.current} />
      {playerReady && (
        <>
          <Typography variant="subtitle2" data-testid="track-number">
            {`Track ${currentTrackIndex + 1} of ${totalTracks}`}
          </Typography>
          <Typography variant="subtitle1" data-testid="track-title">
            {currentTrack.title}
          </Typography>
          <Typography variant="subtitle2" data-testid="track-artist">
            {currentTrack.artist}
          </Typography>
          <Typography variant="caption" data-testid="track-length">
            {formatTime(currentTrack.length)}
          </Typography>
          <Typography variant="caption" data-testid="track-playhead">
            {formatTime(playhead)}
          </Typography>
          <PlayerControlButton
            ariaLabel="prev"
            icon={<SkipPreviousIcon />}
            action={() => playerRef.current?.previousVideo && playerRef.current.previousVideo()}
          />
          {playerState !== 'playing' && (
            <PlayerControlButton
              ariaLabel="play"
              icon={<PlayArrowIcon />}
              action={() => playerRef.current?.playVideo && playerRef.current.playVideo()}
            />
          )}
          {playerState === 'playing' && (
            <PlayerControlButton
              ariaLabel="pause"
              icon={<PauseIcon />}
              action={() => playerRef.current?.pauseVideo && playerRef.current.pauseVideo()}
            />
          )}
          <PlayerControlButton
            ariaLabel="next"
            icon={<SkipNextIcon />}
            action={() => playerRef.current?.nextVideo && playerRef.current.nextVideo()}
          />
          <Slider
            aria-label="seek"
            onChange={(_, value) => {
              if (typeof value === 'number')
                playerRef.current?.seekTo && playerRef.current.seekTo(value, true);
            }}
            onKeyDown={(e) => {
              if (!playerRef.current) return;
              if (e.key === 'ArrowRight') {
                handleSeekArrowKey(playerRef.current, 1);
              } else if (e.key === 'ArrowLeft') {
                handleSeekArrowKey(playerRef.current, -1);
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default AudioPlayer;
