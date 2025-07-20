import React from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import PlaylistListItem from './PlaylistListItem';
import { Playlist } from '../libs/types';

interface PlaylistListProps {
  playlists: Playlist[];
  selectedId: string | null;
  onSelect: (playlist: Playlist) => void;
}

const PlaylistList: React.FC<PlaylistListProps> = ({ playlists, selectedId, onSelect }) => {
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
          onClick={() => onSelect(playlist)}
        />
      ))}
    </List>
  );
};

export default PlaylistList;
