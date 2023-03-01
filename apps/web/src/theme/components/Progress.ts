import { Theme } from "@mui/material/styles"

export function Progress(theme: Theme) {
  return {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          overflow: "hidden",
        },
        bar: {
          borderRadius: 4,
        },
        colorPrimary: {
          backgroundColor: theme.palette.primary.darker,
        },
        buffer: {
          backgroundColor: "transparent",
        },
      },
    },
  }
}
