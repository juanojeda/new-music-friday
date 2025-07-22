import { ThemeProvider } from '@emotion/react';
import { themeFromSourceColor, Rgba, argbFromRgba, Hct, SchemeTonalSpot, redFromArgb, greenFromArgb, blueFromArgb, argbFromHex, hexFromArgb } from '@material/material-color-utilities';
import { createTheme, Theme } from '@mui/material';
import React, { useEffect } from 'react';

interface ThemeSwitcherProps extends React.PropsWithChildren {
}

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