import React from "react"
// material
import { Box, BoxProps } from "@mui/material"
import LogoImage from "../assets/logo"

// ----------------------------------------------------------------------

const Logo = React.forwardRef<any, BoxProps>(({ sx }, ref) => {
  return (
    <Box ref={ref} sx={{ cursor: "pointer", width: "40px", ...sx }}>
      <LogoImage />
    </Box>
  )
})

export default Logo
