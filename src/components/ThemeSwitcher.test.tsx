import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Box, useTheme } from '@mui/material';
import ThemeSwitcher from './ThemeSwitcher';

const ChildrenComponent = () => {
  const theme = useTheme();
  return (
    <Box data-testid="test-child">
      <div data-testid="primary-main">{theme.palette.primary.main}</div>
      <div data-testid="secondary-main">{theme.palette.secondary.main}</div>
      <div data-testid="error-main">{theme.palette.error.main}</div>
      <div data-testid="grey-500">{theme.palette.grey[500]}</div>
      <div data-testid="text-primary">{theme.palette.text.primary}</div>
      <div data-testid="text-secondary">{theme.palette.text.secondary}</div>
    </Box>
  )
}

const matchers = [
  ["primary-main", "#465adb"],
  ["secondary-main", "#8B8FAF"],
  ["error-main", "#FF5449"],
  ["grey-500", "#444"],
  ["text-primary", "#1a1b23"],
  ["text-secondary", "#454654"]
];

describe("ThemeSwitcher", () => {
  it("Renders its children", async () => {
    await waitFor(async () => render(<ThemeSwitcher><ChildrenComponent /></ThemeSwitcher>));

    expect(screen.getByTestId("test-child")).toBeInTheDocument();

  });

  describe("Theme creation", async () => {
    it("creates and renders a default theme when not provided a dominant colour", async () => {
      await waitFor(async () => render(<ThemeSwitcher><ChildrenComponent /></ThemeSwitcher>));
      
      for (const [testId, value] of matchers) {
        expect(screen.getByTestId(testId)).toHaveTextContent(value)
      }
    });
  
    it("creates and renders a theme from the dominant colour", async () => {
      await waitFor(async () => render(<ThemeSwitcher dominantColor="#ff0000"><ChildrenComponent /></ThemeSwitcher>));

      for (const [testId, value] of matchers) {
        expect(screen.getByTestId(testId)).not.toHaveTextContent(value)
        expect(screen.getByTestId(testId).textContent).toEqual(expect.any(String))
      }
    });

  })

})