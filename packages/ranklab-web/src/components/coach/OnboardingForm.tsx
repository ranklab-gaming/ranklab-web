import { yupResolver } from "@hookform/resolvers/yup/dist/yup"
import { LoadingButton } from "@mui/lab"
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material"
import { Game } from "@ranklab/api"
import router from "next/router"
import { FunctionComponent, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import api from "src/api"
import * as Yup from "yup"

interface Props {
  games: Game[]
}

export type FormValuesProps = {
  bio: string
  gameId: string
  name: string
}

export const defaultValues = {
  bio: "",
  gameId: "",
  name: "",
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  bio: Yup.string().required("Bio is required"),
  gameId: Yup.string().required("Game is required"),
  name: Yup.string().required("Name is required"),
})

const CoachOnboardingForm: FunctionComponent<Props> = ({ games }) => {
  const [errorMessage, setErrorMessage] = useState("")

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
      await api.client.claimsCoachesCreate({
        createCoachRequest: {
          name: data.name,
          bio: data.bio,
          gameId: data.gameId,
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
          name="bio"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Bio"
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="gameId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel>Game</InputLabel>
              <Select
                label="Game"
                onChange={field.onChange}
                value={field.value}
                onBlur={field.onBlur}
                error={Boolean(error)}
              >
                <MenuItem value="">Select a Game</MenuItem>

                {games.map((game) => (
                  <MenuItem key={game.id} value={game.id}>
                    {game.name}
                  </MenuItem>
                ))}
              </Select>
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

export default CoachOnboardingForm
