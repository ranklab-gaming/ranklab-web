import { GameIcon } from "./GameIcon"
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
  helperText?: string | JSX.Element
  disabled?: boolean
}

export const GameSelect = forwardRef<HTMLDivElement, Props>(function (
  {
    games,
    onChange,
    value,
    onBlur,
    error,
    helperText,
    disabled = false,
    ...props
  }: Props,
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
        disabled={disabled}
        {...props}
      >
        {games.map((game) => (
          <MenuItem
            key={game.id}
            value={game.id}
            sx={game.id === "test" ? { display: "none" } : {}}
          >
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

GameSelect.displayName = "GameSelect"
