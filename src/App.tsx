import React, { useEffect, useState } from 'react';
import PlaylistList from './components/PlaylistList';
import AudioPlayer from './components/AudioPlayer';
import { Playlist } from './libs/types';
import ThemeSwitcher from './components/ThemeSwitcher';
import { CssBaseline, Typography, Grid } from '@mui/material';

function App() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dominantColor, setDominantColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}playlists.nmf.json`)
      .then((res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data) => {
        setPlaylists(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const selectedPlaylist = playlists.find((p) => p.id === selectedId) || null;

  useEffect(
    function setMostRecentPlaylistAfterDelay() {
      if (playlists.length === 0) return;
      if (selectedId) return;

      const setPlaylist = () => {
        setSelectedId(playlists[0].id);
      };
      const timeoutId = setTimeout(setPlaylist, 1000);
      return () => clearTimeout(timeoutId);
    },
    [playlists],
  );

  useEffect(
    function setDominantColorFromPlaylist() {
      if (selectedPlaylist) {
        const color = selectedPlaylist.dominantColor;
        setDominantColor(color || undefined);
      } else {
        setDominantColor(undefined);
      }
    },
    [selectedPlaylist],
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load playlists.</div>;

  return (
    <ThemeSwitcher dominantColor={dominantColor}>
      <CssBaseline />
      <Grid container alignItems={'center'} justifyContent="center" spacing={2}>
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Typography variant="h2" align="center" color="primary" mt={4} mb={5}>
            New Music Friday
          </Typography>
          <AudioPlayer playlist={selectedPlaylist} />
          <PlaylistList
            playlists={playlists}
            selectedId={selectedId}
            onSelect={(playlist) => setSelectedId(playlist.id)}
          />
        </Grid>
      </Grid>
    </ThemeSwitcher>
  );
}

export default App;
