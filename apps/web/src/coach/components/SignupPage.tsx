import { api } from "@/api"
import {
  AccountFields,
  AccountFieldsSchema,
  AccountFieldsSchemaWithoutPassword,
} from "./AccountFields"
import { useForm } from "@/hooks/useForm"
import { useLogin } from "@/hooks/useLogin"
import { yupResolver } from "@hookform/resolvers/yup"
import { MenuItem, TextField } from "@mui/material"
import { Game } from "@ranklab/api"
import * as yup from "yup"
import { Controller } from "react-hook-form"
import { SignupPage } from "@/components/SignupPage"
import { useGameDependency } from "@/hooks/useGameDependency"
import { track } from "@/analytics"
import { decode } from "jsonwebtoken"

interface Props {
  games: Game[]
  availableCountries: string[]
  gameId: string | null
  token?: string
}

const SignupSchema = yup.object().shape({
  country: yup.string().required("Country is required"),
})

const FormSchemaWithoutPassword =
  AccountFieldsSchemaWithoutPassword.concat(SignupSchema)

const FormSchema = AccountFieldsSchema.concat(SignupSchema)

type FormValues = yup.InferType<typeof FormSchema>

export const CoachSignupPage = ({
  games,
  availableCountries,
  gameId,
  token,
}: Props) => {
  const jwt = token ? decode(token) : null
  const jwtPayload = typeof jwt === "string" ? null : jwt
  const regionNamesInEnglish = new Intl.DisplayNames(["en"], { type: "region" })
  const login = useLogin()

  const defaultValues: FormValues = {
    bio: "",
    gameId: gameId ?? "",
    name: jwtPayload?.name ?? "",
    country: "US",
    email: jwtPayload?.sub ?? "",
    password: "",
    price: "10.00",
  }

  const form = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(
      jwtPayload ? FormSchemaWithoutPassword : FormSchema
    ),
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
        credentials: token
          ? {
              token: { token },
            }
          : {
              password: {
                password: data.password,
                email: data.email,
              },
            },
        price: Number(data.price) * 100,
      },
    })

    track("Coach signup")

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
      <AccountFields
        control={control}
        games={games}
        showPasswordField={!jwtPayload}
      />
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
