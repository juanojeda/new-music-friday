import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import PlaylistList from './PlaylistList';

// Mock fetch globally
const mockPlaylists = [
  { id: '1', name: 'New Music Friday - 2024-06-07', publishedAt: '2024-06-07T12:00:00Z' },
  { id: '2', name: 'New Music Friday - 2024-05-31', publishedAt: '2024-05-31T12:00:00Z' },
];

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockPlaylists),
  })
) as any;

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
    (global.fetch as any).mockImplementationOnce(() => Promise.resolve({ ok: false }));
    render(<PlaylistList />);
    await waitFor(() => {
      expect(screen.getByText(/failed to load playlists/i)).toBeInTheDocument();
    });
  });
}); 