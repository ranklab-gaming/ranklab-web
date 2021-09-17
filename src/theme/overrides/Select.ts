import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import { Theme } from '@material-ui/core/styles';

// ----------------------------------------------------------------------

export default function Select(_theme: Theme) {
  return {
    MuiSelect: {
      defaultProps: {
        IconComponent: ExpandMoreRoundedIcon
      },

      styleOverrides: {
        root: {}
      }
    }
  };
}
