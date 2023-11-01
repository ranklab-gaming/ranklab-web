import { api } from "@/api"
import { Button, Typography } from "@mui/material"
import { Game } from "@ranklab/api"
import { Iconify } from "./Iconify"
import { useSnackbar } from "notistack"
import { useCallback } from "react"

interface Props {
  game: Game
  onChange: (response: Game) => void
}

export const FollowGameButton = ({ game, onChange }: Props) => {
  const { enqueueSnackbar } = useSnackbar()

  const toggleFollow = useCallback(async () => {
    try {
      const response = await api.gamesUpdate({
        id: game.id,
        updateGameRequest: {
          followed: !game.followed,
        },
      })

      onChange(response)
    } catch (error) {
      enqueueSnackbar("An error occurred while following this game.", {
        variant: "error",
      })

      throw error
    }
  }, [enqueueSnackbar, game.followed, game.id, onChange])

  return (
    <Button
      color={game.followed ? "primary" : "inherit"}
      onClick={toggleFollow}
      variant="contained"
    >
      <Iconify icon="mdi:bell" sx={{ width: 24, height: 24, mr: 1 }} />
      <Typography variant="subtitle1">
        {game.followed ? "Unfollow" : "Follow"}
      </Typography>
    </Button>
  )
}
