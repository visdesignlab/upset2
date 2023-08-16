import { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#363636',
      contrastText: '#f5f5f5',
    },
    secondary: {
      main: '#3376a0',
      dark: '#0969da',
    },
    background: {
      default: '#ececec',
      paper: '#ffffff',
    },
    error: {
      main: '#c33149',
    },
    success: {
      main: '#488b49',
    },
  },
};
const DefaultTheme = createTheme(themeOptions);

export default DefaultTheme;
