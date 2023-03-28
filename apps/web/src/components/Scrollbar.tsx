import { Box, BoxProps } from "@mui/material"
import { alpha, styled } from "@mui/material/styles"
import SimpleBarReact from "simplebar-react"

import "simplebar-react/dist/simplebar.min.css"

const RootStyle = styled("div")(() => ({
  flexGrow: 1,
  height: "100%",
  overflow: "hidden",
}))

const SimpleBarStyle = styled(SimpleBarReact)(({ theme }) => ({
  maxHeight: "100%",
  "& .simplebar-scrollbar": {
    "&:before": {
      backgroundColor: alpha(theme.palette.grey[600], 0.48),
    },
    "&.simplebar-visible:before": {
      opacity: 1,
    },
  },
  "& .simplebar-track.simplebar-vertical": {
    width: 10,
  },
  "& .simplebar-track.simplebar-horizontal .simplebar-scrollbar": {
    height: 6,
  },
  "& .simplebar-mask": {
    zIndex: "inherit",
  },
}))

export const Scrollbar = ({ children, sx }: BoxProps) => {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    )

  if (isMobile) {
    return <Box sx={{ overflowX: "auto", ...sx }}>{children}</Box>
  }

  return (
    <RootStyle>
      <SimpleBarStyle clickOnTrack={false} sx={sx}>
        {children}
      </SimpleBarStyle>
    </RootStyle>
  )
}
