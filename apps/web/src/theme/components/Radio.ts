import { Theme } from "@mui/material/styles"

export function Radio(theme: Theme) {
  return {
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
          svg: {
            fontSize: 24,
            "&[font-size=small]": {
              fontSize: 20,
            },
          },
        },
      },
    },
  }
}
