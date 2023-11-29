import { PropsWithOptionalUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Game } from "@ranklab/api"
import {
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material"
import { GameIcon } from "./GameIcon"
import NextLink from "next/link"
import { useEffect, useState } from "react"
import { FollowGameButton } from "./FollowGameButton"
import { assetsCdnUrl } from "@/config"

interface Props {
  games: Game[]
}

export const DirectoryPage = ({
  games: initialGames,
  user,
}: PropsWithOptionalUser<Props>) => {
  const [games, setGames] = useState(initialGames)

  useEffect(() => {
    setGames(initialGames)
  }, [initialGames])

  return (
    <DashboardLayout user={user} title="Directory" games={games}>
      <Grid container spacing={2}>
        {games.map((game) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={game.id}>
              <Card
                aria-label={game.name}
                sx={{
                  height: 300,
                  position: "relative",
                  "&:hover::before": {
                    filter: "brightness(1)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                    zIndex: -1,
                    backgroundImage: `url('${assetsCdnUrl}/images/games/${game.id}-stock.webp')`,
                    backgroundSize: "cover",
                    transition: "filter 0.5s",
                    filter: "brightness(0.3)",
                    "&:hover": {},
                  },
                }}
              >
                <NextLink
                  href={`/directory/${game.id}`}
                  passHref
                  legacyBehavior
                >
                  <CardActionArea
                    sx={{
                      height: "100%",
                      width: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  >
                    <CardContent sx={{ height: "100%" }}>
                      <Stack
                        spacing={2}
                        alignItems="center"
                        height="100%"
                        justifyContent="center"
                      >
                        <GameIcon
                          game={game}
                          width={64}
                          height={64}
                          sx={{
                            svg: {
                              width: "100%",
                              height: "100%",
                              objectFit: "scale-down",
                            },
                          }}
                        />
                        <Typography
                          variant="h2"
                          sx={{
                            textShadow: "4px 0 4px rgba(0,0,0,0.8)",
                          }}
                        >
                          {game.name}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                {user ? (
                  <CardActions sx={{ position: "absolute", top: 0, right: 0 }}>
                    <FollowGameButton
                      game={game}
                      onChange={(game) => {
                        setGames((games) => {
                          return games.map((g) => (g.id === game.id ? game : g))
                        })
                      }}
                    />
                  </CardActions>
                ) : null}
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </DashboardLayout>
  )
}
