import { Theme } from "@mui/material/styles"
import { StarIcon } from "../icons"

const iconSmall = { width: 20, height: 20 }
const iconLarge = { width: 28, height: 28 }

export function Rating(theme: Theme) {
  return {
    MuiRating: {
      defaultProps: {
        emptyIcon: <StarIcon />,
        icon: <StarIcon />,
      },
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            opacity: 0.48,
          },
        },
        iconEmpty: { color: theme.palette.grey[500_48] },
        sizeSmall: { "& svg": { ...iconSmall } },
        sizeLarge: { "& svg": { ...iconLarge } },
      },
    },
  }
}
