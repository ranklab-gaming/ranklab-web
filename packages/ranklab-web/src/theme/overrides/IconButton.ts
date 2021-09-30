import { Theme } from "@mui/material/styles"

// ----------------------------------------------------------------------

export default function IconButton(_theme: Theme) {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {},
      },
    },
  }
}
