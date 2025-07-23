import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import PlaylistList from './PlaylistList';
import { Playlist } from '../libs/types';

const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'New Music Friday - 2024-06-07',
    publishedAt: '2024-06-07T12:00:00Z',
    thumbnail: '',
    dominantColor: '#ff0000',
    artworkSvg: `<svg></svg>`,
  },
  {
    id: '2',
    name: 'New Music Friday - 2024-05-31',
    publishedAt: '2024-05-31T12:00:00Z',
    thumbnail: '',
    dominantColor: '#ff0000',
    artworkSvg: `<svg></svg>`,
  },
];

afterEach(() => {
  cleanup();
});

describe('PlaylistList (controlled)', () => {
  it('renders playlists and highlights the selected one', () => {
    render(
      <PlaylistList
        playlists={mockPlaylists}
        selectedId={mockPlaylists[1].id}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('New Music Friday - 2024-06-07')).toBeInTheDocument();
    expect(screen.getByText('New Music Friday - 2024-05-31')).toBeInTheDocument();
    const selectedButton = screen.getAllByRole('button', {
      name: 'New Music Friday - 2024-05-31',
    })[0];
    expect(selectedButton).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onSelect with the selected playlist when a playlist is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <PlaylistList
        playlists={mockPlaylists}
        selectedId={mockPlaylists[0].id}
        onSelect={handleSelect}
      />,
    );
    const secondPlaylistButton = screen.getAllByRole('button', {
      name: 'New Music Friday - 2024-05-31',
    })[0];
    fireEvent.click(secondPlaylistButton);
    expect(handleSelect).toHaveBeenCalledWith(mockPlaylists[1]);
  });

  it('shows a message if no playlists are found', () => {
    render(<PlaylistList playlists={[]} selectedId={null} onSelect={vi.fn()} />);
    expect(screen.getByText(/no playlists found/i)).toBeInTheDocument();
  });
});
