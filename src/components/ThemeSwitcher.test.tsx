import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Box } from '@mui/material';
import ThemeSwitcher from './ThemeSwitcher';

const ChildrenComponent = () => {
  return (
    <Box data-testid="test-child" sx={{
      bgcolor: 'primary.main',
      color: 'text.secondary'
    }}>
      Test component
    </Box>
  )
}

describe("ThemeSwitcher", () => {
  it("Renders its children", () => {
    render(<ThemeSwitcher><ChildrenComponent /></ThemeSwitcher>);

    expect(screen.getByText(/Test component/)).toBeInTheDocument()

  });

  describe("Theme creation", () => {
    it("creates and renders a default theme when not provided a dominant colour", () => {
      render(<ThemeSwitcher><ChildrenComponent /></ThemeSwitcher>);

      const child = screen.getByTestId("test-child");

      expect(child).toHaveStyle("background-color: #465adb");
      expect(child).toHaveStyle("color: #454654");
    });
  
    it("creates and renders a theme from the dominant colour", () => {
      
    });

  })

})