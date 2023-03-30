import { Box, BoxProps } from "@mui/material"

export const Overlay = (props: BoxProps) => {
  return (
    <Box
      {...props}
      sx={{
        height: "100%",
        width: "100%",
        backgroundImage:
          "linear-gradient(180deg, rgba(22, 28, 36, 0.48) 0%, rgba(22, 28, 36, 0.8) 50%, rgba(22, 28, 36, 1) 100%)",
      }}
    />
  )
}
