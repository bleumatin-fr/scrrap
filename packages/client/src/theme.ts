import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      dark: '#6A602C',
      main: '#E6F93B',
      light: '#DDDDDD',
      contrastText: '#000000'
    },
    secondary: {
      dark: '#DDDDDD',
      main: '#FFFFFF',
      light: '#FFFFFF',
      contrastText: '#000000'
    },
    error: {
      main: '#D3756B',
    }
  },
  typography: {
    fontFamily: [
      'BrownStd',
      'sans-serif',
    ].join(','),
  }
});

export default theme;
