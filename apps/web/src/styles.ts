import { Theme, alpha } from "@mui/material/styles"
import createCache from "@emotion/cache"

type BackgroundBlurProps = {
  blur?: number
  opacity?: number
  color?: string
}

export function styles(theme?: Theme) {
  const palette = theme?.palette

  return {
    backgroundBlur: (props?: BackgroundBlurProps) => {
      const color = props?.color || palette?.background.default || "#000000"
      const blur = props?.blur || 6
      const opacity = props?.opacity || 0.8

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
