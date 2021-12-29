import { Theme } from "@mui/material/styles"
import { SvgIcon } from "@mui/material"
import Iconify from "src/components/Iconify"

// ----------------------------------------------------------------------

const ICON_SMALL = { width: 20, height: 20 }
const ICON_LARGE = { width: 28, height: 28 }

const ICON = (
  <SvgIcon>
    <Iconify icon="eva:star-fill" />
  </SvgIcon>
)

export default function Rating(theme: Theme) {
  return {
    MuiRating: {
      defaultProps: {
        emptyIcon: ICON,
        icon: ICON,
      },

      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            opacity: 0.48,
          },
        },
        iconEmpty: { color: theme.palette.grey[500_48] },
        sizeSmall: { "& svg": { ...ICON_SMALL } },
        sizeLarge: { "& svg": { ...ICON_LARGE } },
      },
    },
  }
}
