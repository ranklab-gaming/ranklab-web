import { api } from "@/api"
import { AccountFields, AccountFieldsSchema } from "./AccountFields"
import { useForm } from "@/hooks/useForm"
import { useLogin } from "@/hooks/useLogin"
import { yupResolver } from "@hookform/resolvers/yup"
import { Game } from "@ranklab/api"
import * as yup from "yup"
import { SignupPage } from "@/components/SignupPage"
import { useGameDependency } from "@/hooks/useGameDependency"
import mixpanel from "mixpanel-browser"
import { track } from "@/analytics"

interface Props {
  games: Game[]
}

type FormValues = yup.InferType<typeof AccountFieldsSchema>

export const PlayerSignupPage = ({ games }: Props) => {
  const login = useLogin()

  const defaultValues: FormValues = {
    gameId: "",
    name: "",
    email: "",
    password: "",
    skillLevel: 0,
  }

  const form = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(AccountFieldsSchema),
    defaultValues,
  })

  const { control, watch } = form

  const gameIdFormValue = watch("gameId")

  const reviewDemoKey = useGameDependency(
    "text:player-review-demo-key",
    gameIdFormValue
  )

  const createPlayer = async (data: FormValues) => {
    const session = await api.playerAccountCreate({
      createPlayerRequest: {
        name: data.name,
        gameId: data.gameId,
        email: data.email,
        password: data.password,
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
        showPasswordField
      />
    </SignupPage>
  )
}
