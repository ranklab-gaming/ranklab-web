import NextLink from "next/link"
import { styled } from "@mui/material/styles"
import { Box, Link, Typography } from "@mui/material"
import { DashboardLayoutAvatar } from "./Avatar"
import useUser from "@/hooks/useUser"

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shorter,
  }),
}))

export default function NavbarAccount() {
  const user = useUser()

  return (
    <NextLink href={`/${user.type}/account`} passHref legacyBehavior>
      <Link underline="none" color="inherit">
        <RootStyle>
          <DashboardLayoutAvatar />
          <Box
            sx={{
              ml: 2,
              transition: (theme) =>
                theme.transitions.create("width", {
                  duration: theme.transitions.duration.shorter,
                }),
            }}
          >
            <Typography variant="subtitle2" noWrap>
              {user.name}
            </Typography>
          </Box>
        </RootStyle>
      </Link>
    </NextLink>
  )
}
