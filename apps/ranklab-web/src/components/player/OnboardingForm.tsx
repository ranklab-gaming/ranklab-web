import { FunctionComponent } from "react"
import * as Yup from "yup"
import api from "src/api"
import router from "next/router"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Stack, TextField } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { Game, PlayerGame } from "@ranklab/api"
import GamesSelect from "./GamesSelect"
import { useSnackbar } from "notistack"
import failsafeSubmit from "@ranklab/web/utils/failsafeSubmit"

interface Props {
  games: Game[]
}

export type FormValuesProps = {
  name: string
  games: PlayerGame[]
  email: string
  password: string
}

export const defaultValues = {
  name: "",
  games: [],
  email: "",
  password: "",
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  games: Yup.array()
    .of(
      Yup.object().shape({
        gameId: Yup.string().required(),
        skillLevel: Yup.number().required(),
      })
    )
    .min(1, "At least one game is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const PlayerOnboardingForm: FunctionComponent<Props> = ({ games }) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = useForm<FormValuesProps>({
    mode: "onSubmit",
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const { enqueueSnackbar } = useSnackbar()

  const onSubmit = async (data: FormValuesProps) => {
    const player = await failsafeSubmit(
      setError,
      () =>
        enqueueSnackbar(
          "There was a problem creating your profile. Please try again later.",
          { variant: "error" }
        ),
      api.client.playerAccountCreate({
        createPlayerRequest: {
          name: data.name,
          games: data.games,
          email: data.email,
          password: data.password,
        },
      })
    )

    if (player) {
      router.push("/player/dashboard")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="games"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <GamesSelect
              games={games}
              selectedGames={field.value}
              setGames={field.onChange}
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />

        <LoadingButton
          fullWidth
          color="info"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Create Profile
        </LoadingButton>
      </Stack>
    </form>
  )
}

export default PlayerOnboardingForm
