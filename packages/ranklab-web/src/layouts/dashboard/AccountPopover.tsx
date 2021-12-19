import { Icon } from "@iconify/react"
import { useRef, useState } from "react"
import personFill from "@iconify/icons-eva/person-fill"
// next
import NextLink from "next/link"
// material
import { alpha } from "@mui/material/styles"
import {
  Box,
  Avatar,
  Button,
  Divider,
  MenuItem,
  Typography,
} from "@mui/material"
// components
import MenuPopover from "../../components/MenuPopover"
import { MIconButton } from "../../components/@material-extend"
import { useUser } from "@auth0/nextjs-auth0"

// ----------------------------------------------------------------------

const MENU_OPTIONS = [{ label: "Profile", icon: personFill, linkTo: "#" }]

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null)

  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const { user } = useUser()

  if (!user) return null

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            },
          }),
        }}
      >
        <Avatar
          alt={user.name!}
          src={
            user && user.picture
              ? user.picture
              : "/static/mock-images/avatars/avatar_default.jpg"
          }
          className="avatar"
        />
      </MIconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <NextLink key={option.label} href={option.linkTo}>
            <MenuItem
              onClick={handleClose}
              sx={{ typography: "body2", py: 1, px: 2.5 }}
            >
              <Box
                component={Icon}
                icon={option.icon}
                sx={{
                  mr: 2,
                  width: 24,
                  height: 24,
                }}
              />

              {option.label}
            </MenuItem>
          </NextLink>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <NextLink href="/api/auth/logout">
            <Button fullWidth color="inherit" variant="outlined">
              Logout
            </Button>
          </NextLink>
        </Box>
      </MenuPopover>
    </>
  )
}
