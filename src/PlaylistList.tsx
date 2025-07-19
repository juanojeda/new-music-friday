import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

interface Playlist {
  id: string;
  name: string;
  publishedAt: string;
  thumbnail: string;
}

const PlaylistList: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
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
        <ListItem key={playlist.id}>{playlist.name}</ListItem>
      ))}
    </List>
  );
};

export default PlaylistList; 