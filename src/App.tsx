import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';

function App() {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <div>
        <h1>Vite + React + Material UI</h1>
        <Button variant="contained" color="primary">
          Hello MUI
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default App
