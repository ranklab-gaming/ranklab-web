import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Alert, Snackbar, Stack, TextField } from "@mui/material"
import { Game, UserGame } from "@ranklab/api"
import { capitalize } from "lodash"
import router from "next/router"
import { FunctionComponent, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import api from "src/api"
import * as Yup from "yup"
import GamesSelect from "../GamesSelect"

interface Props {
  games: Game[]
  availableCountries: string[]
}

export type FormValuesProps = {
  bio: string
  games: UserGame[]
  skillLevel: number
  name: string
  country: string
}

export const defaultValues = {
  bio: "",
  games: [],
  skillLevel: 0,
  name: "",
  country: "US",
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  bio: Yup.string().required("Bio is required"),
  games: Yup.array()
    .of(
      Yup.object().shape({
        gameId: Yup.string().required(),
        skillLevel: Yup.number().required(),
      })
    )
    .min(1, "At least one game is required"),
  skillLevel: Yup.number().required("Skill level is required"),
  name: Yup.string().required("Name is required"),
  country: Yup.string().required("Country is required"),
})

const CoachOnboardingForm: FunctionComponent<Props> = ({
  games,
  availableCountries,
}) => {
  const [errorMessage, setErrorMessage] = useState("")

  const regionNamesInEnglish = new Intl.DisplayNames(["en"], { type: "region" })

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

  const createCoach = async (data: FormValuesProps) => {
    try {
      await api.client.claimsCoachesCreate({
        createCoachRequest: {
          name: data.name,
          bio: data.bio,
          games: data.games,
          country: data.country,
        },
      })
    } catch (e: any) {
      if (e instanceof Response && e.status >= 500) {
        setErrorMessage(
          "There was a problem creating your profile. Please try again later."
        )
      }

      throw e
    }
  }

  const errorMessageFromError = (field: string, error: any) => {
    switch (error.code) {
      case "length":
        return `${capitalize(field)} must be at least ${
          error.params.min
        } characters long`
    }

    return `${capitalize(field)} is invalid`
  }

  const createAndRedirectToDashboard = async (data: FormValuesProps) => {
    try {
      await createCoach(data)
      router.push("/coach/dashboard")
    } catch (e: any) {
      if (e instanceof Response && e.status === 422) {
        const errors = await e.json()

        Object.entries(errors).forEach(([field, error]: any) => {
          setError(field, {
            type: "server",
            message: error
              .map((e: any) => errorMessageFromError(field, e))
              .join(", "),
          })
        })

        return
      }

      throw e
    }
  }

  const coachGames = games.map((game) => {
    const minSkillLevelIndex = game.skillLevels
      .map((sl) => sl.value)
      .indexOf(game.minCoachSkillLevel.value)

    return {
      ...game,
      skillLevels: game.skillLevels.slice(minSkillLevelIndex),
    }
  })

  const countries = availableCountries
    .map((country) => ({
      value: country,
      label: regionNamesInEnglish.of(country),
    }))
    .sort((a, b) => (a.label && b.label ? a.label.localeCompare(b.label) : 0))

  return (
    <form onSubmit={handleSubmit(createAndRedirectToDashboard)}>
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
          name="games"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <GamesSelect
              games={coachGames}
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

export default CoachOnboardingForm
