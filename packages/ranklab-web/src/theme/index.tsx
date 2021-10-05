import { ReactNode } from "react"

// material
import { CssBaseline } from "@mui/material"
import { createTheme, ThemeProvider, ThemeOptions } from "@mui/material/styles"
// hooks
//
import shape from "./shape"
import palette from "./palette"
import typography from "./typography"
import breakpoints from "./breakpoints"
import GlobalStyles from "./globalStyles"
import componentsOverride from "./overrides"
import shadows, { customShadows } from "./shadows"

// ----------------------------------------------------------------------

type ThemeConfigProps = {
  children: ReactNode
}

export default function ThemeConfig({ children }: ThemeConfigProps) {
  const themeOptions: ThemeOptions = {
    palette: { ...palette.dark, mode: "dark" },
    shape,
    typography,
    breakpoints,
    shadows: shadows.dark,
    customShadows: customShadows.dark,
  }

  const theme = createTheme(themeOptions)
  theme.components = componentsOverride(theme)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </ThemeProvider>
  )
}
