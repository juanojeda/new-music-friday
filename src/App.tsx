import React, { useEffect, useState } from 'react';
import PlaylistList from './components/PlaylistList';
import AudioPlayer from './components/AudioPlayer';
import { Playlist } from './libs/types';
import ThemeSwitcher from './components/ThemeSwitcher';
import { CssBaseline, Typography, Grid, GlobalStyles, lighten, alpha } from '@mui/material';

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

  return (
    <ThemeSwitcher dominantColor={dominantColor}>
      <CssBaseline />
      <GlobalStyles
        styles={({ palette, transitions }) => ({
          '*': {
            transition: transitions.create(['color'], {
              duration: 300,
              easing: transitions.easing.easeInOut,
              delay: 500,
            }),
          },
          body: {
            backgroundColor: lighten(palette.primary.main, 0.2),
            backgroundImage: `url(https://grainy-gradients.vercel.app/noise.svg), linear-gradient(120deg, ${alpha(palette.background.paper, 1)}, ${alpha(palette.background.paper, 0.5)})`,
            minHeight: '100vh',
            width: '100vw',
            transition: transitions.create(['background-color'], {
              duration: 300,
              easing: transitions.easing.easeInOut,
              delay: 500,
            }),
          },
        })}
      />
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

          {loading && (
            <Typography variant="h6" align="center">
              Loading...
            </Typography>
          )}
          {error && (
            <Typography variant="h6" align="center" color="error">
              Error loading playlists
            </Typography>
          )}
          {!loading && !error && playlists.length === 0 && (
            <Typography variant="h6" align="center">
              No playlists available
            </Typography>
          )}
          {playlists.length > 0 && (
            <>
              <AudioPlayer playlist={selectedPlaylist} />
              <PlaylistList
                playlists={playlists}
                selectedId={selectedId}
                onSelect={(playlist) => setSelectedId(playlist.id)}
              />
            </>
          )}
        </Grid>
      </Grid>
    </ThemeSwitcher>
  );
}

export default App;
