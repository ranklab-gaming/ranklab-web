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
  ref,
) {
  return (
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
        <MenuItem key={game.id} value={game.id}>
          <Stack direction="row" alignItems="center" p={1}>
            <ListItemAvatar>
              <GameIcon
                game={game}
                width={24}
                height={24}
                sx={{
                  svg: { width: "100%", height: "100%" },
                  "svg *": {
                    stopColor: "#fff !important",
                    fill: "#fff !important",
                  },
                }}
              />
            </ListItemAvatar>
            <ListItemText primary={game.name} />
          </Stack>
        </MenuItem>
      ))}
    </TextField>
  )
})

GameSelect.displayName = "GameSelect"
