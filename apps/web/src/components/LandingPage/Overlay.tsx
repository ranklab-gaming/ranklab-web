import { Box, BoxProps } from "@mui/material"

export const Overlay = (props: BoxProps) => {
  return (
    <Box
      {...props}
      sx={{
        height: "100%",
        width: "100%",
        backgroundImage:
          "radial-gradient(at top right, rgba(22, 38, 36, 0.48) 0%, rgba(22, 28, 36, 0.8) 49.865%, #161c24 100%)",
      }}
    />
  )
}
