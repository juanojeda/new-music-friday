import { fetchYouTubeMusicPlaylists, generatePlaylistHtml, Playlist } from '../src/playlistFetcher';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

function writePlayerSetupScript(playlists: Playlist[], outDir: string) {
  // Prepare playlist data for JS
  const playlistData = JSON.stringify(playlists.map(p => ({ id: p.id, name: p.name })));
  const script =
`const playlists = ${playlistData};
let player = null;
let currentPlaylistIdx = 0;
let currentTrackTitle = '';

function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    playerVars: { listType: 'playlist', list: playlists[0].id },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  setupUnifiedPlayerControls();
  updateCurrentPlaylistUI();
}

function onPlayerStateChange(event) {
  // Update current track name when a new track starts
  if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.PAUSED) {
    setTimeout(updateCurrentTrackUI, 200); // Delay to ensure getVideoData is updated
  }
}

function setupUnifiedPlayerControls() {
  document.querySelectorAll('.playlist-list button').forEach((btn, idx) => {
    btn.addEventListener('click', function() {
      currentPlaylistIdx = idx;
      player.loadPlaylist({ list: playlists[idx].id });
      updateCurrentPlaylistUI();
      setTimeout(updateCurrentTrackUI, 500);
      // FIX: Start playback immediately after loading the new playlist
      setTimeout(() => player.playVideo(), 600);
    });
  });
  const playBtn = document.querySelector('.audio-player .play');
  const prevBtn = document.querySelector('.audio-player .prev');
  const nextBtn = document.querySelector('.audio-player .next');
  const seekBar = document.querySelector('.audio-player .seek');
  let isPlaying = false;
  playBtn.addEventListener('click', function() {
    if (isPlaying) {
      player.pauseVideo();
      playBtn.textContent = 'Play';
    } else {
      player.playVideo();
      playBtn.textContent = 'Pause';
    }
    isPlaying = !isPlaying;
  });
  prevBtn.addEventListener('click', function() {
    player.previousVideo();
  });
  nextBtn.addEventListener('click', function() {
    player.nextVideo();
  });
  seekBar.addEventListener('input', function() {
    const duration = player.getDuration();
    const seekTo = (seekBar.value / 100) * duration;
    player.seekTo(seekTo, true);
  });
  setInterval(function() {
    if (player && player.getDuration) {
      const duration = player.getDuration();
      const current = player.getCurrentTime();
      if (duration > 0) {
        seekBar.value = ((current / duration) * 100).toFixed(0);
      }
    }
  }, 500);
}

function updateCurrentPlaylistUI() {
  const el = document.getElementById('current-playlist');
  if (el) {
    el.textContent = 'Playlist: ' + playlists[currentPlaylistIdx].name;
  }
}

function updateCurrentTrackUI() {
  const el = document.getElementById('current-track');
  if (el && player && player.getVideoData) {
    const data = player.getVideoData();
    el.textContent = 'Track: ' + (data && data.title ? data.title : '');
  }
}
`;
  fs.writeFileSync(path.join(outDir, 'player-setup.js'), script);
}

async function main() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!apiKey || !channelId) {
    throw new Error('Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID in .env');
  }

  const playlists = await fetchYouTubeMusicPlaylists({
    apiKey,
    channelId,
    namePrefix: 'New Music Friday',
  });
  const html = generatePlaylistHtml(playlists);
  // Always write to the top-level dist/ directory
  const outDir = path.resolve(__dirname, '../../dist');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(path.join(outDir, 'output.html'), html);
  writePlayerSetupScript(playlists, outDir);
  console.log('Generated dist/output.html and dist/player-setup.js');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 