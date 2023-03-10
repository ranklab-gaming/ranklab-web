import { Box, BoxProps } from "@mui/material"

export function LandingPageOverlay(props: BoxProps) {
  return (
    <Box {...props}>
      <svg
        height="1024"
        viewBox="0 0 1440 1024"
        width="1440"
        xmlns="http://www.w3.org/2000/svg"
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      >
        <radialGradient
          id="a"
          cx="14.340549%"
          cy="-11.486891%"
          gradientTransform="matrix(.28937714 .91345637 -.64956887 .40693667 .027292 -.199119)"
          r="109.474303%"
        >
          <stop offset="0" stopColor="#161c24" stopOpacity=".48" />
          <stop offset=".498646968" stopColor="#161c24" stopOpacity=".8" />
          <stop offset="1" stopColor="#161c24" />
        </radialGradient>
        <path
          d="m0 0h1440v1024h-1440z"
          fill="url(#a)"
          fillRule="evenodd"
          transform="matrix(-1 0 0 1 1440 0)"
        />
      </svg>
    </Box>
  )
}
