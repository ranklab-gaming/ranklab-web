import { useRef, useState } from "react"
import NextLink from "next/link"
import { alpha } from "@mui/material/styles"
import { Box, Divider, Typography, Stack, MenuItem } from "@mui/material"
import MyAvatar from "@ranklab/web/src/components/MyAvatar"
import MenuPopover from "@ranklab/web/src/components/MenuPopover"
import { IconButtonAnimate } from "@ranklab/web/src/components/animate"
import useSession from "@ranklab/web/hooks/useSession"

export default function AccountPopover() {
  const session = useSession()
  const logoutForm = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState<HTMLElement | null>(null)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(null)
  }

  const menuOptions = [
    {
      label: "Home",
      linkTo: "/",
    },
    {
      label: "Account",
      linkTo: `/${session.user.type.toLowerCase()}/account`,
    },
  ]

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
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
        <MyAvatar />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
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
            {session.user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {session.user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {menuOptions.map((option) => (
            <NextLink key={option.label} href={option.linkTo} passHref>
              <MenuItem key={option.label} onClick={handleClose}>
                {option.label}
              </MenuItem>
            </NextLink>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <form method="POST" action="/api/auth/logout" ref={logoutForm}>
          <MenuItem onClick={() => logoutForm.current?.submit()} sx={{ m: 1 }}>
            Logout
          </MenuItem>
        </form>
      </MenuPopover>
    </>
  )
}
