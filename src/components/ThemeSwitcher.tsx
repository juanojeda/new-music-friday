import { ThemeProvider } from '@emotion/react';
import { themeFromSourceColor, Rgba, argbFromRgba, Hct, SchemeTonalSpot, redFromArgb, greenFromArgb, blueFromArgb, argbFromHex, hexFromArgb, applyTheme, DynamicScheme, sourceColorFromImage, CorePalette } from '@material/material-color-utilities';
import { Variant } from '@material/material-color-utilities/dynamiccolor/variant';
import { createTheme, lighten, Theme } from '@mui/material';
import { light } from '@mui/material/styles/createPalette';
import React, { useEffect, useState } from 'react';

interface ThemeSwitcherProps extends React.PropsWithChildren {
  dominantColor?: string
}

const defaultTheme = {
  primary: {
    main: "#465adb"
  },
  secondary: {
    main: "#8B8FAF",
  },
  error: {
    main: "#FF5449"
  },
  grey: {
    500: "#444"
  },
  text: {
    primary: "#1a1b23",
    secondary: "#454654"
  }
}

export default function ThemeSwitcher({ children, dominantColor }: ThemeSwitcherProps) {

  const [themeConfig, setThemeConfig] = useState({ palette: defaultTheme });;
  
  useEffect(function applyThemeFromDominantColor() {
    if (!dominantColor) return;
    const dynamicTheme = themeFromSourceColor(argbFromHex(dominantColor));
    const { schemes: { light: lightScheme }, palettes: { neutral, neutralVariant} } = dynamicTheme;
    
    const youThemeConfig = {
      palette: {
        primary: {
          main: hexFromArgb(lightScheme.primary)
        },
        secondary: {
          main: hexFromArgb(lightScheme.secondary)
        },
        error: {
          main: hexFromArgb(lightScheme.error)
        },
        grey: {
          500: hexFromArgb(neutral.keyColor["argb"])
        },
        background: {
          default: lighten(hexFromArgb(lightScheme.tertiary), 0.85)
        },
        text: {
          primary: neutral.keyColor["argb"],
          secondary: neutralVariant.keyColor["argb"],
        }
      }
    }

    setThemeConfig(youThemeConfig);
  }, [dominantColor])

  return (
    <ThemeProvider theme={createTheme(themeConfig)}>{children}</ThemeProvider>
  )
}