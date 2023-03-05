import { alpha, Theme, useTheme, styled } from "@mui/material/styles"
import { BoxProps } from "@mui/material"
import { PaletteColorType } from "@/theme/palette"

type LabelColor =
  | "default"
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error"

type LabelVariant = "filled" | "outlined" | "ghost"

interface RootStyleProps {
  theme: Theme
  ownerState: {
    color: LabelColor
    variant: LabelVariant
  }
}

const RootStyle = styled("span")(({ theme, ownerState }: RootStyleProps) => {
  const { color, variant } = ownerState

  const styleFilled = (color: PaletteColorType) => ({
    color: theme.palette[color].contrastText,
    backgroundColor: theme.palette[color].main,
  })

  const styleOutlined = (color: PaletteColorType) => ({
    color: theme.palette[color].main,
    backgroundColor: "transparent",
    border: `1px solid ${theme.palette[color].main}`,
  })

  const styleGhost = (color: PaletteColorType) => ({
    color: theme.palette[color]["light"],
    backgroundColor: alpha(theme.palette[color].main, 0.16),
  })

  return {
    alignItems: "center",
    backgroundColor: theme.palette.grey[300],
    borderRadius: 8,
    color: theme.palette.grey[800],
    cursor: "default",
    display: "inline-flex",
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightBold,
    height: 22,
    justifyContent: "center",
    lineHeight: 0,
    minWidth: 22,
    padding: theme.spacing(0, 1),
    whiteSpace: "nowrap",
    ...(color !== "default"
      ? {
          ...(variant === "filled" && { ...styleFilled(color) }),
          ...(variant === "outlined" && { ...styleOutlined(color) }),
          ...(variant === "ghost" && { ...styleGhost(color) }),
        }
      : {
          ...(variant === "outlined" && {
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.grey[500_32]}`,
          }),
          ...(variant === "ghost" && {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.grey[500_16],
          }),
        }),
  }
})

interface LabelProps extends BoxProps {
  color?: LabelColor
  variant?: LabelVariant
}

export function Label({
  color = "default",
  variant = "ghost",
  children,
  sx,
}: LabelProps) {
  const theme = useTheme()

  return (
    <RootStyle ownerState={{ color, variant }} sx={sx} theme={theme}>
      {children}
    </RootStyle>
  )
}
