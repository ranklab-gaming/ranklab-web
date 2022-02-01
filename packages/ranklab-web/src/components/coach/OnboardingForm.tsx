import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Alert,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
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
  availableCountries: string[]
}

export type FormValuesProps = {
  bio: string
  gameId: string
  skillLevel: number
  name: string
  country: string
}

export const defaultValues = {
  bio: "",
  gameId: "",
  skillLevel: 0,
  name: "",
  country: "US",
}

export const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  bio: Yup.string().required("Bio is required"),
  gameId: Yup.string().required("Game is required"),
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
          games: [{ gameId: data.gameId, skillLevel: data.skillLevel }],
          country: data.country,
        },
      })

      router.push("/api/refresh-account-link")
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

  const minSkillLevelIndex = games[0]?.skillLevels
    .map((sl) => sl.value)
    .indexOf(games[0]?.minCoachSkillLevel.value)

  const skillLevels = games[0]?.skillLevels.slice(minSkillLevelIndex)

  const countries = availableCountries
    .map((country) => ({
      value: country,
      label: regionNamesInEnglish.of(country),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

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
          name="gameId"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Games
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={field.value}
                onBlur={field.onBlur}
                onChange={field.onChange}
              >
                {games.map((game) => (
                  <FormControlLabel
                    key={game.id}
                    value={game.id}
                    control={<Radio />}
                    label={game.name}
                  />
                ))}
              </RadioGroup>
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
                {skillLevels?.map((skillLevel) => (
                  <FormControlLabel
                    key={skillLevel.value}
                    value={skillLevel.value}
                    control={<Radio />}
                    label={skillLevel.name}
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

export default CoachOnboardingForm
