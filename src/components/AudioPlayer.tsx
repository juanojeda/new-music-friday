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
import { Box, Grid, Paper, Skeleton } from '@mui/material';

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

function AlbumArtwork({ artworkSvg }: { artworkSvg: string }) {
  return (
    <Paper
      variant="elevation"
      sx={{
        width: 200,
        height: 200,
        margin: '0 auto',
      }}
      elevation={5}
      dangerouslySetInnerHTML={{ __html: artworkSvg }}
    />
  );
}

function TrackDataSkeleton() {
  return (
    <Box
      display={'flex'}
      flexDirection="column"
      alignItems="center"
      sx={{ height: '4rem', mb: 1, mt: 2 }}
    >
      <Skeleton variant="text" width={200} />
      <Skeleton variant="text" width={200} />
    </Box>
  );
}

function CurrentTrack({
  currentTrackIndex,
  totalTracks,
  currentTrack,
}: {
  currentTrackIndex: number;
  totalTracks: number;
  currentTrack: { artist: string; title: string; length: number };
}) {
  return (
    <Box textAlign="center" mt={2} mb={2} sx={{ height: '4rem' }}>
      <Typography component={'div'} variant="subtitle2" data-testid="track-number">
        {`Track ${currentTrackIndex + 1} of ${totalTracks}`}
      </Typography>
      <Typography component={'div'} variant="subtitle1" data-testid="track-title">
        {currentTrack.title}
      </Typography>
      <Typography component={'div'} variant="subtitle2" data-testid="track-artist">
        {currentTrack.artist}
      </Typography>
    </Box>
  );
}

function ControlsSkeleton() {
  return (
    <Box display={'flex'} flexDirection="column" alignItems="center">
      <Skeleton
        variant="rectangular"
        width={200}
        height={40}
        sx={{ marginBottom: 3, marginTop: 1.5 }}
      />
      <Skeleton
        variant="rectangular"
        width={'100%'}
        height={35}
        sx={{
          marginBottom: '.6rem',
        }}
      />
    </Box>
  );
}

function Controls({
  playerRef,
  playerState,
  playhead,
  duration,
}: {
  playerRef: React.RefObject<YTPlayer | null>;
  playerState: string | null;
  playhead: number;
  duration: number;
}) {
  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <PlayerControlButton
        ariaLabel="previous"
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
      {
        <Grid size={{ xs: 12 }}>
          <Slider
            aria-label="seek"
            value={playhead}
            min={0}
            max={duration}
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
          <Grid container justifyContent="space-between">
            <Typography variant="caption" data-testid="track-playhead">
              {formatTime(playhead)}
            </Typography>
            <Typography variant="caption" data-testid="track-length">
              {formatTime(duration)}
            </Typography>
          </Grid>
        </Grid>
      }
    </Grid>
  );
}

function PlayerSkeleton() {
  return (
    <Grid container direction={'column'} justifyContent="center" alignItems="center" spacing={2}>
      <Grid size={{ xs: 12 }} textAlign="center">
        <Skeleton
          variant="rectangular"
          width={200}
          height={200}
          sx={{
            margin: '0 auto',
          }}
        />
        <TrackDataSkeleton />
        <ControlsSkeleton />
      </Grid>
    </Grid>
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
    duration,
  } = useYouTubePlayer(playlist);

  if (!playlist) return <PlayerSkeleton />;
  return (
    <Grid justifyContent={'center'} container>
      <div id={playerDivId.current} />
      {
        <Grid alignContent={'center'} alignSelf={'center'} justifyContent={'center'} size={12}>
          <AlbumArtwork artworkSvg={playlist.artworkSvg} />
          {playerReady ? (
            <>
              <CurrentTrack
                currentTrackIndex={currentTrackIndex}
                totalTracks={totalTracks}
                currentTrack={currentTrack}
              />
              <Controls
                playerRef={playerRef}
                playerState={playerState}
                playhead={playhead}
                duration={duration}
              />
            </>
          ) : (
            <>
              <TrackDataSkeleton />
              <ControlsSkeleton />
            </>
          )}
        </Grid>
      }
    </Grid>
  );
};

export default AudioPlayer;
