import { ReactNode } from "react"
// material
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles"
//
import componentsOverride from "../theme/overrides"

// ----------------------------------------------------------------------

type ThemePrimaryColorProps = {
  children: ReactNode
}

export default function ThemePrimaryColor({
  children,
}: ThemePrimaryColorProps) {
  const theme = createTheme(useTheme())
  theme.components = componentsOverride(theme)

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
