import overwatch from "@/images/games/overwatch.svg"
import valorant from "@/images/games/valorant.svg"
import {
  Avatar,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material"
import { Game } from "@ranklab/api"
import { ChangeEventHandler } from "react"

interface Props {
  games: Game[]
  onChange: ChangeEventHandler
  value: string
  onBlur: () => void
  error: boolean
  helperText?: string
}

const logos = {
  overwatch,
  valorant,
}

export function GamesSelect({
  games,
  onChange,
  value,
  onBlur,
  error,
  helperText,
}: Props) {
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
      >
        {games.map((game) => (
          <MenuItem key={game.id} value={game.id}>
            <Stack direction="row" alignItems="center">
              <ListItemAvatar>
                <Avatar
                  alt={game.name}
                  src={logos[game.id as keyof typeof logos].src}
                />
              </ListItemAvatar>
              <ListItemText primary={game.name} />
            </Stack>
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  )
}
