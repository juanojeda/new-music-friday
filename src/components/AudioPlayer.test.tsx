import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import AudioPlayer from './AudioPlayer';
import { Playlist } from '../libs/types';
import { YTPlayerConstructor } from '../libs/yt-types';
import { fireEvent } from '@testing-library/react';

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

  it('instantiates YT.Player with height and width set to 0 to hide video area', () => {
    const playerMock = vi.fn();
    window.YT = { Player: playerMock };
    render(<AudioPlayer playlist={mockPlaylist} />);
    expect(playerMock).toHaveBeenCalled();
    const [_containerId, options] = playerMock.mock.calls[0];
    expect(options.height).toBe('0');
    expect(options.width).toBe('0');
  });

  it('renders controls only after player is ready', async () => {
    let onReadyCallback: (() => void) | undefined;
    const playerMock = vi.fn((_id, opts) => {
      onReadyCallback = opts.events.onReady;
      return { destroy: vi.fn() };
    });
    window.YT = { Player: playerMock };

    render(<AudioPlayer playlist={mockPlaylist} />);
    // Controls should not be rendered before onReady
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('slider', { name: /seek/i })).not.toBeInTheDocument();

    // Simulate player ready
    onReadyCallback && onReadyCallback();

    // Controls should now be rendered
    expect(await screen.findByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /pause/i })).toBeInTheDocument();
    expect(await screen.findByRole('slider', { name: /seek/i })).toBeInTheDocument();
  });

  it('calls playVideo, pauseVideo, and seekTo on the player when controls are used', async () => {
    let onReadyCallback: (() => void) | undefined;
    const playVideo = vi.fn();
    const pauseVideo = vi.fn();
    const seekTo = vi.fn();
    const playerMock = vi.fn((_id, opts) => {
      onReadyCallback = opts.events.onReady;
      return { destroy: vi.fn(), playVideo, pauseVideo, seekTo };
    });
    window.YT = { Player: playerMock };

    render(<AudioPlayer playlist={mockPlaylist} />);
    // Simulate player ready
    onReadyCallback && onReadyCallback();

    // Play
    const playButton = await screen.findByRole('button', { name: /play/i });
    playButton && playButton.click();
    expect(playVideo).toHaveBeenCalled();

    // Pause
    const pauseButton = await screen.findByRole('button', { name: /pause/i });
    pauseButton && pauseButton.click();
    expect(pauseVideo).toHaveBeenCalled();

    // Seek
    const slider = await screen.findByRole('slider', { name: /seek/i });
    // Simulate a value change
    // @ts-ignore: value is not in the type for Slider, but is supported by MUI
    slider && slider.focus();
    slider && slider.setAttribute('value', '42');
    // fireEvent.change will pass the value as the second argument to onChange
    fireEvent.change(slider, { target: { value: 42 } });
    expect(seekTo).toHaveBeenCalledWith(42, true);
  });
});
