import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import AudioPlayer from './AudioPlayer';
import { Playlist } from '../libs/types';
import { YTPlayerConstructor } from '../libs/yt-types';

const mockPlaylist: Playlist = {
  id: '1',
  name: 'New Music Friday - 2024-06-07',
  publishedAt: '2024-06-07T12:00:00Z',
  thumbnail: '',
};

declare global {
  interface Window {
    YT?: { Player: YTPlayerConstructor };
  }
}

describe('AudioPlayer', () => {
  beforeEach(() => {
    // Remove any existing YouTube IFrame API script and window.YT
    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (existingScript) existingScript.remove();
    delete window.YT;
  });
  afterEach(() => {
    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (existingScript) existingScript.remove();
    delete window.YT;
  });

  it('renders Material UI audio player controls when a playlist is selected', () => {
    render(<AudioPlayer playlist={mockPlaylist} />);
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /seek/i })).toBeInTheDocument();
  });

  it('does not render if no playlist is selected', () => {
    render(<AudioPlayer playlist={null} />);
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
  });

  it('injects the YouTube IFrame API script if not present', () => {
    render(<AudioPlayer playlist={mockPlaylist} />);
    const script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    expect(script).toBeInTheDocument();
  });

  it('creates a YT.Player instance when window.YT is present and playlist is set', () => {
    // Arrange: mock window.YT.Player
    const playerMock = vi.fn();
    window.YT = { Player: playerMock };

    render(<AudioPlayer playlist={mockPlaylist} />);

    // Assert: YT.Player was called with the correct container and options
    expect(playerMock).toHaveBeenCalled();
    const [containerId, options] = playerMock.mock.calls[0];
    expect(typeof containerId).toBe('string');
    expect(options).toBeDefined();
  });
});
