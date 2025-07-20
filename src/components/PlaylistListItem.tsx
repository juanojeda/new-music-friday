import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { Playlist } from '../libs/types';

interface PlaylistListItemProps {
  playlist: Playlist;
  selected: boolean;
  onClick: () => void;
}

const PlaylistListItem: React.FC<PlaylistListItemProps> = ({ playlist, selected, onClick }) => (
  <ListItem key={playlist.id} disablePadding>
    <ListItemButton selected={selected} aria-selected={selected} onClick={onClick}>
      {playlist.name}
    </ListItemButton>
  </ListItem>
);

export default PlaylistListItem;
