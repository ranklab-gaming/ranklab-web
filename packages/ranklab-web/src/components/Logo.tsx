import React from "react"
// material
import { useTheme } from "@mui/material/styles"
import { Box, BoxProps } from "@mui/material"
import Iconify from "src/components/Iconify"

// ----------------------------------------------------------------------

const Logo = React.forwardRef<any, BoxProps>(({ sx }, ref) => {
  const theme = useTheme()
  const PRIMARY_MAIN = theme.palette.primary.main

  return (
    <Box ref={ref} sx={{ cursor: "pointer", ...sx }}>
      <Iconify icon="mdi:flask-outline" color={PRIMARY_MAIN} fontSize="40px" />
    </Box>
  )
})

export default Logo
