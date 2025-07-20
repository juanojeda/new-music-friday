import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import PlaylistListItem from './PlaylistListItem';
import { Playlist } from '../libs/types';

const PlaylistList: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  if (error) {
    return <Typography color="error">Failed to load playlists.</Typography>;
  }
  if (!playlists || playlists.length === 0) {
    return <Typography>No playlists found.</Typography>;
  }
  return (
    <List>
      {playlists.map((playlist) => (
        <PlaylistListItem
          key={playlist.id}
          playlist={playlist}
          selected={selectedId === playlist.id}
          onClick={() => setSelectedId(playlist.id)}
        />
      ))}
    </List>
  );
};

export default PlaylistList;
