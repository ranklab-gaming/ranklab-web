import {
  Typography,
  Button,
  styled,
  Container,
  Box,
  useTheme,
  Stack,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Chip,
} from "@mui/material"
import { Coach, Game } from "@ranklab/api"
import { assetsCdnUrl, uploadsCdnUrl } from "@/config"
import { Avatar } from "@/components/Avatar"
import { Page } from "@/components/Page"
import { Logo } from "@/components/Logo"
import { assertFind } from "@/assert"
import NextLink from "next/link"
import { useGameDependency } from "@/hooks/useGameDependency"
import Head from "next/head"

interface Props {
  coach: Coach
  games: Game[]
}

export const AvatarImage = styled("img")`
  display: block;
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
`

export const ReviewRequestPage = ({ coach, games }: Props) => {
  const buttonText = useGameDependency(
    "text:request-review-button",
    coach.gameId
  )

  const reviewDemoKey = useGameDependency(
    "text:player-review-demo-key",
    coach.gameId
  )

  const theme = useTheme()
  const game = assertFind(games, (game) => game.id === coach.gameId)

  const textBio =
    new DOMParser()
      .parseFromString(coach.bio, "text/html")
      .textContent?.replace(/\n/g, " ")
      .trim() ?? ""

  const description =
    textBio.length > 160 ? textBio.slice(0, 160) + "..." : textBio

  return (
    <Page title={coach.name}>
      {description ? (
        <Head>
          <meta name="description" content={description} />
        </Head>
      ) : null}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="auto"
      >
        <Container maxWidth="lg">
          <Stack spacing={2}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={4}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        {coach.avatarImageKey ? (
                          <AvatarImage
                            src={`${uploadsCdnUrl}/${coach.avatarImageKey}`}
                            alt={coach.name}
                          />
                        ) : (
                          <Avatar
                            user={{ name: coach.name }}
                            sx={{ width: 48, height: 48 }}
                          />
                        )}
                        <Typography variant="h3">{coach.name}</Typography>
                        <Chip label={game.name} />
                      </Stack>
                      <Typography variant="body1" component="div">
                        <pre
                          style={{
                            fontFamily: "inherit",
                            whiteSpace: "pre-wrap",
                          }}
                          dangerouslySetInnerHTML={{ __html: coach.bio }}
                        />
                      </Typography>
                      <Box>
                        <NextLink
                          href={{
                            pathname: "/player/reviews/new",
                            query: { coach_id: coach.id },
                          }}
                          passHref
                          legacyBehavior
                        >
                          <Button
                            size="large"
                            variant="text"
                            sx={{
                              fontSize: 18,
                              p: 3,
                              color: "common.white",
                              transition: "all 0.25s",
                              backgroundImage: `linear-gradient( 136deg, ${theme.palette.primary.main} 0%, ${theme.palette.error.main} 50%, ${theme.palette.secondary.main} 100%)`,
                              boxShadow: "0 4px 12px 0 rgba(0,0,0,.35)",
                              "&:hover": {
                                filter: "brightness(1.3)",
                              },
                            }}
                          >
                            {buttonText}
                          </Button>
                        </NextLink>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CardHeader
                      title="What is Ranklab?"
                      subheader="In this video we give you an overview of the platform and how it works."
                    />
                    <CardContent>
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                        style={{
                          maxWidth: "100%",
                          objectFit: "cover",
                          borderRadius: theme.shape.borderRadius,
                        }}
                      >
                        <source
                          src={`${assetsCdnUrl}/${reviewDemoKey}`}
                          type="video/mp4"
                        />
                      </video>
                    </CardContent>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              pt={4}
            >
              <NextLink href="/">
                <Logo sx={{ width: 24 }} />
              </NextLink>
              <Typography variant="body2" color="textSecondary">
                Up your game with Ranklab.
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Page>
  )
}
