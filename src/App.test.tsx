import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import App from './App';

const mockPlaylists = [
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
) as any;

describe('App', () => {
  it('renders PlaylistList and displays playlists', async () => {
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('New Music Friday - 2024-06-07')).toBeInTheDocument();
      expect(screen.getByText('New Music Friday - 2024-05-31')).toBeInTheDocument();
    });
  });
});
