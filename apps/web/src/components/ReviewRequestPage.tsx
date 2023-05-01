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
} from "@mui/material"
import { Coach, Game } from "@ranklab/api"
import { uploadsCdnUrl } from "@/config"
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
  width: 128px;
  height: 128px;
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
        <Container maxWidth="md">
          <Stack spacing={2}>
            <Typography variant="h2" gutterBottom>
              <Stack direction="row" spacing={2} alignItems="center">
                <NextLink href="/">
                  <Logo sx={{ width: 48 }} />
                </NextLink>
                <Box>Ready to up your {game.name} game?</Box>
              </Stack>
            </Typography>
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
                    <Typography variant="h3" gutterBottom>
                      {coach.name}
                    </Typography>
                  </Stack>
                  <Typography variant="body1" gutterBottom>
                    <span dangerouslySetInnerHTML={{ __html: coach.bio }} />
                  </Typography>
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
                      Request a Review from {coach.name}
                    </Button>
                  </NextLink>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </Page>
  )
}
