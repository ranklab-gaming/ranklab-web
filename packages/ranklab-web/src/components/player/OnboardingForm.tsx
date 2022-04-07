import { FunctionComponent, useState } from "react"
import * as Yup from "yup"
import api from "src/api"
import router from "next/router"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Alert,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { Game, UserGame } from "@ranklab/api"

interface Props {
  games: Game[]
}

export type FormValuesProps = {
  name: string
}

export const defaultValues = {
  name: "",
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  name: Yup.string().required("Name is required"),
})

const PlayerOnboardingForm: FunctionComponent<Props> = ({ games }) => {
  const [errorMessage, setErrorMessage] = useState("")
  const [formGames, setFormGames] = useState<UserGame[]>([])

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<FormValuesProps>({
    mode: "onTouched",
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await api.client.claimsPlayersCreate({
        createPlayerRequest: {
          name: data.name,
          games: formGames,
        },
      })

      router.push("/dashboard")
    } catch (e: any) {
      if (e instanceof Response) {
        if (e.status !== 200) {
          setErrorMessage(
            "There was a problem creating your profile. Please try again later."
          )
        }
      } else {
        throw e
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(errorMessage)}
        onClose={() => setErrorMessage("")}
        autoHideDuration={5000}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Stack spacing={3}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Name"
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />

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
                        setFormGames(
                          formGames.filter((g) => g.gameId !== game.id)
                        )
                      } else {
                        setFormGames([
                          ...formGames.filter((g) => g.gameId !== game.id),
                          { gameId: game.id, skillLevel: parseInt(value, 10) },
                        ])
                      }
                    }}
                  >
                    <FormControlLabel
                      value={""}
                      control={<Radio />}
                      label="Not Played"
                      key="not-played"
                      checked={!formGames.find((g) => g.gameId === game.id)}
                    />

                    {game.skillLevels.map((skillLevel) => (
                      <FormControlLabel
                        value={skillLevel.value}
                        control={<Radio />}
                        label={skillLevel.name}
                        key={skillLevel.value}
                        checked={
                          !!formGames.find(
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

        <LoadingButton
          fullWidth
          color="info"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!isDirty}
        >
          Create Profile
        </LoadingButton>
      </Stack>
    </form>
  )
}

export default PlayerOnboardingForm
