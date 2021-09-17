import { Theme } from '@material-ui/core/styles';

// ----------------------------------------------------------------------

export default function IconButton(_theme: Theme) {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {},
      },
    },
  };
}
