import { Theme } from '@material-ui/core/styles';

// ----------------------------------------------------------------------

export default function Container(_theme: Theme) {
  return {
    MuiContainer: {
      styleOverrides: {
        root: {}
      }
    }
  };
}
