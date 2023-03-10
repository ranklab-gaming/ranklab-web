import { Avatar } from "@/components/Avatar"
import { IconButtonAnimate } from "@/components/IconButtonAnimate"
import { MenuPopover } from "@/components/MenuPopover"
import { useUser } from "@/hooks/useUser"
import { Box, Divider, MenuItem, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import NextLink from "next/link"
import { MouseEvent, useState } from "react"

export function DashboardLayoutAccountPopover() {
  const user = useUser()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget)
  }

  const handleClose = () => {
    setAnchor(null)
  }

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(anchor && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar />
      </IconButtonAnimate>
      <MenuPopover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            Logged in as
          </Typography>
          <Typography variant="subtitle2" noWrap>
            {user.email}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: "dashed" }} />
        <NextLink href="/api/auth/logout" passHref legacyBehavior>
          <MenuItem sx={{ m: 1 }}>Logout</MenuItem>
        </NextLink>
      </MenuPopover>
    </>
  )
}
