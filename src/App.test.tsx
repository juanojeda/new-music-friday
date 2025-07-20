import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import { Playlist } from './libs/types';

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
  }),
) as unknown as typeof fetch;

describe('App', () => {
  it('renders PlaylistList and displays playlists', async () => {
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('New Music Friday - 2024-06-07')).toBeInTheDocument();
      expect(screen.getByText('New Music Friday - 2024-05-31')).toBeInTheDocument();
    });
  });

  it('renders AudioPlayer when a playlist is selected', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('New Music Friday - 2024-06-07')).toBeInTheDocument();
    });
    const firstPlaylistButton = screen.getAllByRole('button', {
      name: 'New Music Friday - 2024-06-07',
    })[0];
    fireEvent.click(firstPlaylistButton);
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /seek/i })).toBeInTheDocument();
  });

  it('does not render AudioPlayer when no playlist is selected', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('New Music Friday - 2024-06-07')).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
  });
});
