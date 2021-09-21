import { Theme } from "@mui/material/styles"

// ----------------------------------------------------------------------

export default function Container(_theme: Theme) {
  return {
    MuiContainer: {
      styleOverrides: {
        root: {},
      },
    },
  }
}
