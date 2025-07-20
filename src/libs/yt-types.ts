// Minimal type-safe YouTube IFrame Player API types for use in both component and tests
export interface YTPlayer {
  destroy?: () => void;
  playVideo?: () => void;
  pauseVideo?: () => void;
  seekTo?: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime?: () => number;
  getDuration?: () => number;
}
export interface YTPlayerOptions {
  height: string;
  width: string;
  playerVars: { listType: string; list: string };
  events: { onReady: () => void };
}
export type YTPlayerConstructor = new (elementId: string, options: YTPlayerOptions) => YTPlayer;

export {};

declare global {
  interface Window {
    YT?: {
      Player: YTPlayerConstructor;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
