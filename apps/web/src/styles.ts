import createCache from "@emotion/cache"
import { alpha, Theme } from "@mui/material/styles"

type BackgroundBlurProps = {
  blur?: number
  opacity?: number
  color?: string
}

export function styles(theme?: Theme) {
  const palette = theme?.palette

  return {
    backgroundBlur: (props?: BackgroundBlurProps) => {
      const color = props?.color ?? palette?.background.default ?? "#000000"
      const blur = props?.blur ?? 6
      const opacity = props?.opacity ?? 0.8

      return {
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, opacity),
      }
    },
  }
}

export function createEmotionCache() {
  return createCache({ key: "css", prepend: true })
}

export const headerStyles = {
  mobileHeight: 88,
  mainDesktopHeight: 88,
  dashboardDesktopHeight: 92,
  dashboardDesktopOffsetHeight: 92 - 32,
}

export const navbarStyles = {
  baseWidth: 260,
  dashboardWidth: 280,
  dashboardCollapsedWidth: 80,
  dashboardItemRootHeight: 48,
  dashboardItemSubHeight: 40,
  dashboardItemHorizontalHeight: 32,
}

export const iconStyles = {
  navbarItem: 22,
  navbarItemHorizontal: 20,
}
