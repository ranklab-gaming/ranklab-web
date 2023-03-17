import { GameIcon } from "@/components/GameIcon"
import {
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material"
import { Game } from "@ranklab/api"
import { ChangeEventHandler, forwardRef } from "react"

interface Props {
  games: Game[]
  onChange: ChangeEventHandler
  value: string
  onBlur: () => void
  error: boolean
  helperText?: string
}

export const GamesSelect = forwardRef<HTMLDivElement, Props>(function (
  { games, onChange, value, onBlur, error, helperText }: Props,
  ref
) {
  return (
    <Stack spacing={1}>
      <TextField
        select
        label="Game"
        onChange={onChange}
        value={value}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        ref={ref}
      >
        {games.map((game) => (
          <MenuItem key={game.id} value={game.id}>
            <Stack direction="row" alignItems="center">
              <ListItemAvatar>
                <GameIcon game={game} />
              </ListItemAvatar>
              <ListItemText primary={game.name} />
            </Stack>
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  )
})
