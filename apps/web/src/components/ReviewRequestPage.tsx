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
} from "@mui/material"
import { Coach, Game } from "@ranklab/api"
import { assetsCdnUrl, uploadsCdnUrl } from "@/config"
import { Avatar } from "@/components/Avatar"
import { Page } from "@/components/Page"
import { Logo } from "@/components/Logo"
import { assertFind } from "@/assert"
import NextLink from "next/link"

interface Props {
  coach: Coach
  games: Game[]
}

const AvatarImage = styled("img")`
  display: block;
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
`

export const ReviewRequestPage = ({ coach, games }: Props) => {
  const game = assertFind(games, (game) => game.id === coach.gameId)
  const theme = useTheme()

  return (
    <Page title="Request a Review">
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
            <Typography variant="h2" gutterBottom>
              <Stack direction="row" spacing={2} alignItems="center">
                <NextLink href="/">
                  <Logo sx={{ width: 48 }} />
                </NextLink>
                <Box>Up your {game.name} game with Ranklab.</Box>
              </Stack>
            </Typography>
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
                        <Typography variant="h3" gutterBottom>
                          {coach.name}
                        </Typography>
                      </Stack>
                      <Typography variant="body1" gutterBottom>
                        <span dangerouslySetInnerHTML={{ __html: coach.bio }} />
                      </Typography>
                      <Box>
                        <NextLink
                          href={`/player/reviews/new?slug=${coach.slug}`}
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
                            Get Coached By {coach.name}
                          </Button>
                        </NextLink>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CardHeader
                      title="What is Ranklab?"
                      subheader="This is a short video to give an overview of the platform and how it works."
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
                          src={`${assetsCdnUrl}/coaches-review-tutorial.mp4`}
                          type="video/mp4"
                        />
                      </video>
                    </CardContent>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </Page>
  )
}
