import { fetchYouTubeMusicPlaylists, generatePlaylistHtml, Playlist } from '../src/playlistFetcher';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

function writePlayerSetupScript(playlists: Playlist[], outDir: string) {
  let playlistJs = '';
  playlists.forEach((p, i) => {
    playlistJs += `  ytPlayers[${i}] = new YT.Player('yt-player-${i}', {\n` +
      `    height: '0',\n` +
      `    width: '0',\n` +
      `    playerVars: { listType: 'playlist', list: '${p.id}' },\n` +
      `    events: {\n` +
      `      'onReady': function(event) {\n` +
      `        setupPlayerControls(${i});\n` +
      `      }\n` +
      `    }\n` +
      `  });\n`;
  });
  const script =
`let ytPlayers = [];
function onYouTubeIframeAPIReady() {
${playlistJs}}
function setupPlayerControls(idx) {
  const playBtn = document.querySelector('#audio-player-' + idx + ' .play');
  const prevBtn = document.querySelector('#audio-player-' + idx + ' .prev');
  const nextBtn = document.querySelector('#audio-player-' + idx + ' .next');
  const seekBar = document.querySelector('#audio-player-' + idx + ' .seek');
  let isPlaying = false;
  playBtn.addEventListener('click', function() {
    if (isPlaying) {
      ytPlayers[idx].pauseVideo();
      playBtn.textContent = 'Play';
    } else {
      ytPlayers[idx].playVideo();
      playBtn.textContent = 'Pause';
    }
    isPlaying = !isPlaying;
  });
  prevBtn.addEventListener('click', function() {
    ytPlayers[idx].previousVideo();
  });
  nextBtn.addEventListener('click', function() {
    ytPlayers[idx].nextVideo();
  });
  seekBar.addEventListener('input', function() {
    const duration = ytPlayers[idx].getDuration();
    const seekTo = (seekBar.value / 100) * duration;
    ytPlayers[idx].seekTo(seekTo, true);
  });
  setInterval(function() {
    if (ytPlayers[idx] && ytPlayers[idx].getDuration) {
      const duration = ytPlayers[idx].getDuration();
      const current = ytPlayers[idx].getCurrentTime();
      if (duration > 0) {
        seekBar.value = ((current / duration) * 100).toFixed(0);
      }
    }
  }, 500);
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
  const outDir = path.join(__dirname, '../dist');
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