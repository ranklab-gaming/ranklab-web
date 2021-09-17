import { Theme } from '@material-ui/core/styles';

// ----------------------------------------------------------------------

export default function Link(_theme: Theme) {
  return {
    MuiLink: {
      defaultProps: {
        underline: 'hover'
      },

      styleOverrides: {
        root: {}
      }
    }
  };
}
