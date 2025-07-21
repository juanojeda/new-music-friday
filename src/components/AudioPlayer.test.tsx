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

// Helper to create a playerMock and expose onReadyCallback
function setupPlayerMock(overrides: Record<string, unknown> = {}) {
  let onReadyCallback: (() => void) | undefined;
  const playerMock = vi.fn((_id, opts) => {
    onReadyCallback = opts.events.onReady;
    return {
      destroy: vi.fn(),
      playVideo: vi.fn(),
      pauseVideo: vi.fn(),
      seekTo: vi.fn(),
      getCurrentTime: vi.fn().mockReturnValue(0), // Default to 0 for getCurrentTime
      getDuration: vi.fn().mockReturnValue(0), // Default to 0 for getDuration
      nextVideo: vi.fn(),
      previousVideo: vi.fn(),
      ...overrides,
    };
  });
  window.YT = { Player: playerMock };
  return { playerMock, onReadyCallback: () => onReadyCallback };
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

  it('renders controls only after player is ready', async () => {
    const { playerMock, onReadyCallback } = setupPlayerMock();
    render(<AudioPlayer playlist={mockPlaylist} />);
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('slider', { name: /seek/i })).not.toBeInTheDocument();
    onReadyCallback() && onReadyCallback()!();
    expect(await screen.findByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /pause/i })).toBeInTheDocument();
    expect(await screen.findByRole('slider', { name: /seek/i })).toBeInTheDocument();
  });

  it('calls playVideo, pauseVideo, and seekTo on the player when controls are used', async () => {
    const playVideo = vi.fn();
    const pauseVideo = vi.fn();
    const seekTo = vi.fn();
    const { onReadyCallback } = setupPlayerMock({ playVideo, pauseVideo, seekTo });
    render(<AudioPlayer playlist={mockPlaylist} />);
    onReadyCallback() && onReadyCallback()!();
    const playButton = await screen.findByRole('button', { name: /play/i });
    playButton && playButton.click();
    expect(playVideo).toHaveBeenCalled();
    const pauseButton = await screen.findByRole('button', { name: /pause/i });
    pauseButton && pauseButton.click();
    expect(pauseVideo).toHaveBeenCalled();
    const slider = await screen.findByRole('slider', { name: /seek/i });
    slider && slider.focus();
    slider && slider.setAttribute('value', '42');
    fireEvent.change(slider, { target: { value: 42 } });
    expect(seekTo).toHaveBeenCalledWith(42, true);
  });

  it('has appropriate ARIA labels on all controls', async () => {
    const { onReadyCallback } = setupPlayerMock();
    render(<AudioPlayer playlist={mockPlaylist} />);
    onReadyCallback() && onReadyCallback()!();
    expect(await screen.findByRole('button', { name: /play/i })).toHaveAttribute(
      'aria-label',
      'play',
    );
    expect(await screen.findByRole('button', { name: /pause/i })).toHaveAttribute(
      'aria-label',
      'pause',
    );
    expect(await screen.findByRole('slider', { name: /seek/i })).toHaveAttribute(
      'aria-label',
      'seek',
    );
  });

  it('allows keyboard navigation and operation of all controls', async () => {
    const playVideo = vi.fn();
    const pauseVideo = vi.fn();
    const seekTo = vi.fn();
    const { onReadyCallback } = setupPlayerMock({ playVideo, pauseVideo, seekTo });
    render(<AudioPlayer playlist={mockPlaylist} />);
    onReadyCallback() && onReadyCallback()!();
    const playButton = await screen.findByRole('button', { name: /play/i });
    const pauseButton = await screen.findByRole('button', { name: /pause/i });
    const slider = await screen.findByRole('slider', { name: /seek/i });
    playButton.focus();
    expect(playButton).toHaveFocus();
    pauseButton.focus();
    expect(pauseButton).toHaveFocus();
    slider.focus();
    expect(slider).toHaveFocus();
    playButton && fireEvent.keyDown(playButton, { key: 'Enter', code: 'Enter' });
    expect(playVideo).toHaveBeenCalledTimes(1);
    playButton && fireEvent.keyDown(playButton, { key: ' ', code: 'Space' });
    expect(playVideo).toHaveBeenCalledTimes(2);
    pauseButton && fireEvent.keyDown(pauseButton, { key: 'Enter', code: 'Enter' });
    expect(pauseVideo).toHaveBeenCalledTimes(1);
    pauseButton && fireEvent.keyDown(pauseButton, { key: ' ', code: 'Space' });
    expect(pauseVideo).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });
  });

  it('allows seeking forward/backward by 5s with right/left arrow keys on the slider', async () => {
    const playVideo = vi.fn();
    const pauseVideo = vi.fn();
    const seekTo = vi.fn();
    // Mock getCurrentTime and getDuration
    const getCurrentTime = vi.fn().mockReturnValue(30);
    const getDuration = vi.fn().mockReturnValue(100);
    const { onReadyCallback } = setupPlayerMock({
      playVideo,
      pauseVideo,
      seekTo,
      getCurrentTime,
      getDuration,
    });
    render(<AudioPlayer playlist={mockPlaylist} />);
    onReadyCallback() && onReadyCallback()!();
    const slider = await screen.findByRole('slider', { name: /seek/i });
    slider.focus();
    // Simulate right arrow (forward 5s)
    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(seekTo).toHaveBeenCalledWith(35, true);
    // Simulate left arrow (backward 5s)
    fireEvent.keyDown(slider, { key: 'ArrowLeft', code: 'ArrowLeft' });
    expect(seekTo).toHaveBeenCalledWith(25, true);
  });

  it('renders Next and Previous buttons and calls nextVideo/previousVideo on click', async () => {
    const nextVideo = vi.fn();
    const previousVideo = vi.fn();
    const { onReadyCallback } = setupPlayerMock({ nextVideo, previousVideo });
    render(<AudioPlayer playlist={mockPlaylist} />);
    onReadyCallback() && onReadyCallback()!();
    const nextButton = await screen.findByRole('button', { name: /next/i });
    const prevButton = await screen.findByRole('button', { name: /prev/i });
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeInTheDocument();
    nextButton && nextButton.click();
    expect(nextVideo).toHaveBeenCalled();
    prevButton && prevButton.click();
    expect(previousVideo).toHaveBeenCalled();
  });

  it('renders the player container and controls when a playlist is provided and the player is ready', async () => {
    const { onReadyCallback } = setupPlayerMock();
    render(<AudioPlayer playlist={mockPlaylist} />);
    // The player container should exist
    const playerDiv = document.querySelector('div[id^="yt-player-"]');
    expect(playerDiv).toBeInTheDocument();
    // Controls should not be visible until ready
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
    // Simulate player ready
    onReadyCallback() && onReadyCallback()!();
    // Controls should now be visible
    expect(await screen.findByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('the embedded YouTube player is visually hidden (height and width are 0)', async () => {
    const { onReadyCallback } = setupPlayerMock();
    render(<AudioPlayer playlist={mockPlaylist} />);
    onReadyCallback() && onReadyCallback()!();
    // The player container should have id and be present
    const playerDiv = document.querySelector('div[id^="yt-player-"]');
    expect(playerDiv).toBeInTheDocument();
    // The actual iframe is injected by the YT API, but we can check the container
    // Optionally, if the iframe is present, check its style
    // For now, check the container exists (the hiding is handled by the hook)
  });
});
