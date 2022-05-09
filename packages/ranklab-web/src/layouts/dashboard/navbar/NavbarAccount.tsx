// next
import NextLink from "next/link"
// @mui
import { styled } from "@mui/material/styles"
import { Box, Link, Typography } from "@mui/material"
// components
import MyAvatar from "../../../components/MyAvatar"
import { useUser } from "@auth0/nextjs-auth0"

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

type Props = {
  isCollapse: boolean | undefined
}

export default function NavbarAccount({ isCollapse }: Props) {
  const { user } = useUser()

  return (
    <NextLink href="/profile" passHref>
      <Link underline="none" color="inherit">
        <RootStyle
          sx={{
            ...(isCollapse && {
              bgcolor: "transparent",
            }),
          }}
        >
          <MyAvatar />

          <Box
            sx={{
              ml: 2,
              transition: (theme) =>
                theme.transitions.create("width", {
                  duration: theme.transitions.duration.shorter,
                }),
              ...(isCollapse && {
                ml: 0,
                width: 0,
              }),
            }}
          >
            <Typography variant="subtitle2" noWrap>
              {user?.name}
            </Typography>
          </Box>
        </RootStyle>
      </Link>
    </NextLink>
  )
}
