import * as material from "@mui/material"

declare module "@mui/material" {
  interface Color {
    0: string
    500_8: string
    500_12: string
    500_16: string
    500_24: string
    500_32: string
    500_48: string
    500_56: string
    500_80: string
  }
}

interface GradientsPaletteOptions {
  primary: string
  info: string
  success: string
  warning: string
  error: string
}

interface ChartPaletteOptions {
  violet: string[]
  blue: string[]
  green: string[]
  yellow: string[]
  red: string[]
}

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    neutral: string
  }

  interface SimplePaletteColorOptions {
    lighter: string
    darker: string
  }

  interface PaletteColor {
    lighter: string
    darker: string
  }

  interface PaletteOptions {
    gradients: GradientsPaletteOptions
    chart: ChartPaletteOptions
  }

  interface Palette {
    gradients: GradientsPaletteOptions
    chart: ChartPaletteOptions
  }
}

interface CustomShadowOptions {
  z1: string
  z8: string
  z12: string
  z16: string
  z20: string
  z24: string
  primary: string
  secondary: string
  info: string
  success: string
  warning: string
  error: string
  card: string
  dialog: string
  dropdown: string
}

declare module "@mui/material/styles" {
  interface Theme {
    customShadows: CustomShadowOptions
  }

  interface ThemeOptions {
    customShadows?: CustomShadowOptions
  }
}
