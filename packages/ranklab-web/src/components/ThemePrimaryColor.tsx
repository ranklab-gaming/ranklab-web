import { ReactNode } from "react"
// material
import {
  alpha,
  useTheme,
  createTheme,
  ThemeProvider,
  ThemeOptions,
} from "@mui/material/styles"
//
import componentsOverride from "../theme/overrides"

// ----------------------------------------------------------------------

type ThemePrimaryColorProps = {
  children: ReactNode
}

const PALETTE = {
  lighter: "#EBD6FD",
  light: "#B985F4",
  main: "#7635dc",
  dark: "#431A9E",
  darker: "#200A69",
  contrastText: "#fff",
}

export default function ThemePrimaryColor({
  children,
}: ThemePrimaryColorProps) {
  const defaultTheme = useTheme()
  const themeOptions: ThemeOptions = {
    ...defaultTheme,
    palette: {
      ...defaultTheme.palette,
      primary: PALETTE,
    },
    customShadows: {
      ...defaultTheme.customShadows,
      primary: `0 8px 16px 0 ${alpha(PALETTE.main, 0.24)}`,
    },
  }

  const theme = createTheme(themeOptions)
  theme.components = componentsOverride(theme)

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
