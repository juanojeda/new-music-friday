There is another bug

GIVEN I have selected a playlist
WHEN I am playing a track that runs for 3:30 (or any arbitrary time)
THEN I expect that the far left of the seeker represents 0:00 in the playhead
AND I expect that the far right of the seeker represents 3:30 in the playhead (or always the end of the track)

ACTUAL Currently, the seeker reaches the end of the playhead, but the track will continue to play.
