import { useMemo, ReactNode } from "react"

// material
import { CssBaseline } from "@mui/material"
import { createTheme, ThemeProvider, ThemeOptions } from "@mui/material/styles"
// hooks
import useSettings from "../hooks/useSettings"
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
  const { themeDirection } = useSettings()

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: { ...palette.dark, mode: "dark" },
      shape,
      typography,
      breakpoints,
      direction: themeDirection,
      shadows: shadows.dark,
      customShadows: customShadows.dark,
    }),
    [themeDirection]
  )

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
