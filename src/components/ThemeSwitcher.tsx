import { ThemeProvider } from '@emotion/react';
import { themeFromSourceColor, Rgba, argbFromRgba, Hct, SchemeTonalSpot, redFromArgb, greenFromArgb, blueFromArgb, argbFromHex, hexFromArgb } from '@material/material-color-utilities';
import { createTheme, Theme } from '@mui/material';
import React, { useEffect } from 'react';

interface ThemeSwitcherProps extends React.PropsWithChildren {
}

type RgbaTuple = [R: number, g: number, b: number, a: number];
const getRgbaTuple = (rgbString: string): RgbaTuple => (rgbString.replace(/^(rgb|rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',').map(val => Number(val || 1)) as RgbaTuple);

const getHctFromRgbaString = (rgbString: string): Hct => {
  
  const [r, g, b] = getRgbaTuple(rgbString);

  return Hct.from(r, g, b);
}

const getRGBAfromString = (rgbString: string): Rgba => {
  const [r, g, b, a] = getRgbaTuple(rgbString);

  return {
    r,g,b,a
  }
}

const rgbStringFromArgb = (argb: number): string => `rgb(${redFromArgb(argb)}, ${greenFromArgb(argb)}, ${blueFromArgb(argb)})`

// Warning! Uses the private `argb` method on the Hct object
const HctToHex = ({ hue, chroma, tone }: Hct): string => `#${Hct.from(hue, chroma, tone)['argb'].toString(16)}`;

const defaultTheme = {
  primary: {
    main: "#465adb"
  },
  secondary: {
    main: "#8B8FAF",
  },
  tertiary: {
    main: "#B77FA7"
  },
  error: {
    main: "#FF5449"
  },
  text: {
    primary: "#1a1b23",
    secondary: "#454654"
  }
}

export default function ThemeSwitcher({ children }: ThemeSwitcherProps) {
  const youTheme = themeFromSourceColor(argbFromHex(defaultTheme.primary.main));

  const muiTheme = createTheme({palette: defaultTheme})
  
  useEffect(function applyTheme() {

  }, [youTheme])

  return (
    <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
  )
}