import { api } from "@/api"
import { BasicLayout } from "@/components/BasicLayout"
import { AccountFields, AccountFieldsSchema } from "./AccountFields"
import { useForm } from "@/hooks/useForm"
import { useLogin } from "@/hooks/useLogin"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  useTheme,
} from "@mui/material"
import { Game } from "@ranklab/api"
import * as yup from "yup"
import { assetsCdnUrl } from "@/config"
import { useGameDependency } from "@/hooks/useGameDependency"
import { useId } from "react"
import Sticky from "react-stickynode"

interface Props {
  games: Game[]
}

type FormValues = yup.InferType<typeof AccountFieldsSchema>

export const PlayerSignupPage = ({ games }: Props) => {
  const defaultValues: FormValues = {
    email: "",
    password: "",
    gameId: "",
    skillLevel: 0,
    name: "",
  }

  const login = useLogin()
  const theme = useTheme()

  const form = useForm({
    resolver: yupResolver<yup.ObjectSchema<any>>(AccountFieldsSchema),
    defaultValues,
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = form

  const gameId = watch("gameId")
  const id = useId().slice(1, -1)
  const reviewDemoKey = useGameDependency("text:player-review-demo-key", gameId)

  const onSubmit = async (data: FormValues) => {
    const session = await api.playerAccountCreate({
      createPlayerRequest: data,
    })

    await login(session.token)
  }

  return (
    <BasicLayout title="Sign up to Ranklab" maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className={`${id}-form`}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={3}>
                <AccountFields
                  control={control}
                  games={games}
                  watch={watch}
                  showPasswordField
                />
                <LoadingButton
                  color="primary"
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Sign up
                </LoadingButton>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Sticky
                enabled
                top={20}
                innerZ={9999}
                bottomBoundary={`.${id}-form`}
              >
                <Card elevation={4}>
                  <CardHeader
                    title="How does it work?"
                    subheader="This is a short video to help you get started with Ranklab"
                  />
                  <CardContent>
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      key={reviewDemoKey}
                      style={{
                        maxWidth: "100%",
                        objectFit: "cover",
                        borderRadius: theme.shape.borderRadius,
                      }}
                    >
                      <source
                        src={`${assetsCdnUrl}/${reviewDemoKey}`}
                        type="video/mp4"
                      />
                    </video>
                  </CardContent>
                </Card>
              </Sticky>
            </Grid>
          </Grid>
        </Stack>
      </form>
    </BasicLayout>
  )
}
