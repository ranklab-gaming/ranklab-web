// next
import NextLink from "next/link"
// @mui
import { styled } from "@mui/material/styles"
import {
  Grid,
  Link,
  Divider,
  Container,
  Typography,
  Stack,
} from "@mui/material"
// components
import Logo from "../../components/Logo"

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: "Minimal",
    children: [
      { name: "About us", href: "#" },
      { name: "Contact us", href: "#" },
      { name: "FAQs", href: "#" },
    ],
  },
  {
    headline: "Legal",
    children: [
      { name: "Terms and Condition", href: "#" },
      { name: "Privacy Policy", href: "#" },
    ],
  },
  {
    headline: "Contact",
    children: [
      { name: "support@minimals.cc", href: "#" },
      { name: "Los Angeles, 359  Hidden Valley Road", href: "#" },
    ],
  },
]

const RootStyle = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

// ----------------------------------------------------------------------

export default function MainFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <RootStyle>
      <Divider />
      <Container sx={{ pt: 10 }}>
        <Grid
          container
          justifyContent={{ xs: "center", md: "space-between" }}
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Logo sx={{ mx: { xs: "auto", md: "inherit" } }} />
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
            >
              {LINKS.map((list) => (
                <Stack key={list.headline} spacing={2}>
                  <Typography component="p" variant="overline">
                    {list.headline}
                  </Typography>
                  {list.children.map((link) => (
                    <NextLink key={link.name} href={link.href} passHref>
                      <Link
                        color="inherit"
                        variant="body2"
                        sx={{ display: "block" }}
                      >
                        {link.name}
                      </Link>
                    </NextLink>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography
          component="p"
          variant="body2"
          sx={{
            mt: 10,
            pb: 5,
            fontSize: 13,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Copyright © {currentYear} Ranklab Ltd.
          <br />
          All rights reserved.
        </Typography>
      </Container>
    </RootStyle>
  )
}
