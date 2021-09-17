import { Theme } from '@material-ui/core/styles';

// ----------------------------------------------------------------------

export default function Snackbar(_theme: Theme) {
  return {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {}
      }
    }
  };
}
