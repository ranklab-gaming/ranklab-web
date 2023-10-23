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
  IconButton,
  Tooltip,
} from "@mui/material"
import { GameIcon } from "./GameIcon"
import Link from "next/link"
import overwatchStock from "@/images/games/overwatch-stock.jpg"
import apexStock from "@/images/games/apex-stock.png"
import { StaticImageData } from "next/image"
import NextImage from "next/image"
import { Iconify } from "./Iconify"
import { useEffect, useState } from "react"
import { api } from "@/api"
import { useSnackbar } from "notistack"

interface Props {
  games: Game[]
}

const stockImages: Record<string, StaticImageData> = {
  overwatch: overwatchStock,
  apex: apexStock,
}

export const DirectoryPage = ({
  games: initialGames,
  user,
}: PropsWithOptionalUser<Props>) => {
  const [games, setGames] = useState(initialGames)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    setGames(initialGames)
  }, [initialGames])

  const toggleFollow = async (game: Game) => {
    try {
      const response = await api.gamesUpdate({
        id: game.id,
        updateGameRequest: {
          followed: !game.followed,
        },
      })

      setGames((games) => {
        return games.map((g) => (g.id === game.id ? response : g))
      })
    } catch (error) {
      enqueueSnackbar("An error occurred while following this game.", {
        variant: "error",
      })

      throw error
    }
  }

  return (
    <DashboardLayout user={user} title="Directory" games={games}>
      <Grid container spacing={2}>
        {games.map((game) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={game.id}>
              <Card
                sx={{
                  height: 300,
                  position: "relative",
                  img: {
                    transition: "filter 0.5s",
                    filter: "brightness(0.5)",
                  },
                  "&:hover": {
                    img: {
                      filter: "brightness(1)",
                    },
                  },
                }}
              >
                <NextImage
                  src={stockImages[game.id]}
                  alt={game.name}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Link href={`/directory/${game.id}`} passHref legacyBehavior>
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
                        <GameIcon game={game} width={64} height={64} />
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
                </Link>
                {user ? (
                  <CardActions sx={{ position: "absolute", top: 0, right: 0 }}>
                    <Tooltip title={game.followed ? "Unfollow" : "Follow"}>
                      <IconButton
                        color={game.followed ? "primary" : "default"}
                        onClick={() => toggleFollow(game)}
                        disabled={!user}
                      >
                        <Iconify icon="mdi:bell" />
                      </IconButton>
                    </Tooltip>
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
