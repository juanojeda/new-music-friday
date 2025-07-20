import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PlaylistList from './components/PlaylistList';
import AudioPlayer from './components/AudioPlayer';
import React, { useEffect, useState } from 'react';
import { Playlist } from './libs/types';

function App() {
  const theme = createTheme();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/playlists.nmf.json')
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load playlists.</div>;

  return (
    <ThemeProvider theme={theme}>
      <AudioPlayer playlist={selectedPlaylist} />
      <PlaylistList
        playlists={playlists}
        selectedId={selectedId}
        onSelect={(playlist) => setSelectedId(playlist.id)}
      />
    </ThemeProvider>
  );
}

export default App;
