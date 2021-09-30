import { Theme } from "@mui/material/styles"

// ----------------------------------------------------------------------

export default function Snackbar(_theme: Theme) {
  return {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {},
      },
    },
  }
}
