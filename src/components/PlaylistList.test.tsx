import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import PlaylistList from './PlaylistList';
import { Playlist } from '../libs/types';

const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'New Music Friday - 2024-06-07',
    publishedAt: '2024-06-07T12:00:00Z',
    thumbnail: '',
  },
  {
    id: '2',
    name: 'New Music Friday - 2024-05-31',
    publishedAt: '2024-05-31T12:00:00Z',
    thumbnail: '',
  },
];

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockPlaylists),
  })
) as unknown as typeof fetch;

beforeEach(() => {
  vi.clearAllMocks();
});
afterEach(() => {
  cleanup();
});

describe('PlaylistList', () => {
  it('fetches and displays playlists from the API', async () => {
    render(<PlaylistList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('New Music Friday - 2024-06-07')).toBeInTheDocument();
      expect(screen.getByText('New Music Friday - 2024-05-31')).toBeInTheDocument();
    });
  });

  it('shows an error message if the API call fails', async () => {
    (global.fetch as Mock).mockImplementationOnce(() => Promise.resolve({ ok: false }));
    render(<PlaylistList />);
    await waitFor(() => {
      expect(screen.getByText(/failed to load playlists/i)).toBeInTheDocument();
    });
  });

  it('allows the user to select a playlist and highlights it', async () => {
    render(<PlaylistList />);
    await waitFor(() => {
      expect(screen.getByText('New Music Friday - 2024-06-07')).toBeInTheDocument();
    });
    const firstPlaylistButton = screen.getAllByRole('button', {
      name: 'New Music Friday - 2024-06-07',
    })[0];
    fireEvent.click(firstPlaylistButton);
    expect(firstPlaylistButton).toHaveAttribute('aria-selected', 'true');
  });
});
