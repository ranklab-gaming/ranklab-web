import { FormControl } from "@mui/material"
import { Game } from "@ranklab/api"
import MultiSelect from "../MultiSelect"

interface Props {
  games: Game[]
  selectedGames: Game[]
  setGames: (games: Game[]) => void
  error: boolean
  helperText?: string
}

function GamesSelect({
  games,
  selectedGames,
  setGames,
  error = false,
  helperText,
}: Props) {
  return (
    <FormControl>
      <MultiSelect
        options={games.map((game) => ({
          label: game.name,
          value: game.id,
        }))}
        value={selectedGames.map((game) => game.id)}
        onChange={(value) => {
          setGames(value.map((id) => games.find((game) => game.id === id)!))
        }}
        error={error}
        helperText={helperText}
      />
    </FormControl>
  )
}

export default GamesSelect
