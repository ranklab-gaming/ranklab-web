import {
  Box,
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
    headline: "Legal",
    children: [
      {
        name: "Terms and Conditions",
        href: "https://www.iubenda.com/terms-and-conditions/88772361",
      },
      {
        name: "Privacy Policy",
        href: "https://www.iubenda.com/privacy-policy/88772361",
      },
      {
        name: "Contact Us",
        href: "mailto:contact@ranklab.gg",
      },
    ],
  },
]

const RootStyle = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <RootStyle>
      <Divider />
      <Container sx={{ py: 10 }}>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
            >
              <Stack spacing={2}>
                <Typography component="p" variant="overline">
                  Socials
                </Typography>
                <Link
                  color="inherit"
                  variant="body2"
                  sx={{ display: "block" }}
                  href="https://twitter.com/ranklabgg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </Link>
              </Stack>
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

              <Stack spacing={2}>
                <Typography component="p" variant="overline">
                  Privacy
                </Typography>
                <Link
                  color="inherit"
                  variant="body2"
                  sx={{ display: "block", cursor: "pointer" }}
                  onClick={() => window._iub.cs.api.openPreferences()}
                >
                  Your Privacy Choices
                </Link>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Box mt={8}>
          <Typography
            component="p"
            variant="caption"
            color="text.secondary"
            sx={{
              textAlign: "center",
            }}
          >
            Copyright © {currentYear} Ranklab Gaming Ltd.
            <br />
            All rights reserved.
          </Typography>
        </Box>
      </Container>
    </RootStyle>
  )
}
