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
    ],
  },
  {
    headline: "Contact Us",
    children: [
      { name: "support@ranklab.gg", href: "mailto:support@ranklab.gg" },
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
                  Ranklab
                </Typography>
                <Typography
                  component="p"
                  variant="body2"
                  sx={{
                    fontSize: 13,
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  Copyright © {currentYear} Ranklab Ltd.
                  <br />
                  All rights reserved.
                </Typography>
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
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}
