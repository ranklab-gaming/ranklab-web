import { alpha } from "@mui/material/styles"

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`
}

export type PaletteColorType =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error"

const primary = {
  lighter: "#ffcc31",
  light: "#fcb42b",
  main: "#f47734",
  dark: "#f26555",
  darker: "#f0533c",
}

const secondary = {
  lighter: "#EBD6FD",
  light: "#B985F4",
  main: "#7635dc",
  dark: "#431A9E",
  darker: "#200A69",
}

const info = {
  lighter: "#D0F2FF",
  light: "#74CAFF",
  main: "#1890FF",
  dark: "#0C53B7",
  darker: "#04297A",
}

const success = {
  lighter: "#E9FCD4",
  light: "#AAF27F",
  main: "#54D62C",
  dark: "#229A16",
  darker: "#08660D",
}
const warning = {
  lighter: "#FFF7CD",
  light: "#FFE16A",
  main: "#FFC107",
  dark: "#B78103",
  darker: "#7A4F01",
}
const error = {
  lighter: "#FFE7D9",
  light: "#FFA48D",
  main: "#FF4842",
  dark: "#B72136",
  darker: "#7A0C2E",
}

const grey = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
  500_8: alpha("#919EAB", 0.08),
  500_12: alpha("#919EAB", 0.12),
  500_16: alpha("#919EAB", 0.16),
  500_24: alpha("#919EAB", 0.24),
  500_32: alpha("#919EAB", 0.32),
  500_48: alpha("#919EAB", 0.48),
  500_56: alpha("#919EAB", 0.56),
  500_80: alpha("#919EAB", 0.8),
}

const gradients = {
  primary: createGradient(primary.light, primary.main),
  info: createGradient(info.light, info.main),
  success: createGradient(success.light, success.main),
  warning: createGradient(warning.light, warning.main),
  error: createGradient(error.light, error.main),
}

const chart = {
  violet: ["#826AF9", "#9E86FF", "#D0AEFF", "#F7D2FF"],
  blue: ["#2D99FF", "#83CFFF", "#A5F3FF", "#CCFAFF"],
  green: ["#2CD9C5", "#60F1C8", "#A4F7CC", "#C0F2DC"],
  yellow: ["#FFE700", "#FFEF5A", "#FFF7AE", "#FFF3D6"],
  red: ["#FF6C40", "#FF8F6D", "#FFBD98", "#FFF2D4"],
}

export const palette = {
  common: { black: "#000", white: "#fff" },
  primary: { ...primary, contrastText: "#fff" },
  secondary: { ...secondary, contrastText: "#fff" },
  info: { ...info, contrastText: "#fff" },
  success: { ...success, contrastText: grey[800] },
  warning: { ...warning, contrastText: grey[800] },
  error: { ...error, contrastText: "#fff" },
  grey,
  gradients,
  chart,
  divider: grey[500_24],
  text: { primary: "#fff", secondary: grey[500], disabled: grey[600] },
  background: { paper: grey[800], default: grey[900], neutral: grey[500_16] },
  action: {
    active: grey[500],
    hover: grey[500_8],
    selected: grey[500_16],
    disabled: grey[500_80],
    disabledBackground: grey[500_24],
    focus: grey[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
} as const
