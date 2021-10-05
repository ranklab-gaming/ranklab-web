import { Theme } from "@mui/material/styles"

// ----------------------------------------------------------------------

export default function ToggleButton(theme: Theme) {
  return {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: theme.palette.grey[500],
          border: `solid 1px ${theme.palette.grey[500_32]}`,
          "&.Mui-selected": {
            color: theme.palette.grey[0],
            backgroundColor: theme.palette.action.selected,
          },
          "&.Mui-disabled": {
            color: theme.palette.grey[500_48],
          },
        },
      },
    },
  }
}
