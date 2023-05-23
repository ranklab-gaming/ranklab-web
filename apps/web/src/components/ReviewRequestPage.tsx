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
  Chip,
} from "@mui/material"
import { Coach, Game } from "@ranklab/api"
import { uploadsCdnUrl } from "@/config"
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
  host: string
}

export const AvatarImage = styled("img")`
  display: block;
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
`

export const ReviewRequestPage = ({ coach, games, host }: Props) => {
  const buttonText = useGameDependency(
    "text:request-review-button",
    coach.gameId
  )

  const theme = useTheme()
  const game = assertFind(games, (game) => game.id === coach.gameId)

  const description =
    coach.bioText.length > 160
      ? coach.bioText.slice(0, 160) + "..."
      : coach.bioText

  return (
    <Page title={coach.name}>
      {description ? (
        <Head>
          <meta name="og:description" content={description} />
          <meta
            name="og:image"
            content={`${uploadsCdnUrl}/${coach.avatarImageKey}`}
          />
          <meta name="og:image:alt" content={coach.name} />
          <meta name="og:title" content={coach.name} />
          <meta name="og:type" content="profile" />
          <meta name="og:url" content={`${host}/r/${coach.slug}`} />
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
        <Container maxWidth="md">
          <Stack spacing={2}>
            <Card sx={{ p: 2 }}>
              <CardContent>
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
