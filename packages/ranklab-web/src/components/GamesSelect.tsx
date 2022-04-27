import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material"
import { Game, UserGame } from "@ranklab/api"

interface GamesSelectProps {
  games: Game[]
  selectedGames: UserGame[]
  setGames: (games: UserGame[]) => void
}

function GamesSelect({ games, selectedGames, setGames }: GamesSelectProps) {
  return (
    <FormControl>
      <FormLabel
        sx={{
          marginBottom: 3,
        }}
      >
        Games
      </FormLabel>
      <Stack spacing={2}>
        {games.map((game) => (
          <Grid
            container
            key={game.id}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              padding: 3,
            }}
          >
            <Grid
              item
              xs={12}
              md={2}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">{game.name}</Typography>
            </Grid>
            <Grid item xs={12} md={10}>
              <RadioGroup
                row
                aria-labelledby="game-radio-buttons-group-label"
                name="game-radio-buttons-group"
                onChange={(_event, value) => {
                  if (value === "") {
                    setGames(selectedGames.filter((g) => g.gameId !== game.id))
                  } else {
                    setGames([
                      ...selectedGames.filter((g) => g.gameId !== game.id),
                      {
                        gameId: game.id,
                        skillLevel: parseInt(value, 10),
                      },
                    ])
                  }
                }}
              >
                <FormControlLabel
                  value={""}
                  control={<Radio />}
                  label="Not Played"
                  key="not-played"
                  checked={!selectedGames.find((g) => g.gameId === game.id)}
                />

                {game.skillLevels.map((skillLevel) => (
                  <FormControlLabel
                    value={skillLevel.value}
                    control={<Radio />}
                    label={skillLevel.name}
                    key={skillLevel.value}
                    checked={
                      !!selectedGames.find(
                        (g) =>
                          g.gameId === game.id &&
                          g.skillLevel === skillLevel.value
                      )
                    }
                  />
                ))}
              </RadioGroup>
            </Grid>
          </Grid>
        ))}
      </Stack>
    </FormControl>
  )
}

export default GamesSelect
