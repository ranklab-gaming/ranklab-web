import { createTheme } from "@mui/material"
import { breakpoints } from "./breakpoints"
import { createComponentOverrides } from "./components"
import { palette } from "./palette"
import { customShadows, shadows } from "./shadows"
import typography from "./typography"

export const theme = createTheme({
  palette,
  breakpoints,
  shape: { borderRadius: 8 },
  shadows,
  customShadows,
  typography,
})

theme.components = createComponentOverrides(theme)
