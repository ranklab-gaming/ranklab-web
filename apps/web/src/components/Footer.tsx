import { Logo } from "@/components/Logo"
import {
  Container,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import NextLink from "next/link"

const links = [
  {
    headline: "Ranklab Ltd",
    children: [
      { name: "About us", href: "/" },
      { name: "Contact us", href: "/" },
      { name: "FAQs", href: "/" },
    ],
  },
  {
    headline: "Legal",
    children: [
      { name: "Terms and Conditions", href: "/terms-and-conditions" },
      { name: "Privacy Policy", href: "/" },
    ],
  },
  {
    headline: "Contact",
    children: [{ name: "support@ranklab.gg", href: "/" }],
  },
]

const RootStyle = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

export function Footer() {
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
            <Logo sx={{ width: "20px", mx: { xs: "auto", md: "inherit" } }} />
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
            >
              {links.map((list, index) => (
                <Stack key={index} spacing={2}>
                  <Typography component="p" variant="overline">
                    {list.headline}
                  </Typography>
                  {list.children.map((link, index) => (
                    <NextLink
                      key={index}
                      href={link.href}
                      passHref
                      legacyBehavior
                    >
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
