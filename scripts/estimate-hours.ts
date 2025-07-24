import * as fs from 'fs';

// Read and parse commit times
const lines = fs
  .readFileSync('commit_times.txt', 'utf-8')
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

// Parse dates (handling timezone)
const times = lines
  .map((line) => {
    // Convert "2025-07-22 17:37:57 +1000" to ISO format
    const iso = line.replace(' ', 'T').replace(/ ([+-]\d{4})$/, '$1');
    return new Date(iso);
  })
  .sort((a, b) => a.getTime() - b.getTime());

if (times.length === 0) {
  console.log('No commit times found.');
  process.exit(0);
}

let total = 0;
let sessionStart = times[0];

for (let i = 1; i < times.length; i++) {
  const prev = times[i - 1];
  const curr = times[i];
  const diff = (curr.getTime() - prev.getTime()) / (1000 * 3600); // hours
  if (diff > 2) {
    total += (prev.getTime() - sessionStart.getTime()) / (1000 * 3600);
    sessionStart = curr;
  }
}
total += (times[times.length - 1].getTime() - sessionStart.getTime()) / (1000 * 3600);

// Calculate per-day average
const firstDay = new Date(times[0].getFullYear(), times[0].getMonth(), times[0].getDate());
const lastDay = new Date(
  times[times.length - 1].getFullYear(),
  times[times.length - 1].getMonth(),
  times[times.length - 1].getDate(),
);
const days = Math.max(
  1,
  Math.round((lastDay.getTime() - firstDay.getTime()) / (1000 * 3600 * 24)) + 1,
);
const avgPerDay = total / days;

console.log(`Estimated hours: ${total.toFixed(2)}`);
console.log(`Days active: ${days}`);
console.log(`Average hours per day: ${avgPerDay.toFixed(2)}`);
