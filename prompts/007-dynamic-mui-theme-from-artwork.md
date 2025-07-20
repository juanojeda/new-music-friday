I want to be able to use Material UI 3's dynamic colours based on the unique artwork of the playlist.

The way I see this working is:
- When the playlists are fetched, the ID of the playlist is used to generate a unique artwork (using the jdenticon library)
- Using that artwork, identify the primary colour or colours used, and save that as part of the json playlist payload
- When the playlist is selected, use that as the primary.main colour of the theme and apply it to the app (this is assuming that MUI's createTheme will dynamically generate the rest of the theme based on primary.main)

## Questions
- Does createTheme generate a whole theme based on primary.main?
- If not, how else can we use just 1 colour to generate a cohesive theme?
- How can we dynamically transition between themes when a playlist is selected? 
- How will we extract the dominant color from the jdenticon album art?

---

## Answers & Technical Guidance

### 1. Does createTheme generate a whole theme based on primary.main?
- **No, not fully.**
  - `createTheme` in Material UI (v5, Material Design 2) lets you specify `primary.main`, but it does not auto-generate a full palette (shades, contrast, etc.) from just that color. You must provide additional palette values if you want a richer theme.
  - Material UI does not natively support Material Design 3 (M3) dynamic color schemes out of the box. M3-style dynamic palette generation requires extra libraries or custom logic.

### 2. If not, how else can we use just 1 colour to generate a cohesive theme?
- **Options:**
  - **Manual Palette Generation:** Use color utilities (e.g., `color`, `chroma-js`) to generate lighter/darker shades and contrast text from your primary color, then pass those into `createTheme`.
  - **Community Libraries:** Use libraries like [`@mui/material-color-utilities`](https://github.com/material-foundation/material-color-utilities) or [`material-you-color`](https://www.npmjs.com/package/material-you-color) to generate a Material Design 3 palette from a single color.
  - **Custom Algorithm:** Extract the dominant color from the artwork (e.g., with `color-thief` or `node-vibrant`), then use that as the seed for palette generation.

### 3. How can we dynamically transition between themes when a playlist is selected?
- **Approach:**
  - Store the generated theme (or at least the primary color) for each playlist.
  - When a playlist is selected, update the theme in your React state/context and pass it to the `ThemeProvider`.
  - For smooth transitions, use CSS transitions on background and color properties, or use a library like [`framer-motion`](https://www.framer.com/motion/) for more advanced animation.
  - Example:
    ```tsx
    const [theme, setTheme] = useState(createTheme({ palette: { primary: { main: '#...' } } }));
    // On playlist select:
    setTheme(createTheme({ palette: { primary: { main: newColor } } }));
    ```

### 4. How will we extract the dominant color from the jdenticon album art?
- **Approach:**
  - `jdenticon` generates SVG artwork based on a hash (e.g., playlist ID). To extract the dominant color:
    1. **Render the SVG to a Canvas:** Use a library like `@svgdotjs/svg.js` or render the SVG in a hidden `<canvas>` element in the browser.
    2. **Extract Pixel Data:** Use the Canvas API (`getImageData`) to access pixel data from the rendered SVG.
    3. **Color Analysis:** Use a color analysis library such as [`color-thief`](https://lokeshdhakar.com/projects/color-thief/) or [`node-vibrant`](https://github.com/Vibrant-Colors/node-vibrant) to analyze the pixel data and determine the dominant color.
  - **Alternative:** If you know the color palette used by jdenticon, you could parse the SVG XML directly to extract the fill colors, then select the most frequent or visually dominant one.
  - **Summary:** The most robust approach is to render the SVG to a canvas and use a color extraction library to determine the dominant color, ensuring compatibility with any generated artwork.

---

**Next Steps / Recommendations:**
1. Use `jdenticon` to generate SVG artwork for each playlist.
2. Extract the dominant color from the SVG using a color extraction library.
3. Generate a full palette from the dominant color (using a utility or library).
4. Update the MUI theme dynamically when a playlist is selected.
5. Add CSS or animation for smooth theme transitions. 