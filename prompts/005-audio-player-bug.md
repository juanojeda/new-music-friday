# Audio player bug

(Assume NMF is abbreviation of New Music Friday)

When I click on a playlist, it should start playing that playlist, not the previously loaded playlist. Actually what currently happens is that it plays the previously loaded playlist, until you click the button a second time.

GIVEN I load the page
AND the first playlist to load is "NMF 2025 July 18"
WHEN I click on the button for "NMF 2025 July 4"
THEN it should update the player to show Playlist: NMF 2025 July 4
AND it should start playing the first track from NMF 2025 July 4
ACTUAL - it shows "Playlist: NMF 2025 July 4" BUT it starts playing the first track from "NMF 2025 July 18"
