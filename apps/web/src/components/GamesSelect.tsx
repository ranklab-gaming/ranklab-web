import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  FormHelperText,
} from "@mui/material"
import { Game, PlayerGame } from "@ranklab/api"

interface Props {
  games: Game[]
  selectedGames: PlayerGame[]
  setGames: (games: PlayerGame[]) => void
  error: boolean
  helperText?: string
}

export function GamesSelect({
  games,
  selectedGames,
  setGames,
  error = false,
  helperText,
}: Props) {
  return (
    <FormControl>
      <Stack spacing={2}>
        {games.map((game) => (
          <Grid
            container
            key={game.id}
            sx={{
              border: 1,
              borderColor: error ? "error.main" : "divider",
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

        {helperText && (
          <FormHelperText sx={{ color: error ? "error.main" : undefined }}>
            {helperText}
          </FormHelperText>
        )}
      </Stack>
    </FormControl>
  )
}
