import { Icon, IconifyIcon } from "@iconify/react"
import { Box, BoxProps, SxProps } from "@mui/material"
import { forwardRef } from "react"

interface Props extends BoxProps {
  sx?: SxProps
  icon: IconifyIcon | string
}

export const Iconify = forwardRef(({ icon, sx, ...other }: Props, ref) => {
  return (
    <Box component={Icon} icon={icon} sx={{ ...sx }} ref={ref} {...other} />
  )
})

Iconify.displayName = "Iconify"
