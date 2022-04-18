import { Link as ScrollLink } from "react-scroll"
// next
import NextLink from "next/link"
// material
import { styled } from "@mui/material/styles"
import {
  Grid,
  Link,
  Stack,
  Divider,
  Container,
  Typography,
  Box,
} from "@mui/material"
//
import Logo from "../../components/Logo"

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: "Ranklab",
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
      { name: "support@ranklab.gg", href: "#" },
      { name: "<Address>", href: "#" },
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
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid
          container
          justifyContent={{ xs: "center", md: "space-between" }}
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          <Grid item xs={8} md={3}>
            <Box
              sx={{
                textAlign: "center",
                position: "relative",
                bgcolor: "background.default",
              }}
            >
              <Container maxWidth="lg">
                <ScrollLink to="move_top" spy smooth>
                  <Logo sx={{ mb: 1, mx: "auto", cursor: "pointer" }} />
                </ScrollLink>

                <Typography variant="caption" component="p">
                  Copyright © {currentYear} Ranklab Ltd.
                  <br />
                  All rights reserved.
                </Typography>
              </Container>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
            >
              {LINKS.map((list) => {
                const { headline, children } = list
                return (
                  <Stack key={headline} spacing={2}>
                    <Typography component="p" variant="overline">
                      {headline}
                    </Typography>
                    {children.map((link) => (
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
                )
              })}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}
