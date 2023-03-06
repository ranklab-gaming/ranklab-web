import { useState, MouseEvent } from "react"
import NextLink from "next/link"
import { alpha } from "@mui/material/styles"
import { Box, Divider, Typography, Stack, MenuItem } from "@mui/material"
import { DashboardLayoutAvatar } from "./Avatar"
import { MenuPopover } from "@/components/MenuPopover"
import { IconButtonAnimate } from "@/components/IconButtonAnimate"
import useUser from "@/hooks/useUser"

export function DashboardLayoutAccountPopover() {
  const user = useUser()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget)
  }

  const handleClose = () => {
    setAnchor(null)
  }

  const menuOptions = [
    {
      label: "Home",
      linkTo: "/",
    },
    {
      label: "Account",
      linkTo: `/${user.type}/account`,
    },
  ]

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
        <DashboardLayoutAvatar />
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
          <Typography variant="subtitle2" noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user.email}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: "dashed" }} />
        <Stack sx={{ p: 1 }}>
          {menuOptions.map((option) => (
            <NextLink
              key={option.label}
              href={option.linkTo}
              passHref
              legacyBehavior
            >
              <MenuItem key={option.label} onClick={handleClose}>
                {option.label}
              </MenuItem>
            </NextLink>
          ))}
        </Stack>
        <Divider sx={{ borderStyle: "dashed" }} />
        <NextLink href="/logout" passHref legacyBehavior>
          <MenuItem sx={{ m: 1 }}>Logout</MenuItem>
        </NextLink>
      </MenuPopover>
    </>
  )
}
