import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField } from "@mui/material"
import { Game } from "@ranklab/api"
import failsafeSubmit from "@ranklab/web/utils/failsafeSubmit"
import router from "next/router"
import { useSnackbar } from "notistack"
import { FunctionComponent } from "react"
import { Controller, useForm } from "react-hook-form"
import api from "src/api"
import * as Yup from "yup"
import GamesSelect from "./GamesSelect"

interface Props {
  games: Game[]
  availableCountries: string[]
}

export type FormValuesProps = {
  bio: string
  gameIds: string[]
  name: string
  country: string
}

export const defaultValues = {
  bio: "",
  gameIds: [],
  name: "",
  country: "US",
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  bio: Yup.string()
    .required("Bio is required")
    .min(30, "Bio must be at least 30 characters"),
  gameIds: Yup.array()
    .of(Yup.string().required())
    .min(1, "You must select at least one game"),
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  country: Yup.string().required("Country is required"),
})

const CoachOnboardingForm: FunctionComponent<Props> = ({
  games,
  availableCountries,
}) => {
  const regionNamesInEnglish = new Intl.DisplayNames(["en"], { type: "region" })

  const gameFromId = (gameId: string) => {
    return games.find((g) => g.id === gameId)!
  }

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

  const createAndRedirectToDashboard = async (data: FormValuesProps) => {
    const coach = await failsafeSubmit(
      setError,
      () =>
        enqueueSnackbar(
          "There was a problem creating your profile. Please try again later.",
          { variant: "error" }
        ),
      api.client.claimsCoachesCreate({
        createCoachRequest: {
          name: data.name,
          bio: data.bio,
          gameIds: data.gameIds,
          country: data.country,
        },
      })
    )

    if (coach) {
      router.push("/coach/dashboard")
    }
  }

  const countries = availableCountries
    .map((country) => ({
      value: country,
      label: regionNamesInEnglish.of(country),
    }))
    .sort((a, b) => (a.label && b.label ? a.label.localeCompare(b.label) : 0))

  return (
    <form onSubmit={handleSubmit(createAndRedirectToDashboard)}>
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
          name="country"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              select
              SelectProps={{ native: true }}
              error={Boolean(error)}
              helperText={error?.message}
              label="Country"
            >
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="gameIds"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <GamesSelect
              games={games}
              selectedGames={field.value.map(gameFromId)}
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

export default CoachOnboardingForm
