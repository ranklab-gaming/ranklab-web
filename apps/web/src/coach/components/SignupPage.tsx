import { api } from "@/api"
import { AccountFields, AccountFieldsSchema } from "./AccountFields"
import { useForm } from "@/hooks/useForm"
import { useLogin } from "@/hooks/useLogin"
import { yupResolver } from "@hookform/resolvers/yup"
import { MenuItem, TextField } from "@mui/material"
import { Game } from "@ranklab/api"
import * as yup from "yup"
import { Controller } from "react-hook-form"
import { SignupPage } from "@/components/SignupPage"
import { useGameDependency } from "@/hooks/useGameDependency"

interface Props {
  games: Game[]
  availableCountries: string[]
  gameId: string | null
}

const FormSchema = AccountFieldsSchema.concat(
  yup.object().shape({
    country: yup.string().required("Country is required"),
  })
)

type FormValues = yup.InferType<typeof FormSchema>

export const CoachSignupPage = ({
  games,
  availableCountries,
  gameId,
}: Props) => {
  const regionNamesInEnglish = new Intl.DisplayNames(["en"], { type: "region" })
  const login = useLogin()

  const defaultValues: FormValues = {
    bio: "",
    gameId: gameId ?? "",
    name: "",
    country: "US",
    email: "",
    password: "",
    price: "10.00",
  }

  const form = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(FormSchema),
    defaultValues,
  })

  const { control, watch } = form
  const gameIdFormValue = watch("gameId")

  const reviewDemoKey = useGameDependency(
    "text:coach-review-demo-key",
    gameIdFormValue
  )

  const createCoach = async (data: FormValues) => {
    const session = await api.coachAccountCreate({
      createCoachRequest: {
        name: data.name,
        bio: data.bio,
        gameId: data.gameId,
        country: data.country,
        email: data.email,
        password: data.password,
        price: Number(data.price) * 100,
      },
    })

    await login(session.token)
  }

  const countries = availableCountries
    .map((country) => ({
      value: country,
      label: regionNamesInEnglish.of(country),
    }))
    .sort((a, b) => (a.label && b.label ? a.label.localeCompare(b.label) : 0))

  return (
    <SignupPage
      title="Sign up to Ranklab as a Coach"
      form={form}
      onSubmit={createCoach}
      reviewDemoKey={reviewDemoKey}
      reviewDemoTitle="Quick Start Guide"
      reviewDemoSubheader="This is a short video to help you get started with Ranklab as a coach"
    >
      <AccountFields control={control} games={games} showPasswordField />
      <Controller
        name="country"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            select
            error={Boolean(error)}
            helperText={error ? error.message : "The country you live in"}
            label="Country"
          >
            {countries.map((country) => (
              <MenuItem key={country.value} value={country.value}>
                {country.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </SignupPage>
  )
}
