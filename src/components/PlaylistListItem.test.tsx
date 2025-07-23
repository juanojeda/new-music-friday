import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import PlaylistListItem from './PlaylistListItem';
import { Playlist } from '../libs/types';

const playlist: Playlist = {
  id: '1',
  name: 'New Music Friday - 2024-06-07',
  publishedAt: '2024-06-07T12:00:00Z',
  thumbnail: '',
  dominantColor: '#ff0000',
  artworkSvg: `<svg></svg>`,
};

describe('PlaylistListItem', () => {
  it('renders the playlist name', () => {
    render(<PlaylistListItem playlist={playlist} selected={false} onClick={() => {}} />);
    expect(screen.getByText('New Music Friday - 2024-06-07')).toBeInTheDocument();
  });

  it('sets aria-selected when selected', () => {
    render(<PlaylistListItem playlist={playlist} selected={true} onClick={() => {}} />);
    const button = screen.getByRole('button', { name: 'New Music Friday - 2024-06-07' });
    expect(button).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<PlaylistListItem playlist={playlist} selected={false} onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'New Music Friday - 2024-06-07' });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});
