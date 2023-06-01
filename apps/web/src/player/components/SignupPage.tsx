import { api } from "@/api"
import {
  AccountFields,
  AccountFieldsSchema,
  AccountFieldsSchemaWithoutPassword,
  AccountFieldsValues,
} from "./AccountFields"
import { useForm } from "@/hooks/useForm"
import { useLogin } from "@/hooks/useLogin"
import { yupResolver } from "@hookform/resolvers/yup"
import { Game } from "@ranklab/api"
import * as yup from "yup"
import { SignupPage } from "@/components/SignupPage"
import { useGameDependency } from "@/hooks/useGameDependency"
import { track } from "@/analytics"
import { decode } from "jsonwebtoken"

interface Props {
  games: Game[]
  token?: string
}

export const PlayerSignupPage = ({ games, token }: Props) => {
  const login = useLogin()
  const jwt = token ? decode(token) : null
  const jwtPayload = typeof jwt === "string" ? null : jwt

  const defaultValues: AccountFieldsValues = {
    gameId: "",
    name: jwtPayload?.name ?? "",
    email: jwtPayload?.sub ?? "",
    password: "",
    skillLevel: 0,
  }

  const form = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(
      jwtPayload ? AccountFieldsSchemaWithoutPassword : AccountFieldsSchema
    ),
    defaultValues,
  })

  const { control, watch } = form

  const gameIdFormValue = watch("gameId")

  const reviewDemoKey = useGameDependency(
    "text:player-review-demo-key",
    gameIdFormValue
  )

  const createPlayer = async (data: AccountFieldsValues) => {
    const session = await api.playerAccountCreate({
      createPlayerRequest: {
        name: data.name,
        gameId: data.gameId,
        credentials: token
          ? {
              token: {
                token,
              },
            }
          : {
              password: {
                email: data.email,
                password: data.password,
              },
            },
        skillLevel: data.skillLevel,
      },
    })

    track("Player signup")

    await login(session.token)
  }

  return (
    <SignupPage
      title="Sign up to Ranklab"
      form={form}
      onSubmit={createPlayer}
      reviewDemoKey={reviewDemoKey}
      reviewDemoTitle="How does it work?"
      reviewDemoSubheader="This is a short video to help you get started with Ranklab"
    >
      <AccountFields
        control={control}
        games={games}
        watch={watch}
        showPasswordField={!jwtPayload}
      />
    </SignupPage>
  )
}
