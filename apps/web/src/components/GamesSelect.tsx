import {
  Stack,
  Typography,
  FormHelperText,
  Paper,
  Button,
  Box,
  MenuItem,
  TextField,
} from "@mui/material"
import { Game, PlayerGame } from "@ranklab/api"
import { MenuPopover } from "@/components/MenuPopover"
import { useRef, useState } from "react"
import { breakpoints } from "@/theme/breakpoints"
import { IconButtonAnimate } from "./IconButtonAnimate"
import { Iconify } from "./Iconify"

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
  error,
  helperText = "Select games you play to get started",
}: Props) {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const availableGames = games.filter(
    (game) => !selectedGames.map((game) => game.gameId).includes(game.id)
  )

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          py: 1,
          px: 2,
          border: error ? "1px solid" : undefined,
          borderColor: error ? "error.main" : undefined,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Typography
            variant="subtitle1"
            color={error ? "error.main" : undefined}
          >
            Games
          </Typography>
          <Button
            variant="text"
            color="primary"
            sx={{ ml: "auto" }}
            onClick={() => setIsMenuOpen(true)}
            ref={anchorRef}
            disabled={availableGames.length === 0}
          >
            + Add a game
          </Button>
          <MenuPopover
            open={isMenuOpen}
            anchorEl={anchorRef.current}
            onClose={() => setIsMenuOpen(false)}
            disabledArrow={true}
            sx={{
              p: 0,
              mt: 1.5,
              ml: 0.75,
              width: breakpoints.values.sm - 64,
              "& .MuiMenuItem-root": {
                typography: "body2",
                borderRadius: 0.75,
              },
            }}
          >
            <Stack sx={{ p: 1 }}>
              {availableGames.map((game) => (
                <MenuItem
                  key={game.id}
                  onClick={() => {
                    setGames([
                      ...selectedGames,
                      { gameId: game.id, skillLevel: 0 },
                    ])
                    setIsMenuOpen(false)
                  }}
                >
                  {game.name}
                </MenuItem>
              ))}
            </Stack>
          </MenuPopover>
        </Stack>
        {helperText && (
          <FormHelperText
            sx={{ color: error ? "error.main" : undefined, mt: 0, mb: 1 }}
          >
            {helperText}
          </FormHelperText>
        )}
      </Paper>
      {selectedGames.map((selectedGame) => {
        const game = games.find((g) => g.id === selectedGame.gameId)

        if (!game) {
          return null
        }

        return (
          <Paper elevation={4} sx={{ mt: 2 }} key={game.id}>
            <Box p={2}>
              <Stack key={game.id} direction="row" alignItems="center">
                <Typography variant="subtitle2" width={150} mr="auto">
                  {game.name}
                </Typography>
                <IconButtonAnimate
                  size="small"
                  onClick={() =>
                    setGames(selectedGames.filter((g) => g.gameId !== game.id))
                  }
                  sx={{ p: 0.5 }}
                >
                  <Iconify icon={"eva:close-fill"} />
                </IconButtonAnimate>
              </Stack>
              <TextField
                select
                SelectProps={{ native: true }}
                label="Skill Level"
                size="small"
                sx={{ width: "100%", mt: 2 }}
              >
                {game.skillLevels.map((skillLevel) => (
                  <option key={skillLevel.value} value={skillLevel.value}>
                    {skillLevel.name}
                  </option>
                ))}
              </TextField>
            </Box>
          </Paper>
        )
      })}
    </Box>
  )
}
