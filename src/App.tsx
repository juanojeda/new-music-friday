import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PlaylistList from './PlaylistList';

function App() {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <PlaylistList />
    </ThemeProvider>
  );
}

export default App;
