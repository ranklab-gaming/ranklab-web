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
} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { Game } from "@ranklab/api"
import FlipCard from "../FlipCard"

interface Props {
  games: Game[]
}

export type FormValuesProps = {
  name: string
  gameId: string
  skillLevel: number
}

export const defaultValues = {
  name: "",
  gameId: "",
  skillLevel: 0,
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  gameId: Yup.string().required("Game is required"),
  skillLevel: Yup.number().required("Skill level is required"),
})

const PlayerOnboardingForm: FunctionComponent<Props> = ({ games }) => {
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedGameIndex, setSelectedGameIndex] = useState<number | null>(
    null
  )

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
          games: [{ gameId: data.gameId, skillLevel: data.skillLevel }],
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

        <Controller
          name="gameId"
          control={control}
          render={() => (
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Games
              </FormLabel>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{ pt: 1 }}
              >
                {games.map((game, index) => (
                  <Grid key={game.id} item xs={3}>
                    <FlipCard
                      frontText={game.name}
                      backText="Hello"
                      index={index}
                      selectedIndex={selectedGameIndex}
                      onClickFront={() => setSelectedGameIndex(index)}
                      onClickBack={() => setSelectedGameIndex(null)}
                    />
                  </Grid>
                ))}

                <Grid item xs={3}></Grid>
              </Grid>
            </FormControl>
          )}
        />

        <Controller
          name="skillLevel"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Skill Level
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={field.value}
                onBlur={field.onBlur}
                onChange={field.onChange}
              >
                {games[0]?.skillLevels.map((skillLevel) => (
                  <FormControlLabel
                    value={skillLevel.value}
                    control={<Radio />}
                    label={skillLevel.name}
                    key={skillLevel.value}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
        />
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
