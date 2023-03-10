import { Theme } from "@mui/material/styles"

export function Tooltip(theme: Theme) {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[700],
        },
        arrow: {
          color: theme.palette.grey[700],
        },
      },
    },
  }
}
