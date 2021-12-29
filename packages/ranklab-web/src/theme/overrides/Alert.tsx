// material
import { Theme } from "@mui/material/styles"
// @types
import { ColorSchema } from "../../@types/theme"
import Iconify from "src/components/Iconify"

// ----------------------------------------------------------------------

export default function Alert(theme: Theme) {
  const standardStyle = (color: ColorSchema) => ({
    color: theme.palette[color]["lighter"],
    backgroundColor: theme.palette[color]["darker"],
    "& .MuiAlert-icon": {
      color: theme.palette[color]["light"],
    },
  })

  const filledStyle = (color: ColorSchema) => ({
    color: theme.palette[color].contrastText,
  })

  const outlinedStyle = (color: ColorSchema) => ({
    color: theme.palette[color]["lighter"],
    border: `solid 1px ${theme.palette[color]["dark"]}`,
    backgroundColor: theme.palette[color]["darker"],
    "& .MuiAlert-icon": {
      color: theme.palette[color]["light"],
    },
  })

  return {
    MuiAlert: {
      defaultProps: {
        iconMapping: {
          error: <Iconify icon="eva:info-fill" />,
          info: <Iconify icon="eva:alert-circle-fill" />,
          success: <Iconify icon="eva:checkmark-circle-2-fill" />,
          warning: <Iconify icon="eva:alert-triangle-fill" />,
        },
      },

      styleOverrides: {
        message: {
          "& .MuiAlertTitle-root": {
            marginBottom: theme.spacing(0.5),
          },
        },
        action: {
          "& button:not(:first-of-type)": {
            marginLeft: theme.spacing(1),
          },
        },

        standardInfo: standardStyle("info"),
        standardSuccess: standardStyle("success"),
        standardWarning: standardStyle("warning"),
        standardError: standardStyle("error"),

        filledInfo: filledStyle("info"),
        filledSuccess: filledStyle("success"),
        filledWarning: filledStyle("warning"),
        filledError: filledStyle("error"),

        outlinedInfo: outlinedStyle("info"),
        outlinedSuccess: outlinedStyle("success"),
        outlinedWarning: outlinedStyle("warning"),
        outlinedError: outlinedStyle("error"),
      },
    },
  }
}
