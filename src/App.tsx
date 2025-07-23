import React, { useEffect, useState } from 'react';
import PlaylistList from './components/PlaylistList';
import AudioPlayer from './components/AudioPlayer';
import { Playlist } from './libs/types';
import ThemeSwitcher from './components/ThemeSwitcher';
import { CssBaseline } from '@mui/material';

function App() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load playlists.</div>;

  return (
    <ThemeSwitcher>
      <CssBaseline />
      <AudioPlayer playlist={selectedPlaylist} />
      <PlaylistList
        playlists={playlists}
        selectedId={selectedId}
        onSelect={(playlist) => setSelectedId(playlist.id)}
      />
    </ThemeSwitcher>
  );
}

export default App;
